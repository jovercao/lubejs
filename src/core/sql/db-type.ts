/* eslint-disable @typescript-eslint/prefer-as-const */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/ban-types */
// interface QueryParameter {
//    name: string,
//    value: any,
//    direction?: ParameterDirection
// }

import {
  Binary,
  Decimal,
  Time,
  Scalar,
  Uuid,
  List,
  Json,
  BaseScalar,
} from './scalar';

// **********************************类型声明******************************************

export type INT64 = {
  readonly type: 'INT64';
};

export type INT32 = {
  readonly type: 'INT32';
};

export type INT16 = {
  readonly type: 'INT16';
};

export type INT8 = {
  readonly type: 'INT8';
};

export type DECIMAL = {
  readonly type: 'DECIMAL';
  readonly precision: number;
  readonly scale: number;
};

export type FLOAT32 = {
  readonly type: 'FLOAT32';
};

export type FLOAT64 = {
  readonly type: 'FLOAT64';
};

export type STRING = {
  readonly type: 'STRING';
  /**
   * 为0时表示无限大
   */
  readonly size: number;
};

export type DATE = {
  readonly type: 'DATE';
};

export type DATETIME = {
  readonly type: 'DATETIME';
};

export type DATETIMEOFFSET = {
  readonly type: 'DATETIMEOFFSET';
};

export type TIME = {
  readonly type: 'TIME';
};

export type BINARY = {
  readonly type: 'BINARY';
  readonly size: number;
};

export type BOOLEAN = {
  readonly type: 'BOOLEAN';
};

export type UUID = {
  readonly type: 'UUID';
};

/**
 * 行标识列，如sqlserver的timestamp
 */
export type ROWFLAG = {
  readonly type: 'ROWFLAG';
};

/**
 * 对象类型,不使用JSON，是因为冲突
 */
export type JSON<T extends Json = Json> = {
  readonly type: 'JSON';
};

/**
 * 列表类型，即数组，不使用ARRAY，亦是因为命名冲突
 */
export type LIST<T extends BaseScalar> = {
  readonly type: 'LIST';
  /**
   * 元素类型
   */
  readonly innerType: DbType;
};

export function isDbType(value: any): value is DbType {
  if (typeof value?.type !== 'string') return false;
  return (value.type as string).toLowerCase() in DbType;
}

export type BaseDbType =
  | INT8
  | INT16
  | INT32
  | INT64
  | DECIMAL
  | FLOAT32
  | FLOAT64
  | STRING
  | DATE
  | DATETIME
  | TIME
  | DATETIMEOFFSET
  | BINARY
  | BOOLEAN
  | UUID;

export type DbType = BaseDbType | ROWFLAG | JSON | LIST<any>;

/**
 * 类型转换
 */
export type ScalarFromDbType<T extends DbType> = T extends
  | INT8
  | INT16
  | INT32
  | FLOAT32
  | FLOAT64
  ? number
  : T extends DECIMAL
  ? Decimal
  : T extends INT64
  ? bigint
  : T extends STRING
  ? string
  : T extends UUID
  ? Uuid
  : T extends DATE | DATETIME | DATETIMEOFFSET
  ? Date
  : T extends TIME
  ? Time
  : T extends BOOLEAN
  ? boolean
  : T extends BINARY
  ? Binary
  : T extends ROWFLAG
  ? any
  : T extends JSON<infer M>
  ? M
  : T extends Raw
  ? Scalar
  : T extends LIST<infer M>
  ? M[]
  : never;

/**
 * 从TS Type 转换为DbType的类型
 */
export type DbTypeFromScalar<T> = T extends string
  ? STRING
  : T extends number
  ? DECIMAL | FLOAT32 | FLOAT64 | INT16 | INT8 | INT32 | INT64
  : T extends Date
  ? DATETIME | DATE | DATETIMEOFFSET
  : T extends Time
  ? TIME
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
  : T extends List<infer M>
  ? DbTypeFromScalar<M> extends BaseScalar
    ? LIST<DbTypeFromScalar<M>>
    : never
  : T extends Json
  ? JSON<T>
  : never;

