/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/ban-types */
/* eslint-disable @typescript-eslint/no-unused-vars */

import { CompatibleExpression, Expression, Select } from "./ast";
import { DbContext } from "./db-context";
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
} from "./metadata";
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
} from "./types";
import { assign, complex, ensureExpression, lowerFirst } from "./util";

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
    column.dbType = getDefaultDbType(column.type);
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
}

function fixIndex(entity: TableEntityMetadata, index: IndexMetadata) {
  if (!index.name) {
    index.name = `IX_${
      entity.tableName
    }_${index.columns.map((col) => col.column.columnName).join("_")}`;
  }
  index.columns = index.properties.map((property) => {
    const column = entity.getColumn(property);
    if (!column) {
      throw new Error(`Column ${property} not found.`);
    }
    return {
      column,
      isAscending: true
    };
  });
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
  ensureReferenceEntity(ctx, entity, relation);
  ensureForeignProperty(entity, relation);

  // 如果有声明对向属性的，将属性关联起来，未声明的无须理会
  if (relation.referenceProperty && !relation.referenceRelation) {
    const exists = relation.referenceEntity.getRelation(
      relation.referenceProperty
    );
    if (!exists) {
      throw new Error(
        `Relation ${entity.className}.${relation.property} reference relation ${relation.referenceEntity.className}.${relation.referenceProperty} is not found.`
      );
    }
    if (!isOneToMany(exists)) {
      throw new Error(
        `Relation ${entity.className}.${relation.property}  reference relation ${relation.referenceEntity.className}.${relation.referenceProperty} expect 'ONE_TO_MANY' but ${exists.kind} found`
      );
    }
    // if (exists.referenceClass !== entity.class) {
    //   throw new Error(
    //     `Relation ${entity.classname}.${relation.property}  reference relation ${relation.referenceEntity.classname}.${relation.referenceProperty} type error.`
    //   );
    // }
    relation.referenceRelation = exists as OneToManyMetadata;
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
  ensureReferenceEntity(ctx, entity, relation);
  // 如果未指定该属性，则查找该属性
  // 如果未查找到该属性，则定义该属性
  if (!relation.referenceProperty) {
    const referenceProperty = lowerFirst(complex(entity.className));
    relation.referenceProperty = referenceProperty;
  }

  if (!relation.referenceRelation) {
    let referenceRelation = relation.referenceEntity.getRelation(
      relation.referenceProperty
    );
    if (!referenceRelation) {
      const foreignProperty = `${relation.referenceProperty}Id`;
      referenceRelation = {
        property: relation.referenceProperty,
        // dbName: relation.referenceProperty,
        constraintName: `${relation.referenceEntity.tableName}_${foreignProperty}_TO_${entity.tableName}_${entity.keyProperty}`,
        kind: "MANY_TO_ONE",
        isImplicit: true,
        referenceClass: entity.class,
        referenceEntity: entity,
        foreignProperty,
        referenceProperty: relation.property,
        referenceRelation: relation,
        isNullable: true,
        foreignColumn: null,
      };
      // 创建隐式规则
      relation.referenceEntity.addMember(referenceRelation);
      ensureForeignProperty(relation.referenceEntity, referenceRelation);
    }
    if (isManyToOne(referenceRelation)) {
      relation.referenceRelation = referenceRelation;
    } else {
      throw new Error(
        `OneToMany's referenct property must ManyToOne relation.`
      );
    }
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
  const ctx = ctxBuilder.metadata;
  ensureReferenceEntity(ctx, entity, relation);
  if (!relation.relationClass) {
    relation.relationClass = class extends Entity {};
    ctxBuilder
      .entity<any>(relation.relationClass)
      .asTable(
        `${entity.className}${relation.referenceEntity.className}`,
        (builder) => {
          const keyColumn = builder.column((p) => p.id, Number).identity();
          builder.hasKey((p) => p.id);
          relation.relationEntity = builder.metadata as TableEntityMetadata;
          fixColumn(
            ctx,
            relation.relationEntity,
            keyColumn.metadata as ColumnMetadata
          );
        }
      );
  }

  if (!relation.referenceProperty) {
    const referenceProperty = lowerFirst(complex(entity.className));
    assertEntityMember(entity, referenceProperty, "MANY_TO_MANY");
    relation.referenceProperty = referenceProperty;
  }

  let referenceRelation = relation.referenceEntity.getRelation(
    relation.referenceProperty
  );

  if (!referenceRelation) {
    // 创建隐式一对多导航属性
    referenceRelation = {
      property: relation.referenceProperty,
      kind: "MANY_TO_MANY",
      isImplicit: true,
      referenceClass: entity.class,
      referenceEntity: entity,
      referenceProperty: relation.property,
      referenceRelation: relation,
      relationClass: relation.relationClass,
      relationEntity: relation.relationEntity,
      isNullable: true,
    } as ManyToManyMetadata;
    relation.referenceEntity.addMember(referenceRelation);
    fixManyToMany(ctxBuilder, relation.referenceEntity, referenceRelation);
  }

  if (isManyToMany(referenceRelation)) {
    relation.referenceRelation = referenceRelation;
  } else {
    throw new Error(
      `ManyToMany relation reference property must ManyToMany relation too.`
    );
  }

  // 查找中间表对应当前表的ManyToOne外键属性
  let realtionEntityToEntity = relation.relationEntity.members.find(
    (p) => isManyToOne(p) && p.referenceClass === entity.class
  ) as ManyToOneMetadata;

  // 如果未找到，则声明
  if (!realtionEntityToEntity) {
    realtionEntityToEntity = {
      property: genRelationProperty(
        relation.relationEntity,
        entity.className,
        "one"
      ),
      isImplicit: true,
      kind: "MANY_TO_ONE",
      referenceClass: entity.class,
      referenceEntity: entity,
      foreignProperty: `${entity.className}Id`,
      isNullable: false,
    } as ManyToOneMetadata;
    // 自动声明外键
    ensureForeignProperty(relation.relationEntity, realtionEntityToEntity);
    relation.relationEntity.addMember(realtionEntityToEntity);
  }

  // 添加到关系表的导航属性
  const relationRelation = {
    property: complex(relation.relationEntity.className),
    isImplicit: true,
    kind: "ONE_TO_MANY",
    referenceClass: relation.relationClass,
    referenceEntity: relation.relationEntity as EntityMetadata,
    referenceProperty: realtionEntityToEntity.property,
    referenceRelation: realtionEntityToEntity,
  } as OneToManyMetadata;
  entity.addMember(relationRelation);

  relation.relationRelation = relationRelation;
  realtionEntityToEntity.referenceProperty = relation.relationRelation.property;
  realtionEntityToEntity.referenceRelation = relation.relationRelation;
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
  ensureReferenceEntity(ctx, entity, relation);
  if (relation.isPrimary === true) {
    if (!relation.referenceProperty) {
      const referenceProperty = lowerFirst(entity.className);
      assertEntityMember(
        relation.referenceEntity,
        referenceProperty,
        "ONE_TO_ONE"
      );
      if (relation.isPrimary) {
        throw new Error(
          `Reference property must kind of foreign one to one relation.`
        );
      }
      relation.referenceProperty = referenceProperty;
    }
    if (!relation.referenceRelation) {
      let referenceRelation = relation.referenceEntity.getRelation(
        relation.referenceProperty
      );

      if (!referenceRelation) {
        referenceRelation = {
          isImplicit: true,
          kind: "ONE_TO_ONE",
          isPrimary: false,
          property: relation.referenceProperty,
          referenceClass: entity.class,
          referenceEntity: entity,
          referenceProperty: relation.property,
          referenceRelation: relation,
        } as ForeignOneToOneMetadata;
        relation.referenceEntity.addMember(referenceRelation);
        // 生成外键
        ensureForeignProperty(relation.referenceEntity, referenceRelation);
      }
      if (isForeignOneToOne(referenceRelation)) {
        relation.referenceRelation = referenceRelation;
      } else {
        throw new Error(
          `PrimaryOneToOne's referenct property must ForeignOneToOne relation.`
        );
      }
    }
  } else {
    ensureForeignProperty(entity, relation);
    if (relation.referenceProperty && !relation.referenceRelation) {
      const exists = relation.referenceEntity.getRelation(
        relation.referenceProperty
      );
      if (!exists) {
        throw new Error(
          `Entity ${relation.referenceEntity.className} relation not exists ${relation.referenceProperty}`
        );
      }
      if (!isPrimaryOneToOne(exists)) {
        throw new Error(
          `ForeignOneToOne's referenct property must PrimaryOneToOne relation.`
        );
      }
      // TIPS: TS 过滤掉了，可以省掉此代码以节省性能
      // if (exists.referenceClass !== entity.class) {
      //   throw new Error(
      //     `Relation ${entity.classname}.${relation.property} reference relation ${relation.referenceEntity.classname}.${relation.referenceProperty} type error.`
      //   );
      // }
      relation.referenceRelation = exists as PrimaryOneToOneMetadata;
    }
  }
}

/**
 * 确保外键生效
 * @param entity
 * @param relation
 */
function ensureForeignProperty(
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
      kind: "COLUMN",
      type: relation.referenceEntity.keyColumn.type,
      dbType: relation.referenceEntity.keyColumn.dbType,
      isNullable: false,
      isPrimaryKey: false,
      isCalculate: false,
      isIdentity: false,
      isRowflag: false,
    };
    entity.addMember(column);
  } else {
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
    relation.constraintName = `FK_${entity.tableName}_${relation.foreignColumn.columnName}_${relation.referenceEntity.tableName}_${relation.referenceEntity.keyColumn}`;
  }
}

