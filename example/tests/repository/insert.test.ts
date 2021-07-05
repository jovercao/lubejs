import assert from 'assert';
import '../../orm';
import { User, DB, OrderDetail } from '../../orm';
import { createContext, outputCommand, SqlBuilder as SQL } from 'lubejs';

const { star, count } = SQL;

describe.skip('Repository: insert', function () {
  this.timeout(0);
  let db: DB;
  before(async () => {
    db = await createContext<DB>();
    db.lube.on('command', outputCommand);
  });
  after(async () => {
    db.lube.close();
  });

  it('单条记录插入 - User', async () => {
    const { count: beforeCount } = await db.User.map(p => ({
      count: count(star),
    })).fetchFirst();
    const user: User = User.create({
      name: 'user1',
      password: '123456',
      description: '这是一个默认描述',
    });
    await db.User.insert(user);

    const { count: afterCount } = await db.User.map(p => ({
      count: count(star),
    })).fetchFirst();

    assert(afterCount - beforeCount === 1, '插用户入数量不正确');
    const newUser = await db.User.get(user.id);
    assert.deepStrictEqual(user, newUser);
  });

  it('多对一关系插入测试 - OrderDetail -> Order', async () => {
    await db.getRepository(OrderDetail).insert({
      product: '产品1',
      count: 1,
      price: 100.0,
      amount: 100.0,
      order: {
        date: new Date(),
        orderNo: '202001010001',
      },
    });
  });

  it('一对多关系插入测试 - Order <- OrderDetail[]', async () => {
    await db.Order.insert({
      date: new Date(),
      description: '这是一个默认描述',
      details: [
        {
          product: '产品1',
          count: 1,
          price: 100,
          amount: 100,
        },
        {
          product: '产品2',
          count: 2,
          price: 200,
          amount: 400,
        },
      ],
    });
  });

  it('一对一关系(副)插入测试 - Employee -> User', async () => {
    const organization = await db.Organization.get(0);
    await db.Employee.insert({
      name: '职员2',
      description: '测试',
      organization,
      user: {
        name: 'newUser2',
        password: '123456',
        description: '这是一个默认描述',
      },
    });
  });

  it('一对一关系(主)插入测试 - User <- Employee', async () => {
    const organization = await db.Organization.get(0);
    await db.User.insert({
      name: 'user1',
      password: '123456',
      description: '这是一个默认描述',
      employee: {
        name: '一对一关系(主)',
        organization,
      },
    });
  });

  it('同表多对一关系插入测试 - Organization[] -> Organization', async () => {
    const organization = await db.Organization.get(0);
    await db.Organization.insert([
      {
        name: '关联公司的部门',
        description: '关联原有记录',
        parent: organization,
      },
      {
        name: '关联新组织职员',
        description: '新建父记录并关联',
        parent: {
          name: '新部门',
        },
      },
    ]);
  });

  it('同表一对多关系插入测试 - Organization <- Organization[]', async () => {
    await db.Organization.insert({
      name: '同表一对多关系插入测试 - 部门',
      description: '这是一个默认描述',
      children: [
        {
          name: '同表一对多关系插入测试 - 子部门1',
          description: '这是一个默认描述',
        },
        {
          name: '同表一对多关系插入测试 - 子部门2',
          description: '这是一个默认描述',
        },
      ],
    });
  });

  it('多对多关系插入测试 - Employee <- EmployeePosition -> Position', async () => {
    const organization = await db.Organization.get(0);
    await db.Employee.insert({
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
  });

  // it('主从表插入测试 - Order', async () => {
  //   await db.User.add()
  // })
});
