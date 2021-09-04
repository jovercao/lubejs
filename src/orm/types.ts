import {
  Binary,
  Decimal,
  DecimalConstructor,
  Scalar,
  Uuid,
  UuidConstructor,
} from '../core';
import { Entity, EntityConstructor } from './entity';

/**
 * 过滤关联关系属性列表
 */
export type RelationKeyOf<T> = {
  [P in keyof T]: NonNullable<T[P]> extends Scalar | Scalar[] ? never : P;
}[keyof T];

export type SingleReferenceKeyOf<T> = {
  [P in keyof T]: T[P] extends Entity ? P : never;
};

export type MultiReferenceKeyOf<T> = {
  [P in keyof T]: T[P] extends Entity[] ? P : never;
};

export type FetchRelations<T = any> = {
  [P in RelationKeyOf<T>]?:
    | true
    | FetchRelations<T[P] extends Array<infer X> ? X : T[P]>;
};

export declare type DbEvents =
  | 'save'
  | 'insert'
  | 'update'
  | 'delete'
  | 'saved'
  | 'inserted'
  | 'updated'
  | 'deleted';
export declare type DbContextEventHandler = (
  event: DbEvents,
  Entity: Entity,
  items: Entity[]
) => void;

/**
 * 转换
 */
export declare type DataTypeOf<T> = T extends string
  ? StringConstructor
  : T extends number
  ? NumberConstructor
  : T extends bigint
  ? BigIntConstructor
  : T extends Date
  ? DateConstructor
  : T extends Decimal
  ? DecimalConstructor
  : T extends Uuid
  ? UuidConstructor
  : T extends boolean
  ? BooleanConstructor
  : T extends Binary
  ? typeof Buffer | ArrayBufferConstructor | SharedArrayBufferConstructor
  : T extends object
  ? ObjectConstructor
  : T extends (infer M)[]
  ? M extends object
    ? [new (...args: any) => M]
    : [DataTypeOf<M>]
  : never;

export declare type ScalarType =
  | StringConstructor
  | DateConstructor
  | BooleanConstructor
  | NumberConstructor
  | DecimalConstructor
  | BigIntConstructor
  | ArrayBufferConstructor
  | typeof Buffer
  | SharedArrayBufferConstructor
  | ObjectConstructor
  | ArrayConstructor
  | UuidConstructor;

// /**
//  * 构造函数，即类本身
//  */
// export declare type Constructor<T = object> = {
//   new (...args: any): T;
// };

export declare type EntityType = EntityConstructor<Entity>;
/******************************* Model 相关声明 *********************************/
export declare type ListType<
  T extends ScalarType | EntityType = ScalarType | EntityType
> = [T];
/**
 * Metadata中的数据类型
 */
export declare type DataType = ScalarType | EntityType | ListType | JSON;

export declare type RepositoryEventHandler<T> = (items: T[]) => void;
