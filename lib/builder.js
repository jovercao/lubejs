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
  return obj ? (obj.ast || obj) : obj
}

function astType(exp) {
  const keys = Object.keys(exp)
  if (keys.length === 1) {
    return keys[0]
  }
  return '$and'
}

/**
 * 将制作table的代理，用于生成字段
 * @param {*} table
 * @returns
 */
function makeTableProxy(table) {
  return new Proxy(table, {
    get(target, prop) {
      if (target.hasOwnProperty(prop) || target[prop] !== undefined) {
        return target[prop]
      }
      return new Field(prop, target.alias || target.name)
    }
  })
}

/**
 * 加法
 * @param {*} exps
 * @returns
 */
function add(...exps) {
  assert(exps.length >= 2, '加法运算符达式必须大于等于2个')
  return {
    $add: [
      ...exps.map(exp => ast(exp))
    ]
  }
}

/**
 * 减法
 * @param {*} exps
 * @returns
 */
function diff(...exps) {
  assert(exps.length >= 2, '减法运算符达式必须大于等于2个')
  return {
    $sub: [
      ...exps.map(exp => ast(exp))
    ]
  }
}

/**
 * 乘法
 * @param {*} exps
 * @returns
 */
function mul(...exps) {
  assert(exps.length >= 2, '加法运算符达式必须大于等于2个')
  return {
    $mul: [
      ...exps.map(exp => ast(exp))
    ]
  }
}

/**
 * 除法
 * @param {*} exps
 * @returns
 * @memberof Statement
 */
function div(...exps) {
  assert(exps.length >= 2, '加法运算符达式必须大于等于2个')
  return {
    $div: [
      ...exps.map(m => ast(m))
    ]
  }
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

/**
 * 数据库对象基类
 * @class Identifier
 * @extends {AST}
 */
class Identifier extends AST {

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
    return add(this, exp)
  },

  diff(exp) {
    return diff(this, exp)
  },

  mul(exp) {
    return mul(this, exp)
  },

  div(exp) {
    return div(this, exp)
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
    return new Condition({
      $in: [
        this.ast,
        values.map(v => ast(v))
      ]
    })
  },

  notin(values) {
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
  }
}

/**
 * 表达式基类
 * @class Expression
 * @extends {AST}
 */
class Expression extends AST {

}

Object.assign(Expression.prototype, expressionPrototype)

/**
 * 常量表达式
 * @class ConstanExpression
 * @extends {Expression}
 */
class ConstanExpression extends Expression {
  constructor(value) {
    super()
    this._value = value
  }

  get ast() {
    return this._value
  }
}

class QuotedExpression extends Expression {
  constructor(exp) {
    super()
    this._exp = exp
  }

  get ast() {
    return {
      $group: this._exp
    }
  }
}

/**
 * 字段引用
 */
class Field extends Expression {
  constructor(name, table) {
    super()
    assert(_.isString(name), '字段名表达式')
    this._name = name
    this._table = table
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
        table: _.isString(this._table) ? this._table : ast(this._table).name
      }
    }
  }
}

/**
 * 表-表达式
 * @class Table
 */
class Table extends Identifier {
  constructor(name, alias) {
    super()
    assert(_.isString(name), '表/视图名必须是字符串')
    this._name = name
    this._alias = alias
  }

  /**
   *名称
   * @readonly
   * @memberof Table
   */
  get name() {
    return this._name
  }

  get alias() {
    return this._alias
  }

  as(alias) {
    this._alias = alias
  }

  /**
   * 值
   * @readonly
   * @memberof Table
   */
  get ast() {
    return {
      $table: {
        name: this._name,
        alias: this._alias
      }
    }
  }
}

/**
 * 视图-表达式
 * @class View
 */
class View extends Table {
  get ast() {
    return {
      $view: {
        name: super.name,
        alias: super.alias
      }
    }
  }
}

class SelectStatement extends Statement {
  constructor({ froms, columns, where, orders, groups }) {
    super()
    this._joins = []
    this._orders = []
    if (froms) this.from(froms)
    if (columns) this.select(columns)
    if (where) this.where(where)
    if (orders) this.orderby(orders)
    if (groups) this.groupby(groups)
  }

  select(...columns) {
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
    assert(!this._columns, 'from已经声明')
    if (_.isArray(table)) {
      this.from(table[0])
      table.slice(1).forEach(({ table, on, left }) => this.join(table, on, left))
    }
    this.table = ast(table)
    return this
  }

  /**
   * 内联接
   * @param {string|Table|View|Fn} table
   * @param {Condition} on
   * @param {string} alias
   * @memberof SelectStatement
   */
  join(table, on, left = false) {
    this._joins.push({
      table: ast(table),
      on: ast(on),
      left
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
    return {
      columns: this._columns,
      table: this._table,
      joins: this._joins,
      where: this._where,
      orders: this._orders,
      groups: this._groups
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
 * 函数
 */
class Fn extends Expression {
  constructor(name, ...params) {
    super()
    this._name = name
    this._params = params.map(p => ast(p))
  }

  as(alias) {
    this._alias = alias
  }

  get ast() {
    return {
      $fn: {
        name: this._name,
        params: this._params,
        alias: this._alias
      }
    }
  }
}
// 混入 expression 属性，让函数也拥有表达式的特性
Object.assign(Fn.prototype, expressionPrototype)

const sql = {
  /**
   * 创建一个表格标识
   * @param {*} name
   * @returns
   */
  table(name) {
    return makeTableProxy(new Table(name))
  },
  /**
   * 视图
   * @param {*} name
   * @returns
   */
  view(name) {
    return makeTableProxy(new View(name))
  },
  /**
   * 函数
   * @param {*} name
   * @param {*} params
   * @returns
   */
  fn(name, params) {
    return new Fn(name, params)
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
    return [
      ast(exp),
      name
    ]
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
  }
}

module.exports = sql
