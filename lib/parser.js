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
        const parent = Reflect.get(identifier, 'parent');
        if (parent) {
            return this.parseIdentifier(parent) + '.' + sql;
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
    parseParameter(param, params, isProcParam = false) {
        params.add(param);
        return this.properParameterName(param, isProcParam);
    }
    properParameterName(p, isProcParam = false) {
        let sql = this.ployfill.parameterPrefix + (p.name || '');
        if (isProcParam && p.direction === constants_1.PARAMETER_DIRECTION.OUTPUT && this.ployfill.parameterOutWord) {
            sql += ' ' + this.ployfill.parameterOutWord;
        }
        return sql;
    }
    properVariantName(name) {
        return this.ployfill.variantPrefix + name;
    }
    parseVariant(variant, params) {
        return this.properVariantName(variant.name);
    }
    parseDate(date) {
        return "'" + moment(date).format('YYYY-MM-DD HH:mm:ss.SSS') + "'";
    }
    parseBoolean(value) {
        return value ? '1' : '0';
    }
    parseString(value) {
        return `'${value.replace(/'/g, "''")}'`;
    }
    parseConstant(constant) {
        const value = constant.value;
        if (value === null || value === undefined) {
            return 'NULL';
        }
        if (_.isString(value)) {
            return this.parseString(value);
        }
        if (_.isNumber(value) || typeof value === 'bigint') {
            return value.toString(10);
        }
        if (_.isBoolean(value)) {
            return this.parseBoolean(value);
        }
        if (_.isDate(value)) {
            return this.parseDate(value);
        }
        if (_.isBuffer(value)) {
            return '0x' + value.toString('hex');
        }
        if (_.isArrayBuffer(value) || _.isArray(value)) {
            return '0x' + Buffer.from(value).toString('hex');
        }
        console.debug(value);
        throw new Error('unsupport constant value type:' + value.toString());
    }
    parse(ast) {
        const params = new Set();
        return {
            sql: this.parseAST(ast, params),
            params: Array.from(params)
        };
    }
    parseAST(ast, params) {
        switch (ast.type) {
            case constants_1.SQL_SYMBOLE.SELECT:
                return this.parseSelect(ast, params);
            case constants_1.SQL_SYMBOLE.UPDATE:
                return this.parseUpdate(ast, params);
            case constants_1.SQL_SYMBOLE.ASSIGNMENT:
                return this.parseAssignment(ast, params);
            case constants_1.SQL_SYMBOLE.INSERT:
                return this.parseInsert(ast, params);
            case constants_1.SQL_SYMBOLE.DELETE:
                return this.parseDelete(ast, params);
            case constants_1.SQL_SYMBOLE.DECLARE:
                return this.parseDeclare(ast, params);
            case constants_1.SQL_SYMBOLE.BRACKET:
                return this.parseBracket(ast, params);
            case constants_1.SQL_SYMBOLE.CONSTANT:
                return this.parseConstant(ast);
            case constants_1.SQL_SYMBOLE.ALIAS:
                return this.parseAlias(ast, params);
            case constants_1.SQL_SYMBOLE.IDENTIFIER:
                return this.parseIdentifier(ast);
            case constants_1.SQL_SYMBOLE.BUILDIN_IDENTIFIER:
                return ast.name;
            case constants_1.SQL_SYMBOLE.EXECUTE:
                return this.parseExecute(ast, params);
            case constants_1.SQL_SYMBOLE.INVOKE:
                return this.parseInvoke(ast, params);
            case constants_1.SQL_SYMBOLE.CASE:
                return this.parseCase(ast, params);
            case constants_1.SQL_SYMBOLE.BINARY:
                return this.parseBinary(ast, params);
            case constants_1.SQL_SYMBOLE.UNARY:
                return this.parseUnary(ast, params);
            case constants_1.SQL_SYMBOLE.PARAMETER:
                return this.parseParameter(ast, params);
            case constants_1.SQL_SYMBOLE.VARAINT:
                return this.parseVariant(ast, params);
            case constants_1.SQL_SYMBOLE.JOIN:
                return this.parseJoin(ast, params);
            case constants_1.SQL_SYMBOLE.UNION:
                return this.parseUnion(ast, params);
            case constants_1.SQL_SYMBOLE.VALUE_LIST:
                return this.parseValueList(ast, params);
            case constants_1.SQL_SYMBOLE.SORT:
                return this.parseSort(ast, params);
            default:
                throw new Error('Error AST type: ' + ast.type);
        }
    }
    parseExecute(exec, params) {
        const returnValueParameter = ast_1.Parameter.output(this.ployfill.returnValueParameter, Number);
        return (this.ployfill.executeKeyword && (this.ployfill.executeKeyword + ' ')) +
            this.parseAST(returnValueParameter, params) + ' = ' + this.parseAST(exec.proc, params) + ' ' +
            exec.params.map(p => p instanceof ast_1.Parameter ? this.parseParameter(p, params, true) : this.parseAST(p, params)).join(', ');
    }
    parseBracket(bracket, params) {
        return '(' + this.parseAST(bracket.context, params) + ')';
    }
    parseValueList(values, params) {
        return values.items.map(ast => this.parseAST(ast, params)).join(', ');
    }
    parseUnion(union, params) {
        return 'UNION ' + union.all ? 'ALL ' : '' + this.parseAST(union.select, params);
    }
    parseAlias(alias, params) {
        return this.parseAST(alias.expr, params) + ' ' + this.ployfill.setsAliasJoinWith + ' ' + this.quoted(alias.name);
    }
    parseCase(caseExpr, params) {
        let fragment = 'CASE ' + this.parseAST(caseExpr.expr, params);
        fragment += ' ' + caseExpr.whens.map(when => this.parseWhen(when, params));
        if (caseExpr.defaults)
            fragment += ' ELSE ' + this.parseAST(caseExpr.defaults, params);
        fragment += ' END';
        return fragment;
    }
    parseWhen(when, params) {
        return 'WHEN ' + this.parseAST(when.expr, params) + ' THEN ' + this.parseAST(when.value, params);
    }
    parseBinary(expr, params) {
        return this.parseAST(expr.left, params) + ' ' + expr.operator + ' ' + this.parseAST(expr.right, params);
    }
    parseUnary(expr, params) {
        return expr.operator + ' ' + this.parseAST(expr.next, params);
    }
    /**
     * 函数调用
     * @param {*} invoke
     * @param {*} params
     * @returns
     * @memberof Executor
     */
    parseInvoke(invoke, params) {
        return `${this.parseAST(invoke.func, params)}(${(invoke.params || []).map(v => this.parseAST(v, params)).join(', ')})`;
    }
    parseJoin(join, params) {
        return (join.left ? 'LEFT ' : '') + 'JOIN ' + this.parseAST(join.table, params) + ' ON ' + this.parseAST(join.on, params);
    }
    parseSort(sort, params) {
        let sql = this.parseAST(sort.expr, params);
        if (sort.direction)
            sql += ' ' + sort.direction;
        return sql;
    }
    parseSelect(select, params) {
        const { tables, top, joins, unions, columns, filters, sorts, groups, havings, offsets, limits, isDistinct } = select;
        let sql = 'SELECT ';
        if (isDistinct) {
            sql += 'DISTINCT ';
        }
        if (_.isNumber(top)) {
            sql += `TOP ${top} `;
        }
        sql += columns.map(expr => this.parseAST(expr, params)).join(', ');
        if (tables) {
            sql += ' FROM ' + tables.map(table => this.parseAST(table, params)).join(', ');
        }
        if (joins && joins.length > 0) {
            sql += ' ' + joins.map(join => this.parseJoin(join, params)).join(' ');
        }
        if (filters) {
            sql += ' WHERE ' + this.parseAST(filters, params);
        }
        if (groups && groups.length) {
            sql += ' GROUP BY ' + groups.map(p => this.parseAST(p, params)).join(', ');
        }
        if (havings) {
            sql += ' HAVING ' + this.parseAST(havings, params);
        }
        if (sorts && sorts.length > 0) {
            sql += ' ORDER BY ' + sorts.map(sort => this.parseSort(sort, params)).join(', ');
        }
        if (_.isNumber(offsets)) {
            sql += ` OFFSET ${offsets || 0} ROWS`;
        }
        if (_.isNumber(limits)) {
            sql += ` FETCH NEXT ${limits} ROWS ONLY`;
        }
        if (unions) {
            sql += ' ' + this.parseUnion(unions, params);
        }
        return sql;
    }
    parseInsert(insert, params) {
        const { table, rows, fields } = insert;
        let sql = 'INSERT INTO ';
        sql += this.parseAST(table, params);
        if (fields) {
            sql += '(' + fields.map(field => this.parseAST(field, params)).join(', ') + ')';
        }
        if (_.isArray(rows)) {
            sql += ' VALUES';
            sql += rows.map(row => this.parseAST(row, params)).join(', ');
        }
        else {
            sql += ' ' + this.parseAST(rows, params);
        }
        return sql;
    }
    parseAssignment(assign, params) {
        const { left, right } = assign;
        return this.parseAST(left, params) + ' = ' + this.parseAST(right, params);
    }
    parseDeclare(declare, params) {
        return 'DECLARE ' + declare.declares.map(varDec => this.properVariantName(varDec.name) + ' ' + varDec.dataType).join(', ');
    }
    parseUpdate(update, params) {
        const { table, sets, filters, tables, joins } = update;
        assert(table, 'table is required by update statement');
        assert(sets, 'set statement un declared');
        let sql = 'UPDATE ';
        // 必须以Identifier解析，否则会生成别名
        sql += this.parseIdentifier(table);
        sql += ' SET ' + sets.map(({ left, right }) => this.parseAST(left, params) + ' = ' + this.parseAST(right, params)).join(', ');
        if (tables && tables.length > 0) {
            sql += ' FROM ' + tables.map(table => this.parseAST(table, params)).join(', ');
        }
        if (joins && joins.length > 0) {
            sql += ' ' + joins.map(join => this.parseJoin(join, params)).join(' ');
        }
        if (filters) {
            sql += ' WHERE ' + this.parseAST(filters, params);
        }
        return sql;
    }
    parseDelete(del, params) {
        const { table, tables, joins, filters } = del;
        let sql = 'DELETE ';
        if (table)
            sql += this.parseAST(table, params);
        if (tables && tables.length > 0) {
            sql += ' FROM ' + tables.map(table => this.parseAST(table, params)).join(', ');
        }
        if (joins) {
            sql += joins.map(join => this.parseJoin(join, params)).join(' ');
        }
        if (filters) {
            sql += ' WHERE ' + this.parseAST(filters, params);
        }
        return sql;
    }
}
exports.Parser = Parser;
//# sourceMappingURL=parser.js.map