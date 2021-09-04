import { metadataStore } from './metadata-store';
import { RelationKeyOf } from './types';

/**
 * 实体类基类,仅为了typescript区分类型
 * 不一定非得从此继承
 */
export class Entity {
  static create<T extends Entity>(
    this: EntityConstructor<T>,
    data: T
  ): EntityInstance<T>;
  static create<T extends Entity>(
    this: EntityConstructor<T>,
    data: T[]
  ): EntityInstance<T>[];
  static create<T extends Entity>(
    this: EntityConstructor<T>,
    data: T | T[]
  ): EntityInstance<T> | EntityInstance<T>[] {
    const metadata = metadataStore.getEntity(this);
    if (!metadata) {
      throw new Error(`Entity ${this.name} not register.`);
    }
    const init = (data: T) => {
      Object.setPrototypeOf(data, this.prototype);
      for (const relation of metadata.relations) {
        const propData: any = Reflect.get(data, relation.property);
        if (propData) {
          Entity.create.call(relation.referenceClass, propData);
        }
      }
      return data;
    };
    if (Array.isArray(data)) {
      for (const item of data) {
        init(item);
      }
    } else {
      init(data);
    }
    return data as any;
  }
}

export interface EntityConstructor<T extends Entity = any> {
  new (...args: any): T;
  // prototype: {
  //   constructor: EntityConstructor<T>
  // }
}

/**
 * 用于做实体主键类型
 * 用户可自行使用 合并声明扩展
 */
// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface EntityKey {}

/**
 * 主键的类型
 */
export type EntityKeyType = EntityKey[keyof EntityKey] extends never
  ? number
  : NonNullable<EntityKey[keyof EntityKey]>;

/**
 * 主键字段字面量类型
 */
export type EntityKeyName = keyof EntityKey extends never
  ? 'id'
  : keyof EntityKey;

export type EntityInstance<T extends Entity> = T &
  {
    [P in RelationKeyOf<T>]: T[P] extends (infer M)[]
      ? EntityInstance<NonNullable<M>>[]
      : EntityInstance<NonNullable<T[P]>>;
  } & {
    constructor: EntityConstructor<T>;
  };

export type EntityTypeOf<C extends EntityConstructor<any>> =
  C extends EntityConstructor<infer T> ? T : never;
