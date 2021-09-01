import { Condition } from "../../condition/condition";
import { DbType } from "../../db-type";
import { CheckConstraint } from "./check-constraint";
import { ColumnDeclareForAdd } from "./column-declare-for-add";
import { ForeignKey } from "./foreign-key";
import { PrimaryKey } from "./primary-key";
import { TableVariantMemberBuilder } from "./table-variant-member-builder";
import { UniqueKey } from "./unique-key";

export interface CreateTableMemberBuilder {
  column<N extends string, T extends DbType>(
    name: N,
    type: T
  ): ColumnDeclareForAdd<N>;

  primaryKey(name?: string): PrimaryKey;

  foreignKey(name?: string): ForeignKey;

  check(sql: Condition): CheckConstraint;
  check(name: string, sql: Condition): CheckConstraint;

  uniqueKey(name?: string): UniqueKey;
}

export const CreateTableMemberBuilder: CreateTableMemberBuilder = {
  ...TableVariantMemberBuilder,
  foreignKey(name?: string): ForeignKey {
    return new ForeignKey(name);
  },
};
