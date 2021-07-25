import { Name, Scalar } from './types';
import { MigrateBuilder } from './migrate-builder';
import {
  ColumnSchema,
  ConstraintSchema,
  DatabaseSchema,
  ForeignKeySchema,
  FunctionSchema,
  PrimaryKeySchema,
  ProcedureSchema,
  SchemaSchema,
  SequenceSchema,
  TableSchema,
  ViewSchema,
} from './schema';
import { assertAst, isNameEquals } from './util';
import {
  AllStatement,
  AlterTable,
  CheckConstraint,
  CompatibleExpression,
  CreateTable,
  CreateTableMember,
  ForeignKey,
  PrimaryKey,
  StandardStatement,
  Statement,
  TableColumnForAdd,
  UniqueKey,
} from './ast';
import {
  SQL_SYMBOLE,
  SQL_SYMBOLE_TABLE_MEMBER,
  STATEMENT_KIND,
} from './constants';
import { SqlUtil } from './sql-util';
import { table } from './decorators';

export class SnapshotMigrateBuilder extends MigrateBuilder {
  constructor() {
    super();
  }
  renameSequence(name: Name, newName: string): Statement {
    return StandardStatement.create(arguments.callee.name, [name, newName]);
  }

  renameDatabase(name: string, newName: string): Statement {
    return StandardStatement.create(arguments.callee.name, [name, newName]);
  }

  dropSchemaComment(name: string): Statement {
    return StandardStatement.create(arguments.callee.name, [name]);
  }
  dropSequenceComment(name: Name<string>): Statement {
    return StandardStatement.create(arguments.callee.name, [name]);
  }
  dropProcedureComment(name: Name<string>): Statement {
    return StandardStatement.create(arguments.callee.name, [name]);
  }
  dropFunctionComment(name: Name<string>): Statement {
    return StandardStatement.create(arguments.callee.name, [name]);
  }
  dropTableComment(name: Name<string>): Statement {
    return StandardStatement.create(arguments.callee.name, [name]);
  }
  dropColumnComment(table: Name<string>, name: string): Statement {
    return StandardStatement.create(arguments.callee.name, [table, name]);
  }
  dropIndexComment(table: Name<string>, name: string): Statement {
    return StandardStatement.create(arguments.callee.name, [table, name]);
  }
  dropConstraintComment(table: Name<string>, name: string): Statement {
    return StandardStatement.create(arguments.callee.name, [table, name]);
  }
  setAutoRowflag(table: Name<string>, column: string): Statement {
    return StandardStatement.create(arguments.callee.name, [table, column]);
  }
  dropAutoRowflag(table: Name<string>, column: string): Statement {
    return StandardStatement.create(arguments.callee.name, [table, column]);
  }
  setDefaultValue(
    table: Name<string>,
    column: string,
    defaultValue: CompatibleExpression<Scalar>
  ): Statement {
    return StandardStatement.create(arguments.callee.name, [table, column, defaultValue]);
  }

  dropDefaultValue(table: Name<string>, column: string): Statement {
    return StandardStatement.create(arguments.callee.name, [table, column]);
  }

  setIdentity(
    table: Name<string>,
    column: string,
    startValue: number,
    increment: number
  ): Statement {
    return StandardStatement.create(arguments.callee.name, [
      table,
      column,
      startValue,
      increment,
    ]);
  }

  dropIdentity(table: Name<string>, column: string): Statement {
    return StandardStatement.create(arguments.callee.name, [table, column]);
  }

  setProcedureComment(name: Name, comment: string | null): Statement {
    return StandardStatement.create(arguments.callee.name, [name, comment]);
  }

  setFunctionComment(name: Name, comment: string | null): Statement {
    return StandardStatement.create(arguments.callee.name, [name, comment]);
  }

  setSequenceComment(name: Name, comment: string | null): Statement {
    return StandardStatement.create(arguments.callee.name, [name, comment]);
  }

  setTableComment(name: Name, comment: string | null): Statement {
    return StandardStatement.create(arguments.callee.name, [name, comment]);
  }

