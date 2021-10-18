import { Declare } from '../programmer';
import { Statement, STATEMENT_KIND } from '../statement';

/**
 * 语句块
 */
export class Block extends Statement {
  $kind: STATEMENT_KIND.BLOCK = STATEMENT_KIND.BLOCK;
  $body: Statement[];
  $declares?: Declare;

  constructor(statements: Statement[], declares?: Declare) {
    super();
    this.$body = statements;
    this.$declares = declares;
  }

  append(...statements: Statement[]) {
    if (!this.$body) {
      this.$body = [];
    }
    this.$body.push(...statements);
  }

  static isBlock(object: any): object is Block {
    return (
      Statement.isStatement(object) && object.$kind === STATEMENT_KIND.BLOCK
    );
  }
}
