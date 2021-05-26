/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-inferrable-types */
/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  CompatibleCondition,
  CompatibleExpression,
  RowObject,
  RowTypeFrom,
  ProxiedRowset,
  InputObject,
  SortInfo,
  SortObject,
  Condition,
  Select,
  CompatibleSortInfo,
  CompatibleRowset,
} from './ast'
import { and, select, table } from './builder'
import { ROWSET_ALIAS } from './constants'
import { Executor } from './execute'
import { EntityMetadata, isForeignOneToOne, isManyToMany, isManyToOne, isOneToMany, isOneToOne, isPrimaryOneToOne, metadataStore, OneToOneMetadata, TableSchema } from './metadata'
import { Entity, FetchOptions, FetchRelations, isEntityConstructor, RelationKeyOf } from './repository'
import { Constructor } from './types'
import { ensureCondition, ensureRowset, isProxiedRowset, makeProxiedRowset } from './util'
// import { getMetadata } from 'typeorm'

export const FROM_DB = Symbol('FROM_DB')

/**
 * 可查询对象，接口类似js自带的`Array`对象，并且其本身是一个异步可迭代对象，实现了延迟加载功能，数据将在调用`toArray`，或者对其进行遍历时才执行加载
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
  protected readonly rowset: ProxiedRowset<T>
  protected readonly metadata?: EntityMetadata
  private _where: CompatibleCondition
  private _sorts: CompatibleSortInfo
  private _includes: FetchRelations<T>
  protected executor: Executor
  /**
   * 默认使用缓存
   */
  private _nocache: boolean = false
  private _withDetail: boolean

  constructor(executor: Executor, ctr: Constructor<T>)
  constructor(
    executor: Executor,
    rowset: CompatibleRowset<T>
  )
  constructor(
    executor: Executor,
    rowsetOrCtr: CompatibleRowset<T> | Constructor<T & Entity>
  ) {
    this.executor = executor
    if (typeof rowsetOrCtr === 'string' || Array.isArray(rowsetOrCtr)) {
      rowsetOrCtr = ensureRowset<T>(rowsetOrCtr);
      if (!isProxiedRowset(rowsetOrCtr)) {
        rowsetOrCtr = makeProxiedRowset(rowsetOrCtr)
      }
      this.rowset = rowsetOrCtr as ProxiedRowset<T>
    } else if (typeof rowsetOrCtr === 'function') {
      this.metadata = metadataStore.getEntity(rowsetOrCtr)
      this.rowset = makeProxiedRowset(this.metadata)
    }
  }

  private _appendWhere(where: CompatibleCondition<T>): this {
    if (!this._where) {
      this._where = where
    }
    this._where = and(this._where, ensureCondition(where, this.rowset))
    return this
  }

  /**
   * 异步迭代器，延迟查询的关键点
   */
  [Symbol.asyncIterator](): AsyncIterator<T> {
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

  take(count: number, skip = 0): Queryable<T> {
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

  private _buildSelectSql(): Select<any>
  private _buildSelectSql<G extends InputObject>(
    results: G
  ): Select<RowTypeFrom<G>>
  private _buildSelectSql<G extends InputObject>(
    results?: (p: ProxiedRowset<T>) => G
  ): Select {
    const sql = select(results ? results : this.rowset._).from(
      this.rowset
    )
    if (this._where) sql.where(this._where)
    if (this._sorts) sql.orderBy(this._sorts)
    return sql
  }

  /**
   * 克隆当前对象用于添加信息，以免污染当前对象
   */
  private clone(): Queryable<T> {
    const queryable: Queryable<T> = Object.create(Queryable.prototype)
    Object.assign(queryable, this)
    return queryable
  }

  /**
   * 过滤数据并返回一个新的Queryable
   */
  filter(
    condition: (p: ProxiedRowset<T>) => CompatibleCondition<T>
  ): Queryable<T> {
    const queryable = this.clone()
    queryable._appendWhere(condition(queryable.rowset))
    return queryable
  }

  /**
   * 返回一个新的类型
   */
  map<G extends InputObject>(
    results: (p: ProxiedRowset<T>) => G
  ): Queryable<RowTypeFrom<G>> {
    const sql = this._buildSelectSql(results(this.rowset))
    return new Queryable<RowTypeFrom<G>>(this.executor, sql.as(ROWSET_ALIAS))
  }

  sort(
    sorts: (p: ProxiedRowset<T>) => SortInfo[] | SortObject<T>
  ): Queryable<T> {
    const queryable = this.clone()
    queryable._sorts = sorts(this.rowset)
    return queryable
  }

  /**
   * 添加过滤条件，并限定返回头一条记录
   */
  find(filter: (p: ProxiedRowset<T>) => CompatibleCondition<T>): Queryable<T> {
    return this.filter(filter).take(1)
  }

  groupBy<G extends InputObject>(
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

  union(...sets: Queryable<T>[]): Queryable<T> {
    const sql = this._buildSelectSql()
    sets.forEach(query => {
      sql.unionAll(query._buildSelectSql())
    })
    return new Queryable<T>(this.executor, sql.as(ROWSET_ALIAS))
  }

  join<J extends Entity, G extends InputObject>(
    entity: Constructor<J>,
    on: (left: ProxiedRowset<T>, right: ProxiedRowset<J>) => Condition,
    results: (left: ProxiedRowset<T>, right: ProxiedRowset<J>) => G): Queryable<RowTypeFrom<G>> {
    const rightMetadata = metadataStore.getEntity(entity);
    const rightRowset = makeProxiedRowset<J>(rightMetadata)
    const newRowset = this._buildSelectSql(results(this.rowset, rightRowset)).join(rightRowset, on(this.rowset, rightRowset), true).as(ROWSET_ALIAS)
    return new Queryable<RowTypeFrom<G>>(this.executor, newRowset)
  }

  /**
   * 查询关联属性
   */
  include(props: FetchRelations<T>): Queryable<T> {
    const queryable = this.clone()
    queryable._includes = props
    return queryable
  }

  withDetail(): Queryable<T> {
    const queryable = this.clone()
    queryable._withDetail = true
    return queryable
  }

  withNocache(): Queryable<T> {
    const query = this.clone()
    query._nocache = true;
    return query
  }

  /**
   * 执行查询并将结果转换为数组，并获取所有数据返回一个数组
   */
  async fetchAll(): Promise<T[]> {
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
  async fetchFirst(): Promise<T> {
    const sql = this._buildSelectSql().limit(1)
    const { rows } = await this.executor.query(sql)
    return this.toEntity(rows[0])
  }

  // TODO: 使用DataLoader优化加载性能
  private async loadIncludes(datarow: any, item: T, includes: FetchRelations<T>) {
    for (const relationName of Object.keys(includes)) {
      const relation = this.metadata.getRelation(relationName)
      if (!relation) {
        throw new Error(`Property ${relationName} is not a relation property.`)
      }
      let subIncludes = Reflect.get(includes, relationName)
      if (subIncludes === true) subIncludes = null

      const relationQueryable = new Queryable<any>(this.executor, relation.referenceEntity.class as Constructor<any>)
      if (subIncludes) {
        relationQueryable._includes = subIncludes
      }
      // 复制当前选项
      relationQueryable._withDetail = this._withDetail

      if (isPrimaryOneToOne(relation)) {
        const idValue = datarow[this.metadata.idProperty.column.name]
        const relationItem = await relationQueryable.filter(rowset => rowset.field(relation.relationKey.foreignColumn.name).eq(idValue)).fetchFirst()
        Reflect.set(item, relation.property, relationItem)
        // 本表为次表
      } else if (isForeignOneToOne(relation)) {
        const refValue = datarow[relation.relationKey.foreignColumn.name]
        const relationItem = await relationQueryable.find(rowset => rowset.field(relation.outerEntity.idProperty.property).eq(refValue)).fetchFirst()
        Reflect.set(item, relation.property, relationItem)
      } else if (isOneToMany(relation)) {
        const idValue = datarow[this.metadata.idProperty.column.name]
        const relationItems = await relationQueryable.filter(rowset => rowset.field(relation.referenceKey.foreignColumn.name).eq(idValue)).fetchAll()
        Reflect.set(item, relation.property, relationItems)
      } else if (isManyToOne(relation)) {
        const refValue = datarow[relation.relationKey.foreignColumn.name]
        const relationItem = await relationQueryable.find(rowset => rowset.field(relation.outerEntity.idProperty.property).eq(refValue)).fetchFirst()
        Reflect.set(item, relation.property, relationItem)
      } else if (isManyToMany(relation)) {
        const idValue = datarow[this.metadata.idProperty.column.name]
        // 本表为字段1关联
        const rt = table(relation.middleTable.name)
        // 当前外键列
        const thisForeignColumn = relation.relationKey.foreignColumn
        // 关联外键列
        const relationForeignColumn = relation.outerRelation.relationKey.foreignColumn
        const relationIdsSelect = select(rt.field(relationForeignColumn.name))
          .from(rt)
          .where(
            rt.field(thisForeignColumn.name).eq(idValue)
          )
        const subItems = relationQueryable.filter(rowset => rowset.field(relation.outerEntity.idProperty.property).in(relationIdsSelect)).fetchAll()
        Reflect.set(item, relation.property, subItems)
      }
    }
  }

  /**
   * 将数据库记录转换为实体
   */
  protected async toEntity(datarow: any): Promise<T> {
    const item = new this.metadata.class() as any
    // 标记数据库记录
    item[FROM_DB] = true

    for (const prop of this.metadata.getColumns()) {
      const dbValue = Reflect.get(datarow, prop.column.name)
      let itemValue
      if (prop.type === JSON && typeof dbValue === 'string') {
        itemValue = JSON.parse(dbValue)
      } else {
        itemValue = dbValue
      }
      Reflect.set(item, prop.property, itemValue)
    }
    // TODO: 添加避免重复加载代码
    if (this._withDetail) {
      await this.loadIncludes(datarow, item, this.metadata.detailIncludes)
    }
    if (this._includes) {
      await this.loadIncludes(datarow, item, this._includes)
    }
    return item
  }
}
