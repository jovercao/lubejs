import Decimal from "decimal.js-light";
import { Star, CompatibleExpression, Scalar, Expression, Numeric, Uuid, DbType, TsTypeOf, CompatiableObjectName, Condition } from "../sql";
import { Standard } from "../standard";
import { DbProvider } from "./db-provider";

export abstract class StandardTranslator implements Standard {
  constructor(public provider: DbProvider) {

  }

  get sqlUtil() {
    return this.provider.sqlUtil;
  }

  abstract count(expr: Star<any> | CompatibleExpression<Scalar>): Expression<number>;

  abstract avg<T extends Numeric>(expr: CompatibleExpression<T>): Expression<T>;

  abstract sum<T extends Numeric>(expr: CompatibleExpression<T>): Expression<T>;

  abstract max<T extends string | number | bigint | boolean | Decimal | Date | Uuid | null>(expr: Expression<T>): Expression<T>;

  abstract min<T extends string | number | bigint | boolean | Decimal | Date | Uuid | null>(expr: Expression<T>): Expression<T>;

  abstract identityValue(table: CompatibleExpression<string>, column: CompatibleExpression<string>): Expression<number | bigint>;

  abstract convert<T extends DbType>(expr: CompatibleExpression<Scalar>, toType: T): Expression<TsTypeOf<T>>;

  abstract now(): Expression<Date>;

  abstract utcNow(): Expression<Date>;

  abstract switchTimezone(date: CompatibleExpression<Date>, offset: CompatibleExpression<string>): Expression<Date>;

  abstract formatDate(date: CompatibleExpression<Date>, format: string): Expression<string>;

  abstract yearOf(date: CompatibleExpression<Date>): Expression<number>;

  abstract monthOf(date: CompatibleExpression<Date>): Expression<number>;

  abstract dayOf(date: CompatibleExpression<Date>): Expression<number>;

  abstract daysBetween(start: CompatibleExpression<Date>, end: CompatibleExpression<Date>): Expression<number>;

  abstract monthsBetween(start: CompatibleExpression<Date>, end: CompatibleExpression<Date>): Expression<number>;

  abstract yearsBetween(start: CompatibleExpression<Date>, end: CompatibleExpression<Date>): Expression<number>;

  abstract hoursBetween(start: CompatibleExpression<Date>, end: CompatibleExpression<Date>): Expression<number>;

  abstract minutesBetween(start: CompatibleExpression<Date>, end: CompatibleExpression<Date>): Expression<number>;

  abstract secondsBetween(start: CompatibleExpression<Date>, end: CompatibleExpression<Date>): Expression<number>;

  abstract addDays(date: CompatibleExpression<Date>, days: CompatibleExpression<Numeric>): Expression<Date>;

  abstract addMonths(date: CompatibleExpression<Date>, months: CompatibleExpression<Numeric>): Expression<Date>;

  abstract addYears(date: CompatibleExpression<Date>, years: CompatibleExpression<Numeric>): Expression<Date>;

  abstract addHours(date: CompatibleExpression<Date>, hours: CompatibleExpression<Numeric>): Expression<Date>;

  abstract addMinutes(date: CompatibleExpression<Date>, minutes: CompatibleExpression<Numeric>): Expression<Date>;

  abstract addSeconds(date: CompatibleExpression<Date>, seconds: CompatibleExpression<Numeric>): Expression<Date>;

  abstract strlen(str: CompatibleExpression<string>): Expression<number>;

  abstract substr(str: CompatibleExpression<string>, start: CompatibleExpression<Numeric>, length: CompatibleExpression<Numeric>): Expression<string>;

  abstract replace(str: CompatibleExpression<string>, search: CompatibleExpression<string>, to: CompatibleExpression<string>): Expression<string>;

  abstract trim(str: CompatibleExpression<string>): Expression<string>;

  abstract trimEnd(str: CompatibleExpression<string>): Expression<string>;

  abstract upper(str: CompatibleExpression<string>): Expression<string>;

  abstract lower(str: CompatibleExpression<string>): Expression<string>;

  abstract strpos(str: CompatibleExpression<string>, search: CompatibleExpression<string>, startAt?: CompatibleExpression<number>): Expression<number>;

  abstract ascii(str: CompatibleExpression<string>): Expression<number>;

  abstract asciiChar(code: CompatibleExpression<number>): Expression<string>;

  abstract unicode(str: CompatibleExpression<string>): Expression<number>;

  abstract unicodeChar(code: CompatibleExpression<number>): Expression<string>;

  abstract nvl<T extends Scalar>(value: CompatibleExpression<T>, defaultValue: CompatibleExpression<T>): Expression<T>;

  abstract abs<T extends Numeric>(value: CompatibleExpression<T>): Expression<T>;

  abstract exp<T extends Numeric>(value: CompatibleExpression<T>): Expression<T>;

  abstract ceil<T extends Numeric>(value: CompatibleExpression<T>): Expression<T>;

  abstract floor<T extends Numeric>(value: CompatibleExpression<T>): Expression<T>;

  abstract ln<T extends Numeric>(value: CompatibleExpression<T>): Expression<T>;

  abstract log<T extends Numeric>(value: CompatibleExpression<T>): Expression<T>;

  abstract pi(): Expression<number>;

  abstract power<T extends Numeric>(a: CompatibleExpression<T>, b: CompatibleExpression<Numeric>): Expression<T>;

  abstract radians<T extends Numeric>(value: CompatibleExpression<T>): Expression<T>;

  abstract degrees<T extends Numeric>(value: CompatibleExpression<T>): Expression<T>;

  abstract random(): Expression<number>;

  abstract round<T extends Numeric>(value: CompatibleExpression<T>, s?: CompatibleExpression<Numeric>): Expression<T>;

  abstract sign<T extends Numeric>(value: CompatibleExpression<T>): Expression<T>;

  abstract sqrt(value: CompatibleExpression<Numeric>): Expression<number>;

  abstract cos(value: CompatibleExpression<Numeric>): Expression<number>;

  abstract sin(value: CompatibleExpression<Numeric>): Expression<number>;

  abstract tan(value: CompatibleExpression<Numeric>): Expression<number>;

  abstract acos(value: CompatibleExpression<Numeric>): Expression<number>;

  abstract asin(value: CompatibleExpression<Numeric>): Expression<number>;

  abstract atan(value: CompatibleExpression<Numeric>): Expression<number>;

  abstract atan2(value: CompatibleExpression<Numeric>): Expression<number>;

  abstract cot(value: CompatibleExpression<Numeric>): Expression<number>;

  abstract existsTable(table: CompatiableObjectName<string>): Condition;

  abstract existsDatabase(database: string): Condition;

  abstract existsView(name: CompatiableObjectName<string>): Condition;

  abstract existsFunction(name: CompatiableObjectName<string>): Condition;

  abstract existsProcedure(name: CompatiableObjectName<string>): Condition;

  abstract existsSequence(name: CompatiableObjectName<string>): Condition;

  abstract currentDatabase(): Expression<string>;

  abstract defaultSchema(): Expression<string>;

  abstract sequenceNextValue<T extends Numeric>(sequenceName: CompatiableObjectName<string>): Expression<T>;
}
