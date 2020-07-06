"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Document = exports.Parameter = exports.Declare = exports.Assignment = exports.Execute = exports.Delete = exports.Update = exports.Insert = exports.Select = exports.SortInfo = exports.Union = exports.UnaryExpression = exports.BinaryExpression = exports.QuotedCondition = exports.Bracket = exports.List = exports.Constant = exports.Case = exports.When = exports.Statement = exports.Invoke = exports.Alias = exports.Variant = exports.Identifier = exports.Raw = exports.Join = exports.BinaryLogicCondition = exports.Condition = exports.Expression = exports.AST = void 0;
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
        this.type = type;
    }
    static bracket(context) {
        return new Bracket(context);
    }
}
exports.AST = AST;
// export interface IExpression {
//   /**
//    * 加法运算
//    */
//   add(expr: UnsureExpressions): Expression
//   /**
//    * 减法运算
//    */
//   sub(expr: UnsureExpressions): Expression
//   /**
//    * 乘法运算
//    * @param expr 要与当前表达式相乘的表达式
//    */
//   mul(expr: UnsureExpressions): Expression
//   /**
//    * 除法运算
//    * @param expr 要与当前表达式相除的表达式
//    * @returns 返回运算后的表达式
//    */
//   div(expr: UnsureExpressions): Expression
//   /**
//    * 算术运算 %
//    * @param expr 要与当前表达式相除的表达式
//    * @returns 返回运算后的表达式
//    */
//   mod(expr: UnsureExpressions): Expression
//   and(expr: UnsureExpressions): Expression
//   or(expr: UnsureExpressions): Expression
//   not(expr: UnsureExpressions): Expression
//   /**
//    * 位运算 ^
//    * @param expr 要与当前表达式相除的表达式
//    * @returns 返回运算后的表达式
//    */
//   xor(expr: UnsureExpressions): Expression
//   /**
//    * 位运算 <<
//    * @param expr 要与当前表达式相除的表达式
//    * @returns 返回运算后的表达式
//    */
//   shl(expr: UnsureExpressions): Expression
//   /**
//    * 位运算 >>
//    * @param expr 要与当前表达式相除的表达式
//    * @returns 返回运算后的表达式
//    */
//   shr(expr: UnsureExpressions): Expression
//   /**
//    * 比较是否相等 =
//    * @param expr 要与当前表达式相比较的表达式
//    * @returns 返回对比条件表达式
//    */
//   eq(expr: UnsureExpressions): Condition
//   /**
//    * 比较是否不等于 <>
//    * @param expr 要与当前表达式相比较的表达式
//    * @returns 返回对比条件表达式
//    */
//   neq(expr: UnsureExpressions): Condition
//   /**
//    * 比较是否小于 <
//    * @param expr 要与当前表达式相比较的表达式
//    * @returns 返回对比条件表达式
//    */
//   lt(expr: UnsureExpressions): Condition
//   /**
//    * 比较是否小于等于 <=
//    * @param expr 要与当前表达式相比较的表达式
//    * @returns 返回对比条件表达式
//    */
//   lte(expr: UnsureExpressions): Condition
//   /**
//    * 比较是否大于 >
//    * @param expr 要与当前表达式相比较的表达式
//    * @returns 返回对比条件表达式
//    */
//   gt(expr: UnsureExpressions): Condition
//   /**
//    * 比较是否小于等于 >=
//    * @param expr 要与当前表达式相比较的表达式
//    * @returns 返回对比条件表达式
//    */
//   gte(expr: UnsureExpressions): Condition
//   /**
//    * 比较是相像 LIKE
//    * @param expr 要与当前表达式相比较的表达式
//    * @returns 返回对比条件表达式
//    */
//   like(expr: UnsureExpressions): Condition
//   /**
//    * 比较是否不想像 NOT LIKE
//    * @param expr 要与当前表达式相比较的表达式
//    * @returns 返回对比条件表达式
//    */
//   notLike(expr: UnsureExpressions): Condition
//   /**
//    * 比较是否不包含于 IN
//    * @param values 要与当前表达式相比较的表达式数组
//    * @returns 返回对比条件表达式
//    */
//   in(...values: UnsureExpressions[]): Condition
//   /**
//    * 比较是否不包含于 NOT IN
//    * @param values 要与当前表达式相比较的表达式
//    * @returns 返回对比条件表达式
//    */
//   notIn(...values: UnsureExpressions[]): Condition
//   /**
//    * 比较是否为空 IS NULL
//    * @returns 返回对比条件表达式
//    */
//   isNull(): Condition
//   /**
//    * 比较是否为空 IS NOT NULL
//    * @returns 返回对比条件表达式
//    */
//   isNotNull(): Condition
//   /**
//    * isNotNull 的简称别名
//    * @returns 返回对比条件表达式
//    */
//   notNull(): Condition
//   /**
//    * 正序
//    * @returns 返回对比条件表达式
//    */
//   asc(): SortInfo
//   /**
//    * 倒序
//    * @returns 返回对比条件表达式
//    */
//   desc(): SortInfo
//   /**
//    * 为当前表达式添加别名
//    */
//   as(alias: string): Identifier
// }
// const ExpressionPrototype: IExpression = {
// }
/**
 * 表达式基类，抽象类
 */
