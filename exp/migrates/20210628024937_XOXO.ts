import { Migrate, Statement, SqlBuilder as SQL, DbType, MigrateBuilder } from 'lubejs';

export class XOXO implements Migrate {

  async up(
    builder: MigrateBuilder,
    dialect: string | symbol
  ): Promise<void> {
    
  }

  async down(
    builder: MigrateBuilder,
    dialect: string | symbol
  ): Promise<void> {
    
  }

}

export default XOXO;
  