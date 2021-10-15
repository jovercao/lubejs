import assert from 'assert';
import { XCondition, Condition } from '../../condition';
import { Expression } from '../../expression';
import { TableVariant, XTables, Table } from '../../rowset';
import { Scalar } from '../../scalar';
import { SQL } from '../../sql';
import { InputObject, RowObject } from '../../types';
import { Statement, STATEMENT_KIND } from '../statement';
import { Fromable } from './common/fromable';
import { Assignment } from '../programmer';

/**
 * Update 语句
 */
export class Update<T extends RowObject = any> extends Fromable<T> {
  $table: Table<T>;
  $sets?: Assignment<Scalar>[];

  readonly $kind: STATEMENT_KIND.UPDATE = STATEMENT_KIND.UPDATE;

  constructor(table: XTables<T>) {
    super();
    const tb =
      Table.isTable(table) || TableVariant.isTableVariant(table)
        ? table
        : Table.create(table);
    if (tb.$alias) {
      this.from(tb);
    }
    this.$table = tb as Table<T>;
  }

  /**
   * @param sets
   */
  set(sets: InputObject<T> | Assignment<Scalar>[]): this;
  set(...sets: Assignment<Scalar>[]): this;
  set(
    ...sets: [InputObject<T> | Assignment<Scalar>[]] | Assignment<Scalar>[]
  ): this {
    assert(!this.$sets, 'set statement is declared');
    assert(sets.length > 0, 'sets must have more than 0 items');
    if (sets.length === 1) {
      if (Array.isArray(sets[0])) {
        this.$sets = sets[0] as Assignment<Scalar>[];
        return this;
      } else {
        const item = sets[0] as InputObject<T>;
        this.$sets = Object.entries(item).map(
          ([key, value]: [string, unknown]) =>
            new Assignment(
              this.$table.$field(key as any),
              Expression.isExpression(value)
                ? value
                : SQL.literal(value as Scalar)
            )
        );
        return this;
      }
    }
    this.$sets = sets as Assignment<Scalar>[];
    return this;
  }

  protected ensureCondition(condition: XCondition<T>): Condition {
    if (!Condition.isCondition(condition)) {
      return Condition.parse(condition, this.$table);
    }
    return condition;
  }

  static isUpdate(object: any): object is Update {
    return (
      Statement.isStatement(object) && object.$kind === STATEMENT_KIND.UPDATE
    );
  }
}
