import { Numeric } from '../scalar';
import { SQL, SQL_SYMBOLE } from '../sql';
import { DBObject } from './db-object';

export class Sequence<
  T extends Numeric = Numeric,
  N extends string = string
  // K extends FUNCTION_TYPE = FUNCTION_TYPE.SCALAR
> extends DBObject<N> {
  readonly $type: SQL_SYMBOLE.SEQUENCE = SQL_SYMBOLE.SEQUENCE;

  /**
   * 获取值
   */
  nextValue(): Expression<T> {
    return SQL.std.sequenceNextValue<T>(this.$name);
  }
}

import type { Expression } from '../expression';
