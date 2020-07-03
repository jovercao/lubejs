const mssql = require('mssql')
/**
 * 语法兼容模块
 */

// const sysfnMapps = {
//   now: 'GetDate()',
//   guid: 'NewId()',
//   indexof: 'CharIndex($1)',
//   substr: 'Substring($1)',
//   len: 'Len($1)',
//   code: 'Ascii($1)',
//   convert: 'Convert($2, $1)'
// }

// const typeMapps = {
//   [STRING]: 'VarChar(MAX)',
//   [NUMBER]: 'Real',
//   [DATE]: 'DateTime2',
//   [BOOLEAN]: 'Bit',
//   [BUFFER]: 'Image'
// }

module.exports = {
  /**
   * 标识符引用，左
   */
  quotedLeft: '[',
  /**
   * 标识符引用，右
   */
  quotedRight: ']',

  /**
   * 参数前缀
   */
  parameterPrefix: '@',

  /**
   * 变量前缀
   */
  variantPrefix: '@',

  /**
   * 集合别名连接字符，默认为 ''
   */
  setsAliasJoinWith: 'AS',

  /**
   * 字段别名连接字符器，默认为 ''
   */
  fieldAliasJoinWith: 'AS',
  /**
   * 存储过程返回值参数
   */
  returnValueParameter: '__return_value__',

  executeKeyword: 'EXECUTE'
}
