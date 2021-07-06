/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/ban-types */
/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  CompatibleExpression,
  Expression,
  Field,
  ProxiedRowset,
  Rowset,
  Select,
  SqlBuilder as SQL,
  Table,
} from './ast';
import { $IsProxy, $ROWSET_INSTANCE } from './constants';
import { DbContext, DbContextConstructor } from './db-context';
import { FetchRelations } from './repository';
import {
  Constructor,
  DbType,
  Entity,
  EntityType,
  Scalar,
  ScalarType,
  Uuid,
  UUID,
  UuidConstructor,
} from './types';
import { isClass, isProxiedRowset } from './util';

export interface IndexMetadata {
  name: string;
  properties: string[];
  columns: { column: ColumnMetadata; isAscending: boolean }[];

  /**
   * 是否唯一
   */
  isUnique: boolean;

  /**
   * 是否聚焦索引
   */
  isClustered: boolean;

  /**
   * 摘要说明
   */
  comment?: string;
}

/**
 * 表格实体元数据
 */
export class EntityMetadataClass {
  /**
   * 是否隐式生成的
   */
  isImplicit: boolean;
  /**
   * 类型
   */
  kind: 'TABLE' | 'VIEW' | 'QUERY';

  /**
   * 构造函数
   */
  class: Constructor<Entity>;

  /**
   * 数据库上下文类
   */
  contextClass: DbContextConstructor;

  /**
   * 主键约束名称
   */
  keyConstraintName: string;

  /**
   * 主键是否为非聚焦键
   */
  isNonclustered: boolean;

  /**
   * 主键摘要
   */
  keyComment: string;

  /**
   * 模型名称
   */
  className: string;

  /**
   * 主键属性名称
   */
  keyProperty?: string;

  /**
   * 主键列名
   */
  keyColumn?: ColumnMetadata;

  /**
   * 是否只读
   */
  readonly: boolean;

  /**
   * 标识列
   */
  identityColumn?: ColumnMetadata;

  /**
   * 行标记列
   */
  rowflagColumn?: ColumnMetadata;

  /**
   * 摘要描述
   */
  comment?: string;

  private _members: EntityMemberMetadata[] = [];
  private _memberMap: Record<string, EntityMemberMetadata> = {};
  private _columnMap: Record<string, ColumnMetadata> = {};
  private _columns: ColumnMetadata[] = [];
  private _relationMap: Record<string, RelationMetadata> = {};
  private _indexMap: Record<string, IndexMetadata> = {};
  private _reations: RelationMetadata[] = [];
  private _indexes: IndexMetadata[] = [];

  get indexes(): ReadonlyArray<IndexMetadata> {
    return this._indexes;
  }

  addIndex(index: IndexMetadata): this {
    if (this._indexMap[index.name]) {
      throw new Error(`Index ${index.name} is exists in Entity.`);
    }
    this._indexes.push(index);
    this._indexMap[index.name] = index;
    return this;
  }

  addMember(item: EntityMemberMetadata): this {
    if (this._memberMap[item.property])
      throw new Error(`Member ${item.property} is exists in Entity.`);

    this._members.push(item);
    this._memberMap[item.property] = item;
    if (item.kind === 'COLUMN') {
      this._columnMap[item.property] = item;
      this._columns.push(item);
    } else {
      this._relationMap[item.property] = item;
      this._reations.push(item);
    }
    return this;
  }

  get members(): ReadonlyArray<EntityMemberMetadata> {
    return this._members;
  }

  getMember(name: string): EntityMemberMetadata {
    return this._memberMap[name];
  }

  get columns(): ReadonlyArray<ColumnMetadata> {
    return this._columns;
  }

  getColumn(name: string): ColumnMetadata {
    return this._columnMap[name];
  }

  get relations(): ReadonlyArray<RelationMetadata> {
    return this._reations;
  }

  getRelation(name: string): RelationMetadata {
    return this._relationMap[name];
  }

  getIndex(name: string): IndexMetadata {
    return this._indexMap[name];
  }

  private _detailIncludes: FetchRelations<any>;

  getDetailIncludes(): FetchRelations<any> {
    if (this._detailIncludes === undefined) {
      const detailRelations = this.relations.filter(
        r =>
          (isPrimaryOneToOne(r) || isOneToMany(r) || isManyToMany(r)) &&
          r.isDetail
      );
      if (detailRelations.length === 0) {
        this._detailIncludes = null;
      } else {
        const detailIncludes: FetchRelations<any> = {};
        detailRelations.forEach(relation => {
          detailIncludes[relation.property] =
            relation.referenceEntity.getDetailIncludes() || true;
        });
        this._detailIncludes = detailIncludes
      }
    }
    return this._detailIncludes;
  }

  getDetailRelations(): SubordinateRelation[] {
    const detailRelations = this.relations.filter(
      relation =>
        (isPrimaryOneToOne(relation) || isOneToMany(relation) || isManyToMany(relation)) &&
        relation.isDetail
    );
    return detailRelations as SubordinateRelation[];
  }

