/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  assert,
  ensureProxiedRowset,
  ensureRowset,
  isScalar,
  makeProxiedRowset
} from './util'
import { EventEmitter } from 'events'
import {
  Parameter,
  AST,
  Select,
  CompatibleExpression,
  Condition,
  Statement,
  Assignment,
  InputObject,
  WhereObject,
  Field,
  FieldsOf,
  RowObject,
  Name,
  Procedure,
  Table,
  AsScalarType,
  CompatibleCondition,
  Document,
  Rowset,
  RowTypeFrom,
  ProxiedRowset,
  Execute,
  CompatibleSortInfo,
  SortInfo,
  CompatibleTable
} from './ast'
import { Compiler } from './compile'
import { INSERT_MAXIMUM_ROWS } from './constants'
import { Lube } from './lube'
import { Queryable } from './queryable'
import { and, doc, or } from './builder'
import { ScalarType } from './types'

export interface Command {
  sql: string
  params: Parameter[]
}

/**
 * 查询结果对象
 * 为了照顾绝大多数调用，将首个行集类型参数作提前处理。
 */
export interface QueryResult<
  T extends RowObject = never,
  R extends ScalarType = never,
  O extends [T, ...RowObject[]] = [T]
> {
  /**
   * 返回结果集
   */
  rows?: T[]
  /**
   * 输出参数
   */
  output?: {
    [key: string]: ScalarType
  }
  /**
   * 受影响行数
   */
  rowsAffected: number
  /**
   * 存储过程调用的返回值
   */
  returnValue?: R

  /**
   * 多数据集返回，仅支持mssql
   */
  rowsets?: never extends O
    ? any[]
    : O extends [infer O1, infer O2, infer O3, infer O4, infer O5]
    ? [O1[], O2[], O3[], O4[], O5[]]
    : O extends [infer O1, infer O2, infer O3, infer O4]
    ? [O1[], O2[], O3[], O4[]]
    : O extends [infer O1, infer O2, infer O3]
    ? [O1[], O2[], O3[]]
    : O extends [infer O1, infer O2]
    ? [O1[], O2[]]
    : [T[]]
}
export interface SelectOptions<T extends RowObject = any> {
  where?:
    | WhereObject<T>
    | Condition
    | ((table: Readonly<ProxiedRowset<T>>) => Condition)
  top?: number
  offset?: number
  limit?: number
  distinct?: boolean
  sorts?: CompatibleSortInfo | ((rowset: Rowset<T>) => SortInfo[])
}

export interface QueryHandler {
  (sql: string, params: Parameter<ScalarType, string>[]): Promise<
    QueryResult<any, any, any>
  >
}

export class Executor extends EventEmitter {
  /**
   * SQL执行器
   * @param {*} query 查询函数
   * @param {*} compiler 编译函数
   */
  protected constructor (
    query: QueryHandler,
    compiler: Compiler,
    isTrans = false
  ) {
    super()
    // 是否启用严格模式，避免关键字等问题
    this.doQuery = query
    this.compiler = compiler
    this.isTrans = isTrans
  }

  private doQuery: QueryHandler

  getQueryable<T extends RowObject, N extends string> (
    table: CompatibleTable<T, N>
  ): Queryable<T> {
    return new Queryable(this, ensureRowset(table))
  }

  /**
   * 编译器
   */
  readonly compiler: Compiler

  /**
   * 是否在事务当中
   */
  readonly isTrans: boolean

  on (event: 'command', listener: (cmd: Command) => void): this
  on (event: 'commit', listener: (executor: Executor) => void): this
  on (event: 'rollback', listener: (executor: Executor) => void): this
  on (event: 'error', listener: (error: Error) => any): this
  on (event: string, listener: (...args: any[]) => any): this {
    return super.on(event, listener)
  }

  off (event: 'command', listener?: (cmd: Command) => void): this
  off (event: 'commit', listener?: (executor: Executor) => void): this
  off (event: 'rollback', listener?: (executor: Executor) => void): this
  off (event: 'error', listener?: (error: Error) => any): this
  off (event: string, listener?: (...args: any[]) => any): this {
    if (!listener) {
      return super.removeAllListeners(event)
    } else {
      return super.off(event, listener)
    }
  }

