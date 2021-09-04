import { SQL, SQL_SYMBOLE } from "../../../sql";
import { Condition } from "../../../condition/condition";
import { CompatiableObjectName } from "../../../object/db-object";
import { ProxiedRowset, Rowset } from "../../../rowset/rowset";

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
  constructor(
    table: CompatiableObjectName | ProxiedRowset,
    on: Condition,
    left = false
  ) {
    super();

    this.$table = Rowset.ensure(table);
    this.$on = on;
    this.$left = left;
  }
}
