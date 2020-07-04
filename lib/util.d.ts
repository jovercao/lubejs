import { Conditions, UnsureConditions, UnsureExpressions, UnsureGroupValues, Bracket, Expressions, AST, Identifier } from './ast';
/**
 * 断言
 * @param except 预期结果
 * @param message 错误消息
 */
export declare function assert(except: any, message: string): void;
/**
 * 返回表达式
 */
export declare function ensureConstant(expr: UnsureExpressions): Expressions;
export declare function ensureIdentity(expr: string | Identifier): Identifier;
export declare function ensureGroupValues(values: UnsureGroupValues): Bracket<AST>;
/**
 * 通过一个对象创建一个对查询条件
 * 亦可理解为：转换managodb的查询条件到 ast
 * @param condition 条件表达式
 */
export declare function ensureCondition(condition: UnsureConditions): Conditions;
/**
 * 将制作table的代理，用于生成字段
 */
export declare function makeProxyIdentity(identifier: Identifier): Identifier;
