/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/ban-types */

import {
  ColumnMetadata,
  CommonEntityMetadata,
  DbContextMetadata,
  ForeignOneToOneMetadata,
  KeyMetadata,
  ManyToManyMetadata,
  ManyToOneMetadata,
  OneToManyMetadata,
  OneToOneMetadata,
  PrimaryOneToOneMetadata,
  RelationMetadata,
  TableEntityMetadata,
} from './metadata';
import 'reflect-metadata';
import {
  DbContext,
  DbContextConstructor,
  DbInstance,
  EntityConstructor,
} from './db-context';
import { DbType, Entity, EntityKeyType, Scalar, ScalarType } from './types';
import { modelBuilder } from './model-builder';
import { CompatibleExpression, Expression, ProxiedRowset, Select } from './ast';
import {
  ensureExpression,
  isDbType,
  isExtendsOf,
  parseConnectionUrl,
  selectProperty,
} from './util';
import { LubeConfig } from './migrate-cli';
import { ConnectOptions } from './lube';

export interface EntityOptions
  extends Partial<
    Pick<
      CommonEntityMetadata,
      'kind' | 'body' | 'tableName' | 'sql' | 'viewName' | 'readonly'
      // | 'comment'
    >
  > {
  contextGetter?: () => DbContextConstructor;
}

/**
 * 上下文选项
 */
export type DbContextOptions = Partial<
  Pick<
    DbContextMetadata,
    'database' | 'globalKeyName' | 'globalKeyType'
    // | 'comment'
  >
>;

export interface ColumnOptions extends Partial<
  Pick<
    ColumnMetadata,
    | 'columnName'
    // | 'comment'
    | 'defaultValue'
    | 'generator'
    | 'isRowflag'
    | 'isCalculate'
    | 'isIdentity'
    | 'isNullable'
    | 'dbType'
    | 'calculateExpression'
    | 'identityIncrement'
    | 'identityStartValue'
  >
> {
  type: ScalarType
};

export type KeyOptions = Partial<KeyMetadata>;

const ENTITY_KEY = Symbol('lubejs:entity');
const CONTEXT_KEY = Symbol('lubejs:context');
const ENTITY_COLUMNS_KEY = Symbol('lubejs:entity:columns');
const COLUMN_KEY = Symbol('lubejs:column');
const ENTITY_RELATIONS_KEY = Symbol('lubejs:entity:relations');
const RELATION_KEY = Symbol('lubejs:relation');
const ENTITY_KEY_KEY = Symbol('lubejs:entity:key');
const CONNECTION_KEY = Symbol('lubejs:connection');
const AMONG_KEY = Symbol('lubejs:among');
const COMMENT_KEY = Symbol('lubejs:comment');
const DECORATE_CONTEXTS_KEY = Symbol('lubejs:decorate:contexts');
const DECORATE_ENTITIES_KEY = Symbol('lubejs:decorate:entities');
// const CONTEXT_DATABASE_KEY = Symbol('lubejs:context:database');


export function getDecorateEntities(): EntityConstructor[] | undefined {
  return Reflect.getMetadata(DECORATE_ENTITIES_KEY, DbContext);
}

export function getDecorateContexts(): DbContextConstructor[] | undefined {
  return Reflect.getMetadata(DECORATE_CONTEXTS_KEY, DbContext);
}

export function getConnectionOptions(
  target: DbContextConstructor
): ConnectOptions | undefined {
  return Reflect.getMetadata(CONNECTION_KEY, target);
}

export function getContextOptions(
  target: DbContextConstructor
): DbContextOptions | undefined {
  return Reflect.getMetadata(CONTEXT_KEY, target);
}

export function getEntityOptions(
  target: EntityConstructor
): EntityOptions | undefined {
  return Reflect.getMetadata(ENTITY_KEY, target);
}

export function getColumnOptions(
  target: EntityConstructor,
  key: string
): ColumnOptions | undefined {
  return Reflect.getMetadata(COLUMN_KEY, target, key);
}

export function getRelationOptions(
  target: EntityConstructor,
  key: string
): RelationOptions | undefined {
  return Reflect.getMetadata(RELATION_KEY, target, key);
}

export function getEntityColumns(
  target: EntityConstructor
): string[] | undefined {
  return Reflect.getMetadata(ENTITY_COLUMNS_KEY, target);
}

export function getEntityRelations(
  target: EntityConstructor
): string[] | undefined {
  return Reflect.getMetadata(ENTITY_RELATIONS_KEY, target);
}

