import { SQL_SYMBOLE } from '../sql';
import { Rowset } from './rowset';
import { Field } from '../expression/field';
import type { Select } from '../statement';
import {
  ColumnsOf,
  DataRowValueType,
  DefaultRowObject,
  RowObject,
} from '../types';

export class WithSelect<T extends RowObject = any> extends Rowset<T> {
  private constructor(name: string, select: Select<T>) {
    super();
    this.$name = name;
    this.$select = select;
    this.$proxy();
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
  >(name: string, select: Select<T>): XWithSelect<T> {
    return new WithSelect(name, select) as XWithSelect<T>;
  }
}

export type XWithSelect<T extends RowObject = RowObject> = WithSelect<T> &
  {
    readonly [P in ColumnsOf<T>]: Field<DataRowValueType<T[P]>, P>;
  };
