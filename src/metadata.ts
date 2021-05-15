/* eslint-disable @typescript-eslint/ban-types */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { CompatibleExpression, RowObject, Select } from "./ast";
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
  primaryColumn: ColumnSchema;
  foreignColumn: ColumnSchema;
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
  primaryColumn: ColumnSchema;
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

export type EntityConstructor<T extends RowObject = any> = {
  new (...args: any): T
};

/**
 * Schema的数据类型
 */
export type DataType = ScalarTypeConstructor | EntityConstructor | ListType;

/**
 * 模型声明
 */
export class EntityMetadata {
  constructor(data: EntityMetadata) {
    Object.assign(this, data)

    this.propertyMap = {}
    this.properties.forEach(prop => {
      this.propertyMap[prop.name] = prop
    })
  }

  private propertyMap: {
    [name: string]: PropertyMetadata
  }

  /**
   * 构造函数
   */
  class: EntityConstructor
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
  /**
   * 摘要描述
   */
  description?: string;
  /**
   * 属性列表
   */
  properties: PropertyMetadata[];
  /**
   * 关联关系
   */
  relations: (OneToOneMetadata | OneToManyMetadata)[];
  /**
   * 表或声明
   */
  table: TableSchema | ViewSchema;
  /**
   * 行标记属性
   */
  rowflagProperty?: PropertyMetadata;
  /**
   * 主键属性
   */
  idProperty?: PropertyMetadata;

  /**
   * 序列属性
   */
  identityProperty?: PropertyMetadata;
  /**
   * 计算属性列表
   */
  computeProperties: PropertyMetadata[];

  getProperty(name: string): PropertyMetadata {
    return this.propertyMap[name]
  }
}

/**
 * 字段声明
 */
export class PropertyMetadata {
  constructor(data: EntityMetadata) {
    Object.assign(this, data)
  }
  /**
   * 属性名称
   */
  name: string;
  /**
   * 数据类型
   */
  type: DataType | JSON;
  /**
   * 该属性所关联的关系
   */
  relation?: OneToOneMetadata | OneToManyMetadata | ManyToManyMetadata;
  /**
   * 计算函数,如果是非计算属性，则为空
   */
  compute?: (item: any) => any;
  /**
   * 列声明
   */
  column: ColumnSchema;
}

/**
 * 一对一引用属性
 */
export interface OneToOneMetadata {
  kind: 'ONE_TO_ONE'
  /**
   * 主Model
   */
  primaryEntity: EntityMetadata
  /**
   * 主Model属性
   */
  primaryProperty: PropertyMetadata
  /**
   * 从Model
   */
  foreignEntity: EntityMetadata
  /**
   * 从Model属性
   */
  foreignProperty: PropertyMetadata
  /**
   * 摘要描述
   */
  description?: string
  /**
   * 外键声明
   */
  relationKey: ForeignKeySchema
  /**
   * 唯一索引
   */
  uniqIndex: IndexSchema
}

/**
 * 一对多引用属性
 */
export interface OneToManyMetadata {
  kind: 'ONE_TO_MANY'
  /**
   * 主键实体
   */
  primaryEntity: EntityMetadata
  /**
   * 主键属性
   */
  primaryProperty: PropertyMetadata
  /**
   * 外键实体
   */
  foreignEntity: EntityMetadata
  /**
   * 外键属性
   */
  foreignProperty: PropertyMetadata
  /**
   * 摘要描述
   */
  description?: string;
  /**
   * 关联关系的外键声明
   */
  relationKey: ForeignKeySchema
}

/**
 * 多对多引用属性,系统会自动创建中间关系表
 */
export interface ManyToManyMetadata {
  kind: 'MANY_TO_MANY'
  /**
   * Model1
   */
  entity1: EntityMetadata
  /**
   * Model1属性
   */
  property1: PropertyMetadata
  /**
   * Model2
   */
  entity2: EntityMetadata
  /**
   * Model2属性
   */
  property2: PropertyMetadata
  /**
   * 摘要描述
   */
  description?: string;
  /**
   * 中间关系表声明
   */
  relationTable: TableSchema;
  /**
   * 属性1所关联中间表的外键声明
   */
  relationKey1: ForeignKeySchema;
  /**
   * 属性2所关联的中间表外键声明
   */
  relationKey2: ForeignKeySchema;
}

/**********************************装饰器声明*************************************/

/**
 * 将一个类标记为一个Model
 */
function Entity(ctr: EntityConstructor)  {
  ctr.length;
}

function Property() {

}

export const MetadataStore = {
  get(model: EntityConstructor): EntityMetadata {
    throw new Error('尚未实现')
  }
}

