import { Scalar } from '../../scalar';
import { SQL } from '../../sql';
import { XExpression, Expression } from '../../expression';
import { XObjectName, Procedure } from '../../object';
import { RowObject } from '../../types';
import { Statement, STATEMENT_KIND } from '../statement';

/**
 * 存储过程执行
 */
export class Execute<
  R extends Scalar = any,
  O extends RowObject[] = []
> extends Statement {
  static isExecute(object: any): object is Execute {
    return (
      Statement.isStatement(object) && object.$kind === STATEMENT_KIND.EXECUTE
    );
  }
  readonly $proc: Procedure<R, O, string>;
  readonly $args: Expression<Scalar>[];
  readonly $kind: STATEMENT_KIND.EXECUTE = STATEMENT_KIND.EXECUTE;

  constructor(
    proc: XObjectName | Procedure<R, O, string>,
    params?: XExpression<Scalar>[]
  ) {
    super();
    this.$proc = Procedure.ensure(proc);

    this.$args = (params as XExpression<Scalar>[]).map(expr =>
      Expression.isExpression(expr) ? expr : SQL.literal(expr)
    );
  }
}
