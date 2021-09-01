import { CompatibleCondition, Condition, CONDITION_KIND } from "./condition";

export class GroupCondition extends Condition {
  $inner: Condition;

  readonly $kind: CONDITION_KIND.GROUP =
    CONDITION_KIND.GROUP;

  constructor(conditions: CompatibleCondition<any>) {
    super();
    this.$inner = Condition.ensure(conditions);
  }

  static isGroupCondition(object: any): object is GroupCondition {
    return Condition.isCondition(object) && object.$kind === CONDITION_KIND.GROUP
  }
}
