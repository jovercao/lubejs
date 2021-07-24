/*************************试验代码****************************/

import {
  autogen,
  Binary,
  column,
  comment,
  connection,
  context,
  database,
  DbContext,
  DbType,
  Decimal,
  Entity,
  EntityKey,
  identity,
  key,
  modelBuilder,
  nullable,
  ProxiedRowset,
  Repository,
  rowflag,
  table,
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

/**
 * 用户实体类
 */
@comment('用户')
@table()
@context(() => DB)
export class User extends Entity implements EntityKey {
  @key()
  @identity()
  @comment('ID')
  id?: bigint;

  @comment('用户名')
  @column()
  name!: string;

  @comment('密码')
  @nullable()
  @column()
  password!: string;

  @comment('摘要说明')
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
@comment('订单')
export class Order extends Entity implements EntityKey {

  @comment('ID')
  @key()
  @identity()
  id?: bigint;

  @comment('订单日期')
  @column()
  date!: Date;
  // 自动生成，因此可以为空

  @comment('订单号')
  @autogen((item: ProxiedRowset<Order>) => 'abc')
  @column()
  orderNo?: string;

  @comment('摘要说明')
  @nullable()
  description?: string;

  /**
   * 行版本号
   */
  @comment('行标识')
  @rowflag()
  rowflag?: Binary;

  details?: OrderDetail[];
}

/**
 * 订单明细
 */
@table()
@context(() => DB)
@comment('订单明细')
export class OrderDetail extends Entity implements EntityKey {
  @comment('ID')
  @identity()
  @key()
  id?: bigint;

  @comment('产品名称')
  @column()
  product!: string;

  @comment('数量')
  @column()
  count!: number;

  @comment('单价')
  @column(DbType.decimal(18, 6))
  price!: Decimal;

  @comment('金额')
  @column(DbType.decimal(18, 2))
  amount!: Decimal;

  @comment('摘要说明')
  @nullable()
  description?: string;

  @comment('订单Id')
  @column()
  orderId?: bigint;

  order?: Order;
}

@table()
@comment('职位')
@context(() => DB)
export class Position extends Entity implements EntityKey {
  @comment('职位ID')
  @identity()
  @key()
  id?: bigint;

  @comment('职位名称')
  @column()
  name!: string;

  @comment('摘要说明')
  @nullable()
  description?: string;

  employees?: Employee[];
}

@table()
@comment('职员')
@context(() => DB)
export class Employee extends Entity implements EntityKey {
  @key()
  @comment('职员ID')
  @identity()
  id?: bigint;

  @comment('姓名')
  @column()
  name!: string;

  @comment('摘要说明')
  @nullable()
  description?: string;

  organization?: Organization;
  positions?: Position[];
  user?: User;
}

@table()
@context(() => DB)
export class EmployeePosition extends Entity implements EntityKey {
  @comment('ID')
  @key()
  @identity()
  id?: bigint;

  @comment('职位ID')
  @column()
  positionId!: number;

  position?: Position;

  @comment('职员ID')
  employeeId!: number;

  employee?: Employee;
}

@table()
@comment('机构')
@context(() => DB)
export class Organization extends Entity implements EntityKey {
  @key()
  @comment('机构ID')
  @identity()
  id?: bigint;

  @comment('机构名称')
  @column()
  name!: string;

  @comment('摘要说明')
  @nullable()
  description?: string;

  @comment('父级机构ID')
  @column()
  parentId?: bigint;

  parent?: Organization;
  children?: Organization[];
  employees?: Employee[];
}

@comment('测试数据库')
@connection('mssql://sa:!crgd-2019@jover.wicp.net:2433/Test')
@database('Test')
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

modelBuilder.ready();
