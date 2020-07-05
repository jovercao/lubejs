import { AST, Parameter, Identifier, Constant, When, Bracket, Alias, Declare, Delete, Insert, Assignment, Update, Select, Invoke, Case, Variant, Join, IUnary, Execute, IBinary, Union, ValueList, SortInfo } from './ast';
export interface Command {
    sql: string;
    params: Parameter[];
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
     * 输出类型参数
     * 如 mssql: @paramName OUT
     */
    parameterOutWord: string;
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
    /**
     * 返回参数名称
     */
    returnValueParameter: string;
    /**
     * Execute的关键字，在Oracle中无须该关键字，只需留空即可
     */
    executeKeyword: string;
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
    protected parseParameter(param: Parameter, params: Set<Parameter>, isProcParam?: boolean): string;
    properParameterName(p: Parameter, isProcParam?: boolean): string;
    protected properVariantName(name: string): string;
    protected parseVariant(variant: Variant, params: Set<Parameter>): string;
    protected parseDate(date: any): string;
    protected parseConstant(constant: Constant): string;
    parse(ast: AST): Command;
    protected parseAST(ast: AST, params: Set<Parameter>): string;
    protected parseExecute<T extends AST>(exec: Execute, params: Set<Parameter>): string;
    protected parseBracket<T extends AST>(bracket: Bracket<T>, params: Set<Parameter>): string;
    protected parseValueList(values: ValueList, params: Set<Parameter>): string;
    protected parseUnion(union: Union, params: Set<Parameter>): string;
    protected parseAlias(alias: Alias, params: Set<Parameter>): string;
    protected parseCase(caseExpr: Case, params: Set<Parameter>): string;
    protected parseWhen(when: When, params: Set<Parameter>): string;
    protected parseBinary(expr: IBinary, params: Set<Parameter>): string;
    protected parseUnary(expr: IUnary, params: Set<Parameter>): string;
    /**
     * 函数调用
     * @param {*} invoke
     * @param {*} params
     * @returns
     * @memberof Executor
     */
    protected parseInvoke(invoke: Invoke, params: Set<Parameter>): string;
    protected parseJoin(join: Join, params: Set<Parameter>): string;
    protected parseSort(sort: SortInfo, params: Set<Parameter>): string;
    protected parseSelect(select: Select, params: any): string;
    protected parseInsert(insert: Insert, params: Set<Parameter>): string;
    protected parseAssignment(assign: Assignment, params: Set<Parameter>): string;
    protected parseDeclare(declare: Declare, params: Set<Parameter>): string;
    protected parseUpdate(update: Update, params: Set<Parameter>): string;
    protected parseDelete(del: Delete, params: Set<Parameter>): string;
}
