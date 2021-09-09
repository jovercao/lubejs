import { DbType, DbTypeOf, isDbType } from '../../db-type';
import { CompatiableObjectName } from '../../object/db-object';
import { Statement, STATEMENT_KIND } from '../statement';
import { TableVariantDeclare } from '../declare/table-variant-declare';
import { VariantDeclare } from '../declare/variant-declare';
import { FunctionParameter } from './function-parameter';
import { isPlainObject } from '../../util';
import { SQL } from '../../sql';
import { Literal, Parameter } from '../../expression';
import { Scalar } from '../../scalar';

export type FunctionParameterObject = Record<
  string,
  DbType | { type: DbType; default?: Literal }
>;

export class CreateFunction extends Statement {
  static isCreateFunction(object: any): object is CreateFunction {
    return (
      Statement.isStatement(object) &&
      object.$kind === STATEMENT_KIND.CREATE_FUNCTION
    );
  }
  $kind: STATEMENT_KIND.CREATE_FUNCTION = STATEMENT_KIND.CREATE_FUNCTION;
  $name: CompatiableObjectName;
  $params?: FunctionParameter[];
  $body?: Statement;
  $returns?: FunctionParameter | TableVariantDeclare | DbType;

  constructor(name: CompatiableObjectName) {
    super();
    this.$name = name;
  }

  params(params: FunctionParameterObject): this;
  params(params: FunctionParameter[]): this;
  params(...params: FunctionParameter[]): this;
  params(
    ...params:
      | FunctionParameter[]
      | [FunctionParameter[]]
      | [FunctionParameterObject]
  ): this {
    if (params.length === 1 && isPlainObject(params[0])) {
      this.$params = Object.entries(params[0] as FunctionParameterObject).map(
        ([name, value]) => {
          if (isDbType(value)) {
            return new FunctionParameter(name, value as DbTypeOf<Scalar>);
          } else {
            return new FunctionParameter(
              name,
              value.type as DbTypeOf<Scalar>,
              value.default
            );
          }
        }
      );
      return this;
    }
    if (params.length === 1 && Array.isArray(params)) {
      params = params[0] as FunctionParameter[];
    }
    this.$params = params as FunctionParameter[];
    return this;
  }

  returns(returns: FunctionParameter | TableVariantDeclare | DbType): this {
    this.$returns = returns;
    return this;
  }

  as(...sql: [Statement[]] | Statement[]): this {
    this.$body = SQL.block(...sql as any);
    return this;
  }
}
