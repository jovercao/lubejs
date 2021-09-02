import Decimal from 'decimal.js-light';
import { Uuid } from './uuid';

export type UuidConstructor = typeof Uuid;
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
  | Binary
  | Uuid
  | Decimal
  | null;
// TODO: 适配 JSON 和 ARRAY数据类型
// | RowObject
// | Array<ScalarType>

export { Decimal, Uuid };

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
