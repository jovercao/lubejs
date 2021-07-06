import '../../orm';
import { DB, Employee, Order, OrderDetail, User } from '../../orm';
import assert from 'assert';
import { createContext, outputCommand, SqlBuilder as SQL } from 'lubejs';

const { star, count } = SQL;

describe.only('Repository: delete', function () {
  this.timeout(0);
  let db: DB;
  let outputSql: boolean = true;
  before(async () => {
    db = await createContext<DB>();
    if (outputSql) {
      db.lube.on('command', outputCommand);
    }
  });

  after(async () => {
    await db.lube.close();
  });

  it('一对一(主）关系删除 - User <- Employee', async () => {
    const employee = Employee.create({
      name: '一对一（主）关系更新测试 - 职员',
      organization: await db.Organization.get(0),
    });

    const user = User.create({
      name: '一对一（主）关系更新测试 - 用户',
      password: '嘿咻',
      employee,
    });

    await db.save(user);

    user.description = '更新后的用户';
    user.employee.description = '更新后的职员';

    await db.User.delete(user, { withDetail: true });

    const deletedUser = await db.User.get(user.id);
    const deletedEmployee = await db.Employee.get(employee.id);
    assert(!deletedUser);
    assert(!deletedEmployee);
  });

  it.only('一对多关系删除 - Order <- OrderDetail', async () => {
    const order = Order.create({
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
    });
    await db.insert(order);

    const newOrder = await db.get(Order, order.id, { withDetail: true });

    assert(newOrder.details.length === 2);

    await db.Order.delete(newOrder, { withDetail: true });

    const deleted = await db.get(Order, order.id, {
      includes: { details: true },
    });

    const deletedDetails = await db.getQueryable(OrderDetail).filter(p => p.orderId.eq(newOrder.id)).fetchAll();

    assert(!deleted);
    assert(deletedDetails.length == 0);
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

    await db.Employee.save(employee);

    employee.positions[1].description = '职位2更新内容';

    employee.positions.push({
      name: 'ManyToMany职位3',
    });
    employee.positions.splice(0, 1);

    await db.Employee.save(employee);

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
});
