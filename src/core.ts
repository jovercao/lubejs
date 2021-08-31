import { Connection, ConnectOptions } from './base/connection';
import { DbProvider } from './base/db-provider';
import { prepareConnectOptions } from './config';

/**
 * 仅核心功能包，不包括ORM内容
 */
export * from './ast';
export * from './sql-builder';
export * from './ast'
export * from './base/connection'
export * from './base/db-provider'
export * from './base/executor'
export * from './base/sql-util'
export * from './base/transaction'
export * from './base/types'
export * from './register'

/**
 * 连接数据库并返回一个连接池
 * @param {*} config
 */
export async function connect(cfgOrUrl?: string): Promise<Connection>;
export async function connect(options: ConnectOptions): Promise<Connection>;
export async function connect(
  optOrUrlOrCfg?: ConnectOptions | string
): Promise<Connection>;
export async function connect(
  optOrUrlOrCfg?: ConnectOptions | string
): Promise<Connection> {
  const options = await prepareConnectOptions(optOrUrlOrCfg);
  const provider: DbProvider = options.driver!(options);
  const lube = new Connection(provider);
  // await lube.open();
  return lube;
}
