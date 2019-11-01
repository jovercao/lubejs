const _ = require('lodash')
const assert = require('assert')

const ASC = Symbol('SQL#SYMBOL#ASC')
const DESC = Symbol('SQL#SYMBOL#DESC')
const INPUT = Symbol('SQL#SYMBOL#INPUT')
const OUTPUT = Symbol('SQL#SYMBOL#OUTPUT')

const SQL_SYMBOL_STRING = Symbol('SQL#SYMBOL#STRING')
// const SQL_SYMBOL_NUMBER = Symbol('SQL#SYMBOL#SQL_SYMBOL_NUMBER')
// const SQL_SYMBOL_BOOLEAN = Symbol('SQL#SYMBOL#BOOLEAN')
// const SQL_SYMBOL_DATE = Symbol('SQL#SYMBOL#DATE')
// const SQL_SYMBOL_BUFFER = Symbol('SQL#SYMBOL#BUFFER')

const STRING = function (maxLength) {
  if (arguments.length === 0) return STRING
  assert(_.isInteger(maxLength), 'maxLength must passed by integer.')
  return {
    type: SQL_SYMBOL_STRING,
    maxLength
  }
}
STRING.type = SQL_SYMBOL_STRING
// 默认长度为255
STRING.maxLength = 255
const NUMBER = Symbol('SQL#SYMBOL#NUMBER')
const DATE = Symbol('SQL#SYMBOL#DATE')
const BOOLEAN = Symbol('SQL#SYMBOL#BOOLEAN')
const BUFFER = Symbol('SQL#SYMBOL#BUFFER')

const READ_COMMIT = Symbol('SQL#SYMBOL#READ_COMMIT')
const READ_UNCOMMIT = Symbol('SQL#SYMBOL#READ_UNCOMMIT')
const REPEATABLE_READ = Symbol('SQL#SYMBOL#REPEATABLE_READ')
const SERIALIZABLE = Symbol('SQL#SYMBOL#SERIALIZABLE')
const SNAPSHOT = Symbol('SQL#SYMBOL#SNAPSHOT')

const Types = [STRING, NUMBER, DATE, BOOLEAN, BUFFER]
const OrderDirection = [ASC, DESC]
const ParameterDirection = [INPUT, OUTPUT]
const IsolationLevel = [READ_COMMIT, READ_UNCOMMIT, REPEATABLE_READ, SERIALIZABLE, SNAPSHOT]

const $and = Symbol('SQL#SYMBOL#AND')
const $or = Symbol('SQL#SYMBOL#OR')
const $not = Symbol('SQL#SYMBOL#NOT')
const $is = Symbol('SQL#SYMBOL#IS')
const $in = Symbol('SQL#SYMBOL#IN')
const $eq = Symbol('SQL#SYMBOL#EQ')
const $neq = Symbol('SQL#SYMBOL#NEQ')
const $gt = Symbol('SQL#SYMBOL#GT')
const $gte = Symbol('SQL#SYMBOL#GTE')
const $lt = Symbol('SQL#SYMBOL#LT')
const $lte = Symbol('SQL#SYMBOL#LTE')
const $like = Symbol('SQL#SYMBOL#LIKE')
const $add = Symbol('SQL#SYMBOL#ADD')
const $sub = Symbol('SQL#SYMBOL#SUB')
const $mul = Symbol('SQL#SYMBOL#MUL')
const $div = Symbol('SQL#SYMBOL#DIV')
const $mod = Symbol('SQL#SYMBOL#MOD')
const $param = Symbol('SQL#SYMBOL#PARAM')
const $var = Symbol('SQL#SYMBOL#VAR')
const $fn = Symbol('SQL#SYMBOL#FN')
const $proc = Symbol('SQL#SYMBOL#PROC')
const $sysfn = Symbol('SQL#SYMBOL#SYSFN')
const $datatype = Symbol('SQL#SYMBOL#DATATYPE')
const $fncall = Symbol('SQL#SYMBOL#FNCALL')
const $syscall = Symbol('SQL#SYMBOL#SYSCALL')
const $select = Symbol('SQL#SYMBOL#SELECT')
const $update = Symbol('SQL#SYMBOL#UPDATE')
const $insert = Symbol('SQL#SYMBOL#INSERT')
const $delete = Symbol('SQL#SYMBOL#DELETE')
const $exec = Symbol('SQL#SYMBOL#EXEC')
const $iif = Symbol('SQL#SYMBOL#IIF')
const $proccall = Symbol('SQL#SYMBOL#PROCCALl')
const $assign = Symbol('SQL#SYMBOL#ASSIGN')
const $const = Symbol('SQL#SYMBOL#CONST')
const $quoted = Symbol('SQL#SYMBOL#QUOTED')
const $table = Symbol('SQL#SYMBOL#TABLE')
const $field = Symbol('SQL#SYMBOL#FIELD')
const $column = Symbol('SQL#SYMBOL#COLUMN')
const $exists = Symbol('SQL#SYMBOL#EXISTS')

