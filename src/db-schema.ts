/* eslint-disable @typescript-eslint/ban-types */

/*********************************
 * [元数据生成顺序]
 * code first:
 * 装饰器(Constructor) => Model => Schema
 * db first:
 * SchemaReader => Schema => Model
 *
 * 推荐使用code first模式，因为db first仅可生成表和列，
 * 关联关系等因缺乏信息完美无法生成，需要手动添加
 **********************************/

import { CompatibleExpression, Select } from "./ast";
import { PARAMETER_DIRECTION } from "./constants";
import { DataType, DbType, RowObject, Scalar, DataTypeOf } from "./types";

/**
 * 外键架构
 */
export interface ForeignKeySchema {
  /**
   * 外键名称
   */
  name: string;
  /**
   * 主键表
   */
  primaryTable: TableSchema;
  /**
   * 外键表
   */
  foreignTable: TableSchema;
  /**
   * 主键列
   */
  primaryColumn: ColumnSchema;
  /**
   * 外键列
   */
  foreignColumn: ColumnSchema;
  /**
   * 列对应
   */
  columns: {
    primaryColumn: ColumnSchema;
    foreignColumn: ColumnSchema;
  }[];

  /**
   * 级联删除
   * // WARN 慎用
   */
  deleteCascade: boolean;
}

export interface DatabaseSchema {
  /**
   * 数据库名称
   */
  name: string;

  /**
   * 表
   */
  tables: TableSchema[];
  /**
   * 视图
   */
  views: ViewSchema[];

  /**
   * 索引列表
   */
  indexes: IndexSchema[];

  /**
   * 外键列表
   */
  foreignKeys: ForeignKeySchema[];
}

export interface ParameterSchema<T extends Scalar> {
  dataType: DataTypeOf<T>;
  defaultValue: Scalar;
  direction: PARAMETER_DIRECTION;
}

export interface ProcedureSchema<
  T extends RowObject = never,
  R extends Scalar = number,
  O extends [T, ...RowObject[]] = [T],
  P1 extends Scalar = never,
  P2 extends Scalar = never,
  P3 extends Scalar = never,
  P4 extends Scalar = never,
  P5 extends Scalar = never,
  P6 extends Scalar = never,
  P7 extends Scalar = never,
  P8 extends Scalar = never,
  P9 extends Scalar = never,
  P10 extends Scalar = never,
  P11 extends Scalar = never,
  P12 extends Scalar = never
> {
  params: [
    ParameterSchema<P1>,
    ParameterSchema<P2>,
    ParameterSchema<P3>,
    ParameterSchema<P4>,
    ParameterSchema<P5>,
    ParameterSchema<P6>,
    ParameterSchema<P7>,
    ParameterSchema<P8>,
    ParameterSchema<P9>,
    ParameterSchema<P10>,
    ParameterSchema<P11>,
    ParameterSchema<P12>
  ];
  body: Document;
}

// export class DatabaseSchemaStore {
//   private tableMap: Record<string, TableSchema> = {};
//   private viewMap: Record<string, ViewSchema> = {};
//   private indexMap: Record<string, IndexSchema> = {};
//   private foreignKeyMap: Record<string, ForeignKeySchema> = {};
//   constructor(data: DataObjectOf<DatabaseSchema>) {
//     Object.assign(this, data);
//     this.tables.forEach((table) => (this.tableMap[table.name] = table));
//     this.views.forEach((view) => (this.viewMap[view.name] = view));
//     this.indexes.forEach((index) => (this.indexMap[index.name] = index));
//     this.foreignKeys.forEach(
//       (foreignKey) => (this.foreignKeyMap[foreignKey.name] = foreignKey)
//     );
//   }

//   /**
//    * 数据库名称
//    */
//   readonly name: string;

//   /**
//    * 表
//    */
//   readonly tables: TableSchema[];
//   /**
//    * 视图
//    */
//   readonly views: ViewSchema[];

//   /**
//    * 索引列表
//    */
//   readonly indexes: IndexSchema[];

//   /**
//    * 外键列表
//    */
//   readonly foreignKeys: ForeignKeySchema[];

//   // readonly functions: FunctionSchema[]
//   // readonly procedures: ProcedureSchema[]
//   // readonly sequence: SequenceSchema[]
//   // readonly indexes

//   /**
//    * 获取一个表
//    */
//   getTable(name: string): TableSchema {
//     return this.tableMap[name];
//   }

//   /**
//    * 获取一个视图
//    */
//   getView(name: string): ViewSchema {
//     return this.viewMap[name];
//   }
// }

/**
 * 实体表架构声明
 */
export interface TableSchema {
  kind: "TABLE";

  /**
   * 数据库对象名称
   */
  name: string;
  /**
   * 主键索引
   */
  primaryKey: IndexSchema;
  /**
   * 主键，如果主键为唯一主健，则该值为true
   */
  primaryColumn: ColumnSchema;
  /**
   * 摘要说明
   */
  description?: string;
  /**
   * 列
   */
  columns: ColumnSchema[];
  /**
   * 外键
   */
  foreignKeys: ForeignKeySchema[];
  /**
   * 索引
   */
  indexes: IndexSchema[];
}

/**
 * 视图架构
 */
export interface ViewSchema {
  /**
   * 类型
   */
  kind: "VIEW";
  /**
   * 视图名称
   */
  name: string;
  /**
   * 列定义
   */
  columns: ColumnSchema[];
  /**
   * 声明语句
   */
  body: Select;
  /**
   * 索引
   */
  indexes: IndexSchema[];
  /**
   * 摘要说明
   */
  description?: string;
}

/**
 * 列架构
 */
export interface ColumnSchema {
  /**
   * 字段名
   */
  name: string;
  /**
   * 数据类型
   */
  type: DbType;
  /**
   * 是否可空
   */
  nullable: boolean;
  /**
   * 默认值
   */
  defaultValue?: CompatibleExpression;
  /**
   * 主键
   */
  isPrimaryKey: boolean;
  /**
   * 是否标识列
   */
  isIdentity: boolean;
  /**
   * 是否行标识列
   */
  isRowflag: boolean;
  /**
   * 标识列种子
   */
  identitySeed?: number;
  /**
   * 标识列步长
   */
  identityStep?: number;
  /**
   * 是否计算列
   */
  isCalculate: boolean;
  /**
   * 计算表达式
   */
  calculateExpr?: CompatibleExpression;
  /**
   * 摘要说明
   */
  description?: string;
}

/**
 * 索引
 */
export interface IndexSchema {
  name: string;
  isUnique: boolean;
  isPrimaryKey: boolean;
  columns: ColumnSchema[];
  description?: string;
}
