
/**
 * @typedef {String|Func|Date|null|undefined|Number} JsConstant JS常量类型
 * @typedef {Bracket<Condition>} QuotedCondition
 * @typedef {Condition|Bracket<Condition|QuotedCondition>} Conditions 查询条件，兼容括号
 * @typedef {Bracket<Expression>} QuotedExpression
 * @typedef {Expression|Bracket<Expression|QuotedExpression>} Expressions 兼容包含括号的表达式类型
 * @typedef {Expressions|JsConstant} UnsureExpressions 未经确定的表达式
 * @typedef {(UnsureExpressions)[]|Bracket<Expression[]|Select>[]} Values 值数组类型
 * @typedef {Bracket<Select>} BracketSelect
 * @typedef {Bracket<BracketSelect|Select>} SelectExpression 查询表达式
 * @typedef {import('./constants').ParameterDirection} ParameterDirection
 * @typedef {import('./constants').SortDirection} SortDirection
 */

/**
 * lodash
 */
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
  IS_NULL,
  IS_NOT_NULL,
  NEQ,
  LT,
  LTE,
  GT,
  GTE,
  LIKE,
  NOT_LIKE,
  IN,
  NOT_IN,
  // ************* 算术运算符 ****************
  // 二元
  ADD,
  SUB,
  MUL,
  DIV,
  MOD,
  // 二元 位运算符
  BITAND,
  BITOR,
  BITNOT,
  BITXOR,
  SHR,
  SHL,
  // 一元
  NEGATIVE,
  // ************* 逻辑运算符 *****************
  AND,
  OR,
  NOT,
  EXISTS,
  // ************ 符号 ***********************
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
 * @class
 * @abstract
 * AST 基类
 */
class AST {
  constructor() {
    abstract(this, AST)
    /**
     * @type {string[]}
     */
    this.$type = []
  }

  /**
   * 定义本AST类型
   * @param {string} type 类型名称
   */
  declare(type) {
    this.$type.push(type)
  }

  /**
   * 获取本AST的类型名称
   * @readonly
   * @memberof AST
   */
  get xtype() {
    return this.constructor.name
  }
}

/**
 * 表达式基类，抽象类
 * @class Expression
 * @abstract
 * @extends {AST}
 */
class Expression extends AST {
  constructor() {
    super()
    abstract(this, Expression)
    this.declare(EXPR)
  }

  /**
   * 获取当前表达式是否为左值
   * @type {boolean}
   */
  get lvalue() {
    throw Error('尚未实现')
  }

  /**
   * 获取当前表达式是否为右值
   * @type {boolean}
   */
  get rvalue() {
    return !this.lvalue
  }

  /**
   * 加法运算
   * @param {UnsureExpressions} exp 要与当前表达式相加的表达式
   * @returns {Expression} 返回运算后的表达式
   */
  add(exp) {
    return Expression.add(this, exp)
  }

  /**
   * 减法运算
   * @param {UnsureExpressions} exp 要与当前表达式相减的表达式
   * @returns {Expression} 返回运算后的表达式
   */
  sub(exp) {
    return Expression.sub(this, exp)
  }

  /**
   * 乘法运算
   * @param {UnsureExpressions} exp 要与当前表达式相乘的表达式
   * @returns {Expression} 返回运算后的表达式
   */
  mul(exp) {
    return Expression.mul(this, exp)
  }

  /**
   * 除法运算
   * @param {UnsureExpressions} exp 要与当前表达式相除的表达式
   * @returns {Expression} 返回运算后的表达式
   */
  div(exp) {
    return Expression.div(this, exp)
  }

  /**
   * 算术运算 %
   * @param {UnsureExpressions} exp 要与当前表达式相除的表达式
   * @returns {Expression} 返回运算后的表达式
   */
  mod(exp) {
    return Expression.mod(this, exp)
  }

  /**
   * 位运算 &
   * @param {UnsureExpressions} exp 要与当前表达式相除的表达式
   * @returns {Expression} 返回运算后的表达式
   */
  and(exp) {
    return Expression.and(this, exp)
  }

