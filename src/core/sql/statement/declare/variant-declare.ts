import { SQL, SQL_SYMBOLE } from '../../sql';
import { DbType } from '../../db-type';

export class VariantDeclare extends SQL {
  readonly $type: SQL_SYMBOLE.VARAINT_DECLARE = SQL_SYMBOLE.VARAINT_DECLARE;

  constructor(name: string, dataType: DbType) {
    super();
    this.$name = name;
    this.$dbType = dataType;
  }

  $name: string;
  $dbType: DbType;

  static isVariantDeclare(object: any): object is VariantDeclare {
    return object?.$type === SQL_SYMBOLE.VARAINT_DECLARE;
  }
}
