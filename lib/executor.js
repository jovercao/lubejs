"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _ = require("lodash");
const util_1 = require("./util");
const events_1 = require("events");
const builder_1 = require("./builder");
const constants_1 = require("./constants");
const ast_1 = require("./ast");
class Executor extends events_1.EventEmitter {
    /**
     * SQL执行器
     * @param {*} query 查询函数
     * @param {*} compile 编译函数
     */
    constructor(query, compile, properParameter) {
        super();
        // 是否启用严格模式，避免关键字等问题
        this._query = query;
        this._compile = compile;
        this._properParameter = properParameter;
    }
    async _internalQuery(sql, params) {
        // 如果是模板字符串
        if (_.isArray(sql)) {
            const _params = [];
            sql = sql.reduce((total, current, index) => {
                total += current;
                if (index < arguments.length - 1) {
                    const name = 'p_p_' + index;
                    _params.push({
                        name,
                        value: arguments[index + 1]
                    });
                    total += this._properParameter(name);
                }
                return total;
            }, '');
            params = _params;
        }
        util_1.assert(_.isString(sql), 'sql 必须是字符串或者模板调用');
        if (_.isPlainObject(params)) {
            params = Object.entries(params).map(([name, value]) => ({ name, value, direction: constants_1.ParameterDirection.INPUT }));
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
    async query(sql, params) {
        if (sql instanceof ast_1.Statement) {
            const cmd = this._compile(sql);
            const res = await this._internalQuery(cmd.sql, cmd.params);
            return res;
        }
        const res = await this._internalQuery(...arguments);
        return res;
    }
    /**
     * 插入数据的快捷操作
     * @param {*} table
     * @param {array?} fields 字段列表，可空
     * @param {*} rows 可接受二维数组/对象，或者单行数组
     */
    async insert(table, fields, rows) {
        if (arguments.length < 3) {
            rows = fields;
            fields = undefined;
        }
        const sql = builder_1.insert(table);
        if (fields)
            sql.fields(fields);
        sql.values(rows);
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
    async select(table, { where, groups, orders, offset, limit, columns } = {}) {
        const sql = builder_1.select().from(table);
        if (columns) {
            sql.columns(columns);
        }
        else {
            sql.columns(builder_1.all());
        }
        if (where) {
            sql.where(where);
        }
        if (groups) {
            sql.groupby(groups);
        }
        if (orders) {
            sql.orderby(orders);
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
        const sql = builder_1.update(table).set(sets);
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
module.exports = {
    Executor
};
//# sourceMappingURL=executor.js.map