/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/ban-types */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { CompatibleExpression, RowObject, Select } from './ast'
import { func } from './builder'
import { DbContext } from './db-context'
import { ConnectOptions } from './lube'
import { Entity, FetchRelations } from './repository'
import { DbType, Scalar, ScalarType } from './types'

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
  /**
   * 外键名称
   */
  name: string
  /**
   * 主键表
   */
  primaryTable: TableSchema
  /**
   * 外键表
   */
  foreignTable: TableSchema
  /**
   * 主键列
   */
  primaryColumn: ColumnSchema
  /**
   * 外键列
   */
  foreignColumn: ColumnSchema
  /**
   * 列对应
   */
  columns: {
    primaryColumn: ColumnSchema
    foreignColumn: ColumnSchema
  }[]

  /**
   * 级联删除
   * // WARN 慎用
   */
  deleteCascade: boolean
}

type DataPropertyOf<T> = {
  [P in keyof T]: T[P] extends Function ? never : P
}[keyof T]

// TODO: 映射类会将可空属性变为必填属性
export type DataObjectOf<T> = {
  [P in DataPropertyOf<T>]: T[P]
}

export class DatabaseSchema {
  private tableMap: Record<string, TableSchema> = {}
  private viewMap: Record<string, ViewSchema> = {}
  private indexMap: Record<string, IndexSchema> = {}
  private foreignKeyMap: Record<string, ForeignKeySchema> = {}
  constructor (data: DataObjectOf<DatabaseSchema>) {
    Object.assign(this, data)
    this.tables.forEach(table => (this.tableMap[table.name] = table))
    this.views.forEach(view => (this.viewMap[view.name] = view))
    this.indexes.forEach(index => (this.indexMap[index.name] = index))
    this.foreignKeys.forEach(
      foreignKey => (this.foreignKeyMap[foreignKey.name] = foreignKey)
    )
  }

  /**
   * 数据库名称
   */
  readonly name: string

  /**
   * 表
   */
  readonly tables: TableSchema[]
  /**
   * 视图
   */
  readonly views: ViewSchema[]

  /**
   * 索引列表
   */
  readonly indexes: IndexSchema[]

  /**
   * 外键列表
   */
  readonly foreignKeys: ForeignKeySchema[]

  // readonly functions: FunctionSchema[]
  // readonly procedures: ProcedureSchema[]
  // readonly sequence: SequenceSchema[]
  // readonly indexes

  /**
   * 获取一个表
   */
  getTable (name: string): TableSchema {
    return this.tableMap[name]
  }

  /**
   * 获取一个视图
   */
  getView (name: string): ViewSchema {
    return this.viewMap[name]
  }
}

/**
 * 表架构声明
 */
export class TableSchema {
  private columnMap: {
    [name: string]: ColumnSchema
  }
  constructor (data: DataObjectOf<TableSchema>) {
    Object.assign(this, data)
    this.columnMap = {}
    this.columns.forEach(column => (this.columnMap[column.name] = column))
  }

  kind: 'TABLE'
  /**
   * 数据库对象名称
   */
  name: string
  /**
   * 主键索引
   */
  primaryKey: IndexSchema
  /**
   * 主键
   */
  primaryColumn: ColumnSchema
  /**
   * 摘要说明
   */
  description?: string
  /**
   * 列
   */
  columns: ColumnSchema[]
  /**
   * 外键
   */
  foreignKeys: ForeignKeySchema[]
  /**
   * 索引
   */
  indexes: IndexSchema[]
  /**
   * 获取一个列
   */
  getColumn (name: string): ColumnSchema {
    return this.columnMap[name]
  }
}

/**
 * 视图架构
 */
export class ViewSchema {
  private columnMap: {
    [name: string]: ColumnSchema
  }
  constructor (data: DataObjectOf<ViewSchema>) {
    Object.assign(this, data)
    this.columnMap = {}
    this.columns.forEach(column => (this.columnMap[column.name] = column))
  }

