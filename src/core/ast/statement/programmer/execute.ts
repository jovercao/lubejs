import { CompatibleExpression, Expression } from '../../expression/expression';
import { CompatiableObjectName } from '../../object/db-object';
import { Procedure } from '../../object/procedure';
import { Scalar } from '../../scalar';
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
    return Statement.isStatement(object) && object.$kind === STATEMENT_KIND.EXECUTE;
  }
  readonly $proc: Procedure<R, O, string>;
  readonly $args: Expression<Scalar>[];
  readonly $kind: STATEMENT_KIND.EXECUTE = STATEMENT_KIND.EXECUTE;

  constructor(
    proc: CompatiableObjectName | Procedure<R, O, string>,
    params?: CompatibleExpression<Scalar>[]
  ) {
    super();
    this.$proc = Procedure.ensure(proc);

    this.$args = (params as CompatibleExpression<Scalar>[]).map(expr =>
      Expression.ensure(expr)
    );
  }
}
