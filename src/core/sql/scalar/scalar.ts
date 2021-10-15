import Decimal from 'decimal.js-light';
import { Uuid } from './uuid';
import { Time } from './time';

export type UuidConstructor = typeof Uuid;
export type TimeConstructor = typeof Time;
export type DecimalConstructor = typeof Decimal;
export type Binary = ArrayBuffer | SharedArrayBuffer | Buffer;

/**
 * 数据库值类型
 */
export type Scalar = BaseScalar | List<BaseScalar> | Json;

/**
 * 对应数据库中的数组类型
 */
export type List<T extends BaseScalar> = Array<T>;

/**
 * JSON数据类型，对应数据库中的JSON类型
 */
export type Json =
  | string
  | number
  | boolean
  | null
  | Record<string, string | number | boolean | null>
  | Array<Json>;

/**
 * 标量类型，不含JSON类型及
 * 对应数据库标量类型的JS类型集
 */
export type BaseScalar =
  | string
  | boolean
  | number
  | bigint
  | Decimal
  | Date
  | Time
  | Binary
  | Uuid
  // | object
  // | Array<Scalar>
  | null;

export { Decimal, Uuid, Time };

/**
 * 所有数值类型
 */
export type Numeric = Decimal | bigint | number;

/**
 * 所有整形
 */
export type Interger = number | bigint;

/**
 * 浮点类型
 */
export type Float = number;
