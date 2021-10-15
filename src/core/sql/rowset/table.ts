import { SQL_SYMBOLE } from '../sql';
import { Field } from '../expression';
import { XObjectName, DBObject } from '../object';
import {
  ColumnsOf,
  DataRowValueType,
  DefaultRowObject,
  RowObject,
} from '../types';
import { Rowset } from './rowset';
import type { XTableVariant } from './table-variant';

/**
 * 表对象，表和视图均使用该对象
 */
export class Table<T extends RowObject = DefaultRowObject>
  extends Rowset<T>
  implements DBObject
{
  constructor(name: XObjectName, builtIn = false) {
    super();
    this.$name = name;
    this.$builtin = builtIn;
    this.$proxy();
  }

  static create<
    T extends RowObject = DefaultRowObject,
    N extends string = string
  >(name: XObjectName<N>, builtIn = false): XTable<T> {
    return new Table<T>(name, builtIn) as XTable<T>;
  }

  $name: XObjectName;
  readonly $builtin: boolean;
  readonly $type: SQL_SYMBOLE.TABLE = SQL_SYMBOLE.TABLE;

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

  as!: <N extends string>(alias: N) => XTable<T>;

  static isTable(object: any): object is Table | XTable {
    return object?.$type === SQL_SYMBOLE.TABLE;
  }
}

export type XTables<
  // eslint-disable-next-line
  T extends RowObject = {}
> = XObjectName | XTable<T> | XTableVariant<T>;

/**
 * 代理后的表
 */
export type XTable<T extends RowObject = RowObject> = Table<T> &
  {
    readonly [P in ColumnsOf<T>]: Field<DataRowValueType<T[P]>, P>;
  };
