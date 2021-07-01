import { Migrate, SqlBuilder as SQL, DbType, MigrateBuilder } from 'lubejs';

export class Employee_orgid_notnull implements Migrate {

  async up(
    builder: MigrateBuilder,
    dialect: string | symbol
  ): Promise<void> {
    builder.alterTable('Employee').alterColumn(column => column('organizationId', DbType.int32).notNull());
    builder.commentColumn('Position', 'name', '职位名称');
    builder.commentColumn('Position', 'description', '摘要说明');
    builder.commentTable('Position', '主键');
    builder.alterTable('OrderDetail').alterColumn(column => column('orderId', DbType.int32).notNull())
  }

  async down(
    builder: MigrateBuilder,
    dialect: string | symbol
  ): Promise<void> {
    builder.alterTable('Employee').alterColumn(column => column('organizationId', DbType.int32).null());
    builder.commentColumn('Position', 'name', 'Ö°Î»Ãû³Æ');
    builder.commentColumn('Position', 'description', 'ÕªÒªËµÃ÷');
    builder.commentTable('Position', 'Ö÷¼ü');
    builder.alterTable('OrderDetail').alterColumn(column => column('orderId', DbType.int32).null())
  }

}

export default Employee_orgid_notnull;
  