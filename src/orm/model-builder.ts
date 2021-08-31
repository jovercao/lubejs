import Decimal from 'decimal.js-light';
import {
  CompatibleExpression,
  DbType,
  Expression,
  isSameDbType,
  ProxiedRowset,
  Scalar,
  Select,
  Uuid,
  UuidConstructor,
} from '../ast';
import {
  DbContext,
  DbContextConstructor,
  DbInstance,
} from './db-context';
import {
  getAmong,
  getColumnOptions,
  getComment,
  getConnectionOptions,
  getContextOptions,
  getDecorateContexts,
  getDecorateEntities,
  getEntityColumns,
  getEntityKeyOptions,
  getEntityOptions,
  getEntityRelations,
  getIndexOptions,
  getRelationOptions,
} from './decorators';
import { ConnectOptions } from '../base/connection';
import {
  ColumnMetadata,
  DbContextMetadata,
  EntityMetadata,
  ForeignOneToOneMetadata,
  ForeignRelation,
  HasManyMetadata,
  HasOneMetadata,
  IndexMetadata,
  isForeignOneToOne,
  isManyToMany,
  isManyToOne,
  isOneToMany,
  isPrimaryOneToOne,
  isTableEntity,
  KeyMetadata,
  ManyToManyMetadata,
  ManyToOneMetadata,
  OneToManyMetadata,
  OneToOneMetadata,
  PrimaryOneToOneMetadata,
  RelationMetadata,
  TableEntityMetadata,
} from './metadata';
import { Entity, EntityConstructor } from './entity';
import { complex, lowerFirst, selectProperty } from './util';
import { DataType, DataTypeOf, EntityType, ScalarType } from './types';
import { metadataStore } from './metadata-store';

export type HasManyKeyOf<T extends Entity> = {
  [P in keyof T]: P extends string
    ? T[P] extends Entity[]
      ? P
      : never
    : never;
}[keyof T];

export type HasOneKeyOf<T extends Entity> = {
  [P in keyof T]: P extends string ? (T[P] extends Entity ? P : never) : never;
}[keyof T];

export type ColumnKeyOf<T extends Entity> = {
  [P in keyof T]: P extends string ? (T[P] extends Scalar ? P : never) : never;
}[keyof T];

/**
 * 修复列声明
 * @param ctx
 * @param entity
 * @param column
 */
function fixColumn(
  ctx: DbContextMetadata,
  entity: EntityMetadata,
  column: ColumnMetadata
) {
  if (!column.columnName) {
    column.columnName = column.property;
  }
  if (!column.dbType) {
    column.dbType = dataTypeToDbType(column.type);
  }
  if (column.isIdentity) {
    if (column.identityStartValue === undefined) {
      column.identityStartValue = 0;
    }
    if (column.identityIncrement === undefined) {
      column.identityIncrement = 1;
    }
  }
  if (column.isNullable === undefined) {
    column.isNullable = false;
  }
  if (column.isRowflag === undefined) {
    column.isRowflag = false;
  }
  if (column.isPrimaryKey === undefined) {
    column.isPrimaryKey = false;
  }
  if (column.isCalculate === undefined) {
    column.isCalculate = false;
  }
  if (column.isIdentity === undefined) {
    column.isIdentity = false;
  }
}

function fixEntityIndexes(entity: TableEntityMetadata) {
  for (const index of entity.indexes) {
    fixIndex(entity, index);
  }
}

function fixIndex(entity: TableEntityMetadata, index: IndexMetadata) {
  if (!index.name) {
    index.name = `IX_${entity.dbName}_${index.columns
      .map(col => col.column.columnName)
      .join('_')}`;
  }
  if (!index.properties) {
    throw new Error(`Index must specify properties.`);
  }
  if (Array.isArray(index.properties)) {
    index.columns = index.properties.map(property => {
      const column = entity.getColumn(property);
      if (!column) {
        throw new Error(`Column ${property} not found.`);
      }
      return {
        column,
        sort: 'ASC',
      };
    });
  } else {
    index.columns = Object.entries(index.properties).map(
      ([property, direction]) => {
        const column = entity.getColumn(property);
        if (!column) {
          throw new Error(`Column ${property} not found.`);
        }
        return {
          column,
          sort: direction,
        };
      }
    );
  }

  if (index.isUnique === undefined) {
    index.isUnique = false;
  }

  if (index.isClustered === undefined) {
    index.isClustered = false;
  }
}

function fixRelationIndex(
  entity: TableEntityMetadata,
  relation: ForeignRelation
) {
  if (!relation.indexName) {
    relation.indexName = `${isForeignOneToOne(relation) ? 'UX' : 'IX'}_${
      entity.dbName
    }_${relation.foreignColumn.columnName}`;
  }
  // 为关系追加索引
  let index = entity.getIndex(relation.indexName);
  if (!index) {
    index = {
      name: relation.indexName,
    } as IndexMetadata;
    entity.addIndex(index);
  } else {
    let props: string[];
    if (Array.isArray(index.properties)) {
      props = index.properties;
    } else {
      props = Object.keys(index.properties);
    }

    if (!props || props.length !== 1 || props[0] !== relation.foreignProperty) {
      throw new Error(
        `Entity ${entity.className} index ${index.name} not satisfied for relation ${relation.property}`
      );
    }
  }

  if (!index.properties) {
    index.properties = [relation.foreignProperty];
  }
  if (index.isUnique === undefined) {
    index.isUnique = isForeignOneToOne(relation);
  }
  fixIndex(entity, index);
}

/**
 * 修复多对一声明
 * @param ctx
 * @param entity
 * @param relation
 */
function fixManyToOne(
  ctx: DbContextMetadata,
  entity: TableEntityMetadata,
  relation: ManyToOneMetadata
) {
  if (relation.isRequired === undefined) {
    relation.isRequired = false;
  }
  if (relation.comment === undefined) {
    relation.comment = undefined;
  }

  if (relation.isCascade === undefined) {
    relation.isCascade = false;
  }

  fixReferenceEntity(ctx, entity, relation);
  fixForeignProperty(entity, relation);

  fixRelationIndex(entity, relation);

  if (!relation.referenceProperty) {
    relation.referenceProperty = genRelationProperty(entity.className, 'many');
  }

  if (!relation.referenceRelation) {
    let referenceRelation = relation.referenceEntity.getRelation(
      relation.referenceProperty
    );
    if (referenceRelation) {
      if (!isOneToMany(referenceRelation)) {
        throw new Error(
          `ManyToOneRelation ${entity.className}.${relation.property} must reference OneToManyRelation`
        );
      }
      relation.referenceRelation = referenceRelation;
    } else {
      referenceRelation = {
        isImplicit: true,
        kind: 'ONE_TO_MANY',
        property: relation.referenceProperty,
        referenceClass: entity.class,
        referenceEntity: entity,
        referenceProperty: relation.property,
        referenceRelation: relation,
        isDetail: false,
      };
      relation.referenceEntity.addRelation(referenceRelation);
      relation.referenceRelation = referenceRelation;
      fixOneToMany(ctx, relation.referenceEntity, referenceRelation);
    }
  }
}

/**
 * 修复一对多关系声明
 * @param ctx
 * @param entity
 * @param relation
 */
function fixOneToMany(
  ctx: DbContextMetadata,
  entity: TableEntityMetadata,
  relation: OneToManyMetadata
) {
  fixReferenceEntity(ctx, entity, relation);
  // 如果未指定该属性，则查找该属性
  // 如果未查找到该属性，则定义该属性
  if (!relation.referenceProperty) {
    const referenceProperty = genRelationProperty(entity.className, 'one');
    relation.referenceProperty = referenceProperty;
  }

  if (!relation.referenceRelation) {
    let referenceRelation = relation.referenceEntity.getRelation(
      relation.referenceProperty
    ) as ManyToOneMetadata;
    if (!referenceRelation) {
      const foreignProperty = `${relation.referenceProperty}Id`;
      referenceRelation = {
        property: relation.referenceProperty,
        // dbName: relation.referenceProperty,
        constraintName: `FK_${
          relation.referenceEntity.dbName
        }_${foreignProperty}_TO_${entity.dbName}_${entity.key!.property}`,
        kind: 'MANY_TO_ONE',
        isImplicit: true,
        referenceClass: entity.class,
        referenceEntity: entity,
        foreignProperty,
        referenceProperty: relation.property,
        referenceRelation: relation,
        isRequired: false,
      } as ManyToOneMetadata;
      relation.referenceRelation = referenceRelation;
      // 创建隐式规则
      relation.referenceEntity.addRelation(referenceRelation);
      fixForeignProperty(relation.referenceEntity, referenceRelation);
    } else {
      if (!isManyToOne(referenceRelation)) {
        throw new Error(
          `OneToMany's referenct property must ManyToOne relation.`
        );
      }
      relation.referenceRelation = referenceRelation;
    }
  }
}

