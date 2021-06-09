/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-inferrable-types */
/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  CompatibleCondition,
  CompatibleExpression,
  RowTypeFrom,
  ProxiedRowset,
  InputObject,
  SortInfo,
  SortObject,
  Condition,
  Select,
  CompatibleSortInfo,
} from "./ast";
import { and, select } from "./builder";
import { ROWSET_ALIAS } from "./constants";
import { Executor } from "./execute";
import {
  EntityMetadata,
  metadataStore,
  makeRowset,
  isManyToMany,
  isManyToOne,
  isOneToMany,
  isForeignOneToOne,
  isPrimaryOneToOne,
  ColumnMetadata,
} from "./metadata";
import { FetchRelations, RelationKeyOf } from "./repository";
import { Constructor, Entity, RowObject } from "./types";
import { ensureCondition } from "./util";
// import { getMetadata } from 'typeorm'

/**
 * 可查询对象，接口类似js自带的`Array`对象，并且其本身是一个异步可迭代对象，实现了延迟加载功能，数据将在调用`toArray`，或者对其进行遍历时才执行加载
 * // TODO: 实现延迟在线逐条查询功能
 * // TODO: 性能优化，不再每一个动作产生一个SQL子查询
 * ```ts
 * const x: Queryable<T> = ...
 * for await (const item of x) {
 *    ...
 * }
 * ```
 */
