import { XObjectName } from '../../object';
import { Statement, STATEMENT_KIND } from '../statement';

export class DropView<N extends string = string> extends Statement {
  static isDropView(object: any): object is DropView {
    return (
      Statement.isStatement(object) && object.$kind === STATEMENT_KIND.DROP_VIEW
    );
  }
  $kind: STATEMENT_KIND.DROP_VIEW = STATEMENT_KIND.DROP_VIEW;
  $name: XObjectName<N>;

  constructor(name: XObjectName<N>) {
    super();
    this.$name = name;
  }
}
