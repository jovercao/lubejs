/// <reference types="node" />
import { EventEmitter } from 'events';
import { Parameter, Select, JsConstant, UnsureIdentity, UnsureExpressions, SortInfo, Conditions, Statement, Assignment, KeyValueObject, UnsureConditions, SortObject } from './ast';
import { Parser } from './parser';
export interface QueryResult {
    rows?: object[];
    output?: {
        [key: string]: JsConstant;
    };
    rowsAffected: number;
    returnValue?: any;
}
export interface QueryHandler {
    (sql: string, params: Parameter[]): Promise<QueryResult>;
}
export interface SelectOptions {
    where?: UnsureConditions;
    top?: number;
    offset?: number;
    limit?: number;
    distinct?: boolean;
    fields?: string[];
    sorts?: SortObject | (SortInfo | UnsureExpressions)[];
}
interface IExecuotor {
    doQuery: QueryHandler;
    query(sql: string, params: Parameter[]): Promise<QueryResult>;
    query(sql: string, params: Object): Promise<QueryResult>;
    query(sql: Statement | Document): Promise<QueryResult>;
    /**
     * 执行一个查询并获取返回的第一个标量值
     * @param sql
     */
    queryScalar(sql: string, params: Parameter[]): Promise<JsConstant>;
    queryScalar(sql: string, params: Object): Promise<JsConstant>;
    queryScalar(sql: Statement | Document): Promise<JsConstant>;
    queryScalar(sql: string[], ...params: any[]): Promise<JsConstant>;
    /**
     * 插入数据的快捷操作
     * @param {*} table
     * @param {array?} fields 字段列表，可空
     * @param {*} rows 可接受二维数组/对象，或者单行数组
     */
    insert(table: UnsureIdentity, select: Select): Promise<number>;
    insert(table: UnsureIdentity, fields: UnsureIdentity[], select: Select): Promise<number>;
    insert(table: UnsureIdentity, rows: KeyValueObject[]): Promise<number>;
    insert(table: UnsureIdentity, row: KeyValueObject): Promise<number>;
    insert(table: UnsureIdentity, fields: UnsureIdentity[], rows: UnsureExpressions[][]): Promise<number>;
    find(table: UnsureIdentity, where: Conditions, fields?: string[]): Promise<object>;
    /**
     * 简化版的SELECT查询，用于快速查询，如果要用复杂的查询，请使用select语句
     * @param table
     * @param where
     * @param options
     */
    select(table: UnsureIdentity, options?: SelectOptions): Promise<object>;
    update(table: UnsureIdentity, sets: Assignment[], where?: UnsureConditions): Promise<number>;
    update(table: UnsureIdentity, sets: KeyValueObject, where?: UnsureConditions): Promise<number>;
    update(table: UnsureIdentity, sets: KeyValueObject | Assignment[], where?: UnsureConditions): Promise<number>;
    execute(spname: UnsureIdentity, params: UnsureExpressions[]): Promise<number>;
    execute(spname: UnsureIdentity, params: Parameter[]): Promise<number>;
    /**
     * 执行存储过程
     * @param spname 存储过程名称
     * @param params
     */
    execute(spname: any, params: any): Promise<QueryResult>;
}
export declare class Executor extends EventEmitter implements IExecuotor {
    doQuery: QueryHandler;
    protected parser: Parser;
    readonly isTrans: boolean;
    /**
     * SQL执行器
     * @param {*} query 查询函数
     * @param {*} parser 编译函数
     */
    protected constructor(query: QueryHandler, parser: Parser, isTrans?: boolean);
    _internalQuery(...args: any[]): Promise<QueryResult>;
    query(sql: string, params: Parameter[]): Promise<QueryResult>;
    query(sql: string, params: Object): Promise<QueryResult>;
    query(sql: Statement | Document): Promise<QueryResult>;
    query(sql: string[], ...params: any[]): Promise<QueryResult>;
    /**
     * 执行一个查询并获取返回的第一个标量值
     * @param sql
     */
    queryScalar(sql: string, params: Parameter[]): Promise<JsConstant>;
    queryScalar(sql: string, params: Object): Promise<JsConstant>;
    queryScalar(sql: Statement | Document): Promise<JsConstant>;
    queryScalar(sql: string[], ...params: any[]): Promise<JsConstant>;
    /**
     * 插入数据的快捷操作
     * @param {*} table
     * @param {array?} fields 字段列表，可空
     * @param {*} rows 可接受二维数组/对象，或者单行数组
     */
    insert(table: UnsureIdentity, select: Select): any;
    insert(table: UnsureIdentity, fields: UnsureIdentity[], select: Select): any;
    insert(table: UnsureIdentity, rows: KeyValueObject[]): any;
    insert(table: UnsureIdentity, row: KeyValueObject): any;
    insert(table: UnsureIdentity, fields: UnsureIdentity[], rows: UnsureExpressions[][]): any;
    find(table: UnsureIdentity, where: Conditions, fields?: string[]): Promise<object>;
    /**
     * 简化版的SELECT查询，用于快速查询，如果要用复杂的查询，请使用select语句
     * @param table
     * @param where
     * @param options
     */
    select(table: UnsureIdentity, options?: SelectOptions): Promise<object[]>;
    update(table: UnsureIdentity, sets: Assignment[], where?: UnsureConditions): any;
    update(table: UnsureIdentity, sets: KeyValueObject, where?: UnsureConditions): any;
    delete(table: UnsureIdentity, where?: UnsureConditions): Promise<number>;
    execute(spname: UnsureIdentity, params: UnsureExpressions[]): any;
    execute(spname: UnsureIdentity, params: Parameter[]): any;
}
export {};
