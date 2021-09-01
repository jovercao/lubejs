import { assert } from 'console';
import { Select } from '../../core';
import { DbContext, DbContextConstructor } from '../db-context';
import { Entity, EntityConstructor } from '../entity';
import { CommonEntityMetadata, KeyMetadata } from '../metadata';
import { IndexOptions } from './index-decorator';
import 'reflect-metadata'

const ENTITY_KEY = Symbol('lubejs:entity');
const ENTITY_COLUMNS_KEY = Symbol('lubejs:entity:columns');
const ENTITY_RELATIONS_KEY = Symbol('lubejs:entity:relations');
const ENTITY_KEY_KEY = Symbol('lubejs:entity:key');
const ENTITY_INDEXES_KEY = Symbol('lubejs:entity:indexes');
const DECORATE_ENTITIES_KEY = Symbol('lubejs:decorate:entities');

export interface EntityOptions
  extends Partial<
    Pick<
      CommonEntityMetadata,
      'kind' | 'body' | 'dbName' | 'sql' | 'readonly'
      // | 'comment'
    >
  > {
  contextGetter?: () => DbContextConstructor;
  indexes: IndexOptions[];
}

export function setEntityOptions(
  target: EntityConstructor,
  options: Partial<EntityOptions>
): void {
  let entityOptions = getEntityOptions(target);
  if (!entityOptions) {
    entityOptions = {
      kind: 'TABLE',
      indexes: [],
    };
    Reflect.defineMetadata(ENTITY_KEY, entityOptions, target);
  }
  Object.assign(entityOptions, options);
}

export function getEntityOptions(
  target: EntityConstructor
): EntityOptions | undefined {
  return Reflect.getMetadata(ENTITY_KEY, target);
}

export function getDecorateEntities(): EntityConstructor[] | undefined {
  return Reflect.getMetadata(DECORATE_ENTITIES_KEY, DbContext);
}

export function getEntityColumns(
  target: EntityConstructor
): string[] | undefined {
  return Reflect.getMetadata(ENTITY_COLUMNS_KEY, target);
}

export function getEntityIndexs(
  target: EntityConstructor
): string[] | undefined {
  return Reflect.getMetadata(ENTITY_INDEXES_KEY, target);
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

export function addEntitiyColumn(target: EntityConstructor, key: string): void {
  let columns = getEntityColumns(target);
  const relations = getEntityRelations(target);
  if (!columns) {
    columns = [];
    Reflect.defineMetadata(ENTITY_COLUMNS_KEY, columns, target);
  }
  if (columns.includes(key) || relations?.includes(key)) {
    throw new Error(
      'Column or relation is allowed decorate once only on property.'
    );
  }
  columns.push(key);
}

export function addEntitiyIndex(target: EntityConstructor, key: string): void {
  let indexs = getEntityIndexs(target);
  const relations = getEntityRelations(target);
  if (!indexs) {
    indexs = [];
    Reflect.defineMetadata(ENTITY_INDEXES_KEY, indexs, target);
  }
  if (indexs.includes(key)) {
    throw new Error(
      'Index or relation is allowed decorate once only on property.'
    );
  }
  indexs.push(key);
}

export function addEntitiyRelation(
  target: EntityConstructor,
  key: string
): void {
  assert(typeof key === 'string', 'Relation property key must typeof string');
  let relations = getEntityRelations(target);
  const columns = getEntityColumns(target);
  if (!relations) {
    relations = [];
    Reflect.defineMetadata(ENTITY_RELATIONS_KEY, relations, target);
  }
  if (relations.includes(key) || columns?.includes(key)) {
    throw new Error(
      'Column or relation is allowed decorate once only on property.'
    );
  }
  relations.push(key);
}

export function addDecorateEntities(ctr: EntityConstructor): void {
  let ctrs = getDecorateEntities();
  if (!ctrs) {
    ctrs = [];
    Reflect.defineMetadata(DECORATE_ENTITIES_KEY, ctrs, DbContext);
  }
  if (!ctrs.includes(ctr)) {
    ctrs.push(ctr);
  }
}

export type KeyOptions = Partial<KeyMetadata>;

function setKeyOptions(target: EntityConstructor, options: KeyOptions): void {
  let keyOptions = getEntityKeyOptions(target);
  if (!keyOptions) {
    keyOptions = {};
    Reflect.defineMetadata(ENTITY_KEY_KEY, keyOptions, target);
  }
  Object.assign(keyOptions, options);
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

export function query<T extends Entity>(
  sql: Select<T>
): (constructor: EntityConstructor<T>) => void {
  return function (target: EntityConstructor<T>): void {
    addDecorateEntities(target);
    setEntityOptions(target, {
      kind: 'QUERY',
      sql,
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
    addDecorateEntities(target);
    setEntityOptions(target, {
      kind: 'TABLE',
      dbName: name || target.name,
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
    addDecorateEntities(target);
    setEntityOptions(target, {
      kind: 'VIEW',
      dbName: name,
      body: body!(),
    });
  };
}
