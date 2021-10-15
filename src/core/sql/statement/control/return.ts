import { XExpression, Expression } from '../../expression';
import { SQL } from '../../sql';
import { Statement, STATEMENT_KIND } from '../statement';

export class Return extends Statement {
  $kind: STATEMENT_KIND.RETURN = STATEMENT_KIND.RETURN;
  $value?: Expression;
  constructor(value?: XExpression) {
    super();
    this.$value = Expression.isExpression(value)
      ? value
      : SQL.literal(value ?? null);
  }

  static isReturn(object: any): object is Return {
    return (
      Statement.isStatement(object) && object.$kind === STATEMENT_KIND.RETURN
    );
  }
}
