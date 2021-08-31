import { DBObject } from './db-object';
import { SQL_SYMBOLE } from '../ast';

/**
 * SQL系统内建关键字，如MSSQL DATEPART: DAY / M / MM 等
 */
export class BuiltIn<N extends string = string> extends DBObject {
  $type: SQL_SYMBOLE.BUILT_IN = SQL_SYMBOLE.BUILT_IN;
  $name!: N;
  readonly $builtin: true = true;
  static isBuiltIn(object: any): object is BuiltIn {
    return object?.$type === SQL_SYMBOLE.BUILT_IN;
  }
  constructor(name: N) {
    super(name, true);
  }
}