// eslint-disable-next-line @typescript-eslint/ban-types
export class Queryable<T extends Entity | RowObject>
  implements AsyncIterable<T>
{
  protected rowset: ProxiedRowset<T>;
  protected readonly metadata?: EntityMetadata;
  private _where: CompatibleCondition;
  private _sorts: CompatibleSortInfo;
  private _includes: FetchRelations<T>;
  protected executor: Executor;
  /**
   * 默认使用缓存
   */
  private _nocache: boolean = false;
  private _withDetail: boolean = false;

  constructor(executor: Executor, ctr: Constructor<T>) // constructor(
  //   executor: Executor,
  //   rowsetOrCtr: Constructor<T & Entity>
  // )
  {
    this.executor = executor;
    this.metadata = metadataStore.getEntity(ctr as Constructor<Entity>);
    if (!this.metadata) {
      throw new Error(`Only allow register entity constructor.`);
    }
    this.rowset = makeRowset<any>(ctr) as ProxiedRowset<T>;
  }

  private _appendWhere(where: CompatibleCondition<T>): this {
    if (!this._where) {
      this._where = where;
    }
    this._where = and(this._where, ensureCondition(where, this.rowset));
    return this;
  }

  /**
   * 异步迭代器，延迟查询的关键点
   */
  [Symbol.asyncIterator](): AsyncIterator<T> {
    let result: T[];
    let i = 0;
    return {
      next: async (): Promise<IteratorResult<T>> => {
        if (!result) {
          result = await this.fetchAll();
        }

        if (i < result.length) {
          return { value: result[i++], done: false };
        }
        return { value: undefined, done: true };
      },
    };
  }

  take(count: number, skip = 0): Queryable<T> {
    // if (this._take !== undefined) {
    //   this._take = lines;
    //   this._skip = skip;
    //   return this;
    // }
    const sql = this._buildSelectSql().offset(skip).limit(count);
    return this.create(sql.as(ROWSET_ALIAS));
  }

  private _buildSelectSql(): Select<any>;
  private _buildSelectSql<G extends InputObject>(
    results: G
  ): Select<RowTypeFrom<G>>;
  private _buildSelectSql<G extends InputObject>(
    results?: (p: ProxiedRowset<T>) => G
  ): Select {
    const sql = select(results ? results : this.rowset._).from(this.rowset);
    if (this._where) sql.where(this._where);
    if (this._sorts) sql.orderBy(this._sorts);
    return sql;
  }

  /**
   * 克隆当前对象用于添加信息，以免污染当前对象
   */
  private fork(): Queryable<T> {
    const queryable: Queryable<T> = Object.create(Queryable.prototype);
    Object.assign(queryable, this);
    return queryable;
  }

  /**
   * 创建一个不含metadata的内部的Queryable
   * @param rowset
   * @returns
   */
  private create<T extends RowObject>(rowset: ProxiedRowset<T>): Queryable<T> {
    const queryable: Queryable<T> = Object.create(Queryable.prototype);
    queryable.executor = this.executor;
    queryable.rowset = rowset;
    return queryable;
  }

  /**
   * 过滤数据并返回一个新的Queryable
   */
  filter(
    condition: (p: ProxiedRowset<T>) => CompatibleCondition<T>
  ): Queryable<T> {
    const queryable = this.fork();
    queryable._appendWhere(condition(queryable.rowset));
    return queryable;
  }

  /**
   * 返回一个新的类型
   */
  map<G extends InputObject>(
    results: (p: ProxiedRowset<T>) => G
  ): Queryable<RowTypeFrom<G>> {
    const sql = this._buildSelectSql(results(this.rowset));
    return this.create(sql.as(ROWSET_ALIAS));
  }

  sort(
    sorts: (p: ProxiedRowset<T>) => SortInfo[] | SortObject<T>
  ): Queryable<T> {
    const queryable = this.fork();
    queryable._sorts = sorts(this.rowset);
    return queryable;
  }

  /**
   * 添加过滤条件，并限定返回头一条记录
   */
  find(filter: (p: ProxiedRowset<T>) => CompatibleCondition<T>): Queryable<T> {
    return this.filter(filter).take(1);
  }

  groupBy<G extends InputObject>(
    results: (p: ProxiedRowset<T>) => G,
    groups: (p: ProxiedRowset<T>) => CompatibleExpression[],
    where?: (p: ProxiedRowset<T>) => Condition
  ): Queryable<RowTypeFrom<G>> {
    if (where) {
      this.filter(where);
    }
    const sql = this._buildSelectSql(results(this.rowset)).groupBy(
      ...groups(this.rowset)
    );
    return this.create(sql.as(ROWSET_ALIAS));
  }

  union(...sets: Queryable<T>[]): Queryable<T> {
    const sql = this._buildSelectSql();
    sets.forEach((query) => {
      sql.unionAll(query._buildSelectSql());
    });
    return this.create(sql.as(ROWSET_ALIAS));
  }

  join<J extends Entity, G extends InputObject>(
    entity: Constructor<J>,
    on: (left: ProxiedRowset<T>, right: ProxiedRowset<J>) => Condition,
    results: (left: ProxiedRowset<T>, right: ProxiedRowset<J>) => G
  ): Queryable<RowTypeFrom<G>> {
    const rightRowset = makeRowset(entity);
    const newRowset = this._buildSelectSql(results(this.rowset, rightRowset))
      .join(rightRowset, on(this.rowset, rightRowset), true)
      .as(ROWSET_ALIAS);
    return this.create(newRowset);
  }

  private assertMetdata() {
    if (!this.metadata) {
      throw new Error("Not allow this operation when has no netadata.");
    }
  }
  /**
   * 查询关联属性
   */
  include(props: FetchRelations<T>): Queryable<T> {
    this.assertMetdata();
    const queryable = this.fork();
    queryable._includes = props;
    return queryable;
  }

  withDetail(): Queryable<T> {
    this.assertMetdata();
    const queryable = this.fork();
    queryable._withDetail = true;
    return queryable;
  }

  withNocache(): Queryable<T> {
    const query = this.fork();
    query._nocache = true;
    return query;
  }

  /**
   * 执行查询并将结果转换为数组，并获取所有数据返回一个数组
   */
  async fetchAll(): Promise<T[]> {
    const sql = this._buildSelectSql();
    const { rows } = await this.executor.query(sql);

    if (!this.metadata) return rows;

    const items: T[] = [];
    for (const row of rows) {
      const item = this.toEntity(row);
      items.push(item);
      // TODO: 添加避免重复加载代码
      if (this._withDetail) {
        await this.loadRelation(item, this.metadata.getDetailIncludes());
      }
      if (this._includes) {
        await this.loadRelation(item, this._includes);
      }
    }
    return items;
  }

  /**
   * 执行查询，并获取第一行记录
   */
  async fetchFirst(): Promise<T> {
    const sql = this._buildSelectSql().limit(1);
    const { rows } = await this.executor.query(sql);
    if (!this.metadata) {
      return rows[0];
    }
    const item = this.toEntity(rows[0]);
    if (this._withDetail) {
      await this.loadRelation(item, this.metadata.getDetailIncludes());
    }
    if (this._includes) {
      await this.loadRelation(item, this._includes);
    }
    return item;
  }

  // TODO: 使用DataLoader优化加载性能
  async loadRelation(item: T, relations: FetchRelations<T>): Promise<void> {
    for (const relationName of Object.keys(relations)) {
      const relation = this.metadata.getRelation(relationName);
      if (!relation) {
        throw new Error(`Property ${relationName} is not a relation property.`);
      }
      let subIncludes = Reflect.get(relations, relationName);
      if (subIncludes === true) subIncludes = null;

      const relationQueryable = new Queryable<any>(
        this.executor,
        relation.referenceEntity.class as Constructor<any>
      );
      if (subIncludes) {
        relationQueryable._includes = subIncludes;
      }
      // 复制当前选项
      relationQueryable._withDetail = this._withDetail;

      if (isPrimaryOneToOne(relation)) {
        const idValue = Reflect.get(item, this.metadata.keyColumn.property);
        const relationItem = await relationQueryable
          .filter((rowset) =>
            rowset[relation.referenceRelation.foreignColumn.property].eq(
              idValue
            )
          )
          .fetchFirst();
        Reflect.set(item, relation.property, relationItem);
        // 本表为次表
      } else if (isForeignOneToOne(relation)) {
        const refValue = Reflect.get(item, relation.foreignColumn.property);
        const relationItem = await relationQueryable
          .find((rowset) =>
            rowset
              .field(relation.referenceEntity.keyColumn.property)
              .eq(refValue)
          )
          .fetchFirst();
        Reflect.set(item, relation.property, relationItem);
      } else if (isOneToMany(relation)) {
        const idValue = Reflect.get(item, this.metadata.keyColumn.property);
        const relationItems = await relationQueryable
          .filter((rowset) =>
            rowset
              .field(relation.referenceRelation.foreignColumn.property)
              .eq(idValue)
          )
          .fetchAll();
        Reflect.set(item, relation.property, relationItems);
      } else if (isManyToOne(relation)) {
        const refValue = Reflect.get(item, relation.foreignColumn.property);
        const relationItem = await relationQueryable
          .find((rowset) =>
            rowset
              .field(relation.referenceEntity.keyColumn.property)
              .eq(refValue)
          )
          .fetchFirst();
        Reflect.set(item, relation.property, relationItem);
      } else if (isManyToMany(relation)) {
        const idValue = Reflect.get(item, this.metadata.keyColumn.property);
        // 本表为字段1关联
        const rt = makeRowset<any>(relation.relationEntity.class);
        // 当前外键列
        const thisForeignColumn =
          relation.relationRelation.referenceRelation.foreignColumn;
        // 关联外键列
        const relationForeignColumn =
          relation.referenceRelation.relationRelation.referenceRelation
            .foreignColumn;
        const relationIdsSelect = select(
          rt.field(relationForeignColumn.property)
        )
          .from(rt)
          .where(rt.field(thisForeignColumn.property).eq(idValue));
        const subItems = relationQueryable
          .filter((rowset) =>
            rowset
              .field(relation.referenceEntity.keyColumn.property)
              .in(relationIdsSelect)
          )
          .fetchAll();
        Reflect.set(item, relation.property, subItems);
      }
    }
  }

  async fetchRelation<R extends RelationKeyOf<T>>(item: T, relation: R): Promise<T[R]> {
    throw new Error(`尚未实现！`);
  }

  protected toEntityValue(datarow: any, column: ColumnMetadata): any {
    if ((column.type === Object || column.type === Array) && column.dbType.name === 'STRING') {
      return JSON.parse(Reflect.get(datarow, column.columnName));
    } else {
      return Reflect.get(datarow, column.columnName);
    }
  }

  /**
   * 将数据库记录转换为实体
   */
  protected toEntity(datarow: any, item?: T): T {
    if (!item) {
      item = new this.metadata.class() as any;
    }
    for (const column of this.metadata.columns) {
      const itemValue = this.toEntityValue(datarow, column);
      // 如果是隐式属性，则声明为不可见属性
      if (column.isImplicit) {
        Reflect.defineProperty(item, column.property, {
          enumerable: false,
          value: itemValue,
          writable: true,
        });
      } else {
        Reflect.set(item, column.property, itemValue);
      }
    }
    return item;
  }
}
