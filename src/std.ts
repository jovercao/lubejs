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
} from './ast';
import { Binary, DbType, TsTypeOf, Scalar, Name } from './types';

// export function convert<T extends DbType>(value: CompatibleExpression, toType: T): Expression<TsTypeOf<T>> {
//   return StandardOperation.create('CONVERT', [value, toType]);
// }

// export interface Standard {
//   count(expr: Star<any> | CompatibleExpression<Scalar>): Expression<number>;
//   min<T extends string | number | bigint | boolean | Date>(
//     expr: Expression<T>
//   ): Expression<T>;
//   max<T extends string | number | bigint | boolean | Date>(
//     expr: Expression<T>
//   ): Expression<T>;
//   sum(expr: CompatibleExpression<number>): Expression<number>;
//   avg(expr: CompatibleExpression<number>): Expression<number>;
//   identityValue(
//     table: CompatibleExpression<string>,
//     column: CompatibleExpression<string>
//   ): Expression<number>;
//   convert<T extends DbType>(
//     expr: CompatibleExpression<Scalar>,
//     toType: T
//   ): Expression<TsTypeOf<T>>;
//   now(): Expression<Date>;
//   utcNow(): Expression<Date>;
//   switchTimezone(
//     date: CompatibleExpression<Date>,
//     offset: CompatibleExpression<string>
//   ): Expression<Date>;
//   formatDate(
//     date: CompatibleExpression<Date>,
//     format: string
//   ): Expression<string>;
//   yearOf(date: CompatibleExpression<Date>): Expression<number>;
//   monthOf(date: CompatibleExpression<Date>): Expression<number>;
//   dayOf(date: CompatibleExpression<Date>): Expression<number>;
//   daysBetween(
//     start: CompatibleExpression<Date>,
//     end: CompatibleExpression<Date>
//   ): Expression<number>;
//   monthsBetween(
//     start: CompatibleExpression<Date>,
//     end: CompatibleExpression<Date>
//   ): Expression<number>;
//   yearsBetween(
//     start: CompatibleExpression<Date>,
//     end: CompatibleExpression<Date>
//   ): Expression<number>;
//   hoursBetween(
//     start: CompatibleExpression<Date>,
//     end: CompatibleExpression<Date>
//   ): Expression<number>;
//   minutesBetween(
//     start: CompatibleExpression<Date>,
//     end: CompatibleExpression<Date>
//   ): Expression<number>;
//   secondsBetween(
//     start: CompatibleExpression<Date>,
//     end: CompatibleExpression<Date>
//   ): Expression<number>;
//   addDays(
//     date: CompatibleExpression<Date>,
//     days: CompatibleExpression<number>
//   ): Expression<Date>;
//   addMonths(
//     date: CompatibleExpression<Date>,
//     months: CompatibleExpression<number>
//   ): Expression<Date>;
//   addYears(
//     date: CompatibleExpression<Date>,
//     years: CompatibleExpression<number>
//   ): Expression<Date>;
//   addHours(
//     date: CompatibleExpression<Date>,
//     hours: CompatibleExpression<number>
//   ): Expression<Date>;
//   addMinutes(
//     date: CompatibleExpression<Date>,
//     minutes: CompatibleExpression<number>
//   ): Expression<Date>;
//   addSeconds(
//     date: CompatibleExpression<Date>,
//     seconds: CompatibleExpression<number>
//   ): Expression<Date>;
//   strlen(str: CompatibleExpression<string>): Expression<number>;
//   substr(
//     str: CompatibleExpression<string>,
//     start: CompatibleExpression<number>,
//     length: CompatibleExpression<number>
//   ): Expression<string>;
//   replace(
//     str: CompatibleExpression<string>,
//     search: CompatibleExpression<string>,
//     to: CompatibleExpression<string>
//   ): Expression<string>;
//   trim(str: CompatibleExpression<string>): Expression<string>;
//   trimEnd(str: CompatibleExpression<string>): Expression<string>;
//   lower(str: CompatibleExpression<string>): Expression<string>;
//   upper(str: CompatibleExpression<string>): Expression<string>;
//   strpos(
//     str: CompatibleExpression<string>,
//     search: CompatibleExpression<string>,
//     startAt?: CompatibleExpression<number>
//   ): Expression<number>;
//   ascii(str: CompatibleExpression<string>): Expression<number>;
//   asciiChar(code: CompatibleExpression<number>): Expression<string>;
//   unicode(str: CompatibleExpression<string>): Expression<number>;
//   unicodeChar(code: CompatibleExpression<number>): Expression<string>;
//   isNull<T extends Scalar>(
//     value: CompatibleExpression<T>,
//     defaultValue: CompatibleExpression<T>
//   ): Expression<T>;

