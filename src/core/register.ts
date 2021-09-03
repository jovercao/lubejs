import { DbProvider, DbProviderFactory } from './base/db-provider';

/**
 * 注册一个方言支持
 * @param driver 驱动可以是connect函数，亦可以是npm包或路径
 */
export async function register(
  name: string,
  driver: DbProviderFactory
): Promise<void> {
  if (dialects[name]) {
    throw new Error(`Driver ${name} is exists.`);
  }
  dialects[name] = driver();
}

export function getProvider(dialect: string): DbProvider {
  const provider = dialects[dialect];
  if (!provider) throw new Error(`Dialect ${dialect} is not register, please import provider module before use it.`)
  return provider;
}

const dialects: Record<string, DbProvider> = {};
