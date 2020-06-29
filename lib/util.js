"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.applyMixins = exports.ensureCondition = exports.ensureIdentity = exports.ensureConstant = exports.assert = void 0;
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
    if (!(expr instanceof ast_1.AST)) {
        return ast_1.Expression.constant(expr);
    }
    return expr;
}
exports.ensureConstant = ensureConstant;
function ensureIdentity(expr) {
    if (_.isString(expr)) {
        return new ast_1.Identifier(expr);
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
    return ast_1.Condition.and(...Object.entries(condition).map(([key, value]) => {
        if (_.isArray(value)) {
            return ast_1.Condition.in(key, value);
        }
        return ast_1.Condition.eq(key, value);
    }));
}
exports.ensureCondition = ensureCondition;
/**
 * 混入器
 * @param derivedCtor
 * @param baseCtors
 */
function applyMixins(derivedCtor, baseCtors) {
    baseCtors.forEach(baseCtor => {
        Object.getOwnPropertyNames(baseCtor.prototype).forEach(name => {
            derivedCtor.prototype[name] = baseCtor.prototype[name];
        });
    });
}
exports.applyMixins = applyMixins;
//# sourceMappingURL=util.js.map