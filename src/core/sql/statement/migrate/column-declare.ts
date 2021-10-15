import { SQL, SQL_SYMBOLE } from '../../sql';
import { DbType } from '../../db-type';

export abstract class ColumnDeclare<
  N extends string = string,
  T extends DbType = DbType
> extends SQL {
  abstract $type:
    | SQL_SYMBOLE.ALTER_TABLE_COLUMN
    | SQL_SYMBOLE.CREATE_TABLE_COLUMN;
  $name: N;
  $nullable?: boolean;
  $dbType: T;

  constructor(name: N, type: T) {
    super();
    this.$name = name;
    this.$dbType = type;
  }

  null(): this {
    this.$nullable = true;
    return this;
  }

  notNull(): this {
    this.$nullable = false;
    return this;
  }
}