  /**
   * 位运算 |
   * @param {UnsureExpressions} exp 要与当前表达式相除的表达式
   * @returns {Expression} 返回运算后的表达式
   */
  or(exp) {
    return Expression.or(this, exp)
  }

  /**
   * 位运算 ~
   * @param {UnsureExpressions} exp 要与当前表达式相除的表达式
   * @returns {Expression} 返回运算后的表达式
   */
  not(exp) {
    return Expression.not(this, exp)
  }

  /**
   * 位运算 ^
   * @param {UnsureExpressions} exp 要与当前表达式相除的表达式
   * @returns {Expression} 返回运算后的表达式
   */
  xor(exp) {
    return Expression.xor(this, exp)
  }

  /**
   * 位运算 <<
   * @param {UnsureExpressions} exp 要与当前表达式相除的表达式
   * @returns {Expression} 返回运算后的表达式
   */
  shl(exp) {
    return Expression.shl(this, exp)
  }

  /**
   * 位运算 >>
   * @param {UnsureExpressions} exp 要与当前表达式相除的表达式
   * @returns {Expression} 返回运算后的表达式
   */
  shr(exp) {
    return Expression.shr(this, exp)
  }

  /**
   * 比较是否相等 =
   * @param {UnsureExpressions} exp 要与当前表达式相比较的表达式
   * @returns {BinaryCompareCondition} 返回对比条件表达式
   */
  eq(exp) {
    return Condition.eq(this, exp)
  }

  /**
   * 比较是否不等于 <>
   * @param {UnsureExpressions} exp 要与当前表达式相比较的表达式
   * @returns {BinaryCompareCondition} 返回对比条件表达式
   */
  neq(exp) {
    return Condition.neq(this, exp)
  }

  /**
   * 比较是否小于 <
   * @param {UnsureExpressions} exp 要与当前表达式相比较的表达式
   * @returns {BinaryCompareCondition} 返回对比条件表达式
   */
  lt(exp) {
    return Condition.lt(this, exp)
  }

  /**
   * 比较是否小于等于 <=
   * @param {UnsureExpressions} exp 要与当前表达式相比较的表达式
   * @returns {BinaryCompareCondition} 返回对比条件表达式
   */
  lte(exp) {
    return Condition.lte(this, exp)
  }

  /**
   * 比较是否大于 >
   * @param {UnsureExpressions} exp 要与当前表达式相比较的表达式
   * @returns {BinaryCompareCondition} 返回对比条件表达式
   */
  gt(exp) {
    return Condition.gt(this, exp)
  }

  /**
   * 比较是否小于等于 >=
   * @param {UnsureExpressions} exp 要与当前表达式相比较的表达式
   * @returns {BinaryCompareCondition} 返回对比条件表达式
   */
  gte(exp) {
    return Condition.gte(this, exp)
  }

  /**
   * 比较是相像 LIKE
   * @param {UnsureExpressions} exp 要与当前表达式相比较的表达式
   * @returns {BinaryCompareCondition} 返回对比条件表达式
   */
  like(exp) {
    return Condition.like(this, exp)
  }

  /**
   * 比较是否不想像 NOT LIKE
   * @param {UnsureExpressions} exp 要与当前表达式相比较的表达式
   * @returns {BinaryCompareCondition} 返回对比条件表达式
   */
  notLike(exp) {
    return Condition.notLike(this, exp)
  }

  /**
   * 比较是否不包含于 IN
   * @param {Values} values 要与当前表达式相比较的表达式数组
   * @returns {BinaryCompareCondition} 返回对比条件表达式
   */
  in(...values) {
    return Condition.in(this, values)
  }

  /**
   * 比较是否不包含于 NOT IN
   * @param {Values} values 要与当前表达式相比较的表达式
   * @returns {BinaryCompareCondition} 返回对比条件表达式
   */
  notIn(...values) {
    return Condition.notIn(this, values)
  }

  /**
   * 比较是否为空 IS NULL
   * @returns {IsNullCondition} 返回对比条件表达式
   */
  isNull() {
    return Condition.isNull(this)
  }

