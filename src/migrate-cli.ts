import { existsSync, promises } from 'fs';
import { join, resolve } from 'path';
import {
  Condition,
  Statement,
  Document,
  Select,
  SqlBuilder,
  SqlBuilder as SQL,
} from './ast';
import { Compiler } from './compile';
import { DbContext } from './db-context';
import { ConnectOptions } from './lube';
import { DbContextMetadata, metadataStore } from './metadata';
import { generateMigrate, genMigrate, genMigrateClass } from './migrate-gen';
// import { MigrationCommand } from "./migrate-builder";
import {
  CheckConstraintSchema,
  DatabaseSchema,
  ForeignKeySchema,
  generate,
  IndexSchema,
  UniqueConstraintSchema,
} from './schema';
import { compare } from './schema-compare';
import { Constructor, DbType, Name } from './types';
import { Command, Executor } from './execute';
import { isStatement, outputCommand } from './util';

const { readdir, stat, writeFile } = promises;
export interface Migrate {
  up(scripter: SqlBuilder, dialect: string | symbol): Promise<void> | void;
  down(scripter: SqlBuilder, dialect: string | symbol): Promise<void> | void;
}

export interface LubeConfig {
  default: string;
  contexts: {
    [key: string]: () => Promise<DbContext>;
  };
  migrateDir: string;
}

interface MigrateInfo {
  id: string;
  name: string;
  timestamp: string;
  path: string;
  index: number;
}

const LUBE_MIGRATE_TABLE_NAME = '__LubeMigrate';
const MIGRATE_FILE_REGX = /^(\d{14})_(\w[\w_\d]*)(\.ts|\.js)$/i;

function makeScripter(statements: Statement[]): SqlBuilder {
  return new Proxy(SQL, {
    get(target, key: string) {
      const val = Reflect.get(target, key);
      if (typeof val === 'function') {
        return function (...args: any) {
          const ret = val.call(target, ...args);
          if (isStatement(ret)) {
            statements.push(ret);
          }
          return ret;
        };
      }
      return val;
    },
  });
}

/**
 * 迁移命令行
 */
export class MigrateCli {
  metadata: DbContextMetadata;

  // private readonly scripter: MigrateScripter;
  private dbSchema: DatabaseSchema;

  private up(Ctr: Constructor<Migrate>): Statement[] {
    const instance = new Ctr();
    const statements: Statement[] = [];
    const scripter = makeScripter(statements);
    instance.up(scripter, this.dbContext.lube.provider.dialect);
    return statements;
  }

  private down(Ctr: Constructor<Migrate>): Statement[] {
    const instance = new Ctr();
    const statements: Statement[] = [];
    const scripter = makeScripter(statements);

    instance.down(scripter, this.dbContext.lube.provider.dialect);
    return statements;
  }

  constructor(
    private readonly dbContext: DbContext,
    private migrateDir: string
  ) { }

  async dispose(): Promise<void> {
    await this.dbContext.lube.close();
  }

  private async init() {
    this.metadata = metadataStore.getContext(
      this.dbContext.constructor as Constructor<DbContext>
    );
    this.dbSchema = await this.dbContext.lube.provider.getSchema();
    await this.ensureMigrateTable();
  }

  private async loadSchema() {
    return await this.dbContext.lube.provider.getSchema();
  }

  private async getCurrentMigrate(): Promise<MigrateInfo> {
    try {
      const items = await this.dbContext.executor.select(
        LUBE_MIGRATE_TABLE_NAME,
        { offset: 0, limit: 1, sorts: t => [t.field('migrate_id').desc()] }
      );
      const id = items?.[0]?.migrate_id;
      return await this.getMigrate(id);
    } catch {
      return null;
    }
  }

  private async getLastMigrate(): Promise<MigrateInfo> {
    const items = await this._list();
    return items[items.length - 1];
  }

  private async ensureDatabase(): Promise<void> { }

  private async ensureSchema(): Promise<void> { }

  private async ensureMigrateTable(): Promise<void> {
    if (!this.dbSchema.tables.find(t => t.name === LUBE_MIGRATE_TABLE_NAME)) {
      const sql = SQL.createTable(LUBE_MIGRATE_TABLE_NAME).as(builder => [
        builder.column('migrate_id', DbType.string(100)).primaryKey(),
      ]);
      await this.dbContext.executor.query(sql);
    }
  }

  getTimestamp(): string {
    const now = new Date();
    const timestamp = now.getFullYear().toString().padStart(4, '0') + (
      now.getMonth() + 1
    )
      .toString()
      .padStart(2, '0') + now.getDate().toString().padStart(2, '0') + now
        .getHours()
        .toString()
        .padStart(2, '0') + now.getMinutes().toString().padStart(2, '0') + now
          .getSeconds()
          .toString()
          .padStart(2, '0');
    return timestamp;
  }

  /**
   * 创建一个空的迁移文件
   * @param name
   */
  async create(name: string): Promise<void> {
    if (!existsSync(this.migrateDir)) {
      await promises.mkdir(this.migrateDir);
    }
    const exists = await this.findMigrate(name);
    if (exists) {
      throw new Error(`迁移文件${name}已经存在：${exists.path}`);
    }
    const timestamp = this.getTimestamp();

    const id = `${timestamp}_${name}`;
    const codes = genMigrateClass(name);
    await writeFile(join(this.migrateDir, `${id}.ts`), codes);
  }

