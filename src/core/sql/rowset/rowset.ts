/**
 * 数据库行集，混入类型
 */

import { SQL, SQL_SYMBOLE } from "../sql";

export type PropertyName = string;
export type ColumnName = string;
export type ColumnMap = Record<PropertyName, ColumnName>

// eslint-disable-next-line @typescript-eslint/ban-types
export abstract class Rowset<
  T extends RowObject = RowObject,
  N extends string = string
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
      }
    });
    Object.setPrototypeOf(this, proxied_proto);
    // **********************************************************
  }

  $name?: CompatiableObjectName<N> = undefined;
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
  $field<P extends ColumnsOf<T>>(name: P): Field<T[P], P> {
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
   * 建立数据库字段与JS对象的字段映射
   * 所有列名在被编译成SQL时将被自动转换为映射的名称
   * 在select中按 property返回
   */
  $around(columnMap: ColumnMap): this {
    this.$map = columnMap;
    return this;
  }

  static isRowset(object: any): object is Rowset {
    return object?.$tag === SQL_SYMBOLE.ROWSET;
  }

  static ensure<T extends RowObject>(table: CompatiableObjectName | ProxiedRowset<T>): ProxiedRowset<T> {
    if (!Rowset.isRowset(table)) {
      return Table.ensure(table)
    }
    return table;
  }
}

const propertyNames = Object.getOwnPropertyNames(Rowset.prototype);

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
  | TableFuncInvoke<T>;

/**
 * 代理后的行集
 */
export type ProxiedRowset<
T extends RowObject = RowObject,
N extends string = string
> = Rowset<T, N> & {
  readonly [P in ColumnsOf<T>]: Field<T[P], P>;
};


import { Field } from "../expression/field";
import { CompatiableObjectName } from "../object/db-object";
import { Star } from "../statement/crud/star";
import { TableFuncInvoke } from "../statement/programmer/table-func-invoke";
import { ColumnsOf, RowObject } from "../types";
import { NamedSelect, ProxiedNamedSelect } from "./named-select";
import { ProxiedTable, Table } from "./table";
import { ProxiedTableVariant, TableVariant } from "./table-variant";
