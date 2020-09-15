/**
 * 排序方向
 */
export enum SORT_DIRECTION {
  ASC = 'ASC',
  DESC = 'DESC'
}

/**
 * 参数方向
 */
export enum PARAMETER_DIRECTION {
  INPUT = 'INPUT',
  OUTPUT = 'OUTPUT'
}

/**
 * 参数隔离方向
 */
export enum ISOLATION_LEVEL {
  READ_COMMIT = 1,
  READ_UNCOMMIT = 2,
  REPEATABLE_READ = 3,
  SERIALIZABLE = 4,
  SNAPSHOT = 5
}

/**
 * 逻辑运算符列表
 */
export enum LOGIC_OPERATOR {
  AND = 'AND',
  OR = 'OR',
  NOT = 'NOT'
}

/**
 * 比较运算符列表
 */
export enum COMPARE_OPERATOR {
  IS_NULL = 'IS NULL',
  IS_NOT_NULL = 'IS NOT NULL',
  IN = 'IN',
  NOT_IN = 'NOT IN',
  EQ = '=',
  NEQ = '<>',
  GT = '>',
  GTE = '>=',
  LT = '<',
  LTE = '<=',
  LIKE = 'LIKE',
  NOT_LIKE = 'NOT LIKE',
  EXISTS = 'EXISTS'
}

/**
 * 算术运算符列表
 */
export enum CALCULATE_OPERATOR {
  JOIN = '+',
  ADD = '+',
  SUB = '-',
  MUL = '*',
  DIV = '/',
  MOD = '%',
  BITAND = '&',
  BITOR = '|',
  BITNOT = '~',
  BITXOR = '^',
  SHR = '>>',
  SHL = '<<',
  NEG = '-',
}

/**
 * SQL运算符
 */
/**
 * SQL运算符
 */
export enum SQL_SYMBOLE {
  RAW = 'RAW',
  // ANY = '*',
  VALUE_LIST = 'VALUE_LIST',
  COLUMN_LIST = 'COLUMN_LIST',
  INVOKE_ARGUMENT_LIST = 'INVOKE_ARGUMENT_LIST',
  EXECUTE_ARGUMENT_LIST = 'EXECUTE_ARGUMENT_LIST',
  VARAINT_DECLARE = 'VARAINT_DECLARE',
  IDENTIFIER = 'IDENTIFIER',
  /**
   * 系统内建标识符，如COUNT, SUM等系统函数
   */
  BUILDIN_IDENTIFIER = 'BUILDIN_IDENTIFIER',
  PARAMETER = 'PARAMETER',
  VARAINT = 'VARAINT',
  SELECT = 'SELECT',
  UPDATE = 'UPDATE',
  INSERT = 'INSERT',
  DELETE = 'DELETE',
  EXECUTE = 'EXECUTE',
  INVOKE = 'INVOKE',
  ASSIGNMENT = 'ASSIGNMENT',
  CONSTANT = 'CONSTANT',
  // CONDITION = 'CONDITION',
  // EXPRESSION = 'EXPRESSION',
  // DATATYPE = 'DATATYPE',
  SORT = 'SORT',
  BRACKET_EXPRESSION = 'BRACKET_EXPRESSION',
  /**
   * 条件组
   */
  QUOTED_CONDITION = 'QUOTED_CONDITION',
  ALIAS = 'ALIAS',

  EXISTS = 'EXISTS',

  // BINARY = 'BINARY',
  BINARY_COMPARE = 'BINARY_COMPARE',
  BINARY_CALCULATE = 'BINARY_CALCULATE',
  BINARY_LOGIC = 'BINARY_LOGIC',

  // UNARY = 'UNARY',
  UNARY_COMPARE = 'UNARY_COMPARE',
  UNARY_CALCULATE = 'UNARY_CALCULATE',
  UNARY_LOGIC = 'UNARY_LOGIC',
  JOIN = 'JOIN',
  UNION = 'UNION',
  WHEN = 'WHEN',
  CASE = 'CASE',
  DECLARE = 'DECLARE',
  DOCUMENT = "DOCUMENT"
}

export const INSERT_MAXIMUM_ROWS = 1000
