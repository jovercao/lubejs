import assert from 'assert';
import EventEmitter from 'events';
import { CompatibleCondition, Condition } from '../sql/condition/condition';
import { SqlUtil } from './sql-util';
import { Connection } from './connection';
import { Command, QueryResult } from './types';
import {
  SQL,
  RowObject,
  WhereObject,
  ProxiedRowset,
  CompatibleSortInfo,
  Sort,
  Parameter,
  Scalar,
  Statement,
  Document,
  Select,
  Execute,
  InputObject,
  AsScalarType,
  CompatiableObjectName,
  Table,
  CompatibleExpression,
  ProxiedTable,
  ColumnsOf,
  Field,
  isScalar,
  Rowset,
  RowObjectFrom,
  Assignment,
  Procedure,
  Expression,
  Star,
  CompatibleTable,
  TableVariant,
  ProxiedTableVariant,
  CompatibleRowset,
} from '../sql';

const { and, doc } = SQL;

export interface SelectOptions<T extends RowObject = any> {
  where?:
    | WhereObject<T>
    | Condition
    | ((table: Readonly<ProxiedRowset<T>>) => Condition);
  top?: number;
  offset?: number;
  limit?: number;
  distinct?: boolean;
  sorts?: CompatibleSortInfo | ((rowset: ProxiedRowset<T>) => Sort[]);
}

export interface QueryHandler {
  (sql: string, params?: Parameter<Scalar, string>[]): Promise<
    QueryResult<any, any, any>
  >;
}

export const INSERT_MAXIMUM_ROWS = 1000;

/**
 * 数据执行器
 */
export abstract class Executor {
  protected abstract doQuery(
    sql: string,
    params?: Parameter[]
  ): Promise<QueryResult<any, any, any>>;

  protected _emitter: EventEmitter = new EventEmitter();

  /**
   * 编译器
   */
  abstract readonly sqlUtil: SqlUtil;

  on(event: 'command', listener: (cmd: Command) => void): this;
  on(event: 'commit', listener: (executor: Executor) => void): this;
  on(event: 'rollback', listener: (executor: Executor) => void): this;
  on(event: 'error', listener: (error: Error) => any): this;
  on(event: string, listener: (...args: any[]) => any): this {
    this._emitter.on(event, listener);
    return this;
  }

  off(event: 'command', listener?: (cmd: Command) => void): this;
  off(event: 'commit', listener?: (executor: Executor) => void): this;
  off(event: 'rollback', listener?: (executor: Executor) => void): this;
  off(event: 'error', listener?: (error: Error) => any): this;
  off(event: string, listener?: (...args: any[]) => any): this {
    if (!listener) {
      this._emitter.removeAllListeners(event);
    } else {
      this._emitter.off(event, listener);
    }
    return this;
  }

  emit(event: string, ...args: any[]): this {
    this._emitter.emit(event, ...args);
    return this;
  }

  private async _internalQuery(command: Command): Promise<QueryResult>;
  private async _internalQuery(
    sql: string,
    params?: Parameter[] | Record<string, any>
  ): Promise<QueryResult>;
  private async _internalQuery(
    sql: TemplateStringsArray,
    ...params: any[]
  ): Promise<QueryResult>;
  private async _internalQuery(
    ...args: any[]
  ): Promise<QueryResult<any, any, any>>;
  private async _internalQuery(
    ...args: any[]
  ): Promise<QueryResult<any, any, any>> {
    let command: Command;
    // 如果是AST直接编译
    if (Statement.isStatement(args[0]) || Document.isDocument(args[0])) {
      command = this.sqlUtil.sqlify(args[0]);
    }
    // 如果是模板字符串
    else if (Array.isArray(args[0] && args[0].raw)) {
      command = {
        sql: this.sqlUtil.sql(args[0], ...args.slice(1)),
      };
    } else if (
      args.length === 1 &&
      typeof args[0] === 'object' &&
      typeof args[0].sql === 'string'
    ) {
      command = args[0];
      // 如果查询的是表达式，则自动转换为 select xx;
    } else if (args.length === 1 && Expression.isExpression(args[0])) {
      command = this.sqlUtil.sqlify(SQL.select(args[0]));
    } else {
      assert(
        args.length <= 2 && typeof args[0] === 'string',
        'sql 必须是字符串或者模板调用'
      );
      let params: Parameter[] = [];
      if (typeof args[1] === 'object') {
        params = Object.entries(args[1]).map(([name, value]: any) =>
          SQL.input(name, value)
        );
      }
      command = {
        sql: args[0],
        params,
      };
    }

    try {
      const res = await this.doQuery(command.sql, command.params);
      // 如果有输出参数
      if (command.params && res.output) {
        Object.entries(res.output).forEach(([name, value]) => {
          const p = command.params!.find(p => p.$name === name)!;
          p.value = value;
          if (p.$name === this.sqlUtil.options.returnParameterName) {
            res.returnValue = value;
          }
        });
      }
      return res;
    } catch (ex) {
      this.emit('error', ex);
      throw ex;
    } finally {
      this.emit('command', command);
    }
  }

