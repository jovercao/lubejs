import { SQL, SQL_SYMBOLE } from '../sql';
import { DbType, ScalarFromDbType } from '../db-type';
import { Scalar } from '../scalar';
import { Literal } from './literal';
import { Assignable } from './common/assignable';

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
      this.$default = Literal.ensureLiteral(defaultValue);
    }
  }
  $dbType: DbType;
  $name: N;
  $default?: Literal<T>;

  static create<T extends DbType, N extends string>(
    name: N,
    dataType: T,
    defaultValue?: Literal<ScalarFromDbType<T>> | ScalarFromDbType<T>
  ): FunctionParameter<ScalarFromDbType<T>, N> {
    return new FunctionParameter(name, dataType, defaultValue);
  }
}
