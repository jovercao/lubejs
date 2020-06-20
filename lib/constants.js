
/**
 * @module
 * 常量模块
 */

const ASC = 'ASC'
const DESC = 'DESC'

/**
 * @enum {String} 排序方向
 */
const SortDirection = {
  ASC,
  DESC
}

const INPUT = 'INPUT'
const OUTPUT = 'OUTPUT'

/**
 * 参数方向
 * @enum {string}
 */
const ParameterDirection = {
  INPUT,
  OUTPUT
}

const READ_COMMIT = 'READ_COMMIT'
const READ_UNCOMMIT = 'READ_UNCOMMIT'
const REPEATABLE_READ = 'REPEATABLE_READ'
const SERIALIZABLE = 'SERIALIZABLE'
const SNAPSHOT = 'SNAPSHOT'

const ORDER_DIRECTION = [ASC, DESC]
const PARAMETER_DIRECTION = [INPUT, OUTPUT]
const ISOLATION_LEVEL = [READ_COMMIT, READ_UNCOMMIT, REPEATABLE_READ, SERIALIZABLE, SNAPSHOT]

// 逻辑运算符
const AND = 'AND'
const OR = 'OR'
const NOT = 'NOT'

/**
 * 逻辑运算符列表
 * @enum {string}
 */
const LOGIC_OPERATORS = {
  AND,
  OR,
  NOT
}

// ******************************** 比较运算符********************************** //
const IS_NULL = 'IS NULL'
const IS_NOT_NULL = 'IS NOT NULL'
const IN = 'IN'
const NOT_IN = 'NOT IN'
const EQ = '='
const NEQ = '<>'
const GT = '>'
const GTE = '>='
const LT = '<'
const LTE = '<='
const LIKE = 'LIKE'
const NOT_LIKE = 'NOT LIKE'

/**
 * 比较运算符列表
 */
const COMPARE_OPERATORS = [
  IS_NULL,
  IS_NOT_NULL,
  IN,
  NOT_IN,
  EQ,
  NEQ,
  GT,
  GTE,
  LT,
  LTE,
  LIKE,
  NOT_LIKE
]

// ******************************** 二元运算符 ********************************** //

const ADD = '+'
const SUB = '-'
const MUL = '*'
const DIV = '/'
const MOD = '%'
const BITAND = '&'
const BITOR = '|'
const BITNOT = '~'
const BITXOR = '^'
const SHR = '>>'
const SHL = '<<'
/**
 * 二元算术运算符列表
 */
const BINARY_OPERATORS = [
  ADD,
  SUB,
  DIV,
  MUL,
  MOD,
  BITAND,
  BITOR,
  BITNOT,
  BITXOR,
  SHR,
  SHL
]

/**
 * 聚合函数
 */
const AGGREGATE = 'AGGREGATE'

// ******************************** 一元运算符 ******************************** //
const NEGATIVE = 'NEGATIVE'

// ******************************** 符号标识 ********************************** //
const EXPR = 'EXPRESSION'
const OBJECT = 'OBJECT'
const PARAM = 'PARAM'
const VAR = 'VARAINT'
const DATATYPE = 'DATATYPE'
const SELECT = 'SELECT'
const UPDATE = 'UPDATE'
const INSERT = 'INSERT'
const DELETE = 'DELETE'
const EXEC = 'EXEC'
const ASSIGN = 'ASSIGN'
const CONST = 'CONST'
const COND = 'CONDITION'
const SORT = 'SORT'
const QUOTED = 'QUOTED'
const TABLE = 'TABLE'
const FIELD = 'FIELD'
const COLUMN = 'COLUMN'
const EXISTS = 'EXISTS'
const BINARY = 'BINARY'
const UNARY = 'BINARY'
const JOIN = 'JOIN'
const WHEN = 'WHEN'
const UNION = 'UNION'
const STATEMENT = 'STATMENT'
const ACTION = 'ACTION'
const DECLARE = 'DECLARE'
const INVOKE = 'INVOKE'
const COMPARE = 'COMPARE'
const LOGIC = 'LOGIC'

/**
 * 可被SQL常量兼容的JS类型列表
 */

const JS_CONSTANT_TYPES = [String, Date, BigInt, Number, Boolean, null, undefined]

module.exports = {
  // parameter direction
  INPUT,
  OUTPUT,

  // order direction
  ASC,
  DESC,

  // isolation level
  READ_COMMIT,
  READ_UNCOMMIT,
  REPEATABLE_READ,
  SERIALIZABLE,
  SNAPSHOT,

  PARAMETER_DIRECTION,
  ORDER_DIRECTION,
  ISOLATION_LEVEL,

  // sql symbols
  AND,
  OR,
  NOT,
  IS_NULL,
  IS_NOT_NULL,
  IN,
  NOT_IN,
  EQ,
  NEQ,
  GT,
  GTE,
  LT,
  LTE,
  LIKE,
  NOT_LIKE,
  ADD,
  SUB,
  MUL,
  DIV,
  MOD,
  BITAND,
  BITOR,
  BITNOT,
  BITXOR,
  SHR,
  SHL,
  PARAM,
  VAR,
  DATATYPE,
  SELECT,
  UPDATE,
  INSERT,
  DELETE,
  EXEC,
  INVOKE,
  ASSIGN,
  CONST,
  SORT,
  QUOTED,
  TABLE,
  FIELD,
  EXISTS,
  BINARY,
  NEGATIVE,
  UNARY,
  UNION,
  STATEMENT,
  ACTION,
  DECLARE,
  LOGIC,
  COLUMN,
  OBJECT,
  COMPARE,
  COND,
  JOIN,
  WHEN,
  EXPR,
  COMPARE_OPERATORS,
  LOGIC_OPERATORS,
  BINARY_OPERATORS,
  JS_CONSTANT_TYPES,
  SortDirection,
  ParameterDirection
}
