/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/ban-types */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Expression, FieldsOf, ProxiedTable, Select } from "./ast";
import { DbContext } from "./db-context";
import {
  DatabaseSchema,
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
} from "./metadata";
import { Entity, RelationKeyOf } from "./repository";
import {
  Constructor,
  DataType,
  DbType,
  EntityType,
  EntityTypeOf,
  Scalar,
  ScalarType,
  TsTypeToDataType,
} from "./types";

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

export class ModelBuilder {
  public readonly metadata: DbContextMetadata;
  constructor(ctr: Constructor<DbContext>) {
    this.metadata = {
      class: ctr,
      name: ctr.name,
      entities: [],
      dbName: ctr.name,
    };
  }

  /**
   * 实体映射
   */
  private _entityMap: Map<EntityType, EntityMapBuilder<any>> = new Map();

  /**
   * 声明实体
   */
  entity<T extends Entity>(ctr: Constructor<T>): EntityMapBuilder<T> {
    if (!this._entityMap.has(ctr)) {
      const metadata: Partial<EntityMetadata> = {
        name: ctr.name,
        class: ctr,
      };
      const eb = new EntityMapBuilder(this, metadata);
      this._entityMap.set(ctr, eb);
      this.metadata.entities.push(metadata as EntityMetadata);
    }
    return this._entityMap.get(ctr);
  }
}

/**
 * 实体映射构造器
 */
export class EntityMapBuilder<T extends Entity> {
  constructor(private modelBuilder: ModelBuilder, public readonly metadata: Partial<EntityMetadata>) {}

