import '../../orm';
import { DB, Employee, Order, OrderDetail, User } from '../../orm';
import assert from 'assert';
import { createContext, outputCommand, SqlBuilder as SQL } from 'lubejs';

const { star, count } = SQL;

describe.only('Repository: update', function () {
  this.timeout(0);
  let db: DB;
  before(async () => {
    db = await createContext<DB>();
    db.lube.on('command', outputCommand);
    // employees = [
    //   Employee.create({
    //     user: {
    //       name: 'repository.update 测试用户1',
    //       password: '测试密码',
    //     },
    //     name: 'repository.update 测试职员1',
    //     organization: {
    //       name: 'repository.update 测试组织1',
    //     },
    //     positions: [
    //       {
    //         name: 'repository.update 测试职员1',
    //       },
    //       {
    //         name: 'repository.update 测试职员2',
    //       },
    //     ],
    //   }),
    // ];

    // await db.Employee.insert(employees);
  });

  after(async () => {
    // await db.Employee.delete(employees);
    await db.lube.close();
  });

  it('一对一(主）关系更新 - User <- Employee', async () => {
    const user: User = {
      name: '一对一（主）关系更新测试 - 用户',
      password: '嘿咻',
      employee: {
        name: '一对一（主）关系更新测试 - 职员',
        organization: await db.Organization.get(0),
      },
    };
    await db.User.submit(user);

    user.description = '更新后的用户';
    user.employee.description = '更新后的职员';

    await db.User.submit(user);

    const updated = await db.User.get(user.id, { includes: { employee: true } });
    assert(updated.description === '更新后的用户');
    assert(updated?.employee?.description === '更新后的职员');
  });

  it('一对一(从）关系更新 - Employee -> User', async () => {
    const employee: Employee = {
      name: '一对一（从）关系更新测试 - 职员',
      organization: await db.Organization.get(0),
      user: {
        name: '一对一（从）关系更新测试 - 用户',
        password: '嘿咻'
      }
    };
    await db.Employee.submit(employee);

    employee.description = '更新后的职员';
    employee.user.description = '更新后的用户';

    await db.Employee.submit(employee);

    const updated = await db.Employee.get(employee.id, { includes: { user: true } });
    assert(updated.description === '更新后的职员');
    assert(updated?.user?.description === '更新后的用户');
  });

  it('一对多关系更新 - Order <- OrderDetail', async () => {
    const order: Order = {
      orderNo: '订单号',
      date: new Date(),
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
          price: 100,
          amount: 200,
        },
      ],
    };
    await db.Order.insert(order);

    order.description = '更新后的订单';

    order.details[1].description = '修改产品2';

    order.details.push({
      product: '产品3',
      count: 3,
      price: 100,
      amount: 300,
      description: '新增产品3',
    });

    // 删除第一个
    order.details.splice(0, 1);

    await db.Order.submit(order);

    const updated = await db.Order.get(order.id, {
      includes: { details: true },
    });
    assert(updated.description === '更新后的订单', '订单更新失败');
    assert(updated.details.length === 2, '更新后的子项数量不正确');
    assert(updated.details[0].description === '修改产品2', '更新子项失败');
    assert(updated.details[1].description === '新增产品3', '新增子项失败');
  });

  it('ManyToMany 子项增删除改测试', async () => {
    const employee: Employee = {
      user: {
        name: 'abcx',
        password: 'hehe',
      },
      name: 'repository.update ManyToMany1',
      organization: await db.User.get(0),
      positions: [
        {
          name: 'ManyToMany职位1',
        },
        {
          name: 'ManyToMany职位2',
        },
      ],
    };
    employee.description = '职员更新内容';

    await db.Employee.submit(employee);

    employee.positions[1].description = '职位2更新内容';

    employee.positions.push({
      name: 'ManyToMany职位3',
    });
    employee.positions.splice(0, 1);

    await db.Employee.submit(employee);

    const updated = await db.Employee.get(employee.id, {
      includes: { positions: true },
    });
    assert(updated?.description === '职员更新内容', '职员更新失败');
    assert(updated.positions.length === 2, '关联表数目不正确');
    assert(
      updated.positions[0].name === 'ManyToMany职位2' &&
        updated.positions[0].description === '职位2更新内容'
    );
    assert((updated.positions[1].name = 'ManyToMany职位3'));
  });

  // it('联动修改测试', async () => {
  //   employees[0].description = '职员更新内容';
  //   employees[0].user.description = '用户的更新内容'
  //   employees[0].organization.description = '组织架构更新内容';
  //   for (const position of employees[0].positions) {
  //     position.description = '职位更新后的内容';
  //   }
  // });
});
