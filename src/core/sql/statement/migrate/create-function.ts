import { DbType } from "../../db-type";
import { CompatiableObjectName } from "../../object/db-object";
import { Statement, STATEMENT_KIND } from "../statement";
import { TableVariantDeclare } from "../declare/table-variant-declare";
import { VariantDeclare } from "../declare/variant-declare";

export class CreateFunction extends Statement {
  static isCreateFunction(object: any): object is CreateFunction {
    return Statement.isStatement(object) && object.$kind === STATEMENT_KIND.CREATE_FUNCTION;
  }
  $kind: STATEMENT_KIND.CREATE_FUNCTION = STATEMENT_KIND.CREATE_FUNCTION;
  $name: CompatiableObjectName;
  $params?: VariantDeclare[];
  $body?: Statement[];
  $returns?: VariantDeclare | TableVariantDeclare | DbType;

  constructor(name: CompatiableObjectName) {
    super();
    this.$name = name;
  }

  params(params: VariantDeclare[]): this;
  params(...params: VariantDeclare[]): this;
  params(...params: VariantDeclare[] | [VariantDeclare[]]): this {
    if (params.length === 1 && Array.isArray(params)) {
      params = params[0] as VariantDeclare[];
    }
    this.$params = params as VariantDeclare[];
    return this;
  }

  returns(returns: VariantDeclare | TableVariantDeclare | DbType) {
    this.$returns = returns;
  }

  as(sql: Statement[]): this {
    this.$body = sql;
    return this;
  }
}
