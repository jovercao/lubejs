import { LubeConfig } from 'lubejs';
import 'lubejs-mssql';
// import './orm-configure'
import 'orm';

export const config: LubeConfig = {
  default: 'DB',
  migrateDir: 'migrates',
  configures: {
    DB: {
      dialect: 'mssql',
      host: 'jover.wicp.net',
      user: 'sa',
      password: '!crgd-2019',
      database: 'Test',
      port: 2433,
    },
    _DB: {
      dialect: 'mssql',
      host: 'rancher.vm',
      user: 'sa',
      password: '!crgd-2021',
      database: 'Test',
      port: 1433,
    },
  },
};

export default config;
