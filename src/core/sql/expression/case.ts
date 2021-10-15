import { SQL, SQL_SYMBOLE } from '../sql';
import type { Condition } from '../condition/condition';
import type { Scalar } from '../scalar';
import { When } from './when';
import { XExpression, Expression } from './expression';

/**
 * CASE表达式
 */
export class Case<T extends Scalar = any> extends Expression<T> {
  $expr?: Expression<any>;
  $whens: When<T>[];
  $default?: Expression<T>;
  readonly $type: SQL_SYMBOLE.CASE = SQL_SYMBOLE.CASE;
  static isCase(object: any): object is Case {
    return object?.$type === SQL_SYMBOLE.CASE;
  }

  /**
   *
   * @param expr
   */
  constructor(expr?: XExpression<Scalar>) {
    super();
    if (expr !== undefined) {
      this.$expr = Expression.isExpression(expr) ? expr : SQL.literal(expr);
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
  else(defaults: XExpression<T>): this {
    this.$default = Expression.ensureExpression(defaults);
    return this;
  }

  /**
   * WHEN语句
   * @param expr
   * @param then
   */
  when(expr: XExpression<Scalar> | Condition, then: XExpression<T>): this {
    this.$whens.push(new When(expr, then));
    return this;
  }
}
