import { LubeConfig, modelBuilder } from 'lubejs';
import driver from 'lubejs-mssql';
// import './orm'
import './orm-decorator';

modelBuilder.ready();

export const config: LubeConfig = {
  default: 'DB',
  migrateDir: 'migrates',
  configures: {
    _DB: {
      driver,
      host: 'jover.wicp.net',
      user: 'sa',
      password: '!crgd-2019',
      database: 'Test',
      port: 2433,
    },
    DB: {
      driver,
      host: 'rancher.vm',
      user: 'sa',
      password: '!crgd-2021',
      database: 'Test',
      port: 1433,
    },
  },
};

export default config;
