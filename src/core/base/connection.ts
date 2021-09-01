import { DbProvider, DbProviderFactory } from "./db-provider";
import { Executor } from "./executor";
import { SqlOptions } from "./sql-util";
import { ISOLATION_LEVEL, TransactionHandler } from "./transaction";

export class Connection extends Executor {
  public readonly provider: DbProvider;

  constructor(provider: DbProvider) {
    const sqlUtil = provider.sqlUtil;
    super(provider.query.bind(provider), sqlUtil);
    this.provider = provider;
    this.provider.lube = this;
  }

  /**
   * 开启一个事务并自动提交
   * @param {*} handler (exeutor, cancel) => false
   * @param {*} isolationLevel 事务隔离级别
   */
  async trans<T>(
    handler: TransactionHandler<T>,
    isolationLevel: ISOLATION_LEVEL = ISOLATION_LEVEL.READ_COMMIT
  ): Promise<T> {
    if (this.isTrans) {
      throw new Error('is in transaction now');
    }
    let canceled = false;
    const { query, commit, rollback } = await this.provider.beginTrans(
      isolationLevel
    );
    const executor = new Executor(query, this.sqlUtil, true);
    const abort = async () => {
      canceled = true;
      await rollback();
      executor.emit('rollback', executor);
    };
    const complete = async () => {
      await commit();
      executor.emit('commit', executor);
    };
    executor.on('command', cmd => this._emitter.emit('command', cmd));
    executor.on('error', cmd => this._emitter.emit('error', cmd));
    try {
      const res = await handler(executor, abort);
      if (!canceled) {
        await complete();
      }
      return res;
    } catch (ex) {
      // HACK: 本该写在mssql库中的，但是由于这是mssql库的bug只能写在这里
      if (ex?.code === 'EREQINPROG') {
        throw new Error(`mssql driver error.`);
      }
      if (!canceled) {
        await abort();
      }
      throw ex;
    }
  }

  get opened() {
    return this.provider.opened;
  }

  getCurrentDatabase(): Promise<string> {
    return this.provider.getCurrentDatabase();
  }

  /**
   * 变更所在数据库
   * 当为null时表示登录用户默认数据库
   */
  changeDatabase(database: string | null): void {
    return this.provider.changeDatabase(database);
  }

  open(): Promise<void> {
    return this.provider.open();
  }

  close(): Promise<void> {
    return this.provider.close();
  }
}
export type ConnectOptions = {
  /**
   * 数据库方言(必须是已注册的言)，与driver二选一，必须安装相应的驱动才可正常使用
   */
  dialect?: string;
  /**
   * 驱动程序，与dialect二选一，优先使用driver
   */
  driver?: DbProviderFactory;
  /**
   * 主机名
   */
  host: string;
  /**
   * 端口号
   */
  port?: number;
  /**
   * 连接用户名
   */
  user: string;
  /**
   * 密码
   */
  password: string;
  /**
   * 数据库名称
   */
  database?: string;
  // /**
  //  * 连接池最大连接数，单位为秒，默认为5
  //  */
  // maxConnections?: number;
  // /**
  //  * 连接池最小连接数，默认为1
  //  */
  // minConnections?: number;
  // /**
  //  * 回收未使用的连接等待时长，单位: ms，默认为30000ms
  //  */
  // recoveryConnection?: number;
  /**
   * 连接超时时长，单位: ms，默认为15000ms
   */
  connectionTimeout?: number;
  /**
   * 单个查询超时时长,单位: ms，默认为15000ms
   */
  requestTimeout?: number;
  /**
   * 编译选项
   */
  sqlOptions?: SqlOptions;
};

