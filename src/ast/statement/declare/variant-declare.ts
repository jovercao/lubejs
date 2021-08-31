import { AST, SQL_SYMBOLE } from '../../ast';
import { DbType } from '../../db-type';

export class VariantDeclare extends AST {
  readonly $type: SQL_SYMBOLE.VARAINT_DECLARE = SQL_SYMBOLE.VARAINT_DECLARE;

  constructor(name: string, dataType: DbType) {
    super();
    this.$name = name;
    this.$dbType = dataType;
  }

  $name: string;
  $dbType: DbType;
}
