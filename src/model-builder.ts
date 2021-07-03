/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/ban-types */
/* eslint-disable @typescript-eslint/no-unused-vars */

import { CompatibleExpression, Expression, ProxiedRowset, Select } from './ast';
import { DbContext } from './db-context';
import {
  ManyToManyMetadata,
  ColumnMetadata,
  EntityMetadata,
  DbContextMetadata,
  TableEntityMetadata,
  HasOneMetadata,
  HasManyMetadata,
  ViewEntityMetadata,
  QueryEntityMetadata,
  OneToOneMetadata,
  OneToManyMetadata,
  ManyToOneMetadata,
  ForeignOneToOneMetadata,
  PrimaryOneToOneMetadata,
  EntityMemberMetadata,
  EntityMetadataClass,
  metadataStore,
  isTableEntity,
  RelationMetadata,
  isForeignOneToOne,
  isManyToOne,
  isManyToMany,
  isPrimaryOneToOne,
  isOneToMany,
  IndexMetadata,
  ForeignRelation,
} from './metadata';
import {
  Constructor,
  DataType,
  DbType,
  Entity,
  EntityType,
  Scalar,
  ScalarType,
  DataTypeOf,
  isSameDbType,
  TsTypeOf,
  UuidConstructor,
  Uuid,
} from './types';
import { assign, complex, ensureExpression, lowerFirst } from './util';

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
    if (!index.name) {
      index.name = `IX_${entity.tableName}_${index.columns
        .map(col => col.column.columnName)
        .join('_')}`;
    }
    index.columns = index.properties.map(property => {
      const column = entity.getColumn(property);
      if (!column) {
        throw new Error(`Column ${property} not found.`);
      }
      return {
        column,
        isAscending: true,
      };
    });
  }
}

