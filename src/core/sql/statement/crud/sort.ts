import { SQL, SQL_SYMBOLE } from '../../sql';
import { CompatibleExpression, Expression } from '../../expression/expression';
import { Scalar } from '../../scalar';
import { ColumnsOf, DefaultInputObject, RowObject } from '../../types';
import { SelectColumn } from './select-column';

export class Sort extends SQL {
  $type: SQL_SYMBOLE.SORT = SQL_SYMBOLE.SORT;
  $expr: Expression | SelectColumn;
  $direction?: SORT_DIRECTION;
  constructor(expr: CompatibleExpression<Scalar>, direction?: SORT_DIRECTION) {
    super();
    this.$expr = Expression.ensure(expr);
    this.$direction = direction;
  }

  static isSortInfo(object: any): object is Sort {
    return object?.$type === SQL_SYMBOLE.SORT;
  }
}

export type CompatibleSortInfo<T extends RowObject = DefaultInputObject> =
  | Sort[]
  | SortObject<T>
  | [CompatibleExpression, SORT_DIRECTION][];

export type SORT_DIRECTION = 'ASC' | 'DESC';

/**
 * 排序对象
 */
export type SortObject<T extends RowObject = any> = {
  [K in ColumnsOf<T>]?: SORT_DIRECTION;
};