  // async _internalQuery(sql: string, params: Parameter[]): Promise<QueryResult>
  // async _internalQuery(sql: string, params: Object): Promise<QueryResult>
  // async _internalQuery(sql: string[], ...params: any[]): Promise<QueryResult>
  private async _internalQuery (
    ...args: any[]
  ): Promise<QueryResult<any, any, any>> {
    let sql: string, params: Parameter[]
    // 如果是AST直接编译
    if (args[0] instanceof AST) {
      ({ sql, params } = this.compiler.compile(args[0]))
    }
    // 如果是模板字符串
    else if (Array.isArray(args[0])) {
      params = []
      sql = args[0].reduce((previous, current, index) => {
        previous += current
        if (index < args.length - 1) {
          const name = '__p__' + index
          const param = Parameter.input(name, args[index + 1])
          params.push(param)
          previous += this.compiler.stringifyParameterName(param)
        }
        return previous
      }, '')
    } else {
      assert(typeof args[0] === 'string', 'sql 必须是字符串或者模板调用')
      sql = args[0]

      if (typeof args[1] === 'object') {
        params = Object.entries(args[1]).map(([name, value]: any) =>
          Parameter.input(name, value)
        )
      }
    }

    try {
      const res = await this.doQuery(sql, params)
      // 如果有输出参数
      if (res.output) {
        Object.entries(res.output).forEach(([name, value]) => {
          const p = params.find(p => p.$name === name)
          p.value = value
          if (p.$name === this.compiler.options.returnParameterName) {
            res.returnValue = value
          }
        })
      }
      return res
    } catch (ex) {
      this.emit('error', ex)
      throw ex
    } finally {
      this.emit('command', { sql, params })
    }
  }

  async query<T extends RowObject = any> (
    sql: Select<T>
  ): Promise<QueryResult<T>>
  /**
   * 执行一个存储过程执行代码
   */
  async query<R extends ScalarType = number, O extends RowObject[] = []> (
    sql: Execute<R, O>
    // eslint-disable-next-line
    // @ts-ignore
  ): Promise<QueryResult<O[0], R, O>>
  async query<T extends RowObject = any> (sql: string): Promise<QueryResult<T>>
  async query<T extends RowObject = any> (
    sql: string,
    params: Parameter[]
  ): Promise<QueryResult<T>>
  async query<T extends RowObject = any> (
    sql: string,
    params: Record<string, ScalarType>
  ): Promise<QueryResult<T>>
  async query<T extends RowObject = any> (
    sql: Statement | Document
  ): Promise<QueryResult<T>>
  async query<T extends RowObject = any> (
    sql: TemplateStringsArray,
    ...params: any[]
  ): Promise<QueryResult<T>>
  async query (...args: any[]): Promise<any> {
    return this._internalQuery(...args)
  }

  /**
   * 执行一个查询并获取返回的第一个标量值
   * @param sql
   */
  async queryScalar<T extends ScalarType = any> (
    sql: string,
    params?: Parameter[]
  ): Promise<T>
  async queryScalar<T extends ScalarType = any> (
    sql: string,
    params?: InputObject
  ): Promise<T>
  async queryScalar<T extends RowObject> (
    sql: Select<T>
  ): Promise<AsScalarType<T>>
  async queryScalar<T extends ScalarType> (sql: Select<any>): Promise<T>
  async queryScalar<T extends ScalarType = any> (
    sql: TemplateStringsArray,
    ...params: any[]
  ): Promise<T>
  async queryScalar (...args: any[]): Promise<any> {
    const {
      rows: [row]
    } = await this._internalQuery(...args)
    return row ? Object.values(row)[0] : null
  }

