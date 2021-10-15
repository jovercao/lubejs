import { SQL, SQL_SYMBOLE } from '../../sql';
import { DbType, ScalarFromDbType } from '../db-type';
import { Literal } from './literal';
import { PARAMETER_DIRECTION } from './parameter';
import { Scalar } from '../scalar';
import { Assignable } from './common/assignable';

export class ProcedureParameter<
  T extends Scalar = Scalar,
  N extends string = string
> extends Assignable<T> {
  readonly $type: SQL_SYMBOLE.PROCEDURE_PARAMETER =
    SQL_SYMBOLE.PROCEDURE_PARAMETER;

  constructor(
    name: N,
    dataType: DbType,
    direct: PARAMETER_DIRECTION = 'IN',
    defaultValue?: Literal<T> | T
  ) {
    super();
    this.$name = name;
    this.$dbType = dataType;
    this.$direct = direct;
    if (defaultValue) {
      this.$default = Literal.isLiteral(defaultValue)
        ? defaultValue
        : SQL.literal(defaultValue);
    }
  }

  static create<T extends DbType, N extends string>(
    name: N,
    dataType: T,
    direct: PARAMETER_DIRECTION = 'IN',
    defaultValue?: Literal<ScalarFromDbType<T>> | ScalarFromDbType<T>
  ): ProcedureParameter<ScalarFromDbType<T>, N> {
    return new ProcedureParameter(name, dataType, direct, defaultValue);
  }

  $dbType: DbType;
  $name: N;
  $direct: PARAMETER_DIRECTION;
  $default?: Literal;
}
