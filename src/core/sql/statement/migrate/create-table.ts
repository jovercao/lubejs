import { Condition } from '../../condition';
import { DbType } from '../../db-type';
import { XObjectName } from '../../object';
import { Statement, STATEMENT_KIND } from '../statement';
import { CheckConstraint } from './check-constraint';
import { ColumnDeclareForAdd } from './column-declare-for-add';
import { ForeignKey } from './foreign-key';
import { PrimaryKey } from './primary-key';
import { UniqueKey } from './unique-key';

export class CreateTable<N extends string = string> extends Statement {
  static isCreateTable(object: any): object is CreateTable {
    return (
      Statement.isStatement(object) &&
      object.$kind === STATEMENT_KIND.CREATE_TABLE
    );
  }
  readonly $kind: STATEMENT_KIND.CREATE_TABLE = STATEMENT_KIND.CREATE_TABLE;
  $body?: CreateTableMember[];
  $name: XObjectName<N>;

  constructor(name: XObjectName<N>) {
    super();
    this.$name = name;
  }

  // has(build: (builder: CreateTableBuilder) => CreateTableMember[]): this {
  //   this.$members = build(CreateTable);
  //   return this;
  // }

  /**
   * 定义表成员，使用构造器
   */
  as(build: (builder: CreateTableBuilder) => CreateTableMember[]): this;
  /**
   * 定义表成员，使用表成员变量
   */
  as(...members: CreateTableMember[]): this;
  as(members: CreateTableMember[]): this;
  as(
    ...members:
      | [(builder: CreateTableBuilder) => CreateTableMember[]]
      | CreateTableMember[]
      | [CreateTableMember[]]
  ): this {
    if (this.$body) {
      throw new Error(`CreateTable body is declared.`);
    }
    if (Array.isArray(members[0])) {
      members = members[0];
    }
    if (typeof members[0] === 'function') {
      this.as(...members[0](createTable));
      return this;
    }
    this.$body = members as CreateTableMember[];
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
  <N extends string>(name: XObjectName<N>): CreateTable<N>;
} & CreateTableBuilder;

export function createTable<N extends string>(
  name: XObjectName<N>,
  members?:
    | ((builder: CreateTableBuilder) => CreateTableMember[])
    | CreateTableMember[]
): CreateTable<N> {
  let result = new CreateTable(name);
  if (members) {
    result = result.as(members as any);
  }
  return result;
}

createTable.primaryKey = (name?: string): PrimaryKey => {
  return new PrimaryKey(name);
};
createTable.column = <N extends string, T extends DbType>(
  name: N,
  type: T
): ColumnDeclareForAdd<N> => {
  return new ColumnDeclareForAdd(name, type);
};
createTable.check = (
  nameOrSql: string | Condition,
  _sql?: Condition
): CheckConstraint => {
  let name: string | undefined;
  let sql: Condition;
  if (typeof nameOrSql === 'string') {
    name = nameOrSql;
    sql = _sql!;
  } else {
    sql = nameOrSql;
  }
  return new CheckConstraint(sql, name);
};
createTable.uniqueKey = (name?: string): UniqueKey => {
  return new UniqueKey(name);
};
createTable.foreignKey = (name?: string): ForeignKey => {
  return new ForeignKey(name);
};

export type CreateTableBuilder = typeof createTable;
