/**
 * 此文件和于存放标准库
 * 如数据类型、函数、系统变量、系统常量等
 */

import {
  Expression,
  CompatibleExpression,
  Star,
  StandardExpression,
  Statement,
  StandardStatement,
} from "./ast";
import { Binary, DbType, TsTypeOf, Scalar, Name } from "./types";

// export function convert<T extends DbType>(value: CompatibleExpression, toType: T): Expression<TsTypeOf<T>> {
//   return StandardOperation.create('CONVERT', [value, toType]);
// }

export function count(
  expr: Star | CompatibleExpression<Scalar>
): Expression<number> {
  return StandardExpression.create(count.name, [expr]);
}

export function avg(expr: CompatibleExpression<number>): Expression<number> {
  return StandardExpression.create(avg.name, [expr]);
}

export function sum(expr: CompatibleExpression<number>): Expression<number> {
  return StandardExpression.create(sum.name, [expr]);
}

export function max<T extends Exclude<Scalar, Binary>>(
  expr: Expression<T>
): Expression<T> {
  return StandardExpression.create(max.name, [expr]);
}

export function min<T extends Exclude<Scalar, Binary>>(
  expr: Expression<T>
): Expression<T> {
  return StandardExpression.create(min.name, [expr]);
}

/**
 * 获取标识列的最近插入值
 * @param table
 * @param column
 * @returns
 */
export function identityValue(
  table: CompatibleExpression<string>,
  column: CompatibleExpression<string>
): Expression<number> {
  return StandardExpression.create(identityValue.name, [table, column]);
}

/**
 * 转换数据类型
 * @param expr
 * @param toType
 * @returns
 */
export function convert<T extends DbType>(
  expr: CompatibleExpression,
  toType: T
): Expression<TsTypeOf<T>> {
  return StandardExpression.create(convert.name, [expr, toType]);
}

/**
 * 获取当前日期及时间
 * @returns
 */
export function now(): Expression<Date> {
  return StandardExpression.create(now.name, []);
}

/**
 * 获取当前UTC时间
 * @returns
 */
export function utcNow(): Expression<Date> {
  return StandardExpression.create(utcNow.name, []);
}

/**
 * 切换时区
 */
export function switchTimezone(
  date: CompatibleExpression<Date>,
  offset: CompatibleExpression<string>
): Expression<Date> {
  return StandardExpression.create(switchTimezone.name, [date, offset]);
}

/**
 * 格式化日期函数
 * @param date
 * @param format
 * @returns
 */
export function formatDate(
  date: CompatibleExpression<Date>,
  format: string
): Expression<string> {
  return StandardExpression.create(formatDate.name, [date, format]);
}

/**
 * 获取日期中的年份
 * @param date
 * @returns
 */
export function yearOf(date: CompatibleExpression<Date>): Expression<number> {
  return StandardExpression.create(yearOf.name, [date]);
}

/**
 * 获取日期中的月份
 * @param date
 * @returns
 */
export function monthOf(date: CompatibleExpression<Date>): Expression<number> {
  return StandardExpression.create(monthOf.name, [date]);
}

/**
 * 获取日期中的日
 * @param date
 * @returns
 */
export function dayOf(date: CompatibleExpression<Date>): Expression<number> {
  return StandardExpression.create(dayOf.name, [date]);
}

/**
 * 计算两个日期之间的天数，小数
 * @param start
 * @param end
 * @returns
 */
export function daysBetween(
  start: CompatibleExpression<Date>,
  end: CompatibleExpression<Date>
): Expression<number> {
  return StandardExpression.create(daysBetween.name, [start, end]);
}

/**
 * 计算两个日期之间的天数，小数
 * @param start
 * @param end
 * @returns
 */
export function monthsBetween(
  start: CompatibleExpression<Date>,
  end: CompatibleExpression<Date>
): Expression<number> {
  return StandardExpression.create(monthsBetween.name, [start, end]);
}

/**
 * 计算两个日期之间的天数，小数
 * @param start
 * @param end
 * @returns
 */
export function yearsBetween(
  start: CompatibleExpression<Date>,
  end: CompatibleExpression<Date>
): Expression<number> {
  return StandardExpression.create(yearsBetween.name, [start, end]);
}

