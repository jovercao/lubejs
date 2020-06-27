const _ = require('lodash')
const { assert, ast } = require('./util')
const {
  Condition,
  Alias,
  Parameter,
  DataType,
  Select,
  Insert,
  Update,
  Delete,
  Constant,
  Variant,
  Bracket,
  Invoke,
  Identity,
  Execute
} = require('./ast')

const {
  ParameterDirection,
  SortDirection
} = require('./constants')

/**
 * 将制作table的代理，用于生成字段
 * @param {Proxy} table
 * @returns
 */
function makeAutoFieldTableProxy(table) {
  return new Proxy(table, {
    get(target, prop) {
      if (_.isSymbol(prop) || prop.startsWith('$') || Object.prototype.hasOwnProperty.call(target, prop)) {
        return target[prop]
      }
      return new Field(prop, table)
    }
  })
}

const sql = {
  /**
   * not 查询条件运算
   */
  not: Condition.not,
  /**
   * 使用and关联多个查询条件
   * @static
   * @param {*} conditions 要关联的查询条件列表
   * @returns {*} condition
   * @memberof SQL
   */
  and: Condition.and,
  /**
   * 使用or关联多个查询条件
   * @static
   * @param {*} conditions 要关联的查询条件列表
   * @returns {*} condition
   * @memberof SQL
   */
  or: Condition.or,

  /**
   * exists语句
   * @static
   * @param {*} select
   * @returns
   * @memberof SQL
   */
  exists: Condition.exists,
  /**
   * 创建一个表格标识
   * @param {*} name
   * @returns
   */
  table(name, schema, database) {
    return makeAutoFieldTableProxy(new Identity(name, schema, database))
  },
  invoke(func, params) {
    return new Invoke(func, params)
  },
  exec(proc, params) {
    return new Execute(proc, params)
  },
  /**
   * 字段引用
   * @param {*} name
   * @param {*} table
   * @returns
   */
  field(name, table) {
    return new Identity(name, table)
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
  bracket(evalExp) {
    return new Bracket(ast(evalExp))
  },
  /**
   * input 参数
   */
  input(name, value) {
    return new Parameter(name, value, ParameterDirection.INPUT)
  },
  /**
   * output参数
   */
  output(name, type, value) {
    return new Parameter(name, type, value, ParameterDirection.OUTPUT)
  },
  /**
   * 变量引用
   * @param {*} name
   * @returns
   */
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
  alias(exp, name) {
    assert(_.isString(name), '列名必须为字符串')
    return new Alias(exp, name)
  },

  /**
   * 创建一个SELECT SQL对象
   * @static
   * @param {array} columns 列列表
   * @returns
   * @memberof SQL
   */
  select(...columns) {
    return new Select().columns(...columns)
  },

  /**
   * 创建一个insert SQL 对象
   * @static
   * @returns {InsertStatement} insert sql 对象
   * @memberof SQL
   */
  insert(table) {
    return new Insert().into(table)
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
    return new Update().from(table)
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
    return new Delete().from(table)
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
    return new Identity('*')
  },
  // ************************** 系统函数区 *************************
  count(exp) {
    return new Invoke('count', [exp])
  },
  stdev(field) {
    assert(field instanceof Field, 'field must type of Field')
    return new Invoke('stdev', [field])
  },
  sum(exp) {
    return new Invoke('sum', [exp])
  },
  avg(exp) {
    return new Invoke('avg', [exp])
  },
  max(exp) {
    return new Invoke('max', [exp])
  },
  min(exp) {
    return new Invoke('min', [exp])
  },
  nvl(exp, defaults) {
    return new Invoke('nvl', [exp, defaults])
  },
  abs(exp) {
    return new Invoke('abs', [exp])
  },
  ceil(exp) {
    return new Invoke('ceil', [exp])
  },
  exp(exp) {
    return new Invoke('exp', [exp])
  },
  square(exp) {
    return new Invoke('square', [exp])
  },
  floor(exp) {
    return new Invoke('floor', [exp])
  },
  round(exp, digit) {
    return new Invoke('round', [exp, digit])
  },
  sign(exp) {
    return new Invoke('sign', [exp])
  },
  sqrt(exp) {
    return new Invoke('sqrt', [exp])
  },
  power(exp, pwr) {
    return new Invoke('power', [exp, pwr])
  }
  // code(char) {
  //   return new Invoke('code', [char], true)
  // },
  // char(code) {
  //   return new Invoke('char', [code], true)
  // },
  // now() {
  //   return new Invoke('now', null, true)
  // },
  // convert(exp, type) {
  //   assert([STRING, NUMBER, DATE, BOOLEAN, BUFFER].includes(type), 'type must be in STRING/NUMBER/DATE/BOOLEAN/BUFFER')
  //   return new Invoke('cast', [type, exp], true)
  // },
  // ltrim(str) {
  //   return new Invoke('ltrim', [str])
  // },
  // rtrim(str) {
  //   return new Invoke('rtrim', [str])
  // },
  // guid() {
  //   return new Invoke('guid')
  // },
  // indexOf(strExp, matchExp, startIndex) {
  //   assert()
  //   const params = [strExp, matchExp]
  //   if (startIndex) {
  //     params.push(startIndex)
  //   }
  //   return new Invoke('indexof', params)
  // },
  // len(exp) {
  //   return new Invoke('len', [exp])
  // },
  // substr(str, start, len) {
  //   return new Invoke('substr', [str, start, len])
  // },
  // upper(str) {
  //   return new Invoke('upper', [str])
  // },
  // lower(str) {
  //   return new Invoke('lower', [str])
  // },
  // iif(condition, affirm, defaults) {
  //   return new IIF(condition, affirm, defaults)
  // },
  // datatype(type) {
  //   return new DataType(type)
  // }
}

module.exports = sql
