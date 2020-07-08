import { Condition, UnsureCondition, UnsureExpression, UnsureGroupValues, Expression, Identifier, JsConstant, List, ProxiedIdentifier } from './ast';
/**
 * 断言
 * @param except 预期结果
 * @param message 错误消息
 */
export declare function assert(except: any, message: string): void;
/**
 * 返回表达式
 */
export declare function ensureConstant(expr: UnsureExpression): Expression;
export declare function ensureIdentifier(expr: string | Identifier): Identifier;
export declare function ensureGroupValues(values: UnsureGroupValues): List;
/**
 * 通过一个对象创建一个对查询条件
 * 亦可理解为：转换managodb的查询条件到 ast
 * @param condition 条件表达式
 */
export declare function ensureCondition(condition: UnsureCondition): Condition;
/**
 * 将制作table的代理，用于生成字段
 */
export declare function makeProxiedIdentifier(identifier: Identifier): ProxiedIdentifier;
export declare function isJsConstant(value: any): value is JsConstant;
