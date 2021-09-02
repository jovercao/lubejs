import { SQL_SYMBOLE } from "../../sql";
import { Scalar } from "../../scalar/scalar";
import { Expression } from "../expression";

export abstract class Operation<
  T extends Scalar = Scalar
> extends Expression<T> {
  readonly $type: SQL_SYMBOLE.OPERATION = SQL_SYMBOLE.OPERATION;
  abstract readonly $kind: OPERATION_KIND;
  abstract readonly $operator: OPERATION_OPERATOR;
  static isOperation(object: any): object is Operation {
    return object?.$type === SQL_SYMBOLE.OPERATION;
  }
}

/**
 * 算术运算符列表
 */
 export type OPERATION_OPERATOR =
 | BINARY_OPERATION_OPERATOR
 | UNARY_OPERATION_OPERATOR;

 export enum OPERATION_KIND {
  BINARY = 'BINARY',
  UNARY = 'UNARY',
  CONVERT = 'CONVERT',
}

export enum BINARY_OPERATION_OPERATOR {
  CONCAT = '+',
  ADD = '+',
  SUB = '-',
  MUL = '*',
  DIV = '/',
  MOD = '%',
  AND = '&',
  OR = '|',
  XOR = '^',
  SHR = '>>',
  SHL = '<<',
}

export enum UNARY_OPERATION_OPERATOR {
  NOT = '~',
  NEG = '-',
}
