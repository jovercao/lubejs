import { Assignable, XExpression, Expression } from '../../expression';
import { Scalar } from '../../scalar';
import { SQL } from '../../sql';
import { Statement, STATEMENT_KIND } from '../statement';

/**
 * 赋值语句
 */
export class Assignment<T extends Scalar = Scalar> extends Statement {
  static isAssignment(object: any): object is Assignment {
    return (
      Statement.isStatement(object) &&
      object.$kind === STATEMENT_KIND.ASSIGNMENT
    );
  }
  left: Assignable<T>;
  right: Expression<T>;
  $kind: STATEMENT_KIND.ASSIGNMENT = STATEMENT_KIND.ASSIGNMENT;

  constructor(left: Assignable<T>, right: XExpression<T>) {
    super();
    this.left = left;
    this.right = Expression.ensureExpression(right);
  }
}
