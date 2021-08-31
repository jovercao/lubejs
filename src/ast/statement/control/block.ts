import { Statement, STATEMENT_KIND } from "../statement";

/**
 * 语句块
 */
export class Block extends Statement {
  $kind: STATEMENT_KIND.BLOCK = STATEMENT_KIND.BLOCK;
  $statements: Statement[];

  constructor(statements: Statement[]) {
    super();
    this.$statements = statements;
  }

  append(...statements: Statement[]) {
    if (!this.$statements) {
      this.$statements = [];
    }
    this.$statements.push(...statements);
  }

  static isBlock(object: any): object is Block {
    return Statement.isStatement(object) && object.$kind === STATEMENT_KIND.BLOCK
  }
}
