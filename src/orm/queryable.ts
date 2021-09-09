/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-inferrable-types */
/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  CompatibleCondition,
  CompatibleExpression,
  RowObjectFrom,
  ProxiedRowset,
  InputObject,
  Sort,
  SortObject,
  Condition,
  Select,
  RowObject,
  NamedSelect,
  isStringType,
  Executor,
  SQL,
} from '../core';
import { EntityMetadata, ColumnMetadata, RelationMetadata } from './metadata';
import { Repository } from './repository';
import { FetchRelations, RelationKeyOf } from './types';
import { Entity, EntityConstructor, EntityInstance } from './entity';
import { mergeFetchRelations } from './util';
import { metadataStore } from './metadata-store';
import {
  makeRowset,
  aroundRowset,
  isPrimaryOneToOne,
  isForeignOneToOne,
  isOneToMany,
  isManyToOne,
  isManyToMany,
} from './metadata/util';
import { DbContext } from './db-context';

// import { getMetadata } from 'typeorm'

const { and, select } = SQL;
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

const ROWSET_ALIAS = '__t__';

// eslint-disable-next-line @typescript-eslint/ban-types
export class Queryable<T extends Entity | RowObject>
  implements AsyncIterable<T>
{
  constructor(
    protected context: DbContext,
    Entity: EntityConstructor<T> // constructor(
  ) {
    if (Entity) {
      this.metadata = metadataStore.getEntity(
        Entity as EntityConstructor<Entity>
      );
      if (!this.metadata) {
        throw new Error(`Only allow register entity constructor.`);
      }
    }
    this.rowset = makeRowset<any>(Entity) as ProxiedRowset<T>;
    // this.sql = select(this.rowset.star).from(this.rowset);
  }

  protected rowset: ProxiedRowset<T>;
  // protected sql: Select<any>;
  protected metadata?: EntityMetadata;
  private _includes?: FetchRelations<T>;
  private _nocache: boolean = false;
  private _withDetail: boolean = false;

  // private _appendWhere(where: CompatibleCondition<T>): this {
  //   if (!this._where) {
  //     this._where = ensureCondition(where, this.rowset);
  //   }
  //   this._where = and(this._where, ensureCondition(where, this.rowset));
  //   return this;
  // }

  protected get executor(): Executor {
    return this.context.connection;
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
    const sql = select(this.rowset.star)
      .from(this.rowset)
      .offset(skip)
      .limit(count);
    return this.fork(sql.as(ROWSET_ALIAS));
  }

  // private _buildSelectSql(): Select<T>;
  // private _buildSelectSql<G extends InputObject>(
  //   results: G
  // ): Select<RowTypeFrom<G>>;
  // private _buildSelectSql<G extends InputObject>(
  //   results?: (p: ProxiedRowset<T>) => G
  // ): Select {
  //   const sql = select(results ? results : this.rowset._).from(this.rowset);
  //   if (this._where) sql.where(this._where);
  //   if (this._sorts) sql.orderBy(this._sorts);
  //   return sql;
  // }

  // /**
  //  * 克隆当前对象用于添加信息，以免污染当前对象
  //  */
  private fork(rowset: ProxiedRowset<T>): Queryable<T> {
    if (this.metadata) {
      rowset = aroundRowset(rowset, this.metadata);
    }
    const queryable = this.create(rowset);
    queryable._withDetail = this._withDetail;
    queryable._includes = this._includes;
    queryable.metadata = this.metadata;
    return queryable;
  }

  /**
   * 创建一个不含metadata的内部的Queryable
   * @param rowset
   * @returns
   */
  private create<T extends RowObject>(rowset: ProxiedRowset<T>): Queryable<T> {
    const queryable: Queryable<T> = Object.create(Queryable.prototype);
    queryable.context = this.context;
    queryable.rowset = rowset;
    queryable._nocache = true;
    return queryable;
  }

  /**
   * 过滤数据并返回一个新的Queryable
   */
  filter(
    condition: (p: ProxiedRowset<T>) => CompatibleCondition<T>
  ): Queryable<T> {
    const queryable = this.fork(
      select(this.rowset.star)
        .from(this.rowset)
        .where(condition(this.rowset))
        .as(ROWSET_ALIAS)
    );
    return queryable;
  }

  /**
   * 返回一个新的类型
   */
  map<G extends InputObject>(
    results: (p: ProxiedRowset<T>) => G
  ): Queryable<RowObjectFrom<G>> {
    const sql = select(results(this.rowset)).from(this.rowset);
    return this.create(sql.as(ROWSET_ALIAS));
  }

  sort(sorts: (p: ProxiedRowset<T>) => Sort[] | SortObject<T>): Queryable<T> {
    return this.fork(
      select(this.rowset.star)
        .from(this.rowset)
        .orderBy(sorts(this.rowset))
        .as(ROWSET_ALIAS)
    );
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
  ): Queryable<RowObjectFrom<G>> {
    if (where) {
      this.filter(where);
    }
    const sql = select(results(this.rowset)).groupBy(...groups(this.rowset));
    return this.create(sql.as(ROWSET_ALIAS));
  }

  union(...sets: Queryable<T>[]): Queryable<T> {
    const sql = select(this.rowset.star).from(this.rowset);
    sets.forEach(query => {
      sql.unionAll(select(query.rowset.star).from(query.rowset));
    });
    return this.fork(sql.as(ROWSET_ALIAS));
  }

  join<J extends Entity, G extends InputObject>(
    entity: EntityConstructor<J>,
    on: (left: ProxiedRowset<T>, right: ProxiedRowset<J>) => Condition,
    results: (left: ProxiedRowset<T>, right: ProxiedRowset<J>) => G
  ): Queryable<RowObjectFrom<G>> {
    const rightRowset = makeRowset(entity);
    const newRowset = select(results(this.rowset, rightRowset))
      .from(this.rowset)
      .join(rightRowset, on(this.rowset, rightRowset), true)
      .as(ROWSET_ALIAS);
    return this.create(newRowset);
  }

  private assertMetdata(metadata?: EntityMetadata): asserts metadata {
    if (!this.metadata) {
      throw new Error('Not allow this operation when has no netadata.');
    }
  }
  /**
   * 查询关联属性
   */
  include(props: FetchRelations<T>): Queryable<T> {
    this.assertMetdata(this.metadata);
    const queryable = this.fork(this.rowset);
    queryable._includes = props;
    return queryable;
  }

  withDetail(): Queryable<T> {
    this.assertMetdata(this.metadata);
    const queryable = this.fork(this.rowset);
    queryable._withDetail = true;
    return queryable;
  }

  withNocache(): Queryable<T> {
    const query = this.fork(this.rowset);
    query._nocache = true;
    return query;
  }

  getSql(): Select<T> {
    if (NamedSelect.isNamedSelect(this.rowset)) {
      return this.rowset.$select as Select<T>;
    }
    return select(this.rowset.star).from(this.rowset);
  }

  /**
   * 执行查询并将结果转换为数组，并获取所有数据返回一个数组
   */
  async fetchAll(): Promise<EntityInstance<T>[]> {
    const sql = this.getSql();
    const { rows } = await this.executor.query(sql);

    if (this.metadata) {
      return rows as EntityInstance<T>[];
    }

    const items: T[] = [];

    let includes: FetchRelations<any> | undefined;
    if (this._withDetail) {
      includes = this.metadata!.getDetailIncludes();
    }
    if (this._includes) {
      includes = mergeFetchRelations(includes, this._includes);
    }

    for (const row of rows!) {
      const item = this.toEntity(row);
      items.push(item);
      // TODO: 添加避免重复加载代码
      if (includes) {
        await this.loadRelation(item, includes);
      }
    }
    return items as EntityInstance<T>[];
  }

  /**
   * 执行查询，并获取第一行记录
   */
  async fetchFirst(): Promise<EntityInstance<T> | undefined> {
    const sql = this.getSql().limit(1);
    const rows = (await this.executor.query(sql)).rows!;
    if (!this.metadata) {
      return rows[0] as EntityInstance<T> | undefined;
    }
    if (!rows[0]) return;
    const item = this.toEntity(rows[0]);
    let includes: FetchRelations | undefined;
    if (this._includes) {
      includes = this._includes;
    }
    if (this._withDetail) {
      const detailIncludes = this.metadata.getDetailIncludes();
      includes = mergeFetchRelations({}, includes, detailIncludes);
    }
    if (includes) {
      await this.loadRelation(item, includes);
    }
    return item as EntityInstance<T>;
  }

  // TODO: 使用DataLoader优化加载性能
  async loadRelation(item: T, relations: FetchRelations<T>): Promise<void> {
    this.assertMetdata(this.metadata);
    for (const relationName of Object.keys(relations)) {
      const relation = this.metadata.getRelation(relationName);
      if (!relation) {
        throw new Error(`Property ${relationName} is not a relation property.`);
      }
      let subIncludes = Reflect.get(relations, relationName);
      if (subIncludes === true) subIncludes = null;

      const data = await this.fetchRelation(item, relation, {
        _withDetail: this._withDetail,
        _includes: subIncludes,
      });
      Reflect.set(item, relation.property, data);
    }
  }

  protected async fetchRelation<R extends RelationKeyOf<T>>(
    item: T,
    relation: RelationMetadata,
    options?: {
      _withDetail: boolean;
      _includes: FetchRelations<T[R]>;
    }
  ): Promise<T[R] | null> {
    this.assertMetdata(this.metadata);
    const relationRepository: Repository<any> = this.context.getRepository(
      relation.referenceClass
    );
    relationRepository._withDetail = options?._withDetail ?? false;
    relationRepository._includes = options?._includes;

    if (isPrimaryOneToOne(relation)) {
      const key = Reflect.get(item, this.metadata.key!.property);
      const subItem = await relationRepository
        .find(r => r[relation.referenceRelation.foreignProperty].eq(key))
        .fetchFirst();
      return subItem;
      // 本表为次表
    } else if (isForeignOneToOne(relation)) {
      const refKey = Reflect.get(item, relation.foreignProperty);
      return await relationRepository.get(refKey);
    } else if (isOneToMany(relation)) {
      const key = Reflect.get(item, this.metadata.key!.property);
      const relationItems = await relationRepository
        .filter(rowset =>
          rowset[relation.referenceRelation.foreignProperty].eq(key)
        )
        .fetchAll();
      return relationItems as any;
    } else if (isManyToOne(relation)) {
      const refValue = Reflect.get(item, relation.foreignProperty);
      const relationItem = await relationRepository
        .find(rowset =>
          rowset[relation.referenceEntity.key.column.property].eq(refValue)
        )
        .fetchFirst();
      return relationItem;
    } else if (isManyToMany(relation)) {
      const key = Reflect.get(item, this.metadata.key!.property);
      // 本表为字段1关联
      const rt = makeRowset<any>(relation.relationEntity.class);
      // 当前外键列
      const thisForeignColumn =
        relation.relationRelation.referenceRelation.foreignColumn;
      // 关联外键列
      const relationForeignColumn =
        relation.referenceRelation.relationRelation.referenceRelation
          .foreignColumn;
      const relationIdsSelect = select(rt.$field(relationForeignColumn.property))
        .from(rt)
        .where(rt.$field(thisForeignColumn.property).eq(key));
      const subItems = await relationRepository
        .filter(rowset =>
          rowset[relation.referenceEntity.key.column.property].in(
            relationIdsSelect
          )
        )
        .fetchAll();
      return subItems as any;
    }
    return null;
  }

  protected toEntityValue(datarow: any, column: ColumnMetadata): any {
    if (
      (column.type === Object || column.type === Array) &&
      isStringType(column.dbType)
    ) {
      return JSON.parse(Reflect.get(datarow, column.property));
    } else {
      // 因为rowset已经完成映射转换，在SQL级别已是输出属性名，因此直接取属性名即可
      return Reflect.get(datarow, column.property);
    }
  }

  /**
   * 将数据库记录转换为实体
   */
  protected toEntity(datarow: any, item?: T): T {
    this.assertMetdata(this.metadata);
    if (!item) {
      item = new this.metadata.class() as any;
    }
    for (const column of this.metadata.columns) {
      const itemValue = this.toEntityValue(datarow, column);
      // 如果是隐式属性，则声明为不可见属性
      if (column.isImplicit) {
        Reflect.defineProperty(item!, column.property, {
          enumerable: false,
          value: itemValue,
          writable: true,
        });
      } else {
        Reflect.set(item!, column.property, itemValue);
      }
    }
    return item!;
  }
}
