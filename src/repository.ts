/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/ban-types */
import { ColumnsOf, ProxiedRowset, ProxiedTable } from './ast';
import { Queryable } from './queryable';
import {
  ColumnMetadata,
  isForeignOneToOne,
  isManyToMany,
  isManyToOne,
  isOneToMany,
  isPrimaryOneToOne,
  ManyToManyMetadata,
  OneToManyMetadata,
  PrimaryOneToOneMetadata,
  RelationMetadata,
  TableEntityMetadata,
} from './metadata';
import {
  Constructor,
  Entity,
  isStringType,
  EntityKeyType,
  DbEvents,
  RepositoryEventHandler,
  EntityInstance,
} from './types';
import { Condition, SqlBuilder } from './ast';
import { isScalar } from './util';
import { AsyncEventEmitter } from './async-event';
import { DbContext, DbInstance, EntityConstructor } from './db-context';

// TODO: 依赖注入Repository事务传递, 首先支持三种选项，1.如果有事务则使用无则开启 2.必须使用新事务 3.从不使用事务 【4.嵌套事务,在事务内部开启一个子事务】

// TODO: Lube 事务嵌套支持

/**
 * 过滤关联关系属性列表
 */
export type RelationKeyOf<T> = {
  [P in keyof T]: NonNullable<T[P]> extends Entity | Entity[] ? P : never;
}[keyof T];

export type SingleReferenceKeyOf<T> = {
  [P in keyof T]: T[P] extends Entity ? P : never;
};

export type MultiReferenceKeyOf<T> = {
  [P in keyof T]: T[P] extends Entity[] ? P : never;
};

export type FetchRelations<T> = {
  [P in RelationKeyOf<T>]?:
    | true
    | FetchRelations<T[P] extends Array<infer X> ? X : T[P]>;
};

export type FetchOptions<T> = {
  includes?: FetchRelations<T>;
  nocache?: boolean;
  /**
   * 是否连同明细属性一并查询
   * 默认为false
   * 如果为true，则系统会自动查询明细relation属性，并且不需要指定`includes`
   */
  withDetail?: boolean;
};