export function getEntityKeyOptions(
  target: EntityConstructor
): KeyOptions | undefined {
  return Reflect.getMetadata(ENTITY_KEY_KEY, target);
}

export function getComment(target: Object, key?: string): string | undefined {
  if (key) {
    return Reflect.getMetadata(COMMENT_KEY, target, key);
  }
  return Reflect.getMetadata(COMMENT_KEY, target);
}

function addDecorateContext(ctr: DbContextConstructor): void {
  let ctrs = getDecorateContexts();
  if (!ctrs) {
    ctrs = [];
    Reflect.defineMetadata(DECORATE_CONTEXTS_KEY, ctrs, DbContext);
  }
  if (!ctrs.includes(ctr)) {
    ctrs.push(ctr);
  }
}

function addDecorateEntities(ctr: EntityConstructor): void {
  let ctrs = getDecorateEntities();
  if (!ctrs) {
    ctrs = [];
    Reflect.defineMetadata(DECORATE_ENTITIES_KEY, ctrs, DbContext);
  }
  if (!ctrs.includes(ctr)) {
    ctrs.push(ctr);
  }
}

function addEntitiyColumn(target: EntityConstructor, key: string): void {
  let columns = getEntityColumns(target);
  let relations = getEntityRelations(target);
  if (!columns) {
    columns = [];
    Reflect.defineMetadata(ENTITY_COLUMNS_KEY, columns, target);
  }
  if (columns.includes(key) || relations?.includes(key)) {
    throw new Error('Column or relation is allowed decorate once only on property.')
  }
  columns.push(key);
}

function addEntitiyRelation(target: EntityConstructor, key: string): void {
  let relations = getEntityRelations(target);
  let columns = getEntityColumns(target);
  if (!relations) {
    relations = [];
    Reflect.defineMetadata(ENTITY_RELATIONS_KEY, relations, target);
  }
  if (relations.includes(key) || columns?.includes(key)) {
    throw new Error('Column or relation is allowed decorate once only on property.')
  }
  relations.push(key);
}

function setContextOptions(
  target: DbContextConstructor,
  data: DbContextOptions
): void {
  let options = getContextOptions(target);
  if (!options) {
    options = {};
    Reflect.defineMetadata(CONTEXT_KEY, options, target);
    addDecorateContext(target);
  }
  Object.assign(options, data);
}

function setEntityOptions(
  target: EntityConstructor,
  options: EntityOptions
): void {
  let entityOptions = getEntityOptions(target);
  if (!entityOptions) {
    entityOptions = {
      kind: 'TABLE',
    };
    addDecorateEntities(target);
    Reflect.defineMetadata(ENTITY_KEY, entityOptions, target);
  }
  Object.assign(entityOptions, options);
}

function setKeyOptions(target: EntityConstructor, options: KeyOptions): void {
  let keyOptions = getEntityKeyOptions(target);
  if (!keyOptions) {
    keyOptions = {};
    Reflect.defineMetadata(ENTITY_KEY_KEY, keyOptions, target);
  }
  Object.assign(keyOptions, options);
}

export function database(
  name: string
): (constructor: DbContextConstructor) => void {
  return function (target: DbContextConstructor) {
    setContextOptions(target, {
      database: name,
    });
  };
}

export function connection(
  connectionString: string
): (constructor: DbContextConstructor) => void;
export function connection(
  config: ConnectOptions
): (constructor: DbContextConstructor) => void;
export function connection(
  urlOrOptions: string | ConnectOptions
): (constructor: DbContextConstructor) => void {
  return function (target: DbContextConstructor) {
    let connectionOptions: ConnectOptions;
    if (typeof urlOrOptions === 'string') {
      connectionOptions = parseConnectionUrl(urlOrOptions);
    } else {
      connectionOptions = urlOrOptions;
    }
    Reflect.defineMetadata(CONNECTION_KEY, connectionOptions, target);
  };
}

/**
 * 为Entity绑定DbContext
 */
export function context<T extends Entity>(
  getter: () => DbContextConstructor
): (target: EntityConstructor<T>) => void {
  return function (target: EntityConstructor<T>): void {
    setEntityOptions(target, {
      contextGetter: getter,
    });
  };
}

/**
 * 表装饰器
 */
export function table<T extends Entity>(
  name?: string
): (target: EntityConstructor<T>) => void {
  return function (target: EntityConstructor): void {
    setEntityOptions(target, {
      kind: 'TABLE',
      tableName: name || target.name,
    });
  };
}