  /**
   * 比较是否为空 IS NOT NULL
   * @returns {IsNotNullCondition} 返回对比条件表达式
   */
  isNotNull() {
    return Condition.isNotNull(this)
  }

  /**
   * isNotNull 的简称别名
   * @returns {IsNotNullCondition} 返回对比条件表达式
   */
  notNull() {
    return this.isNotNull()
  }

  /**
   * 正序
   * @returns {Sort} 返回对比条件表达式
   */
  asc() {
    return new Sort(
      this,
      ASC
    )
  }

  /**
   * 倒序
   * @returns {Sort} 返回对比条件表达式
   */
  desc() {
    return new Sort(
      this,
      DESC
    )
  }

  /**
   * 为当前表达式添加别名
   * @param {string} alias 别名
   * @returns {Alias} 返回别名表达式
   */
  as(alias) {
    return new Alias(this, alias)
  }

  /**
   * 算术运算 +
   * @private
   * @param {UnsureExpressions} left 左值
   * @param {UnsureExpressions} right 右值
   * @returns {BinaryCalculateExpression} 返回算术运算表达式
   */
  static add(left, right) {
    return new BinaryCalculateExpression(ADD, left, right)
  }

  /**
   * 算术运算 -
   * @private
   * @param {UnsureExpressions} left 左值
   * @param {UnsureExpressions} right 右值
   * @returns {BinaryCalculateExpression} 返回算术运算表达式
   */
  static sub(left, right) {
    return new BinaryCalculateExpression(SUB, left, right)
  }

  /**
   * 算术运算 *
   * @private
   * @param {UnsureExpressions} left 左值
   * @param {UnsureExpressions} right 右值
   * @returns {BinaryCalculateExpression} 返回算术运算表达式
   */
  static mul(left, right) {
    return new BinaryCalculateExpression(MUL, left, right)
  }

  /**
   * 算术运算 /
   * @private
   * @param {UnsureExpressions} left 左值
   * @param {UnsureExpressions} right 右值
   * @returns {BinaryCalculateExpression} 返回算术运算表达式
   */
  static div(left, right) {
    return new BinaryCalculateExpression(DIV, left, right)
  }

  /**
   * 算术运算 %
   * @private
   * @param {UnsureExpressions} left 左值
   * @param {UnsureExpressions} right 右值
   * @returns {BinaryCalculateExpression} 返回算术运算表达式
   */
  static mod(left, right) {
    return new BinaryCalculateExpression(MOD, left, right)
  }

  /**
   * 位算术运算 &
   * @private
   * @param {UnsureExpressions} left 左值
   * @param {UnsureExpressions} right 右值
   * @returns {BinaryCalculateExpression} 返回算术运算表达式
   */
  static and(left, right) {
    return new BinaryCalculateExpression(BITAND, left, right)
  }

  /**
   * 位算术运算 |
   * @private
   * @param {UnsureExpressions} left 左值
   * @param {UnsureExpressions} right 右值
   * @returns {BinaryCalculateExpression} 返回算术运算表达式
   */
  static or(left, right) {
    return new BinaryCalculateExpression(BITOR, left, right)
  }

  /**
   * 位算术运算 ^
   * @private
   * @param {UnsureExpressions} left 左值
   * @param {UnsureExpressions} right 右值
   * @returns {BinaryCalculateExpression} 返回算术运算表达式
   */
  static xor(left, right) {
    return new BinaryCalculateExpression(BITXOR, left, right)
  }

  /**
   * 位算术运算 ~
   * @private
   * @param {UnsureExpressions} left 左值
   * @param {UnsureExpressions} right 右值
   * @returns {BinaryCalculateExpression} 返回算术运算表达式
   */
  static not(left, right) {
    return new BinaryCalculateExpression(BITNOT, left, right)
  }

  /**
   * 位算术运算 <<
   * @private
   * @param {UnsureExpressions} left 左值
   * @param {UnsureExpressions} right 右值
   * @returns {BinaryCalculateExpression} 返回算术运算表达式
   */
  static shl(left, right) {
    return new BinaryCalculateExpression(SHL, left, right)
  }

