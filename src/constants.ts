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
 * 比较运算符
 */
export type COMPARE_OPERATOR = UNARY_COMPARE_OPERATOR | BINARY_COMPARE_OPERATOR
/**
 * 比较运算符列表
 */
export enum BINARY_COMPARE_OPERATOR {
  IN = 'IN',
  NOT_IN = 'NOT IN',
  EQ = '=',
  NEQ = '<>',
  GT = '>',
  GTE = '>=',
  LT = '<',
  LTE = '<=',
  LIKE = 'LIKE',
  NOT_LIKE = 'NOT LIKE'
}

export enum UNARY_COMPARE_OPERATOR {
  IS_NULL = 'IS NULL',
  IS_NOT_NULL = 'IS NOT NULL'
}

export enum BINARY_CALCULATE_OPERATOR {
  CONCAT = '+',
  ADD = '+',
  SUB = '-',
  MUL = '*',
  DIV = '/',
  MOD = '%',
  AND = '&',
  OR = '|',
  XOR = '^',
  SHR = '>>',
  SHL = '<<',
}

export enum UNARY_CALCULATE_OPERATOR {
  NOT = '~',
  NEG = '-'
}

/**
 * 算术运算符列表
 */
export type CALCULATE_OPERATOR = BINARY_CALCULATE_OPERATOR | UNARY_CALCULATE_OPERATOR

/**
 * SQL运算符
 */
/**
 * SQL运算符
 */
export enum SQL_SYMBOLE {
  STAR = 'STAR',
  FUNCTION = 'FUNCTION',
  RAW = 'RAW',
  // ANY = '*',
  INVOKE_ARGUMENT_LIST = 'INVOKE_ARGUMENT_LIST',
  EXECUTE_ARGUMENT_LIST = 'EXECUTE_ARGUMENT_LIST',
  VARAINT_DECLARE = 'VARAINT_DECLARE',
  IDENTIFIER = 'IDENTIFIER',
  /**
   * 系统内建标识符，如COUNT, SUM等系统函数
   */
  BUILDIN_IDENTIFIER = 'BUILDIN_IDENTIFIER',
  PARAMETER = 'PARAMETER',
  TABLE_VARIANT = 'TABLE_VARIANT',
  SELECT = 'SELECT',
  UPDATE = 'UPDATE',
  INSERT = 'INSERT',
  DELETE = 'DELETE',
  EXECUTE = 'EXECUTE',
  SCALAR_FUNCTION_INVOKE = 'SCALAR_FUNCTION_INVOKE',
  TABLE_FUNCTION_INVOKE = 'TABLE_FUNCTION_INVOKE',
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
  DOCUMENT = "DOCUMENT",
  WITH = 'WITH',
  WITH_ITEM = 'WITH_ITEM'
}

export enum IDENTOFIER_KIND {
  /**
   * 表
   */
  TABLE = 'TABLE',
  /**
   * 字段
   */
  FIELD = 'FIELD',
  /**
   * 函数
   */
  FUNCTION = 'FUNCITON',
  /**
   * 存储过程
   */
  PROCEDURE = 'PROCEDURE',

  PARAMETER = 'PARAMETER',
  /**
   * 内建标识
   */
  BUILD_IN  = 'BUILD_IN',
  /**
   * 列
   */
  COLUMN = 'COLUMN',
  /**
   * 变量
   */
  VARIANT = 'VARIANT'
}

export enum FUNCTION_TYPE {
  SCALAR = 'SCALAR',
  TABLE = 'TABLE'
}

export const INSERT_MAXIMUM_ROWS = 1000
