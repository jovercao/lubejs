/// <reference types="node" />
import { COMPUTE_OPERATOR, PARAMETER_DIRECTION, SQL_SYMBOLE, COMPARE_OPERATOR, SORT_DIRECTION, LOGIC_OPERATOR } from './constants';
/**
 * JS常量类型
 */
export declare type JsConstant = string | Date | boolean | null | number | Buffer | bigint;
/**
 * 未经确认的表达式
 */
export declare type UnsureExpression = Expression | JsConstant;
/**
 * 简化后的whereObject查询条件
 */
export interface WhereObject {
    [field: string]: Expression | JsConstant | JsConstant[];
}
export declare type UnsureCondition = Condition | WhereObject;
export declare type SelectExpression = Bracket<Select>;
/**
 * SELECT查询表达式
 */
export declare type UnsureSelectExpressions = Select | Bracket<Select>;
/**
 * 组数据
 */
export declare type UnsureGroupValues = UnsureExpression[] | List;
export declare type UnsureIdentifier = Identifier | string;
export declare type ProxiedIdentifier = Identifier & {
    [field: string]: Identifier;
};
/**
 * AST 基类
 */
export declare abstract class AST {
    constructor(type: SQL_SYMBOLE);
    readonly type: SQL_SYMBOLE;
    static bracket<T extends AST>(context: T): Bracket<T>;
}
/**
 * 表达式基类，抽象类
 */
