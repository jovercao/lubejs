import { CompatibleCondition, Condition } from "../../../condition/condition";
import { RowObject } from "../../../types";
import { ProxiedRowset, Rowset } from "../../../rowset/rowset"
import { CompatiableObjectName } from "../../../object/db-object";
import { With } from "../with";
import { Join } from "./join";
import { Statement } from "../../statement";
import assert from "assert";
import { isPlainObject } from "../../../util";

export abstract class Fromable<T extends RowObject = any> extends Statement {
  $froms?: ProxiedRowset[];
  $joins?: Join[];
  $where?: Condition;
  $with?: With;

  /**
   * 从表中查询，可以查询多表
   * @param tables
   */
  from(...tables: (CompatiableObjectName | ProxiedRowset)[]): this {
    this.$froms = tables.map(table => Rowset.ensure(table));
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
    table: CompatiableObjectName | ProxiedRowset<T>,
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
    table: CompatiableObjectName | ProxiedRowset<T>,
    on: Condition
  ): this {
    return this.join(table, on, true);
  }

  /**
   * where查询条件
   * @param condition
   */
  where(condition: CompatibleCondition<T>) {
    assert(!this.$where, 'where is declared');
    if (isPlainObject(condition)) {
      condition = Condition.ensure(condition);
    }
    this.$where = condition as Condition;
    return this;
  }

  /**
   * 追加查询条件
   * @param condition
   * @returns
   */
  andWhere(condition: CompatibleCondition<T>) {
    if (!this.$where) return this.where(condition);
    this.$where = Condition.and(this.$where, condition);
    return this;
  }
}