  getSubordinateRelations(): SubordinateRelation[] {
    return this.relations.filter(
      relation => isPrimaryOneToOne(relation) || isOneToMany(relation) || isManyToMany(relation)
    ) as SubordinateRelation[];
  }

  getSuperiorRelations(): SuperiorRelation[] {
    return this.relations.filter(
      relation => isForeignOneToOne(relation) || isManyToOne(relation)
    ) as SuperiorRelation[];
  }

  /**
   * 数据
   */
  data?: any[];
}

export interface TableEntityMetadata extends EntityMetadataClass {
  kind: 'TABLE';
  /**
   * 表名
   */
  tableName: string;

  // TODO: metdata 需要添加数据架构支持
  // /**
  //  * 架构
  //  */
  // schema: string;
}

/**
 * 视图实体元数据
 */
export interface ViewEntityMetadata extends EntityMetadataClass {
  /**
   * 类型
   */
  kind: 'VIEW';
  /**
   * 表名
   */
  viewName: string;
  /**
   * 查询,视图或者查询的SELECT语句
   */
  body: Select;

  /**
   * 是否只读
   */
  readonly: true;

  relations: never;

  getRelation: never;

  addMember(column: ColumnMetadata): this;
}

/**
 * 查询实体元数据
 */
export interface QueryEntityMetadata extends EntityMetadataClass {
  /**
   * 是否隐式生成的
   */
  isImplicit: true;
  /**
   * 类型
   */
  kind: 'QUERY'; //| 'function'

  /**
   * 查询,视图或者查询的SELECT语句
   */
  sql: Select;

  /**
   * 是否只读
   */
  readonly: true;

  relations: never;

  getRelation: never;

  addMember(column: ColumnMetadata): this;
}

export type EntityMetadata =
  | TableEntityMetadata
  | ViewEntityMetadata
  | QueryEntityMetadata;

export class DbContextMetadata {
  constructor(ctr: DbContextConstructor) {
    this.class = ctr;
  }

  class: DbContextConstructor;
  database: string;
  className: string;
  /**
   * 全局主键字段名称
   */
  globalKeyName: string;
  globalKeyType:
    | NumberConstructor
    | StringConstructor
    | BigIntConstructor
    | UuidConstructor;
  private _entitiyMap: Map<Constructor<Entity>, EntityMetadata> = new Map();
  private _entities: EntityMetadata[] = [];
  get entities(): ReadonlyArray<EntityMetadata> {
    return this._entities;
  }
  /**
   * 摘要说明
   */
  comment?: string;

  /**
   * 获取实体元数据
   * @param ctr 实体构造函数
   */
  getEntity(ctr: Constructor<Entity>): EntityMetadata {
    return this._entitiyMap.get(ctr);
  }

  /**
   *
   */
  findTableEntityByName(tableName: string): EntityMetadata {
    return this.entities.find(
      entity => isTableEntity(entity) && entity.tableName === tableName
    );
  }

  addEntity(entity: EntityMetadata): this {
    if (this._entitiyMap.has(entity.class)) {
      throw new Error(`Entity ${entity.className} is exists in DbContext.`);
    }
    this._entitiyMap.set(entity.class, entity);
    this._entities.push(entity);
    return this;
  }
}

/**
 * 实体成员元数据
 */
export type EntityMemberMetadata =
  | ColumnMetadata
  | OneToOneMetadata
  | OneToManyMetadata
  | ManyToOneMetadata
  | ManyToManyMetadata;

/**
 * 属性元数据
 */
export interface ColumnMetadata<T extends Scalar = Scalar> {
  /**
   * 是否由ORM隐式生成
   */
  isImplicit: boolean;
  kind: 'COLUMN';
  /**
   * 属性名称
   */
  property: string;

  /**
   * 类型
   */
  type: ScalarType;

  /**
   * 字段名
   */
  columnName: string;
  /**
   * 数据库类型
   */
  dbType: DbType;
  /**
   * 是否可空
   */
  isNullable: boolean;
  /**
   * 默认值，即自动生成值列
   */
  defaultValue?: Expression<T>;
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
  identityStartValue?: number;
  /**
   * 标识列步长
   */
  identityIncrement?: number;
  /**
   * 是否计算列
   */
  isCalculate: boolean;
  /**
   * 计算表达式
   */
  calculateExpression?: Expression<T>;
  /**
   * 摘要说明
   */
  comment?: string;

  /**
   * 自动生成表达式（程序）
   */
  generator?: (
    rowset: ProxiedRowset<any>,
    item: any
  ) => CompatibleExpression<T>;
}

/**
 * 关联关系
 */
export type RelationMetadata =
  | OneToOneMetadata
  | OneToManyMetadata
  | ManyToManyMetadata
  | ManyToOneMetadata;

export type SuperiorRelation = ForeignOneToOneMetadata | ManyToOneMetadata;

