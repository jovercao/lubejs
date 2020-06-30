/// <reference types="node" />
import { ComputeOperator, ParameterDirection, SqlSymbol, CompareOperator, SortDirection, LogicOperator } from './constants';
/**
 * JS常量类型
 */
export declare type JsConstant = String | Date | Boolean | null | undefined | Number | Buffer;
/**
 * 带括号的查询条件
 */
export declare type BracketConditions = Bracket<Conditions>;
/**
 * 查询条件列表
 */
export declare type Conditions = Condition | Bracket<Condition | BracketConditions>;
/**
 * 未经确认的表达式
 */
export declare type UnsureExpressions = Expressions | JsConstant;
/**
 * 简化后的whereObject查询条件
 */
export interface WhereObject {
    [field: string]: JsConstant | JsConstant[];
}
export declare type UnsureConditions = Conditions | WhereObject;
export declare type BracketSelectExpressions = Bracket<SelectExpressions>;
/**
 * SELECT查询表达式
 */
export declare type SelectExpressions = Select | Bracket<Select | BracketSelectExpressions>;
export declare type Expressions = SelectExpressions | BracketExpression | Expression;
export declare type UnsureGroupValues = UnsureExpressions[] | Bracket<Expression[]>;
export declare type UnsureIdentity = Identifier | string;
export interface SortInfo {
    expr: Expressions;
    direction: SortDirection;
}
/**
 * AST 基类
 */
export declare abstract class AST {
    constructor(type: SqlSymbol);
    readonly type: SqlSymbol;
}
export interface IExpression {
    /**
     * 加法运算
     */
    add(expr: UnsureExpressions): Expression;
    /**
     * 减法运算
     */
    sub(expr: UnsureExpressions): Expression;
    /**
     * 乘法运算
     * @param expr 要与当前表达式相乘的表达式
     */
    mul(expr: UnsureExpressions): Expression;
    /**
     * 除法运算
     * @param expr 要与当前表达式相除的表达式
     * @returns 返回运算后的表达式
     */
    div(expr: UnsureExpressions): Expression;
    /**
     * 算术运算 %
     * @param expr 要与当前表达式相除的表达式
     * @returns 返回运算后的表达式
     */
    mod(expr: UnsureExpressions): Expression;
    and(expr: UnsureExpressions): Expression;
    or(expr: UnsureExpressions): Expression;
    not(expr: UnsureExpressions): Expression;
    /**
     * 位运算 ^
     * @param expr 要与当前表达式相除的表达式
     * @returns 返回运算后的表达式
     */
    xor(expr: UnsureExpressions): Expression;
    /**
     * 位运算 <<
     * @param expr 要与当前表达式相除的表达式
     * @returns 返回运算后的表达式
     */
    shl(expr: UnsureExpressions): Expression;
    /**
     * 位运算 >>
     * @param expr 要与当前表达式相除的表达式
     * @returns 返回运算后的表达式
     */
    shr(expr: UnsureExpressions): Expression;
    /**
     * 比较是否相等 =
     * @param expr 要与当前表达式相比较的表达式
     * @returns 返回对比条件表达式
     */
    eq(expr: UnsureExpressions): Condition;
    /**
     * 比较是否不等于 <>
     * @param expr 要与当前表达式相比较的表达式
     * @returns 返回对比条件表达式
     */
    neq(expr: UnsureExpressions): Condition;
    /**
     * 比较是否小于 <
     * @param expr 要与当前表达式相比较的表达式
     * @returns 返回对比条件表达式
     */
    lt(expr: UnsureExpressions): Condition;
    /**
     * 比较是否小于等于 <=
     * @param expr 要与当前表达式相比较的表达式
     * @returns 返回对比条件表达式
     */
    lte(expr: UnsureExpressions): Condition;
    /**
     * 比较是否大于 >
     * @param expr 要与当前表达式相比较的表达式
     * @returns 返回对比条件表达式
     */
    gt(expr: UnsureExpressions): Condition;
    /**
     * 比较是否小于等于 >=
     * @param expr 要与当前表达式相比较的表达式
     * @returns 返回对比条件表达式
     */
    gte(expr: UnsureExpressions): Condition;
    /**
     * 比较是相像 LIKE
     * @param expr 要与当前表达式相比较的表达式
     * @returns 返回对比条件表达式
     */
    like(expr: UnsureExpressions): Condition;
    /**
     * 比较是否不想像 NOT LIKE
     * @param expr 要与当前表达式相比较的表达式
     * @returns 返回对比条件表达式
     */
    notLike(expr: UnsureExpressions): Condition;
    /**
     * 比较是否不包含于 IN
     * @param values 要与当前表达式相比较的表达式数组
     * @returns 返回对比条件表达式
     */
    in(...values: UnsureExpressions[]): Condition;
    /**
     * 比较是否不包含于 NOT IN
     * @param values 要与当前表达式相比较的表达式
     * @returns 返回对比条件表达式
     */
    notIn(...values: UnsureExpressions[]): Condition;
    /**
     * 比较是否为空 IS NULL
     * @returns 返回对比条件表达式
     */
    isNull(): Condition;
    /**
     * 比较是否为空 IS NOT NULL
     * @returns 返回对比条件表达式
     */
    isNotNull(): Condition;
    /**
     * isNotNull 的简称别名
     * @returns 返回对比条件表达式
     */
    notNull(): Condition;
    /**
     * 正序
     * @returns 返回对比条件表达式
     */
    asc(): SortInfo;
    /**
     * 倒序
     * @returns 返回对比条件表达式
     */
    desc(): SortInfo;
    /**
     * 为当前表达式添加别名
     */
    as(alias: string): Identifier;
}
/**
 * 表达式基类，抽象类
 */