export function view<T extends Entity>(
  body: () => Select<T>
): (constructor: EntityConstructor<T>) => void;
export function view<T extends Entity>(
  name: string,
  body: () => Select<T>
): (constructor: EntityConstructor<T>) => void;
export function view<T extends Entity>(
  nameOrBody: string | (() => Select<T>),
  body?: () => Select<T>
): (constructor: EntityConstructor<T>) => void {
  let name: string | undefined;
  if (typeof nameOrBody === 'string') {
    name = nameOrBody;
  } else {
    body = nameOrBody;
  }
  return function (target: EntityConstructor<T>): void {
    setEntityOptions(target, {
      kind: 'VIEW',
      viewName: name,
      body: body!(),
    });
  };
}

export function query<T extends Entity>(
  sql: Select<T>
): (constructor: EntityConstructor<T>) => void {
  return function (target: EntityConstructor<T>): void {
    setEntityOptions(target, {
      kind: 'QUERY',
      sql,
    });
  };
}

export function comment(
  msg: string
): (
  target: EntityConstructor | DbContextConstructor | Object,
  key?: string
) => void {
  return function (
    target: EntityConstructor | DbContextConstructor | Object,
    key?: string
  ): void {
    if (key) {
      Reflect.defineMetadata(COMMENT_KEY, msg, target, key);
    } else {
      Reflect.defineMetadata(COMMENT_KEY, msg, target);
    }
  };

  // return function (
  //   target: EntityConstructor | DbContextConstructor | Object,
  //   key?: string
  // ) {
  //   if (typeof target === 'function') {
  //     if (isExtendsOf(target, DbContext)) {
  //       setContextOptions(target as DbContextConstructor, {
  //         comment: msg,
  //       });
  //     } else {
  //       setEntityOptions(target as EntityConstructor, {
  //         comment: msg,
  //       });
  //     }
  //   } else {
  //     setColumnOptions(target.constructor as EntityConstructor, key!, {
  //       comment: msg,
  //     });
  //   }
  // };
}

// export function column(type: ScalarType): PropertyDecorator
// export function column(name?: string)
// export function column(name?: string) {

// }

// function setPropertyOptions(
//   target: Object,
//   key: string,
//   prop: keyof ColumnOptions,
//   value: any
// ): void;
function setColumnOptions(
  target: EntityConstructor,
  key: string,
  options: Partial<ColumnOptions>
): void {
  let columnOptions = getColumnOptions(target, key);
  if (!columnOptions) {
    columnOptions = {
    } as ColumnOptions;
    Reflect.defineMetadata(COLUMN_KEY, columnOptions, target, key);
  }
  Object.assign(columnOptions, options);
}

function setRelationOptions(
  target: EntityConstructor,
  key: string,
  options: Partial<RelationOptions>
): void {
  let relationOptions = getRelationOptions(
    target,
    key
  );
  if (!relationOptions) {
    relationOptions = {} as RelationOptions;
    Reflect.defineMetadata(RELATION_KEY, relationOptions, target, key);
  }
  if (options.kind && relationOptions.kind) {
    throw Error(`Relation is only decorators once on property.`);
  }
  if (options.isPrimary && options.kind && options.kind !== 'ONE_TO_ONE') {
    throw Error(`principal is only use on one to one relation property.`);
  }
  Object.assign(relationOptions, options);
}

export function key(constraintName?: string): PropertyDecorator;
export function key(
  constraintName: string,
  nonclustered: boolean
): PropertyDecorator;
export function key(
  constraintNameOrNonclustered?: string | boolean,
  nonclustered?: boolean
): PropertyDecorator {
  let constraintName: string | undefined;
  if (nonclustered !== undefined) {
    constraintName = constraintNameOrNonclustered as string;
  } else {
    if (constraintNameOrNonclustered !== undefined) {
      nonclustered = constraintNameOrNonclustered as boolean;
    }
  }
  return function (target: Object, key: string) {
    setKeyOptions(target.constructor as EntityConstructor, {
      property: key,
    });
    if (constraintName) {
      setKeyOptions(target.constructor as EntityConstructor, {
        constraintName,
      });
    }
    if (constraintNameOrNonclustered !== undefined) {
      setKeyOptions(target.constructor as EntityConstructor, {
        isNonclustered: nonclustered,
      });
    }
  };
}

export function rowflag(): PropertyDecorator {
  return function (target: Object, key: string) {
    setColumnOptions(target.constructor as EntityConstructor, key, {
      dbType: DbType.rowflag,
      isRowflag: true,
    });
  };
}

