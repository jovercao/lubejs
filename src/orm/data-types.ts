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
  [P in keyof T]: NonNullable<T[P]> extends Entity | Entity[]
    ? NonNullable<P>
    : never;
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

export type DbEvents =
  | 'save'
  | 'insert'
  | 'update'
  | 'delete'
  | 'saved'
  | 'inserted'
  | 'updated'
  | 'deleted';
export type DbContextEventHandler = (
  event: DbEvents,
  Entity: Entity,
  items: Entity[]
) => void;

/**
 * 转换
 */
export type DataTypeOf<T> = T extends string
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
  : T extends (infer M)[]
  ? DataTypeOf<M>[]
  : T extends Entity
  ? EntityConstructor<T>
  : T extends object
  ? new (...args: any) => T
  : never;

/**
 * 标量类型对应的JS原生类型，用于描述字段类型
 */
export type ScalarDataType =
  | StringConstructor
  | DateConstructor
  | BooleanConstructor
  | NumberConstructor
  | DecimalConstructor
  | BigIntConstructor
  | ArrayBufferConstructor
  | typeof Buffer
  | SharedArrayBufferConstructor
  | UuidConstructor
  | JsonType<any>
  | ListType<BaseDataType>;

// /**
//  * 构造函数，即类本身
//  */
// export type Constructor<T = object> = {
//   new (...args: any): T;
// };

export type EntityType = EntityConstructor<Entity>;
/******************************* Model 相关声明 *********************************/

export type BaseDataType =
  | StringConstructor
  | DateConstructor
  | BooleanConstructor
  | NumberConstructor
  | DecimalConstructor
  | BigIntConstructor
  | ArrayBufferConstructor
  | typeof Buffer
  | SharedArrayBufferConstructor
  | UuidConstructor;
export type ListType<T extends BaseDataType> = [T];

export type JsonType<T> =
  | (new (value: object) => T) // 对象类型
  | [JsonType<T>]
  | StringConstructor
  | NumberConstructor
  | BooleanConstructor;

/**
 * Metadata中的数据类型
 */
export type DataType = ScalarDataType | EntityType | [EntityType];

export type RepositoryEventHandler<T> = (items: T[]) => void;

export function isBaseType(type: DataType): type is BaseDataType {
  return (
    type === String ||
    type === Number ||
    type === Boolean ||
    type === Date ||
    type === Decimal ||
    type === Uuid ||
    type === BigInt ||
    type === Buffer ||
    type === ArrayBuffer ||
    type === SharedArrayBuffer
  );
}

export function isJsonType(type: DataType): type is JsonType<any> {
  return !isBaseType(type);
}

export function isListType(type: DataType): type is ListType<BaseDataType> {
  return Array.isArray(type) && isBaseType(type[0]);
}
