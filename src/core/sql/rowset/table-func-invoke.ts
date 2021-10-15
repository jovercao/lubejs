import { SQL, SQL_SYMBOLE } from '../sql';
import { XExpression, Expression, Field } from '../expression';
import { BuiltIn, XObjectName, Func, Star } from '../object';
import { Rowset } from './rowset';
import { Scalar } from '../scalar';
import {
  ColumnsOf,
  DataRowValueType,
  DefaultRowObject,
  RowObject,
} from '../types';

export class TableFuncInvoke<
  TReturn extends RowObject = DefaultRowObject
> extends Rowset<TReturn> {
  readonly $func: Func<string>;
  readonly $args: (Expression<Scalar> | Star | BuiltIn)[];
  readonly $type: SQL_SYMBOLE.TABLE_FUNCTION_INVOKE =
    SQL_SYMBOLE.TABLE_FUNCTION_INVOKE;

  $name?: string;
  $alias?: never;
  static isTableFuncInvoke(object: any): object is TableFuncInvoke {
    return object?.$type === SQL_SYMBOLE.TABLE_FUNCTION_INVOKE;
  }

  constructor(
    func: XObjectName | Func<string>,
    args: (XExpression<Scalar> | BuiltIn<string> | Star)[]
  ) {
    super();
    this.$func = Func.ensure(func);
    this.$args = args.map(expr =>
      expr instanceof SQL ? expr : SQL.literal(expr)
    );
    this.$proxy();
  }

  static create<T extends RowObject = DefaultRowObject>(
    func: XObjectName | Func<string>,
    args: (XExpression<Scalar> | BuiltIn<string> | Star)[]
  ): XTableFuncInvoke<T> {
    return new TableFuncInvoke(func, args) as XTableFuncInvoke<T>;
  }
}

/**
 * 代理后的表
 */
export type XTableFuncInvoke<T extends RowObject = RowObject> =
  TableFuncInvoke<T> &
    {
      readonly [P in ColumnsOf<T>]: Field<DataRowValueType<T[P]>, string>;
    };
