// import { DbContext, DbInstance } from "./db-context";
// import { Executor } from "./execute";
// import {
//   EntityMetadata,
//   isForeignOneToOne,
//   isManyToOne,
//   isOneToMany,
//   isOneToOne,
//   isPrimaryOneToOne,
//   metadataStore,
//   RelationMetadata,
//   TableEntityMetadata,
// } from "./metadata";
// import { ColumnBuilder } from './model-builder'
// import { FetchRelations, RelationKeyOf, SingleReferenceKeyOf } from "./repository";
// import { Constructor, Entity, EntityType } from "./types";
// import { deepthEqual } from './util'

// export enum DataAction {
//   none = 'none',
//   /**
//    * 创建操作
//    */
//   create = "create",
//   /**
//    * 修改操作
//    */
//   modify = "modify",
//   /**
//    * 删除操作
//    */
//   remove = "remove",
//   // /**
//   //  * 未修改
//   //  */
//   // unchange = "unchange",
// }

// /**
//  * 数据变更描述
//  */
// export type DataChangeInfo<T extends Entity> = {
//   /**
//    * 本记录的操作值
//    */
//   action: DataAction;
//   /**
//    * 对比的数据项
//    */
//   data: T;
//   /**
//    * 从数据库中提取的数据快照
//    */
//   snapshot: T;
//   // /**
//   //  * 数据变更记录，object对象
//   //  * 如果是修改的数据，仅会记录被修改的属性
//   //  */
//   // changes?: Partial<T>;

//   /**
//    * 子级属性变化
//    */
//   subChanges: {
//     [K in RelationKeyOf<T>]: DataChangeInfo<T[K]>[];
//   };
// };

// const MAP_KEY_ROWS = 100;

// export class DataMonitor {
//   constructor(private instance: DbInstance) {}

//   private async loadSnapshotRelations(
//     metadata: EntityMetadata,
//     item: any,
//     snapshot: any
//   ): Promise<void> {
//     if (!snapshot || !item) return;
//     if (item[metadata.keyProperty] !== snapshot[metadata.keyProperty]) return;

//     for (const relation of metadata.relations) {
//       if (!Reflect.has(item, relation.property)) continue;
//       await this.instance
//         .getRepository(metadata.class)
//         .loadRelation(snapshot, { [relation.property]: true });

//       if (item[relation.property] && snapshot[relation.property]) {
//         if (relation.kind === "MANY_TO_ONE" || relation.kind === "ONE_TO_ONE") {
//           await this.loadSnapshotRelations(
//             relation.referenceEntity,
//             item[relation.property],
//             snapshot[relation.property]
//           );
//         } else {
//           for (const subItem of item[relation.property]) {
//             // 查找到对应的子项
//             const subSnapshot = snapshot[relation.property].find(
//               (p: any) =>
//                 p[relation.referenceEntity.keyProperty] ===
//                 subItem[relation.referenceEntity.keyProperty]
//             );
//             await this.loadSnapshotRelations(
//               relation.referenceEntity,
//               item,
//               subSnapshot
//             );
//           }
//         }
//       }
//     }
//   }

//   private async getSnapshot(
//     metadata: EntityMetadata,
//     item: any
//   ): Promise<any> {
//     const key = item[metadata.keyProperty];
//     if (key === undefined || key === null || key === "") {
//       return null;
//     }
//     const snapshot = await this.instance.getRepository(metadata.class).get(key);
//     await this.loadSnapshotRelations(metadata, item, snapshot)
//     return snapshot;
//   }

//   /**
//    * 获取数据变更信息
//    * @param items
//    */
//   async getChanges<T extends Entity>(item: T): Promise<DataChangeInfo<T>>
//   async getChanges<T extends Entity>(entity: Constructor<T>, item: T): Promise<DataChangeInfo<T>>
//   async getChanges<T extends Entity>(entityOrItem: Constructor<T> | T, itemOrUndefined?: T): Promise<DataChangeInfo<T>> {
//     let entity: Constructor<T>
//     let item: T
//     if (arguments.length === 2) {
//       entity = entityOrItem as Constructor<T>;
//       item = itemOrUndefined;
//     } else {
//       item = entityOrItem as T;
//       entity = item.constructor as Constructor<T>;
//       if (!entity) {
//         throw new Error(`Item must instance of EntityType`);
//       }
//     }
//     const metadata = metadataStore.getEntity(item.constructor as EntityType);
//     if (!metadata) {
//       throw new Error(`Entity ${item.constructor} metadata not found.`);
//     }
//     const snapshot: T = await this.getSnapshot(metadata, item);
//     return this.compare(metadata, item, snapshot);
//   }

//   // private getKey(metadata: EntityMetadata, item: any): any {
//   //   const key: any = {}
//   //   key[metadata.keyColumn.columnName] = item[metadata.keyColumn.property]
//   //   if (metadata.rowflagColumn) {
//   //     key[metadata.rowflagColumn.columnName] = item[metadata.rowflagColumn.property]
//   //   }
//   //   return key;
//   // }

