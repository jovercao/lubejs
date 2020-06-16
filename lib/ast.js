const _ = require('lodash')

const { assert, abstract } = require('./util')
const {
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
  $func,
  $proc,
  $table,
  $statement,
  $select,
  $update,
  $insert,
  $delete,
  $execute,
  $assign,
  $const,
  $field,
  $binary,
  $alias,
  $sort,
  $join,
  $quoted,
  $exists,
  $union,
} = require('./constants-new')

function normalizeWhere(where) {
  return where
}

/**
 * 推导表达式类型
 * @param {*} expr 表达式，可以是字符串，常量等
 * @param {Function} StringType 当expr是字符串类型时的构造函数
 * @param {Function} DefaultType 默认类型的构造函数，必须从Value类型继承，并仅接受一个参数的构造函数
 */
function normalizeExpression(expr, StringType = Constant, DefaultType = Constant) {
  if (expr instanceof AST) return expr
  if (expr === null || expr === undefined) return null
  if (_.isString(expr)) {
    return new StringType(expr)
  }
  return new DefaultType(expr)
}

const aliasable = {
  as(alias) {
    return new Alias(this, alias)
  }
}

/**
 * 可联接混入器
 */
const unionable = {
  union(sets) {
    return new Union(this, sets, false)
  },
  unionAll(sets) {
    return new Union(this, sets, true)
  }
}

/**
 * 集合混入
 */
const sets = {
  // 是否集合
  isSets() {
    return true
  },
  /**
   * 获取字段
   * @param {*} name
   */
  field(name) {
    return new Field(name, this)
  },
  /**
   * 所有字段
   */
  all() {
    return new Field('*', this)
  }
}

Object.assign(sets, aliasable)

// **********************************类型声明******************************************
class AST {
  constructor(type) {
    abstract(this, AST)
    this.type = type
  }
}

/**
 * 表达式基类，抽象类
 * @class Expression
 * @extends {AST}
 */
class Expression extends AST {
  constructor(type) {
    super(type)
    abstract(this, Expression)
  }
}

/**
 * 值类型表达式，拥有较多操作函数
 */
class Value extends Expression {

  add(exp) {
    return Logic.add(this, exp)
  }

  sub(exp) {
    return Logic.sub(this, exp)
  }

  mul(exp) {
    return Logic.mul(this, exp)
  }

  div(exp) {
    return Logic.div(this, exp)
  }

  eq(exp) {
    return Logic.eq(this, exp)
  }

  neq(exp) {
    return Logic.neq(this, exp)
  }

  lt(exp) {
    return Logic.lt(this, exp)
  },

  lte(exp) {
    return Logic.lte(this, exp)
  }

  gt(exp) {
    return Logic.gt(this, exp)
  },

  gte(exp) {
    return Logic.gte(this, exp)
  }

  like(exp) {
    return Logic.like(this, exp)
  },

  unlike(exp) {
    return Logic.unlike(this, exp)
  }

  in(...values) {
    return Logic.in(this, ...values)
  }

  notin(...values) {
    return Logic.notin(this, ...values)
  }

  is(value) {
    return Logic.is(this, value)
  }

  isnull() {
    return Logic.isnull(this)
  }

  notnull() {
    return Logic.notnull(this)
  }

  assign(right) {
    return new Assignment(this, right)
  }

  asc() {
    return new Sort(
      this,
      ASC
    )
  }

  desc() {
    return new Sort(
      this,
      DESC
    )
  }
}

Object.assign(Value.prototype, aliasable)

/**
 * 逻辑表达式
 */
class Logic extends Expression {
  constructor(type) {
    super(type)
    abstract(this, Logic)
  }

  and(condition) {
    condition = normalizeWhere(condition)
    return new BinaryLogic($and, this, condition)
  }

  /**
   * OR语句
   * @param {*} condition
   * @returns
   * @memberof LogicExpression
   */
  or(condition) {
    condition = normalizeWhere(condition)
    return new BinaryLogic($or, this, condition)
  }

  /**
   * 将多个查询条件合并成一个
   * @static
   * @param {*} conditions
   * @memberof LogicExpression
   */
  static and(...conditions) {
    assert(_.isArray(conditions) && conditions.length > 1, 'Conditions must type of Array & have two or more elements.')
    return conditions.reduce((previous, current, index) => {
      current = normalizeWhere(current)
      if (!previous) return current
      return new BinaryLogic($and, previous, current)
    })
  }

  static or(...conditions) {
    assert(_.isArray(conditions) && conditions.length > 1, 'Conditions must type of Array & have two or more elements.')
    return conditions.reduce((previous, current, index) => {
      current = normalizeWhere(current)
      if (!previous) return current
      return new BinaryLogic($or, previous, current)
    })
  }

