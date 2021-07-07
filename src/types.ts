/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/ban-types */
// interface QueryParameter {
//    name: string,
//    value: any,
//    direction?: ParameterDirection
// }

import { Raw } from './ast';
import { deepthEqual } from './util';
import { parse, stringify, v4 } from 'uuid';
import { EntityConstructor } from './db-context';
import { metadataStore } from './metadata';
import { Decimal } from 'decimal.js';

export const EntitySymble = Symbol('LUBEJS#Entity');

/**
 * 实体类基类,仅为了typescript区分类型
 * 不一定非得从此继承
 */
export class Entity {
  constructor() {
  }

  static create<T extends EntityConstructor<any>>(
    this: T,
    data: EntityTypeOf<T>
  ): EntityInstance<EntityTypeOf<T>>;
  static create<T extends EntityConstructor<any>>(
    this: T,
    data: EntityTypeOf<T>[]
  ): EntityInstance<EntityTypeOf<T>>[];
  static create<T extends EntityConstructor<any>>(
    this: T,
    data: EntityTypeOf<T> | EntityTypeOf<T>[]
  ): EntityInstance<EntityTypeOf<T>> | EntityInstance<EntityTypeOf<T>>[] {
    const metadata = metadataStore.getEntity(this);
    if (!metadata) {
      throw new Error(`Entity ${this.name} not register.`)
    }
    const init = (data: T) => {
      Object.setPrototypeOf(data, this.prototype);
      for (const relation of metadata.relations) {
        const propData: any = Reflect.get(data, relation.property);
        if (propData) {
          Entity.create.call(relation.referenceClass, propData);
        }
      }
      return data;
    };
    if (Array.isArray(data)) {
      for (const item of data) {
        init(item);
      }
    } else {
      init(data);
    }
    return data as any;
  }
}

export type EntityInstance<T extends Entity> = T & {
  constructor: EntityConstructor<T>;
};

export type EntityTypeOf<C extends EntityConstructor<any>> =
  C extends EntityConstructor<infer T> ? T : never;

export type DbEvents =
  | 'save'
  | 'insert'
  | 'update'
  | 'delete'
  | 'saved'
  | 'inserted'
  | 'updated'
  | 'deleted';

export type RepositoryEventHandler<T> = (items: T[]) => void;

export type DbContextEventHandler = (
  event: DbEvents,
  Entity: Entity,
  items: Entity[]
) => void;

// **********************************类型声明******************************************

export type Binary = ArrayBuffer | SharedArrayBuffer;

// eslint-disable-next-line @typescript-eslint/ban-types
export type RowObject = object;

/**
 * 标量类型
 * 对应数据库标量类型的JS类型集
 */
export type Scalar =
  | string
  | boolean
  | number
  | bigint
  | Decimal
  | Date
  | Binary
  | Uuid
  | Decimal
  | null;
// TODO: 适配 JSON 和 ARRAY数据类型
// | RowObject
// | Array<ScalarType>

export class Uuid {
  constructor(strOrBuffer?: string | ArrayLike<number>) {
    if (typeof strOrBuffer === 'string') {
      this._buffer = Array.from(parse(strOrBuffer));
    } else if (strOrBuffer) {
      this._buffer = Array.from(strOrBuffer);
    } else {
      this._buffer = Uuid.DEFAULT;
    }
  }

  readonly [n: number]: number;
  private readonly _buffer: number[];

  toString(): string {
    return stringify(this._buffer);
  }

  private static DEFAULT = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

  static new(): Uuid {
    const uuid = new Uuid();
    v4({}, uuid._buffer);
    return uuid;
  }

  static readonly empty = new Uuid(Uuid.DEFAULT);

  valueOf() {
    return this._buffer || Uuid.DEFAULT;
  }

  static equals(left: Uuid, right: Uuid): boolean {
    for (let i = 0; i < 16; i++) {
      if (left._buffer[i] !== right._buffer[i]) {
        return false;
      }
    }
    return true;
  }
}

export { Decimal } from 'decimal.js';

// export interface Decimal {
//   readonly source: string;
//   toString(): string;
//   add(value: Decimal) {

//   }
// }

