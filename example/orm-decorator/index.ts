/*************************试验代码****************************/

import { Organization, Order, Position, Employee, User } from 'example/orm-configure'
import {
  comment,
  connection,
  database,
  DbContext,
  modelBuilder,
  repository,
  Repository,
} from 'lubejs';

import 'lubejs-mssql';

declare module 'lubejs/types' {
  /**
   * 主键声明接口
   */
  export interface EntityKey {
    id?: bigint;
  }
}


@comment('Test Database')
@connection('mssql://sa:!crgd-2019@jover.wicp.net:2433/Test')
@database('Test')
export class DB extends DbContext {
  @repository(() => Organization)
  Organization!: Repository<Organization>;

  @repository(() => Order)
  Order!: Repository<Order>;

  @repository(() => Position)
  Position!: Repository<Position>;

  @repository(() => Employee)
  Employee!: Repository<Employee>;

  @repository(() => User)
  User!: Repository<User>;
}

modelBuilder.ready();

export * from './entities/employee'
export * from './entities/user'
export * from './entities/order'
export * from './entities/order-detail'
export * from './entities/orgnaization'
export * from './entities/position'
export * from './entities/employee-position'
