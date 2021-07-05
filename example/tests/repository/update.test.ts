import '../../orm';
import { DB, Employee, Order, OrderDetail } from '../../orm';
import { assert, createContext, outputCommand, SqlBuilder as SQL } from 'lubejs';

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

  it.only('一对多关系更新 - Order <- OrderDetail', async () => {
    const order: Order = {
      orderNo: '订单号',
      date: new Date(),
      details: [
        {
          product: '产品1',
          count: 1,
          price: 100,
          amount: 100
        },
        {
          product: '产品2',
          count: 2,
          price: 100,
          amount: 200
        }
      ]
    };
    await db.Order.insert(order);

    order.description = '更新后的订单';

    order.details[1].description = '修改产品2'

    order.details.push({
      product: '产品3',
      count: 3,
      price: 100,
      amount: 300,
      description: '新增产品3'
    })

    // 删除第一个
    order.details.splice(0, 1);

    await db.Order.submit(order);

    const updated = await db.Order.get(order.id);
    assert(updated.description === '更新后的订单', '订单更新失败');
    assert(updated.details.length === 2, '更新后的子项数量')
    assert(updated.details[0].description === '修改产品2', '更新子项失败');
    assert(updated.details[1].description === '新增产品3', '新增子项失败');
  });

  // it('ManyToMany 子项增删除改测试', async () => {
  //   employees[0].description = '职员更新内容';
  //   employees[0].user.description = '用户的更新内容'
  //   employees[0].organization.description = '组织架构更新内容';
  //   for (const position of employees[0].positions) {
  //     position.description = '职位更新后的内容';
  //   }
  // });

  // it('联动修改测试', async () => {
  //   employees[0].description = '职员更新内容';
  //   employees[0].user.description = '用户的更新内容'
  //   employees[0].organization.description = '组织架构更新内容';
  //   for (const position of employees[0].positions) {
  //     position.description = '职位更新后的内容';
  //   }
  // });
});
