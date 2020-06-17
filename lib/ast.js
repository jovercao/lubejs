const _ = require('lodash')

const {
  assert,
  abstract,
  ensure,
  ensureConst,
  ensureCondition,
  ensureObject,
  ensureTable,
  ensureField,
  assertType,
  assertValue
} = require('./util')

const {
  // 排序方向
  ASC,
  DESC,
  // 参数方向
  INPUT,
  OUTPUT,
  // 比较运算符
  EQ,
  IS,
  NEQ,
  LT,
  LTE,
  GT,
  GTE,
  LIKE,
  IN,
  // 算术运算符
  ADD,
  SUB,
  MUL,
  DIV,
  MOD,
  // 逻辑运算符
  AND,
  OR,
  NOT,
  EXISTS,
  // 符号
  LOGIC,
  COMPARE,
  BINARY,
  UNARY,
  EXPR,
  COND,
  SORT,
  JOIN,
  UNION,
  TABLE,
  FIELD,
  COLUMN,
  OBJECT,
  EXEC,
  INVOKE,
  ASSIGN,
  PARAM,
  STATEMENT,
  CONST,
  WHEN,
  QUOTED,
  SELECT,
  UPDATE,
  INSERT,
  DELETE,
  COMPARE_OPERATORS,
  JS_CONSTANT_TYPES
} = require('./constants')

// **********************************类型声明******************************************
/**
 * AST 基类
 */
class AST {
  constructor() {
    abstract(this, AST)
    this.$type = []
  }

  declare(type) {
    this.$type.push(type)
  }

  get xtype() {
    return this.constructor.name
  }
}

/**
 * 表达式基类，抽象类
 * @class Expression
 * @extends {AST}
 */
class Expression extends AST {
  constructor() {
    super()
    abstract(this, Expression)
    this.declare(EXPR)
  }

  add(exp) {
    return Condition.add(this, exp)
  }

  sub(exp) {
    return Condition.sub(this, exp)
  }

  mul(exp) {
    return Condition.mul(this, exp)
  }

  div(exp) {
    return Condition.div(this, exp)
  }

  eq(exp) {
    return Condition.eq(this, exp)
  }

  neq(exp) {
    return Condition.neq(this, exp)
  }

  lt(exp) {
    return Condition.lt(this, exp)
  }

  lte(exp) {
    return Condition.lte(this, exp)
  }

  gt(exp) {
    return Condition.gt(this, exp)
  }

  gte(exp) {
    return Condition.gte(this, exp)
  }

  like(exp) {
    return Condition.like(this, exp)
  }

  unlike(exp) {
    return Condition.unlike(this, exp)
  }

  in(...values) {
    return Condition.in(this, ...values)
  }

  notin(...values) {
    return Condition.notin(this, ...values)
  }

  is(value) {
    return Condition.is(this, value)
  }

  isnull() {
    return Condition.isnull(this)
  }

  notnull() {
    return Condition.notnull(this)
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

  as(alias) {
    return new Alias(this, alias)
  }
}

/**
 * 逻辑表达式
 */
class Condition extends AST {
  constructor() {
    super()
    abstract(this, Condition)
    this.declare(COND)
  }

  and(condition) {
    condition = ensureCondition(condition)
    return new AndCondition(this, condition)
  }

  /**
   * OR语句
   * @param {*} condition
   * @returns
   * @memberof LogicCondition
   */
  or(condition) {
    condition = ensureCondition(condition)
    return new OrCondition(this, condition)
  }

  /**
   * 将多个查询条件合并成一个
   * @static
   * @param {*} conditions
   * @memberof LogicCondition
   */
  static and(...conditions) {
    assert(_.isArray(conditions) && conditions.length > 1, 'Conditions must type of Array & have two or more elements.')
    return conditions.reduce((previous, current, index) => {
      current = ensureCondition(current)
      if (!previous) return current
      return new AndCondition(previous, current)
    })
  }

  static or(...conditions) {
    assert(_.isArray(conditions) && conditions.length > 1, 'Conditions must type of Array & have two or more elements.')
    return conditions.reduce((previous, current, index) => {
      current = ensureCondition(current)
      if (!previous) return current
      return new OrCondition(previous, current)
    })
  }

