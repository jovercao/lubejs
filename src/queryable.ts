/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-inferrable-types */
/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  CompatibleCondition,
  CompatibleExpression,
  RowObject,
  RowTypeFrom,
  ProxiedRowset,
  Rowset,
  InputObject,
  SortInfo,
  SortObject,
  Condition,
  Select,
  CompatibleSortInfo,
  CompatibleRowset,
  Field,
  ProxiedTable
} from './ast'
import { and, select, table } from './builder'
import { ROWSET_ALIAS } from './constants'
import { Executor } from './execute'
import { EntityConstructor, EntityMetadata, MetadataStore, TableSchema } from './metadata'
import { FetchOptions, FetchProps, isEntityConstructor, RefKeyOf } from './repository'
import { ensureCondition, ensureRowset, isProxiedRowset, makeProxiedRowset } from './util'
// import { getMetadata } from 'typeorm'

export const FROM_DB = Symbol('FROM_DB')

/**
 * 可查询对象，接口类似js自带的`Array`对象，并且其本身是一个异步可迭代对象，实现了延迟加载功能，数据将在调用`toArray`，或者对其进行遍历时才执行加载
 * // INFO:
 * // TODO: 实现延迟在线逐条查询功能
 * // TODO: 性能优化，不再每一个动作产生一个SQL子查询
 * ```ts
 * const x: Queryable<T> = ...
 * for await (const item of x) {
 *    ...
 * }
 * ```
 */
// eslint-disable-next-line @typescript-eslint/ban-types
export class Queryable<T extends RowObject = any> implements AsyncIterable<T> {
  protected rowset: ProxiedRowset<T>
  protected readonly metadata?: EntityMetadata
  private where: CompatibleCondition
  private sorts: CompatibleSortInfo
  private includes: FetchProps<T>
  protected readonly executor: Executor
  /**
   * 默认使用缓存
   */
  private nocache: boolean = false

  constructor(executor: Executor, metadata: EntityMetadata)
  constructor (
    executor: Executor,
    rowset: CompatibleRowset<T>
  )
  constructor (
    executor: Executor,
    rowsetOrMetadata: CompatibleRowset<T> | EntityMetadata
  ) {
    this.executor = executor
    if (typeof rowsetOrMetadata === 'string' || Array.isArray(rowsetOrMetadata)) {
      rowsetOrMetadata = ensureRowset<T>(rowsetOrMetadata);
    } else if (rowsetOrMetadata instanceof EntityMetadata) {
      this.metadata = rowsetOrMetadata
      rowsetOrMetadata = makeProxiedRowset(rowsetOrMetadata)
    } else if (!isProxiedRowset(rowsetOrMetadata)) {
      rowsetOrMetadata = makeProxiedRowset(rowsetOrMetadata)
    }
    this.rowset = rowsetOrMetadata as ProxiedRowset<T>
  }

  private _appendWhere (where: CompatibleCondition<T>): this {
    if (!this.where) {
      this.where = where
    }
    this.where = and(this.where, ensureCondition(where, this.rowset))
    return this
  }

  /**
   * 异步迭代器，延迟查询的关键点
   */
  [Symbol.asyncIterator] (): AsyncIterator<T> {
    let result: T[]
    let i = 0
    return {
      next: async (): Promise<IteratorResult<T>> => {
        if (!result) {
          result = await this.fetchAll()
        }

        if (i < result.length) {
          return { value: result[i++], done: false }
        }
        return { value: undefined, done: true }
      }
    }
  }

  take (count: number, skip = 0): Queryable<T> {
    // if (this._take !== undefined) {
    //   this._take = lines;
    //   this._skip = skip;
    //   return this;
    // }
    const sql = this._buildSelectSql()
      .offset(skip)
      .limit(count)
    return new Queryable<T>(this.executor, sql.as(ROWSET_ALIAS))
  }

