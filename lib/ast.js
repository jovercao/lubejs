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
    return new CompareCondition(op, new Field(key).ast, exp)
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
  constructor(type) {
    this.type = type
  }
}

class DbObject extends AST {
  constructor(name, type, schema, database) {
    super(type)
    assert(_.isString(name), '名必须是字符串类型')
    this.name = name
    assert(!schema || _.isString(name), '架构名必须是字符串类型')
    this.schema = schema
    assert(!schema || _.isString(name), '架构名必须是字符串类型')
    this.database = database
  }

  get fullname() {
    if (this.database) {
      return `${this.database}.${this.schema || ''}.${this.name}`
    }
    if (this.schema) {
      return `${this.schema}.${this.name}`
    }
    return this.name
  }
}

class DataType extends AST {
  constructor(dataType) {
    super($datatype)
    assert(Types.includes(dataType), 'type must one of (STRING NUMBER DATE BOOLEAN BUFFER).')
    this.dataType = dataType
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

const rowsetMixin = {
  get isRowset() {
    return true
  },
  as(alias) {
    assert(_.isString(alias), 'alias must type of string')
    assert(!this.alias, `exists alias ${this._alias}`)
    this.alias = alias
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

  and(condition) {
    // 如果本身就是and语句，则在尾端添加条件
    if (this.type === AndCondition) {
      this.push(condition)
      return this
    }

    return new AndCondition(this, condition)
  }

  /**
   * OR语句
   * @param {*} condition
   * @returns
   * @memberof Condition
   */
  or(condition) {
    // 如果本身就是and语句，则在尾端添加条件
    if (this.type instanceof OrCondition) {
      this.push(condition)
      return this
    }

    return new OrCondition(this, condition)
  }

  /**
   * 将多个查询条件合并成一个
   * @static
   * @param {*} conditions
   * @memberof Condition
   */
  static and(...conditions) {
    return new AndCondition(...conditions)
  }

  static or(...conditions) {
    return OrCondition(...conditions)
  }

  static not(condition) {
    return new NotCondition(condition)
  }

  static exists(select) {
    return new ExistsCondition(select)
  }
}

class AndCondition extends Condition {
  constructor(...conditions) {
    assert(conditions.length >= 2, 'And condition must have more than or equals 2 conditions.')
    super($and)
    this.conditions = conditions
  }

  push(condition) {
    this.conditions.push(condition)
  }
}

class OrCondition extends Condition {
  constructor(...conditions) {
    assert(conditions.length >= 2, 'Or condition must have more than or equals 2 conditions.')
    super($or)
    this.conditions = conditions
  }

  push(condition) {
    this.conditions.push(condition)
  }
}

class NotCondition extends Condition {
  constructor(condition) {
    super($not)
    this.condition = condition
  }
}

class CompareCondition extends Condition {
  constructor(operator, ...expressions) {
    super($compare)
    this.operator = operator
    this.expressions = expressions
  }
}

class ExistsCondition extends Condition {
  constructor(selectStatement) {
    super($exists)
    this.select = selectStatement
  }
}

const expressionMixin = {
  get isExpression() {
    return true
  },
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

}

Object.assign(Expression.prototype, expressionMixin)

class IIF extends Expression {
  constructor(condition, affirm, defaults) {
    super($iif)
    this.condition = ast(condition)
    this.affirm = ast(affirm)
    this.defaults = ast(defaults)
  }
}

/**
 * 常量表达式
 * @class ConstanExpression
 * @extends {Expression}
 */
class Constant extends Expression {
  constructor(value) {
    super($const)
    this.value = value
  }
}

class Quoted extends Expression {
  constructor(expression) {
    super($quoted)
    this.expression = expression
  }
}

/**
 * 字段引用
 */
class Field extends Expression {
  constructor(name, table) {
    if (_.isString(table)) table = new Table(table)
    assert(table.isRowset, 'the argument `table` must is rowset.')
    super($field)
    this.name = name
    this.table = table
  }
}

class Column extends AST {
  constructor(expression, name) {
    super($column)
    assert(expression, 'expression must have value')
    if (expression instanceof Field && !name) {
      this.name = expression.name
    } else {
      assert(name, 'Column must have a name.')
      this.name = name
    }
    this.expression = expression
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
}

Object.assign(Table.prototype, rowsetMixin)

class OperateExpression extends Expression {
  constructor(type, ...expressions) {
    super(type)
    assert(expressions.length >= 2, 'Addition must more then 2 params')
    this.expressions = expressions
  }
}

/**
 * 加法运算表达式
 * @class AddExpression
 * @extends {OperatorExpression}
 */
class Addition extends OperateExpression {
  constructor(...expressions) {
    super($add, ...expressions)
  }
}

/**
 * 加法运算表达式
 * @class AddExpression
 * @extends {OperatorExpression}
 */
class Subtraction extends OperateExpression {
  constructor(...expressions) {
    super($sub, ...expressions)
  }
}

/**
 * 加法运算表达式
 * @class AddExpression
 * @extends {OperatorExpression}
 */
class Multiplication extends OperateExpression {
  constructor(...expressions) {
    super($mul, ...expressions)
  }
}

/**
 * 加法运算
 * @class AddExpression
 * @extends {OperatorExpression}
 */
class Division extends OperateExpression {
  constructor(...expressions) {
    super($div, ...expressions)
  }
}

/**
 * 取模运算
 * @class AddExpression
 * @extends {OperatorExpression}
 */
class Modular extends OperateExpression {
  constructor(...expressions) {
    super($mod, ...expressions)
  }
}

class SelectStatement extends Statement {
  constructor(options = {}) {
    const { table, top, joins, distinct, columns, where, orders, groups } = options
    super($select)
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
    assert(!this.$columns, 'columns is declared')
    if (_.isPlainObject(columns) && arguments.length === 1) {
      this.columns = Object.entries(columns).map(([name, exp]) => new Column(exp, name).ast)
      return this
    }

    if (!_.isArray(columns)) {
      columns = [...arguments]
    }

    if (!columns || columns.length <= 0) return this
    this.$columns = columns
    return this
  }

  distinct() {
    assert(!this.$distinct, 'distinct is declared')
    this.$distinct = true
    return this
  }

  top(lines) {
    assert(_.isUndefined(this.$top), 'top is declared')
    this.$top = lines
    return this
  }

  /**
   * 从表中查询
   * @param {*} table
   * @memberof SelectStatement
   */
  from(table) {
    assert(!this.table, 'from已经声明')
    if (_.isString(table)) table = new Table(table)
    assert(table.isRowset, 'table must is rowset.')
    this.table = table
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
    assert(this.table, 'join must after from clause')
    if (_.isString(table)) table = new Table(table)
    if (_.isArray(table)) {
      table.forEach(({ table, on, left }) => this.join(table, on, left))
      return this
    }
    if (!this.joins) this.joins = []
    this.joins.push({
      table: table,
      on: on,
      left: left || false
    })
    return this
  }

  leftJoin(table, on) {
    return this.join(table, on, true)
  }

  where(condition) {
    assert(!this.where, 'where is declared')
    if (_.isPlainObject(condition)) {
      condition = mormalizeCondition(condition)
    }
    assert(condition instanceof Condition)
    this.where = condition
    return this
  }

  /**
   * order by 排序
   * @param {Array | Object} orders 兼容2种格式 [ [exp1, direct], [exp2, direct] ], { field1: 'asc', field2: 'desc' }
   */
  orderby(orders) {
    assert(!this.orders, 'order by clause is declared')
    if (arguments.length === 1 && _.isPlainObject(orders)) {
      // orderby({ field1: ASC, field2: DESC })
      orders = Object.entries(orders).map(([exp, dir]) => [new Field(exp), dir])
    } else if (arguments.length === 1 && _.isArray(orders)) {
      // orderby([field, asc])
      if (!(orders.length > 0 && _.isArray(orders[0]))) {
        orders = [orders]
      }
      // 否则： orders([ [field1, ASC], [field2, DESC]])
    } else if (_.isString(orders) || orders instanceof Field || orders instanceof Field) {
      // orderby(field, asc)
      assert(arguments.length <= 2, 'Overload `orderby(field, asc)` must have 1 or 2 arguments')
      let field = orders
      if (_.isString(field)) {
        field = new Field(field)
      }
      orders = [field, arguments[1] || ASC]
    } else if (arguments.length > 1) {
      // orderby([field, ASC], [field, DESC])
      orders = [...arguments]
    }

    assert(orders.length > 0, 'must have one or more order basis')
    orders.map(([exp, dir]) => {
      assert(exp.isExpression, 'order by must expression')
      assert(!dir || [ASC, DESC].includes(dir), 'dir must one of ASC or DESC.')
      return [exp, dir]
    })
    this.orders = orders
    return this
  }

  /**
   * 分组查询
   * @param {*} groups
   */
  groupby(groups) {
    if (!_.isArray(groups) || arguments.length > 1) {
      // groupby(field1, field2, field3)
      groups = [...arguments]
    }
    groups.forEach(g => assert(g.isExpression, 'groups must is expression'))
    this.groups = groups
    return this
  }

  having(condition) {
    assert(!this.having, 'having is declared')
    if (!(condition instanceof Condition)) {
      condition = mormalizeCondition(condition)
    }
    this.having = condition
    return this
  }

  offset(lines) {
    assert(this.offset === undefined, 'offset is declared.')
    this.offset = lines
    return this
  }

  limit(lines) {
    assert(this.limit === undefined, 'limit is declared.')
    this.limit = lines
    return this
  }

  value() {
    return new Quoted(this)
  }

  valid() {
    // if (!this._table) {
    //   throw new Error('尚未选定查询表格')
    // }
    assert(this.columns || this.table, 'columns and table must declare one of them for select statment.')
    if ((_.isNumber(this.offset) || _.isNumber(this._limit)) && (!this.orders || this.orders.length === 0)) {
      throw new Error('offset/limit must used with order by statement.')
    }
    return true
  }
}

class InsertStatement extends Statement {
  constructor({ table, fields, values }) {
    super($insert)
    if (table) {
      this.into(table)
    }
    if (values) {
      this.table(values)
    }
  }

  into(table, fields) {
    assert(!this.table, 'Into table is declared')
    if (_.isString(table)) table = new Table(table)
    assert(table instanceof Table, 'table must type of Table')
    this.table = table

    if (fields) {
      this.fields(fields)
    }
    return this
  }

  columns(fields) {
    assert(!this.fields, 'fields is declared')
    assert(fields.length > 0, 'fields not allow empty.')
    if (!_.isArray(fields)) {
      fields = [...arguments]
    }
    this.fields = fields.map(field => {
      if (_.isString(field)) {
        field = new Field(field)
      } else {
        assert(field instanceof Field, 'Element field must type of Field or string')
      }
      return field
    })
  }

  values(rows) {
    assert(!this.values, 'values is declared')

    const isOneObject = _.isPlainObject(rows)
    const isMultiArray = !isOneObject && _.isArray(rows) && rows.length > 0 && _.isArray(rows[0])
    const isMultiObject = !isOneObject && !isMultiArray && _.isArray(rows) && rows.length > 0 && _.isPlainObject(rows[0])
    const isOneArray = !isOneObject && !isMultiArray && _.isArray(rows) && rows.length > 0 && !_.isArray(rows[0]) && !_.isPlainObject(rows[0])
    const isSelectStatement = !isOneObject && !isMultiArray && !isMultiObject && rows instanceof SelectStatement

    if (!isOneObject && !isMultiArray && !isMultiObject && !isSelectStatement) {
      throw new Error('involid rows')
    }

    if (isOneObject) {
      if (!this.fields) {
        this.columns(Object.keys(rows))
      }
      this.values = [Object.values(rows)]
    }
    // values([1, 2, 3, 4])
    if (isOneArray) {
      assert(this.fields, 'Columns declared must before at values.')
      this.values = [
        rows
      ]
    }
    // values([[1, 2, 3, 4], [2, 3, 4, 5]])
    if (isMultiArray) {
      assert(this.fields, 'Columns declared must before at values.')
      this.values = rows
    }
    // values([{ field1: 1, field2: 2}, { field1: 34, field2: 445 }])
    if (isMultiObject) {
      this.values = rows.map((row, index) => {
        // 如果尚未定义字段列表，则取第一行进行对象的字段定义
        if (index === 0 && !this.fields) {
          this.columns(Object.keys(row))
        }
        return this.fields.map(field => row[field])
      })
    }
    // 是select语句
    if (isSelectStatement) {
      this.values = rows
    }

    return this
  }

  /**
   * 语法检查
   * @returns
   * @memberof InsertStatement
   */
  valid() {
    assert(this.table, 'table is required for insert statement.')
    assert(this.table, 'values is required for insert statement.')
    return true
  }
}

class UpdateStatement extends Statement {
  constructor({ table, sets, joins, where } = {}) {
    super($update)
    if (table) this.from(table)
    if (sets) this.set(sets)
    if (where) this.where(where)
    if (joins) this.join(joins)
  }

  from(table) {
    assert(!this.table, 'from table已经声明')
    if (_.isString(table)) table = new Table(table)
    assert(table instanceof Table, 'table nust type of Table')
    this.table = table
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
    assert(this.table, 'table is required by update statement')
    assert(this._sets, 'table is required by update statement')
    return {
      [$update]: {
        table: this.table,
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

Object.assign(FnCall.prototype, expressionMixin)
FnCall.prototype.alias = rowsetMixin.as

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

Object.assign(SysFnCall.prototype, expressionMixin)

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
    return this.value.value
  }

  set value(val) {
    this.value.value = val
  }
}

// 混入 expression 属性，让函数调用结果也拥有表达式的特性
Object.assign(FnCall.prototype, expressionMixin)

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