const SqlSymbols = [
  $and,
  $or,
  $not,
  $is,
  $in,
  $eq,
  $neq,
  $gt,
  $gte,
  $lt,
  $lte,
  $like,
  $add,
  $sub,
  $mul,
  $div,
  $mod,
  $param,
  $var,
  $fn,
  $proc,
  $sysfn,
  $datatype,
  $fncall,
  $syscall,
  $select,
  $update,
  $insert,
  $delete,
  $exec,
  $iif,
  $proccall,
  $assign,
  $const,
  $field,
  $column,
  $table,
  $quoted,
  $exists
]

const SqlSymbolMapps = {
  $and,
  $or,
  $not,
  $is,
  $in,
  $eq,
  $neq,
  $gt,
  $gte,
  $lt,
  $lte,
  $like,
  $add,
  $sub,
  $mul,
  $div,
  $mod,
  $param,
  $var,
  $fn,
  $proc,
  $sysfn,
  $datatype,
  $fncall,
  $syscall,
  $select,
  $update,
  $insert,
  $delete,
  $exec,
  $iif,
  $proccall,
  $assign,
  $const,
  $field,
  $column,
  $table,
  $quoted,
  $exists
}

const SqlSymbolNames = {
  [$and]: '$and',
  [$or]: '$or',
  [$not]: '$not',
  [$is]: '$is',
  [$in]: '$in',
  [$eq]: '$eq',
  [$neq]: '$neq',
  [$gt]: '$gt',
  [$gte]: '$gte',
  [$lt]: '$lt',
  [$lte]: '$lte',
  [$like]: '$like',
  [$add]: '$add',
  [$sub]: '$sub',
  [$mul]: '$mul',
  [$div]: '$div',
  [$mod]: '$mod',
  [$param]: '$param',
  [$var]: '$var',
  [$fn]: '$fn',
  [$proc]: '$proc',
  [$sysfn]: '$sysfn',
  [$datatype]: '$datatype',
  [$fncall]: '$fncall',
  [$syscall]: '$syscall',
  [$select]: '$select',
  [$update]: '$update',
  [$insert]: '$insert',
  [$delete]: '$delete',
  [$exec]: '$exec',
  [$iif]: '$iif',
  [$proccall]: '$proccall',
  [$assign]: '$assign',
  [$const]: '$const',
  [$field]: '$field',
  [$column]: '$column',
  [$table]: '$table',
  [$quoted]: '$quoted',
  [$exists]: '$exists'
}

module.exports = {

  // parameter direction
  INPUT,
  OUTPUT,

  // order direction
  ASC,
  DESC,

  // data types
  STRING,
  NUMBER,
  DATE,
  BOOLEAN,
  BUFFER,

  // isolation level
  READ_COMMIT,
  READ_UNCOMMIT,
  REPEATABLE_READ,
  SERIALIZABLE,
  SNAPSHOT,

  ParameterDirection,
  OrderDirection,
  Types,
  IsolationLevel,

  // sql symbols

  $and,
  $or,
  $not,
  $is,
  $in,
  $eq,
  $neq,
  $gt,
  $gte,
  $lt,
  $lte,
  $like,
  $add,
  $sub,
  $mul,
  $div,
  $mod,
  $param,
  $var,
  $fn,
  $proc,
  $sysfn,
  $datatype,
  $fncall,
  $syscall,
  $select,
  $update,
  $insert,
  $delete,
  $exec,
  $iif,
  $proccall,
  $assign,
  $const,
  $table,
  $field,
  $column,
  $quoted,
  $exists,

  SqlSymbols,
  SqlSymbolMapps,
  SqlSymbolNames
}