class Expression extends AST {
    /**
     * 加法运算
     */
    add(expr) {
        return Expression.add(this, expr);
    }
    /**
     * 减法运算
     */
    sub(expr) {
        return Expression.sub(this, expr);
    }
    /**
     * 乘法运算
     * @param expr 要与当前表达式相乘的表达式
     */
    mul(expr) {
        return Expression.mul(this, expr);
    }
    /**
     * 除法运算
     * @param expr 要与当前表达式相除的表达式
     * @returns 返回运算后的表达式
     */
    div(expr) {
        return Expression.div(this, expr);
    }
    /**
     * 算术运算 %
     * @param expr 要与当前表达式相除的表达式
     * @returns 返回运算后的表达式
     */
    mod(expr) {
        return Expression.mod(this, expr);
    }
    /**
     * 位运算 &
     * @param expr 要与当前表达式相除的表达式
     * @returns 返回运算后的表达式
     */
    and(expr) {
        return Expression.and(this, expr);
    }
    /**
     * 位运算 |
     * @param expr 要与当前表达式相除的表达式
     * @returns 返回运算后的表达式
     */
    or(expr) {
        return Expression.or(this, expr);
    }
    /**
     * 位运算 ~
     * @param expr 要与当前表达式相除的表达式
     * @returns 返回运算后的表达式
     */
    not(expr) {
        return Expression.not(this, expr);
    }
    /**
     * 位运算 ^
     * @param expr 要与当前表达式相除的表达式
     * @returns 返回运算后的表达式
     */
    xor(expr) {
        return Expression.xor(this, expr);
    }
    /**
     * 位运算 <<
     * @param expr 要与当前表达式相除的表达式
     * @returns 返回运算后的表达式
     */
    shl(expr) {
        return Expression.shl(this, expr);
    }
    /**
     * 位运算 >>
     * @param expr 要与当前表达式相除的表达式
     * @returns 返回运算后的表达式
     */
    shr(expr) {
        return Expression.shr(this, expr);
    }
    /**
     * 比较是否相等 =
     * @param expr 要与当前表达式相比较的表达式
     * @returns 返回对比条件表达式
     */
    eq(expr) {
        return Condition.eq(this, expr);
    }
    /**
     * 比较是否不等于 <>
     * @param expr 要与当前表达式相比较的表达式
     * @returns 返回对比条件表达式
     */
    neq(expr) {
        return Condition.neq(this, expr);
    }
    /**
     * 比较是否小于 <
     * @param expr 要与当前表达式相比较的表达式
     * @returns 返回对比条件表达式
     */
    lt(expr) {
        return Condition.lt(this, expr);
    }
    /**
     * 比较是否小于等于 <=
     * @param expr 要与当前表达式相比较的表达式
     * @returns 返回对比条件表达式
     */
    lte(expr) {
        return Condition.lte(this, expr);
    }
    /**
     * 比较是否大于 >
     * @param expr 要与当前表达式相比较的表达式
     * @returns 返回对比条件表达式
     */
    gt(expr) {
        return Condition.gt(this, expr);
    }
    /**
     * 比较是否小于等于 >=
     * @param expr 要与当前表达式相比较的表达式
     * @returns 返回对比条件表达式
     */
    gte(expr) {
        return Condition.gte(this, expr);
    }
    /**
     * 比较是相像 LIKE
     * @param expr 要与当前表达式相比较的表达式
     * @returns 返回对比条件表达式
     */
    like(expr) {
        return Condition.like(this, expr);
    }
    /**
     * 比较是否不想像 NOT LIKE
     * @param expr 要与当前表达式相比较的表达式
     * @returns 返回对比条件表达式
     */
    notLike(expr) {
        return Condition.notLike(this, expr);
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
        return new SortInfo(this, constants_1.SORT_DIRECTION.ASC);
    }
    /**
     * 倒序
     * @returns 返回对比条件表达式
     */
    desc() {
        return new SortInfo(this, constants_1.SORT_DIRECTION.DESC);
    }
    /**
     * 为当前表达式添加别名
     */
    as(alias) {
        const identifier = new Alias(this, alias);
        if (identifier instanceof Identifier) {
            return util_1.makeProxyIdentity(identifier);
        }
        return identifier;
    }
    /**
     * 算术运算 +
     * @param left 左值
     * @param right 右值
     * @returns 返回算术运算表达式
     */
    static add(left, right) {
        return new BinaryExpression(constants_1.COMPUTE_OPERATOR.ADD, left, right);
    }
    /**
     * 算术运算 -
     * @param left 左值
     * @param right 右值
     * @returns 返回算术运算表达式
     */
    static sub(left, right) {
        return new BinaryExpression(constants_1.COMPUTE_OPERATOR.SUB, left, right);
    }
    /**
     * 算术运算 *
     * @param left 左值
     * @param right 右值
     * @returns 返回算术运算表达式
     */
    static mul(left, right) {
        return new BinaryExpression(constants_1.COMPUTE_OPERATOR.MUL, left, right);
    }
    /**
     * 算术运算 /
     * @param left 左值
     * @param right 右值
     * @returns 返回算术运算表达式
     */
    static div(left, right) {
        return new BinaryExpression(constants_1.COMPUTE_OPERATOR.DIV, left, right);
    }
    /**
     * 算术运算 %
     * @param left 左值
     * @param right 右值
     * @returns 返回算术运算表达式
     */
    static mod(left, right) {
        return new BinaryExpression(constants_1.COMPUTE_OPERATOR.MOD, left, right);
    }
    /**
     * 位算术运算 &
     * @param left 左值
     * @param right 右值
     * @returns 返回算术运算表达式
     */
    static and(left, right) {
        return new BinaryExpression(constants_1.COMPUTE_OPERATOR.BITAND, left, right);
    }
    /**
     * 位算术运算 |
     * @param left 左值
     * @param right 右值
     * @returns 返回算术运算表达式
     */
    static or(left, right) {
        return new BinaryExpression(constants_1.COMPUTE_OPERATOR.BITOR, left, right);
    }
    /**
     * 位算术运算 ^
     * @param left 左值
     * @param right 右值
     * @returns 返回算术运算表达式
     */
    static xor(left, right) {
        return new BinaryExpression(constants_1.COMPUTE_OPERATOR.BITXOR, left, right);
    }
    /**
     * 位算术运算 ~
     * @param left 左值
     * @param right 右值
     * @returns 返回算术运算表达式
     */
    static not(left, right) {
        return new BinaryExpression(constants_1.COMPUTE_OPERATOR.BITNOT, left, right);
    }
    /**
     * 位算术运算 <<
     * @param left 左值
     * @param right 右值
     * @returns 返回算术运算表达式
     */
    static shl(left, right) {
        return new BinaryExpression(constants_1.COMPUTE_OPERATOR.SHL, left, right);
    }
    /**
     * 位算术运算 >>
     * @param left 左值
     * @param right 右值
     * @returns 返回算术运算表达式
     */
    static shr(left, right) {
        return new BinaryExpression(constants_1.COMPUTE_OPERATOR.SHR, left, right);
    }
    /**
     * 常量
     * @param value 常量值
     */
    static constant(value) {
        return new Constant(value);
    }
    /**
     * 常量，constant 的别名
     * @param value 常量值
     */
    static const(value) {
        return Expression.constant(value);
    }
    /**
     * 变量
     * @param name 变量名称，不需要带前缀
     */
    static variant(name) {
        return new Variant(name);
    }
    /**
     * 变量，variant的别名
     * @param name 变量名，不需要带前缀
     */
    static var(name) {
        return Expression.variant(name);
    }
    static alias(expr, name) {
        return new Alias(expr, name);
    }
    /**
     * 任意字段 *
     * @param parent parent identifier
     */
    static any(parent) {
        return Identifier.any(parent);
    }
    /**
     * 标识符
     */
    static identifier(...names) {
        util_1.assert(names.length > 0, 'must have one or more names');
        util_1.assert(names.length < 6, 'nodes deepth max 6 level');
        let identity;
        names.forEach(name => {
            if (!identity) {
                identity = Identifier.normal(name);
            }
            else {
                identity = identity.dot(name);
            }
        });
        return identity;
    }
    /**
     * 代理化的identifier，可以自动接受字段名
     * @param name
     */
    static proxyIdentifier(name) {
        return util_1.makeProxyIdentity(util_1.ensureIdentity(name));
    }
    /**
     * 创建表对象，该对象是可代理的，可以直接以 . 运算符获取下一节点Identifier
     * @param names
     */
    static table(...names) {
        return Expression.proxyIdentifier(Expression.identifier(...names));
    }
    /**
     * 字段，实为 identifier(...names) 别名
     * @param names
     */
    static field(...names) {
        return Expression.identifier(...names);
    }
    /**
     * 调用表达式
     * @param func 函数
     * @param params 参数
     */
    static invoke(func, params) {
        return new Invoke(func, params);
    }
}
exports.Expression = Expression;
const ConditionPrototype = {
    /**
     * and连接
     * @param condition 下一个查询条件
     * @returns 返回新的查询条件
     */
    and(condition) {
        condition = util_1.ensureCondition(condition);
        return new BinaryLogicCondition(constants_1.LOGIC_OPERATOR.AND, this, condition);
    },
    /**
     * and连接
     * @param condition 下一个查询条件
     * @returns 返回新的查询条件
     */
    andGroup(condition) {
        condition = util_1.ensureCondition(condition);
        return new BinaryLogicCondition(constants_1.LOGIC_OPERATOR.AND, this, Condition.quoted(condition));
    },
    /**
     * OR语句
     * @param condition
     * @returns 返回新的查询条件
     */
    or(condition) {
        condition = util_1.ensureCondition(condition);
        return new BinaryLogicCondition(constants_1.LOGIC_OPERATOR.OR, this, condition);
    },
    /**
     * and连接
     * @param condition 下一个查询条件
     * @returns 返回新的查询条件
     */
    orGroup(condition) {
        condition = util_1.ensureCondition(condition);
        return new BinaryLogicCondition(constants_1.LOGIC_OPERATOR.OR, this, Condition.quoted(condition));
    }
};
/**
 * 查询条件
 */
