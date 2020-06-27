import { ComputeOperator, ParameterDirection, SqlSymbol, CompareOperator, SortDirection, LogicOperator } from './constants';
/**
 * JS常量类型
 */
export declare type JsConstant = String | Date | Boolean | null | undefined | Number;
/**
 * 带括号的查询条件
 */
export declare type BracketCondition = Bracket<Condition>;
/**
 * 括号表达式
 */
export declare type BracketExpression = Bracket<Expression>;
/**
 * 兼容包含括号的表达式类型
 */
export declare type Expressions = Expression | Bracket<Expression | BracketExpression>;
/**
 * 未经确认的表达式
 */
export declare type UnsureExpressions = Expressions | JsConstant;
/**
 * 查询条件列表
 */
export declare type Conditions = Condition | Bracket<Condition | BracketCondition>;
export declare type UnsureConditions = Conditions | object;
/**
 * SELECT查询表达式
 */
export declare type SelectExpression = Bracket<Select>;
export declare type InsertValues = (UnsureExpressions[] | object)[];
export declare type UnsureGroupValues = UnsureExpressions[] | Bracket<Expressions[]>;
export declare type UnsureIdentity = Identity | string;
export interface SortInfo {
    $expr: Expressions;
    $direction: SortDirection;
}
/**
 * AST 基类
 */
export declare abstract class AST {
    constructor(type: SqlSymbol);
    readonly $type: SqlSymbol;
}
/**
 * 表达式基类，抽象类
 * @class Expression
 * @extends {AST}
 */