export type SubordinateRelation = PrimaryOneToOneMetadata | OneToManyMetadata | ManyToManyMetadata;

// /**
//  * 一对一引用属性
//  * //TODO: OneToOne装饰器需要重载两种方式，主对从及从对主
//  */
// export class ForeignOneToOneMetadata {
//   kind: "ONE_TO_ONE";
//   /**
//    * 属性名称
//    */
//   property: string;
//   /**
//    * 数据类型
//    */
//   type: DataType;
//   /**
//    * 表示当前实体在该关联关系中是否处于主键地位
//    */
//   isPincipal: false;
//   /**
//    * 关联对应的实体信息
//    */
//   outerEntity: EntityMetadata;
//   /**
//    * 关联对应的关系信息
//    */
//   outerRelation?: PincipalOneToOneMetadata;
//   /**
//    * 不可将父表声明为明细表
//    */
//   isDetail: false;
//   /**
//    * 摘要描述
//    */
//   description?: string;
//   /**
//    * 关联关系的外键声明
//    */
//   relationKey: ForeignKeySchema;
//   /**
//    * 唯一索引
//    */
//   uniqIndex: IndexSchema;
//   /**
//    * 表示当前是否自引用
//    */
//   isSelfRef: boolean;
//   /**
//    * 是否可空
//    */
//   nullable: boolean;
// }
// /**
//  * 一对一引用属性
//  */
// export class PincipalOneToOneMetadata {
//   kind: "ONE_TO_ONE";
//   /**
//    * 属性名称
//    */
//   property: string;
//   /**
//    * 数据类型
//    */
//   type: DataType;
//   /**
//    * 表示当前实体在该关联关系中是否处于主键地位
//    */
//   isPincipal: true;

//   /**
//    * 关联对应的实体信息
//    */
//   outerEntity: EntityMetadata;
//   /**
//    * 关联对应的关系信息
//    */
//   outerRelation?: ForeignOneToOneMetadata;
//   /**
//    * 仅当在主键实体属性中存在
//    * 将该关系声明为明细属性，在主从表单据中非常有用；
//    * 如果指定为true，
//    * 将改变在Repository.save操作时开启了ChangeOption.withRelation选项的行为，
//    * 默认情况下ChangeOption.withRelation，仅会新增或者修改现有的关联项，
//    * 但不会删除未绑定在关联关系中的项，如果需要删除，需要用户主动调用remove来达到解除关联关系的目的
//    * 而指定了isDetail后，系统将会删除数据库中已存在但在提交项中不存在的明细项
//    * 并且，在Querable的任意查询中，只需指定withDetail，而无须调用includes，即可递归获取该属性
//    */
//   isDetail: boolean;
//   /**
//    * 摘要描述
//    */
//   description?: string;
//   /**
//    * 关联关系的外键声明
//    */
//   relationKey: ForeignKeySchema;
//   /**
//    * 唯一索引
//    */
//   uniqIndex: undefined;
//   /**
//    * 表示当前是否自引用
//    */
//   isSelfRef: boolean;
//   /**
//    * 是否可空
//    */
//   nullable: undefined;
// }

/**
 * 一对一引用属性
 */
export interface PrimaryOneToOneMetadata {
  /**
   * 是否隐式生成的
   */
  isImplicit: boolean;
  /**
   * 类型声明
   */
  kind: 'ONE_TO_ONE';
  /**
   * 属性名称
   */
  property: string;

  /**
   * 关联对应的实体信息
   */
  referenceClass: EntityType;

  /**
   * 引用的实体数据
   */
  referenceEntity: TableEntityMetadata;

  /**
   * 表示当前实体在该关联关系中是否处于主键地位
   */
  isPrimary: true;

  /**
   * 引用实体指向当前表的属性
   */
  referenceProperty?: string;
  /**
   * 引用实体的关系
   */
  referenceRelation: ForeignOneToOneMetadata;
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
  isDetail: boolean;

  /**
   * 摘要描述
   */
  comment?: string;
}

/**
 * 一对一引用属性
 * //TODO: OneToOne装饰器需要重载两种方式，主对从及从对主
 */
export interface ForeignOneToOneMetadata {
  /**
   * 是否隐式生成的
   */
  isImplicit: boolean;
  kind: 'ONE_TO_ONE';
  /**
   * 属性名称，如果是隐式的，则自动填充
   */
  property: string;
  /**
   * 表示当前实体在该关联关系中是否处于主键地位
   */
  isPrimary: false;
  /**
   * 关联对应的实体信息
   */
  referenceClass: EntityType;
  /**
   * 所引用的实体
   */
  referenceEntity: TableEntityMetadata;
  /**
   * 约束名称
   */
  constraintName: string;
  /**
   * 引用实体指向当前表的属性
   */
  referenceProperty: string;

  // TODO: 添加索引
  /**
   * 索引名称
   */
  indexName: string;

