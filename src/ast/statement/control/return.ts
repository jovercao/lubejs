import { CompatibleExpression, Expression } from "../../expression/expression";
import { Statement, STATEMENT_KIND } from "../statement";

export class Return extends Statement {
  $kind: STATEMENT_KIND.RETURN = STATEMENT_KIND.RETURN;
  $value?: Expression;
  constructor(value: CompatibleExpression) {
    super();
    this.$value = Expression.ensure(value);
  }

  static isReturn(object: any): object is Return {
    return Statement.isStatement(object) && object.$kind === STATEMENT_KIND.RETURN;
  }
}
