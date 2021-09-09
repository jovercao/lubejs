import { SQL_SYMBOLE } from '../../sql';
import { DbTypeOf } from '../../db-type';
import { Literal } from '../../expression/literal';
import { Scalar } from '../../scalar';
import { Variant } from '../../expression';

export class FunctionParameter<
  T extends Scalar = Scalar,
  N extends string = string
> extends Variant<T, N> {
  readonly $type: SQL_SYMBOLE.FUNCTION_PARAMETER =
    SQL_SYMBOLE.FUNCTION_PARAMETER;

  constructor(name: N, dataType: DbTypeOf<T>, defaultValue?: Literal) {
    super(name);
    this.$dbType = dataType;
    this.$default = defaultValue;
  }
  $dbType: DbTypeOf<T>;
  $default?: Literal;
}
