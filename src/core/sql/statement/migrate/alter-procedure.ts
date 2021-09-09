import { isDbType } from '../../db-type';
import { CompatiableObjectName } from '../../object/db-object';
import { SQL } from '../../sql';
import { isPlainObject } from '../../util';
import { Statement, STATEMENT_KIND } from '../statement';
import { ProcedureParameterObject } from './create-procedure';
import { ProcedureParameter } from './procedure-parameter';

export class AlterProcedure extends Statement {
  static isAlterProcedure(object: any): object is AlterProcedure {
    return (
      Statement.isStatement(object) &&
      object.$kind === STATEMENT_KIND.ALTER_PROCEDURE
    );
  }
  $kind: STATEMENT_KIND.ALTER_PROCEDURE = STATEMENT_KIND.ALTER_PROCEDURE;
  $name: CompatiableObjectName;
  $params?: ProcedureParameter[];
  $body?: Statement;

  constructor(name: CompatiableObjectName) {
    super();
    this.$name = name;
  }

  params(params: ProcedureParameterObject): this;
  params(params: ProcedureParameter[]): this;
  params(...params: ProcedureParameter[]): this;
  params(
    ...params:
      | ProcedureParameter[]
      | [ProcedureParameter[]]
      | [ProcedureParameterObject]
  ): this {
    if (params.length === 1 && isPlainObject(params[0])) {
      this.$params = Object.entries(params[0] as ProcedureParameterObject).map(
        ([name, value]) => {
          if (isDbType(value)) {
            return new ProcedureParameter(name, value as any);
          } else {
            return new ProcedureParameter(
              name,
              value.type as any,
              value.direction,
              value.default
            );
          }
        }
      );
      return this;
    }
    if (params.length === 1 && Array.isArray(params[0])) {
      params = params[0] as ProcedureParameter[];
    }
    this.$params = params as ProcedureParameter[];
    return this;
  }

  as(...sql: [Statement[]] | Statement[]): this {
    this.$body = SQL.block(...sql as any);
    return this;
  }
}
