import { SQL, SQL_SYMBOLE } from '../../sql';
import { DbType, DbTypeOf, TsTypeOf } from '../../db-type';
import { Literal } from '../../expression/literal';
import { Scalar } from '../../scalar';
import { Assignable } from '../../expression';

export class FunctionParameter<
  T extends Scalar = Scalar,
  N extends string = string
> extends Assignable<T> {
  readonly $type: SQL_SYMBOLE.FUNCTION_PARAMETER =
    SQL_SYMBOLE.FUNCTION_PARAMETER;

  constructor(name: N, dataType: DbType, defaultValue?: Literal<T> | T) {
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

  static create<T extends DbType, N extends string>(
    name: N,
    dataType: T,
    defaultValue?: Literal<TsTypeOf<T>> | TsTypeOf<T>
  ): FunctionParameter<TsTypeOf<T>, N> {
    return new FunctionParameter(name, dataType, defaultValue);
  }
}