export declare abstract class Expression extends AST implements IExpression {
    /**
     * 加法运算
     */
    add: (expr: UnsureExpressions) => Expression;
    /**
     * 减法运算
     */
    sub: (expr: UnsureExpressions) => Expression;
    /**
     * 乘法运算
     * @param expr 要与当前表达式相乘的表达式
     */
    mul: (expr: UnsureExpressions) => Expression;
    /**
     * 除法运算
     * @param expr 要与当前表达式相除的表达式
     * @returns 返回运算后的表达式
     */
    div: (expr: UnsureExpressions) => Expression;
    /**
     * 算术运算 %
     * @param expr 要与当前表达式相除的表达式
     * @returns 返回运算后的表达式
     */
    mod: (expr: UnsureExpressions) => Expression;
    /**
     * 位运算 &
     * @param expr 要与当前表达式相除的表达式
     * @returns 返回运算后的表达式
     */
    and: (expr: UnsureExpressions) => Expression;
    /**
   * 位运算 |
   * @param expr 要与当前表达式相除的表达式
   * @returns 返回运算后的表达式
   */
    or: (expr: UnsureExpressions) => Expression;
    /**
     * 位运算 ~
     * @param expr 要与当前表达式相除的表达式
     * @returns 返回运算后的表达式
     */
    not: (expr: UnsureExpressions) => Expression;
    /**
     * 位运算 ^
     * @param expr 要与当前表达式相除的表达式
     * @returns 返回运算后的表达式
     */
    xor: (expr: UnsureExpressions) => Expression;
    /**
     * 位运算 <<
     * @param expr 要与当前表达式相除的表达式
     * @returns 返回运算后的表达式
     */
    shl: (expr: UnsureExpressions) => Expression;
    /**
     * 位运算 >>
     * @param expr 要与当前表达式相除的表达式
     * @returns 返回运算后的表达式
     */
    shr: (expr: UnsureExpressions) => Expression;
    /**
     * 比较是否相等 =
     * @param expr 要与当前表达式相比较的表达式
     * @returns 返回对比条件表达式
     */
    eq: (expr: UnsureExpressions) => Condition;
    /**
     * 比较是否不等于 <>
     * @param expr 要与当前表达式相比较的表达式
     * @returns 返回对比条件表达式
     */
    neq: (expr: UnsureExpressions) => Condition;
    /**
     * 比较是否小于 <
     * @param expr 要与当前表达式相比较的表达式
     * @returns 返回对比条件表达式
     */
    lt: (expr: UnsureExpressions) => Condition;
    /**
     * 比较是否小于等于 <=
     * @param expr 要与当前表达式相比较的表达式
     * @returns 返回对比条件表达式
     */
    lte: (expr: UnsureExpressions) => Condition;
    /**
     * 比较是否大于 >
     * @param expr 要与当前表达式相比较的表达式
     * @returns 返回对比条件表达式
     */
    gt: (expr: UnsureExpressions) => Condition;
    /**
     * 比较是否小于等于 >=
     * @param expr 要与当前表达式相比较的表达式
     * @returns 返回对比条件表达式
     */
    gte: (expr: UnsureExpressions) => Condition;
    /**
     * 比较是相像 LIKE
     * @param expr 要与当前表达式相比较的表达式
     * @returns 返回对比条件表达式
     */
    like: (expr: UnsureExpressions) => Condition;
    /**
     * 比较是否不想像 NOT LIKE
     * @param expr 要与当前表达式相比较的表达式
     * @returns 返回对比条件表达式
     */
    notLike: (expr: UnsureExpressions) => Condition;
    /**
     * 比较是否不包含于 IN
     * @param values 要与当前表达式相比较的表达式数组
     * @returns 返回对比条件表达式
     */
    in: (...values: UnsureExpressions[]) => Condition;
    /**
     * 比较是否不包含于 NOT IN
     * @param values 要与当前表达式相比较的表达式
     * @returns 返回对比条件表达式
     */
    notIn: (...values: UnsureExpressions[]) => Condition;
    /**
     * 比较是否为空 IS NULL
     * @returns 返回对比条件表达式
     */
    isNull: () => Condition;
    /**
     * 比较是否为空 IS NOT NULL
     * @returns 返回对比条件表达式
     */
    isNotNull: () => Condition;
    /**
     * isNotNull 的简称别名
     * @returns 返回对比条件表达式
     */
    notNull: () => Condition;
    /**
     * 正序
     * @returns 返回对比条件表达式
     */
    asc: () => SortInfo;
    /**
     * 倒序
     * @returns 返回对比条件表达式
     */
    desc: () => SortInfo;
    /**
     * 为当前表达式添加别名
     */
    as: (alias: string) => Identifier;
    /**
     * 获取当前表达式是否为左值
     * @type {boolean}
     */
    abstract get lvalue(): boolean;
    /**
     * 算术运算 +
     * @param left 左值
     * @param right 右值
     * @returns 返回算术运算表达式
     */
    static add(left: any, right: any): BinaryExpression;
    /**
     * 算术运算 -
     * @param left 左值
     * @param right 右值
     * @returns 返回算术运算表达式
     */
    static sub(left: any, right: any): BinaryExpression;
    /**
     * 算术运算 *
     * @param left 左值
     * @param right 右值
     * @returns 返回算术运算表达式
     */
    static mul(left: any, right: any): BinaryExpression;
    /**
     * 算术运算 /
     * @param left 左值
     * @param right 右值
     * @returns 返回算术运算表达式
     */
    static div(left: any, right: any): BinaryExpression;
    /**
     * 算术运算 %
     * @param left 左值
     * @param right 右值
     * @returns 返回算术运算表达式
     */
    static mod(left: any, right: any): BinaryExpression;
    /**
     * 位算术运算 &
     * @param left 左值
     * @param right 右值
     * @returns 返回算术运算表达式
     */
    static and(left: any, right: any): BinaryExpression;
    /**
     * 位算术运算 |
     * @param left 左值
     * @param right 右值
     * @returns 返回算术运算表达式
     */
    static or(left: any, right: any): BinaryExpression;
    /**
     * 位算术运算 ^
     * @param left 左值
     * @param right 右值
     * @returns 返回算术运算表达式
     */
    static xor(left: any, right: any): BinaryExpression;
    /**
     * 位算术运算 ~
     * @param left 左值
     * @param right 右值
     * @returns 返回算术运算表达式
     */
    static not(left: any, right: any): BinaryExpression;
    /**
     * 位算术运算 <<
     * @param left 左值
     * @param right 右值
     * @returns 返回算术运算表达式
     */
    static shl(left: any, right: any): BinaryExpression;
    /**
     * 位算术运算 >>
     * @param left 左值
     * @param right 右值
     * @returns 返回算术运算表达式
     */
    static shr(left: any, right: any): BinaryExpression;
    /**
     * CASE语句表达式
     * @param expr 表达式
     */
    static case(expr: UnsureExpressions): Case;
    /**
     * 常量
     * @param value 常量值
     */
    static constant(value: JsConstant): Constant;
    /**
     * 常量，constant 的别名
     * @param value 常量值
     */
    static const(value: JsConstant): Constant;
    /**
     * 变量
     * @param name 变量名称，不需要带前缀
     */
    static variant(name: string): Variant;
    /**
     * 变量，variant的别名
     * @param name 变量名，不需要带前缀
     */
    static var(name: string): Variant;
    /**
     * 括号引用
     * @param context 括号引用
     */
    static quoted(context: Expressions): BracketExpression;
    static alias(expr: Expressions, name: string): Alias;
    /**
     * 任意字段 *
     * @param parent parent identifier
     */
    static any(parent?: UnsureIdentity): AnyIdentifier;
    /**
     * 标识符
     */
    static identifier(...names: string[]): Identifier;
    /**
     * 代理化的identifier，可以自动接受字段名
     * @param name
     */
    static proxyIdentifier(name: UnsureIdentity): Identifier;
    /**
     * 创建表对象，该对象是可代理的，可以直接以 . 运算符获取下一节点Identifier
     * @param names
     */
    static table(...names: string[]): Identifier;
    /**
     * 字段，实为 identifier(...names) 别名
     * @param names
     */
    static field(...names: string[]): Identifier;
    /**
     * 调用表达式
     * @param func 函数
     * @param params 参数
     */
    static invoke(func: UnsureIdentity, params: (Expressions | JsConstant)[]): Invoke;
}
export interface ICondition {
    /**
     * and连接
     * @param condition 下一个查询条件
     * @returns 返回新的查询条件
     */
    and(condition: Conditions): Condition;
    /**
     * OR语句
     * @param condition
     * @returns 返回新的查询条件
     */
    or(condition: Conditions): Condition;
}
/**
 * 查询条件
 */
