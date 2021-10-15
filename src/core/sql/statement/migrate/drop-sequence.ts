import { XObjectName } from '../../object';
import { Statement, STATEMENT_KIND } from '../statement';

export class DropSequence<N extends string = string> extends Statement {
  static isDropSequence(object: any): object is DropSequence {
    return (
      Statement.isStatement(object) &&
      object.$kind === STATEMENT_KIND.DROP_SEQUENCE
    );
  }
  $kind: STATEMENT_KIND.DROP_SEQUENCE = STATEMENT_KIND.DROP_SEQUENCE;
  $name: XObjectName<N>;

  constructor(name: XObjectName<N>) {
    super();
    this.$name = name;
  }
}
