import { Statement, STATEMENT_KIND } from "../statement";

export class Break extends Statement {
  static isBreak(object: any): object is Break {
    return Statement.isStatement(object) && object.$kind === STATEMENT_KIND.BREAK;
  }
  $kind: STATEMENT_KIND.BREAK = STATEMENT_KIND.BREAK;
  isBreak(object: any): object is Break {
    return Statement.isStatement(object) && object.$kind === STATEMENT_KIND.BREAK
  }
}
