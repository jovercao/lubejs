/// <reference types="lodash" />
declare const Executor: any;
declare const Compiler: any;
declare const URL: any;
declare const builder: any;
declare const EventEmitter: any;
declare const assert: any;
declare const _: import("lodash").LoDashStatic;
declare const SqlSymbolMapps: any;
declare class Lube extends EventEmitter {
    constructor(provider: any, ployfill: any, options: any);
    /**
     * 开启一个事务并自动提交
     * @param {*} handler (exeutor, cancel) => false
     * @param {*} isolationLevel 事务隔离级别
     */
    trans(handler: any, isolationLevel: any): Promise<any>;
    close(): Promise<void>;
}
/**
 * 连接数据库并返回一个连接池
 * @param {*} config
 */
declare function connect(config: any): Promise<Lube>;
