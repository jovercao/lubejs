import { Condition, Statement, Document } from "./ast";
import { DbContext } from "./db-context";
import { ConnectOptions, Driver, Lube } from "./lube";
import { DbContextMetadata, metadataStore } from './metadata'
// import { MigrationCommand } from "./migrate-builder";
import {
  CheckConstraintSchema,
  ColumnSchema,
  ForeignKeySchema,
  IndexSchema,
  SequenceSchema,
  TableSchema,
} from "./schema";
import { Constructor, Name } from "./types";

export interface Migrate {
  up(executor: MigrateScripter): Promise<void>;
  down(executor: MigrateScripter): Promise<void>;
}

export abstract class MigrateScripter {
  constructor(
    public lube: Lube
  ) // public readonly commands: ReadonlyArray<MigrationCommand>
  {}

  // async run(): Promise<void> {
  //   for (const command of this.commands) {
  //     switch (command.operation) {
  //       case "CREATE_TABLE":
  //         await this.createTable(command.data.table);
  //         break;
  //       case "CREATE_INDEX":
  //         await this.createIndex(command.data.table, command.data.index);
  //         break;
  //       case "CREATE_SEQUENCE":
  //         await this.createSequence(command.data.sequence);
  //         break;
  //       case "DROP_TABLE":
  //         await this.dropTable(command.data.name);
  //         break;
  //       case "DROP_INDEX":
  //         await this.dropIndex(command.data.table, command.data.name);
  //         break;
  //       case "DROP_SEQUENCE":
  //         await this.dropSequence(command.data.name);
  //         break;
  //       case "ADD_COLUMN":
  //         await this.addColumn(command.data.table, command.data.column);
  //         break;
  //       case "ADD_FOREIGN_KEY":
  //         await this.addForeignKey(command.data.table, command.data.foreignKey);
  //         break;
  //       case "ADD_CHECK_CONSTRAINT":
  //         await this.addCheckConstraint(
  //           command.data.table,
  //           command.data.checkConstraint
  //         );
  //         break;
  //       case "ALTER_COLUMN":
  //         await this.alertColumn(command.data.table, command.data.column);
  //         break;
  //       case "DROP_COLUMN":
  //         await this.dropColumn(command.data.table, command.data.name);
  //         break;
  //       case "DROP_FOREIGN_KEY":
  //         await this.dropForeignKey(command.data.table, command.data.name);
  //         break;
  //       case "DROP_CHECK_CONSTRAINT":
  //         await this.dropCheckConstraint(command.data.table, command.data.name);
  //         break;
  //       case "RENAME_TABLE":
  //         await this.renameTable(command.data.name, command.data.newName);
  //         break;
  //       case "RENAME_INDEX":
  //         await this.renameIndex(
  //           command.data.table,
  //           command.data.name,
  //           command.data.newName
  //         );
  //         break;
  //       case "RENAME_COLUMN":
  //         await this.renameColumn(
  //           command.data.table,
  //           command.data.name,
  //           command.data.newName
  //         );
  //         break;
  //       case "INSERT_DATA":
  //         await this.insertData(
  //           command.data.table,
  //           command.data.rows,
  //           command.data.identityInsertOff
  //         );
  //         break;
  //       case "UPDATE_DATA":
  //         await this.updateData(
  //           command.data.table,
  //           command.data.rows,
  //           command.data.keyColumns
  //         );
  //         break;
  //       case "DELETE_DATA":
  //         await this.delelteData(command.data.table, command.data.where);
  //         break;
  //       case "SQL":
  //         await this.lube.query<any>(command.data.sql);
  //         break;
  //     }
  //   }
  // }

  async scriptify(sql: Statement | Document | string): Promise<void> {
    await this.lube.query<any>(sql);
  }

  async delelteData(table: Name<string>, where: Condition): Promise<void> {
    this.lube.delete(table, where);
  }

  updateData(
    table: Name<string>,
    rows: Record<string, any>[],
    keyColumns: string[]
  ) {
    throw new Error("Method not implemented.");
  }
  insertData(
    table: Name<string>,
    rows: Record<string, any>[],
    identityInsertOff: boolean
  ) {
    throw new Error("Method not implemented.");
  }

  abstract renameColumn(
    table: Name<string>,
    name: string,
    newName: string
  ): Promise<void>;
  abstract renameIndex(
    table: Name<string>,
    name: string,
    newName: string
  ): Promise<void>;
  abstract renameTable(
    name: Name<string>,
    newName: Name<string>
  ): Promise<void>;
  abstract dropCheckConstraint(
    table: Name<string>,
    name: string
  ): Promise<void>;
  abstract dropForeignKey(table: Name<string>, name: string): Promise<void>;
  abstract dropColumn(table: Name<string>, name: string): Promise<void>;
  abstract alertColumn(
    table: Name<string>,
    column: Partial<ColumnSchema>
  ): Promise<void>;

  abstract addCheckConstraint(
    table: Name<string>,
    checkConstraint: CheckConstraintSchema
  ): Promise<void>;

  abstract addForeignKey(
    table: Name<string>,
    foreignKey: ForeignKeySchema
  ): Promise<void>;
  abstract addColumn(table: Name<string>, column: ColumnSchema): Promise<void>;
  abstract dropSequence(name: Name<string>): Promise<void>;
  abstract dropIndex(table: Name<string>, name: string): Promise<void>;
  abstract dropTable(name: Name<string>): Promise<void>;
  abstract createSequence(sequence: SequenceSchema): Promise<void>;
  abstract createTable(table: TableSchema): Promise<void>;
  abstract createIndex(table: Name<string>, index: IndexSchema): Promise<void>;
}

export interface MigrateOptions {
  /**
   * DbContext工厂类
   */
  factory: () => Promise<DbContext>;
}

/**
 * 迁移命令行
 */
export class MigrateCli {
  metadata: DbContextMetadata;

  constructor(private dbContext: DbContext) {
    this.metadata = metadataStore.getContext(dbContext.constructor as Constructor<DbContext>);
  }

  /**
   * 创建一个空的迁移文件
   * @param name
   */
  async create(name: string): Promise<void> {}

  /**
   * 与数据库进行对比，并生成新的迁移文件
   * @param name
   */
  async gen(name: string): Promise<void> {}

  /**
   * 更新到指定迁移
   * 无论是否比指定迁移更新
   * @param name
   */
  async update(name?: string): Promise<void> {}

  /**
   * 列出当前所有迁移
   */
  async list(): Promise<void> {}
}