export declare abstract class Expression extends AST {
    /**
     * 获取当前表达式是否为左值
     * @type {boolean}
     */
    abstract get lvalue(): boolean;
    /**
     * 加法运算
     */
    add(exp: UnsureExpressions): BinaryComputeExpression;
    /**
     * 减法运算
     */
    sub(exp: UnsureExpressions): BinaryComputeExpression;
    /**
     * 乘法运算
     * @param exp 要与当前表达式相乘的表达式
     */
    mul(exp: UnsureExpressions): BinaryComputeExpression;
    /**
     * 除法运算
     * @param exp 要与当前表达式相除的表达式
     * @returns 返回运算后的表达式
     */
    div(exp: UnsureExpressions): BinaryComputeExpression;
    /**
     * 算术运算 %
     * @param exp 要与当前表达式相除的表达式
     * @returns 返回运算后的表达式
     */
    mod(exp: UnsureExpressions): BinaryComputeExpression;
    /**
     * 位运算 &
     * @param exp 要与当前表达式相除的表达式
     * @returns 返回运算后的表达式
     */
    and(exp: UnsureExpressions): BinaryComputeExpression;
    /**
     * 位运算 |
     * @param exp 要与当前表达式相除的表达式
     * @returns 返回运算后的表达式
     */
    or(exp: UnsureExpressions): BinaryComputeExpression;
    /**
     * 位运算 ~
     * @param exp 要与当前表达式相除的表达式
     * @returns 返回运算后的表达式
     */
    not(exp: UnsureExpressions): BinaryComputeExpression;
    /**
     * 位运算 ^
     * @param exp 要与当前表达式相除的表达式
     * @returns 返回运算后的表达式
     */
    xor(exp: UnsureExpressions): BinaryComputeExpression;
    /**
     * 位运算 <<
     * @param exp 要与当前表达式相除的表达式
     * @returns 返回运算后的表达式
     */
    shl(exp: UnsureExpressions): BinaryComputeExpression;
    /**
     * 位运算 >>
     * @param exp 要与当前表达式相除的表达式
     * @returns 返回运算后的表达式
     */
    shr(exp: UnsureExpressions): BinaryComputeExpression;
    /**
     * 比较是否相等 =
     * @param exp 要与当前表达式相比较的表达式
     * @returns 返回对比条件表达式
     */
    eq(exp: UnsureExpressions): BinaryCompareCondition;
    /**
     * 比较是否不等于 <>
     * @param exp 要与当前表达式相比较的表达式
     * @returns 返回对比条件表达式
     */
    neq(exp: UnsureExpressions): BinaryCompareCondition;
    /**
     * 比较是否小于 <
     * @param exp 要与当前表达式相比较的表达式
     * @returns 返回对比条件表达式
     */
    lt(exp: UnsureExpressions): BinaryCompareCondition;
    /**
     * 比较是否小于等于 <=
     * @param exp 要与当前表达式相比较的表达式
     * @returns 返回对比条件表达式
     */
    lte(exp: UnsureExpressions): BinaryCompareCondition;
    /**
     * 比较是否大于 >
     * @param exp 要与当前表达式相比较的表达式
     * @returns 返回对比条件表达式
     */
    gt(exp: UnsureExpressions): BinaryCompareCondition;
    /**
     * 比较是否小于等于 >=
     * @param exp 要与当前表达式相比较的表达式
     * @returns 返回对比条件表达式
     */
    gte(exp: UnsureExpressions): BinaryCompareCondition;
    /**
     * 比较是相像 LIKE
     * @param exp 要与当前表达式相比较的表达式
     * @returns 返回对比条件表达式
     */
    like(exp: UnsureExpressions): BinaryCompareCondition;
    /**
     * 比较是否不想像 NOT LIKE
     * @param exp 要与当前表达式相比较的表达式
     * @returns 返回对比条件表达式
     */
    notLike(exp: UnsureExpressions): BinaryCompareCondition;
    /**
     * 比较是否不包含于 IN
     * @param values 要与当前表达式相比较的表达式数组
     * @returns 返回对比条件表达式
     */
    in(...values: UnsureExpressions[]): BinaryCompareCondition;
    /**
     * 比较是否不包含于 NOT IN
     * @param values 要与当前表达式相比较的表达式
     * @returns 返回对比条件表达式
     */
    notIn(...values: UnsureExpressions[]): BinaryCompareCondition;
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
    as(alias: string): Alias<Expressions>;
    /**
     * 算术运算 +
     * @param left 左值
     * @param right 右值
     * @returns 返回算术运算表达式
     */
    static add(left: any, right: any): BinaryComputeExpression;
    /**
     * 算术运算 -
     * @param left 左值
     * @param right 右值
     * @returns 返回算术运算表达式
     */
    static sub(left: any, right: any): BinaryComputeExpression;
    /**
     * 算术运算 *
     * @param left 左值
     * @param right 右值
     * @returns 返回算术运算表达式
     */
    static mul(left: any, right: any): BinaryComputeExpression;
    /**
     * 算术运算 /
     * @param left 左值
     * @param right 右值
     * @returns 返回算术运算表达式
     */
    static div(left: any, right: any): BinaryComputeExpression;
    /**
     * 算术运算 %
     * @param left 左值
     * @param right 右值
     * @returns 返回算术运算表达式
     */
    static mod(left: any, right: any): BinaryComputeExpression;
    /**
     * 位算术运算 &
     * @param left 左值
     * @param right 右值
     * @returns 返回算术运算表达式
     */
    static and(left: any, right: any): BinaryComputeExpression;
    /**
     * 位算术运算 |
     * @param left 左值
     * @param right 右值
     * @returns 返回算术运算表达式
     */
    static or(left: any, right: any): BinaryComputeExpression;
    /**
     * 位算术运算 ^
     * @param left 左值
     * @param right 右值
     * @returns 返回算术运算表达式
     */
    static xor(left: any, right: any): BinaryComputeExpression;
    /**
     * 位算术运算 ~
     * @param left 左值
     * @param right 右值
     * @returns 返回算术运算表达式
     */
    static not(left: any, right: any): BinaryComputeExpression;
    /**
     * 位算术运算 <<
     * @param left 左值
     * @param right 右值
     * @returns 返回算术运算表达式
     */
    static shl(left: any, right: any): BinaryComputeExpression;
    /**
     * 位算术运算 >>
     * @param left 左值
     * @param right 右值
     * @returns 返回算术运算表达式
     */
    static shr(left: any, right: any): BinaryComputeExpression;
}
/**
 * 查询条件
 */
export declare abstract class Condition extends AST {
    /**
     * and连接
     * @param condition 下一个查询条件
     * @returns 返回新的查询条件
     */
    and(condition: any): BinaryLogicCondition;
    /**
     * OR语句
     * @param condition
     * @returns 返回新的查询条件
     */
    or(condition: any): BinaryLogicCondition;
    /**
     * @returns {Bracket<Condition>}
     */
    enclose(): Bracket<this>;
    /**
     * 将多个查询条件通过 AND 合并成一个大查询条件
     * @static
     * @param conditions 查询条件列表
     * @returns 返回逻辑表达式
     */
    static and(...conditions: any[]): any;
    /**
     * 将多个查询条件通过 OR 合并成一个
     * @static
     * @param conditions 查询条件列表
     * @returns 返回逻辑表达式
     */
    static or(...conditions: any[]): any;
    /**
     * Not 逻辑运算
     * @param condition
     * @returns {NotCondition}
     */
    static not(condition: any): UnaryLogicCondition;
    /**
     * 判断是否存在
     * @param select 查询语句
     */
    static exists(select: Select): UnaryCompareCondition;
    /**
     * 比较运算
     * @private
     * @param left 左值
     * @param right 右值
     * @param operator 运算符
     * @returns 返回比较运算对比条件
     */
    static _compare(left: UnsureExpressions, right: UnsureExpressions, operator?: CompareOperator): BinaryCompareCondition;
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
}
/**
 * 二元逻辑查询条件条件
 */