//   abs(value: CompatibleExpression<number>): Expression<number>;

//   exp(value: CompatibleExpression<number>): Expression<number>;

//   // cbrt(value: CompatibleExpression<number>): Expression<number>;

//   ceil(value: CompatibleExpression<number>): Expression<number>;

//   floor(value: CompatibleExpression<number>): Expression<number>;

//   ln(value: CompatibleExpression<number>): Expression<number>;

//   log(
//     value: CompatibleExpression<number>
//   ): Expression<number>;

//   mod(
//     value: CompatibleExpression<number>,
//     x: CompatibleExpression<number>
//   ): Expression<number>;

//   pi(): Expression<number>;

//   power(
//     a: CompatibleExpression<number>,
//     b: CompatibleExpression<number>
//   ): Expression<number>;

//   radians(value: CompatibleExpression<number>): Expression<number>;

//   degrees(value: CompatibleExpression<number>): Expression<number>;

//   random(): Expression<number>;

//   round(
//     value: CompatibleExpression<number>,
//     s?: CompatibleExpression<number>
//   ): Expression<number>;

//   sign(value: CompatibleExpression<number>): Expression<number>;

//   sqrt(value: CompatibleExpression<number>): Expression<number>;

//   // trunc(
//   //   value: CompatibleExpression<number>,
//   //   s?: CompatibleExpression<number>
//   // ): Expression<number>;

//   cos(value: CompatibleExpression<number>): Expression<number>;

//   sin(value: CompatibleExpression<number>): Expression<number>;

//   tan(value: CompatibleExpression<number>): Expression<number>;

//   acos(value: CompatibleExpression<number>): Expression<number>;

//   asin(value: CompatibleExpression<number>): Expression<number>;

//   atan(value: CompatibleExpression<number>): Expression<number>;

//   atan2(value: CompatibleExpression<number>): Expression<number>;

//   cot(value: CompatibleExpression<number>): Expression<number>;

//   renameTable(name: Name, newName: string): Statement;

//   renameColumn(table: Name, name: string, newName: string): Statement;

//   renameView(name: Name, newName: string): Statement;

//   renameIndex(table: Name, name: string, newName: string): Statement;

//   renameProcedure(name: Name, newName: string): Statement;

//   renameFunction(name: Name, newName: string): Statement;

//   commentTable(name: Name, comment: string): Statement;

//   commentColumn(table: Name, column: string, comment: string): Statement;

//   commentIndex(table: Name, name: string, comment: string): Statement;

//   commentConstraint(table: Name, name: string, comment: string): Statement;

//   commentSchema(name: string, comment: string): Statement;

//   commentSequence(name: Name, comment: string): Statement;

//   commentProcedure(name: Name, comment: string): Statement;

//   commentFunction(name: Name, comment: string): Statement;
// }

