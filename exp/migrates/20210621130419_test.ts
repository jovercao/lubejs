import { MigrationBuilder, Migrate, DbType } from '../../src';

export class test implements Migrate {
  up(migrateBuilder: MigrationBuilder) {
    migrateBuilder.createTable({
      name: '表1',
      columns: [
        { name: 'ID', type: DbType.string(100), isNullable: false, isCalculate: false, isIdentity: false }
      ],
      primaryKey: ['ID']
    })
  }

  down(migrateBuilder: MigrationBuilder) {
    migrateBuilder.dropTable('表1');
  }
}

export default test;