  setColumnComment(
    table: Name,
    name: string,
    comment: string | null
  ): Statement {
    return StandardStatement.create(arguments.callee.name, [
      table,
      name,
      comment,
    ]);
  }

  setIndexComment(
    table: Name,
    name: string,
    comment: string | null
  ): Statement {
    return StandardStatement.create(arguments.callee.name, [
      table,
      name,
      comment,
    ]);
  }

  setConstraintComment(
    table: Name<string>,
    name: string,
    comment: string | null
  ): Statement {
    return StandardStatement.create(arguments.callee.name, [
      table,
      name,
      comment,
    ]);
  }

  setSchemaComment(name: string, comment: string | null): Statement {
    return StandardStatement.create(arguments.callee.name, [name, comment]);
  }

  renameTable(name: Name, newName: string): Statement {
    return StandardStatement.create(arguments.callee.name, [name, newName]);
  }

  renameColumn(table: Name, name: string, newName: string): Statement {
    return StandardStatement.create(arguments.callee.name, [
      table,
      name,
      newName,
    ]);
  }

  renameView(name: Name, newName: string): Statement {
    return StandardStatement.create(arguments.callee.name, [name, newName]);
  }

  renameIndex(table: Name, name: string, newName: string): Statement {
    return StandardStatement.create(arguments.callee.name, [
      table,
      name,
      newName,
    ]);
  }

  renameProcedure(name: Name, newName: string): Statement {
    return StandardStatement.create(arguments.callee.name, [name, newName]);
  }

  renameFunction(name: Name, newName: string): Statement {
    return StandardStatement.create(arguments.callee.name, [name, newName]);
  }
}

export class SnapshotMigrateTracker {
  constructor(
    public schema: DatabaseSchema | undefined,
    private sqlUtil: SqlUtil
  ) {}

  assertDatabaseExists(schema: DatabaseSchema | undefined): asserts schema {
    if (!schema) {
      throw new Error('Database is not exists.');
    }
  }

  private getTable(name: Name): TableSchema {
    const table = this.findTable(name);
    if (!table) {
      throw new Error(`Table ${name} not exists in database.`);
    }
    return table;
  }

  private findTable(name: Name): TableSchema | undefined {
    this.assertDatabaseExists(this.schema);
    return this.schema.tables.find(p => isNameEquals(name, p.name));
  }

  private findView(name: Name): ViewSchema {
    this.assertDatabaseExists(this.schema);
    const view = this.schema.views.find(p => isNameEquals(name, p.name));
    if (!view) {
      throw new Error(
        `Table ${this.sqlUtil.sqlifyName(name)} not exists in database.`
      );
    }
    return view;
  }

