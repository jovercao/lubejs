import assert from 'assert';
import { CompatibleCondition, Condition } from '../../condition';
import { CompatibleExpression, Expression } from '../../expression/expression';
import { TableVariant } from '../../rowset';
import { CompatibleTable, Table } from '../../rowset/table';
import { Scalar } from '../../scalar';
import { InputObject, RowObject } from '../../types';
import { isPlainObject } from '../../util';
import { Assignment } from '../programmer/assignment';
import { Statement, STATEMENT_KIND } from '../statement';
import { Fromable } from './common/fromable';

/**
 * Update 语句
 */
export class Update<T extends RowObject = any> extends Fromable<T> {
  $table: Table<T>;
  $sets?: Assignment<Scalar>[];

  readonly $kind: STATEMENT_KIND.UPDATE = STATEMENT_KIND.UPDATE;

  constructor(table: CompatibleTable<T>) {
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
              Expression.ensure(value as CompatibleExpression)
            )
        );
        return this;
      }
    }
    this.$sets = sets as Assignment<Scalar>[];
    return this;
  }

  protected ensureCondition(condition: CompatibleCondition<T>): Condition {
    if (isPlainObject(condition)) {
      return Condition.ensure(condition, this.$table);
    }
    return condition;
  }

  static isUpdate(object: any): object is Update {
    return (
      Statement.isStatement(object) && object.$kind === STATEMENT_KIND.UPDATE
    );
  }
}
