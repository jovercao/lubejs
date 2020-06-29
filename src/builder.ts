import * as _ from 'lodash'
import { assert } from './util'
import {
  Condition,
  Parameter,
  Identifier,
  Statement,
  Expression,
  UnsureExpressions
} from './ast'

import {
  ParameterDirection,
  SortDirection
} from './constants'

// /**
//  * 将制作table的代理，用于生成字段
//  * @param table
//  * @returns
//  */
// function makeAutoFieldTableProxy(table) {
//   return new Proxy(table, {
//     get(target, prop) {
//       if (_.isSymbol(prop) || prop.startsWith('$') || Object.prototype.hasOwnProperty.call(target, prop)) {
//         return target[prop]
//       }
//       return new Field(prop, table)
//     }
//   })
// }

/**
 * not 查询条件运算
 */
export const not = Condition.not

/**
 * 使用and关联多个查询条件
 * @static
 * @param conditions 要关联的查询条件列表
 * @returns  condition
 * @memberof SQL
 */
export const and = Condition.and
/**
 * 使用or关联多个查询条件
 * @static
 * @param conditions 要关联的查询条件列表
 * @returns  condition
 * @memberof SQL
 */
export const or = Condition.or

/**
 * exists语句
 * @static
 * @param select
 * @returns
 * @memberof SQL
 */
export const exists = Condition.exists

export const invoke = Expression.invoke

export const exec = Statement.exec

export const execute = Statement.execute

/**
 * 标识符
 * @returns
 */
export const identity = Expression.identifier

/**
 * 创建一个表格标识
 * @param names 表标识限定，如果有多级，请传多个参数
 * @returns
 * @example table(database, schema, tableName) => Identity
 * @example table(tableName) => Identity
 */
export const table = Expression.identifier

export const field = Expression.identifier

export const constant = Expression.constant

export const quoted = Expression.quoted

/**
 * input 参数
 */
export const input = Parameter.input

/**
 * output参数
 */
export const output = Parameter.output

/**
 * 变量引用
 */
export const variant = Expression.variant

/**
 * 创建一个别名
 */
export const alias = Expression.alias

/**
 * 创建一个SELECT语句
 */
export const select = Statement.select

/**
 * 创建一个INSERT语句
 */
export const insert = Statement.insert

/**
 * 创建一个UPDATE语句
 */
export const update = Statement.update

/**
 * 创建一个DELETE语句
 */
export const del = Statement.delete

export const allFields = new Identifier('*')

// ************************** 系统函数区 *************************
export function count(exp: UnsureExpressions) {
  return invoke('count', [exp])
}

export function stdev(exp: UnsureExpressions) {
  return invoke('stdev', [exp])
}

export function sum(exp: UnsureExpressions) {
  return invoke('sum', [exp])
}

export function avg(exp: UnsureExpressions) {
  return invoke('avg', [exp])
}

export function max(exp: UnsureExpressions) {
  return invoke('max', [exp])
}

export function min(exp: UnsureExpressions) {
  return invoke('min', [exp])
}

export function nvl(exp: UnsureExpressions, defaults: UnsureExpressions) {
  return invoke('nvl', [exp, defaults])
}

export function abs(exp: UnsureExpressions) {
  return invoke('abs', [exp])
}

export function ceil(exp: UnsureExpressions) {
  return invoke('ceil', [exp])
}

export function exp(exp: UnsureExpressions) {
  return invoke('exp', [exp])
}

export function square(exp: UnsureExpressions) {
  return invoke('square', [exp])
}

export function floor(exp: UnsureExpressions) {
  return invoke('floor', [exp])
}

export function round(exp: UnsureExpressions, digit: UnsureExpressions) {
  return invoke('round', [exp, digit])
}

export function sign(exp: UnsureExpressions) {
  return invoke('sign', [exp])
}

export function sqrt(exp: UnsureExpressions) {
  return invoke('sqrt', [exp])
}

export function power(exp: UnsureExpressions, pwr: UnsureExpressions) {
  return invoke('power', [exp, pwr])
}

// TODO: 完成函数的转换
// TODO: 完成数据类型的转换

// code(char) {
//   return invoke('code', [char], true)
// },
// char(code) {
//   return invoke('char', [code], true)
// },
// now() {
//   return invoke('now', null, true)
// },
// convert(exp, type) {
//   assert([STRING, NUMBER, DATE, BOOLEAN, BUFFER].includes(type), 'type must be in STRING/NUMBER/DATE/BOOLEAN/BUFFER')
//   return invoke('cast', [type, exp], true)
// },
// ltrim(str) {
//   return invoke('ltrim', [str])
// },
// rtrim(str) {
//   return invoke('rtrim', [str])
// },
// guid() {
//   return invoke('guid')
// },
// indexOf(strExp, matchExp, startIndex) {
//   assert()
//   const params = [strExp, matchExp]
//   if (startIndex) {
//     params.push(startIndex)
//   }
//   return invoke('indexof', params)
// },
// len(exp) {
//   return invoke('len', [exp])
// },
// substr(str, start, len) {
//   return invoke('substr', [str, start, len])
// },
// upper(str) {
//   return invoke('upper', [str])
// },
// lower(str) {
//   return invoke('lower', [str])
// },
// iif(condition, affirm, defaults) {
//   return new IIF(condition, affirm, defaults)
// },
// datatype(type) {
//   return new DataType(type)
// }
