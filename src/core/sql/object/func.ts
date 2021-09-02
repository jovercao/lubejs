import { SQL_SYMBOLE } from '../sql';
import { CompatibleExpression, Expression } from '../expression/expression';
import { ProxiedRowset, Rowset } from '../rowset/rowset';
import { Scalar } from '../scalar';
import { Star } from '../statement/crud/star';
import { TableFuncInvoke } from '../statement/programmer/table-func-invoke';
import { DefaultRowObject, RowObject } from '../types';
import { BuiltIn } from './built-in';
import { CompatiableObjectName, DBObject } from './db-object';
import { ScalarFuncInvoke } from '../statement/programmer/scalar-func-invoke';

export class Func<
  N extends string = string
  // K extends FUNCTION_TYPE = FUNCTION_TYPE.SCALAR
> extends DBObject<N> {
  readonly $type: SQL_SYMBOLE.FUNCTION = SQL_SYMBOLE.FUNCTION;

  /**
   * 如果未传函数类型，则使用标题函数作为默认类型
   */
  constructor(
    name: CompatiableObjectName<N>,
    buildIn = false
    // type?: K
  ) {
    super(name, buildIn);
    // this.$ftype = type || (FUNCTION_TYPE.SCALAR as K)
  }

  invokeAsTable<T extends RowObject = DefaultRowObject>(
    ...args: (CompatibleExpression<Scalar> | BuiltIn<string> | Star)[]
  ): ProxiedRowset<T> {
    return new TableFuncInvoke(this, args) as any;
  }

  invokeAsScalar<T extends Scalar>(
    ...args: (CompatibleExpression<Scalar> | BuiltIn<string> | Star)[]
  ): Expression<T> {
    return new ScalarFuncInvoke(this, args);
  }

  static isFunc(object: any): object is Func {
    return object?.$type === SQL_SYMBOLE.FUNCTION;
  }

  static ensure(object: CompatiableObjectName | Func): Func {
    if (Func.isFunc(object)) return object;
    return new Func(object);
  }
}