export function identity(
  start?: number,
  incerment?: number
): PropertyDecorator {
  return function (target: object, key: string) {
    setColumnOptions(target.constructor as EntityConstructor, key, {
      isIdentity: true,
      identityStartValue: start,
      identityIncrement: incerment,
    });
  };
}

export function nullable(nullable: boolean = true): PropertyDecorator {
  return function (target: Object, key: string) {
    setColumnOptions(target.constructor as EntityConstructor, key, {
      isNullable: nullable,
    });
  };
}

export function calculate(expr: Expression): PropertyDecorator {
  return function (target: Object, key: string) {
    setColumnOptions(target.constructor as EntityConstructor, key, {
      isCalculate: true,
      calculateExpression: expr,
    });
  };
}

export function autogen<T extends Entity = any>(
  generator: (
    rowset: ProxiedRowset<T>,
    item: object,
    context: DbInstance
  ) => CompatibleExpression
): PropertyDecorator {
  return function (target: Object, key: string) {
    setColumnOptions(target.constructor as EntityConstructor, key, {
      generator,
    });
  };
}

export function defaultValue(
  expr: () => CompatibleExpression
): PropertyDecorator {
  return function (target: Object, key: string) {
    setColumnOptions(target.constructor as EntityConstructor, key, {
      defaultValue: ensureExpression(expr()),
    });
  };
}

/**
 * 单独标记属性类型
 * Uuid Decimal Date等对象类型必须使用type进行标记
 */
export function type(type: ScalarType): PropertyDecorator {
  return function (target: Object, key: string): void {
    setColumnOptions(target.constructor as EntityConstructor, key, {
      type,
    });
  };
}

// export function dbType(dbType: DbType): PropertyDecorator {
//   return function(target: Object, key: string): void {
//     setPropertyOptions(target, key, {
//       dbType
//     })
//   }
// }

export function column<T extends Entity>(name?: string): PropertyDecorator;
export function column<T extends Entity>(
  type: ScalarType
): PropertyDecorator;
export function column<T extends Entity>(
  dbType: DbType
): PropertyDecorator;
export function column<T extends Entity>(
  type: ScalarType,
  dbType: DbType
): PropertyDecorator;
export function column<T extends Entity>(
  name: string,
  type?: ScalarType
): PropertyDecorator;
export function column<T extends Entity>(
  name: string,
  dbType?: DbType
): PropertyDecorator;
export function column<T extends Entity>(
  name: string,
  type: ScalarType,
  dbType: DbType
): PropertyDecorator;
export function column<T extends Entity>(
  nameOrTypeOrDbType?: string | DbType | ScalarType,
  typeOrDbType?: DbType | ScalarType,
  dbType?: DbType
): PropertyDecorator {
  return function (target: Object, key: string) {
    let name: string | undefined;
    let dbType: DbType | undefined ;
    let type: ScalarType | undefined;
    // 无参数
    if (typeof nameOrTypeOrDbType === 'string') {
      name = nameOrTypeOrDbType;
      if (typeof typeOrDbType  === 'object') {
        dbType = typeOrDbType
      } else {
        type = typeOrDbType
      }
    } else if (typeof nameOrTypeOrDbType === 'object') {
      dbType = nameOrTypeOrDbType;
    } else if (typeof nameOrTypeOrDbType === 'function') {
      type = nameOrTypeOrDbType;
      if (typeof typeOrDbType === 'object') {
        dbType = typeOrDbType;
      }
    }
    if (!name) {
      name = key;
    }

    if (!type) {
      type = Reflect.getMetadata('design:type', target, key);
      if (type === Array || type === Object) {
        throw new Error('Object type must specil type(like Date、Decimal); Becuase typescript is donot metadata them.')
      }
    }

    setColumnOptions(target.constructor as EntityConstructor, key, {
      type: type!,
      dbType,
      columnName: name
    });
    addEntitiyColumn(target.constructor as EntityConstructor, key);
  };
}

export interface RelationOptions {
  kind: OneToOneMetadata['kind'] | ManyToOneMetadata['kind'] | OneToManyMetadata['kind'] | ManyToManyMetadata['kind'];
  referenceEntityGetter: () => EntityConstructor;
  referenceProperty?: string;
  relationProperty?: string;
  foreignProperty?: string;
  isPrimary?: true
}

