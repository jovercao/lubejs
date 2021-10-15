import {
  AlterDatabase,
  AlterFunction,
  AlterProcedure,
  AlterTable,
  AlterView,
  ColumnsOf,
  XObjectName,
  XTables,
  Condition,
  CreateDatabase,
  CreateFunction,
  CreateIndex,
  CreateProcedure,
  CreateSequence,
  CreateTable,
  CreateView,
  Delete,
  DropDatabase,
  DropFunction,
  DropIndex,
  DropProcedure,
  DropSequence,
  DropTable,
  DropView,
  Field,
  Insert,
  RowObject,
  Scalar,
  Statement,
  Update,
  XExpression,
  SQL,
} from '../core';

export abstract class MigrateBuilder {
  use(name: string): Statement {
    return SQL.use(name);
  }

  alterDatabase(name: string): AlterDatabase {
    return SQL.alterDatabase(name);
  }
  createDatabase(name: string): CreateDatabase {
    return SQL.createDatabase(name);
  }
  dropDatabase(name: string): DropDatabase {
    return SQL.dropDatabase(name);
  }

  sql(statement: Statement | string): Statement {
    return Statement.isStatement(statement) ? statement : SQL.raw(statement);
  }

  createTable(name: XObjectName): CreateTable {
    return SQL.createTable(name);
  }

  alterTable(name: XObjectName): AlterTable {
    return SQL.alterTable(name);
  }
  dropTable(name: XObjectName): DropTable {
    return SQL.dropTable(name);
  }

  createView(name: XObjectName): CreateView {
    return SQL.createView(name);
  }

  alterView(name: XObjectName): AlterView {
    return SQL.alterView(name);
  }

  dropView(name: XObjectName): DropView {
    return SQL.dropView(name);
  }

  createProcedure(name: XObjectName): CreateProcedure {
    return SQL.createProcedure(name);
  }

  alterProcedure(name: XObjectName): AlterProcedure {
    return SQL.alterProcedure(name);
  }

  dropProcedure(name: XObjectName): DropProcedure {
    return SQL.dropProcedure(name);
  }
  createFunction(name: XObjectName): CreateFunction {
    return SQL.createFunction(name);
  }
  alterFunction(name: XObjectName): AlterFunction {
    return SQL.alterFunction(name);
  }
  dropFunction(name: XObjectName): DropFunction {
    return SQL.dropFunction(name);
  }
  createSequence(name: XObjectName): CreateSequence {
    return SQL.createSequence(name);
  }

  createIndex(name: string): CreateIndex {
    return SQL.createIndex(name);
  }

  dropIndex(table: XObjectName, name: string): DropIndex {
    return SQL.dropIndex(table, name);
  }

  dropSequence(name: XObjectName): DropSequence {
    return SQL.dropSequence(name);
  }

  insert<T extends RowObject = any>(
    table: XTables<T>,
    fields?: ColumnsOf<T>[] | Field<Scalar, ColumnsOf<T>>[]
  ): Insert<T> {
    return SQL.insert(table, fields);
  }

  /**
   * 更新一个表格
   * @param table
   */
  update<T extends RowObject = any>(table: XTables<T>): Update<T> {
    return SQL.update(table);
  }

  /**
   * 删除一个表格
   * @param table 表格
   */
  delete<T extends RowObject = any>(table: XTables<T>): Delete<T> {
    return SQL.delete(table);
  }

  abstract renameTable(name: XObjectName, newName: string): Statement;
  abstract renameColumn(
    table: XObjectName,
    name: string,
    newName: string
  ): Statement;
  abstract renameView(name: XObjectName, newName: string): Statement;
  abstract renameIndex(
    table: XObjectName,
    name: string,
    newName: string
  ): Statement;
  abstract renameSequence(
    name: XObjectName,
    newName: string
  ): Statement;
  abstract renameProcedure(
    name: XObjectName,
    newName: string
  ): Statement;
  abstract renameFunction(
    name: XObjectName,
    newName: string
  ): Statement;
  abstract renameDatabase(name: string, newName: string): Statement;

