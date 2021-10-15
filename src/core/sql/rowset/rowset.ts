
/**
 * 数据库行集，混入类型
 */

import { SQL, SQL_SYMBOLE } from '../sql';
import { Field } from '../expression';
import { Star, XObjectName } from '../object';
import { ColumnsOf, DataRowValueType, RowObject } from '../types';

export type PropertyName = string;
export type ColumnName = string;
export type ColumnMap = Record<PropertyName, ColumnName>;

// TIPS: 请勿改变Rowset声明方式，Typescript不支持类声明合并,而使用type别名方式中的动态属性亦不可被继承

// eslint-disable-next-line @typescript-eslint/ban-types
export abstract class Rowset<
  T extends RowObject = RowObject,
  R extends RowObject = T
> extends SQL {
  protected constructor() {
    super();
    // *******************添加代理字段名属性******************
    // ***** 修改继承原型链为 this > Rowset & FieldProxy > AST ******
    // **********************************************************
  }

  /**
   * 继承Rowset后必须在调用此函数，以达到创建代理Rowset的目的。
   */
  protected $proxy(): XRowset<T> {
    const proxied_proto = new Proxy(Object.create(this.constructor.prototype), {
      get: (proto: any, key: string | number | symbol) => {
        if (key in proto) {
          return Reflect.get(proto, key, this);
        }
        if (typeof key === 'string') {
          // 两个$表示转义符
          if (key.startsWith('$$')) {
            key = key.substr(1);
          }
          return this.$field(key as ColumnsOf<T>);
        }
        return undefined;
      },
    });
    Object.setPrototypeOf(this, proxied_proto);
    return this as XRowset<T>;
  }

  $name?: XObjectName = undefined;
  /**
   * 别名
   */
  $alias?: string = undefined; // 保留此初值，避免代理覆盖属性

  $tag: SQL_SYMBOLE.ROWSET = SQL_SYMBOLE.ROWSET;

  /**
   * 属性-->字段 映射表
   */
  $map?: ColumnMap = undefined;

  /**
   * 为当前表添加别名
   */
  as(alias: string): XRowset<T> {
    if (this.$alias) {
      throw new Error(`Rowset is exists alias: ${this.$alias}`);
    }
    this.$alias = alias;
    return this as XRowset<T>;
  }

  /**
   * 字段
   * @param name 节点名称
   */
  $field<P extends ColumnsOf<T>>(name: P): Field<DataRowValueType<T[P]>> {
    if (!this.$name) {
      throw new Error('You must named rowset befor use field.');
    }
    const column = this.$map ? this.$map[name as string] : name;
    if (!column) {
      throw new Error(`Rowset map is not exisits property ${name} map`);
    }
    return new Field(column as any, this);
  }

  /**
   * 获取所有字段
   */
  get star(): Star<T> {
    if (!this.$name) {
      throw new Error('You must named rowset befor use field.');
    }
    return new Star<T>(this);
  }

  /**
   * 该方法为内部方法，用户请不要使用该方法
   */
  $around(columnMap: ColumnMap): this {
    this.$map = columnMap;
    return this;
  }

  static isRowset(object: any): object is XRowsets<any> | XRowsets {
    return object?.$tag === SQL_SYMBOLE.ROWSET;
  }

  // static ensure<T extends RowObject>(table: CompatiableObjectName | ProxiedRowset<T>): ProxiedRowset<T> {
  //   if (!Rowset.isRowset(table)) {
  //     return Table.ensure(table)
  //   }
  //   return table;
  // }
}

export type XRowsets<
  // eslint-disable-next-line
  T extends RowObject = {}
> =
  | Rowset<T>
  | XRowset<T>
  | Table<T>
  | XTable<T>
  | NamedSelect<T>
  | XNamedSelect<T>
  | TableVariant<T>
  | XTableVariant<T>
  | TableFuncInvoke<T>
  | XTableFuncInvoke<T>;

/**
 * 代理后的行集
 */
export type XRowset<T extends RowObject = RowObject> = Rowset<T> &
  {
    readonly [P in ColumnsOf<T>]: Field<DataRowValueType<T[P]>, P>;
  };

import { NamedSelect, XNamedSelect } from './named-select';
import { XTable, Table } from './table';
import { XTableVariant, TableVariant } from './table-variant';
import { XTableFuncInvoke, TableFuncInvoke } from './table-func-invoke';