// export function Decimal(value: string | number | bigint): Decimal {
//   let stringValue: string;
//   if (typeof value === 'bigint' || typeof value === 'number') {
//     stringValue = value.toString();
//   } else {
//     stringValue = value
//   }
//   const data = Object(stringValue);
//   data.valueOf = () =>
//   data.source = value;
//   data.toString = () => value
//   return data as Decimal;
// }

export type UuidConstructor = typeof Uuid;
export type DecimalConstructor = typeof Decimal;

export type ScalarType =
  | StringConstructor
  | DateConstructor
  | BooleanConstructor
  | NumberConstructor
  | DecimalConstructor
  | BigIntConstructor
  | ArrayBufferConstructor
  | typeof Buffer
  | SharedArrayBufferConstructor
  | ObjectConstructor
  | ArrayConstructor
  | UuidConstructor;

export type INT64 = {
  readonly name: 'INT64';
};

export type INT32 = {
  readonly name: 'INT32';
  readonly length?: 8 | 16 | 32 | 64;
};

export type INT16 = {
  readonly name: 'INT16';
};

export type INT8 = {
  readonly name: 'INT8';
};

export type DECIMAL = {
  readonly name: 'DECIMAL';
  readonly precision: number;
  readonly digit?: number;
};

export type FLOAT = {
  readonly name: 'FLOAT';
};

export type DOUBLE = {
  readonly name: 'DOUBLE';
};

export type STRING = {
  readonly name: 'STRING';
  /**
   * 为0时表示无限大
   */
  readonly length: number;
};

export type DATE = {
  readonly name: 'DATE';
};

export type DATETIME = {
  readonly name: 'DATETIME';
};

export type DATETIMEOFFSET = {
  readonly name: 'DATETIMEOFFSET';
};

export type BINARY = {
  readonly name: 'BINARY';
  readonly length: number;
};

export type BOOLEAN = {
  readonly name: 'BOOLEAN';
};

export type UUID = {
  readonly name: 'UUID';
};

/**
 * 行标识列，如sqlserver的timestamp
 */
export type ROWFLAG = {
  readonly name: 'ROWFLAG';
};

/**
 * 对象类型,不使用JSON，是因为冲突
 */
export type OBJECT<T extends object = any> = {
  readonly name: 'OBJECT';
};

const DEFAULT_OBJECT: OBJECT<any> = {
  name: 'OBJECT',
};

/**
 * 列表类型，即数组，不使用ARRAY，亦是因为命名冲突
 */
export type ARRAY<T extends DbType> = {
  readonly name: 'ARRAY';
  /**
   * 元素类型
   */
  readonly type: T;
};

export function isSameDbType(type1: DbType, type2: DbType) {
  return deepthEqual(type1, type2);
}

export function isStringType(type: any): type is STRING {
  return type?.name === 'STRING';
}

export type DbType =
  | INT8
  | INT16
  | INT32
  | INT64
  | DECIMAL
  | FLOAT
  | DOUBLE
  | STRING
  | DATE
  | DATETIME
  | DATETIMEOFFSET
  | BINARY
  | BOOLEAN
  | UUID
  | ROWFLAG
  | OBJECT
  | ARRAY<any>;

/**
 * 类型转换
 */
export type TsTypeOf<T extends DbType> = T extends
  | INT8
  | INT16
  | INT32
  | FLOAT
  | DOUBLE
  ? number
  : T extends DECIMAL
  ? Decimal
  : T extends INT64
  ? bigint
  : T extends STRING | UUID
  ? string
  : T extends DATE | DATETIME | DATETIMEOFFSET
  ? Date
  : T extends BOOLEAN
  ? boolean
  : T extends BINARY
  ? Binary
  : T extends ROWFLAG
  ? any
  : T extends OBJECT<infer M>
  ? M
  : T extends Raw
  ? Scalar
  : T extends ARRAY<infer M>
  ? TsTypeOf<M>[]
  : never;

export type PathedName<T extends string = string> =
  | [T]
  | [T, string]
  | [T, string, string]
  | [T, string, string, string]
  | [T, string, string, string, string];

export type Name<T extends string = string> = T | PathedName<T>;