function fixEntityKey(builder: ContextBuilder, entity: EntityMetadata): void {
  if (!entity.key) {
    entity.key = {
      property: builder.metadata.globalKeyName,
    } as KeyMetadata;
  }
  if (!entity.key!.column) {
    let keyColumn = entity.getColumn(entity.key.property);
    if (!keyColumn) {
      // 隐式主键
      keyColumn = {
        kind: 'COLUMN',
        isImplicit: true,
        property: builder.metadata.globalKeyName,
        type: builder.metadata.globalKeyType,
        columnName: builder.metadata.globalKeyName,
        dbType: dataTypeToDbType(builder.metadata.globalKeyType),
        isIdentity: true,
        identityStartValue: 0,
        identityIncrement: 1,
        isNullable: false,
        isPrimaryKey: true,
        isCalculate: false,
        isRowflag: false,
        comment: 'Auto generic key column.',
      };
      entity.addColumn(keyColumn);
    }
    keyColumn.isPrimaryKey = true;
    entity.key.column = keyColumn;
  }
  if (!entity.key.constraintName) {
    entity.key.constraintName = `PK_${entity.dbName}_${entity.key.column.columnName}`;
  }
  if (entity.key.isNonclustered === undefined) {
    entity.key.isNonclustered = false;
  }
}

function fixEntity(builder: ContextBuilder, entity: EntityMetadata): void {
  // if (!entity.kind) {
  //   entity.kind = 'TABLE';
  //   entity.tableName = entity.className;
  // }
  // 先将列完善
  for (const member of entity.columns) {
    fixColumn(builder.metadata, entity, member);
  }

  if (!isTableEntity(entity)) return;

  entity.identityColumn = entity.columns.find(c => c.isIdentity);
  entity.rowflagColumn = entity.columns.find(c => c.isRowflag);
  fixEntityKey(builder, entity);
}

/**
 * 完成多对多声明
 * @param ctx
 * @param entity
 * @param relation
 */
function fixManyToMany(
  ctxBuilder: ContextBuilder,
  entity: TableEntityMetadata,
  relation: ManyToManyMetadata
) {
  // 不支持自引用多对多关系
  if (relation.referenceClass === entity.class) {
    throw new Error(`Not support self reference many to many relation.`);
  }
  const ctx = ctxBuilder.metadata;
  fixReferenceEntity(ctx, entity, relation);
  if (!relation.referenceProperty) {
    relation.referenceProperty = genRelationProperty(entity.className, 'many');
  }

  let referenceRelation = relation.referenceEntity.getRelation(
    relation.referenceProperty
  ) as ManyToManyMetadata;

  if (!relation.relationClass) {
    if (!referenceRelation?.relationClass) {
      relation.relationClass = class extends Entity {};
      relation.relationEntity = ctxBuilder
        .entity<any>(relation.relationClass)
        .asTable(`${entity.className}${relation.referenceEntity.className}`)
        .metadata as TableEntityMetadata;
      fixEntity(ctxBuilder, relation.relationEntity);
    } else {
      relation.relationClass = referenceRelation.relationClass;
      relation.relationEntity = referenceRelation.relationEntity;
    }
  }

  if (!relation.relationProperty) {
    relation.relationProperty =
      relation.relationClass.name || `${lowerFirst(entity.className)}`;
  }

  if (!relation.relationRelation) {
    let relationRelation = entity.getRelation(relation.relationProperty!);
    if (relationRelation) {
      if (!isOneToMany(relationRelation)) {
        throw new Error(`Relation ${entity.className}`);
      }
      relation.relationRelation = relationRelation;
    } else {
      relationRelation = {
        kind: 'ONE_TO_MANY',
        isImplicit: true,
        property: relation.relationProperty,
        isDetail: relation.isDetail,
        referenceClass: relation.relationClass,
        referenceEntity: relation.relationEntity,
      } as OneToManyMetadata;
      relation.relationRelation = relationRelation;
      entity.addRelation(relationRelation);
      fixOneToMany(ctx, entity, relationRelation);
    }
  }

  if (!referenceRelation) {
    referenceRelation = {
      property: relation.referenceProperty,
      kind: 'MANY_TO_MANY',
      isImplicit: true,
      referenceClass: entity.class,
      referenceEntity: entity,
      referenceProperty: relation.property,
      referenceRelation: relation,
      relationClass: relation.relationClass,
      relationEntity: relation.relationEntity,
    } as ManyToManyMetadata;
    relation.referenceEntity.addRelation(referenceRelation);
    relation.referenceRelation = referenceRelation;
    fixManyToMany(ctxBuilder, relation.referenceEntity, referenceRelation);
  } else {
    if (!isManyToMany(referenceRelation)) {
      throw new Error(
        `ManyToMany relation reference property must ManyToMany relation too.`
      );
    }
  }
}

/**
 * 修复一对一关系声明
 * @param ctx
 * @param entity
 * @param relation
 */
function fixOneToOne(
  ctx: DbContextMetadata,
  entity: TableEntityMetadata,
  relation: OneToOneMetadata
) {
  if (relation.isPrimary === true) {
    fixPrimaryOneToOne(ctx, entity, relation);
  } else {
    fixForeignOneToOne(ctx, entity, relation);
  }
}

function fixPrimaryOneToOne(
  ctx: DbContextMetadata,
  entity: TableEntityMetadata,
  relation: PrimaryOneToOneMetadata
) {
  if (relation.comment === undefined) {
    relation.comment = undefined;
  }
  fixReferenceEntity(ctx, entity, relation);
  if (!relation.referenceProperty) {
    relation.referenceProperty = genRelationProperty(entity.className, 'one');
  }

  if (!relation.referenceRelation) {
    let referenceRelation = relation.referenceEntity.getRelation(
      relation.referenceProperty
    );

    if (referenceRelation) {
      if (!isForeignOneToOne(referenceRelation)) {
        throw new Error(
          `PrimaryOneToOne's referenct property must ForeignOneToOne relation.`
        );
      }
      relation.referenceRelation = referenceRelation as ForeignOneToOneMetadata;
    } else {
      referenceRelation = {
        isImplicit: true,
        kind: 'ONE_TO_ONE',
        isPrimary: false,
        property: relation.referenceProperty,
        referenceClass: entity.class,
        referenceEntity: entity,
        referenceProperty: relation.property,
        referenceRelation: relation,
      } as ForeignOneToOneMetadata;
      relation.referenceEntity.addRelation(referenceRelation);
      relation.referenceRelation = referenceRelation as ForeignOneToOneMetadata;
      fixForeignOneToOne(ctx, relation.referenceEntity, referenceRelation);
    }
  }
}

function fixForeignOneToOne(
  ctx: DbContextMetadata,
  entity: TableEntityMetadata,
  relation: ForeignOneToOneMetadata
) {
  if (relation.comment === undefined) {
    relation.comment = undefined;
  }
  fixReferenceEntity(ctx, entity, relation);
  if (relation.isRequired === undefined) {
    relation.isRequired = false;
  }
  if (relation.isCascade === undefined) {
    relation.isCascade = false;
  }

  fixForeignProperty(entity, relation);

  fixRelationIndex(entity, relation);

  if (!relation.referenceProperty) {
    relation.referenceProperty = genRelationProperty(entity.className, 'one');
  }

  if (!relation.referenceRelation) {
    let referenceRelation: OneToOneMetadata =
      relation.referenceEntity.getRelation(
        relation.referenceProperty
      ) as OneToOneMetadata;
    if (!referenceRelation) {
      referenceRelation = {
        kind: 'ONE_TO_ONE',
        isImplicit: true,
        referenceClass: entity.class,
        referenceEntity: entity,
        isPrimary: true,
        referenceRelation: relation,
        property: relation.referenceProperty,
        isDetail: false,
      };
      relation.referenceEntity.addRelation(referenceRelation);
      relation.referenceRelation = referenceRelation;
      fixOneToOne(ctx, relation.referenceEntity, referenceRelation);
    } else {
      if (!isPrimaryOneToOne(referenceRelation)) {
        throw new Error(
          `ForeignOneToOne's referenct property must PrimaryOneToOne relation.`
        );
      }
      relation.referenceRelation = referenceRelation;
    }
  }
}

/**
 * 确保外键生效
 * @param entity
 * @param relation
 */
