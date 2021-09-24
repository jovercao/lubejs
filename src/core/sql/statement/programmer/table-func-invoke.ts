import { DefaultRowObject } from '../../../../core';
import { SQL_SYMBOLE } from '../../sql';
import { CompatibleExpression, Expression } from '../../expression/expression';
import { Field } from '../../expression/field';
import { BuiltIn } from '../../object/built-in';
import { CompatiableObjectName } from '../../object/db-object';
import { Func } from '../../object/func';
import { Rowset } from '../../rowset/rowset';
import { Scalar } from '../../scalar';
import { isScalar } from '../../scalar/util';
import { ColumnsOf, DbValueType, RowObject } from '../../types';
import { Star } from '../crud/star';

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
    func: CompatiableObjectName | Func<string>,
    args: (CompatibleExpression<Scalar> | BuiltIn<string> | Star)[]
  ) {
    super();
    this.$func = Func.ensure(func);
    this.$args = args.map(expr =>
      isScalar(expr) ? Expression.ensure(expr) : expr
    );
    this.$proxy();
  }

  static create<T extends RowObject = DefaultRowObject>(
    func: CompatiableObjectName | Func<string>,
    args: (CompatibleExpression<Scalar> | BuiltIn<string> | Star)[]
  ): ProxiedTableFuncInvoke<T> {
    return new TableFuncInvoke(func, args) as ProxiedTableFuncInvoke<T>;
  }
}

/**
 * 代理后的表
 */
export type ProxiedTableFuncInvoke<T extends RowObject = RowObject> =
  TableFuncInvoke<T> &
    {
      readonly [P in ColumnsOf<T>]: Field<DbValueType<T[P]>, string>;
    };
