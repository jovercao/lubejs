import {
  SqlBuilder as SQL,
  AlterFunction,
  AlterProcedure,
  AlterTable,
  AlterView,
  CompatibleExpression,
  Condition,
  CreateFunction,
  CreateProcedure,
  CreateSequence,
  CreateTable,
  CreateView,
  DropFunction,
  DropProcedure,
  DropTable,
  DropView,
  SqlBuilder,
  Statement,
  DropSequence,
  Insert,
  CompatibleTable,
  ColumnsOf,
  Field,
  Update,
  Delete,
  CreateIndex,
  DropIndex,
  CreateDatabase,
  DropDatabase,
  AlterDatabase,
} from './ast';
import { CompatiableObjectName, RowObject, Scalar } from './types';
import { isStatement } from './util';

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
    return isStatement(statement) ? statement : SqlBuilder.raw(statement);
  }

  createTable(name: CompatiableObjectName): CreateTable {
    return SQL.createTable(name);
  }

  alterTable(name: CompatiableObjectName): AlterTable {
    return SQL.alterTable(name);
  }
  dropTable(name: CompatiableObjectName): DropTable {
    return SQL.dropTable(name);
  }

  createView(name: CompatiableObjectName): CreateView {
    return SQL.createView(name);
  }

  alterView(name: CompatiableObjectName): AlterView {
    return SQL.alterView(name);
  }

  dropView(name: CompatiableObjectName): DropView {
    return SQL.dropView(name);
  }

  createProcedure(name: CompatiableObjectName): CreateProcedure {
    return SQL.createProcedure(name);
  }

  alterProcedure(name: CompatiableObjectName): AlterProcedure {
    return SQL.alterProcedure(name);
  }
  dropProcedure(name: CompatiableObjectName): DropProcedure {
    return SQL.dropProcedure(name);
  }
  createFunction(name: CompatiableObjectName): CreateFunction {
    return SQL.createFunction(name);
  }
  alterFunction(name: CompatiableObjectName): AlterFunction {
    return SQL.alterFunction(name);
  }
  dropFunction(name: CompatiableObjectName): DropFunction {
    return SQL.dropFunction(name);
  }
  createSequence(name: CompatiableObjectName): CreateSequence {
    return SQL.createSequence(name);
  }

  createIndex(name: string): CreateIndex {
    return SQL.createIndex(name);
  }

  dropIndex(table: CompatiableObjectName, name: string): DropIndex {
    return SQL.dropIndex(table, name);
  }

  dropSequence(name: CompatiableObjectName): DropSequence {
    return SQL.dropSequence(name);
  }

  insert<T extends RowObject = any>(
    table: CompatibleTable<T, string>,
    fields?: ColumnsOf<T>[] | Field<Scalar, ColumnsOf<T>>[]
  ): Insert<T> {
    return SQL.insert(table, fields);
  }

  /**
   * 更新一个表格
   * @param table
   */
  update<T extends RowObject = any>(
    table: CompatibleTable<T, string>
  ): Update<T> {
    return SQL.update(table);
  }

  /**
   * 删除一个表格
   * @param table 表格
   */
  delete<T extends RowObject = any>(
    table: CompatibleTable<T, string>
  ): Delete<T> {
    return SQL.delete(table);
  }

  abstract renameTable(name: CompatiableObjectName, newName: string): Statement;
  abstract renameColumn(table: CompatiableObjectName, name: string, newName: string): Statement;
  abstract renameView(name: CompatiableObjectName, newName: string): Statement;
  abstract renameIndex(table: CompatiableObjectName, name: string, newName: string): Statement;
  abstract renameSequence(name: CompatiableObjectName, newName: string): Statement;
  abstract renameProcedure(name: CompatiableObjectName, newName: string): Statement;
  abstract renameFunction(name: CompatiableObjectName, newName: string): Statement;
  abstract renameDatabase(name: string, newName: string): Statement;

  // abstract setPrimaryKeyComment(table: CompatiableObjectName, name: string, comment: string): Statement;

  // abstract setForeignKeyComment(table: CompatiableObjectName, name: string, comment: string): Statement;

  abstract setTableComment(name: CompatiableObjectName, comment: string): Statement;
  abstract setColumnComment(
    table: CompatiableObjectName,
    name: string,
    comment: string
  ): Statement;
  abstract setIndexComment(
    table: CompatiableObjectName,
    name: string,
    comment: string
  ): Statement;
  abstract setConstraintComment(
    table: CompatiableObjectName,
    name: string,
    comment: string
  ): Statement;
  abstract setSchemaComment(name: string, comment: string): Statement;
  abstract setSequenceComment(name: CompatiableObjectName, comment: string): Statement;
  abstract setProcedureComment(name: CompatiableObjectName, comment: string): Statement;
  abstract setFunctionComment(name: CompatiableObjectName, comment: string): Statement;

  abstract dropSchemaComment(name: string): Statement;
  abstract dropSequenceComment(name: CompatiableObjectName): Statement;
  abstract dropProcedureComment(name: CompatiableObjectName): Statement;
  abstract dropFunctionComment(name: CompatiableObjectName): Statement;
  abstract dropTableComment(name: CompatiableObjectName): Statement;
  abstract dropColumnComment(table: CompatiableObjectName, name: string): Statement;
  abstract dropIndexComment(table: CompatiableObjectName, name: string): Statement;
  abstract dropConstraintComment(table: CompatiableObjectName, name: string): Statement;

  /**
   * 将列修改为自动行标识列
   */
  abstract setAutoRowflag(table: CompatiableObjectName, column: string): Statement;

  /**
   *
   */
  abstract dropAutoRowflag(table: CompatiableObjectName, column: string): Statement;

  // abstract existsTable(name: CompatiableObjectName): Expression;
  // 为列添加或修改默认值
  abstract setDefaultValue(
    table: CompatiableObjectName,
    column: string,
    defaultValue: CompatibleExpression
  ): Statement;
  // 删除列默认值约束
  abstract dropDefaultValue(table: CompatiableObjectName, column: string): Statement;

  // 给字段增加自增属性
  abstract setIdentity(
    table: CompatiableObjectName,
    column: string,
    startValue: number,
    increment: number
  ): Statement;

  // 移除字段自增属性
  abstract dropIdentity(table: CompatiableObjectName, column: string): Statement;

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
    table: CompatiableObjectName<string>,
    sql: Condition,
    name?: string
  ): Statement {
    return SQL.alterTable(table).add(builder =>
      name ? builder.check(name, sql) : builder.check(sql)
    );
  }

  dropCheckConstaint(table: CompatiableObjectName<string>, name: string): Statement {
    return SQL.alterTable(table).drop(builder => builder.check(name));
  }
}

