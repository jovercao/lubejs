/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/ban-types */
import { CompatibleCondition, FieldsOf, ProxiedTable, RowObject, Table } from "./ast";
import { Executor } from "./execute";
import { FROM_DB, Queryable } from "./queryable";
import { EntityMetadata, metadataStore } from "./metadata";
import { and, identityValue } from "./builder";
import { Constructor, Scalar } from "./types";
import { ensureCondition } from "./util";

// TODO: 依赖注入Repository事务传递, 首先支持三种选项，1.如果有事务则使用无则开启 2.必须使用新事务 3.从不使用事务 【4.嵌套事务,在事务内部开启一个子事务】

// TODO: Lube 事务嵌套支持

export const EntitySymble = Symbol('LUBEJS#Entity')

/**
 * 实体类基类,仅为了typescript区分类型
 * 不一定非得从此继承
 */
export class Entity {
  [EntitySymble]: true
}

/**
 * 过滤关联关系属性列表
 */
export type RelationKeyOf<T> = ({
  [P in keyof T]: T[P] extends Entity | Entity[]
    ? P
    : never
})[keyof T]

export type FetchRelations<T> = {
  [P in RelationKeyOf<T>]?: true | FetchRelations<T[P] extends Array<infer X> ? X : T[P]>
}

export type FetchOptions<T> = {
  includes?: FetchRelations<T>
  nocache?: boolean
  /**
   * 是否连同明细属性一并查询
   * 默认为false
   * 如果为true，则系统会自动查询明细relation属性，并且不需要指定`includes`
   */
  withDetail?: boolean
}

export type ChangeOptions = {
  /**
   * 是否重新加载被保存的项,默认为false
   */
  reload?: boolean

  /**
   * 是否联动保存关系属性，默认为true
   */
  withRelation?: boolean
}

export function isEntityConstructor(value: any): value is Constructor<RowObject> {
  return typeof value === 'function' && !!metadataStore.getEntity(value)
}

export function isFromDb(value: object): boolean {
  return Reflect.get(value, FROM_DB)
}


export class Repository<T extends Entity> extends Queryable<T> {
  protected metadata: EntityMetadata
  protected rowset: ProxiedTable<T>

  constructor(
    executor: Executor,
    public ctr: Constructor<T>) {
    super(executor, ctr)
  }

  /**
   * 通过主键查询一个项
   */
  async get(key: Scalar, options?: FetchOptions<T>): Promise<T> {
    let query = this.filter(rowset => rowset.field(this.metadata.idProperty.property as FieldsOf<T>).eq(key as any))
    if (options?.includes) {
      query = query.include(options.includes)
    }
    return await query.fetchFirst()
  }

  async add(items: T | T[], options?: ChangeOptions): Promise<void> {
    if (!Array.isArray(items)) {
      items = [items]
    }
    for(const item of items) {
      const data = this.toDataRow(item)
      await this.executor.insert(this.metadata.schema.name, data);
      if (options?.reload) {
        const id = this.metadata.identityProperty ? identityValue(this.metadata.schema.name, this.metadata.identityProperty.column.name) : Reflect.get(item, this.metadata.idProperty.property)
        const added = this.toEntity(await this.executor.find(this.metadata.schema.name, {
          where: {
            [this.metadata.identityProperty.column.name]: id
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
        this.rowset.field(this.metadata.idProperty.property as FieldsOf<T>).eq(Reflect.get(item, this.metadata.idProperty.property))
        .and(this.rowset.field(this.metadata.rowflagProperty.property as FieldsOf<T>).eq(Reflect.get(item, this.metadata.rowflagProperty.property)))
      ))
      : this.rowset.field(this.metadata.idProperty.property as FieldsOf<T>).in(items.map(item => Reflect.get(item, this.metadata.idProperty.property)))

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
    return this.executor.save(this.metadata.schema.name, [this.metadata.idProperty.column.name], rows)
  }

  /**
   * 将EntityItem 转换为 DataRow
   */
  protected toDataRow(entity: T): any {
    const dbItem: T = Object.create(null)

    for (const prop of this.metadata.getColumns()) {
      const itemValue = Reflect.get(entity, prop.property)
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
