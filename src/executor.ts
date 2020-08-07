import * as _ from 'lodash'
import { assert, ensureIdentifier, isJsConstant } from './util'
import { EventEmitter } from 'events'
import { insert, select, update, del, table as sqlTable, exec, input, field, anyFields } from './builder'
import { Parameter, AST, Select, JsConstant, Identifiers, Expressions, SortInfo, Condition, Statement, Assignment, Conditions, SortObject, ValueObject, WhereObject, Identifier, Fields, RowObject, ParameterValues } from './ast'
import { Compiler } from './compiler'
import { INSERT_MAXIMUM_ROWS } from './constants'
import { Lube } from './lube'
import { stringify } from 'querystring'

export interface QueryResult<T = RowObject> {
  rows?: T[]
  output?: {
    [key: string]: JsConstant
  }
  rowsAffected: number
  returnValue?: any
}

// interface QueryParameter {
//    name: string,
//    value: any,
//    direction?: ParameterDirection
// }


export interface QueryHandler<T = any> {
  (sql: string, params: Parameter[]): Promise<QueryResult<T>>
}

export interface SelectOptions<T = any> {
  where?: WhereObject<T> | Condition,
  top?: number,
  offset?: number,
  limit?: number,
  distinct?: boolean,
  fields?: (keyof T)[],
  sorts?: SortObject<T> | (SortInfo | Expressions)[]
}

// export interface IExecuotor {

//   doQuery: QueryHandler

//   query(sql: string, params: Parameter[]): Promise<QueryResult>
//   query(sql: string, params: Object): Promise<QueryResult>
//   query(strs: TemplateStringsArray, ...params)
//   query(sql: Statement | Document): Promise<QueryResult>

//   /**
//    * 执行一个查询并获取返回的第一个标量值
//    * @param sql
//    */
//   queryScalar(sql: string, params: Parameter[]): Promise<JsConstant>
//   queryScalar(sql: string, params: Object): Promise<JsConstant>
//   queryScalar(sql: Statement | Document): Promise<JsConstant>
//   queryScalar(sql: string[], ...params: any[]): Promise<JsConstant>

//   /**
//    * 插入数据的快捷操作
//    * @param {*} table
//    * @param {array?} fields 字段列表，可空
//    * @param {*} rows 可接受二维数组/对象，或者单行数组
//    */
//   insert(table: UnsureIdentifier, select: Select): Promise<number>
//   insert(table: UnsureIdentifier, fields: UnsureIdentifier[], select: Select): Promise<number>
//   insert<T extends KeyValueObject = KeyValueObject>(table: UnsureIdentifier, rows: T[]): Promise<number>
//   insert<T extends KeyValueObject = KeyValueObject>(table: UnsureIdentifier, row: T): Promise<number>
//   insert(table: UnsureIdentifier, fields: UnsureIdentifier[], rows: UnsureExpression[][]): Promise<number>

//   find<T = any>(table: UnsureIdentifier, where: UnsureCondition, fields?: string[]): Promise<T>

//   /**
//    * 简化版的SELECT查询，用于快速查询，如果要用复杂的查询，请使用select语句
//    * @param table
//    * @param where
//    * @param options
//    */
//   select<T = any>(table: UnsureIdentifier, options?: SelectOptions): Promise<T[]>

//   update(table: UnsureIdentifier, sets: Assignment[], where?: UnsureCondition): Promise<number>
//   update(table: UnsureIdentifier, sets: KeyValueObject, where?: UnsureCondition): Promise<number>
//   update(table: UnsureIdentifier, sets: KeyValueObject | Assignment[], where?: UnsureCondition): Promise<number>

//   execute(spname: UnsureIdentifier, params: UnsureExpression[]): Promise<number>
//   execute(spname: UnsureIdentifier, params: Parameter[]): Promise<number>

//   /**
//    * 执行存储过程
//    * @param spname 存储过程名称
//    * @param params
//    */
//   execute(spname, params): Promise<QueryResult>
// }

export class Executor extends EventEmitter {
  doQuery: QueryHandler
  readonly compiler: Compiler

  readonly isTrans: boolean

  /**
   * SQL执行器
   * @param {*} query 查询函数
   * @param {*} compiler 编译函数
   */
  protected constructor(query: QueryHandler, compiler: Compiler, isTrans: boolean = false) {
    super()
    // 是否启用严格模式，避免关键字等问题
    this.doQuery = query
    this.compiler = compiler
    this.isTrans = isTrans
  }