class Condition extends AST {
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
            return new BinaryLogicCondition(constants_1.LOGIC_OPERATOR.AND, previous, current);
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
            return new BinaryLogicCondition(constants_1.LOGIC_OPERATOR.OR, previous, current);
        });
    }
    /**
     * Not 逻辑运算
     * @param condition
     */
    static not(condition) {
        condition = util_1.ensureCondition(condition);
        return new UnaryLogicCondition(constants_1.LOGIC_OPERATOR.NOT, condition);
    }
    /**
     * 判断是否存在
     * @param select 查询语句
     */
    static exists(select) {
        return new UnaryCompareCondition(constants_1.COMPARE_OPERATOR.EXISTS, AST.bracket(select));
    }
    /**
     * 比较运算
     * @private
     * @param left 左值
     * @param right 右值
     * @param operator 运算符
     * @returns 返回比较运算对比条件
     */
    static compare(left, right, operator = constants_1.COMPARE_OPERATOR.EQ) {
        return new BinaryCompareCondition(operator, left, right);
    }
    /**
     * 比较运算 =
     * @param left 左值
     * @param right 右值
     * @returns 返回比较运算对比条件
     */
    static eq(left, right) {
        return Condition.compare(left, right, constants_1.COMPARE_OPERATOR.EQ);
    }
    /**
     * 比较运算 <>
     * @param left 左值
     * @param right 右值
     * @returns 返回比较运算对比条件
     */
    static neq(left, right) {
        return Condition.compare(left, right, constants_1.COMPARE_OPERATOR.NEQ);
    }
    /**
     * 比较运算 <
     * @param left 左值
     * @param right 右值
     * @returns 返回比较运算对比条件
     */
    static lt(left, right) {
        return Condition.compare(left, right, constants_1.COMPARE_OPERATOR.LT);
    }
    /**
     * 比较运算 <=
     * @param left 左值
     * @param right 右值
     * @returns 返回比较运算对比条件
     */
    static lte(left, right) {
        return Condition.compare(left, right, constants_1.COMPARE_OPERATOR.LTE);
    }
    /**
     * 比较运算 >
     * @param left 左值
     * @param right 右值
     * @returns 返回比较运算对比条件
     */
    static gt(left, right) {
        return Condition.compare(left, right, constants_1.COMPARE_OPERATOR.GT);
    }
    /**
     * 比较运算 >=
     * @param left 左值
     * @param right 右值
     * @returns 返回比较运算对比条件
     */
    static gte(left, right) {
        return Condition.compare(left, right, constants_1.COMPARE_OPERATOR.GTE);
    }
    /**
     * 比较运算 LIKE
     * @param left 左值
     * @param right 右值
     * @returns 返回比较运算对比条件
     */
    static like(left, right) {
        return Condition.compare(left, right, constants_1.COMPARE_OPERATOR.LIKE);
    }
    /**
     * 比较运算 NOT LIKE
     * @param left 左值
     * @param right 右值
     * @returns 返回比较运算对比条件
     */
    static notLike(left, right) {
        return Condition.compare(left, right, constants_1.COMPARE_OPERATOR.NOT_LIKE);
    }
    /**
     * 比较运算 IN
     * @param left 左值
     * @param values 要比较的值列表
     * @returns 返回比较运算对比条件
     */
    static in(left, values) {
        return Condition.compare(left, util_1.ensureGroupValues(values), constants_1.COMPARE_OPERATOR.IN);
    }
    /**
     * 比较运算 NOT IN
     * @param left 左值
     * @param values 要比较的值列表
     * @returns 返回比较运算对比条件
     */
    static notIn(left, values) {
        return Condition.compare(left, util_1.ensureGroupValues(values), constants_1.COMPARE_OPERATOR.NOT_IN);
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
    /**
     * 括号条件
     * @param condition 查询条件
     */
    static quoted(condition) {
        return new QuotedCondition(condition);
    }
}
exports.Condition = Condition;
Object.assign(Condition.prototype, ConditionPrototype);
/**
 * 二元逻辑查询条件条件
 */
