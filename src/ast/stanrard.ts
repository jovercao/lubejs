/**
 * 此文件和于存放标准库
 * 如数据类型、函数、系统变量、系统常量等
 */

 import Decimal from 'decimal.js-light';
import { Condition } from './condition/condition';
import { DbType, TsTypeOf } from './db-type';
import { CompatibleExpression, Expression } from './expression/expression';
import { Binary, Numeric, Scalar } from './scalar';
import { Star } from './statement/crud/star';
import { CompatiableObjectName } from './object/db-object';
import { StandardExpression } from './expression/standard-expression';
import { StandardCondition } from './condition/standard-condition';


 export interface Standard {
   count(expr: Star | CompatibleExpression<Scalar>): Expression<number>;
   avg<T extends number | Decimal | bigint>(expr: CompatibleExpression<T>): Expression<T>;
   sum<T extends number | Decimal | bigint>(expr: CompatibleExpression<T>): Expression<T>;
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
   ): Expression<number | bigint>;
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
   trimEnd(str: CompatibleExpression<string>): Expression<string>;
   /**
    * 转换成大写字母
    * @param str
    * @returns
    */
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
   abs(value: CompatibleExpression<Numeric>): Expression<Numeric>;
   exp(value: CompatibleExpression<Numeric>): Expression<Numeric>;
   ceil(value: CompatibleExpression<Numeric>): Expression<Numeric>;
   ceil(value: CompatibleExpression<Numeric>): Expression<Numeric>;
   floor(value: CompatibleExpression<Numeric>): Expression<Numeric>;
   ln(value: CompatibleExpression<Numeric>): Expression<Numeric>;
   log(value: CompatibleExpression<Numeric>): Expression<Numeric>;
   mod(
     value: CompatibleExpression<Numeric>,
     x: CompatibleExpression<Numeric>
   ): Expression<Numeric>;
   pi(): Expression<number>;
   power(
     a: CompatibleExpression<Numeric>,
     b: CompatibleExpression<Numeric>
   ): Expression<Numeric>;
   radians(value: CompatibleExpression<Numeric>): Expression<Numeric>;
   degrees(value: CompatibleExpression<Numeric>): Expression<Numeric>;
   random(): Expression<number>;
   round<T extends Numeric>(
     value: CompatibleExpression<T>,
     s: CompatibleExpression<Numeric>
   ): Expression<T>;
   sign(value: CompatibleExpression<Numeric>): Expression<Numeric>;
   sqrt(value: CompatibleExpression<Numeric>): Expression<Numeric>;
   cos(value: CompatibleExpression<Numeric>): Expression<Numeric>;
   sin(value: CompatibleExpression<Numeric>): Expression<Numeric>;
   tan(value: CompatibleExpression<Numeric>): Expression<Numeric>;
   acos(value: CompatibleExpression<Numeric>): Expression<Numeric>;
   asin(value: CompatibleExpression<Numeric>): Expression<Numeric>;
   atan(value: CompatibleExpression<Numeric>): Expression<Numeric>;
   atan2(value: CompatibleExpression<Numeric>): Expression<Numeric>;
   cot(value: CompatibleExpression<Numeric>): Expression<Numeric>;

   existsTable(table: CompatiableObjectName): Condition;

   existsDatabase(database: string): Condition;

   existsView(name: CompatiableObjectName): Condition;

   existsFunction(name: CompatiableObjectName): Condition;

   existsProcedure(name: CompatiableObjectName): Condition;

   existsSequence(name: CompatiableObjectName): Condition;
 }

 export const Standard: Standard = {
   count(expr: Star | CompatibleExpression<Scalar>): Expression<number> {
     return StandardExpression.create(Standard.count.name, [expr]);
   },
   avg(expr: CompatibleExpression<Numeric>): Expression<Numeric> {
     return StandardExpression.create(Standard.avg.name, [expr]);
   },
   sum(expr: CompatibleExpression<Numeric>): Expression<Numeric> {
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
   ): Expression<number | bigint> {
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
     days: CompatibleExpression<Numeric>
   ): Expression<Date> {
     return StandardExpression.create(Standard.addDays.name, [date, days]);
   },
   addMonths(
     date: CompatibleExpression<Date>,
     months: CompatibleExpression<Numeric>
   ): Expression<Date> {
     return StandardExpression.create(Standard.addMonths.name, [date, months]);
   },
   addYears(
     date: CompatibleExpression<Date>,
     years: CompatibleExpression<Numeric>
   ): Expression<Date> {
     return StandardExpression.create(Standard.addYears.name, [date, years]);
   },
   addHours(
     date: CompatibleExpression<Date>,
     hours: CompatibleExpression<Numeric>
   ): Expression<Date> {
     return StandardExpression.create(Standard.addHours.name, [date, hours]);
   },
   addMinutes(
     date: CompatibleExpression<Date>,
     minutes: CompatibleExpression<Numeric>
   ): Expression<Date> {
     return StandardExpression.create(Standard.addMinutes.name, [date, minutes]);
   },
   addSeconds(
     date: CompatibleExpression<Date>,
     seconds: CompatibleExpression<Numeric>
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
     start: CompatibleExpression<Numeric>,
     length: CompatibleExpression<Numeric>
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
   },
   /**
    * 转换成大写字母
    * @param str
    * @returns
    */ upper(str: CompatibleExpression<string>): Expression<string> {
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
   abs(value: CompatibleExpression<Numeric>): Expression<Numeric> {
     return StandardExpression.create(Standard.abs.name, [value]);
   },
   exp(value: CompatibleExpression<Numeric>): Expression<Numeric> {
     return StandardExpression.create(Standard.exp.name, [value]);
   },
   // cbrt(value: CompatibleExpression<number>): Expression<number> {
   //   return StandardExpression.create(Standard.cbrt.name, [value]);
   // }

   ceil(value: CompatibleExpression<Numeric>): Expression<Numeric> {
     return StandardExpression.create(Standard.ceil.name, [value]);
   },
   floor(value: CompatibleExpression<Numeric>): Expression<Numeric> {
     return StandardExpression.create(Standard.floor.name, [value]);
   },
   ln(value: CompatibleExpression<number>): Expression<number> {
     return StandardExpression.create(Standard.ln.name, [value]);
   },
   log(value: CompatibleExpression<number>): Expression<number> {
     return StandardExpression.create(Standard.log.name, [value]);
   },
   mod(
     value: CompatibleExpression<Numeric>,
     x: CompatibleExpression<Numeric>
   ): Expression<Numeric> {
     return StandardExpression.create(Standard.mod.name, [value, x]);
   },
   pi(): Expression<number> {
     return StandardExpression.create(Standard.pi.name, []);
   },
   power(
     a: CompatibleExpression<Numeric>,
     b: CompatibleExpression<Numeric>
   ): Expression<Numeric> {
     return StandardExpression.create(Standard.power.name, [a, b]);
   },
   radians(value: CompatibleExpression<Numeric>): Expression<Numeric> {
     return StandardExpression.create(Standard.radians.name, [value]);
   },
   degrees(value: CompatibleExpression<Numeric>): Expression<Numeric> {
     return StandardExpression.create(Standard.degrees.name, [value]);
   },
   random(): Expression<number> {
     return StandardExpression.create(Standard.random.name, []);
   },
   round<T extends Numeric>(
     value: CompatibleExpression<T>,
     s?: CompatibleExpression<Numeric>
   ): Expression<T> {
     return StandardExpression.create(Standard.round.name, [value, s]);
   },
   sign(value: CompatibleExpression<Numeric>): Expression<Numeric> {
     return StandardExpression.create(Standard.sign.name, [value]);
   },
   sqrt(value: CompatibleExpression<Numeric>): Expression<Numeric> {
     return StandardExpression.create(Standard.sqrt.name, [value]);
   },
   // trunc(
   //   value: CompatibleExpression<number>,
   //   s?: CompatibleExpression<number>
   // ): Expression<number> {
   //   return StandardExpression.create(Standard.trunc.name, [value, s]);
   // }

   cos(value: CompatibleExpression<Numeric>): Expression<Numeric> {
     return StandardExpression.create(Standard.cos.name, [value]);
   },
   sin(value: CompatibleExpression<Numeric>): Expression<Numeric> {
     return StandardExpression.create(Standard.sin.name, [value]);
   },
   tan(value: CompatibleExpression<Numeric>): Expression<Numeric> {
     return StandardExpression.create(Standard.tan.name, [value]);
   },
   acos(value: CompatibleExpression<Numeric>): Expression<Numeric> {
     return StandardExpression.create(Standard.acos.name, [value]);
   },
   asin(value: CompatibleExpression<Numeric>): Expression<Numeric> {
     return StandardExpression.create(Standard.asin.name, [value]);
   },
   atan(value: CompatibleExpression<Numeric>): Expression<Numeric> {
     return StandardExpression.create(Standard.atan.name, [value]);
   },
   atan2(value: CompatibleExpression<Numeric>): Expression<Numeric> {
     return StandardExpression.create(Standard.atan2.name, [value]);
   },
   cot(value: CompatibleExpression<Numeric>): Expression<Numeric> {
     return StandardExpression.create(Standard.cot.name, [value]);
   },

   existsTable(table: CompatiableObjectName): Condition {
     return StandardCondition.create(Standard.existsTable.name, [table]);
   },

   existsDatabase(database: string): Condition {
     return StandardCondition.create(Standard.existsDatabase.name, [database]);
   },

   existsView(name: CompatiableObjectName): Condition {
     return StandardCondition.create(Standard.existsView.name, [name]);
   },

   existsFunction(name: CompatiableObjectName): Condition {
     return StandardCondition.create(Standard.existsFunction.name, [name]);
   },

   existsProcedure(name: CompatiableObjectName): Condition {
     return StandardCondition.create(Standard.existsProcedure.name, [name]);
   },

   existsSequence(name: CompatiableObjectName): Condition {
     return StandardCondition.create(Standard.existsSequence.name, [name]);
   }
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
