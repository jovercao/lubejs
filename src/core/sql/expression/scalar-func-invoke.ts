import { SQL, SQL_SYMBOLE } from '../sql';
import { XExpression, Expression } from './expression';
import { Func, BuiltIn, XObjectName, Star } from '../object';
import { Scalar } from '../scalar';

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
    func: XObjectName | Func<string>,
    args: (XExpression<Scalar> | BuiltIn<string> | Star)[]
  ) {
    super();
    this.$func = Func.ensure(func);
    this.$args = args.map(expr => {
      if (!(expr instanceof SQL)) return SQL.literal(expr);
      return expr;
    });
  }
}
