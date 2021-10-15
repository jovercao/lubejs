import { SQL, SQL_SYMBOLE } from '../../../sql';
import { Condition } from '../../../condition';
import { XObjectName } from '../../../object';
import { Rowset, XRowsets, Table } from '../../../rowset';

/**
 * 联接查询
 */
export class Join extends SQL {
  readonly $type: SQL_SYMBOLE.JOIN = SQL_SYMBOLE.JOIN;
  $left: boolean;
  $table: Rowset;
  $on: Condition;

  /**
   * 创建一个表关联
   * @param table
   * @param on 关联条件
   * @param left 是否左联接
   */
  constructor(table: XRowsets<any> | XObjectName, on: Condition, left = false) {
    super();

    this.$table = Rowset.isRowset(table) ? table : Table.create(table);
    this.$on = on;
    this.$left = left;
  }
}
