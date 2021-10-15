import Decimal from 'decimal.js-light';
import { Uuid } from './uuid';
import { Time } from './time';

export type UuidConstructor = typeof Uuid;
export type TimeConstructor = typeof Time;
export type DecimalConstructor = typeof Decimal;
export type Binary = Uint8Array;

/**
 * 对应数据库中的数组类型
 */
export type List<
  T extends Exclude<BaseScalar, Binary> = Exclude<BaseScalar, Binary>
> = Array<T>;

/**
 * 数据库值类型
 */
export type Scalar = BaseScalar | List | Json;

/**
 * Json中的类型
 */
export type JsonTypes = string | number | boolean | null | JsonObject;
/**
 * JSON数据类型，对应数据库中的JSON类型
 */
export type JsonObject = {
  [K: string]: JsonTypes;
};

/**
 * Json类型，限定为JsonObject是为了避免类型冲突。
 */
export type Json = JsonObject;

// | string
// | number
// | boolean
// | null
// | Record<string, string | number | boolean | null>
// | Array<Json>;

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
