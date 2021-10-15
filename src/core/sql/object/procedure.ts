import { SQL_SYMBOLE } from '../sql';
import type { Scalar } from '../scalar';
import type { InputObject, RowObject } from '../types';
import { XObjectName, DBObject } from './db-object';

/**
 * @param N 存储过程名称
 * @param R 返回值
 * @param O 输出行集
 */
export class Procedure<
  R extends Scalar = number,
  O extends RowObject[] = [],
  N extends string = string
  // P1 extends Scalar = never,
  // P2 extends Scalar = never,
  // P3 extends Scalar = never,
  // P4 extends Scalar = never,
  // P5 extends Scalar = never,
  // P6 extends Scalar = never,
  // P7 extends Scalar = never,
  // P8 extends Scalar = never,
  // P9 extends Scalar = never,
  // P10 extends Scalar = never,
  // P11 extends Scalar = never,
  // P12 extends Scalar = never
> extends DBObject<N> {
  readonly $type: SQL_SYMBOLE.PROCEDURE = SQL_SYMBOLE.PROCEDURE;

  execute(...params: [XExpression]): Execute<R>;
  execute(...params: Parameter<Scalar, string>[]): Execute<R>;
  execute(params: InputObject): Execute<R>;
  execute(
    ...params:
      | [InputObject]
      | Parameter<Scalar, string>[]
      | XExpression<Scalar>[]
  ): Execute<R, O> {
    return new Execute(this.$name, params as any);
  }

  static isProcedure(object: any): object is Procedure<any, any, any> {
    return object?.$type === SQL_SYMBOLE.PROCEDURE;
  }

  static ensure(
    proc: XObjectName | Procedure<any, any, any>
  ): Procedure<any, any, any> {
    if (Procedure.isProcedure(proc)) {
      return proc;
    }
    return new Procedure(proc);
  }
}

import { XExpression, Parameter } from '../expression';
import { Execute } from '../statement';
import { isConstructorDeclaration } from 'typescript';
