import { CompatiableObjectName } from "../../object/db-object";
import { Statement, STATEMENT_KIND } from "../statement";
import { ProcedureParameter } from "./procedure-parameter";

export class CreateProcedure extends Statement {
  static isCreateProcedure(object: any): object is CreateProcedure {
    return Statement.isStatement(object) && object.$kind === STATEMENT_KIND.CREATE_PROCEDURE;
  }
  $kind: STATEMENT_KIND.CREATE_PROCEDURE = STATEMENT_KIND.CREATE_PROCEDURE;
  $name: CompatiableObjectName;
  $params?: ProcedureParameter[];
  $body?: Statement;

  constructor(name: CompatiableObjectName) {
    super();
    this.$name = name;
  }

  params(params: ProcedureParameter[]) {
    this.$params = params;
    return this;
  }

  as(sql: Statement): this {
    this.$body = sql;
    return this;
  }
}
