const oracledb = require('../index')
const assert = require('power-assert')

describe('连接数据库测试', function () {
  let connection

  it('connect', async function () {
    connection = await oracledb.connect({
      user: 'test',
      password: 'test',
      connectString: 'rancher/ORCL'
    })
  })

  it('insert', async function () {
    const lines = await connection.insert('ITEMS', {
      ID: 1,
      NAME: '王炸',
      CREATE_DATE: new Date(),
      DESCRIPTION: '没有什么要说的'
    })

    assert(lines === 1)
  })

  it('find', async function () {
    const item = await connection.find('ITEMS', {
      ID: 1
    })
    assert(item.NAME === '王炸')
  })

  it('update', async function () {
    const lines = await connection.update('ITEMS', {
      NAME: '冷蒙'
    }, {
      ID: 1
    })
    assert(lines === 1)
  })

  it('select', async function () {
    const rows = await connection.select('ITEMS', {
      where: {
        ID: 1,
        NAME: {
          $like: '%冷%'
        }
      },
      offset: 0,
      limit: 1
    })
    assert(rows.length === 0)
  })

  it('delete', async function () {
    const lines = await connection.delete('ITEMS', {
      ID: 1
    })

    assert(lines === 1)
  })
})
