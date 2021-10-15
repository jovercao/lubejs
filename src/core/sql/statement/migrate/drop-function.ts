import { XObjectName } from '../../object';
import { Statement, STATEMENT_KIND } from '../statement';

export class DropFunction<N extends string = string> extends Statement {
  static isDropFunction(object: any): object is DropFunction {
    return (
      Statement.isStatement(object) &&
      object.$kind === STATEMENT_KIND.DROP_FUNCTION
    );
  }
  $kind: STATEMENT_KIND.DROP_FUNCTION = STATEMENT_KIND.DROP_FUNCTION;
  $name: XObjectName<N>;

  constructor(name: XObjectName<N>) {
    super();
    this.$name = name;
  }
}
