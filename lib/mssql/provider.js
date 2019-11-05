const mssql = require('mssql')
const {
  INPUT,
  OUTPUT,
  READ_COMMIT,
  READ_UNCOMMIT,
  SERIALIZABLE,
  REPEATABLE_READ,
  SNAPSHOT,
  STRING,
  NUMBER,
  DATE,
  BOOLEAN,
  BUFFER
} = require('../constants')

const ployfill = require('./ployfill')

const IsolationLevelMapps = {
  [READ_COMMIT]: mssql.ISOLATION_LEVEL.READ_COMMITTED,
  [READ_UNCOMMIT]: mssql.ISOLATION_LEVEL.READ_UNCOMMITTED,
  [SERIALIZABLE]: mssql.ISOLATION_LEVEL.SERIALIZABLE,
  [REPEATABLE_READ]: mssql.ISOLATION_LEVEL.REPEATABLE_READ,
  [SNAPSHOT]: mssql.ISOLATION_LEVEL.SNAPSHOT
}

const typeMapps = {
  [STRING]: mssql.NVarChar(4000),
  [NUMBER]: mssql.Real,
  [DATE]: mssql.DateTime2,
  [BOOLEAN]: mssql.Bit,
  [BUFFER]: mssql.Image
}

async function doQuery(driver, sql, params = []) {
  const request = await driver.request()
  params.forEach(({ name, value, type, direction = INPUT }) => {
    if (direction === INPUT) {
      if (type) {
        request.input(name, typeMapps[type], value)
      } else {
        request.input(name, value)
      }
    } else if (direction === OUTPUT) {
      if (value === undefined) {
        request.output(name, typeMapps[type])
      } else {
        request.output(name, typeMapps[type], value)
      }
    }
  })
  const res = await request.query(sql)
  const result = {
    rows: res.recordset,
    rowsAffected: res.rowsAffected[0],
    returnValue: res.returnValue,
    output: res.output
  }
  if (res.recordsets) {
    // 仅MSSQL支持该属性，并不推荐使用
    result._recordsets = res.recordsets
  }
  return result
}

class Provider {
  constructor(pool) {
    this._pool = pool
    // this.ployfill = ployfill
  }

  get ployfill() {
    return ployfill
  }

  async query(sql, params) {
    const res = await doQuery(this._pool, sql, params)
    return res
  }

  async beginTrans(isolationLevel) {
    const trans = this._pool.transaction()
    await trans.begin(IsolationLevelMapps[isolationLevel])
    return {
      ployfill,
      async query(sql, params) {
        const res = await doQuery(trans, sql, params)
        return res
      },
      async commit() {
        await trans.commit()
      },
      async rollback() {
        await trans.rollback()
      }
    }
  }

  /**
  * 关闭所有连接
  * @memberof Pool
  */
  async close() {
    await this._pool.close()
  }
}

module.exports = {
  Provider
}