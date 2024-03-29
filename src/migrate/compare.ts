import { isBaseScalar, isBinary } from '../core';
import { DatabaseSchema } from '../orm';

export type CompareScalarType =
  | undefined
  | null
  | string
  | number
  | boolean
  | Date
  | bigint
  | CompareScalarType[];

export type CompareListType = object[];

export type CompareObjectType = object;

export type ScalarDifference<T extends CompareScalarType> = {
  source: T | null | undefined;
  target: T | null | undefined;
};

export type ObjectDifference<T extends object> = {
  source: T | undefined;
  target: T | undefined;
  added?: T;
  removed?: T;
  changes?: {
    [P in keyof T]?: T[P] extends CompareScalarType | CompareScalarType[]
      ? ScalarDifference<T[P]>
      : T[P] extends (infer M)[]
      ? NonNullable<M> extends object
        ? ListDifference<NonNullable<M>>
        : never
      : NonNullable<T[P]> extends object
      ? ObjectDifference<NonNullable<T[P]>>
      : never;
  };
};

export type ListDifference<T extends object> = {
  source: T[] | undefined;
  target: T[] | undefined;
  addeds: T[];
  removeds: T[];
  changes: ObjectDifference<T>[];
};

export enum ValueType {
  scalar = 0,
  object = 1,
  list = 2,
}

export function isListType(value: any): value is CompareListType {
  return getType(value) === ValueType.list;
}

export function isCompareScalarType(value: any): value is CompareScalarType {
  return getType(value) === ValueType.scalar;
}

export function isObejctType(value: any): value is CompareObjectType {
  return getType(value) === ValueType.object;
}

