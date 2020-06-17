const ASC = 'ASC'
const DESC = 'DESC'
const INPUT = 'INPUT'
const OUTPUT = 'OUTPUT'

const READ_COMMIT = 'READ_COMMIT'
const READ_UNCOMMIT = 'READ_UNCOMMIT'
const REPEATABLE_READ = 'REPEATABLE_READ'
const SERIALIZABLE = 'SERIALIZABLE'
const SNAPSHOT = 'SNAPSHOT'

const OrderDirection = [ASC, DESC]
const ParameterDirection = [INPUT, OUTPUT]
const IsolationLevel = [READ_COMMIT, READ_UNCOMMIT, REPEATABLE_READ, SERIALIZABLE, SNAPSHOT]

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
const EQ = 'EQ'
const NEQ = 'NEQ'
const GT = 'GT'
const GTE = 'GTE'
const LT = 'LT'
const LTE = 'LTE'
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

const PARAM = 'PARAM'
const VAR = 'VARAINT'
const FUNC = 'FUNC'
const PROC = 'PROC'
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
const NOT = 'NOT'


AST_TYPES = [
  PARAM,
  VAR,
  FUNC
]

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

  ParameterDirection,
  OrderDirection,
  IsolationLevel,

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
  FUNC,
  PROC,
  SYSFN,
  DATATYPE,
  FNCALL,
  SYSCALL,
  SELECT,
  UPDATE,
  INSERT,
  DELETE,
  EXEC,
  IIF,
  EXECUTE,
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
  ALIAS,
  STATEMENT,
  ACTION,
  DECLARE,
  INVOKE,
  LOGIC,
  COMPARE_OPERATORS,
  LOGIC_OPERATORS,
  BINARY_OPERATORS
}
