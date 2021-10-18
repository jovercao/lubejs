/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/ban-types */
import { XTable, SQL, Executor, DefaultRowObject, isBaseScalar } from '../core';
import { Queryable } from './queryable';
import {
  ColumnMetadata,
  ManyToManyMetadata,
  OneToManyMetadata,
  PrimaryOneToOneMetadata,
  TableEntityMetadata,
} from './metadata';
import { AsyncEventEmitter } from './async-event';
import { DbContext } from './db-context';
import {
  Entity,
  EntityConstructor,
  EntityInstance,
  EntityKeyType,
} from './entity';
import {
  DbEvents,
  FetchRelations,
  RelationKeyOf,
  RepositoryEventHandler,
} from './data-types';
import {
  isForeignOneToOne,
  isManyToMany,
  isManyToOne,
  isOneToMany,
  isPrimaryOneToOne,
  isTableEntity,
  makeRowset,
} from './metadata/util';
import { metadataStore } from './metadata-store';
import { EntityMgr } from './entity-mgr';
import { mergeFetchRelations } from './util';

// TODO: 依赖注入Repository事务传递, 首先支持三种选项，1.如果有事务则使用无则开启 2.必须使用新事务 3.从不使用事务 【4.嵌套事务,在事务内部开启一个子事务】

// TODO: Lube 事务嵌套支持

export type FetchOptions<T> = {
  includes?: FetchRelations<T>;
  /**
   * 是否连同明细属性一并查询
   * 默认为false
   * 如果为true，则系统会自动查询明细relation属性，并且不需要指定`includes`
   */
  withDetail?: boolean;
};

export type SaveOptions<T = any> = {
  /**
   * 保存时不保存关系属性，仅保存自身
   */
  withoutRelations?: boolean | RelationKeyOf<T>[];
};

/**
 * 删除选项
 */
export type DeleteOptions = {
  /**
   * 连同明细项一并删除，无论是否声明
   */
  withDetail?: boolean;
};

export class Repository<T extends Entity> {
  protected metadata!: TableEntityMetadata;
  // INFO 因为列会进行映射，因此rowset的返回类型不确定
  protected rowset!: XTable<DefaultRowObject>;
  private _emitter: AsyncEventEmitter = new AsyncEventEmitter();

  constructor(
    protected readonly context: DbContext,
    public ctr: EntityConstructor<T>
  ) {
    const metadata = metadataStore.getEntity(ctr);
    if (!isTableEntity(metadata)) {
      throw new Error(`Entitymgr is only allowed for tableentities.`);
    }
    this.metadata = metadata;
    // this.metadata = metadataStore.getEntity(
    //   Entity as EntityConstructor<Entity>
    // ) as TableEntityMetadata;
    if (this.metadata.readonly) {
      throw new Error(`Repository must instance of table entity`);
    }
    if (!this.metadata) {
      throw new Error(`Only allow register entity constructor.`);
    }
    this.rowset = makeRowset(ctr) as XTable<DefaultRowObject>;
  }

  protected get connection(): Executor {
    return this.context.connection;
  }

  private get mgr(): EntityMgr<T> {
    return this.context.getMgr(this.metadata.class);
  }

  /**
   * 创建一个可查询对象
   */
  query(): Queryable<T> {
    return new Queryable<T>(this.context, this.metadata.class);
  }

  /**
   * 通过主键查询一个项，
   * 默认不使用缓存
   */
  async get(
    key: EntityKeyType,
    options?: FetchOptions<T>
  ): Promise<EntityInstance<T>> {
    let includes: FetchRelations<T> | undefined;
    if (options?.withDetail) {
      includes = this.metadata.getDetailIncludes();
    }
    includes = mergeFetchRelations(options?.includes, includes);
    return await this.mgr.fetchByKey(key, {
      includes,
    });
  }

  async insert(items: T | T[], options?: SaveOptions<T>): Promise<void> {
    await this._insert(items, options);
  }

