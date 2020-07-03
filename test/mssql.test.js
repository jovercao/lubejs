const lube = require('..');
const assert = require('assert');
const mock = require('mockjs');
const _ = require('lodash');

const { table, select, $case, identifier, invoke, any, variant, fn, sysFn, sp, exists, count, SortDirection, output } = lube;

describe('MSSQL数据库测试', function () {
  this.timeout(0);
  let db;
  const driver = require('./dirvers/mssql')
  assert(_.isFunction(driver))
  const dbConfig = {
    driver,
    user: 'sa',
    password: '!crgd-2019',
    host: 'jover.wicp.net',
    // instance: 'MSSQLSERVER',
    database: 'TEST',
    port: 2433,
    // 最小值
    poolMin: 0,
    // 最大值
    poolMax: 5,
    // 闲置连接关闭等待时间
    idelTimeout: 30000,
    // 连接超时时间
    connectTimeout: 15000,
    // 请求超时时间
    requestTimeout: 15000
  };

  const sqlLogs = true;

  before(async function () {
    db = await lube.connect(dbConfig);
    if (sqlLogs) {
      db.on('command', (cmd) => {
        console.log('sql:', cmd.sql);
        if (cmd.params && cmd.params.length > 0) {
          console.log('params:', cmd.params);
        }
      });
    }
    // try {
    //   await db.query('drop function dosomething');
    //   await db.query('drop PROC doProc');
    // } finally {
    // }
    await db.query(`CREATE FUNCTION dosomething(
        @x int
    )
    RETURNS INT
    BEGIN
        return @x
    END`);

    await db.query(`CREATE PROC doProc(
      @i int,
      @o nvarchar(20) output
    )
    AS
    BEGIN
      set @o = 'hello world'
      return @i
    END`);
  });

  after(async function () {
    await db.query('drop function dosomething');
    await db.query('drop PROC doProc');
    db.close();
  });

  it('create table', async function () {
    const createTable = `create table Items (
      FId INT IDENTITY(1,1) PRIMARY KEY,
      FName NVARCHAR(120),
      FAge INT,
      FSex BIT,
      FCreateDate DATETIME,
      Flag TIMESTAMP NOT NULL
    )`;
    await db.query(createTable);
    // console.dir(rs)
  });

  it('query', async function () {
    const rs1 = await db.query('select [Name] = @p1, [Age] = @p2', {
      p1: 'name',
      p2: '100'
    });
    console.log(rs1);
    assert(rs1.rows[0].Name === 'name');

    const name = 'Jover';
    const rs2 = await db.query`select [Name] = ${name}, [Age] = ${19}`;
    assert(rs2.rows[0].Name === name);

    const rs3 = await db.query('select @@identity f1, @@identity f2');
    console.log(rs3);
  });

  it('insert', async function () {
    const { rows } = mock.mock({
      // 属性  的值是一个数组，其中含有 1 到 10 个元素
      'rows|100': [{
        // 属性 id 是一个自增数，起始值为 1，每次增 1
        // 'FID|+1': 1,
        'FAge|18-60': 1,
        'FSex|0-1': false,
        FName: '@name',
        FCreateDate: new Date()
      }]
    });

    const lines = await db.insert('Items', rows);
    assert(lines === rows.length);
  });

  it('insert statement', async function () {
    const row = mock.mock({
      // 属性 id 是一个自增数，起始值为 1，每次增 1
      // 'FID|+1': 10000,
      'FAge|18-60': 1,
      'FSex|0-1': false,
      FName: '@name',
      FCreateDate: new Date()
    });
    const sql = lube.insert('Items').values(row);
    const { rowsAffected } = await db.query(sql);
    assert(rowsAffected === 1);

    const sql2 = lube.select(lube.variant('@IDENTITY').as('id'));
    const res2 = await db.query(sql2);
    assert(res2.rows[0].id > 0);
  });

  it('find', async function () {
    const item = await db.find('Items', {
      FID: 1
    });
    assert(item);
  });

  it('update', async function () {
    const lines = await db.update('Items', {
      FNAME: '冷蒙',
      FAGE: 21,
      FSEX: false
    }, {
      FID: 1
    });
    assert(lines === 1);
  });

  it('update statement', async function () {
    const a = lube.table('items');
    const sql = lube.update(a)
      .set({
        fname: '哈罗',
        fage: 100,
        fsex: true
      })
      .where(a.field('fid').eq(2));
    const { rowsAffected } = await db.query(sql);
    assert(rowsAffected === 1);
  });

  it('update statement -> join update', async function () {
    const a = lube.table('items').as('a');
    const b = lube.table('items').as('b');
    const sql = lube.update(a)
      .set({
        fname: '哈罗',
        fage: 100,
        fsex: true
      })
      .from(a)
      .join(b, b.fid.eq(a.fid))
      .where(a.fid.eq(2));
    const { rowsAffected } = await db.query(sql);
    assert(rowsAffected === 1);
  });

  it('select', async function () {
    const rows = await db.select('Items', {
      where: {
        fid: [1, 10, 11, 12, 13, 14]
      },
      sorts: {
        fid: SortDirection.ASC
      },
      offset: 0,
      limit: 1
    });
    assert.strictEqual(rows.length, 1);
    assert.strictEqual(rows[0].FName, '冷蒙');
    assert.strictEqual(rows[0].FSex, false);
  });

  it('select statement -> multitest', async function () {
    const a = table('Items').as('a');
    const b = table('Items').as('b');

    const sql = select(
      $case(a.fsex).when(true, '男').else('女').as('性别'),
      sysFn('GETDATE')().as('Now'),
      fn('dbo', 'dosomething')(100),
      // 子查询
      select(1).as('field'),
      a.fid.as('aid'),
      b.fid.as('bid')
    )
      .from(a)
      .join(b, a.fid.eq(b.fid))
      .where(exists(select(1)))
      .groupBy(a.fid, b.fid, a.fsex)
      .having(count(a.fid).gte(1))
      .offset(50)
      .limit(10)
      .orderBy(a.fid.asc());

    let { rows } = await db.query(sql);
    console.log(rows[0]);
    assert(_.isDate(rows[0].Now), '不是日期类型');
    assert(rows[0].aid === 51, '数据不是预期结果');
    assert(['男', '女'].includes(rows[0]['性别']), '性别不正确');
    assert(rows.length === 10, '查询到的数据不正确');

    const sql2 = select(a.fid, a.fsex).from(a).distinct();
    await db.query(sql2);

    const sql3 = select(count(any()).as('count')).from(a);
    rows = (await db.query(sql3)).rows;
    assert(rows[0].count > 0);
  });

  it('select statement -> join', async function () {
    const { table, select, input } = lube;
    const o = table('sysobjects').as('o');
    const p = table('sys', 'extended_properties').as('p');
    const sql = select(
      o.$id,
      o.$name,
      p.$value.as('desc'),
      input('inputValue', 1000).as('inputValue'))
    .from(o)
    .leftJoin(p, p.major_id.eq(o.id)
      .and(p.minor_id.eq(0))
      .and(p.class.eq(1))
      .and(p.$name.eq('MS_Description')))
    .where(o.$type.in('U', 'V'));
    const { rows } = await db.query(sql);
    assert(rows.length > 0);
  });

  it('select all', async () => {
    const rows = await db.select('Items');
    assert(_.isArray(rows));
  });

  it('trans -> rollback', async () => {
    const srcRows = await db.select('Items');
    try {
      await db.trans(async (executor, abort) => {
        let lines = await executor.delete('Items');
        assert(lines > 0);
        const row = {
          FNAME: '中华人民共和国',
          FAGE: 70,
          FSEX: false
        };
        lines = await executor.insert('Items', row);
        assert(lines > 0);

        const t = table('Items');
        const item = (await executor.query(select(t.any()).from(t).where(t.FId.eq(variant('@identity'))))).rows[0];
        assert.strictEqual(item.FName, row.FNAME);
        throw new Error('事务错误回滚测试');
      });
    } catch (ex) {
      console.log(ex)
      assert(ex.message === '事务错误回滚测试');
    }

    const rows2 = await db.select('Items');
    assert.deepStrictEqual(rows2, srcRows);
  });

  it('trans -> commit', async () => {
    await db.trans(async (executor) => {
      await executor.query('SET identity_insert [Items] ON');
      const lines = await executor.insert('Items', {
        // FId: 10000,
        FName: '添加测试',
        FSex: false,
        FAge: 18
      });
      assert(lines > 0);
      await executor.query('SET identity_insert [Items] OFF');
    });

    const rows = await db.select('Items');
    assert(rows.length > 0);
  });

  it('delete', async function () {
    const lines = await db.delete('Items');
    assert(lines >= 1);
  });

  it('sp(name)(...params)', async function () {
    const p2 = output('o', String);
    const sql = sp('doProc')(1, p2);
    const res = await db.query(sql);

    console.log(res);
    assert(res.returnValue === 1);
    assert(p2.value === 'hello world');
  });

  it('db.execute(sp, [...args])', async function () {
    const p2 = output('o', 'NVARCHAR(MAX)');
    await db.execute('doProc', [1, p2]);
    assert(p2.value === 'hello world');
  });

  it('drop table', async function () {
    await db.query('drop table Items');
  });
});
