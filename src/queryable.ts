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
} from "./ast";
import { SELECT } from "./builder";
import { Executor } from "./executor";
import { isProxiedRowset, makeProxiedRowset } from "./util";
// import { getMetadata } from 'typeorm'

const ROWSET_ALIAS = "__T__";

/**
 * 可查询对象，本身是一个异步可迭代对象，实现延迟加载功能
 * ```ts
 * const x: QueryBuilder<T>
 * for await (const item of x) {
 *    ...
 * }
 * ```
 */
// eslint-disable-next-line @typescript-eslint/ban-types
export class Queryable<T extends RowObject = {}>
  implements AsyncIterable<T> {
  private _rowset: ProxiedRowset<T>;
  // protected _where: Condition;

  constructor(protected readonly executor: Executor, rowset: Rowset<T>) {
    if (isProxiedRowset(rowset)) {
      this._rowset = rowset;
    } else {
      this._rowset = makeProxiedRowset(rowset);
    }

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
          result = await this.getAll();
        }

        if (i < result.length) {
          return { value: result[i++], done: false };
        }
        return { value: undefined, done: true };
      },
    };
  }

  take(lines: number, skip = 0): Queryable<T> {
    const sql = SELECT(this._rowset._).offset(skip).limit(lines);
    if (lines !== undefined) {
      sql.limit(lines);
    }
    sql.from(this._rowset);
    return new Queryable<T>(this.executor, sql.as(ROWSET_ALIAS));
  }

  // /**
  //  * 仅追加过滤条件
  //  */
  // protected where(condition: (p: ProxiedRowset<T>) => CompatibleCondition<T>): this {
  //   if (!this._where) {
  //     this._where = Condition.enclose(ensureCondition(condition(this._rowset)));
  //   } else {
  //     this._where = and(
  //       this._where,
  //       Condition.enclose(ensureCondition(condition(this._rowset)))
  //     );
  //   }
  //   return this;
  // }

  // private _buildSelectSql(): Select<T>
  // private _buildSelectSql<G extends InputObject>(results: (p: ProxiedRowset<T>) => G): Select<RowTypeFrom<G>>
  // private _buildSelectSql(results?: (p: ProxiedRowset<T>) => any): Select {
  //   const sql = select(results ? results(this._rowset) : this._rowset._ ).from(this._rowset);
  //   if (this._where) {
  //     sql.where(this._where);
  //   }
  //   return sql;
  // }

  /**
   * 过滤数据并返回一个新的只读仓库
   */
  filter(
    condition: (p: ProxiedRowset<T>) => CompatibleCondition<T>
  ): Queryable<T> {
    const rowset = SELECT(this._rowset._).from(this._rowset).where(condition(this._rowset)).as(ROWSET_ALIAS);
    return new Queryable<T>(this.executor, rowset);
  }

  map<G extends InputObject>(
    results: (p: ProxiedRowset<T>) => G
  ): Queryable<RowTypeFrom<G>> {
    return new Queryable<RowTypeFrom<G>>(
      this.executor,
      SELECT(results(this._rowset)).from(this._rowset).as(ROWSET_ALIAS)
    );
  }

  sort(
    sorts: (
      p: ProxiedRowset<T>
    ) => SortInfo[] | SortObject<T>
  ): Queryable<T> {
    const orders = sorts(this._rowset);
    const sql = SELECT(this._rowset._).from(this._rowset).orderBy(orders);
    return new Queryable<T>(this.executor, sql.as(ROWSET_ALIAS));
  }

  // find(
  //   filter: (p: ProxiedRowset<T>) => CompatibleCondition
  // ): Queryable<T> {
  //   const sql = select(this._rowset._).from(this._rowset).where(filter(this._rowset)).limit(1);
  //   return new Queryable<T>(this.executor, sql.as(ROWSET_ALIAS));
  // }

  groupBy<G extends InputObject>(
    results: (p: ProxiedRowset<T>) => G,
    groups: (p: ProxiedRowset<T>) => CompatibleExpression[]
  ): Queryable<RowTypeFrom<G>> {
    const sql = this._buildSelectSql(results);
    sql.groupBy(...groups(this._rowset));
    return new Queryable<RowTypeFrom<G>>(
      this.executor,
      sql.as(ROWSET_ALIAS)
    );
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

  union(...sets: Queryable<T>[]): Queryable<T> {
    const sql = this._buildSelectSql();
    sets.forEach(query => {
      sql.unionAll(query._buildSelectSql());
    })
    return new Queryable<T>(this.executor, sql.as(ROWSET_ALIAS));
  }

  /**
   * 获取所有
   */
  async getAll(): Promise<T[]> {
    const sql = SELECT<T>(this._rowset._).from(this._rowset);
    const queryResult = await this.executor.query(sql);
    return queryResult.rows;
  }

  /**
   * 获取第一个项
   */
  async getOne(): Promise<T> {
    const sql = SELECT<T>(this._rowset._).from(this._rowset).offset(0).limit(1);
    const { rows } = await this.executor.query(sql);
    return rows[0];
  }
}