  private async _insert(
    items: T | T[],
    options?: SaveOptions<any>
  ): Promise<void> {
    if (!Array.isArray(items)) {
      items = [items];
    }
    this._emit('insert', items, this.context);
    for (const item of items) {
      if (options?.withoutRelations !== true) {
        await this.saveSuperiors(
          item,
          options?.withoutRelations === false
            ? undefined
            : options?.withoutRelations
        );
      }
      const row = await this.mgr.getInsertValues(this.rowset, item);
      await this.connection.insert(this.rowset, row);

      const key = this.metadata.key.column.isIdentity
        ? SQL.std.identityValue(
            this.metadata.dbName,
            this.metadata.key.column.columnName
          )
        : Reflect.get(item, this.metadata.key.property);
      const added = (await this.connection.find(
        this.rowset,
        this.rowset.$field(this.metadata.key.property as any).eq(key)
      ))!;
      this.mgr.toEntity(added, item);
      if (options?.withoutRelations !== true) {
        await this.saveSubordinates(
          item,
          options?.withoutRelations === false
            ? undefined
            : options?.withoutRelations,
          true
        );
      }
    }
    this._emit('inserted', items, this.context);
  }

  public async update(items: T | T[], options?: SaveOptions<T>): Promise<void> {
    await this._update(items, options);
  }

  /**
   * 修改一个数据项
   * 本方法会对全字段更新，无论是否修改与否。
   * @param item
   */
  protected async _update(
    items: T | T[],
    options?: SaveOptions<any>
  ): Promise<void> {
    if (!Array.isArray(items)) {
      items = [items];
    }
    await this._emit('update', items, this.context);
    for (const item of items) {
      if (options?.withoutRelations !== true) {
        // 保存父表项
        await this.saveSuperiors(
          item,
          options?.withoutRelations === false
            ? undefined
            : options?.withoutRelations
        );
      }
      const changes = await this.mgr.getUpdateChanges(this.rowset, item);
      const where = await this.mgr.getUpdateWhere(this.rowset, item);
      const lines = await this.connection.update(this.rowset, changes, where);
      if (lines === 0) {
        throw new Error(
          `The data to be modified does not exist or has been modified or deleted.`
        );
      }

      const updated = await this.connection.find(
        this.rowset,
        this.mgr.getQueryWhere(this.rowset, item)
      );
      this.mgr.toEntity(updated!, item);

      if (options?.withoutRelations !== true) {
        // 保存子项
        await this.saveSubordinates(
          item,
          options?.withoutRelations === false
            ? undefined
            : options?.withoutRelations
        );
      }
    }
    await this._emit('updated', items, this.context);
  }

  private async _delete(
    data: EntityKeyType | T | T[],
    options?: DeleteOptions
  ): Promise<void> {
    let items: T[];
    if (isBaseScalar(data)) {
      const item = await this.get(data);
      if (!item) {
        throw new Error(
          `Entity ${this.metadata.className} key ${data} not found for delete.`
        );
      }
      items = [item];
    } else {
      if (!Array.isArray(data)) {
        items = [data!];
      } else {
        items = data;
      }
    }
    if (items.length === 0) {
      throw new Error('Items must have more than or equals one of record.');
    }

    this._emit('delete', items, this.context);

    for (const item of items) {
      if (options?.withDetail) {
        await this._deleteDetail(item);
      }
      const where = this.mgr.getQueryWhere(this.rowset, item);
      const lines = await this.connection.delete(this.rowset, where);
      if (lines !== 1) {
        throw new Error(
          `The data to be delete does not exist or has been changed or deleted. ${item}`
        );
      }
    }
    this._emit('deleted', items, this.context);
  }

  /**
   * 删除指定数据项
   */
  async delete(
    items: EntityKeyType | T | T[],
    options?: DeleteOptions
  ): Promise<void> {
    return this._delete(items, options);
  }