  // abstract setPrimaryKeyComment(table: CompatiableObjectName, name: string, comment: string): Statement;

  // abstract setForeignKeyComment(table: CompatiableObjectName, name: string, comment: string): Statement;

  abstract setTableComment(
    name: XObjectName,
    comment: string
  ): Statement;
  abstract setViewComment(
    name: XObjectName,
    comment: string
  ): Statement;
  abstract setColumnComment(
    table: XObjectName,
    name: string,
    comment: string
  ): Statement;
  abstract setIndexComment(
    table: XObjectName,
    name: string,
    comment: string
  ): Statement;
  abstract setConstraintComment(
    table: XObjectName,
    name: string,
    comment: string
  ): Statement;
  abstract setSchemaComment(name: string, comment: string): Statement;
  abstract setSequenceComment(
    name: XObjectName,
    comment: string
  ): Statement;
  abstract setProcedureComment(
    name: XObjectName,
    comment: string
  ): Statement;
  abstract setFunctionComment(
    name: XObjectName,
    comment: string
  ): Statement;

  abstract dropSchemaComment(name: string): Statement;
  abstract dropSequenceComment(name: XObjectName): Statement;
  abstract dropProcedureComment(name: XObjectName): Statement;
  abstract dropFunctionComment(name: XObjectName): Statement;
  abstract dropTableComment(name: XObjectName): Statement;
  abstract dropColumnComment(
    table: XObjectName,
    name: string
  ): Statement;
  abstract dropIndexComment(
    table: XObjectName,
    name: string
  ): Statement;
  abstract dropConstraintComment(
    table: XObjectName,
    name: string
  ): Statement;

  /**
   * 将列修改为自动行标识列
   */
  abstract setAutoRowflag(
    table: XObjectName,
    column: string
  ): Statement;

  /**
   *
   */
  abstract dropAutoRowflag(
    table: XObjectName,
    column: string
  ): Statement;

  // 为列添加或修改默认值
  abstract setDefaultValue(
    table: XObjectName,
    column: string,
    defaultValue: XExpression
  ): Statement;
  // 删除列默认值约束
  abstract dropDefaultValue(
    table: XObjectName,
    column: string
  ): Statement;

  // TIPS: 因为流程控制等语句将导致无法正确生成快照，因此不在此添加条件语句等信息
  // 除非完成执行引擎，这将会是一个巨大的工作量，需要考虑的情况过多，并且因为数据，流程走向无法预测。
  // 因此规定迁移文件必须按

  // abstract existsTable(table: CompatiableObjectName): Condition;

  // abstract existsDatabase(database: string): Condition;

  // abstract existsView(name: CompatiableObjectName): Condition;

  // abstract existsFunction(name: CompatiableObjectName): Condition;

  // abstract existsProcedure(name: CompatiableObjectName): Condition;

  // abstract existsSequence(name: CompatiableObjectName): Condition;

  // 给字段增加自增属性
  abstract setIdentity(
    table: XObjectName,
    column: string,
    startValue: number,
    increment: number
  ): Statement;

  // 移除字段自增属性
  abstract dropIdentity(
    table: XObjectName,
    column: string
  ): Statement;

  /**
   * 抛出一个异常
   * @param msg 异常消息
   */
  abstract throw(errmsg: string): Statement;

  // /**
  //  * 复制一个新列
  //  * @param table
  //  * @param name
  //  * @param newName
  //  */
  // abstract copyNewColumn(
  //   table: CompatiableObjectName,
  //   name: string,
  //   newName: string
  // ): Statement | Promise<Statement>;

  // // 修改字段类型
  // abstract setColumnType(table: CompatiableObjectName, name: string, type: DbType): Statement;

  // 创建Check约束
  addCheckConstaint(
    table: XObjectName<string>,
    sql: Condition,
    name?: string
  ): Statement {
    return SQL.alterTable(table).add(builder =>
      name ? builder.check(name, sql) : builder.check(sql)
    );
  }

  dropCheckConstaint(
    table: XObjectName<string>,
    name: string
  ): Statement {
    return SQL.alterTable(table).drop(builder => builder.check(name));
  }
}
