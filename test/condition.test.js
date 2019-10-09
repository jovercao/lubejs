const oracledb = require('../index')
const assert = require('power-assert')

describe.skip('数据库条构建', function () {
  const { Condition: { $not, $eq, $uneq, $lt, $gt, $lte, $gte, $like, $isnull, $notnull, $in, $notin, $and, $or } } = oracledb

  it('条件构建测试', async function () {
    const where = $eq('ID', 1).and($uneq('ID', 0)).and($in('ID', [0, 1, 2, 3])).and(
      $or(
        $like('NAME', '%冷%'),
        $lt('ID', 1),
        $gt('ID', 1),
        $lte('ID', 1),
        $gte('ID', 1),
        $not($isnull('NAME')),
        $in('ID', [1, 2, 3]),
        $notin('ID', [1, 2, 3]),
        $notnull('ID')
      )
    )
    console.dir(where.value)

    // const connection = await oracledb.connect({
    //   user: 'test',
    //   password: 'test',
    //   connectString: 'rancher/ORCL'
    // })

    // const rows = await connection.select('ITEMS', {
    //   where: where.value
    // })

    // console.log(rows)
  })
})
