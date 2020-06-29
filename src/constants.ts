/**
 * 排序方向
 */
export enum SortDirection {
  ASC = 'ASC',
  DESC = 'DESC'
}

/**
 * 参数方向
 */
export enum ParameterDirection {
  INPUT = 'INPUT',
  OUTPUT = 'OUTPUT'
}

/**
 * 参数隔离方向
 */
export enum IsolationLevel {
  READ_COMMIT = 1,
  READ_UNCOMMIT = 2,
  REPEATABLE_READ = 3,
  SERIALIZABLE = 4,
  SNAPSHOT = 5
}

/**
 * 逻辑运算符列表
 */
export enum LogicOperator {
  AND = 'AND',
  OR = 'OR',
  NOT = 'NOT'
}

/**
 * 比较运算符列表
 */
export enum CompareOperator {
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
export enum ComputeOperator {
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
export enum SqlSymbol {
  AGGREGATE = 'AGGREGATE',
  EXPRESSION = 'EXPRESSION',
  IDENTITY = 'IDENTITY',
  PARAMETER = 'PARAMETER',
  VARAINT = 'VARAINT',
  DATATYPE = 'DATATYPE',
  SELECT = 'SELECT',
  UPDATE = 'UPDATE',
  INSERT = 'INSERT',
  DELETE = 'DELETE',
  EXECUTE = 'EXECUTE',
  INVOKE = 'INVOKE',
  ASSIGNMENT = 'ASSIGNMENT',
  CONSTANT = 'CONSTANT',
  CONDITION = 'CONDITION',
  SORT = 'SORT',
  BRACKET = 'BRACKET',
  ALIAS = 'ALIAS',
  BINARY = 'BINARY',
  UNARY = 'UNARY',
  JOIN = 'JOIN',
  UNION = 'UNION',
  WHEN = 'WHEN',
  CASE = 'CASE',
  DECLARE = 'DECLARE',
  DOCUMENT = "DOCUMENT"
}

export enum DataType {
  STRING = 'STRING',
  INTEGER = 'INTEGER',
  FLOAT = 'FLOAT',
  BOOLEAN = 'BOOLEAN',
  DATE = 'DATE'
}
