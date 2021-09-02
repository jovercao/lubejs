import { DbType, TsTypeOf } from "../../db-type";
import { Literal } from "../../expression/literal";
import { CompatiableObjectName } from "../../object/db-object";
import { Scalar } from "../../scalar";
import { Statement, STATEMENT_KIND } from "../statement";

export class CreateSequence<
  T extends Scalar = any,
  N extends string = string
> extends Statement {
  static isCreateSequence(object: any): object is CreateSequence {
    return Statement.isStatement(object) && object.$kind === STATEMENT_KIND.CREATE_SEQUENCE;
  }
  $kind: STATEMENT_KIND.CREATE_SEQUENCE = STATEMENT_KIND.CREATE_SEQUENCE;
  $name: CompatiableObjectName<N>;
  $startValue: Literal<number> = new Literal(0);
  $increment: Literal<number> = new Literal(1);
  $dbType?: DbType;
  constructor(name: CompatiableObjectName<N>) {
    super();
    this.$name = name;
  }

  as<T extends DbType>(type: T): CreateSequence<TsTypeOf<T>, N> {
    this.$dbType = type;
    return this;
  }

  startWith(value: number | Literal<number>): this {
    this.$startValue = Literal.ensureLiterial(value);
    return this;
  }

  incrementBy(value: number | Literal<number>): this {
    this.$increment = Literal.ensureLiterial(value);
    return this;
  }
}
