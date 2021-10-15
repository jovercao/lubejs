import { RowObject } from '../core/sql';
import { metadataStore } from './metadata-store';
import { RelationKeyOf } from './data-types';

const ENTITY_TAG = Symbol('#ENTITY_TAG');
type ENTITY_TAG = typeof ENTITY_TAG;

  export type EntityData<T extends Entity> = Omit<
    {
      [P in keyof T]: NonNullable<T[P]> extends Entity
        ? EntityData<NonNullable<T[P]>>
        : NonNullable<T[P]> extends EntityArray<infer M>
        ? EntityData<M>[]
        : T[P];
    },
    ENTITY_TAG
  >;

/**
 * 实体类基类,仅为了typescript区分类型
 * 不一定非得从此继承
 */
export class Entity {
  /**
   * 实体类标记
   */
  [ENTITY_TAG]: true;
  static create<T extends Entity>(
    this: EntityConstructor<T>,
    data: EntityData<T>
  ): EntityInstance<T>;
  static create<T extends Entity>(
    this: EntityConstructor<T>,
    data: EntityData<T>[]
  ): EntityInstance<T>[];
  static create<T extends Entity>(
    this: EntityConstructor<T>,
    data: EntityData<T> | EntityData<T>[]
  ): EntityInstance<T> | EntityInstance<T>[] {
    const metadata = metadataStore.getEntity(this);
    if (!metadata) {
      throw new Error(`Entity ${this.name} not register.`);
    }
    const init = (data: EntityData<T>) => {
      if (data instanceof this) return data;
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

Entity.prototype[ENTITY_TAG] = true;

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
  : Exclude<EntityKey[keyof EntityKey], undefined | null>;

type EntityArray<T extends Entity> = T[];
/**
 * 主键字段字面量类型
 */
export type EntityKeyName = keyof EntityKey extends never
  ? 'id'
  : keyof EntityKey;

export type EntityInstance<T extends object> = T &
  {
    [P in RelationKeyOf<T>]: T[P] extends EntityArray<infer M>
      ? EntityInstance<NonNullable<M>>[]
      : T[P] extends Entity
      ? EntityInstance<NonNullable<T[P]>>
      : T[P];
  } & {
    constructor: EntityConstructor<ToEntity<T>>;
  };

export type ToEntity<T extends RowObject> = T & {
  [ENTITY_TAG]: true;
};

export type EntityTypeOf<C extends EntityConstructor<any>> =
  C extends EntityConstructor<infer T> ? T : never;