export declare abstract class Condition extends AST implements ICondition {
    /**
     * and连接
     * @param condition 下一个查询条件
     * @returns 返回新的查询条件
     */
    and: (condition: Conditions) => Condition;
    /**
     * OR语句
     * @param condition
     * @returns 返回新的查询条件
     */
    or: (condition: Conditions) => Condition;
    /**
     * 将多个查询条件通过 AND 合并成一个大查询条件
     * @static
     * @param conditions 查询条件列表
     * @returns 返回逻辑表达式
     */
    static and(...conditions: Conditions[]): Conditions;
    /**
     * 将多个查询条件通过 OR 合并成一个
     * @static
     * @param conditions 查询条件列表
     * @returns 返回逻辑表达式
     */
    static or(...conditions: Conditions[]): Conditions;
    /**
     * Not 逻辑运算
     * @param condition
     */
    static not(condition: Conditions): UnaryLogicCondition;
    /**
     * 判断是否存在
     * @param select 查询语句
     */
    static exists(select: SelectExpressions): UnaryCompareCondition;
    /**
     * 比较运算
     * @private
     * @param left 左值
     * @param right 右值
     * @param operator 运算符
     * @returns 返回比较运算对比条件
     */
    static compare(left: UnsureExpressions, right: UnsureExpressions, operator?: CompareOperator): BinaryCompareCondition;
    /**
     * 比较运算 =
     * @param left 左值
     * @param right 右值
     * @returns 返回比较运算对比条件
     */
    static eq(left: UnsureExpressions, right: UnsureExpressions): BinaryCompareCondition;
    /**
     * 比较运算 <>
     * @param left 左值
     * @param right 右值
     * @returns 返回比较运算对比条件
     */
    static neq(left: UnsureExpressions, right: UnsureExpressions): BinaryCompareCondition;
    /**
     * 比较运算 <
     * @param left 左值
     * @param right 右值
     * @returns 返回比较运算对比条件
     */
    static lt(left: UnsureExpressions, right: UnsureExpressions): BinaryCompareCondition;
    /**
     * 比较运算 <=
     * @param left 左值
     * @param right 右值
     * @returns 返回比较运算对比条件
     */
    static lte(left: UnsureExpressions, right: UnsureExpressions): BinaryCompareCondition;
    /**
     * 比较运算 >
     * @param left 左值
     * @param right 右值
     * @returns 返回比较运算对比条件
     */
    static gt(left: UnsureExpressions, right: UnsureExpressions): BinaryCompareCondition;
    /**
     * 比较运算 >=
     * @param left 左值
     * @param right 右值
     * @returns 返回比较运算对比条件
     */
    static gte(left: UnsureExpressions, right: UnsureExpressions): BinaryCompareCondition;
    /**
     * 比较运算 LIKE
     * @param left 左值
     * @param right 右值
     * @returns 返回比较运算对比条件
     */
    static like(left: UnsureExpressions, right: UnsureExpressions): BinaryCompareCondition;
    /**
     * 比较运算 NOT LIKE
     * @param left 左值
     * @param right 右值
     * @returns 返回比较运算对比条件
     */
    static notLike(left: UnsureExpressions, right: UnsureExpressions): BinaryCompareCondition;
    /**
     * 比较运算 IN
     * @param left 左值
     * @param values 要比较的值列表
     * @returns 返回比较运算对比条件
     */
    static in(left: UnsureExpressions, values: UnsureGroupValues): BinaryCompareCondition;
    /**
     * 比较运算 NOT IN
     * @param left 左值
     * @param values 要比较的值列表
     * @returns 返回比较运算对比条件
     */
    static notIn(left: UnsureExpressions, values: UnsureGroupValues): BinaryCompareCondition;
    /**
     * 比较运算 IS NULL
     * @returns 返回比较运算符
     * @param expr 表达式
     */
    static isNull(expr: UnsureExpressions): IsNullCondition;
    /**
     * 比较运算 IS NOT NULL
     * @param expr 表达式
     * @returns 返回比较运算符
     */
    static isNotNull(expr: UnsureExpressions): IsNotNullCondition;
    /**
     * 括号条件
     * @param condition 查询条件
     */
    static quoted(condition: Conditions): BracketCondition;
}
/**
 * 二元逻辑查询条件条件
 */
