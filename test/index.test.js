const lube = require('../index')
const assert = require('power-assert')
const mock = require('mockjs')
const _ = require('lodash')

describe('数据库测试', function () {
  this.timeout(0)
  let conn

  const dbConfig = {
    user: 'sys',
    password: 'oracle',
    connectString: 'rancher-vm/orcl',
    privilege: lube.Provider.SYSDBA
  }

  before(async function() {
    conn = await lube.connect(dbConfig)
    // conn.on('execute', command => {
    //   console.log(command)
    // })
  })

  after(async function() {
    conn.close()
  })

  it('create table', async function() {
    const createTable =
    `create table Items
    (
      FId NUMBER(4) PRIMARY KEY,
      FName VARCHAR2(120),
      FAge Number(4),
      FSex Number(1),
      FCreateDate Date
    )`
    conn.query(createTable)
  })

  it('insert', async function () {
    const { rows } = mock.mock({
      // 属性  的值是一个数组，其中含有 1 到 10 个元素
      'rows|1-50': [{
        // 属性 id 是一个自增数，起始值为 1，每次增 1
        'FID|+1': 1,
        'FAge|18-60': 1,
        'FSex|0-1': 0,
        FName: '@name',
        FCreateDate: new Date()
      }]
    })

    for (const row of rows) {
      const lines = await conn.insert('Items', row)
      assert(lines === 1)
    }
  })

  it('find', async function () {
    const item = await conn.find('Items', {
      FID: 1
    })
    assert(item)
  })

  it('update', async function () {
    const lines = await conn.update('Items', {
      FNAME: '冷蒙',
      FAGE: 21,
      FSEX: 0
    }, {
      FID: 1
    })
    assert(lines === 1)
  })

  it('select', async function () {
    const { field: $, not: $not } = lube
    const where = $('FID').eq(1)
      .and($('FID').uneq(0))
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

    const rows = await conn.select('Items', {
      where,
      offset: 0,
      limit: 1
    })
    assert(rows.length === 1)
    assert(rows[0].FNAME === '冷蒙')
    assert(rows[0].FSEX === 0)
  })

  it('select all', async () => {
    const rows = await conn.select('Items')
    assert(_.isArray(rows))
  })
  it('delete', async function () {
    const lines = await conn.delete('Items', {
      FID: 1
    })

    assert(lines === 1)
  })

  it('drop table', async function() {
    await conn.query('drop table Items')
  })
})
