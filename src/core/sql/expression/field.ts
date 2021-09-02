import { SQL_SYMBOLE } from '../sql';
import { ObjectName } from '../object/db-object';
import { CompatibleRowset } from '../rowset/rowset';
import { Scalar } from '../scalar';
import { Assignable } from './common/assignable';

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
}

export interface FieldName<N extends string> {
  table?: ObjectName;
  name: N;
}

export type CompatiableFieldName<N extends string = string> = FieldName<N> | N;

export type FieldTypeOf<T, F extends keyof T> = T[F] extends Scalar
 ? T[F]
 : never;
