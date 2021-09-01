import { DbProviderFactory } from "./base/db-provider";

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
  dialects[name] = driver;
}


export const dialects: Record<string, DbProviderFactory> = {};
