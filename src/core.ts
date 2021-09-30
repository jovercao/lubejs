import { Connection, ConnectOptions } from './core/base/connection';
import { DbProvider } from './core/base/db-provider';
import { prepareConnectOptions } from './core/config';

/**
 * 仅核心功能包，不包括ORM内容
 */
export * from './core/sql';
export * from './core/base/connection';
export * from './core/base/db-provider';
export * from './core/base/executor';
export * from './core/base/sql-util';
export * from './core/base/types';
export * from './core/register';
export { loadConfig } from './core/config';
/**
 * 连接数据库并返回一个连接池
 * @param {*} config
 */
export async function createConnection(cfgOrUrl?: string): Promise<Connection>;
export async function createConnection(options: ConnectOptions): Promise<Connection>;
export async function createConnection(
  optOrUrlOrCfg?: ConnectOptions | string
): Promise<Connection>;
export async function createConnection(
  optOrUrlOrCfg?: ConnectOptions | string
): Promise<Connection> {
  const options = await prepareConnectOptions(optOrUrlOrCfg);
  return options.provider!.getConnection(options);
}