function fixForeignProperty(
  entity: TableEntityMetadata,
  relation: ManyToOneMetadata | ForeignOneToOneMetadata
): void {
  // 添加隐式外键列
  if (!relation.foreignProperty) {
    relation.foreignProperty = `${relation.property}Id`;
  }

  let column = entity.getColumn(relation.foreignProperty);
  if (!column) {
    column = {
      isImplicit: true,
      property: relation.foreignProperty,
      columnName: relation.foreignProperty,
      kind: 'COLUMN',
      type: relation.referenceEntity.key!.column.type,
      dbType: relation.referenceEntity.key!.column.dbType,
      isNullable: !relation.isRequired,
      isPrimaryKey: false,
      isCalculate: false,
      isIdentity: false,
      isRowflag: false,
    };
    entity.addColumn(column);
  } else {
    // if (relation.isRequired && column.isNullable === false) {
    //   console.warn(`Conflict Foreign column  isRequired is 'true`)
    //   // throw new Error(`Foreign column nullable must 'false' when relation isRequired is 'true'.`)
    // }
    // if (column.isNullable === undefined) {
    column.isNullable = !relation.isRequired;
    // }
    // 外键类型兼容检查
    if (
      column.type !== relation.referenceEntity.key!.column.type ||
      !isSameDbType(column.dbType, relation.referenceEntity.key!.column.dbType)
    ) {
      throw new Error(
        `Entity ${entity.className} colum ${column.property} type incompatible for foreign key.`
      );
    }
  }

  if (!relation.foreignColumn) {
    relation.foreignColumn = column;
  }

  if (!relation.constraintName) {
    relation.constraintName = `FK_${entity.dbName}_${
      relation.foreignColumn.columnName
    }_${relation.referenceEntity.dbName}_${
      relation.referenceEntity.key!.column.columnName
    }`;
  }
}

function fixReferenceEntity(
  ctx: DbContextMetadata,
  entity: TableEntityMetadata,
  relation: RelationMetadata
) {
  if (!relation.referenceEntity) {
    const referenceEntity = ctx.getEntity(relation.referenceClass);
    if (!referenceEntity) {
      throw new Error(
        `Entity ${relation.referenceClass.name} is not defined with entity.`
      );
    }
    if (!isTableEntity(referenceEntity)) {
      throw new Error(
        `Entity ${entity.className} relation ${relation.property} reference entity ${referenceEntity.className} is not TableEntity.`
      );
    }
    relation.referenceEntity = referenceEntity;
  }
}

/**
 * 生成一个关系属性名称
 * @param entity
 * @param referenceType
 * @param type
 * @returns
 */
function genRelationProperty(
  // entity: TableEntityMetadata,
  referenceType: string,
  type: 'one' | 'many'
): string {
  let property = lowerFirst(referenceType);
  if (type === 'many') {
    property = complex(property);
  }
  // while (entity.getMember(property)) {
  //   property = '_' + property;
  // }
  return property;
}

export class ContextBuilder<T extends DbContext = DbContext> {
  public readonly metadata: DbContextMetadata;
  constructor(ctr: new (...args: any) => T) {
    this.metadata = new DbContextMetadata(ctr);
    this.metadata.className = ctr.name;
  }

  /**
   * 实体映射
   */
  private _entityMap: Map<EntityType, EntityBuilder<any>> = new Map();

  /**
   * 是否已经完成
   */
  private _isReady: boolean = false;

  get isReady() {
    return this._isReady;
  }

  /**
   * 指定数据连接
   */
  connectWith(connectionOptions: ConnectOptions) {
    this.metadata.connection = connectionOptions;
  }
  hasComment(comment: string) {
    this.metadata.comment = comment;
  }

  /**
   * 声明实体
   */
  entity<T extends Entity>(ctr: EntityConstructor<T>): EntityBuilder<T>;
  entity<T extends Entity>(
    ctr: EntityConstructor<T>,
    build: (builder: EntityBuilder<T>) => void
  ): this;
  entity<T extends Entity>(
    ctr: EntityConstructor<T>,
    build?: (builder: EntityBuilder<T>) => void
  ): EntityBuilder<T> | this {
    if (this._isReady)
      throw new Error(`Context is completed, not allow this operation.`);
    if (!this._entityMap.has(ctr)) {
      const metadata: EntityMetadata = new EntityMetadata();
      Object.assign(metadata, {
        kind: 'TABLE',
        dbName: ctr.name,
        className: ctr.name,
        class: ctr,
        contextClass: this.metadata.class,
      });
      const eb = new EntityBuilder<T>(this, metadata);
      this._entityMap.set(ctr, eb);
      this.metadata.addEntity(metadata);
    }
    const builder = this._entityMap.get(ctr)!;
    if (build) {
      build(builder);
      return this;
    }
    return builder;
  }

  // /**
  //  * 将实体绑定到表中
  //  * @param ctr
  //  */
  // table<T extends Entity>(ctr: Constructor<T>): EntityBuilder<T>;
  // table<T extends Entity>(
  //   ctr: Constructor<T>,
  //   build: (builder: EntityBuilder<T>) => void
  // ): this;
  // table<T extends Entity>(
  //   ctr: Constructor<T>,
  //   build?: (builder: EntityBuilder<T>) => void
  // ): EntityBuilder<T> | this {
  //   const builder = this.entity(ctr).asTable();
  //   if (build) {
  //     build(builder);
  //     return this;
  //   }
  //   return builder;
  // }

  // /**
  //  * 将实体绑定到视图当中
  //  * @param ctr
  //  */
  // view<T extends Entity>(ctr: Constructor<T>): ViewEntityBuilder<T>;
  // view<T extends Entity>(
  //   ctr: Constructor<T>,
  //   build: (builder: ViewEntityBuilder<T>) => void
  // ): this;
  // view<T extends Entity>(
  //   ctr: Constructor<T>,
  //   build?: (builder: ViewEntityBuilder<T>) => void
  // ): ViewEntityBuilder<T> | this {
  //   const builder = this.entity(ctr).asView();
  //   if (build) {
  //     build(builder);
  //     return this;
  //   }
  //   return builder;
  // }

  // /**
  //  * 将实体绑定到查询当中
  //  * @param ctr
  //  */
  // query<T extends Entity>(ctr: Constructor<T>): QueryEntityBuilder<T>;
  // query<T extends Entity>(
  //   ctr: Constructor<T>,
  //   build: (builder: QueryEntityBuilder<T>) => void
  // ): this;
  // query<T extends Entity>(
  //   ctr: Constructor<T>,
  //   build?: (builder: QueryEntityBuilder<T>) => void
  // ): QueryEntityBuilder<T> | this {
  //   const builder = this.entity(ctr).asQuery();
  //   if (build) {
  //     build(builder);
  //     return this;
  //   }
  //   return builder;
  // }

  /**
   * 结束建模过程并完善数据并校验完整性
   */
  ready() {
    if (this._isReady)
      throw new Error(
        `Context is completed, use 'context(Context, build)' will auto call the complete.`
      );
    if (!this.metadata.database) {
      this.metadata.database = this.metadata.className;
    }

    if (!this.metadata.globalKeyName) {
      this.metadata.globalKeyName = 'id';
      this.metadata.globalKeyType = BigInt;
    }

    for (const entity of this.metadata.entities) {
      fixEntity(this, entity);
    }

    // 处理关联关系
    for (const entity of this.metadata.entities) {
      if (!isTableEntity(entity)) continue;
      fixEntityIndexes(entity);
      fixEntityRelations(this, entity);
    }

    this._isReady = true;
    // 注册进 metadataStore中
    metadataStore.registerContext(this.metadata);
  }

  /**
   * 指定全局主键字段名称
   */
  hasGlobalKey(
    name: string,
    type:
      | NumberConstructor
      | StringConstructor
      | BigIntConstructor
      | UuidConstructor
  ): this {
    this.metadata.globalKeyName = name;
    this.metadata.globalKeyType = type;
    return this;
  }
}

function fixEntityRelations(
  builder: ContextBuilder,
  entity: TableEntityMetadata
) {
  for (const member of entity.relations) {
    switch (member.kind) {
      case 'MANY_TO_ONE':
        fixManyToOne(builder.metadata, entity, member);
        break;
      case 'ONE_TO_MANY':
        fixOneToMany(builder.metadata, entity, member);
        break;
      case 'MANY_TO_MANY':
        fixManyToMany(builder, entity, member);
        break;
      case 'ONE_TO_ONE':
        fixOneToOne(builder.metadata, entity, member);
        break;
    }
  }
}

/**
 * Js类型转换为默认数据库类型
 * @param dataType
 * @returns
 */
function dataTypeToDbType(dataType: DataType): DbType {
  if (Array.isArray(dataType)) {
    return DbType.array(dataTypeToDbType(dataType[0]));
  }
  switch (dataType) {
    case String:
      return DbType.string(DbType.MAX);
    case Number:
      return DbType.int32;
    case Boolean:
      return DbType.boolean;
    case Date:
      return DbType.datetime;
    case Buffer:
    case ArrayBuffer:
    case SharedArrayBuffer:
      return DbType.binary(DbType.MAX);
    case Object:
      return DbType.object();
    case BigInt:
      return DbType.int64;
    case Uuid:
      return DbType.uuid;
    case Decimal:
      return DbType.decimal(18, 6);
    default:
      throw new Error(
        `Unsupport to default db type ${dataType}, please set DbType explicitly`
      );
  }
}

