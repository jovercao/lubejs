import { SQL, SQL_SYMBOLE } from '../../sql';
import { RowObject } from '../../types';
import { Select } from './select';

/**
 * 联接查询
 */
export class Union<T extends RowObject = any> extends SQL {
  $select: Select<T>;
  $all: boolean;
  $type: SQL_SYMBOLE.UNION = SQL_SYMBOLE.UNION;
  // $isRecurse: boolean;

  /**
   *
   * @param select SELECT语句
   * @param all 是否所有查询
   */
  constructor(select: Select<T>, all = false) {
    super();
    this.$select = select;
    this.$all = all;
  }
}
