import { Condition } from "../../condition/condition";
import { DbType } from "../../db-type";
import { CheckConstraint, CheckConstraintBuilder } from "./check-constraint";
import { ColumnDeclareForAdd } from "./column-declare-for-add";
import { CreateTableMember } from "./create-table";
import { ForeignKey } from "./foreign-key";
import { PrimaryKey } from "./primary-key";
import { UniqueKey } from "./unique-key";


export type AlterTableAddMember = CreateTableMember;

export interface AlterTableAddBuilder {
  column<N extends string, T extends DbType>(
    name: N,
    type: T
  ): ColumnDeclareForAdd<N>;

  primaryKey(name?: string): PrimaryKey;

  foreignKey(name?: string): ForeignKey;

  uniqueKey(name?: string): UniqueKey;

  check: CheckConstraintBuilder;
}

export const AlterTableAddBuilder: AlterTableAddBuilder = {
  column<N extends string, T extends DbType>(
    name: N,
    type: T
  ): ColumnDeclareForAdd<N> {
    return new ColumnDeclareForAdd(name, type);
  },

  primaryKey(name?: string): PrimaryKey {
    return new PrimaryKey(name);
  },

  foreignKey(name?: string): ForeignKey {
    return new ForeignKey(name);
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