  /**
   * 类型
   */
  kind: 'VIEW'
  /**
   * 视图名称
   */
  name: string
  /**
   * 列定义
   */
  columns: ColumnSchema[]
  /**
   * 声明语句
   */
  statement: Select
  /**
   * 索引
   */
  indexes: IndexSchema[]
  /**
   * 摘要说明
   */
  description?: string
}

/**
 * 列架构
 */
export interface ColumnSchema {
  /**
   * 字段名
   */
  name: string
  /**
   * 数据类型
   */
  type: DbType
  /**
   * 是否可空
   */
  nullable?: boolean
  /**
   * 默认值
   */
  defaultValue?: CompatibleExpression
  /**
   * 主键
   */
  isPrimaryKey: boolean
  /**
   * 是否标识列
   */
  isIdentity: boolean
  /**
   * 是否行标识列
   */
  isRowFlag: boolean
  /**
   * 标识列种子
   */
  identitySeed: number
  /**
   * 标识列步长
   */
  identityStep: number
  /**
   * 是否计算列
   */
  isComputed: boolean
  /**
   * 计算表达式
   */
  computeExpr?: CompatibleExpression
  /**
   * 摘要说明
   */
  description?: string
}

/**
 * 索引
 */
export interface IndexSchema {
  name: string
  isUnique: boolean
  isPrimaryKey: boolean
  columns: ColumnSchema[]
  description?: string
}

/**
 * 实体构造函数，即类本身
 */
export type Constructor<T = object> = {
  new (...args: any): T
}

export type EntityType = Constructor<Entity>

/******************************* Model 相关声明 *********************************/
export type ListType = {
  kind: 'LIST'
  /**
   * 元素类型
   */
  type: Scalar | EntityType
}

/**
 * Schema的数据类型
 */
export type DataType = ScalarType | EntityType | ListType | JSON

/**
 * 是否列表类型
 */
export function isListType (type: any): type is ListType {
  return type?.kind === 'LIST'
}

/**
 * 判断一个函数是否为类声明
 * 注意，此方法在编译目标为ES5及以下版本中无效！
 */
// HACK： 此方法为hack方法，存在不确定性，并且已知在编译目标为ES5及以下版本中无效！
export function isClass (func: Function): boolean {
  return func.toString().startsWith('class ')
}

/**
 * 是否实体类型
 */
export function isEntityType (type: any): type is EntityType {
  return typeof type === 'function' && isClass(type)
}

/**
 * 是否标量类型
 */
export function isScalarType (type: any): type is ScalarType {
  return typeof type === 'bigint'
}

/**
 * 是否一对一关系
 */
export function isOneToOne (
  relation: RelationMetadata
): relation is OneToOneMetadata {
  return relation.kind === 'ONE_TO_ONE'
}

/**
 * 是否主要一对一关系
 */
export function isPrimaryOneToOne (
  relation: RelationMetadata
): relation is PrimaryOneToOneMetadata {
  return isOneToOne(relation) && relation.isPrimary === true
}

/**
 * 是否外键一对一关系
 */
export function isForeignOneToOne (
  relation: RelationMetadata
): relation is ForeignOneToOneMetadata {
  return isOneToOne(relation) && relation.isPrimary === false
}

/**
 * 是否一对多关系
 */
export function isOneToMany (
  relation: RelationMetadata
): relation is OneToManyMetadata {
  return relation.kind === 'ONE_TO_MANY'
}

/**
 * 是否多对一关系
 */
export function isManyToOne (
  relation: RelationMetadata
): relation is ManyToOneMetadata {
  return relation.kind === 'MANY_TO_ONE'
}

/**
 * 是否多对多关系
 */
export function isManyToMany (
  relation: RelationMetadata
): relation is ManyToManyMetadata {
  return relation.kind === 'MANY_TO_MANY'
}

/**
 * 实体元数据
 */
