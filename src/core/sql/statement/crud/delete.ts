import { XCondition, Condition } from '../../condition';
import { TableVariant, XTables, Table } from '../../rowset';
import { RowObject } from '../../types';
import { Statement, STATEMENT_KIND } from '../statement';
import { Fromable } from './common/fromable';

export class Delete<T extends RowObject = any> extends Fromable<T> {
  static isDelete(object: any): object is Delete {
    return (
      Statement.isStatement(object) && object.$kind === STATEMENT_KIND.DELETE
    );
  }
  $table: Table<T>;
  $kind: STATEMENT_KIND.DELETE = STATEMENT_KIND.DELETE;

  constructor(table: XTables<T>) {
    super();
    this.$table =
      Table.isTable(table) || TableVariant.isTableVariant(table)
        ? (table as Table<T>)
        : Table.create(table);
  }

  protected ensureCondition(condition: XCondition<T>): Condition {
    if (!Condition.isCondition(condition)) {
      return Condition.parse(condition, this.$table);
    }
    return condition;
  }
}
