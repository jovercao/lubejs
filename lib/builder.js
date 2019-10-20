/**
 * 查询条件/查询语句构建器模块
 */

const _ = require('lodash')
const assert = require('assert')

/**
 * 获取AST对象的ast内容
 * @param {*} obj
 * @returns
 */
function ast(obj) {
  if (!obj || !(obj instanceof AST)) return obj
  return obj.ast
}

function astType(ast, defaultType) {
  assert(_.isPlainObject(ast), 'ast必须为object类型')
  const keys = Object.keys(ast)
  if (keys.length === 1) {
    return keys[0]
  }
  return defaultType
  // throw new Error('不是合法的ast对象')
}

function checkType(type, excepts, errMsg) {
  assert(excepts.includes(type), errMsg ? errMsg.replace(/\{type\}/g, type) : `syntax error: except ${excepts.join(',')}, but ${type} this`)
}

/**
 * 获取ast类型及值对，如果对象非标准类型，则
 * @param {*} ast
 * @param {*} defaultType
 * @returns [type, ast]
 */
function astEntry(ast, defaultType) {
  if (_.isPlainObject(ast)) {
    const entries = Object.entries(ast)
    if (entries.length === 1 && entries[0][0].startsWith('$')) {
      return entries[0]
    }
  }
  if (!defaultType) {
    throw new Error('unknow ast type, format error')
  }
  return [defaultType, ast]
}

/**
 * 将制作table的代理，用于生成字段
 * @param {*} table
 * @returns
 */
function makeAutoFieldTableProxy(table) {
  // 确保引用单一实例，不重复占用内存
  const tableAst = ast(table)
  return new Proxy(table, {
    get(target, prop) {
      const value = target[prop]
      if (!_.isUndefined(value)) {
        if (_.isFunction(value)) {
          return function(...args) {
            return value.apply(target, args)
          }
        }
        return value
      }
      if (_.isSymbol(prop) || Object.prototype.hasOwnProperty.call(target, prop)) {
        return value
      }
      return new Field(prop, tableAst)
    },
    set(target, prop, value) {
      if (Object.prototype.hasOwnProperty.call(target, prop) || target[prop] !== undefined) {
        target[prop] = value
        return
      }
      target[prop] = new AssignmentStatement(new Field(prop, tableAst), value)
      return target[prop]
    }
  })
}

function makeAutoInvokeFnProxy(fn) {
  return new Proxy(fn, {
    invoke(...params) {
      return new FnCall(fn, )
    }
  })
}

/**
 * 通过一个对象创建一个对查询条件
 * 亦可理解为：转换managodb的查询条件到 ast
 * @param {*} obj
 */
function makeObjectCondition(obj) {
  const entries = Object.entries(obj)
  const parser = function([key, value]) {
    if (key.startsWith('$')) {
      return value.map(p => makeObjectCondition(p))
    }
    const [op, exp] = astEntry(value, '$eq')
    // 比较运算
    return {
      [op]: [
        new Field(key).ast,
        ast(exp)
      ]
    }
  }

  if (entries.length > 1) {
    return new Condition({
      $and: entries.map(p => parser(p))
    })
  } else if (entries.length === 1) {
    return new Condition(parser(entries[0]))
  }
  throw new Error('involid object condition')
}

class AST {
  get ast() {
    throw new Error(`AST类 ${this.contructor.name} 请实现抽象属性 get ast`)
  }
}

// /**
//  * 检查表达式类型
//  * @param {*} obj
//  * @param {*} types
//  * @returns
//  */
// function isTypeOf(obj, types) {
//   for (const type of types) {
//     if (obj instanceof type) return true
//     if (type.is && type.is(obj)) {
//       return true
//     }
//   }
//   return false
// }

class DatabaseObject extends AST {
  constructor(name, type, schema, database) {
    super()
    this._type = type
    assert(_.isString(name), '名必须是字符串类型')
    this._name = name
    assert(!schema || _.isString(name), '架构名必须是字符串类型')
    this._schema = schema
    assert(!schema || _.isString(name), '架构名必须是字符串类型')
    this._database = database
  }

  /**
   * 值
   * @readonly
   * @memberof DatabaseObject
   */
  get ast() {
    if (!this._name) {
      throw Error('Object name is required')
    }
    let data = {
      name: this._name,
      schema: this._schema,
      database: this._database
    }
    if (this._type) {
      data = {
        [this._type]: data
      }
    }
    return data
  }
}

