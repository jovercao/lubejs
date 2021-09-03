/* eslint-disable @typescript-eslint/no-empty-interface */
/* eslint-disable @typescript-eslint/no-namespace */
import '../core/base/connection';
import '../core/base/db-provider';
import { DatabaseSchema } from '../orm';
import { MigrateBuilder } from './migrate-builder';

export interface MigrateConnection {
  /**
   * 获取数据库架构
   */
  getSchema(dbname?: string): Promise<DatabaseSchema | undefined>;
}

export interface MigrateDbProvider {
  getMigrateBuilder(): MigrateBuilder;
}

declare module '../core/base/connection' {
  export namespace ConnectionConstructor {
    interface prototype extends MigrateConnection {}
  }

  export interface Connection extends MigrateConnection {}
}

declare module '../core/base/db-provider' {
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  export interface DbProvider extends MigrateDbProvider {}
}
