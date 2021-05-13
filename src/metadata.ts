/* eslint-disable @typescript-eslint/ban-types */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { CompatibleExpression, Select } from "./ast";
import { DbType, ScalarTypeConstructor } from "./types";

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

/**
 * 外键架构
 */
export interface ForeignKeySchema {
  primaryTable: TableSchema;
  foreignTable: TableSchema;
  columns: {
    primaryColumn: ColumnSchema;
    foreignColumn: ColumnSchema;
  }
}

/**
 * 表架构
 */
export interface TableSchema {
  kind: 'TABLE'
  /**
   * 数据库对象名称
   */
  name: string;
  primaryKey: IndexSchema;
  description?: string;
  columns: ColumnSchema[];
  foreignKeys: ForeignKeySchema[];
  indexes: IndexSchema[];
}

/**
 * 视图架构
 */
export interface ViewSchema {
  /**
   * 类型
   */
  kind: 'VIEW'
  /**
   * 视图名称
   */
  name: string;
  /**
   * 摘要说明
   */
  description?: string;
  /**
   * 列定义
   */
  columns: ColumnSchema[];
  /**
   * 声明语句
   */
  statement: Select;
  /**
   * 索引
   */
  indexes: IndexSchema[];
}

/**
 * 列架构
 */
export interface ColumnSchema {
  name: string;
  type: DbType;
  nullable?: boolean;
  defaultValue?: CompatibleExpression;
  isPrimaryKey: boolean;
  /**
   * 是否标识列
   */
  isIdentity: boolean;
  /**
   * 是否行标识列
   */
  isRowFlag: boolean;
  identitySeed: number;
  identityStep: number;
  /**
   * 是否计算列
   */
  isComputed: boolean;
  /**
   * 计算表达式
   */
  computeExpr?: CompatibleExpression;
  description?: string;
}

/**
 * 索引
 */
export interface IndexSchema {
  name: string;
  isUnique: boolean
  isPrimaryKey: boolean
  columns: ColumnSchema[]
  description?: string
}

/******************************* Model 相关声明 *********************************/
export type ListType = {
  kind: 'LIST'
  type: DataType
}

/**
 * Schema的数据类型
 */
export type DataType = ScalarTypeConstructor | ModelInfo | ListType;
export type Constructor = Function;

/**
 * 模型声明
 */
export interface ModelInfo {
  /**
   * 构造函数
   */
  class: Constructor
  /**
   * 类型
   */
  kind: 'MODEL'
  /**
   * 模型名称
   */
  name: string;
  /**
   * 是否只读
   */
  readonly: boolean;
  properties: PropertyInfo[];
  /**
   * 关联关系
   */
  relations: (OneToOneInfo | OneToManyInfo)[];
  /**
   * 表或声明
   */
  schema?: TableSchema | ViewSchema;
  rowflagProperty?: PropertyInfo;
  idProperty?: PropertyInfo;
  computeProperties: PropertyInfo[];
}

/**
 * 字段声明
 */
export interface PropertyInfo {
  name: string;
  type: DataType;
  /**
   * 关系
   */
  relation?: OneToOneInfo | OneToManyInfo;
  /**
   * 计算函数
   */
  compute?: (item: any) => any;
  /**
   * 列声明
   */
  schema?: ColumnSchema;
}

/**
 * 一对一引用属性
 */
export interface OneToOneInfo {
  kind: 'ONETOONE'
  /**
   * 主Model
   */
  mmodel: ModelInfo
  /**
   * 主Model属性
   */
  mproperty: PropertyInfo
  /**
   * 从Model
   */
  smodel: ModelInfo
  /**
   * 从Model属性
   */
  sproperty: PropertyInfo
  // 摘要说明
  description?: string;
  /**
   * 外键声明
   */
  schema: ForeignKeySchema
}

/**
 * 一对多引用属性
 */
export interface OneToManyInfo {
  kind: 'ONETOMANY'
  /**
   * 主Model
   */
  mmodel: ModelInfo
  /**
   * 主Model属性
   */
  mproperty: PropertyInfo
  /**
   * 从Model
   */
  smodel: ModelInfo
  /**
   * 从Model属性
   */
  sproperty: PropertyInfo
  // 摘要说明
  description?: string;
  /**
   * 外键声明
   */
  schema: ForeignKeySchema
}


/**
 * 多对多引用属性,系统会自动创建中间关系表
 */
export interface ManyToManyInfo {
  kind: 'MANYTOMANY'
  /**
   * Model1
   */
  model1: ModelInfo
  /**
   * Model1属性
   */
  property1: PropertyInfo
  /**
   * Model2
   */
  model2: ModelInfo
  /**
   * Model2属性
   */
  property2: PropertyInfo
  // 摘要说明
  description?: string;
  /**
   * 中间关系表声明
   */
  schema: TableSchema;
}

/**********************************装饰器声明*************************************/

/**
 * 将一个类标记为一个Model
 */
function Model(ctr: Function)  {
  ctr.length;
}

