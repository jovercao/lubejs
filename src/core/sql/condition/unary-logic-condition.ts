import { CompatibleCondition, Condition, CONDITION_KIND, LOGIC_OPERATOR } from "./condition";

/**
 * 一元逻辑查询条件
 */
 export class UnaryLogicCondition extends Condition {
  $operator: LOGIC_OPERATOR.NOT = LOGIC_OPERATOR.NOT;
  $condition: Condition;
  $kind: CONDITION_KIND.UNARY_LOGIC = CONDITION_KIND.UNARY_LOGIC;

  /**
   * 创建一元逻辑查询条件实例
   * @param operator
   * @param next
   */
  constructor(operator: LOGIC_OPERATOR.NOT, next: CompatibleCondition<any>) {
    super();
    this.$operator = operator;
    this.$condition = Condition.ensure(next);
  }

  static isUnaryLogicCondition(object: any): object is UnaryLogicCondition {
    return Condition.isCondition(object) && object.$kind === CONDITION_KIND.UNARY_LOGIC
  }
}
