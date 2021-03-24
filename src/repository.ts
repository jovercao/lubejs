/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Condition,
  CompatibleCondition,
  CompatibleExpression,
  RowObject,
  RowTypeFrom,
  ProxiedRowset,
  Rowset,
  Table,
  InputObject,
  SortInfo,
  SortObject,
  ProxiedTable,
  FieldsOf,
} from "./ast";
import { $delete, and, insert, select, update } from "./builder";
import { Executor } from "./executor";
import { ensureCondition, isProxiedRowset, makeProxiedRowset } from "./util";
// import { getMetadata } from 'typeorm'

const ROWSET_ALIAS = "__T__";

/**
 * 数据仓库类，本身是一个异步可迭代对象
 * ```ts
 * const x: QueryBuilder<T>
 * for await (const item of x) {
 *    ...
 * }
 * ```
 */
// eslint-disable-next-line @typescript-eslint/ban-types
export class ReadonlyRepository<T extends RowObject = {}>
  implements AsyncIterable<T> {
  private _rowset: ProxiedRowset<T>;
  protected _where: Condition;

  protected appendWhere(sql: {
    where: (condition: CompatibleCondition) => void;
  }): void {
    if (this._where) {
      sql.where(this._where);
    }
  }

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

  take(lines: number, skip = 0): ReadonlyRepository<T> {
    const sql = select(this._rowset._).offset(skip).limit(lines);
    if (lines !== undefined) {
      sql.limit(lines);
    }
    sql.from(this._rowset);
    this.appendWhere(sql);
    return new ReadonlyRepository<T>(this.executor, sql.as(ROWSET_ALIAS));
  }

  /**
   * 仅追加过滤条件
   */
  where(condition: (p: ProxiedRowset<T>) => CompatibleCondition<T>): this {
    if (!this._where) {
      this._where = Condition.enclose(ensureCondition(condition(this._rowset)));
    } else {
      this._where = and(
        this._where,
        Condition.enclose(ensureCondition(condition(this._rowset)))
      );
    }
    return this;
  }

  /**
   * 过滤数据并返回一个新的只读仓库
   */
  filter(
    condition: (p: ProxiedRowset<T>) => CompatibleCondition<T>
  ): ReadonlyRepository<T> {
    const sql = select(this._rowset._).from(this._rowset);
    this.where(condition);
    this.appendWhere(sql);
    return new ReadonlyRepository<T>(this.executor, sql.as(ROWSET_ALIAS));
  }

  map<G extends InputObject>(
    results: (p: ProxiedRowset<T>) => G
  ): ReadonlyRepository<RowTypeFrom<G>> {
    const sql = select(results(this._rowset)).from(this._rowset);
    this.appendWhere(sql);
    return new ReadonlyRepository<RowTypeFrom<G>>(
      this.executor,
      sql.as(ROWSET_ALIAS)
    );
  }

  sort(
    sorts: (
      p: ProxiedRowset<T>
    ) => SortInfo[] | SortObject<T> | CompatibleExpression[]
  ): ReadonlyRepository<T> {
    const sql = select(this._rowset._).from(this._rowset);
    this.appendWhere(sql);
    sql.orderBy.call(sql, sorts(this._rowset));
    return new ReadonlyRepository<T>(this.executor, sql.as(ROWSET_ALIAS));
  }

  find(
    filter: (p: ProxiedRowset<T>) => CompatibleCondition
  ): ReadonlyRepository<T> {
    const sql = select(this._rowset._).limit(1).from(this._rowset);
    this.where(filter);
    this.appendWhere(sql);
    return new ReadonlyRepository<T>(this.executor, sql.as(ROWSET_ALIAS));
  }

  groupBy<G extends InputObject>(
    results: (p: ProxiedRowset<T>) => G,
    groups: (p: ProxiedRowset<T>) => CompatibleExpression[]
  ): ReadonlyRepository<RowTypeFrom<G>> {
    const sql = select(results(this._rowset))
      .from(this._rowset)
      .groupBy(...groups(this._rowset));
    this.appendWhere(sql);
    return new ReadonlyRepository<RowTypeFrom<G>>(
      this.executor,
      sql.as(ROWSET_ALIAS)
    );
  }

  join<M extends RowObject, R extends InputObject>(
    repo: ReadonlyRepository<M>,
    conditions: (p1: ProxiedRowset<T>, p2: ProxiedRowset<M>) => Condition,
    results: (p1: ProxiedRowset<T>, p2: ProxiedRowset<M>) => R
  ): ReadonlyRepository<RowTypeFrom<R>> {
    const sql = select(results(this._rowset, repo._rowset))
      .from(this._rowset)
      .join(repo._rowset, conditions(this._rowset, repo._rowset));
    this.appendWhere(sql);
    return new ReadonlyRepository<RowTypeFrom<R>>(
      this.executor,
      sql.as(ROWSET_ALIAS)
    );
  }

  union(repo: ReadonlyRepository<T>): ReadonlyRepository<T> {
    const sql = select(this._rowset._).from(this._rowset);
    this.appendWhere(sql);
    sql.unionAll(select(repo._rowset._).from(repo._rowset));
    return new ReadonlyRepository<T>(this.executor, sql.as(ROWSET_ALIAS));
  }

  /**
   * 获取所有
   */
  async getAll(): Promise<T[]> {
    const sql = select<T>(this._rowset._).from(this._rowset);
    this.appendWhere(sql);
    const queryResult = await this.executor.query(sql);
    return queryResult.rows;
  }

  /**
   * 获取一个项
   */
  async getOne(): Promise<T> {
    const sql = select<T>(this._rowset._).from(this._rowset).offset(0).limit(1);
    this.appendWhere(sql);
    const { rows } = await this.executor.query(sql);
    return rows[0];
  }
}

