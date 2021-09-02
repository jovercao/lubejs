import { SQL_SYMBOLE } from '../sql';
import { Field } from '../expression/field';
import { ColumnsOf, RowObject } from '../types';
import { Rowset } from './rowset';

export class TableVariant<
  T extends RowObject = any,
  N extends string = string
> extends Rowset<T> {
  $type: SQL_SYMBOLE.IDENTIFIER = SQL_SYMBOLE.IDENTIFIER;
  $builtin!: boolean;
  $name: N;
  static isTableVariant(object: any): object is TableVariant {
    return object?.$type === SQL_SYMBOLE.TABLE_VARIANT;
  }
  private constructor(name: N) {
    super();
    this.$name = name;
  }

  static create<T extends RowObject = any, N extends string = string>(
    name: N
  ): ProxiedTableVariant<T, N> {
    return new TableVariant(name) as ProxiedTableVariant<T, N>;
  }
}

export type ProxiedTableVariant<
  T extends RowObject = RowObject,
  N extends string = string
> = TableVariant<T, N> &
  {
    readonly [P in ColumnsOf<T>]: Field<T[P], string>;
  };
