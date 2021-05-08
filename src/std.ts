/**
 * 此文件和于存放标准库
 * 如函数，常量等
 */

import { Binary, Expression, CompatibleExpression, ScalarType, Star } from "./ast";
import { makeFunc } from "./builder";

export const count: (expr: Star | CompatibleExpression<ScalarType>) => Expression<number> = makeFunc('scalar', 'count', true);
export const avg: (expr: CompatibleExpression<number>) => Expression<number> = makeFunc('scalar', 'expr', true);
export const sum: (expr: CompatibleExpression<number>) => Expression<number> = makeFunc('scalar', 'expr', true);
export const max: <T extends  Exclude<ScalarType, Binary>>(expr: Expression<T>) => Expression<T> = makeFunc('scalar', 'max', true);
export const min: <T extends  Exclude<ScalarType, Binary>>(expr: Expression<T>) => Expression<T> = makeFunc('scalar', 'min', true);