  private _buildSelectSql (): Select<any>
  private _buildSelectSql<G extends InputObject> (
    results: G
  ): Select<RowTypeFrom<G>>
  private _buildSelectSql<G extends InputObject> (
    results?: (p: ProxiedRowset<T>) => G
  ): Select {
    const sql = select(results ? results : this.rowset._).from(
      this.rowset
    )
    if (this.where) sql.where(this.where)
    if (this.sorts) sql.orderBy(this.sorts)
    return sql
  }

  private clone(): Queryable<T> {
    const queryable = this.metadata ? new Queryable<T>(this.executor, this.metadata) : new Queryable<T>(this.executor, this.rowset)
    queryable.where = this.where
    queryable.sorts = this.sorts
    queryable.includes = this.includes
    queryable.nocache = this.nocache
    return queryable
  }

  /**
   * 过滤数据并返回一个新的Queryable
   */
  filter (
    condition: (p: ProxiedRowset<T>) => CompatibleCondition<T>
  ): Queryable<T> {
    const queryable = this.clone()
    queryable._appendWhere(condition(queryable.rowset))
    return queryable
  }

  map<G extends InputObject> (
    results: (p: ProxiedRowset<T>) => G
  ): Queryable<RowTypeFrom<G>> {
    const sql = this._buildSelectSql(results(this.rowset))
    return new Queryable<RowTypeFrom<G>>(this.executor, sql.as(ROWSET_ALIAS))
  }

  sort (
    sorts: (p: ProxiedRowset<T>) => SortInfo[] | SortObject<T>
  ): Queryable<T> {
    const queryable = this.clone()
    queryable.sorts = sorts(this.rowset)
    return queryable
  }

  /**
   * 添加过滤条件，并限定返回头一条记录
   */
  find (filter: (p: ProxiedRowset<T>) => CompatibleCondition<T>): Queryable<T> {
    return this.filter(filter).take(1)
  }

  groupBy<G extends InputObject> (
    results: (p: ProxiedRowset<T>) => G,
    groups: (p: ProxiedRowset<T>) => CompatibleExpression[],
    where?: (p: ProxiedRowset<T>) => Condition
  ): Queryable<RowTypeFrom<G>> {
    if (where) {
      this.filter(where)
    }
    const sql = this._buildSelectSql(results(this.rowset)).groupBy(...groups(this.rowset))
    return new Queryable<RowTypeFrom<G>>(this.executor, sql.as(ROWSET_ALIAS))
  }

  union (...sets: Queryable<T>[]): Queryable<T> {
    const sql = this._buildSelectSql()
    sets.forEach(query => {
      sql.unionAll(query._buildSelectSql())
    })
    return new Queryable<T>(this.executor, sql.as(ROWSET_ALIAS))
  }

  join <J extends RowObject, G extends InputObject>(
    entity: EntityConstructor<J>,
    on: (left: ProxiedRowset<T>, right: ProxiedRowset<J>) => Condition,
    results: (left: ProxiedRowset<T>, right: ProxiedRowset<J>) => G): Queryable<RowTypeFrom<G>> {
    const rightMetadata = MetadataStore.get(entity);
    const rightRowset = makeProxiedRowset<J>(rightMetadata)
    const newRowset = this._buildSelectSql(results(this.rowset, rightRowset)).join(rightRowset, on(this.rowset, rightRowset), true).as(ROWSET_ALIAS)
    return new Queryable<RowTypeFrom<G>>(this.executor, newRowset)
  }

  /**
   * 查询关联属性
   */
  include(props: FetchProps<T>): Queryable<T> {
    const queryable = this.clone()
    queryable.includes = props
    return queryable
  }

  withNocache(): Queryable<T> {
    const query = this.clone()
    query.nocache = true;
    return query
  }

  /**
   * 执行查询并将结果转换为数组，并获取所有数据返回一个数组
   */
  async fetchAll (): Promise<T[]> {
    const sql = this._buildSelectSql()
    const { rows } = await this.executor.query(sql)
    const items: T[] = []
    for (const row of rows) {
      items.push(await this.toEntity(row))
    }
    return items
  }