export class ModelBuilder {
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {}

  private buildDecoratorDbContext(target: DbContextConstructor) {
    const connectionOptions = getConnectionOptions(target);
    if (connectionOptions) {
      this.context(target).metadata.connection = connectionOptions;
    }
    const contextOptions = getContextOptions(target);
    if (contextOptions) {
      Object.assign(this.context(target).metadata, contextOptions);
    }
    const comment = getComment(target);
    if (comment) {
      this.context(target).hasComment(comment);
    }
  }

  private buildDecoratorEntity(target: EntityConstructor<any>) {
    const entityOptions = getEntityOptions(target)!;
    const { contextGetter, ...assignable } = entityOptions;
    const entityBuilder = this.context(contextGetter?.() || DbContext).entity(
      target
    );

    // Object.assign(entityBuilder.metadata, assignable);
    if (assignable.dbName) {
      entityBuilder.hasName(assignable.dbName);
    }

    // if (assignable.readonly) {
    //   entityBuilder.isReadonly()
    // }

    const columnProperties = getEntityColumns(target);
    if (columnProperties) {
      for (const property of columnProperties) {
        const columnOptions = getColumnOptions(target, property);
        if (columnOptions) {
          const columnBuilder = entityBuilder.property(
            p => p[property],
            columnOptions.type as any
          );
          if (columnOptions.columnName) {
            columnBuilder.hasColumnName(columnOptions.columnName);
          }
          if (columnOptions.dbType) {
            columnBuilder.hasType(columnOptions.dbType);
          }
          if (columnOptions.defaultValueGetter) {
            columnBuilder.hasDefaultValue(columnOptions.defaultValueGetter());
          }
          if (columnOptions.isNullable !== undefined) {
            if (columnOptions.isNullable) {
              columnBuilder.isNullable();
            } else {
              columnBuilder.isRequired();
            }
          }
          if (columnOptions.generator) {
            columnBuilder.isAutogen(columnOptions.generator);
          }
          if (columnOptions.isIdentity) {
            columnBuilder.isIdentity(
              columnOptions.identityStartValue,
              columnOptions.identityIncrement
            );
          }
          if (columnOptions.isCalculate) {
            columnBuilder.isCalculated(
              columnOptions.calculateExpressionGetter!()
            );
          }
          if (columnOptions.isRowflag) {
            columnBuilder.isRowflag();
          }

          const comment = getComment(target, property);
          if (comment) {
            columnBuilder.hasComment(comment);
          }
        }

        const indexOptions = getIndexOptions(target, property);
        if (indexOptions) {
          entityOptions.indexes.push(indexOptions);
        }
      }
    }
    if (assignable.kind === 'TABLE') {
      entityBuilder.asTable();
      const keyOptions = getEntityKeyOptions(target);
      if (keyOptions) {
        const keyBuilder = entityBuilder.hasKey(p => p[keyOptions.property!]);
        Object.assign(keyBuilder.metadata, keyOptions);
      }

      const relationProperties = getEntityRelations(target);
      if (relationProperties) {
        for (const property of relationProperties) {
          const relationOptions = getRelationOptions(target, property)!;
          let builder:
            | OneToOneBuilder<any, any>
            | OneToManyBuilder<any, any>
            | ManyToOneBuilder<any, any>
            | ManyToManyBuilder<any, any>;
          switch (relationOptions.kind) {
            case 'ONE_TO_ONE': {
              const map = entityBuilder
                .hasOne(
                  p => p[property],
                  relationOptions.referenceEntityGetter()
                )
                .withOne(
                  relationOptions.referenceProperty
                    ? p => p[relationOptions.referenceProperty!]
                    : undefined
                );
              if (relationOptions.isPrimary) {
                builder = map.isPrimary();
              } else {
                let bd: ForeignOneToOneBuilder<any, any>;
                builder = bd = map.hasForeignKey(
                  relationOptions.foreignProperty
                    ? p => p[relationOptions.foreignProperty!]
                    : undefined
                );
                if (relationOptions.isRequired) {
                  bd.isRequired();
                }
              }
              const comment = getComment(target, property);
              if (comment) {
                builder.hasComment(comment);
              }
              break;
            }
            case 'ONE_TO_MANY': {
              builder = entityBuilder
                .hasMany(
                  p => p[property],
                  relationOptions.referenceEntityGetter()
                )
                .withOne(
                  relationOptions.referenceProperty
                    ? (p: any) => p[relationOptions.referenceProperty!]
                    : undefined
                );
              break;
            }
            case 'MANY_TO_ONE': {
              builder = entityBuilder
                .hasOne(
                  p => p[property],
                  relationOptions.referenceEntityGetter()
                )
                .withMany(
                  relationOptions.referenceProperty
                    ? p => p[relationOptions.referenceProperty!]
                    : undefined
                );
              if (relationOptions.foreignProperty) {
                builder.hasForeignKey(p => p[relationOptions.foreignProperty!]);
              }
              if (relationOptions.isRequired) {
                builder.isRequired();
              }
              const comment = getComment(target, property);
              if (comment) {
                builder.hasComment(comment);
              }
              break;
            }
            case 'MANY_TO_MANY': {
              builder = entityBuilder
                .hasMany(
                  p => p[property],
                  relationOptions.referenceEntityGetter()
                )
                .withMany(
                  relationOptions.referenceProperty
                    ? (p: any) => p[relationOptions.referenceProperty!]
                    : undefined
                );
              // 查找中间表声明
              for (const relationEntity of getDecorateEntities()!) {
                const among = getAmong(relationEntity);
                if (!among) continue;

                const leftMatch =
                  among.leftEntityGetter() === target &&
                  among.rightEngityGetter() ===
                    relationOptions.referenceEntityGetter();
                const rightMatch =
                  among.rightEngityGetter() === target &&
                  among.leftEntityGetter() ===
                    relationOptions.referenceEntityGetter();
                if (leftMatch || rightMatch) {
                  // 声明表
                  builder.hasRelationTable(
                    relationEntity,
                    relationOptions.relationProperty
                      ? p => p[relationOptions.relationProperty!]
                      : undefined
                  );

                  if (relationOptions.relationProperty) {
                    if (leftMatch && among.leftProperty) {
                      entityBuilder
                        .hasMany(
                          p => p[relationOptions.relationProperty!],
                          relationEntity
                        )
                        .withOne((p: any) => p[among.leftProperty! ]);
                    } else if (rightMatch && among.rightProperty) {
                      entityBuilder
                        .hasMany(
                          p => p[relationOptions.relationProperty!],
                          relationEntity
                        )
                        .withOne((p: any) => p[among.rightProperty!]);
                    }
                  }
                }
              }
              break;
            }
          }
        }
      }

      const among = getAmong(target);
      if (among) {
        if (among.leftProperty) {
          entityBuilder
            .hasOne(p => p[among.leftProperty!], among.leftEntityGetter())
            .withMany();
        }
        if (among.rightProperty) {
          entityBuilder.hasOne(
            p => p[among.rightProperty!],
            among.rightEngityGetter()
          );
        }
      }
      entityOptions.indexes.forEach(indexOptions => {
        const indexBuilder = entityBuilder.hasIndex(indexOptions.name!);
        indexBuilder.withProperties(
          Array.isArray(indexOptions.properties)
            ? p => indexOptions.properties as any
            : indexOptions.properties!
        );
        if (indexOptions.isUnique !== undefined) {
          indexBuilder.isUnique(indexOptions.isUnique);
        }
      });
    } else if (assignable.kind === 'VIEW') {
      if (!assignable.body) {
        throw new Error(`View entity must specify body statement.`);
      }
      entityBuilder.asView(assignable.body);
    } else if (assignable.kind === 'QUERY') {
      if (!assignable.sql) {
        throw new Error(`Query entity must specify body statement.`);
      }
      entityBuilder.asQuery(assignable.sql);
    }
  }

  static readonly instance = new ModelBuilder();

  private contextMap: Map<DbContextConstructor, ContextBuilder> = new Map();

  /**
   * 声明数据库上下文类
   * @param context 数据库上下文类
   * @param build 模型构建在此函数中完成，在build函数完成后会自动调用 builder.ensure()
   */
  context<T extends DbContext>(
    context: DbContextConstructor<T>,
    build: (builder: ContextBuilder<T>) => void | Promise<void>
  ): this;
  context<T extends DbContext>(
    context: DbContextConstructor<T>
  ): ContextBuilder<T>;
  context<T extends DbContext>(
    context: DbContextConstructor<T>,
    build?: (builder: ContextBuilder<T>) => void | Promise<void>
  ): ContextBuilder<T> | this {
    let builder = this.contextMap.get(context);
    if (!builder) {
      builder = new ContextBuilder(context);
      this.contextMap.set(context, builder);
    }
    if (build) {
      build(builder);
      return this;
    }
    return builder;
  }

