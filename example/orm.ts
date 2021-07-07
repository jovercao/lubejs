import {
  context,
  DbContext,
  Repository,
  DbType,
  Entity,
  SqlBuilder as SQL,
  EntityKey,
} from 'lubejs';

/*************************试验代码****************************/

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
export class User extends Entity implements EntityKey {
  id?: number;
  name!: string;
  password!: string;
  description?: string;
  employee?: Employee;
}

/**
 * 订单
 */
export class Order extends Entity implements EntityKey {
  id?: number;
  date!: Date;
  // 自动生成，因此可以为空
  orderNo?: string;
  description?: string;
  details?: OrderDetail[];
}

/**
 * 订单明细
 */
export class OrderDetail extends Entity implements EntityKey {
  id?: number;
  product!: string;
  count!: number;
  price!: number;
  amount!: number;
  description?: string;
  orderId?: number;
  order?: Order;
}

export class Position extends Entity implements EntityKey {
  id?: number;
  name!: string;
  description?: string;
  employees?: Employee[];
}

export class Employee extends Entity implements EntityKey {
  id?: number;
  name!: string;
  description?: string;
  organization?: Organization;
  positions?: Position[];
  user?: User;
}

export class EmployeePosition extends Entity implements EntityKey {
  id?: number;
  positionId!: number;
  position?: Position;
  employeeId!: number;
  employee?: Employee;
}

export class Organization extends Entity implements EntityKey {
  id?: number;
  name!: string;
  description?: string;
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

context(DB, modelBuilder => {
  modelBuilder.entity(User).asTable(table => {
    table.hasComment('职员');
    table
      .column(p => p.id, Number)
      .isIdentity()
      .hasComment('ID');
    table.column(p => p.name, String).hasComment('职员姓名');
    table
      .column(p => p.password, String)
      .isNullable()
      .hasComment('密码');
    table
      .column(p => p.description, String)
      .isNullable()
      .hasComment('摘要说明');
    table
      .hasOne(p => p.employee, Employee)
      .withOne(p => p.user)
      .isPrimary()
      .hasComment('绑定职员')
      .isDetail();
    table.hasKey(p => p.id).hasComment('主键');
    table.hasData([{ id: 0, name: 'admin' }]);
  });

  modelBuilder.entity(Position).asTable(table => {
    table.hasComment('职员');
    table
      .column(p => p.id, Number)
      .isIdentity()
      .hasComment('ID');
    table.column(p => p.name, String).hasComment('职位名称');
    table
      .column(p => p.description, String)
      .isNullable()
      .hasComment('摘要说明');
    table.hasKey(p => p.id).hasComment('主键');
    table
      .hasMany(p => p.employees, Employee)
      .withMany(p => p.positions)
      .hasRelationTable(EmployeePosition);
    table.hasData([
      { id: 1, name: '总经理', description: '无' },
      { id: 2, name: '总监', description: '无' },
      { id: 3, name: '普通职员', description: '无' },
    ]);
  });

  modelBuilder.entity(Organization).asTable(builder => {
    builder.column(p => p.id, Number).isIdentity();
    builder.column(p => p.name, String);
    builder.column(p => p.description, String).isNullable();
    builder.hasMany(p => p.employees, Employee).withOne(p => p.organization);
    builder
      .hasOne(p => p.parent, Organization)
      .withMany()
      .hasForeignKey(p => p.parentId);
    builder.hasMany(p => p.children, Organization).withOne(p => p.parent);

    builder.hasData([
      { id: 0, name: '公司', description: '没啥' },
      { id: 1, name: '信息部', parentId: 0 },
      { id: 2, name: '行政部', parentId: 0 },
    ]);
  });

  modelBuilder.entity(Employee).asTable(builder => {
    builder.column(p => p.id, Number).isIdentity();
    builder
      .column(p => p.name, String)
      .hasType(DbType.string(100))
      .isNullable();
    builder
      .column(p => p.description, String)
      .hasType(DbType.string(100))
      .isNullable();
    builder.hasMany(p => p.positions, Position).withMany(p => p.employees).isDetail();
    builder.hasKey(p => p.id);
    builder
      .hasOne(p => p.organization, Organization)
      .withMany(p => p.employees)
      .isRequired();
    builder
      .hasOne(p => p.user, User)
      .withOne(p => p.employee)
      .hasForeignKey()
      .isRequired();
    builder.hasData([{ id: 0, name: '管理员职员', userId: 0 }]);
  });

  modelBuilder.entity(Order).asTable(builder => {
    builder.column(p => p.id, Number).isIdentity();
    builder.column(p => p.orderNo, String).isAutogen(item => 'abc');
    builder
      .column(p => p.date, Date)
      .hasType(DbType.datetime)
      .hasDefaultValue(SQL.now());
    builder.column(p => p.description, String).isNullable();
    builder.hasMany(p => p.details, OrderDetail).withOne(p => p.order).isDetail();
    builder.hasKey(p => p.id);
  });

  modelBuilder.entity(OrderDetail).asTable(builder => {
    builder.column(p => p.id, Number).isIdentity();
    builder.column(p => p.product, String);
    builder.column(p => p.count, Number);
    builder.column(p => p.price, Number).hasType(DbType.decimal(18, 6));
    builder.column(p => p.amount, Number).hasType(DbType.decimal(18, 2));
    builder.column(p => p.orderId, Number);
    builder.column(p => p.description, String).isNullable();
    builder
      .hasOne(p => p.order, Order)
      .withMany(p => p.details)
      .hasForeignKey(p => p.orderId)
      .isRequired();
    builder.hasKey(p => p.id);
  });
});