export class EntityMetadata {
  constructor (data: DataObjectOf<EntityMetadata>) {
    Object.assign(this, data)

    this.propertyMap = {}
    this.properties.forEach(prop => {
      this.propertyMap[prop.name] = prop
    })

    this.relationMap = {}
    this.relations.forEach(relation => {
      this.relationMap[relation.name] = relation
    })
  }

  private propertyMap: {
    [name: string]: PropertyMetadata
  }

  private relationMap: Record<string, RelationMetadata>

  /**
   * 关联的上下文类
   */
  contextClass: Constructor<DbContext>

  /**
   * 构造函数
   */
  class: Constructor<Entity>
  /**
   * 模型名称
   */
  name: string
  /**
   * 是否只读
   */
  readonly: boolean
  /**
   * 摘要描述
   */
  description?: string
  /**
   * 属性列表
   */
  properties: PropertyMetadata[]
  /**
   * 关联关系
   */
  relations: RelationMetadata[]
  /**
   * 表或视图
   */
  table: TableSchema | ViewSchema
  /**
   * 行标记属性
   */
  rowflagProperty?: PropertyMetadata
  /**
   * 主键属性，当为视图是可能不存在该属性
   */
  idProperty?: PropertyMetadata
  /**
   * 序列属性
   */
  identityProperty?: PropertyMetadata
  /**
   * 计算属性列表
   */
  computeProperties: PropertyMetadata[]
  /**
   * 获取属性
   */
  getProperty (name: string): PropertyMetadata {
    return this.propertyMap[name]
  }
  /**
   * 获取关系
   */
  getRelation (name: string): RelationMetadata {
    return this.relationMap[name]
  }

  private _detailIncludes: FetchRelations<any>
  /**
   * 获取明细的includes选项
   */
  private getDetailIncludes (): FetchRelations<any> {
    const includes: any = {}
    this.relations
      .filter(relation => relation.isDetail)
      .forEach(prop => {
        includes[prop.name] = true
      })
    return includes
  }

  get detailIncludes (): FetchRelations<any> {
    if (!this._detailIncludes) {
      this._detailIncludes = this.getDetailIncludes()
    }
    return this._detailIncludes
  }
}

/**
 * 数据库上下文
 */
export class DbContextMetadata {
  constructor (data: DataObjectOf<DbContextMetadata>) {
    Object.assign(this, data)
    this.entities.forEach(entity => {
      this.entityNameMap[entity.name] = entity
      this.entityClassMap.set(entity.class, entity)
    })
  }
  /**
   * 类
   */
  class: Constructor<DbContext>
  /**
   * 数据库架构
   */
  database: DatabaseSchema
  /**
   * 实体列表
   */
  readonly entities: EntityMetadata[]
  /**
   * 实体
   */
  private readonly entityNameMap: Record<string, EntityMetadata> = {}
  /**
   * 实体
   */
  private readonly entityClassMap: Map<EntityType, EntityMetadata> = new Map()
  /**
   * 通过名称或者构造函数获取实体
   */
  getEntity (nameOrCtr: string | EntityType): EntityMetadata {
    if (typeof nameOrCtr === 'string') {
      return this.entityNameMap[nameOrCtr]
    }
    return this.entityClassMap.get(nameOrCtr)
  }
}

/**
 * 字段声明
 */
export class PropertyMetadata {
  constructor (data: PropertyMetadata) {
    Object.assign(this, data)
  }
  /**
   * 属性名称
   */
  name: string
  /**
   * 数据类型
   */
  type: DataType
  /**
   * 计算函数,如果是非计算属性，则为空
   */
  compute?: (item: any) => any
  /**
   * 列声明
   */
  column: ColumnSchema
}

/**
 * 关联关系
 */
export type RelationMetadata =
  | OneToOneMetadata
  | OneToManyMetadata
  | ManyToManyMetadata
  | ManyToOneMetadata

/**
 * 一对一引用属性
 */