export declare class BinaryLogicCondition extends Condition implements IBinary {
    operator: LogicOperator;
    left: Conditions;
    right: Conditions;
    /**
     * 创建二元逻辑查询条件实例
     */
    constructor(operator: LogicOperator, left: UnsureConditions, right: UnsureConditions);
}
/**
 * 一元逻辑查询条件
 */
declare class UnaryLogicCondition extends Condition implements IUnary {
    operator: LogicOperator;
    next: Conditions;
    /**
     * 创建一元逻辑查询条件实例
     * @param operator
     * @param next
     */
    constructor(operator: any, next: any);
}
/**
 * 二元比较条件
 */
declare class BinaryCompareCondition extends Condition {
    left: Expressions;
    right: Expressions;
    operator: CompareOperator;
    /**
     * 构造函数
     */
    constructor(operator: CompareOperator, left: UnsureExpressions, right: UnsureExpressions);
}
/**
 * 一元比较条件
 */
declare class UnaryCompareCondition extends Condition implements IUnary {
    next: Expressions;
    operator: CompareOperator;
    /**
     * 一元比较运算符
     * @param operator 运算符
     * @param expr 查询条件
     */
    constructor(operator: CompareOperator, expr: UnsureExpressions);
}
/**
 * IS NULL 运算
 */