  /**
   * 对方的引用声明
   */
  referenceRelation?: PrimaryOneToOneMetadata;
  /**
   * 外键属性
   */
  foreignProperty: string;
  /**
   * 外键列
   */
  foreignColumn: ColumnMetadata;
  // /**
  //  * 不可将父表声明为明细表
  //  */
  // isDetail?: boolean;
  /**
   * 摘要描述
   */
  comment?: string;
  /**
   * 是否可空
   */
  isRequired?: boolean;

  /**
   * 是否级联删除
   */
  isCascade?: boolean;
}

export type HasOneMetadata = OneToOneMetadata | ManyToOneMetadata;

export type HasManyMetadata = OneToManyMetadata | ManyToManyMetadata;

export type OneToOneMetadata =
  | PrimaryOneToOneMetadata
  | ForeignOneToOneMetadata;

/**
 * 一对多引用属性
 */
export interface OneToManyMetadata {
  /**
   * 是否隐式生成的
   */
  isImplicit: boolean;
  kind: 'ONE_TO_MANY';
  /**
   * 属性名称
   */
  property: string;

  /**
   * 引用的实体类型
   */
  referenceClass: EntityType;

  /**
   * 所引用的实体
   */
  referenceEntity: TableEntityMetadata;

  /**
   * 关联实体中该关系的属性
   */
  referenceProperty: string;

  /**
   * 所引用的对应关系
   */
  referenceRelation: ManyToOneMetadata;
  /**
   * 摘要描述
   */
  comment?: string;

  /**
   * 将该关系声明为明细属性，在主从表单据中非常有用；
   * 如果指定为true，
   * 将改变在Repository.save操作时开启了ChangeOption.withRelation选项的行为，
   * 默认情况下ChangeOption.withRelation，仅会新增或者修改现有的关联项，
   * 但不会删除未绑定在关联关系中的项，如果需要删除，需要用户主动调用remove来达到解除关联关系的目的
   * 而指定了isDetail后，系统将会删除数据库中已存在但在提交项中不存在的明细项
   * 并且，在Querable的任意查询中，只需指定withDetail，而无须调用includes，即可递归获取该属性
   */
  isDetail: boolean;
}
/**
 * 一对多引用属性
 */
export interface ManyToOneMetadata {
  /**
   * 是否隐式生成的
   */
  isImplicit: boolean;
  kind: 'MANY_TO_ONE';
  /**
   * 属性名称
   */
  property: string;

  /**
   * 引用主键的属性名
   */
  foreignProperty: string;

  /**
   * 外键列
   */
  foreignColumn: ColumnMetadata;

  /**
   * 外键字段所建立的索引名称
   */
  indexName: string;

  /**
   * 关联实体
   */
  referenceClass: EntityType;

  /**
   * 引用的实体对象
   */
  referenceEntity: TableEntityMetadata;

  /**
   * 对方引用属性
   */
  referenceProperty?: string;

  /**
   * 对方的引用声明
   */
  referenceRelation?: OneToManyMetadata;

  /**
   * 约束名称
   */
  constraintName?: string;

  /**
   * 是否可空
   */
  isRequired: boolean;

  /**
   * 摘要描述
   */
  comment?: string;
  /**
   * 是否级联删除
   */
  isCascade?: boolean;
}

/**
 * 多对多引用属性,系统会自动创建中间关系表
 * ManyToMany = OneToMany + ManyToOne + 中间Entity + ManyToOne + OneToMany.
 */
export interface ManyToManyMetadata {
  /**
   * 是否隐式生成的
   */
  isImplicit: boolean;
  /**
   * 属性名称
   */
  kind: 'MANY_TO_MANY';
  /**
   * 属性名称
   */
  property: string;

  /**
   * 当前关系所关联的实体
   */
  referenceClass: EntityType;

  /**
   * 引用的实体对象
   */
  referenceEntity: TableEntityMetadata;
  /**
   * 对向引用属性
   */
  referenceProperty?: string;

  /**
   * 对方的引用声明
   */
  referenceRelation?: ManyToManyMetadata;

  /**
   * 关系表实体类
   */
  relationClass: EntityType;
  /**
   * 关联关系中间表
   * 可以由用户声明，亦可以隐式生成
   */
  relationEntity: TableEntityMetadata;

  /**
   * 中间关联关系属性
   */
  relationProperty?: string;

  /**
   * 关联关系中间关系
   */
  relationRelation: OneToManyMetadata;

  /**
   * 关系约束名称，此名称为关联源名的关系名称
   */
  relationConstraintName?: string;

  /**
   * 摘要描述
   */
  comment?: string;
  /**
   * 将该关系声明为明细属性，在主从表单据中非常有用；
   * 如果指定为true，
   * 将改变在Repository.save操作时开启了ChangeOption.withRelation选项的行为，
   * 默认情况下ChangeOption.withRelation，仅会新增或者修改现有的关联项，
   * 但不会删除未绑定在关联关系中的项，如果需要删除，需要用户主动调用remove来达到解除关联关系的目的
   * 而指定了isDetail后，系统将会删除数据库中已存在但在提交项中不存在的明细项
   * 并且，在Querable的任意查询中，只需指定withDetail，而无须调用includes，即可递归获取该属性
   */
  isDetail: boolean;
  /**
   * 是否级联删除
   */
  isCascade?: boolean;
}

