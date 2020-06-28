"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Parameter = exports.Assignment = exports.Execute = exports.Delete = exports.Update = exports.Insert = exports.Select = exports.UnaryComputeExpression = exports.BinaryComputeExpression = exports.Bracket = exports.Constant = exports.Case = exports.When = exports.Statement = exports.Invoke = exports.Alias = exports.Variant = exports.Identity = exports.BinaryLogicCondition = exports.Condition = exports.Expression = exports.AST = void 0;
/**
 * lodash
 */
const _ = require("lodash");
const util_1 = require("./util");
const constants_1 = require("./constants");
/**
 * AST 基类
 */
class AST {
    constructor(type) {
        this.$type = type;
    }
}
exports.AST = AST;
/**
 * 表达式基类，抽象类
 */
class Expression extends AST {
    /**
     * 加法运算
     */
    add(exp) {
        return Expression.add(this, exp);
    }
    /**
     * 减法运算
     */
    sub(exp) {
        return Expression.sub(this, exp);
    }
    /**
     * 乘法运算
     * @param exp 要与当前表达式相乘的表达式
     */
    mul(exp) {
        return Expression.mul(this, exp);
    }
    /**
     * 除法运算
     * @param exp 要与当前表达式相除的表达式
     * @returns 返回运算后的表达式
     */
    div(exp) {
        return Expression.div(this, exp);
    }
    /**
     * 算术运算 %
     * @param exp 要与当前表达式相除的表达式
     * @returns 返回运算后的表达式
     */
    mod(exp) {
        return Expression.mod(this, exp);
    }
    /**
     * 位运算 &
     * @param exp 要与当前表达式相除的表达式
     * @returns 返回运算后的表达式
     */
    and(exp) {
        return Expression.and(this, exp);
    }
    /**
     * 位运算 |
     * @param exp 要与当前表达式相除的表达式
     * @returns 返回运算后的表达式
     */
    or(exp) {
        return Expression.or(this, exp);
    }
    /**
     * 位运算 ~
     * @param exp 要与当前表达式相除的表达式
     * @returns 返回运算后的表达式
     */
    not(exp) {
        return Expression.not(this, exp);
    }
    /**
     * 位运算 ^
     * @param exp 要与当前表达式相除的表达式
     * @returns 返回运算后的表达式
     */
    xor(exp) {
        return Expression.xor(this, exp);
    }
    /**
     * 位运算 <<
     * @param exp 要与当前表达式相除的表达式
     * @returns 返回运算后的表达式
     */
    shl(exp) {
        return Expression.shl(this, exp);
    }
    /**
     * 位运算 >>
     * @param exp 要与当前表达式相除的表达式
     * @returns 返回运算后的表达式
     */
    shr(exp) {
        return Expression.shr(this, exp);
    }
    /**
     * 比较是否相等 =
     * @param exp 要与当前表达式相比较的表达式
     * @returns 返回对比条件表达式
     */
    eq(exp) {
        return Condition.eq(this, exp);
    }
    /**
     * 比较是否不等于 <>
     * @param exp 要与当前表达式相比较的表达式
     * @returns 返回对比条件表达式
     */
    neq(exp) {
        return Condition.neq(this, exp);
    }
    /**
     * 比较是否小于 <
     * @param exp 要与当前表达式相比较的表达式
     * @returns 返回对比条件表达式
     */
    lt(exp) {
        return Condition.lt(this, exp);
    }
    /**
     * 比较是否小于等于 <=
     * @param exp 要与当前表达式相比较的表达式
     * @returns 返回对比条件表达式
     */
    lte(exp) {
        return Condition.lte(this, exp);
    }
    /**
     * 比较是否大于 >
     * @param exp 要与当前表达式相比较的表达式
     * @returns 返回对比条件表达式
     */
    gt(exp) {
        return Condition.gt(this, exp);
    }
    /**
     * 比较是否小于等于 >=
     * @param exp 要与当前表达式相比较的表达式
     * @returns 返回对比条件表达式
     */
    gte(exp) {
        return Condition.gte(this, exp);
    }
    /**
     * 比较是相像 LIKE
     * @param exp 要与当前表达式相比较的表达式
     * @returns 返回对比条件表达式
     */
    like(exp) {
        return Condition.like(this, exp);
    }
    /**
     * 比较是否不想像 NOT LIKE
     * @param exp 要与当前表达式相比较的表达式
     * @returns 返回对比条件表达式
     */
    notLike(exp) {
        return Condition.notLike(this, exp);
    }
    /**
     * 比较是否不包含于 IN
     * @param values 要与当前表达式相比较的表达式数组
     * @returns 返回对比条件表达式
     */
    in(...values) {
        return Condition.in(this, values);
    }
    /**
     * 比较是否不包含于 NOT IN
     * @param values 要与当前表达式相比较的表达式
     * @returns 返回对比条件表达式
     */
    notIn(...values) {
        return Condition.notIn(this, values);
    }
    /**
     * 比较是否为空 IS NULL
     * @returns 返回对比条件表达式
     */
    isNull() {
        return Condition.isNull(this);
    }
    /**
     * 比较是否为空 IS NOT NULL
     * @returns 返回对比条件表达式
     */
    isNotNull() {
        return Condition.isNotNull(this);
    }
    /**
     * isNotNull 的简称别名
     * @returns 返回对比条件表达式
     */
    notNull() {
        return this.isNotNull();
    }
    /**
     * 正序
     * @returns 返回对比条件表达式
     */
    asc() {
        return {
            $expr: this,
            $direction: constants_1.SortDirection.ASC
        };
    }
    /**
     * 倒序
     * @returns 返回对比条件表达式
     */
    desc() {
        return {
            $expr: this,
            $direction: constants_1.SortDirection.DESC
        };
    }
    /**
     * 为当前表达式添加别名
     */
    as(alias) {
        return new Alias(this, alias);
    }
    /**
     * 算术运算 +
     * @param left 左值
     * @param right 右值
     * @returns 返回算术运算表达式
     */
    static add(left, right) {
        return new BinaryComputeExpression(constants_1.ComputeOperator.ADD, left, right);
    }
    /**
     * 算术运算 -
     * @param left 左值
     * @param right 右值
     * @returns 返回算术运算表达式
     */
    static sub(left, right) {
        return new BinaryComputeExpression(constants_1.ComputeOperator.SUB, left, right);
    }
    /**
     * 算术运算 *
     * @param left 左值
     * @param right 右值
     * @returns 返回算术运算表达式
     */
    static mul(left, right) {
        return new BinaryComputeExpression(constants_1.ComputeOperator.MUL, left, right);
    }
    /**
     * 算术运算 /
     * @param left 左值
     * @param right 右值
     * @returns 返回算术运算表达式
     */
    static div(left, right) {
        return new BinaryComputeExpression(constants_1.ComputeOperator.DIV, left, right);
    }
    /**
     * 算术运算 %
     * @param left 左值
     * @param right 右值
     * @returns 返回算术运算表达式
     */
    static mod(left, right) {
        return new BinaryComputeExpression(constants_1.ComputeOperator.MOD, left, right);
    }
    /**
     * 位算术运算 &
     * @param left 左值
     * @param right 右值
     * @returns 返回算术运算表达式
     */
    static and(left, right) {
        return new BinaryComputeExpression(constants_1.ComputeOperator.BITAND, left, right);
    }
    /**
     * 位算术运算 |
     * @param left 左值
     * @param right 右值
     * @returns 返回算术运算表达式
     */
    static or(left, right) {
        return new BinaryComputeExpression(constants_1.ComputeOperator.BITOR, left, right);
    }
    /**
     * 位算术运算 ^
     * @param left 左值
     * @param right 右值
     * @returns 返回算术运算表达式
     */
    static xor(left, right) {
        return new BinaryComputeExpression(constants_1.ComputeOperator.BITXOR, left, right);
    }
    /**
     * 位算术运算 ~
     * @param left 左值
     * @param right 右值
     * @returns 返回算术运算表达式
     */
    static not(left, right) {
        return new BinaryComputeExpression(constants_1.ComputeOperator.BITNOT, left, right);
    }
    /**
     * 位算术运算 <<
     * @param left 左值
     * @param right 右值
     * @returns 返回算术运算表达式
     */
    static shl(left, right) {
        return new BinaryComputeExpression(constants_1.ComputeOperator.SHL, left, right);
    }
    /**
     * 位算术运算 >>
     * @param left 左值
     * @param right 右值
     * @returns 返回算术运算表达式
     */
    static shr(left, right) {
        return new BinaryComputeExpression(constants_1.ComputeOperator.SHR, left, right);
    }
}
exports.Expression = Expression;
/**
 * 查询条件
 */
