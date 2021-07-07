import { isBinary, isScalar } from '../util';

export type ScalarType =
  | undefined
  | null
  | string
  | number
  | boolean
  | Date
  | bigint
  | ScalarType[];

export type ListType = object[];

export type ObjectType = object;

export type ScalarDifference<T extends ScalarType> = {
  source: T;
  target: T;
};

export type ObjectDifference<T extends object> = {
  source: T;
  target: T;
  added?: T;
  removed?: T;
  changes?: {
    [P in keyof T]?: T[P] extends ScalarType | ScalarType[]
      ? ScalarDifference<T[P]>
      : T[P] extends (infer M)[]
      ? M extends object
        ? ListDifference<M>
        : never
      : T[P] extends object
      ? ObjectDifference<T[P]>
      : never;
  };
};

export type ListDifference<T extends object> = {
  source: T[];
  target: T[];
  addeds: T[];
  removeds: T[];
  changes: ObjectDifference<T>[];
};


export enum ValueType {
  scalar = 0,
  object = 1,
  list = 2,
}

export function isListType(value: any): value is ListType {
  return getType(value) === ValueType.list;
}

export function isScalarType(value: any): value is ScalarType {
  return getType(value) === ValueType.scalar;
}

export function isObejctType(value: any): value is ObjectType {
  return getType(value) === ValueType.object;
}

export function getType(value: any): ValueType {
  if (isScalar(value)) return ValueType.scalar;

  if (Array.isArray(value)) {
    const el1Type = getType(value[0]);
    if (el1Type === ValueType.object) {
      return ValueType.list;
    }
    return ValueType.scalar;
  }
  if (typeof value === 'object') {
    return ValueType.object;
  }
  return ValueType.scalar;
}

/**
 * 是否未修改过
 * @param value1
 * @param value2
 * @returns
 */
export function isChanged<T extends ScalarType>(value1: T | null | undefined, value2: T | null | undefined): boolean {
  if (value1 === undefined) value1 = null;
  if (value2 === undefined) value2 = null;
  if (value1 === value2) return false;

  if (Array.isArray(value1) && Array.isArray(value2)) {
    if (value1.length !== value2.length) {
      return true;
    }
    for (let i = 0; i < value1.length; i++) {
      if (isChanged(value1[i], value2[i])) {
        return true;
      }
    }
    return false;
  }

  if (isBinary(value1)) {
    return (
      Buffer.compare(Buffer.from(value1), Buffer.from(value2 as any)) !== 0
    );
  }

  if (value1 instanceof Date && value2 instanceof Date) {
    return value1.getTime() !== value2.getTime();
  }

  return true;
}

export function compareScalar<T extends ScalarType>(
  source: any,
  target: any
): ScalarDifference<T> | null {
  if (isChanged(source, target)) {
    return {
      source,
      target,
    };
  }
  return null
}

export function compareObject<T extends object>(
  source: T,
  target: T,
  isSameObject?: EqulsCompartor,
  // 对比的路径
  path: string = ''
): ObjectDifference<T> | null {
  if (source === target) return null;
  if (!source && !target) {
    return null;
  }

  if (source && !target) {
    return {
      source,
      target,
      added: source
    };
  }
  if (!source && target) {
    return {
      source,
      target,
      removed: target
    };
  }

  const keyTypes: Record<string, ValueType> = {};
  Object.entries(source).forEach(([key, value]) => {
    keyTypes[key] = getType(value);
  });
  Object.entries(target).forEach(([key, value]) => {
    keyTypes[key] = Math.max(keyTypes[key] || 0, getType(value));
  });

  const changes: any = {};

  for (const [key, type] of Object.entries(keyTypes)) {
    const propSource = Reflect.get(source, key);
    const propTarget = Reflect.get(target, key);

    if (type === ValueType.scalar) {
      const ch = compareScalar(propSource, propTarget);
      if (ch) {
        changes[key] = ch;
      }
    } else if (type === ValueType.list) {
      if (!isSameObject)
        throw new Error(
          `List object or list property compare must provide 'isSameObject' argument.`
        );
      const compareResult = compareList(
        propSource,
        propTarget,
        isSameObject,
        [path, key + '[]'].filter(p => p).join('.')
      );
      if (compareResult) {
        changes[key] = compareResult;
      }
    } else if (type === ValueType.object) {
      const compareResult = compareObject(
        propSource,
        propTarget,
        isSameObject,
        [path, key].filter(p => p).join('.')
      );
      if (compareResult) {
        changes[key] = compareResult;
      }
    }
  }

  if (Object.keys(changes).length > 0) {
    return {
      source,
      target,
      changes,
    };
  }

  return null;
}

/**
 * 用于确定是否同一对象
 */
export type EqulsCompartor = (left: any, right: any, path: string) => boolean;

export function compareList<T extends object>(
  source: T[],
  target: T[],
  // keyer: (item: T) => K,
  // keyComparator: (left: K, right: K) => boolean
  // 确定是否同一对象
  isSameObject: EqulsCompartor,
  // 对比的路径
  path: string = ''
): ListDifference<T> | null {
  // const sourceMap = map(source, keyer);
  // const targetMap = map(target, keyer);
  const addeds: T[] = source.filter(left =>
    !target.find(right => isSameObject(left, right, path))
  );
  const removeds: T[] = target.filter(left =>
    !source.find(right => isSameObject(left, right, path))
  );

  const changes: ObjectDifference<T>[] = [];

  source.forEach(source =>
    target.forEach(target => {
      if (isSameObject(source, target, path)) {
        const itemChanges = compareObject(source, target, isSameObject, path);
        if (itemChanges) {
          changes.push(itemChanges);
        }
      }
    })
  );

  if (addeds.length === 0 && removeds.length === 0 && changes.length === 0) {
    return null;
  }
  return {
    source,
    target,
    addeds,
    removeds,
    changes,
  };
}

export type CompareResult<T> = T extends ScalarType ? ScalarDifference<T>
  : T extends (infer E)[] ? E extends object ? ListDifference<E> : never
  : T extends object ? ObjectDifference<T>
  : never;

export function compare<T extends ScalarType>(source: T, target: T): ScalarDifference<T> | null;
export function compare<T extends ListType>(source: T, target: T, isSameObject: EqulsCompartor): ListDifference<T> | null;
export function compare<T extends ObjectType>(source: T, target: T, isSameObject: EqulsCompartor): ObjectDifference<T> | null;
export function compare(source: any, target: any, isSameObject?: EqulsCompartor): ScalarDifference<any> | ListDifference<any> | ObjectDifference<any> | null {
  const type = Math.max(getType(source), getType(target));
  if (type === ValueType.scalar) {
    return compareScalar(source, target);
  }
  if (type === ValueType.list) {
    if (!isSameObject) {
      throw new Error(`Compare list must provide argument: 'isSanmeObject'`);
    }
    return compareList(source, target, isSameObject!);
  }
  return compareObject(source, target, isSameObject);
}