  private addTableMembers(table: TableSchema, members: CreateTableMember[]) {
    members.forEach(item => {
      switch (item.$type) {
        case SQL_SYMBOLE.PRIMARY_KEY:
          if (table.primaryKey)
            throw new Error(`Table ${table.name} primary key is exists.`);
          assertAst(item.$name, 'CreateTable statement name not found.');
          assertAst(item.$columns, 'Primary key columns not found.');
          table.primaryKey = {
            name: item.$name!,
            columns: item.$columns.map(col => ({
              name: col.name,
              isAscending: col.sort === 'ASC',
            })),
            isNonclustered: item.$nonclustered,
          };
          break;
        case SQL_SYMBOLE.CREATE_TABLE_COLUMN:
          if (table.columns.find(col => col.name === item.$name)) {
            throw new Error(
              `Table ${this.sqlUtil.sqlifyName(
                table.name
              )} column ${this.sqlUtil.sqlifyName(item.$name)} is exists.`
            );
          }
          table.columns.push({
            name: item.$name,
            type: this.sqlUtil.sqlifyType(item.$dbType),
            isNullable: item.$nullable ?? false,
            isIdentity: !!item.$identity,
            identityStartValue: item.$identity?.startValue,
            identityIncrement: item.$identity?.increment,
            isCalculate: !!item.$calculate,
            defaultValue:
              item.$default && this.sqlUtil.sqlifyExpression(item.$default),
            calculateExpression:
              item.$calculate && this.sqlUtil.sqlifyExpression(item.$calculate),
            isRowflag: false,
          });
          break;
        case SQL_SYMBOLE.FOREIGN_KEY:
          assertAst(item.$name, 'Foreign key name not found.');
          assertAst(item.$columns, 'Foreign key columns not found.');
          assertAst(
            item.$referenceColumns,
            'Foreign key referenceColumns not found.'
          );
          assertAst(
            item.$referenceTable,
            'Foreign key ReferenceTable not found.'
          );
          table.foreignKeys.push({
            name: item.$name!,
            columns: item.$columns,
            referenceColumns: item.$referenceColumns,
            referenceTable: item.$referenceTable,
          });
          break;
        case SQL_SYMBOLE.UNIQUE_KEY:
          assertAst(item.$columns, 'Unique key name not found.');
          assertAst(item.$name, 'Unique key name not found.');
          table.constraints.push({
            name: item.$name,
            kind: 'UNIQUE',
            columns: item.$columns.map(c => ({
              name: c.name,
              isAscending: c.sort === 'ASC',
            })),
          });
          break;
        case SQL_SYMBOLE.CHECK_CONSTRAINT:
          assertAst(item.$name, 'Unique key name not found.');
          table.constraints.push({
            kind: 'CHECK',
            name: item.$name,
            sql: this.sqlUtil.sqlifyCondition(item.$sql),
          });
          break;
      }
    });
  }

  private createTable(statement: CreateTable): void {
    this.assertDatabaseExists(this.schema);
    if (this.findTable(statement.$name)) {
      throw new Error(
        `Table ${this.sqlUtil.sqlifyName(statement.$name)} is exists.`
      );
    }
    assertAst(statement.$members, 'CreateTable statement member not found.');
    const table: TableSchema = {
      name: statement.$name,
      indexes: [],
      columns: [],
      foreignKeys: [],
      constraints: [],
    };

    this.addTableMembers(table, statement.$members);

    this.schema.tables.push(table);
  }

  private alterTable(statement: AlterTable): void {
    this.assertDatabaseExists(this.schema);
    const table = this.getTable(statement.$name);
    assertAst(
      statement.$adds || statement.$drop || statement.$alterColumn,
      'AlterTable statement action not found.'
    );

    if (statement.$adds) {
      this.addTableMembers(table, statement.$adds);
    } else if (statement.$alterColumn) {
      const column = table.columns.find(
        p => p.name === statement.$alterColumn?.$name
      );
      if (!column)
        throw new Error(
          `Table ${this.sqlUtil.sqlifyName(
            table.name
          )} Column ${this.sqlUtil.sqlifyName(
            statement.$alterColumn.$name
          )} not found.`
        );
      column.type = this.sqlUtil.sqlifyType(statement.$alterColumn.$dbType);
      assertAst(
        statement.$alterColumn.$nullable !== undefined,
        'Column nullable not found.'
      );
      column.isNullable = statement.$alterColumn.$nullable;
    } else if (statement.$drop) {
      switch (statement.$drop.$kind) {
        case SQL_SYMBOLE_TABLE_MEMBER.CHECK_CONSTRAINT:
        case SQL_SYMBOLE_TABLE_MEMBER.UNIQUE_KEY: {
          const index = table.constraints.findIndex(
            p => p.name === statement.$drop!.$kind
          );
          if (index < 0) {
            throw new Error(
              `Table ${this.sqlUtil.sqlifyName(
                table.name
              )} Constraint ${this.sqlUtil.sqlifyName(
                statement.$drop.$name
              )} not found.`
            );
          }
          table.constraints.splice(index, 1);
          break;
        }
        case SQL_SYMBOLE_TABLE_MEMBER.COLUMN: {
          const index = table.columns.findIndex(
            p => p.name === statement.$drop!.$kind
          );
          if (index < 0) {
            throw new Error(
              `Table ${this.sqlUtil.sqlifyName(
                table.name
              )} Column ${this.sqlUtil.sqlifyName(
                statement.$drop.$name
              )} not found.`
            );
          }
          table.columns.splice(index, 1);
          break;
        }
        case SQL_SYMBOLE_TABLE_MEMBER.PRIMARY_KEY: {
          if (table.primaryKey?.name !== statement.$drop.$name) {
            throw new Error(
              `Table ${this.sqlUtil.sqlifyName(
                table.name
              )} Primary key ${this.sqlUtil.sqlifyName(
                statement.$drop.$name
              )} not found.`
            );
          }
          table.primaryKey = undefined;
          break;
        }
        case SQL_SYMBOLE_TABLE_MEMBER.FOREIGN_KEY:
          const index = table.foreignKeys.findIndex(
            p => p.name === statement.$drop!.$kind
          );
          if (index < 0) {
            throw new Error(
              `Table ${this.sqlUtil.sqlifyName(
                table.name
              )} ForeignKey ${this.sqlUtil.sqlifyName(
                statement.$drop.$name
              )} not found.`
            );
          }
          table.foreignKeys.splice(index, 1);
          break;
      }
    }
  }

