import {
  modelBuilder,
  DbContext,
  Repository,
  DbType,
  Entity,
  SqlBuilder as SQL,
  EntityKey,
  Binary,
  Decimal,
} from 'lubejs';

/*************************试验代码****************************/

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
export class User extends Entity implements EntityKey {
  id?: bigint;
  name!: string;
  password!: string;
  description?: string;
  employee?: Employee;
}

/**
 * 订单
 */
export class Order extends Entity implements EntityKey {
  id?: bigint;
  date!: Date;
  // 自动生成，因此可以为空
  orderNo?: string;
  description?: string;
  /**
   * 行版本号
   */
  rowflag?: Binary;

  details?: OrderDetail[];
}

/**
 * 订单明细
 */
export class OrderDetail extends Entity implements EntityKey {
  id?: bigint;
  product!: string;
  count!: number;
  price!: Decimal;
  amount!: Decimal;
  description?: string;
  orderId?: bigint;
  order?: Order;
}

export class Position extends Entity implements EntityKey {
  id?: bigint;
  name!: string;
  description?: string;
  employees?: Employee[];
}

export class Employee extends Entity implements EntityKey {
  id?: bigint;
  name!: string;
  description?: string;
  organization?: Organization;
  positions?: Position[];
  user?: User;
}

export class EmployeePosition extends Entity implements EntityKey {
  id?: bigint;
  positionId!: bigint;
  position?: Position;
  employeeId!: bigint;
  employee?: Employee;
}

export class Organization extends Entity implements EntityKey {
  id?: bigint;
  name!: string;
  description?: string;
  parentId?: bigint;
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

modelBuilder.context(DB, context => {
  context
    .entity(User)
    .asTable(table => {
      table.hasComment('Employee');
      table
        .property(p => p.id, BigInt)
        .isIdentity()
        .hasComment('ID');
      table.property(p => p.name, String).hasComment('EmployeeName');
      table
        .property(p => p.password, String)
        .isNullable()
        .hasComment('Password');
      table
        .property(p => p.description, String)
        .isNullable()
        .hasComment('Description');
      table
        .hasOne(p => p.employee, Employee)
        .withOne(p => p.user)
        .isPrimary()
        .hasComment('BindEmployee')
        .isDetail();
      table.hasKey(p => p.id).hasComment('PrimaryKey');
      table.hasData([{ id: 0, name: 'admin' }]);
    })
    .entity(Position)
    .asTable(table => {
      table.hasComment('Position');
      table
        .property(p => p.id, BigInt)
        .isIdentity()
        .hasComment('ID');
      table.property(p => p.name, String).hasComment('PositionName');
      table
        .property(p => p.description, String)
        .isNullable()
        .hasComment('Description');
      table.hasKey(p => p.id).hasComment('PrimaryKey');
      table
        .hasMany(p => p.employees, Employee)
        .withMany(p => p.positions)
        .hasRelationTable(EmployeePosition);
      table.hasData([
        { id: 1, name: 'general manager', description: 'none' },
        { id: 2, name: 'chief inspector', description: 'none' },
        { id: 3, name: 'clerk', description: 'none' },
      ]);
    })
    .entity(Organization)
    .asTable(builder => {
      builder.property(p => p.id, BigInt).isIdentity();
      builder.property(p => p.name, String);
      builder.property(p => p.description, String).isNullable();
      builder.hasMany(p => p.employees, Employee).withOne(p => p.organization);
      builder
        .hasOne(p => p.parent, Organization)
        .withMany()
        .hasForeignKey(p => p.parentId);
      builder.hasMany(p => p.children, Organization).withOne(p => p.parent);

      builder.hasData([
        { id: 0, name: 'Company', description: 'none' },
        { id: 1, name: 'IT', parentId: 0 },
        { id: 2, name: 'Administration', parentId: 0 },
      ]);
    })
    .entity(Employee)
    .asTable(builder => {
      builder.property(p => p.id, BigInt).isIdentity();
      builder
        .property(p => p.name, String)
        .hasType(DbType.string(100))
        .isNullable();
      builder
        .property(p => p.description, String)
        .hasType(DbType.string(100))
        .isNullable();
      builder
        .hasMany(p => p.positions, Position)
        .withMany(p => p.employees)
        .isDetail();
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
      builder.hasData([{ id: 0, name: 'Administrator', userId: 0, organizationId: 0 }]);
    })
    .entity(Order)
    .asTable(builder => {
      builder.property(p => p.id, BigInt).isIdentity();
      builder.property(p => p.orderNo, String).isAutogen(item => 'abc');
      builder
        .property(p => p.date, Date)
        .hasType(DbType.datetime)
        .hasDefaultValue(SQL.now());
      builder.property(p => p.description, String).isNullable();
      builder
        .hasMany(p => p.details, OrderDetail)
        .withOne(p => p.order)
        .isDetail();

      builder.property(p => p.rowflag, Buffer).isRowflag();
      builder.hasKey(p => p.id);

      builder.hasIndex('IX_Order_OrderNo').withProperties(p => [p.orderNo]).hasComment('OrderNo Index');
    })
    .entity(OrderDetail)
    .asTable(builder => {
      builder.property(p => p.id, BigInt).isIdentity();
      builder.property(p => p.product, String);
      builder.property(p => p.count, Number);
      builder.property(p => p.price, Decimal).hasType(DbType.decimal(18, 6));
      builder.property(p => p.amount, Decimal).hasType(DbType.decimal(18, 2));
      builder.property(p => p.orderId, BigInt);
      builder.property(p => p.description, String).isNullable();
      builder
        .hasOne(p => p.order, Order)
        .withMany(p => p.details)
        .hasForeignKey(p => p.orderId)
        .isRequired();
      builder.hasKey(p => p.id);
    });
})
.ready();
