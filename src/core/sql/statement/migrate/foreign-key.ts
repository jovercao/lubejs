import { SQL, SQL_SYMBOLE } from '../../sql';
import { XObjectName } from '../../object';

export class ForeignKey extends SQL {
  static isForeignKey(object: any): object is ForeignKey {
    return object?.$type === SQL_SYMBOLE.FOREIGN_KEY;
  }
  constructor(name?: string, columns?: string[]) {
    super();
    this.$name = name;
    if (columns) {
      this.on(columns);
    }
  }

  readonly $type: SQL_SYMBOLE.FOREIGN_KEY = SQL_SYMBOLE.FOREIGN_KEY;
  $name?: string;
  $columns?: string[];
  $referenceColumns?: string[];
  $referenceTable?: XObjectName;
  $deleteCascade?: boolean;

  on(...columns: string[] | [string[]]): this {
    if (columns.length === 1 && Array.isArray(columns[0])) {
      columns = columns[0];
    }
    this.$columns = columns as string[];
    return this;
  }

  reference(table: XObjectName, columns: string[]): this {
    this.$referenceTable = table;
    this.$referenceColumns = columns;
    return this;
  }

  deleteCascade(): this {
    this.$deleteCascade = true;
    return this;
  }
}