/**
 * 计算两个日期之间的天数，小数
 * @param start
 * @param end
 * @returns
 */
export function hoursBetween(
  start: CompatibleExpression<Date>,
  end: CompatibleExpression<Date>
): Expression<number> {
  return StandardExpression.create(hoursBetween.name, [start, end]);
}

/**
 * 计算两个日期之间的天数，小数
 * @param start
 * @param end
 * @returns
 */
export function minutesBetween(
  start: CompatibleExpression<Date>,
  end: CompatibleExpression<Date>
): Expression<number> {
  return StandardExpression.create(minutesBetween.name, [start, end]);
}

/**
 * 计算两个日期之间的天数，小数
 * @param start
 * @param end
 * @returns
 */
export function secondsBetween(
  start: CompatibleExpression<Date>,
  end: CompatibleExpression<Date>
): Expression<number> {
  return StandardExpression.create(secondsBetween.name, [start, end]);
}

export function addDays(
  date: CompatibleExpression<Date>,
  days: CompatibleExpression<number>
): Expression<Date> {
  return StandardExpression.create(addDays.name, [date, days]);
}

export function addMonths(
  date: CompatibleExpression<Date>,
  months: CompatibleExpression<number>
): Expression<Date> {
  return StandardExpression.create(addMonths.name, [date, months]);
}

export function addYears(
  date: CompatibleExpression<Date>,
  years: CompatibleExpression<number>
): Expression<Date> {
  return StandardExpression.create(addYears.name, [date, years]);
}

export function addHours(
  date: CompatibleExpression<Date>,
  hours: CompatibleExpression<number>
): Expression<Date> {
  return StandardExpression.create(addHours.name, [date, hours]);
}

export function addMinutes(
  date: CompatibleExpression<Date>,
  minutes: CompatibleExpression<number>
): Expression<Date> {
  return StandardExpression.create(addMinutes.name, [date, minutes]);
}

export function addSeconds(
  date: CompatibleExpression<Date>,
  seconds: CompatibleExpression<number>
): Expression<Date> {
  return StandardExpression.create(addSeconds.name, [date, seconds]);
}

/**
 * 获取字符串长度
 * @param str
 * @returns
 */
export function strlen(str: CompatibleExpression<string>): Expression<number> {
  return StandardExpression.create(strlen.name, [str]);
}

/**
 * 截取字符串
 * @param str
 * @param start
 * @param length
 * @returns
 */
export function substr(
  str: CompatibleExpression<string>,
  start: CompatibleExpression<number>,
  length: CompatibleExpression<number>
): Expression<string> {
  return StandardExpression.create(substr.name, [start, length]);
}

/**
 * 替换字符串
 * @param str 需要被替换的字符串
 * @param search 查找字符串
 * @param to 替换成字符串
 * @param global 是否全局替换，默认为false
 * @returns
 */
export function replace(
  str: CompatibleExpression<string>,
  search: CompatibleExpression<string>,
  to: CompatibleExpression<string>
): Expression<string> {
  return StandardExpression.create(replace.name, [str, search, to]);
}

/**
 * 删除字符串两侧空格
 * @param str
 * @returns
 */
export function trim(str: CompatibleExpression<string>): Expression<string> {
  return StandardExpression.create(trim.name, [str]);
}

/**
 * 删除字符串右侧空格
 * @param str
 * @returns
 */
export function trimEnd(str: CompatibleExpression<string>): Expression<string> {
  return StandardExpression.create(trimEnd.name, [str]);
}
/**
 * 转换成大写字母
 * @param str
 * @returns
 */
export function upper(str: CompatibleExpression<string>): Expression<string> {
  return StandardExpression.create(upper.name, [str]);
}

/**
 * 转换成小写字母
 * @param str
 * @returns
 */
export function lower(str: CompatibleExpression<string>): Expression<string> {
  return StandardExpression.create(lower.name, [str]);
}

/**
 * 查找一个
 * @param str
 * @param search
 * @returns
 */