declare class IsNullCondition extends UnaryCompareCondition {
    /**
     * @param next 表达式
     */
    constructor(next: UnsureExpressions);
}
/**
 * 是否为空值条件
 */
declare class IsNotNullCondition extends UnaryLogicCondition {
    /**
     * 是否空值
     * @param next 表达式
     */
    constructor(next: UnsureExpressions);
}
/**
 * 联接查询
 */
export declare class Join extends AST {
    readonly type: SqlSymbol;
    left: boolean;
    table: Identifier;
    on: Conditions;
    /**
     * 创建一个表关联
     * @param table
     * @param on 关联条件
     * @param left 是否左联接
     */
    constructor(table: UnsureIdentity, on: Conditions, left?: boolean);
}
export declare class Raw extends AST {
    sql: string;
    constructor(sql: string);
}
/**
 * 标识符，可以多级，如表名等
 */
export declare class Identifier extends Expression {
    readonly name: string;
    readonly parent?: Identifier;
    readonly special: boolean;
    /**
     * 标识符
     */
    constructor(name: string, parent?: UnsureIdentity, type?: SqlSymbol);
    get lvalue(): boolean;
    /**
     * 访问下一节点
     * @param name
     */
    dot(name: string): Identifier;
    field(name: string): Identifier;
    any(): AnyIdentifier;
    /**
     * 执行一个函数
     * @param params
     */
    invoke(...params: (UnsureExpressions)[]): Invoke;
}
export declare class AnyIdentifier extends Identifier {
    constructor(parent: UnsureIdentity);
}
export declare class Variant extends Expression {
    name: string;
    constructor(name: string);
    get lvalue(): boolean;
}
/**
 * 别名表达式
 */
export declare class Alias extends Identifier {
    /**
     * 表达式
     */
    readonly expr: Expressions;
    /**
     * 别名构造函数
     * @param expr 表达式或表名
     * @param name 别名
     */
    constructor(expr: UnsureExpressions, name: string);
}
/**
 * 函数调用表达式
 */
export declare class Invoke extends Expression {
    get lvalue(): boolean;
    func: Identifier;
    params: Expressions[];
    /**
     * 函数调用
     */
    constructor(func: UnsureIdentity, params: UnsureExpressions[]);
}
/**
 * SQL 语句
 */
