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

function checkType(ast, excepts, errMsg) {
  const valid = excepts.find(p => ast instanceof p)
  if (!valid) {
    throw new Error(errMsg)
  }
  return ast.ast
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
      if (_.isSymbol(prop) || Object.prototype.hasOwnProperty.call(target, prop) || target[prop] !== undefined) {
        return target[prop]
      }
      return new Field(prop, tableAst)
    },
    set(target, prop, value) {
      if (Object.prototype.hasOwnProperty.call(target, prop) || target[prop] !== undefined) {
        return target[prop] = value
      }
      return new AssignStatement(new Field(prop, tableAst), value)
    }
  })
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

/**
 * 数据库对象基类
 * @class Sets
 * @extends {AST}
 */
class Sets extends DatabaseObject {
  as(alias) {
    return makeAutoFieldTableProxy(sql.named(this, alias))
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
    return new AssignStatement(this, right)
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
    return sql.named(this, alias)
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
    this._joins = []
    this._orders = []
    if (table) this.from(table)
    if (joins) this.join(joins)
    if (columns) this.select(columns)
    if (where) this.where(where)
    if (orders) this.orderby(orders)
    if (groups) this.groupby(groups)
  }

  select(columns) {
    assert(!this._columns, 'columns已经声明')
    this._columns = columns.map(c => ast(c))
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
   * @param {string|Table|View|CallFn} table
   * @param {Condition} on
   * @param {string} alias
   * @memberof SelectStatement
   */
  join(table, on, left = false) {
    if (_.isArray(table)) {
      table.forEach(({ table, on, left }) => this.join(table, on, left))
      return this
    }

    this._joins.push({
      table: ast(table),
      on: ast(on),
      left: left || false
    })
    return this
  }

  leftJoin(table, on) {
    this._joins.push({
      table: ast(table),
      on: ast(on),
      left: true
    })
    return this
  }

  where(condition) {
    assert(!this._where, 'where已经声明')
    this._where = ast(condition)
    return this
  }

  orderby(exp, direction) {
    assert(!this._columns, 'from已经声明')

    if (_.isArray(exp)) {
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
    direction = direction.toLowerCase()
    assert(['asc', 'desc'].includes(direction), 'direction 必须为 "asc" 或者 "desc"')
    this._orders.push([ast(exp), direction])
    return this
  }

  groupby(exp) {
    if (_.isArray(exp)) {
      const exps = exp
      exps.forEach(exp => this._groups.push(ast(exp)))
      return this
    }

    this._groups.push(ast(exp))
    return this
  }

  get ast() {
    if (!this._columns) {
      throw new Error('未选定列')
    }
    if (!this._table) {
      throw new Error('尚未选定查询表格')
    }
    return {
      $select: {
        columns: this._columns,
        table: this._table,
        joins: this._joins,
        where: this._where,
        orders: this._orders,
        groups: this._groups
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
  constructor(table, sets, where) {
    super()
    this._table = ast(table)
    this._sets = ast(sets)
    this._where = ast(where)
  }

  from(table) {
    assert(!this._table, 'from table已经声明')
    this._table = ast(table)
  }

  set(...sets) {
    if (_.isArray(sets)) {
      this._sets = sets.map(obj => this.set(obj))
    }
    if (!this._sets) {
      this._sets = []
    }

    throw new Error('类型不正确')
  }

  where(condition) {
    assert(!this._where, 'where 条件已经声明')
    this._where = ast(condition)
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
class CallFn extends Sets {
  constructor(name, schema, ...params) {
    super('$callfn', name, schema)
    this._params = params.map(p => ast(p))
  }

  get ast() {
    const ast = super.ast
    ast.params = this._params
    return ast
  }
}

class AssignStatement extends Statement {
  constructor(left, right) {
    assert(left, 'left value is required')
    this._left = ast(left)
    assert(right, 'reight value is required')
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
Object.assign(CallFn.prototype, expressionPrototype)

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
   * @param {*} params
   * @returns
   */
  fn(name, params) {
    return new CallFn(name, params)
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
  named(exp, name) {
    assert(_.isString(name), '列名必须为字符串')
    return {
      $named: [
        ast(exp),
        name
      ]
    }
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
  select(columns) {
    if (arguments.length > 1) {
      columns = [...arguments]
    }
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
   * @param {*} table
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
    return {
      $execute: {
        proc,
        params: params.map(p => ast(p))
      }
    }
  },
  ast,
  astType,
  astEntry,
  Statement,
  AST
}

module.exports = sql
