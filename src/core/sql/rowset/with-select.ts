import { SQL_SYMBOLE } from "../sql";
import { Rowset } from "./rowset";

export class WithSelect<
  T extends RowObject = any,
  N extends string = string
> extends Rowset<T> {
  private constructor(name: N, select: Select<T>) {
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
  $name: N;
  static isWithSelect(object: any): object is WithSelect {
    return object?.$type === SQL_SYMBOLE.WITH_SELECT;
  }


  static create<
    T extends RowObject = DefaultRowObject,
    N extends string = string
  >(name: N, select: Select<T>): ProxiedWithSelect<T, N> {
    return new WithSelect(name, select) as ProxiedWithSelect<T, N>;
  }
}

export type ProxiedWithSelect<
  T extends RowObject = RowObject,
  N extends string = string
> = WithSelect<T, N> & {
  readonly [P in ColumnsOf<T>]: Field<T[P], P>;
};


import { Field } from "../expression/field";
import { Select } from "../statement/crud/select";
import { ColumnsOf, DefaultRowObject, RowObject } from "../types";
