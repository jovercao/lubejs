"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Executor = void 0;
const _ = require("lodash");
const util_1 = require("./util");
const events_1 = require("events");
const builder_1 = require("./builder");
const ast_1 = require("./ast");
class Executor extends events_1.EventEmitter {
    /**
     * SQL执行器
     * @param {*} query 查询函数
     * @param {*} parser 编译函数
     */
    constructor(query, parser, isTrans = false) {
        super();
        // 是否启用严格模式，避免关键字等问题
        this.doQuery = query;
        this.parser = parser;
        this.isTrans = isTrans;
    }
    // async _internalQuery(sql: string, params: Parameter[]): Promise<QueryResult>
    // async _internalQuery(sql: string, params: Object): Promise<QueryResult>
    // async _internalQuery(sql: string[], ...params: any[]): Promise<QueryResult>
    async _internalQuery(...args) {
        let sql, params;
        // 如果是AST直接编译
        if (args[0] instanceof ast_1.AST) {
            ({ sql, params } = this.parser.parse(args[0]));
            // eslint-disable-next-line brace-style
        }
        // 如果是模板字符串
        else if (_.isArray(args[0])) {
            params = [];
            sql = args[0].reduce((previous, current, index) => {
                previous += current;
                if (index < args.length - 1) {
                    const name = '__p__' + index;
                    const param = builder_1.input(name, args[index + 1]);
                    params.push(param);
                    previous += this.parser.properParameterName(param);
                }
                return previous;
            }, '');
        }
        else {
            util_1.assert(_.isString(args[0]), 'sql 必须是字符串或者模板调用');
            sql = args[0];
            if (_.isObject(args[1])) {
                params = Object.entries(args[1]).map(([name, value]) => builder_1.input(name, value));
            }
        }
        try {
            const res = await this.doQuery(sql, params);
            // 如果有输出参数
            if (res.output) {
                Object.entries(res.output).forEach(([name, value]) => {
                    const p = params.find(p => p.name === name);
                    p.value = value;
                    if (p.name === '_ReturnValue_') {
                        res.returnValue = value;
                    }
                });
            }
            return res;
        }
        catch (ex) {
            this.emit('error', ex);
            throw ex;
        }
        finally {
            this.emit('command', { sql, params });
        }
    }
    async query(...args) {
        return this._internalQuery(...args);
    }
    async queryScalar(...args) {
        const { rows: [row] } = await this._internalQuery(...args);
        util_1.assert(row, 'sql not return recordsets.');
        return row[Object.keys(row)[0]];
    }
    async insert(table, ...args) {
        let fields, rows;
        if (args.length > 2) {
            fields = args[0];
            rows = args[1];
        }
        else {
            rows = args[0];
        }
        const sql = builder_1.insert(table, fields);
        // one row => rows
        if (!_.isArray(rows) && !_.isArray(rows[0])) {
            rows = [rows];
        }
        if (_.isArray(rows[0])) {
            sql.values(...rows);
        }
        else {
            sql.values(...rows);
        }
        const res = await this.query(sql);
        return res.rowsAffected;
    }
    async find(table, where, fields) {
        let columns;
        if (fields) {
            columns = fields.map(fieldName => builder_1.field(fieldName));
        }
        else {
            columns = [builder_1.anyFields];
        }
        const sql = builder_1.select(...columns).top(1).from(table).where(where);
        const res = await this.query(sql);
        if (res.rows && res.rows.length > 0) {
            return res.rows[0];
        }
        return null;
    }
    /**
     * 简化版的SELECT查询，用于快速查询，如果要用复杂的查询，请使用select语句
     * @param table
     * @param where
     * @param options
     */
    async select(table, options = {}) {
        const { where, sorts, offset, limit, fields } = options;
        let columns;
        if (fields) {
            columns = fields.map(fieldName => builder_1.field(fieldName));
        }
        else {
            columns = [builder_1.anyFields];
        }
        const sql = builder_1.select(...columns).from(table);
        if (where) {
            sql.where(where);
        }
        if (sorts) {
            if (_.isArray(sorts)) {
                sql.orderBy(...sorts);
            }
            else {
                sql.orderBy(sorts);
            }
        }
        if (!_.isUndefined(offset)) {
            sql.offset(offset);
        }
        if (!_.isUndefined(limit)) {
            sql.limit(limit);
        }
        const res = await this.query(sql);
        return res.rows;
    }
    async update(table, sets, where) {
        const sql = builder_1.update(table);
        if (_.isArray(sets)) {
            sql.set(...sets);
        }
        else {
            sql.set(sets);
        }
        if (where)
            sql.where(where);
        const res = await this.query(sql);
        return res.rowsAffected;
    }
    async delete(table, where) {
        const sql = builder_1.del(table);
        if (where)
            sql.where(where);
        const res = await this.query(sql);
        return res.rowsAffected;
    }
    async execute(spname, params) {
        const sql = builder_1.exec(spname, params);
        const res = await this.query(sql);
        return res;
    }
}
exports.Executor = Executor;
//# sourceMappingURL=executor.js.map