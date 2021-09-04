import { AlterTableDropMember } from "./alter-table-drop-member";
import { SQL_SYMBOLE_TABLE_MEMBER } from "./table-member";

export interface AlterTableDropBuilder {
  column(name: string): AlterTableDropMember;

  primaryKey(constraintName: string): AlterTableDropMember;

  foreignKey(constraintName: string): AlterTableDropMember;

  check(constraintName: string): AlterTableDropMember;

  uniqueKey(constraintName: string): AlterTableDropMember;
}

export const AlterTableDropBuilder: AlterTableDropBuilder = {
  column(name: string): AlterTableDropMember {
    return new AlterTableDropMember(SQL_SYMBOLE_TABLE_MEMBER.COLUMN, name);
  },

  primaryKey(name: string): AlterTableDropMember {
    return new AlterTableDropMember(SQL_SYMBOLE_TABLE_MEMBER.PRIMARY_KEY, name);
  },

  foreignKey(name: string): AlterTableDropMember {
    return new AlterTableDropMember(SQL_SYMBOLE_TABLE_MEMBER.FOREIGN_KEY, name);
  },

  check(name: string): AlterTableDropMember {
    return new AlterTableDropMember(
      SQL_SYMBOLE_TABLE_MEMBER.CHECK_CONSTRAINT,
      name
    );
  },

  uniqueKey(name: string): AlterTableDropMember {
    return new AlterTableDropMember(SQL_SYMBOLE_TABLE_MEMBER.UNIQUE_KEY, name);
  },
};