  /**
   * 完成建模工作
   * 此方法请在ORM准备完毕时调用
   */
  ready() {
    const decorateContexts = getDecorateContexts();
    if (decorateContexts) {
      for (const context of decorateContexts) {
        this.buildDecoratorDbContext(context);
      }
    }

    const decoratorEntities = getDecorateEntities();
    if (decoratorEntities) {
      for (const entity of decoratorEntities) {
        this.buildDecoratorEntity(entity);
      }
    }

    for (const ctxBuilder of this.contextMap.values()) {
      if (!ctxBuilder.isReady) {
        ctxBuilder.ready();
      }
    }
  }
}

export const modelBuilder = ModelBuilder.instance;

// export const defaultDbContextBuilder = modelBuilder.context(DbContext);

// /**
//  * 实体映射构造器
//  */
// export class EntityMapBuilder<T extends Entity> {
//   constructor(
//     private contextBuilder: ContextBuilder,
//     public readonly metadata: EntityMetadata
//   ) {}

//   private builder?: EntityBuilder<T>;

//   private _assertKind(kind: EntityMetadata['kind']): boolean {
//     if (this.metadata.kind) {
//       if (this.metadata.kind !== kind) {
//         throw new Error(
//           `Entity ${this.metadata.class!.name} is declared as ${
//             this.metadata.kind
//           }`
//         );
//       }
//       return true;
//     }
//     return false;
//   }

//   /**
//    * 实体声明为表
//    */
//   asTable(name?: string): EntityBuilder<T>;
//   asTable(build: (builder: EntityBuilder<T>) => void): ContextBuilder;
//   asTable(
//     name: string,
//     build: (builder: EntityBuilder<T>) => void
//   ): ContextBuilder;
//   asTable(
//     nameOrBuild?: string | ((builder: EntityBuilder<T>) => void),
//     build?: (builder: EntityBuilder<T>) => void
//   ): EntityBuilder<T> | ContextBuilder {
//     if (this._assertKind('TABLE')) {
//       if (arguments.length > 0) {
//         throw new Error(
//           `Entity ${this.metadata.class} is allowed declare as table once only, Pls use .asTable() to get EntityBuilder.`
//         );
//       }
//       return this.builder as EntityBuilder<T>;
//     }
//     let name: string | undefined;
//     if (typeof nameOrBuild === 'string') {
//       name = nameOrBuild;
//     } else if (typeof nameOrBuild === 'function') {
//       build = nameOrBuild;
//     }

//     const tableMetadata = this.metadata as TableEntityMetadata;
//     this.metadata.kind = 'TABLE';
//     tableMetadata.tableName = name || this.metadata.className;
//     this.metadata.readonly = false;
//     const builder = new EntityBuilder<T>(this.modelBuilder, tableMetadata);
//     this.builder = builder;
//     if (build) {
//       build(builder);
//       return this.modelBuilder;
//     }
//     return builder;
//   }

//   /**
//    * 实体声明为视图
//    */
//   asView(): ViewEntityBuilder<T>;
//   asView(name: string): ViewEntityBuilder<T>;
//   asView(build: (builder: ViewEntityBuilder<T>) => void): ViewEntityBuilder<T>;
//   asView(
//     name: string,
//     build: (builder: ViewEntityBuilder<T>) => void
//   ): ViewEntityBuilder<T>;
//   asView(
//     nameOrBuild?: string | ((builder: ViewEntityBuilder<T>) => void),
//     build?: (builder: ViewEntityBuilder<T>) => void
//   ): ViewEntityBuilder<T> {
//     if (this._assertKind('VIEW')) {
//       if (arguments.length > 0) {
//         throw new Error(
//           `Entity is allowed declare as View once only, Pls use .asView() to get EntityBuilder.`
//         );
//       }
//       return this.builder as ViewEntityBuilder<T>;
//     }
//     let name: string | undefined;
//     if (typeof nameOrBuild === 'string') {
//       name = nameOrBuild;
//     } else if (typeof nameOrBuild === 'function') {
//       build = nameOrBuild;
//     }

//     const viewMetadata = this.metadata as ViewEntityMetadata;
//     this.metadata.kind = 'VIEW';
//     viewMetadata.viewName = name || this.metadata.className;
//     this.metadata.readonly = true;
//     const builder = new ViewEntityBuilder<T>(this.modelBuilder, viewMetadata);
//     if (build) {
//       build(builder);
//     }
//     this.builder = builder;
//     return builder;
//   }

//   /**
//    * 实体声明为视图
//    */
//   asQuery(): QueryEntityBuilder<T>;
//   asQuery(
//     build: (builder: QueryEntityBuilder<T>) => void
//   ): QueryEntityBuilder<T>;
//   asQuery(
//     build?: (builder: QueryEntityBuilder<T>) => void
//   ): QueryEntityBuilder<T> {
//     if (this._assertKind('QUERY')) {
//       if (arguments.length > 0) {
//         throw new Error(
//           `Entity is allowed declare as Query once only, Pls use .asQuery() to get EntityBuilder.`
//         );
//       }
//       return this.builder as QueryEntityBuilder<T>;
//     }

//     this.metadata.kind = 'QUERY';
//     this.metadata.readonly = true;
//     const builder = new QueryEntityBuilder<T>(this.modelBuilder, this.metadata);
//     if (build) {
//       build(builder);
//     }
//     this.builder = builder;
//     return builder;
//   }
// }

/**
 * 实体构造器
 * 列可以重复获取，关系不可以重复获取
 */
export class EntityBuilder<T extends Entity> {
  constructor(
    protected contextBuilder: ContextBuilder,
    public readonly metadata: EntityMetadata
  ) {}

  protected readonly relationMaps: Map<
    string,
    HasOneBuilder<T, Entity> | HasManyBuilder<T, Entity>
  > = new Map();

  protected readonly columnMaps: Map<string, PropertyBuilder<T>> = new Map();

  private assertRelation(property: string) {
    if (this.relationMaps.has(property) || this.columnMaps.has(property)) {
      throw new Error(`Property or Relation ${property} is declared`);
    }
  }

  private assertKind() {
    if (this.metadata.kind) {
      throw new Error('Not allow set a entity kind twice in modeling.');
    }
  }

  asTable(name?: string): EntityBuilder<T>;
  asTable(build: (builder: EntityBuilder<T>) => void): ContextBuilder;
  asTable(
    name: string,
    build: (builder: EntityBuilder<T>) => void
  ): ContextBuilder;
  asTable(
    nameOrBuild?: string | ((builder: EntityBuilder<T>) => void),
    build?: (builder: EntityBuilder<T>) => void
  ): EntityBuilder<T> | ContextBuilder {
    // this.assertKind();
    let tableName: string | undefined;
    if (typeof nameOrBuild === 'string') {
      tableName = nameOrBuild;
    } else if (typeof nameOrBuild === 'function') {
      build = nameOrBuild;
    }

    const tableMetadata = this.metadata as TableEntityMetadata;
    this.metadata.kind = 'TABLE';
    tableMetadata.dbName = tableName || this.metadata.className;
    this.metadata.readonly = false;
    if (build) {
      build(this);
      return this.contextBuilder;
    }
    return this;
  }

  // asTable(tableName?: string): Omit<this, 'asTable' | 'asView' | 'asQuery'> {

  // }

  // asView(body: Select<T>): Omit<this, 'asTable' | 'asView' | 'asQuery'>
  // asView(viewName: string, body: Select<T>): Omit<this, 'asTable' | 'asView' | 'asQuery'>
  // asView(bodyOrViewName: Select<T> | string, body?: Select<T>): Omit<this, 'asTable' | 'asView' | 'asQuery'> {
  //   // this.assertKind();
  //   let viewName: string;
  //   if (!body) {
  //     body = bodyOrViewName as Select<T>;
  //     viewName = this.metadata.class.name;
  //   } else {
  //     viewName = bodyOrViewName as string;
  //   }

  //   this.metadata.kind = 'VIEW';
  //   this.metadata.viewName = viewName;
  //   this.metadata.body = body;
  //   this.metadata.readonly = true;
  //   return this;
  // }

  // asQuery(sql: Select<T>): Omit<this, 'asTable' | 'asView' | 'asQuery'> {
  //   // this.assertKind();
  //   if (this.metadata.kind) {
  //     throw new Error('Not allow change entity kind twice in modeling.')
  //   }

  //   this.metadata.kind = 'QUERY';
  //   this.metadata.sql = sql;
  //   this.metadata.readonly = true;
  //   return this;
  // }

