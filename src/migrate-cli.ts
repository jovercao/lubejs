import { existsSync, promises } from 'fs';
import { dirname, join, resolve } from 'path';
import { Statement, SqlBuilder, SqlBuilder as SQL } from './ast';
import { DbContext } from './db-context';
import { DbContextMetadata, metadataStore } from './metadata';
import {
  generateMigrate as generateMigrate,
  generateMigrateClass,
} from './migrate-gen';
import { DatabaseSchema, generate as generateSchema } from './schema';
import { Constructor, DbType } from './types';
import { Command } from './execute';
import { isRaw, isStatement, outputCommand } from './util';
import { MigrateBuilder } from './migrate-builder';
import { mkdir } from 'fs/promises';

const { readdir, stat, writeFile } = promises;
export interface Migrate {
  up(builder: MigrateBuilder, dialect: string | symbol): Promise<void> | void;
  down(builder: MigrateBuilder, dialect: string | symbol): Promise<void> | void;
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

export const LUBE_MIGRATE_TABLE_NAME = '__LubeMigrate';
const MIGRATE_FILE_REGX = /^(\d{14})_(\w[\w_\d]*)(\.ts|\.js)$/i;

function makeMigrateBuilder(
  builder: MigrateBuilder,
  statements: Statement[]
): MigrateBuilder {
  return new Proxy(builder, {
    get(target, key: string) {
      const val = Reflect.get(target, key);
      if (typeof val === 'function') {
        return function (...args: any) {
          const ret = val.call(target, ...args);
          if (ret instanceof Promise) {
            return ret.then(statement => {
              if (isStatement(statement)) {
                statements.push(statement);
              }
            });
          } else if (isStatement(ret) || isRaw(ret)) {
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

  private async up(Ctr: Constructor<Migrate>): Promise<Statement[]> {
    const instance = new Ctr();
    const statements: Statement[] = [];
    const builder = makeMigrateBuilder(
      this.dbContext.lube.provider.migrateBuilder,
      statements
    );
    await instance.up(builder, this.dbContext.lube.provider.dialect);
    return statements;
  }

  private async down(Ctr: Constructor<Migrate>): Promise<Statement[]> {
    const instance = new Ctr();
    const statements: Statement[] = [];
    const scripter = makeMigrateBuilder(
      this.dbContext.lube.provider.migrateBuilder,
      statements
    );

    await instance.down(scripter, this.dbContext.lube.provider.dialect);
    return statements;
  }

  constructor(
    private readonly dbContext: DbContext,
    private migrateDir: string
  ) {}

  async dispose(): Promise<void> {
    await this.dbContext.lube.close();
  }

  private async init() {
    this.metadata = metadataStore.getContext(
      this.dbContext.constructor as Constructor<DbContext>
    );
    // this.dbSchema = await this.dbContext.lube.provider.getSchema();
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

  private async ensureDatabase(): Promise<void> {}

  private async ensureSchema(): Promise<void> {}

  // private async ensureMigrateTable(): Promise<void> {
  //   if (!this.dbSchema.tables.find(t => t.name === LUBE_MIGRATE_TABLE_NAME)) {
  //     const sql = SQL.createTable(LUBE_MIGRATE_TABLE_NAME).as(builder => [
  //       builder.column('migrate_id', DbType.string(100)).primaryKey(),
  //     ]);
  //     await this.dbContext.executor.query(sql);
  //   }
  // }

  getTimestamp(): string {
    const now = new Date();
    const timestamp =
      now.getFullYear().toString().padStart(4, '0') +
      (now.getMonth() + 1).toString().padStart(2, '0') +
      now.getDate().toString().padStart(2, '0') +
      now.getHours().toString().padStart(2, '0') +
      now.getMinutes().toString().padStart(2, '0') +
      now.getSeconds().toString().padStart(2, '0');
    return timestamp;
  }

  /**
   * 创建一个空的迁移文件
   * @param name
   */
  async create(name: string): Promise<void> {
    const exists = await this.findMigrate(name);
    if (exists) {
      throw new Error(`迁移文件${name}已经存在：${exists.path}`);
    }
    const timestamp = this.getTimestamp();

    const id = `${timestamp}_${name}`;
    const codes = generateMigrateClass(name);
    if (!existsSync(this.migrateDir)) {
      await promises.mkdir(this.migrateDir);
    }
    await writeFile(join(this.migrateDir, `${id}.ts`), codes);
  }

  /**
   * 将数据库架构与当前架构进行对比，并生成新的迁移文件
   * @param name
   */
  async gen(name: string, notResolverType = false): Promise<void> {
    const exists = await this.findMigrate(name);
    if (exists) {
      throw new Error(`迁移文件${name}已经存在：${exists.path}`);
    }
    const metadata = metadataStore.getContext(
      this.dbContext.constructor as Constructor<DbContext>
    );
    const dbSchema = await this.loadSchema();
    const entityScheam = generateSchema(
      this.dbContext.executor.compiler,
      metadata
    );
    const code = generateMigrate(
      name,
      entityScheam,
      dbSchema,
      metadata,
      notResolverType
        ? undefined
        : this.dbContext.lube.provider.compiler.parseRawType
    );

    const timestamp = this.getTimestamp();
    const id = `${timestamp}_${name}`;
    const filePath = resolve(join(this.migrateDir, `${id}.ts`));
    await writeFile(filePath, code);
    console.log(`Generate migrate file successed, output to ${filePath}`.green);
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
        statements.push(SQL.note(`Migrate up script from "${info.path}"`));
        const Migrate = await importMigrate(info);
        const codes = await this.up(Migrate);
        statements.push(...codes);
      }
    }
    if (isDemotion) {
      for (let i = sourceIndex; i > targetIndex; i--) {
        const info = migrates[i];
        statements.push(SQL.note(`Migrate down script from "${info.path}"`));
        const Migrate = await importMigrate(info);
        const codes = await this.down(Migrate);
        statements.push(...codes);
      }
    }
    // 创建表
    if (sourceIndex < 0) {
      statements.push(
        SQL.createTable(LUBE_MIGRATE_TABLE_NAME).as(builder => [
          builder.column('migrate_id', DbType.string(100)).primaryKey(),
        ])
      );
    }
    statements.push(SQL.delete(LUBE_MIGRATE_TABLE_NAME));
    statements.push(SQL.insert(LUBE_MIGRATE_TABLE_NAME).values([target.id]));
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
      const filePath = resolve(options.outputPath);
      const dir = dirname(filePath);
      if (!existsSync(dir)) {
        await mkdir(dir);
      }
      await writeFile(
        options.outputPath,
        scripts.map(cmd => cmd.sql).join('\nGO\n'),
        'utf-8'
      );
      console.log(`Generate scripts successed, output to ${filePath}`);
    } else {
      console.log(scripts.map(cmd => cmd.sql).join('\nGO\n'));
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
