import { SQL_SYMBOLE } from '../sql';
import { DbType, DbTypeOf, TsTypeOf } from '../db-type';
import { Scalar } from '../scalar';
import { Expression } from './expression';
import { Literal } from './literal';

/**
 * 参数方向
 */
export type PARAMETER_DIRECTION = 'IN' | 'OUT' | 'INOUT';

/**
 * 程序与数据库间传递值所使用的参数
 */
export class Parameter<
  T extends Scalar = any,
  N extends string = string
> extends Expression<T> {
  $name: N;
  $builtin = false;
  $type: SQL_SYMBOLE.PARAMETER = SQL_SYMBOLE.PARAMETER;
  static isParameter(object: any): object is Parameter {
    return object?.$type === SQL_SYMBOLE.PARAMETER;
  }
  get name() {
    return this.$name;
  }
  direction: PARAMETER_DIRECTION;
  type: DbType;
  value?: T;

  // constructor (name: N, value?: T)
  // constructor (
  //   name: N,
  //   type: DbType,
  //   value?: T,
  //   direction?: PARAMETER_DIRECTION
  // )
  constructor(
    name: N,
    type?: DbType,
    value?: T,
    direction: PARAMETER_DIRECTION = 'IN'
  ) {
    super();
    if (type) {
      this.type = type;
    } else {
      if (value === undefined) {
        throw new Error('Parameter must assign one of `value` or `type`.');
      }
      this.type = Literal.parseValueType(value);
    }
    this.$name = name;
    this.value = value;
    this.direction = direction;
  }
}