  // async _internalQuery(sql: string, params: Parameter[]): Promise<QueryResult>
  // async _internalQuery(sql: string, params: Object): Promise<QueryResult>
  // async _internalQuery(sql: string[], ...params: any[]): Promise<QueryResult>
  private async _internalQuery(...args: any[]) {
    let sql: string, params: Parameter[]
    // 如果是AST直接编译
    if (args[0] instanceof AST) {
      ({ sql, params } = this.compiler.compile(args[0]))
      // eslint-disable-next-line brace-style
    }
    // 如果是模板字符串
    else if (_.isArray(args[0])) {
      params = []
      sql = args[0].reduce((previous, current, index) => {
        previous += current
        if (index < args.length - 1) {
          const name = '__p__' + index
          const param = input(name, args[index + 1])
          params.push(param)
          previous += this.compiler.prepareParameterName(param)
        }
        return previous
      }, '')
    } else {
      assert(_.isString(args[0]), 'sql 必须是字符串或者模板调用')
      sql = args[0]

      if (_.isObject(args[1])) {
        params = Object.entries(args[1]).map(
          ([name, value]) => input(name, value)
        )
      }
    }

    try {
      const res = await this.doQuery(sql, params)
      // 如果有输出参数
      if (res.output) {
        Object.entries(res.output).forEach(([name, value]) => {
          const p = params.find(p => p.name === name)
          p.value = value
          if (p.name === '_ReturnValue_') {
            res.returnValue = value
          }
        })
      }
      return res
    } catch (ex) {
      this.emit('error', ex)
      throw ex
    } finally {
      this.emit('command', { sql, params })
    }
  }

  async query<TResult = any>(sql: string): Promise<QueryResult<TResult>>
  async query<TResult = any>(sql: string, params: Parameter[]): Promise<QueryResult<TResult>>
  async query<TResult = any>(sql: string, params: Object): Promise<QueryResult<TResult>>
  async query<TResult = any>(sql: Statement | Document): Promise<QueryResult<TResult>>
  async query<TResult = any>(sql: TemplateStringsArray, ...params: any[]): Promise<QueryResult<TResult>>
  async query(...args: any[]) {
    return this._internalQuery(...args)
  }

  /**
   * 执行一个查询并获取返回的第一个标量值
   * @param sql
   */
  async queryScalar<TResult extends JsConstant = any>(sql: string, params?: Parameter[]): Promise<TResult>
  async queryScalar<TResult extends JsConstant = any>(sql: string, params?: ParameterValues): Promise<TResult>
  async queryScalar<TResult extends JsConstant = any>(sql: Statement | Document): Promise<TResult>
  async queryScalar<TResult extends JsConstant = any>(sql: string[], ...params: any[]): Promise<TResult>
  async queryScalar(...args: any[]) {
    const { rows: [row] } = await this._internalQuery(...args)
    assert(row, 'sql not return recordsets.')
    return row[Object.keys(row)[0]]
  }


