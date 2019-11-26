const sql = require('mssql')

describe.only('mssql demo', function () {
  const dbConfig = {
    user: 'sa',
    password: '!crgd-2019',
    server: 'jover.wicp.net',
    database: 'erp-dev',
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

  it.only('属性访问测试', () => {
    const obj = {
      type: 'Statement'
    }

    let i = 0
    while (i < 10000000) {
      i++
      const x = obj.type
    }
  })

  it.only('键值访问测试', () => {
    const met = Symbol('X')
    const obj = {
      [met]: 'Statement'
    }

    let i = 0
    while (i < 10000000) {
      i++
      const x = Object.getOwnPropertySymbols(obj)[0]
      const v = obj[x]
    }
  })

  it('测试事务回滚', async () => {
    // 经测试发现，某些条件下事务会自动回滚，在我们再次调用回滚时则会发生异常
    const pool = await sql.connect(dbConfig)

    const trans = pool.transaction()
    await trans.begin()
    try {
      const req2 = trans.request()

      await req2.query("INSERT INTO [Product]([code],[queryCode],[drugName],[goodsName],[specs],[unit],[producerId],[operatorId],[productType],[taxrate],[createdAt],[updatedAt]) VALUES('10000', 'ZXY', '朱秀英', 'Maria', '8mg', '合', 2249, 1, 'Drug', 0.13, CONVERT(DATETIME, '2019-11-13 21:34:39.120'), CONVERT(DATETIME, '2019-11-13 21:34:39.120'))")

      await trans.commit()
    } catch (ex) {
      await trans.rollback()
      throw ex
    }
  })

  // 发现在事务范围内都不生效 set identity_insert on
  it('测试 identity_insert 作用域', async () => {
    dbConfig.server = dbConfig.host
    const pool = await require('mssql').connect(dbConfig)
    const trans = pool.transaction()
    await trans.begin()
    try {
      const req = trans.request()
      await req.query('SET identity_insert [Items] ON')
      const req2 = trans.request()
      // id is the identity column
      await req2.query("INSERT INTO [Items](Fid, Fname) VALUES(1, 'aName')")
      // throw error: Cannot insert explicit value for identity column in table 'Department' when IDENTITY_INSERT is set to OFF.
      await trans.commit()
    } catch (ex) {
      await trans.rollback()
      throw ex
    }
  })
})
