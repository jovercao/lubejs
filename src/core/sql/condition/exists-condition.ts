import type { Select } from '../statement';
import { Condition, CONDITION_KIND } from './condition';

/**
 * 一元比较条件
 */
export class ExistsCondition extends Condition {
  $statement: Select;
  $kind: CONDITION_KIND.EXISTS = CONDITION_KIND.EXISTS;

  /**
   * EXISTS子句
   * @param expr 查询条件
   */
  constructor(expr: Select) {
    super();
    this.$statement = expr;
  }

  static isExistsCondition(object: any): object is ExistsCondition {
    return (
      Condition.isCondition(object) && object.$kind === CONDITION_KIND.EXISTS
    );
  }
}
