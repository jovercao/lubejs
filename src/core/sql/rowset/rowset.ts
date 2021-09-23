/**
 * 数据库行集，混入类型
 */

import { SQL, SQL_SYMBOLE } from '../sql';

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

    const proxied_proto = new Proxy(Object.create(Rowset.prototype), {
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
    // **********************************************************
  }

  $name?: CompatiableObjectName = undefined;
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
  as(alias: string): ProxiedRowset<T> {
    if (this.$alias) {
      throw new Error(`Rowset is exists alias: ${this.$alias}`);
    }
    this.$alias = alias;
    return this as ProxiedRowset<T>;
  }

  /**
   * 字段
   * @param name 节点名称
   */
  $field<P extends ColumnsOf<T>>(name: P): Field<DbValueType<T[P]>> {
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

  static isRowset(object: any): object is CompatibleRowset<any> | CompatibleRowset {
    return object?.$tag === SQL_SYMBOLE.ROWSET;
  }

  // static ensure<T extends RowObject>(table: CompatiableObjectName | ProxiedRowset<T>): ProxiedRowset<T> {
  //   if (!Rowset.isRowset(table)) {
  //     return Table.ensure(table)
  //   }
  //   return table;
  // }
}

export type CompatibleRowset<
  // eslint-disable-next-line
  T extends RowObject = {}
> =
  // | CompatibleTable<T, N>
  | Rowset<T>
  | ProxiedRowset<T>
  | Table<T>
  | ProxiedTable<T>
  | NamedSelect<T>
  | ProxiedNamedSelect<T>
  | TableVariant<T>
  | ProxiedTableVariant<T>
  | TableFuncInvoke<T>
  | ProxiedTableFuncInvoke<T>;

/**
 * 代理后的行集
 */
export type ProxiedRowset<T extends RowObject = RowObject> = Rowset<T> &
  {
    readonly [P in ColumnsOf<T>]: Field<DbValueType<T[P]>, P>;
  };

import { Field } from '../expression/field';
import { CompatiableObjectName } from '../object/db-object';
import { Star, ProxiedTableFuncInvoke, TableFuncInvoke } from '../statement';
import { ColumnsOf, DbValueType, RowObject } from '../types';
import { NamedSelect, ProxiedNamedSelect } from './named-select';
import { ProxiedTable, Table } from './table';
import { ProxiedTableVariant, TableVariant } from './table-variant';
import { Scalar } from '../scalar';
