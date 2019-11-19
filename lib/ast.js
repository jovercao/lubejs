const _ = require('lodash')

const { assert, astEntryByName } = require('./util')
const {
  Types,

  ASC,
  DESC,

  INPUT,
  OUTPUT,

  $and,
  $or,
  $not,
  $is,
  $in,
  $eq,
  $neq,
  $gt,
  $gte,
  $lt,
  $lte,
  $like,
  $add,
  $sub,
  $mul,
  $div,
  $mod,
  $param,
  $var,
  $fn,
  $proc,
  $table,
  // $sysfn,
  // $exec,
  $datatype,
  $fncall,
  $syscall,
  $select,
  $update,
  $insert,
  $delete,
  $iif,
  $execute,
  $assign,
  $const,
  $field,
  $column,
  $quoted,
  $exists,
  SqlSymbolMapps
} = require('./constants')

// ******************************内部函数声明*********************************
/**
 * 获取AST对象的ast内容
 * @param {*} obj
 * @returns
 */
function ast(obj) {
  if (!obj || !(obj instanceof AST)) return obj
  return obj.ast
}

/**
 * 通过一个对象创建一个对查询条件
 * 亦可理解为：转换managodb的查询条件到 ast
 * @param {*} obj
 */
function mormalizeCondition(obj) {
  assert(_.isPlainObject(obj), 'condition must typeof `Condition` or `plain object`')
  const entries = Object.entries(obj)
  const parser = function([key, value]) {
    if (key.startsWith('$')) {
      const symbol = SqlSymbolMapps[key]
      assert(symbol, `involid symbol ${key} on conditions.`)
      if (symbol === $and || symbol === $or) {
        assert(_.isArray(value), 'Condition $and/$or must typeof Array')
        return {
          [symbol]: value.map(p => mormalizeCondition(p))
        }
      }
      if (symbol === $not) {
        return {
          [symbol]: mormalizeCondition(value)
        }
      }
    }
    let [op, exp] = astEntryByName(value, $eq)
    // 如果值是数组，自动设置为 $in查询
    if (_.isArray(value) && op === $eq) {
      op = $in
    }
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
      [$and]: entries.map(p => parser(p))
    })
  } else if (entries.length === 1) {
    return new Condition(parser(entries[0]))
  }
  throw new Error('involid object condition')
}

// **********************************类型声明******************************************
class AST {

}

AST.prototype = {
  get ast() {
    throw new Error(`AST类 ${this.contructor} 请实现抽象属性 get ast`)
  }
}

class DbObject extends AST {
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

class DataType extends AST {
  constructor(type) {
    super()
    assert(Types.includes(type), 'type must one of (STRING NUMBER DATE BOOLEAN BUFFER).')
    this._type = type
  }

  get ast() {
    return {
      [$datatype]: this._type
    }
  }
}

class Fn extends DbObject {
  constructor(name, schema, database) {
    assert(schema, 'schema is required for fn')
    super(name, $fn, schema, database)
  }

  call(...params) {
    return new FnCall(this, params)
  }
}

class Procedure extends DbObject {
  constructor(name, schema, database) {
    super(name, $proc, schema, database)
  }

  call(...params) {
    // 亦可直接传数组
    if (params.length === 1 && _.isArray(params[0])) {
      params = params[0]
    }
    return new ProcedureCallStatement(this, params)
  }
}

// /**
//  * 数据库对象基类
//  * @class Sets
//  * @extends {AST}
//  */
// class Sets extends AST {
//   get ast() {
//     const ast = super.ast
//     ast[this._type].alias = this._alias
//     return ast
//   }
// }

const setsPrototype = {
  as(alias) {
    assert(_.isString(alias), 'alias must type of string')
    assert(!this._alias, `exists alias ${this._alias}`)
    this._alias = alias
    return this
  },
  field(name) {
    return new Field(name, this)
  },
  all() {
    return new Field('*', this)
  }
}

// Object.assign(Sets.prototype, setsPrototype)

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
    if (this._ast[$and]) {
      this._ast[$and].push(conditionAst)
      return this
    }

