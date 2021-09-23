import { SQL, SQL_SYMBOLE } from '../../sql';
import { DbType, DbTypeOf } from '../../db-type';
import { Literal } from '../../expression/literal';
import { Scalar } from '../../scalar';
import { Assignable } from '../../expression';

export class FunctionParameter<
  T extends Scalar = Scalar,
  N extends string = string
> extends Assignable<T> {
  readonly $type: SQL_SYMBOLE.FUNCTION_PARAMETER =
    SQL_SYMBOLE.FUNCTION_PARAMETER;

  constructor(name: N, dataType: DbTypeOf<T>, defaultValue?: Literal<T> | T) {
    super();
    this.$name = name;
    this.$dbType = dataType;
    if (defaultValue) {
      this.$default = Literal.isLiteral(defaultValue)
        ? defaultValue
        : SQL.literal(defaultValue);
    }
  }
  $dbType: DbType;
  $name: N;
  $default?: Literal<T>;
}
