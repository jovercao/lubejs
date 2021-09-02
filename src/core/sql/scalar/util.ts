import { Binary, Decimal, Scalar, Uuid } from "./scalar";

export function isScalar(value: any): value is Scalar {
  return (
    typeof value === 'string' ||
    typeof value === 'boolean' ||
    typeof value === 'bigint' ||
    typeof value === 'number' ||
    value === null ||
    value === undefined ||
    value instanceof Date ||
    value instanceof Uuid ||
    value instanceof Decimal ||
    isBinary(value)
  );
}

export function isBinary(value: any): value is Binary {
  return (
    value instanceof ArrayBuffer ||
    value instanceof Uint8Array ||
    value instanceof Uint16Array ||
    value instanceof Uint32Array ||
    value instanceof BigUint64Array ||
    value instanceof Int8Array ||
    value instanceof Int16Array ||
    value instanceof Int32Array ||
    value instanceof BigInt64Array ||
    value instanceof Float32Array ||
    value instanceof Float64Array ||
    value instanceof Uint8ClampedArray ||
    value instanceof SharedArrayBuffer
  );
}
