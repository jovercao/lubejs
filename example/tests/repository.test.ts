import assert from 'assert';
import { createContext, DbContext, Entity, Repository } from 'lubejs';
import { DateTime } from 'mssql';
import { User, DB, OrderDetail } from '../orm';

describe('ORM 测试之：repository', function () {
  this.timeout(0);
  let db: DB;
  before(async () => {
    db = await createContext<DB>();
  });
  after(async () => {
    db.lube.close();
  });

  it('单条记录插入 - User', async () => {
    const user: User = User.create({
      name: 'user1',
      password: '123456',
      description: '这是一个默认描述',
    });
    await db.User.insert(user);

    const newUser = await db.User.get(user.id);
    assert.deepStrictEqual(user, newUser);
  });

  it('多对一关系插入测试 - OrderDetail -> Order', async () => {
    await db.getRepository(OrderDetail).insert({
      product: '产品1',
      count: 1,
      price: 100.00,
      amount: 100.00,
      order: {
        date: new Date(),
        orderNo: '202001010001',
      }
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
          amount: 400
        }
      ]
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
        organization
      }
    });
  });

  it('同表多对一关系插入测试 - Organization[] -> Organization', async () => {
    const organization = await db.Organization.get(0);
    await db.Organization.insert([{
      name: '关联公司的部门',
      description: '关联原有记录',
      parent: organization
    }, {
      name: '关联新组织职员',
      description: '新建父记录并关联',
      parent: {
        name: '新部门'
      }
    }]);
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
        }
      ]
    });
  });

  it.only('多对多关系插入测试 - Employee <- EmployeePosition -> Position', async () => {
    const organization = await db.Organization.get(0);
    const user = await db.User.get(0);
    await db.Employee.insert({
      name: '多对多关系插入测试 - 职员',
      description: '多对多关系插入测试 - Employee <- EmployeePosition -> Position',
      organization,
      user,
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
