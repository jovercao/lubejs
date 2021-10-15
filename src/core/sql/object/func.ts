import { SQL_SYMBOLE } from '../sql';
import { Scalar } from '../scalar';
import { DefaultRowObject, RowObject } from '../types';
import { XObjectName, DBObject } from './db-object';
import { BuiltIn } from './built-in';
import { Star } from './star';

export class Func<
  N extends string = string
  // K extends FUNCTION_TYPE = FUNCTION_TYPE.SCALAR
> extends DBObject<N> {
  readonly $type: SQL_SYMBOLE.FUNCTION = SQL_SYMBOLE.FUNCTION;

  /**
   * 如果未传函数类型，则使用标题函数作为默认类型
   */
  constructor(
    name: XObjectName<N>,
    buildIn = false
    // type?: K
  ) {
    super(name, buildIn);
    // this.$ftype = type || (FUNCTION_TYPE.SCALAR as K)
  }

  invokeAsTable<T extends RowObject = DefaultRowObject>(
    ...args: (XExpression<Scalar> | BuiltIn<string> | Star)[]
  ): XRowset<T> {
    return new TableFuncInvoke(this, args) as any;
  }

  invokeAsScalar<T extends Scalar>(
    ...args: (XExpression<Scalar> | BuiltIn<string> | Star)[]
  ): Expression<T> {
    return new ScalarFuncInvoke(this, args);
  }

  static isFunc(object: any): object is Func {
    return object?.$type === SQL_SYMBOLE.FUNCTION;
  }

  static ensure(object: XObjectName | Func): Func {
    if (Func.isFunc(object)) return object;
    return new Func(object);
  }
}

import { ScalarFuncInvoke, XExpression, Expression } from '../expression';
import { XRowset, TableFuncInvoke } from '../rowset';
