import { existsSync, promises } from 'fs';
import { join, resolve } from 'path';
import { Condition, Statement, Document, Select } from './ast';
import { $delete, $insert, $table, $update, and } from './builder';
import { Compiler } from './compile';
import { DbContext } from './db-context';
import { ConnectOptions } from './lube';
import { DbContextMetadata, metadataStore } from './metadata';
import {
  ColumnInfo,
  MigrationBuilder,
  MigrationCommand,
  TableInfo,
} from './migrate-builder';
import { generateMigrate } from './migrate-gen';
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

const { readdir, stat, writeFile } = promises;
export interface Migrate {
  up(executor: MigrationBuilder): Promise<void> | void;
  down(executor: MigrationBuilder): Promise<void> | void;
}

export abstract class MigrateScripter {
  constructor(
    // public lube: Lube // public readonly commands: ReadonlyArray<MigrationCommand>
    public compiler: Compiler
  ) {}

  script(commands: ReadonlyArray<MigrationCommand>): string[] {
    const sql: string[] = [];
    for (const command of commands) {
      switch (command.operation) {
        case 'CREATE_TABLE':
          sql.push(this.createTable(command.data));
          break;
        case 'CREATE_INDEX':
          sql.push(this.createIndex(command.data.table, command.data.index));
          break;
        case 'CREATE_SEQUENCE':
          sql.push(
            this.createSequence(
              command.data.name,
              command.data.type,
              command.data.startValue,
              command.data.increment
            )
          );
          break;
        case 'DROP_TABLE':
          sql.push(this.dropTable(command.data.name));
          break;
        case 'DROP_INDEX':
          sql.push(this.dropIndex(command.data.table, command.data.name));
          break;
        case 'DROP_SEQUENCE':
          sql.push(this.dropSequence(command.data.name));
          break;
        case 'ADD_COLUMN':
          sql.push(this.addColumn(command.data.table, command.data.column));
          break;
        case 'ADD_FOREIGN_KEY':
          sql.push(
            this.addForeignKey(command.data.table, command.data.foreignKey)
          );
          break;
        case 'ADD_CHECK_CONSTRAINT':
          sql.push(
            this.addCheckConstraint(
              command.data.table,
              command.data.checkConstraint
            )
          );
          break;
        case 'ADD_UNIEQUE_CONSTRAINT':
          sql.push(
            this.addUniqueConstraint(command.data.table, command.data.uniqueConstraint)
          );
          break;
        case 'ADD_PRIMARY_KEY':
          sql.push(this.addPrimaryKey(command.data.table, command.data.columns, command.data.name))
          break;
        case 'ALTER_COLUMN':
          sql.push(this.alterColumn(command.data.table, command.data.column));
          break;
        case 'DROP_COLUMN':
          sql.push(this.dropColumn(command.data.table, command.data.name));
          break;
        case 'DROP_FOREIGN_KEY':
          sql.push(this.dropForeignKey(command.data.table, command.data.name));
          break;
        case 'DROP_CONSTRAINT':
          sql.push(
            this.dropConstraint(command.data.table, command.data.name)
          );
          break;
        case 'RENAME_TABLE':
          sql.push(this.renameTable(command.data.name, command.data.newName));
          break;
        case 'RENAME_INDEX':
          sql.push(
            this.renameIndex(
              command.data.table,
              command.data.name,
              command.data.newName
            )
          );
          break;
        case 'RENAME_COLUMN':
          sql.push(
            this.renameColumn(
              command.data.table,
              command.data.name,
              command.data.newName
            )
          );
          break;
        case 'INSERT_DATA':
          sql.push(
            this.insertData(
              command.data.table,
              command.data.rows,
              command.data.identityInsertOff
            )
          );
          break;
        case 'UPDATE_DATA':
          sql.push(
            this.updateData(
              command.data.table,
              command.data.rows,
              command.data.keyColumns
            )
          );
          break;
        case 'DELETE_DATA':
          sql.push(this.delelteData(command.data.table, command.data.where));
          break;
        case 'SQL':
          sql.push(this.sql(command.data.sql));
          break;
        case 'ANNOTATION':
          sql.push(this.annotation(command.data.message));
          break;
        case 'CREATE_VIEW':
          sql.push(this.createView(command.data.name, command.data.body));
          break;
        case 'DROP_VIEW':
          sql.push(this.dropView(command.data.name));
          break;
        case 'ALTER_VIEW':
          sql.push(this.alterView(command.data.name, command.data.body));
          break;
        case 'RESTART_SEQUENCE':
          sql.push(this.restartSequence(command.data.name));
          break;
        case 'RENAME_VIEW':
          sql.push(this.renameView(command.data.name, command.data.newName));
          break;
        case 'ALTER_TABLE':
          sql.push(this.alterTable(command.data.name, command.data.comment));
          break;
        default:
          throw new Error(`Unknow command operation.`);
      }
    }
    return sql;
  }
  addPrimaryKey(table: Name<string>, columns: string[], name: string): string {
    throw new Error('Method not implemented.')
  }

  abstract addUniqueConstraint(table: Name<string>, uniqueConstraint: UniqueConstraintSchema): string;

  abstract alterTable(name: Name<string>, comment: string): string;

