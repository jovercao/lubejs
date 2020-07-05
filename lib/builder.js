"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SQL = exports.anyFields = exports.any = exports.$delete = exports.del = exports.sysFn = exports.sys = exports.buildIn = exports.sp = exports.fn = exports.update = exports.$case = exports.insert = exports.raw = exports.select = exports.alias = exports.variant = exports.output = exports.input = exports.bracket = exports.quoted = exports.constant = exports.field = exports.table = exports.identifier = exports.when = exports.execute = exports.exec = exports.invoke = exports.exists = exports.or = exports.and = exports.not = void 0;
const ast_1 = require("./ast");
/**
 * not 查询条件运算
 */
exports.not = ast_1.Condition.not;
/**
 * 使用and关联多个查询条件
 * @static
 * @param conditions 要关联的查询条件列表
 * @returns  condition
 * @memberof SQL
 */
exports.and = ast_1.Condition.and;
/**
 * 使用or关联多个查询条件
 * @static
 * @param conditions 要关联的查询条件列表
 * @returns  condition
 * @memberof SQL
 */
exports.or = ast_1.Condition.or;
/**
 * exists语句
 * @static
 * @param select
 * @returns
 * @memberof SQL
 */
exports.exists = ast_1.Condition.exists;
exports.invoke = ast_1.Expression.invoke;
exports.exec = ast_1.Statement.exec;
exports.execute = ast_1.Statement.execute;
exports.when = ast_1.Statement.when;
/**
 * 标识符
 * @returns
 */
exports.identifier = ast_1.Expression.identifier;
/**
 * 创建一个表格标识
 * @param names 表标识限定，如果有多级，请传多个参数
 * @returns
 * @example table(database, schema, tableName) => Identity
 * @example table(tableName) => Identity
 */
exports.table = ast_1.Expression.table;
exports.field = ast_1.Expression.field;
exports.constant = ast_1.Expression.constant;
exports.quoted = ast_1.AST.bracket;
exports.bracket = ast_1.AST.bracket;
/**
 * input 参数
 */
exports.input = ast_1.Parameter.input;
/**
 * output参数
 */
exports.output = ast_1.Parameter.output;
/**
 * 变量引用
 */
exports.variant = ast_1.Expression.variant;
/**
 * 创建一个别名
 */
exports.alias = ast_1.Expression.alias;
/**
 * 创建一个SELECT语句
 */
exports.select = ast_1.Statement.select;
/**
 * 创建一个原始的SQL片段
 * @param sql 原始SQL
 */
exports.raw = function (sql) {
    return new ast_1.Raw(sql);
};
/**
 * 创建一个INSERT语句
 */
exports.insert = ast_1.Statement.insert;
exports.$case = ast_1.Expression.case;
/**
 * 创建一个UPDATE语句
 */
exports.update = ast_1.Statement.update;
exports.fn = function (...names) {
    return function (...args) {
        return ast_1.Expression.identifier(...names).invoke(...args);
    };
};
exports.sp = function (...names) {
    return function (...args) {
        return ast_1.Statement.execute(ast_1.Expression.identifier(...names), args);
    };
};
exports.buildIn = ast_1.Identifier.buildIn;
/**
 * 内建标识符，不会被 [] 包裹，buildIn的别名
 * @param name
 */
exports.sys = exports.buildIn;
/**
 * 内建函数
 * @param name
 */
exports.sysFn = function (name) {
    return function (...args) {
        return ast_1.Identifier.buildIn(name).invoke(...args);
    };
};
/**
 * 创建一个DELETE语句
 */
exports.del = ast_1.Statement.delete;
exports.$delete = ast_1.Statement.delete;
exports.any = ast_1.Expression.any;
/**
 * 任意字段
 */
