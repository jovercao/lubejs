import { XObjectName } from '../../object';
import { Statement, STATEMENT_KIND } from '../statement';

export class DropIndex<N extends string = string> extends Statement {
  static isDropIndex(object: any): object is DropIndex {
    return (
      Statement.isStatement(object) &&
      object.$kind === STATEMENT_KIND.DROP_INDEX
    );
  }
  $kind: STATEMENT_KIND.DROP_INDEX = STATEMENT_KIND.DROP_INDEX;
  $table: XObjectName;
  $name: N;

  constructor(table: XObjectName, name: N) {
    super();
    this.$table = table;
    this.$name = name;
  }
}
