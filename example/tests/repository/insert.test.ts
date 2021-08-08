import assert from 'assert';
import {
  User,
  DB,
  OrderDetail,
  Order,
  Employee,
  Organization,
} from 'orm';
import {
  createContext,
  Decimal,
  outputCommand,
  SqlBuilder as SQL,
} from 'lubejs';

const { star, count } = SQL;

describe('Repository: insert', function () {
  this.timeout(0);
  let db: DB;
  const logit: boolean = false;
  before(async () => {
    db = await createContext(DB);
    if (logit) {
      db.lube.on('command', outputCommand);
    }
  });
  after(async () => {
    db.lube.close();
  });

  it('Single: User', async () => {
    const { count: beforeCount } = (await db.User.map(p => ({
      count: count(star),
    })).fetchFirst())!;
    const user: User = User.create({
      name: 'single test: user',
      password: '123456',
      description: 'this is a description',
    });
    await db.User.insert(user);

    const { count: afterCount } = (await db.User.map(p => ({
      count: count(star),
    })).fetchFirst())!;

    assert(afterCount - beforeCount === 1, '插用户入数量不正确');
    const newUser = await db.User.get(user.id!);
    assert.deepStrictEqual(user, newUser);
  });

  it('ManyToOne: OrderDetail -> Order', async () => {
    const item = OrderDetail.create({
      product: 'product1',
      count: 1,
      price: new Decimal(100.0),
      amount: new Decimal(100.0),
      order: {
        date: new Date(),
        orderNo: '202001010001',
      },
    });
    await db.getRepository(OrderDetail).insert(item);
    assert(item.id !== undefined);
    assert(item.order?.id);
  });

  it('OneToMany: Order <- OrderDetail[]', async () => {
    const item = Order.create({
      date: new Date(),
      description: 'this is a order',
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
          price: new Decimal(200),
          amount: new Decimal(400),
        },
      ],
    });
    await db.Order.insert(item);
    assert(item.id !== undefined);
    assert(item.details?.[0].id);
    assert(item.details?.[1].id);
  });

  it('ForeignOneToOne: Organization <- Employee -> User', async () => {
    const organization = await db.Organization.get(0n);
    const employee = Employee.create({
      name: 'emp',
      description: 'test',
      organization,
      user: {
        name: 'newUser2',
        password: '123456',
        description: 'this is a description',
      },
    });
    await db.Employee.insert(employee);

    assert(employee.id !== undefined);
    assert(employee.user?.id !== undefined);
    assert(Reflect.get(employee, 'organizationId') === organization?.id);
  });

  it('PrimaryOneToOne: User <- Employee', async () => {
    const organization = await db.Organization.get(0n);
    const item = User.create({
      name: 'user1',
      password: '123456',
      description: 'default description',
      employee: {
        name: 'PrimaryOneToOneTest: employee',
        organization,
      },
    });
    await db.User.insert(item);

    assert(item.id !== undefined);
    assert(item.employee?.id !== undefined);
  });

  it('TreeRelation ChildToParent: Organization[] -> Organization', async () => {
    const organization = await db.Organization.get(0n);
    const items = Organization.create([
      {
        name: 'level1: department1',
        description: 'parent is level0 company',
        parent: organization,
      },
      {
        name: 'level1',
        description: 'parent is level0: new org',
        parent: {
          name: 'level0: new org',
        },
      },
    ]);
    await db.Organization.insert(items);
    assert(items[0].id !== undefined);
    assert(items[0].parent?.id === organization?.id);
    assert(items[1].id !== undefined);
    assert(items[1].parent?.id !== undefined);
  });

  it('TreeRelation ParentToChild: Organization <- Organization[]', async () => {
    const item = Organization.create({
      name: 'level0: New Org',
      description: 'parent is null',
      children: [
        {
          name: 'level1: org1',
          description: 'parent is level0: New Org',
        },
        {
          name: 'level1: org2',
          description: 'parent is level0: New Org',
        },
      ],
    });
    await db.Organization.insert(item);
    assert(item.id !== undefined);
    assert(item.children[0].id !== undefined);
    assert(item.children[1].id !== undefined);
  });

  it('多对多关系插入测试 - Employee <- EmployeePosition -> Position', async () => {
    const organization = await db.Organization.get(0n);
    const item = Employee.create({
      name: '多对多关系插入测试 - 职员',
      description:
        '多对多关系插入测试 - Employee <- EmployeePosition -> Position',
      organization,
      user: {
        name: '新用户',
        password: '新密码',
      },
      positions: [
        {
          name: '职员绑定的新职位1',
        },
        {
          name: '职员绑定的新职位2',
        },
      ],
    });
    await db.Employee.insert(item);
    assert(item.id !== undefined);
    assert(item.user.id !== undefined);
    assert(item.positions[0].id !== undefined);
    assert(item.positions[1].id !== undefined);
  });

  // it('主从表插入测试 - Order', async () => {
  //   await db.User.add()
  // })
});
