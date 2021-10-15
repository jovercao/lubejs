/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-inferrable-types */
/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  XCondition,
  XExpression,
  RowObjectFrom,
  XRowset,
  InputObject,
  Sort,
  SortObject,
  Condition,
  Select,
  RowObject,
  Executor,
  SQL,
} from '../core';
import { EntityMetadata, TableEntityMetadata } from './metadata';
import { FetchRelations } from './data-types';
import { Entity, EntityConstructor, EntityInstance, ToEntity } from './entity';
import { mergeFetchRelations } from './util';
import { metadataStore } from './metadata-store';
import { makeRowset, aroundRowset, isTableEntity } from './metadata/util';
import { DbContext } from './db-context';
import {
  ColumnsOf,
  DefaultRowObject,
  NamedSelect,
  XTable,
} from '../core/sql';
import { EntityMgr } from './entity-mgr';

// import { getMetadata } from 'typeorm'

const { select } = SQL;
const ROWSET_ALIAS = '__t__';

// eslint-disable-next-line @typescript-eslint/ban-types
export class Queryable<T extends RowObject> implements AsyncIterable<T> {
  constructor(
    protected context: DbContext,
    Ctr?: EntityConstructor<ToEntity<T>>,
    rowset?: XRowset<T>
  ) {
    if (!Ctr && !rowset) {
      throw new Error(`Ctr and rowset One of them must be specified.`);
    }
    if (Ctr) {
      this._metadata = metadataStore.getEntity(Ctr);
      if (!rowset) {
        this._rowset = makeRowset<any>(Ctr) as XRowset<T>;
      }
    }

    if (rowset) {
      this._rowset = rowset;
    }

    if (isTableEntity(this._metadata)) {
      this._tableMetadata = this._metadata;
    }
  }

  private get mgr(): EntityMgr<ToEntity<T>> {
    if (!this._metadata) {
      throw new Error(`Mgr is only allowed for entities in queryable.`);
    }
    return this.context.getMgr(this._metadata.class);
  }

  private _rowset!: XRowset<DefaultRowObject>;
  // protected sql: Select<any>;
  private _metadata?: EntityMetadata;
  private _includes?: FetchRelations<T>;
  private _withDetail: boolean = false;
  private _sql?: Select<DefaultRowObject>;
  private get sql(): Select<DefaultRowObject> {
    if (!this._sql) {
      this._sql = select(this._rowset.star).from(this._rowset);
    }
    return this._sql;
  }
  private _tableMetadata?: TableEntityMetadata;

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

  skip(count: number): this {
    if (this.sql.$offset !== undefined) {
      throw new Error(
        `Skip cannot be used twice, If you want to use a subquery, call .fork() first.`
      );
    }
    this.sql.offset(count);
    return this;
  }

  take(count: number): this {
    if (this.sql.$limit !== undefined) {
      throw new Error(
        `Take cannot be used twice, If you want to use a subquery, call .fork() first.`
      );
    }
    this.sql.limit(count);
    return this;
  }

  // /**
  //  * 克隆当前对象用于添加信息，以免污染当前对象
  //  */
  fork(rowset: XRowset<T>): Queryable<T> {
    if (this._metadata) {
      rowset = aroundRowset(rowset, this._metadata) as any;
    }
    const queryable = new Queryable(
      this.context,
      this._metadata?.class,
      rowset
    );
    queryable._withDetail = this._withDetail;
    queryable._includes = this._includes;
    queryable._metadata = this._metadata;
    return queryable;
  }

  /**
   * 过滤数据并返回一个新的Queryable
   */
  filter(condition: (p: XRowset<T>) => XCondition<T>): this {
    this.sql.andWhere(condition(this._rowset as XRowset<T>));
    return this;
  }

  count(): Queryable<{
    count: number;
  }> {
    // this._sql.$columns = [
    //   SQL.std.count(this._rowset.$field(this._metadata!.key!.property! as any)).as('count')
    // ];
    return this.map(() => ({
      count: SQL.std.count(1),
    }));
  }

  sort(sorts: (p: XRowset<T>) => Sort[] | SortObject<T>): this {
    if (this.sql.$sorts) {
      throw new Error(`Cannot be used .sort(...) twice.`);
    }
    this.sql.orderBy(sorts(this._rowset as XRowset<T>));
    return this;

    // return this.fork(
    //   select(this.rowset.star)
    //     .from(this.rowset)
    //     .orderBy(sorts(this.rowset))
    //     .as(ROWSET_ALIAS)
    // );
  }

  /**
   * 添加过滤条件，并限定返回头一条记录
   */
  find(filter: (p: XRowset<T>) => XCondition<T>): this {
    return this.filter(filter).take(1);
  }

