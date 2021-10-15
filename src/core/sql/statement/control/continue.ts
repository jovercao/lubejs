import { Statement, STATEMENT_KIND } from '../statement';

export class Continue extends Statement {
  $kind: STATEMENT_KIND.CONTINUE = STATEMENT_KIND.CONTINUE;

  static isContinue(object: any): object is Continue {
    return (
      Statement.isStatement(object) && object.$kind === STATEMENT_KIND.CONTINUE
    );
  }
}
