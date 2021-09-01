import { Connection, ConnectOptions } from '../core/base/connection';
import { loadConfig, prepareConnectOptions } from '../core/config';
import { connect } from '../core';
import { DbContext, DbContextConstructor } from './db-context';
import { metadataStore } from './metadata-store';

/**
 * 创建默认DbContext，其值为已注册的默认context类实例
 * 如未有注册Context则抛出异常
 */
export async function createContext(): Promise<DbContext>;
/**
 * 通过配置创建一个DbContext，其值为已注册的默认context类实例
 * 如未有注册Context则抛出异常
 */
export async function createContext(
  optOrCfgOrUrlOrLube?: ConnectOptions | string | Connection
): Promise<DbContext>;

export async function createContext<T extends DbContext>(
  Ctr: DbContextConstructor<T>,
  optOrCfgOrUrlOrLube?: Connection | ConnectOptions | string
): Promise<T>;

export async function createContext(
  optOrCfgOrUrlOrLubeOrCtr?:
    | DbContextConstructor
    | ConnectOptions
    | string
    | Connection,
  optOrCfgOrUrlOrLube?: ConnectOptions | string | Connection
): Promise<DbContext> {
  // if (typeof Ctr === 'function' && optOrUrlOrLube instanceof Lube) return Ctr(optOrUrlOrLube);
  let Ctr: DbContextConstructor;
  let lube: Connection;
  if (!optOrCfgOrUrlOrLubeOrCtr) {
    Ctr = metadataStore.defaultContext.class;
    const options = await getConnectOptions(Ctr);
    // if (!options) {
    //   throw new Error(`Context ${Ctr.name} 's config not found in configure file, pls configure it or provider options.`)
    // }
    lube = await connect(options);
  } else if (typeof optOrCfgOrUrlOrLubeOrCtr === 'function') {
    Ctr = optOrCfgOrUrlOrLubeOrCtr;
    if (!optOrCfgOrUrlOrLube) {
      const options = await getConnectOptions(Ctr);
      lube = await connect(options);
    } else if (optOrCfgOrUrlOrLube instanceof Connection) {
      lube = optOrCfgOrUrlOrLube;
    } else {
      const options = await getConnectOptions(optOrCfgOrUrlOrLube);
      lube = await connect(options);
    }
  } else if (optOrCfgOrUrlOrLubeOrCtr instanceof Connection) {
    Ctr = metadataStore.defaultContext.class;
    lube = optOrCfgOrUrlOrLubeOrCtr;
  } else {
    Ctr = metadataStore.defaultContext.class;
    const options = await getConnectOptions(optOrCfgOrUrlOrLubeOrCtr);
    lube = await connect(options);
  }

  return new Ctr(lube);
}


async function getConnectOptions(
  opt?: ConnectOptions | string | DbContextConstructor
): Promise<ConnectOptions> {
  let options: ConnectOptions | undefined;

  if (typeof opt === 'function') {
    const config = await loadConfig();
    options = config.configures[opt.name];
    if (!options) {
      options = metadataStore.getContext(opt).connection;
    }
    if (!options) {
      throw new Error(`Option ${opt.name} not found in configure file.`);
    }
  } else {
    options = await prepareConnectOptions(opt);
  }
  return options;
}