export interface PrimaryOneToOneMetadata {
  kind: 'ONE_TO_ONE'
  /**
   * 属性名称
   */
  name: string
  /**
   * 数据类型
   */
  type: DataType
  /**
   * 表示当前实体在该关联关系中是否处于主键地位
   */
  isPrimary: true

  /**
   * 关联对应的实体信息
   */
  outerEntity: EntityMetadata
  /**
   * 关联对应的关系信息
   */
  outerRelation?: ForeignOneToOneMetadata
  /**
   * 仅当在主键实体属性中存在
   * 将该关系声明为明细属性，在主从表单据中非常有用；
   * 如果指定为true，
   * 将改变在Repository.save操作时开启了ChangeOption.withRelation选项的行为，
   * 默认情况下ChangeOption.withRelation，仅会新增或者修改现有的关联项，
   * 但不会删除未绑定在关联关系中的项，如果需要删除，需要用户主动调用remove来达到解除关联关系的目的
   * 而指定了isDetail后，系统将会删除数据库中已存在但在提交项中不存在的明细项
   * 并且，在Querable的任意查询中，只需指定withDetail，而无须调用includes，即可递归获取该属性
   */
  isDetail: boolean
  /**
   * 摘要描述
   */
  description?: string
  /**
   * 关联关系的外键声明
   */
  relationKey: ForeignKeySchema
  /**
   * 唯一索引
   */
  uniqIndex: undefined
  /**
   * 表示当前是否自引用
   */
  isSelfRef: boolean
  /**
   * 是否可空
   */
  nullable: undefined
}

/**
 * 一对一引用属性
 * //TODO: OneToOne装饰器需要重载两种方式，主对从及从对主
 */
export interface ForeignOneToOneMetadata {
  kind: 'ONE_TO_ONE'
  /**
   * 属性名称
   */
  name: string
  /**
   * 数据类型
   */
  type: DataType
  /**
   * 表示当前实体在该关联关系中是否处于主键地位
   */
  isPrimary: false
  /**
   * 关联对应的实体信息
   */
  outerEntity: EntityMetadata
  /**
   * 关联对应的关系信息
   */
  outerRelation?: PrimaryOneToOneMetadata
  /**
   * 不可将父表声明为明细表
   */
  isDetail: false
  /**
   * 摘要描述
   */
  description?: string
  /**
   * 关联关系的外键声明
   */
  relationKey: ForeignKeySchema
  /**
   * 唯一索引
   */
  uniqIndex: IndexSchema
  /**
   * 表示当前是否自引用
   */
  isSelfRef: boolean
  /**
   * 是否可空
   */
  nullable: boolean
}

export type OneToOneMetadata = PrimaryOneToOneMetadata | ForeignOneToOneMetadata

/**
 * 一对多引用属性
 */
export interface OneToManyMetadata {
  kind: 'ONE_TO_MANY'
  /**
   * 属性名称
   */
  name: string
  /**
   * 数据类型
   */
  type: DataType
  /**
   * 外键实体
   */
  outerEntity: EntityMetadata
  /**
   * 关联实体中该关系的属性
   */
  outerRelation: RelationMetadata
  /**
   * 摘要描述
   */
  description?: string
  /**
   * 关联关系的外键声明
   */
  relationKey: ForeignKeySchema
  /**
   * 将该关系声明为明细属性，在主从表单据中非常有用；
   * 如果指定为true，
   * 将改变在Repository.save操作时开启了ChangeOption.withRelation选项的行为，
   * 默认情况下ChangeOption.withRelation，仅会新增或者修改现有的关联项，
   * 但不会删除未绑定在关联关系中的项，如果需要删除，需要用户主动调用remove来达到解除关联关系的目的
   * 而指定了isDetail后，系统将会删除数据库中已存在但在提交项中不存在的明细项
   * 并且，在Querable的任意查询中，只需指定withDetail，而无须调用includes，即可递归获取该属性
   */
  isDetail: boolean
  /**
   * 是否可空
   */
  nullable: boolean
  /**
   * 判当前关系是否为自引用关系
   */
  isSelfRef: boolean
}
/**
 * 一对多引用属性
 */
