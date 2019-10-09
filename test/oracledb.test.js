const oracledb = require('oracledb')

describe.skip('oracledb 库测验', async function () {
  const dbConfig = {
    user: 'sys',
    password: 'oracle',
    connectString: 'rancher-vm/orcl',
    privilege: oracledb.SYSDBA
  }

  let conn

  before(async () => {
    conn = await oracledb.getConnection(dbConfig)
  })

  it('是否允许使用in运算符', async () => {
    const res = await conn.execute('select 1 from dual where 1 in (:x1, :x2, :x3)', [1, 2, 3])
    console.log(res)
  })

  after(async () => {
    conn.close()
  })
})