/**
 * 可写数据仓库
 */
export class Repository<T extends RowObject> extends ReadonlyRepository<T> {
  private readonly table: ProxiedTable<T>;
  private readonly primaryKey: FieldsOf<T>;

  constructor(executor: Executor, table: Table<T>, primaryKey?: FieldsOf<T>) {
    super(executor, table);
    if (isProxiedRowset(table)) {
      this.table = table;
    } else {
      this.table = makeProxiedRowset(table);
    }
    this.primaryKey = primaryKey;
  }

  /**
   * 插入对象
   */
  async insert(item: T | T[]): Promise<number> {
    const result = await this.executor.query(
      insert(this.table).values(item as any)
    );
    return result.rowsAffected;
  }

  /**
   * 更新数据
   */
  async update(
    sets: (rowset: ProxiedTable<T>) => InputObject<T>,
    where?: (p: ProxiedTable<T>) => CompatibleCondition<T>
  ): Promise<number> {
    if (where) {
      this.where(where);
    }
    const result = await this.executor.query(
      update(this.table).set(sets(this.table)).where(this._where)
    );
    return result.rowsAffected;
  }

  async delete(
    where: (p: ProxiedTable<T>) => CompatibleCondition<T>
  ): Promise<number> {
    this.where(where);
    return (await this.executor.query($delete(this.table).where(this._where)))
      .rowsAffected;
  }

  /**
   * 保存数据，必须指定主键后才允许使用
   * 自动对比与数据库中的数据差异而进行提交
   * 不存在的则插入，已存在的则更新
   */
  async save(items: T[] | T): Promise<void> {
    if (!this.primaryKey) {
      throw new Error("PrimaryKey must be specified.");
    }

    if (!Array.isArray(items)) {
      items = [items];
    }
    const itemsMap: Map<any, any> = new Map();
    items.forEach((item) => {
      const keyValue = item[this.primaryKey];
      itemsMap.set(keyValue, item);
    });

    const keys = Array.from(itemsMap.keys());
    const exists = await this.filter((p) =>
      p[this.primaryKey].in(keys)
    ).getAll();
    const existsMap: Map<any, any> = new Map();
    exists.forEach((item) => {
      const keyValue = item[this.primaryKey];
      existsMap.set(keyValue, item);
    });

    const addeds = items.filter(
      (item) => !existsMap.has(item[this.primaryKey])
    );
    await this.executor.insert(this.table, addeds);
    const updateds = items.filter((item) =>
      existsMap.has(item[this.primaryKey])
    );
    // for (const item of updateds) {
    //   await this.executor.update(this.table, item, this.table[this.primaryKey].eq(item[this.primaryKey]))
    // }
    await this.executor.update(this.table, updateds, [this.primaryKey]);
  }
}