// export type MigrateScripter = {
//   [P in keyof MigrateBuilder]: Promisify<MigrateBuilder[P]>;
// };

// export const MigrateBuilder: MigrateBuilder = {
//   sql(statement: Statement | string): Statement {
//     return isStatement(statement) ? statement : SqlBuilder.raw(statement);
//   },
//   createTable(name: CompatiableObjectName): Statement {

//   },
//   renameTable(name: CompatiableObjectName, newName: string): Statement {
//     return StandardStatement.create(MigrateBuilder.renameTable.name, [name, newName]);
//   },
//   renameColumn(table: CompatiableObjectName, name: string, newName: string): Statement {
//     return StandardStatement.create(MigrateBuilder.renameColumn.name, [
//       table,
//       name,
//       newName,
//     ]);
//   },
//   renameView(name: CompatiableObjectName, newName: string): Statement {
//     return StandardStatement.create(MigrateBuilder.renameView.name, [name, newName]);
//   },
//   renameIndex(table: CompatiableObjectName, name: string, newName: string): Statement {
//     return StandardStatement.create(MigrateBuilder.renameIndex.name, [
//       table,
//       name,
//       newName,
//     ]);
//   },
//   renameProcedure(name: CompatiableObjectName, newName: string): Statement {
//     return StandardStatement.create(MigrateBuilder.renameProcedure.name, [
//       name,
//       newName,
//     ]);
//   },
//   renameFunction(name: CompatiableObjectName, newName: string): Statement {
//     return StandardStatement.create(MigrateBuilder.renameFunction.name, [
//       name,
//       newName,
//     ]);
//   },
//   commentTable(name: CompatiableObjectName, comment: string): Statement {
//     return StandardStatement.create(MigrateBuilder.commentTable.name, [
//       name,
//       comment,
//     ]);
//   },
//   commentColumn(table: CompatiableObjectName, name: string, comment: string): Statement {
//     return StandardStatement.create(MigrateBuilder.commentColumn.name, [
//       table,
//       name,
//       comment,
//     ]);
//   },
//   commentIndex(table: CompatiableObjectName, name: string, comment: string): Statement {
//     return StandardStatement.create(MigrateBuilder.commentIndex.name, [
//       table,
//       name,
//       comment,
//     ]);
//   },
//   commentConstraint(table: CompatiableObjectName, name: string, comment: string): Statement {
//     return StandardStatement.create(MigrateBuilder.commentConstraint.name, [
//       table,
//       name,
//       comment,
//     ]);
//   },
//   commentSchema(name: string, comment: string): Statement {
//     return StandardStatement.create(MigrateBuilder.commentSchema.name, [
//       name,
//       comment,
//     ]);
//   },
//   commentSequence(name: CompatiableObjectName, comment: string): Statement {
//     return StandardStatement.create(MigrateBuilder.commentSequence.name, [
//       name,
//       comment,
//     ]);
//   },
//   commentProcedure(name: CompatiableObjectName, comment: string): Statement {
//     return StandardStatement.create(MigrateBuilder.commentProcedure.name, [
//       name,
//       comment,
//     ]);
//   },
//   commentFunction(name: CompatiableObjectName, comment: string): Statement {
//     return StandardStatement.create(MigrateBuilder.commentFunction.name, [
//       name,
//       comment,
//     ]);
//   },
//   setDefaultValue(
//     table: CompatiableObjectName,
//     column: string,
//     defaultValue: CompatibleExpression
//   ): Statement {
//     return StandardStatement.create(MigrateBuilder.setDefaultValue.name, [
//       table,
//       column,
//       defaultValue,
//     ]);
//   },
//   dropDefaultValue(table: CompatiableObjectName, column: string): Statement {
//     return StandardStatement.create(MigrateBuilder.dropDefaultValue.name, [
//       table,
//       column,
//     ]);
//   },