  /**
   * 位算术运算 >>
   * @private
   * @param {UnsureExpressions} left 左值
   * @param {UnsureExpressions} right 右值
   * @returns {BinaryCalculateExpression} 返回算术运算表达式
   */
  static shr(left, right) {
    return new BinaryCalculateExpression(SHR, left, right)
  }
}

/**
 * 查询条件
 * @class
 * @extends AST
 * @abstract
 */
class Condition extends AST {
  constructor() {
    super()
    abstract(this, Condition)
    this.declare(COND)
  }

  /**
   * and连接
   * @param {Condition|Object} condition 下一个查询条件
   * @returns {AndCondition} 返回新的查询条件
   */
  and(condition) {
    condition = ensureCondition(condition)
    return new AndCondition(this, condition)
  }

  /**
   * OR语句
   * @param {Condition|Object} condition
   * @returns {AndCondition} 返回新的查询条件
   */
  or(condition) {
    condition = ensureCondition(condition)
    return new OrCondition(this, condition)
  }

  /**
   * 将多个查询条件通过 AND 合并成一个大查询条件
   * @static
   * @param {Condition[]} conditions 查询条件列表
   * @returns {Condition} 返回逻辑表达式
   */
  static and(...conditions) {
    assert(_.isArray(conditions) && conditions.length > 1, 'Conditions must type of Array & have two or more elements.')
    return conditions.reduce((previous, current) => {
      current = ensureCondition(current)
      if (!previous) return current
      return new AndCondition(previous, current)
    })
  }

  /**
   * 将多个查询条件通过 OR 合并成一个
   * @static
   * @param {Condition[]} conditions 查询条件列表
   * @returns {Condition} 返回逻辑表达式
   */
  static or(...conditions) {
    assert(_.isArray(conditions) && conditions.length > 1, 'Conditions must type of Array & have two or more elements.')
    return conditions.reduce((previous, current, index) => {
      current = ensureCondition(current)
      if (!previous) return current
      return new OrCondition(previous, current)
    })
  }

  /**
   * Not 逻辑运算
   * @param {Condition} condition
   * @returns {NotCondition}
   */
  static not(condition) {
    condition = ensureCondition(condition)
    return new NotCondition(condition)
  }

  /**
   * Exists 子句
   * @param {Select|SelectExpression} select 查询语句
   * @returns {Condition}
   */
  static exists(select) {
    assert(select instanceof Select, 'exists argument must type of SelectStatment')
    if (select instanceof Select) {
      select = select.enclose()
    }
    return new ExistsCondition(ensure(select, Bracket, [Select]))
  }

  /**
   * 比较运算
   * @private
   * @param {UnsureExpressions} left 左值
   * @param {UnsureExpressions} right 右值
   * @param {String} operator 运算符
   * @returns {BinaryCompareCondition} 返回比较运算对比条件
   */
  static _compare(left, right, operator = EQ) {
    return new BinaryCompareCondition(operator, left, right)
  }

  /**
   * 比较运算 =
   * @private
   * @param {UnsureExpressions} left 左值
   * @param {UnsureExpressions} right 右值
   * @returns {BinaryCompareCondition} 返回比较运算对比条件
   */
  static eq(left, right) {
    return Condition._compare(left, right, EQ)
  }

  /**
   * 比较运算 <>
   * @private
   * @param {UnsureExpressions} left 左值
   * @param {UnsureExpressions} right 右值
   * @returns {BinaryCompareCondition} 返回比较运算对比条件
   */
  static neq(left, right) {
    return Condition._compare(left, right, NEQ)
  }

  /**
   * 比较运算 <
   * @private
   * @param {UnsureExpressions} left 左值
   * @param {UnsureExpressions} right 右值
   * @returns {BinaryCompareCondition} 返回比较运算对比条件
   */
  static lt(left, right) {
    return Condition._compare(left, right, LT)
  }

  /**
   * 比较运算 <=
   * @private
   * @param {UnsureExpressions} left 左值
   * @param {UnsureExpressions} right 右值
   * @returns {BinaryCompareCondition} 返回比较运算对比条件
   */
  static lte(left, right) {
    return Condition._compare(left, right, LTE)
  }

