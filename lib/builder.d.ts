import { Condition, Parameter, Identifier, AST, Statement, Expression, UnsureExpressions } from './ast';
/**
 * not 查询条件运算
 */
export declare const not: typeof Condition.not;
/**
 * 使用and关联多个查询条件
 * @static
 * @param conditions 要关联的查询条件列表
 * @returns  condition
 * @memberof SQL
 */
export declare const and: typeof Condition.and;
/**
 * 使用or关联多个查询条件
 * @static
 * @param conditions 要关联的查询条件列表
 * @returns  condition
 * @memberof SQL
 */
export declare const or: typeof Condition.or;
/**
 * exists语句
 * @static
 * @param select
 * @returns
 * @memberof SQL
 */
export declare const exists: typeof Condition.exists;
export declare const invoke: typeof Expression.invoke;
export declare const exec: typeof Statement.exec;
export declare const execute: typeof Statement.execute;
export declare const when: typeof Statement.when;
/**
 * 标识符
 * @returns
 */
export declare const identifier: typeof Expression.identifier;
/**
 * 创建一个表格标识
 * @param names 表标识限定，如果有多级，请传多个参数
 * @returns
 * @example table(database, schema, tableName) => Identity
 * @example table(tableName) => Identity
 */
export declare const table: typeof Expression.table;
export declare const field: typeof Expression.field;
export declare const constant: typeof Expression.constant;
export declare const quoted: typeof AST.bracket;
export declare const bracket: typeof AST.bracket;
/**
 * input 参数
 */
export declare const input: typeof Parameter.input;
/**
 * output参数
 */
export declare const output: typeof Parameter.output;
/**
 * 变量引用
 */
export declare const variant: typeof Expression.variant;
/**
 * 创建一个别名
 */
export declare const alias: typeof Expression.alias;
/**
 * 创建一个SELECT语句
 */
export declare const select: typeof Statement.select;
/**
 * 创建一个INSERT语句
 */
export declare const insert: typeof Statement.insert;
export declare const $case: typeof Expression.case;
/**
 * 创建一个UPDATE语句
 */
export declare const update: typeof Statement.update;
export declare const fn: (...names: string[]) => (...args: UnsureExpressions[]) => import("./ast").Invoke;
export declare const sp: (...names: string[]) => (...args: UnsureExpressions[]) => any;
/**
 * 内建函数
 * @param name
 */
export declare const sysFn: (name: string) => (...args: UnsureExpressions[]) => import("./ast").Invoke;
/**
 * 创建一个DELETE语句
 */
export declare const del: typeof Statement.delete;
export declare const any: typeof Expression.any;
export declare const anyFields: Identifier;
export declare function count(exp: UnsureExpressions): import("./ast").Invoke;
export declare function stdev(exp: UnsureExpressions): import("./ast").Invoke;
export declare function sum(exp: UnsureExpressions): import("./ast").Invoke;
export declare function avg(exp: UnsureExpressions): import("./ast").Invoke;
export declare function max(exp: UnsureExpressions): import("./ast").Invoke;
export declare function min(exp: UnsureExpressions): import("./ast").Invoke;
export declare function nvl(exp: UnsureExpressions, defaults: UnsureExpressions): import("./ast").Invoke;
export declare function abs(exp: UnsureExpressions): import("./ast").Invoke;
export declare function ceil(exp: UnsureExpressions): import("./ast").Invoke;
export declare function exp(exp: UnsureExpressions): import("./ast").Invoke;
export declare function square(exp: UnsureExpressions): import("./ast").Invoke;
export declare function floor(exp: UnsureExpressions): import("./ast").Invoke;
export declare function round(exp: UnsureExpressions, digit: UnsureExpressions): import("./ast").Invoke;
export declare function sine(exp: UnsureExpressions): import("./ast").Invoke;
export declare function sqrt(exp: UnsureExpressions): import("./ast").Invoke;
export declare function power(exp: UnsureExpressions, pwr: UnsureExpressions): import("./ast").Invoke;
