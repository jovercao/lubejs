import { dbTypeToRaw } from './types';
import {
  Statement,
  Binary,
  BuiltIn,
  CompatibleExpression,
  DbType,
  Expression,
  Scalar,
  TsTypeOf,
  SqlBuilder as SQL,
} from 'lubejs';

const { makeExec, variant, builtIn, func, makeInvoke } = SQL;

type InvokeHandler0<TResult extends Scalar> = () => Expression<TResult>;
type InvokeHandler1<TResult extends Scalar, TArg1 extends Scalar> = (
  expr: CompatibleExpression<TArg1>
) => Expression<TResult>;
type InvokeHandler2<
  TResult extends Scalar,
  TArg1 extends Scalar,
  TArg2 extends Scalar
> = (
  expr1: CompatibleExpression<TArg1>,
  expr2: CompatibleExpression<TArg1>
) => Expression<TResult>;
// type InvokeHandler2<TResult extends Scalar, TArg1 extends Scalar, TArg2 extends Scalar> = (arg1: CompatibleExpression<TArg1>, arg2: CompatibleExpression<TArg2>) => Expression<TResult>;
// type InvokeHandler3<TResult extends Scalar, TArg1 extends Scalar, TArg2 extends Scalar, TArg3 extends Scalar> = (arg1: CompatibleExpression<TArg1>, arg2: CompatibleExpression<TArg2>, arg3: CompatibleExpression<TArg3>) => Expression<TResult>;
// type InvokeHandler4<TResult extends Scalar, TArg1 extends Scalar, TArg2 extends Scalar, TArg3 extends Scalar, TArg4 extends Scalar> = (arg1: CompatibleExpression<TArg1>, arg2: CompatibleExpression<TArg2>, arg3: CompatibleExpression<TArg3>, arg4: CompatibleExpression<TArg4>) => Expression<TResult>;

// type InvokeHandler<TResult extends Scalar, TArg1 extends Scalar = never, TArg2 extends Scalar = never, TArg3 extends Scalar = never, TArg4 extends Scalar = never> =
//   Targ4 extends never ? (
//     TArg3 extends never ? (
//       TArg2 extends never ? (
//         TArg1 extends never ? InvokeHandler0<TResult> : InvokeHandler1<TResult, TArg1>
//       ) : InvokeHandler2<TResult, TArg1, TArg2>
//     ) : InvokeHandler3<TResult, TArg1, TArg2, TArg3>
//   ) : InvokeHandler4<TResult, TArg1, TArg2, TArg3, TArg4>;

export type DatePart = BuiltIn<keyof typeof DATE_PART>;

export const count: InvokeHandler1<number, any> = makeInvoke(
  'scalar',
  'count',
  true
);
export const avg: InvokeHandler1<number, number> = makeInvoke(
  'scalar',
  'avg',
  true
);
export const sum: InvokeHandler1<number, number> = makeInvoke(
  'scalar',
  'sum',
  true
);
export const max: <T extends Exclude<Scalar, Binary>>(
  expr: Expression<T>
) => Expression<T> = makeInvoke('scalar', 'max', true);
export const min: <T extends Exclude<Scalar, Binary>>(
  expr: Expression<T>
) => Expression<T> = makeInvoke('scalar', 'min', true);
export const exp: InvokeHandler1<number, number> = makeInvoke(
  'scalar',
  'exp',
  true
);
export const round: (
  expr: CompatibleExpression<number>,
  precision: CompatibleExpression<number>
) => Expression<number> = makeInvoke('scalar', 'round', true);
export const nvl: <T1 extends Scalar, T2 extends Scalar>(
  expr: CompatibleExpression<T1>,
  default_value: CompatibleExpression<T2>
) => Expression<T1 | T2> = makeInvoke('scalar', 'nvl', true);
export const stdev: InvokeHandler1<number, number> = makeInvoke(
  'scalar',
  'stdev',
  true
);
export const dateName: (
  part: DatePart,
  date: CompatibleExpression<Date>
) => Expression<string> = makeInvoke('scalar', 'dateName', true);
export const datePart: (
  part: DatePart,
  date: CompatibleExpression<Date>
) => Expression<number> = makeInvoke('scalar', 'datePart', true);
export const isNull: <T1 extends Scalar, T2 extends Scalar>(
  expr: CompatibleExpression<T1>,
  default_value: CompatibleExpression<T2>
) => Expression<T1 | T2> = makeInvoke('scalar', 'isNull', true);
export const len: InvokeHandler1<number, string> = makeInvoke(
  'scalar',
  'len',
  true
);
export const getDate: InvokeHandler0<Date> = makeInvoke(
  'scalar',
  'getDate',
  true
);
export const getUtcDate: InvokeHandler0<Date> = makeInvoke(
  'scalar',
  'getUtcDate',
  true
);
// export const export const date: NoneParameterInvoke<Date> = makeFunc('scalar', 'date', true);
export const month: InvokeHandler1<number, Date> = makeInvoke(
  'scalar',
  'month',
  true
);
export const year: InvokeHandler1<number, Date> = makeInvoke(
  'scalar',
  'year',
  true
);
export const day: InvokeHandler1<number, Date> = makeInvoke(
  'scalar',
  'day',
  true
);
export const dateAdd: (
  part: DatePart,
  increment: CompatibleExpression<number>,
  date: CompatibleExpression<Date>
) => Expression<Date> = makeInvoke('scalar', 'dateAdd', true);
export const dateDiff: (
  part: DatePart,
  startDate: CompatibleExpression<Date>,
  endDate: CompatibleExpression<Date>
) => Expression<number> = makeInvoke('scalar', 'dateDiff', true);
export const sysDateTime: InvokeHandler0<Date> = makeInvoke(
  'scalar',
  'sysDateTime',
  true
);
export const sysUtcDateTime: InvokeHandler0<Date> = makeInvoke(
  'scalar',
  'sysUtcDateTime',
  true
);
export const sysDateTimeOffset: InvokeHandler0<Date> = makeInvoke(
  'scalar',
  'sysDateTimeOffset',
  true
);

