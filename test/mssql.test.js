const lube = require('../index')
const assert = require('assert')
const mock = require('mockjs')
const _ = require('lodash')

describe('MSSQL数据库测试', function () {
  this.timeout(0)
  let pool

  const dbConfig = {
    dialect: 'mssql',
    user: 'sa',
    password: '!crgd-2019',
    host: 'jover.wicp.net',
    // instance: 'MSSQLSERVER',
    database: 'TEST',
    port: 1433,
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
  }

  const sqlLogs = true

  before(async function () {
    pool = await lube.connect(dbConfig)
    pool.on('command', cmd => {
      sqlLogs && console.log(cmd)
    })

    await pool.query(`CREATE FUNCTION dosomething(
    @x int
)
RETURNS INT
BEGIN
    return @x
END`)
  })

  after(async function () {
    await pool.query('drop function dosomething')
    pool.close()
  })

  it('create table', async function () {
    const createTable = `create table Items (
      FId INT PRIMARY KEY,
      FName NVARCHAR(120),
      FAge INT,
      FSex BIT,
      FCreateDate DATETIME,
      Flag TIMESTAMP NOT NULL
    )`
    await pool.query(createTable)
    // console.dir(rs)
  })

  it('query', async function () {
    const rs1 = await pool.query('select [Name] = @p1, [Age] = @p2', {
      p1: 'name',
      p2: '100'
    })
    assert(rs1.rows[0].Name === 'name')

    const name = 'Jover'
    const rs2 = await pool.query`select [Name] = ${name}, [Age] = ${19}`
    assert(rs2.rows[0].Name === name)
  })

  it('insert', async function () {
    const { rows } = mock.mock({
      // 属性  的值是一个数组，其中含有 1 到 10 个元素
      'rows|100': [{
        // 属性 id 是一个自增数，起始值为 1，每次增 1
        'FID|+1': 1,
        'FAge|18-60': 1,
        'FSex|0-1': false,
        FName: '@name',
        FCreateDate: new Date()
      }]
    })

    const lines = await pool.insert('Items', rows)
    assert(lines === rows.length)
  })

  it('insert statement', async function () {
    const row = mock.mock({
      // 属性 id 是一个自增数，起始值为 1，每次增 1
      'FID|+1': 10000,
      'FAge|18-60': 1,
      'FSex|0-1': false,
      FName: '@name',
      FCreateDate: new Date()
    })
    const sql = lube.insert('Items').values(row)
    const { rowsAffected } = await pool.query(sql)
    assert(rowsAffected === 1)
  })

  it('find', async function () {
    const item = await pool.find('Items', {
      FID: 1
    })
    assert(item)
    console.log(item.Flag)
  })

  it('update', async function () {
    const lines = await pool.update('Items', {
      FNAME: '冷蒙',
      FAGE: 21,
      FSEX: false
    }, {
      FID: 1
    })
    assert(lines === 1)
  })

  it('update statement', async function () {
    const a = lube.table('items').as('a')
    const sql = lube.update(a)
      .set({
        fname: '哈罗',
        fage: 100,
        fsex: true
      })
      .from(a)
      .where(a.fid.eq(10000))
    const { rowsAffected } = await pool.query(sql)
    assert(rowsAffected === 1)
  })

  it('update statement -> join update', async function () {
    const a = lube.table('items').as('a')
    const b = lube.table('items').as('b')
    const sql = lube.update(a)
      .set(
        a.fname.assign('哈罗'),
        a.fage.assign(100),
        a.fsex.assign(true)
      )
      .from(a)
      .join(b, b.fid.eq(a.fid))
      .where(a.fid.eq(10000))
    const { rowsAffected } = await pool.query(sql)
    assert(rowsAffected === 1)
  })

  it('select', async function () {
    const $ = lube.field

    const where = $('FID').eq(1)
      .and($('FID').neq(0))
      .and($('FID').in([0, 1, 2, 3]))
      .and(
        $('FNAME').like('%冷%')
          .or($('FID').eq(1))
          .or($('FID').gt(1))
          .or($('FID').lte(1))
          .or($('FID').gte(1))
          .or($('FNAME').notnull())
          .or($('FID').in([1, 2, 3]))
          .or($('FID').notin([1, 2, 3]))
          .or($('FID').notnull())
      )
      .and(
        $('FID').eq(1)
          .and($('FNAME').eq('冷蒙'))
          .and($('FID').in(1, 2, 3, 4))
      )

    const rows = await pool.select('Items', {
      where,
      orders: {
        fid: 'asc'
      },
      offset: 0,
      limit: 1
    })
    assert(rows.length === 1)
    assert(rows[0].FName === '冷蒙')
    assert(rows[0].FSex === false)
  })

  it('select statement', async function () {
    const { table, select, now, fn, iif, exists } = lube

    const a = table('Items').as('a')
    const b = table('Items').as('b')

    const sql = select(
      iif(a.fsex.eq(true), '男', '女').as('性别'),
      now().as('Now'),
      fn('dosomething', 'dbo').call(100),
      // 子查询
      select(1).value().as('field'),
      a.fid.as('aid'),
      b.fid.as('bid')
    )
      .from(a)
      .join(b, a.fid.eq(b.fid))
      .where(exists(select(1)))
      .groupby(a.fid, b.fid, a.fsex)
      .orderby(a.fid)
      .offset(50)
      .limit(10)

    const { rows } = await pool.query(sql)
    console.log(rows[0])
    assert(_.isDate(rows[0].Now), '不是日期类型')
    assert(rows[0].aid === 51, '数据不是预期结果')
    assert(['男', '女'].includes(rows[0]['性别']), '性别不正确')
    assert(rows.length === 10, '查询到的数据不正确')
  })

  it('select statement', async function () {
    const { table, select } = lube
    const o = table('sysobjects').as('o')
    const p = table('extended_properties', 'sys').as('p')
    const sql = select({
      id: o.id,
      name: o.name,
      desc: p.value
    })
      .from(o)
      .leftJoin(p, p.major_id.eq(o.id)
        .and(p.minor_id.eq(0))
        .and(p.class.eq(1))
        .and(p.name.eq('MS_Description')))
      .where(o.type.in('U', 'V'))
    const { rows } = await pool.query(sql)
    assert(rows.length > 0)
  })

  it('select all', async () => {
    const rows = await pool.select('Items')
    assert(_.isArray(rows))
  })

  it('trans -> rollback', async () => {
    pool.trans(async (executor, abort) => {
      const lines = await executor.delete('Items')
      assert(lines > 0)
      await abort()
    })

    const rows = await pool.select('Items')
    assert(rows.length > 0)
  })

  it('trans -> commit', async () => {
    await pool.trans(async (executor, cancel) => {
      const lines = await executor.insert('Items', {
        FId: 1024,
        FName: '添加测试',
        FSex: false,
        FAge: 18
      })
      assert(lines > 0)
      await cancel()
    })

    const rows = await pool.select('Items')
    assert(rows.length > 0)
  })

  it('delete', async function () {
    const lines = await pool.delete('Items')
    assert(lines >= 1)
  })

  it('drop table', async function () {
    await pool.query('drop table Items')
  })
})
