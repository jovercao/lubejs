import { XObjectName } from '../../object';
import { RowObject } from '../../types';
import { Select } from '../crud';
import { Statement, STATEMENT_KIND } from '../statement';

export class AlterView<
  T extends RowObject = any,
  N extends string = string
> extends Statement {
  static isAlterView(object: any): object is AlterView {
    return (
      Statement.isStatement(object) &&
      object.$kind === STATEMENT_KIND.ALTER_VIEW
    );
  }
  $kind: STATEMENT_KIND.ALTER_VIEW = STATEMENT_KIND.ALTER_VIEW;
  $name: XObjectName<N>;
  $body?: Select<T>;
  constructor(name: XObjectName<N>) {
    super();
    this.$name = name;
  }

  as(select: Select<T>): this {
    this.$body = select;
    return this;
  }
}
