import { Condition } from "../../condition/condition";
import { DbType } from "../../db-type";
import { CheckConstraint } from "./check-constraint";
import { ColumnDeclareForAdd } from "./column-declare-for-add";
import { PrimaryKey } from "./primary-key";
import { UniqueKey } from "./unique-key";

export interface TableVariantMemberBuilder {
  column<N extends string, T extends DbType>(
    name: N,
    type: T
  ): ColumnDeclareForAdd<N>;

  primaryKey(name?: string): PrimaryKey;

  check(sql: Condition): CheckConstraint;
  check(name: string, sql: Condition): CheckConstraint;

  uniqueKey(name?: string): UniqueKey;
}

export type TableVariantMember =
  | PrimaryKey
  | CheckConstraint
  | UniqueKey
  | ColumnDeclareForAdd;

export const TableVariantMemberBuilder: TableVariantMemberBuilder = {
  primaryKey(name?: string): PrimaryKey {
    return new PrimaryKey(name);
  },
  column<N extends string, T extends DbType>(
    name: N,
    type: T
  ): ColumnDeclareForAdd<N> {
    return new ColumnDeclareForAdd(name, type);
  },
  check(nameOrSql: string | Condition, _sql?: Condition): CheckConstraint {
    let name: string | undefined;
    let sql: Condition;
    if (typeof nameOrSql === 'string') {
      name = nameOrSql;
      sql = _sql!;
    } else {
      sql = nameOrSql;
    }
    return new CheckConstraint(sql, name);
  },
  uniqueKey(name?: string): UniqueKey {
    return new UniqueKey(name);
  },
};
