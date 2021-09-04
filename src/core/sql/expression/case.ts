import { SQL_SYMBOLE } from "../sql";
import { Condition } from "../condition/condition";
import { Scalar } from "../scalar";
import { When } from "./when";
import { CompatibleExpression, Expression } from "./expression";

/**
 * CASE表达式
 */
 export class Case<T extends Scalar = any> extends Expression<T> {
  $expr?: Expression<any>;
  $whens: When<T>[];
  $default?: Expression<T>;
  $type: SQL_SYMBOLE.CASE = SQL_SYMBOLE.CASE;
   static isCase(object: any): object is Case {
    return object?.$type === SQL_SYMBOLE.CASE;
   }

  /**
   *
   * @param expr
   */
  constructor(expr?: CompatibleExpression<Scalar>) {
    super();
    if (expr !== undefined) {
      this.$expr = Expression.ensure(expr);
    }
    /**
     * @type {When[]}
     */
    this.$whens = [];
  }

  /**
   * ELSE语句
   * @param defaults
   */
  else(defaults: CompatibleExpression<T>): this {
    this.$default = Expression.ensure(defaults as CompatibleExpression<any>);
    return this;
  }

  /**
   * WHEN语句
   * @param expr
   * @param then
   */
  when(
    expr: CompatibleExpression<Scalar> | Condition,
    then: CompatibleExpression<T>
  ): this {
    this.$whens.push(new When(expr, then));
    return this;
  }
}
