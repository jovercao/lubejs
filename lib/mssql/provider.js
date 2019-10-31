const mssql = require('mssql')
const { INPUT, OUTPUT, READ_COMMIT, READ_UNCOMMIT, SERIALIZABLE, REPEATABLE_READ, SNAPSHOT } = require('../constants')
const ployfill = require('./ployfill')

const IsolationLevelMapps = {
  [READ_COMMIT]: mssql.ISOLATION_LEVEL.READ_COMMITTED,
  [READ_UNCOMMIT]: mssql.ISOLATION_LEVEL.READ_UNCOMMITTED,
  [SERIALIZABLE]: mssql.ISOLATION_LEVEL.SERIALIZABLE,
  [REPEATABLE_READ]: mssql.ISOLATION_LEVEL.REPEATABLE_READ,
  [SNAPSHOT]: mssql.ISOLATION_LEVEL.SNAPSHOT
}

async function doQuery(driver, sql, params) {
  const request = await driver.request()
  params.forEach(({ name, value, direction }) => {
    if (direction === INPUT) {
      request.input(name, value)
    } else if (direction === OUTPUT) {
      request.output(name, value)
    }
  })
  const res = await request.query(sql)
  return {
    rows: res.recordset,
    rowsAffected: res.rowsAffected[0]
  }
}

class Provider {
  constructor(pool) {
    this._pool = pool
  }

  get ployfill() {
    return ployfill
  }

  async query(sql, params) {
    const res = await doQuery(this._pool, sql, params)
    return res
  }

  async trans(isolationLevel) {
    const trans = this._pool.transaction()
    await trans.begin(IsolationLevelMapps[isolationLevel])
    return {
      ployfill,
      async query(sql, params) {
        await doQuery(trans, sql, params)
      },
      async commit() {
        await trans.commit()
      },
      async rollback() {
        await trans.rollback()
      }
    }
  }

  async commit() {}
}

module.exports = {
  Provider
}