export declare class BinaryLogicCondition extends Condition {
    $opeartor: LogicOperator;
    $left: Conditions;
    $right: Conditions;
    /**
     * 创建二元逻辑查询条件实例
     */
    constructor(operator: LogicOperator, left: UnsureConditions, right: UnsureConditions);
}
/**
 * 一元逻辑查询条件
 */
declare class UnaryLogicCondition extends Condition {
    $operator: LogicOperator;
    $next: Conditions;
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
    $left: Expressions;
    $right: Expressions;
    $operator: CompareOperator;
    /**
     * 构造函数
     */
    constructor(operator: CompareOperator, left: UnsureExpressions, right: UnsureExpressions);
}
/**
 * 一元比较条件
 */
declare class UnaryCompareCondition extends Condition {
    $condition: Conditions;
    $operator: CompareOperator;
    /**
     * 一元比较运算符
     * @param operator 运算符
     * @param expr 查询条件
     */
    constructor(operator: CompareOperator, expr: UnsureConditions);
}
/**
 * IS NULL 运算
 */
declare class IsNullCondition extends UnaryCompareCondition {
    /**
     * @param expr 下一查询条件
     */
    constructor(expr: UnsureConditions);
}
/**
 * 是否为空值条件
 */
declare class IsNotNullCondition extends UnaryLogicCondition {
    /**
     * 是否空值
     * @param expr
     */
    constructor(expr: UnsureConditions);
}
/**
 * 联接查询
 * @class Join
 * @extends {AST}
 */
declare class Join extends AST {
    readonly $type: SqlSymbol;
    $left: boolean;
    $table: Identity;
    $on: Conditions;
    /**
     * 创建一个表关联
     * @param table
     * @param on 关联条件
     * @param left 是否左联接
     * @field
     */
    constructor(table: UnsureIdentity, on: Conditions, left?: boolean);
}
/**
 * 标识符，可以多级，如表名等
 */
export declare class Identity extends Expression {
    readonly $name: string;
    readonly $parent?: Identity;
    /**
     * 标识符
     */
    constructor(name: string, parent?: UnsureIdentity);
    get lvalue(): boolean;
    /**
     * 访问下一节点
     * @param name
     */
    dot(name: string): Identity;
}
export declare class Variant extends Expression {
    $name: string;
    constructor(name: string);
    get lvalue(): boolean;
}
/**
 * 别名表达式
 */
export declare class Alias<T extends Expression> extends Identity {
    /**
     * 表达式
     */
    readonly $expr: Expressions;
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
    $func: Identity;
    $params: Expression[];
    /**
     * 是否抽象函数，如果为抽象的，则需要
     */
    $abstract: boolean;
    /**
     * 函数调用
     */
    constructor(func: UnsureIdentity, params: (Expression | JsConstant)[]);
}
/**
 * SQL 语句
 */
export declare abstract class Statement extends AST {
}
/**
 * When语句
 */
export declare class When extends AST {
    $expr: Expressions;
    $value: Expressions;
    constructor(expr: Expressions, value: Expressions);
}
/**
 * CASE表达式
 */
export declare class Case extends Expression {
    get lvalue(): boolean;
    $expr: Expressions;
    $whens: When[];
    $default: Expressions;
    /**
     *
     * @param expr
     */
    constructor(expr: any);
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
    $value: JsConstant;
    constructor(value: JsConstant);
}
/**
 * 括号引用
 */
export declare class Bracket<T> extends Expression {
    /**
     * 表达式
     */
    $context: T;
    get lvalue(): boolean;
    constructor(context: T);
}
/**
 * 二元运算表达式
 */