  static not(condition) {
    condition = ensureCondition(condition)
    return new NotCondition(condition)
  }

  static exists(select) {
    assert(select instanceof Select, 'exists argument must type of SelectStatment')
    return new ExistsCondition(select)
  }

  static compare(left, right, operator = EQ) {
    return new CompareCondition(operator, left, right)
  }

  static is(left, right) {
    return Condition.compare(left, right, IS)
  }

  static eq(left, right) {
    return Condition.compare(left, right, EQ)
  }

  static neq(left, right) {
    return Condition.compare(left, right, NEQ)
  }

  static lt(left, right) {
    return Condition.compare(left, right, LT)
  }

  static lte(left, right) {
    return Condition.compare(left, right, LTE)
  }

  static gt(left, right) {
    return Condition.compare(left, right, GT)
  }

  static gte(left, right) {
    return Condition.compare(left, right, GTE)
  }

  static like(left, right) {
    return Condition.compare(left, right, LIKE)
  }

  static unlike(left, right) {
    return Condition.not(Condition.compare(left, right, LIKE))
  }

  static in(exp, values) {
    if (!_.isArray(values)) {
      values = [...arguments].splice(1)
    }
    return Condition.compare(exp, values, IN)
  }

  static notin(exp, ...values) {
    return Condition.not(Condition.in(exp, ...values))
  }

  static isnull(exp) {
    return Condition.compare(exp, null, IS)
  }

  static notnull(exp) {
    return Condition.not(Condition.isnull(exp))
  }

  static add(left, right) {
    return new BinaryExpression(ADD, left, right)
  }

  static sub(left, right) {
    return new BinaryExpression(SUB, left, right)
  }

  static mul(left, right) {
    return new BinaryExpression(MUL, left, right)
  }

  static div(left, right) {
    return new BinaryExpression(DIV, left, right)
  }