export interface Standard {
  count(expr: Star | CompatibleExpression<Scalar>): Expression<number>;
  avg(expr: CompatibleExpression<number>): Expression<number>;
  sum(expr: CompatibleExpression<number>): Expression<number>;
  max<T extends Exclude<Scalar, Binary>>(expr: Expression<T>): Expression<T>;
  min<T extends Exclude<Scalar, Binary>>(expr: Expression<T>): Expression<T>;
  /**
   * 获取标识列的最近插入值
   * @param table
   * @param column
   * @returns
   */
  identityValue(
    table: CompatibleExpression<string>,
    column: CompatibleExpression<string>
  ): Expression<number>;
  /**
   * 转换数据类型
   * @param expr
   * @param toType
   * @returns
   */
  convert<T extends DbType>(
    expr: CompatibleExpression,
    toType: T
  ): Expression<TsTypeOf<T>>;
  /**
   * 获取当前日期及时间
   * @returns
   */
  now(): Expression<Date>;
  /**
   * 获取当前UTC时间
   * @returns
   */
  utcNow(): Expression<Date>;
  /**
   * 切换时区
   */
  switchTimezone(
    date: CompatibleExpression<Date>,
    offset: CompatibleExpression<string>
  ): Expression<Date>;
  /**
   * 格式化日期函数
   * @param date
   * @param format
   * @returns
   */
  formatDate(
    date: CompatibleExpression<Date>,
    format: string
  ): Expression<string>;
  /**
   * 获取日期中的年份
   * @param date
   * @returns
   */
  yearOf(date: CompatibleExpression<Date>): Expression<number>;
  /**
   * 获取日期中的月份
   * @param date
   * @returns
   */
  monthOf(date: CompatibleExpression<Date>): Expression<number>;
  /**
   * 获取日期中的日
   * @param date
   * @returns
   */
  dayOf(date: CompatibleExpression<Date>): Expression<number>;
  /**
   * 计算两个日期之间的天数，小数
   * @param start
   * @param end
   * @returns
   */
  daysBetween(
    start: CompatibleExpression<Date>,
    end: CompatibleExpression<Date>
  ): Expression<number>;
  /**
   * 计算两个日期之间的天数，小数
   * @param start
   * @param end
   * @returns
   */
  monthsBetween(
    start: CompatibleExpression<Date>,
    end: CompatibleExpression<Date>
  ): Expression<number>;
  /**
   * 计算两个日期之间的天数，小数
   * @param start
   * @param end
   * @returns
   */
  yearsBetween(
    start: CompatibleExpression<Date>,
    end: CompatibleExpression<Date>
  ): Expression<number>;
  /**
   * 计算两个日期之间的天数，小数
   * @param start
   * @param end
   * @returns
   */
  hoursBetween(
    start: CompatibleExpression<Date>,
    end: CompatibleExpression<Date>
  ): Expression<number>;
  /**
   * 计算两个日期之间的天数，小数
   * @param start
   * @param end
   * @returns
   */
  minutesBetween(
    start: CompatibleExpression<Date>,
    end: CompatibleExpression<Date>
  ): Expression<number>;
  /**
   * 计算两个日期之间的天数，小数
   * @param start
   * @param end
   * @returns
   */
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
  /**
   * 获取字符串长度
   * @param str
   * @returns
   */
  strlen(str: CompatibleExpression<string>): Expression<number>;
  /**
   * 截取字符串
   * @param str
   * @param start
   * @param length
   * @returns
   */
  substr(
    str: CompatibleExpression<string>,
    start: CompatibleExpression<number>,
    length: CompatibleExpression<number>
  ): Expression<string>;
  /**
   * 替换字符串
   * @param str 需要被替换的字符串
   * @param search 查找字符串
   * @param to 替换成字符串
   * @param global 是否全局替换，默认为false
   * @returns
   */
  replace(
    str: CompatibleExpression<string>,
    search: CompatibleExpression<string>,
    to: CompatibleExpression<string>
  ): Expression<string>;
  /**
   * 删除字符串两侧空格
   * @param str
   * @returns
   */
  trim(str: CompatibleExpression<string>): Expression<string>;
  /**
   * 删除字符串右侧空格
   * @param str
   * @returns
   */
  trimEnd(str: CompatibleExpression<string>): Expression<string>
  /**
   * 转换成大写字母
   * @param str
   * @returns
   */;
  upper(str: CompatibleExpression<string>): Expression<string>;
  /**
   * 转换成小写字母
   * @param str
   * @returns
   */
  lower(str: CompatibleExpression<string>): Expression<string>;
  /**
   * 查找一个
   * @param str
   * @param search
   * @returns
   */
  strpos(
    str: CompatibleExpression<string>,
    search: CompatibleExpression<string>,
    startAt?: CompatibleExpression<number>
  ): Expression<number>;
  /**
   * 获取一个字符的ascii码
   * @param str 字符编码
   * @returns
   */
  ascii(str: CompatibleExpression<string>): Expression<number>;
  asciiChar(code: CompatibleExpression<number>): Expression<string>;
  unicode(str: CompatibleExpression<string>): Expression<number>;
  unicodeChar(code: CompatibleExpression<number>): Expression<string>;
  nvl<T extends Scalar>(
    value: CompatibleExpression<T>,
    defaultValue: CompatibleExpression<T>
  ): Expression<T>;
  abs(value: CompatibleExpression<number>): Expression<number>;
  exp(value: CompatibleExpression<number>): Expression<number>;
  ceil(value: CompatibleExpression<number>): Expression<number>;
  floor(value: CompatibleExpression<number>): Expression<number>;
  ln(value: CompatibleExpression<number>): Expression<number>;
  log(value: CompatibleExpression<number>): Expression<number>;
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
  renameIndex(table: Name, name: string, newName: string): Statement
  renameProcedure(name: Name, newName: string): Statement;
  renameFunction(name: Name, newName: string): Statement;
  commentTable(name: Name, comment: string): Statement;
  commentColumn(table: Name, name: string, comment: string): Statement;
  commentIndex(table: Name, name: string, comment: string): Statement;
  commentConstraint(table: Name, name: string, comment: string): Statement;
  commentSchema(name: string, comment: string): Statement;
  commentSequence(name: Name, comment: string): Statement;
  commentProcedure(name: Name, comment: string): Statement;
  commentFunction(name: Name, comment: string): Statement;
}