  run(statements: AllStatement[]) {
    for (const statement of statements) {
      if (statement.$kind === STATEMENT_KIND.CREATE_DATABASE) {
        if (this.schema) {
          throw new Error('Database is exists.');
        }
      } else {
        this.assertDatabaseExists(this.schema);
      }
      switch (statement.$kind) {
        case STATEMENT_KIND.CREATE_DATABASE:
          this.schema = {
            name: statement.$name,
            collate: statement.$collate,
            tables: [],
            views: [],
            procedures: [],
            functions: [],
            sequences: [],
            schemas: [],
          };
          break;
        case STATEMENT_KIND.ALTER_DATABASE:
          this.schema!.collate = statement.$collate;
          break;
        case STATEMENT_KIND.DROP_DATABASE:
          this.schema = undefined;
          break;
        case STATEMENT_KIND.CREATE_TABLE:
          this.createTable(statement);
          break;
        case STATEMENT_KIND.ALTER_TABLE:
          this.alterTable(statement);
          break;
        case STATEMENT_KIND.STANDARD_STATEMENT:
          switch (statement.$name) {
            case 'renameDatabase': {
              this.assertDatabaseExists(this.schema);
              if (this.schema.name !== statement.$datas[0]) {
                continue;
              }
              this.schema.name = statement.$datas[1];
              break;
            }
            case 'renameTable': {
              const table = this.getTable(statement.$datas[0]);
              table.name = statement.$datas[1];
              break;
            }
            case 'renameColumn': {
              const [tableName, columnName] = statement.$datas;
              const column = this.getColumn(tableName, columnName);
              column.name = statement.$datas[2];
              break;
            }
            case 'renameView': {
              const view = this.findView(statement.$datas[0]);
              if (!view) {
                throw new Error(
                  `View ${this.sqlUtil.sqlifyName(
                    statement.$datas[0]
                  )} is not found.`
                );
              }
              view.name = statement.$datas[1];
              break;
            }
            case 'renameProcedure': {
              const proc = this.schema?.procedures.find(p =>
                isNameEquals(p.name, statement.$datas[0])
              );
              if (!proc) {
                throw new Error(
                  `Procedure ${this.sqlUtil.sqlifyName(
                    statement.$datas[0]
                  )} is not found.`
                );
              }
              proc.name = statement.$datas[1];
              break;
            }
            case 'renameFunction': {
              const func = this.schema?.functions.find(p =>
                isNameEquals(p.name, statement.$datas[0])
              );
              if (!func) {
                throw new Error(
                  `Function ${this.sqlUtil.sqlifyName(
                    statement.$datas[0]
                  )} is not found.`
                );
              }
              func.name = statement.$datas[1];
              break;
            }
            case 'renameSequence': {
              const sequence = this.schema?.sequences.find(p =>
                isNameEquals(p.name, statement.$datas[0])
              );
              if (!sequence) {
                throw new Error(
                  `Function ${this.sqlUtil.sqlifyName(
                    statement.$datas[0]
                  )} is not found.`
                );
              }
              sequence.name = statement.$datas[1];
              break;
            }
            case 'setAutoFlag': {
              const [tableName, columnName] = statement.$datas;
              const column = this.getColumn(tableName, columnName);
              column.isRowflag = true;
              break;
            }
            case 'dropAutoFlag': {
              const [tableName, columnName] = statement.$datas;
              const column = this.getColumn(tableName, columnName);
              column.isRowflag = false;
              break;
            }
            case 'setIdentity': {
              const [tableName, columnName, start, incerment] = statement.$datas;
              const column = this.getColumn(tableName, columnName);
              column.isIdentity =  true;
              column.identityStartValue = start;
              column.identityIncrement = incerment;
              break;
            }
            case 'dropIdentity': {
              const [tableName, columnName] = statement.$datas;
              const column = this.getColumn(tableName, columnName);
              column.identityIncrement = undefined;
              column.identityStartValue = undefined;
              column.isIdentity = false;
              break;
            }
            case 'setDefaultValue': {
              const [tableName, columnName, defaultValue] = statement.$datas;
              const column = this.getColumn(tableName, columnName);
              column.defaultValue = defaultValue;
              break;
            }
            case 'dropDefaultValue': {
              const [tableName, columnName] = statement.$datas;
              const column = this.getColumn(tableName, columnName);
              column.defaultValue = undefined;
              break;
            }
            case 'setTableComment': {
              const [tableName, comment] = statement.$datas;
              const table = this.getTable(tableName);
              table.comment = comment;
              break;
            }
            case 'setViewComment': {
              const [viewName, comment] = statement.$datas;
              const view = this.getView(viewName);
              view.comment = comment;
              break;
            }
            case 'setProcedureComment': {
              const [procName, comment] = statement.$datas;
              const proc = this.getProcedure(procName);
              proc.comment = comment;
              break;
            }
            case 'setFunctionComment': {
              const [funcName, comment] = statement.$datas;
              const func = this.getFunction(funcName);
              func.comment = comment;
              break;
            }
            case 'setSequenceComment': {
              const [squName, comment] = statement.$datas;
              const sequence = this.getSequence(squName);
              sequence.comment = comment;
              break;
            }
            case 'setIndexComment': {
              const [tableName, indexName, comment] = statement.$datas;
              const index = this.getIndex(tableName, indexName);
              index.comment = comment;
              break;
            }
            case 'setConstraintComment': {
              const [tableName, constraintName, comment] = statement.$datas;
              const constraint = this.getConstraint(tableName, constraintName);
              constraint.comment = comment;
              break;
            }
            case 'setSchemaComment': {
              const [schemaName, comment] = statement.$datas;
              const schema = this.getSchema(schemaName);
              schema.comment = comment;
              break;
            }
            case 'dropTableComment': {
              const [tableName] = statement.$datas;
              const table = this.getTable(tableName);
              table.comment = undefined;
              break;
            }
            case 'dropViewComment': {
              const [viewName] = statement.$datas;
              const view = this.getView(viewName);
              view.comment = undefined;
              break;
            }
            case 'dropProcedureComment': {
              const [procName] = statement.$datas;
              const proc = this.getProcedure(procName);
              proc.comment = undefined;
              break;
            }
            case 'dropFunctionComment': {
              const [funcName] = statement.$datas;
              const func = this.getFunction(funcName);
              func.comment = undefined;
              break;
            }
            case 'dropSequenceComment': {
              const [squName] = statement.$datas;
              const sequence = this.getSequence(squName);
              sequence.comment = undefined;
              break;
            }
            case 'dropIndexComment': {
              const [tableName, indexName] = statement.$datas;
              const index = this.getIndex(tableName, indexName);
              index.comment = undefined;
              break;
            }
            case 'dropConstraintComment': {
              const [tableName, constraintName] = statement.$datas;
              const constraint = this.getConstraint(tableName, constraintName);
              constraint.comment = undefined;
              break;
            }
            case 'dropSchemaComment': {
              const [schemaName] = statement.$datas;
              const schema = this.getSchema(schemaName);
              schema.comment = undefined;
              break;
            }
          }
      }
    }
  }
  getSchema(name: any): SchemaSchema {
    this.assertDatabaseExists(this.schema);
    const schema = this.schema.functions.find(p => name === p.name);
    if (!schema) {
      throw new Error(`Schema ${this.sqlUtil.sqlifyName(name)} is not found.`);
    }
    return schema;
  }
  getSequence(name: any): SequenceSchema {
    this.assertDatabaseExists(this.schema);
    const sequence = this.schema.sequences.find(p => isNameEquals(name, p.name));
    if (!sequence) {
      throw new Error(`Sequence ${this.sqlUtil.sqlifyName(name)} is not found.`);
    }
    return sequence;
  }
  getProcedure(name: any): ProcedureSchema {
    this.assertDatabaseExists(this.schema);
    const proc = this.schema.procedures.find(p => isNameEquals(name, p.name));
    if (!proc) {
      throw new Error(`Procedure ${this.sqlUtil.sqlifyName(name)} is not found.`);
    }
    return proc;
  }
  getFunction(name: any): FunctionSchema {
    this.assertDatabaseExists(this.schema);
    const func = this.schema.functions.find(p => isNameEquals(name, p.name));
    if (!func) {
      throw new Error(`Function ${this.sqlUtil.sqlifyName(name)} is not found.`);
    }
    return func;
  }
  getView(name: Name): ViewSchema {
    const view = this.schema?.views.find(p => isNameEquals(name, p.name));
    if (!view) {
      throw new Error(`View ${this.sqlUtil.sqlifyName(name)} is not found.`);
    }
    return view;
  }

