import { SQL_SYMBOLE } from '../sql';
import { Field } from '../expression/field';
import { ColumnsOf, DbValueType, RowObject } from '../types';
import { Rowset } from './rowset';
import {
  CheckConstraint,
  ColumnDeclareForAdd,
  PrimaryKey,
  UniqueKey,
} from '../statement/migrate';
import { DbType } from '../db-type';
import { Condition } from '../condition';

export type TableVariantMember =
  | PrimaryKey
  | CheckConstraint
  | UniqueKey
  | ColumnDeclareForAdd;

export const TableVariantMemberBuilder = {
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

export type TableVariantMemberBuilder = typeof TableVariantMemberBuilder;

export class TableVariant<T extends RowObject = any> extends Rowset<T> {
  $type: SQL_SYMBOLE.IDENTIFIER = SQL_SYMBOLE.IDENTIFIER;
  $builtin!: boolean;
  $members: TableVariantMember[];
  $name: string;
  static isTableVariant(object: any): object is TableVariant {
    return object?.$type === SQL_SYMBOLE.TABLE_VARIANT;
  }

  constructor(name: string, members: TableVariantMember[]) {
    super();
    this.$name = name;
    this.$members = members;
  }

  static create<T extends RowObject = any, N extends string = string>(
    name: N,
    members: TableVariantMember[]
  ): ProxiedTableVariant<T> {
    return new TableVariant(name, members) as ProxiedTableVariant<T>;
  }
}

export type ProxiedTableVariant<T extends RowObject = RowObject> =
  TableVariant<T> &
    {
      readonly [P in ColumnsOf<T>]: Field<DbValueType<T[P]>, P>;
    };