export function oneToOne<T extends object>(
  referenceEntityGetter: () => EntityConstructor<T>,
  referenceProperty?: (p: Required<T>) => Scalar
): PropertyDecorator {
  return function (target: Object, key: string): void {
    const type = Reflect.getMetadata('design:type', target, key);
    if (type !== Array) {
      throw new Error(
        `One to one relation property ${key} type error, property must type of reference entity array.`
      );
    }
    setRelationOptions(target.constructor as EntityConstructor, key, {
      kind: 'ONE_TO_ONE',
      referenceProperty: referenceProperty
        ? selectProperty(referenceProperty)
        : undefined,
      referenceEntityGetter,
    });
    addEntitiyRelation(target.constructor as EntityConstructor, key);
  };
}

/**
 * 将一对一关系声明为主导关系
 */
export function principal(): PropertyDecorator {
  return function (target: Object, key: string) {
    // const relationOptions = getRelationOptions(target.constructor as EntityConstructor, key);
    // if (relationOptions?.kind && relationOptions.kind !== 'ONE_TO_MANY') {
    //   throw new Error(`Principal is used in one to one relation property.`);
    // }
    setRelationOptions(target.constructor as EntityConstructor, key, {
      isPrimary: true,
    });
  };
}

/**
 * 用于关系字段中，指定外键字段，注意，该装饰器仅可用在导航属性中。
 */
export function foreignKey(
  /**
   * 导航属性名称
   */
  foreignProperty: string
): PropertyDecorator {
  return function (target: Object, key: string) {
    // const relationOptions = getRelationOptions(target.constructor as EntityConstructor, key);
    // if (relationOptions?.kind === 'MANY_TO_MANY' || relationOptions?.kind === 'ONE_TO_MANY') {
    //   throw Error(`No foreign key on relation ${relationOptions.kind}`)
    // }
    setRelationOptions(target.constructor as EntityConstructor, key, {
      foreignProperty,
    });
  };
}

export function oneToMany<T extends Entity>(
  referenceEntityGetter: () => EntityConstructor<T>,
  referenceProperty: (p: Required<T>) => any
): PropertyDecorator {
  return function (target: Object, key: string) {
    const type = Reflect.getMetadata('design:type', target, key);
    if (type !== Array) {
      throw new Error(
        `One to many relation property ${key} type error, property must type of reference entity array.`
      );
    }

    setRelationOptions(target.constructor as EntityConstructor, key, {
      kind: 'ONE_TO_MANY',
      referenceEntityGetter,
      referenceProperty: referenceProperty
        ? selectProperty(referenceProperty)
        : undefined,
    });
    addEntitiyRelation(target.constructor as EntityConstructor, key);
  };
}

export function manyToOne<T extends Entity>(
  referenceEntityGetter: () => EntityConstructor<T>,
  referenceProperty?: (p: Required<T>) => any
): PropertyDecorator {
  return function (target: Object, key: string) {
    const type = Reflect.getMetadata('design:type', target, key);
    if (type !== Object) {
      throw new Error(
        `Many to one relation property ${key} type error, property must type of reference entity.`
      );
    }
    setRelationOptions(target.constructor as EntityConstructor, key, {
      kind: 'MANY_TO_ONE',
      referenceEntityGetter,
      referenceProperty: referenceProperty
        ? selectProperty(referenceProperty)
        : undefined,
    });
    addEntitiyRelation(target.constructor as EntityConstructor, key);
  };
}

export function manyToMany<T extends Entity, R extends Entity>(
  referenceEntityGetter: () => EntityConstructor<R>,
  referenceProperty?: (p: Required<R>) => T[],
  relationProperty?: string
): PropertyDecorator {
  return function (target: Object, key: string) {
    const type = Reflect.getMetadata('design:type', target, key);
    if (type !== Array) {
      throw new Error(
        `Many to many relation property ${key} type error, property must type of reference entity array.`
      );
    }
    setRelationOptions(target.constructor as EntityConstructor, key, {
      kind: 'MANY_TO_MANY',
      referenceEntityGetter,
      referenceProperty: referenceProperty
        ? selectProperty(referenceProperty)
        : undefined,
      relationProperty
    });
    addEntitiyRelation(target.constructor as EntityConstructor, key);
  };
}

/**
 * 中间表关系
 */
export interface AmongOptions {
  leftEntityGetter: () => EntityConstructor;
  rightEngityGetter: () => EntityConstructor;
  leftProperty?: string;
  rightProperty?: string;
}

/**
 * 定义多对多关系中间表，并可在其中指定其外键属性
 */
