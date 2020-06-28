import { Condition, Alias, Parameter, Insert, Update, Constant, Variant, Bracket, Invoke, Identity, Execute, Expressions, UnsureExpressions, UnsureIdentity, JsConstant, AST } from './ast';
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
export declare function invoke(func: any, params: any): Invoke;
export declare function exec(proc: any, params: any): Execute;
/**
 * 标识符
 * @returns
 */
export declare function identity(...names: string[]): string | Identity;
/**
 * 创建一个表格标识
 * @param names 表标识限定，如果有多级，请传多个参数
 * @returns
 * @example table(database, schema, tableName) => Identity
 * @example table(tableName) => Identity
 */
export declare function table(...names: string[]): string | Identity;
/**
 * 字段引用
 * @param name
 * @param table
 * @returns
 */
export declare function field(name: string, table: UnsureIdentity): Identity;
/**
 * 常量表达式
 */
export declare function constant(value: JsConstant): Constant;
/**
 * 括号表达式
 * @param context 括号上下文
 * @returns
 */
export declare function quoted(context: AST): Bracket<AST>;
/**
 * input 参数
 */
export declare function input(name: string, value: UnsureExpressions): Parameter;
/**
 * output参数
 */
export declare function output(name: string, value: UnsureExpressions): Parameter;
/**
 * 变量引用
 * @param name
 * @returns
 */
export declare function variant(name: string): Variant;
/**
 * 创建一个列
 * @static
 * @param name 名称
 * @param exp 当不传递该参数时，默认为字段名
 * @returns 返回列实例
 * @memberof SQL
 */
export declare function alias(exp: Expressions, name: string): Alias<import("./ast").Expression>;
/**
 * 创建一个SELECT SQL对象
 * @static
 * @param columns 列列表
 * @returns
 * @memberof SQL
 */
export declare function select(...columns: UnsureExpressions[]): any;
/**
 * 创建一个insert SQL 对象
 * @static
 * @returns  insert sql 对象
 * @memberof SQL
 */
export declare function insert(table: UnsureIdentity): Insert;
/**
 * 创建一个update sql 对象
 * @static
 * @param tables
 * @param sets
 * @param where
 * @returns
 * @memberof SQL
 */
export declare function update(table: UnsureIdentity): Update;
/**
 * 创建一个delete SQL 对象
 * @static
 * @param table
 * @param where
 * @returns
 * @memberof SQL
 */
export declare function del(table: UnsureIdentity): void;
export declare function allField(): Identity;
export declare function count(exp: UnsureExpressions): Invoke;
export declare function stdev(exp: UnsureExpressions): Invoke;
export declare function sum(exp: UnsureExpressions): Invoke;
export declare function avg(exp: UnsureExpressions): Invoke;
export declare function max(exp: UnsureExpressions): Invoke;
export declare function min(exp: UnsureExpressions): Invoke;
export declare function nvl(exp: UnsureExpressions, defaults: UnsureExpressions): Invoke;
export declare function abs(exp: UnsureExpressions): Invoke;
export declare function ceil(exp: UnsureExpressions): Invoke;
export declare function exp(exp: UnsureExpressions): Invoke;
export declare function square(exp: UnsureExpressions): Invoke;
export declare function floor(exp: UnsureExpressions): Invoke;
export declare function round(exp: UnsureExpressions, digit: UnsureExpressions): Invoke;
export declare function sign(exp: UnsureExpressions): Invoke;
export declare function sqrt(exp: UnsureExpressions): Invoke;
export declare function power(exp: UnsureExpressions, pwr: UnsureExpressions): Invoke;