  /**
   * 实体声明为表
   */
  asTable(): TableEntityBuilder<T>;
  asTable(name: string): TableEntityBuilder<T>;
  asTable(
    build: (builder: TableEntityBuilder<T>) => void
  ): TableEntityBuilder<T>;
  asTable(
    name: string,
    build: (builder: TableEntityBuilder<T>) => void
  ): TableEntityBuilder<T>;
  asTable(...args: any): TableEntityBuilder<T> {
    let name: string;
    let build: (builder: TableEntityBuilder<T>) => void;
    if (typeof args[0] === "string") {
      name = args[0];
    }
    if (typeof args[0] === "function") {
      build = args[0];
    }
    if (typeof args[1] === "function") {
      build = args[1];
    }
    this.metadata.kind = "TABLE";
    (this.metadata as TableEntityMetadata).dbName = name || this.metadata.name;
    this.metadata.readonly = false;
    const builder = new TableEntityBuilder<T>(this.modelBuilder, this.metadata);
    if (build) {
      build(builder);
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
  asView(...args: any): ViewEntityBuilder<T> {
    let name: string;
    let build: (builder: ViewEntityBuilder<T>) => void;
    if (typeof args[0] === "string") {
      name = args[0];
    }
    if (typeof args[0] === "function") {
      build = args[0];
    }
    if (typeof args[1] === "function") {
      build = args[1];
    }
    this.metadata.kind = "VIEW";
    (this.metadata as ViewEntityMetadata).dbName = name || this.metadata.name;
    this.metadata.readonly = true;
    const builder = new ViewEntityBuilder<T>(this.modelBuilder, this.metadata);
    if (build) {
      build(builder);
    }
    return builder;
  }

  /**
   * 实体声明为视图
   */
  asQuery(): QueryEntityBuilder<T>;
  asQuery(name: string): QueryEntityBuilder<T>;
  asQuery(
    build: (builder: QueryEntityBuilder<T>) => void
  ): QueryEntityBuilder<T>;
  asQuery(
    name: string,
    build: (builder: QueryEntityBuilder<T>) => void
  ): QueryEntityBuilder<T>;
  asQuery(...args: any): QueryEntityBuilder<T> {
    let name: string;
    let build: (builder: QueryEntityBuilder<T>) => void;
    if (typeof args[0] === "string") {
      name = args[0];
    }
    if (typeof args[0] === "function") {
      build = args[0];
    }
    if (typeof args[1] === "function") {
      build = args[1];
    }
    this.metadata.kind = "QUERY";
    this.metadata.readonly = true;
    const builder = new QueryEntityBuilder<T>(this.modelBuilder, this.metadata);
    if (build) {
      build(builder);
    }
    return builder;
  }

  // asFunction(name: string,): this {
  //   this.$metadata.kind = 'function'
  //   this.$metadata.name = name
  //   this.$metadata.readonly = true
  //   return this
  // }
}

/**
 * 列可以重复获取，关系不可以重复获取
 */
export abstract class EntityBuilder<T extends Entity> {
  constructor(
    private modelBuilder: ModelBuilder,
    public readonly metadata: Partial<EntityMetadata>
  ) {}

  private _memberMaps: Map<
    string,
    ColumnBuilder<T> | HasOneBuilder<T, Entity> | HasManyBuilder<T, Entity>
  > = new Map();

  private assertRelation(property: string) {
    if (this._memberMaps.has(property)) {
      throw new Error(`Property ${property} is declared`);
    }
  }

  column<P extends Scalar>(
    selector: (p: T) => P,
    type: TsTypeToDataType<P>
  ): ColumnBuilder<T> {
    let property: string;
    const proxy: any = new Proxy(
      {},
      {
        get: (_, key: string) => {
          property = key;
        },
      }
    );
    selector(proxy);
    if (!property) {
      throw new Error(`Please select a property`);
    }
    let metadata: Partial<ColumnMetadata> = this._memberMaps.get(property) as any
    if (!metadata) {
      metadata = {
        kind: "COLUMN",
        name: property,
        type,
      };
    }

    const propBuilder = new ColumnBuilder(this.modelBuilder, metadata);
    this._memberMaps.set(property, propBuilder);
    this.metadata.members.push(metadata as ColumnMetadata);
    return propBuilder;
  }

  hasOne<D extends Entity>(
    propertySelector: (P: T) => D,
    type: Constructor<D>
  ): HasOneBuilder<T, D> {
    let property: string;
    const proxy: any = new Proxy(
      {},
      {
        get: (_, key: string) => {
          property = key;
        },
      }
    );
    propertySelector(proxy);
    if (!property) {
      throw new Error(
        'Property name is rquired, example property name "user", `builder.hasOne(p => p.user)`'
      );
    }

    this.assertRelation(property);
    const metadata: Partial<HasOneMetadata> = {
      type,
      property,
      referenceClass: type,
      // 追加关联关系
      referenceEntity: this.modelBuilder.entity(type).metadata as EntityMetadata
    };
    const builder = new HasOneBuilder<T, D>(this.modelBuilder, metadata);
    this._memberMaps.set(property, builder);
    this.metadata.members.push(metadata as HasOneMetadata);
    return builder;
  }

  hasMany<D extends Entity>(
    propertySelector: (p: T) => D[],
    type: Constructor<D>
  ): HasManyBuilder<T, EntityTypeOf<D>> {
    let property: string;
    const proxy: any = new Proxy(
      {},
      {
        get: (_, key: string) => {
          property = key;
        },
      }
    );
    propertySelector(proxy);
    if (!property)
      throw new Error("Please select a property as `p => p.propertyName`.");

    this.assertRelation(property);
    const metadata: Partial<HasManyMetadata> = {
      /**
       * 默认为一对一
       */
      kind: 'MANY_TO_ONE',
      referenceClass: type,
      referenceEntity: this.modelBuilder.entity(type).metadata as EntityMetadata,
      isNullable: true,
      name: property,
      isDetail: false,
      isImplicit: false,
    };
    const builder = new HasManyBuilder<T, D>(metadata);
    this._memberMaps.set(property, builder);
    this.metadata.members.push(metadata as HasManyMetadata);
    return builder;
  }

  /**
   * 可将初始化代码写于此处
   */
  for(action: (builder: this) => void): this {
    action(this);
    return this;
  }
}

/**
 * 表实体构造器
 */
export class TableEntityBuilder<T extends Entity> extends EntityBuilder<T> {
  public readonly metadata: Partial<TableEntityMetadata>;

  /**
   * 声明主键
   */
  hasKey<P extends ColumnKeyOf<T>>(property: P): this {
    this.metadata.primaryKey = property;
    return this;
  }

  /**
   * 初始化数据
   */
  hasData(data: T[]): this {
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

export class ColumnBuilder<T extends Entity> {
  constructor(
    private readonly modelBuilder: ModelBuilder,
    public readonly metadata: Partial<ColumnMetadata>
  ) {}

  /**
   * 列名
   */
  columnName(columnName: string): this {
    this.metadata.dbName = columnName;
    return this;
  }
  /**
   * 摘要说明
   */
  description(comment: string): this {
    this.metadata.description = comment;
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
  nullable(yesOrNo: boolean): this {
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
    this.metadata.identitySeed = seed ?? 0;
    this.metadata.identityStep = step ?? 1;
    return this;
  }
  key(): this {
    this.metadata.isPrimaryKey = true;
    return this;
  }
  /**
   * 计算列
   */
  calculate(expr: Expression): this {
    this.metadata.isCalculate = true;
    this.metadata.calculateExpr = expr;
    return this;
  }
  /**
   * 默认值
   */
  defaultValue(expr: Expression): this {
    this.metadata.defaultValue = expr;
    return this;
  }
}

export class HasOneBuilder<S extends Entity, D extends Entity> {
  constructor(
    private modelBuilder: ModelBuilder,
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
      const proxy: any = new Proxy(
        {},
        {
          get: (_, property: string) => {
            this.metadata.referenceProperty = property;
          },
        }
      );
      selector(proxy);
    }
    const oneToOne = new OneToOneMapBuilder<S, D>(
      this.modelBuilder,
      this.metadata as OneToOneMetadata
    );
    return oneToOne;
  }

  withMany(selector?: (p: D) => S[]): OneToManyBuilder<S, D> {
    this.assertWith();
    this.metadata.kind = "ONE_TO_MANY";
    if (selector) {
      const proxy: any = new Proxy(
        {},
        {
          get: (_, property: string) => {
            this.metadata.referenceProperty = property;
          },
        }
      );
      selector(proxy);
    }
    const oneToMay = new OneToManyBuilder<S, D>(
      this.metadata as OneToManyMetadata
    );
    return oneToMay;
  }
}

export class HasManyBuilder<S extends Entity, D extends Entity> {
  constructor(public readonly metadata: Partial<HasManyMetadata>) {}

  private assertWith() {
    if (this.metadata.kind) {
      throw new Error(
        `HasManyMetadata is withed ${this.metadata.kind} relation.`
      );
    }
  }

  withOne(): ManyToOneBuilder<S, D> {
    this.assertWith();
    this.metadata.kind = "MANY_TO_ONE";
    const manyToOne = new ManyToOneBuilder<S, D>(
      this.metadata as ManyToOneMetadata
    );
    return manyToOne;
  }

  withMany(): ManyToManyBuilder<S, D> {
    this.assertWith();
    const manyToMany = new ManyToManyBuilder<S, D>(
      this.metadata as ManyToManyMetadata
    );
    return manyToMany;
  }
}

export class OneToOneMapBuilder<S extends Entity, D extends Entity> {
  constructor(
    private readonly modelBuilder: ModelBuilder,
    public readonly metadata: OneToOneMetadata
  ) {}

  /**
   * 声明当前实体在一对一关系中占主键地位
   */
  isPrincipal(): PrimaryOneToOneBuilder<S, D> {
    this.assertPrincipal();
    this.metadata.isPrimary = true;
    return new PrimaryOneToOneBuilder<S, D>(this.modelBuilder, this.metadata);
  }

  hasForeign(selector?: (p: S) => D): ForeignOneToOneBuilder<S, D> {
    this.assertPrincipal();
    this.metadata.isPrimary = false;
    if (selector) {
      let foreignProperty: string;
      const proxy: any = new Proxy(
        {},
        {
          get: (_, key: string) => {
            foreignProperty = key;
          },
        }
      );
      selector(proxy);
      if (!foreignProperty) {
        throw new Error(`Pls select a property`);
      }
      (this.metadata as ForeignOneToOneMetadata).foreignProperty =
        foreignProperty;
    }
    return new ForeignOneToOneBuilder<S, D>(this.modelBuilder, this.metadata);
  }

  private assertPrincipal() {
    if (this.metadata.isPrimary !== undefined) {
      throw new Error(`Pincipal is ensure, pls do not repeat that.`);
    }
  }
}

export abstract class OneToOneBuilder<S extends Entity, D extends Entity> {
  constructor(
    private modelBuilder: ModelBuilder,
    public readonly metadata: OneToOneMetadata
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

  constraintName(name: string): this {
    this.metadata.constraintName = name;
    return this;
  }
}

export class OneToManyBuilder<S extends Entity, D extends Entity> {
  constructor(public readonly metadata: OneToManyMetadata) {}
}

export class ManyToOneBuilder<S extends Entity, D extends Entity> {
  constructor(public readonly metadata: ManyToOneMetadata) {}
}

export class ManyToManyBuilder<S extends Entity, D extends Entity> {
  constructor(public readonly metadata: ManyToManyMetadata) {}
  /**
   * 指定中间表名称
   */
  hasTable(name: string): this {
    this.metadata.relationTableName = name;
    return this;
  }

  /**
   * 指定约束名称
   */
  constraintName(name: string): this {
    this.metadata.relationConstraintName = name;
    return this;
  }
}

/*************************试验代码****************************/
class X extends Entity {
  str: string;
  date: Date;
  y: Y;
  ys: Y[];
}

class Y extends Entity {
  x: X;
  xs: X[];
}

class DB extends DbContext {}

const modelBuilder = new ModelBuilder(DB);

modelBuilder.entity(X).asTable((builder) => {
  builder.column((p) => p.str, String);
  builder.hasMany((p) => p.ys, Y).withOne();
  builder
    .hasOne((p) => p.y, Y)
    .withOne((p) => p.x)
    .hasForeign()
    .constraintName("abc");
});

type action = <P extends Scalar>(x: () => P, d: Convert<P>) => void;
const d: action = null;
d(() => false, Boolean);

type Convert<T> = T extends string
  ? StringConstructor
  : T extends number
  ? NumberConstructor
  : T extends Date
  ? DateConstructor
  : T extends boolean
  ? BooleanConstructor
  : T extends Buffer
  ? typeof Buffer
  : T extends ArrayBuffer
  ? ArrayBufferConstructor
  : T extends SharedArrayBuffer
  ? SharedArrayBufferConstructor
  : T extends object
  ? ObjectConstructor
  : T extends (infer M)[]
  ? [Constructor<M>]
  : never;

type x = TsTypeToDataType<string>;
