const _ = require('lodash')
const { assert } = require('./util')
const { EventEmitter } = require('events')
const { insert, select, update, del, all, proc } = require('./builder')
const { INPUT } = require('./constants')
const { Statement, SelectStatement, UpdateStatement, DeleteStatment } = require('./ast')

class Executor extends EventEmitter {
  /**
   * SQL执行器
   * @param {*} query 查询函数
   * @param {*} compiler 编译函数
   */
  constructor(query, compiler, isTrans = false) {
    super()
    // 是否启用严格模式，避免关键字等问题
    this._query = query
    this._compile = (...args) => compiler.compile(...args)
    this._ployfill = compiler.ployfill
    this._compiler = compiler
    this._isTrans = isTrans
  }

  get isTrans() {
    return this._isTrans
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
          total += this._ployfill.properParameter(name)
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
    // 如果是单行，则添加到数组中
    if (_.isPlainObject(rows) || (_.isArray(rows) && !_.isObject(rows[0]) && !_.isArray(rows[0]))) rows = [rows]

    let pos = 0
    let rowsAffected = 0
    while (pos <= rows.length - 1) {
      const end = Math.min(pos + 1000, rows.length)
      const toInsert = rows.slice(pos, end)
      pos = end
      const sql = insert(table)
      if (fields) sql.fields(fields)
      sql.values(toInsert)
      const res = await this.query(sql)
      rowsAffected += res.rowsAffected
    }
    return rowsAffected
  }

  /**
   * 执行并返回第一行
   * @param {*} sql
   * @memberof Executor
   */
  async first(sql) {
    if (_.isString(sql)) {
      if (!sql.trimStart().substr(0, 6).toUpperCase().startsWith('SELECT')) {
        throw new Error('Sql statement type error, must SELECT sql.')
      }
    }
    if (!(sql instanceof SelectStatement)) {
      throw new Error('Sql statement type error, must type of SelectStatment')
    }
    return (await this.query(sql)).rows[0]
  }

  /**
   * 执行并返回第一行第一列的标量值
   * @param {*} sql
   * @memberof Executor
   */
  async scalar(sql) {
    const row = await this.first(sql)
    if (row) {
      return Object.values(row)[0]
    }
  }

  /**
   * 查找表的数据
   * @param {*} table
   * @param {*} fields
   * @param {*} where
   * @returns
   * @memberof Executor
   */
  async find(table, fields, where) {
    let sql
    if (table instanceof SelectStatement) {
      sql = table
    } else {
      if (arguments.length < 3) {
        where = fields
        fields = all()
      }
      sql = select(fields).top(1).from(table).where(where)
    }
    const res = await this.query(sql)
    if (res.rows && res.rows.length > 0) {
      return res.rows[0]
    }
    return null
  }

  async select(table, { where, groups, orders, offset, limit, columns } = {}) {
    let sql
    if (table instanceof SelectStatement) {
      sql = table
    } else {
      sql = select().from(table)
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
    }
    const res = await this.query(sql)
    return res.rows
  }

  async update(table, sets, where) {
    let sql
    if (table instanceof UpdateStatement) {
      sql = table
    } else {
      sql = update(table).set(sets)
      if (where) sql.where(where)
    }
    const res = await this.query(sql)
    return res.rowsAffected
  }

  async delete(table, where) {
    let sql
    if (table instanceof DeleteStatment) {
      sql = table
    } else {
      sql = del(table)
      if (where) sql.where(where)
    }
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
