import { MigrationBuilder, Migrate, DbType } from '../../src';

export class abc implements Migrate {
  up(migrateBuilder: MigrationBuilder) {
    migrateBuilder.addColumn('表1', {
      name: 'name',
      type: DbType.string(100),
      isNullable: true,
    })
  }

  down(migrateBuilder: MigrationBuilder) {
    migrateBuilder.dropColumn('表1', 'name')
  }
}

export default abc;
