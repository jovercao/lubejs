const _ = require('lodash')
const { Condition, CompareCondition, Quoted, Expression, Constant, DbObject, Table, Field, Alias } = require('./ast')
const { JS_CONSTANT_TYPES } = require('./util')

/**
 * 抽象类检查
 * @param {*} instance
 */
function abstract(instance, cls) {
  if (instance.constructor === cls) {
    throw new Error(`不允许直接创建抽象类${cls}实例`)
  }
}

/**
 * 断言
 * @param {*} except 预期结果
 * @param {*} message 错误消息
 */
function assert(except, message) {
  if (!except) {
    throw new Error(message)
  }
}

function assertType(expr, expectTypes, message) {
  if (expr instanceof Quoted) {
    // 检查内部类型,不接受兼容类型
    assertType(expr.$expr, expectTypes)
    return expr
  }
  const isOk = !!expectTypes.find(type => {
    if (type === null || type === undefined) {
      return expr === type
    }
    if (_.isString(type)) {
      return (typeof expr) === type
    }
    if (expr instanceof type) {
      return true
    }
    return expr.constructor === type
  })
  if (!isOk) {
    throw new Error(message)
  }
}

function assertValue(expr, values, message) {
  if (!values.includes(expr)) {
    throw new Error(message)
  }
}

/**
 * 推导表达式类型,保证表达式类型符合预期
 * 当表达式是Quoted类型时，会依据Quoted.expr进行类型判断
 * @param {*} expr 表达式，可以是字符串，常量等
 * @param {Function} factory 当不是期望类型时的AST类型构造函数
 * @param {Function} ExceptType 期望的AST类型构造函数
 * @param {(Function|null|undefined)[]} compatibleTypes 可接受的兼容类型
 * @param {String} message 当类型不兼容时的异常消息
 */
function ensure(expr, ExceptType, compatibleTypes = [], factory = null, message = null) {
  if (expr instanceof Quoted) {
    // 检查内部类型,不接受兼容类型
    ensure(expr.$expr, ExceptType)
    return expr
  }

  if (expr instanceof ExceptType) return expr
  const expect = compatibleTypes.concat([ExceptType]).map(type => type && type.name).join('|')
  const actual = expr ? expr.constructor : typeof expr
  assertType(expr, compatibleTypes,
    (message && message.replace(/\{except\}/g, expect).replace(/\{actual\}/g, actual)) ||
    `expr 需要类型:${expect}，但此处为${actual}类型`)
  if (!factory) {
    return new ExceptType(expr)
  }
  return factory(expr)
}

/**
 *
 * @param {*} expr
 */
function ensureConst(expr) {
  return ensure(expr, Expression, JS_CONSTANT_TYPES, () => new Constant(expr))
}

function ensureTable(expr) {
  return ensure(expr, Table, [String])
}

/**
 * 确保是字段
 * @param {*} expr
 */
function ensureField(expr) {
  return ensure(expr, Field, [String])
}

function ensureObject(expr) {
  if (expr instanceof Alias) {
    assertType(expr.$expr, [DbObject])
    return expr
  }
  return ensure(expr, DbObject, [String])
}

/**
 * 通过一个对象创建一个对查询条件
 * 亦可理解为：转换managodb的查询条件到 ast
 * @param {*} expr
 */
function ensureCondition(expr) {
  if (expr instanceof Condition) return expr
  assert(_.isPlainObject(expr), 'condition must typeof `Condition` or `plain object`')
  return Condition.and(Object.entries(([key, value]) => Condition.compare(key, value)))
  throw new Error('尚未实现')
}

module.exports = {
  assert,
  assertType,
  assertValue,
  abstract,
  ensureCondition,
  ensure,
  ensureConst,
  ensureTable,
  ensureObject,
  ensureField
}
