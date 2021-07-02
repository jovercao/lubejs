import { Migrate, SqlBuilder as SQL, DbType, MigrateBuilder } from 'lubejs';

export class New1 implements Migrate {

  async up(
    builder: MigrateBuilder,
    dialect: string | symbol
  ): Promise<void> {
    builder.dropIndex('Employee', 'UX_Employee_userId');
    builder.createIndex('UX_Employee_userId').on('Employee', { 'userId': 'ASC' }).unique();
    builder.commentColumn('Position', 'name', '职位名称');
    builder.commentColumn('Position', 'description', '摘要说明');
    builder.commentTable('Position', '主键')
  }

  async down(
    builder: MigrateBuilder,
    dialect: string | symbol
  ): Promise<void> {
    builder.dropIndex('Employee', 'UX_Employee_userId');
    builder.createIndex('UX_Employee_userId').on('Employee', { 'userId': 'ASC' });
    builder.commentColumn('Position', 'name', 'Ö°Î»Ãû³Æ');
    builder.commentColumn('Position', 'description', 'ÕªÒªËµÃ÷');
    builder.commentTable('Position', 'Ö÷¼ü')
  }

}

export default New1;
  