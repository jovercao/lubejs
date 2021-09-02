import { SQL, SQL_SYMBOLE } from "../../sql";
import { Condition } from "../../condition/condition";

/**
 * 检查约束
 */
 export class CheckConstraint extends SQL {
  $type: SQL_SYMBOLE.CHECK_CONSTRAINT = SQL_SYMBOLE.CHECK_CONSTRAINT;
  $name?: string;
  $sql: Condition;

  constructor(sql: Condition, name?: string) {
    super();
    this.$name = name;
    this.$sql = sql;
  }
}

export type CheckConstraintBuilder = {
  (sql: Condition): CheckConstraint;
  (name: string, sql: Condition): CheckConstraint;
};
