"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Parser = void 0;
const assert = require("assert");
const moment = require("moment");
const _ = require("lodash");
const ast_1 = require("./ast");
const constants_1 = require("./constants");
/**
 * AST到SQL的编译器
 */
class Parser {
    constructor(ployfill, { strict = true }) {
        this._strict = strict;
        this.ployfill = ployfill;
    }
    /**
     * 解析标识符
     * @param identifier 标识符
     */
    parseIdentifier(identifier) {
        const sql = this.quoted(identifier.name);
        if (identifier.parent) {
            return this.parseIdentifier(identifier.parent) + '.' + sql;
        }
        return sql;
    }
    /**
     * 标识符转换，避免关键字被冲突问题
     * @param {string} identifier 标识符
     */
    quoted(identifier) {
        if (this._strict) {
            return this.ployfill.quotedLeft + identifier + this.ployfill.quotedRight;
        }
        return identifier;
    }
    /**
     * 向参数列表中添加参数并返回当前参数的参数名
     * @param {array} values 参数列表
     * @param {any} value 参数值
     */
    parseParameter(param, params) {
        params.add(param);
        return this.ployfill.parameterPrefix + param.name || '';
    }
    parseVariant(variant, params) {
        return this.ployfill.variantPrefix + variant.name;
    }
    parseConstant(constant) {
        const value = constant.value;
        if (value === null || value === undefined) {
            return 'NULL';
        }
        if (_.isString(value)) {
            return `'${value.replace(/'/g, "''")}'`;
        }
        if (_.isNumber(value)) {
            return value.toString(10);
        }
        if (_.isBoolean(value)) {
            return value ? '1' : '0';
        }
        if (_.isDate(value)) {
            return "CONVERT(DATETIME, '" + moment(value).format('YYYY-MM-DD HH:mm:ss.SSS') + "')";
        }
        if (_.isBuffer(value)) {
            return '0x' + value.toString('hex');
        }
        if (_.isArrayBuffer(value) || _.isArray(value)) {
            return '0x' + Buffer.from(value).toString('hex');
        }
        throw new Error('unsupport constant value type:' + value.toString());
    }
    parse(ast, params) {
        if (ast instanceof ast_1.Expression) {
            return this.parseExpression(ast, params);
        }
        if (ast instanceof ast_1.Statement) {
            return this.parseStatment(ast, params);
        }
        if (ast instanceof ast_1.Condition) {
            return this.parseCondition(ast, params);
        }
        if (ast instanceof ast_1.Bracket) {
            return '(' + this.parse(ast.context, params) + ')';
        }
        throw new Error('Unsupport AST type: ' + ast.type);
    }
    parseStatment(statement, params) {
        switch (statement.type) {
            case constants_1.SqlSymbol.SELECT:
                return this.parseSelectStatement(statement, params);
            case constants_1.SqlSymbol.UPDATE:
                return this.parseUpdateStatement(statement, params);
            case constants_1.SqlSymbol.AGGREGATE:
                return this.parseAssignment(statement, params);
            case constants_1.SqlSymbol.INSERT:
                return this.parseInsertStatement(statement, params);
            case constants_1.SqlSymbol.DELETE:
                return this.parseDeleteStatement(statement, params);
            case constants_1.SqlSymbol.DECLARE:
                return this.parseDeclareStatement(statement, params);
            default:
                throw new Error('Unsupport statement type: ' + statement.type);
        }
    }
    parseAlias(alias, params) {
        return this.parseExpression(alias.expr, params) + this.ployfill.setsAliasJoinWith + alias.name;
    }
    parseCase(caseExpr, params) {
    }
    parseBinaryExpression(expr, params) {
    }
    parseUnaryExpression(expr, params) {
    }
    parseExpression(expr, params) {
        switch (expr.type) {
            case constants_1.SqlSymbol.BRACKET:
                return '(' + this.parse(expr.value, params) + ')';
            case constants_1.SqlSymbol.CONSTANT:
                return this.parseConstant(expr);
            case constants_1.SqlSymbol.ALIAS:
                return this.parseAlias(expr, params);
            case constants_1.SqlSymbol.IDENTITY:
                return this.parseIdentifier(expr);
            case constants_1.SqlSymbol.INVOKE:
                return this.parseInvoke(expr, params);
            case constants_1.SqlSymbol.CASE:
                return this.parseCase(expr, params);
            case constants_1.SqlSymbol.BINARY:
                return this.parseBinaryExpression(expr, params);
            case constants_1.SqlSymbol.UNARY:
                return this.parseUnaryExpression(expr, params);
            case constants_1.SqlSymbol.PARAMETER:
                return this.parseParameter(expr, params);
            case constants_1.SqlSymbol.VARAINT:
                return this.parseVariant(expr, params);
            default:
                throw new Error('Unsupport expression type: ' + expr.type);
        }
    }
    /**
     * 函数调用
     * @param {*} invoke
     * @param {*} params
     * @returns
     * @memberof Executor
     */
    parseInvoke(invoke, params) {
        return `${this.parseIdentifier(invoke.func)}(${(invoke.params || []).map(v => this.parseExpression(v, params)).join(', ')})`;
    }
    parseJoins(join, params) {
        let sql = '';
        for (const { table, on, left } of join) {
            if (left) {
                sql += ' LEFT';
            }
            sql += ` JOIN ${this._compileSets(table)} ON ${this.parseCondition(on, params)}`;
        }
        return sql;
    }
    /**
     * 编译Where查询条件为Sql
     * @param {*} condition where条件
     * @param {array} params 用于接收参数值的数组
     * @returns string sql 返回Sql字符串
     * @memberof Pool
     */
    parseCondition(condition, params) {
    }
    parseSelectStatement(select, params) {
        const { table, top, joins, columns, where, orders, groups, having, offset, limit, distinct } = select;
        let sql = 'SELECT ';
        if (distinct) {
            sql += 'DISTINCT ';
        }
        if (_.isNumber(top)) {
            sql += `TOP ${top} `;
        }
        sql += this._parseColumns(columns, params);
        if (table) {
            sql += ` FROM ${this._compileSets(table, params)}`;
        }
        if (joins && joins.length > 0) {
            sql += this.parseJoins(joins, params);
        }
        if (where) {
            sql += ' WHERE ' + this.parseCondition(where, params);
        }
        if (groups && groups.length) {
            sql += ' GROUP BY ' + groups.map(p => this.parseExpression(p, params, $field)).join(', ');
        }
        if (having) {
            sql += ' HAVING ' + this.parseCondition(having, params);
        }
        if (orders) {
            if (!_.isArray(orders) || orders.length > 0) {
                sql += ' ORDER BY ' + orders.map(([exp, direct]) => `${this.parseExpression(exp, params, $field)} ${OrderDirectionMapps[direct || ASC]}`).join(', ');
            }
        }
        if (_.isNumber(offset) || _.isNumber(limit)) {
            if (!orders || orders.length === 0) {
                throw new Error('offset needs must use with order by statement');
            }
            sql += ` OFFSET ${offset || 0} ROWS`;
            if (_.isNumber(limit)) {
                sql += ` FETCH NEXT ${limit} ROWS ONLY`;
            }
        }
        return sql;
    }
    parseInsertStatement(insert, params) {
        const { table, values, fields } = insert;
        let sql = `INSERT INTO ${this._compile(table, params, $table, [$table])}`;
        if (fields) {
            sql += `(${fields.map(p => this.parseExpression(p, params, $field))})`;
        }
        if (_.isArray(values)) {
            sql += ' VALUES';
            sql += values.map(row => '(' + row.map(v => this.parseExpression(v, params, $const)).join(', ') + ')').join(', ');
        }
        else {
            sql += ' ' + this._compile(values, params, $select, [$select]);
        }
        return sql;
    }
    parseAssignment(assign, params) {
        const { left, right } = assign;
        return `${this._compile(left, params, $field, [$field])} = ${this.parseExpression(right, params, $const)}`;
    }
    parseDeclareStatement(declare, params) {
    }
    parseUpdateStatement(update, params) {
        const { table, sets, where, joins } = update;
        assert(table, 'table is required by update statement');
        assert(sets, 'set statement un declared');
        let sql = `UPDATE ${this._compileSetsAlias(table, params, $table, [$table])} SET ${sets.map(([field, value]) => `${this._compile(field, params, $field, [$field, $var, $param])} = ${this.parseExpression(value)}`).join(', ')}`;
        sql += ' FROM ' + this._compileSets(table);
        if (joins) {
            sql += this.parseJoins(joins, params);
        }
        if (where) {
            sql += ' WHERE ' + this.parseCondition(where, params);
        }
        return sql;
    }
    parseDeleteStatement(del, params) {
        const { table, joins, where } = del;
        assert(table, 'table is required for delete statement');
        let sql = `DELETE ${this._compileSetsAlias(table, params, $table, [$table])}`;
        sql += ' FROM ' + this._compileSets(table);
        if (joins) {
            sql += this.parseJoins(joins, params);
        }
        if (where) {
            sql += ' WHERE ' + this.parseCondition(where);
        }
        return sql;
    }
    /**
     * columns 支持两种格式:
     * 1. array,写法如下： [ field1, [ field2, alias ] ]
     * 2. object, 写法如下： { field1: table1.field, field2: table1.field2 }
     * @param {*} columns
     * @param {*} params
     * @returns
     * @memberof Executor
     */
    _parseColumns(columns, params) {
        return columns.map(p => this._compile(p, params, $column)).join(', ');
    }
    _parseColumn(ast, params) {
        // 默认为字段
        if (_.isString(ast)) {
            return this.quoted(ast);
        }
        if (_.isArray(ast)) {
            const [exp, name] = ast;
            let sql = this.parseExpression(exp, params, $field);
            if (name) {
                sql += ' AS ' + this.quoted(name);
            }
            return sql;
        }
        if (_.isPlainObject(ast)) {
            return this.parseExpression(ast, params, $field);
        }
        // 常量
        return this.parseConstant(ast);
    }
}
exports.Parser = Parser;
module.exports = {
    Parser: Compiler
};
//# sourceMappingURL=parser.js.map