    this._ast = {
      [$and]: [
        this._ast,
        conditionAst
      ]
    }
    return this
  }

  /**
   * OR语句
   * @param {*} condition
   * @returns
   * @memberof Condition
   */
  or(condition) {
    const conditionAst = ast(condition)
    // 如果本身就是or条件，则在尾端添加条件
    if (this._ast[$or]) {
      this._ast[$or].push(conditionAst)
      return this
    }
    this._ast = {
      [$or]: [
        this._ast,
        conditionAst
      ]
    }
    return this
  }

  /**
   * 将多个查询条件合并成一个
   * @static
   * @param {*} conditions
   * @memberof Condition
   */
  static and(...conditions) {
    assert(_.isArray(conditions) && conditions.length > 1, 'Conditions must type of Array & have two or more elements.')
    return new Condition({
      [$and]: conditions.map(p => ast(p))
    })
  }

  static or(...conditions) {
    assert(_.isArray(conditions) && conditions.length > 1, 'Conditions must type of Array & have two or more elements.')
    return new Condition({
      [$or]: conditions.map(p => ast(p))
    })
  }

  static not(condition) {
    return new Condition({
      [$not]: ast(condition)
    })
  }

  static exists(select) {
    assert(select instanceof SelectStatement, 'exists argument must type of SelectStatment')
    return new Condition({
      [$exists]: ast(select)
    })
  }
}