// export type OneToOneMetadata =
//   | PincipalOneToOneMetadata
//   | ForeignOneToOneMetadata;
// /**
//  * 关联关系
//  */
// export type RelationMetadata =
//   | OneToOneMetadata
//   | OneToManyMetadata
//   | ManyToManyMetadata
//   | ManyToOneMetadata;
// /**
//  * 一对多引用属性
//  */
// export interface ManyToOneMetadata {
//   readonly kind: "MANY_TO_ONE";
//   /**
//    * 属性名称
//    */
//   property: string;
//   /**
//    * 数据类型
//    */
//   type: DataType;
//   /**
//    * 关联实体
//    */
//   outerEntity: EntityMetadata;
//   /**
//    * 当前关系所关联的对应的关系
//    */
//   outerRelation?: EntityMetadata;
//   /**
//    * 摘要描述
//    */
//   description?: string;
//   /**
//    * 关联关系的外键声明
//    */
//   relationKey: ForeignKeySchema;
//   /**
//    * 判当前关系是否为自引用关系
//    */
//   isSelfRef: boolean;
//   /**
//    * 是否可空
//    */
//   nullable: boolean;
//   /**
//    * 永远不可能
//    */
//   isDetail: false;
// }

// export type EntityMemberMetadata =
//   | ColumnMetadata
//   | OneToOneMetadata
//   | OneToManyMetadata
//   | ManyToOneMetadata
//   | ManyToManyMetadata;

// /**
//  * 多对多引用属性,系统会自动创建中间关系表
//  */
// export class ManyToManyMetadata {
//   readonly kind: "MANY_TO_MANY";
//   /**
//    * 属性名称
//    */
//   property: string;
//   /**
//    * 数据类型
//    */
//   type: DataType;
//   /**
//    * 当前关系所关联的实体
//    */
//   outerEntity: EntityMetadata;
//   /**
//    * 当前关系所关联实体中对应的关系
//    */
//   outerRelation: ManyToManyMetadata;
//   /**
//    * 摘要描述
//    */
//   description?: string;
//   /**
//    * 中间关系表声明
//    */
//   middleTable: TableSchema;
//   /**
//    * 当前属性所关联的中间表的外键声明
//    */
//   relationKey: ForeignKeySchema;
//   /**
//    * 将该关系声明为明细属性，在主从表单据中非常有用；
//    * 如果指定为true，
//    * 将改变在Repository.save操作时开启了ChangeOption.withRelation选项的行为，
//    * 默认情况下ChangeOption.withRelation，仅会新增或者修改现有的关联项，
//    * 但不会删除未绑定在关联关系中的项，如果需要删除，需要用户主动调用remove来达到解除关联关系的目的
//    * 而指定了isDetail后，系统将会删除数据库中已存在但在提交项中不存在的明细项
//    * 并且，在Querable的任意查询中，只需指定withDetail，而无须调用includes，即可递归获取该属性
//    */
//   isDetail: boolean;
//   /**
//    * 是否自循环引用
//    */
//   isSelfRef: boolean;
//   /**
//    * 是否可空
//    */
//   nullable: boolean;
// }

// /**
//  * 一对多引用属性
//  */
// export class ManyToOneMetadata {
//   readonly kind: "MANY_TO_ONE";
//   /**
//    * 属性名称
//    */
//   property: string;
//   /**
//    * 数据类型
//    */
//   type: DataType;
//   /**
//    * 关联实体
//    */
//   outerEntity: EntityMetadata;
//   /**
//    * 当前关系所关联的对应的关系
//    */
//   outerRelation?: EntityMetadata;
//   /**
//    * 摘要描述
//    */
//   description?: string;
//   /**
//    * 关联关系的外键声明
//    */
//   relationKey: ForeignKeySchema;
//   /**
//    * 判当前关系是否为自引用关系
//    */
//   isSelfRef: boolean;
//   /**
//    * 是否可空
//    */
//   nullable: boolean;
//   /**
//    * 永远不可能
//    */
//   isDetail: false;
// }
// /**
//  * 一对多引用属性
//  */
// export class OneToManyMetadata {
//   constructor(private econtext: DbContextMetadata, options: OneToManyOptions) {
//     this.kind = options.kind
//     this.property = options.property
//     this.type = options.type
//     this.referenceClass = options.referenceClass
//     this.referenceProperty = options.referenceProperty
//   }

//   kind: "ONE_TO_MANY";
//   /**
//    * 属性名称
//    */
//   property: string;
//   /**
//    * 数据类型
//    */
//   type: DataType;

