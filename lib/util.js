"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ensureCondition = exports.ensureIdentity = exports.ensureConstant = exports.assert = void 0;
const _ = require("lodash");
const ast_1 = require("./ast");
/**
 * @typedef {import('./ast.js').Field} Expresstions
 */
/**
 * 断言
 * @param except 预期结果
 * @param message 错误消息
 */
function assert(except, message) {
    if (!except) {
        throw new Error(message);
    }
}
exports.assert = assert;
// /**
//  * 类型断言
//  * @param expr 要判断的值
//  * @param expectTypes 类型列表
//  * @param message 错误消息
//  */
// export function assertType(expr: any, expectTypes: ((new() => any) | (new(...args) => any) | string)[], message: string) {
//   if (expr instanceof Bracket) {
//     // 检查内部类型,不接受兼容类型
//     assertType(expr.$context, expectTypes, message)
//     return expr
//   }
//   const isOk = !!expectTypes.find(type => {
//     if (type === null || type === undefined) {
//       return expr === type
//     }
//     if (_.isString(type)) {
//       return (typeof expr) === type
//     }
//     if (expr instanceof type) {
//       return true
//     }
//     return expr.constructor === type
//   })
//   if (!isOk) {
//     throw new Error(message)
//   }
// }
// export function assertValue(expr: any, values: any[], message: string) {
//   if (!values.includes(expr)) {
//     throw new Error(message)
//   }
// }
/**
 * 返回表达式
 */
function ensureConstant(expr) {
    if (!(expr instanceof ast_1.Expression)) {
        return new ast_1.Constant(expr);
    }
}
exports.ensureConstant = ensureConstant;
function ensureIdentity(expr) {
    if (_.isString(expr)) {
        return new ast_1.Identity(expr);
    }
    return expr;
}
exports.ensureIdentity = ensureIdentity;
/**
 * 通过一个对象创建一个对查询条件
 * 亦可理解为：转换managodb的查询条件到 ast
 * @param condition 条件表达式
 */
function ensureCondition(condition) {
    if (condition instanceof ast_1.Condition)
        return condition;
    assert(_.isPlainObject(condition), 'condition must typeof `Condition` or `plain object`');
    return ast_1.Condition.and(Object.entries(condition).map(([key, value]) => ast_1.Condition._compare(key, value)));
    throw new Error('尚未实现');
}
exports.ensureCondition = ensureCondition;
//# sourceMappingURL=util.js.map