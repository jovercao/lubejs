import { AST, SQL_SYMBOLE } from "../ast";
import { Condition } from "../condition/condition";
import { CompatibleExpression, Expression } from "./expression";
import { Scalar } from "../scalar";
import { isScalar } from "../scalar/util";

/**
 * When语句
 */
 export class When<T extends Scalar = any> extends AST {
  $expr: Expression<Scalar> | Condition;
  $value: Expression<T>;
  $type: SQL_SYMBOLE.WHEN = SQL_SYMBOLE.WHEN;

  constructor(
    expr: CompatibleExpression<Scalar> | Condition,
    then: CompatibleExpression<T>
  ) {
    super();
    if (Expression.isExpression(expr) || Condition.isCondition(expr)) {
      this.$expr = expr;
    }
    if (isScalar(expr)) {
      this.$expr = Expression.ensure(expr as Scalar);
    } else {
      this.$expr = expr;
    }
    this.$value = Expression.ensure(then);
  }
}
