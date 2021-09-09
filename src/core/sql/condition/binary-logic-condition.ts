import { SQL_SYMBOLE } from "../sql";
import { CompatibleCondition, Condition, CONDITION_KIND, LOGIC_OPERATOR } from "./condition";

/**
 * 二元逻辑查询条件条件
 */
 export class BinaryLogicCondition extends Condition {
  $operator: LOGIC_OPERATOR;
  $left: Condition;
  $right: Condition;
  $type: SQL_SYMBOLE.CONDITION = SQL_SYMBOLE.CONDITION;
  $kind: CONDITION_KIND.BINARY_LOGIC = CONDITION_KIND.BINARY_LOGIC;
  /**
   * 创建二元逻辑查询条件实例
   */
  constructor(
    operator: LOGIC_OPERATOR,
    left: Condition,
    right: Condition
  ) {
    super();
    this.$operator = operator;
    /**
     * 左查询条件
     */
    this.$left = left
    /**
     * 右查询条件
     */
    this.$right = right
  }

  static isBinaryLogicCondition(object: any): object is BinaryLogicCondition {
    return Condition.isCondition(object) && object.$kind === CONDITION_KIND.BINARY_LOGIC;
  }
}