class Condition extends AST {
    /**
     * and连接
     * @param condition 下一个查询条件
     * @returns 返回新的查询条件
     */
    and(condition) {
        condition = util_1.ensureCondition(condition);
        return new BinaryLogicCondition(constants_1.LogicOperator.AND, this, condition);
    }
    /**
     * OR语句
     * @param condition
     * @returns 返回新的查询条件
     */
    or(condition) {
        condition = util_1.ensureCondition(condition);
        return new BinaryLogicCondition(constants_1.LogicOperator.OR, this, condition);
    }
    /**
     * 返回括号表达式
     */
    quoted() {
        return new Bracket(this);
    }
    /**
     * 将多个查询条件通过 AND 合并成一个大查询条件
     * @static
     * @param conditions 查询条件列表
     * @returns 返回逻辑表达式
     */
    static and(...conditions) {
        util_1.assert(_.isArray(conditions) && conditions.length > 1, 'Conditions must type of Array & have two or more elements.');
        return conditions.reduce((previous, current) => {
            current = util_1.ensureCondition(current);
            if (!previous)
                return current;
            return new BinaryLogicCondition(constants_1.LogicOperator.AND, previous, current);
        });
    }
    /**
     * 将多个查询条件通过 OR 合并成一个
     * @static
     * @param conditions 查询条件列表
     * @returns 返回逻辑表达式
     */
    static or(...conditions) {
        util_1.assert(_.isArray(conditions) && conditions.length > 1, 'Conditions must type of Array & have two or more elements.');
        return conditions.reduce((previous, current, index) => {
            current = util_1.ensureCondition(current);
            if (!previous)
                return current;
            return new BinaryLogicCondition(constants_1.LogicOperator.OR, previous, current);
        });
    }
    /**
     * Not 逻辑运算
     * @param condition
     * @returns
     */
    static not(condition) {
        condition = util_1.ensureCondition(condition);
        return new UnaryLogicCondition(constants_1.LogicOperator.NOT, condition);
    }
    /**
     * 判断是否存在
     * @param select 查询语句
     */
    static exists(select) {
        return new UnaryCompareCondition(constants_1.CompareOperator.EXISTS, select.quoted());
    }
    /**
     * 比较运算
     * @private
     * @param left 左值
     * @param right 右值
     * @param operator 运算符
     * @returns 返回比较运算对比条件
     */
    static _compare(left, right, operator = constants_1.CompareOperator.EQ) {
        return new BinaryCompareCondition(operator, left, right);
    }
    /**
     * 比较运算 =
     * @param left 左值
     * @param right 右值
     * @returns 返回比较运算对比条件
     */
    static eq(left, right) {
        return Condition._compare(left, right, constants_1.CompareOperator.EQ);
    }
    /**
     * 比较运算 <>
     * @param left 左值
     * @param right 右值
     * @returns 返回比较运算对比条件
     */
    static neq(left, right) {
        return Condition._compare(left, right, constants_1.CompareOperator.NEQ);
    }
    /**
     * 比较运算 <
     * @param left 左值
     * @param right 右值
     * @returns 返回比较运算对比条件
     */
    static lt(left, right) {
        return Condition._compare(left, right, constants_1.CompareOperator.LT);
    }
    /**
     * 比较运算 <=
     * @param left 左值
     * @param right 右值
     * @returns 返回比较运算对比条件
     */
    static lte(left, right) {
        return Condition._compare(left, right, constants_1.CompareOperator.LTE);
    }
    /**
     * 比较运算 >
     * @param left 左值
     * @param right 右值
     * @returns 返回比较运算对比条件
     */
    static gt(left, right) {
        return Condition._compare(left, right, constants_1.CompareOperator.GT);
    }
    /**
     * 比较运算 >=
     * @param left 左值
     * @param right 右值
     * @returns 返回比较运算对比条件
     */
    static gte(left, right) {
        return Condition._compare(left, right, constants_1.CompareOperator.GTE);
    }
    /**
     * 比较运算 LIKE
     * @param left 左值
     * @param right 右值
     * @returns 返回比较运算对比条件
     */
    static like(left, right) {
        return Condition._compare(left, right, constants_1.CompareOperator.LIKE);
    }
    /**
     * 比较运算 NOT LIKE
     * @param left 左值
     * @param right 右值
     * @returns 返回比较运算对比条件
     */
    static notLike(left, right) {
        return Condition._compare(left, right, constants_1.CompareOperator.NOT_LIKE);
    }
    /**
     * 比较运算 IN
     * @param left 左值
     * @param values 要比较的值列表
     * @returns 返回比较运算对比条件
     */
    static in(left, values) {
        let group;
        if (values instanceof Bracket) {
            group = values;
        }
        else {
            group = new Bracket(values);
        }
        return Condition._compare(left, group, constants_1.CompareOperator.IN);
    }
    /**
     * 比较运算 NOT IN
     * @param left 左值
     * @param values 要比较的值列表
     * @returns 返回比较运算对比条件
     */
    static notIn(left, values) {
        let group;
        if (values instanceof Bracket) {
            group = values;
        }
        else {
            group = new Bracket(values);
        }
        return Condition._compare(left, group, constants_1.CompareOperator.NOT_IN);
    }
    /**
     * 比较运算 IS NULL
     * @returns 返回比较运算符
     * @param expr 表达式
     */
    static isNull(expr) {
        return new IsNullCondition(expr);
    }
    /**
     * 比较运算 IS NOT NULL
     * @param expr 表达式
     * @returns 返回比较运算符
     */
    static isNotNull(expr) {
        return new IsNotNullCondition(expr);
    }
}
exports.Condition = Condition;
/**
 * 二元逻辑查询条件条件
 */
