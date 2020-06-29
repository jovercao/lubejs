import { AST, Parameter, Identifier, Constant, Expression, Statement, Alias, Declare, Invoke, Case, BinaryExpression, UnaryExpression, Variant, Join } from './ast';
export interface Command {
    sql: string;
    params: Parameter[];
}
export interface Parser {
    (ast: AST): Command;
}
/**
 * 兼容
 */
export interface Ployfill {
    /**
     * 标识符引用，左
     */
    quotedLeft: string;
    /**
     * 标识符引用，右
     */
    quotedRight: string;
    /**
     * 参数前缀
     */
    parameterPrefix: string;
    /**
     * 变量前缀
     */
    variantPrefix: string;
    /**
     * 集合别名连接字符，默认为 ''
     */
    setsAliasJoinWith: string;
    /**
     * 字段别名连接字符器，默认为 ''
     */
    fieldAliasJoinWith: string;
}
/**
 * 编译选项
 */
export interface ParserOptions {
    /**
     * 是否启用严格模式，默认启用
     * 如果为false，则生成的SQL标识不会被[]或""包括
     */
    strict: true;
}
/**
 * AST到SQL的编译器
 */
export declare class Parser {
    private _strict;
    readonly ployfill: Ployfill;
    constructor(ployfill: Ployfill, { strict }: {
        strict?: boolean;
    });
    /**
     * 解析标识符
     * @param identifier 标识符
     */
    protected parseIdentifier(identifier: Identifier): string;
    /**
     * 标识符转换，避免关键字被冲突问题
     * @param {string} identifier 标识符
     */
    private quoted;
    /**
     * 向参数列表中添加参数并返回当前参数的参数名
     * @param {array} values 参数列表
     * @param {any} value 参数值
     */
    protected parseParameter(param: Parameter, params: Set<Parameter>): string;
    protected parseVariant(variant: Variant, params: Set<Parameter>): string;
    protected parseConstant(constant: Constant): string;
    protected parse(ast: AST, params: Set<Parameter>): any;
    protected parseStatment(statement: Statement, params: Set<Parameter>): string;
    protected parseAlias(alias: Alias, params: Set<Parameter>): string;
    protected parseCase(caseExpr: Case, params: Set<Parameter>): string;
    protected parseBinaryExpression(expr: BinaryExpression, params: Set<Parameter>): string;
    protected parseUnaryExpression(expr: UnaryExpression, params: Set<Parameter>): string;
    protected parseExpression(expr: Expression, params: Set<Parameter>): string;
    /**
     * 函数调用
     * @param {*} invoke
     * @param {*} params
     * @returns
     * @memberof Executor
     */
    protected parseInvoke(invoke: Invoke, params: any): string;
    protected parseJoins(join: Join, params: any): string;
    /**
     * 编译Where查询条件为Sql
     * @param {*} condition where条件
     * @param {array} params 用于接收参数值的数组
     * @returns string sql 返回Sql字符串
     * @memberof Pool
     */
    protected parseCondition(condition: any, params: any): void;
    protected parseSelectStatement(select: any, params: any): string;
    parseInsertStatement(insert: any, params: any): string;
    parseAssignment(assign: any, params: any): string;
    parseDeclareStatement(declare: Declare, params: Set<Parameter>): string;
    parseUpdateStatement(update: any, params: any): string;
    parseDeleteStatement(del: any, params: any): string;
    /**
     * columns 支持两种格式:
     * 1. array,写法如下： [ field1, [ field2, alias ] ]
     * 2. object, 写法如下： { field1: table1.field, field2: table1.field2 }
     * @param {*} columns
     * @param {*} params
     * @returns
     * @memberof Executor
     */
    _parseColumns(columns: any, params: any): any;
    _parseColumn(ast: any, params: any): string;
}
