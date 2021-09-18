import { EventEmitter } from 'events';
import { Connection } from '../core';
import { Queryable } from './queryable';
import {
  DeleteOptions,
  FetchOptions,
  Repository,
  SaveOptions,
} from './repository';
import { DbContextMetadata } from './metadata';
import {
  Entity,
  EntityConstructor,
  EntityInstance,
  EntityKeyType,
} from './entity';
import { DbContextEventHandler, DbEvents } from './types';
import { metadataStore } from './metadata-store';
import { EntityMgr } from './entity-mgr';

export class DbContext {
  constructor(public readonly connection: Connection) {
    this.metadata = metadataStore.getContext(
      this.constructor as DbContextConstructor
    );
  }

  private _emitter: EventEmitter = new EventEmitter();
  private _metadata!: DbContextMetadata;

  public get metadata(): DbContextMetadata {
    return this._metadata;
  }

  protected set metadata(value: DbContextMetadata) {
    this._metadata = value;
  }

  private _repositories?: Map<Entity, Repository<any>>;

  // 为节省内存，Repository 使用共享对象
  private get repositories(): Map<Entity, Repository<any>> {
    if (!this._repositories) {
      this._repositories = new Map();
    }
    return this._repositories;
  }


  private _mgrs?: Map<Entity, EntityMgr<any>>;

  // 为节省内存，Repository 使用共享对象
  private get mgrs(): Map<Entity, EntityMgr<any>> {
    if (!this._mgrs) {
      this._mgrs = new Map();
    }
    return this._mgrs;
  }


  /**
   * 获取一个可查询对象
   */
  getRepository<T extends Entity>(Entity: EntityConstructor<T>): Repository<T> {
    if (!this.repositories.get(Entity)) {
      const repo = new Repository(this, Entity);
      repo.on('all', (event: DbEvents, items: T[]) => {
        this._emit(event, Entity, items);
      });
      this.repositories.set(Entity, repo);
    }
    return this.repositories.get(Entity)!;
  }

  /**
   * 获取一个仓储库对象
   */
  getQueryable<T extends Entity>(Entity: EntityConstructor<T>): Queryable<T> {
    return new Queryable<T>(this, Entity as any);
  }

  /**
   * 内部方法，请不要使用
   */
  getMgr<T extends Entity>(Entity: EntityConstructor<T>): EntityMgr<T> {
    let mgr = this.mgrs.get(Entity);
    if (!mgr) {
      mgr = new EntityMgr(Entity, this);
      this.mgrs.set(Entity, mgr);
    }
    return mgr;
  }

  get<T extends Entity>(
    Entity: EntityConstructor<T>,
    key: EntityKeyType,
    options?: FetchOptions<T>
  ): Promise<EntityInstance<T> | undefined> {
    return this.getRepository(Entity).get(key, options);
  }

  insert<T extends Entity>(
    Entity: EntityConstructor<T>,
    items: T | T[],
    options?: SaveOptions<T>
  ): Promise<void>;
  insert<T extends Entity>(
    items: EntityInstance<T> | EntityInstance<T>[],
    options?: SaveOptions<T>
  ): Promise<void>;
  insert<T extends Entity>(...args: any[]): Promise<void> {
    let Entity: EntityConstructor<T>;
    let items: T | T[];
    let options: SaveOptions<T>;
    if (args.length === 1) {
      items = args[0];
      if (Array.isArray(args[0])) {
        Entity = args[0][0].constructor;
      } else {
        Entity = args[0].constructor;
      }
      options = args[1];
    } else {
      Entity = args[0];
      items = args[1];
      options = args[2];
    }
    return this.getRepository(Entity).insert(items, options);
  }

  update<T extends Entity>(
    Entity: EntityConstructor<T>,
    items: T | T[],
    options?: SaveOptions<T>
  ): Promise<void>;
  update<T extends Entity>(
    items: EntityInstance<T> | EntityInstance<T>[],
    options?: SaveOptions<T>
  ): Promise<void>;
  update<T extends Entity>(...args: any[]): Promise<void> {
    let Entity: EntityConstructor<T>;
    let items: T | T[];
    let options: SaveOptions<T>;
    if (args.length === 1) {
      items = args[0];
      if (Array.isArray(args[0])) {
        Entity = args[0][0].constructor;
      } else {
        Entity = args[0].constructor;
      }
      options = args[1];
    } else {
      Entity = args[0];
      items = args[1];
      options = args[2];
    }
    return this.getRepository(Entity).update(items, options);
  }