class BinaryLogicCondition extends Condition {
    /**
     * 创建二元逻辑查询条件实例
     */
    constructor(operator, left, right) {
        super(constants_1.SQL_SYMBOLE.BINARY);
        this.operator = operator;
        /**
         * 左查询条件
         */
        this.left = util_1.ensureCondition(left);
        /**
         * 右查询条件
         */
        this.right = util_1.ensureCondition(right);
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
        super(constants_1.SQL_SYMBOLE.UNARY);
        this.operator = operator;
        this.next = util_1.ensureCondition(next);
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
        super(constants_1.SQL_SYMBOLE.BINARY);
        this.operator = operator;
        this.left = util_1.ensureConstant(left);
        if (_.isArray(right) || right instanceof List) {
            this.right = util_1.ensureGroupValues(right);
        }
        else {
            this.right = util_1.ensureConstant(right);
        }
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
        super(constants_1.SQL_SYMBOLE.UNARY);
        this.operator = operator;
        util_1.assert(expr, 'next must not null');
        this.next = util_1.ensureConstant(expr);
    }
}
/**
 * IS NULL 运算
 */
class IsNullCondition extends UnaryCompareCondition {
    /**
     * @param next 表达式
     */
    constructor(next) {
        super(constants_1.COMPARE_OPERATOR.IS_NULL, next);
    }
}
/**
 * 是否为空值条件
 */
class IsNotNullCondition extends UnaryLogicCondition {
    /**
     * 是否空值
     * @param next 表达式
     */
    constructor(next) {
        super(constants_1.COMPARE_OPERATOR.IS_NOT_NULL, next);
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
        super(constants_1.SQL_SYMBOLE.JOIN);
        /**
         * 关联表
        * @type {Table}
        */
        this.table = util_1.ensureIdentity(table);
        /**
         * 关联条件
        * @type {Condition}
        */
        this.on = util_1.ensureCondition(on);
        /**
         * 是否左联接
         * @type {boolean}
         */
        this.left = left;
    }
}
exports.Join = Join;
class Raw extends AST {
    constructor(sql) {
        super(constants_1.SQL_SYMBOLE.RAW);
        this.sql = sql;
    }
}
exports.Raw = Raw;
/**
 * 标识符，可以多级，如表名等
 */
