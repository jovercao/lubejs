import { Statement, STATEMENT_KIND } from '../statement';

export class DropDatabase extends Statement {
  $kind: STATEMENT_KIND.DROP_DATABASE = STATEMENT_KIND.DROP_DATABASE;
  $name: string;
  static isDropDatabase(object: any): object is DropDatabase {
    return (
      Statement.isStatement(object) &&
      object.$kind === STATEMENT_KIND.DROP_DATABASE
    );
  }

  constructor(name: string) {
    super();
    this.$name = name;
  }
}
