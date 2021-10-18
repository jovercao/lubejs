import { SQL_SYMBOLE } from '../sql';
import { Field } from '../expression';
import { ColumnsOf, DataRowValueType, RowObject } from '../types';
import { Rowset, XRowset } from './rowset';
import { DbType } from '../db-type';
import type { Condition } from '../condition';

export type TableVariantMember =
  | PrimaryKey
  | CheckConstraint
  | UniqueKey
  | ColumnDeclareForAdd;

export class TableVariant<T extends RowObject = any> extends Rowset<T> {
  readonly $type: SQL_SYMBOLE.TABLE_VARIANT = SQL_SYMBOLE.TABLE_VARIANT;
  $builtin!: boolean;
  $body?: TableVariantMember[];
  $name: string;
  static isTableVariant(object: any): object is TableVariant {
    return object?.$type === SQL_SYMBOLE.TABLE_VARIANT;
  }

  constructor(name: string) {
    super();
    this.$name = name;
    this.$proxy();
  }

  /**
   * 创建用于查询的别名
   */
  as(alias: string): XRowset<T>;
  /**
   * 表变量成员声明
   */
  as(members: TableVariantMember[]): this;
  as(members: string | TableVariantMember[]): this | XRowset<T> {
    if (typeof members === 'string') {
      return super.as(members);
    }
    this.$body = members;
    return this;
  }
}

export type XTableVariant<T extends RowObject = RowObject> = TableVariant<T> &
  {
    readonly [P in ColumnsOf<T>]: Field<DataRowValueType<T[P]>, P>;
  };

export function createTableVariant<T extends RowObject = any>(
  name: string,
  members:
    | ((builder: TableVariantBuilder) => TableVariantMember[])
    | TableVariantMember[]
): XTableVariant<T> {
  if (typeof members === 'function') {
    members = members(createTableVariant);
  }
  return new TableVariant(name).as(members) as XTableVariant<T>;
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

import {
  CheckConstraint,
  ColumnDeclareForAdd,
  PrimaryKey,
  UniqueKey,
} from '../statement';