  /**
   * 插入数据
   */
  async insert<T extends RowObject = any> (
    table: Name<string> | Table<T, string>,
    values?: InputObject<T> | InputObject<T>[] | CompatibleExpression[]
  ): Promise<number>
  /**
   * 插入数据
   */
  async insert<T extends RowObject = any> (
    table: Name<string> | Table<T, string>,
    values?: T | T[]
  ): Promise<number>
  async insert<T extends RowObject = any> (
    table: Name<string> | Table<T, string>,
    fields: FieldsOf<T>[] | Field<ScalarType, FieldsOf<T>>[],
    value?:
      | InputObject<T>
      | InputObject<T>[]
      | CompatibleExpression[]
      | CompatibleExpression[][]
  ): Promise<number>
  async insert<T extends RowObject = any> (
    table: Name<string> | Table<T, string>,
    fields: FieldsOf<T>[] | Field<ScalarType, FieldsOf<T>>[],
    value?: T | T[]
  ): Promise<number>
  async insert<T extends RowObject = any> (
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
    let fields: FieldsOf<T>[] | Field<ScalarType, FieldsOf<T>>[]
    let values:
      | InputObject<T>
      | InputObject<T>[]
      | CompatibleExpression
      | CompatibleExpression[]

    if (arguments.length <= 2) {
      values = arg2
      fields = undefined
    } else {
      values = arg3
      fields = arg2 as FieldsOf<T>[] | Field<ScalarType, FieldsOf<T>>[]
    }

    // 确保装入数组里，以便 使用
    // UnsureExpression[] => UnsureExpression[][]
    // Object => Object[]
    if (
      !Array.isArray(values) ||
      (!Array.isArray(values[0]) && isScalar(values[0]))
    ) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      values = [values as any]
    }
    const packedValues = values
    if (packedValues.length > INSERT_MAXIMUM_ROWS) {
      console.warn(
        'Values exceed 1000 rows, and will be inserted multiple times.'
      )
    }
    const action = async (executor: Executor): Promise<number> => {
      let i = 0
      let rowsAffected = 0
      while (i < packedValues.length) {
        const items = packedValues.slice(i, i + INSERT_MAXIMUM_ROWS)
        i += INSERT_MAXIMUM_ROWS
        const sql = Statement.insert(table, fields)
        sql.values.call(sql, items)
        const res = await executor.query(sql)
        rowsAffected += res.rowsAffected
      }
      return rowsAffected
    }
    // 启用事务
    if (this instanceof Lube && !this.isTrans) {
      return await this.trans(action)
    }
    return await action(this)
  }

  async find<T extends RowObject = any> (
    table: Table<T, string> | Name<string>,
    where:
      | Condition
      | WhereObject<T>
      | ((table: ProxiedRowset<T>) => Condition),
    fields?: FieldsOf<T>[] | Field<ScalarType, FieldsOf<T>>[]
  ): Promise<T> {
    let columns: any[]
    const t = makeProxiedRowset(ensureRowset(table))
    if (fields && fields.length > 0 && typeof fields[0] === 'string') {
      columns = (fields as FieldsOf<T>[]).map(fieldName => t.field(fieldName))
    } else {
      columns = [t.star]
    }
    const sql = Statement.select<T>(...columns)
      .top(1)
      .from(t)
      .where(typeof where === 'function' ? where(t) : where)
    const res = await this.query<T>(sql)
    if (res.rows && res.rows.length > 0) {
      return res.rows[0]
    }
    return null
  }

  /**
   * 简化版的SELECT查询，用于快速查询，如果要用复杂的查询，请使用select语句
   * @param table
   * @param where
   * @param options
   */
  async select<T extends RowObject = any, G extends InputObject = InputObject> (
    table: Name<string> | Table<T, string>,
    results: (rowset: Readonly<Rowset<T>>) => G,
    options?: SelectOptions<T>
  ): Promise<RowTypeFrom<G>[]>
  async select<T extends RowObject = any> (
    table: Name<string> | Table<T, string>,
    options?: SelectOptions<T>
  ): Promise<T[]>

  async select (
    table: Name<string> | Table,
    arg2?: SelectOptions | ((rowset: Readonly<Rowset>) => any),
    arg3?: SelectOptions
  ): Promise<any[]> {
    let options: SelectOptions
    let results: (rowset: Readonly<Rowset>) => any
    if (typeof arg2 === 'function') {
      results = arg2
      options = arg3
    } else {
      options = arg2
    }
    const { where, sorts, offset, limit } = options || {}
    let columns: any
    const t = ensureProxiedRowset(table)
    if (results) {
      columns = results(t)
    } else {
      columns = t.star
    }
    const sql = Statement.select(columns).from(table)
    if (where) {
      sql.where(typeof where === 'function' ? where(t) : where)
    }
    if (sorts) {
      if (Array.isArray(sorts)) {
        sql.orderBy(...sorts)
      } else if (typeof sorts === 'function') {
        sql.orderBy(...sorts(t))
      } else {
        sql.orderBy(sorts)
      }
    }
    if (!(typeof offset === 'undefined')) {
      sql.offset(offset)
    }
    if (!(typeof limit === 'undefined')) {
      sql.limit(limit)
    }
    const res = await this.query(sql)
    return res.rows
  }

  /**
   * 更新表
   */
  async update<T extends RowObject = any> (
    table: string | Table<T, string>,
    sets: InputObject<T> | Assignment[],
    where?:
      | WhereObject<T>
      | Condition
      | ((table: Readonly<ProxiedRowset<T>>) => Condition)
  ): Promise<number>
  /**
   * 通过主键更新
   */
  async update<T extends RowObject = any> (
    table: string | Table<T, string>,
    items: T[],
    /**
     * 更新键字段列表
     */
    keyFieldsOrWhere:
      | FieldsOf<T>[]
      | ((item: T, table: Readonly<ProxiedRowset<T>>) => Condition)
  ): Promise<number>

  async update<T extends RowObject = any> (
    table: string | Table<T, string>,
    setsOrItems:
      | InputObject<T>
      | InputObject<T>[]
      | Assignment[]
      | Assignment[][],
    whereOrKeys?:
      | WhereObject<T>
      | Condition
      | FieldsOf<T>[]
      | ((table: Readonly<ProxiedRowset<T>>) => Condition)
      | ((item: T, table: Readonly<ProxiedRowset<T>>) => Condition)
  ): Promise<number> {
    const t = ensureProxiedRowset(table)

    if (Array.isArray(setsOrItems) && !(setsOrItems[0] instanceof Assignment)) {
      let keys: FieldsOf<T>[]
      let where: (item: T, table: Readonly<ProxiedRowset<T>>) => Condition
      if (typeof whereOrKeys === 'function') {
        where = whereOrKeys as (
          item: T,
          table: Readonly<ProxiedRowset<T>>
        ) => Condition
      } else {
        keys = whereOrKeys as FieldsOf<T>[]
      }
      const items = setsOrItems as T[]
      const docs: Document = doc(
        items.map(item => {
          let condition: CompatibleCondition
          if (keys) {
            condition = and(keys.map(field => t[field].eq(item[field])))
          } else {
            condition = where(item, t)
          }
          const sql = Statement.update(table)
            .set(item)
            .where(condition)
          return sql
        })
      )
      const res = await this.query(docs)
      return res.rowsAffected
    }
    const sets = setsOrItems as Assignment[] | InputObject<T>
    const sql = Statement.update(t).set(sets)
    const where = whereOrKeys as
      | Condition
      | ((table: Readonly<ProxiedRowset<T>>) => Condition)
    if (where) {
      sql.where(
        typeof where === 'function'
          ? where(t)
          : (whereOrKeys as CompatibleCondition<T>)
      )
    }
    const res = await this.query(sql)
    return res.rowsAffected
  }

  async delete<T extends RowObject = any> (
    table: Table<T, string> | Name<string>,
    where?:
      | WhereObject<T>
      | Condition
      | ((table: Readonly<ProxiedRowset<T>>) => Condition)
  ): Promise<number> {
    const t = ensureProxiedRowset(table)
    const sql = Statement.delete(t)
    if (where) {
      sql.where(where instanceof Function ? where(t) : where)
    }
    const res = await this.query(sql)
    return res.rowsAffected
  }

  async execute<R extends ScalarType = number, O extends RowObject[] = []> (
    spName: Name<string> | Procedure<R, O>,
    params?: CompatibleExpression[]
    // eslint-disable-next-line
    // @ts-ignore
  ): Promise<QueryResult<O[0], R, O>> {
    const sql = Statement.execute<R, O>(spName, params)
    const res = await this.query(sql)
    return res
  }

  /**
   * 保存数据，必须指定主键后才允许使用
   * 通过自动对比与数据库中现有的数据差异而进行提交
   * 遵守不存在的则插入、已存在的则更新的原则；
   */
  async save<T extends RowObject = any> (
    table: Table<T, string> | Name<string>,
    keyFields: FieldsOf<T>[],
    items: T[] | T
  ): Promise<number> {
    if (keyFields.length === 0) {
      throw new Error('KeyFields must be specified.')
    }

    if (!Array.isArray(items)) {
      items = [items]
    }
    const hasKeyItems = items.filter(
      item =>
        !keyFields.find(
          field => item[field] === undefined || item[field] === null
        )
    )
    const keygen = (item: T) => keyFields.map(field => item[field]).join('#')
    const itemsMap: Map<any, any> = new Map()
    hasKeyItems.forEach(item => {
      if (
        keyFields.find(
          field => item[field] === undefined || item[field] === null
        )
      )
        return
      const key = keygen(item)
      itemsMap.set(key, item)
    })

    const t = ensureProxiedRowset(table)

    const existsItems = await this.select(t, {
      where: or(
        ...hasKeyItems.map(item =>
          and(...keyFields.map(field => t[field].eq(item[field])))
        )
      )
    })
    const existsMap: Map<any, any> = new Map()
    existsItems.forEach(item => {
      const keyValue = keygen(item)
      existsMap.set(keyValue, item)
    })

    const addeds = items.filter(item => !existsMap.has(keygen(item)))
    await this.insert(t, addeds)
    const updateds = items.filter(item => existsMap.has(keygen(item)))
    // for (const item of updateds) {
    //   await this.executor.update(this.table, item, this.table[this.primaryKey].eq(item[this.primaryKey]))
    // }
    await this.update(t, updateds, keyFields)
    return addeds.length + updateds.length
  }

  queryable<T extends RowObject = any> (
    table: Table<T, string> | Name<string>
  ): Queryable<T> {
    return new Queryable(this, table as Rowset<T>)
  }
}