class BinaryLogicCondition extends Condition {
    /**
     * 创建二元逻辑查询条件实例
     */
    constructor(operator, left, right) {
        super(constants_1.SqlSymbol.BINARY);
        this.$opeartor = operator;
        /**
         * 左查询条件
         */
        this.$left = util_1.ensureCondition(left);
        /**
         * 右查询条件
         */
        this.$right = util_1.ensureCondition(right);
    }
}
exports.BinaryLogicCondition = BinaryLogicCondition;
/**
 * 一元逻辑查询条件
 */
class UnaryLogicCondition extends Condition {
    /**
     * 创建一元逻辑查询条件实例
     * @param operator
     * @param next
     */
    constructor(operator, next) {
        super(constants_1.SqlSymbol.UNARY);
        this.$operator = operator;
        this.$next = util_1.ensureCondition(next);
    }
}
/**
 * 二元比较条件
 */
class BinaryCompareCondition extends Condition {
    /**
     * 构造函数
     */
    constructor(operator, left, right) {
        super(constants_1.SqlSymbol.BINARY);
        this.$operator = operator;
        util_1.assert(left, 'Left must not null');
        util_1.assert(right, 'Right must not null');
        this.$left = util_1.ensureConstant(left);
        this.$right = util_1.ensureConstant(right);
    }
}
/**
 * 一元比较条件
 */