//   readonly referenceClass: EntityType;

//   readonly referenceProperty: string;
//   /**
//    * 外键实体数据
//    */
//   get referenceEntity(): EntityMetadata {
//     return this.econtext.getEntity(this.referenceClass)
//   }
//   /**
//    * 关联实体中对向的关系的属性
//    */
//   get referenceRelation(): ManyToOneMetadata {
//     return this.referenceEntity.getRelation(this.referenceProperty) as ManyToOneMetadata
//   }
//   /**
//    * 摘要描述
//    */
//   description?: string;
//   /**
//    * 关联关系的外键声明
//    */
//   get referenceKey(): ForeignKeySchema {
//     return this.referenceRelation?.relationKey
//   }
//   /**
//    * 将该关系声明为明细属性，在主从表单据中非常有用；
//    * 如果指定为true，
//    * 将改变在Repository.save操作时开启了ChangeOption.withRelation选项的行为，
//    * 默认情况下ChangeOption.withRelation，仅会新增或者修改现有的关联项，
//    * 但不会删除未绑定在关联关系中的项，如果需要删除，需要用户主动调用remove来达到解除关联关系的目的
//    * 而指定了isDetail后，系统将会删除数据库中已存在但在提交项中不存在的明细项
//    * 并且，在Querable的任意查询中，只需指定withDetail，而无须调用includes，即可递归获取该属性
//    */
//   isDetail: boolean;
//   /**
//    * 是否可空
//    */
//   nullable: boolean;
//   /**
//    * 判当前关系是否为自引用关系
//    */
//   isSelfRef: boolean;
// }

// /**
//  * 实体元数据
//  */
// export abstract class EntityMetadata {
//   constructor(private ctxMetadata: DbContextMetadata, data: EntityOptions) {
//     Object.assign(this, data);
//     this.columns = []
//     data.members.forEach((prop) => {
//       let member: EntityMemberMetadata;
//       switch (prop.kind) {
//         case "COLUMN":
//           member = new ColumnMetadata(this, prop);
//           this.columnMap[prop.name] = member
//           this.columns.push(member)
//           break;
//         case "MANY_TO_MANY":
//           member = new ManyToManyMetadata(prop);
//           this.relationMap[prop.name] = member
//           break;
//         case "MANY_TO_ONE":
//           member = new ManyToOneMetadata(prop);
//           this.relationMap[prop.name] = member
//           break;
//         case "ONE_TO_MANY":
//           member = new OneToManyMetadata(prop);
//           this.relationMap[prop.property] = member
//           break;
//         case "ONE_TO_ONE":
//           if (prop.isPincipal) {
//             member = new PincipalOneToOneMetadata(prop);
//           } else {
//             member = new ForeignOneToOneMetadata(prop);
//           }
//           this.relationMap[prop.property] = member
//           break;
//       }
//       this.memberMap[prop.name] = member;
//     });

//     this.relationMap = {};
//     this.relations.forEach((relation) => {
//       this.relationMap[relation.property] = relation;
//     });
//   }

//   columns: ColumnMetadata[]

//   private memberMap: {
//     [name: string]: EntityMemberMetadata;
//   } = {};

//   private columnMap: {
//     [name: string]: ColumnMetadata;
//   }

//   private relationMap: Record<string, RelationMetadata>;

//   /**
//    * 关联的上下文类
//    */
//   contextClass: DbContextConstructor;

//   /**
//    * 构造函数
//    */
//   class: Constructor<Entity>;
//   /**
//    * 模型名称
//    */
//   name: string;
//   /**
//    * 是否只读
//    */
//   readonly: boolean;
//   /**
//    * 摘要描述
//    */
//   description?: string;
//   /**
//    * 属性列表
//    */
//   properties: ColumnMetadata[];
//   /**
//    * 关联关系
//    */
//   relations: RelationMetadata[];
//   /**
//    * 表或视图
//    */
//   schema: TableSchema | ViewSchema;
//   /**
//    * 行标记属性
//    */
//   rowflagProperty?: ColumnMetadata;
//   /**
//    * 主键属性，当为视图是可能不存在该属性
//    */
//   idProperty?: ColumnMetadata;
//   /**
//    * 序列属性
//    */
//   identityProperty?: ColumnMetadata;
//   /**
//    * 计算属性列表
//    */
//   computeProperties: ColumnMetadata[];
//   /**
//    * 获取属性
//    */
//   getMember(name: string): EntityMemberMetadata {
//     return this.memberMap[name];
//   }

//   /**
//    * 获取列
//    */
//   getColumn(name: string): ColumnMetadata {
//     return this.columnMap[name];
//   }

//   getColumns(): ColumnMetadata[] {
//     return Object.values(this.columnMap)
//   }

//   getRelations(): RelationMetadata[] {
//     return Object.values(this.relationMap)
//   }

//   /**
//    * 获取关系
//    */
//   getRelation(name: string): RelationMetadata {
//     return this.relationMap[name];
//   }