  private async _deleteDetail(item: T) {
    for (const relation of this.metadata.relations) {
      if (isPrimaryOneToOne(relation)) {
        if (!relation.isDetail) continue;
        const detail: any = (await this.mgr.fetchRelation([item], relation))[0];
        if (detail) {
          await this.context
            .getRepository(relation.referenceClass)
            .delete(detail, { withDetail: true });
        }
      } else if (isOneToMany(relation)) {
        if (!relation.isDetail) continue;
        const details: any[] = (
          await this.mgr.fetchRelation([item], relation)
        )[0] as any;
        if (details?.length > 0) {
          await this.context
            .getRepository(relation.referenceClass)
            .delete(details, { withDetail: true });
        }
      } else if (isManyToMany(relation)) {
        // 多对多关系仅中间表
        const middles: any[] = (
          await this.mgr.fetchRelation([item], relation.relationRelation)
        )[0] as any;
        if (middles?.length > 0) {
          await this.context
            .getRepository(relation.relationRelation.referenceClass)
            .delete(middles, { withDetail: true });
        }
      }
    }
  }

  /**
   * 已存在的则修改，未存在的则新增
   * 如果存在ROWFLAG字段，则在提交之前会进行核对
   * 保存完后，进行保存的数据会被更新为最新数据
   */
  async save(items: T | T[], options?: SaveOptions<T>): Promise<void> {
    if (!Array.isArray(items)) {
      items = [items];
    }
    await this._emit('save', items, this.context);
    await this._save(items);
    await this._emit('saved', items, this.context);
  }

  /**
   * 数据提交事件
   */
  public on(event: 'save', handler: RepositoryEventHandler<T>): this;
  public on(event: 'insert', handler: RepositoryEventHandler<T>): this;
  public on(event: 'update', handler: RepositoryEventHandler<T>): this;
  public on(event: 'delete', handler: RepositoryEventHandler<T>): this;
  public on(event: 'saved', handler: RepositoryEventHandler<T>): this;
  public on(event: 'inserted', handler: RepositoryEventHandler<T>): this;
  public on(event: 'updated', handler: RepositoryEventHandler<T>): this;
  public on(event: 'deleted', handler: RepositoryEventHandler<T>): this;
  public on(event: 'all', handler: (event: DbEvents, items: T[]) => void): this;
  public on(event: string, handler: (...args: any) => void): this {
    this._emitter.on(event, handler);
    return this;
  }

  private async _emit(
    event: DbEvents,
    items: T[],
    context: DbContext
  ): Promise<void> {
    await this._emitter.emit(event, items);
    await this._emitter.emit('all', items);
  }

  public off(event: 'save', handler?: RepositoryEventHandler<T>): this;
  public off(event: 'insert', handler?: RepositoryEventHandler<T>): this;
  public off(event: 'update', handler?: RepositoryEventHandler<T>): this;
  public off(event: 'delete', handler?: RepositoryEventHandler<T>): this;
  public off(event: 'saved', handler: RepositoryEventHandler<T>): this;
  public off(event: 'inserted', handler: RepositoryEventHandler<T>): this;
  public off(event: 'updated', handler: RepositoryEventHandler<T>): this;
  public off(event: 'deleted', handler: RepositoryEventHandler<T>): this;
  public off(
    event: 'all',
    handler: (event: DbEvents, items: T[]) => void
  ): this;
  public off(event: string, handler?: (...args: any) => void): this {
    this._emitter.off(event, handler);
    return this;
  }

  private async _save(
    items: T | T[],
    options?: SaveOptions<any>
  ): Promise<void> {
    if (!Array.isArray(items)) {
      items = [items];
    }
    for (const item of items) {
      const keyValue = Reflect.get(
        item,
        this.metadata.key.property
      ) as EntityKeyType;
      if (this.metadata.key.column.isIdentity) {
        if (keyValue !== undefined) {
          // 否则为修改数据
          await this._update(item, options);
        } else {
          // 如果存在主键，则表示更新数据
          await this._insert(item, options);
        }
      } else {
        // 自动生成列的主键可能为空
        if (keyValue !== undefined && (await this.existsKey(keyValue))) {
          // 否则为修改数据
          await this._update(item, options);
        } else {
          // 如果存在主键，则表示更新数据
          await this._insert(item, options);
        }
      }
    }
  }

