import { SQL_SYMBOLE } from '../sql';
import { Field } from '../expression/field';
import { Select } from '../statement/crud/select';
import { ColumnsOf, DefaultRowObject, RowObject } from '../types';
import { ProxiedRowset, Rowset } from './rowset';

/**
 * 具名SELECT语句，可用于子查询，With语句等
 */
export class NamedSelect<
  T extends RowObject = DefaultRowObject,
  A extends string = string
> extends Rowset<T> {
  readonly $type: SQL_SYMBOLE.NAMED_SELECT = SQL_SYMBOLE.NAMED_SELECT;
  $select: Select<T>;
  $name: A;
  $alias!: never;

  private constructor(statement: Select<T>, name: A) {
    super();
    this.$name = name;
    this.$select = statement;
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
  >(statement: Select<T>, name: A): NamedSelect<T, A> {
    return new NamedSelect(statement, name) as ProxiedNamedSelect<T, A>;
  }
}

export type ProxiedNamedSelect<
  T extends RowObject = RowObject,
  N extends string = string
> = NamedSelect<T, N> &
  {
    readonly [P in ColumnsOf<T>]: Field<T[P], P>;
  };
