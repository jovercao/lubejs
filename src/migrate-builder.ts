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
  StandardStatement,
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
  Expression,
  CreateDatabase,
  DropDatabase,
  AlterDatabase,
} from './ast';
import { DbType, Name, RowObject, Scalar } from './types';
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

  createTable(name: Name): CreateTable {
    return SQL.createTable(name);
  }

  alterTable(name: Name): AlterTable {
    return SQL.alterTable(name);
  }
  dropTable(name: Name): DropTable {
    return SQL.dropTable(name);
  }

  createView(name: Name): CreateView {
    return SQL.createView(name);
  }

  alterView(name: Name): AlterView {
    return SQL.alterView(name);
  }

  dropView(name: Name): DropView {
    return SQL.dropView(name);
  }

  createProcedure(name: Name): CreateProcedure {
    return SQL.createProcedure(name);
  }

  alterProcedure(name: Name): AlterProcedure {
    return SQL.alterProcedure(name);
  }
  dropProcedure(name: Name): DropProcedure {
    return SQL.dropProcedure(name);
  }
  createFunction(name: Name): CreateFunction {
    return SQL.createFunction(name);
  }
  alterFunction(name: Name): AlterFunction {
    return SQL.alterFunction(name);
  }
  dropFunction(name: Name): DropFunction {
    return SQL.dropFunction(name);
  }
  createSequence(name: Name): CreateSequence {
    return SQL.createSequence(name);
  }

  createIndex(name: string): CreateIndex {
    return SQL.createIndex(name);
  }

  dropIndex(table: Name, name: string): DropIndex {
    return SQL.dropIndex(table, name);
  }

  dropSequence(name: Name): DropSequence {
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

  abstract renameTable(name: Name, newName: string): Statement;
  abstract renameColumn(table: Name, name: string, newName: string): Statement;
  abstract renameView(name: Name, newName: string): Statement;
  abstract renameIndex(table: Name, name: string, newName: string): Statement;
  abstract renameSequence(name: Name, newName: string): Statement;
  abstract renameProcedure(name: Name, newName: string): Statement;
  abstract renameFunction(name: Name, newName: string): Statement;
  abstract renameDatabase(name: string, newName: string): Statement;

  // abstract setPrimaryKeyComment(table: Name, name: string, comment: string): Statement;

  // abstract setForeignKeyComment(table: Name, name: string, comment: string): Statement;

  abstract setTableComment(name: Name, comment: string): Statement;
  abstract setColumnComment(
    table: Name,
    name: string,
    comment: string
  ): Statement;
  abstract setIndexComment(
    table: Name,
    name: string,
    comment: string
  ): Statement;
  abstract setConstraintComment(
    table: Name,
    name: string,
    comment: string
  ): Statement;
  abstract setSchemaComment(name: string, comment: string): Statement;
  abstract setSequenceComment(name: Name, comment: string): Statement;
  abstract setProcedureComment(name: Name, comment: string): Statement;
  abstract setFunctionComment(name: Name, comment: string): Statement;

  abstract dropSchemaComment(name: string): Statement;
  abstract dropSequenceComment(name: Name): Statement;
  abstract dropProcedureComment(name: Name): Statement;
  abstract dropFunctionComment(name: Name): Statement;
  abstract dropTableComment(name: Name): Statement;
  abstract dropColumnComment(table: Name, name: string): Statement;
  abstract dropIndexComment(table: Name, name: string): Statement;
  abstract dropConstraintComment(table: Name, name: string): Statement;

  /**
   * 将列修改为自动行标识列
   */
  abstract setAutoRowflag(table: Name, column: string): Statement;

  /**
   *
   */
  abstract dropAutoRowflag(table: Name, column: string): Statement;

  // abstract existsTable(name: Name): Expression;
  // 为列添加或修改默认值
  abstract setDefaultValue(
    table: Name,
    column: string,
    defaultValue: CompatibleExpression
  ): Statement;
  // 删除列默认值约束
  abstract dropDefaultValue(table: Name, column: string): Statement;

  // 给字段增加自增属性
  abstract setIdentity(
    table: Name,
    column: string,
    startValue: number,
    increment: number
  ): Statement;

  // 移除字段自增属性
  abstract dropIdentity(table: Name, column: string): Statement;

  // /**
  //  * 复制一个新列
  //  * @param table
  //  * @param name
  //  * @param newName
  //  */
  // abstract copyNewColumn(
  //   table: Name,
  //   name: string,
  //   newName: string
  // ): Statement | Promise<Statement>;

  // // 修改字段类型
  // abstract setColumnType(table: Name, name: string, type: DbType): Statement;

  // 创建Check约束
  addCheckConstaint(
    table: Name<string>,
    sql: Condition,
    name?: string
  ): Statement {
    return SQL.alterTable(table).add(builder =>
      name ? builder.check(name, sql) : builder.check(sql)
    );
  }

  dropCheckConstaint(table: Name<string>, name: string): Statement {
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
//   createTable(name: Name): Statement {

//   },
//   renameTable(name: Name, newName: string): Statement {
//     return StandardStatement.create(MigrateBuilder.renameTable.name, [name, newName]);
//   },
//   renameColumn(table: Name, name: string, newName: string): Statement {
//     return StandardStatement.create(MigrateBuilder.renameColumn.name, [
//       table,
//       name,
//       newName,
//     ]);
//   },
//   renameView(name: Name, newName: string): Statement {
//     return StandardStatement.create(MigrateBuilder.renameView.name, [name, newName]);
//   },
//   renameIndex(table: Name, name: string, newName: string): Statement {
//     return StandardStatement.create(MigrateBuilder.renameIndex.name, [
//       table,
//       name,
//       newName,
//     ]);
//   },
//   renameProcedure(name: Name, newName: string): Statement {
//     return StandardStatement.create(MigrateBuilder.renameProcedure.name, [
//       name,
//       newName,
//     ]);
//   },
//   renameFunction(name: Name, newName: string): Statement {
//     return StandardStatement.create(MigrateBuilder.renameFunction.name, [
//       name,
//       newName,
//     ]);
//   },
//   commentTable(name: Name, comment: string): Statement {
//     return StandardStatement.create(MigrateBuilder.commentTable.name, [
//       name,
//       comment,
//     ]);
//   },
//   commentColumn(table: Name, name: string, comment: string): Statement {
//     return StandardStatement.create(MigrateBuilder.commentColumn.name, [
//       table,
//       name,
//       comment,
//     ]);
//   },
//   commentIndex(table: Name, name: string, comment: string): Statement {
//     return StandardStatement.create(MigrateBuilder.commentIndex.name, [
//       table,
//       name,
//       comment,
//     ]);
//   },
//   commentConstraint(table: Name, name: string, comment: string): Statement {
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
//   commentSequence(name: Name, comment: string): Statement {
//     return StandardStatement.create(MigrateBuilder.commentSequence.name, [
//       name,
//       comment,
//     ]);
//   },
//   commentProcedure(name: Name, comment: string): Statement {
//     return StandardStatement.create(MigrateBuilder.commentProcedure.name, [
//       name,
//       comment,
//     ]);
//   },
//   commentFunction(name: Name, comment: string): Statement {
//     return StandardStatement.create(MigrateBuilder.commentFunction.name, [
//       name,
//       comment,
//     ]);
//   },
//   setDefaultValue(
//     table: Name,
//     column: string,
//     defaultValue: CompatibleExpression
//   ): Statement {
//     return StandardStatement.create(MigrateBuilder.setDefaultValue.name, [
//       table,
//       column,
//       defaultValue,
//     ]);
//   },
//   dropDefaultValue(table: Name, column: string): Statement {
//     return StandardStatement.create(MigrateBuilder.dropDefaultValue.name, [
//       table,
//       column,
//     ]);
//   },

//   // 修改字段类型
//   setColumnType(table: Name, name: string, type: DbType): Statement {
//     return StandardStatement.create(MigrateBuilder.setColumnType.name, [
//       table,
//       name,
//       type,
//     ]);
//   },

//   // 创建Check约束
//   addCheckConstaint(table: Name, sql: Condition, name?: string): Statement {
//     return StandardStatement.create(MigrateBuilder.addCheckConstaint.name, [
//       table,
//       sql,
//       name,
//     ]);
//   },

//   // 删除字段check约束
//   dropCheckConstaint(table: Name, name: string): Statement {
//     return StandardStatement.create(MigrateBuilder.dropCheckConstaint.name, [
//       table,
//       name,
//     ]);
//   },

//   // 给字段增加自增属性
//   addIdentity(
//     table: Name,
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
//   dropIdentity(table: Name, column: string): Statement {
//     return StandardStatement.create(MigrateBuilder.dropIdentity.name, [
//       table,
//       column,
//     ]);
//   },
// }
