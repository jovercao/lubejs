import { SQL_SYMBOLE } from "../ast";
import { Scalar } from "../scalar/scalar";
import { CompatibleExpression, Expression } from "./expression";

/**
 * 括号表达式
 */
 export class GroupExpression<T extends Scalar = Scalar> extends Expression<T> {
  $type: SQL_SYMBOLE.BRACKET_EXPRESSION = SQL_SYMBOLE.BRACKET_EXPRESSION;
  $inner: Expression<T>;
   static isGroupExpression(object: any): object is GroupExpression {
    return object?.$type === SQL_SYMBOLE.BRACKET_EXPRESSION;
   }
  constructor(inner: CompatibleExpression<T>) {
    super();
    this.$inner = Expression.ensure(inner);
  }
}