class Fn extends DatabaseObject {
  constructor(name, schema, database) {
    super(name, '$fn', schema, database)
  }

  call(params) {
    return new FnCall(this, params)
  }
}

class Procedure extends DatabaseObject {
  constructor(name, schema, database) {
    super(name, '$proc', schema, database)
  }

  call(params) {
    return new ProcedureCallStatement(this, params)
  }
}

/**
 * 数据库对象基类
 * @class Sets
 * @extends {AST}
 */
class Sets extends DatabaseObject {
  as(alias) {
    assert(_.isString(alias), 'alias must type of string')
    assert(!this._alias, `exists alias ${this._alias}`)
    this._alias = alias
    return makeAutoFieldTableProxy(this)
  }

  get ast() {
    const ast = super.ast
    ast[this._type].alias = this._alias
    return ast
  }
}

/**
 * SQL 语句
 * @class Statement
 */
class Statement extends AST {

}

/**
 * 查询条件类型
 */
class Condition extends AST {
  constructor(context) {
    super()
    this._ast = ast(context)
  }

  get ast() {
    return this._ast
  }

  and(condition) {
    const conditionAst = ast(condition)
    // 如果本身就是and语句，则在尾端添加条件
    if (astType(this._ast) === '$and') {
      this._ast.$and.push(conditionAst)
      return this
    }

    this._ast = {
      $and: [
        this._ast,
        conditionAst
      ]
    }
    return this
  }

  or(condition) {
    const conditionAst = ast(condition)
    // 如果本身就是or条件，则在尾端添加条件
    if (astType(this._ast) === '$or') {
      this._ast.$or.push(conditionAst)
      return this
    }
    this._ast = {
      $or: [
        this._ast,
        conditionAst
      ]
    }
    return this
  }
}

const expressionPrototype = {
  add(exp) {
    return new AdditionExpression(this, exp)
  },

  sub(exp) {
    return new SubtractionExpression(this, exp)
  },

  mul(exp) {
    return new MultiplicationExpression(this, exp)
  },

  div(exp) {
    return new DivisionExpression(this, exp)
  },

  eq(exp) {
    return new Condition({
      $eq: [
        this.ast,
        ast(exp)
      ]
    })
  },

  neq(exp) {
    return new Condition({
      $neq: [
        this.ast,
        ast(exp)
      ]
    })
  },

  lt(exp) {
    return new Condition({
      $lt: [
        this.ast,
        ast(exp)
      ]
    })
  },

  lte(exp) {
    return new Condition({
      $lte: [
        this.ast,
        ast(exp)
      ]
    })
  },

  gt(exp) {
    return new Condition({
      $gt: [
        this.ast,
        ast(exp)
      ]
    })
  },

  gte(exp) {
    return new Condition({
      $gte: [
        this.ast,
        ast(exp)
      ]
    })
  },

  like(exp) {
    return new Condition({
      $like: [
        this.ast,
        ast(exp)
      ]
    })
  },

  unlike(exp) {
    return new Condition({
      $unlike: [
        this.ast,
        ast(exp)
      ]
    })
  },

  in(values) {
    if (!_.isArray(values)) {
      values = [...arguments]
    }
    return new Condition({
      $in: [
        this.ast,
        values.map(v => ast(v))
      ]
    })
  },

  notin(values) {
    if (!_.isArray(values)) {
      values = [...arguments]
    }
    return new Condition({
      $notin: [
        this.ast,
        values.map(v => ast(v))
      ]
    })
  },

  isnull() {
    return new Condition({
      $is: [
        this.ast,
        null
      ]
    })
  },

  notnull() {
    return new Condition({
      $isnot: [
        this.ast,
        null
      ]
    })
  },
  assign(right) {
    return new AssignmentStatement(this, right)
  }
}

/**
 * 表达式基类
 * @class Expression
 * @extends {AST}
 */
class Expression extends AST {
  constructor(type, astValue) {
    super()
    this._type = type
    this._ast = ast(astValue)
  }

  get ast() {
    return {
      [this._type]: this._ast
    }
  }
}

Object.assign(Expression.prototype, expressionPrototype)

/**
 * 常量表达式
 * @class ConstanExpression
 * @extends {Expression}
 */
class ConstanExpression extends Expression {
  constructor(value) {
    super('$const', value)
  }
}

class QuotedExpression extends Expression {
  constructor(exp) {
    super('$quoted', exp)
  }
}