export const Standard: Standard = {
  count(expr: Star | CompatibleExpression<Scalar>): Expression<number> {
    return StandardExpression.create(Standard.count.name, [expr]);
  },
  avg(expr: CompatibleExpression<number>): Expression<number> {
    return StandardExpression.create(Standard.avg.name, [expr]);
  },
  sum(expr: CompatibleExpression<number>): Expression<number> {
    return StandardExpression.create(Standard.sum.name, [expr]);
  },
  max<T extends Exclude<Scalar, Binary>>(expr: Expression<T>): Expression<T> {
    return StandardExpression.create(Standard.max.name, [expr]);
  },
  min<T extends Exclude<Scalar, Binary>>(expr: Expression<T>): Expression<T> {
    return StandardExpression.create(Standard.min.name, [expr]);
  },
  /**
   * 获取标识列的最近插入值
   * @param table
   * @param column
   * @returns
   */
  identityValue(
    table: CompatibleExpression<string>,
    column: CompatibleExpression<string>
  ): Expression<number> {
    return StandardExpression.create(Standard.identityValue.name, [
      table,
      column,
    ]);
  },
  /**
   * 转换数据类型
   * @param expr
   * @param toType
   * @returns
   */
  convert<T extends DbType>(
    expr: CompatibleExpression,
    toType: T
  ): Expression<TsTypeOf<T>> {
    return StandardExpression.create(Standard.convert.name, [expr, toType]);
  },
  /**
   * 获取当前日期及时间
   * @returns
   */
  now(): Expression<Date> {
    return StandardExpression.create(Standard.now.name, []);
  },
  /**
   * 获取当前UTC时间
   * @returns
   */
  utcNow(): Expression<Date> {
    return StandardExpression.create(Standard.utcNow.name, []);
  },
  /**
   * 切换时区
   */
  switchTimezone(
    date: CompatibleExpression<Date>,
    offset: CompatibleExpression<string>
  ): Expression<Date> {
    return StandardExpression.create(Standard.switchTimezone.name, [
      date,
      offset,
    ]);
  },
  /**
   * 格式化日期函数
   * @param date
   * @param format
   * @returns
   */
  formatDate(
    date: CompatibleExpression<Date>,
    format: string
  ): Expression<string> {
    return StandardExpression.create(Standard.formatDate.name, [date, format]);
  },
  /**
   * 获取日期中的年份
   * @param date
   * @returns
   */
  yearOf(date: CompatibleExpression<Date>): Expression<number> {
    return StandardExpression.create(Standard.yearOf.name, [date]);
  },
  /**
   * 获取日期中的月份
   * @param date
   * @returns
   */
  monthOf(date: CompatibleExpression<Date>): Expression<number> {
    return StandardExpression.create(Standard.monthOf.name, [date]);
  },
  /**
   * 获取日期中的日
   * @param date
   * @returns
   */
  dayOf(date: CompatibleExpression<Date>): Expression<number> {
    return StandardExpression.create(Standard.dayOf.name, [date]);
  },
  /**
   * 计算两个日期之间的天数，小数
   * @param start
   * @param end
   * @returns
   */
  daysBetween(
    start: CompatibleExpression<Date>,
    end: CompatibleExpression<Date>
  ): Expression<number> {
    return StandardExpression.create(Standard.daysBetween.name, [start, end]);
  },
  /**
   * 计算两个日期之间的天数，小数
   * @param start
   * @param end
   * @returns
   */
  monthsBetween(
    start: CompatibleExpression<Date>,
    end: CompatibleExpression<Date>
  ): Expression<number> {
    return StandardExpression.create(Standard.monthsBetween.name, [start, end]);
  },
  /**
   * 计算两个日期之间的天数，小数
   * @param start
   * @param end
   * @returns
   */
  yearsBetween(
    start: CompatibleExpression<Date>,
    end: CompatibleExpression<Date>
  ): Expression<number> {
    return StandardExpression.create(Standard.yearsBetween.name, [start, end]);
  },
  /**
   * 计算两个日期之间的天数，小数
   * @param start
   * @param end
   * @returns
   */
  hoursBetween(
    start: CompatibleExpression<Date>,
    end: CompatibleExpression<Date>
  ): Expression<number> {
    return StandardExpression.create(Standard.hoursBetween.name, [start, end]);
  },
  /**
   * 计算两个日期之间的天数，小数
   * @param start
   * @param end
   * @returns
   */
  minutesBetween(
    start: CompatibleExpression<Date>,
    end: CompatibleExpression<Date>
  ): Expression<number> {
    return StandardExpression.create(Standard.minutesBetween.name, [
      start,
      end,
    ]);
  },
  /**
   * 计算两个日期之间的天数，小数
   * @param start
   * @param end
   * @returns
   */
  secondsBetween(
    start: CompatibleExpression<Date>,
    end: CompatibleExpression<Date>
  ): Expression<number> {
    return StandardExpression.create(Standard.secondsBetween.name, [
      start,
      end,
    ]);
  },
  addDays(
    date: CompatibleExpression<Date>,
    days: CompatibleExpression<number>
  ): Expression<Date> {
    return StandardExpression.create(Standard.addDays.name, [date, days]);
  },
  addMonths(
    date: CompatibleExpression<Date>,
    months: CompatibleExpression<number>
  ): Expression<Date> {
    return StandardExpression.create(Standard.addMonths.name, [date, months]);
  },
  addYears(
    date: CompatibleExpression<Date>,
    years: CompatibleExpression<number>
  ): Expression<Date> {
    return StandardExpression.create(Standard.addYears.name, [date, years]);
  },
  addHours(
    date: CompatibleExpression<Date>,
    hours: CompatibleExpression<number>
  ): Expression<Date> {
    return StandardExpression.create(Standard.addHours.name, [date, hours]);
  },
  addMinutes(
    date: CompatibleExpression<Date>,
    minutes: CompatibleExpression<number>
  ): Expression<Date> {
    return StandardExpression.create(Standard.addMinutes.name, [date, minutes]);
  },
  addSeconds(
    date: CompatibleExpression<Date>,
    seconds: CompatibleExpression<number>
  ): Expression<Date> {
    return StandardExpression.create(Standard.addSeconds.name, [date, seconds]);
  },
  /**
   * 获取字符串长度
   * @param str
   * @returns
   */
  strlen(str: CompatibleExpression<string>): Expression<number> {
    return StandardExpression.create(Standard.strlen.name, [str]);
  },
  /**
   * 截取字符串
   * @param str
   * @param start
   * @param length
   * @returns
   */
  substr(
    str: CompatibleExpression<string>,
    start: CompatibleExpression<number>,
    length: CompatibleExpression<number>
  ): Expression<string> {
    return StandardExpression.create(Standard.substr.name, [start, length]);
  },
  /**
   * 替换字符串
   * @param str 需要被替换的字符串
   * @param search 查找字符串
   * @param to 替换成字符串
   * @param global 是否全局替换，默认为false
   * @returns
   */
  replace(
    str: CompatibleExpression<string>,
    search: CompatibleExpression<string>,
    to: CompatibleExpression<string>
  ): Expression<string> {
    return StandardExpression.create(Standard.replace.name, [str, search, to]);
  },
  /**
   * 删除字符串两侧空格
   * @param str
   * @returns
   */
  trim(str: CompatibleExpression<string>): Expression<string> {
    return StandardExpression.create(Standard.trim.name, [str]);
  },
  /**
   * 删除字符串右侧空格
   * @param str
   * @returns
   */
  trimEnd(str: CompatibleExpression<string>): Expression<string> {
    return StandardExpression.create(Standard.trimEnd.name, [str]);
  }
  /**
   * 转换成大写字母
   * @param str
   * @returns
   */,
  upper(str: CompatibleExpression<string>): Expression<string> {
    return StandardExpression.create(Standard.upper.name, [str]);
  },
  /**
   * 转换成小写字母
   * @param str
   * @returns
   */
  lower(str: CompatibleExpression<string>): Expression<string> {
    return StandardExpression.create(Standard.lower.name, [str]);
  },
  /**
   * 查找一个
   * @param str
   * @param search
   * @returns
   */
  strpos(
    str: CompatibleExpression<string>,
    search: CompatibleExpression<string>,
    startAt?: CompatibleExpression<number>
  ): Expression<number> {
    return StandardExpression.create(Standard.strpos.name, [
      str,
      search,
      startAt,
    ]);
  },
  /**
   * 获取一个字符的ascii码
   * @param str 字符编码
   * @returns
   */
  ascii(str: CompatibleExpression<string>): Expression<number> {
    return StandardExpression.create(Standard.ascii.name, [str]);
  },
  asciiChar(code: CompatibleExpression<number>): Expression<string> {
    return StandardExpression.create(Standard.asciiChar.name, [code]);
  },
  unicode(str: CompatibleExpression<string>): Expression<number> {
    return StandardExpression.create(Standard.unicode.name, [str]);
  },
  unicodeChar(code: CompatibleExpression<number>): Expression<string> {
    return StandardExpression.create(Standard.unicodeChar.name, [code]);
  },
  nvl<T extends Scalar>(
    value: CompatibleExpression<T>,
    defaultValue: CompatibleExpression<T>
  ): Expression<T> {
    return StandardExpression.create(Standard.nvl.name, [value, defaultValue]);
  },
  abs(value: CompatibleExpression<number>): Expression<number> {
    return StandardExpression.create(Standard.abs.name, [value]);
  },
  exp(value: CompatibleExpression<number>): Expression<number> {
    return StandardExpression.create(Standard.exp.name, [value]);
  },
  // cbrt(value: CompatibleExpression<number>): Expression<number> {
  //   return StandardExpression.create(Standard.cbrt.name, [value]);
  // }

  ceil(value: CompatibleExpression<number>): Expression<number> {
    return StandardExpression.create(Standard.ceil.name, [value]);
  },
  floor(value: CompatibleExpression<number>): Expression<number> {
    return StandardExpression.create(Standard.floor.name, [value]);
  },
  ln(value: CompatibleExpression<number>): Expression<number> {
    return StandardExpression.create(Standard.ln.name, [value]);
  },
  log(value: CompatibleExpression<number>): Expression<number> {
    return StandardExpression.create(Standard.log.name, [value]);
  },
  mod(
    value: CompatibleExpression<number>,
    x: CompatibleExpression<number>
  ): Expression<number> {
    return StandardExpression.create(Standard.mod.name, [value, x]);
  },
  pi(): Expression<number> {
    return StandardExpression.create(Standard.pi.name, []);
  },
  power(
    a: CompatibleExpression<number>,
    b: CompatibleExpression<number>
  ): Expression<number> {
    return StandardExpression.create(Standard.power.name, [a, b]);
  },
  radians(value: CompatibleExpression<number>): Expression<number> {
    return StandardExpression.create(Standard.radians.name, [value]);
  },
  degrees(value: CompatibleExpression<number>): Expression<number> {
    return StandardExpression.create(Standard.degrees.name, [value]);
  },
  random(): Expression<number> {
    return StandardExpression.create(Standard.random.name, []);
  },
  round(
    value: CompatibleExpression<number>,
    s?: CompatibleExpression<number>
  ): Expression<number> {
    return StandardExpression.create(Standard.round.name, [value, s]);
  },
  sign(value: CompatibleExpression<number>): Expression<number> {
    return StandardExpression.create(Standard.sign.name, [value]);
  },
  sqrt(value: CompatibleExpression<number>): Expression<number> {
    return StandardExpression.create(Standard.sqrt.name, [value]);
  },
  // trunc(
  //   value: CompatibleExpression<number>,
  //   s?: CompatibleExpression<number>
  // ): Expression<number> {
  //   return StandardExpression.create(Standard.trunc.name, [value, s]);
  // }

  cos(value: CompatibleExpression<number>): Expression<number> {
    return StandardExpression.create(Standard.cos.name, [value]);
  },
  sin(value: CompatibleExpression<number>): Expression<number> {
    return StandardExpression.create(Standard.sin.name, [value]);
  },
  tan(value: CompatibleExpression<number>): Expression<number> {
    return StandardExpression.create(Standard.tan.name, [value]);
  },
  acos(value: CompatibleExpression<number>): Expression<number> {
    return StandardExpression.create(Standard.acos.name, [value]);
  },
  asin(value: CompatibleExpression<number>): Expression<number> {
    return StandardExpression.create(Standard.asin.name, [value]);
  },
  atan(value: CompatibleExpression<number>): Expression<number> {
    return StandardExpression.create(Standard.atan.name, [value]);
  },
  atan2(value: CompatibleExpression<number>): Expression<number> {
    return StandardExpression.create(Standard.atan2.name, [value]);
  },
  cot(value: CompatibleExpression<number>): Expression<number> {
    return StandardExpression.create(Standard.cot.name, [value]);
  },
  renameTable(name: Name, newName: string): Statement {
    return StandardStatement.create(Standard.renameTable.name, [name, newName]);
  },
  renameColumn(table: Name, name: string, newName: string): Statement {
    return StandardStatement.create(Standard.renameColumn.name, [
      table,
      name,
      newName,
    ]);
  },
  renameView(name: Name, newName: string): Statement {
    return StandardStatement.create(Standard.renameView.name, [name, newName]);
  },
  renameIndex(table: Name, name: string, newName: string): Statement {
    return StandardStatement.create(Standard.renameIndex.name, [table, name, newName]);
  },
  renameProcedure(name: Name, newName: string): Statement {
    return StandardStatement.create(Standard.renameProcedure.name, [
      name,
      newName,
    ]);
  },
  renameFunction(name: Name, newName: string): Statement {
    return StandardStatement.create(Standard.renameFunction.name, [
      name,
      newName,
    ]);
  },
  commentTable(name: Name, comment: string): Statement {
    return StandardStatement.create(Standard.commentTable.name, [
      name,
      comment,
    ]);
  },
  commentColumn(table: Name, name: string, comment: string): Statement {
    return StandardStatement.create(Standard.commentColumn.name, [
      table,
      name,
      comment,
    ]);
  },
  commentIndex(table: Name, name: string, comment: string): Statement {
    return StandardStatement.create(Standard.commentIndex.name, [
      table,
      name,
      comment,
    ]);
  },
  commentConstraint(table: Name, name: string, comment: string): Statement {
    return StandardStatement.create(Standard.commentConstraint.name, [
      table,
      name,
      comment,
    ]);
  },
  commentSchema(name: string, comment: string): Statement {
    return StandardStatement.create(Standard.commentSchema.name, [
      name,
      comment,
    ]);
  },
  commentSequence(name: Name, comment: string): Statement {
    return StandardStatement.create(Standard.commentSequence.name, [
      name,
      comment,
    ]);
  },
  commentProcedure(name: Name, comment: string): Statement {
    return StandardStatement.create(Standard.commentProcedure.name, [
      name,
      comment,
    ]);
  },
  commentFunction(name: Name, comment: string): Statement {
    return StandardStatement.create(Standard.commentFunction.name, [
      name,
      comment,
    ]);
  },
};
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
// export const std: Standard = {
//   count,
//   avg,
//   sum,
//   max,
//   min,
//   identityValue,
//   convert,
//   now,
//   utcNow,
//   switchTimezone,
//   formatDate,
//   yearOf,
//   monthOf,
//   dayOf,
//   daysBetween,
//   monthsBetween,
//   yearsBetween,
//   hoursBetween,
//   minutesBetween,
//   secondsBetween,
//   addDays,
//   addMonths,
//   addYears,
//   addHours,
//   addMinutes,
//   addSeconds,
//   strlen,
//   substr,
//   replace,
//   trim,
//   trimEnd,
//   upper,
//   lower,
//   strpos,
//   ascii,
//   asciiChar,
//   unicode,
//   unicodeChar,
//   isNull,
//   abs,
//   exp,
//   ceil,
//   floor,
//   ln,
//   log,
//   mod,
//   pi,
//   power,
//   radians,
//   degrees,
//   random,
//   round,
//   sign,
//   sqrt,
//   cos,
//   sin,
//   tan,
//   acos,
//   asin,
//   atan,
//   atan2,
//   cot,
//   renameTable,
//   renameColumn,
//   renameView,
//   renameIndex,
//   renameProcedure,
//   renameFunction,
//   commentTable,
//   commentColumn,
//   commentConstraint,
//   commentFunction,
//   commentIndex,
//   commentProcedure,
//   commentSchema,
//   commentSequence,
// };
