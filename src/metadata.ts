import { ScalarType, Select } from "./ast";

/**
 * 外键架构
 */
export interface ForeignKeySchema {
  primaryTable: TableSchema;
  foreignTable: TableSchema;
  columnsReferences: {
    primaryColumn: ColumnSchema;
    foreignColumn: ColumnSchema;
  }
}

/**
 * 表架构
 */
export interface TableSchema {
  /**
   * 数据库对象名称
   */
  name: string;
  primaryKey: IndexSchema;
  description: string;
  columns: ColumnSchema[];
  foreignKeys: ForeignKeySchema[];
  indexes: IndexSchema[];
}

/**
 * 视图架构
 */
export interface ViewSchema extends TableSchema {
  isView: true;
  statement: Select;
}

/**
 * 列架构
 */
export interface ColumnSchema {
  name: string;
  type: string;
  fullType: string;
  length?: number;
  nullable?: boolean;
  precision?: number;
  scale?: number;
  defaultValue?: string;
  isJson: boolean;
  isPrimaryKey: boolean;
  isIdentity: boolean;
  isTimestamp: boolean;
  identitySeed: number;
  identityStep: number;
  isComputed: boolean;
  description: string;
}

/**
 * 索引架构
 */
export interface IndexSchema {
  name: string;
  isUnique: boolean
  isPrimaryKey: boolean
  columns: ColumnSchema[]
  description: string
}

/**
 * 模型声明
 */
export interface ModelSchema {
  name: string;
  properties: PropertySchema[];
  hasOneProperties: HasOnePropertySchema[];
  hasManyProperties: HasManyPropertySchema[];
}

export interface TableModelSchema extends ModelSchema {
  table: TableSchema;
}

/**
 * 字段声明
 */
export interface PropertySchema {
  name: string;
  type: ScalarType | ModelSchema;
  isList: boolean;
}

export interface ColumnPropertySchema extends PropertySchema {
  column: ColumnSchema;
  /**
   * 是否JSON存储，如果是，则从数据库中取出时会对其进行反序列化，而存储时会将对象序列化后存入数据库
   * 该属性仅兼容文本类型列
   */
  isJson: boolean;
}

/**
 * 单引用属性
 */
export interface HasOnePropertySchema extends PropertySchema {
  foreignKey: ForeignKeySchema
}

/**
 * 多引用属性
 */
export interface HasManyPropertySchema extends PropertySchema {
  foreignKey: ForeignKeySchema
}

/**
 * 计算属性
 */
export interface ComputePropertySchema extends PropertySchema {
  expr: (t: any) => any
}

/**
 * 关系架构
 */
interface Relationship {
  parent: TableSchema;
  child: TableSchema;
  columns: {
    primaryColumn: string;
    foreignColumn: string;
  }[]
  parentProperty?: string;
  childProperty?: string;
}

export interface OneToOne extends Relationship {
  kind: 'OneToOne'
}

export interface OneToMany extends Relationship {
  kind: 'OneToMany'
}

export interface ManyToMany {
  kind: 'ManyToMany'
  /**
   * 关联表名
   */
  associationTable: string
}

