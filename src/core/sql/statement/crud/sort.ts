import { Scalar } from '../../scalar';
import { SQL, SQL_SYMBOLE } from '../../sql';
import { ColumnsOf, DefaultInputObject, RowObject } from '../../types';
import { XExpression, Expression } from '../../expression';
import { SelectColumn } from './select-column';

export class Sort extends SQL {
  readonly $type: SQL_SYMBOLE.SORT = SQL_SYMBOLE.SORT;
  $expr: Expression | SelectColumn;
  $direction: SORT_DIRECTION;
  constructor(expr: XExpression<Scalar>, direction: SORT_DIRECTION = 'ASC') {
    super();
    this.$expr = Expression.isExpression(expr) ? expr : SQL.literal(expr);
    this.$direction = direction;
  }

  static isSort(object: any): object is Sort {
    return object?.$type === SQL_SYMBOLE.SORT;
  }
}

export type SORT_DIRECTION = 'ASC' | 'DESC';

/**
 * 排序对象
 */
export type SortObject<T extends RowObject = any> = {
  [K in ColumnsOf<T>]?: SORT_DIRECTION;
};