export const switchOffset: (
  date: CompatibleExpression<Date>,
  time_zone: CompatibleExpression<string>
) => Expression<Date> = makeInvoke('scalar', 'switchOffset', true);

export const charIndex: (
  pattern: CompatibleExpression<string>,
  str: CompatibleExpression<string>,
  startIndex?: CompatibleExpression<number>
) => Expression<number> = makeInvoke('scalar', 'charIndex', true);
export const left: (
  str: CompatibleExpression<string>,
  length: CompatibleExpression<number>
) => Expression<number> = makeInvoke('scalar', 'left', true);
export const right: (
  str: CompatibleExpression<string>,
  length: CompatibleExpression<number>
) => Expression<number> = makeInvoke('scalar', 'right', true);
export const str: InvokeHandler1<string, Scalar> = makeInvoke(
  'scalar',
  'str',
  true
);
export const substring: (
  expr: CompatibleExpression<string>,
  start: CompatibleExpression<number>,
  length: CompatibleExpression<number>
) => Expression<string> = makeInvoke('scalar', 'substring', true);
export const ascii: InvokeHandler1<number, string> = makeInvoke(
  'scalar',
  'ascii',
  true
);
export const unicode: InvokeHandler1<number, string> = makeInvoke(
  'scalar',
  'unicode',
  true
);
export const char: InvokeHandler1<string, number> = makeInvoke(
  'scalar',
  'char',
  true
);
export const nchar: InvokeHandler1<string, number> = makeInvoke(
  'scalar',
  'nchar',
  true
);
export const patIndex: (
  pattern: CompatibleExpression<string>,
  str: CompatibleExpression<string>
) => Expression<number> = makeInvoke('scalar', 'patIndex', true);
export const ltrim: InvokeHandler1<string, string> = makeInvoke(
  'scalar',
  'ltrim',
  true
);
export const rtrim: InvokeHandler1<string, string> = makeInvoke(
  'scalar',
  'rtrim',
  true
);
export const space: InvokeHandler1<string, number> = makeInvoke(
  'scalar',
  'space',
  true
);
export const reverse: InvokeHandler1<string, string> = makeInvoke(
  'scalar',
  'reverse',
  true
);
export const stuff: (
  expression_to_be_searched: CompatibleExpression<string>,
  starting_position: CompatibleExpression<number>,
  number_of_chars: CompatibleExpression<number>,
  replacement_expression: CompatibleExpression<string>
) => Expression<string> = makeInvoke('scalar', 'stuff', true);
export const quotedName: InvokeHandler1<string, string> = makeInvoke(
  'scalar',
  'quotedName',
  true
);
export const lower: InvokeHandler1<string, string> = makeInvoke(
  'scalar',
  'lower',
  true
);
export const upper: InvokeHandler1<string, string> = makeInvoke(
  'scalar',
  'upper',
  true
);
export const replace: (
  expression_to_be_searched: CompatibleExpression<string>,
  search_expression: CompatibleExpression<string>,
  replacement_expression: CompatibleExpression<string>
) => Expression<string> = makeInvoke('scalar', 'replace', true);
export const abs: InvokeHandler1<number, number> = makeInvoke(
  'scalar',
  'abs',
  true
);
export const acos: InvokeHandler1<number, number> = makeInvoke(
  'scalar',
  'acos',
  true
);
export const asin: InvokeHandler1<number, number> = makeInvoke(
  'scalar',
  'asin',
  true
);
export const atan: InvokeHandler1<number, number> = makeInvoke(
  'scalar',
  'atan',
  true
);
export const atan2: InvokeHandler1<number, number> = makeInvoke(
  'scalar',
  'atan2',
  true
);
export const ceiling: InvokeHandler1<number, number> = makeInvoke(
  'scalar',
  'ceiling',
  true
);
export const cos: InvokeHandler1<number, number> = makeInvoke(
  'scalar',
  'cos',
  true
);
export const cot: InvokeHandler1<number, number> = makeInvoke(
  'scalar',
  'cot',
  true
);
export const degrees: InvokeHandler1<number, number> = makeInvoke(
  'scalar',
  'degrees',
  true
);
export const floor: InvokeHandler1<number, number> = makeInvoke(
  'scalar',
  'floor',
  true
);
export const log: InvokeHandler1<number, number> = makeInvoke(
  'scalar',
  'log',
  true
);
export const log10: InvokeHandler1<number, number> = makeInvoke(
  'scalar',
  'log10',
  true
);
export const pi: InvokeHandler0<number> = makeInvoke('scalar', 'pi', true);
export const power: InvokeHandler2<number, number, number> = makeInvoke(
  'scalar',
  'power',
  true
);
export const radians: InvokeHandler1<number, number> = makeInvoke(
  'scalar',
  'radians',
  true
);
export const rand: InvokeHandler0<number> = makeInvoke('scalar', 'rand', true);
export const sign: InvokeHandler1<number, number> = makeInvoke(
  'scalar',
  'sign',
  true
);
export const sin: InvokeHandler1<number, number> = makeInvoke(
  'scalar',
  'sin',
  true
);
export const sqrt: InvokeHandler1<number, number> = makeInvoke(
  'scalar',
  'sqrt',
  true
);
export const square: InvokeHandler1<number, number> = makeInvoke(
  'scalar',
  'square',
  true
);
export const tan: InvokeHandler1<number, number> = makeInvoke(
  'scalar',
  'tan',
  true
);

