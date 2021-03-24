/* eslint-disable @typescript-eslint/no-explicit-any */
import { assert, ensureField, ensureRowset, isScalar } from "./util";
import { EventEmitter } from "events";
import {
  Parameter,
  AST,
  Select,
  ScalarType,
  CompatibleExpression,
  Condition,
  Statement,
  Assignment,
  InputObject,
  WhereObject,
  Identifier,
  Field,
  FieldsOf,
  RowObject,
  Name,
  Procedure,
  Table,
  AsScalarType,
  CompatibleCondition,
  Document
} from "./ast";
import { Compiler } from "./compiler";
import { INSERT_MAXIMUM_ROWS } from "./constants";
import { Lube } from "./lube";
import { QueryHandler, QueryResult, Command, SelectOptions } from "./types";
import { Repository } from "./repository";

export class Executor extends EventEmitter {
  doQuery: QueryHandler;

  /**
   * 编译器
   */
  readonly compiler: Compiler;

  /**
   * 是否在事务当中
   */
  readonly isTrans: boolean;

  /**
   * SQL执行器
   * @param {*} query 查询函数
   * @param {*} compiler 编译函数
   */
  protected constructor(
    query: QueryHandler,
    compiler: Compiler,
    isTrans = false
  ) {
    super();
    // 是否启用严格模式，避免关键字等问题
    this.doQuery = query;
    this.compiler = compiler;
    this.isTrans = isTrans;
  }

  on(event: "command", listener: (cmd: Command) => void): this;
  on(event: "commit", listener: (executor: Executor) => void): this;
  on(event: "rollback", listener: (executor: Executor) => void): this;
  on(event: "error", listener: (error: Error) => any): this;
  on(event: string, listener: (...args: any[]) => any): this {
    return super.on(event, listener);
  }

  off(event: "command", listener?: (cmd: Command) => void): this;
  off(event: "commit", listener?: (executor: Executor) => void): this;
  off(event: "rollback", listener?: (executor: Executor) => void): this;
  off(event: "error", listener?: (error: Error) => any): this;
  off(event: string, listener?: (...args: any[]) => any): this {
    if (!listener) {
      return super.removeAllListeners(event);
    } else {
      return super.off(event, listener);
    }
  }

  // async _internalQuery(sql: string, params: Parameter[]): Promise<QueryResult>
  // async _internalQuery(sql: string, params: Object): Promise<QueryResult>
  // async _internalQuery(sql: string[], ...params: any[]): Promise<QueryResult>
  private async _internalQuery(...args: any[]) {
    let sql: string, params: Parameter[];
    // 如果是AST直接编译
    if (args[0] instanceof AST) {
      ({ sql, params } = this.compiler.compile(args[0]));
      // eslint-disable-next-line brace-style
    }
    // 如果是模板字符串
    else if (Array.isArray(args[0])) {
      params = [];
      sql = args[0].reduce((previous, current, index) => {
        previous += current;
        if (index < args.length - 1) {
          const name = "__p__" + index;
          const param = Parameter.input(name, args[index + 1]);
          params.push(param);
          previous += this.compiler.stringifyParameterName(param);
        }
        return previous;
      }, "");
    } else {
      assert(typeof args[0] === "string", "sql 必须是字符串或者模板调用");
      sql = args[0];

      if (typeof args[1] === "object") {
        params = Object.entries(args[1]).map(([name, value]: any) =>
          Parameter.input(name, value)
        );
      }
    }

    try {
      const res = await this.doQuery(sql, params);
      // 如果有输出参数
      if (res.output) {
        Object.entries(res.output).forEach(([name, value]) => {
          const p = params.find((p) => p.$name === name);
          p.value = value;
          if (p.$name === "_ReturnValue_") {
            res.returnValue = value;
          }
        });
      }
      return res;
    } catch (ex) {
      this.emit("error", ex);
      throw ex;
    } finally {
      this.emit("command", { sql, params });
    }
  }

