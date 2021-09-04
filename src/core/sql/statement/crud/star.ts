
/**
 * SQL *，查询所有字段时使用
 */

import { SQL, SQL_SYMBOLE } from "../../sql";
import { CompatibleRowset } from "../../rowset/rowset";

// eslint-disable-next-line
export class Star<T extends object = any> extends SQL {
  $type: SQL_SYMBOLE.STAR = SQL_SYMBOLE.STAR;
  constructor(rowset?: CompatibleRowset<T>) {
    super();
    this.$table = rowset;
  }
  $table?: CompatibleRowset<T>;

  static isStar(object: any): object is Star {
    return object?.$type === SQL_SYMBOLE.STAR;
  }
}