export declare class BinaryComputeExpression extends Expression {
    get lvalue(): boolean;
    $operator: ComputeOperator;
    $left: Expressions;
    $right: Expressions;
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
export declare class UnaryComputeExpression extends Expression {
    $operator: ComputeOperator;
    $expr: Expressions;
    readonly $type: SqlSymbol;
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
declare class Union extends AST {
    $select: SelectExpression;
    $all: boolean;
    /**
     *
     * @param select SELECT语句
     * @param all 是否所有查询
     */
    constructor(select: any, all: any);
}
interface SelectOptions {
    from?: UnsureIdentity[];
    top?: number;
    offset?: number;
    limit?: number;
    distinct?: boolean;
    columns?: UnsureExpressions[];
    joins?: Join[];
    where?: Conditions;
    orderBy?: (SortInfo | UnsureExpressions)[];
    groupBy?: UnsureExpressions[];
}
interface SortObject {
    [key: string]: SortDirection;
}
/**
 * SELECT查询
 * @class Select
 * @extends {Statement}
 */
export declare class Select extends Statement {
    $from: Identity[];
    $top?: number;
    $offset?: number;
    $limit?: number;
    $distinct?: boolean;
    $columns: Expressions[];
    $joins?: Join[];
    $where?: Conditions;
    $orderBy?: SortInfo[];
    $groupBy?: Expressions[];
    $having?: Conditions;
    $union?: Union;
    constructor(options?: SelectOptions);
    /**
     * 选择列
     */
    columns(columns: object): any;
    columns(...columns: UnsureExpressions[]): any;
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
    where(condition: any): this;
    /**
     * order by 排序
     * @param sorts 排序信息
     */
    orderBy(sorts: SortObject): Select;
    orderBy(...sorts: (SortInfo | UnsureExpressions)[]): Select;
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
    union(select: SelectExpression, all?: boolean): void;
    unionAll(select: SelectExpression): void;
    /**
     * 将本SELECT返回表达式
     * @returns 返回一个加()后的SELECT语句
     */
    enclose(): Bracket<this>;
    /**
     * 将本次查询，转换为Table行集
     * @param alias
     */
    as(alias: any): Alias<Expression>;
}
interface InsertOptions {
    table?: Identity;
    fields?: (string | Identity)[];
    values?: InsertValues;
}
/**
 * Insert 语句
 */
export declare class Insert extends Statement {
    $table: Identity;
    $fields: Identity[];
    $values: Expressions[][] | Select;
    /**
     * 构造函数
     */
    constructor(options?: InsertOptions);
    /**
     * 插入至表
     * @param table
     * @param fields
     */
    into(table: UnsureIdentity): this;
    /**
     * 字段列表
     * @param  {string[]|Field[]} fields
     */
    fields(...fields: UnsureIdentity[]): this;
    values(select: Select): any;
    values(rows: object[]): any;
    values(row: UnsureExpressions[]): any;
    values(...rows: UnsureExpressions[][]): any;
    values(...rows: object[]): any;
}
interface UpdateOptions {
    table?: UnsureIdentity;
    sets?: object | Assignment[];
    joins?: Join[];
    where?: Conditions;
}
export declare class Update extends AST {
    $table: Identity;
    $where: Conditions;
    $joins?: Join[];
    $sets: Assignment[];
    constructor(options?: UpdateOptions);
    from(table: UnsureIdentity): this;
    /**
     * 内联接
     * @param table
     * @param on
     * @param left
     * @memberof Select
     */
    join(table: UnsureIdentity, on?: Conditions, left?: boolean): this;
    leftJoin(table: any, on: any): this;
    /**
     * @param sets
     */
    set(sets: object): any;
    set(...sets: Assignment[]): any;
    /**
     * 查询条件
     * @param condition
     */
    where(condition: any): this;
}
interface DeleteOptions {
    table?: UnsureIdentity;
    sets?: object | Assignment[];
    joins?: Join[];
    where?: Conditions;
}
export declare class Delete extends AST {
    $table: Identity;
    $joins: Join[];
    $where: Conditions;
    constructor(options?: DeleteOptions);
    from(table: UnsureIdentity): void;
    /**
     * 内联接
     * @param table
     * @param on
     * @param left
     * @memberof Select
     */
    join(table: any, on: any, left?: boolean): this;
    leftJoin(table: any, on: any): this;
    where(condition: any): this;
}
/**
 * 存储过程执行
 */
export declare class Execute extends Statement {
    $proc: Identity;
    $params: Expressions[] | Parameter[];
    constructor(proc: UnsureIdentity, params: UnsureExpressions[]);
    constructor(proc: UnsureIdentity, params: Parameter[]);
}
/**
 * 赋值表达式
 */
export declare class Assignment extends AST {
    $left: Expression;
    $right: Expressions;
    constructor(left: Expression, right: Expressions);
}
export declare class Parameter extends AST {
    $name: Identity;
    $value: Expressions;
    $direction: ParameterDirection;
    constructor(name: UnsureIdentity, value: UnsureExpressions, direction?: ParameterDirection);
}
export {};
