import { Migrate, SqlBuilder as SQL, DbType, MigrateBuilder } from 'lubejs';

export class Migrate20210724025316 implements Migrate {

  async up(
    builder: MigrateBuilder,
    dialect: string
  ): Promise<void> {
    
  }

  async down(
    builder: MigrateBuilder,
    dialect: string
  ): Promise<void> {
    
  }

}

export default Migrate20210724025316;
  