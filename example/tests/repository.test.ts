import { createContext, DbContext, Entity, Repository } from 'lubejs';
import { User, DB } from '../orm';

describe('ORM 测试之：repository', function () {
  this.timeout(0);
  let db: DB;
  before(async () => {
    db = await createContext<DB>();
  })

  it('插入测试 - 随机初始化一个用户', async () => {
    await db.User.add(Entity.create(User, {
      id: 0,
      name: 'newUser',
      password: '123456',
      description: '这是一个默认描述',
    }));
  })

  after(async () => {
    db.lube.close();
  })
})