  /**
   * 比较运算 >
   * @private
   * @param {UnsureExpressions} left 左值
   * @param {UnsureExpressions} right 右值
   * @returns {BinaryCompareCondition} 返回比较运算对比条件
   */
  static gt(left, right) {
    return Condition._compare(left, right, GT)
  }

  /**
   * 比较运算 >=
   * @private
   * @param {UnsureExpressions} left 左值
   * @param {UnsureExpressions} right 右值
   * @returns {BinaryCompareCondition} 返回比较运算对比条件
   */
  static gte(left, right) {
    return Condition._compare(left, right, GTE)
  }

  /**
   * 比较运算 LIKE
   * @private
   * @param {UnsureExpressions} left 左值
   * @param {UnsureExpressions} right 右值
   * @returns {BinaryCompareCondition} 返回比较运算对比条件
   */
  static like(left, right) {
    return Condition._compare(left, right, LIKE)
  }

  /**
   * 比较运算 NOT LIKE
   * @private
   * @param {UnsureExpressions} left 左值
   * @param {UnsureExpressions} right 右值
   * @returns {BinaryCompareCondition} 返回比较运算对比条件
   */
  static notLike(left, right) {
    return Condition._compare(left, right, NOT_LIKE)
  }

  /**
   * 比较运算 IN
   * @private
   * @param {UnsureExpressions} left 左值
   * @param {Values} values 要比较的值列表
   * @returns {BinaryCompareCondition} 返回比较运算对比条件
   */
  static in(left, values) {
    let group
    if (values.length === 1 && values[0] instanceof Bracket) {
      group = values[0]
    } else {
      group = new Bracket(values)
    }
    return Condition._compare(left, group, IN)
  }

  /**
   * 比较运算 NOT IN
   * @private
   * @param {UnsureExpressions} left 左值
   * @param {Values} values 要比较的值列表
   * @returns {BinaryCompareCondition} 返回比较运算对比条件
   */
  static notIn(left, values) {
    let group
    if (values.length === 1 && values[0] instanceof Bracket) {
      group = values[0]
    } else {
      group = new Bracket(values)
    }
    return Condition._compare(left, group, NOT_IN)
  }

  /**
   * 比较运算 IS NULL
   * @private
   * @returns {IsNullCondition} 返回比较运算符
   */
  static isNull(expr) {
    return new IsNullCondition(expr)
  }

  /**
   * 比较运算 IS NOT NULL
   * @private
   * @returns {IsNotNullCondition} 返回比较运算符
   */
  static isNotNull(expr) {
    return new IsNotNullCondition(expr)
  }
}

/**
 * 逻辑查询条件
 * @abstract
 */
class LogicCondition extends Condition {
  constructor() {
    super()
    this.declare(LOGIC)
    abstract(this, LogicCondition)
  }

  /**
   * @returns {Bracket<Condition>}
   */
  enclose() {
    return new Bracket(this)
  }
}

/**
 * 二元逻辑查询条件条件
 * @abstract
 */
class BinaryLogicCondition extends LogicCondition {
  /**
   * 创建二元逻辑查询条件实例
   * @param {String} operator 逻辑运算符
   * @param {Conditions} left 左查询条件
   * @param {Conditions} right 右查询条件
   */
  constructor(operator, left, right) {
    super()
    this.$opeartor = operator
    this.declare(BINARY)
    abstract(this, LogicCondition)
    assertType(left, [Condition], 'The argument left must typeof Condition')
    assertType(right, [Condition], 'The argument right must typeof Condition')
    /**
     * 左查询条件
     */
    this.$left = left
    /**
     * 右查询条件
     */
    this.$right = right
  }
}

/**
 * AND查询条件
 */
class AndCondition extends BinaryLogicCondition {
  /**
   * 创建AND逻辑查询条件实例
   * @param {Conditions} left 左查询条件
   * @param {Conditions} right 右查询条件
   */
  constructor(left, right) {
    super(AND, left, right)
    this.declare(AND)
  }
}