export function strpos(
  str: CompatibleExpression<string>,
  search: CompatibleExpression<string>,
  startAt?: CompatibleExpression<number>
): Expression<number> {
  return StandardExpression.create(strpos.name, [str, search, startAt]);
}

/**
 * 获取一个字符的ascii码
 * @param str 字符编码
 * @returns
 */
export function ascii(str: CompatibleExpression<string>): Expression<number> {
  return StandardExpression.create(ascii.name, [str]);
}

export function asciiChar(
  code: CompatibleExpression<number>
): Expression<string> {
  return StandardExpression.create(asciiChar.name, [code]);
}

export function unicode(str: CompatibleExpression<string>): Expression<number> {
  return StandardExpression.create(unicode.name, [str]);
}

export function unicodeChar(
  code: CompatibleExpression<number>
): Expression<string> {
  return StandardExpression.create(unicodeChar.name, [code]);
}

export function isNull<T extends Scalar>(
  value: CompatibleExpression<T>,
  defaultValue: CompatibleExpression<T>
): Expression<T> {
  return StandardExpression.create(isNull.name, [value, defaultValue]);
}

export function abs(value: CompatibleExpression<number>): Expression<number> {
  return StandardExpression.create(abs.name, [value]);
}

export function exp(value: CompatibleExpression<number>): Expression<number> {
  return StandardExpression.create(exp.name, [value]);
}

// export function cbrt(value: CompatibleExpression<number>): Expression<number> {
//   return StandardExpression.create(cbrt.name, [value]);
// }

export function ceil(value: CompatibleExpression<number>): Expression<number> {
  return StandardExpression.create(ceil.name, [value]);
}

export function floor(value: CompatibleExpression<number>): Expression<number> {
  return StandardExpression.create(floor.name, [value]);
}

export function ln(value: CompatibleExpression<number>): Expression<number> {
  return StandardExpression.create(ln.name, [value]);
}

export function log(
  value: CompatibleExpression<number>
): Expression<number> {
  return StandardExpression.create(log.name, [value]);
}

export function mod(
  value: CompatibleExpression<number>,
  x: CompatibleExpression<number>
): Expression<number> {
  return StandardExpression.create(mod.name, [value, x]);
}

export function pi(): Expression<number> {
  return StandardExpression.create(pi.name, []);
}

export function power(
  a: CompatibleExpression<number>,
  b: CompatibleExpression<number>
): Expression<number> {
  return StandardExpression.create(power.name, [a, b]);
}

export function radians(
  value: CompatibleExpression<number>
): Expression<number> {
  return StandardExpression.create(radians.name, [value]);
}

export function degrees(
  value: CompatibleExpression<number>
): Expression<number> {
  return StandardExpression.create(degrees.name, [value]);
}

export function random(): Expression<number> {
  return StandardExpression.create(random.name, []);
}

export function round(
  value: CompatibleExpression<number>,
  s?: CompatibleExpression<number>
): Expression<number> {
  return StandardExpression.create(round.name, [value, s]);
}

export function sign(value: CompatibleExpression<number>): Expression<number> {
  return StandardExpression.create(sign.name, [value]);
}

export function sqrt(value: CompatibleExpression<number>): Expression<number> {
  return StandardExpression.create(sqrt.name, [value]);
}

// export function trunc(
//   value: CompatibleExpression<number>,
//   s?: CompatibleExpression<number>
// ): Expression<number> {
//   return StandardExpression.create(trunc.name, [value, s]);
// }

export function cos(value: CompatibleExpression<number>): Expression<number> {
  return StandardExpression.create(cos.name, [value]);
}

export function sin(value: CompatibleExpression<number>): Expression<number> {
  return StandardExpression.create(sin.name, [value]);
}

export function tan(value: CompatibleExpression<number>): Expression<number> {
  return StandardExpression.create(tan.name, [value]);
}

export function acos(value: CompatibleExpression<number>): Expression<number> {
  return StandardExpression.create(acos.name, [value]);
}

export function asin(value: CompatibleExpression<number>): Expression<number> {
  return StandardExpression.create(asin.name, [value]);
}

export function atan(value: CompatibleExpression<number>): Expression<number> {
  return StandardExpression.create(atan.name, [value]);
}