export declare abstract class Expression extends AST {
    /**
     * 加法运算
     */
    add(expr: UnsureExpression): BinaryExpression;
    /**
     * 减法运算
     */
    sub(expr: UnsureExpression): BinaryExpression;
    /**
     * 乘法运算
     * @param expr 要与当前表达式相乘的表达式
     */
    mul(expr: UnsureExpression): BinaryExpression;
    /**
     * 除法运算
     * @param expr 要与当前表达式相除的表达式
     * @returns 返回运算后的表达式
     */
    div(expr: UnsureExpression): BinaryExpression;
    /**
     * 算术运算 %
     * @param expr 要与当前表达式相除的表达式
     * @returns 返回运算后的表达式
     */
    mod(expr: UnsureExpression): BinaryExpression;
    /**
     * 位运算 &
     * @param expr 要与当前表达式相除的表达式
     * @returns 返回运算后的表达式
     */
    and(expr: UnsureExpression): BinaryExpression;
    /**
     * 位运算 |
     * @param expr 要与当前表达式相除的表达式
     * @returns 返回运算后的表达式
     */
    or(expr: UnsureExpression): BinaryExpression;
    /**
     * 位运算 ~
     * @param expr 要与当前表达式相除的表达式
     * @returns 返回运算后的表达式
     */
    not(expr: UnsureExpression): BinaryExpression;
    /**
     * 位运算 ^
     * @param expr 要与当前表达式相除的表达式
     * @returns 返回运算后的表达式
     */
    xor(expr: UnsureExpression): BinaryExpression;
    /**
     * 位运算 <<
     * @param expr 要与当前表达式相除的表达式
     * @returns 返回运算后的表达式
     */
    shl(expr: UnsureExpression): BinaryExpression;
    /**
     * 位运算 >>
     * @param expr 要与当前表达式相除的表达式
     * @returns 返回运算后的表达式
     */
    shr(expr: UnsureExpression): BinaryExpression;
    /**
     * 比较是否相等 =
     * @param expr 要与当前表达式相比较的表达式
     * @returns 返回对比条件表达式
     */
    eq(expr: UnsureExpression): BinaryCompareCondition;
    /**
     * 比较是否不等于 <>
     * @param expr 要与当前表达式相比较的表达式
     * @returns 返回对比条件表达式
     */
    neq(expr: UnsureExpression): BinaryCompareCondition;
    /**
     * 比较是否小于 <
     * @param expr 要与当前表达式相比较的表达式
     * @returns 返回对比条件表达式
     */
    lt(expr: UnsureExpression): BinaryCompareCondition;
    /**
     * 比较是否小于等于 <=
     * @param expr 要与当前表达式相比较的表达式
     * @returns 返回对比条件表达式
     */
    lte(expr: UnsureExpression): BinaryCompareCondition;
    /**
     * 比较是否大于 >
     * @param expr 要与当前表达式相比较的表达式
     * @returns 返回对比条件表达式
     */
    gt(expr: UnsureExpression): BinaryCompareCondition;
    /**
     * 比较是否小于等于 >=
     * @param expr 要与当前表达式相比较的表达式
     * @returns 返回对比条件表达式
     */
    gte(expr: UnsureExpression): BinaryCompareCondition;
    /**
     * 比较是相像 LIKE
     * @param expr 要与当前表达式相比较的表达式
     * @returns 返回对比条件表达式
     */
    like(expr: UnsureExpression): BinaryCompareCondition;
    /**
     * 比较是否不想像 NOT LIKE
     * @param expr 要与当前表达式相比较的表达式
     * @returns 返回对比条件表达式
     */
    notLike(expr: UnsureExpression): BinaryCompareCondition;
    /**
     * 比较是否不包含于 IN
     * @param values 要与当前表达式相比较的表达式数组
     * @returns 返回对比条件表达式
     */
    in(...values: UnsureExpression[]): BinaryCompareCondition;
    /**
     * 比较是否不包含于 NOT IN
     * @param values 要与当前表达式相比较的表达式
     * @returns 返回对比条件表达式
     */
    notIn(...values: UnsureExpression[]): BinaryCompareCondition;
    /**
     * 比较是否为空 IS NULL
     * @returns 返回对比条件表达式
     */
    isNull(): IsNullCondition;
    /**
     * 比较是否为空 IS NOT NULL
     * @returns 返回对比条件表达式
     */
    isNotNull(): IsNotNullCondition;
    /**
     * isNotNull 的简称别名
     * @returns 返回对比条件表达式
     */
    notNull(): IsNotNullCondition;
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
    as(alias: string): ProxiedIdentifier;
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
    static alias(expr: Expression, name: string): Alias;
    /**
     * 任意字段 *
     * @param parent parent identifier
     */
    static any(parent?: UnsureIdentifier): Identifier;
    /**
     * 标识符
     */
    static identifier(...names: string[]): Identifier;
    ProxiedIdentify: any;
    /**
     * 代理化的identifier，可以自动接受字段名
     * @param name
     */
    static proxiedIdentifier(name: UnsureIdentifier): ProxiedIdentifier;
    /**
     * 创建表对象，该对象是可代理的，可以直接以 . 运算符获取下一节点Identifier
     * @param names
     */
    static table(...names: string[]): ProxiedIdentifier;
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
    static invoke(func: UnsureIdentifier, params: (Expression | JsConstant)[]): Invoke;
}
export interface ICondition {
    /**
     * and连接
     * @param condition 下一个查询条件
     * @returns 返回新的查询条件
     */
    and(condition: Condition): Condition;
    /**
     * and连接，并在被连接的条件中加上括号 ()
     * @param condition 下一个查询条件
     * @returns 返回新的查询条件
     */
    andGroup(condition: Condition): Condition;
    /**
     * OR语句
     * @param condition
     * @returns 返回新的查询条件
     */
    or(condition: Condition): Condition;
    /**
     * or 连接，并在被连接的条件中加上括号 ()
     * @param condition
     * @returns 返回新的查询条件
     */
    orGroup(condition: Condition): Condition;
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
    and: (condition: Condition) => Condition;
    /**
     * and连接，并在被连接的条件中加上括号 ()
     * @param condition 下一个查询条件
     * @returns 返回新的查询条件
     */
    andGroup: (condition: Condition) => Condition;
    /**
     * OR语句
     * @param condition
     * @returns 返回新的查询条件
     */
    or: (condition: Condition) => Condition;
    /**
     * or 连接，并在被连接的条件中加上括号 ()
     * @param condition
     * @returns 返回新的查询条件
     */
    orGroup: (condition: Condition) => Condition;
    /**
     * 将多个查询条件通过 AND 合并成一个大查询条件
     * @static
     * @param conditions 查询条件列表
     * @returns 返回逻辑表达式
     */
    static and(...conditions: Condition[]): Condition;
    /**
     * 将多个查询条件通过 OR 合并成一个
     * @static
     * @param conditions 查询条件列表
     * @returns 返回逻辑表达式
     */
    static or(...conditions: Condition[]): Condition;
    /**
     * Not 逻辑运算
     * @param condition
     */
    static not(condition: Condition): UnaryLogicCondition;
    /**
     * 判断是否存在
     * @param select 查询语句
     */
    static exists(select: UnsureSelectExpressions): UnaryCompareCondition;
    /**
     * 比较运算
     * @private
     * @param left 左值
     * @param right 右值
     * @param operator 运算符
     * @returns 返回比较运算对比条件
     */
    static compare(left: UnsureExpression, right: UnsureExpression | UnsureGroupValues, operator?: COMPARE_OPERATOR): BinaryCompareCondition;
    /**
     * 比较运算 =
     * @param left 左值
     * @param right 右值
     * @returns 返回比较运算对比条件
     */
    static eq(left: UnsureExpression, right: UnsureExpression): BinaryCompareCondition;
    /**
     * 比较运算 <>
     * @param left 左值
     * @param right 右值
     * @returns 返回比较运算对比条件
     */
    static neq(left: UnsureExpression, right: UnsureExpression): BinaryCompareCondition;
    /**
     * 比较运算 <
     * @param left 左值
     * @param right 右值
     * @returns 返回比较运算对比条件
     */
    static lt(left: UnsureExpression, right: UnsureExpression): BinaryCompareCondition;
    /**
     * 比较运算 <=
     * @param left 左值
     * @param right 右值
     * @returns 返回比较运算对比条件
     */
    static lte(left: UnsureExpression, right: UnsureExpression): BinaryCompareCondition;
    /**
     * 比较运算 >
     * @param left 左值
     * @param right 右值
     * @returns 返回比较运算对比条件
     */
    static gt(left: UnsureExpression, right: UnsureExpression): BinaryCompareCondition;
    /**
     * 比较运算 >=
     * @param left 左值
     * @param right 右值
     * @returns 返回比较运算对比条件
     */
    static gte(left: UnsureExpression, right: UnsureExpression): BinaryCompareCondition;
    /**
     * 比较运算 LIKE
     * @param left 左值
     * @param right 右值
     * @returns 返回比较运算对比条件
     */
    static like(left: UnsureExpression, right: UnsureExpression): BinaryCompareCondition;
    /**
     * 比较运算 NOT LIKE
     * @param left 左值
     * @param right 右值
     * @returns 返回比较运算对比条件
     */
    static notLike(left: UnsureExpression, right: UnsureExpression): BinaryCompareCondition;
    /**
     * 比较运算 IN
     * @param left 左值
     * @param values 要比较的值列表
     * @returns 返回比较运算对比条件
     */
    static in(left: UnsureExpression, values: UnsureGroupValues): BinaryCompareCondition;
    /**
     * 比较运算 NOT IN
     * @param left 左值
     * @param values 要比较的值列表
     * @returns 返回比较运算对比条件
     */
    static notIn(left: UnsureExpression, values: UnsureGroupValues): BinaryCompareCondition;
    /**
     * 比较运算 IS NULL
     * @returns 返回比较运算符
     * @param expr 表达式
     */
    static isNull(expr: UnsureExpression): IsNullCondition;
    /**
     * 比较运算 IS NOT NULL
     * @param expr 表达式
     * @returns 返回比较运算符
     */
    static isNotNull(expr: UnsureExpression): IsNotNullCondition;
    /**
     * 括号条件
     * @param condition 查询条件
     */
    static quoted(condition: Condition): QuotedCondition;
}
/**
 * 二元逻辑查询条件条件
 */
