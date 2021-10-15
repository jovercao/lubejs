import { Declare } from '../programmer';
import { Statement, STATEMENT_KIND } from '../statement';

/**
 * 语句块
 */
export class Block extends Statement {
  $kind: STATEMENT_KIND.BLOCK = STATEMENT_KIND.BLOCK;
  $statements: Statement[];
  $declares?: Declare;

  constructor(statements: Statement[], declares?: Declare) {
    super();
    this.$statements = statements;
    this.$declares = declares;
  }

  append(...statements: Statement[]) {
    if (!this.$statements) {
      this.$statements = [];
    }
    this.$statements.push(...statements);
  }

  static isBlock(object: any): object is Block {
    return (
      Statement.isStatement(object) && object.$kind === STATEMENT_KIND.BLOCK
    );
  }
}
