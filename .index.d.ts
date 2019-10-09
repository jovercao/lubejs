import * as OracleDB from 'oracledb'
import { ConnectionOptions } from 'tls';

declare namespace EasyOracleDB {

  const SYSDBA: Symbol;

  /**
   * 连接池
   */
  interface Pool {
    /**
     * 获取一个连接
     */
    async getConnection(): Connection;
    async close(): void;
  }

  /**
   * 查询结果
   */
  interface QueryResult {
    /**
     * 返回的结果集数据
     */
    rows: Array<Object>;
    /**
     * 受影响的行数
     */
    rowsAffected: Number
  }

  interface SelectOptions {
    where?: Condition | Object;
    offset?: Number;
    fields?: Array<String>;

  }

  enum Operator {
    eq,
    uneq,
    gt,
    lt,
    gte,
    lte,
    is,
    notis,
    in,
    notin
  }

  /**
   * 可兼容数据的值类型
   */
  type ValueType = String | Number | Boolean | Date

  /**
   * 查询条件
   */
  type ObjectCondition = Object;

  /**
   * 查询条件助手
   */
  interface Condition {

    /**
     *
     * @param obj 从一个object创建查询条件
     */
    static parser(obj: ObjectCondition): Condition;
    static eq(field: String, value: ValueType): Connection;
    static uneq(field: String, value: ValueType): Condition;
    static gt(field: String, value: ValueType): Condition;
    static lt(field: String, value: Valuetype): Condition;
    static gte(field: String, value: ValueType): Condition;
    static lte(field: String, value: ValueType): Condition;
    static in(field: String, value: Array<ValueType>): Condition;
    static notin(field: String, value: Array<ValueType>): Condition;
    static isnull(field: String): Condition;
    static isnotnull(field: String): Condition;
    static compare(field: String, operator: Operator, value: ValueType | Array<ValueType>): Condition;
    static not(condition: Condition);
    // static group(...conditions: Array<Condition>): Condition;
    and(condition: Condition): Condition;
    andNot(condition: Condition): Condition;
    or(condition: Condition): Condition;
    orNot(condition: Condition): Condition;
    andGroup(...conditions: Array<Condition>): Condition;
    orGroup(...conditions: Array<Condition>): Condition;
    /**
     * 获取最终的OptionsObject，用于查询
     */
    readonly value: ObjectCondition;
  }

  /**
   * 数据库连接
   */
  interface Connection {
    /**
     * 关闭数据连接，如果是连接池中获取的连接，则会释放使用权，并回收到连接池中，由连接池再次分配给下一个pool.getConnection()的人
     * 调用此方法前请确保启动的事务已经提交或者回滚，否则将抛出异常
     */
    async close(): void;
    /**
     * 执行一个查询，并返回结果
     * 具体请参考node-oracledb，Connection.execute() 函数
     * @param sql Sql语句
     * @param params 绑定参数
     * @param options 执行选项
     */
    async execute(sql: String, params: Object | Array, options: OracleDB.ExecuteOptions): OracleDB.Result<Object | Array>;
    async query(sql: String, params: Object | Array): QueryResult;

    async find(table: String, where: Condition | Object): Object;
    async select(table: String, options: SelectOptions): Array<Object>
    async insert(table: String, row: Object): Number;
    async update(table: String, row: Object, where: Condition | Object): Number;
    async delete(table: String, where: Condition | Object): Number;
  }

  /**
   * DBNULL常量
   */
  const NULL: Symbol;

  /**
   * 创建连接池
   * @param config 配置
   */
  function createPool(config: OracleDB.PoolAttributes): Pool;

  /**
   * 创建一个数据库连接
   * @param config 数据库连接选项
   */
  function connect(config: OracleDB.ConnectionAttributes): Connection;
}

export = EasyOracleDB
