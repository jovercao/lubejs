import { SQL_SYMBOLE } from '../sql';
import { Scalar } from '../scalar';
import { Assignable } from './common/assignable';

/**
 * 标量变量引用，暂不支持表变量
 */
export class Variant<
  T extends Scalar = any,
  N extends string = string
> extends Assignable<T> {
  $type: SQL_SYMBOLE.VARIANT = SQL_SYMBOLE.VARIANT;
  static isVariant(object: any): object is Variant {
    return object?.$type === SQL_SYMBOLE.VARIANT;
  }
  constructor(name: N) {
    super();
    this.$name = name;
  }
  $builtin!: boolean;
  $name: N;
}
