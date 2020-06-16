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

const AND = 'AND'
const OR = 'OR'
const NOT = 'NOT'
const IS = 'IS'
const IN = 'IN'
const EQ = 'EQ'
const NEQ = 'NEQ'
const GT = 'GT'
const GTE = 'GTE'
const LT = 'LT'
const LTE = 'LTE'
const LIKE = 'LIKE'
const ADD = 'ADD'
const SUB = 'SUB'
const MUL = 'MUL'
const DIV = 'DIV'
const MOD = 'MOD'
const PARAM = 'PARAM'
const VAR = 'VAR'
const FUNC = 'FN'
const PROC = 'PROC'
const SYSFN = 'SYSFN'
const DATATYPE = 'DATATYPE'
const FNCALL = 'FNCALL'
const SYSCALL = 'SYSCALL'
const SELECT = 'SELECT'
const UPDATE = 'UPDATE'
const INSERT = 'INSERT'
const DELETE = 'DELETE'
const EXEC = 'EXEC'
const IIF = 'IIF'
const EXECUTE = 'PROCCALL'
const ASSIGN = 'ASSIGN'
const CONST = 'CONST'
const SORT = 'SORT'
const QUOTED = 'QUOTED'
const TABLE = 'TABLE'
const FIELD = 'FIELD'
const EXISTS = 'EXISTS'
const BINARY = 'BINARY'
const UNARY = 'BINARY'
const UNION = 'UNION'
const ALIAS = 'ALIAS'
const STATEMENT = 'STATMENT'
const ACTION = 'ACTION'
const DECLARE = 'DECLARE'
const INVOKE = 'INVOKE'
const LOGIC = 'LOGIC'

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
  LOGIC
}