export type SaveOptions<T> = {
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

export class Repository<T extends Entity> extends Queryable<T> {
  protected metadata!: TableEntityMetadata;
  protected rowset!: ProxiedTable<T>;
  private _emitter: AsyncEventEmitter = new AsyncEventEmitter();

  constructor(context: DbInstance, public ctr: Constructor<T>) {
    super(context, ctr as any);
    if (!this.metadata || this.metadata.readonly) {
      throw new Error(`Repository must instance of table entity`);
    }
  }

  /**
   * 通过主键查询一个项
   */
  async get(
    key: EntityKeyType,
    options?: FetchOptions<T>
  ): Promise<EntityInstance<T> | undefined> {
    let query = this.filter(rowset =>
      rowset[this.metadata.keyColumn.columnName as ColumnsOf<T>]
        .eq(key as any)
    );
    if (options?.includes) {
      query = query.include(options.includes);
    }
    if (options?.withDetail) {
      query = query.withDetail();
    }
    return query.fetchFirst();
  }

  async insert(items: T | T[], options?: SaveOptions<T>): Promise<void> {
    await this._insert(items, options);
  }

  private async _insert(
    items: T | T[],
    options?: SaveOptions<T>
  ): Promise<void> {
    if (!Array.isArray(items)) {
      items = [items];
    }
    this._emit('insert', items, this.context);
    for (const item of items) {
      if (options?.withoutRelations !== true) {
        await this.saveSuperiors(
          item,
          options?.withoutRelations === false ? undefined : options?.withoutRelations
        );
      }
      const row: any = Object.create(null);
      for (const column of this.metadata.columns) {
        if (column.isIdentity || column.isRowflag) continue;
        if (column.generator) {
          if (Reflect.get(item, column.property) !== undefined) {
            console.warn(
              `Entity ${this.metadata.className} Property ${column.property} is autoGen column, but value found, will override it here.`
            );
          }
          row[column.columnName] = column.generator(
            this.rowset as ProxiedRowset<any>,
            item
          );
          continue;
        }
        if (
          !Reflect.has(item, column.property) &&
          (column.isImplicit || column.defaultValue)
        ) {
          continue;
        }
        row[column.columnName] = this.toDbValue(item, column);
      }
      await this.executor.insert(this.rowset, row);

      const key = this.metadata.keyColumn.isIdentity
        ? SqlBuilder.identityValue(
            this.metadata.tableName,
            this.metadata.keyColumn.columnName
          )
        : Reflect.get(item, this.metadata.keyProperty);
      const added = await this.executor.find(
        this.rowset,
        this.rowset.field(this.metadata.keyProperty as any).eq(key)
      );
      this.toEntity(added, item);
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

  /**
   * 获取更新或删除定位查询条件
   * @param item
   * @returns
   */
  protected getWhere(item: T): Condition {
    const keyValue = Reflect.get(item, this.metadata.keyProperty);
    if (keyValue === undefined) {
      throw new Error(
        `Key property ${this.metadata.keyProperty} is undefined.`
      );
    }
    let condition: Condition = this.rowset
      .field(this.metadata.keyProperty as any)
      .eq(keyValue);
    if (this.metadata.rowflagColumn) {
      const rowflagValue = Reflect.get(
        item,
        this.metadata.rowflagColumn.property
      );
      if (rowflagValue === undefined) {
        throw new Error(
          `Rowflag property ${this.metadata.rowflagColumn.property} is undefined.`
        );
      }
      condition = condition.and(
        this.rowset
          .field(this.metadata.rowflagColumn.property as any)
          .eq(rowflagValue)
      );
    }
    return condition;
  }

  private toDbValue(item: T, column: ColumnMetadata): any {
    if (
      (column.type === Object || column.type === Array) &&
      isStringType(column.dbType)
    ) {
      return JSON.stringify(Reflect.get(item, column.property));
    } else {
      return Reflect.get(item, column.property);
    }
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
    options?: SaveOptions<T>
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
          options?.withoutRelations === false ? undefined : options?.withoutRelations
        );
      }
      const changes: any = {};
      for (const column of this.metadata.columns) {
        if (column.isIdentity || column.isPrimaryKey || column.isRowflag)
          continue;
        if (column.isImplicit && !Reflect.has(item, column.property)) continue;
        changes[column.columnName] = this.toDbValue(item, column);
      }
      const where = this.getWhere(item);
      const lines = await this.executor.update(this.rowset, changes, where);
      if (lines === 0) {
        throw new Error(
          `The data to be modified does not exist or has been modified or deleted.`
        );
      }

      const updated = await this.executor.find(this.rowset, where);
      this.toEntity(updated, item);

      if (options?.withoutRelations !== true) {
        // 保存子项
        await this.saveSubordinates(
          item,
          options?.withoutRelations === false ? undefined : options?.withoutRelations
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
    if (isScalar(data)) {
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
      const where = this.getWhere(item);
      const lines = await this.executor.delete(this.rowset, where);
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
        const detail: any = await this.fetchRelation(item, relation);
        if (detail) {
          await this.context
            .getRepository(relation.referenceClass)
            .delete(detail, { withDetail: true });
        }
      } else if (isOneToMany(relation)) {
        if (!relation.isDetail) continue;
        const details: any[] = (await this.fetchRelation(
          item,
          relation
        )) as any;
        if (details?.length > 0) {
          await this.context
            .getRepository(relation.referenceClass)
            .delete(details, { withDetail: true });
        }
      } else if (isManyToMany(relation)) {
        // 多对多关系仅中间表
        const middles: any[] = (await this.fetchRelation(
          item,
          relation.relationRelation
        )) as any;
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
    context: DbInstance
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

  private async _save(items: T | T[], options?: SaveOptions<T>): Promise<void> {
    if (!Array.isArray(items)) {
      items = [items];
    }
    for (const item of items) {
      if (!Reflect.has(item, this.metadata.keyProperty)) {
        // 如果存在主键，则表示更新数据
        await this._insert(item, options);
      } else {
        // 否则为修改数据
        await this._update(item, options);
      }
    }
  }

  /**
   * 将EntityItem 转换为 DataRow
   */
  protected toDataRow(item: T, datarow?: any): any {
    if (!datarow) {
      datarow = Object.create(null);
    }
    for (const column of this.metadata.columns) {
      if (column.isIdentity || column.isRowflag) continue;
      if (column.isImplicit && !Reflect.has(item, column.property)) continue;
      Reflect.set(datarow, column.columnName, this.toDbValue(item, column));
    }
    return datarow;
  }

  // protected async loadSnapshot(item: T): Promise<T> {
  //   if (!Reflect.has(item, this.metadata.keyProperty)) return null;
  //   const key = Reflect.get(item, this.metadata.keyProperty);
  //   const snaphsot = await this.get(key);
  //   for (const relation of this.metadata.relations) {
  //     if (!Reflect.has(item, relation.property)) continue;
  //     // 主对从，加载从表属性，以便对比参考
  //     if (isOneToMany(relation) || isManyToMany(relation) || isPrimaryOneToOne(relation)) {
  //       await this.fetchRelation(snaphsot, relation.property);
  //     }
  //   }
  //   return snaphsot;
  // }

  private _repositories: Record<string, Repository<any>> = {};

  // private _getRelationRepository(relation: RelationMetadata): Repository<any> {
  //   if (!this._repositories[relation.property]) {
  //     this._repositories[relation.property] = new Repository(
  //       this.context,
  //       relation.referenceClass
  //     );
  //   }
  //   return this._repositories[relation.property];
  // }

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
    withoutRelations?: RelationKeyOf<T>[]
  ): Promise<void> {
    for (const relation of this.metadata.relations) {
      if (withoutRelations?.includes?.(relation.property as RelationKeyOf<T>))
        continue;
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
          relation.referenceEntity.keyProperty
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
    withoutRelations?: RelationKeyOf<T>[],
    skipCompare: boolean = false
  ): Promise<void> {
    for (const relation of this.metadata.relations) {
      if (withoutRelations?.includes?.(relation.property as RelationKeyOf<T>))
        continue;
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
    let subItem: any = Reflect.get(item, relation.property);
    const itemKey = Reflect.get(item, this.metadata.keyProperty);
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
    let subItems: any[] = Reflect.get(item, relation.property) || [];
    const itemKey = Reflect.get(item, this.metadata.keyProperty);
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

    const subSnapshots: any[] = (await this.fetchRelation(
      item,
      relation
    )) as any;

    const itemsMap: any = {};
    const snapshotMap: any = {};

    subItems.forEach((subItem: any) => {
      itemsMap[Reflect.get(subItem, relation.referenceEntity.keyProperty)] =
        subItem;
    });

    subSnapshots.forEach((subItem: any) => {
      snapshotMap[Reflect.get(subItem, relation.referenceEntity.keyProperty)] =
        subItem;
    });

    // 保存(新增或者修改)子项,跳过父属性
    await repo._save(subItems, {
      withoutRelations: [relation.referenceRelation.property],
    });

    // 删除多余的子项
    for (const subItem of subSnapshots) {
      const subKey = Reflect.get(subItem, relation.referenceEntity.keyProperty);
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
    const itemKey = Reflect.get(item, this.metadata.keyProperty);
    const subItems: any[] = Reflect.get(item, relation.property);

    const makeRelationItem: (subItem: any) => any = (subItem: any) => {
      const subKey = Reflect.get(subItem, relation.referenceEntity.keyProperty);
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
    const relationSnapshots: any[] = (await this.fetchRelation(
      item,
      relation.relationRelation
    )) as any;
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
      const subKey = subItem[relation.referenceEntity.keyProperty];
      itemsMap[subKey] = subItem;
    });

    const newSubItems: any[] = subItems.filter((subItem: any) => {
      const subKey = Reflect.get(subItem, relation.referenceEntity.keyProperty);
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
