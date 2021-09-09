import { SQL_SYMBOLE } from '../sql';
import { ObjectName } from '../object/db-object';
import { CompatibleRowset } from '../rowset/rowset';
import { Scalar } from '../scalar';
import { Assignable } from './common/assignable';
import { ColumnDeclare, SelectColumn } from '../statement';

export class Field<
  T extends Scalar = any,
  N extends string = string
> extends Assignable<T> {
  static isField(object: any): object is Field {
    return object?.$type === SQL_SYMBOLE.FIELD;
  }
  constructor(name: N, parent?: CompatibleRowset) {
    super();
    this.$name = name;
    this.$table = parent;
  }
  $table?: CompatibleRowset;

  readonly $name: N;
  readonly $type: SQL_SYMBOLE.FIELD = SQL_SYMBOLE.FIELD;

  /**
   * 将Field转换为SelectColumn，如果存在字段映射，则会自动转换为 字段名 as 属性名
   */
  as(): SelectColumn<T, N>
  /**
   * 转换为SelectColumn并指定别名，继承于Expression
   */
  as<C extends string>(name: C): SelectColumn<T, C>
  as(name?: string): SelectColumn<T, string> {
    if (name) return super.as(name);
    if (this.$table?.$map) {
      if (!this.$table.$map[this.$name]) {
        throw new Error(`Rowset map property ${this.$name} not exists`);
      }
      return this.as(this.$table.$map[this.$name]) as any
    }
    return this.as(this.$name);
  }
}

export interface FieldName<N extends string> {
  table?: ObjectName;
  name: N;
}

export type CompatiableFieldName<N extends string = string> = FieldName<N> | N;

export type FieldTypeOf<T, F extends keyof T> = T[F] extends Scalar
 ? T[F]
 : never;
