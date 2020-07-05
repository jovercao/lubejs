import { Condition, Parameter, Identifier, AST, Statement, Expression, UnsureExpressions, Raw } from './ast';
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
 * 创建一个原始的SQL片段
 * @param sql 原始SQL
 */
export declare const raw: (sql: string) => Raw;
/**
 * 创建一个INSERT语句
 */
export declare const insert: typeof Statement.insert;
export declare const $case: typeof Statement.case;
/**
 * 创建一个UPDATE语句
 */
export declare const update: typeof Statement.update;
export declare const fn: (...names: string[]) => (...args: UnsureExpressions[]) => import("./ast").Invoke;
export declare const sp: (...names: string[]) => (...args: UnsureExpressions[]) => any;
export declare const buildIn: typeof Identifier.buildIn;
/**
 * 内建标识符，不会被 [] 包裹，buildIn的别名
 * @param name
 */
export declare const sys: typeof Identifier.buildIn;
/**
 * 内建函数
 * @param name
 */
export declare const sysFn: (name: string) => (...args: UnsureExpressions[]) => import("./ast").Invoke;
/**
 * 创建一个DELETE语句
 */
export declare const del: typeof Statement.delete;
export declare const $delete: typeof Statement.delete;
export declare const any: typeof Expression.any;
/**
 * 任意字段
 */
export declare const anyFields: Identifier;
/**
 * 语句
 */
export declare const SQL: {
    select: typeof Statement.select;
    insert: typeof Statement.insert;
    update: typeof Statement.update;
    delete: typeof Statement.delete;
    case: typeof Statement.case;
    execute: typeof Statement.execute;
    exec: typeof Statement.exec;
    when: typeof Statement.when;
    exists: typeof Condition.exists;
    invoke: typeof Expression.invoke;
    fn: (...names: string[]) => (...args: UnsureExpressions[]) => import("./ast").Invoke;
    sp: (...names: string[]) => (...args: UnsureExpressions[]) => any;
    buildIn: typeof Identifier.buildIn;
    sys: typeof Identifier.buildIn;
    table: typeof Expression.table;
    field: typeof Expression.field;
    alias: typeof Expression.alias;
    input: typeof Parameter.input;
    output: typeof Parameter.output;
    and: typeof Condition.and;
    or: typeof Condition.or;
    variant: typeof Expression.variant;
    var: typeof Expression.variant;
    bracket: typeof AST.bracket;
    quoted: typeof AST.bracket;
    raw: (sql: string) => Raw;
    any: typeof Expression.any;
    anyFields: Identifier;
};
export default SQL;