class UnaryCompareCondition extends Condition {
    /**
     * 一元比较运算符
     * @param operator 运算符
     * @param expr 查询条件
     */
    constructor(operator, expr) {
        super(constants_1.SqlSymbol.UNARY);
        this.$operator = operator;
        util_1.assert(expr, 'next must not null');
        this.$condition = util_1.ensureCondition(expr);
    }
}
/**
 * IS NULL 运算
 */
class IsNullCondition extends UnaryCompareCondition {
    /**
     * @param expr 下一查询条件
     */
    constructor(expr) {
        super(constants_1.CompareOperator.IS_NULL, expr);
    }
}
/**
 * 是否为空值条件
 */
class IsNotNullCondition extends UnaryLogicCondition {
    /**
     * 是否空值
     * @param expr
     */
    constructor(expr) {
        super(constants_1.CompareOperator.IS_NOT_NULL, expr);
    }
}
/**
 * 联接查询
 */
class Join extends AST {
    /**
     * 创建一个表关联
     * @param table
     * @param on 关联条件
     * @param left 是否左联接
     */
    constructor(table, on, left = false) {
        super(constants_1.SqlSymbol.JOIN);
        /**
         * 关联表
        * @type {Table}
        */
        this.$table = util_1.ensureIdentity(table);
        /**
         * 关联条件
        * @type {Conditions}
        */
        this.$on = util_1.ensureCondition(on);
        /**
         * 是否左联接
         * @type {boolean}
         */
        this.$left = left;
    }
}
/**
 * 标识符，可以多级，如表名等
 */