/**
 * OR查询条件
 */
class OrCondition extends BinaryLogicCondition {
  /**
   * 创建OR逻辑查询条件实例
   * @param {Conditions} left 左查询条件
   * @param {Conditions} right 右查询条件
   */
  constructor(left, right) {
    super(OR, left, right)
    this.declare(OR)
  }
}

/**
 * 一元逻辑查询条件
 * @abstract
 */
class UnaryLogicCondition extends LogicCondition {
  /**
   * 创建一元逻辑查询条件实例
   * @param {string} operator
   * @param {Conditions} next
   */
  constructor(operator, next) {
    super()
    abstract(this, UnaryLogicCondition)
    this.declare(UNARY)
    this.$operator = operator
    this.$next = next
  }
}

/**
 * Not逻辑条件
 */
class NotCondition extends UnaryLogicCondition {
  /**
   * 创建Not逻辑查询条件实例
   * @param {Conditions} next 逻辑表达式
   */
  constructor(next) {
    super(NOT, next)
    this.declare(NOT)
  }
}

/**
 * Exists判断条件
 */
class ExistsCondition extends UnaryLogicCondition {
  /**
   * Exists逻辑查询条件
   * @param {SelectExpression} select Select表达式
   */
  constructor(select) {
    assertType(select, [Select], 'Exists 子句仅可接受 Select语句')
    super(EXISTS, ensure(select, Bracket, [Select]))
    this.declare(EXISTS)
  }
}

/**
 * 比较查询条件
 * @abstract
 */
class CompareCondition extends Condition {
  /**
   * 比较查询条件构造函数
   * @param {string} operator 运算符
   */
  constructor(operator) {
    super()
    abstract(this, CompareCondition)
    assert(operator, 'Operator must not null')
    /**
     * 运算符
     */
    this.$operator = operator
  }
}

/**
 * 二元比较条件
 */
class BinaryCompareCondition extends CompareCondition {
  /**
   * 构造函数
   * @param {string} operator 运算符
   * @param {UnsureExpressions} left 左值
   * @param {UnsureExpressions} right 右值
   */
  constructor(operator, left, right) {
    super(operator)
    this.declare(COMPARE)
    assert(left, 'Left must not null')
    assert(right, 'Right must not null')
    this.$left = left
    this.$right = right
  }
}

/**
 * 一元比较条件
 */
class UnaryCompareCondition extends CompareCondition {
  /**
   * 一元比较运算符
   * @param {string} operator 运算符
   * @param {Expressions} expr 查询条件
   */
  constructor(operator, expr) {
    super(operator)
    this.declare(UNARY)
    assert(expr, 'next must not null')
    this.$expr = expr
  }
}

/**
 * IS NULL 运算
 */
class IsNullCondition extends UnaryCompareCondition {
  /**
   * @param {Expressions} expr 下一查询条件
   */
  constructor(expr) {
    if (expr instanceof LogicCondition) {
      expr = expr.enclose()
    }
    super(IS_NULL, expr)
  }
}

/**
 * 是否为空值条件
 */
class IsNotNullCondition extends UnaryCompareCondition {
  /**
   * 是否空值
   * @param {Expressions} expr
   */
  constructor(expr) {
    super(IS_NOT_NULL, expr)
  }
}

/**
 * 排序信息项
 */
class Sort extends AST {
  /**
   * 排序信息
   * @param {Expressions} expr
   * @param {SortDirection} direct 排序方向
   */
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
   * @param {Conditions} on 关联条件
   * @param {boolean} left 是否左联接
   * @field
   */
  constructor(table, on, left = false) {
    super()
    this.declare(JOIN)

    /**
     * 关联表
    * @type {Table}
    */
    this.$table = ensureObject(table)
    /**
     * 关联条件
    * @type {Conditions}
    */
    this.$on = ensureCondition(on)

    /**
     * 是否左联接
     * @type {boolean}
     */
    this.$left = left
  }
}

/**
 * 别名表达式
 */