  /**
   * 执行查询，并获取第一行记录
   */
  async fetchFirst (): Promise<T> {
    const sql = this._buildSelectSql().limit(1)
    const { rows } = await this.executor.query(sql)
    return this.toEntity(rows[0])
  }

  // TODO: 使用DataLoader优化加载性能
  private async fetchIncludes (datarow: any, item: T, includes: FetchProps<T>) {
    for (const propName of Object.keys(includes)) {
      const prop = this.metadata.getProperty(propName)
      if (!prop) {
        throw new Error(`Invalid include property name ${propName}`)
      }
      if (!isEntityConstructor(prop.type)) {
        throw new Error('Property name ${propName} is not entity type')
      }
      let subIncludes = Reflect.get(includes, propName)
      if (subIncludes === true) subIncludes = null
      const subMetadata = MetadataStore.get(prop.type)
      let subQueryable = new Queryable(this.executor, subMetadata)
      if (subIncludes) {
        subQueryable = subQueryable.include(subIncludes)
      }
      if (prop.relation.kind === 'ONE_TO_ONE') {
        const relation = prop.relation
        // 本表为主表
        if (relation.primaryEntity === this.metadata) {
          const idValue = datarow[this.metadata.idProperty.column.name]
          const subItem = await subQueryable.filter(rowset => rowset.field(relation.foreignProperty.name).eq(idValue)).fetchFirst()
          Reflect.set(item, prop.name, subItem)
          // 本表为次表
        } else {
          const refValue = datarow[relation.relationKey.foreignColumn.name]
          const subItem = await subQueryable.find(rowset => rowset.field(relation.primaryProperty.name).eq(refValue)).fetchFirst()
          Reflect.set(item, prop.name, subItem)
        }
      } else if (prop.relation.kind === 'ONE_TO_MANY') {
        const relation = prop.relation
        // 本表为主表, OneToMany
        if (relation.primaryEntity === this.metadata) {
          const idValue = datarow[this.metadata.idProperty.column.name]
          const subItem = await subQueryable.filter(rowset => rowset.field(relation.foreignProperty.name).eq(idValue)).fetchAll()
          Reflect.set(item, prop.name, subItem)
          // 本表为次表，ManyToOne
        } else {
          const refValue = datarow[relation.relationKey.foreignColumn.name]
          const subItem = await subQueryable.find(rowset => rowset.field(relation.primaryProperty.name).eq(refValue)).fetchFirst()
          Reflect.set(item, prop.name, subItem)
        }
        // MANY TO MANY， 通地中间表查询
      } else {
        const relation = prop.relation
        const idValue = datarow[this.metadata.idProperty.column.name]
        // 本表为字段1关联
        const rt = table(relation.relationTable.name)
        const thisForeignColumn = this.metadata === relation.entity1 ? relation.relationKey1.foreignColumn : relation.relationKey2.foreignColumn
        const subForeignColumn = this.metadata === relation.entity1 ? relation.relationKey2.foreignColumn : relation.relationKey1.foreignColumn

        const subIdsSelect = select(rt.field(subForeignColumn.name))
          .from(rt)
          .where(
            rt.field(thisForeignColumn.name).eq(idValue)
          )
        const subItems = subQueryable.filter(rowset => rowset.field(subMetadata.idProperty.name).in(subIdsSelect)).fetchAll()
        Reflect.set(item, prop.name, subItems)
      }
    }
  }

  /**
   * 将数据库记录转换为实体
   */
  protected async toEntity (datarow: any): Promise<T> {
    const item = new this.metadata.class()
    // 标记数据库记录
    item[FROM_DB] = true

    for (const prop of this.metadata.properties) {
      if (prop.relation) continue
      const dbValue = Reflect.get(datarow, prop.column.name)
      let itemValue
      if (prop.type === JSON && typeof dbValue === 'string') {
        itemValue = JSON.parse(dbValue)
      } else {
        itemValue = dbValue
      }
      Reflect.set(item, prop.name, itemValue)
    }
    if (this.includes) {
      await this.fetchIncludes(datarow, item, this.includes)
    }
    return item
  }
}
