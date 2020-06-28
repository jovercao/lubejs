"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.power = exports.sqrt = exports.sign = exports.round = exports.floor = exports.square = exports.exp = exports.ceil = exports.abs = exports.nvl = exports.min = exports.max = exports.avg = exports.sum = exports.stdev = exports.count = exports.allField = exports.del = exports.update = exports.insert = exports.select = exports.alias = exports.variant = exports.output = exports.input = exports.quoted = exports.constant = exports.field = exports.table = exports.identity = exports.exec = exports.invoke = exports.exists = exports.or = exports.and = exports.not = void 0;
const _ = require("lodash");
const util_1 = require("./util");
const ast_1 = require("./ast");
const constants_1 = require("./constants");
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
function invoke(func, params) {
    return new ast_1.Invoke(func, params);
}
exports.invoke = invoke;
function exec(proc, params) {
    return new ast_1.Execute(proc, params);
}
exports.exec = exec;
/**
 * 标识符
 * @returns
 */
function identity(...names) {
    return names.reduce((previous, current) => {
        if (!previous)
            return new ast_1.Identity(current);
        return new ast_1.Identity(current, previous);
    });
}
exports.identity = identity;
/**
 * 创建一个表格标识
 * @param names 表标识限定，如果有多级，请传多个参数
 * @returns
 * @example table(database, schema, tableName) => Identity
 * @example table(tableName) => Identity
 */
function table(...names) {
    return identity(...names);
}
exports.table = table;
/**
 * 字段引用
 * @param name
 * @param table
 * @returns
 */
function field(name, table) {
    return new ast_1.Identity(name, table);
}
exports.field = field;
/**
 * 常量表达式
 */
function constant(value) {
    return new ast_1.Constant(value);
}
exports.constant = constant;
/**
 * 括号表达式
 * @param context 括号上下文
 * @returns
 */
function quoted(context) {
    return new ast_1.Bracket(context);
}
exports.quoted = quoted;
/**
 * input 参数
 */
function input(name, value) {
    return new ast_1.Parameter(name, value, constants_1.ParameterDirection.INPUT);
}
exports.input = input;
/**
 * output参数
 */
function output(name, value) {
    return new ast_1.Parameter(name, value, constants_1.ParameterDirection.OUTPUT);
}
exports.output = output;
/**
 * 变量引用
 * @param name
 * @returns
 */
function variant(name) {
    return new ast_1.Variant(name);
}
exports.variant = variant;
/**
 * 创建一个列
 * @static
 * @param name 名称
 * @param exp 当不传递该参数时，默认为字段名
 * @returns 返回列实例
 * @memberof SQL
 */
function alias(exp, name) {
    util_1.assert(_.isString(name), '列名必须为字符串');
    return new ast_1.Alias(exp, name);
}
exports.alias = alias;
/**
 * 创建一个SELECT SQL对象
 * @static
 * @param columns 列列表
 * @returns
 * @memberof SQL
 */
function select(...columns) {
    return new ast_1.Select().columns(...columns);
}
exports.select = select;
/**
 * 创建一个insert SQL 对象
 * @static
 * @returns  insert sql 对象
 * @memberof SQL
 */
function insert(table) {
    return new ast_1.Insert().into(table);
}
exports.insert = insert;
/**
 * 创建一个update sql 对象
 * @static
 * @param tables
 * @param sets
 * @param where
 * @returns
 * @memberof SQL
 */
function update(table) {
    return new ast_1.Update().from(table);
}
exports.update = update;
/**
 * 创建一个delete SQL 对象
 * @static
 * @param table
 * @param where
 * @returns
 * @memberof SQL
 */
function del(table) {
    return new ast_1.Delete().from(table);
}
exports.del = del;
function allField() {
    return new ast_1.Identity('*');
}
exports.allField = allField;
// ************************** 系统函数区 *************************
function count(exp) {
    return new ast_1.Invoke('count', [exp]);
}
exports.count = count;
function stdev(exp) {
    return new ast_1.Invoke('stdev', [exp]);
}
exports.stdev = stdev;
function sum(exp) {
    return new ast_1.Invoke('sum', [exp]);
}
exports.sum = sum;
function avg(exp) {
    return new ast_1.Invoke('avg', [exp]);
}
exports.avg = avg;
function max(exp) {
    return new ast_1.Invoke('max', [exp]);
}
exports.max = max;
function min(exp) {
    return new ast_1.Invoke('min', [exp]);
}
exports.min = min;
function nvl(exp, defaults) {
    return new ast_1.Invoke('nvl', [exp, defaults]);
}
exports.nvl = nvl;
function abs(exp) {
    return new ast_1.Invoke('abs', [exp]);
}
exports.abs = abs;
function ceil(exp) {
    return new ast_1.Invoke('ceil', [exp]);
}
exports.ceil = ceil;
function exp(exp) {
    return new ast_1.Invoke('exp', [exp]);
}
exports.exp = exp;
function square(exp) {
    return new ast_1.Invoke('square', [exp]);
}
exports.square = square;
function floor(exp) {
    return new ast_1.Invoke('floor', [exp]);
}
exports.floor = floor;
function round(exp, digit) {
    return new ast_1.Invoke('round', [exp, digit]);
}
exports.round = round;
function sign(exp) {
    return new ast_1.Invoke('sign', [exp]);
}
exports.sign = sign;
function sqrt(exp) {
    return new ast_1.Invoke('sqrt', [exp]);
}
exports.sqrt = sqrt;
function power(exp, pwr) {
    return new ast_1.Invoke('power', [exp, pwr]);
}
exports.power = power;
// code(char) {
//   return new Invoke('code', [char], true)
// },
// char(code) {
//   return new Invoke('char', [code], true)
// },
// now() {
//   return new Invoke('now', null, true)
// },
// convert(exp, type) {
//   assert([STRING, NUMBER, DATE, BOOLEAN, BUFFER].includes(type), 'type must be in STRING/NUMBER/DATE/BOOLEAN/BUFFER')
//   return new Invoke('cast', [type, exp], true)
// },
// ltrim(str) {
//   return new Invoke('ltrim', [str])
// },
// rtrim(str) {
//   return new Invoke('rtrim', [str])
// },
// guid() {
//   return new Invoke('guid')
// },
// indexOf(strExp, matchExp, startIndex) {
//   assert()
//   const params = [strExp, matchExp]
//   if (startIndex) {
//     params.push(startIndex)
//   }
//   return new Invoke('indexof', params)
// },
// len(exp) {
//   return new Invoke('len', [exp])
// },
// substr(str, start, len) {
//   return new Invoke('substr', [str, start, len])
// },
// upper(str) {
//   return new Invoke('upper', [str])
// },
// lower(str) {
//   return new Invoke('lower', [str])
// },
// iif(condition, affirm, defaults) {
//   return new IIF(condition, affirm, defaults)
// },
// datatype(type) {
//   return new DataType(type)
// }
//# sourceMappingURL=builder.js.map