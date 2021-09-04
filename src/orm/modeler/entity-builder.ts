import { Scalar, Select } from "../../core";
import { Entity, EntityConstructor } from "../entity";
import { ColumnMetadata, EntityMetadata, HasManyMetadata, HasOneMetadata, IndexMetadata, KeyMetadata, TableEntityMetadata } from "../metadata";
import { DataTypeOf, ScalarType } from "../types";
import { selectProperty } from "../util";
import { ContextBuilder } from "./context-builder";
import { HasManyBuilder } from "./has-many-builder";
import { HasOneBuilder } from "./has-one-builder";
import { IndexBuilder } from "./index-builder";
import { PropertyBuilder } from "./property-builder";
import { TableKeyBuilder } from "./table-key-builder";

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
