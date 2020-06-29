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
     * @param {*} compile 编译函数
     */
    constructor(query, compile, ployfill) {
        super();
        // 是否启用严格模式，避免关键字等问题
        this._query = query;
        this._compile = compile;
        this._ployfill = ployfill;
    }
    // async _internalQuery(sql: string, params: Parameter[]): Promise<QueryResult>
    // async _internalQuery(sql: string, params: Object): Promise<QueryResult>
    // async _internalQuery(sql: string[], ...params: any[]): Promise<QueryResult>
    async _internalQuery(...args) {
        let sql, params;
        // 如果是模板字符串
        if (_.isArray(args[0])) {
            params = [];
            sql = args[0].reduce((previous, current, index) => {
                previous += current;
                if (index < args.length - 1) {
                    const name = '__p__' + index;
                    params.push(builder_1.input(name, args[index + 1]));
                    previous += this._ployfill.paramPrefix + name;
                }
                return previous;
            }, '');
        }
        util_1.assert(_.isString(args[0]), 'sql 必须是字符串或者模板调用');
        sql = args[0];
        if (_.isObject(args[1])) {
            params = Object.entries(args[1]).map(([name, value]) => builder_1.input(name, value));
        }
        try {
            const res = await this._query(sql, params);
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
        if (args[0] instanceof ast_1.Statement) {
            const cmd = this._compile(args[0]);
            const res = await this._internalQuery(cmd.sql, cmd.params);
            return res;
        }
        const res = await this._internalQuery(...args);
        return res;
    }
    async insert(table, ...args) {
        let fields, rows;
        if (args.length >= 2) {
            fields = args[0];
            rows = args[1];
        }
        else {
            rows = args[0];
        }
        const sql = builder_1.insert(table, fields).values(rows);
        const res = await this.query(sql);
        return res.rowsAffected;
    }
    async find(table, where) {
        const sql = builder_1.select().top(1).from(table).where(where);
        const res = await this.query(sql);
        if (res.rows && res.rows.length > 0) {
            return res.rows[0];
        }
        return null;
    }
    async select(table, where, options) {
        const { sorts, offset, limit, columns } = options;
        const sql = builder_1.select().from(table);
        if (columns) {
            sql.select(columns);
        }
        else {
            sql.select(builder_1.allField());
        }
        if (where) {
            sql.where(where);
        }
        if (sorts) {
            sql.orderby(sorts);
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
        const sql = proc(spname).call(params);
        const res = await this.query(sql);
        return res;
    }
}
exports.Executor = Executor;
module.exports = {
    Executor
};
//# sourceMappingURL=executor.js.map