  abstract renameView(name: Name<string>, newName: string): string;

  abstract restartSequence(name: Name<string>): string;

  sql(sql: Statement | Document | string): string {
    if (typeof sql !== 'string') {
      return this.compiler.compile(sql).sql;
    }
  }

  delelteData(table: Name<string>, where: Condition): string {
    return this.compiler.compile($delete(table).where(where)).sql;
  }

  updateData(
    table: Name<string>,
    rows: Record<string, any>[],
    keyColumns: string[]
  ): string {
    const t = $table(table);
    const position = (row: Record<string, any>): Condition => {
      return and(keyColumns.map(key => t[key].eq(row[key])));
    };
    return rows
      .map(row =>
        this.compiler.compile($update(table).set(row).where(position(row)))
      )
      .join('\n');
  }

  insertData(
    table: Name<string>,
    rows: Record<string, any>[],
    identityInsertOff: boolean
  ): string {
    const sql = $insert(table).values(rows);
    if (identityInsertOff) {
      sql.withIdentity();
    }
    return this.compiler.compile(sql).sql;
  }

  abstract renameColumn(
    table: Name<string>,
    name: string,
    newName: string
  ): string;
  abstract renameIndex(
    table: Name<string>,
    name: string,
    newName: string
  ): string;
  abstract renameTable(name: Name<string>, newName: string): string;
  abstract dropConstraint(table: Name<string>, name: string): string;
  abstract dropForeignKey(table: Name<string>, name: string): string;
  abstract dropColumn(table: Name<string>, name: string): string;

  abstract annotation(message: string): string;

  abstract alterColumn(table: Name<string>, column: ColumnInfo): string;

  abstract addCheckConstraint(
    table: Name<string>,
    checkConstraint: CheckConstraintSchema
  ): string;

  abstract addForeignKey(
    table: Name<string>,
    foreignKey: ForeignKeySchema
  ): string;
  abstract addColumn(table: Name<string>, column: ColumnInfo): string;
  abstract dropSequence(name: Name<string>): string;
  abstract dropIndex(table: Name<string>, name: string): string;
  abstract dropTable(name: Name<string>): string;
  abstract createSequence(
    name: Name<string>,
    type: DbType | string,
    startValue: number,
    increment: number
  ): string;
  abstract createTable(table: TableInfo): string;
  abstract createIndex(table: Name<string>, index: IndexSchema): string;
  abstract createView(
    name: Name<string>,
    body: string | Select,
    comment?: string
  ): string;
  abstract alterView(
    name: Name<string>,
    body?: string | Select,
    comment?: string
  ): string;

  abstract dropView(name: Name<string>): string;
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

  private readonly scripter: MigrateScripter;
  private dbSchema: DatabaseSchema;

  constructor(
    private readonly dbContext: DbContext,
    private migrateDir: string
  ) {
    this.scripter = this.dbContext.lube.provider.scripter;
  }

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
      const sql = this.scripter.createTable({
        name: LUBE_MIGRATE_TABLE_NAME,
        columns: [
          {
            name: 'migrate_id',
            type: '', //DbType.string(128),
            isNullable: false,
            isCalculate: false,
            isIdentity: false,
          },
        ],
        primaryKey: ['migrate_id'],
        comment: 'Lubejs migrate history records.',
      });
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
    const codes = this.genMigrateData(name, [], []);
    await writeFile(join(this.migrateDir, `${id}.ts`), codes);
  }

  private genMigrateData(
    name: string,
    upcodes: string[],
    downcodes: string[]
  ): string {
    return `import { MigrationBuilder, Migrate } from '../../src';

  export class ${name} implements Migrate {
    up(migrate: MigrationBuilder) {
      ${upcodes.join(';\n      ')}
    }

    down(migrate: MigrationBuilder) {
      ${downcodes.join(';\n      ')}
    }
  }

  export default ${name};
    `;
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

    const upDiff = await compare(entityScheam, dbSchema);
    const upCodes = generateMigrate(upDiff);

    const downDiff = await compare(dbSchema, entityScheam);
    const downCodes = generateMigrate(downDiff);

    const codes = this.genMigrateData(name, upCodes, downCodes);

    const timestamp = this.getTimestamp();
    const id = `${timestamp}_${name}`;
    await writeFile(join(this.migrateDir, `${id}.ts`), codes);
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
  }): Promise<string[]> {
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

    const builder = new MigrationBuilder();
    if (isUpgrade) {
      for (let i = sourceIndex + 1; i <= targetIndex; i++) {
        const info = migrates[i];
        builder.annotation(`Migrate up script from "${info.path}"`);
        const Migrate = await importMigrate(info);
        await new Migrate().up(builder);
      }
    }
    if (isDemotion) {
      for (let i = sourceIndex; i > targetIndex; i--) {
        const info = migrates[i];
        builder.annotation(`Migrate down script from "${info.path}"`);
        const Migrate = await importMigrate(info);
        await new Migrate().down(builder);
      }
    }
    const commands = builder.getCommands();
    const scripts = this.scripter.script(commands);
    if (options?.outputPath) {
      await writeFile(options.outputPath, scripts.join('\n'), 'utf-8');
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