/**
 * 字段引用
 */
class Field extends AST {
  constructor(name, table) {
    super()
    assert(_.isString(name), '字段名表达式')
    this._name = name
    this._table = ast(table)
  }

  get name() {
    return this._name
  }

  get table() {
    return this._table
  }

  as(alias) {
    return sql.column(this, alias)
  }

  get ast() {
    return {
      $field: {
        name: this._name,
        table: this._table
      }
    }
  }
}

Object.assign(Field.prototype, expressionPrototype)

class Column extends AST {
  constructor(exp, name) {
    super()
    if (exp instanceof Field && !name) {
      this._name = exp.name
    } else {
      this._name = name
    }
    this._exp = ast(exp)
  }

  get ast() {
    const value = [
      this._exp
    ]
    if (this._name) {
      value.push(this._name)
    }
    return {
      $column: value
    }
  }
}

/**
 * 表-表达式
 * @class Table
 */
class Table extends Sets {
  constructor(name, schema) {
    super(name, '$table', schema)
  }
}

/**
 * 视图-表达式
 * @class View
 */
class View extends Sets {
  constructor(name, schema) {
    super(name, '$view', schema)
  }
}

/**
 * 加法运算表达式
 * @class AddExpression
 * @extends {OperatorExpression}
 */
class AdditionExpression extends Expression {
  constructor(...exps) {
    super('$add', exps.map(exp => ast(exp)))
  }
}

/**
 * 加法运算表达式
 * @class AddExpression
 * @extends {OperatorExpression}
 */
class SubtractionExpression extends Expression {
  constructor(...exps) {
    super('$sub', exps.map(exp => ast(exp)))
  }
}

/**
 * 加法运算表达式
 * @class AddExpression
 * @extends {OperatorExpression}
 */
class MultiplicationExpression extends Expression {
  constructor(...exps) {
    super('$mul', exps.map(exp => ast(exp)))
  }
}

/**
 * 加法运算表达式
 * @class AddExpression
 * @extends {OperatorExpression}
 */
class DivisionExpression extends Expression {
  constructor(...exps) {
    super('$div', exps.map(exp => ast(exp)))
  }
}

class SelectStatement extends Statement {
  constructor(options = {}) {
    const { table, joins, columns, where, orders, groups } = options
    super()
    if (table) this.from(table)
    if (joins) this.join(joins)
    if (columns) this.select(columns)
    if (where) this.where(where)
    if (orders) this.orderby(orders)
    if (groups) this.groupby(groups)
  }

  select(columns) {
    assert(!this._columns, 'columns已经声明')
    if (!columns || columns.length <= 0) return this
    this._columns = columns.map(c => ast(c))
    return this
  }

  top(lines) {
    assert(_.isUndefined(this._top), 'top is declared')
    this._top = lines
    return this
  }

  /**
   * 从表中查询
   * @param {*} table
   * @memberof SelectStatement
   */
  from(table) {
    assert(!this._table, 'from已经声明')
    this._table = ast(table)
    return this
  }

  /**
   * 内联接
   * @param {string|Table|View|FnCall} table
   * @param {Condition} on
   * @param {string} alias
   * @memberof SelectStatement
   */
  join(table, on, left = false) {
    if (_.isArray(table)) {
      table.forEach(({ table, on, left }) => this.join(table, on, left))
      return this
    }
    if (!this._joins) this._joins = []
    this._joins.push({
      table: ast(table),
      on: ast(on),
      left: left || false
    })
    return this
  }

  leftJoin(table, on) {
    return this.join(table, on, true)
  }

  where(condition) {
    assert(!this._where, 'where is declared')
    if (_.isPlainObject(condition)) {
      condition = makeObjectCondition(condition)
    }
    assert(condition instanceof Condition)
    this._where = ast(condition)
    return this
  }

  orderby(exp, direction = 'asc') {
    if (_.isPlainObject(exp) && arguments.length === 1) {
      Object.entries(exp).forEach(([field, dir]) => this.orderby(field, dir))
      return this
    }
    if (_.isArray(exp) && arguments.length === 1) {
      const orders = exp
      orders.forEach(order => {
        if (_.isArray(order)) {
          const [subExp, subDirection] = order
          this.orderby(subExp, subDirection)
        }
        this.orderby(order)
      })
      return this
    }
    if (!this._orders) this._orders = []
    direction = direction.toLowerCase()
    assert(['asc', 'desc'].includes(direction), 'direction 必须为 "asc" 或者 "desc"')
    this._orders.push([ast(exp), direction])
    return this
  }

