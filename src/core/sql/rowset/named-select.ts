import { SQL_SYMBOLE } from '../sql';
import { Field } from '../expression';
import {
  ColumnsOf,
  DataRowValueType,
  DefaultRowObject,
  RowObject,
} from '../types';
import { Rowset } from './rowset';

/**
 * 具名SELECT语句，可用于子查询，With语句等
 */
export class NamedSelect<
  T extends RowObject = DefaultRowObject
> extends Rowset<T> {
  readonly $type: SQL_SYMBOLE.NAMED_SELECT = SQL_SYMBOLE.NAMED_SELECT;
  $select: Select<T>;
  $name: string;
  $alias!: never;

  private constructor(statement: Select<T>, name: string) {
    super();
    this.$name = name;
    this.$select = statement;
    this.$proxy();
  }

  as(): never {
    throw new Error(`NamedSelect dos not allow with alias.`);
  }

  static isNamedSelect(object: any): object is NamedSelect {
    return object?.$type === SQL_SYMBOLE.NAMED_SELECT;
  }

  static create<
    T extends RowObject = DefaultRowObject,
    A extends string = string
  >(statement: Select<T>, name: A): NamedSelect<T> {
    return new NamedSelect(statement, name) as XNamedSelect<T, A>;
  }
}

export type XNamedSelect<
  T extends RowObject = RowObject,
  N extends string = string
> = NamedSelect<T> &
  {
    readonly [P in ColumnsOf<T>]: Field<DataRowValueType<T[P]>, P>;
  };

import { Select } from '../statement/crud/select';