  /**
   * 插入数据的快捷操作
   */
  async insert(table: string, fields: string[], row: Expressions[]): Promise<number>
  async insert(table: string, fields: string[], rows: Expressions[][]): Promise<number>
  async insert(table: string, item: ValueObject): Promise<number>
  async insert(table: string, items: ValueObject[]): Promise<number>
  async insert(table: string, row: Expressions[]): Promise<number>
  async insert(table: string, rows: Expressions[][]): Promise<number>
  async insert(table: string, select: Select): Promise<number>
  async insert(table: string, fields: string[], select: Select): Promise<number>
  async insert<T>(table: string, items: ValueObject<T>[]): Promise<number>
  async insert<T>(table: string, item: ValueObject<T>): Promise<number>
  async insert<T>(table: string, fields: Identifier<void, T>[] | Fields<T>[], items: ValueObject<T>[]): Promise<number>
  async insert<T>(table: string, fields: Identifier<void, T>[] | Fields<T>[], select: Select): Promise<number>
  async insert<T>(table: string, fields: Identifier<void, T>[] | Fields<T>[], item: ValueObject<T>): Promise<number>
  async insert<T>(table: Identifier<T, any>, fields: Identifier<void, T>[] | Fields<T>[], select: Select): Promise<number>
  async insert<T>(table: Identifier<T, any>, fields: Identifier<T>[] | Fields<T>[], row: Expressions[]): Promise<number>
  async insert<T>(table: Identifier<T, any>, fields: Identifier<T>[] | Fields<T>[], rows: Expressions[][]): Promise<number>
  async insert<T>(table: Identifier<T, any>, items: ValueObject<T>[]): Promise<number>
  async insert<T>(table: Identifier<T, any>, item: ValueObject<T>): Promise<number>
  async insert<T>(table: Identifier<T, any>, fields: Identifier<void, T>[] | Fields<T>[], item: ValueObject<T>): Promise<number>
  async insert<T>(table: Identifier<T, any>, fields: Identifier<void, T>[] | Fields<T>[], items: ValueObject<T>[]): Promise<number>
  async insert(table: Identifier<any, any>, fields: string[], row: Expressions[]): Promise<number>
  async insert(table: Identifier<any, any>, fields: string[], rows: Expressions[][]): Promise<number>
  async insert(table: Identifier<any, any>, item: ValueObject): Promise<number>
  async insert(table: Identifier<any, any>, items: ValueObject[]): Promise<number>
  async insert(table: Identifier<any, any>, row: Expressions[]): Promise<number>
  async insert(table: Identifier<any, any>, rows: Expressions[][]): Promise<number>
  async insert(table: Identifier<any, any>, select: Select): Promise<number>
  async insert(table: Identifiers,
    fieldsOrValues: any,
    valuesOrUndefined?: any): Promise<number> {
    let fields: Identifiers[], values: any
    if (valuesOrUndefined) {
      fields = fieldsOrValues as Identifiers[]
      values = valuesOrUndefined
    } else {
      values = fieldsOrValues
    }

    // 确保装入数组里，以便 使用
    // UnsureExpression[] => UnsureExpression[][]
    // Object => Object[]
    if (!_.isArray(values) || (!_.isArray(values[0]) && isJsConstant(values[0]))) {
      values = [values]
    }

    const action = async function (executor: Executor): Promise<number> {
      let i = 0
      let rowsAffected = 0
      while (true) {
        if (i >= values.length) break;
        const items = (values as any[]).slice(i, i + INSERT_MAXIMUM_ROWS)
        i += INSERT_MAXIMUM_ROWS
        const sql = insert(table, fields)
        sql.values(...items)
        const res = await executor.query(sql)
        rowsAffected += res.rowsAffected
      }
      return rowsAffected
    }
    if (this instanceof Lube && !this.isTrans) {
      return await this.trans(action)
    }
    return await action(this)
  }

  async find(table: string, where: Condition, fields?: string[]): Promise<RowObject>
  async find(table: string, where: WhereObject, fields?: string[]): Promise<RowObject>
  async find<T>(table: string, where: Condition, fields?: Fields<T>[]): Promise<T>
  async find<T>(table: string, where: Condition, fields?: Identifier<void, T>[]): Promise<T>
  async find<T>(table: string, where: WhereObject<T>, fields?: Fields<T>[]): Promise<T>
  async find<T>(table: string, where: WhereObject<T>, fields?: Identifier<void, T>[]): Promise<T>
  async find<T>(table: Identifier<T, any>, where: Condition, fields?: Fields<T>[]): Promise<T>
  async find<T>(table: Identifier<T, any>, where: Condition, fields?: Identifier<void, T>[]): Promise<T>
  async find<T>(table: Identifier<T, any>, where: WhereObject<T>, fields?: Fields<T>[]): Promise<T>
  async find<T>(table: Identifier<T, any>, where: WhereObject<T>, fields?: Identifier<void, T>[]): Promise<T>
  async find(table: Identifier<any, any>, where: Condition, fields?: string[]): Promise<RowObject>
  async find(table: Identifier<any, any>, where: WhereObject, fields?: string[]): Promise<RowObject>
  async find<T = any>(table: Identifier<T> | string,
    where: Condition | WhereObject<T>,
    fields?: Fields<T>[] | Identifier<void, T>[]): Promise<T> {
    let columns: (Expressions)[]
    if (fields && fields.length > 0 && typeof fields[0] === 'string') {
      columns = (fields as string[]).map(fieldName => field(fieldName))
    } else {
      columns = [anyFields]
    }
    const sql = select(...columns).top(1).from(table).where(where)
    const res = await this.query<T>(sql)
    if (res.rows && res.rows.length > 0) {
      return res.rows[0]
    }
    return null
  }

