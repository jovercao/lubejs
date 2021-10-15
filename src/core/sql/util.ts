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

// export function isPlainObject(object: any): object is Object {
//   const proto = Object.getPrototypeOf(object);
//   return proto === Object.prototype || proto === null;
// }