  static mod(left, right) {
    return new BinaryExpression(MOD, left, right)
  }
}

class LogicCondition extends Condition {
  constructor() {
    super()
    this.declare(LOGIC)
    abstract(this, LogicCondition)
  }
}

class BinaryLogicCondition extends LogicCondition {
  constructor(logic, left, right) {
    super()
    this.$logic = logic
    this.declare(BINARY)
    abstract(this, LogicCondition)
    assertType(left, [Condition], 'The argument left must typeof Condition')
    assertType(right, [Condition], 'The argument right must typeof Condition')
  }
}

class AndCondition extends BinaryLogicCondition {
  constructor(left, right) {
    super(AND, left, right)
    this.declare(AND)
  }
}

class OrCondition extends BinaryLogicCondition {
  constructor(left, right) {
    super(OR, left, right)
    this.declare(OR)
  }
}

class UnaryLogicCondition extends LogicCondition {
  constructor(logic, expr) {
    super()
    this.declare(UNARY)
    abstract(this, UnaryLogicCondition)
    this.$logic = logic
    this.$expr = expr
  }
}

/**
 * Not逻辑条件
 */
class NotCondition extends UnaryLogicCondition {
  constructor(expr) {
    super(NOT, expr)
    this.declare(NOT)
  }
}

/**
 * Exists判断条件
 */
class ExistsCondition extends UnaryLogicCondition {
  constructor(expr) {
    assertType(expr, Select, 'Exists 子句仅可接受 Select语句')
    super(EXISTS, expr)
    this.declare(EXISTS)
  }
}

/**
 * 二元逻辑运算表达式
 */
class CompareCondition extends Condition {
  constructor(operator, left, right) {
    super()
    this.declare(COMPARE)
    assert(left, 'Left must not null')
    assert(right, 'Right must not null')
    assert(operator, 'Operator must not null')
    this.$operator = operator
    this.$left = left
    this.$right = right
  }
}

/**
 * 排序信息项
 */
class Sort extends AST {
  constructor(expr, direct = ASC) {
    assertValue(direct, [ASC, DESC])
    super()
    this.declare(SORT)
    this.$expr = ensure(expr, Expression, JS_CONSTANT_TYPES, () => new Constant(expr))
    this.$direct = direct
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
   * @param {Condition} on 关联条件
   * @param {boolean} left 是否左联接
   * @field
   */
  constructor(table, on, left = false) {
    super()
    this.declare(JOIN)
    /**
    * @description {Table} 关联表
    * @field
    */
    this.$table = ensureObject(table)
    /**
    * @description {Logic} 关联条件
    * @field
    */
    this.$on = ensureCondition(on)

    /**
     * @description {boolean} 是否左联接
     * @field
     */
    this.$left = left
  }
}

/**
 * 别名表达式
 */
class Alias extends AST {
  constructor(expr, name) {
    super()
    this.declare(COLUMN)
    assert(expr instanceof AST, 'The alias must type of string')
    assert(_.isString(name), 'The alias must type of string')
    assertType(expr, [DbObject, Field, Constant, Select])
    this.$expr = expr instanceof Quoted ? expr : expr.quoted()
    this.$name = name
  }
}

class DbObject extends AST {
  constructor(name, schema, database) {
    super()
    this.declare(OBJECT)
    assert(name, 'The name must not be null')
    assert(_.isString(name), 'Then name must type of string')
    this.$name = name
    assert(!schema || _.isString(schema), 'The schema must type of string')
    this.$schema = schema
    assert(!database || _.isString(database), 'The database must type of string')
    this.$database = database
  }
}

/**
 * 调用执行表达式
 */
class Invoke extends Expression {
  constructor(func, params) {
    super()
    this.declare(INVOKE)
    assert(func instanceof Function, 'context must type of Function')
    this.$func = func
    this.$params = params
  }
}

/**
 * 函数
 */
class Function extends DbObject {
  invoke(...params) {
    return new Invoke(this, params)
  }
}

/**
 * 存储过程
 */
class Procedure extends DbObject {
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
  constructor(kind) {
    super()
    this.declare(STATEMENT)
    abstract(this, Statement)
    this.$kind = kind
  }
}

class When extends AST {
  constructor(expr, value) {
    super()
    this.declare(WHEN)
    this.$expr = ensure(expr, Expression, JS_CONSTANT_TYPES, () => new Constant(expr))
    this.$value = ensureConst(value)
  }
}

/**
 * CASE表达式
 */
class Case extends Expression {
  constructor({ expr, whens, defaults }) {
    super()
    if (whens) {
      whens.forEach(when => assertType(when, [When]))
      this.$whens = whens
    } else {
      this.$whens = []
    }
    if (expr) {
      this.case(expr)
    }
    if (defaults) {
      this.else(defaults)
    }
  }

  case(expr) {
    this.$expr = ensureConst(expr)
  }

  else(defaults) {
    this.$defaults = ensureConst(defaults)
  }

  when(expr, then) {
    this.$whens.push(
      ensure(expr, When, [Expression], () => new When(expr, then))
    )
  }
}

/**
 * 常量表达式
 * @class ConstanExpression
 * @extends {Expression}
 */
class Constant extends Expression {
  constructor(value) {
    super()
    this.declare(CONST)
    this.$value = value
  }
}

/**
 * 括号()引用
 */
class Quoted extends Expression {
  constructor(expr) {
    super()
    this.declare(QUOTED)
    /**
     * 表达式
     * @type {AST}
     */
    this.$expr = ensure(expr, Expression, JS_CONSTANT_TYPES, () => new Constant(expr))
  }
}

/**
 * 字段引用
 */
class Field extends Expression {
  constructor(name, table) {
    super()
    this.declare(FIELD)
    assert(_.isString(name), 'Field name must type of string')
    this.$name = name
    this.$table = ensure(table, Table, [String])
  }

  /**
   * 赋值表达式
   * @param {Expression} value 值
   */
  assign(value) {
    return new Assignment(this, value)
  }
}

/**
 * 表-表达式，支持字段
 * @class Table
 */
class Table extends Alias {
  /**
   * 创建一个查询表格
   * @param {*} expr 表格上下文
   */
  constructor(expr, alias = null) {
    super()
    this.declare(TABLE)
    this.$expr = ensure(expr, DbObject, [String, Select], () => {
      if (expr instanceof Select) {
        this.$readonly = true
        return expr.quoted()
      }
      return new DbObject(expr)
    })
    assert(_.isString(alias), 'The argument alias must type of string')
    this.$alias = alias
  }

