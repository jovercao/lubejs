import { SQL_SYMBOLE } from '../../sql';
import { DbType } from '../../db-type';
import { ColumnDeclare } from './column-declare';

export class ColumnDeclareForAlter<
  N extends string = string,
  T extends DbType = DbType
> extends ColumnDeclare<N, T> {
  static isColumnDeclareForAlter(object: any): object is ColumnDeclareForAlter {
    return object?.$type === SQL_SYMBOLE.ALTER_TABLE_COLUMN
  }
  $type: SQL_SYMBOLE.ALTER_TABLE_COLUMN = SQL_SYMBOLE.ALTER_TABLE_COLUMN;
}
