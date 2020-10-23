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
  BinaryOperation,
  UnaryOperation,
  Constant,
  ModelConstructor
} from './ast'
import { OPERATION_OPERATOR } from './constants'

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

export const invokeAsTable = Statement.invokeAsTable
export const invokeAsScalar = Statement.invokeAsScalar

export const exec = Statement.execute

export const execute = Statement.execute

export const when = Statement.when

/**
 * 标识符
 * @returns
 */
export const identifier = Expression.identifier


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
 * 创建一个SELECT语句
 */
export const select = Statement.select

/**
 * 创建一个原始的SQL片段
 * @param sql 原始SQL
 */
export function raw<T = any>(sql: string, lvalue?: boolean): Raw<T> {
  const v = new Raw<T>(sql)
  v.lvalue = lvalue
  return v
}

/**
 * 创建一个SQL文档，包含多条SQL语句、
 * @param statements SQL语句
 */
export const doc = function (...statements: Statement[]) {
  return new Document(...statements)
}

/**
 * 创建一个INSERT语句
 */
export const insert = Statement.insert

export const $case = Statement.case

export const $with = Statement.with

/**
 * 创建一个UPDATE语句
 */
export const update = Statement.update



export const fn = function (...names: string[]) {
  return function (...args: Expressions[]) {
    return Expression.identifier.call(Expression.identifier, ...names).invoke(...args)
  }
}

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
export const sysFn = function (name: string) {
  return function (...args: Expressions[]) {
    return Identifier.buildIn(name).invoke(...args)
  }
}

/**
 * 创建一个DELETE语句
 */
export const del = Statement.delete

export const $delete = Statement.delete

/**
 * 常量
 * @param value 常量值
 */
export function constant<T extends JsConstant>(value: T): Expression<T> {
  return new Constant(value)
}

/**
 * 创建表对象，该对象是可代理的，可以直接以 . 运算符获取下一节点Identifier
 * @param names
 */
export function table<T extends object = any, TName extends string = string>(name: TName): ProxiedTable<Identifier<T, any, TName>>
export function table<T extends object = any, TName extends string = string>(schema: string, name: TName): ProxiedTable<Identifier<T, any, TName>>
export function table<T extends object = any, TName extends string = string>(database: string, schema: string, name: TName): ProxiedTable<Identifier<T, any, TName>>
export function table<T extends object>(modelClass: ModelConstructor<T>): ProxiedTable<Identifier<T, any, any>>
export function table(...args: any[]): any {
  if (typeof args[0] === 'function') {
    return Expression.identifier(args[0].name)
  }
  return (Expression.identifier as Function)(...args)
}

export function model<T extends object>(modelClass: ModelConstructor<T>): ProxiedTable<Identifier<T, any, any>> {
  return Expression.identifier(modelClass.name)
}

/**
 * 创建表对象，该对象是可代理的，可以直接以 . 运算符获取下一节点Identifier
 * @param names
 */
export function fn<T = any, TName extends string = string>(name: TName): ProxiedTable<Identifier<T, any, TName>>
export function fn<T = any, TName extends string = string>(schema: string, name: TName): ProxiedTable<Identifier<T, any, TName>>
export function fn<T = any, TName extends string = string>(database: string, schema: string, name: TName): ProxiedTable<Identifier<T, any, TName>>
export function fn(...args: any[]): any {
  if (typeof args[0] === 'function') {
    return Expression.identifier(args[0].name)
  }
  return (Expression.identifier as Function)(...args)
}

/**
 * 创建表对象，该对象是可代理的，可以直接以 . 运算符获取下一节点Identifier
 * @param names
 */
export function sp<T, TName extends string>(name: TName): ProxiedTable<Identifier<T, any, TName>>
export function sp<T, TName extends string>(schema: string, name: TName): ProxiedTable<Identifier<T, any, TName>>
export function sp<T, TName extends string>(database: string, schema: string, name: TName): ProxiedTable<Identifier<T, any, TName>>
export function sp(...args: any[]): any {
  if (typeof args[0] === 'function') {
    return Expression.identifier(args[0].name)
  }
  return (Expression.identifier as Function)(...args)
}

/**
 * 字段，实为 identifier(...names) 别名
 * @param names
 */
export function field<T, TName extends string = string>(field: TName): ProxiedTable<Identifier<T, any, TName>>
export function field<T, TName extends string = string>(table: string, field: TName): ProxiedTable<Identifier<T, any, TName>>
export function field<T, TName extends string = string>(schema: string, table: string, field: TName): ProxiedTable<Identifier<T, any, TName>>
export function field<T, TName extends string = string>(database: string, schema: string, table: string, field: TName): ProxiedTable<Identifier<T, any, TName>>
export function field(...args: any[]): any {
  if (typeof args[0] === 'function') {
    return Expression.identifier(args[0].name)
  }
  return (Expression.identifier as Function)(...args)
}

/**
 * 调用表达式
 * @param func 函数
 * @param params 参数
 */
export function invoke(func: Identifiers, params: (Expression | JsConstant)[]) {
  return new ScalarFuncInvoke(func, params)
}

/**
 * 语句
 */
export const SQL = {
  select,
  insert,
  update,
  delete: $delete,
  case: $case,
  with: $with,
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


// TODO: 建立命令查询器，针对model的
/**
 * 命令生成器
 * 用于深度查询
 */
export interface CommandBuilder {
  sql: string[];
  params: Set<Parameter>;
}
