import { DbType } from '../../db-type';
import { CompatiableObjectName } from '../../object/db-object';
import { Statement, STATEMENT_KIND } from '../statement';
import { TableVariantDeclare } from '../declare/table-variant-declare';
import { VariantDeclare } from '../declare/variant-declare';

export class AlterFunction extends Statement {
  static isAlterFunction(object: any): object is AlterFunction {
    return Statement.isStatement(object) && object.$kind === STATEMENT_KIND.ALTER_FUNCTION;
  }
  $kind: STATEMENT_KIND.ALTER_FUNCTION = STATEMENT_KIND.ALTER_FUNCTION;
  $name: CompatiableObjectName;
  $params?: VariantDeclare[];
  $body?: Statement[];
  $returns?: VariantDeclare | TableVariantDeclare | DbType;

  constructor(name: CompatiableObjectName) {
    super();
    this.$name = name;
  }

  params(params: VariantDeclare[]) {
    this.$params = params;
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