  groupby(groups) {
    if (!_.isArray(groups)) {
      groups = [...arguments]
    }
    if (!this._groups) {
      this._groups = []
    }
    groups.forEach(exp => this._groups.push(ast(exp)))
    return this
  }

  offset(lines) {
    this._offset = lines
    return this
  }

  limit(lines) {
    this._limit = lines
    return this
  }

  get ast() {
    if (!this._table) {
      throw new Error('尚未选定查询表格')
    }
    if ((_.isNumber(this._offset) || _.isNumber(this._limit)) && (!this._orders || this._orders.length === 0)) {
      throw new Error('offset/limit must used with order by statement.')
    }
    return {
      $select: {
        top: this._top,
        columns: this._columns,
        table: this._table,
        joins: this._joins,
        where: this._where,
        orders: this._orders,
        groups: this._groups,
        offset: this._offset,
        limit: this._limit
      }
    }
  }
}

class InsertStatement extends Statement {
  constructor(table, values) {
    super()
    if (table) {
      this.into(table)
    }
    if (values) {
      this.values(values)
    }
  }

  into(table) {
    assert(!this._values, '已经设置过into语句')
    this._table = table
    return this
  }

  values(row) {
    assert(!this._values, '已经设声明values语句')
    this._values = {}
    for (const [key, value] of Object.entries(row)) {
      this._values[key] = ast(value)
    }
    return this
  }

  get ast() {
    return {
      $insert: {
        table: this._table,
        values: this._values
      }
    }
  }
}

class UpdateStatement extends Statement {
  constructor(table, { sets, joins, where } = {}) {
    super()
    assert(table, 'table is required by update statement')
    this._table = ast(table)
    if (sets) this.set(sets)
    if (where) this.where(where)
    if (joins) this.join(joins)
  }

  from(table) {
    assert(!this._from, 'from table已经声明')
    this._from = ast(table)
    return this
  }

  /**
   * 内联接
   * @param {string|Table|View|FnCall} table
   * @param {Condition} on
   * @param {string} alias
   * @memberof SelectStatement
   */
  join(table, on, left = false) {
    if (_.isArray(table)) {
      table.forEach(({ table, on, left }) => this.join(table, on, left))
      return this
    }
    if (!this._joins) {
      this._joins = []
    }
    this._joins.push({
      table: ast(table),
      on: ast(on),
      left: left || false
    })
    return this
  }

  leftJoin(table, on) {
    return this.join(table, on, true)
  }

  set(sets) {
    assert(!this._sets, 'set statement is declared')
    if (_.isPlainObject(sets) && arguments.length === 1) {
      this._sets = Object.entries(sets).map(([key, value]) => new AssignmentStatement(sql.field(key), value).ast)
      return this
    }

    if (arguments.length > 1 || !_.isArray(arguments[0])) {
      sets = [...arguments]
    }
    this._sets = sets.map(obj => ast(obj))

    return this
  }

  where(condition) {
    assert(!this._where, 'where clause is declared')
    if (_.isPlainObject(condition)) {
      condition = makeObjectCondition(condition)
    }
    assert(condition instanceof Condition)
    this._where = ast(condition)
    return this
  }

  _set(obj) {
    assert(_.isPlainObject(obj), 'set表达式必须是对象类型')
    for (const [field, valueExp] of Object.entries(obj)) {
      this._sets.push([field, ast(valueExp)])
    }
  }

  get ast() {
    return {
      $update: {
        table: this._table,
        from: this._from,
        joins: this._joins,
        sets: this._sets,
        where: this._where
      }
    }
  }
}

class DeleteStatment extends Statement {
  constructor(table, where) {
    super('$delete')
    this._table = ast(table)
    this._where = ast(where)
  }

  from(table) {
    assert(!this._table, 'table 已经声明')
    this._table = ast(table)
  }

  where(condition) {
    assert(!this._where, 'where 条件已经声明')
    if (_.isPlainObject(condition)) {
      condition = makeObjectCondition(condition)
    }
    assert(condition instanceof Condition, 'involid where condition')
    this._where = ast(condition)
    return this
  }

  get ast() {
    return {
      $delete: {
        where: this._where,
        table: this._table
      }
    }
  }
}

/**
 * 函数调用
 */
