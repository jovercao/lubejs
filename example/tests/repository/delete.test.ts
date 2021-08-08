import {
  DB,
  Employee,
  EmployeePosition,
  Order,
  OrderDetail,
  User,
} from 'orm';
import assert from 'assert';
import { createContext, Decimal, outputCommand, SqlBuilder as SQL } from 'lubejs';

describe('Repository: delete', function () {
  this.timeout(0);
  let db: DB;
  let outputSql: boolean = false;
  before(async () => {
    db = await createContext(DB);
    if (outputSql) {
      db.lube.on('command', outputCommand);
    }
  });

  after(async () => {
    await db.lube.close();
  });

  it('PrimaryOneToOne: User <- Employee', async () => {
    const employee = Employee.create({
      name: 'PrimaryOneToOne: employee',
      organization: await db.Organization.get(0n),
    });

    const user = User.create({
      name: 'PrimaryOneToOne: user',
      password: 'pwd',
      employee,
    });

    await db.save(user);

    user.description = 'updated user';
    user.employee!.description = 'updated employee';

    await db.User.delete(user, { withDetail: true });

    const deletedUser = await db.User.get(user.id!);
    const deletedEmployee = await db.Employee.get(employee.id!);
    assert(!deletedUser);
    assert(!deletedEmployee);
  });

  it('OneToMany: Order <- OrderDetail', async () => {
    const order = Order.create({
      orderNo: 'OrderNo',
      date: new Date(),
      details: [
        {
          product: 'product1',
          count: 1,
          price: new Decimal(100),
          amount: new Decimal(100),
        },
        {
          product: 'product2',
          count: 2,
          price: new Decimal(100),
          amount: new Decimal(200),
        },
      ],
    });
    await db.insert(order);

    const newOrder = (await db.get(Order, order.id!, { withDetail: true }))!;

    assert(newOrder.details?.length === 2);

    await db.Order.delete(newOrder, { withDetail: true });

    const deleted = await db.get(Order, order.id!, {
      includes: { details: true },
    });

    const deletedDetails = await db
      .getQueryable(OrderDetail)
      .filter(p => p.orderId.eq(newOrder.id))
      .fetchAll();

    assert(!deleted);
    assert(deletedDetails.length == 0);
  });

  it('ManyToMany: Employee <- EmployeePosition -> Position', async () => {
    const employee: Employee = {
      user: {
        name: 'ManyToManyDelete: user',
        password: 'hehe',
      },
      name: 'repository.update ManyToMany1',
      organization: await db.User.get(0n),
      positions: [
        {
          name: 'position1',
        },
        {
          name: 'position2',
        },
      ],
    };
    employee.description = '职员更新内容';

    await db.Employee.save(employee);

    const newEmp = await db.Employee.get(employee.id!, { withDetail: true });
    assert(newEmp?.positions?.length === 2);

    await db.Employee.delete(employee, { withDetail: true });

    const deleted = await db.Employee.get(employee.id!, { withDetail: true });

    const relationDetails = await db
      .getQueryable(EmployeePosition)
      .filter(p => p.employeeId.eq(employee.id!))
      .fetchAll();
    assert(!deleted);
    assert(relationDetails.length === 0);
  });
});
