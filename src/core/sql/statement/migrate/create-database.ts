import { Statement, STATEMENT_KIND } from '../statement';

export class CreateDatabase extends Statement {
  $kind: STATEMENT_KIND.CREATE_DATABASE = STATEMENT_KIND.CREATE_DATABASE;
  $name: string;
  $collate?: string;
  static isCreateDatabase(object: any): object is CreateDatabase {
    return (
      Statement.isStatement(object) &&
      object.$kind === STATEMENT_KIND.CREATE_DATABASE
    );
  }

  constructor(name: string) {
    super();
    this.$name = name;
  }

  collate(collate: string) {
    this.$collate = collate;
  }
}
