import { Parameter } from "../ast/expression/parameter";
import { Connection, ConnectOptions } from "./connection";
import { SqlUtil } from "./sql-util";
import { ISOLATION_LEVEL, Transaction } from "./transaction";
import { QueryResult } from "./types";

/**
 * 数据库提供驱动程序
 */
 export interface DbProvider {
  /**
   * lube对象
   */
  lube: Connection;
  readonly options: ConnectOptions;
  readonly sqlUtil: SqlUtil;
  query(sql: string, params?: Parameter[]): Promise<QueryResult<any, any, any>>;
  beginTrans(isolationLevel: ISOLATION_LEVEL): Promise<Transaction>;
  /**
   * 重新选择数据库
   * 注意：如果数据连接已经打开，则此操作会重新连接数据库。
   * @param database
   */
  changeDatabase(database: string | null): void;
  open(): Promise<void>;
  close(): Promise<void>;
  readonly opened: boolean;

  /**
   * 方言名称，如'mssql', 'mysql', 'oracle'
   */
  readonly dialect: string;

  /**
   * 获取当前连接的数据库名称
   */
  getCurrentDatabase(): Promise<string>;

  /**
   * 获取当前连接的默认架构
   */
   getDefaultSchema(database?: string): Promise<string>;
}

/**
 * 驱动程序函数
 * 实际上为一个工厂函数，通过实现该方法来扩展驱动支持
 */
 export interface DbProviderFactory {
  (config: ConnectOptions): DbProvider;
}
