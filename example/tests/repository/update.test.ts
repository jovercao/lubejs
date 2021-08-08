import { DB, Employee, Order, OrderDetail, User } from 'orm';
import assert from 'assert';
import {
  createContext,
  Decimal,
  outputCommand,
  SqlBuilder as SQL,
} from 'lubejs';

const { star, count } = SQL;

describe('Repository: update', function () {
  this.timeout(0);
  let db: DB;
  const outputSql: boolean = false;
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
    const user: User = {
      name: 'primary OneToOne update user',
      password: 'pwd',
      employee: {
        name: 'primary OneToOne update employee',
        organization: (await db.Organization.get(0n))!,
      },
    };
    await db.User.save(user);

    user.description = 'updated user';
    user.employee!.description = 'updated employee';

    await db.User.save(user);

    const updated = await db.User.get(user.id!, {
      includes: { employee: true },
    });
    assert(updated?.description === 'updated user');
    assert(updated?.employee?.description === 'updated employee');
  });

  it('ForeignOneToOne: Employee -> User', async () => {
    const employee: Employee = {
      name: 'ForeignOneToOneTest - employee',
      organization: (await db.Organization.get(0n))!,
      user: {
        name: 'ForeignOneToOneTest - User',
        password: '嘿咻',
      },
    };
    await db.Employee.save(employee);

    employee.description = 'updated employee';
    employee.user!.description = 'updated user';

    await db.Employee.save(employee);

    const updated = await db.Employee.get(employee.id!, {
      includes: { user: true },
    });
    assert(updated?.description === 'updated employee');
    assert(updated?.user?.description === 'updated user');
  });

  it('OneToMany: Order <- OrderDetail', async () => {
    const order: Order = {
      orderNo: 'OrderNo',
      date: new Date(),
      details: [
        {
          product: 'Product1',
          count: 1,
          price: new Decimal(100),
          amount: new Decimal(100),
        },
        {
          product: 'Product2',
          count: 2,
          price: new Decimal(100),
          amount: new Decimal(200),
        },
      ],
    };
    await db.Order.insert(order);

    order.description = 'updated order';

    order.details![1].description = 'updated product2';

    order.details!.push({
      product: 'product3',
      count: 3,
      price: new Decimal(100),
      amount: new Decimal(300),
      description: 'new product3',
    });

    // 删除第一个
    order.details!.splice(0, 1);

    await db.Order.save(order);

    const updated = await db.Order.get(order.id!, {
      includes: { details: true },
    });
    assert(updated?.description === 'updated order', '订单更新失败');
    assert(updated?.details?.length === 2, '更新后的子项数量不正确');
    assert(
      updated?.details?.[0]?.description === 'updated product2',
      '更新子项失败'
    );
    assert(
      updated?.details?.[1]?.description === 'new product3',
      '新增子项失败'
    );
  });

  it('ManyToMany 子项增删除改测试', async () => {
    const employee: Employee = {
      user: {
        name: 'ManyToManyTest: user',
        password: 'hehe',
      },
      name: 'ManyToManyTest: employee',
      organization: (await db.User.get(0n))!,
      positions: [
        {
          name: 'ManyToManyTest: position1',
        },
        {
          name: 'ManyToManyTest: position2',
        },
      ],
    };

    await db.Employee.save(employee);

    employee.description = 'updated employee';
    employee.positions![1].description = 'updated posotion2';

    employee.positions!.push({
      name: 'ManyToManyTest: position3',
    });
    employee.positions!.splice(0, 1);

    await db.Employee.save(employee);

    const updated = await db.Employee.get(employee.id!, {
      includes: { positions: true },
    });
    assert(updated?.description === 'updated employee', '职员更新失败');
    assert(updated.positions!.length === 2, '关联表数目不正确');
    assert(
      updated.positions![0].name === 'ManyToManyTest: position2' &&
        updated.positions![0].description === 'updated posotion2'
    );
    assert((updated.positions![1].name = 'ManyToManyTest: position3'));
  });
});
