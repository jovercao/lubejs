"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ensureCondition = exports.ensureIdentity = exports.ensureConstant = exports.assert = void 0;
const _ = require("lodash");
const ast_1 = require("./ast");
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
    return ast_1.Condition.and(Object.entries(condition).map(([key, value]) => {
        if (_.isArray(value)) {
            return ast_1.Condition.in(key, value);
        }
        return ast_1.Condition.eq(key, value);
    }));
}
exports.ensureCondition = ensureCondition;
//# sourceMappingURL=util.js.map