import { CompatibleCondition, Condition } from '../../condition';
import { TableVariant } from '../../rowset';
import { CompatibleTable, Table } from '../../rowset/table';
import { RowObject } from '../../types';
import { isPlainObject } from '../../util';
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

  constructor(table: CompatibleTable<T>) {
    super();
    this.$table =
      Table.isTable(table) || TableVariant.isTableVariant(table)
        ? (table as Table<T>)
        : Table.create(table);
  }

  protected ensureCondition(condition: CompatibleCondition<T>): Condition {
    if (isPlainObject(condition)) {
      return Condition.ensure(condition, this.$table);
    }
    return condition;
  }
}
