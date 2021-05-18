/* eslint-disable @typescript-eslint/ban-types */

import {
  Constructor, DataObjectOf, EntityMetadata, EntityType, PropertyMetadata, RelationMetadata,
} from './metadata'
import 'reflect-metadata'
import { Entity, EntitySymble as EntitySymbol, RelationKeyOf } from './repository'

export const METADATA = Symbol('LUBEJS#METADATA')

export interface EntityOptions {
  /**
   * 表名
   */
  name?: string
  /**
   * 摘要说明
   */
  description?: string
}


const propertyMap: Map<Object, PropertyMetadata[]> = new Map()
const relationMap: Map<Object, RelationMetadata[]> = new Map()


const entityMap: Map<Object, EntityMetadata> = new Map()

/**
 * 实体装饰器
 */
export function entity(
  options: EntityOptions
): <T extends Entity>(target: Constructor<T>) => void
export function entity<T extends Entity>(target: Constructor<T>): void
export function entity(): <T extends Entity>(target: Constructor<T>) => void
export function entity<T extends Entity>(
  optionsOrTarget?: EntityOptions | Constructor<T>
): (<T extends Entity>(target: Constructor<T>) => void) | void {
  if (!optionsOrTarget) return entity

  const makeMetadata = (target: EntityType, options?: EntityOptions): EntityMetadata => {
    const properties = propertyMap.get(target.prototype)
    const relations = relationMap.get(target.prototype)
    const data: DataObjectOf<EntityMetadata> = {
      name: options?.name ?? target.name,
      // class: target,
      properties,
      relations,
      description: options.description
    }
    const metadata = new EntityMetadata(data)
    data.set(METADATA, metadata, target);
  }

  if (typeof optionsOrTarget === 'function') {
    makeMetadata(optionsOrTarget)
  } else {
    return function (target: EntityType): void {
      makeMetadata(target, optionsOrTarget)
    }
  }
}

export interface PropertyOptions<T extends Entity> {
  name?: string
  /**
   * 摘要说明
   */
  description?: string
}

export function property<T extends Entity>(
  options: PropertyOptions<T>
): PropertyDecorator
export function property(): PropertyDecorator
export function property(target: Object, name: string): void
export function property<T extends Entity>(
  data?: PropertyOptions<T> | Constructor<T>,
  name?: string
): <T extends Entity>(target: Constructor<T>, name: string) => void {
  if (!data) return property
  throw new Error('尚未实现')
  // TODO 待实现
}

export interface RelationOptions<T extends Entity> {
  type?: () => Constructor<T>
  /**
   * 对方所关联的属性名
   */
  property?: RelationKeyOf<T>
  /**
   * 关系属性名称
   */
  name?: string
  /**
   * 摘要说明
   */
  description?: string
  /**
   * 是否延迟加载,类型必须声明为Promise<xx>
   */
  async?: boolean
}

export interface PrimaryOneToOneOptions<T extends Entity> extends RelationOptions<T> {
  isPrimary: true
  isDetail?: boolean
  /**
   * 当前isDetail为true时，表示合并提交时明细属性是否尾款，否则该属性没有意义
   */
  required?: boolean
}

export interface ForeignOneToOneOptions<T extends Entity> extends RelationOptions<T> {
  isPrimary: false
  isDetail?: false
  nullable?: boolean
}

export type OneToOneOptions<T extends Entity> = PrimaryOneToOneOptions<T> | ForeignOneToOneOptions<T>

export interface OneToManyOptions<T extends Entity> extends RelationOptions<T> {
  isDetail?: boolean
  required?: boolean
}

export interface ManyToOneOptions<T extends Entity> extends RelationOptions<T> {
  isDetail?: boolean
  nullable?: boolean
}

export interface ManyToManyOptions<T extends Entity> extends RelationOptions<T> {
  isDetail?: boolean
  required?: boolean
}

/**
 * 声明一对一属性
 */
export function oneToOne<T extends Entity>(
  options: OneToOneOptions<T>
): PropertyDecorator
export function oneToOne(): PropertyDecorator
export function oneToOne(entityCtr: Object, name: string): void
export function oneToOne<T extends Entity>(
  options?: OneToOneOptions<T> | Object,
  name?: string
): PropertyDecorator | void {
  throw new Error('尚未实现')
  // TODO 待实现
}

/**
 * 声明一个一对多属性
 */
export function oneToMay<T extends Entity>(
  options: RelationOptions<T>
): PropertyDecorator
export function oneToMay(): PropertyDecorator
export function oneToMay(entityCtr: Object, name: string): void
export function oneToMay<T extends Entity>(
  options?: OneToManyOptions<T> | Object,
  name?: string
): PropertyDecorator | void {
  throw new Error('尚未实现')
  // TODO 待实现
}

/**
 * 声明一个多对多关系
 */
export function manyToMay(): PropertyDecorator
export function manyToMay(
  entityCtr: Object,
  name: string
): void
export function manyToMay<T extends Entity>(options: RelationOptions<T>): PropertyDecorator
export function manyToMay<T extends Entity>(
  options?: ManyToManyOptions<T> | Object,
  name?: string
): PropertyDecorator | void {
  throw new Error('尚未实现')
  // TODO 待实现
}

// @entity
// class Y extends Entity {
//   b: string
//   @oneToOne({
//     isPrimary: true,
//     type: () => X,
//     property: 'y'
//   })
//   x: X
// }

// @entity()
// class X extends Entity {
//   constructor () {
//     super()
//   }

//   @property()
//   a: string

//   @oneToOne({
//     isPrimary: false,
//     type: () => Y,
//     property: 'x',
//     isDetail: false
//   })
//   y: Y

//   @oneToMay({
//     type: () => Y,
//     property: 'x'
//   })
//   ys: Y[]
// }
