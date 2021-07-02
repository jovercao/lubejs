/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/ban-types */
import { FieldsOf, ProxiedRowset, ProxiedTable } from './ast';
import { Executor } from './execute';
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
  EntityKey,
  EntityKeyType,
  Scalar,
  DbEvents,
  RepositoryEventHandler,
} from './types';
import { Condition, SqlBuilder } from './ast';
import { isScalar } from './util';
import { EventEmitter } from 'stream';
import { DbContext, DbInstance } from './db-context';

// TODO: 依赖注入Repository事务传递, 首先支持三种选项，1.如果有事务则使用无则开启 2.必须使用新事务 3.从不使用事务 【4.嵌套事务,在事务内部开启一个子事务】

// TODO: Lube 事务嵌套支持

/**
 * 过滤关联关系属性列表
 */
export type RelationKeyOf<T> = {
  [P in keyof T]: T[P] extends Entity | Entity[] ? P : never;
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

export type ChangeOptions = {
  /**
   * 是否重新加载被保存的项,默认为false
   */
  withoutReload?: boolean;

  /**
   * 保存时不同时保存依赖项，即外键引用的项
   */
  withoutDependents?: boolean;

  /**
   * 保存时不同时更新引用项，即被引用的子项
   */
  withoutReferences?: boolean;
};

export class Repository<T extends Entity> extends Queryable<T> {
  protected metadata: TableEntityMetadata;
  protected rowset: ProxiedTable<T>;
  private _emitter: EventEmitter = new EventEmitter();

  constructor(context: DbInstance, public ctr: Constructor<T>) {
    super(context, ctr);
    if (!this.metadata || this.metadata.readonly) {
      throw new Error(`Repository must instance of table entity`);
    }
  }

  /**
   * 通过主键查询一个项
   */
  async get(key: EntityKeyType, options?: FetchOptions<T>): Promise<T> {
    let query = this.filter(rowset =>
      rowset
        .field(this.metadata.keyColumn.columnName as FieldsOf<T>)
        .eq(key as any)
    );
    if (options?.includes) {
      query = query.include(options.includes);
    }
    return query.fetchFirst();
  }

  async insert(items: T | T[]): Promise<void> {
    await this._insert(items);
  }

  private async _insert(
    items: T | T[],
    withoutRelations?: RelationMetadata[] | true
  ): Promise<void> {
    if (!Array.isArray(items)) {
      items = [items];
    }
    this._emit('insert', items);
    for (const item of items) {
      if (withoutRelations !== true) {
        await this.saveDependents(item, withoutRelations);
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
      if (withoutRelations !== true) {
        await this.saveSubordinate(item, withoutRelations, true);
      }
    }
    this._emit('inserted', items);
  }

  /**
   * 获取更新或删除定位查询条件
   * @param item
   * @returns
   */
  protected getPositionCondition(item: T): Condition {
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

  public async update(items: T | T[]): Promise<void> {
    await this._update(items);
  }

  /**
   * 修改一个数据项
   * 本方法会对全字段更新，无论是否修改与否。
   * @param item
   */
  protected async _update(
    items: T | T[],
    withoutRelations?: RelationMetadata[] | true
  ): Promise<void> {
    if (!Array.isArray(items)) {
      items = [items];
    }
    await this._emit('update', items);
    for (const item of items) {
      if (withoutRelations !== true) {
        // 保存父表项
        await this.saveDependents(item, withoutRelations);
      }
      const changes: any = {};
      for (const column of this.metadata.columns) {
        if (column.isIdentity || column.isPrimaryKey || column.isRowflag)
          continue;
        if (column.isImplicit && !Reflect.has(item, column.property)) continue;
        changes[column.columnName] = this.toDbValue(item, column);
      }
      const where = this.getPositionCondition(item);
      const lines = await this.executor.update(this.rowset, changes, where);
      if (lines === 0) {
        throw new Error(
          `The data to be modified does not exist or has been modified or deleted.`
        );
      }

      const updated = await this.executor.find(this.rowset, where);
      this.toEntity(updated, item);

      if (withoutRelations !== true) {
        // 保存引用项
        await this.saveSubordinate(item, withoutRelations);
      }
    }
    await this._emit('updated', items);
  }

  private async _delete(items: EntityKeyType | T | T[]): Promise<void> {
    if (isScalar(items)) {
      items = await this.get(items);
      if (items === undefined || items === null)
        throw new Error(
          `Entity ${this.metadata.className} key ${items} not found for delete.`
        );
    }

    if (!Array.isArray(items)) {
      items = [items];
    }

    this._emit('delete', items);
    if (items.length == 0) {
      throw new Error('Items must have more than or equals one of record.');
    }

    for (const item of items) {
      const where = this.getPositionCondition(item);
      const lines = await this.executor.delete(this.rowset, where);
      if (lines !== 1) {
        throw new Error(
          `The data to be delete does not exist or has been changed or deleted. ${item}`
        );
      }
    }
    this._emit('deleted', items);
  }

  /**
   * 删除指定数据项
   */
  async delete(items: EntityKeyType | T | T[]): Promise<void> {
    return this._delete(items);
  }

  /**
   * 已存在的则修改，未存在的则新增
   * 如果存在ROWFLAG字段，则在提交之前会进行核对
   * 保存完后，进行保存的数据会被更新为最新数据
   */
  async submit(items: T | T[]): Promise<void> {
    if (!Array.isArray(items)) {
      items = [items];
    }
    this._emit('submit', items);
    await this._submit(items);
    this._emit('submited', items);
  }

  /**
   * 数据提交事件
   */
  public on(event: 'submit', handler: RepositoryEventHandler<T>): this;
  public on(event: 'insert', handler: RepositoryEventHandler<T>): this;
  public on(event: 'update', handler: RepositoryEventHandler<T>): this;
  public on(event: 'delete', handler: RepositoryEventHandler<T>): this;
  public on(event: 'submited', handler: RepositoryEventHandler<T>): this;
  public on(event: 'inserted', handler: RepositoryEventHandler<T>): this;
  public on(event: 'updated', handler: RepositoryEventHandler<T>): this;
  public on(event: 'deleted', handler: RepositoryEventHandler<T>): this;
  public on(event: 'all', handler: (event: DbEvents, items: T[]) => void): this;
  public on(event: string, handler: (...args: any) => void): this {
    this._emitter.on(event, handler);
    return this;
  }

  private _emit(event: DbEvents, items: T[]): void {
    this._emitter.emit(event, items);
    this._emitter.emit('all', items);
  }

  public off(event: 'submit', handler?: RepositoryEventHandler<T>): this;
  public off(event: 'insert', handler?: RepositoryEventHandler<T>): this;
  public off(event: 'update', handler?: RepositoryEventHandler<T>): this;
  public off(event: 'delete', handler?: RepositoryEventHandler<T>): this;
  public off(event: 'submited', handler: RepositoryEventHandler<T>): this;
  public off(event: 'inserted', handler: RepositoryEventHandler<T>): this;
  public off(event: 'updated', handler: RepositoryEventHandler<T>): this;
  public off(event: 'deleted', handler: RepositoryEventHandler<T>): this;
  public off(
    event: 'all',
    handler: (event: DbEvents, items: T[]) => void
  ): this;
  public off(event: string, handler?: (...args: any) => void): this {
    if (!handler) {
      this._emitter.removeAllListeners(event);
    } else {
      this._emitter.off(event, handler);
    }
    return this;
  }

  private async _submit(
    items: T | T[],
    withoutRelations?: RelationMetadata[] | true
  ): Promise<void> {
    if (!Array.isArray(items)) {
      items = [items];
    }
    for (const item of items) {
      if (!Reflect.has(item, this.metadata.keyProperty)) {
        // 如果存在主键，则表示更新数据
        await this._insert(item, withoutRelations);
      } else {
        // 否则为修改数据
        await this._update(item, withoutRelations);
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
   * 保存依赖项
   * @param item
   */
  private async saveDependents(
    item: T,
    withoutRelations?: RelationMetadata[]
  ): Promise<void> {
    for (const relation of this.metadata.relations) {
      if (withoutRelations?.includes(relation)) continue;
      if (!Reflect.has(item, relation.property)) continue;
      if (isForeignOneToOne(relation) || isManyToOne(relation)) {
        const dependent = Reflect.get(item, relation.property);

        if (!dependent) {
          // 切断关联关系
          this._setProperty(item, relation.foreignColumn, null);
          continue;
        }

        await this.context
          .getRepository(relation.referenceClass)
          ._submit(dependent, [relation.referenceRelation]);
        const foreignKey = Reflect.get(
          dependent,
          relation.referenceEntity.keyProperty
        );
        this._setProperty(item, relation.foreignColumn, foreignKey);
      }
    }
  }

  /**
   * 保存下属关系
   */
  protected async saveSubordinate(
    item: T,
    withoutRelations?: RelationMetadata[],
    skipCompare: boolean = false
  ): Promise<void> {
    for (const relation of this.metadata.relations) {
      if (withoutRelations?.includes(relation)) continue;
      if (!Reflect.has(item, relation.property)) continue;

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
    const repo = this.context.getRepository(relation.referenceClass);
    repo._setProperty(
      subItem,
      relation.referenceRelation.foreignColumn,
      itemKey
    );
    await repo._submit(subItem, [relation.referenceRelation]);
  }

  private async _saveOneToManyRelation(
    item: T,
    relation: OneToManyMetadata,
    skipCompare: boolean = false
  ): Promise<void> {
    let subItems: any[] = Reflect.get(item, relation.property) || [];
    const itemKey = Reflect.get(item, this.metadata.keyProperty);
    const repo = this.context.getRepository(relation.referenceClass);
    // 设置主键
    for (const subItem of subItems) {
      repo._setProperty(
        subItem,
        relation.referenceRelation.foreignColumn,
        itemKey
      );
    }
    if (skipCompare) {
      return await repo._submit(subItems, [relation.referenceRelation]);
    }

    subItems.forEach((subItem: any) => {
      itemsMap[Reflect.get(subItem, relation.referenceEntity.keyProperty)] =
        subItem;
    });
    const itemsMap: any = {};
    const subSnapshots: any[] = (await this.fetchRelation(
      item,
      relation.property as RelationKeyOf<T>
    )) as any;
    const snapshotMap: any = {};
    subSnapshots.forEach((subItem: any) => {
      snapshotMap[Reflect.get(subItem, relation.referenceEntity.keyProperty)] =
        subItem;
    });

    // 保存(新增或者修改)子项,跳过父属性
    await repo._submit(subItems, [relation.referenceRelation]);

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
    const subRepo = this.context.getRepository(relation.referenceClass);
    const relationRepo = this.context.getRepository(
      relation.relationRelation.referenceClass
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
    }

    if (skipCompare) {
      await subRepo._submit(subItems, [relation.referenceRelation]);
      const relationItems = subItems.map((subItem: any) => makeRelationItem(subItem));
      await subRepo._submit(relationItems, [relation.relationRelation]);
      return;
    }

    // 取中间表快照
    const relationSnapshots: any[] = await this.fetchRelation(
      item,
      relation.property as RelationKeyOf<T>
    ) as any;
    await subRepo._submit(subItems, [relation.referenceRelation]);

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
    })

    const newRelationItems = newSubItems.map((newSubItem: any) => makeRelationItem(newSubItem));
    // 新增未关联的关系
    await relationRepo._insert(newRelationItems);

    const removedRelationItems = relationSnapshots.filter(relationItem => {
      const subKey = Reflect.get(
        relationItem,
        relation.relationRelation.referenceRelation.foreignProperty
      );
      return !itemsMap[subKey];
    })

    // 删除多余的关联关
    await relationRepo._delete(removedRelationItems);
  }
}
