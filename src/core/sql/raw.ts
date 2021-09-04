import { SQL, SQL_SYMBOLE } from "./sql";

/**
 * 原始SQL，用于将SQL代码插入语句任何部位
 */
 export class Raw extends SQL {
  readonly $type: SQL_SYMBOLE.RAW = SQL_SYMBOLE.RAW;

  $sql: string;

  constructor(sql: string) {
    super();
    this.$sql = sql;
  }
  static isRaw(value: any): value is Raw {
    return value?.$type === SQL_SYMBOLE.RAW;
  }
}