export function getType(value: any): ValueType {
  if (isBaseScalar(value)) return ValueType.scalar;

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
 * 对比标量类型值是否相同
 * @param source
 * @param target
 * @returns
 */
export function compareScalar<T extends CompareScalarType>(
  source: T | null | undefined,
  target: T | null | undefined,
  equalsComparator?: (
    left: CompareScalarType,
    right: CompareScalarType,
    path: string
  ) => boolean | undefined,
  path: string = ''
): ScalarDifference<T> | null {
  if (source === target) return null;
  // 优先使用指定的比较器
  let changed = equalsComparator?.(source, target, path);
  if (changed !== undefined) {
    if (changed) {
      return null;
    } else {
      return {
        source,
        target,
      };
    }
  }

  if (
    (source === null || source === undefined) &&
    (target === null || target === undefined)
  ) {
    return null;
  }

  if (
    source === null ||
    source === undefined ||
    target === null ||
    target === undefined
  )
    return {
      source,
      target,
    };

  if (changed !== undefined) {
    if (Array.isArray(source) && Array.isArray(target)) {
      if (source.length !== target.length) {
        changed = true;
      } else {
        for (let i = 0; i < source.length; i++) {
          if (
            !compareScalar(source[i], target[i], equalsComparator, path + '[]')
          ) {
            changed = true;
            break;
          }
        }
        changed = false;
      }
    } else if (isBinary(source)) {
      changed =
        Buffer.compare(Buffer.from(source), Buffer.from(target as any)) === 0;
    } else if (source instanceof Date && target instanceof Date) {
      changed = source.getTime() === target.getTime();
    }
  }
  if (changed) {
    return {
      target,
      source,
    };
  }
  return null;
}

// export function compareScalar1<T extends ScalarType>(
//   source: any,
//   target: any,
//   equalsComparator?: (
//     left: ScalarType,
//     right: ScalarType,
//     path: string
//   ) => boolean | undefined,
//   path: string = ''
// ): ScalarDifference<T> | null {
//   if (source === null) source = undefined;
//   if (target === null) target = undefined;
//   if (source === target) return null;
//   if (source === undefined || target === undefined)
//     return {
//       source,
//       target,
//     };
//   // 优先使用指定的比较器
//   const comparatorResult = equalsComparator?.(source, target, path);
//   if (comparatorResult !== undefined) {
//     if (comparatorResult) {
//       return null;
//     } else {
//       return {
//         source,
//         target,
//       };
//     }
//   }
//   if (!compareScalar(source, target)) {
//     return {
//       source,
//       target,
//     };
//   }
//   return null;
// }

export function compareObject<T extends object>(
  source: T | undefined,
  target: T | undefined,
  isKeyEquals?: ObjectKeyCompartor,
  isEquals?: EqulsCompartor,
  // 对比的路径
  path: string = ''
): ObjectDifference<T> | null {
  if (source === target) return null;
  const equals = isEquals?.(source, target, path);
  if (equals === true) {
    return null;
  }

  if (!source && !target) {
    return null;
  }

  if (source && !target) {
    return {
      source,
      target,
      added: source,
    };
  }
  if (!source && target) {
    return {
      source,
      target,
      removed: target,
    };
  }

  const keyTypes: Record<string, ValueType> = {};
  Object.entries(source!).forEach(([key, value]) => {
    keyTypes[key] = getType(value);
  });
  Object.entries(target!).forEach(([key, value]) => {
    keyTypes[key] = Math.max(keyTypes[key] || 0, getType(value));
  });

  const changes: any = {};

  for (const [key, type] of Object.entries(keyTypes)) {
    const propSource = Reflect.get(source!, key);
    const propTarget = Reflect.get(target!, key);

    if (type === ValueType.scalar) {
      const ch = compareScalar(
        propSource,
        propTarget,
        isEquals,
        [path, key].filter(p => p).join('.')
      );
      if (ch) {
        changes[key] = ch;
      }
    } else if (type === ValueType.list) {
      if (!isKeyEquals)
        throw new Error(
          `List object or list property compare must provide 'isSameObject' argument.`
        );
      const compareResult = compareList(
        propSource,
        propTarget,
        isKeyEquals,
        isEquals,
        [path, key].filter(p => p).join('.')
      );
      if (compareResult) {
        changes[key] = compareResult;
      }
    } else if (type === ValueType.object) {
      const compareResult = compareObject(
        propSource,
        propTarget,
        isKeyEquals,
        isEquals,
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
export type ObjectKeyCompartor = (
  left: any,
  right: any,
  path: string
) => boolean;

export type EqulsCompartor = (
  left: any,
  right: any,
  path: string
) => boolean | undefined;

export function compareList<T extends object>(
  source: T[] | undefined,
  target: T[] | undefined,
  // keyer: (item: T) => K,
  // keyComparator: (left: K, right: K) => boolean
  // 确定是否同一对象
  isKeyEquals: ObjectKeyCompartor,
  isEquals?: EqulsCompartor,
  // 对比的路径
  path: string = ''
): ListDifference<T> | null {
  if (source === target) return null;
  const equals = isEquals?.(source, target, path);
  if (equals === true) {
    return null;
  }
  // const sourceMap = map(source, keyer);
  // const targetMap = map(target, keyer);
  if (!source && target) {
    return {
      source,
      target,
      addeds: [],
      removeds: target,
      changes: [],
    };
  }
  if (!target && source) {
    return {
      source,
      target,
      addeds: source,
      removeds: [],
      changes: [],
    };
  }

  const addeds: T[] = source!.filter(
    left => !target!.find(right => isKeyEquals(left, right, path))
  );
  const removeds: T[] = target!.filter(
    left => !source!.find(right => isKeyEquals(left, right, path))
  );

  const changes: ObjectDifference<T>[] = [];

  source!.forEach(source =>
    target!.forEach(target => {
      if (isKeyEquals(source, target, path)) {
        const itemChanges = compareObject(
          source,
          target,
          isKeyEquals,
          isEquals,
          path + '[]'
        );
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

export type CompareResult<T> = T extends CompareScalarType
  ? ScalarDifference<T>
  : T extends (infer E)[]
  ? E extends object
    ? ListDifference<E>
    : never
  : T extends object
  ? ObjectDifference<T>
  : never;

// export function compare<T extends ScalarType>(
//   source: T,
//   target: T
// ): ScalarDifference<T> | null;
// export function compare<T extends ListType>(
//   source: T,
//   target: T,
//   isSameObject: ObjectKeyCompartor
// ): ListDifference<T> | null;
// export function compare<T extends ObjectType>(
//   source: T,
//   target: T,
//   isSameObject: ObjectKeyCompartor
// ): ObjectDifference<T> | null;
// export function compare(
//   source: any,
//   target: any,
//   isSameObject?: ObjectKeyCompartor
// ): ScalarDifference<any> | ListDifference<any> | ObjectDifference<any> | null {
//   const type = Math.max(getType(source), getType(target));
//   if (type === ValueType.scalar) {
//     return compareScalar(source, target);
//   }
//   if (type === ValueType.list) {
//     if (!isSameObject) {
//       throw new Error(`Compare list must provide argument: 'isSanmeObject'`);
//     }
//     return compareList(source, target, isSameObject!);
//   }
//   return compareObject(source, target, isSameObject);
// }

export type SchemaDifference = ObjectDifference<DatabaseSchema>;

export function compareSchema(
  defaultSchema: string | undefined,
  source: DatabaseSchema | undefined,
  target: DatabaseSchema | undefined
): SchemaDifference | null {
  const isSameSchemaObject: ObjectKeyCompartor = (
    left: any,
    right: any,
    path: string
  ): boolean => {
    if (
      [
        'schemas',
        'tables[].columns',
        'tables[].foreignKeys',
        'tables[].indexes',
        'tables[].constraints',
        'tables[].primaryKey.columns',
        'tables[].foreignKeys[].columns',
        'tables[].indexes[].columns',
        'tables[].constraints[].columns',
      ].includes(path)
    ) {
      return left.name === right.name;
    }

    if (
      ['tables', 'views', 'sequences', 'procedures', 'functions'].includes(path)
    ) {
      return (
        left.name === right.name &&
        (defaultSchema
          ? (left.schema || defaultSchema) === (right.schema || defaultSchema)
          : !left.schema || !right.schema || left.schema === right.schema)
      );
    }
    throw new Error(`Path error.`);
  };

  const isEquals: EqulsCompartor = (left: any, right: any, path: string) => {
    // 比较类型
    if (path === 'tables[].columns[].type') {
      return (
        left?.replace(/ /g, '').toUpperCase() ===
        right?.replace(/ /g, '').toUpperCase()
      );
    }
    if (path === 'tables[].columns[].defaultValue') {
      return left?.toLowerCase() === right?.toLowerCase();
    }
    if (
      [
        'tables[].database',
        'views[].database',
        'sequences[].database',
        'procedures[].database',
        'functions[].database',
      ].includes(path)
    ) {
      return true;
    }
    if (
      [
        'tables[].schema',
        'views[].schema',
        'sequences[].schema',
        'procedures[].schema',
        'functions[].schema',
        'tables[].foreignKeys[].referenceSchema',
      ].includes(path)
    ) {
      return defaultSchema
        ? left || defaultSchema === right || defaultSchema
        : !left || !right || left === right;
    }
    // 不比较种子数据、数据库名、排序规则、数据库批注等属性
    if (['name', 'collate', 'comment', 'tables[].seedData'].includes(path)) {
      return true;
    }
  };

  return compareObject(source, target, isSameSchemaObject, isEquals);
}