class Identity extends Expression {
    /**
     * 标识符
     */
    constructor(name, parent) {
        super(constants_1.SqlSymbol.IDENTITY);
        this.$name = name;
        this.$parent = util_1.ensureIdentity(parent);
    }
    get lvalue() {
        return true;
    }
    /**
     * 访问下一节点
     * @param name
     */
    dot(name) {
        return new Identity(name, this);
    }
    /**
     * 访问下一节点
     * @param name 节点名称
     */
    $(name) {
        return this.dot(name);
    }
}
exports.Identity = Identity;
class Variant extends Expression {
    constructor(name) {
        super(constants_1.SqlSymbol.VARAINT);
        this.$name = name;
    }
    get lvalue() {
        return true;
    }
}
exports.Variant = Variant;
/**
 * 别名表达式
 */
class Alias extends Identity {
    /**
     * 别名构造函数
     * @param expr 表达式或表名
     * @param name 别名
     */
    constructor(expr, name) {
        super(name);
        util_1.assert(_.isString(name), 'The alias must type of string');
        // assertType(expr, [DbObject, Field, Constant, Select], 'alias must type of DbObject|Field|Constant|Bracket<Select>')
        this.$expr = util_1.ensureConstant(expr);
    }
}
exports.Alias = Alias;
/**
 * 函数调用表达式
 */
class Invoke extends Expression {
    constructor(func, params, abstract = false) {
        super(constants_1.SqlSymbol.INVOKE);
        this.$func = util_1.ensureIdentity(func);
        this.$params = params.map(exp => util_1.ensureConstant(exp));
        this.$abstract = abstract;
    }
    get lvalue() {
        return false;
    }
}
exports.Invoke = Invoke;
/**
 * SQL 语句
 */
class Statement extends AST {
}
exports.Statement = Statement;
/**
 * When语句
 */
class When extends AST {
    constructor(expr, value) {
        super(constants_1.SqlSymbol.WHEN);
        this.$expr = util_1.ensureConstant(expr);
        this.$value = util_1.ensureConstant(value);
    }
}
exports.When = When;
/**
 * CASE表达式
 */
class Case extends Expression {
    /**
     *
     * @param expr
     */
    constructor(expr) {
        super(constants_1.SqlSymbol.CASE);
        this.$expr = expr;
        /**
         * @type {When[]}
         */
        this.$whens = [];
    }
    get lvalue() {
        return false;
    }
    /**
     * ELSE语句
     * @param defaults
     */
    else(defaults) {
        this.$default = util_1.ensureConstant(defaults);
    }
    /**
     * WHEN语句
     * @param expr
     * @param then
     */
    when(expr, then) {
        this.$whens.push(new When(util_1.ensureConstant(expr), then));
    }
}
exports.Case = Case;
/**
 * 常量表达式
 */
class Constant extends Expression {
    constructor(value) {
        super(constants_1.SqlSymbol.CONSTANT);
        this.$value = value;
    }
    get lvalue() {
        return false;
    }
}
exports.Constant = Constant;
/**
 * 括号引用
 */
