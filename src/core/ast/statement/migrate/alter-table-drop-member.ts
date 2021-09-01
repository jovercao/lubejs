import { AST, SQL_SYMBOLE } from "../../ast";
import { SQL_SYMBOLE_TABLE_MEMBER } from "./table-member";

export class AlterTableDropMember extends AST {
  $type: SQL_SYMBOLE.ALTER_TABLE_DROP_MEMBER =
    SQL_SYMBOLE.ALTER_TABLE_DROP_MEMBER;
  $kind: SQL_SYMBOLE_TABLE_MEMBER;
  $name: string;
  constructor(kind: SQL_SYMBOLE_TABLE_MEMBER, name: string) {
    super();
    this.$kind = kind;
    this.$name = name;
  }
}
