import * as _ from 'lodash'
import {
  Condition,
  Conditions,
  UnsureConditions,
  UnsureExpressions,
  Expression,
  Expressions,
  AST,
  Identifier,
  JsConstant
} from './ast'

/**
 * 断言
 * @param except 预期结果
 * @param message 错误消息
 */
export function assert(except: any, message: string) {
  if (!except) {
    throw new Error(message)
  }
}

/**
 * 返回表达式
 */
export function ensureConstant(expr: UnsureExpressions): Expressions {
  if (!(expr instanceof AST)) {
    return Expression.constant(expr as JsConstant)
  }
  return expr
}

export function ensureIdentity(expr: string | Identifier): Identifier {
  if (_.isString(expr)) {
    return new Identifier(expr)
  }
  return expr
}

/**
 * 通过一个对象创建一个对查询条件
 * 亦可理解为：转换managodb的查询条件到 ast
 * @param condition 条件表达式
 */
export function ensureCondition(condition: UnsureConditions): Conditions {
  if (condition instanceof Condition) return condition
  assert(_.isPlainObject(condition), 'condition must typeof `Condition` or `plain object`')
  return Condition.and(...Object.entries(condition).map(([key, value]) => {
    if (_.isArray(value)) {
      return Condition.in(key, value)
    }
    return Condition.eq(key, value)
  }))
}

/**
 * 混入器
 * @param derivedCtor
 * @param baseCtors
 */
export function applyMixins(derivedCtor: any, baseCtors: any[]) {
  baseCtors.forEach(baseCtor => {
    Object.getOwnPropertyNames(baseCtor.prototype).forEach(name => {
      derivedCtor.prototype[name] = baseCtor.prototype[name]
    })
  })
}
