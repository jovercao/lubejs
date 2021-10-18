import { SQL_SYMBOLE } from '../sql';
import { DbType, DbTypeFromScalar } from '../db-type';
import { BaseScalar, Decimal, Scalar, Time, Uuid } from '../scalar';
import { Expression } from './expression';

/**
 * 字面量表达式
 */
export class Literal<T extends Scalar = Scalar> extends Expression<T> {
  constructor(value: T, dbType?: DbTypeFromScalar<T>) {
    super();
    this.$value = value;
    // this.$dbType = dbType ? dbType : Literal.parseValueType(value);
    this.$dbType = dbType;
  }

  readonly $type: SQL_SYMBOLE.LITERAL = SQL_SYMBOLE.LITERAL;

  /**
   * 实际值
   */
  readonly $value: T;
  $dbType?: DbType;
  static isLiteral(object: any): object is Literal {
    return object?.$type === SQL_SYMBOLE.LITERAL;
  }

  valueOf() {
    return this.$value;
  }

  fitType() {
    if (!this.$dbType) {
      this.$dbType = Literal.parseValueType(this.$value);
    }
  }

  static ensureLiteral<T extends Scalar>(value: T | Literal<T>): Literal<T> {
    return Literal.isLiteral(value) ? value : new Literal(value);
  }

  /**
   * 解释值的类型
   */
  static parseValueType(value: Scalar): DbType {
    if (value === undefined)
      throw new Error('Do not parse DbType from null or undefined');
    // 如果为null值，默认为int32类型
    if (value === null) return DbType.int32;

    switch (value.constructor) {
      case String:
        return DbType.string(0);
      case Number:
        if (
          Number.isInteger(value) &&
          value >= -2147483648 &&
          value <= 2147483647
        ) {
          return DbType.int32;
        }
        return DbType.float64;
      case Date:
        return DbType.datetime;
      case Boolean:
        return DbType.boolean;
      case Uuid:
        return DbType.uuid;
      case Time:
        return DbType.time;
      case Decimal:
        return DbType.decimal(18, 8);
      case BigInt:
        return DbType.int64;
      case Buffer:
      case ArrayBuffer:
      case SharedArrayBuffer:
        return DbType.binary(DbType.MAX);
      case Array:
        return DbType.list(
          (Literal.parseValueType((value as Array<BaseScalar>)[0]) ||
            null) as any
        );
      default:
        return DbType.json();
    }
  }
}
