import { DbProvider } from '../core';
import { DatabaseSchema } from '../orm';
import { MigrateBuilder } from './migrate-builder';

declare module '../core' {
  export interface DbProvider  {
    readonly migrateBuilder: MigrateBuilder;
    /**
     * 获取数据库架构
     */
    getSchema(dbname?: string): Promise<DatabaseSchema | undefined>;
  }
}