  static not(condition) {
    condition = normalizeWhere(condition)
    return new UnaryLogic($not, condition)
  }

  static exists(select) {
    assert(select instanceof Select, 'exists argument must type of SelectStatment')
    return new UnaryLogic($exists, select)
  }

  static binary(operator, left, right) {
    return new BinaryLogic(operator, left, right)
  }

  static is(left, right) {
    return Logic.binary($is, left, right)
  }

  static eq(left, right) {
    return Logic.binary($eq, left, right)
  }

  static neq(left, right) {
    return Logic.binary($neq, left, right)
  }

  static lt(left, right) {
    return Logic.binary($lt, left, right)
  }

  static lte(left, right) {
    return Logic.binary($lte, left, right)
  }

  static gt(left, right) {
    return Logic.binary($gt, left, right)
  }

  static gte(left, right) {
    return Logic.binary($gte, left, right)
  }

  static like(left, right) {
    return Logic.binary($like, left, right)
  }

  static unlike(left, right) {
    return Logic.not(Logic.binary($like, left, right))
  }

  static in(exp, values) {
    if (!_.isArray(values)) {
      values = [...arguments].splice(1)
    }
    return Logic.binary($in, exp, values)
  }

  static notin(exp, ...values) {
    return Logic.not(Logic.in(exp, ...values))
  }

  static isnull(exp) {
    return Logic.binary($is, exp, null)
  }

  static notnull(exp) {
    return Logic.not(Logic.isnull(exp))
  }

  static add(left, right) {
    return new BinaryExpression($add, left, right)
  }

  static sub(left, right) {
    return new BinaryExpression($sub, left, right)
  }

  static mul(left, right) {
    return new BinaryExpression($mul, left, right)
  }

  static div(left, right) {
    return new BinaryExpression($div, left, right)
  }
}

/**
 * 排序信息项
 */
class Sort extends AST {
  constructor(expr, direct = ASC) {
    super($sort)
    this.expr = normalizeExpression(expr)
    this.direct = direct
  }
}

/**
 * 联接查询
 * @class Join
 * @extends {AST}
 */
class Join extends AST {
  /**
   * 创建一个表关联
   * @param {Table|string|Invoke} table
   * @param {Logic} on 关联条件
   * @param {boolean} left 是否左联接
   * @field
   */
  constructor(table, on, left = false) {
    super($join)
    /**
    * @description {Table} 关联表
    * @field
    */
    this.table = normalizeExpression(table, Table)
    /**
    * @description {Logic} 关联条件
    * @field
    */
    this.on = on

    /**
     * @description {boolean} 是否左联接
     * @field
     */
    this.left = left
  }
}

/**
 * 别名表达式
 */
class Alias extends Expression {
  constructor(expr, alias) {
    super($alias)
    assert(expr instanceof AST, 'The alias must type of string')
    assert(_.isString(alias), 'The alias must type of string')
    this.expr = expr
    this.alias = alias
  }
}

class SchemaObject extends Expression {
  constructor(type, name, schema, database) {
    super(type)
    abstract(this, SchemaObject)
    assert(name, 'The name must not be null')
    assert(_.isString(name), 'Then name must type of string')
    this.name = name
    assert(!schema || _.isString(schema), 'The schema must type of string')
    this.schema = schema
    assert(!database || _.isString(database), 'The database must type of string')
    this.database = database
  }
}

/**
 * 调用执行表达式
 */
class Invoke extends Expression {
  constructor(func, params) {
    super($execute)
    assert(func instanceof SchemaObject, 'context must type of SchemaObject')
    this.func = func
    this.params = params
  }
}

/**
 * 函数
 */
class Function extends SchemaObject {
  constructor(name, schema, database) {
    assert(schema, 'schema is required for fn')
    super($func, name, schema, database)
  }

  invoke(...params) {
    return new Invoke(this, params)
  }
}

/**
 * 存储过程
 */
class Procedure extends SchemaObject {
  constructor(name, schema, database) {
    super($proc, name, schema, database)
  }

  exec(...params) {
    // 亦可直接传数组
    if (params.length === 1 && _.isArray(params[0])) {
      params = params[0]
    }
    return new Execute(this, params)
  }
}

/**
 * SQL 语句
 * @class Statement
 */
class Statement extends AST {
  constructor(expr) {
    super($statement)
    this.expr = expr
  }
}

/**
 * 行为表达式
 */
class Action extends Expression {

}

/**
 * CASE 语句
 */
