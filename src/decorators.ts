/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/ban-types */

// import {
//   Constructor, DataObjectOf, EntityMetadata, EntityType, ColumnMetadata, RelationMetadata,
// } from './metadata'
// import 'reflect-metadata'
// import { Entity, EntitySymble as EntitySymbol, RelationKeyOf } from './repository'
// import { DbContext } from './db-context'

// export const METADATA = Symbol('LUBEJS#METADATA')

// export interface TableOptions {
//   /**
//    * 表名
//    */
//   name?: string
//   /**
//    * 摘要说明
//    */
//   description?: string
//   /**
//    * 指定上下文类型
//    */
//   contextClass?: () => Constructor<DbContext>
// }


// const propertyMap: Map<Object, ColumnMetadata[]> = new Map()
// const relationMap: Map<Object, RelationMetadata[]> = new Map()


// const entityMap: Map<Object, EntityMetadata> = new Map()

// /**
//  * 实体装饰器
//  */
// export function entity(
//   options: TableOptions
// ): <T extends Entity>(target: Constructor<T>) => void
// export function entity<T extends Entity>(target: Constructor<T>): void
// export function entity(): <T extends Entity>(target: Constructor<T>) => void
// export function entity<T extends Entity>(
//   optionsOrTarget?: TableOptions | Constructor<T>
// ): (<T extends Entity>(target: Constructor<T>) => void) | void {
//   if (!optionsOrTarget) return entity

//   const makeMetadata = (target: EntityType, options?: TableOptions): EntityMetadata => {
//     const properties = propertyMap.get(target.prototype)
//     const relations = relationMap.get(target.prototype)
//     const metadata = new EntityMetadata({
//       name: options?.name ?? target.name,
//       description: options.description,
//       class: target,
//       properties,
//       relations,
//       readonly: false,
//       contextClass: options.contextClass && options.contextClass()
//     })

//     entityMap.set(target, metadata);
//     return metadata
//   }

//   if (typeof optionsOrTarget === 'function') {
//     makeMetadata(optionsOrTarget)
//   } else {
//     return function (target: EntityType): void {
//       makeMetadata(target, optionsOrTarget)
//     }
//   }
// }

// export interface ColumnOptions<T extends Entity> {
//   name?: string
//   /**
//    * 摘要说明
//    */
//   description?: string
// }

// export function key(): PropertyDecorator
// export function key(target: Object, name: string): void
// export function key(target?: Object, name?: string): void | PropertyDecorator {
//   if (arguments.length === 0) {
//     return key
//   }
// }

// export function column<T extends Entity>(
//   options: ColumnOptions<T>
// ): PropertyDecorator
// export function column(): PropertyDecorator
// export function column(target: Object, name: string): void
// export function column<T extends Entity>(
//   data?: ColumnOptions<T> | Constructor<T>,
//   name?: string
// ): <T extends Entity>(target: Constructor<T>, name: string) => void {
//   if (!data) return column
//   throw new Error('尚未实现')
//   // TODO 待实现
// }

// export interface RelationOptions<T extends Entity, S extends Entity> {
//   /**
//    * 关联的目标类型
//    */
//   type?: () => Constructor<T>
//   /**
//    * 外键名称
//    */
//   name?: string;
//   /**
//    * 对方所关联的属性名
//    */
//   property?: RelationKeyOf<T>,

//   /**
//    * 摘要说明
//    */
//   description?: string
//   /**
//    * 是否延迟加载,如果为`true`，则属性类型必须声明为Promise<xxx>
//    */
//   async?: boolean
// }

// /**
//  * @param T 目标类型
//  * @param S 自身类型
//  */
// export interface PrimaryOneToOneOptions<T extends Entity, S extends Entity> extends RelationOptions<T> {
//   isPrimary: true
//   isDetail?: boolean
//   /**
//    * 当前isDetail为true时，表示合并提交时明细属性是否尾款，否则该属性没有意义
//    */
//   required?: boolean
// }

// export interface ForeignOneToOneOptions<T extends Entity, S extends Entity> extends RelationOptions<T> {
//   isPrimary: false
//   isDetail?: false
//   nullable?: boolean
//   from: (target: T) => any
//   /**
//    * 指定外键属性
//    */
//   foreignKey?: (self: S) => any
// }

// export type OneToOneOptions<T extends Entity, S extends Entity> = PrimaryOneToOneOptions<T, S> | ForeignOneToOneOptions<T, S>

// export interface OneToManyOptions<T extends Entity> extends RelationOptions<T> {
//   isDetail?: boolean
//   required?: boolean
// }

// export interface ManyToOneOptions<T extends Entity> extends RelationOptions<T> {
//   isDetail?: boolean
//   nullable?: boolean
// }

// export interface ManyToManyOptions<T extends Entity> extends RelationOptions<T> {
//   isDetail?: boolean
//   required?: boolean
// }

// /**
//  * 声明一对一属性
//  */
// export function oneToOne<T extends Entity>(
//   options: OneToOneOptions<T>
// ): PropertyDecorator
// export function oneToOne(): PropertyDecorator
// export function oneToOne(entityCtr: Object, name: string): void
// export function oneToOne<T extends Entity>(
//   options?: OneToOneOptions<T> | Object,
//   name?: string
// ): PropertyDecorator | void {
//   throw new Error('尚未实现')
//   // TODO 待实现
// }

// /**
//  * 声明一个一对多属性
//  */
// export function oneToMay<T extends Entity>(
//   options: RelationOptions<T>
// ): PropertyDecorator
// export function oneToMay(): PropertyDecorator
// export function oneToMay(entityCtr: Object, name: string): void
// export function oneToMay<T extends Entity>(
//   options?: OneToManyOptions<T> | Object,
//   name?: string
// ): PropertyDecorator | void {
//   throw new Error('尚未实现')
//   // TODO 待实现
// }

// /**
//  * 声明一个多对多关系
//  */
// export function manyToMay(): PropertyDecorator
// export function manyToMay(
//   entityCtr: Object,
//   name: string
// ): void
// export function manyToMay<T extends Entity>(options: RelationOptions<T>): PropertyDecorator
// export function manyToMay<T extends Entity>(
//   options?: ManyToManyOptions<T> | Object,
//   name?: string
// ): PropertyDecorator | void {
//   throw new Error('尚未实现')
//   // TODO 待实现
// }

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