class Identifier extends Expression {
    /**
     * 标识符
     */
    constructor(name, parent, type = constants_1.SQL_SYMBOLE.IDENTIFIER) {
        super(type);
        this.name = name;
        if (parent) {
            this.parent = util_1.ensureIdentity(parent);
        }
        else {
            this.parent = null;
        }
    }
    get lvalue() {
        return true;
    }
    /**
     * 访问下一节点
     * @param name
     */
    dot(name) {
        return new Identifier(name, this);
    }
    any() {
        return Identifier.any(this);
    }
    /**
     * 执行一个函数
     * @param params
     */
    invoke(...params) {
        return new Invoke(this, params);
    }
    /**
     * 常规标识符
     */
    static normal(name) {
        return new Identifier(name);
    }
    /**
     * 内建标识符
     */
    static buildIn(name) {
        return new Identifier(name, null, constants_1.SQL_SYMBOLE.BUILDIN_IDENTIFIER);
    }
    /**
     * 内建标识符
     */
    static any(parent) {
        return new Identifier('*', parent, constants_1.SQL_SYMBOLE.BUILDIN_IDENTIFIER);
    }
}
exports.Identifier = Identifier;
class Variant extends Expression {
    constructor(name) {
        super(constants_1.SQL_SYMBOLE.VARAINT);
        this.name = name;
    }
    get lvalue() {
        return true;
    }
}
exports.Variant = Variant;
/**
 * 别名表达式
 */
class Alias extends Identifier {
    /**
     * 别名构造函数
     * @param expr 表达式或表名
     * @param name 别名
     */
    constructor(expr, name) {
        super(name, null, constants_1.SQL_SYMBOLE.ALIAS);
        util_1.assert(_.isString(name), 'The alias must type of string');
        // assertType(expr, [DbObject, Field, Constant, Select], 'alias must type of DbObject|Field|Constant|Bracket<Select>')
        this.expr = util_1.ensureConstant(expr);
    }
}
exports.Alias = Alias;
/**
 * 函数调用表达式
 */
