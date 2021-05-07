/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Condition,
  CompatibleExpression,
  ScalarType,
  RowObject,
  Parameter,
  SortInfo,
  SortObject,
  WhereObject,
  Rowset,
  CompatibleSortInfo,
  InputObject,
  ProxiedRowset,
} from "./ast";
import { Compiler } from "./compiler";
import { ISOLATION_LEVEL } from "./constants";
import { Executor } from "./executor";

export interface QueryResult<T extends RowObject = any> {
  rows?: T[];
  output?: {
    [key: string]: ScalarType;
  };
  rowsAffected: number;
  returnValue?: ScalarType;

  /**
   * 多数据集返回，仅支持mssql
   */
  rowsets?: any[];
}

// interface QueryParameter {
//    name: string,
//    value: any,
//    direction?: ParameterDirection
// }

export interface QueryHandler<T extends RowObject = any> {
  (sql: string, params: Parameter<ScalarType, string>[]): Promise<
    QueryResult<T>
  >;
}
export interface SelectOptions<T extends RowObject = any> {
  where?: WhereObject<T> | Condition | ((table: Readonly<ProxiedRowset<T>>) => Condition);
  top?: number;
  offset?: number;
  limit?: number;
  distinct?: boolean;
  sorts?: CompatibleSortInfo | ((rowset: Rowset<T>) => SortInfo[]);
}

export type TransactionHandler<T> = (
  executor: Executor,
  abort: () => Promise<void>
) => Promise<T>;

/**
 * 数据库事务
 */
export interface Transaction {
  query(sql: string, params: Parameter[]): Promise<QueryResult>;
  commit(): void;
  rollback(): void;
}

// /**
//  * Js常量类型构造函数
//  */
// export type JsTypeConstructor =
//   | typeof String
//   | typeof Number
//   | typeof ArrayBuffer
//   | typeof Date
//   | typeof Boolean
//   | typeof BigInt;

//   /**
//    * Js常量类型名称
//    */
// export type JsTypeName =
//   | "string"
//   | "number"
//   | "date"
//   | "boolean"
//   | "bigint"
//   | "binary";

// TODO: 建立命令查询器，针对model的
/**
 * 命令生成器
 * 用于深度查询
 */
export interface CommandBuilder {
  sql: string[];
  params: Set<Parameter>;
}


export type ConnectOptions = {
  /**
   * 数据库方言，必须安装相应的驱动才可正常使用
   */
  dialect?: string;
  /**
   * 驱动程序，与dialect二选一，优先使用driver
   */
  driver?: Driver;
  host: string;
  port?: number;
  user: string;
  password: string;
  database: string;
  poolMax: number;
  poolMin: number;
  idelTimeout: number;
  /**
   * 其它配置项，针对各种数据的专门配置
   */
  [key: string]: any;
} & Pick<CompileOptions, 'strict' | 'returnParameterName'>

/**
 * 数据库提供驱动程序
 */
export interface IDbProvider {
  /**
   * 必须实现编译器
   */
  getCompiler(options: CompileOptions): Compiler;
  query(sql: string, params: Parameter[]): Promise<QueryResult>;
  beginTrans(isolationLevel: ISOLATION_LEVEL): Transaction;
  close(): Promise<void>;
}

/**
 * 驱动程序
 * 实际上为一个工厂函数，通过实现该方法来扩展驱动支持
 */
export interface Driver {
  (config: ConnectOptions): IDbProvider
}


export interface Command {
  sql: string;
  params: Parameter[];
}

// TODO: 使用命令生成器优化SQL字符串拼接

/**
 * 编译选项
 */
export interface CompileOptions {
  /**
   * 是否启用严格模式，默认启用
   * 如果为false，则生成的SQL标识不会被[]或""包括
   */
  strict?: boolean;
  /**
   * 标识符引用，左
   */
  quotedLeft?: string;
  /**
   * 标识符引用，右
   */
  quotedRight?: string;

  /**
   * 参数前缀
   */
  parameterPrefix?: string;

  /**
   * 变量前缀
   */
  variantPrefix?: string;

  /**
   * 返回参数名称
   */
  returnParameterName?: string;
}
