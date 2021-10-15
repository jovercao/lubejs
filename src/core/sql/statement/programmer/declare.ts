import { Statement, STATEMENT_KIND } from '../statement';
import { Variant } from '../../expression';
import { TableVariant } from '../../rowset';
import { Block } from '../control';
import { SQL, SQL_SYMBOLE } from '../../sql';

/**
 * 声明语句，暂时只支持变量声明
 */
export class Declare extends SQL {
  static isDeclare(object: any): object is Declare {
    return object?.$type === SQL_SYMBOLE.DECLARE;
  }
  $declares: (Variant | TableVariant)[];
  readonly $type: SQL_SYMBOLE.DECLARE = SQL_SYMBOLE.DECLARE;
  constructor(members: (Variant | TableVariant)[]) {
    super();
    this.$declares = members;
  }

  do(...statements: Statement[] | [Statement[]]): Block {
    if (Array.isArray(statements[0])) {
      statements = statements[0];
    }
    const block = new Block(statements as Statement[], this);
    return block;
  }
}
