/**
 * 排序方向
 */
export type SORT_DIRECTION = 'ASC' | 'DESC';

// {
//   ASC = 'ASC',
//   DESC = 'DESC'
// }

/**
 * 参数方向
 */
export type PARAMETER_DIRECTION = 'INPUT' | 'OUTPUT';

/**
 * 参数隔离方向
 */
export type ISOLATION_LEVEL = 'READ_COMMIT' | 'READ_UNCOMMIT' | 'REPEATABLE_READ' | 'SERIALIZABLE' | 'SNAPSHOT';

/**
 * 逻辑运算符列表
 */
export enum LOGIC_OPERATOR {
  AND = 'AND',
  OR = 'OR',
  NOT = 'NOT',
}

/**
 * 比较运算符
 */
export type COMPARE_OPERATOR = UNARY_COMPARE_OPERATOR | BINARY_COMPARE_OPERATOR;
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
  NOT_LIKE = 'NOT LIKE',
}

export enum UNARY_COMPARE_OPERATOR {
  IS_NULL = 'IS NULL',
  IS_NOT_NULL = 'IS NOT NULL',
}

export enum BINARY_OPERATION_OPERATOR {
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

export enum UNARY_OPERATION_OPERATOR {
  NOT = '~',
  NEG = '-',
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
  EXPRESSION = 'EXPRESSION',
  CREATE_TABLE_COLUMN = 'CREATE_TABLE_COLUMN',
  STAR = 'STAR',
  FUNCTION = 'FUNCTION',
  RAW = 'RAW',
  STATEMENT = 'STATEMENT',
  // ANY = '*',
  INVOKE_ARGUMENT_LIST = 'INVOKE_ARGUMENT_LIST',
  EXECUTE_ARGUMENT_LIST = 'EXECUTE_ARGUMENT_LIST',
  VARAINT_DECLARE = 'VARAINT_DECLARE',
  TABLE_VARIANT_DECLARE = 'TABLE_VARIANT_DECLARE',
  IDENTIFIER = 'IDENTIFIER',
  TABLE = 'TABLE',
  IDENTITY_VALUE = 'IDENTITY_VALUE',
  STANDARD_EXPRESSION = 'STANDARD_EXPRESSION',
  SCALAR_FUNCTION_INVOKE = 'SCALAR_FUNCTION_INVOKE',
  TABLE_FUNCTION_INVOKE = 'TABLE_FUNCTION_INVOKE',
  LITERAL = 'LITERAL',
  SORT = 'SORT',
  JOIN = 'JOIN',
  UNION = 'UNION',
  WHEN = 'WHEN',
  CASE = 'CASE',
  DOCUMENT = 'DOCUMENT',
  WITH = 'WITH',
  BRACKET_EXPRESSION = 'BRACKET_EXPRESSION',
  NAMED_SELECT = 'NAMED_SELECT',
  WITH_SELECT = "WITH_SELECT",
  OPERATION = 'OPERATION',
  VALUED_SELECT = 'VALUED_SELECT',
  PRIMARY_KEY = 'CREATE_TABLE_PRIMARY_KEY',
  FOREIGN_KEY = 'FOREIGN_KEY',
  ALTER_TABLE_DROP_MEMBER = 'ALTER_TABLE_DROP_COLUMN',
  ALTER_TABLE_DROP_CONSTRAINT = 'ALTER_TABLE_DROP_CONSTRAINT',
  CHECK_CONSTRAINT = 'CHECK_CONSTRAINT',
  UNIQUE_KEY = 'UNIQUE_KEY',
  PROCEDURE_PARAMETER = 'PROCEDURE_PARAMETER',
  ALTER_TABLE_COLUMN = 'ALTER_TABLE_COLUMN',
  CONDITION = "CONDITION"
}
































































export enum STATEMENT_KIND {
  // RAW = 'RAW',
  SELECT = 'SELECT',
  UPDATE = 'UPDATE',
  INSERT = 'INSERT',
  EXECUTE = 'EXECUTE',
  DELETE = 'DELETE',
  DECLARE = 'DECLARE',
  ASSIGNMENT = 'ASSIGNMENT',
  CREATE_TABLE = 'CREATE_TABLE',
  CREATE_PROCEDURE = 'CREATE_PROCEDURE',
  CREATE_FUNCTION = 'CREATE_FUNCTION',
  CREATE_INDEX = 'CREATE_INDEX',
  CREATE_VIEW = 'CREATE_VIEW',
  ALTER_PROCEDURE = 'ALTER_PROCEDURE',
  ALTER_VIEW = 'ALTER_VIEW',
  ALTER_FUNCTION = 'ALTER_FUNCTION',
  ALTER_TABLE = 'ALTER_TABLE',
  DROP_VIEW = 'DROP_VIEW',
  DROP_FUNCTION = 'DROP_FUNCETION',
  DROP_PROCEDURE = 'DROP_PROCEDURE',
  DROP_TABLE = 'DROP_TABLE',
  DROP_INDEX = 'DROP_INDEX',
  BLOCK = 'BLOCK',
  STANDARD_STATEMENT = 'STANDARD_STATEMENT',
  CREATE_SEQUENCE = 'CREATE_SEQUENCE',
  DROP_SEQUENCE = 'DROP_SEQUENCE',
  ANNOTATION = 'ANNOTATION',
  IF = 'IF',
  WHILE = 'WHILE',
  BREAK = 'BREAK',
  CONTINUE = 'CONTINUE',
  DROP_DATABASE = "DROP_DATABASE",
  CREATE_DATABASE = "CREATE_DATABASE",
  ALTER_DATABASE = "ALTER_DATABASE",
  USE = "USE",
  RETURN = "RETURN"
}

export enum SQL_SYMBOLE_TABLE_MEMBER {
  PRIMARY_KEY = 'PRIMARY_KEY',
  FOREIGN_KEY = 'FOREIGN_KEY',
  COLUMN = 'COLUMN',
  CHECK_CONSTRAINT = 'CHECK_CONSTRAINT',
  UNIQUE_KEY = 'UNIQUE_KEY',
}

// export type SQL_SYMBOLE_EXPRESSION =
//   | SQL_SYMBOLE.IDENTIFIER
//   | SQL_SYMBOLE.OPERATION
//   | SQL_SYMBOLE.SCALAR_FUNCTION_INVOKE
//   | SQL_SYMBOLE.CASE
//   | SQL_SYMBOLE.LITERAL
//   | SQL_SYMBOLE.VALUED_SELECT
//   | SQL_SYMBOLE.BRACKET_EXPRESSION
//   | SQL_SYMBOLE.IDENTITY_VALUE
//   | SQL_SYMBOLE.STANDARD_EXPRESSION;

export enum CONDITION_KIND {
  BRACKET_CONDITION = 'BRACKET_CONDITION',
  UNARY_COMPARE = 'UNARY_COMPARE',
  BINARY_COMPARE = 'BINARY_COMPARE',
  BINARY_LOGIC = 'BINARY_LOGIC',
  UNARY_LOGIC = 'UNARY_LOGIC',
  EXISTS = 'EXISTS',
}

export enum OPERATION_KIND {
  BINARY = 'BINARY',
  UNARY = 'UNARY',
  CONVERT = 'CONVERT',
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
  PROCEDURE = 'PROCEDURE',

  PARAMETER = 'PARAMETER',
  /**
   * 内建标识
   */
  BUILT_IN = 'BUILT_IN',
  /**
   * 别名
   */
  ALIAS = 'ALIAS',
  /**
   * 列
   */
  COLUMN = 'COLUMN',
  /**
   * 变量
   */
  VARIANT = 'VARIANT',
  /**
   * 表变量
   */
  TABLE_VARIANT = 'TABLE_VARIANT',
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

export const $IsProxy = Symbol('#IS_PROXY');

export const ROWSET_ALIAS = '__T__';

export const $ROWSET_INSTANCE = Symbol('$ROWSET_INSTANCE');
