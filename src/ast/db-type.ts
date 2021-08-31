/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/ban-types */
// interface QueryParameter {
//    name: string,
//    value: any,
//    direction?: ParameterDirection
// }

import { Raw } from './raw';
import { deepthEqual } from './util';
import { parse, stringify, v4 } from 'uuid';
import { Binary, Decimal, Scalar, Uuid } from './scalar';

// **********************************类型声明******************************************



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

export function isSameDbType(type1: DbType, type2: DbType): boolean {
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
  T extends object
  ? OBJECT<T>
  : never;

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
  rowflag: {
    name: 'ROWFLAG'
  } as ROWFLAG,
  MAX: 0,
};


// /**
//  * 所浮点类型
//  */
// export type Float = number;

