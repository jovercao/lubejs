import { SQL } from "./sql";

export function clone<T>(value: T): T {
  if (Array.isArray(value)) {
    return value.map(item =>
      item instanceof SQL ? item.clone() : clone(item)
    ) as any;
  }
  if (value && typeof value === 'object') {
    const copied: any = {};
    Object.entries(value).forEach(([k, v]) => {
      copied[k] = v instanceof SQL ? v.clone() : clone(v);
    });
    Object.setPrototypeOf(copied, Object.getPrototypeOf(value));
    return copied;
  }
  return value;
}

export function deepthEqual(left: any, right: any): boolean {
  const type = typeof left;
  if (type !== 'function' && type !== 'object') {
    return left === right;
  }

  if (!right) return false;
  const leftKeys = Object.getOwnPropertyNames(left);
  const rightKeys = Object.getOwnPropertyNames(right);
  if (leftKeys.length !== rightKeys.length) return false;
  for (const key of leftKeys) {
    if (!deepthEqual(left[key], right[key])) {
      return false;
    }
  }
  return true;
}


export function isPlainObject(object: any): object is Object {
  return [Object.prototype, null].includes(Object.getPrototypeOf(object))
}
