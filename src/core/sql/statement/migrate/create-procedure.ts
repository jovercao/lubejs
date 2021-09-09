import { DbType, isDbType } from '../../db-type';
import { Literal, PARAMETER_DIRECTION } from '../../expression';
import { CompatiableObjectName } from '../../object/db-object';
import { SQL } from '../../sql';
import { isPlainObject } from '../../util';
import { Statement, STATEMENT_KIND } from '../statement';
import { ProcedureParameter } from './procedure-parameter';

export type ProcedureParameterObject = Record<
  string,
  | DbType
  | {
      type: DbType;
      default?: Literal;
      direction?: PARAMETER_DIRECTION;
    }
>;
export class CreateProcedure extends Statement {
  static isCreateProcedure(object: any): object is CreateProcedure {
    return (
      Statement.isStatement(object) &&
      object.$kind === STATEMENT_KIND.CREATE_PROCEDURE
    );
  }
  $kind: STATEMENT_KIND.CREATE_PROCEDURE = STATEMENT_KIND.CREATE_PROCEDURE;
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
