import { DIALECT, MssqlProvider } from './provider';
import { Driver, DbProvider, register } from 'lubejs';
import { MssqlConnectOptions } from './types'



/**
 * 连接数据库并返回含数据库连接池的Provider
 * @param config 连接选项
 */
export const driver: Driver = function (
  options: MssqlConnectOptions
): DbProvider {
  return new MssqlProvider(options);
};

export default driver;

export * from './build-in';

export { DIALECT } from './provider';

register(DIALECT, driver);