/**
 * 系统函数声明
 */
export const FUNCTION = {
  count,
  avg,
  sum,
  max,
  min,
  abs,
  exp,
  round,
  floor,
  sqrt,
  power,
  nvl,
  stdev,
  square,
  dateName,
  datePart,
  isNull,
  len,
  getDate,
  getUtcDate,
  month,
  year,
  dateAdd,
  dateDiff,
  sysDateTime,
  sysUtcDateTime,
  charIndex,
  left,
  right,
  str,
  substring,
  ascii,
  char,
  unicode,
  nchar,
  patIndex,
  ltrim,
  rtrim,
  space,
  reverse,
  stuff,
  quotedName,
  lower,
  upper,
  replace,
  rand,
  acos,
  asin,
  atan,
  atan2,
  ceiling,
  cos,
  cot,
  degrees,
  log,
  log10,
  pi,
  radians,
  sign,
  sin,
  tan,
};

export const YEAR = builtIn('YEAR');
export const YY = builtIn('YY');
export const YYYY = builtIn('YYYY');
export const QUARTER = builtIn('QUARTER');
export const QQ = builtIn('QQ');
export const Q = builtIn('Q');
export const MONTH = builtIn('MONTH');
export const MM = builtIn('MM');
export const M = builtIn('M');
export const DAYOFYEAR = builtIn('DAYOFYEAR');
export const DY = builtIn('DY');
export const Y = builtIn('Y');
export const DAY = builtIn('DAY');
export const DD = builtIn('DD');
export const D = builtIn('D');
export const WEEK = builtIn('WEEK');
export const WK = builtIn('WK');
export const WW = builtIn('WW');
export const WEEKDAY = builtIn('WEEKDAY');
export const DW = builtIn('DW');
export const HOUR = builtIn('HOUR');
export const HH = builtIn('HH');
export const MINUTE = builtIn('MINUTE');
export const MI = builtIn('MI');
export const N = builtIn('N');
export const SECOND = builtIn('SECOND');
export const SS = builtIn('SS');
export const S = builtIn('S');
export const MILLISECOND = builtIn('MILLISECOND');
export const MS = builtIn('MS');

