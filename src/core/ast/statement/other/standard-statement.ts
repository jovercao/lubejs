import { Statement, STATEMENT_KIND } from "../statement";

export class StandardStatement extends Statement {
  $kind: STATEMENT_KIND.STANDARD_STATEMENT = STATEMENT_KIND.STANDARD_STATEMENT;
  $name: string;
  $datas: any[];
  static isStandardStatement(object: any): object is StandardStatement {
    return Statement.isStatement(object) && object.$kind === STATEMENT_KIND.STANDARD_STATEMENT;
  }
  constructor(kind: string, datas: any[]) {
    super();
    this.$name = kind;
    this.$datas = datas;
  }

  static create(kind: string, datas: any[]): StandardStatement {
    return new StandardStatement(kind, datas);
  }
}
