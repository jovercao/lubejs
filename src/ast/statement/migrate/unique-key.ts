import { AST } from '../../../ast';
import { SQL_SYMBOLE } from '../../ast';
import { KeyColumns, KeyColumnsObject } from './key-column';

/**
 * 唯一约束
 */
export class UniqueKey extends AST {
  $type: SQL_SYMBOLE.UNIQUE_KEY = SQL_SYMBOLE.UNIQUE_KEY;
  $name?: string;
  $columns?: KeyColumns;

  constructor(
    name?: string,
    columns?: KeyColumns | string[] | KeyColumnsObject
  ) {
    super();
    this.$name = name;
    if (columns) {
      this.on(columns);
    }
  }

  on(columns: KeyColumns | string[] | KeyColumnsObject): this {
    if (this.$columns) {
      throw new Error(`Columns is defined.`);
    }
    if (Array.isArray(columns)) {
      if (columns.length === 0) {
        throw new Error(`Primary key must have a column.`);
      }
      if (typeof columns[0] === 'string') {
        this.$columns = (columns as string[]).map(name => ({
          name,
          sort: 'ASC',
        }));
      } else {
        this.$columns = columns as KeyColumns;
      }
      return this;
    }

    this.$columns = Object.entries(columns).map(([name, sort]) => ({
      name,
      sort,
    }));
    return this;
  }
}
