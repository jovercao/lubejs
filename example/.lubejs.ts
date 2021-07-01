import { LubeConfig } from 'lubejs';
import driver from 'lubejs-mssql';
import './orm'

export const config: LubeConfig = {
  default: 'DB',
  migrateDir: 'migrates',
  configures: {
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
