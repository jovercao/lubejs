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

export const INSERT_MAXIMUM_ROWS = 2000;

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
    sql: string,
    params?: Parameter[]
  ): Promise<T>;
  async queryScalar<T extends Scalar = any>(
    sql: string,
    params?: InputObject
  ): Promise<T>;
  async queryScalar<T extends RowObject>(
    sql: Select<T>
  ): Promise<AsScalarType<T>>;
  async queryScalar<T extends Scalar>(sql: Select<any>): Promise<T>;
  async queryScalar<T extends Scalar = any>(
    sql: TemplateStringsArray,
    ...params: any[]
  ): Promise<T>;
  async queryScalar(...args: any[]): Promise<any> {
    const rows = (await this._internalQuery(...args)).rows!;
    if (rows.length === 0) return null;
    return Object.values(rows[0])[0];
  }

  /**
   * 插入数据
   */
  async insert<T extends RowObject = any>(
    table: CompatiableObjectName | Table<T, string>,
    values: InputObject<T> | InputObject<T>[] | CompatibleExpression[]
  ): Promise<number>;
  /**
   * 插入数据
   */
  async insert<T extends RowObject = any>(
    table: CompatiableObjectName | ProxiedTable<T, string>,
    values: T | T[]
  ): Promise<number>;
  async insert<T extends RowObject = any>(
    table: CompatiableObjectName | ProxiedTable<T, string>,
    fields: ColumnsOf<T>[] | Field<Scalar, ColumnsOf<T>>[],
    value:
      | InputObject<T>
      | InputObject<T>[]
      | CompatibleExpression[]
      | CompatibleExpression[][]
  ): Promise<number>;
  async insert<T extends RowObject = any>(
    table: CompatiableObjectName | ProxiedTable<T, string>,
    fields: ColumnsOf<T>[] | Field<Scalar, ColumnsOf<T>>[],
    value: T | T[]
  ): Promise<number>;
  async insert<T extends RowObject = any>(
    table: CompatiableObjectName | ProxiedTable<T, string>,
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
    if (this instanceof Connection) {
      return (this as unknown as Connection).trans(action);
    }
    return action();
  }

  async find<T extends RowObject = any>(
    table: ProxiedTable<T, string> | CompatiableObjectName,
    where:
      | Condition
      | WhereObject<T>
      | ((table: ProxiedRowset<T>) => Condition),
    fields?: ColumnsOf<T>[] | Field<Scalar, ColumnsOf<T>>[]
  ): Promise<T | null> {
    let columns: any[];
    const t = Table.ensure(table);
    if (fields && fields.length > 0 && typeof fields[0] === 'string') {
      columns = (fields as ColumnsOf<T>[]).map(fieldName => t.$(fieldName));
    } else {
      columns = [t._];
    }
    const sql = SQL.select<T>(...columns)
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
  async select<T extends RowObject = any, G extends InputObject = InputObject>(
    table: CompatiableObjectName | ProxiedTable<T>,
    results: (rowset: Readonly<Rowset<T>>) => G,
    options?: SelectOptions<T>
  ): Promise<RowObjectFrom<G>[]>;
  async select<T extends RowObject = any>(
    table: CompatiableObjectName | ProxiedTable<T>,
    options?: SelectOptions<T>
  ): Promise<T[]>;
  async select(
    table: CompatiableObjectName | ProxiedTable,
    arg2?: SelectOptions | ((rowset: Readonly<Rowset>) => any),
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
    let columns: any;
    const t: ProxiedRowset<any> = Table.ensure(table) as any;
    if (results) {
      columns = results(t);
    } else {
      columns = t._;
    }
    const sql = SQL.select(columns).from(table);
    if (where) {
      sql.where(typeof where === 'function' ? where(t) : where);
    }
    if (sorts) {
      if (Array.isArray(sorts)) {
        sql.orderBy(...sorts);
      } else if (typeof sorts === 'function') {
        sql.orderBy(...sorts(t));
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
    table: string | Table<T, string>,
    sets: InputObject<T> | Assignment[],
    where?:
      | WhereObject<T>
      | Condition
      | ((table: Readonly<ProxiedRowset<T>>) => Condition)
  ): Promise<number>;
  /**
   * 通过主键更新
   */
  async update<T extends RowObject = any>(
    table: string | Table<T, string>,
    items: T[],
    /**
     * 更新键字段列表
     */
    keyFieldsOrWhere:
      | ColumnsOf<T>[]
      | ((item: T, table: Readonly<ProxiedRowset<T>>) => Condition)
  ): Promise<number>;

  async update<T extends RowObject = any>(
    table: string | ProxiedTable<T, string>,
    setsOrItems:
      | InputObject<T>
      | InputObject<T>[]
      | Assignment[]
      | Assignment[][],
    whereOrKeys?:
      | WhereObject<T>
      | Condition
      | ColumnsOf<T>[]
      | ((table: Readonly<ProxiedRowset<T>>) => Condition)
      | ((item: T, table: Readonly<ProxiedRowset<T>>) => Condition)
  ): Promise<number> {
    const t = Table.ensure(table);

    if (Array.isArray(setsOrItems) && !(setsOrItems[0] instanceof Assignment)) {
      let keys: ColumnsOf<T>[];
      let where: (item: T, table: Readonly<ProxiedRowset<T>>) => Condition;
      if (typeof whereOrKeys === 'function') {
        where = whereOrKeys as (
          item: T,
          table: Readonly<ProxiedRowset<T>>
        ) => Condition;
      } else {
        keys = whereOrKeys as ColumnsOf<T>[];
      }
      const items = setsOrItems as T[];
      const docs: Document = doc(
        items.map(item => {
          let condition: CompatibleCondition;
          if (keys) {
            condition = and(keys.map(field => t[field].eq(item[field])));
          } else {
            condition = where(item, t);
          }
          const sql = SQL.update(table).set(item).where(condition);
          return sql;
        })
      );
      let res: QueryResult<T>;
      // 批量操作自动开启事务
      if (this instanceof Connection) {
        res = await this.trans(async () => await this.query(docs));
      } else {
        res = await this.query(docs);
      }
      return res.rowsAffected;
    }
    const sets = setsOrItems as Assignment[] | InputObject<T>;
    const sql = SQL.update(t).set(sets);
    const where = whereOrKeys as
      | Condition
      | ((table: Readonly<ProxiedRowset<T>>) => Condition);
    if (where) {
      sql.where(
        typeof where === 'function'
          ? where(t)
          : (whereOrKeys as CompatibleCondition<T>)
      );
    }
    const res = await this.query(sql);
    return res.rowsAffected;
  }

  async delete<T extends RowObject = any>(
    table: ProxiedTable<T> | CompatiableObjectName,
    where?:
      | WhereObject<T>
      | Condition
      | ((table: Readonly<ProxiedTable<T>>) => Condition)
  ): Promise<number> {
    const t = Table.ensure(table);
    const sql = SQL.delete(t);
    if (where) {
      sql.where(where instanceof Function ? where(t) : where);
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