/**
 * 从TS Type 转换为DbType的类型
 */
export type DbTypeOf<T> = T extends string
  ? STRING
  : T extends number
  ? DECIMAL | FLOAT | DOUBLE | INT16 | INT8 | INT32 | INT64
  : T extends Date
  ? DATETIME | DATE
  : T extends boolean
  ? BOOLEAN
  : T extends Binary
  ? BINARY
  : T extends bigint
  ? INT64
  : T extends Uuid
  ? UUID
  : T extends Decimal
  ? DECIMAL
  : // : T extends Array<infer M>
  // ? LIST<DbTypeOf<M>>
  T extends RowObject
  ? OBJECT<T>
  : never;

/**
 * 转换
 */
export type DataTypeOf<T> = T extends string
  ? StringConstructor
  : T extends number
  ? NumberConstructor
  : T extends Date
  ? DateConstructor
  : T extends boolean
  ? BooleanConstructor
  : T extends Binary
  ? typeof Buffer | ArrayBufferConstructor | SharedArrayBufferConstructor
  : T extends object
  ? ObjectConstructor
  : T extends (infer M)[]
  ? M extends object
    ? [Constructor<M>]
    : [DataTypeOf<M>]
  : never;

/**
 * 构造函数，即类本身
 */
export type Constructor<T = object> = {
  new (...args: any): T;
};

export type EntityType = EntityConstructor<Entity>;

/******************************* Model 相关声明 *********************************/
export type ListType<
  T extends ScalarType | EntityType = ScalarType | EntityType
> = [T];

/**
 * Metadata中的数据类型
 */
export type DataType = ScalarType | EntityType | ListType | JSON;

// export type DataTypeToTsType<T> = T extends String
//   ? string
//   : T extends JSON
//   ? object
//   : T extends NumberConstructor
//   ? number
//   : T extends BooleanConstructor
//   ? boolean
//   : T extends ListType<infer M>
//   ? DataTypeToTsType<M>[]
//   : T extends BigIntConstructor
//   ? bigint
//   : T extends EntityType
//   ? Entity
//   : T extends DateConstructor | typeof Buffer | typeof ArrayBuffer | typeof SharedArrayBuffer
//   ? T
//   : never

/**
 * 数据库标准类型定义
 */
export const DbType = {
  int8: {
    name: 'INT8',
  } as INT8,
  int16: { name: 'INT16' } as INT16,
  int32: { name: 'INT32' } as INT32,
  int64: { name: 'INT64' } as INT64,
  decimal(precision: number, digit?: number): DECIMAL {
    return {
      name: 'DECIMAL',
      precision,
      digit,
    };
  },
  float: {
    name: 'FLOAT',
  } as FLOAT,
  double: {
    name: 'DOUBLE',
  } as DOUBLE,
  string(length: number): STRING {
    return {
      name: 'STRING',
      length,
    };
  },
  date: {
    name: 'DATE',
  } as DATE,
  datetime: {
    name: 'DATETIME',
  } as DATETIME,
  datetimeoffset: {
    name: 'DATETIMEOFFSET',
  } as DATETIMEOFFSET,
  binary(length: number): BINARY {
    return {
      name: 'BINARY',
      length,
    };
  },
  boolean: {
    name: 'BOOLEAN',
  } as BOOLEAN,
  uuid: {
    name: 'UUID',
  } as UUID,
  object: <T extends object = any>(): OBJECT<T> => {
    return DEFAULT_OBJECT;
  },
  array<T extends DbType>(type: T): ARRAY<T> {
    return {
      name: 'ARRAY',
      type,
    };
  },
  raw(name: string): any {
    return new Raw(name);
  },
  MAX: 0,
};

/**
 * 用于做实体主键类型
 * 用户可自行使用 合并声明扩展
 */
export interface EntityKey {}

/**
 * 主键的类型
 */
export type EntityKeyType = EntityKey[keyof EntityKey] extends never
  ? number
  : NonNullable<EntityKey[keyof EntityKey]>;

/**
 * 主键字段字面量类型
 */
export type EntityKeyName = keyof EntityKey extends never
  ? 'id'
  : keyof EntityKey;
