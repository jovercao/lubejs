/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  CompatibleCondition,
  CompatibleExpression,
  RowObject,
  RowTypeFrom,
  ProxiedRowset,
  Rowset,
  InputObject,
  SortInfo,
  SortObject,
  Condition,
  Select,
  CompatibleSortInfo
} from './ast'
import { and, select } from './builder'
import { ROWSET_ALIAS } from './constants'
import { Executor } from './execute'
import { ensureCondition, isProxiedRowset, makeProxiedRowset } from './util'
// import { getMetadata } from 'typeorm'

/**
 * 可查询对象，接口类似js自带的`Array`对象，并且其本身是一个异步可迭代对象，实现了延迟加载功能，数据将在调用`toArray`，或者对其进行遍历时才执行加载
 * // INFO:
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
export class Queryable<T extends RowObject = any> implements AsyncIterable<T> {
  private _rowset: ProxiedRowset<T>
  private _where: CompatibleCondition;
  private _sorts: CompatibleSortInfo;

  constructor (protected readonly executor: Executor, rowset: Rowset<T>) {
    if (isProxiedRowset(rowset)) {
      this._rowset = rowset
    } else {
      this._rowset = makeProxiedRowset(rowset)
    }
  }

  private _appendWhere(where: CompatibleCondition): this {
    if (!this._where) {
      this._where = where
    }
    this._where = and(this._where, where)
    return this
  }

  /**
   * 异步迭代器，延迟查询的关键点
   */
  [Symbol.asyncIterator] (): AsyncIterator<T> {
    let result: T[]
    let i = 0
    return {
      next: async (): Promise<IteratorResult<T>> => {
        if (!result) {
          result = await this.toArray()
        }

        if (i < result.length) {
          return { value: result[i++], done: false }
        }
        return { value: undefined, done: true }
      }
    }
  }

  take (count: number, skip = 0): Queryable<T> {
    // if (this._take !== undefined) {
    //   this._take = lines;
    //   this._skip = skip;
    //   return this;
    // }
    const sql = this._buildSelectSql()
      .offset(skip)
      .limit(count)
    return new Queryable<T>(this.executor, sql.as(ROWSET_ALIAS))
  }

  private _buildSelectSql(): Select<T>
  private _buildSelectSql <G extends InputObject>(results: (p: ProxiedRowset<T>) => G): Select<RowTypeFrom<G>>
  private _buildSelectSql <G extends InputObject>(results?: (p: ProxiedRowset<T>) => G): Select {
    const sql = select(results ? results(this._rowset) : this._rowset._)
      .from(this._rowset)
    if (this._where) sql.where(this._where)
    if (this._sorts) sql.orderBy(this._sorts)
    return sql;
  }

  /**
   * 过滤数据并返回一个新的只读仓库
   */
  filter (
    condition: (p: ProxiedRowset<T>) => CompatibleCondition<T>
  ): Queryable<T> {
    return this._appendWhere(condition(this._rowset))
  }

  map<G extends InputObject> (
    results: (p: ProxiedRowset<T>) => G
  ): Queryable<RowTypeFrom<G>> {
    const sql = this._buildSelectSql(results);
    return new Queryable<RowTypeFrom<G>>(
      this.executor,
      sql.as(ROWSET_ALIAS)
    )
  }

  sort (
    sorts: (p: ProxiedRowset<T>) => SortInfo[] | SortObject<T>
  ): Queryable<T> {
    if (this._sorts) {
      throw new Error('sort is exists;')
    }
    this._sorts = sorts(this._rowset)
    return this
    // const sql = this._buildSelectSql().orderBy(orders)
    // return new Queryable<T>(this.executor, sql.as(ROWSET_ALIAS))
  }

  /**
   * 添加过滤条件，并限定返回头一条记录
   */
  find (filter: (p: ProxiedRowset<T>) => CompatibleCondition<T>): Queryable<T> {
    this.filter(filter);
    return this.take(1);
  }

  groupBy<G extends InputObject> (
    results: (p: ProxiedRowset<T>) => G,
    groups: (p: ProxiedRowset<T>) => CompatibleExpression[],
    where?: (p: ProxiedRowset<T>) => Condition
  ): Queryable<RowTypeFrom<G>> {
    if (where) {
      this.filter(where);
    }
    const sql = this._buildSelectSql(results).groupBy(...groups(this._rowset))
    return new Queryable<RowTypeFrom<G>>(this.executor, sql.as(ROWSET_ALIAS))
  }

  // join<R extends InputObject, M extends RowObject>(
  //   results: (p1: ProxiedRowset<T>, p2: ProxiedRowset<M>) => R,
  //   join1: [
  //     Queryable<M>,
  //     (thisRowset: ProxiedRowset<T>, join1Rowset: ProxiedRowset<M>) => Condition,
  //   ],
  //   where?: (thisRowset: ProxiedRowset<T>, join1Rowset: ProxiedRowset<M>) => Condition,
  // ): Queryable<RowTypeFrom<R>>
  // join<R extends InputObject, M extends RowObject, N extends RowObject>(
  //   results: (p1: ProxiedRowset<T>, p2: ProxiedRowset<M>) => R,
  //   join1: [
  //     Queryable<M>,
  //     (thisRowset: ProxiedRowset<T>, join1Rowset: ProxiedRowset<M>) => Condition,
  //   ],
  //   join2: [
  //     Queryable<N>,
  //     (thisRowset: ProxiedRowset<T>, join1Rowset: ProxiedRowset<M>, join2Rowset: ProxiedRowset<N>) => Condition,
  //   ],
  //   where?: (thisRowset: ProxiedRowset<T>, join1Rowset: ProxiedRowset<M>, join2Rowset: ProxiedRowset<N>) => Condition,
  // ): Queryable<RowTypeFrom<R>>
  // join<R extends InputObject, M extends RowObject, N extends RowObject, O extends RowObject>(
  //   results: (p1: ProxiedRowset<T>, p2: ProxiedRowset<M>) => R,
  //   join1: {
  //     query: Queryable<M>,
  //     conditions: (thisRowset: ProxiedRowset<T>, join1Rowset: ProxiedRowset<M>) => Condition,
  //   },
  //   join2: {
  //     query: Queryable<N>,
  //     conditions: (thisRowset: ProxiedRowset<T>, join1Rowset: ProxiedRowset<M>, join2Rowset: ProxiedRowset<N>) => Condition,
  //   },
  //   join3: {
  //     query: Queryable<O>,
  //     conditions: (thisRowset: ProxiedRowset<T>, join1Rowset: ProxiedRowset<M>, join2Rowset: ProxiedRowset<N>, join3Rowset: ProxiedRowset<O>) => Condition,
  //   },
  //   where?: (thisRowset: ProxiedRowset<T>, join1Rowset: ProxiedRowset<M>, join2Rowset: ProxiedRowset<N>, join3Rowset: ProxiedRowset<O>) => Condition,
  // ): Queryable<RowTypeFrom<R>>
  // join<R extends InputObject, M extends RowObject, N extends RowObject, O extends RowObject, P extends RowObject, Q extends RowObject>(
  //   results: (p1: ProxiedRowset<T>, p2: ProxiedRowset<M>) => R,
  //   joins: {
  //     query: Queryable<M>,
  //     conditions: (thisRowset: ProxiedRowset<T>, join1Rowset: ProxiedRowset<M>) => Condition,
  //   },
  //   join2: {
  //     query: Queryable<N>,
  //     conditions: (thisRowset: ProxiedRowset<T>, join1Rowset: ProxiedRowset<M>, join2Rowset: ProxiedRowset<N>) => Condition,
  //   },
  //   join3: {
  //     query: Queryable<O>,
  //     conditions: (thisRowset: ProxiedRowset<T>, join1Rowset: ProxiedRowset<M>, join2Rowset: ProxiedRowset<N>, join3Rowset: ProxiedRowset<O>, join4Rowset: ProxiedRowset<P>) => Condition,
  //   },
  //   join4: {
  //     query: Queryable<P>,
  //     conditions: (thisRowset: ProxiedRowset<T>, join1Rowset: ProxiedRowset<M>, join2Rowset: ProxiedRowset<N>, join3Rowset: ProxiedRowset<O>, join4Rowset: ProxiedRowset<Q>) => Condition,
  //   },
  //   where?: (thisRowset: ProxiedRowset<T>, join1Rowset: ProxiedRowset<M>, join2Rowset: ProxiedRowset<N>, join3Rowset: ProxiedRowset<O>, join4Rowset: ProxiedRowset<Q>) => Condition,
  // ): Queryable<RowTypeFrom<R>>

  // join(...args: any): Queryable<any>
  // {
  //   const sql = select(results(this._rowset, repo._rowset))
  //     .from(this._rowset)
  //     .join(join1.query._rowset, join1.conditions(this._rowset, join1.query._rowset))
  //     .where(this._where);
  //   return new Queryable<RowTypeFrom<R>>(
  //     this.executor,
  //     sql.as(ROWSET_ALIAS)
  //   );
  // }

  union (...sets: Queryable<T>[]): Queryable<T> {
    const sql = this._buildSelectSql()
    sets.forEach(query => {
      sql.unionAll(query._buildSelectSql())
    })
    return new Queryable<T>(this.executor, sql.as(ROWSET_ALIAS))
  }

  /**
   * 执行查询并将结果转换为数组，并获取所有数据返回一个数组
   */
  async toArray (): Promise<T[]> {
    const sql = select<T>(this._rowset._).from(this._rowset)
    const queryResult = await this.executor.query(sql)
    return queryResult.rows
  }

  /**
   * 执行查询，并获取第一行记录
   */
  async first (): Promise<T> {
    const sql = select<T>(this._rowset._)
      .from(this._rowset)
      .limit(1)
    const { rows } = await this.executor.query(sql)
    return rows[0]
  }
}