export declare class BinaryLogicCondition extends Condition implements IBinary {
    operator: LOGIC_OPERATOR;
    left: Condition;
    right: Condition;
    /**
     * 创建二元逻辑查询条件实例
     */
    constructor(operator: LOGIC_OPERATOR, left: UnsureCondition, right: UnsureCondition);
}
/**
 * 一元逻辑查询条件
 */
declare class UnaryLogicCondition extends Condition implements IUnary {
    operator: LOGIC_OPERATOR;
    next: Condition;
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
    left: Expression;
    right: Expression | UnsureGroupValues;
    operator: COMPARE_OPERATOR;
    /**
     * 构造函数
     */
    constructor(operator: COMPARE_OPERATOR, left: UnsureExpression, right: UnsureExpression | UnsureGroupValues);
}
/**
 * 一元比较条件
 */
declare class UnaryCompareCondition extends Condition implements IUnary {
    next: Expression;
    operator: COMPARE_OPERATOR;
    /**
     * 一元比较运算符
     * @param operator 运算符
     * @param expr 查询条件
     */
    constructor(operator: COMPARE_OPERATOR, expr: UnsureExpression);
}
/**
 * IS NULL 运算
 */
declare class IsNullCondition extends UnaryCompareCondition {
    /**
     * @param next 表达式
     */
    constructor(next: UnsureExpression);
}
/**
 * 是否为空值条件
 */