class Alias extends AST {
  /**
   * 别名构造函数
   * @param {Expressions|Identity} expr 表达式或表名
   * @param {string} name 别名
   */
  constructor(expr, name) {
    super()
    this.declare(COLUMN)
    assert(_.isString(name), 'The alias must type of string')
    // assertType(expr, [DbObject, Field, Constant, Select], 'alias must type of DbObject|Field|Constant|Quoted<Select>')
    this.$expr = expr
    this.$name = name
  }
}

/**
 * 标识符
 */
class Identity extends AST {
  /**
   * 标识符
   * @param {...string} names 名称
   */
  constructor(...names) {
    super()
    this.declare(OBJECT)
    assert(names.length > 0, '至少需要一个名称')
    this.$names = names
  }

  next(name) {
    this.$names.push(name)
    return this
  }
}

/**
 * 函数调用表达式
 */
class Invoke extends Expression {
  /**
   * 函数调用
   * @param {Func} func
   * @param {Expression[]} params
   */
  constructor(func, params) {
    super()
    this.declare(INVOKE)
    assert(func instanceof Func, 'context must type of Function')
    this.$func = func
    this.$params = params
  }
}

/**
 * 函数
 * @class
 */
class Func extends Identity {
  /**
   *
   * @param {string} name 函数名称
   * @param {boolean} aggregate 是否为聚合函数
   */
  constructor(name, aggregate = false) {
    super(name)
    this.$aggregate = aggregate
  }

  /**
   * 调用
   * @param  {...Expressions} params
   * @returns {Invoke}
   */
  invoke(...params) {
    return new Invoke(this, params)
  }
}

/**
 * 存储过程
 */
class Procedure extends Identity {
  /**
   * 执行
   * @param  {...(Expressions|Assignment)} params 参数
   * @returns {Execute}
   */
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
 * @abstract
 */
class Statement extends AST {
  constructor() {
    super()
    this.declare(STATEMENT)
    abstract(this, Statement)
  }
}

/**
 * When语句
 */
class When extends AST {
  /**
   * When
   * @param {Expressions|Conditions} expr 当条件
   * @param {Expressions} value 值
   */
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
  /**
   *
   * @param {Expressions} expr
   */
  constructor(expr) {
    super()
    this.$expr = expr
    /**
     * @type {When[]}
     */
    this.$whens = []
  }

  /**
   * ELSE语句
   * @param {Expressions} defaults
   */
  else(defaults) {
    this.$defaults = ensureConst(defaults)
  }

  /**
   * WHEN语句
   * @param {Expressions|Conditions} expr
   * @param {Expressions} then
   */
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
  /**
   * 常量
   * @param {JsConstant} value 值
   */
  constructor(value) {
    super()
    this.declare(CONST)
    this.$value = value
  }
}

/**
 * 括号引用
 * @class
 * @template T @extend 包含类型
 * @extends Expression
 */
class Bracket extends Expression {
  /**
   * @param {T} expr
   * @constructor
   */
  constructor(expr) {
    super()
    this.declare(QUOTED)

    assertType(expr, [AST, Array], '必须是AST类型')
    /**
     * 表达式
     * @type {T}
     */
    this.$expr = expr
  }
}

/**
 * 字段引用
 */
class Field extends Expression {
  /**
   * 字段
   * @param {string} name
   * @param {string} table
   */
  constructor(name, table = null) {
    super()
    this.declare(FIELD)
    assert(_.isString(name), 'Field name must type of string')
    this.$name = name
    this.$table = table
  }

  /**
   * 赋值表达式
   * @param {Expression} value 值
   */
  assign(value) {
    const names = this.$table ? [this.$table, this.$name] : [this.$name]
    return new Assignment(new Identity(...names), value)
  }
}

/**
 * 表-表达式，支持字段
 * @class Table
 */
class Table extends Alias {
  /**
   * 创建一个查询表格
   * @param {string} alias 表格上下文
   * @param {Expressions|Identity} expr
   */
  constructor(expr, alias = null) {
    super(expr, alias)
    this.declare(TABLE)
    /**
     * @type {Identity|Expressions}
     */
    this.$expr = expr
    assert(_.isString(alias), 'The argument alias must type of string')
  }