class Bracket extends Expression {
    constructor(context) {
        super(constants_1.SqlSymbol.BRACKET);
        this.$context = context;
    }
    get lvalue() {
        return false;
    }
}
exports.Bracket = Bracket;
/**
 * 二元运算表达式
 */
class BinaryComputeExpression extends Expression {
    /**
     * 名称
     * @param operator 运算符
     * @param left 左值
     * @param right 右值
     */
    constructor(operator, left, right) {
        super(constants_1.SqlSymbol.BINARY);
        util_1.assert(left, 'The argument left must not null');
        util_1.assert(right, 'The arguemnt right must not null');
        this.$operator = operator;
        /**
         * @type {Expressions}
         */
        this.$left = util_1.ensureConstant(left);
        /**
         * @type {Expressions}
         */
        this.$right = util_1.ensureConstant(right);
    }
    get lvalue() {
        return false;
    }
}
exports.BinaryComputeExpression = BinaryComputeExpression;
/**
 * - 运算符
 */
class UnaryComputeExpression extends Expression {
    /**
     * 一元运算目前只支持负数运算符
     * @param expr
     */
    constructor(operator, expr) {
        super(constants_1.SqlSymbol.UNARY);
        this.$type = constants_1.SqlSymbol.UNARY;
        /**
         * @type {Expressions}
         */
        this.$expr = util_1.ensureConstant(expr);
    }
    get lvalue() {
        return false;
    }
}
exports.UnaryComputeExpression = UnaryComputeExpression;
/**
 * 联接查询
 */
class Union extends AST {
    /**
     *
     * @param select SELECT语句
     * @param all 是否所有查询
     */
    constructor(select, all) {
        super(constants_1.SqlSymbol.UNION);
        this.$select = select;
        this.$all = all;
    }
}
/**
 * SELECT查询
 */
