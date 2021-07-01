import { createContext, DbContext, Entity, Repository } from 'lubejs';
import { User, DB } from '../orm';

describe('ORM 测试之：repository', function () {
  this.timeout(0);
  let db: DB;
  before(async () => {
    db = await createContext<DB>();
  })
  after(async () => {
    db.lube.close();
  })

  it('插入测试 - 随机初始化一个用户', async () => {
    await db.Employee.add({
        name: '职员2',
        description: '测试',
        positions: [
          {
            name: '测试职位2'
          }
        ],
        user: {
          name: 'newUser2',
          password: '123456',
          description: '这是一个默认描述',
        }
    });
  })

  it.only('插入测试 - 插入职员，及新用户', async () => {
    await db.Employee.add({
        name: '职员2',
        description: '测试',
        positions: [
          {
            name: '测试职位2'
          }
        ],
        user: {
          name: 'newUser2',
          password: '123456',
          description: '这是一个默认描述',
        }
    });
  })

  it('插入测试 - 插入职员，及新多对多职位', async () => {
    await db.Employee.add({
        name: '职员2',
        description: '测试',
        positions: [
          {
            name: '测试职位2'
          }
        ]
    });
  })

  // it('主从表插入测试 - Order', async () => {
  //   await db.User.add()
  // })


})