class FnCall extends Sets {
  constructor(fn, ...params) {
    super()
    assert(fn, 'fn is required')
    if (_.isString(fn)) {
      fn = new Fn(fn)
    }
    this._fn = ast(fn)
    this._params = params.map(p => ast(p))
  }

  get ast() {
    return {
      $fncall: {
        fn: this._fn,
        params: this._params
      }
    }
  }
}

/**
 * 函数调用
 */
class ProcedureCallStatement extends Statement {
  constructor(proc, schema, ...params) {
    super(proc, schema)
    if (_.isString(proc)) {
      proc = new Procedure(proc)
    }
    this._proc = ast(proc)
    this._params = params.map(p => ast(p))
  }

  get ast() {
    return {
      $proccall: {
        proc: this._proc,
        params: this._params
      }
    }
  }
}

class AssignmentStatement extends Statement {
  constructor(left, right) {
    super()
    assert(left, 'left value is required')
    this._left = ast(left)
    assert(!_.isUndefined(right), 'reight value is required')
    this._right = ast(right)
  }

  get ast() {
    return {
      $assign: {
        left: this._left,
        right: this._right
      }
    }
  }
}

// 混入 expression 属性，让函数调用结果也拥有表达式的特性
Object.assign(FnCall.prototype, expressionPrototype)

const sql = {
  not(condition) {
    return new Condition({
      $not: ast(condition)
    })
  },
  /**
   * 创建一个表格标识
   * @param {*} name
   * @returns
   */
  table(name) {
    return makeAutoFieldTableProxy(new Table(name))
  },
  /**
   * 视图
   * @param {*} name
   * @returns
   */
  view(name) {
    return makeAutoFieldTableProxy(new View(name))
  },
  /**
   * 函数
   * @param {*} name
   * @param {*} schema
   * @param {*} database
   * @returns
   */
  fn(name, schema, database) {
    return new Fn(name, schema, database)
  },
  proc(name, schema, database) {
    return new Procedure(name, schema, database)
  },
  /**
   * 字段引用
   * @param {*} name
   * @param {*} table
   * @returns
   */
  field(name, table) {
    return new Field(name, table)
  },
  /**
   * 常量表达式
   */
  const(value) {
    return new ConstanExpression(value)
  },
  /**
   * 括号表达式
   * @param {*} evalExp
   * @returns
   */
  quoted(evalExp) {
    return new QuotedExpression(ast(evalExp))
  },
  /**
   * 参数
   * @param {*} name
   * @param {*} value
   * @param {*} direction
   * @returns
   */
  param(name, value, direction) {
    return {
      $param: {
        name,
        value: ast(value),
        direction
      }
    }
  },

  /**
   * 创建一个列
   * @static
   * @param {string} name 名称
   * @param {*} exp 当不传递该参数时，默认为字段名
   * @returns {Column} 返回列实例
   * @memberof SQL
   */
  column(exp, name) {
    assert(_.isString(name), '列名必须为字符串')
    return new Column(exp, name)
  },

  /**
   * exists语句
   * @static
   * @param {*} select
   * @returns
   * @memberof SQL
   */
  exists(select) {
    assert(select instanceof SelectStatement, 'exists子句必须接select语句')
    return {
      $exists: ast(select)
    }
  },

  /**
   * 创建一个SELECT SQL对象
   * @static
   * @param {array} columns 列列表
   * @returns
   * @memberof SQL
   */
  select(...columns) {
    return new SelectStatement().select(columns)
  },

  /**
   * 创建一个insert SQL 对象
   * @static
   * @returns {InsertStatement} insert sql 对象
   * @memberof SQL
   */
  insert(table) {
    return new InsertStatement(table)
  },

  /**
   * 创建一个update sql 对象
   * @static
   * @param {*} ...tables
   * @param {*} sets
   * @param {*} where
   * @returns
   * @memberof SQL
   */
  update(table) {
    return new UpdateStatement(table)
  },

  /**
   * 创建一个delete SQL 对象
   * @static
   * @param {*} table
   * @param {*} where
   * @returns
   * @memberof SQL
   */
  delete(table) {
    return new DeleteStatment(table)
  },

  /**
   * 执行存储过程
   * @param {*} proc 存储过程名称
   * @param {*} params 参数列表
   * @returns
   */
  execute(proc, params) {
    return new ProcedureCallStatement(proc, params)
  },
  ast,
  checkType,
  astEntry,
  Statement,
  AST
}

module.exports = sql