export declare abstract class Statement extends AST {
    /**
     * 插入至表,into的别名
     * @param table
     * @param fields
     */
    static insert(table: UnsureIdentity, fields?: UnsureIdentity[]): Insert;
    /**
     * 更新一个表格
     * @param table
     */
    static update(table: UnsureIdentity): Update;
    /**
     * 删除一个表格
     * @param table 表格
     */
    static delete(table: UnsureIdentity): Delete;
    /**
     * 删除一个表格，delete的别名
     * @param table 表格
     */
    static del(table: UnsureIdentity): Delete;
    /**
     * 选择列
     */
    static select(columns: KeyValueObject): Select;
    static select(columns: KeyValueObject): Select;
    static select(...columns: UnsureExpressions[]): Select;
    /**
     * 执行一个存储过程
     * @param proc
     * @param params
     */
    static execute(proc: UnsureIdentity, params: UnsureExpressions[]): any;
    static execute(proc: UnsureIdentity, params: Parameter[]): any;
    /**
     * 执行一个存储过程，execute的别名
     * @param proc 存储过程
     * @param params 参数
     */
    static exec(proc: UnsureIdentity, params: UnsureExpressions[]): any;
    static exec(proc: UnsureIdentity, params: Parameter[]): any;
    /**
     * 赋值语句
     * @param left 左值
     * @param right 右值
     */
    static assign(left: Expression, right: UnsureExpressions): Assignment;
    /**
     * 变量声明
     * @param declares 变量列表
     */
    static declare(...declares: any[]): Declare;
    /**
     * WHEN 语句块
     * @param expr
     * @param value
     */
    static when(expr: UnsureExpressions, value?: UnsureExpressions): When;
}
/**
 * When语句
 */
export declare class When extends AST {
    expr: Expressions;
    value: Expressions;
    constructor(expr: UnsureExpressions, value?: UnsureExpressions);
    then(value: UnsureExpressions): void;
}
/**
 * CASE表达式
 */
export declare class Case extends Expression {
    get lvalue(): boolean;
    expr: Expressions;
    whens: When[];
    defaults?: Expressions;
    /**
     *
     * @param expr
     */
    constructor(expr: UnsureExpressions);
    /**
     * ELSE语句
     * @param defaults
     */
    else(defaults: any): void;
    /**
     * WHEN语句
     * @param expr
     * @param then
     */
    when(expr: UnsureExpressions, then: any): void;
}
/**
 * 常量表达式
 */
export declare class Constant extends Expression {
    get lvalue(): boolean;
    /**
     * 实际值
     */
    value: JsConstant;
    constructor(value: JsConstant);
}
/**
 * 括号引用
 */