class Select extends Statement {
    constructor(options) {
        super(constants_1.SqlSymbol.SELECT);
        if (options?.from)
            this.from(...options.from);
        if (options?.joins)
            this.$joins = options.joins;
        if (options?.columns)
            this.columns(...options.columns);
        if (options?.where)
            this.where(options.where);
        if (options?.orderBy)
            this.orderBy(...options.orderBy);
        if (options?.groupBy)
            this.groupBy(...options.groupBy);
        if (options?.distinct === true)
            this.distinct();
        if (options?.top !== undefined)
            this.top(options.top);
        if (options?.offset !== undefined)
            this.offset(options.offset);
        if (options?.limit !== undefined)
            this.offset(options.limit);
    }
    columns(...columns) {
        util_1.assert(!this.$columns, 'columns is declared');
        if (columns.length === 1 && _.isPlainObject(columns[0])) {
            const obj = columns[0];
            this.$columns = Object.entries(obj).map(([alias, expr]) => new Alias(util_1.ensureConstant(expr), alias));
            return this;
        }
        // 实例化
        this.$columns = columns.map(expr => util_1.ensureConstant(expr));
        return this;
    }
    /**
     * 去除重复的
     */
    distinct() {
        this.$distinct = true;
        return this;
    }
    /**
     * TOP
     * @param rows 行数
     */
    top(rows) {
        util_1.assert(_.isUndefined(this.$top), 'top is declared');
        this.$top = rows;
        return this;
    }
    /**
     * 从表中查询，可以查询多表
     * @param tables
     */
    from(...tables) {
        // assert(!this.$from, 'from已经声明')
        this.$from = tables.map(table => util_1.ensureIdentity(table));
        return this;
    }
    /**
     * 表联接
     * @param table
     * @param on
     * @param left
     * @memberof Select
     */
    join(table, on, left = false) {
        util_1.assert(this.$from, 'join must after from clause');
        if (!this.$joins) {
            this.$joins = [];
        }
        this.$joins.push(new Join(table, on, left));
        return this;
    }
    /**
     * 左联接
     * @param table
     * @param on
     */
    leftJoin(table, on) {
        return this.join(table, on, true);
    }
    /**
     * where查询条件
     * @param condition
     */
    where(condition) {
        util_1.assert(!this.$where, 'where is declared');
        if (_.isPlainObject(condition)) {
            condition = util_1.ensureCondition(condition);
        }
        util_1.assert(condition instanceof Condition, 'Then argument condition must type of Condition');
        this.$where = condition;
        return this;
    }
    orderBy(...sorts) {
        // assert(!this.$orders, 'order by clause is declared')
        util_1.assert(sorts.length > 0, 'must have one or more order basis');
        // 如果传入的是对象类型
        if (sorts.length === 1 && _.isPlainObject(sorts[0])) {
            const obj = sorts[0];
            this.$orderBy = Object.entries(obj).map(([expr, direction]) => ({
                $expr: new Identity(expr),
                $direction: direction
            }));
            return this;
        }
        sorts = sorts;
        this.$orderBy = sorts.map(expr => _.isObject(expr) ? expr : {
            $expr: util_1.ensureConstant(expr),
            $direction: constants_1.SortDirection.ASC
        });
        return this;
    }
    /**
     * 分组查询
     * @param groups
     */
    groupBy(...groups) {
        this.$groupBy = groups.map(expr => util_1.ensureConstant(expr));
        return this;
    }
    /**
     * Having 子句
     * @param condition
     */
    having(condition) {
        util_1.assert(!this.$having, 'having is declared');
        util_1.assert(this.$groupBy, 'Syntax error, group by is not declared.');
        if (!(condition instanceof Condition)) {
            condition = util_1.ensureCondition(condition);
        }
        this.$having = condition;
        return this;
    }
    /**
     * 偏移数
     * @param rows
     */
    offset(rows) {
        this.$offset = rows;
        return this;
    }
    /**
     * 限定数
     * @param rows
     */
    limit(rows) {
        util_1.assert(_.isNumber(rows), 'The argument rows must type of Number');
        this.$limit = rows;
        return this;
    }
    /**
     * 合并查询
     */
    union(select, all = false) {
        this.$union = new Union(select, all);
    }
    unionAll(select) {
        return this.union(select, true);
    }
    /**
     * 将本SELECT返回表达式
     * @returns 返回一个加()后的SELECT语句
     */
    quoted() {
        return new Bracket(this);
    }
    /**
     * 将本次查询，转换为Table行集
     * @param alias
     */
    as(alias) {
        return new Alias(this.quoted(), alias);
    }
}
exports.Select = Select;
/**
 * Insert 语句
 */
