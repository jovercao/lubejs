import { SQL_SYMBOLE } from '../sql';
import { Rowset } from './rowset';

export class WithSelect<T extends RowObject = any> extends Rowset<T> {
  private constructor(name: string, select: Select<T>) {
    super();
    this.$name = name;
    this.$select = select;
  }

  readonly $type: SQL_SYMBOLE.WITH_SELECT = SQL_SYMBOLE.WITH_SELECT;
  $select: Select<T>;
  $alias?: string;

  /**
   * WITH 声明名称
   */
  $name: string;
  static isWithSelect(object: any): object is WithSelect {
    return object?.$type === SQL_SYMBOLE.WITH_SELECT;
  }

  static create<
    T extends RowObject = DefaultRowObject,
    N extends string = string
  >(name: string, select: Select<T>): ProxiedWithSelect<T> {
    return new WithSelect(name, select) as ProxiedWithSelect<T>;
  }
}

export type ProxiedWithSelect<T extends RowObject = RowObject> = WithSelect<T> &
  {
    readonly [P in ColumnsOf<T>]: Field<DbValueType<T[P]>, P>;
  };

import { Field } from '../expression/field';
import { Select } from '../statement/crud/select';
import { ColumnsOf, DbValueType, DefaultRowObject, RowObject } from '../types';