//   private _detailIncludes: FetchRelations<any>;
//   /**
//    * 获取明细的includes选项
//    */
//   private getDetailIncludes(): FetchRelations<any> {
//     const includes: any = {};
//     this.relations
//       .filter((relation) => relation.isDetail)
//       .forEach((prop) => {
//         includes[prop.property] = true;
//       });
//     return includes;
//   }

//   get detailIncludes(): FetchRelations<any> {
//     if (!this._detailIncludes) {
//       this._detailIncludes = this.getDetailIncludes();
//     }
//     return this._detailIncludes;
//   }
// }

// /**
//  * 数据库上下文
//  */
// export class DbContextMetadata {
//   constructor(data: DbContextOptions) {
//     this.schema = {
//       name: data.name,
//       tables: [],
//       views: [],
//       indexes: [],
//       foreignKeys: []
//     }
//     // TODO 待实现
//     data.entities.forEach((entityOptions) => {
//       const entityMetadata = new EntityMetadata(this, entityOptions)
//       switch (entityMetadata.table.kind) {
//         case 'TABLE':
//           this.schema.tables.push(entityMetadata.table)
//           break
//         case 'VIEW':
//           this.schema.views.push(entityMetadata.table)
//           break
//         case 'VIRTUAL_TABLE':
//           // 虚拟表不加入数据库中
//           break
//       }

//       this.entityMap.set(entityOptions.class, entityMetadata);
//     });
//     this.entities = Array.from(this.entityMap.values())
//   }
//   /**
//    * 类
//    */
//   class: DbContextConstructor;
//   /**
//    * 数据库架构
//    */
//   schema: DatabaseSchema;
//   /**
//    * 实体列表
//    */
//   readonly entities: Readonly<EntityMetadata[]>;
//   /**
//    * 实体
//    */
//   private readonly entityMap: Map<EntityType, EntityMetadata> = new Map();
//   /**
//    * 通过名称或者构造函数获取实体
//    */
//   getEntity(nameOrCtr: EntityType): EntityMetadata {
//     return this.entityMap.get(nameOrCtr);
//   }
// }

// /**
//  * 字段声明
//  */
// export class ColumnMetadata {
//   constructor(private entityMetadata: EntityMetadata, data: ColumnOptions) {
//     // Object.assign(this, data);
//     this.column = {
//       name: data.dbName,
//       type: data.dbType,
//       isPrimaryKey: data.isPrimaryKey,
//       isIdentity: data.isIdentity,
//       isRowflag: data.isRowflag,
//       isCalculate: data.isCalculate,
//       calculateExpr: data.calculateExpr,
//       identitySeed: data.identitySeed,
//       identityStep: data.identityStep,
//       description: data.description,
//       nullable: data.nullable ?? true
//     }
//     this.property = data.name
//     this.type = data.type
//   }
//   kind: "COLUMN" = 'COLUMN';
//   property: string;
//   type: ScalarType;
//   dbType?: DbType;
//   nullable?: boolean;
//   // TODO: 需要将SQL表达式编译成JS表达式
//   defaultValue?: () => any;
//   isPrimaryKey?: boolean;
//   isIdentity?: boolean;
//   isRowflag?: boolean;
//   identitySeed?: number;
//   identityStep?: number;
//   isCalculate?: boolean;
//   calculateExpr?: CompatibleExpression<Scalar>;
//   description?: string;

//   /**
//    * 列声明
//    */
//   column: ColumnSchema;
// }

/**********************************装饰器声明*************************************/
export class MetadataStore {
  private entityMap: Map<EntityType, EntityMetadata> = new Map();
  private contextMap: Map<DbContextConstructor, DbContextMetadata> = new Map();
  private _defaultContext: DbContextMetadata;

  /**
   * 默认DbContext元数据
   */
  get defaultContext(): DbContextMetadata {
    return this._defaultContext;
  }
  /**
   * 可以通过实体构造函数/实体名称 获取已注册的元数据
   */
  getEntity(entityClass: EntityType): EntityMetadata {
    return this.entityMap.get(entityClass);
  }
  /**
   * 注册一个实体
   */
  registerEntity(metadata: EntityMetadata) {
    if (this.entityMap.has(metadata.class)) {
      throw new Error(`Entity ${metadata.class.name} is registered.`);
    }
    this.entityMap.set(metadata.class, metadata);
    return this;
  }
  /**
   * 获取上下文无数据
   */
  getContext(name: string): DbContextMetadata;
  getContext(contextClass: DbContextConstructor): DbContextMetadata;
  getContext(nameOrClass: DbContextConstructor | string): DbContextMetadata;
  getContext(contextClass: DbContextConstructor | string): DbContextMetadata {
    if (typeof contextClass === 'string') {
      return Array.from(this.contextMap.values()).find(
        metadata => metadata.class.name === contextClass
      );
    }
    return this.contextMap.get(contextClass);
  }