  private getColumn(tableName: Name, name: string): ColumnSchema {
    const table = this.getTable(tableName);
    const column = table.columns.find(col => col.name === name);
    if (!column)
      throw new Error(
        `Table ${this.sqlUtil.sqlifyName(
          table.name
        )} Column ${this.sqlUtil.sqlifyName(name)} not found.`
      );
    return column;
  }

  getIndex(tableName: any, name: any) {
    const table = this.getTable(tableName);
    const index = table.indexes.find(col => col.name === name);
    if (!index)
      throw new Error(
        `Table ${this.sqlUtil.sqlifyName(
          table.name
        )} Index ${this.sqlUtil.sqlifyName(name)} not found.`
      );
    return index;
  }

  private getPrimaryKey(tableName: Name, name: string): PrimaryKeySchema {
    const table = this.getTable(tableName);
    if (!table.primaryKey || table.primaryKey.name !== name)
      throw new Error(
        `Table ${this.sqlUtil.sqlifyName(
          table.name
        )} PrimaryKey ${this.sqlUtil.sqlifyName(name)} not found.`
      );
    return table.primaryKey;
  }

  private getForeignKey(tableName: Name, name: string): ForeignKeySchema {
    const table = this.getTable(tableName);
    const fk = table.foreignKeys.find(col => col.name === name);
    if (!fk)
      throw new Error(
        `Table ${this.sqlUtil.sqlifyName(
          table.name
        )} ForeignKey ${this.sqlUtil.sqlifyName(name)} not found.`
      );
    return fk;
  }

  private getConstraint(tableName: Name, name: string): ConstraintSchema | PrimaryKeySchema | ForeignKeySchema {
    const table = this.getTable(tableName);
    let constraint: ConstraintSchema | PrimaryKeySchema | ForeignKeySchema | undefined = table.constraints.find(c => c.name === name);
    if (!constraint) {
      constraint = table.foreignKeys.find(p => p.name === name);
    }
    if (!constraint) {
      constraint = table.primaryKey?.name === name ? table.primaryKey : undefined;
    }
    if (!constraint)
      throw new Error(
        `Table ${this.sqlUtil.sqlifyName(
          table.name
        )} Constraint ${this.sqlUtil.sqlifyName(name)} not found.`
      );
    return constraint;
  }
}
