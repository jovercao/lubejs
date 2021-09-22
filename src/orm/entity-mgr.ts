import { assert } from 'console';
import DataLoader from 'dataloader';
import { FetchRelations, RelationKeyOf } from '.';
import { isStringType, ProxiedRowset, SQL } from '../core';
import { DefaultRowObject } from '../core/sql';
import { DbContext } from './db-context';
import {
  Entity,
  EntityConstructor,
  EntityInstance,
  EntityKeyType,
} from './entity';
import {
  ColumnMetadata,
  EntityMetadata,
  ForeignOneToOneMetadata,
  KeyMetadata,
  ManyToManyMetadata,
  ManyToOneMetadata,
  OneToManyMetadata,
  OneToOneMetadata,
  RelationMetadata,
  TableEntityMetadata,
} from './metadata';
import { metadataStore } from './metadata-store';
import {
  makeRowset,
  isPrimaryOneToOne,
  isOneToMany,
  isManyToOne,
  isForeignOneToOne,
  isManyToMany,
  isTableEntity,
} from './metadata/util';
import { Queryable } from './queryable';

const REF_ID_ALIAS_NAME = '##REF_ID';

/**
 * 实体管理器
 * - 用于转换数据库类型与实体类型
 * - 以及导航属性的关联查询
 * 内部类型，请不要使用
 */
export class EntityMgr<T extends Entity> {
  constructor(entityCtr: EntityConstructor<T>, private context: DbContext) {
    const metadata = metadataStore.getEntity(entityCtr);
    this.metadata = metadata;
  }

  private metadata: EntityMetadata;

  /**
   * 转换成数据库所使用的值
   */
  toDbValue(item: T, column: ColumnMetadata): any {
    if (
      (column.type === Object || column.type === Array) &&
      isStringType(column.dbType)
    ) {
      return JSON.stringify(Reflect.get(item, column.property));
    } else {
      const value = Reflect.get(item, column.property);
      // undefined 切换为null
      if (value === undefined) return null;
      return value;
    }
  }

  /**
   * 将EntityInstance 转换为 DataRow
   */
  toDataRow(item: T, datarow?: DefaultRowObject): DefaultRowObject {
    if (!datarow) {
      datarow = Object.create(null);
    }
    for (const column of this.metadata.columns) {
      if (column.isIdentity || column.isRowflag) continue;
      if (column.isImplicit && !Reflect.has(item, column.property)) continue;
      // 因为rowset已经在core中完成字段映射功能，此处可直接使用property访问
      Reflect.set(datarow!, column.property, this.toDbValue(item, column));
    }
    return datarow!;
  }

  /**
   * 转换成实体属性值
   */
  toEntityValue(datarow: DefaultRowObject, column: ColumnMetadata): any {
    if (
      (column.type === Object || column.type === Array) &&
      isStringType(column.dbType)
    ) {
      return JSON.parse(Reflect.get(datarow, column.columnName));
    } else {
      return Reflect.get(datarow, column.columnName);
    }
  }

  /**
   * 将数据库记录转换为实体实例
   */
  toEntity(datarow: DefaultRowObject, item?: T): T {
    if (!item) {
      item = new this.metadata.class() as any;
    }
    for (const column of this.metadata.columns) {
      const itemValue = this.toEntityValue(datarow, column);
      // 如果是隐式属性，则声明为不可见属性
      if (column.isImplicit) {
        Reflect.defineProperty(item!, column.property, {
          enumerable: false,
          value: itemValue,
          writable: true,
        });
      } else {
        Reflect.set(item!, column.property, itemValue);
      }
    }
    return item!;
  }

  public getKeyValue(item: EntityInstance<T> | T): EntityKeyType {
    if (!isTableEntity(this.metadata)) {
      throw new Error(`GetKeyValue is only allowed for table entities.`);
    }
    return Reflect.get(item, this.metadata.key.property);
  }

  private _loaders?: Map<
    RelationMetadata | KeyMetadata,
    DataLoader<EntityKeyType, T | T[]>
  >;

  private get loaders(): Map<
    RelationMetadata | KeyMetadata,
    DataLoader<EntityKeyType, T | T[]>
  > {
    if (!this._loaders) {
      this._loaders = new Map();
    }
    return this._loaders;
  }

