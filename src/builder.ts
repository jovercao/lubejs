import {
  Condition,
  Parameter,
  Document,
  Identifier,
  AST,
  Statement,
  Expression,
  Expressions,
  Raw,
  JsConstant,
} from './ast'

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

export const when = Statement.when

/**
 * 标识符
 * @returns
 */
export const identifier = Expression.identifier

/**
 * 创建一个表格标识
 * @param names 表标识限定，如果有多级，请传多个参数
 * @returns
 * @example table(database, schema, tableName) => Identity
 * @example table(tableName) => Identity
 */
export const table = Expression.table

export const field = Expression.field

export const constant = Expression.constant

export const quoted = AST.bracket

export const bracket = AST.bracket

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
 * 创建一个原始的SQL片段
 * @param sql 原始SQL
 */
export function raw<T = any>(sql: string, lvalue?: boolean): Raw<T> {
  const v =  new Raw<T>(sql)
  v.lvalue = lvalue
  return v
}

/**
 * 创建一个SQL文档，包含多条SQL语句、
 * @param statements SQL语句
 */
export const doc = function(...statements: Statement[]) {
  return new Document(...statements)
}

/**
 * 创建一个INSERT语句
 */
export const insert = Statement.insert

export const $case = Statement.case

/**
 * 创建一个UPDATE语句
 */
export const update = Statement.update

export const fn = Expression.fn
// function(...names: string[]) {
//   return function(...args: Expressions[]) {
//     return Expression.identifier(...names).invoke(...args)
//   }
// }

export const sp = Expression.sp
// function (...names: string[]) {
//   return function (...args: Expressions[]) {
//     return Statement.execute(Expression.identifier(...names), args)
//   }
// }

export const buildIn = Identifier.buildIn

/**
 * 内建标识符，不会被 [] 包裹，buildIn的别名
 * @param name
 */
export const sys = buildIn

/**
 * 内建函数
 * @param name
 */
export const sysFn = function(name: string) {
  return function (...args: Expressions[]) {
    return Identifier.buildIn(name).invoke(...args)
  }
}

/**
 * 创建一个DELETE语句
 */
export const del = Statement.delete

export const $delete = Statement.delete

export const any = Expression.any

/**
 * 任意字段
 */
export const anyFields = Expression.any()

/**
 * 语句
 */
export const SQL = {
  select,
  insert,
  update,
  delete: $delete,
  case: $case,
  execute,
  exec,
  when,
  exists,
  invoke,
  fn,
  sp,
  buildIn,
  sys,
  table,
  field,
  alias,
  input,
  output,
  and,
  or,
  variant,
  var: variant,
  bracket,
  quoted,
  raw,
  any,
  anyFields
}

export default SQL