const MAX = 0;

const float32: FLOAT32 & (() => FLOAT32) = Object.assign(() => float32, {
  type: 'FLOAT32',
} as FLOAT32);

const float64: FLOAT64 & (() => FLOAT64) = Object.assign(() => float64, {
  type: 'FLOAT64',
} as FLOAT64);

const date: DATE & (() => DATE) = Object.assign(() => date, {
  type: 'DATE',
} as DATE);

const time: TIME & (() => TIME) = Object.assign(() => time, {
  type: 'TIME',
} as TIME);

const datetime: DATETIME & (() => DATETIME) = Object.assign(() => datetime, {
  type: 'DATETIME',
} as DATETIME);

const datetimeoffset: DATETIMEOFFSET & (() => DATETIMEOFFSET) = Object.assign(
  () => datetimeoffset,
  {
    type: 'DATETIMEOFFSET',
  } as DATETIMEOFFSET
);

const boolean: BOOLEAN & (() => BOOLEAN) = Object.assign(() => boolean, {
  type: 'BOOLEAN',
} as BOOLEAN);

const uuid: UUID & (() => UUID) = Object.assign(() => uuid, {
  type: 'UUID',
} as UUID);

const rowflag: ROWFLAG & (() => ROWFLAG) = Object.assign(() => rowflag, {
  type: 'ROWFLAG',
} as ROWFLAG);

const int8: INT8 & (() => INT8) = Object.assign((): INT8 => int8, {
  type: 'INT8',
} as INT8);

const int16: INT16 & (() => INT16) = Object.assign((): INT16 => int16, {
  type: 'INT16',
} as INT16);

const int32: INT32 & (() => INT32) = Object.assign((): INT32 => int32, {
  type: 'INT32',
} as INT32);

const int64: INT64 & (() => INT64) = Object.assign((): INT64 => int64, {
  type: 'INT64',
} as INT64);

const string: STRING & ((size: number) => STRING) = Object.assign(
  (length: number): STRING => ({
    type: 'STRING',
    size: length,
  }),
  {
    type: 'STRING',
    size: MAX,
  } as STRING
);

const decimal: DECIMAL & ((precision: number, digit?: number) => DECIMAL) =
  Object.assign(
    (precision: number, digit: number = 2): DECIMAL => ({
      type: 'DECIMAL',
      precision,
      scale: digit,
    }),
    {
      type: 'DECIMAL',
      precision: 18,
      scale: 2,
    } as DECIMAL
  );

const binary: BINARY & ((size: number) => BINARY) = Object.assign(
  (length: number): BINARY => ({
    type: 'BINARY',
    size: length,
  }),
  {
    type: 'BINARY',
    size: MAX,
  } as BINARY
);

const json: JSON & (<T extends Json = any>() => JSON<T>) = Object.assign(
  () => json,
  {
    type: 'JSON',
  } as JSON
);

const list: LIST<string> &
  (<T extends BaseDbType = any>(innerType: T) => LIST<ScalarFromDbType<T>>) =
  Object.assign(
    <T extends BaseDbType = any>(innerType: T): LIST<ScalarFromDbType<T>> => ({
      type: 'LIST',
      innerType,
    }),
    {
      type: 'LIST',
      innerType: string,
    } as LIST<string>
  );

/**
 * 数据库标准类型定义
 */
export const DbType = {
  int8: {
    type: 'INT8',
  } as INT8,
  int16,
  int32,
  int64,
  decimal,
  float32,
  float64,
  date,
  time,
  datetime,
  datetimeoffset,
  boolean,
  uuid,
  rowflag,
  string,
  binary,
  json,
  list,
  raw(name: string): any {
    return new Raw(name);
  },
  MAX,
};

// /**
//  * 所浮点类型
//  */
// export type Float = number;

import { Raw } from './raw';