  union(...queries: Queryable<T>[]): this {
    const sql = this.sql;
    queries.forEach(query => {
      sql.unionAll(query.sql);
    });
    return this;
  }

  /**
   * 返回一个新的类型
   */
  map<G extends InputObject>(
    results: (p: XRowset<T>) => G
  ): Queryable<RowObjectFrom<G>> {
    const rowset = this._sql ? this._sql.as(ROWSET_ALIAS) : this._rowset;
    const sql = select(results(rowset as XRowset<T>)).from(rowset);
    return new Queryable(this.context, undefined, sql.as(ROWSET_ALIAS));
  }

  groupBy<G extends InputObject>(
    results: (p: XRowset<T>) => G,
    groups: (p: XRowset<T>) => XExpression[],
    having?: (p: XRowset<T>) => Condition
  ): Queryable<RowObjectFrom<G>> {
    const rowset = this._sql ? this.sql.as(ROWSET_ALIAS) : this._rowset;

    const sql = select(results(rowset as XRowset<T>)).groupBy(
      ...groups(this._rowset as XRowset<T>)
    );
    if (having) {
      sql.having(having(rowset as XRowset<T>));
    }
    return new Queryable(this.context, undefined, sql.as(ROWSET_ALIAS));
  }

  join<J extends Entity, G extends InputObject>(
    entity: EntityConstructor<J>,
    on: (left: XRowset<T>, right: XRowset<J>) => Condition,
    results: (left: XRowset<T>, right: XRowset<J>) => G
  ): Queryable<RowObjectFrom<G>> {
    const rightRowset = makeRowset(entity);
    const leftRowset = this._sql ? this._sql.as(ROWSET_ALIAS) : this._rowset;
    const newRowset = SQL.select(
      results(leftRowset as XRowset<T>, rightRowset as XRowset<J>)
    )
      .from(this._rowset)
      .join(
        rightRowset,
        on(leftRowset as XRowset<T>, rightRowset as XRowset<J>),
        true
      )
      .as(ROWSET_ALIAS);

    return new Queryable(this.context, undefined, newRowset);
  }

  /**
   * 查询关联导航属性
   */
  include(props: FetchRelations<T>): this {
    if (!this._tableMetadata) {
      throw new Error('Queryable.include is allow use in table entity only.');
    }
    // const queryable = this.fork(this.rowset);
    // queryable._includes = props;
    // return queryable;
    this._includes = mergeFetchRelations(this._includes, props);
    return this;
  }

  /**
   * 同时返回明细属性
   * 即被标记为明细属性的导航属性
   */
  withDetail(): this {
    if (!this._tableMetadata) {
      throw new Error(
        'Queryable.withDetail is allow use in table entity only.'
      );
    }
    this._withDetail = true;
    return this;
  }

  private getSqlForExecute(): Select<DefaultRowObject> {
    if (this._sql) {
      return this._sql;
    }

    // 减少SELECT嵌套
    if (NamedSelect.isNamedSelect(this._rowset)) {
      return this._rowset.$select;
    } else {
      return SQL.select(this._rowset.star).from(this._rowset);
    }
  }

  private async loadRelations(items: T | T[]): Promise<void> {
    let includes: FetchRelations<any> | undefined;
    if (this._withDetail) {
      includes = this._tableMetadata!.getDetailIncludes();
    }
    if (this._includes) {
      includes = mergeFetchRelations(includes, this._includes);
    }
    if (includes) {
      await this.context
        .getMgr(this._metadata!.class)
        .loadRelations(Array.isArray(items) ? items : [items], includes!);
    }
  }

  /**
   * 执行查询并将结果转换为数组，并获取所有数据返回一个数组
   */
  async fetchAll(): Promise<EntityInstance<T>[]> {
    const { rows } = await this.executor.query(this.getSqlForExecute());

    if (!this._metadata) {
      return rows as EntityInstance<T>[];
    }

    const items = rows.map(row => this.mgr.toEntity(row));

    if (this._tableMetadata) {
      await this.loadRelations(items);
    }
    return items as EntityInstance<T>[];
  }

  /**
   * 执行查询，并获取第一行记录
   */
  async fetchFirst(): Promise<EntityInstance<T>> {
    const { rows } = await this.executor.query(
      this.getSqlForExecute().limit(1)
    );
    if (rows.length <= 0) {
      throw new Error(`No result exists on this query.`);
    }
    if (!this._metadata) {
      return rows[0] as EntityInstance<T>;
    }
    const item = this.mgr.toEntity(rows[0]);

    if (this._tableMetadata) {
      await this.loadRelations(item);
    }
    return item as EntityInstance<T>;
  }
}