declare class IsNotNullCondition extends UnaryLogicCondition {
    /**
     * 是否空值
     * @param next 表达式
     */
    constructor(next: UnsureExpression);
}
/**
 * 联接查询
 */
export declare class Join extends AST {
    readonly type: SQL_SYMBOLE;
    left: boolean;
    table: Identifier;
    on: Condition;
    /**
     * 创建一个表关联
     * @param table
     * @param on 关联条件
     * @param left 是否左联接
     */
    constructor(table: UnsureIdentifier, on: Condition, left?: boolean);
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
    /**
     * 标识符
     */
    protected constructor(name: string, parent?: UnsureIdentifier, type?: SQL_SYMBOLE);
    get lvalue(): boolean;
    /**
     * 访问下一节点
     * @param name
     */
    dot(name: string): ProxiedIdentifier;
    any(): Identifier;
    /**
     * 执行一个函数
     * @param params
     */
    invoke(...params: (UnsureExpression)[]): Invoke;
    /**
     * 常规标识符
     */
    static normal(name: any): Identifier;
    /**
     * 内建标识符
     */
    static buildIn(name: any): Identifier;
    /**
     * 内建标识符
     */
    static any(parent?: UnsureIdentifier): Identifier;
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
    readonly expr: Expression;
    /**
     * 别名构造函数
     * @param expr 表达式或表名
     * @param name 别名
     */
    constructor(expr: UnsureExpression, name: string);
}
/**
 * 函数调用表达式
 */
export declare class Invoke extends Expression {
    get lvalue(): boolean;
    func: Identifier;
    args: List;
    /**
     * 函数调用
     */
    constructor(func: UnsureIdentifier, args?: UnsureExpression[]);
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
    static insert(table: UnsureIdentifier, fields?: UnsureIdentifier[]): Insert;
    /**
     * 更新一个表格
     * @param table
     */
    static update(table: UnsureIdentifier): Update;
    /**
     * 删除一个表格
     * @param table 表格
     */
    static delete(table: UnsureIdentifier): Delete;
    /**
     * 选择列
     */
    static select(columns: KeyValueObject): Select;
    static select(columns: KeyValueObject): Select;
    static select(...columns: UnsureExpression[]): Select;
    /**
     * 执行一个存储过程
     * @param proc
     * @param params
     */
    static execute(proc: UnsureIdentifier, params?: UnsureExpression[]): any;
    static execute(proc: UnsureIdentifier, params?: Parameter[]): any;
    /**
     * 执行一个存储过程，execute的别名
     * @param proc 存储过程
     * @param params 参数
     */
    static exec(proc: UnsureIdentifier, params: UnsureExpression[]): any;
    static exec(proc: UnsureIdentifier, params: Parameter[]): any;
    /**
     * 赋值语句
     * @param left 左值
     * @param right 右值
     */
    static assign(left: Expression, right: UnsureExpression): Assignment;
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
    static when(expr: UnsureExpression, value?: UnsureExpression): When;
    static case(expr?: UnsureExpression): Case;
}
/**
 * When语句
 */
