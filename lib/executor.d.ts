/// <reference types="node" />
import { EventEmitter } from 'events';
import { Parameter, Select, JsConstant, UnsureIdentifier, UnsureExpression, SortInfo, Condition, Statement, Assignment, KeyValueObject, UnsureCondition, SortObject } from './ast';
import { Compiler } from './compiler';
export interface QueryResult {
    rows?: any[];
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
    where?: UnsureCondition;
    top?: number;
    offset?: number;
    limit?: number;
    distinct?: boolean;
    fields?: string[];
    sorts?: SortObject | (SortInfo | UnsureExpression)[];
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
    insert(table: UnsureIdentifier, select: Select): Promise<number>;
    insert(table: UnsureIdentifier, fields: UnsureIdentifier[], select: Select): Promise<number>;
    insert(table: UnsureIdentifier, rows: KeyValueObject[]): Promise<number>;
    insert(table: UnsureIdentifier, row: KeyValueObject): Promise<number>;
    insert(table: UnsureIdentifier, fields: UnsureIdentifier[], rows: UnsureExpression[][]): Promise<number>;
    find(table: UnsureIdentifier, where: Condition, fields?: string[]): Promise<object>;
    /**
     * 简化版的SELECT查询，用于快速查询，如果要用复杂的查询，请使用select语句
     * @param table
     * @param where
     * @param options
     */
    select(table: UnsureIdentifier, options?: SelectOptions): Promise<object>;
    update(table: UnsureIdentifier, sets: Assignment[], where?: UnsureCondition): Promise<number>;
    update(table: UnsureIdentifier, sets: KeyValueObject, where?: UnsureCondition): Promise<number>;
    update(table: UnsureIdentifier, sets: KeyValueObject | Assignment[], where?: UnsureCondition): Promise<number>;
    execute(spname: UnsureIdentifier, params: UnsureExpression[]): Promise<number>;
    execute(spname: UnsureIdentifier, params: Parameter[]): Promise<number>;
    /**
     * 执行存储过程
     * @param spname 存储过程名称
     * @param params
     */
    execute(spname: any, params: any): Promise<QueryResult>;
}
export declare class Executor extends EventEmitter implements IExecuotor {
    doQuery: QueryHandler;
    protected parser: Compiler;
    readonly isTrans: boolean;
    /**
     * SQL执行器
     * @param {*} query 查询函数
     * @param {*} parser 编译函数
     */
    protected constructor(query: QueryHandler, parser: Compiler, isTrans?: boolean);
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
    insert(table: UnsureIdentifier, select: Select): any;
    insert(table: UnsureIdentifier, fields: UnsureIdentifier[], select: Select): any;
    insert(table: UnsureIdentifier, rows: KeyValueObject[]): any;
    insert(table: UnsureIdentifier, row: KeyValueObject): any;
    insert(table: UnsureIdentifier, fields: UnsureIdentifier[], rows: UnsureExpression[][]): any;
    find(table: UnsureIdentifier, where: Condition, fields?: string[]): Promise<any>;
    /**
     * 简化版的SELECT查询，用于快速查询，如果要用复杂的查询，请使用select语句
     * @param table
     * @param where
     * @param options
     */
    select(table: UnsureIdentifier, options?: SelectOptions): Promise<any[]>;
    update(table: UnsureIdentifier, sets: Assignment[], where?: UnsureCondition): any;
    update(table: UnsureIdentifier, sets: KeyValueObject, where?: UnsureCondition): any;
    delete(table: UnsureIdentifier, where?: UnsureCondition): Promise<number>;
    execute(spname: UnsureIdentifier, params: UnsureExpression[]): any;
    execute(spname: UnsureIdentifier, params: Parameter[]): any;
}
export {};
