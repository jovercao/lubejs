// interface QueryParameter {
//    name: string,
//    value: any,
//    direction?: ParameterDirection
// }

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

export type INT64 = {
  readonly name: 'int64'
}

export type INT32 = {
  readonly name: 'int32'
  readonly length?: 8 | 16 | 32 | 64
}

export type INT16 = {
  readonly name: 'int16'
}

export type INT8 = {
  readonly name: 'int8'
}

export type NUMERIC = {
  readonly name: 'numeric'
  readonly precision: number
  readonly digit?: number
}

export type FLOAT = {
  readonly name: 'float'
}

export type DOUBLE = {
  readonly name: 'double'
}

export type STRING = {
  readonly name: 'string'
  /**
   * 为0时表示无限大
   */
  readonly length: number
}

export type DATE = {
  readonly name: 'date'
}

export type DATETIME = {
  readonly name: 'datetime'
}

export type BINARY = {
  readonly name: 'binary'
  readonly length: number
}

export type BOOLEAN = {
  readonly name: 'boolean'
}

export type UUID = {
  readonly name: 'uuid'
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

/**
 * 数据库类型映射
 */
export type DbTypeMap = {
  int8: number
  int16: number
  int32: number
  int64: number
  numeric: number
  float: number
  double: number
  string: string
  date: Date
  datetime: Date
  binary: Binary
  boolean: boolean
  uuid: string
}

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
    name: 'int8'
  } as INT8,
  int16: { name: 'int16' } as INT16,
  int32: { name: 'int32' } as INT32,
  int64: { name: 'int64' } as INT64,
  numeric (precision: number, digit?: number): NUMERIC {
    return {
      name: 'numeric',
      precision,
      digit
    }
  },
  float: {
    name: 'float'
  } as FLOAT,
  double: {
    name: 'double'
  } as DOUBLE,
  string (length: number): STRING {
    return {
      name: 'string',
      length
    }
  },
  date: {
    name: 'date'
  } as DATE,
  datetime: {
    name: 'datetime'
  } as DATETIME,
  binary (length: number): BINARY {
    return {
      name: 'binary',
      length
    }
  },
  boolean: {
    name: 'boolean'
  } as BOOLEAN,
  uuid: {
    name: 'uuid'
  } as UUID
}
