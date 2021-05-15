/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/ban-types */
// interface QueryParameter {
//    name: string,
//    value: any,
//    direction?: ParameterDirection
// }

import { RowObject } from "./ast"

// **********************************类型声明******************************************

export type Binary = ArrayBuffer | SharedArrayBuffer

/**
 * 标量类型
 * 对应数据库标量类型的JS类型集
 */
export type ScalarType =
  | string
  | Date
  | boolean
  | null
  | number
  | Binary
  | bigint
// TODO: 适配 JSON 和 ARRAY数据类型
  // | RowObject
  // | Array<ScalarType>

export type ScalarTypeConstructor =
  | String
  | Date
  | Boolean
  | Number
  | BigInt
  | ArrayBuffer
  | Buffer
  | SharedArrayBuffer
  | JSON

export type INT64 = {
  readonly name: 'INT64'
}

export type INT32 = {
  readonly name: 'INT32'
  readonly length?: 8 | 16 | 32 | 64
}

export type INT16 = {
  readonly name: 'INT16'
}

export type INT8 = {
  readonly name: 'INT8'
}

export type NUMERIC = {
  readonly name: 'NUMERIC'
  readonly precision: number
  readonly digit?: number
}

export type FLOAT = {
  readonly name: 'FLOAT'
}

export type DOUBLE = {
  readonly name: 'DOUBLE'
}

export type STRING = {
  readonly name: 'STRING'
  /**
   * 为0时表示无限大
   */
  readonly length: number
}

export type DATE = {
  readonly name: 'DATE'
}

export type DATETIME = {
  readonly name: 'DATETIME'
}

export type BINARY = {
  readonly name: 'BINARY'
  readonly length: number
}

export type BOOLEAN = {
  readonly name: 'BOOLEAN'
}

export type UUID = {
  readonly name: 'UUID'
}

/**
 * 行标识列，如sqlserver的timestamp
 */
export type ROWFLAG = {
  readonly name: 'ROWFLAG'
}

/**
 * 对象类型,不使用JSON，是因为冲突
 */
export type OBJECT<T extends object = any> = {
  readonly name: 'OBJECT'
}

/**
 * 列表类型，即数组，不使用ARRAY，亦是因为命名冲突
 */
export type LIST<T extends DbType> = {
  readonly name: 'LIST'
  /**
   * 元素类型
   */
  readonly type: DbType;
}

export type DbType =
  | INT8
  | INT16
  | INT32
  | INT64
  | NUMERIC
  | FLOAT
  | DOUBLE
  | STRING
  | DATE
  | DATETIME
  | BINARY
  | BOOLEAN
  | UUID
  | ROWFLAG
  | OBJECT
  | LIST<any>

/**
 * 类型转换
 */
export type DbTypeToTsType<T extends DbType> =
  T extends INT8 | INT16 | INT32 | INT64 | Number | FLOAT | DOUBLE
  ? number
  : T extends STRING | UUID
  ? string
  : T extends DATE | DATETIME
  ? Date
  : T extends BOOLEAN
  ? boolean
  : T extends BINARY
  ? Binary
  : T extends ROWFLAG
  ? any
  : T extends OBJECT<infer M>
  ? M
  : T extends LIST<infer M>
  ? DbTypeToTsType<M>[]
  : never;

/**
 * 转换
 */
export type TsTypeToDbType<T> =
  T extends string
  ? STRING
  : T extends number
  ? NUMERIC | FLOAT | DOUBLE | INT16 | INT8 | INT32 | INT64
  : T extends Date
  ? DATETIME | DATE
  : T extends boolean
  ? BOOLEAN
  : T extends Binary
  ? BINARY
  : T extends Array<infer M>
  ? LIST<TsTypeToDbType<M>>
  : T extends RowObject
  ? OBJECT<T>
  : never

/**
 * 解释值的类型
 */
export function parseValueType (value: ScalarType): DbType {
  if (value === null || value === undefined)
    throw new Error('Do not parse DbType from null or undefined')
  switch (value.constructor) {
    case String:
      return type.string(0)
    case Number:
      return type.int32
    case Date:
      return type.datetime
    case Boolean:
      return type.boolean
    case Buffer:
    case ArrayBuffer:
    case SharedArrayBuffer:
      return type.binary(0)
    default:
      throw new Error('Invalid value.')
  }
}

export const type = {
  int8: {
    name: 'INT8'
  } as INT8,
  int16: { name: 'INT16' } as INT16,
  int32: { name: 'INT32' } as INT32,
  int64: { name: 'INT64' } as INT64,
  numeric (precision: number, digit?: number): NUMERIC {
    return {
      name: 'NUMERIC',
      precision,
      digit
    }
  },
  float: {
    name: 'FLOAT'
  } as FLOAT,
  double: {
    name: 'DOUBLE'
  } as DOUBLE,
  string (length: number): STRING {
    return {
      name: 'STRING',
      length
    }
  },
  date: {
    name: 'DATE'
  } as DATE,
  datetime: {
    name: 'DATETIME'
  } as DATETIME,
  binary (length: number): BINARY {
    return {
      name: 'BINARY',
      length
    }
  },
  boolean: {
    name: 'BOOLEAN'
  } as BOOLEAN,
  uuid: {
    name: 'UUID'
  } as UUID,
  object: (<T extends object = any>(): OBJECT<T> => {
    return {
      name: 'OBJECT'
    }
  }),
  list<T extends DbType>(type: T): LIST<DbTypeToTsType<T>> {
    return {
      name: 'LIST',
      type
    }
  }
}
