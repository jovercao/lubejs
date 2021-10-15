import assert from 'assert';
import { XCondition, Condition } from '../../../condition';
import { RowObject } from '../../../types';
import { XRowsets, XRowset, Rowset, Table } from '../../../rowset';
import { XObjectName } from '../../../object';
import type { With } from '../with';
import { Join } from './join';
import { Statement } from '../../statement';

export abstract class Fromable<T extends RowObject = any> extends Statement {
  $froms?: XRowset[];
  $joins?: Join[];
  $where?: Condition;
  $with?: With;

  /**
   * 从表中查询，可以查询多表
   * @param tables
   */
  from(...tables: (XRowsets | XObjectName)[]): this {
    this.$froms = tables.map(table =>
      Rowset.isRowset(table) ? table : Table.create(table)
    );
    this.$froms.forEach(table => {
      if (!table.$alias) {
        if (!(table as any).$name) {
          throw new Error('Rowset must give a name before query');
        }
      }
    });
    return this;
  }

  /**
   * 表联接
   * @param table
   * @param on
   * @param left
   * @memberof Select
   */
  join<T extends RowObject = any>(
    table: XRowsets<T> | XObjectName,
    on: Condition,
    left?: boolean
  ): this {
    assert(this.$froms, 'join must after from clause');
    if (!this.$joins) {
      this.$joins = [];
    }
    this.$joins.push(new Join(table, on, left));
    return this;
  }

  /**
   * 左联接
   * @param table
   * @param on
   */
  leftJoin<T extends RowObject = any>(
    table: XRowsets<T> | XObjectName,
    on: Condition
  ): this {
    return this.join(table, on, true);
  }

  protected ensureCondition(condition: XCondition<T>): Condition {
    if (!Condition.isCondition(condition)) {
      // 严格限制语法，字段名必须带上表别名
      assert(
        this.$froms,
        'The `.from` must call before where when use `WhereObject<T>` condition type.'
      );
      if (this.$froms?.length !== 1 || this.$joins) {
        throw new Error(
          'WhereObject<T> condition is not support for multi rowset source select statement.'
        );
      }
      const rowset = this.$froms?.[0];
      return Condition.isCondition(condition)
        ? condition
        : Condition.parse(condition, rowset);
    }
    return condition;
  }

  /**
   * where查询条件
   * @param condition
   */
  where(condition: XCondition<T>) {
    assert(!this.$where, 'where is declared');
    condition = this.ensureCondition(condition);
    this.$where = condition as Condition;
    return this;
  }

  /**
   * 追加查询条件
   * @param condition
   * @returns
   */
  andWhere(condition: XCondition<T>) {
    if (!this.$where) return this.where(condition);
    this.$where = Condition.and(this.$where, this.ensureCondition(condition));
    return this;
  }
}