  /**
   * 通过外键获取项
   */
  public async fetchByForeignKey(
    relation: ManyToOneMetadata | ForeignOneToOneMetadata,
    fkValue: EntityKeyType,
    options?: {
      includes?: FetchRelations<T>;
    }
  ): Promise<T[]> {
    if (!isTableEntity(this.metadata)) {
      throw new Error(`GetKeyValue is only allowed for table entities.`);
    }
    let loader = this.loaders.get(relation);
    if (!loader) {
      loader = new DataLoader(
        async (keys: EntityKeyType[]) => {
          const result = await this.queryable(options)
            .filter((p: ProxiedRowset<any>) =>
              p[relation.foreignProperty].in(keys)
            )
            .fetchAll();
          const groups: Record<EntityKeyType, T[]> = {};
          // 将查询结果重新分组
          for (const item of result) {
            const fk = Reflect.get(item, relation.foreignProperty);
            (groups[fk] || (groups[fk] = [])).push(item);
          }
          return keys.map(key => groups[key] || []);
        },
        { cache: false }
      );
      this.loaders.set(relation, loader);
    }
    const data = (await loader.load(fkValue)) as T[];
    loader.clearAll();
    return data;
  }

  // /**
  //  * 清除所有缓存
  //  */
  // clearCache() {
  //   for (const loader of this.loaders.values()) {
  //     loader.clearAll();
  //   }
  // }

  /**
   * 通过主键获取项
   */
  async fetchByKey(
    keyValue: EntityKeyType,
    options?: {
      includes?: FetchRelations<T>;
    }
  ): Promise<EntityInstance<T>> {
    if (!isTableEntity(this.metadata)) {
      throw new Error(`GetKeyValue is only allowed for table entities.`);
    }
    let loader = this.loaders.get(this.metadata.key!);
    if (!loader) {
      loader = new DataLoader(
        async (keys: EntityKeyType[]) => {
          const data = await this.queryable(options)
            .filter((p: ProxiedRowset<any>) =>
              p[this.metadata.key!.property].in(keys)
            )
            .fetchAll();
          // TIPS 必须做好键值对应，否则可能会乱序
          const map: Record<EntityKeyType, T> = {};
          data.forEach(item => {
            map[Reflect.get(item, this.metadata.key!.property)] = item;
          });
          return keys.map(key => map[key] || null);
        },
        // 保留缓存，目的是为了循环引用能直接从缓存中获取
        { cache: true }
      );
      this.loaders.set(this.metadata.key!, loader);
    }

    const data = (await loader.load(keyValue)) as EntityInstance<T> | null;
    if (!data) {
      throw new Error(
        `Entity ${this.metadata.className} Key ${keyValue} not found.`
      );
    }
    if (options?.includes) {
      await this.loadRelations([data], options.includes);
    }
    // 执行完立马清除缓存
    loader.clearAll();
    return data;
  }

  private async fetchByManyToManyKey(
    relation: ManyToManyMetadata,
    refKeyValue: EntityKeyType,
    options?: {
      includes?: FetchRelations<T>;
    }
  ) {
    if (!isTableEntity(this.metadata)) {
      throw new Error(`GetKeyValue is only allowed for table entities.`);
    }
    let loader = this.loaders.get(this.metadata.key!);
    if (!loader) {
      loader = new DataLoader(
        async (refKeys: EntityKeyType[]) => {
          // 本表为字段1关联
          const rt = makeRowset<any>(relation.relationEntity.class).as('rt');

          const tt = makeRowset(this.metadata.class).as('tt');

          const sql = SQL.select(
            tt.star,
            rt[
              relation.referenceRelation.relationRelation.referenceRelation
                .foreignProperty
            ].as(REF_ID_ALIAS_NAME)
          )
            .from(tt)
            .join(
              rt,
              tt[this.metadata.key!.property].eq(
                rt[relation.relationRelation.referenceRelation.foreignProperty]
              )
            )
            .where(
              rt[
                relation.referenceRelation.relationRelation.referenceRelation
                  .foreignProperty
              ].in(refKeys)
            );

          const { rows } = await this.context.connection.query(sql);

          const groups: Record<EntityKeyType, T[]> = {};
          // 将查询结果重新分组
          const items = rows.map(row => {
            const rk = Reflect.get(row, REF_ID_ALIAS_NAME);
            const item = this.toEntity(row);
            (groups[rk] || (groups[rk] = [])).push(item);
            return item;
          });
          if (options?.includes) {
            await this.loadRelations(items, options.includes);
          }
          return refKeys.map(key => groups[key] || []);
        },
        { cache: true }
      );
      this.loaders.set(this.metadata.key!, loader);
    }
    const data = (await loader.load(refKeyValue)) as T;
    // TIPS 重要，每次查询完清除缓存，避免数据被变更后的重复引用；
    loader.clearAll();
    return data;
  }

