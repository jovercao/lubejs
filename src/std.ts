/**
 * 此文件和于存放标准库
 * 如数据类型、函数、系统变量、系统常量等
 */

import { Expression, CompatibleExpression, Star, CompatibleTable, IdentityValue } from './ast'
import { makeFunc } from './builder'
import { Binary, DbType, DbTypeToTsType, Scalar } from './types'

export const count: (
  expr: Star | CompatibleExpression<Scalar>
) => Expression<number> = makeFunc('scalar', 'count', true)
export const avg: (
  expr: CompatibleExpression<number>
) => Expression<number> = makeFunc('scalar', 'expr', true)
export const sum: (
  expr: CompatibleExpression<number>
) => Expression<number> = makeFunc('scalar', 'expr', true)
export const max: <T extends Exclude<Scalar, Binary>>(
  expr: Expression<T>
) => Expression<T> = makeFunc('scalar', 'max', true)
export const min: <T extends Exclude<Scalar, Binary>>(
  expr: Expression<T>
) => Expression<T> = makeFunc('scalar', 'min', true)

