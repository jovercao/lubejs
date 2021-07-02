import { Executor } from './execute';
import { Lube } from './lube';
import {
  Constructor,
  DbContextEventHandler,
  DbEvents,
  Entity,
  EntityKeyType,
} from './types';
import { Queryable } from './queryable';
import { Repository } from './repository';
import { EventEmitter } from 'stream';
import { DbContextMetadata, metadataStore } from './metadata';

export class DbInstance {
  constructor(executor: Executor) {
    this.executor = executor;
    this.metadata = metadataStore.getContext(
      this.constructor as DbContextConstructor
    );
    // this.executor.on('command', outputCommand);
  }

  private _emitter: EventEmitter = new EventEmitter();

  readonly executor: Executor;

  private metadata: DbContextMetadata;

  // 为节省内存，Repository 使用共享对象
  private _repositories: Map<Entity, Repository<any>> = new Map();

  /**
   * 获取一个可查询对象
   */
  getRepository<T extends Entity>(Entity: Constructor<T>): Repository<T> {
    // INFO 取消检查，以适应更多多场景
    // const metadata = metadataStore.getEntity(ctr)
    // if (metadata.contextClass !== this.constructor) {
    //   throw new Error(`Repostory ${ctr.name} is not belong of DbContext ${this.constructor.name}`)
    // }
    const entityMetadata = this.metadata.getEntity(Entity);

    if (!entityMetadata) {
      throw new Error(
        `Entity '${Entity.name}' is not of context '${this.constructor.name}' or unregister.`
      );
    }

    if (!this._repositories.get(Entity)) {
      const repo = new Repository(this, Entity);
      repo.on('all', (event: DbEvents, items: T[]) => {
        this._emit(event, Entity, items);
      });
      this._repositories.set(Entity, repo);
    }
    return this._repositories.get(Entity);
  }

  /**
   * 获取一个仓储库对象
   */
  getQueryable<T extends Entity>(Entity: Constructor<T>): Queryable<T> {
    return new Queryable<T>(this, Entity);
  }

  get<T extends Entity>(
    Entity: Constructor<T>,
    key: EntityKeyType
  ): Promise<T> {
    return this.getRepository(Entity).get(key);
  }

  insert<T extends Entity>(
    Entity: Constructor<T>,
    items: T | T[]
  ): Promise<void> {
    return this.getRepository(Entity).insert(items);
  }

  update<T extends Entity>(
    Entity: Constructor<T>,
    items: T | T[]
  ): Promise<void> {
    return this.getRepository(Entity).update(items);
  }

  delete<T extends Entity>(
    Entity: Constructor<T>,
    items: EntityKeyType | T | T[]
  ): Promise<void> {
    return this.getRepository(Entity).delete(items);
  }

  /**
   * 数据提交事件
   */
  public on(event: 'submit', handler: DbContextEventHandler): this;
  public on(event: 'insert', handler: DbContextEventHandler): this;
  public on(event: 'update', handler: DbContextEventHandler): this;
  public on(event: 'delete', handler: DbContextEventHandler): this;
  public on(event: 'submited', handler: DbContextEventHandler): this;
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

  public off(event: 'submit', handler?: DbContextEventHandler): this;
  public off(event: 'insert', handler?: DbContextEventHandler): this;
  public off(event: 'update', handler?: DbContextEventHandler): this;
  public off(event: 'delete', handler?: DbContextEventHandler): this;
  public off(event: 'submited', handler: DbContextEventHandler): this;
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
}

export interface EntityConstructor<T extends Entity = Entity> {
  new (...args: any): T;
}

export interface DbContextConstructor<T extends DbContext = DbContext> {
  new (lube: Lube): T;
}

/**
 * 数据库上下文对象
 */
export class DbContext extends DbInstance {
  constructor(public readonly lube: Lube) {
    super(lube);
  }

  /**
   * 开启一个事务
   */
  async trans<T>(
    handler: (instance: DbInstance, abort: () => Promise<void>) => Promise<T>
  ): Promise<T> {
    return this.lube.trans((executor, abort) => {
      const instance = new DbInstance(executor);
      return handler(instance, abort);
    });
  }

  // static async create<T extends DbContext>(Context: DbContextConstructor<T>, options: ConnectOptions): Promise<T> {
  //   const lube = await connect(options);
  //   return new Context(lube);
  // }
}
