import { DbType } from '../../db-type';
import { CompatiableObjectName } from '../../object/db-object';
import { RowObject } from '../../types';
import { Select } from '../crud/select';
import { Statement, STATEMENT_KIND } from '../statement';
import {
  AlterTableAddBuilder,
  AlterTableAddMember,
} from './alter-table-add-builder';
import { AlterTableDropBuilder } from './alter-table-drop-builder';
import { AlterTableDropMember } from './alter-table-drop-member';
import { CheckConstraint, CheckConstraintBuilder } from './check-constraint';
import { ColumnDeclareForAdd } from './column-declare-for-add';
import { ColumnDeclareForAlter } from './column-declare-for-alter';
import { ForeignKey } from './foreign-key';
import { PrimaryKey } from './primary-key';
import { UniqueKey } from './unique-key';

export class AlterTable<N extends string = string> extends Statement {
  static isAlterTable(object: any): object is AlterTable {
    return Statement.isStatement(object) && object.$kind === STATEMENT_KIND.ALTER_TABLE;
  }
  $kind: STATEMENT_KIND.ALTER_TABLE = STATEMENT_KIND.ALTER_TABLE;
  $name: CompatiableObjectName<N>;

  $adds?: AlterTableAddMember[];

  $drop?: AlterTableDropMember;

  $alterColumn?: ColumnDeclareForAlter;

  constructor(name: CompatiableObjectName<N>) {
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
      builder: AlterTableAddBuilder
    ) => AlterTableAddMember | AlterTableAddMember[]
  ): this;
  add(...members: AlterTableAddMember[]): this;
  add(
    ...members:
      | [
          (
            builder: AlterTableAddBuilder
          ) => AlterTableAddMember[] | AlterTableAddMember
        ]
      | AlterTableAddMember[]
  ): this {
    this._assertAdd();
    if (typeof members[0] === 'function') {
      const ret = members[0](AlterTableAddBuilder);
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
      column = columnOrBuilder(AlterTableAddBuilder.column);
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
      key = keyOrBuilder(AlterTableAddBuilder.primaryKey);
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
      key = keyOrBuilder(AlterTableAddBuilder.foreignKey);
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
      key = keyOrBuilder(AlterTableAddBuilder.uniqueKey);
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
      check = keyOrBuilder(AlterTableAddBuilder.check);
    } else {
      check = keyOrBuilder;
    }
    this.$adds!.push(check);
    return this;
  }

  drop(member: AlterTableDropMember): this;
  drop(build: (builder: AlterTableDropBuilder) => AlterTableDropMember): this;
  drop(
    memberOrBuilder:
      | ((builder: AlterTableDropBuilder) => AlterTableDropMember)
      | AlterTableDropMember
  ): this {
    this._assertDrop();
    if (typeof memberOrBuilder === 'function') {
      const member = memberOrBuilder(AlterTableDropBuilder);
      this.$drop = member;
      return this;
    }
    this.$drop = memberOrBuilder;
    return this;
  }

  dropColumn(name: string): this {
    this._assertDrop();
    this.$drop = AlterTableDropBuilder.column(name);
    return this;
  }

  dropPrimaryKey(name: string): this {
    this._assertDrop();
    this.$drop = AlterTableDropBuilder.primaryKey(name);
    return this;
  }

  dropForeignKey(name: string): Statement {
    this._assertDrop();
    this.$drop = AlterTableDropBuilder.foreignKey(name);
    return this;
  }

  dropCheck(name: string): this {
    this._assertDrop();
    this.$drop = AlterTableDropBuilder.check(name);
    return this;
  }

  dropUniqueKey(name: string): this {
    this._assertDrop();
    this.$drop = AlterTableDropBuilder.uniqueKey(name);
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
      this.$alterColumn = buildColumn(
        (name: string, type: DbType) => new ColumnDeclareForAlter(name, type)
      );
    } else {
      this.$alterColumn = buildColumn;
    }
    return this;
  }
}

export class CreateView<
  T extends RowObject = any,
  N extends string = string
> extends Statement {
  static isCreateView(object: any): object is CreateView {
    return Statement.isStatement(object) && object.$kind === STATEMENT_KIND.CREATE_VIEW;
  }
  $kind: STATEMENT_KIND.CREATE_VIEW = STATEMENT_KIND.CREATE_VIEW;
  $name: CompatiableObjectName<N>;
  $body?: Select<T>;
  constructor(name: CompatiableObjectName<N>) {
    super();
    this.$name = name;
  }

  as(select: Select<T>): this {
    this.$body = select;
    return this;
  }
}