  /**
   * 获取字段
   * @param {*} name
   */
  field(name) {
    return new Field(name, this)
  }

  /**
   * 所有字段
   */
  all() {
    return new Field('*', this)
  }
}

/**
 * 二元运算表达式
 */
class BinaryExpression extends Expression {
  constructor(operator, left, right) {
    super()
    this.declare(BINARY)
    assert(left, 'The argument left must not null')
    assert(right, 'The arguemnt right must not null')
    assertValue(operator, COMPARE_OPERATORS, `The argument operator must one of "${COMPARE_OPERATORS.join('|')}"`)
    this.$operator = operator
    this.$left = left
    this.$right = right
  }
}

class Union extends AST {
  constructor(select, all) {
    super()
    this.declare(UNION)
    assertType(select, Select)
    assertType(all, [Boolean])
    this.$select = select
    this.$all = all
  }
}

/**
 * SELECT查询
 * @class Select
 * @extends {Statement}
 */
class Select extends Statement {
  /**
   *
   * @param {object} options 查询选项
   * @param {Table[]} options.tables 待查询表
   * @param {number} options.top top行数
   * @param {number} options.offset 偏移行数
   * @param {number} options.limit 限定行数
   * @param {boolean} options.distinct 去重
   * @param {Expression[]} options.columns 选择的列
   * @param {Join[]} options.joins 选择的列
   * @param {Condition} options.where 查询条件
   * @param {(string|Sort|Expression)[]} options.orderBy 排序方式
   * @param {Expression[]} options.groupBy 查询条件
   */
  constructor(options) {
    const { tables, top, joins, distinct, columns, offset, limit, where, orderBy, groupBy } = options || {}
    super()
    this.declare(SELECT)
    if (tables) this.from(tables)
    if (joins) this.$joins = joins
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
    assert(!this.$columns, 'columns is declared')
    if (columns.length === 1 && _.isPlainObject(columns[0])) {
      this.$columns = Object.entries(columns).map(([alias, expr]) => new Alias(
        ensure(expr, Expression, JS_CONSTANT_TYPES, () => new Constant(expr), '选择的列'), alias)
      )
      return this
    }
    // 实例化
    this.$columns = columns.map(expr => ensure(expr, Expression, JS_CONSTANT_TYPES, () => new Constant(expr)))
    return this
  }

  distinct() {
    this.$distinct = true
    return this
  }

  top(rows) {
    assert(_.isUndefined(this.$top), 'top is declared')
    this.$top = rows
    return this
  }

  /**
   * 从表中查询，可以查询多表
   * @param {*} tables
   * @memberof Select
   */
  from(...tables) {
    // assert(!this.$from, 'from已经声明')
    this.$from = tables.map(table => ensureTable(table))
    return this
  }

  /**
   * 表联接
   * @param {string|Table|Invoke} table
   * @param {Condition} on
   * @param {boolean} left
   * @memberof Select
   */
  join(table, on, left = false) {
    assert(this.$from, 'join must after from clause')
    if (!this.$joins) {
      this.$joins = []
    }
    this.$joins.push(
      ensure(table, Join, [String], () => new Join(table, on, left))
    )
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
    assert(!this.$where, 'where is declared')
    if (_.isPlainObject(condition)) {
      condition = ensureCondition(condition)
    }
    assert(condition instanceof Condition, 'Then argument condition must type of Condition')
    this.$where = condition
    return this
  }

  /**
   * order by 排序
   * @param {Array<String|Expression|Sort> | Object} sorts 排序信息
   */
  orderBy(...sorts) {
    // assert(!this.$orders, 'order by clause is declared')
    assert(sorts.length > 0, 'must have one or more order basis')
    // 如果传入的是对象类型
    if (sorts.length === 1 && _.isPlainObject(sorts[0])) {
      this.$orderBy = Object.entries(sorts).map(([expr, direction]) => new Sort(expr, direction))
    } else {
      this.$orderBy = sorts.map(expr => ensure(expr, Sort, JS_CONSTANT_TYPES, () => new Sort(expr, ASC)))
    }
    return this
  }