  // 判断是否存在主键值
  public async existsKey(key: EntityKeyType): Promise<boolean> {
    const result = await this.query()
      .filter(p => (p as any)[this.metadata.key.property].eq(key))
      .count()
      .fetchFirst();
    return (result?.count ?? 0) > 0;
  }

  private _setProperty(item: T, column: ColumnMetadata, value: any): void {
    // 更新引用外键
    if (Reflect.has(item, column.property)) {
      Reflect.set(item, column.property, value);
    } else {
      Reflect.defineProperty(item, column.property, {
        enumerable: !column.isImplicit,
        value,
      });
    }
  }

  /**
   * 保存引用的依赖项
   * @param item
   */
  protected async saveSuperiors(
    item: T,
    withoutRelations?: RelationKeyOf<any>[]
  ): Promise<void> {
    for (const relation of this.metadata.relations) {
      if (withoutRelations?.includes?.(relation.property)) continue;
      if (Reflect.get(item, relation.property) === undefined) continue;
      if (isForeignOneToOne(relation) || isManyToOne(relation)) {
        const dependent = Reflect.get(item, relation.property);

        if (!dependent) {
          // 切断关联关系
          this._setProperty(item, relation.foreignColumn, null);
          continue;
        }

        await this.context
          .getRepository(relation.referenceClass as EntityConstructor<any>)
          ._save(dependent, {
            withoutRelations: [relation.referenceRelation.property],
          });
        const foreignKey = Reflect.get(
          dependent,
          relation.referenceEntity.key.property
        );
        this._setProperty(item, relation.foreignColumn, foreignKey);
      }
    }
  }

  /**
   * 保存外键关系
   */
  protected async saveSubordinates(
    item: T,
    withoutRelations?: RelationKeyOf<any>[],
    skipCompare: boolean = false
  ): Promise<void> {
    for (const relation of this.metadata.relations) {
      if (withoutRelations?.includes?.(relation.property)) continue;
      if (Reflect.get(item, relation.property) === undefined) continue;

      if (isOneToMany(relation)) {
        await this._saveOneToManyRelation(item, relation, skipCompare);
      } else if (isManyToMany(relation)) {
        await this._saveManyToManyRelation(item, relation, skipCompare);
      } else if (isPrimaryOneToOne(relation)) {
        await this._savePrimaryOneToOneRelation(item, relation);
      }
    }
  }

  private async _savePrimaryOneToOneRelation(
    item: T,
    relation: PrimaryOneToOneMetadata
  ): Promise<void> {
    const subItem: any = Reflect.get(item, relation.property);
    const itemKey = Reflect.get(item, this.metadata.key.property);
    const repo = this.context.getRepository(
      relation.referenceClass as EntityConstructor<any>
    );
    repo._setProperty(
      subItem,
      relation.referenceRelation.foreignColumn,
      itemKey
    );
    await repo._save(subItem, {
      withoutRelations: [relation.referenceRelation.property],
    });
  }

