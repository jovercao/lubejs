"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SqlSymbol = exports.ComputeOperator = exports.CompareOperator = exports.LogicOperator = exports.IsolationLevel = exports.ParameterDirection = exports.SortDirection = void 0;
/**
 * 排序方向
 */
var SortDirection;
(function (SortDirection) {
    SortDirection["ASC"] = "ASC";
    SortDirection["DESC"] = "DESC";
})(SortDirection = exports.SortDirection || (exports.SortDirection = {}));
/**
 * 参数方向
 */
var ParameterDirection;
(function (ParameterDirection) {
    ParameterDirection["INPUT"] = "INPUT";
    ParameterDirection["OUTPUT"] = "OUTPUT";
})(ParameterDirection = exports.ParameterDirection || (exports.ParameterDirection = {}));
/**
 * 参数隔离方向
 */
var IsolationLevel;
(function (IsolationLevel) {
    IsolationLevel[IsolationLevel["READ_COMMIT"] = 1] = "READ_COMMIT";
    IsolationLevel[IsolationLevel["READ_UNCOMMIT"] = 2] = "READ_UNCOMMIT";
    IsolationLevel[IsolationLevel["REPEATABLE_READ"] = 3] = "REPEATABLE_READ";
    IsolationLevel[IsolationLevel["SERIALIZABLE"] = 4] = "SERIALIZABLE";
    IsolationLevel[IsolationLevel["SNAPSHOT"] = 5] = "SNAPSHOT";
})(IsolationLevel = exports.IsolationLevel || (exports.IsolationLevel = {}));
/**
 * 逻辑运算符列表
 */
var LogicOperator;
(function (LogicOperator) {
    LogicOperator["AND"] = "AND";
    LogicOperator["OR"] = "OR";
    LogicOperator["NOT"] = "NOT";
})(LogicOperator = exports.LogicOperator || (exports.LogicOperator = {}));
/**
 * 比较运算符列表
 */
var CompareOperator;
(function (CompareOperator) {
    CompareOperator["IS_NULL"] = "IS NULL";
    CompareOperator["IS_NOT_NULL"] = "IS NOT NULL";
    CompareOperator["IN"] = "IN";
    CompareOperator["NOT_IN"] = "NOT IN";
    CompareOperator["EQ"] = "=";
    CompareOperator["NEQ"] = "<>";
    CompareOperator["GT"] = ">";
    CompareOperator["GTE"] = ">=";
    CompareOperator["LT"] = "<";
    CompareOperator["LTE"] = "<=";
    CompareOperator["LIKE"] = "LIKE";
    CompareOperator["NOT_LIKE"] = "NOT LIKE";
    CompareOperator["EXISTS"] = "EXISTS";
})(CompareOperator = exports.CompareOperator || (exports.CompareOperator = {}));
/**
 * 算术运算符列表
 */
var ComputeOperator;
(function (ComputeOperator) {
    ComputeOperator["ADD"] = "+";
    ComputeOperator["SUB"] = "-";
    ComputeOperator["MUL"] = "*";
    ComputeOperator["DIV"] = "/";
    ComputeOperator["MOD"] = "%";
    ComputeOperator["BITAND"] = "&";
    ComputeOperator["BITOR"] = "|";
    ComputeOperator["BITNOT"] = "~";
    ComputeOperator["BITXOR"] = "^";
    ComputeOperator["SHR"] = ">>";
    ComputeOperator["SHL"] = "<<";
    ComputeOperator["NEG"] = "-";
})(ComputeOperator = exports.ComputeOperator || (exports.ComputeOperator = {}));
/**
 * SQL运算符
 */
/**
 * SQL运算符
 */
var SqlSymbol;
(function (SqlSymbol) {
    SqlSymbol["RAW"] = "RAW";
    // ANY = '*',
    SqlSymbol["VALUE_LIST"] = "VALUE_LIST";
    SqlSymbol["VARAINT_DECLARE"] = "VARAINT_DECLARE";
    SqlSymbol["IDENTIFIER"] = "IDENTIFIER";
    /**
     * 系统内建标识符，如COUNT, SUM等系统函数
     */
    SqlSymbol["BUILDIN_IDENTIFIER"] = "BUILDIN_IDENTIFIER";
    SqlSymbol["PARAMETER"] = "PARAMETER";
    SqlSymbol["VARAINT"] = "VARAINT";
    SqlSymbol["DATATYPE"] = "DATATYPE";
    SqlSymbol["SELECT"] = "SELECT";
    SqlSymbol["UPDATE"] = "UPDATE";
    SqlSymbol["INSERT"] = "INSERT";
    SqlSymbol["DELETE"] = "DELETE";
    SqlSymbol["EXECUTE"] = "EXECUTE";
    SqlSymbol["INVOKE"] = "INVOKE";
    SqlSymbol["ASSIGNMENT"] = "ASSIGNMENT";
    SqlSymbol["CONSTANT"] = "CONSTANT";
    SqlSymbol["CONDITION"] = "CONDITION";
    SqlSymbol["SORT"] = "SORT";
    SqlSymbol["BRACKET"] = "BRACKET";
    SqlSymbol["ALIAS"] = "ALIAS";
    SqlSymbol["BINARY"] = "BINARY";
    SqlSymbol["UNARY"] = "UNARY";
    SqlSymbol["JOIN"] = "JOIN";
    SqlSymbol["UNION"] = "UNION";
    SqlSymbol["WHEN"] = "WHEN";
    SqlSymbol["CASE"] = "CASE";
    SqlSymbol["DECLARE"] = "DECLARE";
    SqlSymbol["DOCUMENT"] = "DOCUMENT";
})(SqlSymbol = exports.SqlSymbol || (exports.SqlSymbol = {}));
// export enum DataType {
//   STRING = 'STRING',
//   INTEGER = 'INTEGER',
//   FLOAT = 'FLOAT',
//   BOOLEAN = 'BOOLEAN',
//   DATE = 'DATE'
// }
//# sourceMappingURL=constants.js.map