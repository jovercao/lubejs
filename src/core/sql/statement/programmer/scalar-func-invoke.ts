import { SQL_SYMBOLE } from '../../sql';
import { CompatibleExpression, Expression } from '../../expression/expression';
import { BuiltIn } from '../../object/built-in';
import { CompatiableObjectName } from '../../object/db-object';
import { Func } from '../../object/func';
import { Scalar } from '../../scalar';
import { isScalar } from '../../scalar/util';
import { Star } from '../crud/star';

/**
 * 函数调用表达式
 */
export class ScalarFuncInvoke<
  TReturn extends Scalar = any
> extends Expression<TReturn> {
  $func: Func<string>;
  $args: (Expression<Scalar> | BuiltIn<string> | Star)[];
  readonly $type: SQL_SYMBOLE.SCALAR_FUNCTION_INVOKE =
    SQL_SYMBOLE.SCALAR_FUNCTION_INVOKE;
  static isScalarFuncInvoke(object: any): object is ScalarFuncInvoke {
    return object?.$type === SQL_SYMBOLE.SCALAR_FUNCTION_INVOKE;
  }

  // TODO: 是否需参数的类型判断，拦截ValuedSelect之类的表达式进入？
  constructor(
    func: CompatiableObjectName | Func<string>,
    args: (CompatibleExpression<Scalar> | BuiltIn<string> | Star)[]
  ) {
    super();
    this.$func = Func.ensure(func);
    this.$args = args.map(expr => {
      if (isScalar(expr)) return Expression.ensure(expr);
      return expr;
    });
  }
}
