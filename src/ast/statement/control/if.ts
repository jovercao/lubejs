import assert from "assert";
import { Condition } from "../../condition/condition";
import { SqlBuilder } from "../../../sql-builder";
import { Statement, STATEMENT_KIND } from "../statement";

export class If extends Statement {
  $kind: STATEMENT_KIND.IF = STATEMENT_KIND.IF;

  $then?: Statement;

  $elseif?: [Condition, Statement | undefined][];

  $else?: Statement;

  $condition: Condition;

  constructor(condition: Condition) {
    super();
    this.$condition = condition;
  }

  then(statement: Statement): this;
  then(statements: Statement[]): this;
  then(...statements: Statement[]): this;
  then(...args: Statement[] | [Statement[] | Statement]): this {
    assert(!this.$then && !this.$else, `Syntax error.`);
    let then: Statement;
    if (args.length === 1) {
      if (Array.isArray(args[0])) {
        then = SqlBuilder.block(args[0]);
      } else {
        then = args[0];
      }
    } else {
      then = SqlBuilder.block(args as Statement[]);
    }
    this.$then = then;
    return this;
  }

  elseif(condition: Condition): {
    then(...args: Statement[] | [Statement[] | Statement]): If;
  } {
    assert(!this.$else && this.$then, `Syntax error`);
    if (!this.$elseif) {
      this.$elseif = [];
    }
    const elseif: [Condition, Statement | undefined] = [condition, undefined];
    this.$elseif.push(elseif);
    return {
      then: (...args: Statement[] | [Statement[] | Statement]): this => {
        let then: Statement;
        if (args.length === 1) {
          if (Array.isArray(args[0])) {
            then = SqlBuilder.block(args[0]);
          } else {
            then = args[0];
          }
        } else {
          then = SqlBuilder.block(args as Statement[]);
        }
        elseif[1] = then;
        return this;
      },
    };
  }

  else(statement: Statement): this;
  else(statements: Statement[]): this;
  else(...statements: Statement[]): this;
  else(...args: Statement[] | [Statement[] | Statement]): this {
    assert(this.$then && !this.$else, `Syntax error.`);
    let _else: Statement;
    if (args.length === 1) {
      if (Array.isArray(args[0])) {
        _else = SqlBuilder.block(args[0]);
      } else {
        _else = args[0];
      }
    } else {
      _else = SqlBuilder.block(args as Statement[]);
    }
    this.$else = _else;
    return this;
  }

  static isIf(object: any): object is If {
    return Statement.isStatement(object) && object.$kind === STATEMENT_KIND.IF;
  }
}
