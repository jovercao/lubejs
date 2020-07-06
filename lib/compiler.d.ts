import { AST, Parameter, Identifier, Constant, When, Bracket, Alias, Declare, Delete, Insert, Assignment, Update, Select, Invoke, Case, Variant, Join, IUnary, Execute, IBinary, Union, List, SortInfo } from './ast';
export interface Command {
    sql: string;
    params: Parameter[];
}
/**
 * 编译选项
 */
export interface CompileOptions {
    /**
     * 是否启用严格模式，默认启用
     * 如果为false，则生成的SQL标识不会被[]或""包括
     */
    strict?: boolean;
    /**
     * 标识符引用，左
     */
    quotedLeft?: string;
    /**
     * 标识符引用，右
     */
    quotedRight?: string;
    /**
     * 参数前缀
     */
    parameterPrefix?: string;
    /**
     * 变量前缀
     */
    variantPrefix?: string;
}
export declare const RETURN_VALUE_PARAMETER_NAME: string;
/**
 * AST到SQL的编译器
 */
export declare class Compiler {
    options: CompileOptions;
    constructor(options?: CompileOptions);
    /**
     * 解析标识符
     * @param identifier 标识符
     */
    protected compileIdentifier(identifier: Identifier, params?: Set<Parameter>, parent?: AST): string;
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
    protected compileParameter(param: Parameter, params: Set<Parameter>, parent?: AST): string;
    prepareParameterName(p: Parameter): string;
    protected properVariantName(name: string): string;
    protected compileVariant(variant: Variant, params: Set<Parameter>, parent?: AST): string;
    protected compileDate(date: Date): string;
    protected compileBoolean(value: boolean): "0" | "1";
    protected compileString(value: string): string;
    protected compileConstant(constant: Constant, params?: Set<Parameter>, parent?: AST): string;
    compile(ast: AST): Command;
    protected compileBuildInIdntifier(ast: Identifier, params: Set<Parameter>, parent?: AST): string;
    protected compileAST(ast: AST, params: Set<Parameter>, parent?: AST): string;
    protected compileExecute<T extends AST>(exec: Execute, params: Set<Parameter>, parent?: AST): string;
    protected compileBracket<T extends AST>(bracket: Bracket<T>, params: Set<Parameter>, parent?: AST): string;
    protected compileValueList(values: List, params: Set<Parameter>, parent?: AST): string;
    protected compileColumnList(values: List, params: Set<Parameter>, parent?: AST): string;
    protected compileInvokeArgumentList(values: List, params: Set<Parameter>, parent?: AST): string;
    protected compileExecuteArgumentList(values: List, params: Set<Parameter>, parent?: AST): string;
    protected compileUnion(union: Union, params: Set<Parameter>, parent?: AST): string;
    protected compileAlias(alias: Alias, params: Set<Parameter>, parent?: AST): string;
    protected compileCase(caseExpr: Case, params: Set<Parameter>, parent?: AST): string;
    protected compileWhen(when: When, params: Set<Parameter>, parent?: AST): string;
    protected compileBinary(expr: IBinary, params: Set<Parameter>, parent?: AST): string;
    protected compileUnary(expr: IUnary, params: Set<Parameter>, parent?: AST): string;
    /**
     * 函数调用
     * @param {*} invoke
     * @param {*} params
     * @returns
     * @memberof Executor
     */
    protected compileInvoke(invoke: Invoke, params: Set<Parameter>, parent?: AST): string;
    protected compileJoin(join: Join, params: Set<Parameter>, parent?: AST): string;
    protected compileSort(sort: SortInfo, params: Set<Parameter>, parent?: AST): string;
    protected compileSelect(select: Select, params: any, parent?: AST): string;
    protected compileInsert(insert: Insert, params: Set<Parameter>, parent?: AST): string;
    protected compileAssignment(assign: Assignment, params: Set<Parameter>, parent?: AST): string;
    protected compileDeclare(declare: Declare, params: Set<Parameter>, parent?: AST): string;
    protected compileUpdate(update: Update, params: Set<Parameter>, parent?: AST): string;
    protected compileDelete(del: Delete, params: Set<Parameter>, parent?: AST): string;
}
