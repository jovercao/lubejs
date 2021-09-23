import { Statement, STATEMENT_KIND } from '../statement';
import { Variant } from '../../expression';
import { TableVariant } from '../../rowset';
import { Block } from '../control';
import { SQL } from '../../sql';

/**
 * 声明语句，暂时只支持变量声明
 */
export class Declare extends Statement {
  static isDeclare(object: any): object is Declare {
    return (
      Statement.isStatement(object) && object.$kind === STATEMENT_KIND.DECLARE
    );
  }
  $declares: (Variant | TableVariant)[];
  $statement?: Block;
  $kind: STATEMENT_KIND.DECLARE = STATEMENT_KIND.DECLARE;
  constructor(members: (Variant | TableVariant)[]) {
    super();
    this.$declares = members;
  }

  as(...statements: Statement[] | [Statement[]]): this {
    this.$statement = SQL.block(statements as any);
    return this;
  }
}
