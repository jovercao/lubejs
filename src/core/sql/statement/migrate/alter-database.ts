import { Statement, STATEMENT_KIND } from "../statement";

export class AlterDatabase extends Statement {
  $kind: STATEMENT_KIND.ALTER_DATABASE = STATEMENT_KIND.ALTER_DATABASE;
  $name: string;
  $collate!: string;
  static isAlterDatabase(object: any): object is AlterDatabase {
    return Statement.isStatement(object) && object.$kind === STATEMENT_KIND.ALTER_DATABASE;
  }

  constructor(name: string) {
    super();
    this.$name = name;
  }

  collate(collate: string): this {
    this.$collate = collate;
    return this;
  }
}
