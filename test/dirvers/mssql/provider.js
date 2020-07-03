const mssql = require('mssql')
const _ = require('lodash')
const {
  ParameterDirection,
  IsolationLevel
} = require('../../../lib/constants')

const ployfill = require('./ployfill')

const IsolationLevelMapps = {
  [IsolationLevel.READ_COMMIT]: mssql.ISOLATION_LEVEL.READ_COMMITTED,
  [IsolationLevel.READ_UNCOMMIT]: mssql.ISOLATION_LEVEL.READ_UNCOMMITTED,
  [IsolationLevel.SERIALIZABLE]: mssql.ISOLATION_LEVEL.SERIALIZABLE,
  [IsolationLevel.REPEATABLE_READ]: mssql.ISOLATION_LEVEL.REPEATABLE_READ,
  [IsolationLevel.SNAPSHOT]: mssql.ISOLATION_LEVEL.SNAPSHOT
}

const jsTypeMapps = new Map([
  [String, mssql.NVarChar(4000)],
  [Number, mssql.Real],
  [Date, mssql.DateTime2],
  [Boolean, mssql.Bit],
  [Buffer, mssql.Image],
  [BigInt, mssql.BigInt],
  [Buffer, mssql.Binary]
])

const strTypeMapps = {}
Object.entries(mssql.TYPES).forEach(([name, dbType]) => {
  strTypeMapps[name.toUpperCase()] = dbType
})

const typeReg = /^\s*(?<type>\w+)\s*(?:\(\s*((?<max>max)|((?<p1>\d+)(\s*,\s*(?<p2>\d+))?))\s*\))?\s*$/

function parseStringType(type) {
  const matched = typeReg.exec(type)
  if (!matched) {
    throw new Error('错误的数据库类型名称：' + type)
  }
  const sqlType = strTypeMapps[matched.groups.type.toUpperCase()]
  if (!sqlType) {
    throw new Error('不受支持的数据库类型：' + type)
  }
  if (matched.groups.max) {
    return sqlType(mssql.MAX)
  }
  return sqlType(matched.groups.p1, matched.groups.p2)
}

const sqlTypes = Object.values(mssql.TYPES)
function parseType(type) {
  if (!type) throw Error('类型不能为空！')
  // 如果本身就是类型，则不进行转换
  if (sqlTypes.includes(type) || sqlTypes.includes(type.type)) {
    return type
  }
  if (_.isString(type)) {
    return parseStringType(type)
  }
  const sqlType = jsTypeMapps[type]
  if (!sqlType) {
    throw new Error('不受支持的类型：' + type.name || type)
  }
}

async function doQuery(driver, sql, params = []) {
  const request = await driver.request()
  params.forEach(({ name, value, dataType: type, direction = ParameterDirection.INPUT }) => {
    const sqlType = parseType(type)
    if (direction === ParameterDirection.INPUT) {
      if (type) {
        request.input(name, sqlType, value)
      } else {
        request.input(name, value)
      }
    } else if (direction === ParameterDirection.OUTPUT) {
      if (value === undefined) {
        request.output(name, sqlType)
      } else {
        request.output(name, sqlType, value)
      }
    }
  })
  let res
  try {
    res = await request.query(sql)
  } catch (ex) {
    await request.cancel()
    throw ex
  }
  Object.entries(res.output).forEach(([name, value]) => {
    const p = params.find(p => p.name === name)
    p.value = value
    if (p.name === ployfill.returnValueParameter) {
      res.returnValue = value
    }
  })
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

  async beginTrans(isolationLevel = IsolationLevel.READ_COMMIT) {
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
        if (!trans._aborted) {
          await trans.rollback()
        }
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