  /**
   * 获取字段
   * @param {*} name
   */
  field(name) {
    return new Field(name, this.$name)
  }

  /**
   * 所有字段
   */
  all() {
    return new Field('*', this.$name)
  }
}

/**
 * 二元运算表达式
 */
class BinaryCalculateExpression extends Expression {
  /**
   * 名称
   * @param {String} operator 运算符
   * @param {UnsureExpressions} left 左值
   * @param {UnsureExpressions} right 右值
   */
  constructor(operator, left, right) {
    super()
    this.declare(BINARY)
    assert(left, 'The argument left must not null')
    assert(right, 'The arguemnt right must not null')
    assertValue(operator, COMPARE_OPERATORS, `The argument operator must one of "${COMPARE_OPERATORS.join('|')}"`)
    this.$operator = operator
    /**
     * @type {Expressions}
     */
    this.$left = ensureConst(left)
    /**
     * @type {Expressions}
     */
    this.$right = ensureConst(right)
  }
}

/**
 * - 运算符
 */
class Negative extends Expression {
  /**
   * 负数运算符
   * @param {UnsureExpressions} expr
   */
  constructor(expr) {
    super()
    this.declare(NEGATIVE)
    this.$operator = NEGATIVE
    /**
     * @type {Expressions}
     */
    this.$expr = ensureConst(expr)
  }
}

/**
 * 联接查询
 */
class Union extends AST {
  /**
   *
   * @param {Select|SelectExpression} select SELECT语句
   * @param {boolean} all 是否所有查询
   */
  constructor(select, all) {
    super()
    this.declare(UNION)
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
   * @param {Expressions[]} columns
   * @returns
   * @memberof Select
   */
  select(...columns) {
    assert(!this.$columns, 'columns is declared')
    if (columns.length === 1 && _.isPlainObject(columns[0])) {
      /**
       * @type {(Expressions|Alias)[]}
       */
      this.$columns = Object.entries(columns).map(([alias, expr]) =>
        new Alias(ensureConst(expr), alias))

      return this
    }
    // 实例化
    this.$columns = columns.map(expr => ensureConst(expr))
    return this
  }

  distinct() {
    this.$distinct = true
    return this
  }

  /**
   * TOP
   * @param {Number} rows 行数
   */
  top(rows) {
    assert(_.isUndefined(this.$top), 'top is declared')
    this.$top = rows
    return this
  }

  /**
   * 从表中查询，可以查询多表
   * @param {...Table} tables
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
    assert(this.$groupBy, 'Syntax error, group by is not declared.')
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
   * 将本SELECT返回表达式
   * @returns {Bracket<Select>} 返回一个加()后的SELECT语句
   */
  enclose() {
    return new Bracket(this)
  }

  /**
   * 将本次查询，转换为Table行集
   */
  asTable(alias) {
    return new Table(this.enclose(), alias)
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
      this.table(values)
    }

    if (fields) {
      this.fields(fields)
    }
  }

  into(table, fields) {
    assert(!this.$table, 'The into clause is declared')
    this.$table = ensure(table, Identity, [String, Table], () => {
      if (_.isString(table)) return new Table(table)
      assertType(table.expr, [Identity])
      return table.expr
    })
    if (fields) {
      this.fields(fields)
    }
    return this
  }

  fields(...fields) {
    assert(fields.length > 0, 'fields not allow empty.')
    /**
     * 字段列表
     * @type {Expression[]}
     */
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
    this.$table = ensure(table, Identity, [Table], () => {
      assertType(table, [String, Identity])
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
  join(table, on  = null, left = false) {
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
    this.$proc = ensure(proc, Identity, [String], () => new Identity(proc))
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
  BinaryCalculateExpression,
  Condition,
  AndCondition,
  OrCondition,
  BinaryCompareCondition,
  CompareCondition,
  Case,
  When,
  Identity: DbObject,
  Sort,
  Join,
  Union,
  Alias,
  Field,
  Table,
  Function: Func,
  Procedure,
  Func,
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
  Bracket,
  Parameter
}