  /**
   * 将数据库架构与当前架构进行对比，并生成新的迁移文件
   * @param name
   */
  async gen(name: string): Promise<void> {
    const metadata = metadataStore.getContext(
      this.dbContext.constructor as Constructor<DbContext>
    );
    const dbSchema = await this.loadSchema();
    const entityScheam = generate(this.dbContext.executor.compiler, metadata);

    const code = genMigrate(name, entityScheam, dbSchema, metadata);

    const timestamp = this.getTimestamp();
    const id = `${timestamp}_${name}`;

    await writeFile(join(this.migrateDir, `${id}.ts`), code);
  }

  async findMigrate(name: string): Promise<MigrateInfo> {
    const items = await this._list();
    const item = items.find(
      item => item.name === name || item.id === name || item.timestamp === name
    );
    return item;
  }

  async getMigrate(name: string): Promise<MigrateInfo> {
    const items = await this._list();
    const item = items.find(
      item => item.name === name || item.id === name || item.timestamp === name
    );
    if (!item) {
      throw new Error(`找不到指定的迁移${name}`);
    }
    return item;
  }

  /**
   * 更新到指定迁移
   * 无论是否比指定迁移更新
   * @param name
   */
  async update(name?: string): Promise<void> {
    await this.init();

    const target = await this.getMigrate(name);

    const source = await this.getCurrentMigrate();
    const scripts = await this._script({
      target: name,
      source: source?.name,
    });
    await this.dbContext.trans(async instance => {
      for (const cmd of scripts) {
        // try {
        outputCommand(cmd);
        await instance.executor.query(cmd);
        console.info(`----------------------------------------------------`);
        // } catch (error) {
        //   console.error(`${error.message}`.red)
        //   throw error;
        // }
      }
      await this.ensureMigrateTable();
      await this.dbContext.executor.query(
        SQL.delete(LUBE_MIGRATE_TABLE_NAME)
      )
      await this.dbContext.executor.query(
        SQL.insert(LUBE_MIGRATE_TABLE_NAME).values([target.id])
      );
    });
    console.info(`------------执行成功，已更新到${target.id}.----------------`);
  }

  async _script(options: {
    target?: string;
    source?: string;
    outputPath?: string;
  }): Promise<Command[]> {
    let target: MigrateInfo;
    if (!options?.target) {
      target = await this.getLastMigrate();
    } else {
      target = await this.getMigrate(options.target);
    }
    const migrates = await this._list();
    let source: MigrateInfo;
    if (!source) {
      source = await this.getCurrentMigrate();
    } else {
      source = await this.getMigrate(options?.source);
    }
    const sourceIndex = source?.index ?? -1;
    const targetIndex = target?.index ?? -1;

    if (sourceIndex === targetIndex) {
      console.log(`未找到可供生成的的脚本。`);
      return [];
    }
    const isUpgrade = targetIndex > sourceIndex;
    const isDemotion = targetIndex < sourceIndex;

    const statements: Statement[] = [];
    if (isUpgrade) {
      for (let i = sourceIndex + 1; i <= targetIndex; i++) {
        const info = migrates[i];
        statements.push(
          SQL.annotation(`Migrate up script from "${info.path}"`)
        );
        const Migrate = await importMigrate(info);
        statements.push(...this.up(Migrate));
      }
    }
    if (isDemotion) {
      for (let i = sourceIndex; i > targetIndex; i--) {
        const info = migrates[i];
        statements.push(
          SQL.annotation(`Migrate down script from "${info.path}"`)
        );
        const Migrate = await importMigrate(info);
        statements.push(...this.down(Migrate));
      }
    }
    const scripts = statements.map(statement =>
      this.dbContext.lube.compiler.compile(statement)
    );
    // const { sql: scripts } = this.dbContext.lube.compiler.compile(
    //   SQL.doc(statements)
    // );
    return scripts;
  }

  async script(options: {
    target?: string;
    source?: string;
    outputPath?: string;
  }): Promise<void> {
    const scripts = await this._script(options);
    if (options?.outputPath) {
      await writeFile(
        options.outputPath,
        scripts.map(cmd => cmd.sql).join('\n'),
        'utf-8'
      );
    }
  }

  private _migrateList: MigrateInfo[];

  /**
   * 列出当前所有迁移
   */
  private async _list(): Promise<MigrateInfo[]> {
    if (this._migrateList) return this._migrateList;

    const results: MigrateInfo[] = [];
    if (!existsSync(this.migrateDir)) {
      return [];
    }
    const items = await readdir(this.migrateDir);
    for (const item of items.sort()) {
      const path = join(this.migrateDir, item);
      const match = MIGRATE_FILE_REGX.exec(item);
      if (match && (await stat(path)).isFile()) {
        results.push({
          id: `${match[1]}_${match[2]}`,
          timestamp: match[1],
          name: match[2],
          path: resolve(process.cwd(), path),
          index: 0,
        });
      }
    }
    this._migrateList = results.sort((a, b) =>
      a.timestamp.localeCompare(b.timestamp)
    );
    this._migrateList.forEach((item, index) => (item.index = index));
    return this._migrateList;
  }

  async list(): Promise<void> {
    const list = await this._list();
    console.table(list, ['name', 'timestamp', 'path']);
  }
}

async function importMigrate(info: MigrateInfo): Promise<Constructor<Migrate>> {
  const imported = await import(info.path);
  const migrate = imported?.default || imported?.[info.name] || imported;
  if (!migrate)
    throw new Error(`Migrate 文件 ${info.path} ，无法找到迁移实例类。`);
  return migrate;
}