export declare class Bracket<T> extends AST {
    /**
     * 表达式
     */
    context: T;
    constructor(context: T);
}
export declare class BracketExpression extends Bracket<Expressions> implements IExpression {
    /**
     * 加法运算
     */
    add: (expr: UnsureExpressions) => Expression;
    /**
     * 减法运算
     */
    sub: (expr: UnsureExpressions) => Expression;
    /**
     * 乘法运算
     * @param expr 要与当前表达式相乘的表达式
     */
    mul: (expr: UnsureExpressions) => Expression;
    /**
     * 除法运算
     * @param expr 要与当前表达式相除的表达式
     * @returns 返回运算后的表达式
     */
    div: (expr: UnsureExpressions) => Expression;
    /**
     * 算术运算 %
     * @param expr 要与当前表达式相除的表达式
     * @returns 返回运算后的表达式
     */
    mod: (expr: UnsureExpressions) => Expression;
    and: (expr: UnsureExpressions) => Expression;
    or: (expr: UnsureExpressions) => Expression;
    not: (expr: UnsureExpressions) => Expression;
    /**
     * 位运算 ^
     * @param expr 要与当前表达式相除的表达式
     * @returns 返回运算后的表达式
     */
    xor: (expr: UnsureExpressions) => Expression;
    /**
     * 位运算 <<
     * @param expr 要与当前表达式相除的表达式
     * @returns 返回运算后的表达式
     */
    shl: (expr: UnsureExpressions) => Expression;
    /**
     * 位运算 >>
     * @param expr 要与当前表达式相除的表达式
     * @returns 返回运算后的表达式
     */
    shr: (expr: UnsureExpressions) => Expression;
    /**
     * 比较是否相等 =
     * @param expr 要与当前表达式相比较的表达式
     * @returns 返回对比条件表达式
     */
    eq: (expr: UnsureExpressions) => Condition;
    /**
     * 比较是否不等于 <>
     * @param expr 要与当前表达式相比较的表达式
     * @returns 返回对比条件表达式
     */
    neq: (expr: UnsureExpressions) => Condition;
    /**
     * 比较是否小于 <
     * @param expr 要与当前表达式相比较的表达式
     * @returns 返回对比条件表达式
     */
    lt: (expr: UnsureExpressions) => Condition;
    /**
     * 比较是否小于等于 <=
     * @param expr 要与当前表达式相比较的表达式
     * @returns 返回对比条件表达式
     */
    lte: (expr: UnsureExpressions) => Condition;
    /**
     * 比较是否大于 >
     * @param expr 要与当前表达式相比较的表达式
     * @returns 返回对比条件表达式
     */
    gt: (expr: UnsureExpressions) => Condition;
    /**
     * 比较是否小于等于 >=
     * @param expr 要与当前表达式相比较的表达式
     * @returns 返回对比条件表达式
     */
    gte: (expr: UnsureExpressions) => Condition;
    /**
     * 比较是相像 LIKE
     * @param expr 要与当前表达式相比较的表达式
     * @returns 返回对比条件表达式
     */
    like: (expr: UnsureExpressions) => Condition;
    /**
     * 比较是否不想像 NOT LIKE
     * @param expr 要与当前表达式相比较的表达式
     * @returns 返回对比条件表达式
     */
    notLike: (expr: UnsureExpressions) => Condition;
    /**
     * 比较是否不包含于 IN
     * @param values 要与当前表达式相比较的表达式数组
     * @returns 返回对比条件表达式
     */
    in: (...values: UnsureExpressions[]) => Condition;
    /**
     * 比较是否不包含于 NOT IN
     * @param values 要与当前表达式相比较的表达式
     * @returns 返回对比条件表达式
     */
    notIn: (...values: UnsureExpressions[]) => Condition;
    /**
     * 比较是否为空 IS NULL
     * @returns 返回对比条件表达式
     */
    isNull: () => Condition;
    /**
     * 比较是否为空 IS NOT NULL
     * @returns 返回对比条件表达式
     */
    isNotNull: () => Condition;
    /**
     * isNotNull 的简称别名
     * @returns 返回对比条件表达式
     */
    notNull: () => Condition;
    /**
     * 正序
     * @returns 返回对比条件表达式
     */
    asc: () => SortInfo;
    /**
     * 倒序
     * @returns 返回对比条件表达式
     */
    desc: () => SortInfo;
    /**
     * 为当前表达式添加别名
     */
    as: (alias: string) => Alias;
}
export declare class BracketCondition extends Bracket<Conditions> implements ICondition {
    /**
     * and连接
     * @param condition 下一个查询条件
     * @returns 返回新的查询条件
     */
    and: (condition: any) => Condition;
    /**
     * OR语句
     * @param condition
     * @returns 返回新的查询条件
     */
    or: (condition: any) => Condition;
    /**
     * 返回括号表达式
     */
    quoted: () => Bracket<Conditions>;
}
export interface IBinary {
    operator: String;
    left: AST;
    right: AST;
}
export interface IUnary {
    operator: String;
    next: AST;
}
/**
 * 二元运算表达式
 */
export declare class BinaryExpression extends Expression implements IBinary {
    get lvalue(): boolean;
    operator: ComputeOperator;
    left: Expressions;
    right: Expressions;
    /**
     * 名称
     * @param operator 运算符
     * @param left 左值
     * @param right 右值
     */
    constructor(operator: ComputeOperator, left: UnsureExpressions, right: UnsureExpressions);
}
/**
 * - 运算符
 */
export declare class UnaryExpression extends Expression implements IUnary {
    operator: ComputeOperator;
    next: Expressions;
    readonly type: SqlSymbol;
    get lvalue(): boolean;
    /**
     * 一元运算目前只支持负数运算符
     * @param expr
     */
    constructor(operator: ComputeOperator, expr: UnsureExpressions);
}
/**
 * 联接查询
 */
export declare class Union extends AST {
    select: SelectExpressions;
    all: boolean;
    /**
     *
     * @param select SELECT语句
     * @param all 是否所有查询
     */
    constructor(select: any, all: any);
}
export interface SortObject {
    [key: string]: SortDirection;
}
export declare abstract class Fromable extends Statement {
    tables?: Identifier[];
    joins?: Join[];
    filters?: Conditions;
    /**
     * 从表中查询，可以查询多表
     * @param tables
     */
    from(...tables: any[]): this;
    /**
     * 表联接
     * @param table
     * @param on
     * @param left
     * @memberof Select
     */
    join(table: UnsureIdentity, on: Conditions, left?: boolean): this;
    /**
     * 左联接
     * @param table
     * @param on
     */
    leftJoin(table: UnsureIdentity, on: Conditions): this;
    /**
     * where查询条件
     * @param condition
     */
    where(condition: UnsureConditions): this;
}
/**
 * SELECT查询
 */
