import { SQL_SYMBOLE } from '../sql';
import { Scalar } from '../scalar';
import { Assignable } from './common/assignable';
import { DbType, DbTypeFromScalar } from '../db-type';

/**
 * 标量变量引用，暂不支持表变量
 */
export class Variant<
  T extends Scalar = any,
  N extends string = string
> extends Assignable<T> {
  readonly $type: SQL_SYMBOLE.VARIANT = SQL_SYMBOLE.VARIANT;
  static isVariant(object: any): object is Variant {
    return (
      object?.$type === SQL_SYMBOLE.VARIANT ||
      object?.$type === SQL_SYMBOLE.FUNCTION_PARAMETER ||
      object?.$type === SQL_SYMBOLE.PROCEDURE_PARAMETER
    );
  }
  constructor(name: N, dbType: DbTypeFromScalar<T>) {
    super();
    this.$name = name;
    this.$dbType = dbType;
  }

  $builtin!: boolean;
  $dbType: DbType;
  $name: N;
}