const expressionPrototype = {
  add(exp) {
    return new Addition(this, exp)
  },

  sub(exp) {
    return new Subtraction(this, exp)
  },

  mul(exp) {
    return new Multiplication(this, exp)
  },

  div(exp) {
    return new Division(this, exp)
  },

  eq(exp) {
    return new Condition({
      [$eq]: [
        this.ast,
        ast(exp)
      ]
    })
  },

  neq(exp) {
    return new Condition({
      [$neq]: [
        this.ast,
        ast(exp)
      ]
    })
  },

  lt(exp) {
    return new Condition({
      [$lt]: [
        this.ast,
        ast(exp)
      ]
    })
  },

  lte(exp) {
    return new Condition({
      [$lte]: [
        this.ast,
        ast(exp)
      ]
    })
  },

  gt(exp) {
    return new Condition({
      [$gt]: [
        this.ast,
        ast(exp)
      ]
    })
  },

  gte(exp) {
    return new Condition({
      [$gte]: [
        this.ast,
        ast(exp)
      ]
    })
  },

  like(exp) {
    return new Condition({
      [$like]: [
        this.ast,
        ast(exp)
      ]
    })
  },

  unlike(exp) {
    return Condition.not(this.like(exp))
  },

  in(values) {
    if (!_.isArray(values)) {
      values = [...arguments]
    }
    return new Condition({
      [$in]: [
        this.ast,
        values.map(v => ast(v))
      ]
    })
  },

  notin(values) {
    if (!_.isArray(values)) {
      values = [...arguments]
    }
    return Condition.not(new Condition({
      [$in]: [
        this.ast,
        values.map(v => ast(v))
      ]
    }))
  },

  isnull() {
    return new Condition({
      [$is]: [
        this.ast,
        null
      ]
    })
  },

  notnull() {
    return Condition.not(this.isnull())
  },
  assign(right) {
    return new AssignmentStatement(this, right)
  },
  as(name) {
    return new Column(this, name)
  },
  asc() {
    return [
      this.ast,
      ASC
    ]
  },
  desc() {
    return [
      this.ast,
      DESC
    ]
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

class IIF extends AST {
  constructor(condition, affirm, defaults) {
    super()
    this._condition = ast(condition)
    this._affirm = ast(affirm)
    this._defaults = ast(defaults)
  }

  get ast() {
    return {
      [$iif]: [this._condition, this._affirm, this._defaults]
    }
  }
}

Object.assign(IIF.prototype, expressionPrototype)

/**
 * 常量表达式
 * @class ConstanExpression
 * @extends {Expression}
 */
class Constant extends Expression {
  constructor(value) {
    super($const, value)
  }
}

class Quoted extends Expression {
  constructor(exp) {
    super($quoted, exp)
  }
}

/**
 * 字段引用
 */
class Field extends AST {
  constructor(name, table) {
    super()
    assert(_.isString(name), 'field name must type of string')
    this._name = name
    this._table = ast(table)
  }

  get name() {
    return this._name
  }

  get table() {
    return this._table
  }

  get ast() {
    return {
      [$field]: {
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
      [$column]: value
    }
  }
}

/**
 * 表-表达式
 * @class Table
 */
class Table extends DbObject {
  constructor(name, schema) {
    super(name, $table, schema)
  }

  get ast() {
    const ast = super.ast
    ast[$table].alias = this._alias
    return ast
  }
}

Object.assign(Table.prototype, setsPrototype)

/**
 * 加法运算表达式
 * @class AddExpression
 * @extends {OperatorExpression}
 */
class Addition extends Expression {
  constructor(...exps) {
    assert(exps.length >= 2, 'Addition must more then 2 params')
    super($add, exps.map(exp => ast(exp)))
  }
}

/**
 * 加法运算表达式
 * @class AddExpression
 * @extends {OperatorExpression}
 */
class Subtraction extends Expression {
  constructor(...exps) {
    assert(exps.length >= 2, 'Subtraction must more then 2 params')
    super($sub, exps.map(exp => ast(exp)))
  }
}

/**
 * 加法运算表达式
 * @class AddExpression
 * @extends {OperatorExpression}
 */
class Multiplication extends Expression {
  constructor(...exps) {
    assert(exps.length >= 2, 'Multiplication must more then 2 params')
    super($mul, exps.map(exp => ast(exp)))
  }
}

/**
 * 加法运算
 * @class AddExpression
 * @extends {OperatorExpression}
 */
class Division extends Expression {
  constructor(...exps) {
    assert(exps.length >= 2, 'Division must more then 2 params')
    super($div, exps.map(exp => ast(exp)))
  }
}

/**
 * 取模运算
 * @class AddExpression
 * @extends {OperatorExpression}
 */
class Modular extends Expression {
  constructor(...exps) {
    assert(exps.length >= 2, 'Modular must more then 2 params')
    super($mod, exps.map(exp => ast(exp)))
  }
}

const AllField = new Field('*')
class SelectStatement extends Statement {
  constructor(options = {}) {
    const { table, top, joins, distinct, columns, where, orders, groups } = options
    super()
    if (table) this.from(table)
    if (joins) this.join(joins)
    if (columns) this.columns(columns)
    if (where) this.where(where)
    if (orders) this.orderby(orders)
    if (groups) this.groupby(groups)
    if (distinct) this.distinct()
    if (top) this.top(top)
  }

  columns(columns) {
    assert(!this._columns, 'columns is declared')
    if (_.isPlainObject(columns) && arguments.length === 1) {
      this._columns = Object.entries(columns).map(([name, exp]) => new Column(exp, name).ast)
      return this
    }

    if (!_.isArray(columns)) {
      columns = [...arguments]
    }

    if (!columns || columns.length <= 0) return this
    this._columns = columns.map(c => ast(c))
    return this
  }

  distinct() {
    this._distinct = true
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
   * @param {string|Table|FnCall} table
   * @param {Condition} on
   * @param {string} alias
   * @memberof SelectStatement
   */
  join(table, on, left = false) {
    assert(this._table, 'join must after from clause')
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
      condition = mormalizeCondition(condition)
    }
    assert(condition instanceof Condition)
    this._where = ast(condition)
    return this
  }

  /**
   * order by 排序
   * @param {Array | Object} orders 兼容2种格式 [ [exp1, direct], [exp2, direct] ], { field1: 'asc', field2: 'desc' }
   */
  orderby(orders) {
    assert(!this._orders, 'order by clause is declared')
    // 单个对象
    if (arguments.length === 1 && _.isPlainObject(orders)) {
      orders = Object.entries(orders).map(([exp, dir]) => [new Field(exp), dir])
    } else if (arguments.length === 1 && _.isArray(orders)) {
      // 如果不是 [ [exp1, direct], [exp2, direct] ]， 则为传入单个排序 [exp, direct]
      if (!(orders.length > 0 && _.isArray(orders[0]))) {
        orders = [orders]
      }
    } else if (arguments.length > 1) {
      orders = [...arguments]
    }

    assert(orders.length > 0, 'must have one or more order basis')

    this._orders = orders.map(([exp, dir]) => {
      assert(!dir || [ASC, DESC].includes(dir), 'dir must one of ASC or DESC.')
      return [ast(exp), dir || ASC]
    })
    return this
  }

  /**
   * 分组查询
   * @param {*} groups
   */
  groupby(groups) {
    if (!_.isArray(groups) || arguments.length > 1) {
      groups = [...arguments]
    }
    if (!this._groups) {
      this._groups = []
    }
    groups.forEach(exp => this._groups.push(ast(exp)))
    return this
  }

  having(condition) {
    assert(!this._having, 'having is declared')
    if (!(condition instanceof Condition)) {
      condition = mormalizeCondition(condition)
    }
    this._having = ast(condition)
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

  value() {
    return new Quoted(this)
  }

  get ast() {
    // if (!this._table) {
    //   throw new Error('尚未选定查询表格')
    // }
    assert(this._columns || this._table, 'columns and table must declare one of them for select statment.')
    if ((_.isNumber(this._offset) || _.isNumber(this._limit)) && (!this._orders || this._orders.length === 0)) {
      throw new Error('offset/limit must used with order by statement.')
    }
    return {
      [$select]: {
        top: this._top,
        distinct: this._distinct,
        columns: this._columns || [AllField.ast],
        table: this._table,
        joins: this._joins,
        where: this._where,
        orders: this._orders,
        groups: this._groups,
        having: this._having,
        offset: this._offset,
        limit: this._limit
      }
    }
  }
}

class InsertStatement extends Statement {
  constructor({ table, fields, values }) {
    super()
    if (table) {
      this.into(table)
    }
    if (values) {
      this.values(values)
    }
  }

  into(table, fields) {
    assert(!this._values, '已经设置过into语句')
    this._table = ast(table)

    if (fields) {
      this.fields(fields)
    }
    return this
  }

  fields(fields) {
    if (!_.isArray(fields)) {
      fields = [...arguments]
    }
    assert(!this._fields, 'fields is declared')
    assert(fields.length > 0, 'fields not allow empty.')
    this._fields = fields.map(p => ast(p))
  }

  values(rows) {
    assert(!this._values, '已经设声明values语句')

    const isOneObject = _.isPlainObject(rows)
    const isMultiArray = !isOneObject && _.isArray(rows) && rows.length > 0 && _.isArray(rows[0])
    const isMultiObject = !isOneObject && !isMultiArray && _.isArray(rows) && rows.length > 0 && _.isPlainObject(rows[0])
    const isOneArray = !isOneObject && !isMultiArray && _.isArray(rows) && rows.length > 0 && !_.isArray(rows[0]) && !_.isPlainObject(rows[0])
    const isSelectStatement = !isOneObject && !isMultiArray && !isMultiObject && rows instanceof SelectStatement

    if (!isOneObject && !isMultiArray && !isMultiObject && !isSelectStatement) {
      throw new Error('involid rows')
    }

    if (isOneObject) {
      this._values = {}
      this.fields(Object.keys(rows))
      this._values = [Object.values(rows).map(p => ast(p))]
    }
    if (isOneArray) {
      this._values = [
        rows.map(p => ast(p))
      ]
    }
    if (isMultiArray) {
      this._values = rows.map((row) => {
        return row.map(v => ast(v))
      })
    }
    if (isMultiObject) {
      this._values = rows.map((row, index) => {
        // 如果尚未定义字段列表，则取第一行进行对象的字段定义
        if (index === 0 && !this._fields) {
          this.fields(Object.keys(row))
        }
        return this._fields.map(field => ast(row[field]))
      })
    }
    if (isSelectStatement) {
      this._values = ast(rows)
    }

    return this
  }

  get ast() {
    assert(this._table, 'table is required for insert statement.')
    assert(this._table, 'values is required for insert statement.')
    // assert(this._fields, 'fields is required for insert statment')
    return {
      [$insert]: {
        table: this._table,
        fields: this._fields,
        values: this._values
      }
    }
  }
}

class UpdateStatement extends Statement {
  constructor({ table, sets, joins, where } = {}) {
    super()
    if (table) this.from(table)
    if (sets) this.set(sets)
    if (where) this.where(where)
    if (joins) this.join(joins)
  }

  from(table) {
    assert(!this._table, 'from table已经声明')
    this._table = ast(table)
    return this
  }

  /**
   * 内联接
   * @param {string|Table|FnCall} table
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

  /**
   * 兼容2种格式，第2种格式会被编译成第1种
   * 1: [ [field, value], [field2, value]]
   * 2: { field1: value, field2: value }
   * @param {*} sets
   */
  set(sets) {
    assert(!this._sets, 'set statement is declared')
    if (_.isPlainObject(sets) && arguments.length === 1) {
      this._sets = Object.entries(sets).map(([key, value]) => [ast(new Field(key)), ast(value)])
      return this
    }

    if (arguments.length === 1 && _.isArray(sets)) {
      assert(sets.length > 0, 'set clause must have one or more element')
      // 如果传递的是单个赋值数组
      if (!_.isArray(sets[0])) {
        sets = [sets]
      }
    }
    if (arguments.length > 1) {
      sets = [...arguments]
    }

    this._sets = sets.map((s) => {
      assert(_.isArray(s), 'set element must typeof array')
      const [field, value] = s
      return [ast(field), ast(value)]
    })
    return this
  }

  where(condition) {
    assert(!this._where, 'where clause is declared')
    if (_.isPlainObject(condition)) {
      condition = mormalizeCondition(condition)
    }
    assert(condition instanceof Condition)
    this._where = ast(condition)
    return this
  }

  get ast() {
    assert(this._table, 'table is required by update statement')
    assert(this._sets, 'table is required by update statement')
    return {
      [$update]: {
        table: this._table,
        joins: this._joins,
        sets: this._sets,
        where: this._where
      }
    }
  }
}

class DeleteStatment extends Statement {
  constructor({ table, where, joins }) {
    super($delete)
    if (table) this.from(table)
    if (joins) this.join(joins)
    if (where) this.where(where)
  }

  from(table) {
    assert(!this._table, 'table 已经声明')
    this._table = ast(table)
  }

  /**
   * 内联接
   * @param {string|Table|FnCall} table
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

  where(condition) {
    assert(!this._where, 'where 条件已经声明')
    if (_.isPlainObject(condition)) {
      condition = mormalizeCondition(condition)
    }
    assert(condition instanceof Condition, 'involid where condition')
    this._where = ast(condition)
    return this
  }

  get ast() {
    assert(this._table, 'table is required by update statement')
    return {
      [$delete]: {
        where: this._where,
        table: this._table,
        joins: this._joins
      }
    }
  }
}

/**
 * 函数调用
 */
class FnCall extends AST {
  constructor(fn, params) {
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
      [$fncall]: {
        fn: this._fn,
        params: this._params
      }
    }
  }
}

Object.assign(FnCall.prototype, expressionPrototype)
FnCall.prototype.alias = setsPrototype.as

class SysFnCall extends AST {
  constructor(name, params) {
    super()
    assert(_.isString(name), 'name must type of string')
    if (params) {
      assert(_.isArray(params), 'params mast typeof array')
    }
    this._name = name
    this._params = (params || []).map(p => ast(p))
  }

  get ast() {
    return {
      [$syscall]: {
        name: this._name,
        params: this._params
      }
    }
  }
}

Object.assign(SysFnCall.prototype, expressionPrototype)

/**
 * 函数调用
 */
class ProcedureCallStatement extends Statement {
  constructor(proc, params) {
    super()
    if (_.isString(proc)) {
      proc = new Procedure(proc)
    }
    this._proc = ast(proc)
    assert(_.isArray(params), 'params must type of array')
    this._params = params.map(p => ast(p))
  }

  get ast() {
    return {
      [$execute]: {
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
      [$assign]: {
        left: this._left,
        right: this._right
      }
    }
  }
}

class Variant extends Expression {
  constructor(name) {
    assert(_.isString(name), 'name must type of string')
    super($var, name)
  }
}

class Parameter extends Expression {
  constructor(name, type, value, direction = INPUT) {
    assert(name && _.isString(name), 'Parameter name must type of string, and not allow empty.')
    assert(!direction || [INPUT, OUTPUT].includes(direction), 'direction must one of INPUT/OUTPUT')

    assert(!(value instanceof AST), 'The value is only allowed passed by javascript datatype who is compatibled with database.')
    super($param, {
      name,
      value: ast(value),
      direction,
      type
    })
  }

  /**
   * 输出参数的值可以在此处读取
   *
   * @memberof Parameter
   */
  get value() {
    return this._ast.value
  }

  set value(val) {
    this._ast.value = val
  }
}

// 混入 expression 属性，让函数调用结果也拥有表达式的特性
Object.assign(FnCall.prototype, expressionPrototype)

module.exports = {
  AST,
  Expression,
  Addition,
  Subtraction,
  Multiplication,
  Modular,
  Division,
  Condition,
  DbObject,
  Field,
  Table,
  Column,
  Fn,
  Procedure,
  DataType,
  Statement,
  SelectStatement,
  InsertStatement,
  UpdateStatement,
  DeleteStatment,
  FnCall,
  ProcedureCallStatement,
  AssignmentStatement,
  Constant,
  Quoted,
  Variant,
  Parameter,
  SysFnCall,
  IIF
}
