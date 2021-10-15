import { Condition } from '../../condition';
import { DbType } from '../../db-type';
import { XObjectName } from '../../object/';
import { Statement, STATEMENT_KIND } from '../statement';
import { AlterTableDropMember } from './alter-table-drop-member';
import { CheckConstraint, CheckConstraintBuilder } from './check-constraint';
import { ColumnDeclareForAdd } from './column-declare-for-add';
import { ColumnDeclareForAlter } from './column-declare-for-alter';
import { CreateTableMember } from './create-table';
import { ForeignKey } from './foreign-key';
import { PrimaryKey } from './primary-key';
import { SQL_SYMBOLE_TABLE_MEMBER } from './table-member';
import { UniqueKey } from './unique-key';

export class AlterTable<N extends string = string> extends Statement {
  static isAlterTable(object: any): object is AlterTable {
    return (
      Statement.isStatement(object) &&
      object.$kind === STATEMENT_KIND.ALTER_TABLE
    );
  }
  $kind: STATEMENT_KIND.ALTER_TABLE = STATEMENT_KIND.ALTER_TABLE;
  $name: XObjectName<N>;

  $adds?: AlterTableAddMember[];

  $drop?: AlterTableDropMember;

  $alterColumn?: ColumnDeclareForAlter;

  constructor(name: XObjectName<N>) {
    super();
    this.$name = name;
  }

  private _assertDrop() {
    if (this.$adds || this.$alterColumn) {
      throw new Error(`A alter statement is only used by add or drop.`);
    }
    if (this.$drop) {
      throw new Error(`A drop item is exists in it.`);
    }
    // if (!this.$drops) {
    //   this.$drops = [];
    // }
  }

  private _assertAdd() {
    if (this.$drop || this.$alterColumn) {
      throw new Error(`A alter statement is only used by add or drop.`);
    }
    if (!this.$adds) {
      this.$adds = [];
    }
  }

  add(
    build: (
      builder: AlterTableBuilder['add']
    ) => AlterTableAddMember | AlterTableAddMember[]
  ): this;
  add(...members: AlterTableAddMember[]): this;
  add(
    ...members:
      | [
          (
            builder: AlterTableBuilder['add']
          ) => AlterTableAddMember[] | AlterTableAddMember
        ]
      | AlterTableAddMember[]
  ): this {
    this._assertAdd();
    if (typeof members[0] === 'function') {
      const ret = members[0](alterTable.add);
      members = Array.isArray(ret) ? ret : [ret];
      this.add(...members);
      return this;
    }
    this.$adds!.push(...(members as AlterTableAddMember[]));
    return this;
  }

  addColumn(
    columnOrBuilder:
      | ColumnDeclareForAdd
      | ((
          columnBuilder: <N extends string, T extends DbType>(
            name: N,
            type: T
          ) => ColumnDeclareForAdd<N>
        ) => ColumnDeclareForAdd)
  ): this {
    this._assertAdd();
    let column: ColumnDeclareForAdd;
    if (typeof columnOrBuilder === 'function') {
      column = columnOrBuilder(alterTable.add.column);
    } else {
      column = columnOrBuilder;
    }
    this.$adds!.push(column);
    return this;
  }

  addPrimaryKey(
    keyOrBuilder:
      | PrimaryKey
      | ((keyBuilder: (name?: string) => PrimaryKey) => PrimaryKey)
  ): this {
    this._assertAdd();
    let key: PrimaryKey;
    if (typeof keyOrBuilder === 'function') {
      key = keyOrBuilder(alterTable.add.primaryKey);
    } else {
      key = keyOrBuilder;
    }
    this.$adds!.push(key);
    return this;
  }

  addForeignKey(
    keyOrBuilder:
      | ForeignKey
      | ((keyBuilder: (name?: string) => ForeignKey) => ForeignKey)
  ): this {
    this._assertAdd();
    let key: ForeignKey;
    if (typeof keyOrBuilder === 'function') {
      key = keyOrBuilder(alterTable.add.foreignKey);
    } else {
      key = keyOrBuilder;
    }
    this.$adds!.push(key);
    return this;
  }

  addUnionKey(
    keyOrBuilder:
      | UniqueKey
      | ((keyBuilder: (name?: string) => UniqueKey) => UniqueKey)
  ): this {
    this._assertAdd();
    let key: UniqueKey;
    if (typeof keyOrBuilder === 'function') {
      key = keyOrBuilder(alterTable.add.uniqueKey);
    } else {
      key = keyOrBuilder;
    }
    this.$adds!.push(key);
    return this;
  }

  addCheck(
    keyOrBuilder:
      | CheckConstraint
      | ((checkBuilder: CheckConstraintBuilder) => CheckConstraint)
  ): this {
    this._assertAdd();
    let check: CheckConstraint;
    if (typeof keyOrBuilder === 'function') {
      check = keyOrBuilder(alterTable.add.check);
    } else {
      check = keyOrBuilder;
    }
    this.$adds!.push(check);
    return this;
  }

  drop(member: AlterTableDropMember): this;
  drop(
    build: (builder: AlterTableBuilder['drop']) => AlterTableDropMember
  ): this;
  drop(
    memberOrBuilder:
      | ((builder: AlterTableBuilder['drop']) => AlterTableDropMember)
      | AlterTableDropMember
  ): this {
    this._assertDrop();
    if (typeof memberOrBuilder === 'function') {
      const member = memberOrBuilder(alterTable.drop);
      this.$drop = member;
      return this;
    }
    this.$drop = memberOrBuilder;
    return this;
  }

  dropColumn(name: string): this {
    this._assertDrop();
    this.$drop = alterTable.drop.column(name);
    return this;
  }

  dropPrimaryKey(name: string): this {
    this._assertDrop();
    this.$drop = alterTable.drop.primaryKey(name);
    return this;
  }

  dropForeignKey(name: string): Statement {
    this._assertDrop();
    this.$drop = alterTable.drop.foreignKey(name);
    return this;
  }

  dropCheck(name: string): this {
    this._assertDrop();
    this.$drop = alterTable.drop.check(name);
    return this;
  }

  dropUniqueKey(name: string): this {
    this._assertDrop();
    this.$drop = alterTable.drop.uniqueKey(name);
    return this;
  }

  alterColumn(
    buildColumn:
      | ColumnDeclareForAlter
      | ((
          builder: (name: string, type: DbType) => ColumnDeclareForAlter
        ) => ColumnDeclareForAlter)
  ): this {
    if (this.$adds || this.$drop || this.$alterColumn) {
      throw new Error(
        `Alter statement is used only one of add or drop or alterColumn.`
      );
    }
    if (typeof buildColumn === 'function') {
      this.$alterColumn = buildColumn(alterTable.alter.column);
    } else {
      this.$alterColumn = buildColumn;
    }
    return this;
  }
}

export function alterTable(name: XObjectName): AlterTable {
  return new AlterTable(name);
}

alterTable.add = {
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

alterTable.drop = {
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

alterTable.alter = {
  column<N extends string, T extends DbType>(
    name: N,
    type: T
  ): ColumnDeclareForAlter<N> {
    return new ColumnDeclareForAlter(name, type);
  },
};

export type AlterTableBuilder = typeof alterTable;

export type AlterTableAddMember = CreateTableMember;