  // hasBody(body: Select<T>) {
  //   if (this.metadata.kind !== 'VIEW') {
  //     throw new Error(`Not need query sql when entity is not View.`)
  //   }
  //   this.metadata.body = body;
  // }

  // hasSql(sql: Select<T>) {
  //   if (this.metadata.kind !== 'QUERY') {
  //     throw new Error(`Not need query sql when entity is not Query.`)
  //   }
  //   this.metadata.sql = sql;
  // }

  /**
   * 实体声明为视图
   */
  asView(body: Select<T>): this;
  asView(body: Select<T>, build: (builder: this) => void): ContextBuilder;
  asView(name: string, body: Select<T>): this;
  asView(
    name: string,
    body: Select<T>,
    build: (builder: this) => void
  ): ContextBuilder;
  asView(
    nameOrBody: string | Select<T>,
    bodyOrBuild?: Select<T> | ((builder: this) => void),
    build?: (builder: this) => void
  ): this | ContextBuilder {
    let name: string | undefined;
    let body: Select<T>;
    if (typeof nameOrBody === 'string') {
      name = nameOrBody;
      body = bodyOrBuild as Select<T>;
    } else {
      body = nameOrBody;
      build = bodyOrBuild as (builder: this) => void;
    }

    this.metadata.kind = 'VIEW';
    this.metadata.dbName = name || this.metadata.className;
    this.metadata.readonly = true;
    this.metadata.body = body;
    if (build) {
      build(this);
      return this.contextBuilder;
    }
    return this;
  }

  /**
   * 实体声明为视图
   */
  asQuery(sql: Select<T>): this;
  asQuery(sql: Select<T>, build: (builder: this) => void): ContextBuilder;
  asQuery(
    sql: Select<T>,
    build?: (builder: this) => void
  ): this | ContextBuilder {
    this.metadata.kind = 'QUERY';
    this.metadata.readonly = true;
    this.metadata.sql = sql;
    if (build) {
      build(this);
      return this.contextBuilder;
    }
    return this;
  }

  hasName(name: string): this {
    this.metadata.dbName = name;
    return this;
  }

  // /**
  //  * 声明视图选择语句
  //  * 声明在函数中是为了避免循环引用时引发异常
  //  */
  // hasBody(body: Select<T>): this {
  //   this.metadata.body = body;
  //   return this;
  // }

  // withSql(sql: Select<T>): this {
  //   this.metadata.sql = sql;
  //   return this;
  // }

  /**
   * 声明主键
   */
  hasKey<P extends Scalar>(selector: (p: Required<T>) => P): TableKeyBuilder;
  hasKey<P extends Scalar>(
    constraintName: string,
    selector: (p: Required<T>) => P
  ): TableKeyBuilder;
  hasKey<P extends Scalar>(
    nameOrSelector: string | ((p: Required<T>) => P),
    selector?: (p: Required<T>) => P
  ): TableKeyBuilder {
    let constraintName: string | undefined;
    if (typeof nameOrSelector === 'function') {
      selector = nameOrSelector;
    } else {
      constraintName = nameOrSelector;
    }

    const property: string = selectProperty(selector!);
    if (!property) {
      throw new Error('Please select a property');
    }
    if (!this.metadata.key) {
      this.metadata.key = {} as KeyMetadata;
    }
    this.metadata.key = {
      property,
    } as KeyMetadata;
    if (constraintName) {
      this.metadata.key!.constraintName = constraintName;
    }
    // this.metadata.addIndex({
    //   name: undefined,
    //   properties: [property],
    //   columns: null,
    //   isUnique: true,
    //   isClustered
    // });
    return new TableKeyBuilder(this, this.metadata.key);
  }

  hasIndex(name: string): IndexBuilder<T> {
    // if (!name) {
    //   name = `IX_${this.metadata.tableName || this.metadata.className}_${index}`
    // }
    let metadata = this.metadata.getIndex(name);
    if (!metadata) {
      metadata = { name } as IndexMetadata;
      this.metadata.addIndex(metadata);
    }
    const builder = new IndexBuilder(this.contextBuilder, this, metadata);
    return builder;
  }

  /**
   * 声明一个单一引用属性
   * @param selector
   * @param type 因typescript反射机制尚不完善，因此无法获取到属性类型，因而需要传递该属性类型参数
   * @returns
   */
  // hasOne<D extends Entity>(
  //   name: string,
  //   type: Constructor<D>
  // ): HasOneBuilder<T, D>
  hasOne<D extends Entity>(
    propertySelector: (p: Required<T>) => D,
    type: EntityConstructor<D>
  ): HasOneBuilder<T, D>;
  hasOne<D extends Entity>(
    propertyOrSelector: string | ((p: Required<T>) => D),
    type: EntityConstructor<D>
  ): HasOneBuilder<T, D> {
    const property: string =
      typeof propertyOrSelector === 'function'
        ? selectProperty(propertyOrSelector)
        : propertyOrSelector;
    if (!property) {
      throw new Error(
        `Entity ${
          this.metadata.class!.name
        } hasOne selector mast return a property, example property name "user", 'builder.hasOne(p => p.user)'`
      );
    }

    this.assertRelation(property);
    const metadata: HasOneMetadata = {
      property,
      referenceClass: type,
      // 追加关联关系
      referenceEntity: this.contextBuilder.entity(type).metadata,
    } as any;
    const builder = new HasOneBuilder<T, D>(
      this.contextBuilder,
      this,
      metadata
    );
    this.relationMaps.set(property, builder);
    this.metadata.addRelation(metadata as HasOneMetadata);
    return builder;
  }

  /**
   * 声明一个集体属性
   * @param selector
   * @param type 因typescript反射机制尚不完善，因此无法获取到属性类型，因而需要传递该属性类型参数
   * @returns
   */
  hasMany<D extends Entity>(
    selector: (p: Required<T>) => D[],
    type: EntityConstructor<D>
  ): HasManyBuilder<T, D> {
    const property: string = selectProperty(selector);
    if (!property)
      throw new Error(
        `Entity ${
          this.metadata.class!.name
        } hasMany selector mast select a property like this: '.hasMany(p => p.listPropery)'.`
      );

    this.assertRelation(property);
    const metadata: Partial<HasManyMetadata> = {
      referenceClass: type,
      referenceEntity: this.contextBuilder.entity(type)
        .metadata as TableEntityMetadata,
      property: property,
      isDetail: false,
      isImplicit: false,
    };
    this.contextBuilder.entity(type);
    const builder = new HasManyBuilder<T, D>(
      this.contextBuilder,
      this,
      metadata
    );
    this.relationMaps.set(property, builder);
    this.metadata.addRelation(metadata as HasManyMetadata);
    return builder;
  }

  // TODO: 待添加种子数据结构化初始
  /**
   * 种子数据，必须指定所有字段值，包括Identity字段
   * 暂时只支持，数据表对象新增
   * 重复调用则追加
   */
  // hasData(data: T[]): this
  // hasData(data: any[]): this
  hasData(data: Record<string, Scalar>[]): this {
    // if (this.metadata.kind !== "TABLE") {
    //   throw new Error("Seed data is allowed only on table.");
    // }
    if (data.length === 0) {
      throw new Error(
        `Entity ${this.metadata.class!.name} hasData seed data is empty.`
      );
    }
    if (!this.metadata.data) this.metadata.data = [];
    this.metadata.data.push(...data);
    return this;
  }

  property<P extends Scalar>(
    selector: (p: Required<T>) => P,
    type: DataTypeOf<P>
  ): PropertyBuilder<T, P>;
  property<P extends Scalar>(
    selector: (p: Required<T>) => P,
    type: DataTypeOf<P>,
    build: (builder: PropertyBuilder<T>) => void
  ): this;
  property<D extends Scalar, P extends keyof T>(
    property: string,
    type: DataTypeOf<D>
  ): PropertyBuilder<T, D>;
  property<D extends Scalar, P extends keyof T>(
    property: string,
    type: DataTypeOf<D>,
    build: (builder: PropertyBuilder<T>) => void
  ): this;
  property<P extends Scalar>(
    propertyOrselector: string | ((p: Required<T>) => P),
    type: DataTypeOf<P>,
    build?: (builder: PropertyBuilder<T>) => void
  ): PropertyBuilder<T, P> | this {
    const property: string =
      typeof propertyOrselector === 'function'
        ? selectProperty(propertyOrselector)
        : propertyOrselector;
    if (!property) {
      throw new Error(`Please select a property`);
    }
    let columnBuilder: PropertyBuilder<T, P> | undefined = this.columnMaps.get(
      property
    ) as PropertyBuilder<T, P>;
    if (!columnBuilder) {
      const metadata: ColumnMetadata<P> = {
        kind: 'COLUMN',
        property,
        type: type as ScalarType,
      } as ColumnMetadata<P>;
      columnBuilder = new PropertyBuilder<T, P>(
        this.contextBuilder,
        this,
        metadata
      );
      this.columnMaps.set(property, columnBuilder);
      this.metadata.addColumn(metadata as ColumnMetadata);
    }

    if (build) {
      build(columnBuilder);
      return this;
    }
    return columnBuilder;
  }