exports.anyFields = ast_1.Expression.any();
// ************************** 系统函数区 *************************
// export function count(exp: UnsureExpressions) {
//   return Identifier.buildIn('count').invoke(exp)
// }
// export function sum(exp: UnsureExpressions) {
//   return Identifier.buildIn('sum').invoke(exp)
// }
// export function avg(exp: UnsureExpressions) {
//   return Identifier.buildIn('avg').invoke(exp)
// }
// export function max(exp: UnsureExpressions) {
//   return Identifier.buildIn('max').invoke(exp)
// }
// export function min(exp: UnsureExpressions) {
//   return Identifier.buildIn('min').invoke(exp)
// }
// export function nvl(exp: UnsureExpressions, defaults: UnsureExpressions) {
//   return Identifier.buildIn('nvl').invoke(exp)
// }
// export function abs(exp: UnsureExpressions) {
//   return Identifier.buildIn('abs').invoke(exp)
// }
// export function ceil(exp: UnsureExpressions) {
//   return Identifier.buildIn('ceil').invoke(exp)
// }
// export function exp(exp: UnsureExpressions) {
//   return Identifier.buildIn('exp').invoke(exp)
// }
// export function stdev(exp: UnsureExpressions) {
//   return Identifier.buildIn('stdev').invoke(exp)
// }
// export function square(exp: UnsureExpressions) {
//   return Identifier.buildIn('square').invoke(exp)
// }
// export function floor(exp: UnsureExpressions) {
//   return Identifier.buildIn('floor').invoke(exp)
// }
// export function round(exp: UnsureExpressions, digit: UnsureExpressions) {
//   return Identifier.buildIn('round').invoke(exp, digit)
// }
// export function sine(exp: UnsureExpressions) {
//   return Identifier.buildIn('sine').invoke(exp)
// }
// export function sqrt(exp: UnsureExpressions) {
//   return Identifier.buildIn('sqrt').invoke(exp)
// }
// export function power(exp: UnsureExpressions, pwr: UnsureExpressions) {
//   return Identifier.buildIn('power').invoke(exp, pwr)
// }
// /**
//  * 通用函数
//  */
// export const CommonFunctions = {
//   count,
//   avg,
//   sum,
//   max,
//   min,
// abs,
// exp,
// ceil,
// round,
// floor,
// sqrt,
// sine,
// power,
// nvl,
// stdev,
// square
// }
/**
 * 语句
 */
exports.SQL = {
    select: exports.select,
    insert: exports.insert,
    update: exports.update,
    delete: exports.$delete,
    case: exports.$case,
    execute: exports.execute,
    exec: exports.exec,
    when: exports.when,
    exists: exports.exists,
    invoke: exports.invoke,
    fn: exports.fn,
    sp: exports.sp,
    buildIn: exports.buildIn,
    sys: exports.sys,
    table: exports.table,
    field: exports.field,
    alias: exports.alias,
    input: exports.input,
    output: exports.output,
    and: exports.and,
    or: exports.or,
    variant: exports.variant,
    bracket: exports.bracket,
    quoted: exports.quoted,
    raw: exports.raw,
    any: exports.any,
    anyFields: exports.anyFields
};
exports.default = exports.SQL;
// TODO: 完成函数的转换
// TODO: 完成数据类型的转换
// code(char) {
//   return invoke('code', [char], true)
// },
// char(code) {
//   return invoke('char', [code], true)
// },
// now() {
//   return invoke('now', null, true)
// },
// convert(exp, type) {
//   assert([STRING, NUMBER, DATE, BOOLEAN, BUFFER].includes(type), 'type must be in STRING/NUMBER/DATE/BOOLEAN/BUFFER')
//   return invoke('cast', [type, exp], true)
// },
// ltrim(str) {
//   return invoke('ltrim', [str])
// },
// rtrim(str) {
//   return invoke('rtrim', [str])
// },
// guid() {
//   return invoke('guid')
// },
// indexOf(strExp, matchExp, startIndex) {
//   assert()
//   const params = [strExp, matchExp]
//   if (startIndex) {
//     params.push(startIndex)
//   }
//   return invoke('indexof', params)
// },
// len(exp) {
//   return invoke('len', [exp])
// },
// substr(str, start, len) {
//   return invoke('substr', [str, start, len])
// },
// upper(str) {
//   return invoke('upper', [str])
// },
// lower(str) {
//   return invoke('lower', [str])
// },
// iif(condition, affirm, defaults) {
//   return new IIF(condition, affirm, defaults)
// },
// datatype(type) {
//   return new DataType(type)
// }
//# sourceMappingURL=builder.js.map