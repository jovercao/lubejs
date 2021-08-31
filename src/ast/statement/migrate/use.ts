import { Statement, STATEMENT_KIND } from "../statement";

export class Use extends Statement {
  $kind: STATEMENT_KIND.USE = STATEMENT_KIND.USE;
  $database: string;
  static isUse(object: any): object is Use {
    return Statement.isStatement(object) && object.$kind === STATEMENT_KIND.USE;
  }

  constructor(database: string) {
    super();
    this.$database = database;
  }
}