class Case extends Expression {
  constructor(condition, affirm, defaults) {
    super()
    this._condition = ast(condition)
    this._affirm = ast(affirm)
    this._defaults = ast(defaults)
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

/**
 * 括号()引用
 */
class Quoted extends Expression {
  constructor(expr) {
    super($quoted)
    this.expr = expr
  }
}

/**
 * 字段引用
 */
class Field extends Value {
  constructor(name, table) {
    super($field)
    assert(_.isString(name), 'Field name must type of string')
    this.name = name
    assert(table instanceof Table)
    this.table = table
  }
}

/**
 * 表-表达式
 * @class Table
 */
class Table extends SchemaObject {
  constructor(name, schema) {
    super(name, $table, schema)
  }
}

Object.assign(Table.prototype, sets)

/**
 * 二元运算表达式
 */
class BinaryExpression extends Value {
  constructor($operator, left, right) {
    super($binary)
    assert(left, 'Left must not null')
    assert(right, 'Right must not null')
    assert($operator, 'Operator must not null')
    this.operator = $operator
    this.left = left
    this.right = right
  }
}

/**
 * 二元逻辑运算表达式
 */
class BinaryLogic extends Logic {
  constructor($operator, left, right) {
    super()
    assert(left, 'Left must not null')
    assert(right, 'Right must not null')
    assert($operator, 'Operator must not null')
    this.operator = $operator
    this.left = left
    this.right = right
  }
}

/**
 * 一元逻辑运算表达式（not, exists）
 */
class UnaryLogic extends Logic {
  constructor($operator, expr) {
    super($unary)
    this.operator = $operator
    this.expr = expr
  }
}

class Exists extends Logic {

}

/**
 * SELECT查询
 * @class Select
 * @extends {Action}
 */
class Select extends Action {
  /**
   *
   * @param {object} options
   * @param {Table[]} options.tables 待查询表
   * @param {number} options.top top行数
   * @param {number} options.offset 偏移行数
   * @param {number} options.limit 限定行数
   * @param {boolean} options.distinct 去重
   * @param {Expression[]} options.columns 选择的列
   * @param {Join[]} options.joins 选择的列
   *
   */
  constructor({ tables, top, joins, distinct, columns, offset, limit, where, orderBy, groupBy }) {
    super($select)
    if (tables) this.from(tables)
    if (joins) this.joins = joins
    if (columns) this.select(...columns)
    if (where) this.where(where)
    if (orderBy) this.orderBy(orderBy)
    if (groupBy) this.groupBy(groupBy)
    if (distinct) this.distinct()
    if (top) this.top(top)
    if (offset) this.offset(offset)
    if (limit) this.offset(limit)
  }

  /**
   * 选择列
   * @param {Expression[]} columns
   * @returns
   * @memberof Select
   */
  select(...columns) {
    assert(!this.columns, 'columns is declared')
    if (columns.length === 1 && _.isPlainObject(columns[0])) {
      this.columns = Object.entries(columns).map(([alias, expr]) => new Alias(normalizeExpression(expr, Field), alias))
      return this
    }
    this.columns = columns.map(expr => normalizeExpression(expr, Field))
    return this
  }

  distinct() {
    this.distinct = true
    return this
  }

  top(rows) {
    assert(_.isUndefined(this.top), 'top is declared')
    this.top = rows
    return this
  }

  /**
   * 从表中查询，可以查询多表
   * @param {*} tables
   * @memberof Select
   */
  from(...tables) {
    // assert(!this.from, 'from已经声明')
    this.from = tables.map(table => _.isString(table) ? new Table(table) : table)
    return this
  }

  /**
   * 表联接
   * @param {string|Table|Invoke} table
   * @param {Logic} on
   * @param {boolean} left
   * @memberof Select
   */
  join(table, on, left = false) {
    assert(this.from, 'join must after from clause')
    if (!this.joins) this.joins = []
    this.joins.push(new Join(table, on, left))
    return this
  }

  /**
   * 左联接
   * @param {Table|string|Invoke} table
   * @param {*} on
   */
  leftJoin(table, on) {
    return this.join(table, on, true)
  }

  /**
   * where查询条件
   * @param {*} condition
   */
  where(condition) {
    assert(!this.where, 'where is declared')
    if (_.isPlainObject(condition)) {
      condition = normalizeWhere(condition)
    }
    assert(condition instanceof Logic)
    this.where = condition
    return this
  }

  /**
   * order by 排序
   * @param {Array<String|Expression|Sort> | Object} sorts 排序信息
   */
  orderBy(...sorts) {
    // assert(!this.orders, 'order by clause is declared')
    assert(sorts.length > 0, 'must have one or more order basis')
    // 如果传入的是对象类型
    if (sorts.length === 1 && _.isPlainObject(sorts[0])) {
      this.orderBy = Object.entries(sorts).map(([expr, direction]) => new Sort(expr, direction))
    } else {
      this.orderBy = sorts.map(expr => expr instanceof AST ? expr : normalizeExpression(expr, Field))
    }
    return this
  }

  /**
   * 分组查询
   * @param {*} groups
   */
  groupBy(...groups) {
    this.groupBy = groups.map(expr => normalizeExpression(expr))
    return this
  }

  /**
   * Having 子句
   * @param {Logic} condition
   */
  having(condition) {
    assert(!this.having, 'having is declared')
    if (!(condition instanceof Logic)) {
      condition = normalizeWhere(condition)
    }
    this.having = condition
    return this
  }

  /**
   * 偏移数
   * @param {Number} rows
   */
  offset(rows) {
    this.offset = rows
    return this
  }

  /**
   * 限定数
   * @param {Number} rows
   */
  limit(rows) {
    assert(_.isNumber(rows))
    this.limit = rows
    return this
  }

  /**
   * 将本SELECT当作值返回
   * @returns {Quoted} 返回一个加()后的SELECT语句
   */
  asValue() {
    return new Quoted(this)
  }
}

Object.assign(Select.prototype, unionable)

class Union extends Action {
  constructor(left, right, all) {
    super($union)
    this.left = left
    this.right = right
    this.all = all
  }
}

Object.assign(Union.prototype, unionable)

class Insert extends Action {
  constructor({ table, fields, values }) {
    super($insert)
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
    const isSelectStatement = !isOneObject && !isMultiArray && !isMultiObject && rows instanceof SelectAction

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

class Update extends Action {
  constructor({ table, sets, joins, where } = {}) {
    super($update)
    if (table) this.from(table)
    if (sets) this.set(sets)
    if (where) this.where(where)
    if (joins) this.join(joins)
  }

  from(table) {
    assert(!this._table, 'from table已经声明')
    this._table = table
    return this
  }

  /**
   * 内联接
   * @param {string|Table|Invoke} table
   * @param {Logic} on
   * @param {string} alias
   * @memberof Select
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
      condition = normalizeWhere(condition)
    }
    assert(condition instanceof Logic)
    this._where = ast(condition)
    return this
  }

  get ast() {
    assert(this._table, 'table is required by update statement')
    assert(this._sets, 'table is required by update statement')
    return {
      [$update]: {
        table: ast(this._table),
        joins: this._joins,
        sets: this._sets,
        where: this._where
      }
    }
  }
}

class Delete extends Action {
  constructor({ table, where, joins }) {
    super($delete)
    if (table) this.from(table)
    if (joins) this.join(joins)
    if (where) this.where(where)
  }

  from(table) {
    assert(!this.table, 'table 已经声明')
    this.table = table
  }

  /**
   * 内联接
   * @param {string|Table|Invoke} table
   * @param {Logic} on
   * @param {string} alias
   * @memberof Select
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
      condition = normalizeWhere(condition)
    }
    assert(condition instanceof Logic, 'involid where condition')
    this._where = ast(condition)
    return this
  }

  get ast() {
    assert(this.table, 'table is required by update statement')
    return {
      [$delete]: {
        where: this._where,
        table: this.table,
        joins: this._joins
      }
    }
  }
}

/**
 * 存储过程执行
 */
class Execute extends Action {
  constructor(proc, ...params) {
    super($execute)
    this.proc = proc
    this.params = params
  }
}

/**
 * 赋值表达式
 */
class Assignment extends BinaryExpression {
  constructor(left, right) {
    super($assign, left, right)
  }
}

// class Declare extends AST {
//   constructor(name, dataType) {
//     super($declare)
//     this.name = name
//     this.dataType = dataType
//   }
// }

// /**
//  * 变量引用
//  */
// class Variant extends Expression {
//   constructor(name) {
//     assert(_.isString(name), 'name must type of string')
//     super($var, name)
//   }
// }

class Parameter extends Expression {
  constructor(name, dataType, value, direction = INPUT) {
    super($param)
    assert(name && _.isString(name), 'Parameter name must type of string, and not allow empty.')
    assert(!direction || [INPUT, OUTPUT].includes(direction), 'direction must one of INPUT/OUTPUT')

    assert(!(value instanceof AST), 'The value is only allowed passed by javascript datatype who is compatibled with database.')

    this.name = name
    this.dataType = dataType
    this.value = value
    this.direction = direction
  }
}

const AllField = new Field('*')

module.exports = {
  AST,
  Expression,
  Logic,
  SchemaObject,
  Field,
  Table,
  Function,
  Procedure,
  Func: Function,
  Proc: Procedure,
  Statement,
  Select,
  Insert,
  Update,
  Delete,
  Execute,
  Invoke,
  Assignment,
  Constant,
  Quoted,
  Parameter,
}