export declare class Select extends Fromable {
    tops?: number;
    offsets?: number;
    limits?: number;
    isDistinct?: boolean;
    columns: Expressions[];
    sorts?: SortInfo[];
    groups?: Expressions[];
    havings?: Conditions;
    unions?: Union;
    constructor(columns: object);
    constructor(...columns: UnsureExpressions[]);
    constructor(...columns: (object | UnsureConditions)[]);
    /**
     * 去除重复的
     */
    distinct(): this;
    /**
     * TOP
     * @param rows 行数
     */
    top(rows: any): this;
    /**
     * order by 排序
     * @param sorts 排序信息
     */
    orderBy(sorts: SortObject): this;
    orderBy(...sorts: (SortInfo | UnsureExpressions)[]): this;
    /**
     * 分组查询
     * @param groups
     */
    groupBy(...groups: UnsureExpressions[]): this;
    /**
     * Having 子句
     * @param condition
     */
    having(condition: any): this;
    /**
     * 偏移数
     * @param rows
     */
    offset(rows: any): this;
    /**
     * 限定数
     * @param rows
     */
    limit(rows: any): this;
    /**
     * 合并查询
     */
    union(select: SelectExpressions, all?: boolean): void;
    unionAll(select: SelectExpressions): void;
    /**
     * 将本SELECT返回表达式
     * @returns 返回一个加()后的SELECT语句
     */
    quoted(): BracketExpression;
    /**
     * 将本次查询，转换为Table行集
     * @param alias
     */
    as(alias: any): Alias;
}
/**
 * Insert 语句
 */
export declare class Insert extends Statement {
    table: Identifier;
    fields: Identifier[];
    rows: Expressions[][] | Select;
    /**
     * 构造函数
     */
    constructor(table: UnsureIdentity, fields?: UnsureIdentity[]);
    /**
     * 字段列表
     * @param  {string[]|Field[]} fields
     */
    private _fields;
    values(select: Select): this;
    values(row: ValuesObject): this;
    values(row: UnsureExpressions[]): this;
    values(...rows: UnsureExpressions[][]): this;
    values(...rows: ValuesObject[]): this;
}
export interface KeyValueObject {
    [field: string]: UnsureExpressions;
}
export declare type ValuesObject = KeyValueObject;
export declare type AssignObject = KeyValueObject;
export declare class Update extends Fromable {
    table: Identifier;
    sets: Assignment[];
    constructor(table: UnsureIdentity);
    /**
     * @param sets
     */
    set(sets: AssignObject): this;
    set(...sets: Assignment[]): this;
}
export declare class Delete extends Fromable {
    table: Identifier;
    constructor(table: UnsureIdentity);
}
/**
 * 存储过程执行
 */
export declare class Execute extends Statement {
    proc: Identifier;
    params: Expressions[] | Parameter[];
    constructor(proc: UnsureIdentity, params: UnsureExpressions[]);
    constructor(proc: UnsureIdentity, params: Parameter[]);
    constructor(proc: UnsureIdentity, params: UnsureExpressions[] | Parameter[]);
}
/**
 * 赋值语句
 */
export declare class Assignment extends Statement {
    left: Expression;
    right: Expressions;
    constructor(left: Expression, right: UnsureExpressions);
}
declare class VariantDeclare extends AST {
    constructor(name: string, dataType: string);
    name: string;
    dataType: string;
}
/**
 * 声明语句，暂时只支持变量声明
 */
export declare class Declare extends Statement {
    declares: VariantDeclare[];
    constructor(...declares: VariantDeclare[]);
}
/**
 * 程序与数据库间传递值所使用的参数
 */
export declare class Parameter extends Expression {
    name?: string;
    private _value?;
    direction: ParameterDirection;
    get lvalue(): boolean;
    get value(): JsConstant;
    set value(value: JsConstant);
    constructor(name: string, value: JsConstant);
    constructor(name: string, value: JsConstant, direction: ParameterDirection);
    /**
     * input 参数
     */
    static input(name: string, value: JsConstant): Parameter;
    /**
     * output参数
     */
    static output(name: string, value: JsConstant): Parameter;
}
/**
 * SQL 文档
 */
export declare class Document extends AST {
    statements: Statement[];
    constructor(...statements: Statement[]);
}
export {};
