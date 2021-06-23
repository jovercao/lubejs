import { existsSync, promises } from 'fs';
import { join, resolve } from 'path';
import {
  Condition,
  Statement,
  Document,
  Select,
} from './ast';
import { sqlBuilder, $delete, $insert, $table, $update, and, doc, SqlBuilder } from './sql-builder';
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
import { Executor } from './execute';

const { readdir, stat, writeFile } = promises;
export interface Migrate {
  up(
    run: (statement: Statement | string) => void,
    scripter: SqlBuilder,
    dialect: string | symbol
  ): Promise<void> | void;
  down(
    run: (statement: Statement | string) => void,
    scripter: SqlBuilder,
    dialect: string | symbol
  ): Promise<void> | void;
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
}

const LUBE_MIGRATE_TABLE_NAME = '__LubeMigrate';
const MIGRATE_FILE_REGX = /^(\d{14})_(\w[\w_\d]*)(\.ts|\.js)$/i;

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
    const run = (statement: Statement | string): void => {
      if (typeof statement === 'string') {
        statements.push(sqlBuilder.raw(statement));
      } else {
        statements.push(statement);
      }
    };

    instance.up(run, sqlBuilder, this.dbContext.lube.provider.dialect);
    return statements;
  }

  private down(Ctr: Constructor<Migrate>): Statement[] {
    const instance = new Ctr();
    const statements: Statement[] = [];
    const run = (statement: Statement | string): void => {
      if (typeof statement === 'string') {
        statements.push(sqlBuilder.raw(statement));
      } else {
        statements.push(statement);
      }
    };

    instance.down(run, sqlBuilder, this.dbContext.lube.provider.dialect);
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
    this.dbSchema = await this.dbContext.lube.provider.getSchema();
    await this.ensureMigrateTable();
  }

  private async loadSchema() {
    return await this.dbContext.lube.provider.getSchema();
  }

  private async getCurrentMigrate(): Promise<string> {
    try {
      const items = await this.dbContext.executor.select(
        LUBE_MIGRATE_TABLE_NAME,
        { offset: 0, limit: 1, sorts: t => [t.field('migrate_id').desc()] }
      );
      return items?.[0]?.migrate_id;
    } catch {
      return null;
    }
  }

  private async getLastMigrate(): Promise<MigrateInfo> {
    const items = await this.list();
    return items[items.length - 1];
  }

  private async ensureDatabase(): Promise<void> {}

  private async ensureSchema(): Promise<void> {}

  private async ensureMigrateTable(): Promise<void> {
    if (!this.dbSchema.tables.find(t => t.name === LUBE_MIGRATE_TABLE_NAME)) {
      const sql = sqlBuilder
        .createTable(LUBE_MIGRATE_TABLE_NAME)
        .as(builder => [
          builder.column('migrate_id', DbType.string(100)).primaryKey(),
        ]);
      await this.dbContext.executor.query(sql);
    }
  }

  getTimestamp(): string {
    const now = new Date();
    const timestamp = `${now.getFullYear()}${(now.getMonth() + 1)
      .toString()
      .padStart(2, '0')}${now.getDate().toString().padStart(2, '0')}${now
      .getHours()
      .toString()
      .padStart(2, '0')}${now.getMinutes().toString().padStart(2, '0')}${now
      .getSeconds()
      .toString()
      .padStart(2, '0')}`;
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
    console.log(1);
    const metadata = metadataStore.getContext(
      this.dbContext.constructor as Constructor<DbContext>
    );
    console.log(2);
    const dbSchema = await this.loadSchema();
    console.log(3);
    const entityScheam = generate(this.dbContext.executor.compiler, metadata);

    const code = genMigrate(name, dbSchema, entityScheam);

    const timestamp = this.getTimestamp();
    const id = `${timestamp}_${name}`;
    await writeFile(join(this.migrateDir, `${id}.ts`), code);
  }

  /**
   * 更新到指定迁移
   * 无论是否比指定迁移更新
   * @param name
   */
  async update(name?: string): Promise<void> {
    await this.init();

    const currentId = await this.getCurrentMigrate();
    const scripts = await this.script({
      target: name,
      source: currentId,
    });
    await this.dbContext.trans(async instance => {
      for (const sql of scripts) {
        await instance.executor.query(sql);
      }
    });
  }

  async script(options: {
    target?: string;
    source?: string;
    outputPath?: string;
  }): Promise<string> {
    let target = options?.target;
    if (!target) {
      target = (await this.getLastMigrate()).name;
    }
    const migrates = await this.list();
    const targetIndex = migrates.findIndex(
      item =>
        item.id === target || item.name === target || item.timestamp === target
    );
    if (targetIndex === -1) {
      throw new Error(`未找到目标${target}的迁移信息。`);
    }
    let source = options?.source;
    if (!source) {
      source = await this.getCurrentMigrate();
    }
    let sourceIndex: number;
    if (source) {
      sourceIndex = migrates.findIndex(
        item =>
          item.id === source ||
          item.name === source ||
          item.timestamp === source
      );
      if (sourceIndex === -1) {
        throw new Error(`未找到源${source}的迁移信息。`);
      }
    } else {
      sourceIndex = -1;
    }
    if (sourceIndex === targetIndex) {
      throw new Error(`源和目标一致，无法生成脚本。`);
    }
    const isUpgrade = targetIndex > sourceIndex;
    const isDemotion = targetIndex < sourceIndex;

    const statements: Statement[] = [];
    if (isUpgrade) {
      for (let i = sourceIndex + 1; i <= targetIndex; i++) {
        const info = migrates[i];
        statements.push(
          sqlBuilder.annotation(`Migrate up script from "${info.path}"`)
        );
        const Migrate = await importMigrate(info);
        statements.push(...this.up(Migrate));
      }
    }
    if (isDemotion) {
      for (let i = sourceIndex; i > targetIndex; i--) {
        const info = migrates[i];
        statements.push(
          sqlBuilder.annotation(`Migrate down script from "${info.path}"`)
        );
        const Migrate = await importMigrate(info);
        statements.push(...this.down(Migrate));
      }
    }
    const { sql: scripts } = this.dbContext.lube.compiler.compile(
      doc(statements)
    );
    if (options?.outputPath) {
      await writeFile(options.outputPath, scripts, 'utf-8');
    }
    return scripts;
  }

  /**
   * 列出当前所有迁移
   */
  async list(): Promise<MigrateInfo[]> {
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
        });
      }
    }
    return results.sort((a, b) => a.timestamp.localeCompare(b.timestamp));
  }
}

async function importMigrate(info: MigrateInfo): Promise<Constructor<Migrate>> {
  const imported = await import(info.path);
  const migrate = imported?.default || imported?.[info.name] || imported;
  if (!migrate)
    throw new Error(`Migrate 文件 ${info.path} ，无法找到迁移实例类。`);
  return migrate;
}
