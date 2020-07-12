import * as _ from 'lodash'
import { assert } from './util'
import { EventEmitter } from 'events'
import { insert, select, update, del, exec, input, field, anyFields } from './builder'
import { Parameter, AST, Select, JsConstant, UnsureIdentifier, UnsureExpression, SortInfo, Condition, Statement, Assignment, KeyValueObject, UnsureCondition, SortObject, ValuesObject, ResultObject } from './ast'
import { Compiler } from './compiler'

export interface QueryResult<T extends ResultObject = ResultObject> {
  rows?: T[]
  output?: {
    [key:string]: JsConstant
  }
  rowsAffected: number
  returnValue?: any
}

// interface QueryParameter {
//    name: string,
//    value: any,
//    direction?: ParameterDirection
// }

type FilterValue<T> = {
  [TKey in keyof T]: T[TKey] extends JsConstant ? T[TKey] : never
}


type FilterKey<T> = {
  [TKey in keyof T]: TKey extends string ? T[TKey] : never
}

export interface QueryHandler<T extends ResultObject = ResultObject> {
  (sql: string, params: Parameter[]): Promise<QueryResult<T>>
}

export interface SelectOptions<TResult extends ResultObject = ResultObject> {
  where?: UnsureCondition,
  top?: number,
  offset?: number,
  limit?: number,
  distinct?: boolean,
  fields?: (keyof FilterKey<TResult>)[],
  sorts?: SortObject | (SortInfo | UnsureExpression)[]
}

// export interface IExecuotor {

//   doQuery: QueryHandler

//   query(sql: string, params: Parameter[]): Promise<QueryResult>
//   query(sql: string, params: Object): Promise<QueryResult>
//   query(strs: TemplateStringsArray, ...params)
//   query(sql: Statement | Document): Promise<QueryResult>

//   /**
//    * 执行一个查询并获取返回的第一个标量值
//    * @param sql
//    */
//   queryScalar(sql: string, params: Parameter[]): Promise<JsConstant>
//   queryScalar(sql: string, params: Object): Promise<JsConstant>
//   queryScalar(sql: Statement | Document): Promise<JsConstant>
//   queryScalar(sql: string[], ...params: any[]): Promise<JsConstant>

//   /**
//    * 插入数据的快捷操作
//    * @param {*} table
//    * @param {array?} fields 字段列表，可空
//    * @param {*} rows 可接受二维数组/对象，或者单行数组
//    */
//   insert(table: UnsureIdentifier, select: Select): Promise<number>
//   insert(table: UnsureIdentifier, fields: UnsureIdentifier[], select: Select): Promise<number>
//   insert<T extends KeyValueObject = KeyValueObject>(table: UnsureIdentifier, rows: T[]): Promise<number>
//   insert<T extends KeyValueObject = KeyValueObject>(table: UnsureIdentifier, row: T): Promise<number>
//   insert(table: UnsureIdentifier, fields: UnsureIdentifier[], rows: UnsureExpression[][]): Promise<number>

//   find<T = any>(table: UnsureIdentifier, where: UnsureCondition, fields?: string[]): Promise<T>

//   /**
//    * 简化版的SELECT查询，用于快速查询，如果要用复杂的查询，请使用select语句
//    * @param table
//    * @param where
//    * @param options
//    */
//   select<T = any>(table: UnsureIdentifier, options?: SelectOptions): Promise<T[]>

//   update(table: UnsureIdentifier, sets: Assignment[], where?: UnsureCondition): Promise<number>
//   update(table: UnsureIdentifier, sets: KeyValueObject, where?: UnsureCondition): Promise<number>
//   update(table: UnsureIdentifier, sets: KeyValueObject | Assignment[], where?: UnsureCondition): Promise<number>

//   execute(spname: UnsureIdentifier, params: UnsureExpression[]): Promise<number>
//   execute(spname: UnsureIdentifier, params: Parameter[]): Promise<number>

//   /**
//    * 执行存储过程
//    * @param spname 存储过程名称
//    * @param params
//    */
//   execute(spname, params): Promise<QueryResult>
// }

export class Executor extends EventEmitter {
  doQuery: QueryHandler
  protected parser: Compiler

  readonly isTrans: boolean

  /**
   * SQL执行器
   * @param {*} query 查询函数
   * @param {*} parser 编译函数
   */
  protected constructor(query: QueryHandler, parser: Compiler, isTrans: boolean = false) {
    super()
    // 是否启用严格模式，避免关键字等问题
    this.doQuery = query
    this.parser = parser
    this.isTrans = isTrans
  }

