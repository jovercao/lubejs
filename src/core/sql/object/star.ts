/**
 * SQL *，查询所有字段时使用
 */

import { SQL, SQL_SYMBOLE } from '../sql';
import type { XRowsets } from '../rowset';

// eslint-disable-next-line
export class Star<T extends object = any> extends SQL {
  readonly $type: SQL_SYMBOLE.STAR = SQL_SYMBOLE.STAR;
  constructor(rowset?: XRowsets<T>) {
    super();
    this.$table = rowset;
  }
  $table?: XRowsets<T>;

  static isStar(object: any): object is Star {
    return object?.$type === SQL_SYMBOLE.STAR;
  }
}
