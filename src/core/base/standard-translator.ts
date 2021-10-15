import Decimal from "decimal.js-light";
import { Star, XExpression, Scalar, Expression, Numeric, Uuid, DbType, ScalarFromDbType, XObjectName, Condition, Time } from "../sql";
import { Standard } from "../standard";
import { DbProvider } from "./db-provider";

export abstract class StandardTranslator implements Standard {
  constructor(public provider: DbProvider) {

  }

  get sqlUtil() {
    return this.provider.sqlUtil;
  }

  abstract identityValue(table: XExpression<string>, column: XExpression<string>): Expression<number | bigint>;

  abstract count(expr: Star<any> | XExpression<Scalar>): Expression<number>;

  abstract avg<T extends Numeric>(expr: XExpression<T>): Expression<T>;

  abstract sum<T extends Numeric>(expr: XExpression<T>): Expression<T>;

  abstract max<T extends string | number | bigint | boolean | Decimal | Date | Time | Uuid | null>(expr: Expression<T>): Expression<T>;

  abstract min<T extends string | number | bigint | boolean | Decimal | Date | Time | Uuid | null>(expr: Expression<T>): Expression<T>;

  abstract convert<T extends DbType>(expr: XExpression<Scalar>, toType: T): Expression<ScalarFromDbType<T>>;

  abstract now(): Expression<Date>;

  abstract utcNow(): Expression<Date>;

  abstract switchTimezone(date: XExpression<Date>, offset: XExpression<string>): Expression<Date>;

  abstract formatDate(date: XExpression<Date>, format: string): Expression<string>;

  abstract yearOf(date: XExpression<Date>): Expression<number>;

  abstract monthOf(date: XExpression<Date>): Expression<number>;

  abstract dayOf(date: XExpression<Date>): Expression<number>;

  abstract daysBetween(start: XExpression<Date>, end: XExpression<Date>): Expression<number>;

  abstract monthsBetween(start: XExpression<Date>, end: XExpression<Date>): Expression<number>;

  abstract yearsBetween(start: XExpression<Date>, end: XExpression<Date>): Expression<number>;

  abstract hoursBetween(start: XExpression<Date>, end: XExpression<Date>): Expression<number>;

  abstract minutesBetween(start: XExpression<Date>, end: XExpression<Date>): Expression<number>;

  abstract secondsBetween(start: XExpression<Date>, end: XExpression<Date>): Expression<number>;

  abstract addDays(date: XExpression<Date>, days: XExpression<Numeric>): Expression<Date>;

  abstract addMonths(date: XExpression<Date>, months: XExpression<Numeric>): Expression<Date>;

  abstract addYears(date: XExpression<Date>, years: XExpression<Numeric>): Expression<Date>;

  abstract addHours(date: XExpression<Date>, hours: XExpression<Numeric>): Expression<Date>;

  abstract addMinutes(date: XExpression<Date>, minutes: XExpression<Numeric>): Expression<Date>;

  abstract addSeconds(date: XExpression<Date>, seconds: XExpression<Numeric>): Expression<Date>;

  abstract strlen(str: XExpression<string>): Expression<number>;

  abstract substr(str: XExpression<string>, start: XExpression<Numeric>, length: XExpression<Numeric>): Expression<string>;

  abstract replace(str: XExpression<string>, search: XExpression<string>, to: XExpression<string>): Expression<string>;

  abstract trim(str: XExpression<string>): Expression<string>;

  abstract trimEnd(str: XExpression<string>): Expression<string>;

  abstract upper(str: XExpression<string>): Expression<string>;

  abstract lower(str: XExpression<string>): Expression<string>;

  abstract strpos(str: XExpression<string>, search: XExpression<string>, startAt?: XExpression<number>): Expression<number>;

  abstract ascii(str: XExpression<string>): Expression<number>;

  abstract asciiChar(code: XExpression<number>): Expression<string>;

  abstract unicode(str: XExpression<string>): Expression<number>;

  abstract unicodeChar(code: XExpression<number>): Expression<string>;

  abstract nvl<T extends Scalar>(value: XExpression<T>, defaultValue: XExpression<T>): Expression<T>;

  abstract abs<T extends Numeric>(value: XExpression<T>): Expression<T>;

  abstract exp<T extends Numeric>(value: XExpression<T>): Expression<T>;

  abstract ceil<T extends Numeric>(value: XExpression<T>): Expression<T>;

  abstract floor<T extends Numeric>(value: XExpression<T>): Expression<T>;

  abstract ln<T extends Numeric>(value: XExpression<T>): Expression<T>;

  abstract log<T extends Numeric>(value: XExpression<T>): Expression<T>;

  abstract pi(): Expression<number>;

  abstract power<T extends Numeric>(a: XExpression<T>, b: XExpression<Numeric>): Expression<T>;

  abstract radians<T extends Numeric>(value: XExpression<T>): Expression<T>;

  abstract degrees<T extends Numeric>(value: XExpression<T>): Expression<T>;

  abstract random(): Expression<number>;

  abstract round<T extends Numeric>(value: XExpression<T>, s?: XExpression<Numeric>): Expression<T>;

  abstract sign<T extends Numeric>(value: XExpression<T>): Expression<T>;

  abstract sqrt(value: XExpression<Numeric>): Expression<number>;

  abstract cos(value: XExpression<Numeric>): Expression<number>;

  abstract sin(value: XExpression<Numeric>): Expression<number>;

  abstract tan(value: XExpression<Numeric>): Expression<number>;

  abstract acos(value: XExpression<Numeric>): Expression<number>;

  abstract asin(value: XExpression<Numeric>): Expression<number>;

  abstract atan(value: XExpression<Numeric>): Expression<number>;

  abstract atan2(value: XExpression<Numeric>): Expression<number>;

  abstract cot(value: XExpression<Numeric>): Expression<number>;

  abstract existsTable(table: XObjectName<string>): Condition;

  abstract existsDatabase(database: string): Condition;

  abstract existsView(name: XObjectName<string>): Condition;

  abstract existsFunction(name: XObjectName<string>): Condition;

  abstract existsProcedure(name: XObjectName<string>): Condition;

  abstract existsSequence(name: XObjectName<string>): Condition;

  abstract currentDatabase(): Expression<string>;

  abstract defaultSchema(): Expression<string>;

  abstract sequenceNextValue<T extends Numeric>(sequenceName: XObjectName<string>): Expression<T>;
}
