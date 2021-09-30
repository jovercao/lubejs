/* eslint-disable @typescript-eslint/no-empty-interface */
/* eslint-disable @typescript-eslint/no-namespace */
import '../core/base/connection';
import { Connection } from '../core/base/connection';
import '../core/base/db-provider';
import { MigrateBuilder } from './migrate-builder';
import { SchemaLoader } from './schema-loader';

export interface MigrateDbProvider {
  getMigrateBuilder(): MigrateBuilder;
  getSchemaLoader(connection: Connection): SchemaLoader;
}

declare module '../core/base/db-provider' {
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  export interface DbProvider extends MigrateDbProvider {}
}
