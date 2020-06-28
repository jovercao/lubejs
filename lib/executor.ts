import * as _ from 'lodash'
import  { assert }  from './util'
import  { EventEmitter }  from 'events'
import  { insert, select, update, del, allField, exec, invoke, input }  from './builder'
import  { ParameterDirection, SortDirection }  from './constants'
import  { Parameter, AST, JsConstant }  from './ast'

interface QueryResult {
  output?: object
  rows?: object[]
  rowsAffected: number
  returnValue?: any
}

// interface QueryParameter {
//    name: string,
//    value: any,
//    direction?: ParameterDirection
// }

export interface QueryHandler {
  (sql: string, params: Parameter[]): Promise<QueryResult>
}

export interface Command {
  sql: string
  params: Parameter[]
}

export interface Compiler {
  (ast: AST): Command
}

/**
 * 兼容
 */
export interface Ployfill {
  /**
   * 参数前缀
   */
  paramPrefix: string,
  /**
   * 标识符引用，左
   */
  quotedLeft: string
  /**
   * 标识符引用，右
   */
  quotedRight: string,
}

export class Executor extends EventEmitter {

  private _query: QueryHandler
  private _compile: Compiler
  private _ployfill: Ployfill

  /**
   * SQL执行器
   * @param {*} query 查询函数
   * @param {*} compile 编译函数
   */
  constructor(query: QueryHandler, compile: Compiler, ployfill: Ployfill) {
    super()
    // 是否启用严格模式，避免关键字等问题
    this._query = query
    this._compile = compile
    this._ployfill = ployfill
  }

  // async _internalQuery(sql: string, params: Parameter[]): Promise<QueryResult>
  // async _internalQuery(sql: string, params: Object): Promise<QueryResult>
  // async _internalQuery(sql: string[], ...params: any[]): Promise<QueryResult>
  async _internalQuery(...args) {
    let sql: string, params: Parameter[]
    // 如果是模板字符串
    if (_.isArray(args[0])) {
      params = []
      sql = args[0].reduce((previous, current, index) => {
        previous += current
        if (index < args.length - 1) {
          const name = '__p__' + index
          params.push(input(name, args[index + 1]))
          previous += this._ployfill.paramPrefix + name
        }
        return previous
      }, '')
    }

    assert(_.isString(args[0]), 'sql 必须是字符串或者模板调用')
    sql = args[0]

    if (_.isObject(args[1])) {
      params = Object.entries(args[1]).map(
        ([name, value]) => input(name, value)
      )
    }

    try {
      const res = await this._query(sql, params)
      // 如果有输出参数
      if (res.output) {
        Object.entries(res.output).forEach(([name, value]) => {
          const p = params.find(p => p.$name === name)
          p.$value = value
          if (p.$name === '_ReturnValue_') {
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

  async query(sql: string, params: Parameter[]): Promise<QueryResult>
  async query(sql: string, params: Object): Promise<QueryResult>
  async query(sql: AST): Promise<QueryResult>
  async query(sql: string[], ...params: any[]): Promise<QueryResult>
  async query(...args) {
    if (args[0] instanceof AST) {
      const cmd = this._compile(args[0])
      const res = await this._internalQuery(cmd.sql, cmd.params)
      return res
    }
    const res = await this._internalQuery(...args)
    return res
  }

  /**
   * 插入数据的快捷操作
   * @param {*} table
   * @param {array?} fields 字段列表，可空
   * @param {*} rows 可接受二维数组/对象，或者单行数组
   */
  async insert(table, fields, rows) {
    if (arguments.length < 3) {
      rows = fields
      fields = undefined
    }

    const sql = insert(table)
    if (fields) sql.fields(fields)
    sql.values(rows)
    const res = await this.query(sql)
    return res.rowsAffected
  }

  async find(table, where) {
    const sql = select().top(1).from(table).where(where)
    const res = await this.query(sql)
    if (res.rows && res.rows.length > 0) {
      return res.rows[0]
    }
    return null
  }

  async select(table, { where, groups, orders, offset, limit, columns } = {}) {
    const sql = select().from(table)
    if (columns) {
      sql.columns(columns)
    } else {
      sql.columns(allField())
    }
    if (where) {
      sql.where(where)
    }
    if (groups) {
      sql.groupby(groups)
    }
    if (orders) {
      sql.orderby(orders)
    }
    if (!_.isUndefined(offset)) {
      sql.offset(offset)
    }
    if (!_.isUndefined(limit)) {
      sql.limit(limit)
    }
    const res = await this.query(sql)
    return res.rows
  }

  async update(table, sets, where) {
    const sql = update(table).set(sets)
    if (where) sql.where(where)
    const res = await this.query(sql)
    return res.rowsAffected
  }

  async delete(table, where) {
    const sql = del(table)
    if (where) sql.where(where)
    const res = await this.query(sql)
    return res.rowsAffected
  }

  async execute(spname, params) {
    const sql = proc(spname).call(params)
    const res = await this.query(sql)
    return res
  }
}

module.exports = {
  Executor
}