function ensureReferenceEntity(
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
  entity: TableEntityMetadata,
  referenceType: string,
  type: "one" | "many"
): string {
  let property = lowerFirst(referenceType);
  if (type === "many") {
    property = complex(property);
  }
  while (entity.getMember(property)) {
    property = "_" + property;
  }
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
  kind: EntityMemberMetadata["kind"]
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
  private _ensured: boolean = false;

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
    if (this._ensured)
      throw new Error(`Context is ensured, pls build model before ensure.`);
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
  ensure() {
    if (this._ensured)
      throw new Error(`Context is ensured, not need ensure twice.`);
    const entityMap = new Map();
    if (!this.metadata.database) {
      this.metadata.database = this.metadata.className;
    }
    this.metadata.entities.forEach((entity) => {
      entityMap.set(entity.class, entity);
    });
    Object.defineProperty(this.metadata, "entity", {
      writable: false,
      value: (ctr: Constructor<Entity>) => {
        return entityMap.get(ctr);
      },
    });

    for (const entity of this.metadata.entities) {
      // 先将列完善
      for (const member of entity.columns) {
        fixColumn(this.metadata, entity, member);
      }

      if (!isTableEntity(entity)) continue;

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
        let keyColumn =
          entity.getColumn("Id") ||
          entity.getColumn("id") ||
          entity.getColumn("ID") ||
          entity.getColumn(`${entity.className}Id`) ||
          entity.getColumn(`${lowerFirst(entity.className)}Id`);

        if (!keyColumn) {
          keyColumn = {
            kind: "COLUMN",
            isImplicit: true,
            property: "id",
            type: Number,
            columnName: "id",
            dbType: DbType.int64,
            isIdentity: true,
            identityStartValue: 0,
            identityIncrement: 1,
            isNullable: false,
            isPrimaryKey: true,
            isCalculate: false,
            isRowflag: false,
            description: "Auto generic key column.",
          };
          entity.addMember(keyColumn);
        }
        entity.keyProperty = keyColumn.property;
        entity.keyColumn = keyColumn;
      }
      entity.identityColumn = entity.columns.find((c) => c.isIdentity);
      entity.rowflagColumn = entity.columns.find((c) => c.isRowflag);
    }

    // 处理关联关系
    for (const entity of this.metadata.entities) {
      if (!isTableEntity(entity)) continue;
      for (const member of entity.relations) {
        switch (member.kind) {
          case "MANY_TO_ONE":
            fixManyToOne(this.metadata, entity, member);
            break;
          case "ONE_TO_MANY":
            fixOneToMany(this.metadata, entity, member);
            break;
          case "MANY_TO_MANY":
            fixManyToMany(this, entity, member);
            break;
          case "ONE_TO_ONE":
            fixOneToOne(this.metadata, entity, member);
            break;
        }
      }
      for (const index of entity.indexes) {
        fixIndex(entity, index);
      }
    }

    this._ensured = true;
    // 注册进 metadataStore中
    metadataStore.registerContext(this.metadata);
  }
}

