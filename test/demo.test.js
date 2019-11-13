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

  it('测试事务回滚', async () => {
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
})