  hasComment(comment: string): Omit<this, 'hasComment'> {
    this.metadata.comment = comment;
    return this;
  }

  /**
   * 可将初始化代码写于此处，支持异步方法
   */
  async forAsync(action: (builder: this) => Promise<void>): Promise<this> {
    await action(this);
    return this;
  }
}

export class TableKeyBuilder {
  constructor(
    private entityBuilder: EntityBuilder<any>,
    public readonly metadata: KeyMetadata
  ) {}

  hasComment(comment: string): this {
    this.entityBuilder.metadata.key!.comment = comment;
    return this;
  }

  /**
   * 指定约束名称
   * @param constraintName
   * @returns
   */
  hasConstraintName(constraintName: string): this {
    this.metadata.constraintName = constraintName;
    return this;
  }

  /**
   * 将主键声明为非聚焦
   * @returns
   */
  isNonclustered() {
    this.metadata.isNonclustered = true;
    return this;
  }
}

export class IndexBuilder<T extends Entity> {
  constructor(
    contextBuilder: ContextBuilder,
    entityBuilder: EntityBuilder<T>,
    public readonly metadata: IndexMetadata
  ) {}

  hasName(name: string): this {
    this.metadata.name = name;
    return this;
  }

  isUnique(unique: false): this;
  isUnique(unique: true, clustered: boolean): this;
  isUnique(unique?: boolean): this;
  isUnique(unique: boolean = true, clustered?: boolean): this {
    this.metadata.isUnique = unique;
    if (unique) {
      this.metadata.isClustered = clustered!;
    } else {
      this.metadata.isClustered = false;
    }
    return this;
  }

  // isClustered(clustered: boolean = true): this {
  //   this.metadata.isClustered = clustered;
  //   return this;
  // }

  hasComment(comment: string): this {
    this.metadata.comment = comment;
    return this;
  }

  // withProperties(selector: (p: Required<T>) => Scalar[]): this;
  // withProperties(selector: { [K in keyof T]?: 'ASC' | 'DESC' }): this;
  withProperties(
    selector:
      | { [K in keyof T]?: 'ASC' | 'DESC' }
      | ((p: Required<T>) => Scalar[])
  ): this {
    this.metadata.properties =
      typeof selector === 'function' ? selectProperty(selector) : selector;
    return this;
  }
}

// /**
//  * 表实体构造器
//  */
// export class EntityBuilder<T extends Entity> extends EntityBuilder<T> {
//   public readonly metadata!: TableEntityMetadata;

// }

// export class ViewEntityBuilder<T extends Entity> extends EntityBuilder<T> {
//   metadata!: ViewEntityMetadata;

// }

// export class QueryEntityBuilder<T extends Entity> extends EntityBuilder<T> {
//   metadata!: QueryEntityMetadata;

//   withSql(sql: Select<T>): this {
//     this.metadata.sql = sql;
//     return this;
//   }
// }

export class PropertyBuilder<T extends Entity, V extends Scalar = Scalar> {
  constructor(
    private readonly contextBuilder: ContextBuilder,
    private readonly entityBuilder: EntityBuilder<T>,
    public readonly metadata: Partial<ColumnMetadata<V>>
  ) {}

  /**
   * 声明为列
   */
  hasColumnName(columnName: string): Omit<this, 'hasName'> {
    this.metadata.columnName = columnName;
    return this;
  }

  /**
   * 数据类型
   */
  hasType(dbType: DbType): Omit<this, 'hasType'> {
    this.metadata.dbType = dbType;
    return this;
  }

  /**
   * 列自动填充值，通过表达式生成，如调用函数等
   * @param generator
   * @returns
   */
  isAutogen(
    generator: (
      rowset: ProxiedRowset<T>,
      item: T,
      context: DbInstance
    ) => CompatibleExpression<V>
  ): Omit<this, 'isAutogen'> {
    this.metadata.generator = generator as any;
    return this;
  }

  /**
   * 是否可空
   */
  isNullable(): Omit<this, 'isNullable'> {
    this.metadata.isNullable = true;
    return this;
  }

  isRequired(): this {
    this.metadata.isNullable = false;
    return this;
  }

  /**
   * 行标记列，每次更新时自动变换值
   */
  isRowflag(): Omit<this, 'isRowflag'> {
    // if (this.metadata.dbType) {
    //   if (this.metadata.dbType.name !== 'ROWFLAG') {
    //     throw new Error('Rowflag column must type of ROWFLAG.');
    //   }
    // } else {
    this.metadata.dbType = DbType.rowflag;
    // }
    this.metadata.isRowflag = true;
    return this;
  }

  /**
   * 标识列
   */
  isIdentity(seed?: number, step?: number): Omit<this, 'isIdentity'> {
    this.metadata.isIdentity = true;
    this.metadata.identityStartValue = seed ?? 0;
    this.metadata.identityIncrement = step ?? 1;
    return this;
  }

  /**
   * 默认值
   */
  hasDefaultValue(
    expr: CompatibleExpression<V>
  ): Omit<this, 'hasDefaultValue' | 'asCalculated'> {
    this.metadata.defaultValue = Expression.ensure(expr);
    return this;
  }

  /**
   * 摘要说明
   */
  hasComment(comment: string): Omit<this, 'commentBy'> {
    this.metadata.comment = comment;
    return this;
  }

  /**
   * 将列声明为计算列
   */
  isCalculated(expr: CompatibleExpression<V>): this {
    this.metadata.isCalculate = true;
    this.metadata.calculateExpression = Expression.ensure(expr);
    return this;
  }
}

export class HasOneBuilder<S extends Entity, D extends Entity> {
  constructor(
    private contextBuilder: ContextBuilder,
    private entityBuilder: EntityBuilder<S>,
    public readonly metadata: Partial<HasOneMetadata>
  ) {}

  private assertWith() {
    if (this.metadata.kind) {
      throw new Error(
        `HasManyMetadata is withed ${this.metadata.kind} relation.`
      );
    }
  }

  withOne(selector?: (p: Required<D>) => S): OneToOneMapBuilder<S, D> {
    this.assertWith();
    this.metadata.kind = 'ONE_TO_ONE';
    if (this.metadata.referenceProperty) {
      const referenceRelation = this.metadata.referenceEntity!.getRelation(
        this.metadata.referenceProperty
      ) as OneToOneMetadata;
      if (referenceRelation) {
        // 相互关联对向关系
        this.metadata.referenceRelation = referenceRelation;
        referenceRelation.referenceRelation = this.metadata as OneToOneMetadata;
        referenceRelation.referenceProperty = this.metadata.property;
      }
    }
    if (selector) {
      this.metadata.referenceProperty = selectProperty(selector);
      if (!this.metadata.referenceProperty) {
        throw new Error('Please select a property');
      }
    }
    const oneToOne = new OneToOneMapBuilder<S, D>(
      this.contextBuilder,
      this.entityBuilder,
      this.metadata as OneToOneMetadata
    );
    return oneToOne;
  }

  withMany(selector?: (p: Required<D>) => S[]): ManyToOneBuilder<S, D> {
    this.assertWith();
    this.metadata.kind = 'MANY_TO_ONE';
    if (selector) {
      this.metadata.referenceProperty = selectProperty(selector);
      if (!this.metadata.referenceProperty) {
        throw new Error('Please select a property');
      }
      const referenceRelation = this.metadata.referenceEntity!.getRelation(
        this.metadata.referenceProperty
      ) as OneToManyMetadata;
      if (referenceRelation) {
        // 相互关联对向关系
        this.metadata.referenceRelation = referenceRelation;
        referenceRelation.referenceRelation = this
          .metadata as ManyToOneMetadata;
        referenceRelation.referenceProperty = this.metadata.property!;
      }
    }
    const oneToMay = new ManyToOneBuilder<S, D>(
      this.contextBuilder,
      this.entityBuilder,
      this.metadata as ManyToOneMetadata
    );
    return oneToMay;
  }
}

export class HasManyBuilder<S extends Entity, D extends Entity> {
  constructor(
    private readonly contextBuilder: ContextBuilder,
    private readonly entityBuilder: EntityBuilder<S>,
    public readonly metadata: Partial<HasManyMetadata>
  ) {}

  private assertWith() {
    if (this.metadata.kind) {
      throw new Error(
        `HasManyMetadata is withed ${this.metadata.kind} relation.`
      );
    }
  }

