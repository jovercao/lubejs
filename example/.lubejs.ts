import { DbContext, LubeConfig } from 'lubejs';
import driver from 'lubejs-mssql';
import { DB } from './orm';

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