export function atan2(value: CompatibleExpression<number>): Expression<number> {
  return StandardExpression.create(atan2.name, [value]);
}

export function cot(value: CompatibleExpression<number>): Expression<number> {
  return StandardExpression.create(cot.name, [value]);
}

export function renameTable(name: Name, newName: string): Statement {
  return StandardStatement.create(renameTable.name, [name, newName]);
}

export function renameColumn(table: Name, name: string, newName: string): Statement {
  return StandardStatement.create(renameColumn.name, [table, name, newName]);
}

export function renameView(name: Name, newName: string): Statement {
  return StandardStatement.create(renameView.name, [name, newName]);
}

export function renameIndex(name: Name, newName: string): Statement {
  return StandardStatement.create(renameIndex.name, [name, newName]);
}

export function renameProcedure(name: Name, newName: string): Statement {
  return StandardStatement.create(renameProcedure.name, [name, newName]);
}

export function renameFunction(name: Name, newName: string): Statement {
  return StandardStatement.create(renameFunction.name, [name, newName]);
}

export interface Standard {
  count(expr: Star<any> | CompatibleExpression<Scalar>): Expression<number>;
  min<T extends string | number | bigint | boolean | Date>(
    expr: Expression<T>
  ): Expression<T>;
  max<T extends string | number | bigint | boolean | Date>(
    expr: Expression<T>
  ): Expression<T>;
  sum(expr: CompatibleExpression<number>): Expression<number>;
  avg(expr: CompatibleExpression<number>): Expression<number>;
  identityValue(
    table: CompatibleExpression<string>,
    column: CompatibleExpression<string>
  ): Expression<number>;
  convert<T extends DbType>(
    expr: CompatibleExpression<Scalar>,
    toType: T
  ): Expression<TsTypeOf<T>>;
  now(): Expression<Date>;
  utcNow(): Expression<Date>;
  switchTimezone(
    date: CompatibleExpression<Date>,
    offset: CompatibleExpression<string>
  ): Expression<Date>;
  formatDate(
    date: CompatibleExpression<Date>,
    format: string
  ): Expression<string>;
  yearOf(date: CompatibleExpression<Date>): Expression<number>;
  monthOf(date: CompatibleExpression<Date>): Expression<number>;
  dayOf(date: CompatibleExpression<Date>): Expression<number>;
  daysBetween(
    start: CompatibleExpression<Date>,
    end: CompatibleExpression<Date>
  ): Expression<number>;
  monthsBetween(
    start: CompatibleExpression<Date>,
    end: CompatibleExpression<Date>
  ): Expression<number>;
  yearsBetween(
    start: CompatibleExpression<Date>,
    end: CompatibleExpression<Date>
  ): Expression<number>;
  hoursBetween(
    start: CompatibleExpression<Date>,
    end: CompatibleExpression<Date>
  ): Expression<number>;
  minutesBetween(
    start: CompatibleExpression<Date>,
    end: CompatibleExpression<Date>
  ): Expression<number>;
  secondsBetween(
    start: CompatibleExpression<Date>,
    end: CompatibleExpression<Date>
  ): Expression<number>;
  addDays(
    date: CompatibleExpression<Date>,
    days: CompatibleExpression<number>
  ): Expression<Date>;
  addMonths(
    date: CompatibleExpression<Date>,
    months: CompatibleExpression<number>
  ): Expression<Date>;
  addYears(
    date: CompatibleExpression<Date>,
    years: CompatibleExpression<number>
  ): Expression<Date>;
  addHours(
    date: CompatibleExpression<Date>,
    hours: CompatibleExpression<number>
  ): Expression<Date>;
  addMinutes(
    date: CompatibleExpression<Date>,
    minutes: CompatibleExpression<number>
  ): Expression<Date>;
  addSeconds(
    date: CompatibleExpression<Date>,
    seconds: CompatibleExpression<number>
  ): Expression<Date>;
  strlen(str: CompatibleExpression<string>): Expression<number>;
  substr(
    str: CompatibleExpression<string>,
    start: CompatibleExpression<number>,
    length: CompatibleExpression<number>
  ): Expression<string>;
  replace(
    str: CompatibleExpression<string>,
    search: CompatibleExpression<string>,
    to: CompatibleExpression<string>
  ): Expression<string>;
  trim(str: CompatibleExpression<string>): Expression<string>;
  trimEnd(str: CompatibleExpression<string>): Expression<string>;
  lower(str: CompatibleExpression<string>): Expression<string>;
  strpos(
    str: CompatibleExpression<string>,
    search: CompatibleExpression<string>,
    startAt?: CompatibleExpression<number>
  ): Expression<number>;
  ascii(str: CompatibleExpression<string>): Expression<number>;
  asciiChar(code: CompatibleExpression<number>): Expression<string>;
  unicode(str: CompatibleExpression<string>): Expression<number>;
  unicodeChar(code: CompatibleExpression<number>): Expression<string>;
  isNull<T extends Scalar>(
    value: CompatibleExpression<T>,
    defaultValue: CompatibleExpression<T>
  ): Expression<T>;

