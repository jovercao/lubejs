import { SQL, SQL_SYMBOLE } from "../../sql";
import { DbType, DbTypeOf } from "../../db-type";
import { Literal } from "../../expression/literal";
import { PARAMETER_DIRECTION } from "../../expression/parameter";
import { Variant } from "../../expression";
import { Scalar } from "../../scalar";

export class ProcedureParameter<T extends Scalar = Scalar, N extends string = string> extends Variant<T, N> {
  readonly $type: SQL_SYMBOLE.PROCEDURE_PARAMETER =
    SQL_SYMBOLE.PROCEDURE_PARAMETER;

  constructor(
    name: N,
    dataType: DbTypeOf<T>,
    direct: PARAMETER_DIRECTION = 'INPUT',
    defaultValue?: Literal<T>
  ) {
    super(name);
    this.$dbType = dataType;
    this.$direct = direct;
    this.$default = defaultValue;
  }

  $dbType: DbType;
  $direct: PARAMETER_DIRECTION;
  $default?: Literal;
}