  async query<T extends RowObject = any>(sql: Select<T>): Promise<QueryResult<T>>;
  async query<T extends RowObject = any>(sql: string): Promise<QueryResult<T>>;
  async query<T extends RowObject = any>(
    sql: string,
    params: Parameter[]
  ): Promise<QueryResult<T>>;
  async query<T extends RowObject = any>(
    sql: string,
    params: Record<string, ScalarType>
  ): Promise<QueryResult<T>>;
  async query<T extends RowObject = any>(
    sql: Statement | Document
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
  async queryScalar<T extends ScalarType = any>(
    sql: string,
    params?: Parameter[]
  ): Promise<T>;
  async queryScalar<T extends ScalarType = any>(
    sql: string,
    params?: InputObject
  ): Promise<T>;
  async queryScalar<T extends RowObject>(sql: Select<T>): Promise<AsScalarType<T>>;
  async queryScalar<T extends ScalarType>(sql: Select<any>): Promise<T>;
  async queryScalar<T extends ScalarType = any>(
    sql: TemplateStringsArray,
    ...params: any[]
  ): Promise<T>;
  async queryScalar(...args: any[]): Promise<any> {
    const {
      rows: [row],
    } = await this._internalQuery(...args);
    return row ? Object.values(row)[0] : null;
  }

  /**
   * 插入数据的快捷操作
   */
  async insert<T extends RowObject = any>(
    table: Name<string> | Table<T, string>,
    values?: InputObject<T> | CompatibleExpression[]
  ): Promise<number>;
  async insert<T extends RowObject = any>(
    table: Name<string> | Table<T, string>,
    values?: InputObject<T>[]
  ): Promise<number>;
  async insert<T extends RowObject = any>(
    table: Name<string> | Table<T, string>,
    fields: FieldsOf<T>[] | Field<ScalarType, FieldsOf<T>>[],
    value?: InputObject<T> | CompatibleExpression[]
  ): Promise<number>;
  async insert<T extends RowObject = any>(
    table: Name<string> | Table<T, string>,
    fields: FieldsOf<T>[] | Field<ScalarType, FieldsOf<T>>[],
    value?: InputObject<T> | InputObject<T>[] | CompatibleExpression[] | CompatibleExpression[][]
  ): Promise<number>;
  async insert<T extends RowObject = any>(
    table: Name<string> | Table<T, string>,
    arg2:
      | FieldsOf<T>[]
      | Field<ScalarType, FieldsOf<T>>[]
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
    let fields: FieldsOf<T>[] | Field<ScalarType, FieldsOf<T>>[];
    let values: InputObject<T> | InputObject<T>[] | CompatibleExpression | CompatibleExpression[];

    if (arguments.length <= 2) {
      values = arg2;
      fields = undefined;
    } else {
      values = arg3;
      fields = arg2 as FieldsOf<T>[] | Field<ScalarType, FieldsOf<T>>[];
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
        "Values exceed 1000 rows, and will be inserted multiple times."
      );
    }
    const action = async (executor: Executor): Promise<number> => {
      let i = 0;
      let rowsAffected = 0;
      while (i < packedValues.length) {
        const items = packedValues.slice(i, i + INSERT_MAXIMUM_ROWS);
        i += INSERT_MAXIMUM_ROWS;
        const sql = Statement.insert(table, fields);
        sql.values.call(sql, items);
        const res = await executor.query(sql);
        rowsAffected += res.rowsAffected;
      }
      return rowsAffected;
    };
    // 启用事务
    if (this instanceof Lube && !this.isTrans) {
      return await this.trans(action);
    }
    return await action(this);
  }