  // async query<T extends RowObject = any> (
  //   sql: string
  // ): Promise<QueryResult<T>>
  async query<T extends RowObject = any>(
    command: Command
  ): Promise<QueryResult<T>>;
  async query<T extends RowObject = any>(
    sql: Select<T>
  ): Promise<QueryResult<T>>;
  /**
   * 执行一个存储过程执行代码
   */
  async query<
    R extends Scalar = number,
    T extends RowObject = never,
    O extends [T, ...RowObject[]] = [T]
  >(sql: Execute<R, O>): Promise<QueryResult<O[0], R, O>>;
  async query<T extends RowObject = any>(sql: string): Promise<QueryResult<T>>;
  async query<T extends RowObject = any>(
    sql: string,
    params?: Parameter[] | Record<string, Scalar>
  ): Promise<QueryResult<T>>;
  async query<T extends RowObject = any>(
    sql: Statement | Document | string
  ): Promise<QueryResult<T>>;
  async query<T extends RowObject = any>(
    sql: TemplateStringsArray,
    ...params: any[]
  ): Promise<QueryResult<T>>;
  async query(...args: any[]): Promise<any> {
    return this._internalQuery(...args);
  }

  /**
   * 执行一个查询并获取返回的第一个标量值
   * @param sql
   */
  async queryScalar<T extends Scalar = any>(
    sql: TemplateStringsArray,
    ...params: Scalar[]
  ): Promise<T | null>;
  async queryScalar<T extends Scalar = any>(
    sql: string,
    params?: Parameter[]
  ): Promise<T | null>;
  async queryScalar<T extends Scalar = any>(
    sql: string,
    params?: InputObject
  ): Promise<T | null>;
  async queryScalar<T extends RowObject>(
    sql: Select<T>
  ): Promise<AsScalarType<T> | null>;
  async queryScalar<T extends Scalar>(sql: Select<any>): Promise<T | null>;
  async queryScalar<T extends Scalar>(
    expression: Expression<T>
  ): Promise<T | null>;
  async queryScalar(...args: any[]): Promise<any> {
    const rows = (await this._internalQuery(...args)).rows!;
    if (rows.length === 0) return null;
    return Object.values(rows[0])[0];
  }

