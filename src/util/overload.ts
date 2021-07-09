type Type =
  | TupleType
  | ObjectType
  | LiteralType
  | ArrayType
  | ObjectType
  | ScalarType
  | UnionType
  | FunctionType;

/**
 * 对象类型
 */
type ObjectType = {
  kind: 'object';
  class: Function;
};

type ScalarType = {
  kind: 'scalar';
  type: ScalarTags;
};

/**
 * 联合类型
 */
type UnionType = {
  kind: 'union';
  types: Type[];
};

/**
 * 字面量类型
 */
type LiteralType = {
  kind: 'literal';
  value: LiteralTags;
};

/**
 * 元组类型
 */
type TupleType = {
  kind: 'tuple';
  types: Type[];
  optionalCount: number;
};

type ArrayType = {
  kind: 'array';
  type: Type;
};

type FunctionType = {
  kind: 'function';
  // 函数参数个数
  length: number;
};

type AnyType = {
  kind: 'any'
}


type ScalarTags =
  | SymbolConstructor
  | NumberConstructor
  | StringConstructor
  | BooleanConstructor
  | BigIntConstructor
  | null
  | undefined;

type LiteralTags =
  | number
  | string
  | boolean
  | bigint
  | symbol
  | null
  | undefined;

function getScalarType(value: any): ScalarTags | false {
  if (value == undefined || value === null) return value;

  const type = typeof value;
  switch (type) {
    case 'string':
      return String;
    case 'number':
      return Number;
    case 'bigint':
      return BigInt;
    case 'boolean':
      return Boolean;
    case 'symbol':
      return Symbol;
  }
  return false;
}

// export function valueType(value: any): Type {
//   const scalarType = getScalarType(value);
//   if (scalarType !== false) {
//     if (literal) {
//       return {
//         kind: 'literal',
//         value,
//       };
//     }

//     return {
//       kind: 'scalar',
//       type: scalarType,
//     };
//   }

//   if (typeof value === 'function') {
//     return {
//       kind: 'function',
//       length: value.length,
//     };
//   }

//   if (Array.isArray(value)) {
//     // 大于5个元素不再
//     if (value.length > 5) {
//       return {
//         kind: 'array',
//         type: valueType(value[0]),
//       };
//     }
//     return {
//       kind: 'tuple',
//       types: value.map(element => valueType(element)),
//       length:
//     };
//   }

//   if (typeof value === 'object') {
//     return {
//       kind: 'object',
//       class: value.constructor,
//     };
//   }

//   throw new Error(`Unknown type ${value}`);
// }

export function isType(value: any, type: Type): boolean {
  if (type.kind === 'literal') {
    return value === type.value;
  }

  if (type.kind === 'scalar') {
    return getScalarType(value) === type.type;
  }

  if (type.kind === 'function') {
    return typeof value === 'function' && value.length === type.length;
  }

  if (type.kind === 'object') {
    return value && typeof value === 'object' && value instanceof type.class;
  }

  if (type.kind === 'union') {
    return type.types.findIndex(innerType => isType(value, innerType)) >= 0;
  }

  if (type.kind === 'tuple') {
    return (
      Array.isArray(value) &&
      value.length >= type.types.length - type.optionalCount &&
      value.length <= type.types.length &&
      value.findIndex(
        (element, index) => !isType(element, type.types[index])
      ) === -1
    );
  }

  if (type.kind === 'array') {
    if (!Array.isArray(value)) return false;
    if (value.length === 0) return true;
    return isType(value[0], type.type);
  }
  throw new Error('Invalid type object' + JSON.stringify(type));
}

export const $any: AnyType = {
  kind: 'any'
}

export function $object(cls: Function): ObjectType {
  return {
    kind: 'object',
    class: cls,
  };
}

export function $scalar(type: ScalarTags): ScalarType {
  return {
    kind: 'scalar',
    type,
  };
}

export function $literal(value: LiteralTags): LiteralType {
  return {
    kind: 'literal',
    value,
  };
}

export function $array(type: Type): ArrayType {
  return {
    kind: 'array',
    type: type,
  };
}

export function $union(...types: Type[]): UnionType {
  return {
    kind: 'union',
    types,
  };
}

export function $function(length: number): FunctionType {
  return {
    kind: 'function',
    length,
  };
}

export function $tuple(types: Type[], optionalCount = 0): TupleType {
  if (optionalCount > types.length)
    throw new Error('Optional count not allow greater than types count.');
  return {
    kind: 'tuple',
    types,
    optionalCount,
  };
}

export const $number = $scalar(Number);
export const $string = $scalar(String);
export const $boolean = $scalar(Boolean);
export const $bigint = $scalar(BigInt);
export const $symbol = $scalar(Symbol);
export const $undefined = $scalar(undefined);
export const $null = $scalar(null);

export const $Date = $object(Date);
export const $Object = $object(Object);
export const $Buffer = $object(Buffer);
export const $Function = $object(Function);

/**
 * 声明一个重载函数，自动匹配参数并调用对应的重载
 */
export function overload(
  ...overloads: [
    [TupleType, Function],
    [TupleType, Function],
    ...[TupleType, Function][]
  ]
): (...args: any) => any {
  return function (this: any, ...args: any[]): any {
    const overload = overloads.find(([argsType]) => isType(args, argsType));
    if (!overload) {
      throw new Error(`Invalid arguments, No matched overload found.`);
    }
    return overload[1].call(this, ...args);
  };
}

// export function typeBuilder(type: Type | Type[] | ScalarTags | Function | LiteralTags): Type {
//   if (type && typeof type === 'object' && Reflect.get(type, 'kind')) {
//     return type as Type;
//   }

//   const scalarType = getScalarType(type);
//   if (scalarType !== false) {
//     return {
//       kind: 'literal',
//       value: type as LiteralTags,
//     };
//   }

//   if (typeof type === 'function') {
//     return {
//       kind: 'function',
//       length: value.length,
//     };
//   }

//   if (Array.isArray(value)) {
//     // 大于5个元素不再
//     if (value.length > 5) {
//       return {
//         kind: 'array',
//         type: valueType(value[0]),
//       };
//     }
//     return {
//       kind: 'tuple',
//       types: value.map(element => valueType(element)),
//       length:
//     };
//   }

//   if (typeof value === 'object') {
//     return {
//       kind: 'object',
//       class: value.constructor,
//     };
//   }

//   throw new Error(`Unknown type ${value}`);
// }



/**
 * 支持的类型列表：
 * - 标量类型
 * - 字面量类型
 * - 对象类型
 *
 * 不支持的类型列表：
 * - 对象类型识别仅依靠instanceof，与typescript的interface匹配机制不一样
 * - 函数类型仅支持以参数数量判断是否匹配，只要数量匹配即可
 * - 不支持interface匹配
 */

type TestFunc = {
  (a: string, b: number): string;
  (a: number | string, b: string): string;
  (a: object, b: Function): string;
};

const test: TestFunc = overload(
  [$tuple([$string, $number]), function () {
    return `(a: string, b: number): boolean`;
  }],
  [$tuple([$union($number, $string), $string]), function () {
    return `(a: number | string, b: string): boolean`
  }],
  [$tuple([$Object, $string]), function () {
    return `(a: object, b: Function): string`
  }]);

console.log(test('abc', 1));
console.log(test(1, 'abc'));
console.log(test({ a: 1, b: 2 }, () => '哈哈'));