  private async _saveOneToManyRelation(
    item: T,
    relation: OneToManyMetadata,
    skipCompare: boolean = false
  ): Promise<void> {
    const subItems: any[] = Reflect.get(item, relation.property) || [];
    const itemKey = Reflect.get(item, this.metadata.key.property);
    const repo = this.context.getRepository(
      relation.referenceClass as EntityConstructor<any>
    );
    // 设置主键
    for (const subItem of subItems) {
      repo._setProperty(
        subItem,
        relation.referenceRelation.foreignColumn,
        itemKey
      );
    }
    if (skipCompare) {
      return await repo._save(subItems, {
        withoutRelations: [relation.referenceRelation.property],
      });
    }

    const subSnapshots: any[] = (
      await this.context
        .getMgr(this.metadata.class)
        .fetchRelation([item], relation)
    )[0] as any;

    const itemsMap: any = {};
    const snapshotMap: any = {};

    subItems.forEach((subItem: any) => {
      itemsMap[Reflect.get(subItem, relation.referenceEntity.key.property)] =
        subItem;
    });

    subSnapshots.forEach((subItem: any) => {
      snapshotMap[Reflect.get(subItem, relation.referenceEntity.key.property)] =
        subItem;
    });

    // 保存(新增或者修改)子项,跳过父属性
    await repo._save(subItems, {
      withoutRelations: [relation.referenceRelation.property],
    });

    // 删除多余的子项
    for (const subItem of subSnapshots) {
      const subKey = Reflect.get(
        subItem,
        relation.referenceEntity.key.property
      );
      if (!itemsMap[subKey]) {
        await repo.delete(subItem);
      }
    }
  }

  private async _saveManyToManyRelation(
    item: T,
    relation: ManyToManyMetadata,
    skipCompare: boolean = false
  ): Promise<void> {
    // 多对多关系仅会删除中间关系表，并不会删除引用表
    // 获取一对多关系中间表快照
    // 先存储引用表
    const subRepo = this.context.getRepository(
      relation.referenceClass as EntityConstructor<any>
    );
    const relationRepo = this.context.getRepository(
      relation.relationRelation.referenceClass as EntityConstructor<any>
    );
    const itemKey = Reflect.get(item, this.metadata.key.property);
    const subItems: any[] = Reflect.get(item, relation.property);

    const makeRelationItem: (subItem: any) => any = (subItem: any) => {
      const subKey = Reflect.get(
        subItem,
        relation.referenceEntity.key.property
      );
      const relationItem = new relation.relationClass();
      relationRepo._setProperty(
        relationItem,
        relation.relationRelation.referenceRelation.foreignColumn,
        itemKey
      );
      relationRepo._setProperty(
        relationItem,
        relation.referenceRelation.relationRelation.referenceRelation
          .foreignColumn,
        subKey
      );
      return relationItem;
    };

    if (skipCompare) {
      await subRepo._save(subItems, {
        withoutRelations: [relation.referenceRelation.property],
      });
      const relationItems = subItems.map((subItem: any) =>
        makeRelationItem(subItem)
      );
      await relationRepo._insert(relationItems, {
        withoutRelations: [relation.relationRelation.property],
      });
      return;
    }

    // 取中间表快照
    const relationSnapshots: any[] = (
      await this.context
        .getMgr(this.metadata.class)
        .fetchRelation([item], relation.relationRelation)
    )[0];
    await subRepo._save(subItems, {
      withoutRelations: [relation.referenceRelation.property],
    });

    const snapshotMap: any = {};
    relationSnapshots.forEach((subItem: any) => {
      const subKey =
        subItem[
          relation.referenceRelation.relationRelation.referenceRelation
            .foreignProperty
        ];
      snapshotMap[subKey] = subItem;
    });
    const itemsMap: any = {};
    subItems.forEach((subItem: any) => {
      const subKey = subItem[relation.referenceEntity.key.property];
      itemsMap[subKey] = subItem;
    });

    const newSubItems: any[] = subItems.filter((subItem: any) => {
      const subKey = Reflect.get(
        subItem,
        relation.referenceEntity.key.property
      );
      return !snapshotMap[subKey];
    });

    const newRelationItems = newSubItems.map((newSubItem: any) =>
      makeRelationItem(newSubItem)
    );
    // 新增未关联的关系
    await relationRepo._insert(newRelationItems);

    const removedRelationItems = relationSnapshots.filter(relationItem => {
      const subKey = Reflect.get(
        relationItem,
        relation.referenceRelation.relationRelation.referenceRelation
          .foreignProperty
      );
      return !itemsMap[subKey];
    });

    // 删除多余的关联关
    await relationRepo._delete(removedRelationItems);
  }
}
