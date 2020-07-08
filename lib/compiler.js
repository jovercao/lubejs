"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Compiler = exports.RETURN_VALUE_PARAMETER_NAME = void 0;
const assert = require("assert");
const moment = require("moment");
const _ = require("lodash");
const ast_1 = require("./ast");
const constants_1 = require("./constants");
exports.RETURN_VALUE_PARAMETER_NAME = '__RETURN_VALUE__';
const DEFAULT_COMPILE_OPTIONS = {
    strict: true,
    /**
     * 标识符引用，左
     */
    quotedLeft: '"',
    /**
     * 标识符引用，右
     */
    quotedRight: '"',
    /**
     * 参数前缀
     */
    parameterPrefix: '@',
    /**
     * 变量前缀
     */
    variantPrefix: '@'
};
/**
 * AST到SQL的编译器
 */
class Compiler {
    constructor(options) {
        this.options = Object.assign({}, DEFAULT_COMPILE_OPTIONS, options);
    }
    /**
     * 解析标识符
     * @param identifier 标识符
     */
    compileIdentifier(identifier, params, parent) {
        const sql = this.quoted(identifier.name);
        const parentNode = Reflect.get(identifier, 'parent');
        if (parentNode) {
            return this.compileIdentifier(parentNode, params, identifier) + '.' + sql;
        }
        return sql;
    }
    /**
     * 标识符转换，避免关键字被冲突问题
     * @param {string} identifier 标识符
     */
    quoted(identifier) {
        if (this.options.strict) {
            return this.options.quotedLeft + identifier + this.options.quotedRight;
        }
        return identifier;
    }
    /**
     * 向参数列表中添加参数并返回当前参数的参数名
     * @param {array} values 参数列表
     * @param {any} value 参数值
     */
    compileParameter(param, params, parent = null) {
        params.add(param);
        return this.prepareParameterName(param);
    }
    prepareParameterName(p) {
        return this.options.parameterPrefix + (p.name || '');
    }
    properVariantName(name) {
        return this.options.variantPrefix + name;
    }
    compileVariant(variant, params, parent) {
        return this.properVariantName(variant.name);
    }
    compileDate(date) {
        return "'" + moment(date).format('YYYY-MM-DD HH:mm:ss.SSS') + "'";
    }
    compileBoolean(value) {
        return value ? '1' : '0';
    }
    compileString(value) {
        return `'${value.replace(/'/g, "''")}'`;
    }
    compileConstant(constant, params, parent) {
        const value = constant.value;
        if (value === null) {
            return 'NULL';
        }
        if (_.isString(value)) {
            return this.compileString(value);
        }
        if (_.isNumber(value) || typeof value === 'bigint') {
            return value.toString(10);
        }
        if (_.isBoolean(value)) {
            return this.compileBoolean(value);
        }
        if (_.isDate(value)) {
            return this.compileDate(value);
        }
        if (_.isBuffer(value)) {
            return '0x' + value.toString('hex');
        }
        if (_.isArrayBuffer(value) || _.isArray(value)) {
            return '0x' + Buffer.from(value).toString('hex');
        }
        console.debug(value);
        // @ts-ignore
        throw new Error('unsupport constant value type:' + value.toString());
    }
    compile(ast) {
        const params = new Set();
        return {
            sql: this.compileAST(ast, params),
            params: Array.from(params)
        };
    }
    compileBuildInIdntifier(ast, params, parent) {
        return ast.name;
    }
    compileAST(ast, params, parent) {
        switch (ast.type) {
            case constants_1.SQL_SYMBOLE.SELECT:
                return this.compileSelect(ast, params, parent);
            case constants_1.SQL_SYMBOLE.UPDATE:
                return this.compileUpdate(ast, params, parent);
            case constants_1.SQL_SYMBOLE.ASSIGNMENT:
                return this.compileAssignment(ast, params, parent);
            case constants_1.SQL_SYMBOLE.INSERT:
                return this.compileInsert(ast, params, parent);
            case constants_1.SQL_SYMBOLE.DELETE:
                return this.compileDelete(ast, params, parent);
            case constants_1.SQL_SYMBOLE.DECLARE:
                return this.compileDeclare(ast, params, parent);
            case constants_1.SQL_SYMBOLE.BRACKET_EXPRESSION:
                return this.compileBracket(ast, params, parent);
            case constants_1.SQL_SYMBOLE.CONSTANT:
                return this.compileConstant(ast, params, parent);
            case constants_1.SQL_SYMBOLE.INVOKE_ARGUMENT_LIST:
                return this.compileInvokeArgumentList(ast, params, parent);
            case constants_1.SQL_SYMBOLE.COLUMN_LIST:
                return this.compileColumnList(ast, params, parent);
            case constants_1.SQL_SYMBOLE.VALUE_LIST:
                return this.compileValueList(ast, params, parent);
            case constants_1.SQL_SYMBOLE.EXECUTE_ARGUMENT_LIST:
                return this.compileExecuteArgumentList(ast, params, parent);
            case constants_1.SQL_SYMBOLE.ALIAS:
                return this.compileAlias(ast, params, parent);
            case constants_1.SQL_SYMBOLE.IDENTIFIER:
                return this.compileIdentifier(ast, params, parent);
            case constants_1.SQL_SYMBOLE.BUILDIN_IDENTIFIER:
                return this.compileBuildInIdntifier(ast, params, parent);
            case constants_1.SQL_SYMBOLE.EXECUTE:
                return this.compileExecute(ast, params, parent);
            case constants_1.SQL_SYMBOLE.INVOKE:
                return this.compileInvoke(ast, params, parent);
            case constants_1.SQL_SYMBOLE.CASE:
                return this.compileCase(ast, params, parent);
            case constants_1.SQL_SYMBOLE.BINARY:
                return this.compileBinary(ast, params, parent);
            case constants_1.SQL_SYMBOLE.UNARY:
                return this.compileUnary(ast, params, parent);
            case constants_1.SQL_SYMBOLE.PARAMETER:
                return this.compileParameter(ast, params, parent);
            case constants_1.SQL_SYMBOLE.VARAINT:
                return this.compileVariant(ast, params, parent);
            case constants_1.SQL_SYMBOLE.JOIN:
                return this.compileJoin(ast, params, parent);
            case constants_1.SQL_SYMBOLE.UNION:
                return this.compileUnion(ast, params, parent);
            case constants_1.SQL_SYMBOLE.SORT:
                return this.compileSort(ast, params, parent);
            default:
                throw new Error('Error AST type: ' + ast.type);
        }
    }
    compileExecute(exec, params, parent) {
        const returnParam = ast_1.Parameter.output(exports.RETURN_VALUE_PARAMETER_NAME, Number);
        return 'EXECUTE ' + this.compileAST(returnParam, params, parent) +
            ' = ' + this.compileAST(exec.proc, params, exec) + ' ' +
            this.compileExecuteArgumentList(exec.args, params, exec);
    }
    compileBracket(bracket, params, parent) {
        return '(' + this.compileAST(bracket.context, params, bracket) + ')';
    }
    compileValueList(values, params, parent) {
        return '(' + values.items.map(ast => this.compileAST(ast, params, values)).join(', ') + ')';
    }
    compileColumnList(values, params, parent) {
        return values.items.map(ast => this.compileAST(ast, params, values)).join(', ');
    }
    compileInvokeArgumentList(values, params, parent) {
        return values.items.map(ast => this.compileAST(ast, params, values)).join(', ');
    }
    compileExecuteArgumentList(values, params, parent) {
        return values.items.map(ast => {
            let sql = this.compileAST(ast, params, values);
            if (ast.type === 'PARAMETER' && ast.direction === constants_1.PARAMETER_DIRECTION.OUTPUT) {
                sql += ' OUTPUT';
            }
            return sql;
        }).join(', ');
    }
    compileUnion(union, params, parent) {
        return 'UNION ' + union.all ? 'ALL ' : '' + this.compileAST(union.select, params, union);
    }
    compileAlias(alias, params, parent) {
        return this.compileAST(alias.expr, params, alias) + ' AS ' + this.quoted(alias.name);
    }
    compileCase(caseExpr, params, parent) {
        let fragment = 'CASE';
        if (caseExpr.expr)
            fragment += ' ' + this.compileAST(caseExpr.expr, params, parent);
        fragment += ' ' + caseExpr.whens.map(when => this.compileWhen(when, params, caseExpr));
        if (caseExpr.defaults)
            fragment += ' ELSE ' + this.compileAST(caseExpr.defaults, params, caseExpr);
        fragment += ' END';
        return fragment;
    }
    compileWhen(when, params, parent) {
        return 'WHEN ' + this.compileAST(when.expr, params, when) + ' THEN ' + this.compileAST(when.value, params, when);
    }
    compileBinary(expr, params, parent) {
        return this.compileAST(expr.left, params, expr) + ' ' + expr.operator + ' ' + this.compileAST(expr.right, params, expr);
    }
    compileUnary(expr, params, parent) {
        return expr.operator + ' ' + this.compileAST(expr.next, params, expr);
    }
    /**
     * 函数调用
     * @param {*} invoke
     * @param {*} params
     * @returns
     * @memberof Executor
     */
    compileInvoke(invoke, params, parent) {
        return `${this.compileAST(invoke.func, params, invoke)}(${(invoke.args.items || []).map(v => this.compileAST(v, params, invoke)).join(', ')})`;
    }
    compileJoin(join, params, parent) {
        return (join.left ? 'LEFT ' : '') + 'JOIN ' + this.compileAST(join.table, params, join) + ' ON ' + this.compileAST(join.on, params, join);
    }
    compileSort(sort, params, parent) {
        let sql = this.compileAST(sort.expr, params, sort);
        if (sort.direction)
            sql += ' ' + sort.direction;
        return sql;
    }
    compileSelect(select, params, parent) {
        const { tables, top, joins, unions, columns, filters, sorts, groups, havings, offsets, limits, isDistinct } = select;
        let sql = 'SELECT ';
        if (isDistinct) {
            sql += 'DISTINCT ';
        }
        if (_.isNumber(top)) {
            sql += `TOP ${top} `;
        }
        sql += columns.items.map(expr => this.compileAST(expr, params, columns)).join(', ');
        if (tables) {
            sql += ' FROM ' + tables.map(table => this.compileAST(table, params, parent)).join(', ');
        }
        if (joins && joins.length > 0) {
            sql += ' ' + joins.map(join => this.compileJoin(join, params, parent)).join(' ');
        }
        if (filters) {
            sql += ' WHERE ' + this.compileAST(filters, params, parent);
        }
        if (groups && groups.length) {
            sql += ' GROUP BY ' + groups.map(p => this.compileAST(p, params, parent)).join(', ');
        }
        if (havings) {
            sql += ' HAVING ' + this.compileAST(havings, params, parent);
        }
        if (sorts && sorts.length > 0) {
            sql += ' ORDER BY ' + sorts.map(sort => this.compileSort(sort, params, parent)).join(', ');
        }
        if (_.isNumber(offsets)) {
            sql += ` OFFSET ${offsets || 0} ROWS`;
        }
        if (_.isNumber(limits)) {
            sql += ` FETCH NEXT ${limits} ROWS ONLY`;
        }
        if (unions) {
            sql += ' ' + this.compileUnion(unions, params, parent);
        }
        return sql;
    }
    compileInsert(insert, params, parent) {
        const { table, rows, fields } = insert;
        let sql = 'INSERT INTO ';
        sql += this.compileAST(table, params, parent);
        if (fields) {
            sql += '(' + fields.map(field => this.compileAST(field, params, parent)).join(', ') + ')';
        }
        if (_.isArray(rows)) {
            sql += ' VALUES';
            sql += rows.map(row => this.compileAST(row, params, parent)).join(', ');
        }
        else {
            sql += ' ' + this.compileAST(rows, params, parent);
        }
        return sql;
    }
    compileAssignment(assign, params, parent) {
        const { left, right } = assign;
        return this.compileAST(left, params, parent) + ' = ' + this.compileAST(right, params, parent);
    }
    compileDeclare(declare, params, parent) {
        return 'DECLARE ' + declare.declares.map(varDec => this.properVariantName(varDec.name) + ' ' + varDec.dataType).join(', ');
    }
    compileUpdate(update, params, parent) {
        const { table, sets, filters, tables, joins } = update;
        assert(table, 'table is required by update statement');
        assert(sets, 'set statement un declared');
        let sql = 'UPDATE ';
        // 必须以Identifier解析，否则会生成别名
        sql += this.compileIdentifier(table);
        sql += ' SET ' + sets.map(({ left, right }) => this.compileAST(left, params, update) + ' = ' + this.compileAST(right, params, parent)).join(', ');
        if (tables && tables.length > 0) {
            sql += ' FROM ' + tables.map(table => this.compileAST(table, params, update)).join(', ');
        }
        if (joins && joins.length > 0) {
            sql += ' ' + joins.map(join => this.compileJoin(join, params, update)).join(' ');
        }
        if (filters) {
            sql += ' WHERE ' + this.compileAST(filters, params, update);
        }
        return sql;
    }
    compileDelete(del, params, parent) {
        const { table, tables, joins, filters } = del;
        let sql = 'DELETE ';
        if (table)
            sql += this.compileAST(table, params, parent);
        if (tables && tables.length > 0) {
            sql += ' FROM ' + tables.map(table => this.compileAST(table, params, parent)).join(', ');
        }
        if (joins) {
            sql += joins.map(join => this.compileJoin(join, params, parent)).join(' ');
        }
        if (filters) {
            sql += ' WHERE ' + this.compileAST(filters, params, parent);
        }
        return sql;
    }
}
exports.Compiler = Compiler;
//# sourceMappingURL=compiler.js.map