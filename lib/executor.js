const _ = require('lodash')
const { assert } = require('./util')
const { EventEmitter } = require('events')
const { insert, select, update, del, all } = require('./builder')
const { INPUT } = require('./constants')
const { Statement } = require('../ast')

class Executor extends EventEmitter {
  constructor(provider, options) {
    super()
    // 是否启用严格模式，避免关键字等问题
    this._provider = provider
    this._options = options
  }

  async _query(sql, params) {
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
          total += this._provider.ployfill.properParameter(name)
        }
        return total
      }, '')
      params = _params
    }

    this.emit('command', { sql, params: params })

    assert(_.isString(sql), 'sql 必须是字符串或者模板调用')

    if (_.isPlainObject(params)) {
      params = Object.entries(params).map(([name, value]) => ({ name, value, direction: INPUT }))
    }

    try {
      const res = await this._provider.query(sql, params)
      return res
    } catch (ex) {
      this.emit('error', ex)
      throw ex
    }
  }

  async query(sql, params) {
    if (sql instanceof Statement) {
      const ps = {}
      const ast = sql.ast
      sql = this._compile(ast, ps, null, ['$select', '$update', '$insert', '$delete'], 'not support statment')
      const res = await this._query(sql, ps)
      return res
    }
    const res = await this._query(...arguments)
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

  async trans(handler, isolationLevel) {
    let canceled = false
    const trans = await this._provider.trans()
    const abort = async function () {
      canceled = true
      await trans.rollback()
    }
    const executor = new Executor(trans, this._options)
    // TODO: 今天做到这里
    executor.on('command', cmd => this.emit('command', cmd))
    executor.on('error', cmd => this.emit('error', cmd))
    try {
      const res = await handler(executor, abort)
      if (!canceled) {
        await trans.commit()
      }
      return res
    } catch (ex) {
      if (!canceled) {
        await trans.rollback()
      }
      throw ex
    }
  }
}

module.exports = {
  Executor
}
