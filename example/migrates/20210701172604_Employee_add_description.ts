import { Migrate, SqlBuilder as SQL, DbType, MigrateBuilder } from 'lubejs';

export class Employee_add_description implements Migrate {

  async up(
    builder: MigrateBuilder,
    dialect: string | symbol
  ): Promise<void> {
    builder.alterTable('Employee').add(builder => builder.column('description', DbType.string(100)).null());
    builder.commentColumn('Position', 'name', '职位名称');
    builder.commentColumn('Position', 'description', '摘要说明');
    builder.commentTable('Position', '主键');
    builder.setDefaultValue('Order', 'date', "sysdatetimeoffset()")
  }

  async down(
    builder: MigrateBuilder,
    dialect: string | symbol
  ): Promise<void> {
    builder.alterTable('Employee').drop(builder => builder.column('description'));
    builder.commentColumn('Position', 'name', 'Ö°Î»Ãû³Æ');
    builder.commentColumn('Position', 'description', 'ÕªÒªËµÃ÷');
    builder.commentTable('Position', 'Ö÷¼ü');
    builder.setDefaultValue('Order', 'date', "'sysdatetimeoffset()'")
  }

}

export default Employee_add_description;
  