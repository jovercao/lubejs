"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !exports.hasOwnProperty(p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connect = exports.Lube = void 0;
const executor_1 = require("./executor");
const parser_1 = require("./parser");
const url_1 = require("url");
const console_1 = require("console");
class Lube extends executor_1.Executor {
    constructor(provider, options) {
        let parser = provider.parser;
        if (!parser) {
            parser = new parser_1.Parser(provider.ployfill, options);
        }
        super(function (...args) {
            return provider.query(...args);
        }, parser);
        this._provider = provider;
    }
    /**
     * 开启一个事务并自动提交
     * @param {*} handler (exeutor, cancel) => false
     * @param {*} isolationLevel 事务隔离级别
     */
    async trans(handler, isolationLevel) {
        if (this.isTrans) {
            throw new Error('is in transaction now');
        }
        let canceled = false;
        const { query, commit, rollback } = await this._provider.beginTrans(isolationLevel);
        const abort = async function () {
            canceled = true;
            await rollback();
        };
        const executor = new executor_1.Executor(query, this.parser, true);
        executor.on('command', cmd => this.emit('command', cmd));
        executor.on('error', cmd => this.emit('error', cmd));
        try {
            const res = await handler(executor, abort);
            if (!canceled) {
                await commit();
            }
            return res;
        }
        catch (ex) {
            if (!canceled) {
                await rollback();
            }
            throw ex;
        }
    }
    async close() {
        await this._provider.close();
    }
}
exports.Lube = Lube;
async function connect(arg) {
    let config;
    if (typeof arg === 'string') {
        const url = new url_1.URL(arg);
        const params = url.searchParams;
        const options = {
            poolMax: 100,
            // 最低保持0个连接
            poolMin: 0,
            // 连接闲置关闭等待时间
            idelTimeout: 30
        };
        for (const [key, value] of params.entries()) {
            if (value !== undefined) {
                options[key] = value;
            }
        }
        const dialect = url.protocol.substr(0, url.protocol.length - 1).toLowerCase();
        try {
            config = {
                dialect,
                host: url.host,
                port: url.port && parseInt(url.port),
                user: url.username,
                password: url.password,
                database: url.pathname.split('|')[0],
                ...options
            };
        }
        catch (error) {
            throw new Error('Unsupport or uninstalled dialect: ' + dialect);
        }
    }
    else {
        config = arg;
    }
    console_1.assert(config.driver || config.dialect, 'One of the dialect and driver items must be specified.');
    if (!config.driver) {
        try {
            config.driver = require('lubejs-' + config.dialect);
        }
        catch (err) {
            throw new Error('Unsupported dialect or driver not installed.');
        }
    }
    const provider = await config.driver(config);
    return new Lube(provider, config);
}
exports.connect = connect;
__exportStar(require("./builder"), exports);
__exportStar(require("./constants"), exports);
__exportStar(require("./ast"), exports);
__exportStar(require("./parser"), exports);
//# sourceMappingURL=lube.js.map