  async find<T extends RowObject = any>(
    table: Table<T, string> | Name<string>,
    where: Condition | WhereObject<T>,
    fields?: FieldsOf<T>[] | Field<ScalarType, FieldsOf<T>>[]
  ): Promise<T> {
    let columns: any[];
    if (Array.isArray(table) || typeof table === "string") {
      table = Identifier.table(table);
    }
    const t = table;
    if (fields && fields.length > 0 && typeof fields[0] === "string") {
      columns = (fields as FieldsOf<T>[]).map((fieldName) =>
        t.field(fieldName)
      );
    } else {
      columns = [t.star];
    }
    const sql = Statement.select<T>(...columns)
      .top(1)
      .from(t)
      .where(where);
    const res = await this.query<T>(sql);
    if (res.rows && res.rows.length > 0) {
      return res.rows[0];
    }
    return null;
  }

  /**
   * 简化版的SELECT查询，用于快速查询，如果要用复杂的查询，请使用select语句
   * @param table
   * @param where
   * @param options
   */
  async select<T extends RowObject = any>(
    table: Name<string> | Table<T, string>,
    options?: SelectOptions<T>
  ): Promise<T[]> {
    const { where, sorts, offset, limit, fields } = options || {};
    let columns: any[];
    const t = ensureRowset(table);
    if (fields) {
      columns = fields.map((expr) => ensureField(expr as string));
    } else {
      columns = [t.star];
    }
    const sql = Statement.select<T>(...columns).from(table);
    if (where) {
      sql.where(where);
    }
    if (sorts) {
      if (Array.isArray(sorts)) {
        sql.orderBy(...sorts);
      } else {
        sql.orderBy(sorts);
      }
    }
    if (!(typeof offset === "undefined")) {
      sql.offset(offset);
    }
    if (!(typeof limit === "undefined")) {
      sql.limit(limit);
    }
    const res = await this.query(sql);
    return res.rows;
  }

  /**
   * 更新表
   * @param table 表
   * @param sets 要修改的赋值
   * @param where 查询条件
   */
  async update<T extends RowObject = any>(
    table: string | Table<T, string>,
    sets: InputObject<T> | Assignment[],
    where?: WhereObject<T> | Condition
  ): Promise<number>
  async update<T extends RowObject = any>(
    table: string | Table<T, string>,
    items: T[],
    key: string[]
  ): Promise<number>
  async update<T extends RowObject = any>(
    table: string | Table<T, string>,
    sets: InputObject<T> | Assignment[],
    where?: WhereObject<T> | Condition | FieldsOf<T>[]
  ): Promise<number> {

    if (Array.isArray(sets) && !(sets[0] instanceof Assignment)) {
      const key = where as FieldsOf<T>[]
      const items = sets as InputObject<T>[]
      const docs: Document = new Document(
        ...items.map(item => {
          const condition: Partial<T> = {}
          key.forEach(field => {
            Reflect.set(condition, field, item[field])
          })
          const sql = Statement.update(table).set(item).where(condition)
          return sql
        })
      )

      const res = await this.query(docs)
      return res.rowsAffected
    }

    const sql = Statement.update(table);
    if (Array.isArray(sets)) {
      sql.set(...sets);
    } else {
      sql.set(sets);
    }
    if (where) {
      sql.where(where as CompatibleCondition<T>);
    }
    const res = await this.query(sql);
    return res.rowsAffected;
  }

  async delete<T extends RowObject = any>(
    table: Table<T, string> | Name<string>,
    where?: WhereObject<T> | Condition
  ): Promise<number> {
    const sql = Statement.delete(table);
    if (where) {
      sql.where(where);
    }
    const res = await this.query(sql);
    return res.rowsAffected;
  }

  async execute<T extends RowObject>(
    spName: Name<string> | Procedure<T>,
    params?: CompatibleExpression[]
  ): Promise<QueryResult<T>> {
    const sql = Statement.execute<T>(spName, params);
    const res = await this.query(sql);
    return res as any;
  }

  getRepository<T extends RowObject>(rowset: Table<T>): Repository<T> {
    return new Repository(this, rowset)
  }
}
