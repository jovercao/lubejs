const _ = require('lodash')
const { assert, ast } = require('./util')
const {
  Condition,
  Table,
  Field,
  Column,
  Fn,
  Parameter,
  Procedure,
  DataType,
  SelectStatement,
  InsertStatement,
  UpdateStatement,
  DeleteStatment,
  Constant,
  Variant,
  Quoted,
  SysFnCall,
  IIF
} = require('./ast')

const { INPUT, OUTPUT, NUMBER, STRING, BOOLEAN, DATE, BUFFER } = require('./constants')

/**
 * 将制作table的代理，用于生成字段
 * @param {*} table
 * @returns
 */
function makeAutoFieldTableProxy(table) {
  return new Proxy(table, {
    get(target, prop) {
      const value = target[prop]
      if (!_.isUndefined(value)) {
        return value
      }
      if (_.isSymbol(prop) || prop.startsWith('_') || Object.prototype.hasOwnProperty.call(target, prop)) {
        return value
      }
      return new Field(prop, table)
    }
  })
}

const sql = {
  not: Condition.not,
  /**
   * 创建一个表格标识
   * @param {*} name
   * @returns
   */
  table(name, schema, database) {
    return makeAutoFieldTableProxy(new Table(name, schema, database))
  },
  // /**
  //  * 视图
  //  * @param {*} name
  //  * @returns
  //  */
  // view(name) {
  //   return makeAutoFieldTableProxy(new View(name))
  // },
  /**
   * 函数
   * @param {*} name
   * @param {*} schema
   * @param {*} database
   * @returns
   */
  fn(name, schema, database) {
    return new Fn(name, schema, database)
  },
  proc(name, schema, database) {
    return new Procedure(name, schema, database)
  },
  /**
   * 字段引用
   * @param {*} name
   * @param {*} table
   * @returns
   */
  field(name, table) {
    return new Field(name, table)
  },
  /**
   * 常量表达式
   */
  const(value) {
    return new Constant(value)
  },
  /**
   * 括号表达式
   * @param {*} evalExp
   * @returns
   */
  quoted(evalExp) {
    return new Quoted(ast(evalExp))
  },

  input(name, value) {
    return new Parameter(name, undefined, value, OUTPUT)
  },

  output(name, type, value) {
    return new Parameter(name, type, value, OUTPUT)
  },

  variant(name) {
    return new Variant(name)
  },

  /**
   * 创建一个列
   * @static
   * @param {string} name 名称
   * @param {*} exp 当不传递该参数时，默认为字段名
   * @returns {Column} 返回列实例
   * @memberof SQL
   */
  column(exp, name) {
    assert(_.isString(name), '列名必须为字符串')
    return new Column(exp, name)
  },

  /**
   * exists语句
   * @static
   * @param {*} select
   * @returns
   * @memberof SQL
   */
  exists(select) {
    assert(select instanceof SelectStatement, 'exists子句必须接select语句')
    return Condition.exists(select)
  },

  /**
   * 创建一个SELECT SQL对象
   * @static
   * @param {array} columns 列列表
   * @returns
   * @memberof SQL
   */
  select(columns) {
    if (!(arguments.length === 1 && _.isPlainObject(columns))) {
      if (!_.isArray(columns)) {
        columns = [...arguments]
      }
    }
    return new SelectStatement({ columns })
  },

  /**
   * 创建一个insert SQL 对象
   * @static
   * @returns {InsertStatement} insert sql 对象
   * @memberof SQL
   */
  insert(table) {
    return new InsertStatement({ table })
  },

  /**
   * 创建一个update sql 对象
   * @static
   * @param {*} ...tables
   * @param {*} sets
   * @param {*} where
   * @returns
   * @memberof SQL
   */
  update(table) {
    return new UpdateStatement({ table })
  },

  /**
   * 创建一个delete SQL 对象
   * @static
   * @param {*} table
   * @param {*} where
   * @returns
   * @memberof SQL
   */
  delete(table) {
    return new DeleteStatment({ table })
  },

  /**
   * 创建一个delete SQL 对象
   * delete 别名
   * @param {*} table
   */
  del(table) {
    return sql.delete(table)
  },

  all() {
    return new Field('*')
  },
  // ************************** 系统函数区 *************************
  now() {
    return new SysFnCall('now')
  },
  count(exp) {
    return new SysFnCall('count', [exp])
  },
  convert(exp, type) {
    assert([STRING, NUMBER, DATE, BOOLEAN, BUFFER].includes(type), 'type must be in STRING/NUMBER/DATE/BOOLEAN/BUFFER')
    return new SysFnCall('cast', [type, exp])
  },
  stdev(field) {
    assert(field instanceof Field, 'field must type of Field')
    return new SysFnCall('stdev', [field])
  },
  sum(exp) {
    return new SysFnCall('sum', [exp])
  },
  avg(exp) {
    return new SysFnCall('avg', [exp])
  },
  max(exp) {
    return new SysFnCall('max', [exp])
  },
  min(exp) {
    return new SysFnCall('min', [exp])
  },
  nvl(exp, defaults) {
    return new SysFnCall('nvl', [exp, defaults])
  },
  abs(exp) {
    return new SysFnCall('abs', [exp])
  },
  ceil(exp) {
    return new SysFnCall('ceil', [exp])
  },
  exp(exp) {
    return new SysFnCall('exp', [exp])
  },
  floor(exp) {
    return new SysFnCall('floor', [exp])
  },
  round(exp, digit) {
    return new SysFnCall('round', [exp, digit])
  },
  sign(exp) {
    return new SysFnCall('sign', [exp])
  },
  sqrt(exp) {
    return new SysFnCall('sqrt', [exp])
  },
  power(exp, pwr) {
    return new SysFnCall('power', [exp, pwr])
  },
  code(char) {
    return new SysFnCall('code', [char])
  },
  char(code) {
    return new SysFnCall('char', [code])
  },
  ltrim(str) {
    return new SysFnCall('ltrim', [str])
  },
  rtrim(str) {
    return new SysFnCall('rtrim', [str])
  },
  guid() {
    return new SysFnCall('guid')
  },
  indexOf(strExp, matchExp, startIndex) {
    assert()
    const params = [strExp, matchExp]
    if (startIndex) {
      params.push(startIndex)
    }
    return new SysFnCall('indexof', params)
  },
  len(exp) {
    return new SysFnCall('len', [exp])
  },
  substr(str, start, len) {
    return new SysFnCall('substr', [str, start, len])
  },
  upper(str) {
    return new SysFnCall('upper', [str])
  },
  lower(str) {
    return new SysFnCall('lower', [str])
  },
  iif(condition, affirm, defaults) {
    return new IIF(condition, affirm, defaults)
  },
  datatype(type) {
    return new DataType(type)
  }
}

module.exports = sql
