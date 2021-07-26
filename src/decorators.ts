/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/ban-types */

import {
  ColumnMetadata,
  CommonEntityMetadata,
  DbContextMetadata,
  KeyMetadata,
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
import { DbType, Entity, ScalarType } from './types';
import { modelBuilder } from './model-builder';
import { CompatibleExpression, Expression, ProxiedRowset, Select } from './ast';
import { ensureExpression, isDbType, isExtendsOf, parseConnectionUrl } from './util';
import { LubeConfig } from './migrate-cli';
import { ConnectOptions } from './lube';

export interface EntityOptions
  extends Partial<
    Pick<
      CommonEntityMetadata,
      | 'kind'
      | 'body'
      | 'tableName'
      | 'sql'
      | 'viewName'
      | 'readonly'
      | 'comment'
    >
  > {
  contextGetter?: () => DbContextConstructor;
}

/**
 * 上下文选项
 */
export type DbContextOptions = Partial<
  Pick<DbContextMetadata, 'database' | 'globalKeyName' | 'globalKeyType' | 'comment'>
>;

export type ColumnOptions = Partial<
  Pick<
    ColumnMetadata,
    | 'columnName'
    | 'comment'
    | 'defaultValue'
    | 'generator'
    | 'isRowflag'
    | 'isCalculate'
    | 'isIdentity'
    | 'isNullable'
    | 'type'
    | 'dbType'
    | 'calculateExpression'
    | 'identityIncrement'
    | 'identityStartValue'
    | 'kind'
  >
>;

export type KeyOptions = Partial<KeyMetadata>;

export type RelationOptions = Partial<RelationMetadata>;

export const entityOptionsKey = Symbol('lubejs:entity');
export const contextOptionsKey = Symbol('lubejs:context');
export const columnsKey = Symbol('lubejs:entity:columns');
export const columnKey = Symbol('lubejs:entity:column');
export const relationsKey = Symbol('lubejs:relations');
export const relationKey = Symbol('lubejs:relation');
export const keyKey = Symbol('lubejs:key');
export const connectionKey = Symbol('lubejs:connection');

function setContextOptions(
  target: DbContextConstructor,
  data: DbContextOptions
): void {
  let options: DbContextOptions = Reflect.getMetadata(
    contextOptionsKey,
    target
  );
  if (!options) {
    options = {};
    Reflect.defineMetadata(contextOptionsKey, options, target);
  }
  Object.assign(options, data);
}

function setEntityOptions(
  target: EntityConstructor,
  options: EntityOptions
): void {
  modelBuilder.decoratorEntity(target);
  let entityOptions: EntityOptions = Reflect.getMetadata(
    entityOptionsKey,
    target
  );
  if (!entityOptions) {
    entityOptions = {
      kind: 'TABLE',
    };
    modelBuilder.decoratorEntity(target);
    Reflect.defineMetadata(entityOptionsKey, entityOptions, target);
  }
  Object.assign(entityOptions, options);
}

function setKeyOptions(target: EntityConstructor, options: KeyOptions): void {
  let keyOptions: KeyOptions = Reflect.getMetadata(keyKey, target);
  if (!keyOptions) {
    keyOptions = {};
    Reflect.defineMetadata(keyKey, keyOptions, target);
  }
  Object.assign(keyOptions, options);
}


export function database(name: string): (constructor: DbContextConstructor) => void {
  return function(target: DbContextConstructor) {
    setContextOptions(target, {
      database: name
    })
  }
}

export function connection(connectionString: string): (constructor: DbContextConstructor) => void;
export function connection(config: ConnectOptions): (constructor: DbContextConstructor) => void;
export function connection(urlOrOptions: string | ConnectOptions): (constructor: DbContextConstructor) => void {
  return function(target: DbContextConstructor) {
    let connectionOptions: ConnectOptions;
    if (typeof urlOrOptions === 'string') {
      connectionOptions = parseConnectionUrl(urlOrOptions)
    } else {
      connectionOptions = urlOrOptions;
    }
    Reflect.defineMetadata(connectionKey, connectionOptions, target);
  }
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
): (target: EntityConstructor | DbContextConstructor | Object, key?: string) => void {
  return function (target: EntityConstructor | DbContextConstructor | Object, key?: string) {
    if (typeof target === 'function') {
      if (isExtendsOf(target, DbContext)) {
        setContextOptions(target as DbContextConstructor, {
          comment: msg
        })
      } else {
        setEntityOptions(target as EntityConstructor, {
          comment: msg,
        });
      }
    } else {
      setColumnOptions(target.constructor as EntityConstructor, key!, {
        comment: msg,
      });
    }
  };
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
  options: ColumnOptions
): void {
  let columnOptions: ColumnOptions | undefined = Reflect.getMetadata(
    columnKey,
    target
  );
  if (!columnOptions) {
    let columns: string[] = Reflect.getMetadata(columnsKey, target);
    if (!columns) {
      columns = [];
      Reflect.defineMetadata(columnsKey, columns, target);
    }
    const type = Reflect.getMetadata('design:type', target.prototype, key);
    columnOptions = {
      kind: 'COLUMN',
      type,
    };
    Reflect.defineMetadata(columnKey, columnOptions, target, key);
    columns.push(key);
  }
  Object.assign(columnOptions, options);
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
      generator: generator,
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
  type: DbType | ScalarType
): PropertyDecorator;
export function column<T extends Entity>(
  name: string,
  type: DbType | ScalarType
): PropertyDecorator;
export function column<T extends Entity>(
  nameOrType?: string | DbType | ScalarType,
  type?: DbType | ScalarType
): PropertyDecorator {
  return function (target: Object, key: string) {
    let name: string | undefined;
    if (!nameOrType) {
      name = key;
    } else if (typeof nameOrType === 'string') {
      name = nameOrType;
    } else {
      type = nameOrType;
      name = key;
    }
    if (name) {
      setColumnOptions(target.constructor as EntityConstructor, key, {
        columnName: name,
      });
    }
    if (type) {
      // 指定
      if (typeof type === 'function') {
        setColumnOptions(target.constructor as EntityConstructor, key, {
          type,
        });
      } else {
        setColumnOptions(target.constructor as EntityConstructor, key, {
          dbType: type,
        });
      }
    }
  };
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
