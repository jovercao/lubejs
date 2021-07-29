import { Migrate, SqlBuilder as SQL, DbType, MigrateBuilder } from 'lubejs';

export class Migrate20210729182628 implements Migrate {

  async up(
    builder: MigrateBuilder,
    dialect: string
  ): Promise<void> {
    builder.alterTable({"name":"Order","schema":"dbo"}).alterColumn(column => column("rowflag", DbType.binary(8)).notNull());
  }

  async down(
    builder: MigrateBuilder,
    dialect: string
  ): Promise<void> {
    builder.alterTable({"name":"Order","schema":"dbo"}).alterColumn(column => column("rowflag", DbType.binary(8)).notNull());
  }

}

export default Migrate20210729182628;
