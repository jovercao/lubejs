import { DbContext } from '../src/db-context';
import { LubeConfig } from '../src/migrate-cli';
import { DB } from './orm';
import driver from '../src/drivers/mssql';

export const config: LubeConfig = {
  default: 'default',
  migrateDir: 'migrates',
  contexts: {
    default: () => {
      return DbContext.create(DB, {
        driver,
        host: 'jover.wicp.net',
        user: 'sa',
        password: '!crgd-2019',
        database: 'TEST',
        port: 2433
      });
    },
  },
};

export default config;
