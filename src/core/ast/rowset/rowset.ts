/**
 * 数据库行集，混入类型
 */

import { AST, SQL_SYMBOLE } from "../ast";
import { Field } from "../expression/field";
import { CompatiableObjectName } from "../object/db-object";
import { Star } from "../statement/crud/star";
import { TableFuncInvoke } from "../statement/programmer/table-func-invoke";
import { ColumnsOf, RowObject } from "../types";
import { NamedSelect, ProxiedNamedSelect } from "./named-select";
import { ProxiedTable, Table } from "./table";
import { ProxiedTableVariant, TableVariant } from "./table-variant";

// eslint-disable-next-line @typescript-eslint/ban-types
export abstract class Rowset<
  T extends RowObject = RowObject,
  N extends string = string
> extends AST {
  protected constructor() {
    super();
    // *******************添加代理字段名属性******************
    // ***** 修改继承原型链为 this > Rowset & FieldProxy > AST ******
    const proto = Object.getPrototypeOf(this);
    const proxied_proto = new Proxy(Object.create(proto), {
      get: (target: any, key: string | number | symbol) => {
        const value = Reflect.get(this, key);
        if (value !== undefined || Reflect.has(this ,key)) return value;
        if (typeof key === 'string') {
          // 两个$表示转义符
          if (key.startsWith('$$')) {
            key = key.substr(1);
          }
          return this.$(key as ColumnsOf<T>);
        }
        return value;
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
  $map?: Record<string, string> = undefined;

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
  $<P extends ColumnsOf<T>>(name: P): Field<T[P], P> {
    if (!this.$name) {
      throw new Error('You must named rowset befor use field.');
    }
    const column = this.$map ? this.$map[name as string] : name;
    if (!column) {
      throw new Error(`Rowset $map is not exisits property ${name} map`);
    }
    return new Field(column as any, this);
  }

  // /**
  //  * 获取star的缩写方式，等价于 field
  //  */
  // get _(): Star<T> {
  //   return this.star;
  // }

  // /**
  //  * 访问字段的缩写方式，等价于 field
  //  */
  // $<P extends ColumnsOf<T>>(name: P): Field<T[P], P> {
  //   return this.field(name);
  // }

  /**
   * 获取所有字段
   */
  get _(): Star<T> {
    if (!this.$name) {
      throw new Error('You must named rowset befor use field.');
    }
    return new Star<T>(this);
  }

  $bind(map: Record<string, string>) {
    this.$map = map;
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
  readonly [P in ColumnsOf<T>]: Field<T[P], string>;
};
