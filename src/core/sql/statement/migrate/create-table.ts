import { CompatiableObjectName } from '../../object/db-object';
import { Statement, STATEMENT_KIND } from '../statement';
import { CheckConstraint } from './check-constraint';
import { ColumnDeclareForAdd } from './column-declare-for-add';
import { CreateTableMemberBuilder } from './create-table-member-builder';
import { ForeignKey } from './foreign-key';
import { PrimaryKey } from './primary-key';
import { UniqueKey } from './unique-key';

export class CreateTable<N extends string = string> extends Statement {
  static isCreateTable(object: any): object is CreateTable {
    return Statement.isStatement(object) && object.$kind === STATEMENT_KIND.CREATE_TABLE;
  }
  readonly $kind: STATEMENT_KIND.CREATE_TABLE = STATEMENT_KIND.CREATE_TABLE;
  $members?: CreateTableMember[];
  $name: CompatiableObjectName<N>;

  constructor(name: CompatiableObjectName<N>) {
    super();
    this.$name = name;
  }

  // has(build: (builder: CreateTableBuilder) => CreateTableMember[]): this {
  //   this.$members = build(CreateTable);
  //   return this;
  // }

  as(build: (builder: CreateTableMemberBuilder) => CreateTableMember[]): this;
  as(...members: CreateTableMember[]): this;
  as(
    ...members:
      | [(builder: CreateTableMemberBuilder) => CreateTableMember[]]
      | CreateTableMember[]
  ): this {
    if (typeof members[0] === 'function') {
      this.as(...members[0](CreateTableMemberBuilder));
      return this;
    }
    if (!this.$members) {
      this.$members = [];
    }
    this.$members.push(...(members as CreateTableMember[]));
    return this;
  }
}

export type CreateTableMember =
  | ColumnDeclareForAdd
  | PrimaryKey
  | ForeignKey
  | CheckConstraint
  | UniqueKey;

export type CreateTableHandler = {
  <N extends string>(name: CompatiableObjectName<N>): CreateTable<N>;
} & CreateTableMemberBuilder;
