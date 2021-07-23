/*************************试验代码****************************/

import {
  autogen,
  Binary,
  column,
  context,
  DbContext,
  DbType,
  Decimal,
  Entity,
  EntityKey,
  identity,
  key,
  nullable,
  ProxiedRowset,
  Repository,
  rowflag,
  table,
  Uuid,
} from 'lubejs';

declare module 'lubejs/types' {
  /**
   * 主键声明接口
   */
  export interface EntityKey {
    id?: number;
  }
}

/**
 * 用户实体类
 */
@table()
@context(() => DB)
export class User extends Entity implements EntityKey {
  @key()
  @identity()
  id?: number;

  @column()
  name!: string;

  @column()
  password!: string;

  @nullable()
  @column()
  description?: string;

  employee?: Employee;
}

/**
 * 订单
 */
@table()
@context(() => DB)
export class Order extends Entity implements EntityKey {
  @key()
  @identity()
  id?: number;

  @column()
  date!: Date;
  // 自动生成，因此可以为空

  @autogen((item: ProxiedRowset<Order>) => 'abc')
  @column()
  orderNo?: string;

  @nullable()
  description?: string;

  /**
   * 行版本号
   */
  @rowflag()
  rowflag?: Binary;

  details?: OrderDetail[];
}

/**
 * 订单明细
 */
@table()
@context(() => DB)
export class OrderDetail extends Entity implements EntityKey {
  @identity()
  @key()
  id?: number;

  @column()
  product!: string;

  @column(DbType.decimal(18, 2))
  count!: number;

  @column(DbType.decimal(18, 2))
  price!: number;

  @column(DbType.decimal(18, 2))
  amount!: number;

  @nullable()
  description?: string;

  @column()
  orderId?: number;

  order?: Order;
}

@table()
@context(() => DB)
export class Position extends Entity implements EntityKey {
  @identity()
  @key()
  id?: number;

  @column()
  name!: string;

  @nullable()
  description?: string;

  employees?: Employee[];
}

@table()
@context(() => DB)
export class Employee extends Entity implements EntityKey {
  @key()
  @identity()
  id?: number;

  @column()
  name!: string;

  @nullable()
  description?: string;

  organization?: Organization;
  positions?: Position[];
  user?: User;
}

@table()
@context(() => DB)
export class EmployeePosition extends Entity implements EntityKey {
  @key()
  @identity()
  id?: number;

  @column()
  positionId!: number;

  position?: Position;
  employeeId!: number;
  employee?: Employee;
}

@table()
@context(() => DB)
export class Organization extends Entity implements EntityKey {
  @key()
  @identity()
  id?: number;

  @column()
  name!: string;

  @nullable()
  description?: string;

  @column()
  parentId?: number;

  parent?: Organization;
  children?: Organization[];
  employees?: Employee[];
}

export class DB extends DbContext {
  get Organization(): Repository<Organization> {
    return this.getRepository(Organization);
  }

  get Order(): Repository<Order> {
    return this.getRepository(Order);
  }

  get Position(): Repository<Position> {
    return this.getRepository(Position);
  }

  get Employee(): Repository<Employee> {
    return this.getRepository(Employee);
  }

  get User(): Repository<User> {
    return this.getRepository(User);
  }
}