  /**
   * 简化版的SELECT查询，用于快速查询，如果要用复杂的查询，请使用select语句
   * @param table
   * @param where
   * @param options
   */
  async select(table: string, options?: SelectOptions): Promise<RowObject[]>
  async select<TResult>(table: Identifier<TResult, any>, options: SelectOptions<TResult>): Promise<TResult[]>
  async select<TResult>(table: string, options?: SelectOptions<TResult>): Promise<TResult[]>
  async select(table: Identifier<any, any>, options?: SelectOptions): Promise<RowObject[]>
  async select<TResult = any>(table: Identifier<TResult, any> | string, options: SelectOptions<TResult> = {}): Promise<TResult[]> {
    const { where, sorts, offset, limit, fields } = options
    let columns: Expressions[]
    const t = ensureIdentifier(table)
    if (fields) {
      columns = fields.map(expr => ensureIdentifier(expr as string))
    } else {
      columns = [t.any()]
    }
    const sql = select(...columns).from(table)
    if (where) {
      sql.where(where)
    }
    if (sorts) {
      if (_.isArray(sorts)) {
        sql.orderBy(...sorts)
      } else {
        sql.orderBy(sorts)
      }
    }
    if (!_.isUndefined(offset)) {
      sql.offset(offset)
    }
    if (!_.isUndefined(limit)) {
      sql.limit(limit)
    }
    const res = await this.query(sql)
    return res.rows as unknown as TResult[]
  }

  /**
   * 更新表
   * @param table 表
   * @param sets 要修改的赋值
   * @param where 查询条件
   */
  async update(table: string, sets: ValueObject, where?: Condition): Promise<number>
  async update(table: string, sets: ValueObject, where?: WhereObject): Promise<number>
  async update(table: string, sets: Assignment[], where?: WhereObject): Promise<number>
  async update(table: string, sets: Assignment[], where?: Condition): Promise<number>
  async update<T>(table: string, sets: ValueObject<T>, where?: WhereObject<T>): Promise<number>
  async update<T>(table: string, sets: ValueObject<T>, where?: WhereObject): Promise<number>
  async update<T>(table: string, sets: ValueObject<T>, where?: Condition): Promise<number>
  async update<T>(table: string, sets: ValueObject, where: WhereObject<T>): Promise<number>
  async update<T>(table: string, sets: Assignment[], where: WhereObject<T>): Promise<number>
  async update<T>(table: Identifier<T, any>, sets: ValueObject<T>, where: WhereObject<T>): Promise<number>
  async update<T>(table: Identifier<T, any>, sets: ValueObject<T>, where?: WhereObject): Promise<number>
  async update<T>(table: Identifier<T, any>, sets: ValueObject<T>, where?: Condition): Promise<number>
  async update<T>(table: Identifier<T, any>, sets: ValueObject, where: WhereObject<T>): Promise<number>
  async update<T>(table: Identifier<T, any>, sets: Assignment[], where: WhereObject<T>): Promise<number>
  async update(table: Identifier<any, any>, sets: ValueObject, where?: WhereObject): Promise<number>
  async update(table: Identifier<any, any>, sets: ValueObject, where?: Condition): Promise<number>
  async update(table: Identifier<any, any>, sets: Assignment[], where?: WhereObject): Promise<number>
  async update(table: Identifier<any, any>, sets: Assignment[], where?: Condition): Promise<number>
  async update<T = any>(table: string | Identifier<TemplateStringsArray, any>,
    sets: ValueObject<T> | Assignment[] | ValueObject<any>,
    where?: WhereObject<T> | Condition | WhereObject): Promise<number> {
    const sql = update(table)
    if (_.isArray(sets)) {
      sql.set(...sets)
    } else {
      sql.set(sets)
    }
    if (where) sql.where(where)
    const res = await this.query(sql)
    return res.rowsAffected
  }

  async delete(table: string, where?: WhereObject): Promise<number>
  async delete(table: string, where?: Condition): Promise<number>
  async delete<T>(table: Identifier<T, any>, where?: WhereObject<T>): Promise<number>
  async delete<T>(table: Identifier<T, any>, where?: Condition): Promise<number>
  async delete<T>(table: string, where?: WhereObject<T>): Promise<number>
  async delete<T>(table: string, where?: Condition): Promise<number>
  async delete(table: Identifier<any, any>, where?: WhereObject): Promise<number>
  async delete(table: Identifier<any, any>, where?: Condition): Promise<number>
  async delete<T = any>(table: Identifier<T, any> | string, where?: WhereObject<T> | Condition | WhereObject): Promise<number> {
    const sql = del(table)
    if (where) sql.where(where)
    const res = await this.query(sql)
    return res.rowsAffected
  }

  async execute<T = any>(spname: Identifier<void, any> | string, params: Expressions[] | Parameter[]): Promise<QueryResult<T>> {
    const sql = exec(spname, params)
    const res = await this.query(sql)
    return res
  }
}
