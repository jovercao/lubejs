import { existsSync } from "fs";
import { join } from "path";
import { URL } from "url";
import { ConnectOptions } from "./base/connection";
import { getProvider } from "./register";
import { assignIfUndefined } from "../util";

const OPTIONS_FILE = '.lubejs';

export interface LubeConfig {
  default: string;
  configures: {
    [key: string]: ConnectOptions;
  };
  migrateDir: string;
}

export async function loadConfig(): Promise<LubeConfig> {
  let configFile = join(process.cwd(), OPTIONS_FILE);
  if (existsSync(configFile + '.js')) {
    configFile = configFile + '.js';
  } else if (existsSync(configFile + '.ts')) {
    configFile = configFile + '.ts';
  } else {
    throw new Error(`Configure file '.lubejs(.ts|.js)' not found in dir ${process.cwd()}, use 'lube init' to create it.`)
  }
  let config: LubeConfig;
  try {
    const imported = await import(configFile);
    config = imported?.default ?? imported;
  } catch (error) {
    throw new Error(`Occur error at load configure ${configFile}, error info: ${error}`);
  }
  return config;
}

export function parseConnectionUrl(url: string): ConnectOptions {
  const uri = new URL(url);
  const params = uri.searchParams;
  const urlOptions: Record<string, string> = {};
  for (const [key, value] of params.entries()) {
    if (value !== undefined) {
      urlOptions[key] = value;
    }
  }
  const dialect = uri.protocol.substr(0, uri.protocol.length - 1).toLowerCase();
  const paths = uri.pathname.split('/');
  let database: string | undefined;
  if (!paths[0]) {
    database = paths[1]
  } else {
    database = paths[0]
  }
  if (!database) {
    throw new Error('Database must specify.')
  }
  const options = {
    dialect,
    host: uri.host,
    port: uri.port ? parseInt(uri.port) : undefined,
    user: uri.username,
    password: uri.password,
    database,
    ...urlOptions,
  };
  return options;
}


const DEFAULT_CONNECT_OPTIONS: Partial<ConnectOptions> = {
  connectionTimeout: 30,
  requestTimeout: 10 * 60,
  // minConnections: 0,
  // maxConnections: 5,
};


/**
 * 准备连接选项
 */
export async function prepareConnectOptions(
  optOrUrlOrCfg?: ConnectOptions | string
): Promise<ConnectOptions> {
  let options: ConnectOptions;
  if (!optOrUrlOrCfg) {
    const config = await loadConfig()
    options = config.configures[config.default];
    if (!options) {
      throw new Error(`Default connection options not found on config file.`)
    }
  } else if (typeof optOrUrlOrCfg === 'string') {
    options = parseConnectionUrl(optOrUrlOrCfg);
  } else {
    options = optOrUrlOrCfg;
  }
  if (!options.provider) {
    if (!options.dialect) {
      throw new Error('ConnectOptions must provide one of dialect or dirver');
    }
    const provider = getProvider(options.dialect);
    if (!provider) {
      throw new Error(`Unregister dialect ${options.dialect}.`);
    }
    options.provider = provider;
  }
  if (!options.dialect) {
    options.dialect = options.provider!.dialect;
  }
  assignIfUndefined(options, DEFAULT_CONNECT_OPTIONS);
  return options;
}
