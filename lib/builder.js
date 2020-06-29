"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.power = exports.sqrt = exports.sign = exports.round = exports.floor = exports.square = exports.exp = exports.ceil = exports.abs = exports.nvl = exports.min = exports.max = exports.avg = exports.sum = exports.stdev = exports.count = exports.allFields = exports.del = exports.update = exports.insert = exports.select = exports.alias = exports.variant = exports.output = exports.input = exports.quoted = exports.constant = exports.field = exports.table = exports.identity = exports.execute = exports.exec = exports.invoke = exports.exists = exports.or = exports.and = exports.not = void 0;
const ast_1 = require("./ast");
// /**
//  * 将制作table的代理，用于生成字段
//  * @param table
//  * @returns
//  */
// function makeAutoFieldTableProxy(table) {
//   return new Proxy(table, {
//     get(target, prop) {
//       if (_.isSymbol(prop) || prop.startsWith('$') || Object.prototype.hasOwnProperty.call(target, prop)) {
//         return target[prop]
//       }
//       return new Field(prop, table)
//     }
//   })
// }
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
/**
 * 标识符
 * @returns
 */
exports.identity = ast_1.Expression.identifier;
/**
 * 创建一个表格标识
 * @param names 表标识限定，如果有多级，请传多个参数
 * @returns
 * @example table(database, schema, tableName) => Identity
 * @example table(tableName) => Identity
 */
exports.table = ast_1.Expression.identifier;
exports.field = ast_1.Expression.identifier;
exports.constant = ast_1.Expression.constant;
exports.quoted = ast_1.Expression.quoted;
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
 * 创建一个INSERT语句
 */
exports.insert = ast_1.Statement.insert;
/**
 * 创建一个UPDATE语句
 */
exports.update = ast_1.Statement.update;
/**
 * 创建一个DELETE语句
 */
exports.del = ast_1.Statement.delete;
exports.allFields = new ast_1.Identifier('*');
// ************************** 系统函数区 *************************
function count(exp) {
    return exports.invoke('count', [exp]);
}
exports.count = count;
function stdev(exp) {
    return exports.invoke('stdev', [exp]);
}
exports.stdev = stdev;
function sum(exp) {
    return exports.invoke('sum', [exp]);
}
exports.sum = sum;
function avg(exp) {
    return exports.invoke('avg', [exp]);
}
exports.avg = avg;
function max(exp) {
    return exports.invoke('max', [exp]);
}
exports.max = max;
function min(exp) {
    return exports.invoke('min', [exp]);
}
exports.min = min;
function nvl(exp, defaults) {
    return exports.invoke('nvl', [exp, defaults]);
}
exports.nvl = nvl;
function abs(exp) {
    return exports.invoke('abs', [exp]);
}
exports.abs = abs;
function ceil(exp) {
    return exports.invoke('ceil', [exp]);
}
exports.ceil = ceil;
function exp(exp) {
    return exports.invoke('exp', [exp]);
}
exports.exp = exp;
function square(exp) {
    return exports.invoke('square', [exp]);
}
exports.square = square;
function floor(exp) {
    return exports.invoke('floor', [exp]);
}
exports.floor = floor;
function round(exp, digit) {
    return exports.invoke('round', [exp, digit]);
}
exports.round = round;
function sign(exp) {
    return exports.invoke('sign', [exp]);
}
exports.sign = sign;
function sqrt(exp) {
    return exports.invoke('sqrt', [exp]);
}
exports.sqrt = sqrt;
function power(exp, pwr) {
    return exports.invoke('power', [exp, pwr]);
}
exports.power = power;
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