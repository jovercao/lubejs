import * as _ from 'lodash'
import { assert } from './util'
import {
  Condition,
  Alias,
  Parameter,
  Select,
  Insert,
  Update,
  Delete,
  Constant,
  Variant,
  Bracket,
  Invoke,
  Identity,
  Execute,
  Expressions,
  UnsureExpressions,
  UnsureIdentity,
  JsConstant,
  AST
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

export function invoke(func, params) {
  return new Invoke(func, params)
}

export function exec(proc, params) {
  return new Execute(proc, params)
}

/**
 * 标识符
 * @returns
 */
export function identity(...names: string[]) {
  return (names as (string | Identity)[]).reduce((previous, current) => {
    if (!previous) return new Identity(current as string)
    return new Identity(current as string, previous)
  })
}

/**
 * 创建一个表格标识
 * @param names 表标识限定，如果有多级，请传多个参数
 * @returns
 * @example table(database, schema, tableName) => Identity
 * @example table(tableName) => Identity
 */
export function table(...names: string[]) {
  return identity(...names)
}

/**
 * 字段引用
 * @param name
 * @param table
 * @returns
 */
export function field(name: string, table: UnsureIdentity) {
  return new Identity(name, table)
}

/**
 * 常量表达式
 */
export function constant(value: JsConstant) {
  return new Constant(value)
}

/**
 * 括号表达式
 * @param context 括号上下文
 * @returns
 */
export function quoted(context: AST) {
  return new Bracket(context)
}

/**
 * input 参数
 */
export function input(name: string, value: UnsureExpressions) {
  return new Parameter(name, value, ParameterDirection.INPUT)
}

/**
 * output参数
 */
export function output(name: string, value: UnsureExpressions) {
  return new Parameter(name, value, ParameterDirection.OUTPUT)
}

/**
 * 变量引用
 * @param name
 * @returns
 */
export function variant(name: string) {
  return new Variant(name)
}

/**
 * 创建一个列
 * @static
 * @param name 名称
 * @param exp 当不传递该参数时，默认为字段名
 * @returns 返回列实例
 * @memberof SQL
 */
export function alias(exp: Expressions, name: string) {
  assert(_.isString(name), '列名必须为字符串')
  return new Alias(exp, name)
}

/**
 * 创建一个SELECT SQL对象
 * @static
 * @param columns 列列表
 * @returns
 * @memberof SQL
 */
export function select(...columns: UnsureExpressions[]) {
  return new Select().columns(...columns)
}

/**
 * 创建一个insert SQL 对象
 * @static
 * @returns  insert sql 对象
 * @memberof SQL
 */
export function insert(table: UnsureIdentity) {
  return new Insert().into(table)
}

/**
 * 创建一个update sql 对象
 * @static
 * @param tables
 * @param sets
 * @param where
 * @returns
 * @memberof SQL
 */
export function update(table: UnsureIdentity) {
  return new Update().from(table)
}

/**
 * 创建一个delete SQL 对象
 * @static
 * @param table
 * @param where
 * @returns
 * @memberof SQL
 */
export function del(table: UnsureIdentity) {
  return new Delete().from(table)
}

export function allField() {
  return new Identity('*')
}

// ************************** 系统函数区 *************************
export function count(exp: UnsureExpressions) {
  return new Invoke('count', [exp])
}

export function stdev(exp: UnsureExpressions) {
  return new Invoke('stdev', [exp])
}

export function sum(exp: UnsureExpressions) {
  return new Invoke('sum', [exp])
}

export function avg(exp: UnsureExpressions) {
  return new Invoke('avg', [exp])
}

export function max(exp: UnsureExpressions) {
  return new Invoke('max', [exp])
}

export function min(exp: UnsureExpressions) {
  return new Invoke('min', [exp])
}

export function nvl(exp: UnsureExpressions, defaults: UnsureExpressions) {
  return new Invoke('nvl', [exp, defaults])
}

export function abs(exp: UnsureExpressions) {
  return new Invoke('abs', [exp])
}

export function ceil(exp: UnsureExpressions) {
  return new Invoke('ceil', [exp])
}

export function exp(exp: UnsureExpressions) {
  return new Invoke('exp', [exp])
}

export function square(exp: UnsureExpressions) {
  return new Invoke('square', [exp])
}

export function floor(exp: UnsureExpressions) {
  return new Invoke('floor', [exp])
}

export function round(exp: UnsureExpressions, digit: UnsureExpressions) {
  return new Invoke('round', [exp, digit])
}

export function sign(exp: UnsureExpressions) {
  return new Invoke('sign', [exp])
}

export function sqrt(exp: UnsureExpressions) {
  return new Invoke('sqrt', [exp])
}

export function power(exp: UnsureExpressions, pwr: UnsureExpressions) {
  return new Invoke('power', [exp, pwr])
}
// code(char) {
//   return new Invoke('code', [char], true)
// },
// char(code) {
//   return new Invoke('char', [code], true)
// },
// now() {
//   return new Invoke('now', null, true)
// },
// convert(exp, type) {
//   assert([STRING, NUMBER, DATE, BOOLEAN, BUFFER].includes(type), 'type must be in STRING/NUMBER/DATE/BOOLEAN/BUFFER')
//   return new Invoke('cast', [type, exp], true)
// },
// ltrim(str) {
//   return new Invoke('ltrim', [str])
// },
// rtrim(str) {
//   return new Invoke('rtrim', [str])
// },
// guid() {
//   return new Invoke('guid')
// },
// indexOf(strExp, matchExp, startIndex) {
//   assert()
//   const params = [strExp, matchExp]
//   if (startIndex) {
//     params.push(startIndex)
//   }
//   return new Invoke('indexof', params)
// },
// len(exp) {
//   return new Invoke('len', [exp])
// },
// substr(str, start, len) {
//   return new Invoke('substr', [str, start, len])
// },
// upper(str) {
//   return new Invoke('upper', [str])
// },
// lower(str) {
//   return new Invoke('lower', [str])
// },
// iif(condition, affirm, defaults) {
//   return new IIF(condition, affirm, defaults)
// },
// datatype(type) {
//   return new DataType(type)
// }