/**
 * 日期格式部分
 */
export const DATE_PART = {
  YEAR,
  YY,
  YYYY,
  QUARTER,
  QQ,
  Q,
  MONTH,
  MM,
  M,
  DAYOFYEAR,
  DY,
  Y,
  DAY,
  DD,
  D,
  WEEK,
  WK,
  WW,
  WEEKDAY,
  DW,
  HOUR,
  HH,
  MINUTE,
  MI,
  N,
  SECOND,
  SS,
  S,
  MILLISECOND,
  MS,
};

/**
 * 最后一次插入数据的标识列值
 */
export const IDENTITY = variant<number, '@IDENTITY'>('@IDENTITY');
/**
 * 最后一次执行受影响函数
 */
export const ROWCOUNT = variant<number, '@ROWCOUNT'>('@ROWCOUNT');
/**
 * 返回自上次启动 Microsoft SQL Server以来连接或试图连接的次数。
 */
export const CONNECTIONS = variant<number, '@CONNECTIONS'>('@CONNECTIONS');
/**
 * 返回自上次启动 Microsoft SQL Server以来 CPU 的工作时间，单位为毫秒（基于系统计时器的分辨率）。
 */
export const CPU_BUSY = variant<number, '@CPU_BUSY'>('@CPU_BUSY');
/**
 * 返回 SET DATEFIRST 参数的当前值，SET DATEFIRST 参数指明所规定的每周第一天：1 对应星期一，2 对应星期二，依次类推，用 7 对应星期日。
 */
export const DATEFIRST = variant<number, '@DATEFIRST'>('@DATEFIRST');
/**
 * 返回 Microsoft SQL Server自上次启动后用于执行输入和输出操作的时间，单位为毫秒（基于系统计时器的分辨率）。
 */
export const IO_BUSY = variant<number, '@IO_BUSY'>('@IO_BUSY');
/**
 * 返回当前所使用语言的本地语言标识符(ID)。
 */
export const LANGID = variant<number, '@LANGID'>('@LANGID');
/**
 * 返回当前使用的语言名。
 */
export const LANGUAGE = variant<string, '@LANGUAGE'>('@LANGUAGE');
/**
 * 返回 Microsoft SQL Server上允许的同时用户连接的最大数。返回的数不必为当前配置的数值。
 */
export const MAX_CONNECTIONS = variant<number, '@MAX_CONNECTIONS'>(
  '@MAX_CONNECTIONS'
);
/**
 * 返回 Microsoft SQL Server自上次启动后从网络上读取的输入数据包数目。
 */
export const PACK_RECEIVED = variant<number, '@PACK_RECEIVED'>(
  '@PACK_RECEIVED'
);
/**
 * 返回 Microsoft SQL Server自上次启动后写到网络上的输出数据包数目。
 */
export const PACK_SENT = variant<number, '@PACK_SENT'>('@PACK_SENT');
/**
 * 返回自 SQL Server 上次启动后，在 Microsoft SQL Server连接上发生的网络数据包错误数。
 */
export const PACKET_ERRORS = variant<number, '@PACKET_ERRORS'>(
  '@PACKET_ERRORS'
);
/**
 * 返回运行 Microsoft SQL Server的本地服务器名称。
 */
export const SERVERNAME = variant<string, '@SERVERNAME'>('@SERVERNAME');
/**
 * 返回 Microsoft SQL Server正在其下运行的注册表键名。若当前实例为默认实例，则 @SERVICENAME 返回 MSSQLServer；若当前实例是命名实例，则该函数返回实例名。
 */
export const SERVICENAME = variant<string, '@SERVICENAME'>('@SERVICENAME');
/**
 * 返回当前用户进程的服务器进程标识符 (ID)。
 */
export const SPID = variant<number, '@SPID'>('@SPID');
/**
 * 返回一刻度的微秒数。
 */