  delete<T extends Entity>(
    Entity: EntityConstructor<T>,
    items: T | T[],
    options?: DeleteOptions
  ): Promise<void>;
  delete<T extends Entity>(
    items: EntityInstance<T> | EntityInstance<T>[],
    options?: DeleteOptions
  ): Promise<void>;
  delete<T extends Entity>(...args: any[]): Promise<void> {
    let Entity: EntityConstructor<T>;
    let items: T | T[];
    let options: DeleteOptions;
    if (args.length === 1) {
      items = args[0];
      if (Array.isArray(args[0])) {
        Entity = args[0][0].constructor;
      } else {
        Entity = args[0].constructor;
      }
      options = args[1];
    } else {
      Entity = args[0];
      items = args[1];
      options = args[2];
    }
    return this.getRepository(Entity).delete(items, options);
  }

  save<T extends Entity>(
    Entity: EntityConstructor<T>,
    items: T | T[],
    options?: SaveOptions<T>
  ): Promise<void>;
  save<T extends Entity>(
    items: EntityInstance<T> | EntityInstance<T>[],
    options?: SaveOptions<T>
  ): Promise<void>;
  save<T extends Entity>(...args: any[]): Promise<void> {
    let Entity: EntityConstructor<T>;
    let items: T | T[];
    let options: SaveOptions<T>;
    if (args.length === 1) {
      items = args[0];
      if (Array.isArray(args[0])) {
        Entity = args[0][0].constructor;
      } else {
        Entity = args[0].constructor;
      }
      options = args[1];
    } else {
      Entity = args[0];
      items = args[1];
      options = args[2];
    }
    return this.getRepository(Entity).save(items, options);
  }

  /**
   * 数据提交事件
   */
  public on(event: 'save', handler: DbContextEventHandler): this;
  public on(event: 'insert', handler: DbContextEventHandler): this;
  public on(event: 'update', handler: DbContextEventHandler): this;
  public on(event: 'delete', handler: DbContextEventHandler): this;
  public on(event: 'saved', handler: DbContextEventHandler): this;
  public on(event: 'inserted', handler: DbContextEventHandler): this;
  public on(event: 'updated', handler: DbContextEventHandler): this;
  public on(event: 'deleted', handler: DbContextEventHandler): this;
  public on(
    event: 'all',
    handler: (event: DbEvents, Entity: Entity, items: Entity[]) => void
  ): this;
  public on(event: string, handler: (...args: any) => void): this {
    //  this._emmiter.on(event, handler);

    return this;
  }

  private _emit(event: DbEvents, Entity: Entity, items: Entity[]): void {
    this._emitter.emit(event, Entity, items);
    this._emitter.emit('all', Entity, items);
  }

  public off(event: 'save', handler?: DbContextEventHandler): this;
  public off(event: 'insert', handler?: DbContextEventHandler): this;
  public off(event: 'update', handler?: DbContextEventHandler): this;
  public off(event: 'delete', handler?: DbContextEventHandler): this;
  public off(event: 'saved', handler: DbContextEventHandler): this;
  public off(event: 'inserted', handler: DbContextEventHandler): this;
  public off(event: 'updated', handler: DbContextEventHandler): this;
  public off(event: 'deleted', handler: DbContextEventHandler): this;
  public off(
    event: 'all',
    handler: (Entity: Entity, event: DbEvents, items: Entity[]) => void
  ): this;
  public off(event: string, handler?: (...args: any) => void): this {
    if (!handler) {
      this._emitter.removeAllListeners(event);
    } else {
      this._emitter.off(event, handler);
    }
    return this;
  }

  async dispose(): Promise<void> {
    if (this.connection.opened) {
      await this.connection.close();
    }
  }
}

export interface DbContextConstructor<T extends DbContext = DbContext> {
  new (lube: Connection): T;
}

/**
 * 数据库上下文对象
 */
