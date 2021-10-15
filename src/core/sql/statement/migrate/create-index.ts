import { XObjectName } from '../../object';
import { Statement, STATEMENT_KIND } from '../statement';
import { KeyColumns, KeyColumnsObject } from './key-column';

export class CreateIndex extends Statement {
  static isCreateIndex(object: any): object is CreateIndex {
    return Statement.isStatement(object) && object.$kind === STATEMENT_KIND.CREATE_INDEX;
  }
  $kind: STATEMENT_KIND.CREATE_INDEX = STATEMENT_KIND.CREATE_INDEX;
  $name?: string;
  $table?: XObjectName;
  $columns?: KeyColumns;
  $clustered: boolean = false;
  $unique: boolean = false;

  constructor(name: string) {
    super();
    this.$name = name;
  }

  clustered(): this {
    this.$clustered = true;
    return this;
  }

  unique(): this {
    this.$unique = true;
    return this;
  }

  on(
    table: XObjectName,
    columns: KeyColumns | string[] | KeyColumnsObject
  ): this {
    if (this.$table) {
      throw new Error(`Table & Columns is defined.`);
    }
    this.$table = table;
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
