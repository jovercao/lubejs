import { Migrate, Statement, SqlBuilder, DbType } from '../../src';

export class B implements Migrate {

  up(
    scripter: SqlBuilder,
    dialect: string | symbol
  ): void {
    scripter.createTable('Test').as(
      builder => [
        builder.column('id', DbType.int64).identity(1, 1)
      ]
    )
  }

  down(
    scripter: SqlBuilder,
    dialect: string | symbol
  ): void {
    scripter.dropTable('Test');
  }
}

export default B;
