import { Condition } from "../../condition/condition";
import { SqlBuilder } from "../../../sql-builder";
import { Statement, STATEMENT_KIND } from "../statement";

export class While extends Statement {
  $kind: STATEMENT_KIND.WHILE = STATEMENT_KIND.WHILE;
  $condition: Condition;
  $statement?: Statement;

  constructor(condition: Condition) {
    super();
    this.$condition = condition;
  }

  do(...statements: Statement[] | [Statement | Statement[]]) {
    if (statements.length === 1 && Array.isArray(statements[0])) {
      statements = statements[0];
    }
    if (statements.length > 0) {
      this.$statement = SqlBuilder.block(statements as Statement[]);
    } else {
      this.$statement = statements[0] as Statement;
    }
  }

  static isWhile(object: any): object is While {
    return Statement.isStatement(object) && object.$kind === STATEMENT_KIND.WHILE;
  }
}
