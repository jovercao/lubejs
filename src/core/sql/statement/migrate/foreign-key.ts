import { SQL, SQL_SYMBOLE } from "../../sql";
import { CompatiableObjectName } from "../../object/db-object";

export class ForeignKey extends SQL {
  constructor(name?: string, columns?: string[]) {
    super();
    this.$name = name;
    if (columns) {
      this.on(columns);
    }
  }

  $type: SQL_SYMBOLE.FOREIGN_KEY = SQL_SYMBOLE.FOREIGN_KEY;
  $name?: string;
  $columns?: string[];
  $referenceColumns?: string[];
  $referenceTable?: CompatiableObjectName;
  $deleteCascade?: boolean;

  on(...columns: string[] | [string[]]): this {
    if (columns.length === 1 && Array.isArray(columns[0])) {
      columns = columns[0];
    }
    this.$columns = columns as string[];
    return this;
  }

  reference(table: CompatiableObjectName, columns: string[]): this {
    this.$referenceTable = table;
    this.$referenceColumns = columns;
    return this;
  }

  deleteCascade(): this {
    this.$deleteCascade = true;
    return this;
  }
}
