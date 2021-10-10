import Decimal from 'decimal.js-light';
import { Uuid } from './uuid';
import { Time } from './time';

export type UuidConstructor = typeof Uuid;
export type TimeConstructor = typeof Time;
export type DecimalConstructor = typeof Decimal;
export type Binary = ArrayBuffer | SharedArrayBuffer | Buffer;

/**
 * 标量类型
 * 对应数据库标量类型的JS类型集
 */
export type Scalar =
  | string
  | boolean
  | number
  | bigint
  | Decimal
  | Date
  | Time
  | Binary
  | Uuid
  | Decimal
  | null;
// TODO: 适配 JSON 和 ARRAY数据类型
// | RowObject
// | Array<ScalarType>

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
