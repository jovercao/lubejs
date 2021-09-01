import { SQL_SYMBOLE } from '../ast';
import { DbType } from '../db-type';
import { Scalar } from '../scalar';
import { Expression } from './expression';

/**
 * 字面量表达式
 */
export class Literal<T extends Scalar = Scalar> extends Expression<T> {
  $type: SQL_SYMBOLE.LITERAL = SQL_SYMBOLE.LITERAL;

  /**
   * 实际值
   */
  $value: T;
  static isLiteral(object: any): object is Literal {
    return object?.$type === SQL_SYMBOLE.LITERAL;
  }

  valueOf() {
    return this.$value;
  }

  constructor(value: T) {
    super();
    this.$value = value;
  }

  static isLiterial(object: any): object is Literal<any> {
    return object?.$type === SQL_SYMBOLE.LITERAL;
  }

  static ensureLiterial<T extends Scalar>(value: T | Literal<T>): Literal<T> {
    return Literal.isLiterial(value) ? value : new Literal(value);
  }

  /**
   * 解释值的类型
   */
  static parseValueType(value: Scalar): DbType {
    if (value === null || value === undefined)
      throw new Error('Do not parse DbType from null or undefined');
    switch (value.constructor) {
      case String:
        return DbType.string(0);
      case Number:
        return DbType.int32;
      case Date:
        return DbType.datetime;
      case Boolean:
        return DbType.boolean;
      case Buffer:
      case ArrayBuffer:
      case SharedArrayBuffer:
        return DbType.binary(0);
      default:
        throw new Error('Invalid value.');
    }
  }
}
