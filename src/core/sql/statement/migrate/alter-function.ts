import { SQL } from '../../sql';
import { TableVariant } from '../../rowset';
import { DbType, ScalarFromDbType } from '../../db-type';
import { XObjectName } from '../../object';
import { Statement, STATEMENT_KIND } from '../statement';
import { FunctionParameter, Literal, Variant } from '../../expression';

export class AlterFunction<
  P extends FunctionParameter[] = []
> extends Statement {
  static isAlterFunction(object: any): object is AlterFunction {
    return (
      Statement.isStatement(object) &&
      object.$kind === STATEMENT_KIND.ALTER_FUNCTION
    );
  }
  $kind: STATEMENT_KIND.ALTER_FUNCTION = STATEMENT_KIND.ALTER_FUNCTION;
  $name: XObjectName;
  $params?: P;
  $body?: Statement;
  $returns?: Variant | TableVariant | DbType;

  constructor(name: XObjectName) {
    super();
    this.$name = name;
  }

  params<
    T1 extends FunctionParameter,
    T2 extends FunctionParameter,
    T3 extends FunctionParameter,
    T4 extends FunctionParameter,
    T5 extends FunctionParameter,
    T6 extends FunctionParameter,
    T7 extends FunctionParameter,
    T8 extends FunctionParameter,
    T9 extends FunctionParameter,
    T10 extends FunctionParameter,
    T11 extends FunctionParameter,
    T12 extends FunctionParameter,
    T13 extends FunctionParameter,
    T14 extends FunctionParameter,
    T15 extends FunctionParameter,
    T16 extends FunctionParameter,
    T17 extends FunctionParameter,
    T18 extends FunctionParameter,
    T19 extends FunctionParameter,
    T20 extends FunctionParameter
  >(
    ...args:
      | [
          (
            param: AlterFunctionBuilder['param']
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
  ): AlterFunction<
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
      throw new Error(`AlterFunction parameters is declared.`);
    }
    if (args.length === 1 && typeof args[0] === 'function') {
      args = args[0](alterFunction.param);
    }
    if ((args as any).findIndex((p: any) => !p) >= 0) {
      throw new Error(`Function parameter must not empty.`);
    }
    this.$params = args as any;
    return this as any;
  }

  returns(returns: Variant | TableVariant | DbType): this {
    this.$returns = returns;
    return this;
  }

  /**
   * 定义函数体
   */
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

export function alterFunction(name: XObjectName): AlterFunction {
  return new AlterFunction(name);
}

alterFunction.param = <T extends DbType, N extends string>(
  name: N,
  dataType: T,
  defaultValue?: Literal<ScalarFromDbType<T>> | ScalarFromDbType<T>
): FunctionParameter<ScalarFromDbType<T>, N> => {
  return FunctionParameter.create(name, dataType, defaultValue);
};

export type AlterFunctionBuilder = typeof alterFunction;
