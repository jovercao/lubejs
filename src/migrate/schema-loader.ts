import { Connection, ObjectName } from '../core';
import {
  CheckConstraintSchema,
  ColumnSchema,
  DatabaseSchema,
  ForeignKeySchema,
  FunctionSchema,
  IndexSchema,
  PrimaryKeySchema,
  ProcedureSchema,
  SequenceSchema,
  TableSchema,
  ViewSchema,
} from './schema';

/**
 * 数据架构加载器
 */
export abstract class SchemaLoader {
  constructor(public connection: Connection) {}

  /**
   * 获取'指定数据库'及'指定架构（可选）'下的所有表名称列表
   */
  abstract getTableNames(
    database: string,
    schema?: string
  ): Promise<Required<ObjectName>[]>;

  /**
   * 获取'指定数据库'及'指定架构（可选）'下的所有表结构
   */
  abstract getTables(database: string, schema?: string): Promise<TableSchema[]>;
  /**
   * 获取表结构
   */
  abstract getTable(
    databse: string,
    schema: string,
    name: string
  ): Promise<TableSchema>;

  abstract getViewNames(
    database: string,
    schema: string
  ): Promise<Required<ObjectName>[]>;
  abstract getViews(database: string, schema: string): Promise<ViewSchema[]>;
  abstract getView(
    databse: string,
    schema: string,
    name: string
  ): Promise<ViewSchema>;

  /**
   * 获取检查约束结构
   */
  abstract getCheckConstraints(
    databse: string,
    schema: string,
    table: string
  ): Promise<CheckConstraintSchema[]>;

  /**
   * 获取检查约束结构
   */
  abstract getCheckConstraint(
    database: string,
    schema: string,
    table: string,
    constraint: string
  ): Promise<CheckConstraintSchema>;

  /**
   * 获取表下的所有列结构
   */
  abstract getColumns(
    database: string,
    schema: string,
    table: string
  ): Promise<ColumnSchema[]>;
  /**
   * 获取列结构
   */
  abstract getColumn(
    databse: string,
    schema: string,
    table: string,
    column: string
  ): Promise<ColumnSchema>;

  /**
   * 获取表下的所有索引结构列表
   */
  abstract getIndexes(
    database: string,
    schema: string,
    table: string
  ): Promise<IndexSchema[]>;
  /**
   * 获取索引结构
   */
  abstract getIndex(
    databse: string,
    schema: string,
    table: string,
    name: string
  ): Promise<IndexSchema>;

  /**
   * 获取表下的所有外键结构列表
   */
  abstract getForeignKeys(
    databse: string,
    schema: string,
    table: string
  ): Promise<ForeignKeySchema[]>;

  /**
   * 获取外键结构
   */
  abstract getForeignKey(
    databse: string,
    schema: string,
    table: string,
    fk: string
  ): Promise<ForeignKeySchema>;

  /**
   * 获取引用指定表所有外键结构列表
   */
  abstract getReferenceKeys(
    databse: string,
    schema: string,
    table: string
  ): Promise<ForeignKeySchema[]>;

  /**
   * 获取主键结构
   */
  abstract getPrimaryKey(
    databse: string,
    schema: string,
    table: string
  ): Promise<PrimaryKeySchema>;

  /**
   * 获取数据库架构列表
   */
  abstract getSchemaNames(database: string): Promise<string[]>;

  /**
   * 获取指定数据库，指定架构（可选）下的所有函数列表
   */
  abstract getFunctionNames(
    database: string,
    schema?: string
  ): Promise<Required<ObjectName>[]>;

  /**
   * 获取指定数据库，指定架构（可选）下的所有函数列表
   */
  abstract getFunctions(
    database: string,
    schema?: string
  ): Promise<FunctionSchema[]>;

  /**
   * 获取函数架构
   */
  abstract getFunctionSchema(
    databse: string,
    schema: string,
    fn: string
  ): Promise<FunctionSchema>;

  /**
   * 获取存储过程名称列表
   */
  abstract getProcedureNames(
    database: string,
    schema?: string
  ): Promise<Required<ObjectName>[]>;
  /**
   * 获取存储过程结构列表
   */
  abstract getProcedures(
    database: string,
    schema?: string
  ): Promise<ProcedureSchema[]>;
  /**
   * 获取存储过程结构
   */
  abstract getProcedure(
    databse: string,
    schema: string,
    proc: string
  ): Promise<ProcedureSchema>;

  /**
   * 获取序列结构列表
   */
  abstract getSequences(
    database: string,
    schema?: string
  ): Promise<SequenceSchema[]>;

  /**
   * 获取序列结构
   */
  abstract getSequence(
    database: string,
    schema: string,
    name: string
  ): Promise<SequenceSchema>;

  /**
   * 获取所有数据库名称列表
   */
  abstract getDatabaseNames(): Promise<string[]>;
  /**
   * 获取数据库结构
   */
  abstract getDatabaseSchema(name: string): Promise<DatabaseSchema>;
}