class Invoke extends Expression {
    /**
     * 函数调用
     */
    constructor(func, args) {
        super(constants_1.SQL_SYMBOLE.INVOKE);
        this.func = util_1.ensureIdentity(func);
        this.args = List.invokeArgs(...args);
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
    /**
     * 插入至表,into的别名
     * @param table
     * @param fields
     */
    static insert(table, fields) {
        return new Insert(table, fields);
    }
    /**
     * 更新一个表格
     * @param table
     */
    static update(table) {
        return new Update(table).from(table);
    }
    /**
     * 删除一个表格
     * @param table 表格
     */
    static delete(table) {
        return new Delete(table);
    }
    static select(...args) {
        return new Select(...args);
    }
    static execute(proc, params) {
        return new Execute(proc, params);
    }
    static exec(proc, params) {
        return new Execute(proc, params);
    }
    /**
     * 赋值语句
     * @param left 左值
     * @param right 右值
     */
    static assign(left, right) {
        return new Assignment(left, right);
    }
    /**
     * 变量声明
     * @param declares 变量列表
     */
    static declare(...declares) {
        return new Declare(...declares);
    }
    /**
     * WHEN 语句块
     * @param expr
     * @param value
     */
    static when(expr, value) {
        return new When(expr, value);
    }
    static case(expr) {
        return new Case(expr);
    }
}
exports.Statement = Statement;
/**
 * When语句
 */
class When extends AST {
    constructor(expr, value) {
        super(constants_1.SQL_SYMBOLE.WHEN);
        this.expr = util_1.ensureConstant(expr);
        if (value) {
            this.value = util_1.ensureConstant(value);
        }
    }
    then(value) {
        this.value = util_1.ensureConstant(value);
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
        super(constants_1.SQL_SYMBOLE.CASE);
        this.expr = util_1.ensureConstant(expr);
        /**
         * @type {When[]}
         */
        this.whens = [];
    }
    get lvalue() {
        return false;
    }
    /**
     * ELSE语句
     * @param defaults
     */
    else(defaults) {
        this.defaults = util_1.ensureConstant(defaults);
        return this;
    }
    /**
     * WHEN语句
     * @param expr
     * @param then
     */
    when(expr, then) {
        this.whens.push(new When(util_1.ensureConstant(expr), then));
        return this;
    }
}
exports.Case = Case;
/**
 * 常量表达式
 */
class Constant extends Expression {
    constructor(value) {
        super(constants_1.SQL_SYMBOLE.CONSTANT);
        this.value = value;
    }
    get lvalue() {
        return false;
    }
}
exports.Constant = Constant;
/**
 * 值列表（不含括号）
 */
class List extends AST {
    constructor(symbol, ...values) {
        super(symbol);
        this.items = values.map(value => util_1.ensureConstant(value));
    }
    static values(...values) {
        return new List(constants_1.SQL_SYMBOLE.VALUE_LIST, ...values);
    }
    static columns(...exprs) {
        return new List(constants_1.SQL_SYMBOLE.COLUMN_LIST, ...exprs);
    }
    static invokeArgs(...exprs) {
        return new List(constants_1.SQL_SYMBOLE.INVOKE_ARGUMENT_LIST, ...exprs);
    }
    static execArgs(...exprs) {
        return new List(constants_1.SQL_SYMBOLE.EXECUTE_ARGUMENT_LIST, ...exprs);
    }
}
exports.List = List;
/**
 * 括号引用
 */
class Bracket extends Expression {
    constructor(context) {
        super(constants_1.SQL_SYMBOLE.BRACKET_EXPRESSION);
        this.context = context;
    }
    get lvalue() {
        return false;
    }
}
exports.Bracket = Bracket;
// export class BracketExpression extends Bracket<Expressions | List | Select> implements IExpression {
//   /**
//    * 加法运算
//    */
//   add: (expr: UnsureExpressions) => Expression
//   /**
//    * 减法运算
//    */
//   sub: (expr: UnsureExpressions) => Expression
//   /**
//    * 乘法运算
//    * @param expr 要与当前表达式相乘的表达式
//    */
//   mul: (expr: UnsureExpressions) => Expression
//   /**
//    * 除法运算
//    * @param expr 要与当前表达式相除的表达式
//    * @returns 返回运算后的表达式
//    */
//   div: (expr: UnsureExpressions) => Expression
//   /**
//    * 算术运算 %
//    * @param expr 要与当前表达式相除的表达式
//    * @returns 返回运算后的表达式
//    */
//   mod: (expr: UnsureExpressions) => Expression
//   and: (expr: UnsureExpressions) => Expression
//   or: (expr: UnsureExpressions) => Expression
//   not: (expr: UnsureExpressions) => Expression
//   /**
//    * 位运算 ^
//    * @param expr 要与当前表达式相除的表达式
//    * @returns 返回运算后的表达式
//    */
//   xor: (expr: UnsureExpressions) => Expression
//   /**
//    * 位运算 <<
//    * @param expr 要与当前表达式相除的表达式
//    * @returns 返回运算后的表达式
//    */
//   shl: (expr: UnsureExpressions) => Expression
//   /**
//    * 位运算 >>
//    * @param expr 要与当前表达式相除的表达式
//    * @returns 返回运算后的表达式
//    */
//   shr: (expr: UnsureExpressions) => Expression
//   /**
//    * 比较是否相等 =
//    * @param expr 要与当前表达式相比较的表达式
//    * @returns 返回对比条件表达式
//    */
//   eq: (expr: UnsureExpressions) => Condition
//   /**
//    * 比较是否不等于 <>
//    * @param expr 要与当前表达式相比较的表达式
//    * @returns 返回对比条件表达式
//    */
//   neq: (expr: UnsureExpressions) => Condition
//   /**
//    * 比较是否小于 <
//    * @param expr 要与当前表达式相比较的表达式
//    * @returns 返回对比条件表达式
//    */
//   lt: (expr: UnsureExpressions) => Condition
//   /**
//    * 比较是否小于等于 <=
//    * @param expr 要与当前表达式相比较的表达式
//    * @returns 返回对比条件表达式
//    */
//   lte: (expr: UnsureExpressions) => Condition
//   /**
//    * 比较是否大于 >
//    * @param expr 要与当前表达式相比较的表达式
//    * @returns 返回对比条件表达式
//    */
//   gt: (expr: UnsureExpressions) => Condition
//   /**
//    * 比较是否小于等于 >=
//    * @param expr 要与当前表达式相比较的表达式
//    * @returns 返回对比条件表达式
//    */
//   gte: (expr: UnsureExpressions) => Condition
//   /**
//    * 比较是相像 LIKE
//    * @param expr 要与当前表达式相比较的表达式
//    * @returns 返回对比条件表达式
//    */
//   like: (expr: UnsureExpressions) => Condition
//   /**
//    * 比较是否不想像 NOT LIKE
//    * @param expr 要与当前表达式相比较的表达式
//    * @returns 返回对比条件表达式
//    */
//   notLike: (expr: UnsureExpressions) => Condition
//   /**
//    * 比较是否不包含于 IN
//    * @param values 要与当前表达式相比较的表达式数组
//    * @returns 返回对比条件表达式
//    */
//   in: (...values: UnsureExpressions[]) => Condition
//   /**
//    * 比较是否不包含于 NOT IN
//    * @param values 要与当前表达式相比较的表达式
//    * @returns 返回对比条件表达式
//    */
//   notIn: (...values: UnsureExpressions[]) => Condition
//   /**
//    * 比较是否为空 IS NULL
//    * @returns 返回对比条件表达式
//    */
//   isNull: () => Condition
//   /**
//    * 比较是否为空 IS NOT NULL
//    * @returns 返回对比条件表达式
//    */
//   isNotNull: () => Condition
//   /**
//    * isNotNull 的简称别名
//    * @returns 返回对比条件表达式
//    */
//   notNull: () => Condition
//   /**
//    * 正序
//    * @returns 返回对比条件表达式
//    */
//   asc: () => SortInfo
//   /**
//    * 倒序
//    * @returns 返回对比条件表达式
//    */
//   desc: () => SortInfo
//   /**
//    * 为当前表达式添加别名
//    */
//   as: (alias: string) => Alias
// }
class QuotedCondition extends Condition {
    constructor(conditions) {
        super(constants_1.SQL_SYMBOLE.QUOTED_CONDITION);
        this.context = util_1.ensureCondition(conditions);
    }
}
exports.QuotedCondition = QuotedCondition;
Object.assign(QuotedCondition.prototype, ConditionPrototype);
/**
 * 二元运算表达式
 */
class BinaryExpression extends Expression {
    /**
     * 名称
     * @param operator 运算符
     * @param left 左值
     * @param right 右值
     */
    constructor(operator, left, right) {
        super(constants_1.SQL_SYMBOLE.BINARY);
        util_1.assert(left, 'The argument left must not null');
        util_1.assert(right, 'The arguemnt right must not null');
        this.operator = operator;
        this.left = util_1.ensureConstant(left);
        this.right = util_1.ensureConstant(right);
    }
    get lvalue() {
        return false;
    }
}
exports.BinaryExpression = BinaryExpression;
/**
 * - 运算符
 */
class UnaryExpression extends Expression {
    /**
     * 一元运算目前只支持负数运算符
     * @param expr
     */
    constructor(operator, expr) {
        super(constants_1.SQL_SYMBOLE.UNARY);
        this.next = util_1.ensureConstant(expr);
    }
    get lvalue() {
        return false;
    }
}
exports.UnaryExpression = UnaryExpression;
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
        super(constants_1.SQL_SYMBOLE.UNION);
        this.select = select;
        this.all = all;
    }
}
exports.Union = Union;
class Fromable extends Statement {
    /**
     * 从表中查询，可以查询多表
     * @param tables
     */
    from(...tables) {
        // assert(!this.$from, 'from已经声明')
        this.tables = tables.map(table => util_1.ensureIdentity(table));
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
        util_1.assert(this.tables, 'join must after from clause');
        if (!this.joins) {
            this.joins = [];
        }
        this.joins.push(new Join(table, on, left));
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
        util_1.assert(!this.filters, 'where is declared');
        if (_.isPlainObject(condition)) {
            condition = util_1.ensureCondition(condition);
        }
        // assert(condition instanceof Condition, 'Then argument condition must type of Condition')
        this.filters = condition;
        return this;
    }
}
class SortInfo extends AST {
    constructor(expr, direction) {
        super(constants_1.SQL_SYMBOLE.SORT);
        this.expr = util_1.ensureConstant(expr);
        this.direction = direction;
    }
}
exports.SortInfo = SortInfo;
/**
 * SELECT查询
 */
