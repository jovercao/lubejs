import { Binary, Scalar, Decimal, BaseScalar, Uuid, List } from './scalar';
import { Time } from './time';

export function isBaseScalar(value: any): value is BaseScalar {
  return (
    value === null ||
    typeof value === 'string' ||
    typeof value === 'boolean' ||
    typeof value === 'bigint' ||
    typeof value === 'number' ||
    value === undefined ||
    value instanceof Date ||
    value instanceof Uuid ||
    value instanceof Decimal ||
    value instanceof Time ||
    isBinary(value)
  );
}

/**
 * 判断一个对象是否是集合
 */
export function isScalar(value: any): value is Scalar {
  return (
    value !== undefined && !(Array.isArray(value) && !isBaseScalar(value[0]))
  );
}

/**
 * 判断一个对象是不是一个数据库合法的列表(数组)类型
 */
export function isList(value: any, MAX_SEARCH_SIZE = 10): value is List {
  if (!Array.isArray(value)) return false;
  for (let i = 0; i < Math.min(MAX_SEARCH_SIZE, value.length); i++) {
    if (!isBaseScalar(value[i])) return false;
  }
  return true;
}

/**
 * 判断是否为二进制类型
 * @param value
 * @returns
 */
export function isBinary(value: any): value is Binary {
  return value?.[Symbol.toStringTag] === 'Uint8Array';
}