export declare class When extends AST {
    expr: Expression | Condition;
    value: Expression;
    constructor(expr: UnsureExpression | UnsureCondition, then: UnsureExpression);
}
/**
 * CASE表达式
 */
export declare class Case extends Expression {
    get lvalue(): boolean;
    expr: Expression | Condition;
    whens: When[];
    defaults?: Expression;
    /**
     *
     * @param expr
     */
    constructor(expr?: UnsureExpression);
    /**
     * ELSE语句
     * @param defaults
     */
    else(defaults: any): this;
    /**
     * WHEN语句
     * @param expr
     * @param then
     */
    when(expr: UnsureExpression | UnsureCondition, then: any): this;
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
 * 值列表（不含括号）
 */
export declare class List extends AST {
    items: Expression[];
    private constructor();
    static values(...values: UnsureExpression[]): List;
    static columns(...exprs: UnsureExpression[]): List;
    static invokeArgs(...exprs: UnsureExpression[]): List;
    static execArgs(...exprs: UnsureExpression[]): List;
}
/**
 * 括号引用
 */
export declare class Bracket<T extends AST> extends Expression {
    get lvalue(): boolean;
    /**
     * 表达式
     */
    context: T;
    constructor(context: T);
}
export declare class QuotedCondition extends Condition implements ICondition {
    context: Condition;
    constructor(conditions: UnsureCondition);
    /**
     * and连接
     * @param condition 下一个查询条件
     * @returns 返回新的查询条件
     */
    and: (condition: any) => Condition;
    /**
     * and连接，并在被连接的条件中加上括号 ()
     * @param condition 下一个查询条件
     * @returns 返回新的查询条件
     */
    andGroup: (condition: Condition) => Condition;
    /**
     * OR语句
     * @param condition
     * @returns 返回新的查询条件
     */
    or: (condition: Condition) => Condition;
    /**
     * or 连接，并在被连接的条件中加上括号 ()
     * @param condition
     * @returns 返回新的查询条件
     */
    orGroup: (condition: Condition) => Condition;
    /**
     * 返回括号表达式
     */
    quoted: () => Bracket<Condition>;
}
export interface IBinary extends AST {
    operator: String;
    left: AST;
    right: AST;
}
export interface IUnary extends AST {
    operator: String;
    next: AST;
}
/**
 * 二元运算表达式
 */
export declare class BinaryExpression extends Expression implements IBinary {
    get lvalue(): boolean;
    operator: COMPUTE_OPERATOR;
    left: Expression;
    right: Expression;
    /**
     * 名称
     * @param operator 运算符
     * @param left 左值
     * @param right 右值
     */
    constructor(operator: COMPUTE_OPERATOR, left: UnsureExpression, right: UnsureExpression);
}
/**
 * - 运算符
 */
export declare class UnaryExpression extends Expression implements IUnary {
    operator: COMPUTE_OPERATOR;
    next: Expression;
    readonly type: SQL_SYMBOLE;
    get lvalue(): boolean;
    /**
     * 一元运算目前只支持负数运算符
     * @param expr
     */
    constructor(operator: COMPUTE_OPERATOR, expr: UnsureExpression);
}
/**
 * 联接查询
 */
export declare class Union extends AST {
    select: UnsureSelectExpressions;
    all: boolean;
    /**
     *
     * @param select SELECT语句
     * @param all 是否所有查询
     */
    constructor(select: any, all: any);
}
export interface SortObject {
    [key: string]: SORT_DIRECTION;
}
declare abstract class Fromable extends Statement {
    tables?: Identifier[];
    joins?: Join[];
    filters?: Condition;
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
    join(table: UnsureIdentifier, on: Condition, left?: boolean): this;
    /**
     * 左联接
     * @param table
     * @param on
     */
    leftJoin(table: UnsureIdentifier, on: Condition): this;
    /**
     * where查询条件
     * @param condition
     */
    where(condition: UnsureCondition): this;
}
export declare class SortInfo extends AST {
    expr: Expression;
    direction?: SORT_DIRECTION;
    constructor(expr: UnsureExpression, direction?: SORT_DIRECTION);
}
/**
 * SELECT查询
 */
export declare class Select extends Fromable {
    tops?: number;
    offsets?: number;
    limits?: number;
    isDistinct?: boolean;
    columns: List;
    sorts?: SortInfo[];
    groups?: Expression[];
    havings?: Condition;
    unions?: Union;
    constructor(columns?: ValuesObject);
    constructor(...columns: UnsureExpression[]);
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
    orderBy(...sorts: (SortInfo | UnsureExpression)[]): this;
    /**
     * 分组查询
     * @param groups
     */
    groupBy(...groups: UnsureExpression[]): this;
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
    union(select: UnsureSelectExpressions, all?: boolean): void;
    unionAll(select: UnsureSelectExpressions): void;
    /**
     * 将本SELECT返回表达式
     * @returns 返回一个加()后的SELECT语句
     */
    quoted(): Bracket<this>;
    /**
     * 将本次查询，转换为Table行集
     * @param alias
     */
    as(alias: any): ProxiedIdentifier;
}
/**
 * Insert 语句
 */
export declare class Insert extends Statement {
    table: Identifier;
    fields: Identifier[];
    rows: List[] | Select;
    /**
     * 构造函数
     */
    constructor(table: UnsureIdentifier, fields?: UnsureIdentifier[]);
    /**
     * 字段列表
     * @param  {string[]|Field[]} fields
     */
    private _fields;
    values(select: Select): this;
    values(row: ValuesObject): this;
    values(row: UnsureExpression[]): this;
    values(...rows: UnsureExpression[][]): this;
    values(...rows: ValuesObject[]): this;
}
export interface KeyValueObject {
    [field: string]: UnsureExpression;
}
export declare type ValuesObject = KeyValueObject;
export declare type AssignObject = KeyValueObject;
export declare class Update extends Fromable {
    table: Identifier;
    sets: Assignment[];
    constructor(table: UnsureIdentifier);
    /**
     * @param sets
     */
    set(sets: AssignObject): this;
    set(...sets: Assignment[]): this;
}
export declare class Delete extends Fromable {
    table: Identifier;
    constructor(table: UnsureIdentifier);
}
/**
 * 存储过程执行
 */
export declare class Execute extends Statement {
    proc: Identifier;
    args: List;
    constructor(proc: UnsureIdentifier, args?: UnsureExpression[]);
    constructor(proc: UnsureIdentifier, args?: Parameter[]);
    constructor(proc: UnsureIdentifier, args?: UnsureExpression[] | Parameter[]);
}
/**
 * 赋值语句
 */
export declare class Assignment extends Statement {
    left: Expression;
    right: Expression;
    constructor(left: Expression, right: UnsureExpression);
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
declare type DbType = string;
declare type JsType = Function;
/**
 * 程序与数据库间传递值所使用的参数
 */
export declare class Parameter extends Expression {
    name?: string;
    private _value?;
    direction: PARAMETER_DIRECTION;
    dbType?: DbType | JsType;
    get lvalue(): boolean;
    get value(): JsConstant;
    set value(value: JsConstant);
    constructor(name: string, dbType: DbType | JsType, value: JsConstant, direction?: PARAMETER_DIRECTION);
    /**
     * input 参数
     */
    static input(name: string, value: JsConstant): Parameter;
    /**
     * output参数
     */
    static output(name: string, type: DbType | JsType, value?: JsConstant): Parameter;
}
/**
 * SQL 文档
 */
export declare class Document extends AST {
    statements: Statement[];
    constructor(...statements: Statement[]);
}
export {};
