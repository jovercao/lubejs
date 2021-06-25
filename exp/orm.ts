import { context, DbContext, Repository, DbType, Entity, SqlBuilder as SQL } from '../src';

/*************************试验代码****************************/
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
}

export class Employee extends Entity {
  id: number;
  name: string;
  description?: string;
  positions: Position[];
}

export class EmployeePosition extends Entity {
  id: number;
  positionId: number;
  position: Position;
  employeeId: number;
  employee: Employee;
}

export class Organization {
  id: number;
  name: string;
  description?: string;
  parentId?: number;
  parent?: Organization;
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
}

context(DB, (modelBuilder) => {
  modelBuilder.entity(Order).asTable((builder) => {
    builder.column((p) => p.id, Number);
    builder.column(p => p.orderNo, String).autogen((item) => 'abc');
    builder.column((p) => p.date, Date).dbType(DbType.datetime).defaultValue(SQL.now());
    builder.column((p) => p.description, String).nullable();
    builder.hasMany((p) => p.details, OrderDetail).withOne((p) => p.order);
  });

  modelBuilder.entity(OrderDetail).asTable((builder) => {
    builder.column((p) => p.id, Number);
    builder.column((p) => p.product, String);
    builder.column((p) => p.count, Number);
    builder.column((p) => p.price, Number).dbType(DbType.numeric(18, 6));
    builder.column((p) => p.amount, Number).dbType(DbType.numeric(18, 2));
    builder.column(p => p.orderId, Number);
    builder
      .hasOne((p) => p.order, Order)
      .withMany((p) => p.details)
      .hasForeignKey((p) => p.orderId);
  });

  modelBuilder.entity(Position).asTable((entityBuilder) => {
    entityBuilder.column((p) => p.id, Number);
    entityBuilder.column((p) => p.name, String);
    entityBuilder.column((p) => p.description, String).nullable();
    entityBuilder.hasData([
      { id: 1, name: '总经理', description: '无'},
      { id: 2, name: '总监', description: '无'},
      { id: 3, name: '普通职员', description: '无'}
    ])
  });

  modelBuilder.entity(Employee).asTable((entity) => {
    entity.column((p) => p.id, Number);
    entity
      .column((p) => p.name, String)
      .dbType(DbType.string(100))
      .nullable();
    entity
      .hasMany((p) => p.positions, Position)
      .withMany()
      .hasRelationTable(EmployeePosition, (builder) => {
        builder.column((p) => p.id, Number).identity();
      });
  });

  // console.log(JSON.stringify(modelBuilder.metadata));
});
