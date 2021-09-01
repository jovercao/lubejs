import { SQL_SYMBOLE } from '../ast';
import { Field } from '../expression/field';
import { CompatiableObjectName, DBObject } from '../object/db-object';
import { Star } from '../statement/crud/star';
import { ColumnsOf, DefaultRowObject, RowObject } from '../types';
import { Rowset } from './rowset';

export class Table<
    T extends RowObject = DefaultRowObject,
    N extends string = string
  >
  extends Rowset<T, N>
  implements DBObject
{
  private constructor(name: CompatiableObjectName<N>) {
    super();
    this.$name = name;
  }

  static create<
    T extends RowObject = DefaultRowObject,
    N extends string = string
  >(name: CompatiableObjectName<N>): ProxiedTable<T, N> {
    return new Table<T>(name) as ProxiedTable<T, N>;
  }

  $name: CompatiableObjectName<N>;
  $builtin: false = false;
  $type: SQL_SYMBOLE.TABLE = SQL_SYMBOLE.TABLE;

  // /**
  //  * 访问字段
  //  * @param name 节点名称
  //  */
  // field<P extends ColumnsOf<T>>(name: P): Field<T[P], P> {
  //   if (this.$alias) {
  //     return super.field(name);
  //   }
  //   return new Field<T[P], P>([name, ...pathName(this.$name)] as Name<P>);
  // }

  /**
   * 获取所有字段
   */
  get _(): Star<T> {
    if (this.$alias) {
      return super._;
    }
    return new Star(this);
  }

  as!: <N extends string>(alias: N) => ProxiedTable<T>;

  static isTable(object: any): object is Table {
    return object?.$type === SQL_SYMBOLE.TABLE;
  }

  static ensure<T extends RowObject>(
    table: CompatibleTable<T>
  ): ProxiedTable<T> {
    if (Table.isTable(table)) {
      return table as ProxiedTable<T>;
    }
    return new Table(table as CompatiableObjectName) as ProxiedTable<T>;
  }
}

export type CompatibleTable<
  // eslint-disable-next-line
  T extends RowObject = {},
  N extends string = string
> = CompatiableObjectName | ProxiedTable<T, N>;

/**
 * 代理后的表
 */
export type ProxiedTable<
  T extends RowObject = RowObject,
  N extends string = string
> = Table<T, N> &
  {
    readonly [P in ColumnsOf<T>]: Field<T[P], string>;
  };