  withOne(selector?: (p: Required<D>) => S): OneToManyBuilder<S, D> {
    this.assertWith();
    this.metadata.kind = 'ONE_TO_MANY';
    if (selector) {
      this.metadata.referenceProperty = selectProperty(selector);
      if (!this.metadata.referenceProperty) {
        throw new Error('Please select a property');
      }
      const referenceRelation = this.metadata.referenceEntity!.getRelation(
        this.metadata.referenceProperty
      ) as ManyToOneMetadata;
      if (referenceRelation) {
        this.metadata.referenceRelation = referenceRelation;
        referenceRelation.referenceRelation = this
          .metadata as OneToManyMetadata;
        referenceRelation.referenceProperty = this.metadata.property!;
      }
    }
    const manyToOne = new OneToManyBuilder<S, D>(
      this.contextBuilder,
      this.entityBuilder,
      this.metadata as OneToManyMetadata
    );
    return manyToOne;
  }

  withMany(selector?: (p: Required<D>) => S[]): ManyToManyBuilder<S, D> {
    this.assertWith();
    this.metadata.kind = 'MANY_TO_MANY';
    const metadata: Partial<ManyToManyMetadata> = this
      .metadata as ManyToManyMetadata;
    if (selector) {
      metadata.referenceProperty = selectProperty(selector);
      if (!metadata.referenceProperty) {
        throw new Error('Please select a property');
      }
      const referenceRelation = this.metadata.referenceEntity!.getRelation(
        this.metadata.referenceProperty!
      ) as ManyToManyMetadata | undefined;
      if (referenceRelation) {
        // 相互关联对向关系
        this.metadata.referenceRelation = referenceRelation;
        referenceRelation.referenceRelation = this
          .metadata as ManyToManyMetadata;
        referenceRelation.referenceProperty = this.metadata.property!;
      }
    }

    const builder = new ManyToManyBuilder<S, D>(
      this.contextBuilder,
      this.entityBuilder,
      this.metadata as ManyToManyMetadata
    );
    return builder;
  }
}

export class OneToOneMapBuilder<S extends Entity, D extends Entity> {
  constructor(
    private readonly contextBuilder: ContextBuilder,
    private readonly entityBuilder: EntityBuilder<S>,
    public readonly metadata: OneToOneMetadata
  ) {}

  /**
   * 声明当前实体在一对一关系中占主键地位
   */
  isPrimary(): PrimaryOneToOneBuilder<S, D> {
    this.assertPrimary();
    if (this.metadata.referenceProperty) {
      const referenceRelation = this.metadata.referenceEntity.getRelation(
        this.metadata.referenceProperty
      ) as OneToOneMetadata;
      if (referenceRelation) {
        if (referenceRelation.isPrimary === true) {
          throw new Error(
            `Entity ${
              this.entityBuilder.metadata!.class!.name
            } PrimaryOneToOne relation ${
              this.metadata.property
            }, reference relation must be ForeignOneToOne relation, use .hasForeignKey()`
          );
        } else {
          // 补齐
          referenceRelation.isPrimary = false;
        }
        this.metadata.referenceRelation = referenceRelation;
      }
    }
    this.metadata.isPrimary = true;
    return new PrimaryOneToOneBuilder<S, D>(
      this.contextBuilder,
      this.entityBuilder,
      this.metadata
    );
  }

  /**
   * 声明为一对一（从）关系，并指定外键属性
   * @param selector
   * @returns
   */
  hasForeignKey(selector?: (p: S) => D): ForeignOneToOneBuilder<S, D> {
    this.assertPrimary();
    this.metadata.isPrimary = false;
    if (selector) {
      const foreignProperty: string = selectProperty(selector);
      if (!foreignProperty) {
        throw new Error(`Pls select a property`);
      }
      (this.metadata as ForeignOneToOneMetadata).foreignProperty =
        foreignProperty;
    }
    return new ForeignOneToOneBuilder<S, D>(
      this.contextBuilder,
      this.entityBuilder,
      this.metadata
    );
  }

  private assertPrimary() {
    if (this.metadata.isPrimary !== undefined) {
      throw new Error(`Primary is ensured, pls do not repeat that.`);
    }
  }
}

export abstract class OneToOneBuilder<S extends Entity, D extends Entity> {
  constructor(
    private contextBuilder: ContextBuilder,
    private entityBuilder: EntityBuilder<S>,
    public readonly metadata: Partial<OneToOneMetadata>
  ) {}

  hasComment(comment: string): Omit<this, 'hasComment'> {
    this.metadata.comment = comment;
    return this;
  }
}

export class PrimaryOneToOneBuilder<
  S extends Entity,
  D extends Entity
> extends OneToOneBuilder<S, D> {
  public readonly metadata!: PrimaryOneToOneMetadata;

  /**
   * 声明为明细项
   * 获取或查询时传递withDetail选项，将自动附带
   * 删除时亦将同步删除，默认为联动删除
   */
  isDetail(): Omit<this, 'isDetail'> {
    this.metadata.isDetail = true;
    return this;
  }
}

export class ForeignOneToOneBuilder<
  S extends Entity,
  D extends Entity
> extends OneToOneBuilder<S, D> {
  public readonly metadata!: ForeignOneToOneMetadata;

  hasConstraintName(name: string): Omit<this, 'hasConstraintName'> {
    this.metadata.constraintName = name;
    return this;
  }

  isRequired(): Omit<this, 'isNullable'> {
    this.metadata.isRequired = true;
    return this;
  }

  isCascade(): Omit<this, 'isCascade'> {
    this.metadata.isCascade = true;
    return this;
  }
}

export class OneToManyBuilder<S extends Entity, D extends Entity> {
  isDetail(): this {
    this.metadata.isDetail = true;
    return this;
  }

  constructor(
    private readonly contextBuilder: ContextBuilder,
    private readonly entityBuilder: EntityBuilder<S>,
    public readonly metadata: OneToManyMetadata
  ) {}
}

export class ManyToOneBuilder<S extends Entity, D extends Entity> {
  constructor(
    private readonly contextBuilder: ContextBuilder,
    private readonly entityBuilder: EntityBuilder<S>,
    public readonly metadata: ManyToOneMetadata
  ) {}

  hasConstraintName(name: string) {
    this.metadata.constraintName = name;
  }

  /**
   * 声明外键属性
   * @param selector
   * @returns
   */
  hasForeignKey<P extends Scalar>(selector: (p: Required<S>) => P): this {
    if (selector) {
      const property: string = selectProperty(selector);
      if (!property) throw new Error(`Please select a property.`);
      this.metadata.foreignProperty = property;
      // const foreingColumn = this.entityBuilder.metadata.getColumn(property);
      // if (!foreingColumn) {
      //   this.entityBuilder.column(property, );
      //   this.metadata.foreignColumn = this.entityBuilder.column(property);
      // }
    }
    return this;
  }

  isRequired(): this {
    this.metadata.isRequired = true;
    return this;
  }

  isCascade(): Omit<this, 'isCascade'> {
    this.metadata.isCascade = true;
    return this;
  }

  hasComment(comment: string): Omit<this, 'hasComment'> {
    this.metadata.comment = comment;
    return this;
  }
}

export class ManyToManyBuilder<S extends Entity, D extends Entity> {
  constructor(
    private readonly contextBuilder: ContextBuilder,
    private readonly entityBuilder: EntityBuilder<S>,
    public readonly metadata: ManyToManyMetadata
  ) {}
  /**
   * 显式声明关系中间表
   * 仅要一方声明中间表即可，无须双方声明
   */
  hasRelationTable<T extends Entity>(
    ctr: EntityConstructor<T>,
    /**
     * 中间表导航属性
     */
    relationPropertySelector?: (p: Required<S>) => T[],
    build?: (builder: EntityBuilder<T>) => void
  ): EntityBuilder<T> {
    if (relationPropertySelector) {
      this.metadata.relationProperty = selectProperty(relationPropertySelector);
    }
    const builder: EntityBuilder<T> = this.contextBuilder.entity(ctr);
    if (build) {
      build(builder);
    }
    this.metadata.relationClass = ctr;
    this.metadata.relationEntity = builder.metadata as TableEntityMetadata;
    if (this.metadata.referenceProperty) {
      const referenceRelation = this.metadata.referenceEntity.getRelation(
        this.metadata.referenceProperty
      ) as ManyToManyMetadata;
      if (referenceRelation) {
        if (referenceRelation.relationClass) {
          throw new Error(`Duplicate relation entity declare.`);
        }
        referenceRelation.relationClass = ctr;
        referenceRelation.relationEntity = this.metadata.relationEntity;
      }
    }
    return builder;
  }

  isDetail(): this {
    this.metadata.isDetail = true;
    return this;
  }

  /**
   * 指定约束名称
   */
  hasConstraintName(name: string): this {
    this.metadata.relationConstraintName = name;
    return this;
  }
}
