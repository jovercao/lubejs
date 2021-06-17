import { promises } from 'fs';
import { join } from 'path';
import { Condition, Statement, Document, Select } from './ast';
import {
  $delete,
  $insert,
  $table,
  $update,
  and,
} from './builder';
import { Compiler } from './compile';
import { DbContext } from './db-context';
import { DbContextMetadata, metadataStore } from './metadata';
import {
  ColumnInfo,
  MigrationBuilder,
  MigrationCommand,
  TableInfo,
} from './migrate-builder';
// import { MigrationCommand } from "./migrate-builder";
import {
  CheckConstraintSchema,
  DatabaseSchema,
  ForeignKeySchema,
  IndexSchema,
} from './schema';
import { Constructor, DbType, Name } from './types';

const { readdir, stat, writeFile } = promises;
export interface Migrate {
  up(executor: MigrateScripter): Promise<void>;
  down(executor: MigrateScripter): Promise<void>;
}

export abstract class MigrateScripter {
  constructor(
    // public lube: Lube // public readonly commands: ReadonlyArray<MigrationCommand>
    public compiler: Compiler
  ) {}

  script(commands: ReadonlyArray<MigrationCommand>): string {
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
        case 'ALTER_COLUMN':
          sql.push(this.alterColumn(command.data.table, command.data.column));
          break;
        case 'DROP_COLUMN':
          sql.push(this.dropColumn(command.data.table, command.data.name));
          break;
        case 'DROP_FOREIGN_KEY':
          sql.push(this.dropForeignKey(command.data.table, command.data.name));
          break;
        case 'DROP_CHECK_CONSTRAINT':
          sql.push(
            this.dropCheckConstraint(command.data.table, command.data.name)
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
    return sql.join('\n GO \n');
  }

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
  abstract dropCheckConstraint(table: Name<string>, name: string): string;
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

export interface MigrateOptions {
  /**
   * DbContext工厂类
   */
  factory: () => Promise<DbContext>;
  migrateDir: string;
}

interface MigrateInfo {
  index: number;
  name: string;
  timestamp: string;
  path: string;
}

const LUBE_MIGRATE_TABLE_NAME = '__LubeMigrate';
const MIGRATE_FILE_REGX = /^(\d{14})_(\w[\w\d]*).ts$/i;

/**
 * 迁移命令行
 */
export class MigrateCli {
  metadata: DbContextMetadata;

  private readonly scripter: MigrateScripter;
  private dbSchema: DatabaseSchema;
  private dbContext: DbContext;

  constructor(public options: MigrateOptions) {
    this.scripter = this.dbContext.lube.provider.scripter;
  }

  private async init() {
    this.dbContext = await this.options.factory();
    this.metadata = metadataStore.getContext(
      this.dbContext.constructor as Constructor<DbContext>
    );
    this.dbSchema = await this.dbContext.lube.provider.getSchema();
    await this.ensureMigrateTable();
  }

  private async getCurrentMigrate(): Promise<string> {
    const items = await this.dbContext.executor.select(
      LUBE_MIGRATE_TABLE_NAME,
      { offset: 0, limit: 1, sorts: t => [t.field('migrate_id').desc()] }
    );
    return items?.[0]?.migrate_id;
  }

  // private async ensureDatabase(): Promise<void> {

  // }

  // private async ensureSchema(): Promise<void> {

  // }

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

  /**
   * 创建一个空的迁移文件
   * @param name
   */
  async create(name: string): Promise<void> {
    const now = new Date();
    const timestamp = `${now.getFullYear()}${
      now.getMonth() + 1
    }${now.getDate()}${now.getHours()}${now.getMinutes()}${now.getSeconds()}`;
    const id = `${timestamp}_${name}`;
    await writeFile(
      join(this.options.migrateDir, `${id}.ts`),
      `import { MigrationBuilder } from 'lubejs';

export class ${id} {
  up(migrateBuilder: MigrationBuilder) {

  }

  down(migrateBuilder: MigrationBuilder) {

  }
}
`
    );
  }

  /**
   * 将数据库架构与当前架构进行对比，并生成新的迁移文件
   * @param name
   */
  async gen(name: string): Promise<void> {}

  /**
   * 更新到指定迁移
   * 无论是否比指定迁移更新
   * @param name
   */
  async update(name?: string): Promise<void> {
    await this.init();

    const currentId = await this.getCurrentMigrate();
    const sql = await this.script(name, currentId);
    await this.dbContext.executor.query(sql);
  }

  async script(targetName: string, frontName?: string): Promise<string> {
    const migrates = await this.list();
    const targetIndex = migrates.findIndex(item => item.name === targetName);
    const frontIndex = frontName
      ? migrates.findIndex(item => item.name === frontName)
      : migrates.length - 1;
    const isUpgrade = targetIndex > frontIndex;
    const isDemotion = targetIndex < frontIndex;

    const builder = new MigrationBuilder();
    if (isUpgrade) {
      for (let i = frontIndex; i < targetIndex; i++) {
        const info = migrates[i];
        builder.annotation(`Migrate up script from "${info.path}"`);
        const { [`${info.timestamp}_${info.name}`]: migrate } = await import(
          info.path
        );
        migrate.up(builder);
      }
    }
    if (isDemotion) {
      for (let i = frontIndex; i < targetIndex; i++) {
        const info = migrates[i];
        builder.annotation(`Migrate down script from "${info.path}"`);
        const { [`${info.timestamp}_${info.name}`]: migrate } = await import(
          info.path
        );
        migrate.down(builder);
      }
    }
    const commands = builder.getCommands();
    return this.scripter.script(commands);
  }

  /**
   * 列出当前所有迁移
   */
  async list(): Promise<MigrateInfo[]> {
    const results: MigrateInfo[] = [];
    const items = await readdir(this.options.migrateDir);
    for (const item of items.sort()) {
      const path = join(this.options.migrateDir, item);
      const match = MIGRATE_FILE_REGX.exec(item);
      if (match && (await stat(path)).isFile()) {
        results.push({
          timestamp: match[1],
          name: match[2],
          path,
          index: results.length - 1,
        });
      }
    }
    return results;
  }
}
