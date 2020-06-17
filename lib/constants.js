const ASC = 'ASC'
const DESC = 'DESC'
const INPUT = 'INPUT'
const OUTPUT = 'OUTPUT'

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
 */
const LOGIC_OPERATORS = [
  AND,
  OR,
  NOT
]

// 比较运算符
const IS = 'IS'
const IN = 'IN'
const EQ = '='
const NEQ = '<>'
const GT = '>'
const GTE = '>='
const LT = '<'
const LTE = '<='
const LIKE = 'LIKE'

/**
 * 比较运算符列表
 */
const COMPARE_OPERATORS = [
  IS,
  IN,
  EQ,
  NEQ,
  GT,
  GTE,
  LT,
  LTE,
  LIKE
]

// 二元运算符
const ADD = 'ADD'
const SUB = 'SUB'
const MUL = 'MUL'
const DIV = 'DIV'
const MOD = 'MOD'
/**
 * 二元算术运算符列表
 */
const BINARY_OPERATORS = [
  ADD,
  SUB,
  DIV,
  MUL,
  MOD
]

// 符号标识

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
const SORT = 'SORT'
const QUOTED = 'QUOTED'
const TABLE = 'TABLE'
const FIELD = 'FIELD'
const COLUMN = 'COLUMN'
const EXISTS = 'EXISTS'
const BINARY = 'BINARY'
const UNARY = 'BINARY'
const UNION = 'UNION'
const STATEMENT = 'STATMENT'
const ACTION = 'ACTION'
const DECLARE = 'DECLARE'
const INVOKE = 'INVOKE'
const COMPARE = 'COMPARE'
const LOGIC = 'LOGIC'

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
  IS,
  IN,
  EQ,
  NEQ,
  GT,
  GTE,
  LT,
  LTE,
  LIKE,
  ADD,
  SUB,
  MUL,
  DIV,
  MOD,
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
  UNARY,
  UNION,
  STATEMENT,
  ACTION,
  DECLARE,
  LOGIC,
  COLUMN,
  OBJECT,
  COMPARE,
  COMPARE_OPERATORS,
  LOGIC_OPERATORS,
  BINARY_OPERATORS,
  JS_CONSTANT_TYPES
}
