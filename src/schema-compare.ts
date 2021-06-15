import { DatabaseSchema } from "./schema";
import { map } from './util'

type Scalar =
  | undefined
  | null
  | string
  | number
  | boolean
  | Date
  | bigint
  | Scalar[];

type ScalarDifference<T extends Scalar> = {
  source: T;
  target: T;
};

type ObjectDifference<T extends object> = {
  source: T;
  target: T;
  changes: {
    [P in keyof T]?: T[P] extends Scalar | Scalar[]
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

type ListDifference<T extends object> = {
  addeds: T[];
  removeds: T[];
  changes: ObjectDifference<T>[];
};

export type SchemaDifference = ObjectDifference<DatabaseSchema>;

enum ValueType {
  scalar = 0,
  object = 1,
  list = 2,
}

function getType(value: any): ValueType {
  if (Array.isArray(value)) {
    const el1Type = getType(value[0]);
    if (el1Type === ValueType.object) {
      return ValueType.list;
    }
    return ValueType.scalar;
  }
  if (typeof value === "object") {
    if (value instanceof Date) {
      return ValueType.scalar;
    }
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
function isNochange<T extends Scalar>(value1: T, value2: T): boolean {
  if (value1 === value2) return true;
  if (value1 === undefined || value2 === undefined) return false;
  if (value1 === null || value2 === null) return false;

  if (Array.isArray(value1) && Array.isArray(value2)) {
    if (value1.length !== value2.length) {
      return false;
    }
    for (let i = 0; i < value1.length; i++) {
      if (!isNochange(value1[i], value2[i])) {
        return false;
      }
    }
    return true;
  }

  if (value1 instanceof Date && value2 instanceof Date) {
    return value1.getTime() === value2.getTime();
  }

  return false;
}

const SchemaKeyer = (item: any) => item.name;

function compareObject<T extends object>(
  source: T,
  target: T,
  keyer: (item: any) => string
): ObjectDifference<T> {
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
      if (!isNochange(propSource, propTarget)) {
        changes[key] = {
          source: propSource,
          target: propTarget,
        };
      }
    }

    if (type === ValueType.list) {
      const compareResult = compareList(propSource, propTarget, keyer);
      if (compareResult) {
        changes[key] = compareResult;
      }
    }

    if (type === ValueType.object) {
      const compareResult = compareObject(propSource, propTarget, keyer);
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

function compareList<T extends object>(
  source: T[],
  target: T[],
  keyer: (item: T) => string
): ListDifference<T> {
  const sourceMap = map(source, keyer);
  const targetMap = map(target, keyer);

  const addeds: T[] = source.filter((item) => !targetMap[keyer(item)]);
  const removeds: T[] = target.filter((item) => !sourceMap[keyer(item)]);
  const changes: any[] = target
    .map((item) => keyer(item))
    .filter((key) => sourceMap[key])
    .map((key) => {
      const source = sourceMap[key];
      const target = targetMap[key];
      return compareObject(source, target, keyer);
    })
    .filter((p) => !!p);

  if (addeds.length === 0 && removeds.length === 0 && changes.length === 0) {
    return null;
  }
  return {
    addeds,
    removeds,
    changes,
  };
}

export function compare(source: DatabaseSchema, target: DatabaseSchema): SchemaDifference {
  return compareObject(source, target, SchemaKeyer);
}