  /**
   * 分组查询
   * @param {*} groups
   */
  groupBy(...groups) {
    this.$groupBy = groups.map(expr => ensure(expr, Expression, JS_CONSTANT_TYPES, () => new Constant(expr)))
    return this
  }

  /**
   * Having 子句
   * @param {Condition} condition
   */
  having(condition) {
    assert(!this.$having, 'having is declared')
    if (!(condition instanceof Condition)) {
      condition = ensureCondition(condition)
    }
    this.$having = condition
    return this
  }

  /**
   * 偏移数
   * @param {Number} rows
   */
  offset(rows) {
    this.$offset = rows
    return this
  }

  /**
   * 限定数
   * @param {Number} rows
   */
  limit(rows) {
    assert(_.isNumber(rows), 'The argument rows must type of Number')
    this.$limit = rows
    return this
  }

  /**
   * 合并查询
   * @param {*} select
   */
  union(select, all = true) {
    this.$union = new Union(select, all)
  }

  unionAll(select) {
    return this.union(select, true)
  }

  /**
   * 将本SELECT当作值返回
   * @returns {Quoted} 返回一个加()后的SELECT语句
   */
  quoted() {
    return new Quoted(this)
  }

  /**
   * 将本次查询，转换为Table行集
   */
  asTable(alias) {
    return new Table(this.quoted(), alias)
  }
}

class Insert extends AST {
  constructor({ table, fields, values }) {
    super()
    this.declare(INSERT)
    if (table) {
      this.into(table)
    }
    if (values) {
      this.values(values)
    }

    if (fields) {
      this.fields(fields)
    }
  }

  into(table, fields) {
    assert(!this.$table, 'The into clause is declared')
    this.$table = ensure(table, DbObject, [String, Table], () => {
      if (_.isString(table)) return new Table(table)
      assertType(table.expr, [DbObject])
      return table.expr
    })
    if (fields) {
      this.fields(fields)
    }
    return this
  }

  fields(...fields) {
    assert(fields.length > 0, 'fields not allow empty.')
    this.$fields = fields.map(p => ensure(p, String, [Field], () => p.name))
  }

  values(rows) {
    assert(!this.$values, '已经设声明values语句')

    const isOneObject = _.isPlainObject(rows)
    const isMultiArray = !isOneObject && _.isArray(rows) && rows.length > 0 && _.isArray(rows[0])
    const isMultiObject = !isOneObject && !isMultiArray && _.isArray(rows) && rows.length > 0 && _.isPlainObject(rows[0])
    const isOneArray = !isOneObject && !isMultiArray && _.isArray(rows) && rows.length > 0 && !_.isArray(rows[0]) && !_.isPlainObject(rows[0])
    const isSelectStatement = !isOneObject && !isMultiArray && !isMultiObject && rows instanceof Select

    if (!isOneObject && !isMultiArray && !isMultiObject && !isSelectStatement) {
      throw new Error('involid rows')
    }

    if (isOneArray || isMultiArray) {
      // if (!this.hasOwnProperty(fields)) {
      //   throw new Error('Select must sets fields first')
      // }
      if (isOneArray) rows = [rows]
      this.$values = rows.map((row) => {
        return row.map(expr => ensureConst(expr))
      })
    }
    if (isMultiObject || isOneObject) {
      if (isOneObject) rows = [rows]
      // 赋值字段列表
      if (!this.$fields) {
        const findedFields = {}
        rows.forEach(row => {
          Object.keys(row).forEach(f => {
            if (!findedFields[f]) {
              findedFields[f] = true
            }
          })
        })
        this.$fields = Object.keys(findedFields)
      }
      this.$values = rows.map((row, index) => {
        return this.$fields.map(field => ensureConst(row[field]))
      })
    }

    if (isSelectStatement) {
      this.$values = rows
    }

    return this
  }
}

class Update extends AST {
  constructor(options) {
    super()
    const { table, sets, joins, where } = options || {}
    this.declare(UPDATE)
    if (table) this.from(table)
    if (sets) this.set(sets)
    if (where) this.where(where)
    if (joins) joins.forEach(join => this.join(join))
  }