  abs(value: CompatibleExpression<number>): Expression<number>;

  exp(value: CompatibleExpression<number>): Expression<number>;

  // cbrt(value: CompatibleExpression<number>): Expression<number>;

  ceil(value: CompatibleExpression<number>): Expression<number>;

  floor(value: CompatibleExpression<number>): Expression<number>;

  ln(value: CompatibleExpression<number>): Expression<number>;

  log(
    value: CompatibleExpression<number>
  ): Expression<number>;

  mod(
    value: CompatibleExpression<number>,
    x: CompatibleExpression<number>
  ): Expression<number>;

  pi(): Expression<number>;

  power(
    a: CompatibleExpression<number>,
    b: CompatibleExpression<number>
  ): Expression<number>;

  radians(value: CompatibleExpression<number>): Expression<number>;

  degrees(value: CompatibleExpression<number>): Expression<number>;

  random(): Expression<number>;

  round(
    value: CompatibleExpression<number>,
    s?: CompatibleExpression<number>
  ): Expression<number>;

  sign(value: CompatibleExpression<number>): Expression<number>;

  sqrt(value: CompatibleExpression<number>): Expression<number>;

  // trunc(
  //   value: CompatibleExpression<number>,
  //   s?: CompatibleExpression<number>
  // ): Expression<number>;

  cos(value: CompatibleExpression<number>): Expression<number>;

  sin(value: CompatibleExpression<number>): Expression<number>;

  tan(value: CompatibleExpression<number>): Expression<number>;

  acos(value: CompatibleExpression<number>): Expression<number>;

  asin(value: CompatibleExpression<number>): Expression<number>;

  atan(value: CompatibleExpression<number>): Expression<number>;

  atan2(value: CompatibleExpression<number>): Expression<number>;

  cot(value: CompatibleExpression<number>): Expression<number>;

  renameTable(name: Name, newName: string): Statement;

  renameColumn(table: Name, name: string, newName: string): Statement;

  renameView(name: Name, newName: string): Statement;

  renameIndex(table: Name, name: string, newName: string): Statement;

  renameProcedure(name: Name, newName: string): Statement;

  renameFunction(name: Name, newName: string): Statement;

  commentTable(name: Name, comment: string): Statement;

  commentColumn(table: Name, column: string, comment: string): Statement;

  commentIndex(table: Name, name: string, comment: string): Statement;

  commentConstraint(table: Name, name: string, comment: string): Statement;

  commentSchema(name: string, comment: string): Statement;

  commentSequence(name: Name, comment: string): Statement;

  commentProcedure(name: Name, comment: string): Statement;

  commentFunction(name: Name, comment: string): Statement;
}

/********************************************扩展 Expression.to方法**********************************************/
// declare module lubejs {
//   /**
//    * 扩展方法实现
//    */
//   export interface Expression<T extends Scalar> {
//     to<T extends DbType>(type: T): Expression<TsTypeOf<T>>;
//   }
// }

// Object.defineProperty(Expression.prototype, "to", {
//   writable: false,
//   value<T extends DbType>(type: T): Expression<TsTypeOf<T>> {
//     return convert(this, type);
//   },
// });

/******************************************************************************************/
