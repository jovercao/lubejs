import { Entity, EntityConstructor } from '../entity';
import { ConnectOptions } from '../../core';
import { parseConnectionUrl } from '../../core/config';
import { setEntityOptions } from './entity';
import { DbContextMetadata } from '../metadata';
import { DbContext, DbContextConstructor } from '../db-context';
import 'reflect-metadata'

const CONTEXT_KEY = Symbol('lubejs:context');
const CONNECTION_KEY = Symbol('lubejs:connection');
const DECORATE_CONTEXTS_KEY = Symbol('lubejs:decorate:contexts');
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

export function getContextOptions(
  target: DbContextConstructor
): DbContextOptions | undefined {
  return Reflect.getMetadata(CONTEXT_KEY, target);
}

export function getDecorateContexts(): DbContextConstructor[] | undefined {
  return Reflect.getMetadata(DECORATE_CONTEXTS_KEY, DbContext);
}

export function getConnectionOptions(
  target: DbContextConstructor
): ConnectOptions | undefined {
  return Reflect.getMetadata(CONNECTION_KEY, target);
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

export function database(
  name: string
): (constructor: DbContextConstructor) => void {
  return function (target: DbContextConstructor) {
    setContextOptions(target, {
      database: name,
    });
  };
}
