import * as _ from 'lodash'
import {
  Condition,
  UnsureCondition,
  UnsureExpression,
  UnsureGroupValues,
  Bracket,
  Expression,
  AST,
  Identifier,
  JsConstant,
  List,
  ProxiedIdentifier
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
export function ensureConstant(expr: UnsureExpression): Expression {
  if (!(expr instanceof AST)) {
    return Expression.constant(expr as JsConstant)
  }
  return expr
}

export function ensureIdentifier<T = void>(expr: string | Identifier<any>): Identifier<T> {
  if (_.isString(expr)) {
    return Identifier.normal<T>(expr)
  }
  return expr
}

export function ensureGroupValues(values: UnsureGroupValues): List {
  if (_.isArray(values)) {
    return List.values(...values)
  }
  return values
}

/**
 * 通过一个对象创建一个对查询条件
 * 亦可理解为：转换managodb的查询条件到 ast
 * @param condition 条件表达式
 */
export function ensureCondition(condition: UnsureCondition): Condition {
  if (condition instanceof Condition) return condition
  assert(_.isPlainObject(condition), 'condition must typeof `Condition` or `plain object`')
  const compares = Object.entries(condition).map(([key, value]) => {
    const field = Expression.identifier(key)
    if (_.isNull(value)) {
      return Condition.isNull(field)
    }
    if (_.isArray(value)) {
      return Condition.in(field, value)
    }
    return Condition.eq(field, value)
  })

  return compares.length >= 2 ? Condition.and(...compares) : compares[0]
}

// /**
//  * 混入器
//  * @param derivedCtor
//  * @param baseCtors
//  */
// export function applyMixins(derivedCtor: any, baseCtors: any[]) {
//   baseCtors.forEach(baseCtor => {
//     Object.getOwnPropertyNames(baseCtor.prototype).forEach(name => {
//       derivedCtor.prototype[name] = baseCtor.prototype[name]
//     })
//   })
// }

/**
 * 将制作table的代理，用于生成字段
 */
export function makeProxiedIdentifier<T = any>(identifier: Identifier<T>): ProxiedIdentifier<T> {
  return new Proxy(identifier, {
    get(target, prop): any {
      if (Reflect.has(target, prop)) {
        return Reflect.get(target, prop)
      }
      if (_.isString(prop)) {
        // $开头，实为转义符，避免字段命名冲突，程序自动移除首个
        if (prop.startsWith('$')) {
          prop = prop.substring(1)
        }
        return identifier.dot(prop as keyof T)
      }
    }
  }) as ProxiedIdentifier<T>
}

export function isJsConstant(value: any): value is JsConstant {
  return _.isString(value) || _.isBoolean(value) || typeof value === 'bigint' ||
    _.isNumber(value) || _.isNull(value) ||
    _.isDate(value) || _.isBuffer(value)
}
