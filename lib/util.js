"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isJsConstant = exports.makeProxiedIdentifier = exports.ensureCondition = exports.ensureGroupValues = exports.ensureIdentifier = exports.ensureConstant = exports.assert = void 0;
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
function ensureIdentifier(expr) {
    if (_.isString(expr)) {
        return ast_1.Identifier.normal(expr);
    }
    return expr;
}
exports.ensureIdentifier = ensureIdentifier;
function ensureGroupValues(values) {
    if (_.isArray(values)) {
        return ast_1.List.values(...values);
    }
    return values;
}
exports.ensureGroupValues = ensureGroupValues;
/**
 * 通过一个对象创建一个对查询条件
 * 亦可理解为：转换managodb的查询条件到 ast
 * @param condition 条件表达式
 */
function ensureCondition(condition) {
    if (condition instanceof ast_1.Condition)
        return condition;
    assert(_.isPlainObject(condition), 'condition must typeof `Condition` or `plain object`');
    const compares = Object.entries(condition).map(([key, value]) => {
        const field = ast_1.Expression.identifier(key);
        if (_.isArray(value)) {
            return ast_1.Condition.in(field, value);
        }
        return ast_1.Condition.eq(field, value);
    });
    return compares.length >= 2 ? ast_1.Condition.and(...compares) : compares[0];
}
exports.ensureCondition = ensureCondition;
// /**
//  * 混入器
//  * @param derivedCtor
//  * @param baseCtors
//  */
// export function applyMixins(derivedCtor: any, baseCtors: any[]) {
//   baseCtors.forEach(baseCtor => {
//     Object.getOwnPropertyNames(baseCtor.prototype).forEach(name => {
//       derivedCtor.prototype[name] = baseCtor.prototype[name]
//     })
//   })
// }
/**
 * 将制作table的代理，用于生成字段
 */
function makeProxiedIdentifier(identifier) {
    return new Proxy(identifier, {
        get(target, prop) {
            if (Reflect.has(target, prop)) {
                return target[prop];
            }
            if (_.isString(prop)) {
                // $开头，实为转义符，避免字段命名冲突，程序自动移除首个
                if (prop.startsWith('$')) {
                    prop = prop.substring(1);
                }
                return identifier.dot(prop);
            }
        }
    });
}
exports.makeProxiedIdentifier = makeProxiedIdentifier;
function isJsConstant(value) {
    return _.isString(value) || _.isBoolean(value) || typeof value === 'bigint' ||
        _.isNumber(value) || _.isNull(value) ||
        _.isDate(value) || _.isBuffer(value);
}
exports.isJsConstant = isJsConstant;
//# sourceMappingURL=util.js.map