export const TIMETICKS = variant<number, '@TIMETICKS'>('@TIMETICKS');
/**
 * 返回 Microsoft SQL Server自上次启动后，所遇到的磁盘读/写错误数。
 */
export const TOTAL_ERRORS = variant<number, '@TOTAL_ERRORS'>('@TOTAL_ERRORS');
/**
 * 返回 Microsoft SQL Server自上次启动后写入磁盘的次数。
 */
export const TOTAL_WRITE = variant<number, '@TOTAL_WRITE'>('@TOTAL_WRITE');
/**
 * 返回 Microsoft SQL Server当前安装的日期、版本和处理器类型。
 */
export const VERSION = variant<string, '@VERSION'>('@VERSION');
/**
 * 返回 Microsoft SQL Server自上次启动后读取磁盘（不是读取高速缓存）的次数。
 */
export const TOTAL_READ = variant<number, '@TOTAL_READ'>('@TOTAL_READ');

/**
 * 系统变量
 */
export const VARIANTS = {
  /**
   * 最后一次插入数据的标识列值
   */
  IDENTITY,
  /**
   * 最后一次执行受影响函数
   */
  ROWCOUNT,
  /**
   * 返回自上次启动 Microsoft SQL Server以来连接或试图连接的次数。
   */
  CONNECTIONS,
  /**
   * 返回自上次启动 Microsoft SQL Server以来 CPU 的工作时间，单位为毫秒（基于系统计时器的分辨率）。
   */
  CPU_BUSY,
  /**
   * 返回 SET DATEFIRST 参数的当前值，SET DATEFIRST 参数指明所规定的每周第一天：1 对应星期一，2 对应星期二，依次类推，用 7 对应星期日。
   */
  DATEFIRST,
  /**
   * 返回 Microsoft SQL Server自上次启动后用于执行输入和输出操作的时间，单位为毫秒（基于系统计时器的分辨率）。
   */
  IO_BUSY,
  /**
   * 返回当前所使用语言的本地语言标识符(ID)。
   */
  LANGID,
  /**
   * 返回当前使用的语言名。
   */
  LANGUAGE,
  /**
   * 返回 Microsoft SQL Server上允许的同时用户连接的最大数。返回的数不必为当前配置的数值。
   */
  MAX_CONNECTIONS,
  /**
   * 返回 Microsoft SQL Server自上次启动后从网络上读取的输入数据包数目。
   */
  PACK_RECEIVED,
  /**
   * 返回 Microsoft SQL Server自上次启动后写到网络上的输出数据包数目。
   */
  PACK_SENT,
  /**
   * 返回自 SQL Server 上次启动后，在 Microsoft SQL Server连接上发生的网络数据包错误数。
   */
  PACKET_ERRORS,
  /**
   * 返回运行 Microsoft SQL Server的本地服务器名称。
   */
  SERVERNAME,
  /**
   * 返回 Microsoft SQL Server正在其下运行的注册表键名。若当前实例为默认实例，则 @SERVICENAME 返回 MSSQLServer；若当前实例是命名实例，则该函数返回实例名。
   */
  SERVICENAME,
  /**
   * 返回当前用户进程的服务器进程标识符 (ID)。
   */
  SPID,
  /**
   * 返回一刻度的微秒数。
   */
  TIMETICKS,
  /**
   * 返回 Microsoft SQL Server自上次启动后，所遇到的磁盘读/写错误数。
   */
  TOTAL_ERRORS,
  /**
   * 返回 Microsoft SQL Server自上次启动后写入磁盘的次数。
   */
  TOTAL_WRITE,
  /**
   * 返回 Microsoft SQL Server当前安装的日期、版本和处理器类型。
   */
  VERSION,
  /**
   * 返回 Microsoft SQL Server自上次启动后读取磁盘（不是读取高速缓存）的次数。
   */
  TOTAL_READ,
};

// TODO: 声明数据库类型

export type SQL_VARIANT = {
  name: 'sql_variant' | 'sv';
};

export type SV = SQL_VARIANT;

export type INTEGER = {
  name: 'int' | 'integer';
};

export type INT = INTEGER;

export type BIGINT = {
  name: 'bint' | 'bigint';
};

export type BINT = BIGINT;

export type SMALLINT = {
  name: 'smallint' | 'sint';
};

export type SINT = SMALLINT;

export type TINYINT = {
  name: 'tinyint' | 'tint';
};

