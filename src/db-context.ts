import { Executor } from './execute'
import { connect, ConnectOptions, DbProvider, Lube } from './lube'
import { Constructor, Entity } from './types'
import { Queryable } from './queryable'
import { Repository } from './repository'
import { outputCommand } from './util'

export class DbInstance {
  constructor (executor: Executor) {
    this.executor = executor
    // this.executor.on('command', outputCommand);
  }

  readonly executor: Executor

  /**
   * 获取一个可查询对象
   */
  getRepository<T extends Entity> (ctr: Constructor<T>): Repository<T> {
    // INFO 取消检查，以适应更多多场景
    // const metadata = metadataStore.getEntity(ctr)
    // if (metadata.contextClass !== this.constructor) {
    //   throw new Error(`Repostory ${ctr.name} is not belong of DbContext ${this.constructor.name}`)
    // }
    return new Repository(this.executor, ctr)
  }

  /**
   * 获取一个仓储库对象
   */
  getQueryable<T extends Entity> (ctr: Constructor<T>): Queryable<T> {
    return new Queryable<T>(this.executor, ctr)
  }
}

/**
 * 数据库上下文对象
 */
export class DbContext extends DbInstance {
  constructor (public readonly lube: Lube) {
    super(lube)
  }

  /**
   * 开启一个事务
   */
  async trans<T>(handler: (instance: DbInstance, abort: () => Promise<void>) => Promise<T>): Promise<T> {
    return this.lube.trans((executor, abort) => {
      const instance = new DbInstance(executor)
      return handler(instance, abort)
    })
  }

  static async create<T extends DbContext>(Context: Constructor<T>, options: ConnectOptions): Promise<T> {
    const lube = await connect(options);
    return new Context(lube);
  }
}
