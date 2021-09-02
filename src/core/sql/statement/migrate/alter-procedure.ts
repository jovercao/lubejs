import { CompatiableObjectName } from '../../object/db-object';
import { Statement, STATEMENT_KIND } from '../statement';
import { ProcedureParameter } from './procedure-parameter';

export class AlterProcedure extends Statement {
  static isAlterProcedure(object: any): object is AlterProcedure {
    return Statement.isStatement(object) && object.$kind === STATEMENT_KIND.ALTER_PROCEDURE;
  }
  $kind: STATEMENT_KIND.ALTER_PROCEDURE = STATEMENT_KIND.ALTER_PROCEDURE;
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
