import { Connection, ConnectOptions } from './connection';
import { SqlUtil } from './sql-util';

/**
 * 数据库提供驱动程序
 */
export interface DbProvider {
  readonly sqlUtil: SqlUtil;
  connection(config: ConnectOptions): Connection;
  /**
   * 方言名称，如'mssql', 'mysql', 'oracle'
   */
  readonly dialect: string;
}

/**
 * 驱动程序函数
 * 实际上为一个工厂函数，通过实现该方法来扩展驱动支持
 */
export interface DbProviderFactory {
  (): DbProvider;
}
