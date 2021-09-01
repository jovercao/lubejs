import { DeclareBuilder } from "./declare-builder";
import { Statement, STATEMENT_KIND } from "../statement";
import { TableVariantDeclare } from "./table-variant-declare";
import { VariantDeclare } from "./variant-declare";

/**
 * 声明语句，暂时只支持变量声明
 */
 export class Declare extends Statement {
  static isDeclare(object: any): object is Declare {
    return Statement.isStatement(object) && object.$kind === STATEMENT_KIND.DECLARE;
  }
  $declares: (VariantDeclare | TableVariantDeclare)[] = [];
  $kind: STATEMENT_KIND.DECLARE = STATEMENT_KIND.DECLARE;
  constructor(
    build: (builder: DeclareBuilder) => (VariantDeclare | TableVariantDeclare)[]
  ) {
    super();
    this.$declares.push(...build(DeclareBuilder));
  }
}
