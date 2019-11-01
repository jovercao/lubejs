const _ = require('lodash')
const { assert } = require('./util')
const { EventEmitter } = require('events')
const { insert, select, update, del, all, proc } = require('./builder')
const { INPUT } = require('./constants')
const { Statement } = require('./ast')

class Executor extends EventEmitter {
  /**
   * SQL执行器
   * @param {*} query 查询函数
   * @param {*} compile 编译函数
   */
  constructor(query, compile, properParameter) {
    super()
    // 是否启用严格模式，避免关键字等问题
    this._query = query
    this._compile = compile
    this._properParameter = properParameter
  }

  async _internalQuery(sql, params) {
    // 如果是模板字符串
    if (_.isArray(sql)) {
      const _params = []
      sql = sql.reduce((total, current, index) => {
        total += current
        if (index < arguments.length - 1) {
          const name = 'p_p_' + index
          _params.push({
            name,
            value: arguments[index + 1]
          })
          total += this._properParameter(name)
        }
        return total
      }, '')
      params = _params
    }

    assert(_.isString(sql), 'sql 必须是字符串或者模板调用')

    if (_.isPlainObject(params)) {
      params = Object.entries(params).map(([name, value]) => ({ name, value, direction: INPUT }))
    }

    try {
      const res = await this._query(sql, params)
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

  async query(sql, params) {
    if (sql instanceof Statement) {
      const cmd = this._compile(sql)
      const res = await this._internalQuery(cmd.sql, cmd.params)
      return res
    }
    const res = await this._internalQuery(...arguments)
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
      sql.columns(all())
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