class Insert extends Statement {
    /**
     * 构造函数
     */
    constructor(options) {
        super(constants_1.SqlSymbol.INSERT);
        if (options?.table) {
            this.into(options.table);
        }
        if (options?.fields) {
            this.fields(...options.fields);
        }
        if (options?.values) {
            this.values(options.values);
        }
    }
    /**
     * 插入至表
     * @param table
     * @param fields
     */
    into(table) {
        util_1.assert(!this.$table, 'The into clause is declared');
        this.$table = util_1.ensureIdentity(table);
        return this;
    }
    /**
     * 字段列表
     * @param  {string[]|Field[]} fields
     */
    fields(...fields) {
        util_1.assert(fields.length > 0, 'fields not allow empty.');
        /**
         * 字段列表
         * @type {Expression[]}
         */
        this.$fields = fields.map(p => util_1.ensureIdentity(p));
        return this;
    }
    values(...rows) {
        util_1.assert(!this.$values, 'values is declared');
        util_1.assert(rows.length > 0, 'rows must more than one elements.');
        if (rows.length === 1 && rows[0] instanceof Select) {
            this.$values = rows[0];
            return this;
        }
        if (rows.length === 1 && !this.$fields) {
            this.fields(...Object.keys(rows[0]));
        }
        if (!this.$fields) {
            throw new Error('Multi rows must declare field');
        }
        this.$values = rows.map(row => {
            if (_.isArray(row)) {
                return row.map(expr => util_1.ensureConstant(expr));
            }
            if (_.isPlainObject(row)) {
                return this.$fields.map(key => util_1.ensureConstant(row[key.$name]));
            }
            throw new Error('Invalid type');
        });
        return this;
    }
}
exports.Insert = Insert;
class Update extends AST {
    constructor(options) {
        super(constants_1.SqlSymbol.UPDATE);
        if (options?.table)
            this.from(options.table);
        if (options?.sets)
            this.set(options.sets);
        if (options?.where)
            this.where(options.where);
        if (options?.joins)
            this.$joins = options.joins;
    }
    from(table) {
        util_1.assert(!this.$table, 'from table已经声明');
        this.$table = util_1.ensureIdentity(table);
        return this;
    }
    /**
     * 内联接
     * @param table
     * @param on
     * @param left
     * @memberof Select
     */
    join(table, on = null, left = false) {
        util_1.assert(this.$table, 'join must after from clause');
        if (!this.$joins) {
            this.$joins = [];
        }
        this.$joins.push(new Join(table, on, left));
        return this;
    }
    leftJoin(table, on) {
        return this.join(table, on, true);
    }
    set(...sets) {
        util_1.assert(!this.$sets, 'set statement is declared');
        util_1.assert(sets.length > 0, 'sets must have more than 0 items');
        if (sets.length === 1 && _.isPlainObject(sets[0])) {
            const obj = sets[0];
            this.$sets = Object.entries(obj).map(([key, value]) => new Assignment(new Identity(key), util_1.ensureConstant(value)));
            return this;
        }
        this.$sets = sets;
        return this;
    }
    /**
     * 查询条件
     * @param condition
     */
    where(condition) {
        util_1.assert(!this.$where, 'where clause is declared');
        condition = util_1.ensureCondition(condition);
        this.$where = condition;
        return this;
    }
}
exports.Update = Update;
class Delete extends AST {
    constructor(options) {
        super(constants_1.SqlSymbol.DELETE);
        if (options?.table)
            this.from(options.table);
        if (options?.joins)
            this.$joins = options.joins;
        if (options?.where)
            this.where(options.where);
    }
    from(table) {
        util_1.assert(!this.$table, 'table 已经声明');
        this.$table = util_1.ensureIdentity(table);
    }
    /**
     * 内联接
     * @param table
     * @param on
     * @param left
     * @memberof Select
     */
    join(table, on, left = false) {
        util_1.assert(this.$table, 'join must after from clause');
        if (!this.$joins) {
            this.$joins = [];
        }
        this.$joins.push(new Join(table, on, left));
        return this;
    }
    leftJoin(table, on) {
        return this.join(table, on, true);
    }
    where(condition) {
        this.$where = util_1.ensureCondition(condition);
        return this;
    }
}
exports.Delete = Delete;
/**
 * 存储过程执行
 */
class Execute extends Statement {
    constructor(proc, params) {
        super(constants_1.SqlSymbol.EXECUTE);
        this.$proc = util_1.ensureIdentity(proc);
        if (params.length === 0) {
            this.$params = [];
        }
        if (!(params[0] instanceof Parameter)) {
            this.$params = params.map(expr => util_1.ensureConstant(expr));
        }
        this.$params = params;
    }
}
exports.Execute = Execute;
/**
 * 赋值表达式
 */
class Assignment extends AST {
    constructor(left, right) {
        super(constants_1.SqlSymbol.ASSIGNMENT);
        util_1.assert(left.lvalue, 'Argument left not lvalue');
        this.$left = left;
        this.$right = util_1.ensureConstant(right);
    }
}
exports.Assignment = Assignment;
// class Declare extends AST {
//   constructor(name, dataType) {
//     super($declare)
//     this.$name = name
//     this.$dataType = dataType
//   }
// }
class Parameter extends AST {
    constructor(name, value, direction = constants_1.ParameterDirection.INPUT) {
        super(constants_1.SqlSymbol.PARAMETER);
        this.$name = util_1.ensureIdentity(name);
        this.$value = util_1.ensureConstant(value);
        this.$direction = direction;
    }
}
exports.Parameter = Parameter;
//# sourceMappingURL=ast.js.map