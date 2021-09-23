import { SQL, SQL_SYMBOLE } from '../../sql';
import { DbType, DbTypeOf } from '../../db-type';
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
    dataType: DbTypeOf<T>,
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

  $dbType: DbType;
  $name: N;
  $direct: PARAMETER_DIRECTION;
  $default?: Literal;
}
