/**
 * 排序方向
 */
export enum SORT_DIRECTION {
  ASC = "ASC",
  DESC = "DESC",
}

/**
 * 参数方向
 */
export enum PARAMETER_DIRECTION {
  INPUT = "INPUT",
  OUTPUT = "OUTPUT",
}

/**
 * 参数隔离方向
 */
export enum ISOLATION_LEVEL {
  READ_COMMIT = 1,
  READ_UNCOMMIT = 2,
  REPEATABLE_READ = 3,
  SERIALIZABLE = 4,
  SNAPSHOT = 5,
}

/**
 * 逻辑运算符列表
 */
export enum LOGIC_OPERATOR {
  AND = "AND",
  OR = "OR",
  NOT = "NOT",
}

/**
 * 比较运算符
 */
export type COMPARE_OPERATOR = UNARY_COMPARE_OPERATOR | BINARY_COMPARE_OPERATOR;
/**
 * 比较运算符列表
 */
export enum BINARY_COMPARE_OPERATOR {
  IN = "IN",
  NOT_IN = "NOT IN",
  EQ = "=",
  NEQ = "<>",
  GT = ">",
  GTE = ">=",
  LT = "<",
  LTE = "<=",
  LIKE = "LIKE",
  NOT_LIKE = "NOT LIKE",
}

export enum UNARY_COMPARE_OPERATOR {
  IS_NULL = "IS NULL",
  IS_NOT_NULL = "IS NOT NULL",
}

export enum BINARY_OPERATION_OPERATOR {
  CONCAT = "+",
  ADD = "+",
  SUB = "-",
  MUL = "*",
  DIV = "/",
  MOD = "%",
  AND = "&",
  OR = "|",
  XOR = "^",
  SHR = ">>",
  SHL = "<<",
}

export enum UNARY_OPERATION_OPERATOR {
  NOT = "~",
  NEG = "-",
}

/**
 * 算术运算符列表
 */
export type OPERATION_OPERATOR =
  | BINARY_OPERATION_OPERATOR
  | UNARY_OPERATION_OPERATOR;

/**
 * SQL运算符
 */
/**
 * SQL运算符
 */

export enum SQL_SYMBOLE {
  STAR = "STAR",
  FUNCTION = "FUNCTION",
  RAW = "RAW",
  // ANY = '*',
  INVOKE_ARGUMENT_LIST = "INVOKE_ARGUMENT_LIST",
  EXECUTE_ARGUMENT_LIST = "EXECUTE_ARGUMENT_LIST",
  VARAINT_DECLARE = "VARAINT_DECLARE",
  IDENTIFIER = "IDENTIFIER",
  SELECT = "SELECT",
  UPDATE = "UPDATE",
  INSERT = "INSERT",
  DELETE = "DELETE",
  EXECUTE = "EXECUTE",
  SCALAR_FUNCTION_INVOKE = "SCALAR_FUNCTION_INVOKE",
  TABLE_FUNCTION_INVOKE = "TABLE_FUNCTION_INVOKE",
  ASSIGNMENT = "ASSIGNMENT",
  CONSTANT = "CONSTANT",
  SORT = "SORT",
  JOIN = "JOIN",
  UNION = "UNION",
  WHEN = "WHEN",
  CASE = "CASE",
  DECLARE = "DECLARE",
  DOCUMENT = "DOCUMENT",
  WITH = "WITH",
  NAMED_SELECT = "NAMED_SELECT",
  WITH_SELECT = "WITH_SELECT",
  CONDITION = "CONDITION",
  OPERATION = "OPERATION",
  VALUED_SELECT = "VALUED_SELECT",
}

export type SQL_SYMBOLE_EXPRESSION =
  | SQL_SYMBOLE.IDENTIFIER
  | SQL_SYMBOLE.OPERATION
  | SQL_SYMBOLE.SCALAR_FUNCTION_INVOKE
  | SQL_SYMBOLE.CASE
  | SQL_SYMBOLE.CONSTANT
  | SQL_SYMBOLE.VALUED_SELECT;

export enum CONDITION_KIND {
  GROUP = "GROUP",
  UNARY_COMPARE = "UNARY_COMPARE",
  BINARY_COMPARE = "BINARY_COMPARE",
  BINARY_LOGIC = "BINARY_LOGIC",
  UNARY_LOGIC = "UNARY_LOGIC",
  EXISTS = "EXISTS",
}

export enum OPERATION_KIND {
  BINARY = "BINARY_CALCULATE",
  UNARY = "UNARY_CALCULATE",
}

export enum IDENTOFIER_KIND {
  /**
   * 表
   */
  TABLE = "TABLE",
  /**
   * 字段
   */
  FIELD = "FIELD",
  /**
   * 函数
   */
  FUNCTION = "FUNCITON",
  // /**
  //  * 标量函数
  //  */
  // SCALAR_FUNCTION ='SCALAR_FUNCTION',
  // /**
  //  * 表值函数
  //  */
  // TABLE_FUNCTION = 'TABLE_FUNCTION',
  /**
   * 存储过程
   */
  PROCEDURE = "PROCEDURE",

  PARAMETER = "PARAMETER",
  /**
   * 内建标识
   */
  BUILD_IN = "BUILD_IN",
  /**
   * 别名
   */
  ALIAS = "ALIAS",
  /**
   * 列
   */
  COLUMN = "COLUMN",
  /**
   * 变量
   */
  VARIANT = "VARIANT",
  /**
   * 表变量
   */
  TABLE_VARIANT = "TABLE_VARIANT",
  // /**
  //  * 命名参数
  //  */
  // NAMED_ARGUMENT = 'NAMED_ARGUMENT',
}

export const INSERT_MAXIMUM_ROWS = 1000;

// /**
//  * 函数类型
//  */
// export enum FUNCTION_TYPE {
//   SCALAR = 'SCALAR',
//   TABLE = 'TABLE'
// }
