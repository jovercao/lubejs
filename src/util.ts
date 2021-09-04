/**
 * 当一个属性未定义时，为一个属性赋值
 * @param target
 * @param property
 * @param value
 * @returns
 */
export function assignProppertyIfUndefined<T extends object, P extends keyof T>(
  target: T,
  property: P,
  value: T[P]
): boolean {
  if (target[property] === undefined || target[property] === null) {
    target[property] = value;
    return true;
  }
  return false;
}

export function assignIfUndefined<T extends object>(
  dest: T,
  source: Partial<T>
): void {
  for (const [key, value] of Object.entries(source)) {
    assignProppertyIfUndefined(dest, key as keyof T, value as any);
  }
}

