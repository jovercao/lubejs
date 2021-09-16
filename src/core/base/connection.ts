import { SQL } from '../sql';
import { DbProvider } from './db-provider';
import { Executor } from './executor';
import { SqlUtil } from './sql-util';

/**
 * 事务隔离级别
 */
export enum ISOLATION_LEVEL {
  READ_COMMIT = 'READ_COMMIT',
  READ_UNCOMMIT = 'READ_UNCOMMIT',
  REPEATABLE_READ = 'REPEATABLE_READ',
  SERIALIZABLE = 'SERIALIZABLE',
  SNAPSHOT = 'SNAPSHOT',
}

export class AbortError extends Error {
  code: string = 'ABORT';
}

abstract class ConnectionClass extends Executor {
  constructor(public provider: DbProvider, public readonly options: ConnectOptions) {
    super();
  }

  get sqlUtil(): SqlUtil {
    return this.provider.sqlUtil;
  }

  /**
   * 开启一个事务并在代码执行完成后自动提交，遇到错误时会自动回滚
   * 用户亦可主动调用cancel来取消当前事务，并且产生一个异常中断后续代码执行
   */
  async trans<T>(
    handler: (abort: (message?: string) => void) => Promise<T>,
    isolationLevel: ISOLATION_LEVEL = ISOLATION_LEVEL.READ_COMMIT
  ): Promise<T> {
    if (this.inTransaction) {
      throw new Error('is in transaction now');
    }
    try {
      await this.beginTrans(isolationLevel);
      const res = await handler((message: string) => {
        throw new AbortError(message || 'Abort.');
      });
      await this.commit();
      return res;
    } catch (ex) {
      if (this.inTransaction) {
        await this.rollback();
      }
      throw ex;
    }
  }

  abstract beginTrans(isolationLevel: ISOLATION_LEVEL): Promise<void>;

  abstract commit(): Promise<void>;

  abstract rollback(): Promise<void>;

  abstract readonly opened: boolean;

  abstract open(): Promise<void>;

  abstract close(): Promise<void>;

  abstract readonly inTransaction: boolean;

  /**
   * 获取当前数据库
   */
  async getDatabaseName(): Promise<string> {
    return (await this.queryScalar(SQL.select(SQL.std.currentDatabase())))!;
  }

  /**
   * 获取当前默认架构
   * @returns
   */
  async getSchemaName(): Promise<string> {
    return (await this.queryScalar(SQL.select(SQL.std.defaultSchema())))!;
  }

  /**
   * 变更所在数据库
   * 当为null时表示登录用户默认数据库
   */
  async changeDatabase(name: string): Promise<void> {
    await this.query(SQL.use(name));
  }
}

export type ConnectionConstructor = typeof ConnectionClass;

export const Connection: ConnectionConstructor = ConnectionClass;

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface Connection extends ConnectionClass {}

export type ConnectOptions = {
  /**
   * 数据库方言(必须是已注册的)，与driver二选一，必须安装相应的驱动才可正常使用
   */
  dialect?: string;
  /**
   * 驱动程序，与dialect二选一，优先使用driver
   */
  provider?: DbProvider;

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

  /**
   * 连接超时时长，单位: ms，默认为15000ms
   */
  connectionTimeout?: number;
  /**
   * 单个查询超时时长,单位: ms，默认为15000ms
   */
  requestTimeout?: number;
};
