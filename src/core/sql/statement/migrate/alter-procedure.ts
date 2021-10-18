import { SQL } from '../../sql';
import { XObjectName } from '../../object';
import { DbType, ScalarFromDbType } from '../../db-type';
import {
  Literal,
  PARAMETER_DIRECTION,
  ProcedureParameter,
} from '../../expression';
import { Statement, STATEMENT_KIND } from '../statement';

export class AlterProcedure<
  P extends ProcedureParameter[] = []
> extends Statement {
  static isAlterProcedure(object: any): object is AlterProcedure {
    return (
      Statement.isStatement(object) &&
      object.$kind === STATEMENT_KIND.ALTER_PROCEDURE
    );
  }
  $kind: STATEMENT_KIND.ALTER_PROCEDURE = STATEMENT_KIND.ALTER_PROCEDURE;
  $name: XObjectName;
  $params?: P;
  $body?: Statement;

  constructor(name: XObjectName) {
    super();
    this.$name = name;
  }

  params<
    T1 extends ProcedureParameter,
    T2 extends ProcedureParameter,
    T3 extends ProcedureParameter,
    T4 extends ProcedureParameter,
    T5 extends ProcedureParameter,
    T6 extends ProcedureParameter,
    T7 extends ProcedureParameter,
    T8 extends ProcedureParameter,
    T9 extends ProcedureParameter,
    T10 extends ProcedureParameter,
    T11 extends ProcedureParameter,
    T12 extends ProcedureParameter,
    T13 extends ProcedureParameter,
    T14 extends ProcedureParameter,
    T15 extends ProcedureParameter,
    T16 extends ProcedureParameter,
    T17 extends ProcedureParameter,
    T18 extends ProcedureParameter,
    T19 extends ProcedureParameter,
    T20 extends ProcedureParameter
  >(
    ...args:
      | [
          (
            param: AlterProcedureBuilder['param']
          ) => [
            p1?: T1,
            p2?: T2,
            p3?: T3,
            p4?: T4,
            p5?: T5,
            p6?: T6,
            p7?: T7,
            p8?: T8,
            p9?: T9,
            p10?: T10,
            p11?: T11,
            p12?: T12,
            p13?: T13,
            p14?: T14,
            p15?: T15,
            p16?: T16,
            p17?: T17,
            p18?: T18,
            p19?: T19,
            p20?: T20
          ]
        ]
      | [
          p1?: T1,
          p2?: T2,
          p3?: T3,
          p4?: T4,
          p5?: T5,
          p6?: T6,
          p7?: T7,
          p8?: T8,
          p9?: T9,
          p10?: T10,
          p11?: T11,
          p12?: T12,
          p13?: T13,
          p14?: T14,
          p15?: T15,
          p16?: T16,
          p17?: T17,
          p18?: T18,
          p19?: T19,
          p20?: T20
        ]
  ): AlterProcedure<
    [
      T1,
      T2,
      T3,
      T4,
      T5,
      T6,
      T7,
      T8,
      T9,
      T10,
      T11,
      T12,
      T13,
      T14,
      T15,
      T16,
      T17,
      T18,
      T19,
      T20
    ]
  > {
    if (this.$params) {
      throw new Error(`AlterProcedure parameters is declared.`);
    }
    if (args.length === 1 && typeof args[0] === 'function') {
      args = args[0](alterProcedure.param);
    }
    if ((args as any).findIndex((p: any) => !p) >= 0) {
      throw new Error(`Procedure parameter must not empty.`);
    }
    this.$params = args as any;
    return this as any;
  }

  as(
    ...sql: [Statement[]] | Statement[] | [(params: P) => Statement[]]
  ): this {
    if (typeof sql[0] === 'function') {
      sql = sql[0](this.$params || ([] as any));
    }
    this.$body = SQL.block(...(sql as any));
    return this;
  }
}

export const alterProcedure = (name: XObjectName): AlterProcedure => {
  return new AlterProcedure(name);
};

alterProcedure.param = <T extends DbType, N extends string>(
  name: N,
  dataType: T,
  direct: PARAMETER_DIRECTION = 'IN',
  defaultValue?: Literal<ScalarFromDbType<T>> | ScalarFromDbType<T>
): ProcedureParameter<ScalarFromDbType<T>, N> =>
  ProcedureParameter.create(name, dataType, direct, defaultValue);

export type AlterProcedureBuilder = typeof alterProcedure;