export function among<T extends Entity, L extends Entity, R extends Entity>(
  /**
   * 引用表1
   */
  leftGetter: () => EntityConstructor<L>,
  /**
   * 引用表2
   */
  rightGetter: () => EntityConstructor<L>,
  /**
   * 引用表1的导航属性
   */
  leftProperty?: (p: Required<T>) => L,
  /**
   * 引用表2的导航属性
   */
  rightProperty?: (p: Required<R>) => R
): (target: EntityConstructor<T>) => void {
  return function (target: EntityConstructor<T>): void {
    const opt = getAmong(target);
    if (opt) {
      throw new Error(`Among is only allow decorate once.`)
    }
    Reflect.defineMetadata(
      AMONG_KEY,
      <AmongOptions>{
        leftEntityGetter: leftGetter,
        rightEngityGetter: rightGetter,
        leftProperty: leftProperty
          ? selectProperty(leftProperty)
          : undefined,
        rightProperty: rightProperty
          ? selectProperty(rightProperty)
          : undefined,
      },
      target
    );
  };
}

export function getAmong(target: EntityConstructor): AmongOptions {
  return Reflect.getMetadata(AMONG_KEY, target);
}

// export interface RelationOptions<T extends Entity, S extends Entity> {
//   /**
//    * 关联的目标类型
//    */
//   referenceClass?: () => EntityConstructor<T>;
//   /**
//    * 外键名称
//    */
//   name?: string;
//   /**
//    * 对方所关联的属性名
//    */
//   property?: RelationKeyOf<T>;

//   /**
//    * 摘要说明
//    */
//   description?: string;
//   /**
//    * 是否延迟加载,如果为`true`，则属性类型必须声明为Promise<xxx>
//    */
//   async?: boolean;
// }

// /**
//  * @param T 目标类型
//  * @param S 自身类型
//  */
// export interface PrimaryOneToOneOptions<T extends Entity, S extends Entity>
//   extends RelationOptions<T> {
//   isPrimary: true;
//   isDetail?: boolean;
//   /**
//    * 当前isDetail为true时，表示合并提交时明细属性是否尾款，否则该属性没有意义
//    */
//   required?: boolean;
// }

// export interface ForeignOneToOneOptions<T extends Entity, S extends Entity>
//   extends RelationOptions<T> {
//   isPrimary: false;
//   isDetail?: false;
//   nullable?: boolean;
//   from: (target: T) => any;
//   /**
//    * 指定外键属性
//    */
//   foreignKey?: (self: S) => any;
// }

// export type OneToOneOptions<T extends Entity, S extends Entity> =
//   | PrimaryOneToOneOptions<T, S>
//   | ForeignOneToOneOptions<T, S>;

// export interface OneToManyOptions<T extends Entity> extends RelationOptions<T> {
//   isDetail?: boolean;
//   required?: boolean;
// }

// export interface ManyToOneOptions<T extends Entity> extends RelationOptions<T> {
//   isDetail?: boolean;
//   nullable?: boolean;
// }

// export interface ManyToManyOptions<T extends Entity>
//   extends RelationOptions<T> {
//   isDetail?: boolean;
//   required?: boolean;
// }

// /**
//  * 声明一对一属性
//  */
// export function oneToOne<T extends Entity>(
//   options: OneToOneOptions<T>
// ): PropertyDecorator;
// export function oneToOne(): PropertyDecorator;
// export function oneToOne(entityCtr: Object, name: string): void;
// export function oneToOne<T extends Entity>(
//   options?: OneToOneOptions<T> | Object,
//   name?: string
// ): PropertyDecorator | void {
//   throw new Error('尚未实现');
// }

// /**
//  * 声明一个一对多属性
//  */
// export function oneToMay<T extends Entity>(
//   options: RelationOptions<T>
// ): PropertyDecorator;
// export function oneToMay(): PropertyDecorator;
// export function oneToMay(entityCtr: Object, name: string): void;
// export function oneToMay<T extends Entity>(
//   options?: OneToManyOptions<T> | Object,
//   name?: string
// ): PropertyDecorator | void {
//   throw new Error('尚未实现');
//   // TODO 待实现
// }

// /**
//  * 声明一个多对多关系
//  */
// export function manyToMay(): PropertyDecorator;
// export function manyToMay(entityCtr: Object, name: string): void;
// export function manyToMay<T extends Entity>(
//   options: RelationOptions<T>
// ): PropertyDecorator;
// export function manyToMay<T extends Entity>(
//   options?: ManyToManyOptions<T> | Object,
//   name?: string
// ): PropertyDecorator | void {
//   throw new Error('尚未实现');
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
