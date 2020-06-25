import * as _ from 'lodash'
import {
  Condition,
  Conditions,
  UnsureConditions,
  UnsureExpressions,
  Expressions,
  Bracket,
  Expression,
  Constant,
  Identity,
  Alias,
  Select
} from './ast'

/**
 * @typedef {import('./ast.js').Field} Expresstions
 */

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

// /**
//  * 类型断言
//  * @param expr 要判断的值
//  * @param expectTypes 类型列表
//  * @param message 错误消息
//  */
// export function assertType(expr: any, expectTypes: ((new() => any) | (new(...args) => any) | string)[], message: string) {
//   if (expr instanceof Bracket) {
//     // 检查内部类型,不接受兼容类型
//     assertType(expr.$context, expectTypes, message)
//     return expr
//   }
//   const isOk = !!expectTypes.find(type => {
//     if (type === null || type === undefined) {
//       return expr === type
//     }
//     if (_.isString(type)) {
//       return (typeof expr) === type
//     }
//     if (expr instanceof type) {
//       return true
//     }
//     return expr.constructor === type
//   })
//   if (!isOk) {
//     throw new Error(message)
//   }
// }

// export function assertValue(expr: any, values: any[], message: string) {
//   if (!values.includes(expr)) {
//     throw new Error(message)
//   }
// }

/**
 * 返回表达式
 */
export function ensureConstant(expr: UnsureExpressions): Expressions {
  if (!(expr instanceof Expression)) {
    return new Constant(expr)
  }
}

export function ensureIdentity(expr: string | Identity): Identity {
  if (_.isString(expr)) {
    return new Identity(expr)
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
  return Condition.and(Object.entries(condition).map(([key, value]) => Condition._compare(key, value)))
  throw new Error('尚未实现')
}