function fixRelationIndex(
  entity: TableEntityMetadata,
  relation: ForeignRelation
) {
  if (!relation.indexName) {
    relation.indexName = `${isForeignOneToOne(relation) ? 'UX' : 'IX'}_${
      entity.tableName
    }_${relation.foreignColumn.columnName}`;
  }
  let index = entity.getIndex(relation.indexName);
  if (!index) {
    index = {
      name: relation.indexName,
    } as IndexMetadata;
    entity.addIndex(index);
  } else {
    if (
      index.properties &&
      (index.properties.length !== 1 ||
        index.properties[0] !== relation.foreignProperty)
    ) {
      throw new Error(
        `Entity ${entity.className} index ${index.name} not satisfied for relation ${relation.property}`
      );
    }
  }

  if (!index.properties) {
    index.properties = [relation.foreignProperty];
  }
  if (!index.columns) {
    index.columns = index.properties.map(prop => ({
      column: entity.getColumn(prop),
      isAscending: true,
    }));
  }

  if (!Reflect.has(index, 'isUnique')) {
    index.isUnique = isForeignOneToOne(relation);
  }

  if (!Reflect.has(index, 'isClustered')) {
    index.isClustered = false;
  }
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
  if (!Reflect.has(relation, 'isRequired')) {
    relation.isRequired = false;
  }
  if (!Reflect.has(relation, 'comment')) {
    relation.comment = undefined;
  }

  if (!Reflect.has(relation, 'isCascade')) {
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
      relation.referenceEntity.addMember(referenceRelation);
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
        constraintName: `FK_${relation.referenceEntity.tableName}_${foreignProperty}_TO_${entity.tableName}_${entity.keyProperty}`,
        kind: 'MANY_TO_ONE',
        isImplicit: true,
        referenceClass: entity.class,
        referenceEntity: entity,
        foreignProperty,
        referenceProperty: relation.property,
        referenceRelation: relation,
        isRequired: false,
        foreignColumn: null,
      } as ManyToOneMetadata;
      relation.referenceRelation = referenceRelation;
      // 创建隐式规则
      relation.referenceEntity.addMember(referenceRelation);
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

function fixEntity(builder: ContextBuilder, entity: EntityMetadata): void {
  // 先将列完善
  for (const member of entity.columns) {
    fixColumn(builder.metadata, entity, member);
  }

  if (!isTableEntity(entity)) return;

  entity.identityColumn = entity.columns.find(c => c.isIdentity);
  entity.rowflagColumn = entity.columns.find(c => c.isRowflag);
  if (entity.keyProperty) {
    const keyColumn = entity.getColumn(entity.keyProperty);
    if (!keyColumn) {
      throw new Error(
        `Entity ${entity.className} the key column ${entity.keyProperty} not found.`
      );
    }
    keyColumn.isPrimaryKey = true;
    entity.keyColumn = keyColumn;
  } else {
    if (!entity.keyProperty) {
      entity.keyProperty = builder.metadata.globalKeyName;
      builder.metadata.globalKeyType = BigInt;
    }

    let keyColumn = entity.getColumn(entity.keyProperty);

    if (!keyColumn) {
      // 隐式主键
      keyColumn = {
        kind: 'COLUMN',
        isImplicit: true,
        property: builder.metadata.globalKeyName,
        type: Number,
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
      entity.addMember(keyColumn);
    }
    entity.keyProperty = keyColumn.property;
    entity.keyColumn = keyColumn;
  }
  if (!entity.keyConstraintName) {
    entity.keyConstraintName = `PK_${entity.tableName}_${entity.keyColumn.columnName}`;
  }
  if (entity.isNonclustered === undefined) {
    entity.isNonclustered = false;
  }
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
        .asTable(
          `${entity.className}${relation.referenceEntity.className}`
        ).metadata;
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
    let relationRelation = entity.getRelation(relation.relationProperty);
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
        referenceProperty: null,
        referenceRelation: null,
      };
      relation.relationRelation = relationRelation;
      entity.addMember(relationRelation);
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
    relation.referenceEntity.addMember(referenceRelation);
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
  if (!Reflect.has(relation, 'comment')) {
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
      relation.referenceEntity.addMember(referenceRelation);
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
  if (!Reflect.has(relation, 'comment')) {
    relation.comment = undefined;
  }
  fixReferenceEntity(ctx, entity, relation);
  if (!Reflect.has(relation, 'isRequired')) {
    relation.isRequired = false;
  }
  if (!Reflect.has(relation, 'isCascade')) {
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
      relation.referenceEntity.addMember(referenceRelation);
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
      type: relation.referenceEntity.keyColumn.type,
      dbType: relation.referenceEntity.keyColumn.dbType,
      isNullable: !relation.isRequired,
      isPrimaryKey: false,
      isCalculate: false,
      isIdentity: false,
      isRowflag: false,
    };
    entity.addMember(column);
  } else {
    // if (relation.isRequired && column.isNullable === false) {
    //   console.warn(`Conflict Foreign column  isRequired is 'true`)
    //   // throw new Error(`Foreign column nullable must 'false' when relation isRequired is 'true'.`)
    // }
    // if (!Reflect.has(column, 'isNullable')) {
    column.isNullable = !relation.isRequired;
    // }
    // 外键类型兼容检查
    if (
      column.type !== relation.referenceEntity.keyColumn.type ||
      !isSameDbType(column.dbType, relation.referenceEntity.keyColumn.dbType)
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
    relation.constraintName = `FK_${entity.tableName}_${relation.foreignColumn.columnName}_${relation.referenceEntity.tableName}_${relation.referenceEntity.keyColumn.columnName}`;
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

/**
 * 判定成员是否已经存在，并且是期望的成员，如果未存在，返回false,如果存在并是期望的类型，返回true，如果不是期望的类型，则抛出异常
 * @param entity
 * @param name
 * @param kind
 * @returns
 */
function assertEntityMember(
  entity: EntityMetadata,
  name: string,
  kind: EntityMemberMetadata['kind']
): boolean {
  const exists = entity.getMember(name);
  if (!exists) return false;
  if (exists.kind !== kind) {
    throw new Error(
      `Entity ${entity.className} member ${name} is exists and kind ${exists.kind} not is expect type ${kind}`
    );
  }
  return true;
}

export class ContextBuilder<T extends DbContext = DbContext> {
  public readonly metadata: DbContextMetadata;
  constructor(ctr: Constructor<T>) {
    this.metadata = new DbContextMetadata(ctr);
    this.metadata.className = ctr.name;
  }

  /**
   * 实体映射
   */
  private _entityMap: Map<EntityType, EntityMapBuilder<any>> = new Map();

  /**
   * 是否已经完成
   */
  private _completed: boolean = false;

  /**
   * 声明实体
   */
  entity<T extends Entity>(ctr: Constructor<T>): EntityMapBuilder<T>;
  entity<T extends Entity>(
    ctr: Constructor<T>,
    build: (builder: EntityMapBuilder<T>) => void
  ): this;
  entity<T extends Entity>(
    ctr: Constructor<T>,
    build?: (builder: EntityMapBuilder<T>) => void
  ): EntityMapBuilder<T> | this {
    if (this._completed)
      throw new Error(`Context is completed, not allow this operation.`);
    if (!this._entityMap.has(ctr)) {
      const metadata: Partial<EntityMetadata> =
        new EntityMetadataClass() as EntityMetadata;
      assign(metadata, {
        className: ctr.name,
        class: ctr,
        contextClass: this.metadata.class,
      });
      const eb = new EntityMapBuilder(this, metadata);
      this._entityMap.set(ctr, eb);
      this.metadata.addEntity(metadata as EntityMetadata);
    }
    const builder = this._entityMap.get(ctr);
    if (build) {
      build(builder);
      return this;
    }
    return builder;
  }

  /**
   * 将实体绑定到表中
   * @param ctr
   */
  table<T extends Entity>(ctr: Constructor<T>): TableEntityBuilder<T>;
  table<T extends Entity>(
    ctr: Constructor<T>,
    build: (builder: TableEntityBuilder<T>) => void
  ): this;
  table<T extends Entity>(
    ctr: Constructor<T>,
    build?: (builder: TableEntityBuilder<T>) => void
  ): TableEntityBuilder<T> | this {
    const builder = this.entity(ctr).asTable();
    if (build) {
      build(builder);
      return this;
    }
    return builder;
  }

  /**
   * 将实体绑定到视图当中
   * @param ctr
   */
  view<T extends Entity>(ctr: Constructor<T>): ViewEntityBuilder<T>;
  view<T extends Entity>(
    ctr: Constructor<T>,
    build: (builder: ViewEntityBuilder<T>) => void
  ): this;
  view<T extends Entity>(
    ctr: Constructor<T>,
    build?: (builder: ViewEntityBuilder<T>) => void
  ): ViewEntityBuilder<T> | this {
    const builder = this.entity(ctr).asView();
    if (build) {
      build(builder);
      return this;
    }
    return builder;
  }

  /**
   * 将实体绑定到查询当中
   * @param ctr
   */
  query<T extends Entity>(ctr: Constructor<T>): QueryEntityBuilder<T>;
  query<T extends Entity>(
    ctr: Constructor<T>,
    build: (builder: QueryEntityBuilder<T>) => void
  ): this;
  query<T extends Entity>(
    ctr: Constructor<T>,
    build?: (builder: QueryEntityBuilder<T>) => void
  ): QueryEntityBuilder<T> | this {
    const builder = this.entity(ctr).asQuery();
    if (build) {
      build(builder);
      return this;
    }
    return builder;
  }

  /**
   * 完善数据并校验完整性
   */
  complete() {
    if (this._completed)
      throw new Error(
        `Context is completed, use 'context(Context, build)' will auto call the complete.`
      );
    if (!this.metadata.database) {
      this.metadata.database = this.metadata.className;
    }

    if (!this.metadata.globalKeyName) {
      this.metadata.globalKeyName = 'id';
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

    this._completed = true;
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
    default:
      throw new Error(`Unsupport to default db type ${dataType}`);
  }
}

/**
 * 声明数据库上下文类
 * @param context 数据库上下文类
 * @param build 模型构建在此函数中完成，在build函数完成后会自动调用 builder.ensure()
 */
export function context<T extends DbContext>(
  context: Constructor<T>,
  build: (builder: ContextBuilder<T>) => void | Promise<void>
): void;
export function context<T extends DbContext>(
  context: Constructor<T>
): ContextBuilder<T>;
export function context<T extends DbContext>(
  context: Constructor<T>,
  build?: (builder: ContextBuilder<T>) => void | Promise<void>
): void | ContextBuilder<T> {
  const builder = new ContextBuilder(context);
  if (build) {
    build(builder);
    builder.complete();
    return;
  }
  return builder;
}

/**
 * 实体映射构造器
 */
export class EntityMapBuilder<T extends Entity> {
  constructor(
    private modelBuilder: ContextBuilder,
    public readonly metadata: Partial<EntityMetadata>
  ) {}

  private builder: EntityBuilder<T>;

  private _assertKind(kind: EntityMetadata['kind']): boolean {
    if (this.metadata.kind) {
      if (this.metadata.kind !== kind) {
        throw new Error(
          `Entity ${this.metadata.class.name} is declared as ${this.metadata.kind}`
        );
      }
      return true;
    }
    return false;
  }

  /**
   * 实体声明为表
   */
  asTable(): TableEntityBuilder<T>;
  asTable(name: string): TableEntityBuilder<T>;
  asTable(build: (builder: TableEntityBuilder<T>) => void): ContextBuilder;
  asTable(
    name: string,
    build: (builder: TableEntityBuilder<T>) => void
  ): ContextBuilder;
  asTable(
    nameOrBuild?: string | ((builder: TableEntityBuilder<T>) => void),
    build?: (builder: TableEntityBuilder<T>) => void
  ): TableEntityBuilder<T> | ContextBuilder {
    if (this._assertKind('TABLE')) {
      if (arguments.length > 0) {
        throw new Error(
          `Entity ${this.metadata.class} is allowed declare as table once only, Pls use .asTable() to get TableEntityBuilder.`
        );
      }
      return this.builder as TableEntityBuilder<T>;
    }
    let name: string;
    if (typeof nameOrBuild === 'string') {
      name = nameOrBuild;
    } else if (typeof nameOrBuild === 'function') {
      build = nameOrBuild;
    }
    this.metadata.kind = 'TABLE';
    (this.metadata as TableEntityMetadata).tableName =
      name || this.metadata.className;
    this.metadata.readonly = false;
    const builder = new TableEntityBuilder<T>(this.modelBuilder, this.metadata);
    this.builder = builder;
    if (build) {
      build(builder);
      return this.modelBuilder;
    }
    return builder;
  }

  /**
   * 实体声明为视图
   */
  asView(): ViewEntityBuilder<T>;
  asView(name: string): ViewEntityBuilder<T>;
  asView(build: (builder: ViewEntityBuilder<T>) => void): ViewEntityBuilder<T>;
  asView(
    name: string,
    build: (builder: ViewEntityBuilder<T>) => void
  ): ViewEntityBuilder<T>;
  asView(
    nameOrBuild?: string | ((builder: ViewEntityBuilder<T>) => void),
    build?: (builder: ViewEntityBuilder<T>) => void
  ): ViewEntityBuilder<T> {
    if (this._assertKind('VIEW')) {
      if (arguments.length > 0) {
        throw new Error(
          `Entity is allowed declare as View once only, Pls use .asView() to get TableEntityBuilder.`
        );
      }
      return this.builder as ViewEntityBuilder<T>;
    }
    let name: string;
    if (typeof nameOrBuild === 'string') {
      name = nameOrBuild;
    } else if (typeof nameOrBuild === 'function') {
      build = nameOrBuild;
    }

    this.metadata.kind = 'VIEW';
    (this.metadata as ViewEntityMetadata).viewName =
      name || this.metadata.className;
    this.metadata.readonly = true;
    const builder = new ViewEntityBuilder<T>(this.modelBuilder, this.metadata);
    if (build) {
      build(builder);
    }
    this.builder = builder;
    return builder;
  }

  /**
   * 实体声明为视图
   */
  asQuery(): QueryEntityBuilder<T>;
  asQuery(
    build: (builder: QueryEntityBuilder<T>) => void
  ): QueryEntityBuilder<T>;
  asQuery(
    build?: (builder: QueryEntityBuilder<T>) => void
  ): QueryEntityBuilder<T> {
    if (this._assertKind('QUERY')) {
      if (arguments.length > 0) {
        throw new Error(
          `Entity is allowed declare as Query once only, Pls use .asQuery() to get TableEntityBuilder.`
        );
      }
      return this.builder as QueryEntityBuilder<T>;
    }

    this.metadata.kind = 'QUERY';
    this.metadata.readonly = true;
    const builder = new QueryEntityBuilder<T>(this.modelBuilder, this.metadata);
    if (build) {
      build(builder);
    }
    this.builder = builder;
    return builder;
  }
}

/**
 * 列可以重复获取，关系不可以重复获取
 */
export abstract class EntityBuilder<T extends Entity> {
  constructor(
    protected modelBuilder: ContextBuilder,
    public readonly metadata: Partial<EntityMetadata>
  ) {}

  protected readonly memberMaps: Map<
    string,
    ColumnBuilder<T> | HasOneBuilder<T, Entity> | HasManyBuilder<T, Entity>
  > = new Map();

  column<P extends Scalar>(
    selector: (p: T) => P,
    type: DataTypeOf<P>
  ): ColumnBuilder<T, P>;
  column<P extends Scalar>(
    selector: (p: T) => P,
    type: DataTypeOf<P>,
    build: (builder: ColumnBuilder<T>) => void
  ): this;
  column<D extends Scalar, P extends keyof T>(
    property: string,
    type: DataTypeOf<D>
  ): ColumnBuilder<T, D>;
  column<D extends Scalar, P extends keyof T>(
    property: string,
    type: DataTypeOf<D>,
    build: (builder: ColumnBuilder<T>) => void
  ): this;
  column<P extends Scalar>(
    propertyOrselector: string | ((p: T) => P),
    type: DataTypeOf<P>,
    build?: (builder: ColumnBuilder<T>) => void
  ): ColumnBuilder<T, P> | this {
    let property: string =
      typeof propertyOrselector === 'function'
        ? selectProperty(propertyOrselector)
        : propertyOrselector;
    if (!property) {
      throw new Error(`Please select a property`);
    }
    let metadata: Partial<ColumnMetadata<P>> = this.memberMaps.get(
      property
    ) as any;
    if (!metadata) {
      metadata = {
        kind: 'COLUMN',
        property: property,
        type,
      };
    }

    const columnBuilder = new ColumnBuilder<T, P>(
      this.modelBuilder,
      this,
      metadata
    );
    this.memberMaps.set(property, columnBuilder);
    this.metadata.addMember(metadata as ColumnMetadata);

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
  constructor(private entityBuilder: TableEntityBuilder<any>) {}
  /**
   * 主键描述
   */
  public readonly metadata: TableEntityMetadata;
  hasComment(comment: string): this {
    this.entityBuilder.metadata.keyComment = comment;
    return this;
  }

  /**
   * 指定约束名称
   * @param constraintName
   * @returns
   */
  hasConstraintName(constraintName: string): this {
    this.entityBuilder.metadata.keyConstraintName = constraintName;
    return this;
  }

  /**
   * 将主键声明为非聚焦
   * @returns
   */
  isNonclustered() {
    this.entityBuilder.metadata.isNonclustered = true;
    return this;
  }
}

/**
 * 表实体构造器
 */
export class TableEntityBuilder<T extends Entity> extends EntityBuilder<T> {
  public readonly metadata: TableEntityMetadata;

  private assertRelation(property: string) {
    if (this.memberMaps.has(property)) {
      throw new Error(`Property ${property} is declared`);
    }
  }

  /**
   * 声明主键
   */
  hasKey<P extends Scalar>(selector: (p: T) => P): TableKeyBuilder;
  hasKey<P extends Scalar>(
    constraintName: string,
    selector: (p: T) => P
  ): TableKeyBuilder;
  hasKey<P extends Scalar>(
    nameOrSelector: string | ((p: T) => P),
    selector?: (p: T) => P
  ): TableKeyBuilder {
    let constraintName: string;
    if (typeof nameOrSelector === 'function') {
      selector = nameOrSelector;
    } else {
      constraintName = nameOrSelector;
    }

    let property: string = selectProperty(selector);
    if (!property) {
      throw new Error('Please select a property');
    }
    this.metadata.keyProperty = property;
    this.metadata.keyConstraintName = constraintName;
    // this.metadata.addIndex({
    //   name: undefined,
    //   properties: [property],
    //   columns: null,
    //   isUnique: true,
    //   isClustered
    // });
    return new TableKeyBuilder(this);
  }

  hasIndex(
    name: string,
    selector: (p: T) => Scalar[],
    isUnique: boolean = false,
    isClustered: boolean = false
  ): this {
    const properties: string[] = selectProperty(selector);
    this.metadata.addIndex({
      name,
      properties,
      columns: null,
      isUnique,
      isClustered,
    });
    return this;
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
    propertySelector: (P: T) => D,
    type: Constructor<D>
  ): HasOneBuilder<T, D>;
  hasOne<D extends Entity>(
    propertyOrSelector: string | ((P: T) => D),
    type: Constructor<D>
  ): HasOneBuilder<T, D> {
    let property: string =
      typeof propertyOrSelector === 'function'
        ? selectProperty(propertyOrSelector)
        : propertyOrSelector;
    if (!property) {
      throw new Error(
        `Entity ${this.metadata.class.name} hasOne selector mast return a property, example property name "user", 'builder.hasOne(p => p.user)'`
      );
    }

    this.assertRelation(property);
    const metadata: Partial<HasOneMetadata> = {
      property,
      referenceClass: type,
      // 追加关联关系
      referenceEntity: this.modelBuilder.entity(type)
        .metadata as TableEntityMetadata,
    };
    const builder = new HasOneBuilder<T, D>(this.modelBuilder, this, metadata);
    this.memberMaps.set(property, builder);
    this.metadata.addMember(metadata as HasOneMetadata);
    return builder;
  }

  /**
   * 声明一个集体属性
   * @param selector
   * @param type 因typescript反射机制尚不完善，因此无法获取到属性类型，因而需要传递该属性类型参数
   * @returns
   */
  hasMany<D extends Entity>(
    selector: (p: T) => D[],
    type: Constructor<D>
  ): HasManyBuilder<T, D> {
    let property: string = selectProperty(selector);
    if (!property)
      throw new Error(
        `Entity ${this.metadata.class.name} hasMany selector mast select a property like this: '.hasMany(p => p.listPropery)'.`
      );

    this.assertRelation(property);
    const metadata: Partial<HasManyMetadata> = {
      referenceClass: type,
      referenceEntity: this.modelBuilder.entity(type)
        .metadata as TableEntityMetadata,
      property: property,
      isDetail: false,
      isImplicit: false,
    };
    this.modelBuilder.entity(type);
    const builder = new HasManyBuilder<T, D>(this.modelBuilder, this, metadata);
    this.memberMaps.set(property, builder);
    this.metadata.addMember(metadata as HasManyMetadata);
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
        `Entity ${this.metadata.class.name} hasData seed data is empty.`
      );
    }
    if (!this.metadata.data) this.metadata.data = [];
    this.metadata.data.push(...data);
    return this;
  }
}

export class ViewEntityBuilder<T extends Entity> extends EntityBuilder<T> {
  metadata: Partial<ViewEntityMetadata>;

  /**
   * 声明视图选择语句
   * 声明在函数中是为了避免循环引用时引发异常
   */
  hasBody(body: Select<T>): this {
    this.metadata.body = body;
    return this;
  }
}

export class QueryEntityBuilder<T extends Entity> extends EntityBuilder<T> {
  metadata: Partial<QueryEntityMetadata>;

  withSql(sql: Select<T>): this {
    this.metadata.sql = sql;
    return this;
  }
}

export class ColumnBuilder<T extends Entity, V extends Scalar = Scalar> {
  constructor(
    private readonly modelBuilder: ContextBuilder,
    private readonly entityBuilder: EntityBuilder<T>,
    public readonly metadata: Partial<ColumnMetadata<V>>
  ) {}

  /**
   * 列名
   */
  hasName(columnName: string): Omit<this, 'hasName'> {
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
    generator: (s: ProxiedRowset<T>, item: T) => CompatibleExpression<V>
  ): Omit<this, 'isAutogen'> {
    this.metadata.generator = generator;
    return this;
  }

  /**
   * 是否可空
   */
  isNullable(): Omit<this, 'isNullable'> {
    this.metadata.isNullable = true;
    return this;
  }

  /**
   * 行标记列
   */
  isRowflag(): Omit<this, 'isRowflag'> {
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
    this.metadata.defaultValue = ensureExpression(expr);
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
  asCalculated(
    expr: Expression<V>
  ): Omit<
    this,
    'asCalculated' | 'hasDefaultValue' | 'isIdentity' | 'isAutogen'
  > {
    this.metadata.isCalculate = true;
    this.metadata.calculateExpression = expr;
    return this;
  }
}

export class HasOneBuilder<S extends Entity, D extends Entity> {
  constructor(
    private modelBuilder: ContextBuilder,
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

  withOne(selector?: (p: D) => S): OneToOneMapBuilder<S, D> {
    this.assertWith();
    this.metadata.kind = 'ONE_TO_ONE';
    if (this.metadata.referenceProperty) {
      const referenceRelation = this.metadata.referenceEntity.getRelation(
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
      this.modelBuilder,
      this.entityBuilder,
      this.metadata as OneToOneMetadata
    );
    return oneToOne;
  }

  withMany(selector?: (p: D) => S[]): ManyToOneBuilder<S, D> {
    this.assertWith();
    this.metadata.kind = 'MANY_TO_ONE';
    if (selector) {
      this.metadata.referenceProperty = selectProperty(selector);
      if (!this.metadata.referenceProperty) {
        throw new Error('Please select a property');
      }
      const referenceRelation = this.metadata.referenceEntity.getRelation(
        this.metadata.referenceProperty
      ) as OneToManyMetadata;
      if (referenceRelation) {
        // 相互关联对向关系
        this.metadata.referenceRelation = referenceRelation;
        referenceRelation.referenceRelation = this
          .metadata as ManyToOneMetadata;
        referenceRelation.referenceProperty = this.metadata.property;
      }
    }
    const oneToMay = new ManyToOneBuilder<S, D>(
      this.modelBuilder,
      this.entityBuilder,
      this.metadata as ManyToOneMetadata
    );
    return oneToMay;
  }
}

export class HasManyBuilder<S extends Entity, D extends Entity> {
  constructor(
    private readonly modelBuilder: ContextBuilder,
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

  withOne(selector?: (p: D) => S): OneToManyBuilder<S, D> {
    this.assertWith();
    this.metadata.kind = 'ONE_TO_MANY';
    if (selector) {
      this.metadata.referenceProperty = selectProperty(selector);
      if (!this.metadata.referenceProperty) {
        throw new Error('Please select a property');
      }
      const referenceRelation = this.metadata.referenceEntity.getRelation(
        this.metadata.referenceProperty
      ) as ManyToOneMetadata;
      if (referenceRelation) {
        this.metadata.referenceRelation = referenceRelation;
        referenceRelation.referenceRelation = this
          .metadata as OneToManyMetadata;
        referenceRelation.referenceProperty = this.metadata.property;
      }
    }
    const manyToOne = new OneToManyBuilder<S, D>(
      this.modelBuilder,
      this.entityBuilder,
      this.metadata as OneToManyMetadata
    );
    return manyToOne;
  }

  withMany(selector?: (p: D) => S[]): ManyToManyBuilder<S, D> {
    this.assertWith();
    this.metadata.kind = 'MANY_TO_MANY';
    const metadata: Partial<ManyToManyMetadata> = this
      .metadata as ManyToManyMetadata;
    if (selector) {
      metadata.referenceProperty = selectProperty(selector);
      if (!metadata.referenceProperty) {
        throw new Error('Please select a property');
      }
      const referenceRelation = this.metadata.referenceEntity.getRelation(
        this.metadata.referenceProperty
      ) as ManyToManyMetadata;
      if (referenceRelation) {
        // 相互关联对向关系
        this.metadata.referenceRelation = referenceRelation;
        referenceRelation.referenceRelation = this
          .metadata as ManyToManyMetadata;
        referenceRelation.referenceProperty = this.metadata.property;
      }
    }

    const builder = new ManyToManyBuilder<S, D>(
      this.modelBuilder,
      this.entityBuilder,
      this.metadata as ManyToManyMetadata
    );
    return builder;
  }
}

export class OneToOneMapBuilder<S extends Entity, D extends Entity> {
  constructor(
    private readonly modelBuilder: ContextBuilder,
    private readonly entityBuilder: EntityBuilder<S>,
    public readonly metadata: Partial<OneToOneMetadata>
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
            `Entity ${this.entityBuilder.metadata.class.name} PrimaryOneToOne relation ${this.metadata.property}, reference relation must be ForeignOneToOne relation, use .hasForeignKey()`
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
      this.modelBuilder,
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
      let foreignProperty: string;
      foreignProperty = selectProperty(selector);
      if (!foreignProperty) {
        throw new Error(`Pls select a property`);
      }
      (this.metadata as ForeignOneToOneMetadata).foreignProperty =
        foreignProperty;
    }
    return new ForeignOneToOneBuilder<S, D>(
      this.modelBuilder,
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
    private modelBuilder: ContextBuilder,
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
  public readonly metadata: PrimaryOneToOneMetadata;
}

export class ForeignOneToOneBuilder<
  S extends Entity,
  D extends Entity
> extends OneToOneBuilder<S, D> {
  public readonly metadata: ForeignOneToOneMetadata;

  hasConstraintName(name: string): Omit<this, 'hasConstraintName'> {
    this.metadata.constraintName = name;
    return this;
  }

  isRequired(): Omit<this, 'isNullable'> {
    this.metadata.isRequired = true;
    return this;
  }
}

export class OneToManyBuilder<S extends Entity, D extends Entity> {
  constructor(
    private readonly modelBuilder: ContextBuilder,
    private readonly entityBuilder: EntityBuilder<S>,
    public readonly metadata: OneToManyMetadata
  ) {}
}

export class ManyToOneBuilder<S extends Entity, D extends Entity> {
  constructor(
    private readonly modelBuilder: ContextBuilder,
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
  hasForeignKey<P extends Scalar>(selector: (p: S) => P): this {
    if (selector) {
      let property: string = selectProperty(selector);
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

  hasComment(comment: string): Omit<this, 'hasComment'> {
    this.metadata.comment = comment;
    return this;
  }
}

export class ManyToManyBuilder<S extends Entity, D extends Entity> {
  constructor(
    private readonly modelBuilder: ContextBuilder,
    private readonly entityBuilder: EntityBuilder<S>,
    public readonly metadata: ManyToManyMetadata
  ) {}
  /**
   * 显式声明关系中间表
   * 仅要一方声明中间表即可，无须双方声明
   */
  hasRelationTable<T extends Entity>(
    ctr: Constructor<T>,
    build?: (builder: TableEntityBuilder<T>) => void
  ): TableEntityBuilder<T>;
  hasRelationTable<T extends Entity>(
    ctr: Constructor<T>,
    name: string,
    build?: (builder: TableEntityBuilder<T>) => void
  ): TableEntityBuilder<T>;
  hasRelationTable<T extends Entity>(
    ctr: Constructor<T>,
    nameOrBuild?: string | ((builder: TableEntityBuilder<T>) => void),
    build?: (builder: TableEntityBuilder<T>) => void
  ): TableEntityBuilder<T> {
    let name: string;

    if (typeof nameOrBuild === 'string') {
      name = nameOrBuild;
    } else if (typeof nameOrBuild === 'function') {
      build = nameOrBuild;
    }
    const builder: TableEntityBuilder<any> = this.modelBuilder
      .entity(ctr)
      .asTable(name);
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

  /**
   * 指定约束名称
   */
  hasConstraintName(name: string): this {
    this.metadata.relationConstraintName = name;
    return this;
  }
}

const PropertySelector: any = new Proxy(
  {},
  {
    get: (_, key: string): string => {
      if (typeof key !== 'string') {
        throw new Error(
          `Invalid property type ${typeof key}, entity property is allow string key only.`
        );
      }
      return key;
    },
  }
);

function selectProperty(selector: (p: any) => any): any {
  const property = selector(PropertySelector);
  return property;
}