/**
 * ts类型转换为默认数据库类型
 * @param dataType
 * @returns
 */
function getDefaultDbType(dataType: DataType): DbType {
  if (Array.isArray(dataType)) {
    return DbType.array(getDefaultDbType(dataType[0]));
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
    builder.ensure();
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

  private _assertKind(kind: EntityMetadata["kind"]): boolean {
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
    if (this._assertKind("TABLE")) {
      if (arguments.length > 0) {
        throw new Error(
          `Entity ${this.metadata.class} is allowed declare as table once only, Pls use .asTable() to get TableEntityBuilder.`
        );
      }
      return this.builder as TableEntityBuilder<T>;
    }
    let name: string;
    if (typeof nameOrBuild === "string") {
      name = nameOrBuild;
    } else if (typeof nameOrBuild === "function") {
      build = nameOrBuild;
    }
    this.metadata.kind = "TABLE";
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
    if (this._assertKind("VIEW")) {
      if (arguments.length > 0) {
        throw new Error(
          `Entity is allowed declare as View once only, Pls use .asView() to get TableEntityBuilder.`
        );
      }
      return this.builder as ViewEntityBuilder<T>;
    }
    let name: string;
    if (typeof nameOrBuild === "string") {
      name = nameOrBuild;
    } else if (typeof nameOrBuild === "function") {
      build = nameOrBuild;
    }

    this.metadata.kind = "VIEW";
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
    if (this._assertKind("QUERY")) {
      if (arguments.length > 0) {
        throw new Error(
          `Entity is allowed declare as Query once only, Pls use .asQuery() to get TableEntityBuilder.`
        );
      }
      return this.builder as QueryEntityBuilder<T>;
    }

    this.metadata.kind = "QUERY";
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
  column<P extends Scalar>(
    selector: (p: T) => P,
    type: DataTypeOf<P>,
    build?: (builder: ColumnBuilder<T>) => void
  ): ColumnBuilder<T, P> | this {
    let property: string = selectProperty(selector);
    if (!property) {
      throw new Error(`Please select a property`);
    }
    let metadata: Partial<ColumnMetadata<P>> = this.memberMaps.get(
      property
    ) as any;
    if (!metadata) {
      metadata = {
        kind: "COLUMN",
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

  /**
   * 可将初始化代码写于此处，支持异步方法
   */
  async forAsync(action: (builder: this) => Promise<void>): Promise<this> {
    await action(this);
    return this;
  }
}

/**
 * 表实体构造器
 */
export class TableEntityBuilder<T extends Entity> extends EntityBuilder<T> {
  public readonly metadata: Partial<TableEntityMetadata>;

  private assertRelation(property: string) {
    if (this.memberMaps.has(property)) {
      throw new Error(`Property ${property} is declared`);
    }
  }

  /**
   * 声明主键
   */
  hasKey<P extends Scalar>(selector: (p: T) => P, constraintName?: string, isClustered: boolean = true): this {
    let property: string = selectProperty(selector);
    if (!property) {
      throw new Error("Please select a property");
    }
    this.metadata.keyProperty = property;
    // this.metadata.addIndex({
    //   name: undefined,
    //   properties: [property],
    //   columns: null,
    //   isUnique: true,
    //   isClustered
    // });
    return this;
  }

  hasIndex(selector: (p: T) => Scalar[], isUnique: boolean = false, isClustered: boolean = false): this {
    const properties: string[] = selectProperty(selector);
    this.metadata.addIndex({
      name: undefined,
      properties,
      columns: null,
      isUnique,
      isClustered
    });
    return this;
  }

  /**
   * 声明一个单一引用属性
   * @param selector
   * @param type 因typescript反射机制尚不完善，因此无法获取到属性类型，因而需要传递该属性类型参数
   * @returns
   */
  hasOne<D extends Entity>(
    selector: (P: T) => D,
    type: Constructor<D>
  ): HasOneBuilder<T, D> {
    let property: string = selectProperty(selector);
    if (!property) {
      throw new Error(
        'Property name is rquired, example property name "user", `builder.hasOne(p => p.user)`'
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
      throw new Error("Please select a property as `p => p.propertyName`.");

    this.assertRelation(property);
    const metadata: Partial<HasManyMetadata> = {
      /**
       * 默认为一对一
       */
      referenceClass: type,
      referenceEntity: this.modelBuilder.entity(type)
        .metadata as TableEntityMetadata,
      isNullable: true,
      property: property,
      isDetail: false,
      isImplicit: false,
    };
    const builder = new HasManyBuilder<T, D>(this.modelBuilder, this, metadata);
    this.memberMaps.set(property, builder);
    this.metadata.addMember(metadata as HasManyMetadata);
    return builder;
  }


  // TODO: 待添加种子数据结构化初始
  /**
   * 种子数据，
   * 暂时只支持，数据表对象新增
   * 重复调用则追加
   */
  // hasData(data: T[]): this
  // hasData(data: any[]): this
  hasData(data: Record<string, Scalar>[]): this {
    if (this.metadata.kind !== "TABLE") {
      throw new Error("Seed data is allowed only on table.");
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
  columnName(columnName: string): this {
    this.metadata.columnName = columnName;
    return this;
  }
  /**
   * 摘要说明
   */
  description(comment: string): this {
    this.metadata.description = comment;
    return this;
  }

  autogen(generator: (item: any) => CompatibleExpression<V>): this {
    this.metadata.generator = generator;
    return this;
  }
  /**
   * 数据类型
   */
  dbType(dbType: DbType): this {
    this.metadata.dbType = dbType;
    return this;
  }
  /**
   * 是否可空
   */
  nullable(yesOrNo: boolean = true): this {
    this.metadata.isNullable = yesOrNo;
    return this;
  }
  /**
   * 行标记列
   */
  rowflag(): this {
    this.metadata.isRowflag = true;
    return this;
  }
  /**
   * 标识列
   */
  identity(seed?: number, step?: number): this {
    this.metadata.isIdentity = true;
    this.metadata.identityStartValue = seed ?? 0;
    this.metadata.identityIncrement = step ?? 1;
    return this;
  }
  /**
   * 计算列
   */
  calculate(expr: Expression<V>): this {
    this.metadata.isCalculate = true;
    this.metadata.calculateExpression = expr;
    return this;
  }
  /**
   * 默认值
   */
  defaultValue(expr: CompatibleExpression<V>): this {
    this.metadata.defaultValue = ensureExpression(expr);
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
    this.metadata.kind = "ONE_TO_ONE";
    if (selector) {
      this.metadata.referenceProperty = selectProperty(selector);
      if (!this.metadata.referenceProperty) {
        throw new Error("Please select a property");
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
    this.metadata.kind = "MANY_TO_ONE";
    if (selector) {
      this.metadata.referenceProperty = selectProperty(selector);
      if (!this.metadata.referenceProperty) {
        throw new Error("Please select a property");
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
    this.metadata.kind = "ONE_TO_MANY";
    if (selector) {
      this.metadata.referenceProperty = selectProperty(selector);
      if (!this.metadata.referenceProperty) {
        throw new Error("Please select a property");
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
    this.metadata.kind = "MANY_TO_MANY";
    const metadata: Partial<ManyToManyMetadata> = this
      .metadata as ManyToManyMetadata;
    if (selector) {
      metadata.referenceProperty = selectProperty(selector);
      if (!metadata.referenceProperty) {
        throw new Error("Please select a property");
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

  hasForeignKey() {}

  constraintName(name: string): this {
    this.metadata.constraintName = name;
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

  constraintName(name: string) {
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
    }
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

    if (typeof nameOrBuild === "string") {
      name = nameOrBuild;
    } else if (typeof nameOrBuild === "function") {
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
    return builder;
  }

  /**
   * 指定约束名称
   */
  constraintName(name: string): this {
    this.metadata.relationConstraintName = name;
    return this;
  }
}

const PropertySelector: any = new Proxy(
  {},
  {
    get: (_, key: string) => {
      return key;
    },
  }
);

function selectProperty(selector: (...args: any) => any): any {
  return selector(PropertySelector);
}
