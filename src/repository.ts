/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/ban-types */
import { CompatibleCondition, FieldsOf, ProxiedTable, RowObject, Table } from "./ast";
import { Executor } from "./execute";
import { FROM_DB, Queryable } from "./queryable";
import { EntityConstructor, EntityMetadata, MetadataStore } from "./metadata";
import { and, identityValue, val } from "./builder";
import { ScalarType } from "./types";
import { ensureCondition } from "./util";

export type RefKeyOf<T> = ({ [P in keyof T]: T[P] extends ScalarType ? never : P })[keyof T]

export type FetchProps<T> = {
  [P in RefKeyOf<T>]?: true | FetchProps<T[P] extends Array<infer X> ? X : T[P]>
}

export type FetchOptions<T> = {
  includes?: FetchProps<T>
  nocache?: boolean
}

export type UpdateOptions = {
  /**
   * 是否重新加被保存的项,默认不重新加载
   */
  reload?: boolean
}

export function isEntityConstructor(value: any): value is EntityConstructor {
  return typeof value === 'function' && !!MetadataStore.get(value)
}

export function isFromDb(value: object): boolean {
  return Reflect.get(value, FROM_DB)
}


export class Repository<T extends RowObject> extends Queryable<T> {
  protected metadata: EntityMetadata
  protected rowset: ProxiedTable<T>

  constructor(
    executor: Executor,
    public entityType: EntityConstructor<T>) {
    super(executor, MetadataStore.get(entityType))
  }

  /**
   * 通过主键查询一个项
   */
  async get(key: ScalarType, options?: FetchOptions<T>): Promise<T> {
    let query = this.filter(rowset => rowset.field(this.metadata.idProperty.name as FieldsOf<T>).eq(key as any))
    if (options?.includes) {
      query = query.include(options.includes)
    }
    return await query.fetchFirst()
  }

  async add(items: T | T[], options?: UpdateOptions): Promise<void> {
    if (!Array.isArray(items)) {
      items = [items]
    }
    for(const item of items) {
      const data = this.toDataRow(item)
      await this.executor.insert(this.metadata.table.name, data);
      if (options?.reload && this.metadata.idProperty) {
        const added = this.toEntity(await this.executor.find(this.metadata.table.name, {
          where: {
            [this.metadata.identityProperty.column.name]: identityValue(this.metadata.table.name, this.metadata.identityProperty.column.name)
          }
        }))
        Object.assign(item, added);
      }
    }
  }

  /**
   * 删除指定键值的记录，并返回被删除的对象
   */
  async delete(where: (rowset: ProxiedTable<T>) => CompatibleCondition<T>): Promise<void> {
    await this.executor.delete(this.rowset, ensureCondition(where(this.rowset)))
  }

  /**
   * 删除一个数据
   */
  async remove(items: T | T[]): Promise<void> {
    if (!Array.isArray(items)) {
      items = [items]
    } else if (items.length == 0) {
      throw new Error('Items must have more than or equals one of record.')
    }
    const condition = this.metadata.rowflagProperty
      ? and(items.map(item =>
        this.rowset.field(this.metadata.idProperty.name as FieldsOf<T>).eq(Reflect.get(item, this.metadata.idProperty.name))
        .and(this.rowset.field(this.metadata.rowflagProperty.name as FieldsOf<T>).eq(Reflect.get(item, this.metadata.rowflagProperty.name)))
      ))
      : this.rowset.field(this.metadata.idProperty.name as FieldsOf<T>).in(items.map(item => Reflect.get(item, this.metadata.idProperty.name)))

    const deleteCount = await this.executor.delete(this.rowset, condition)
    if (deleteCount !== items.length) {
      throw new Error('不正确')
    }
  }

  /**
   * 已存在的则修改，未存在的则新增
   * 如果存在ROWFLAG字段，则在提交之前会进行核对
   * 保存完后，进行保存的数据会被更新为最新数据
   */
  save(items: T | T[]) {
    if (!Array.isArray(items)) {
      items = [items]
    }
    const rows = items.map(item => this.toDataRow(item))
    return this.executor.save(this.metadata.table.name, [this.metadata.idProperty.column.name], rows)
  }

  /**
   * 将EntityItem 转换为 DataRow
   */
  private toDataRow(entity: T): any {
    const dbItem: T = Object.create(null)

    for (const prop of this.metadata.properties) {
      if (prop.relation) continue
      const itemValue = Reflect.get(entity, prop.name)
      let dbValue
      if (itemValue && prop.type === JSON && typeof itemValue !== 'string') {
        dbValue = JSON.stringify(itemValue)
      } else {
        dbValue = itemValue
      }
      Reflect.set(dbItem, prop.column.name, dbValue)
    }
    return dbItem
  }
}
