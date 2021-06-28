import {
  context,
  DbContext,
  Repository,
  DbType,
  Entity,
  SqlBuilder as SQL,
} from 'lubejs';

/*************************试验代码****************************/

export class User extends Entity {
  id: number;
  name: string;
  password: string;
  description?: string;
  employee?: Employee;
}

export class Order extends Entity {
  id: number;
  date: Date;
  orderNo: string;
  description?: string;
  details: OrderDetail[];
}

export class OrderDetail extends Entity {
  id: number;
  product: string;
  count: number;
  price: number;
  amount: number;
  orderId: number;
  order: Order;
}

export class Position extends Entity {
  id: number;
  name: string;
  description?: string;
  employees: Employee[];
}

export class Employee extends Entity {
  id: number;
  name: string;
  description?: string;
  organization: Organization;
  positions: Position[];
  user: User;
}

export class EmployeePosition extends Entity {
  id: number;
  positionId: number;
  position: Position;
  employeeId: number;
  employee: Employee;
}

export class Organization extends Entity {
  id: number;
  name: string;
  description?: string;
  parentId?: number;
  parent?: Organization;
  employees?: Employee[];
}

export class DB extends DbContext {
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

  modelBuilder.entity(User).asTable(builder => {
    builder.column(p => p.id, Number).identity();
    builder.column(p => p.name, String);
    builder.column(p => p.password, String).nullable();
    builder.column(p => p.description, String).nullable();
    builder
      .hasOne(p => p.employee, Employee)
      .withOne(p => p.user)
      .isPrimary();
    builder.hasKey(p => p.id);
    builder.hasData([
      { id: 0, name: 'admin' }
    ])
  });

  modelBuilder.entity(Position).asTable(builder => {
    builder.column(p => p.id, Number).identity();
    builder.column(p => p.name, String);
    builder.column(p => p.description, String).nullable();
    builder.hasKey(p => p.id);
    builder.hasMany(p => p.employees, Employee).withMany(p => p.positions).hasRelationTable(EmployeePosition);
    builder.hasData([
      { id: 1, name: '总经理', description: '无' },
      { id: 2, name: '总监', description: '无' },
      { id: 3, name: '普通职员', description: '无' },
    ]);
  });


  modelBuilder.entity(Organization).asTable(builder => {
    builder.column(p => p.id, Number).identity();
    builder.column(p => p.name, String);
    builder.column(p => p.description, String).nullable();
    builder.hasMany(p => p.employees, Employee).withOne(p => p.organization);
    builder
      .hasOne(p => p.parent, Organization)
      .withMany()
      .hasForeignKey(p => p.parentId);
    builder.hasData([
      { id: 0, name: '公司', description: '没啥' },
      { id: 1, name: '信息部', parentId: 0 },
      { id: 2, name: '行政部', parentId: 0 }
    ])
  });

  modelBuilder.entity(Employee).asTable(builder => {
    builder.column(p => p.id, Number).identity();
    builder
      .column(p => p.name, String)
      .dbType(DbType.string(100))
      .nullable();
    builder
      .hasMany(p => p.positions, Position)
      .withMany(p => p.employees)
    builder.hasKey(p => p.id);
    builder
      .hasOne(p => p.organization, Organization)
      .withMany(p => p.employees);
    builder.hasOne(p => p.user, User).withOne(p => p.employee).hasForeignKey();
    builder.hasData([
      { id: 0, name: '管理员职员', userId: 0 }
    ])
  });

  modelBuilder.entity(Order).asTable(builder => {
    builder.column(p => p.id, Number).identity();
    builder.column(p => p.orderNo, String).autogen(item => 'abc');
    builder
      .column(p => p.date, Date)
      .dbType(DbType.datetime)
      .defaultValue(SQL.now());
    builder.column(p => p.description, String).nullable();
    builder.hasMany(p => p.details, OrderDetail).withOne(p => p.order);
    builder.hasKey(p => p.id);
  });

  modelBuilder.entity(OrderDetail).asTable(builder => {
    builder.column(p => p.id, Number).identity();
    builder.column(p => p.product, String);
    builder.column(p => p.count, Number);
    builder.column(p => p.price, Number).dbType(DbType.numeric(18, 6));
    builder.column(p => p.amount, Number).dbType(DbType.numeric(18, 2));
    builder.column(p => p.orderId, Number);
    builder
      .hasOne(p => p.order, Order)
      .withMany(p => p.details)
      .hasForeignKey(p => p.orderId);
    builder.hasKey(p => p.id);
  });
});
