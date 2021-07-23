import { LubeConfig, modelBuilder } from 'lubejs';
import driver from 'lubejs-mssql';
// import './orm'
import './orm-decorators';

modelBuilder.ready();

export const config: LubeConfig = {
  default: 'DB',
  migrateDir: 'migrates',
  configures: {
    DB: {
      driver,
      host: 'jover.wicp.net',
      user: 'sa',
      password: '!crgd-2019',
      database: 'Test',
      port: 2433,
    },
  },
};

export default config;
