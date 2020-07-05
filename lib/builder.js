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
exports.$case = ast_1.Statement.case;
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
    var: exports.variant,
    bracket: exports.bracket,
    quoted: exports.quoted,
    raw: exports.raw,
    any: exports.any,
    anyFields: exports.anyFields
};
exports.default = exports.SQL;
//# sourceMappingURL=builder.js.map