//   // 修改字段类型
//   setColumnType(table: CompatiableObjectName, name: string, type: DbType): Statement {
//     return StandardStatement.create(MigrateBuilder.setColumnType.name, [
//       table,
//       name,
//       type,
//     ]);
//   },

//   // 创建Check约束
//   addCheckConstaint(table: CompatiableObjectName, sql: Condition, name?: string): Statement {
//     return StandardStatement.create(MigrateBuilder.addCheckConstaint.name, [
//       table,
//       sql,
//       name,
//     ]);
//   },

//   // 删除字段check约束
//   dropCheckConstaint(table: CompatiableObjectName, name: string): Statement {
//     return StandardStatement.create(MigrateBuilder.dropCheckConstaint.name, [
//       table,
//       name,
//     ]);
//   },

//   // 给字段增加自增属性
//   addIdentity(
//     table: CompatiableObjectName,
//     column: string,
//     startValue: number,
//     increment: number
//   ): Statement {
//     return StandardStatement.create(MigrateBuilder.addIdentity.name, [
//       table,
//       column,
//       startValue,
//       increment,
//     ]);
//   },

//   // 移除字段自增属性
//   dropIdentity(table: CompatiableObjectName, column: string): Statement {
//     return StandardStatement.create(MigrateBuilder.dropIdentity.name, [
//       table,
//       column,
//     ]);
//   },
// }