  /**
   * 注册上下文
   */
  registerContext(metadata: DbContextMetadata): this {
    if (this.contextMap.has(metadata.class)) {
      throw new Error(`DbContext ${metadata.class.name} is registered.`);
    }
    this.contextMap.set(metadata.class, metadata);
    for (const entity of metadata.entities) {
      this.registerEntity(entity);
    }
    if (!this._defaultContext) {
      this._defaultContext = metadata;
    }
    return this;
  }
}

/**
 * 公共元数据存储
 */
export const metadataStore = new MetadataStore();

export function aroundRowset<T extends Entity = any>(
  rowset: Rowset<any>,
  metadata: EntityMetadata
): ProxiedRowset<T> {
  if (isProxiedRowset(rowset)) {
    rowset = Reflect.get(rowset, $ROWSET_INSTANCE);
  }
  const keys = Object.getOwnPropertyNames(rowset);
  const field = function (property: string) {
    const column = metadata.getColumn(property);
    if (!column) {
      throw new Error(
        `Entity ${metadata.className} property ${property} is not found.`
      );
    }
    return rowset.field(column.columnName);
  };
  return new Proxy(rowset, {
    get(target: any, key: string | symbol | number): any {
      if (key === 'field') {
        return field;
      }

      const v = target[key];
      if (v !== undefined) return v;

      /**
       * 标记为Proxy
       */
      if (key === $IsProxy) {
        return true;
      }
      // 获取被代理前的对象
      if (key === $ROWSET_INSTANCE) {
        return target;
      }

      if (keys.includes(key as string)) return v;

      if (typeof key !== 'string') {
        return v;
      }

      // const value = Reflect.get(target, prop);
      // if (value !== undefined) return value;
      if (key.startsWith('$')) {
        key = key.substring(1);
      }

      return field(key);
    },
  });
}

/**
 * 从
 * @param entity
 * @returns
 */
export function makeRowset<T extends Entity = any>(
  entity: Constructor<T>
): ProxiedRowset<T> {
  const metadata = metadataStore.getEntity(entity);
  if (!metadata) throw new Error(`No metadata found ${entity}`);
  let rowset: Rowset<T>;
  if (isQueryEntity(metadata)) {
    rowset = metadata.sql.as('_');
  } else if (isTableEntity(metadata)) {
    rowset = new Table(metadata.tableName);
    // SQL.table(metadata.tableName);
  } else {
    rowset = new Table(metadata.viewName);
    // rowset = SQL.table(metadata.viewName);
  }
  return aroundRowset(rowset, metadata);
}

/**
 * 是否一对一关系
 */
export function isOneToOne(
  relation: RelationMetadata
): relation is OneToOneMetadata {
  return relation.kind === 'ONE_TO_ONE';
}

/**
 * 是否主要一对一关系
 */
export function isPrimaryOneToOne(
  relation: RelationMetadata
): relation is PrimaryOneToOneMetadata {
  return isOneToOne(relation) && relation.isPrimary === true;
}

/**
 * 是否外键一对一关系
 */
export function isForeignOneToOne(
  relation: RelationMetadata
): relation is ForeignOneToOneMetadata {
  return isOneToOne(relation) && relation.isPrimary === false;
}

/**
 * 是否一对多关系
 */
export function isOneToMany(
  relation: RelationMetadata
): relation is OneToManyMetadata {
  return relation.kind === 'ONE_TO_MANY';
}

/**
 * 是否多对一关系
 */
export function isManyToOne(relation: any): relation is ManyToOneMetadata {
  return relation.kind === 'MANY_TO_ONE';
}

/**
 * 是否多对多关系
 */
export function isManyToMany(
  relation: RelationMetadata
): relation is ManyToManyMetadata {
  return relation.kind === 'MANY_TO_MANY';
}

/**
 * 表示此关系所在的实体，在数据库关系中是否处于外键地位
 * @param relation
 * @returns
 */
export function isForeignRelation(
  relation: RelationMetadata
): relation is ForeignRelation {
  return isManyToOne(relation) || isForeignOneToOne(relation);
}

export type ForeignRelation = ForeignOneToOneMetadata | ManyToOneMetadata;

/**
 * 是否实体类型
 */
export function isEntityType(type: any): type is EntityType {
  return typeof type === 'function' && isClass(type);
}

export function isEntityMetadata(value: any): value is EntityMetadata {
  return (
    value?.kind &&
    (value.kind === 'TABLE' || value.kind === 'VIEW' || value.kind === 'QUERY')
  );
}

export function isTableEntity(value: any): value is TableEntityMetadata {
  return value instanceof EntityMetadataClass && value.kind === 'TABLE';
}

export function isViewEntity(value: any): value is ViewEntityMetadata {
  return value instanceof EntityMetadataClass && value.kind === 'VIEW';
}

export function isQueryEntity(value: any): value is QueryEntityMetadata {
  return value instanceof EntityMetadataClass && value.kind === 'QUERY';
}