export type TINT = TINYINT;

export type DECIMAL = {
  name: 'decimal' | 'dec';
  precision: number;
  digit?: number;
};

export type DEC = DECIMAL;

export type NUMERIC = {
  name: 'numeric' | 'num';
  precision: number;
  digit?: number;
};
export type NUM = NUMERIC;

export type REAL = {
  name: 'real' | 'r';
};

export type R = REAL;

export type FLOAT = {
  name: 'float';
  precision?: number;
};

export type MONEY = {
  type: 'money' | 'mn';
};

export type MN = MONEY;

export type SMALLMONEY = {
  name: 'smallmoney' | 'smn';
};

export type SMN = SMALLMONEY;

export type CHAR = {
  name: 'char';
  length: number;
};

export type NCHAR = {
  name: 'nchar';
  length: number;
};

export type VARCHAR = {
  name: 'varchar';
  length: number | 'MAX';
};

export type NVARCHAR = {
  name: 'nvarchar';
  length: number | 'MAX';
};

export type SYSNAME = {
  name: 'sysname';
};

export type TEXT = {
  name: 'text';
  length: number;
};

export type NTEXT = {
  name: 'ntext';
  length: number;
};

export type DATATIME = {
  name: 'datatime';
};

export type SMALLDATATIME = {
  name: 'smalldatatime';
};

export type BINARY = {
  name: 'binary';
  length: number;
};

export type VARBINARY = {
  name: 'varbinary';
  length: number;
};

export type IMAGE = {
  name: 'image';
};

export type BIT = {
  name: 'bit';
};

export type MssqlDbType =
  | SQL_VARIANT
  | INTEGER
  | INT
  | CHAR
  | VARCHAR
  | FLOAT
  | DECIMAL
  | BINARY
  | VARBINARY;

export function convert<T extends DbType>(
  type: T,
  expr: CompatibleExpression,
  styleId?: CompatibleExpression<number>
): Expression<TsTypeOf<T>> {
  let typeDesc = builtIn(dbTypeToRaw(type));
  if (styleId === undefined) {
    return func('CONVERT', true).invokeAsScalar(typeDesc, expr);
  } else {
    return func('CONVERT', true).invokeAsScalar(typeDesc, expr, styleId);
  }
}

export const format: (
  date: CompatibleExpression<Date>,
  format: CompatibleExpression<string>
) => Expression<string> = makeInvoke('scalar', 'FORMAT', true);

/**
 * 获取当前数据库名称
 */
export const db_name: () => Expression<string> = makeInvoke(
  'scalar',
  'db_name',
  true
);
/**
 * 获取当前架构名称
 */
export const schema_name: () => Expression<string> = makeInvoke(
  'scalar',
  'schema_name',
  true
);

/**
 * 系统重命名函数
 */
export const sp_rename: (
  name: string,
  newName: string,
  kind?: 'USERDATATYPE' | 'OBJECT' | 'COLUMN' | 'INDEX' | 'DATABASE'
) => Statement = makeExec('sp_rename', true);

export const sp_addextendedproperty: (
  name: string,
  value: string,
  level0Type: 'SCHEMA' | 'DATABASE',
  level0: string,
  level1Type?: 'TABLE' | 'PROCEDURE' | 'FUNCTION',
  level1?: string,
  level2Type?: 'CONSTRAINT' | 'COLUMN',
  level2?: string
) => Statement = makeExec(
  { name: 'sp_addextendedproperty', schema: 'sys' },
  false
);

export const sp_dropextendedproperty: (
  name: string,
  level0Type: 'SCHEMA' | 'DATABASE',
  level0: string,
  level1Type?: 'TABLE' | 'PROCEDURE' | 'FUNCTION',
  level1?: string,
  level2Type?: 'CONSTRAINT' | 'COLUMN',
  level2?: string
) => Statement = makeExec(
  { name: 'sp_addextendedproperty', schema: 'sys' },
  true
);

export const sp_updateextendedproperty: (
  name: string,
  value: string,
  level0Type: 'SCHEMA' | 'DATABASE',
  level0: string,
  level1Type?: 'TABLE' | 'PROCEDURE' | 'FUNCTION',
  level1?: string,
  level2Type?: 'CONSTRAINT' | 'COLUMN',
  level2?: string
) => Statement = makeExec(
  { name: 'sp_updateextendedproperty', schema: 'sys' },
  true
);
