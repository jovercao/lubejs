/* eslint-disable @typescript-eslint/no-namespace */
/**
 * 此文件和于存放标准库
 * 如数据类型、函数、系统变量、系统常量等
 */

import {
  Condition,
  DbType,
  TsTypeOf,
  CompatibleExpression,
  Expression,
  Binary,
  Numeric,
  Scalar,
  Star,
  CompatiableObjectName,
  StandardExpression,
  StandardCondition,
  Float
} from './sql';
import './sql';

export class Standard {
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  protected constructor() {}
  static std: Standard = new Standard();
  count(expr: Star | CompatibleExpression<Scalar>): Expression<number> {
    return StandardExpression.create(STD.count.name, [expr]);
  }
  avg<T extends Numeric>(expr: CompatibleExpression<T>): Expression<T> {
    return StandardExpression.create(STD.avg.name, [expr]);
  }
  sum<T extends Numeric>(expr: CompatibleExpression<T>): Expression<T> {
    return StandardExpression.create(STD.sum.name, [expr]);
  }

  max<T extends Exclude<Scalar, Binary>>(expr: Expression<T>): Expression<T> {
    return StandardExpression.create(STD.max.name, [expr]);
  }
  min<T extends Exclude<Scalar, Binary>>(expr: Expression<T>): Expression<T> {
    return StandardExpression.create(STD.min.name, [expr]);
  }
  /**
   * 获取标识列的最近插入值
   */
  identityValue(
    table: CompatibleExpression<string>,
    column: CompatibleExpression<string>
  ): Expression<number | bigint> {
    return StandardExpression.create(STD.identityValue.name, [table, column]);
  }
  /**
   * 转换数据类型
   */
  convert<T extends DbType>(
    expr: CompatibleExpression,
    toType: T
  ): Expression<TsTypeOf<T>> {
    return StandardExpression.create(STD.convert.name, [expr, toType]);
  }
  /**
   * 获取当前日期及时间
   */
  now(): Expression<Date> {
    return StandardExpression.create(STD.now.name, []);
  }
  /**
   * 获取当前UTC时间
   */
  utcNow(): Expression<Date> {
    return StandardExpression.create(STD.utcNow.name, []);
  }
  /**
   * 切换时区
   */
  switchTimezone(
    date: CompatibleExpression<Date>,
    offset: CompatibleExpression<string>
  ): Expression<Date> {
    return StandardExpression.create(STD.switchTimezone.name, [date, offset]);
  }
  /**
   * 格式化日期函数
   */
  formatDate(
    date: CompatibleExpression<Date>,
    format: string
  ): Expression<string> {
    return StandardExpression.create(STD.formatDate.name, [date, format]);
  }
  /**
   * 获取日期中的年份
   * @param date
   * @returns
   */
  yearOf(date: CompatibleExpression<Date>): Expression<number> {
    return StandardExpression.create(STD.yearOf.name, [date]);
  }
  /**
   * 获取日期中的月份
   * @param date
   * @returns
   */
  monthOf(date: CompatibleExpression<Date>): Expression<number> {
    return StandardExpression.create(STD.monthOf.name, [date]);
  }
  /**
   * 获取日期中的日
   * @param date
   * @returns
   */
  dayOf(date: CompatibleExpression<Date>): Expression<number> {
    return StandardExpression.create(STD.dayOf.name, [date]);
  }
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
    return StandardExpression.create(STD.daysBetween.name, [start, end]);
  }
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
    return StandardExpression.create(STD.monthsBetween.name, [start, end]);
  }
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
    return StandardExpression.create(STD.yearsBetween.name, [start, end]);
  }
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
    return StandardExpression.create(STD.hoursBetween.name, [start, end]);
  }
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
    return StandardExpression.create(STD.minutesBetween.name, [start, end]);
  }
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
    return StandardExpression.create(STD.secondsBetween.name, [start, end]);
  }
  addDays(
    date: CompatibleExpression<Date>,
    days: CompatibleExpression<Numeric>
  ): Expression<Date> {
    return StandardExpression.create(STD.addDays.name, [date, days]);
  }
  addMonths(
    date: CompatibleExpression<Date>,
    months: CompatibleExpression<Numeric>
  ): Expression<Date> {
    return StandardExpression.create(STD.addMonths.name, [date, months]);
  }
  addYears(
    date: CompatibleExpression<Date>,
    years: CompatibleExpression<Numeric>
  ): Expression<Date> {
    return StandardExpression.create(STD.addYears.name, [date, years]);
  }
  addHours(
    date: CompatibleExpression<Date>,
    hours: CompatibleExpression<Numeric>
  ): Expression<Date> {
    return StandardExpression.create(STD.addHours.name, [date, hours]);
  }
  addMinutes(
    date: CompatibleExpression<Date>,
    minutes: CompatibleExpression<Numeric>
  ): Expression<Date> {
    return StandardExpression.create(STD.addMinutes.name, [date, minutes]);
  }
  addSeconds(
    date: CompatibleExpression<Date>,
    seconds: CompatibleExpression<Numeric>
  ): Expression<Date> {
    return StandardExpression.create(STD.addSeconds.name, [date, seconds]);
  }
  /**
   * 获取字符串长度
   * @param str
   * @returns
   */
  strlen(str: CompatibleExpression<string>): Expression<number> {
    return StandardExpression.create(STD.strlen.name, [str]);
  }
  /**
   * 截取字符串
   * @param str
   * @param start
   * @param length
   * @returns
   */
  substr(
    str: CompatibleExpression<string>,
    start: CompatibleExpression<Numeric>,
    length: CompatibleExpression<Numeric>
  ): Expression<string> {
    return StandardExpression.create(STD.substr.name, [start, length]);
  }
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
    return StandardExpression.create(STD.replace.name, [str, search, to]);
  }
  /**
   * 删除字符串两侧空格
   * @param str
   * @returns
   */
  trim(str: CompatibleExpression<string>): Expression<string> {
    return StandardExpression.create(STD.trim.name, [str]);
  }
  /**
   * 删除字符串右侧空格
   * @param str
   * @returns
   */
  trimEnd(str: CompatibleExpression<string>): Expression<string> {
    return StandardExpression.create(STD.trimEnd.name, [str]);
  }
  /**
   * 转换成大写字母
   * @param str
   * @returns
   */ upper(str: CompatibleExpression<string>): Expression<string> {
    return StandardExpression.create(STD.upper.name, [str]);
  }
  /**
   * 转换成小写字母
   * @param str
   * @returns
   */
  lower(str: CompatibleExpression<string>): Expression<string> {
    return StandardExpression.create(STD.lower.name, [str]);
  }
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
    return StandardExpression.create(STD.strpos.name, [str, search, startAt]);
  }
  /**
   * 获取一个字符的ascii码
   * @param str 字符编码
   * @returns
   */
  ascii(str: CompatibleExpression<string>): Expression<number> {
    return StandardExpression.create(STD.ascii.name, [str]);
  }
  asciiChar(code: CompatibleExpression<number>): Expression<string> {
    return StandardExpression.create(STD.asciiChar.name, [code]);
  }
  unicode(str: CompatibleExpression<string>): Expression<number> {
    return StandardExpression.create(STD.unicode.name, [str]);
  }
  unicodeChar(code: CompatibleExpression<number>): Expression<string> {
    return StandardExpression.create(STD.unicodeChar.name, [code]);
  }
  nvl<T extends Scalar>(
    value: CompatibleExpression<T>,
    defaultValue: CompatibleExpression<T>
  ): Expression<T> {
    return StandardExpression.create(STD.nvl.name, [value, defaultValue]);
  }
  abs<T extends Numeric>(value: CompatibleExpression<T>): Expression<T> {
    return StandardExpression.create(STD.abs.name, [value]);
  }
  exp<T extends Numeric>(value: CompatibleExpression<T>): Expression<T> {
    return StandardExpression.create(STD.exp.name, [value]);
  }
  // cbrt(value: CompatibleExpression<number>): Expression<number> {
  //   return StandardExpression.create(Standard.cbrt.name, [value]);
  // }

  ceil<T extends Numeric>(value: CompatibleExpression<T>): Expression<T> {
    return StandardExpression.create(STD.ceil.name, [value]);
  }
  floor<T extends Numeric>(value: CompatibleExpression<T>): Expression<T> {
    return StandardExpression.create(STD.floor.name, [value]);
  }
  ln<T extends Numeric>(value: CompatibleExpression<T>): Expression<T> {
    return StandardExpression.create(STD.ln.name, [value]);
  }
  log<T extends Numeric>(value: CompatibleExpression<T>): Expression<T> {
    return StandardExpression.create(STD.log.name, [value]);
  }

  pi(): Expression<number> {
    return StandardExpression.create(STD.pi.name, []);
  }
  power<T extends Numeric>(
    a: CompatibleExpression<T>,
    b: CompatibleExpression<Numeric>
  ): Expression<T> {
    return StandardExpression.create(STD.power.name, [a, b]);
  }
  radians<T extends Numeric>(value: CompatibleExpression<T>): Expression<T> {
    return StandardExpression.create(STD.radians.name, [value]);
  }
  degrees<T extends Numeric>(value: CompatibleExpression<T>): Expression<T> {
    return StandardExpression.create(STD.degrees.name, [value]);
  }
  random(): Expression<Float> {
    return StandardExpression.create(STD.random.name, []);
  }
  round<T extends Numeric>(
    value: CompatibleExpression<T>,
    s?: CompatibleExpression<Numeric>
  ): Expression<T> {
    return StandardExpression.create(STD.round.name, [value, s]);
  }
  sign<T extends Numeric>(value: CompatibleExpression<T>): Expression<T> {
    return StandardExpression.create(STD.sign.name, [value]);
  }
  sqrt(value: CompatibleExpression<Numeric>): Expression<Float> {
    return StandardExpression.create(STD.sqrt.name, [value]);
  }
  cos(value: CompatibleExpression<Numeric>): Expression<Float> {
    return StandardExpression.create(STD.cos.name, [value]);
  }
  sin(value: CompatibleExpression<Numeric>): Expression<Float> {
    return StandardExpression.create(STD.sin.name, [value]);
  }
  tan(value: CompatibleExpression<Numeric>): Expression<Float> {
    return StandardExpression.create(STD.tan.name, [value]);
  }
  acos(value: CompatibleExpression<Numeric>): Expression<Float> {
    return StandardExpression.create(STD.acos.name, [value]);
  }
  asin(value: CompatibleExpression<Numeric>): Expression<Float> {
    return StandardExpression.create(STD.asin.name, [value]);
  }
  atan(value: CompatibleExpression<Numeric>): Expression<Float> {
    return StandardExpression.create(STD.atan.name, [value]);
  }
  atan2(value: CompatibleExpression<Numeric>): Expression<Float> {
    return StandardExpression.create(STD.atan2.name, [value]);
  }
  cot(value: CompatibleExpression<Numeric>): Expression<Float> {
    return StandardExpression.create(STD.cot.name, [value]);
  }
  existsTable(table: CompatiableObjectName): Condition {
    return StandardCondition.create(STD.existsTable.name, [table]);
  }
  existsDatabase(database: string): Condition {
    return StandardCondition.create(STD.existsDatabase.name, [database]);
  }
  existsView(name: CompatiableObjectName): Condition {
    return StandardCondition.create(STD.existsView.name, [name]);
  }
  existsFunction(name: CompatiableObjectName): Condition {
    return StandardCondition.create(STD.existsFunction.name, [name]);
  }
  /**
   * 返回是否存在存储过程条件
   */
  existsProcedure(name: CompatiableObjectName): Condition {
    return StandardCondition.create(STD.existsProcedure.name, [name]);
  }
  /**
   * 返回是否存在序列
   */
  existsSequence(name: CompatiableObjectName): Condition {
    return StandardCondition.create(STD.existsSequence.name, [name]);
  }

  /**
   * 获取当前数据库
   */
  currentDatabase(): Expression<string> {
    return StandardExpression.create(STD.currentDatabase.name, []);
  }

  /**
   * 获取默认架构
   */
  defaultSchema(): Expression<string> {
    return StandardExpression.create(STD.defaultSchema.name, []);
  }
}

export const STD: Standard = Standard.std;