  /**
   * 插入数据
   */
  async insert<T extends RowObject = any>(
    table: CompatiableObjectName | Table<T>,
    values: InputObject<T> | InputObject<T>[] | CompatibleExpression[]
  ): Promise<number>;
  /**
   * 插入数据
   */
  async insert<T extends RowObject = any>(
    table: CompatiableObjectName | ProxiedTable<T>,
    values: T | T[]
  ): Promise<number>;
  async insert<T extends RowObject = any>(
    table: CompatiableObjectName | ProxiedTable<T>,
    fields: ColumnsOf<T>[] | Field<Scalar, ColumnsOf<T>>[],
    value:
      | InputObject<T>
      | InputObject<T>[]
      | CompatibleExpression[]
      | CompatibleExpression[][]
  ): Promise<number>;
  async insert<T extends RowObject = any>(
    table: CompatiableObjectName | ProxiedTable<T>,
    fields: ColumnsOf<T>[] | Field<Scalar, ColumnsOf<T>>[],
    value: T | T[]
  ): Promise<number>;
  async insert<T extends RowObject = any>(
    table: CompatiableObjectName | ProxiedTable<T>,
    arg2:
      | ColumnsOf<T>[]
      | Field<Scalar, ColumnsOf<T>>[]
      | InputObject<T>
      | InputObject<T>[]
      | CompatibleExpression
      | CompatibleExpression[],
    arg3?:
      | InputObject<T>
      | InputObject<T>[]
      | CompatibleExpression
      | CompatibleExpression[]
      | undefined
  ): Promise<number> {
    let fields: ColumnsOf<T>[] | Field<Scalar, ColumnsOf<T>>[] | undefined;
    let values:
      | InputObject<T>
      | InputObject<T>[]
      | CompatibleExpression
      | CompatibleExpression[]
      | undefined;

    if (arguments.length <= 2) {
      values = arg2;
      fields = undefined;
    } else {
      values = arg3;
      fields = arg2 as ColumnsOf<T>[] | Field<Scalar, ColumnsOf<T>>[];
    }

    // 确保装入数组里，以便 使用
    // UnsureExpression[] => UnsureExpression[][]
    // Object => Object[]
    if (
      !Array.isArray(values) ||
      (!Array.isArray(values[0]) && isScalar(values[0]))
    ) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      values = [values as any];
    }
    const packedValues = values;
    if (packedValues.length > INSERT_MAXIMUM_ROWS) {
      console.warn(
        'Values exceed 1000 rows, and will be inserted multiple times.'
      );
    }
    const action = async (): Promise<number> => {
      let i = 0;
      let rowsAffected = 0;
      while (i < packedValues.length) {
        const items = packedValues.slice(i, i + INSERT_MAXIMUM_ROWS);
        i += INSERT_MAXIMUM_ROWS;
        const sql = SQL.insert(table, fields).values(items);
        const res = await this.query(sql);
        rowsAffected += res.rowsAffected;
      }
      return rowsAffected;
    };
    // 启用事务
    if (this instanceof Connection && !this.inTransaction) {
      return (this as unknown as Connection).trans(action);
    }
    return action();
  }

  async find<
    T extends RowObject = any,
    G extends InputObject<T> = InputObject<T>
  >(
    table: ProxiedTable<T> | CompatiableObjectName,
    results: (rowset: Readonly<ProxiedRowset<T>>) => G,
    where: Condition | WhereObject<T> | ((table: ProxiedRowset<T>) => Condition)
  ): Promise<RowObjectFrom<G> | null>;
  async find<T extends RowObject = any>(
    table: ProxiedTable<T> | CompatiableObjectName,
    where: Condition | WhereObject<T> | ((table: ProxiedRowset<T>) => Condition)
  ): Promise<T | null>;
  async find<
    T extends RowObject = any,
    G extends InputObject<T> = InputObject<T>
  >(
    table: ProxiedTable<T> | CompatiableObjectName,
    resultsOrwhere:
      | Condition
      | WhereObject<T>
      | ((table: ProxiedRowset<T>) => Condition)
      | ((rowset: Readonly<Rowset<T>>) => G),
    where?:
      | Condition
      | WhereObject<T>
      | ((table: ProxiedRowset<T>) => Condition)
  ): Promise<T | RowObjectFrom<G> | null> {
    const t = Rowset.isRowset(table) ? table : Table.create<T>(table);
    let results: ((rowset: Readonly<Rowset<T>>) => G) | undefined;
    if (!where) {
      where = resultsOrwhere as (table: ProxiedRowset<T>) => Condition;
    } else {
      results = resultsOrwhere as (rowset: Readonly<Rowset<T>>) => G;
    }

    let columns: Star<T> | G;
    if (results) {
      columns = results(t);
    } else {
      columns = t.star;
    }

    const sql = SQL.select(columns as any)
      .top(1)
      .from(t)
      .where(typeof where === 'function' ? where(t) : where);
    const rows = (await this._internalQuery(sql)).rows;
    if (rows.length > 0) {
      return rows[0];
    }
    return null;
  }

  /**
   * 简化版的SELECT查询，用于快速查询，如果要用复杂的查询，请使用select语句
   * @param table
   * @param where
   * @param options
   */
  async select<
    T extends RowObject = any,
    G extends InputObject<T> = InputObject<T>
  >(
    table: CompatiableObjectName | ProxiedRowset<T>,
    results: (rowset: Readonly<ProxiedRowset<T>>) => G,
    options?: SelectOptions<T>
  ): Promise<RowObjectFrom<G>[]>;
  async select<T extends RowObject = any>(
    table: CompatiableObjectName | ProxiedRowset<T>,
    options?: SelectOptions<T>
  ): Promise<T[]>;
  async select(
    table: CompatibleRowset<any> | CompatiableObjectName,
    arg2?: SelectOptions | ((rowset: Readonly<ProxiedRowset>) => any),
    arg3?: SelectOptions
  ): Promise<any[]> {
    let options: SelectOptions | undefined;
    let results: undefined | ((rowset: Readonly<Rowset>) => any);
    if (typeof arg2 === 'function') {
      results = arg2;
      options = arg3;
    } else {
      options = arg2;
    }
    const { where, sorts, offset, limit } = options || {};
    let columns: Star | InputObject<any>;
    const t: Rowset<any> = Rowset.isRowset(table) ? table : Table.create(table);
    if (results) {
      columns = results(t);
    } else {
      columns = t.star;
    }

    const sql = SQL.select(columns).from(t);
    if (where) {
      sql.where(
        typeof where === 'function' ? where(t as ProxiedRowset<any>) : where
      );
    }
    if (sorts) {
      if (Array.isArray(sorts)) {
        sql.orderBy(...sorts);
      } else if (typeof sorts === 'function') {
        sql.orderBy(...sorts(t as ProxiedRowset<any>));
      } else {
        sql.orderBy(sorts);
      }
    }
    if (!(typeof offset === 'undefined')) {
      sql.offset(offset);
    }
    if (!(typeof limit === 'undefined')) {
      sql.limit(limit);
    }
    const res = await this.query(sql);
    return res.rows as any;
  }

  /**
   * 更新表
   */
  async update<T extends RowObject = any>(
    table: CompatibleTable<T>,
    sets: InputObject<T> | Assignment[],
    where?:
      | WhereObject<T>
      | Condition
      | ((table: Readonly<ProxiedRowset<T>>) => Condition)
  ): Promise<number> {
    const t =
      Table.isTable(table) || TableVariant.isTableVariant(table)
        ? table
        : Table.create<T>(table);

    const sql = SQL.update(t).set(sets);
    if (where) {
      if (typeof where === 'function') {
        where = where(t);
      }
      sql.where(where);
    }
    const res = await this.query(sql);
    return res.rowsAffected;
  }

  async delete<T extends RowObject = any>(
    table: CompatibleTable<T>,
    where?:
      | WhereObject<T>
      | Condition
      | ((
          table: Readonly<ProxiedTable<T>> | Readonly<ProxiedTableVariant<T>>
        ) => Condition)
  ): Promise<number> {
    const t =
      Table.isTable(table) || TableVariant.isTableVariant(table)
        ? table
        : Table.create<T>(table);
    const sql = SQL.delete(t);
    if (where) {
      if (typeof where === 'function') {
        where = where(t);
      }
      sql.where(where);
    }
    const res = await this.query(sql);
    return res.rowsAffected;
  }

  async execute<
    R extends Scalar = number,
    T extends RowObject = never,
    O extends [T, ...RowObject[]] = [T]
  >(
    spName: CompatiableObjectName | Procedure<R, O>,
    params?: CompatibleExpression[]
  ): Promise<QueryResult<O[0], R, O>> {
    const sql = SQL.execute<R, O>(spName, params);
    const res = await this.query(sql);
    return res as any;
  }
}
