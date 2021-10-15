import { SQL, SQL_SYMBOLE } from "./sql";
import { Statement } from "./statement/statement";

/**
 * SQL 文档
 */
 export class Document extends SQL {
  static isDocument(object: any): object is Document {
    return object?.$type === SQL_SYMBOLE.DOCUMENT;
  }
  statements: Statement[];
  readonly $type: SQL_SYMBOLE.DOCUMENT = SQL_SYMBOLE.DOCUMENT;

  constructor(statements: Statement[]) {
    super();
    this.statements = statements;
  }

  append(sql: Statement) {
    this.statements.push(sql);
  }
}