  // async _internalQuery(sql: string, params: Parameter[]): Promise<QueryResult>
  // async _internalQuery(sql: string, params: Object): Promise<QueryResult>
  // async _internalQuery(sql: string[], ...params: any[]): Promise<QueryResult>
  async _internalQuery(...args) {
    let sql: string, params: Parameter[]
    // 如果是AST直接编译
    if (args[0] instanceof AST) {
      ({ sql, params } = this.parser.compile(args[0]))
      // eslint-disable-next-line brace-style
    }
    // 如果是模板字符串
    else if (_.isArray(args[0])) {
      params = []
      sql = args[0].reduce((previous, current, index) => {
        previous += current
        if (index < args.length - 1) {
          const name = '__p__' + index
          const param = input(name, args[index + 1])
          params.push(param)
          previous += this.parser.prepareParameterName(param)
        }
        return previous
      }, '')
    } else {
      assert(_.isString(args[0]), 'sql 必须是字符串或者模板调用')
      sql = args[0]

      if (_.isObject(args[1])) {
        params = Object.entries(args[1]).map(
          ([name, value]) => input(name, value)
        )
      }
    }

    try {
      const res = await this.doQuery(sql, params)
      // 如果有输出参数
      if (res.output) {
        Object.entries(res.output).forEach(([name, value]) => {
          const p = params.find(p => p.name === name)
          p.value = value
          if (p.name === '_ReturnValue_') {
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

  async query<TResult extends ResultObject = never>(sql: string, params: Parameter[]): Promise<QueryResult<TResult>>
  async query<TResult extends ResultObject = never>(sql: string, params: Object): Promise<QueryResult<TResult>>
  async query<TResult extends ResultObject = never>(sql: Statement | Document): Promise<QueryResult<TResult>>
  async query<TResult extends ResultObject = never>(sql: TemplateStringsArray, ...params: any[]): Promise<QueryResult<TResult>>
  async query(...args) {
    return this._internalQuery(...args)
  }

  /**
   * 执行一个查询并获取返回的第一个标量值
   * @param sql
   */
  async queryScalar<TResult extends JsConstant = JsConstant>(sql: string, params: Parameter[]): Promise<TResult>
  async queryScalar<TResult extends JsConstant = JsConstant>(sql: string, params: Object): Promise<TResult>
  async queryScalar<TResult extends JsConstant = JsConstant>(sql: Statement | Document): Promise<TResult>
  async queryScalar<TResult extends JsConstant = JsConstant>(sql: string[], ...params: any[]): Promise<TResult>
  async queryScalar(...args) {
    const { rows: [row] } = await this._internalQuery(...args)
    assert(row, 'sql not return recordsets.')
    return row[Object.keys(row)[0]]
  }


  /**
   * 插入数据的快捷操作
   */
  insert(table: UnsureIdentifier, select: Select): Promise<number>
  insert(table: UnsureIdentifier, fields: UnsureIdentifier[], select: Select): Promise<number>
  insert(table: UnsureIdentifier, fields: UnsureIdentifier[], rows: UnsureExpression[][]): Promise<number>
  insert<T extends KeyValueObject = KeyValueObject>(table: UnsureIdentifier, rows: T[]): Promise<number>
  async insert(table: UnsureIdentifier, ...args): Promise<number> {
    let fields: UnsureIdentifier[], rows
    if (args.length > 2) {
      fields = args[0]
      rows = args[1]
    } else {
      rows = args[0]
    }

    const sql = insert(table, fields)
    // one row => rows
    if (!_.isArray(rows) && !_.isArray(rows[0])) {
      rows = [rows]
    }

    if (_.isArray(rows[0])) {
      sql.values(...rows as UnsureExpression[][])
    } else {
      sql.values(...rows as KeyValueObject[])
    }
    const res = await this.query(sql)
    return res.rowsAffected
  }

  async find<T extends ResultObject = ResultObject>(table: UnsureIdentifier, where: UnsureCondition, fields?: string[]): Promise<T> {
    let columns: (UnsureExpression)[]
    if (fields) {
      columns = fields.map(fieldName => field(fieldName))
    } else {
      columns = [anyFields]
    }
    const sql = select(...columns).top(1).from(table).where(where)
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
  async select<TResult extends ResultObject = ResultObject>(table: UnsureIdentifier, options: SelectOptions<TResult> = {}): Promise<TResult[]> {
    const { where, sorts, offset, limit, fields } = options
    let columns: UnsureExpression[]
    if (fields) {
      columns = fields.map(fieldName => field(fieldName as string))
    } else {
      columns = [anyFields]
    }
    const sql = select(...columns).from(table)
    if (where) {
      sql.where(where)
    }
    if (sorts) {
      if (_.isArray(sorts)) {
        sql.orderBy(...sorts)
      } else {
        sql.orderBy(sorts)
      }
    }
    if (!_.isUndefined(offset)) {
      sql.offset(offset)
    }
    if (!_.isUndefined(limit)) {
      sql.limit(limit)
    }
    const res = await this.query(sql)
    return res.rows as unknown as TResult[]
  }

  async update(table: UnsureIdentifier, sets: Assignment[], where?: UnsureCondition): Promise<number>
  async update<T extends ValuesObject = ValuesObject>(table: UnsureIdentifier, sets: T, where?: UnsureCondition): Promise<number>
  async update(table: UnsureIdentifier, sets: KeyValueObject | Assignment[], where?: UnsureCondition): Promise<number> {
    const sql = update(table)
    if (_.isArray(sets)) {
      sql.set(...sets)
    } else {
      sql.set(sets)
    }
    if (where) sql.where(where)
    const res = await this.query(sql)
    return res.rowsAffected
  }

  async delete(table: UnsureIdentifier, where?: UnsureCondition) {
    const sql = del(table)
    if (where) sql.where(where)
    const res = await this.query(sql)
    return res.rowsAffected
  }

  async execute(spname: UnsureIdentifier, params: UnsureExpression[])
  async execute(spname: UnsureIdentifier, params: Parameter[])
  async execute(spname: UnsureIdentifier, params: UnsureExpression[] | Parameter[]) {
    const sql = exec(spname, params)
    const res = await this.query(sql)
    return res
  }
}
