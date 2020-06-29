/// <reference types="node" />
import { EventEmitter } from 'events';
import { Parameter, AST, Select, UnsureIdentity, UnsureExpressions, SortInfo, Conditions, Assignment, ValueObject } from './ast';
interface QueryResult {
    output?: object;
    rows?: object[];
    rowsAffected: number;
    returnValue?: any;
}
export interface QueryHandler {
    (sql: string, params: Parameter[]): Promise<QueryResult>;
}
export interface Command {
    sql: string;
    params: Parameter[];
}
export interface Compiler {
    (ast: AST): Command;
}
/**
 * 兼容
 */
export interface Ployfill {
    /**
     * 参数前缀
     */
    paramPrefix: string;
    /**
     * 标识符引用，左
     */
    quotedLeft: string;
    /**
     * 标识符引用，右
     */
    quotedRight: string;
}
export interface SelectOptions {
    top?: number;
    offset?: number;
    limit?: number;
    distinct?: boolean;
    columns?: string[];
    sorts?: (SortInfo | UnsureExpressions)[];
}
export declare class Executor extends EventEmitter {
    private _query;
    private _compile;
    private _ployfill;
    /**
     * SQL执行器
     * @param {*} query 查询函数
     * @param {*} compile 编译函数
     */
    constructor(query: QueryHandler, compile: Compiler, ployfill: Ployfill);
    _internalQuery(...args: any[]): Promise<QueryResult>;
    query(sql: string, params: Parameter[]): Promise<QueryResult>;
    query(sql: string, params: Object): Promise<QueryResult>;
    query(sql: AST): Promise<QueryResult>;
    query(sql: string[], ...params: any[]): Promise<QueryResult>;
    /**
     * 插入数据的快捷操作
     * @param {*} table
     * @param {array?} fields 字段列表，可空
     * @param {*} rows 可接受二维数组/对象，或者单行数组
     */
    insert(table: UnsureIdentity, select: Select): any;
    insert(table: UnsureIdentity, fields: UnsureIdentity[], select: Select): any;
    insert(table: UnsureIdentity, rows: object[]): any;
    insert(table: UnsureIdentity, fields: UnsureIdentity[], rows: object[]): any;
    insert(table: UnsureIdentity, fields: UnsureIdentity[], rows: UnsureExpressions[][]): any;
    find(table: any, where: any): Promise<object>;
    select(table: UnsureIdentity, where: Conditions, options: SelectOptions): Promise<object[]>;
    update(table: UnsureIdentity, sets: Assignment[], where?: Conditions): any;
    update(table: UnsureIdentity, sets: ValueObject, where?: Conditions): any;
    delete(table: any, where: any): Promise<number>;
    execute(spname: any, params: any): Promise<QueryResult>;
}
export {};