class Select extends Fromable {
    constructor(...columns /*options?: SelectOptions*/) {
        super(constants_1.SQL_SYMBOLE.SELECT);
        if (columns.length === 1 && _.isPlainObject(columns[0])) {
            const obj = columns[0];
            this.columns = List.columns(...Object.entries(obj).map(([alias, expr]) => new Alias(util_1.ensureConstant(expr), alias)));
            return;
        }
        // 实例化
        this.columns = List.columns(...columns.map(expr => util_1.ensureConstant(expr)));
        // if (options?.from) this.from(...options.from)
        // if (options?.joins) this.$joins = options.joins
        // if (options?.columns) this.columns(...options.columns)
        // if (options?.where) this.where(options.where)
        // if (options?.orderBy) this.orderBy(...options.orderBy)
        // if (options?.groupBy) this.groupBy(...options.groupBy)
        // if (options?.distinct === true) this.distinct()
        // if (options?.top !== undefined) this.top(options.top)
        // if (options?.offset !== undefined) this.offset(options.offset)
        // if (options?.limit !== undefined) this.offset(options.limit)
    }
    /**
     * 去除重复的
     */
    distinct() {
        this.isDistinct = true;
        return this;
    }
    /**
     * TOP
     * @param rows 行数
     */
    top(rows) {
        util_1.assert(_.isUndefined(this.tops), 'top is declared');
        this.tops = rows;
        return this;
    }
    orderBy(...sorts) {
        // assert(!this.$orders, 'order by clause is declared')
        util_1.assert(sorts.length > 0, 'must have one or more order basis');
        // 如果传入的是对象类型
        if (sorts.length === 1 && _.isPlainObject(sorts[0])) {
            const obj = sorts[0];
            this.sorts = Object.entries(obj).map(([expr, direction]) => (new SortInfo(expr, direction)));
            return this;
        }
        sorts = sorts;
        this.sorts = sorts.map(expr => expr instanceof SortInfo ? expr : new SortInfo(expr));
        return this;
    }
    /**
     * 分组查询
     * @param groups
     */
    groupBy(...groups) {
        this.groups = groups.map(expr => util_1.ensureConstant(expr));
        return this;
    }
    /**
     * Having 子句
     * @param condition
     */
    having(condition) {
        util_1.assert(!this.havings, 'having is declared');
        util_1.assert(this.groups, 'Syntax error, group by is not declared.');
        if (!(condition instanceof Condition)) {
            condition = util_1.ensureCondition(condition);
        }
        this.havings = condition;
        return this;
    }
    /**
     * 偏移数
     * @param rows
     */
    offset(rows) {
        this.offsets = rows;
        return this;
    }
    /**
     * 限定数
     * @param rows
     */
    limit(rows) {
        util_1.assert(_.isNumber(rows), 'The argument rows must type of Number');
        this.limits = rows;
        return this;
    }
    /**
     * 合并查询
     */
    union(select, all = false) {
        this.unions = new Union(select, all);
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
    constructor(table, fields) {
        super(constants_1.SQL_SYMBOLE.INSERT);
        util_1.assert(!this.table, 'The into clause is declared');
        this.table = util_1.ensureIdentity(table);
        if (fields) {
            this._fields(...fields);
        }
        return this;
    }
    /**
     * 字段列表
     * @param  {string[]|Field[]} fields
     */
    _fields(...fields) {
        util_1.assert(fields.length > 0, 'fields not allow empty.');
        /**
         * 字段列表
         */
        this.fields = fields.map(p => util_1.ensureIdentity(p));
        return this;
    }
    values(...args) {
        util_1.assert(!this.rows, 'values is declared');
        util_1.assert(args.length > 0, 'rows must more than one elements.');
        // 单个参数
        if (args.length === 1) {
            // (select: Select)
            if (args[0] instanceof Select) {
                this.rows = args[0];
                return this;
            }
            // (row: UnsureExpressions[])
            if (_.isArray(args[0])) {
                this.rows = [List.values(...args[0])];
                return this;
            }
        }
        // (rows: UnsureExpressions[][])
        if (args.length > 1 && _.isArray(args[0])) {
            this.rows = args.map(rowValues => List.values(...rowValues));
            return this;
        }
        // (row: ValueObject)
        // (rows: ValueObject[])
        if (!this.fields) {
            const existsFields = {};
            args.forEach(row => Object.keys(row).forEach(field => {
                if (!existsFields[field])
                    existsFields[field] = true;
            }));
            this._fields(...Object.keys(existsFields));
        }
        this.rows = (args).map(row => {
            const rowValues = this.fields.map(field => row[field.name]);
            return List.values(...rowValues);
        });
        return this;
    }
}
exports.Insert = Insert;
class Update extends Fromable {
    constructor(table /*options?: UpdateOptions*/) {
        super(constants_1.SQL_SYMBOLE.UPDATE);
        this.table = util_1.ensureIdentity(table);
        // if (options?.table) this.from(options.table)
        // if (options?.sets) this.set(options.sets)
        // if (options?.where) this.where(options.where)
        // if (options?.joins) this.$joins = options.joins
    }
    set(...sets) {
        util_1.assert(!this.sets, 'set statement is declared');
        util_1.assert(sets.length > 0, 'sets must have more than 0 items');
        if (sets.length > 1 || sets[0] instanceof Assignment) {
            this.sets = sets;
            return this;
        }
        const obj = sets[0];
        this.sets = Object.entries(obj).map(([key, value]) => new Assignment(Identifier.normal(key), util_1.ensureConstant(value)));
        return this;
    }
}
exports.Update = Update;
// export interface DeleteOptions {
//   table?: UnsureIdentity
//   sets?: object | Assignment[]
//   joins?: Join[]
//   where?: Conditions
// }
class Delete extends Fromable {
    constructor(table /*options?: DeleteOptions*/) {
        super(constants_1.SQL_SYMBOLE.DELETE);
        this.table = util_1.ensureIdentity(table);
        // if (options?.table) this.from(options.table)
        // if (options?.joins) this.$joins = options.joins
        // if (options?.where) this.where(options.where)
    }
}
exports.Delete = Delete;
/**
 * 存储过程执行
 */
class Execute extends Statement {
    constructor(proc, args) {
        super(constants_1.SQL_SYMBOLE.EXECUTE);
        this.proc = util_1.ensureIdentity(proc);
        if (!args || args.length === 0) {
            this.args;
            return;
        }
        this.args = List.invokeArgs(...args);
    }
}
exports.Execute = Execute;
/**
 * 赋值语句
 */
class Assignment extends Statement {
    constructor(left, right) {
        super(constants_1.SQL_SYMBOLE.ASSIGNMENT);
        util_1.assert(left.lvalue, 'Argument left not lvalue');
        this.left = left;
        this.right = util_1.ensureConstant(right);
    }
}
exports.Assignment = Assignment;
class VariantDeclare extends AST {
    constructor(name, dataType) {
        super(constants_1.SQL_SYMBOLE.VARAINT_DECLARE);
        this.name = name;
        this.dataType = dataType;
    }
}
/**
 * 声明语句，暂时只支持变量声明
 */
class Declare extends Statement {
    constructor(...declares) {
        super(constants_1.SQL_SYMBOLE.DECLARE);
        this.declares = declares;
    }
}
exports.Declare = Declare;
/**
 * 程序与数据库间传递值所使用的参数
 */
class Parameter extends Expression {
    constructor(name, dbType, value, direction = constants_1.PARAMETER_DIRECTION.INPUT) {
        super(constants_1.SQL_SYMBOLE.PARAMETER);
        this.name = name;
        this.value = value; // ensureConstant(value)
        this.dbType = dbType;
        this.direction = direction;
    }
    get lvalue() {
        return false;
    }
    get value() {
        return this._value;
    }
    set value(value) {
        this._value = value;
        // TODO: 自动设置数据类型
    }
    /**
     * input 参数
     */
    static input(name, value) {
        return new Parameter(name, null, value, constants_1.PARAMETER_DIRECTION.INPUT);
    }
    /**
     * output参数
     */
    static output(name, type, value) {
        return new Parameter(name, type, value, constants_1.PARAMETER_DIRECTION.OUTPUT);
    }
}
exports.Parameter = Parameter;
/**
 * SQL 文档
 */
class Document extends AST {
    constructor(...statements) {
        super(constants_1.SQL_SYMBOLE.DOCUMENT);
        this.statements = statements;
    }
}
exports.Document = Document;
//# sourceMappingURL=ast.js.map