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

export class TableVariant<T extends RowObject = any> extends Rowset<T> {
  $type: SQL_SYMBOLE.TABLE_VARIANT = SQL_SYMBOLE.TABLE_VARIANT;
  $builtin!: boolean;
  $body?: TableVariantMember[];
  $name: string;
  static isTableVariant(object: any): object is TableVariant {
    return object?.$type === SQL_SYMBOLE.TABLE_VARIANT;
  }

  constructor(name: string) {
    super();
    this.$name = name;
    // TIPS: Rowset 因为代理原因，不可直接继承
    this.body = (members: TableVariantMember[]): this => {
      this.$body = members;
      return this;
    };
    this.$proxy()
  }

  body!: (members: TableVariantMember[]) => this;
}

export type ProxiedTableVariant<T extends RowObject = RowObject> =
  TableVariant<T> &
    {
      readonly [P in ColumnsOf<T>]: Field<DbValueType<T[P]>, P>;
    };

export function createTableVariant<T extends RowObject = any>(
  name: string,
  members:
    | ((builder: TableVariantBuilder) => TableVariantMember[])
    | TableVariantMember[]
): ProxiedTableVariant<T> {
  if (typeof members === 'function') {
    members = members(createTableVariant);
  }
  return new TableVariant(name).body(members) as ProxiedTableVariant<T>;
}

createTableVariant.primaryKey = (name?: string): PrimaryKey => {
  return new PrimaryKey(name);
};

createTableVariant.column = <N extends string, T extends DbType>(
  name: N,
  type: T
): ColumnDeclareForAdd<N> => {
  return new ColumnDeclareForAdd(name, type);
};

createTableVariant.check = (
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

createTableVariant.uniqueKey = (name?: string): UniqueKey => {
  return new UniqueKey(name);
};

export type TableVariantBuilder = typeof createTableVariant;
