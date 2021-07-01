import { Migrate, SqlBuilder as SQL, DbType, MigrateBuilder } from 'lubejs';

export class Fixbug implements Migrate {

  async up(
    builder: MigrateBuilder,
    dialect: string | symbol
  ): Promise<void> {
    builder.commentColumn('Position', 'name', '职位名称');
    builder.commentColumn('Position', 'description', '摘要说明');
    builder.commentTable('Position', '主键');
    builder.alterTable('EmployeePosition').alterColumn(column => column('employeeId', DbType.int32).notNull());
    builder.alterTable('EmployeePosition').alterColumn(column => column('positionId', DbType.int32).notNull())
  }

  async down(
    builder: MigrateBuilder,
    dialect: string | symbol
  ): Promise<void> {
    builder.commentColumn('Position', 'name', 'Ö°Î»Ãû³Æ');
    builder.commentColumn('Position', 'description', 'ÕªÒªËµÃ÷');
    builder.commentTable('Position', 'Ö÷¼ü');
    builder.alterTable('EmployeePosition').alterColumn(column => column('employeeId', DbType.int32).null());
    builder.alterTable('EmployeePosition').alterColumn(column => column('positionId', DbType.int32).null())
  }

}

export default Fixbug;
  