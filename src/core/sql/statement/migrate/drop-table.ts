import { XObjectName } from '../../object';
import { Statement, STATEMENT_KIND } from '../statement';

export class DropTable<N extends string = string> extends Statement {
  static isDropTable(object: any): object is DropTable {
    return (
      Statement.isStatement(object) &&
      object.$kind === STATEMENT_KIND.DROP_TABLE
    );
  }
  $kind: STATEMENT_KIND.DROP_TABLE = STATEMENT_KIND.DROP_TABLE;
  $name: XObjectName<N>;

  constructor(name: XObjectName<N>) {
    super();
    this.$name = name;
  }
}
