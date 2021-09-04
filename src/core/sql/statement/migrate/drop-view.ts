import { CompatiableObjectName } from "../../object/db-object";
import { Statement, STATEMENT_KIND } from "../statement";

export class DropView<N extends string = string> extends Statement {
  static isDropView(object: any): object is DropView {
    return Statement.isStatement(object) && object.$kind === STATEMENT_KIND.DROP_VIEW;
  }
  $kind: STATEMENT_KIND.DROP_VIEW = STATEMENT_KIND.DROP_VIEW;
  $name: CompatiableObjectName<N>;

  constructor(name: CompatiableObjectName<N>) {
    super();
    this.$name = name;
  }
}
