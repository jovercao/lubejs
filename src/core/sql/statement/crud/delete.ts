import { CompatibleCondition, Condition } from "../../condition";
import { CompatibleTable, Table } from "../../rowset/table";
import { RowObject } from "../../types";
import { isPlainObject } from "../../util";
import { Statement, STATEMENT_KIND } from "../statement";
import { Fromable } from "./common/fromable";

export class Delete<T extends RowObject = any> extends Fromable<T> {
  static isDelete(object: any): object is Delete {
    return Statement.isStatement(object) && object.$kind === STATEMENT_KIND.DELETE
  }
  $table: Table<T, string>;
  $kind: STATEMENT_KIND.DELETE = STATEMENT_KIND.DELETE;

  constructor(table: CompatibleTable<T, string>) {
    super();
    this.$table = Table.ensure(table) as Table<T, string>;
  }

  protected ensureCondition(condition: CompatibleCondition<T>): Condition {
    if (isPlainObject(condition)) {
      return Condition.ensure(condition, this.$table);
    }
    return condition
  }
}
