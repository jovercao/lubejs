import { SQL, SQL_SYMBOLE } from '../../sql';
import { DbType, TsTypeOf } from '../../db-type';
import { Literal } from '../../expression/literal';
import { PARAMETER_DIRECTION } from '../../expression/parameter';
import { Scalar } from '../../scalar';
import { Assignable } from '../../expression';

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
    defaultValue?: Literal<TsTypeOf<T>> | TsTypeOf<T>
  ): ProcedureParameter<TsTypeOf<T>, N> {
    return new ProcedureParameter(name, dataType, direct, defaultValue);
  }

  $dbType: DbType;
  $name: N;
  $direct: PARAMETER_DIRECTION;
  $default?: Literal;
}
