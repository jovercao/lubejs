import { SQL_SYMBOLE } from "../ast";
import { CompatibleCondition, Condition, CONDITION_KIND, LOGIC_OPERATOR } from "./condition";
import { GroupCondition } from "./group-condition";

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
    left: CompatibleCondition<any>,
    right: CompatibleCondition<any>
  ) {
    super();
    this.$operator = operator;
    /**
     * 左查询条件
     */
    this.$left = Condition.ensure(left);
    /**
     * 右查询条件
     */
    this.$right = Condition.ensure(right);
  }

  static isBinaryLogicCondition(object: any): object is BinaryLogicCondition {
    return Condition.isCondition(object) && object.$kind === CONDITION_KIND.BINARY_LOGIC;
  }


  /**
   * 使用逻辑表达式联接多个条件
   */
  private static join(
    logic: LOGIC_OPERATOR.AND | LOGIC_OPERATOR.OR,
    conditions: CompatibleCondition[]
  ): Condition {
    if (conditions.length < 2) {
      throw new Error(`conditions must more than or equals 2 element.`);
    }
    const cond: Condition = conditions.reduce((previous, current) => {
      let condition = Condition.ensure(current);
      // 如果是二元逻辑条件运算，则将其用括号括起来，避免逻辑运算出现优先级的问题
      if (BinaryLogicCondition.isBinaryLogicCondition(condition)) {
        condition = GroupCondition.group(condition);
      }
      if (!previous) return condition;
      return new BinaryLogicCondition(logic, previous, condition);
    }) as Condition;
    return GroupCondition.group(cond);
  }

  static and(conditions: CompatibleCondition[]): Condition;
  static and(
    ...conditions: [
      CompatibleCondition,
      CompatibleCondition,
      ...CompatibleCondition[]
    ]
  ): Condition;
  static and(...args:
    | CompatibleCondition[]
    | [CompatibleCondition[]]) {
    if (Array.isArray(args[0])) {
      args = args[0];
    }
    return BinaryLogicCondition.join(LOGIC_OPERATOR.AND, args as CompatibleCondition[])
  }

  static or(conditions: CompatibleCondition[]): Condition;
  static or(
    ...conditions: [
      CompatibleCondition,
      CompatibleCondition,
      ...CompatibleCondition[]
    ]
  ): Condition;
  static or(
    ...args:
      | CompatibleCondition[]
      | [CompatibleCondition[]]
  ): Condition {
    return BinaryLogicCondition.join(LOGIC_OPERATOR.OR, args as CompatibleCondition[])
  }
}