  private queryable(options?: { includes?: FetchRelations<T> }): Queryable<T>;
  private queryable(options?: { includes?: FetchRelations<T> }): Queryable<T> {
    const query = this.context.getQueryable(this.metadata.class);

    if (options?.includes) {
      query.include(options.includes);
    }
    return query;
  }

  /**
   * 向实体实例加载导航属性
   */
  public async loadRelations(
    items: T[],
    relations: FetchRelations<T>,
    options?: {
      /**
       * 是否强制加载已存在的关联关系，如果为false，则已存在属性不会被再次加载
       */
      force?: boolean;
    }
  ): Promise<void> {
    if (!isTableEntity(this.metadata)) {
      throw new Error(`GetKeyValue is only allowed for table entities.`);
    }
    for (const relationName of Object.keys(relations)) {
      const relation = this.metadata.getRelation(relationName);
      if (!relation) {
        throw new Error(`Property ${relationName} is not a relation property.`);
      }
      let relationIncludes: any = Reflect.get(relations, relationName);
      if (relationIncludes === true) relationIncludes = null;
      // TIPS 重要！过滤掉已加载属性的对象，排除循引用导致的死循环
      if (!options?.force) {
        items = items.filter(
          item => Reflect.get(item, relation.property) === undefined
        );
      }
      const datas = await this.fetchRelation(items, relation, {
        includes: relationIncludes,
      });
      datas.forEach((data, index) => {
        if (relation.isImplicit) {
          Reflect.defineProperty(items[index], relation.property, {
            enumerable: false,
            value: data,
            writable: true
          })
        } else {
          Reflect.set(items[index], relation.property, data);
        }
      });
    }
  }

  /**
   * 获取明细属性，但不改变原实体。
   * 无论实体是否已存在该属性，均会从数据库获取
   */
  public async fetchRelation<R extends RelationKeyOf<T>>(
    items: T[],
    relation: ManyToManyMetadata | OneToManyMetadata,
    options?: {
      // 子表包含项
      includes?: FetchRelations<T[R]>;
    }
  ): Promise<T[R][]>;
  public async fetchRelation<R extends RelationKeyOf<T>>(
    items: T[],
    relations: OneToOneMetadata | ManyToOneMetadata,
    options?: {
      // 子表包含项
      includes?: FetchRelations<T[R]>;
    }
  ): Promise<T[R][]>;
  public async fetchRelation<R extends RelationKeyOf<T>>(
    items: T[],
    relation: RelationMetadata,
    options?: {
      // 子表包含项
      includes?: FetchRelations<T[R]>;
    }
  ): Promise<T[R][]>;
  public async fetchRelation<R extends RelationKeyOf<T>>(
    items: T[],
    relation: RelationMetadata,
    options?: {
      // 子表包含项
      includes?: FetchRelations<T[R]>;
    }
  ): Promise<T[R][]> {
    if (!isTableEntity(this.metadata)) {
      throw new Error(`GetKeyValue is only allowed for table entities.`);
    }
    // 创建子查询，并传递参数
    const refMgr = this.context.getMgr(relation.referenceClass);
    let data: any;
    if (isPrimaryOneToOne(relation)) {
      data = await Promise.all(
        items.map(async item => {
          const key = Reflect.get(item, this.metadata!.key!.property);
          const data = await refMgr.fetchByForeignKey(
            relation.referenceRelation,
            key,
            options
          );
          if (data.length > 1) {
            throw new Error(
              `One to one relation error, fetched more then one data rows at foreign key table.`
            );
          }
          return data[0];
        })
      );
    } else if (isOneToMany(relation)) {
      data = await Promise.all(
        items.map(async item => {
          const key = Reflect.get(item, this.metadata!.key!.property);
          return await refMgr.fetchByForeignKey(
            relation.referenceRelation,
            key,
            options
          );
        })
      );
    } else if (isManyToOne(relation) || isForeignOneToOne(relation)) {
      data = await Promise.all(
        items.map(async item => {
          const refKey = Reflect.get(item, relation.foreignProperty);
          return await refMgr.fetchByKey(refKey, options);
        })
      );
    } else if (isManyToMany(relation)) {
      data = await Promise.all(
        items.map(async item => {
          const key = Reflect.get(item, this.metadata!.key!.property);
          return await refMgr.fetchByManyToManyKey(
            relation.referenceRelation,
            key,
            options
          );
        })
      );
    }
    return data;
  }
}
