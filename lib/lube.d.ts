import { Executor, QueryResult } from './executor';
import { Compiler, CompileOptions } from './compiler';
import { ISOLATION_LEVEL } from './constants';
export declare type TransactionHandler = (executor: Executor, abort: () => Promise<void>) => Promise<any>;
/**
 * 数据库事务
 */
export interface ITransaction {
    query(): Promise<QueryResult>;
    commit(): void;
    rollback(): void;
}
/**
 * 数据库提供驱动程序
 */
export interface IDbProvider {
    ployfill?: CompileOptions;
    compiler?: Compiler;
    query(sql: any, params: any): Promise<QueryResult>;
    beginTrans(isolationLevel: ISOLATION_LEVEL): ITransaction;
    close(): Promise<void>;
}
export declare class Lube extends Executor {
    private _provider;
    constructor(provider: IDbProvider, options: ConnectOptions);
    /**
     * 开启一个事务并自动提交
     * @param {*} handler (exeutor, cancel) => false
     * @param {*} isolationLevel 事务隔离级别
     */
    trans(handler: TransactionHandler, isolationLevel: any): Promise<any>;
    close(): Promise<void>;
}
export interface ConnectOptions {
    /**
     * 数据库方言，必须安装相应的驱动才可正常使用
     */
    dialect?: string;
    /**
     * 驱动程序，与dialect二选一
     */
    driver?: ((config: ConnectOptions) => IDbProvider);
    host: string;
    port?: number;
    user: string;
    password: string;
    database: string;
    poolMax: number;
    poolMin: number;
    idelTimeout: number;
    strict?: boolean;
}
/**
 * 连接数据库并返回一个连接池
 * @param {*} config
 */
export declare function connect(url: string): Promise<Lube>;
export declare function connect(config: ConnectOptions): Promise<Lube>;
export * from './builder';
export * from './constants';
export * from './ast';
export * from './compiler';