export interface ManyToOneMetadata {
  readonly kind: 'MANY_TO_ONE'
  /**
   * 属性名称
   */
  name: string
  /**
   * 数据类型
   */
  type: DataType
  /**
   * 关联实体
   */
  outerEntity: EntityMetadata
  /**
   * 当前关系所关联的对应的关系
   */
  outerRelation?: EntityMetadata
  /**
   * 摘要描述
   */
  description?: string
  /**
   * 关联关系的外键声明
   */
  relationKey: ForeignKeySchema
  /**
   * 判当前关系是否为自引用关系
   */
  isSelfRef: boolean
  /**
   * 是否可空
   */
  nullable: boolean
  /**
   * 永远不可能
   */
  isDetail: false
}

/**
 * 多对多引用属性,系统会自动创建中间关系表
 */
export interface ManyToManyMetadata {
  readonly kind: 'MANY_TO_MANY'
  /**
   * 属性名称
   */
  name: string
  /**
   * 数据类型
   */
  type: DataType
  /**
   * 当前关系所关联的实体
   */
  outerEntity: EntityMetadata
  /**
   * 当前关系所关联实体中对应的关系
   */
  outerRelation: ManyToManyMetadata
  /**
   * 摘要描述
   */
  description?: string
  /**
   * 中间关系表声明
   */
  middleTable: TableSchema
  /**
   * 当前属性所关联的中间表的外键声明
   */
  relationKey: ForeignKeySchema
  /**
   * 将该关系声明为明细属性，在主从表单据中非常有用；
   * 如果指定为true，
   * 将改变在Repository.save操作时开启了ChangeOption.withRelation选项的行为，
   * 默认情况下ChangeOption.withRelation，仅会新增或者修改现有的关联项，
   * 但不会删除未绑定在关联关系中的项，如果需要删除，需要用户主动调用remove来达到解除关联关系的目的
   * 而指定了isDetail后，系统将会删除数据库中已存在但在提交项中不存在的明细项
   * 并且，在Querable的任意查询中，只需指定withDetail，而无须调用includes，即可递归获取该属性
   */
  isDetail: boolean
  /**
   * 是否自循环引用
   */
  isSelfRef: boolean
  /**
   * 是否可空
   */
  nullable: boolean
}

/**********************************装饰器声明*************************************/

export class MetadataStore {
  private entityMap: Map<EntityType, EntityMetadata> = new Map()
  private contextMap: Map<Constructor<DbContext>, DbContextMetadata> = new Map()
  /**
   * 默认DbContext
   */
  defaultContext: Constructor<DbContext>
  /**
   * 可以通过实体构造函数/实体名称 获取已注册的元数据
   */
  getEntity (entityClass: EntityType): EntityMetadata {
    return this.entityMap.get(entityClass)
  }
  /**
   * 注册一个实体
   */
  registerEntity (metadata: EntityMetadata) {
    if (this.entityMap.has(metadata.class)) {
      throw new Error(`Entity ${metadata.class.name} is registered.`)
    }
    this.entityMap.set(metadata.class, metadata)
    return this
  }
  /**
   * 获取上下文无数据
   */
  getContext (contextClass: Constructor<DbContext>): DbContextMetadata {
    return this.contextMap.get(contextClass);
  }
  /**
   * 注册上下文
   */
  registerContext (metadata: DbContextMetadata): this {
    if (this.contextMap.has(metadata.class)) {
      throw new Error(`DbContext ${metadata.class.name} is registered.`)
    }
    this.contextMap.set(metadata.class, metadata)
    return this
  }
}

/**
 * 公共元数据存储
 */
export const metadataStore = new MetadataStore()
