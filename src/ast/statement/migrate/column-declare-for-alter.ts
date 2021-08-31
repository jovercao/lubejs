import { SQL_SYMBOLE } from '../../ast';
import { DbType } from '../../db-type';
import { ColumnDeclare } from './column-declare';

export class ColumnDeclareForAlter<
  N extends string = string,
  T extends DbType = DbType
> extends ColumnDeclare<N, T> {
  $type: SQL_SYMBOLE.ALTER_TABLE_COLUMN = SQL_SYMBOLE.ALTER_TABLE_COLUMN;
}
