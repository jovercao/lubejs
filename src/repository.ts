/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/ban-types */
import { FieldsOf, ProxiedTable } from "./ast";
import { Executor } from "./execute";
import { Queryable } from "./queryable";
import {
  ColumnMetadata,
  isForeignOneToOne,
  isManyToMany,
  isManyToOne,
  isOneToMany,
  RelationMetadata,
  TableEntityMetadata,
} from "./metadata";
import { Constructor, Entity, isStringType, Scalar } from "./types";
import { Condition, SqlBuilder } from "./ast";

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

  constructor(executor: Executor, public ctr: Constructor<T>) {
    super(executor, ctr);
    if (!this.metadata || this.metadata.readonly) {
      throw new Error(`Repository must instance of table entity`);
    }
  }

  /**
   * 通过主键查询一个项
   */
  async get(key: Scalar, options?: FetchOptions<T>): Promise<T> {
    let query = this.filter((rowset) =>
      rowset
        .field(this.metadata.keyColumn.columnName as FieldsOf<T>)
        .eq(key as any)
    );
    if (options?.includes) {
      query = query.include(options.includes);
    }
    return await query.fetchFirst();
  }

  async add(items: T | T[]): Promise<void> {
    await this._add(items);
  }

  private async _add(
    items: T | T[],
    withoutRelations?: RelationMetadata[] | true
  ): Promise<void> {
    if (!Array.isArray(items)) {
      items = [items];
    }
    for (const item of items) {
      if (withoutRelations !== true) {
        // 不保存关联关系
        await this.saveDependents(item, withoutRelations);
      }
      const data: any = Object.create(null);
      for (const column of this.metadata.columns) {
        if (column.isIdentity || column.isRowflag) continue;
        if (column.generator) {
          if (Reflect.get(item, column.property) !== undefined) {
            console.warn(`Entity ${this.metadata.className} Property ${column.property} is autoGen column, but value found, will override it here.`)
          }
          data[column.columnName] = column.generator(item);
          continue;
        }
        if (!Reflect.has(item, column.property) && (column.isImplicit || column.defaultValue)) continue;
        data[column.columnName] = this.toDbValue(item, column);
      }
      await this.executor.insert(this.rowset, data);

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
      this.toEntity(item, added);
      if (withoutRelations !== true) {
        await this.saveReferences(item, withoutRelations);
      }
    }
  }

  /**
   * 获取更新或删除定位查询条件
   * @param item
   * @returns
   */
  protected getPositionCondition(item: T): Condition {
    let condition: Condition = this.rowset
      .field(this.metadata.keyProperty as any)
      .eq(Reflect.get(item, this.metadata.keyProperty));
    if (this.metadata.rowflagColumn) {
      condition = condition.and(
        this.rowset
          .field(this.metadata.rowflagColumn.property as any)
          .eq(Reflect.get(item, this.metadata.rowflagColumn.property))
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

  protected async set(items: T | T[]): Promise<void> {
    await this._set(items);
  }

  /**
   * 修改一个数据项
   * 本方法会对全字段更新，无论是否修改与否。
   * @param item
   */
  protected async _set(
    items: T | T[],
    withoutRelations?: RelationMetadata[] | true
  ): Promise<void> {
    if (!Array.isArray(items)) {
      items = [items];
    }
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
        await this.saveReferences(item, withoutRelations);
      }
    }
  }

  // /**
  //  * 根据查询条件，删除数据。
  //  */
  // async delete(
  //   where: (rowset: ProxiedTable<T>) => Condition
  // ): Promise<T[]> {
  //   await this.executor.delete(
  //     this.rowset,
  //     ensureCondition(where(this.rowset))
  //   );
  // }

  /**
   * 删除指定数据项
   */
  async delete(items: T | T[]): Promise<void> {
    if (!Array.isArray(items)) {
      items = [items];
    }

    if (items.length == 0) {
      throw new Error("Items must have more than or equals one of record.");
    }
    for (const item of items) {
      const where = this.getPositionCondition(item);
      const lines = await this.executor.delete(this.rowset, where);
      if (lines !== 1) {
        throw new Error(
          `The data to be delete does not exist or has been modified or deleted. ${item}`
        );
      }
    }
  }

  /**
   * 已存在的则修改，未存在的则新增
   * 如果存在ROWFLAG字段，则在提交之前会进行核对
   * 保存完后，进行保存的数据会被更新为最新数据
   */
  async save(items: T | T[]): Promise<void> {
    await this._save(items);
  }

  private async _save(
    items: T | T[],
    withoutRelations?: RelationMetadata[] | true
  ): Promise<void> {
    if (!Array.isArray(items)) {
      items = [items];
    }
    for (const item of items) {
      if (Reflect.has(item, this.metadata.keyProperty)) {
        // 如果存在主键，则表示更新数据
        await this._add(item, withoutRelations);
      } else {
        // 否则为修改数据
        await this._set(item, withoutRelations);
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

  private getRepository(relation: RelationMetadata): Repository<any> {
    if (!this._repositories[relation.property]) {
      this._repositories[relation.property] = new Repository(
        this.executor,
        relation.referenceClass
      );
    }
    return this._repositories[relation.property];
  }

  private setProperty(item: T, column: ColumnMetadata, value: any): void {
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
  private async saveDependents(item: T, withoutRelations?: RelationMetadata[]) {
    for (const relation of this.metadata.relations) {
      if (withoutRelations?.includes(relation)) continue;
      if (!Reflect.has(item, relation.property)) continue;
      if (isForeignOneToOne(relation) || isManyToOne(relation)) {
        const dependent = Reflect.get(item, relation.property);

        if (!dependent) {
          // 切断关联关系
          this.setProperty(item, relation.foreignColumn, null);
          continue;
        }

        this.getRepository(relation)._save(dependent, [
          relation.referenceRelation,
        ]);
        const foreignKey = Reflect.get(
          dependent,
          relation.referenceEntity.keyProperty
        );
        this.setProperty(item, relation.foreignColumn, foreignKey);
      }
    }
  }
  /**
   * 保存引用项
   */
  protected async saveReferences(
    item: T,
    withoutRelations?: RelationMetadata[]
  ): Promise<void> {
    for (const relation of this.metadata.relations) {
      if (withoutRelations?.includes(relation)) continue;

      if (!Reflect.has(item, relation.property)) continue;
      if (isOneToMany(relation)) {
        const refSnapshots: any = await this.fetchRelation(
          item,
          relation.property as RelationKeyOf<T>
        );
        const refItems = Reflect.get(item, relation.property) || [];
        const snapshotMap: any = {};
        const itemsMap: any = {};
        refSnapshots.forEach((subItem: any) => {
          snapshotMap[
            Reflect.get(subItem, relation.referenceEntity.keyProperty)
          ] = subItem;
        });
        refItems.forEach((subItem: any) => {
          itemsMap[Reflect.get(subItem, relation.referenceEntity.keyProperty)] =
            subItem;
        });
        const repo = this.getRepository(relation);

        const itemKey = Reflect.get(item, this.metadata.keyProperty);
        // 设置主键
        for (const subItem of refItems) {
          repo.setProperty(
            subItem,
            relation.referenceRelation.foreignColumn,
            itemKey
          );
        }
        // 保存(新增或者修改)子项
        await repo._save(refItems, [relation.referenceRelation]);

        // 删除多余的子项
        for (const subItem of refSnapshots) {
          const subKey = Reflect.get(
            subItem,
            relation.referenceEntity.keyProperty
          );
          if (!itemsMap[subKey]) {
            await repo.delete(subItem);
          }
        }
      } else if (isManyToMany(relation)) {
        // 多对多关系仅会删除中间关系表，并不会删除引用表
        // 获取一对多关系中间表快照
        const relationSnapshots: any = await this.fetchRelation(
          item,
          relation.relationRelation.property as RelationKeyOf<T>
        );
        const subItems = Reflect.get(item, relation.property);
        // 先存储引用表
        const subRepo = this.getRepository(relation);
        await subRepo._save(subItems, [relation.referenceRelation]);

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

        const relationRepo = this.getRepository(relation.relationRelation);
        const itemKey = Reflect.get(item, this.metadata.keyProperty);

        // 新增不存在的关联关系
        for (const subItem of subItems) {
          const subKey = Reflect.get(
            subItem,
            relation.referenceEntity.keyProperty
          );
          if (!snapshotMap[subKey]) {
            const relationItem = new relation.relationClass();
            Reflect.set(
              relationItem,
              relation.relationRelation.referenceRelation.foreignProperty,
              itemKey
            );
            Reflect.set(
              relationItem,
              relation.referenceRelation.relationRelation.referenceRelation
                .foreignProperty,
              subKey
            );
            await relationRepo._add(relationItem, true);
          }
        }

        // 删除多余的关联关系
        for (const relationItem of relationSnapshots) {
          const subKey = Reflect.get(
            relationItem,
            relation.relationRelation.referenceRelation.foreignProperty
          );
          if (!itemsMap[subKey]) {
            await relationRepo.delete(relationItem);
          }
        }
      }
    }
  }
}
