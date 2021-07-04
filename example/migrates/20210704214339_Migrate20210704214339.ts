import { Migrate, SqlBuilder as SQL, DbType, MigrateBuilder } from 'lubejs';

export class Migrate20210704214339 implements Migrate {

  async up(
    builder: MigrateBuilder,
    dialect: string | symbol
  ): Promise<void> {
    builder.commentConstraint('User', 'PK_User_id', '主键');
    builder.commentColumn('User', 'name', '职员姓名');
    builder.commentColumn('User', 'password', '密码');
    builder.commentColumn('User', 'description', '摘要说明');
    builder.commentTable('User', '职员');
    builder.commentConstraint('Position', 'PK_Position_id', '主键');
    builder.commentColumn('Position', 'name', '职位名称');
    builder.commentColumn('Position', 'description', '摘要说明');
    builder.commentTable('Position', '职员')
  }

  async down(
    builder: MigrateBuilder,
    dialect: string | symbol
  ): Promise<void> {
    builder.commentConstraint('User', 'PK_User_id', 'Ö÷¼ü');
    builder.commentColumn('User', 'name', 'Ö°Ô±ÐÕÃû');
    builder.commentColumn('User', 'password', 'ÃÜÂë');
    builder.commentColumn('User', 'description', 'ÕªÒªËµÃ÷');
    builder.commentTable('User', 'Ö°Ô±');
    builder.commentConstraint('Position', 'PK_Position_id', 'Ö÷¼ü');
    builder.commentColumn('Position', 'name', 'Ö°Î»Ãû³Æ');
    builder.commentColumn('Position', 'description', 'ÕªÒªËµÃ÷');
    builder.commentTable('Position', 'Ö°Ô±')
  }

}

export default Migrate20210704214339;
  