  from(table) {
    assert(!this.$table, 'from table已经声明')
    this.$table = ensure(table, DbObject, [Table], () => {
      assertType(table, [String, DbObject])
      return new Table(table)
    })
    return this
  }

  /**
   * 内联接
   * @param {string|Table|Invoke} table
   * @param {Condition} on
   * @param {boolean} left
   * @memberof Select
   */
  join(table, on, left = false) {
    assert(this.$table, 'join must after from clause')
    if (!this.$joins) {
      this.$joins = []
    }
    this.$joins.push(
      ensure(table, Join, [String], () => new Join(table, on, left))
    )
    return this
  }

  leftJoin(table, on) {
    return this.join(table, on, true)
  }

  /**
   * 兼容2种格式，第2种格式会被编译成第1种
   * 1: Assignment[]
   * 2: { field1: value, field2: value }
   * @param {*} sets
   */
  set(...sets) {
    assert(!this.$sets, 'set statement is declared')
    assert(sets.length > 0, 'sets must have more than 0 items')
    if (sets.length === 1 && _.isPlainObject(sets[0])) {
      this.$sets = Object.entries(sets[0]).map(
        ([key, value]) => new Assignment(new Field(key), ensureConst(value))
      )
      return this
    }

    this.$sets = sets.map(expr => ensure(expr, Assignment, [Array], () => new Assignment(expr[0], expr[1])))
    return this
  }

  /**
   * 查询条件
   * @param {Object|Condition} condition
   */
  where(condition) {
    assert(!this.$where, 'where clause is declared')
    condition = ensureCondition(condition)
    this.$where = condition
    return this
  }
}

class Delete extends AST {
  constructor(options) {
    super()
    this.declare(DELETE)
    const { table, where, joins } = options || {}
    if (table) this.from(table)
    if (joins) this.join(joins)
    if (where) this.where(where)
  }

  from(table) {
    assert(!this.$table, 'table 已经声明')
    this.$table = ensure(table, Table, [String], () => new Table(table))
  }

  /**
   * 内联接
   * @param {string|Table|Invoke} table
   * @param {Condition} on
   * @param {Boolean} left
   * @memberof Select
   */
  join(table, on, left = false) {
    assert(this.$table, 'join must after from clause')
    if (!this.$joins) {
      this.$joins = []
    }
    this.$joins.push(
      ensure(table, Join, [String], () => new Join(table, on, left))
    )
    return this
  }

  leftJoin(table, on) {
    return this.join(table, on, true)
  }

  where(condition) {
    this.$where = ensureCondition(condition)
    return this
  }
}

/**
 * 存储过程执行
 */
class Execute extends Statement {
  constructor(proc, ...params) {
    super()
    this.declare(EXEC)
    this.$proc = ensure(proc, DbObject, [String], () => new DbObject(proc))
    this.$params = params
  }
}

/**
 * 赋值表达式
 */
class Assignment extends Statement {
  constructor(left, right) {
    super()
    this.declare(ASSIGN)
    this.$left = ensureField(left)
    this.$right = ensureConst(right)
  }
}

// class Declare extends AST {
//   constructor(name, dataType) {
//     super($declare)
//     this.$name = name
//     this.$dataType = dataType
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
    super()
    this.declare(PARAM)
    assert(name && _.isString(name), 'Parameter name must type of string, and not allow empty.')
    assert(!direction || [INPUT, OUTPUT].includes(direction), 'direction must one of INPUT/OUTPUT')

    assert(!(value instanceof AST), 'The value is only allowed passed by javascript datatype who is compatibled with database.')

    assertValue(direction, [INPUT, OUTPUT])
    this.$name = name
    this.$dataType = dataType
    this.$value = ensureConst(value)
    this.$direction = direction
  }
}

const AllField = new Field('*')

module.exports = {
  AllField,
  AST,
  Expression,
  BinaryExpression,
  Condition,
  AndCondition,
  OrCondition,
  CompareCondition,
  Case,
  When,
  DbObject,
  Sort,
  Join,
  Union,
  Alias,
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
  Parameter
}
