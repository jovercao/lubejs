/**
 * 此文件和于存放标准库
 * 如数据类型、函数、系统变量、系统常量等
 */

import {
  Expression,
  CompatibleExpression,
  Star,
  StandardOperation,
} from "./ast";
import { Binary, DbType, TsTypeOf, Scalar } from "./types";

// export function convert<T extends DbType>(value: CompatibleExpression, toType: T): Expression<TsTypeOf<T>> {
//   return StandardOperation.create('CONVERT', [value, toType]);
// }

export function count(
  expr: Star | CompatibleExpression<Scalar>
): Expression<number> {
  return StandardOperation.create(count.name, [expr]);
}

export function avg(expr: CompatibleExpression<number>): Expression<number> {
  return StandardOperation.create(avg.name, [expr]);
}

export function sum(expr: CompatibleExpression<number>): Expression<number> {
  return StandardOperation.create(sum.name, [expr]);
}

export function max<T extends Exclude<Scalar, Binary>>(
  expr: Expression<T>
): Expression<T> {
  return StandardOperation.create(max.name, [expr]);
}

export function min<T extends Exclude<Scalar, Binary>>(
  expr: Expression<T>
): Expression<T> {
  return StandardOperation.create(min.name, [expr]);
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
  return StandardOperation.create(identityValue.name, [table, column]);
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
  return StandardOperation.create(convert.name, [expr, toType]);
}

/**
 * 获取当前日期及时间
 * @returns
 */
export function now(): Expression<Date> {
  return StandardOperation.create(now.name, []);
}

/**
 * 获取当前UTC时间
 * @returns
 */
export function utcNow(): Expression<Date> {
  return StandardOperation.create(utcNow.name, []);
}

/**
 * 切换时区
 */
export function switchTimezone(
  date: CompatibleExpression<Date>,
  offset: CompatibleExpression<string>
): Expression<Date> {
  return StandardOperation.create(switchTimezone.name, [date, offset]);
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
  return StandardOperation.create(formatDate.name, [date, format]);
}

/**
 * 获取日期中的年份
 * @param date
 * @returns
 */
export function yearOf(date: CompatibleExpression<Date>): Expression<number> {
  return StandardOperation.create(yearOf.name, [date]);
}

/**
 * 获取日期中的月份
 * @param date
 * @returns
 */
export function monthOf(date: CompatibleExpression<Date>): Expression<number> {
  return StandardOperation.create(monthOf.name, [date]);
}

/**
 * 获取日期中的日
 * @param date
 * @returns
 */
export function dayOf(date: CompatibleExpression<Date>): Expression<number> {
  return StandardOperation.create(dayOf.name, [date]);
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
  return StandardOperation.create(daysBetween.name, [start, end]);
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
  return StandardOperation.create(monthsBetween.name, [start, end]);
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
  return StandardOperation.create(yearsBetween.name, [start, end]);
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
  return StandardOperation.create(hoursBetween.name, [start, end]);
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
  return StandardOperation.create(minutesBetween.name, [start, end]);
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
  return StandardOperation.create(secondsBetween.name, [start, end]);
}

export function addDays(date: CompatibleExpression<Date>, days: CompatibleExpression<number>): Expression<Date> {
  return StandardOperation.create(addDays.name, [date, days]);
}

export function addMonths(date: CompatibleExpression<Date>, months: CompatibleExpression<number>): Expression<Date> {
  return StandardOperation.create(addMonths.name, [date, months]);
}

export function addYears(date: CompatibleExpression<Date>, years: CompatibleExpression<number>): Expression<Date> {
  return StandardOperation.create(addYears.name, [date, years]);
}

export function addHours(date: CompatibleExpression<Date>, hours: CompatibleExpression<number>): Expression<Date> {
  return StandardOperation.create(addHours.name, [date, hours]);
}

export function addMinutes(date: CompatibleExpression<Date>, minutes: CompatibleExpression<number>): Expression<Date> {
  return StandardOperation.create(addMinutes.name, [date, minutes]);
}

export function addSeconds(date: CompatibleExpression<Date>, seconds: CompatibleExpression<number>): Expression<Date> {
  return StandardOperation.create(addSeconds.name, [date, seconds]);
}

/**
 * 获取字符串长度
 * @param str
 * @returns
 */
export function strlen(str: CompatibleExpression<string>): Expression<number> {
  return StandardOperation.create(strlen.name, [str]);
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
  return StandardOperation.create(substr.name, [start, length]);
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
  return StandardOperation.create(replace.name, [str, search, to]);
}

/**
 * 删除字符串两侧空格
 * @param str
 * @returns
 */
export function trim(str: CompatibleExpression<string>): Expression<string> {
  return StandardOperation.create(trim.name, [str]);
}

/**
 * 删除字符串右侧空格
 * @param str
 * @returns
 */
export function rtrim(str: CompatibleExpression<string>): Expression<string> {
  return StandardOperation.create(rtrim.name, [str]);
}
/**
 * 转换成大写字母
 * @param str
 * @returns
 */
export function upper(str: CompatibleExpression<string>): Expression<string> {
  return StandardOperation.create(upper.name, [str]);
}

/**
 * 转换成小写字母
 * @param str
 * @returns
 */
export function lower(str: CompatibleExpression<string>): Expression<string> {
  return StandardOperation.create(lower.name, [str]);
}

/**
 * 查找一个
 * @param str
 * @param search
 * @returns
 */
export function indexof(
  str: CompatibleExpression<string>,
  search: CompatibleExpression<string>,
  startAt?: CompatibleExpression<number>
): Expression<number> {
  return StandardOperation.create(indexof.name, [str, search, startAt]);
}

/**
 * 获取一个字符的ascii码
 * @param str 字符编码
 * @returns
 */
export function ascii(str: CompatibleExpression<string>): Expression<number> {
  return StandardOperation.create(ascii.name, [str]);
}

export function charFromAscii(
  code: CompatibleExpression<number>
): Expression<string> {
  return StandardOperation.create(charFromAscii.name, [code]);
}

export function unicode(str: CompatibleExpression<string>): Expression<number> {
  return StandardOperation.create(unicode.name, [str]);
}

export function charFromUnicode(
  code: CompatibleExpression<number>
): Expression<string> {
  return StandardOperation.create(charFromUnicode.name, [code]);
}

/********************************************扩展 Expression.to方法**********************************************/
declare module lubejs {
  /**
   * 扩展方法实现
   */
  export interface Expression<T extends Scalar> {
    to<T extends DbType>(type: T): Expression<TsTypeOf<T>>;
  }
}

Object.defineProperty(Expression.prototype, "to", {
  writable: false,
  value<T extends DbType>(type: T): Expression<TsTypeOf<T>> {
    return convert(this, type);
  },
});

/******************************************************************************************/