//   // /**
//   //  * 判断值是否变化
//   //  * @param metadata
//   //  * @param item
//   //  * @param snapshot
//   //  */
//   // private isChanged(metadata: EntityMetadata, item: any, snapshot: any): boolean {
//   //   for (const column of metadata.columns) {
//   //     // 如果是隐式列，并且未声明属性，则跳过该列的检查
//   //     if (column.isImplicit && !Reflect.has(item, column.property)) continue;
//   //     if (column.type === JSON || column.type === Array) {
//   //       if (!deepthEqual(item[column.property], snapshot[column.property])) {
//   //         return true;
//   //       }
//   //     }
//   //     if (item[column.property] !== snapshot[column.property]) {
//   //       return true
//   //     }
//   //   }
//   //   return false
//   // }

//   private async compare(
//     metadata: EntityMetadata,
//     item: any,
//     snapshot: any
//   ): Promise<DataChangeInfo<any>> {
//     let action: DataAction;
//     // 创建
//     if (item && !snapshot) {
//       action = DataAction.create;
//     }
//     // 删除
//     else if (!item && snapshot) {
//       action = DataAction.remove;
//     }

//     // 修改
//     else if (item && snapshot) {
//       // WARN: 修改和更新属性提升至Reponsity进行判定
//       action = DataAction.modify;
//       // let changeCount = 0;
//       // for (const relation of metadata.relations) {
//       //   if (!Reflect.has(item, relation.property)) continue;
//       //   if (isManyToOne(relation) || isForeignOneToOne(relation)) {
//       //     const itemForeignKey = item[relation.property]?.[relation.referenceEntity.keyProperty];
//       //     const snapshotForeignKey = snapshot[relation.property]?.[relation.referenceEntity.keyProperty];
//       //     // if (itemForeignKey === snapshotForeignKey) continue;
//       //     // changeCount++;
//       //     // WARN: 修改和更新属性由Reponsity进行判定
//       //     // if (Reflect.has(item, relation.foreignProperty)) {
//       //     //   item[relation.foreignProperty] = itemForeignKey;
//       //     // } else {
//       //     //   Object.defineProperty(item, relation.foreignProperty, {
//       //     //     enumerable: !relation.foreignColumn.isImplicit,
//       //     //     value: itemForeignKey
//       //     //   })
//       //     // }
//       //   }
//       //   // else
//       //   // }
//       // }
//       // if (changeCount || this.isChanged(metadata, item, snapshot)) {
//       //   action = DataAction.modify;
//       // } else {
//       //   action = DataAction.unchange;
//       // }
//     } else {
//       action = DataAction.none;
//     }

//     const subChanges: any = {};
//     for (const relation of metadata.relations) {
//       if (!Reflect.has(item, relation.property)) continue;
//       const relationChanges: DataChangeInfo<any>[] = []

//       // 父表项，除更改关系外，还对项进行增删改
//       if (isForeignOneToOne(relation) || isManyToOne(relation)) {
//         // subChanges[relation.property] = [this.getChanges(relation.referenceClass, item[relation.property])];
//         const subItemChanges = await this.getChanges(relation.referenceClass, item[relation.property]);
//         relationChanges.push(subItemChanges)
//       } else if (isOneToMany(relation)) {
//         // 子表项，同步增删改
//         const subItems = item[relation.property] || [];
//         const subSnapshots = snapshot[relation.property];
//         const subItemKeyMap: any = {}
//         const subSnapshotMap: any = {}
//         subItems.forEach((subItem: any) => subItemKeyMap[subItem[relation.referenceEntity.keyProperty]] = subItem)
//         subSnapshots.forEach((subSnapshot: any) => subSnapshotMap[subSnapshot[relation.referenceEntity.keyProperty]] = subSnapshot)
//         for (const subItem of subItems) {
//           const subSnapshot = subSnapshotMap[subItem[relation.referenceEntity.keyProperty]];
//           const subItemChanges = await this.compare(relation.referenceEntity, subItem, subSnapshot);
//           relationChanges.push(subItemChanges)
//         };
//       } else if (isPrimaryOneToOne(relation)) {
//         const subItem = item[relation.property];
//         const subSnapshot = snapshot[relation.property];
//         relationChanges.push(await this.compare(relation.referenceEntity, subItem, subSnapshot));
//       } else {
//         subChanges[relation.property] = item[relation.property].map((subItem: any) => this.getChanges(relation.referenceClass, item[relation.property]));
//       }
//       if (relationChanges.length > 0) {
//         subChanges[relation.property] = relationChanges;
//       }
//     }

//     const changes: DataChangeInfo<any> = {
//       action,
//       data: item,
//       snapshot,
//       subChanges,
//     };

//     return changes;
//   }
// }

exports = null;
