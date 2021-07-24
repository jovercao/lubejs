import { Name, Scalar } from './types';
import { MigrateBuilder } from './migrate-builder';
import {
  ColumnSchema,
  ConstraintSchema,
  DatabaseSchema,
  ForeignKeySchema,
  IndexSchema,
  PrimaryKeySchema,
  SequenceSchema,
  TableSchema,
  ViewSchema,
} from './schema';
import { assertAstNonempty, isNameEquals } from './util';
import {
  AllStatement,
  CheckConstraint,
  CompatibleExpression,
  CreateTable,
  ForeignKey,
  PrimaryKey,
  StandardStatement,
  Statement,
  TableColumnForAdd,
  UniqueKey,
} from './ast';
import { SQL_SYMBOLE, STATEMENT_KIND } from './constants';
import { SqlUtil } from './sql-util';

export class SnapshotMigrateBuilder extends MigrateBuilder {
  constructor() {
    super();
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
    return StandardStatement.create(arguments.callee.name, [table, column]);
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

  private createTable(statement: CreateTable): void {
    this.assertDatabaseExists(this.schema);
    if (this.findTable(statement.$name)) {
      throw new Error(
        `Table ${this.sqlUtil.sqlifyName(statement.$name)} is exists.`
      );
    }
    assertAstNonempty(
      statement.$members,
      'CreateTable statement member not found.'
    );
    const pk = statement.$members.find(
      p => p.$type === SQL_SYMBOLE.PRIMARY_KEY
    ) as PrimaryKey | undefined;
    let primaryKey: PrimaryKeySchema | undefined;
    if (pk) {
      assertAstNonempty(pk.$name, 'CreateTable statement name not found.');
      assertAstNonempty(pk.$columns, 'Primary key columns not found.');
      primaryKey = {
        name: pk.$name!,
        columns: pk.$columns.map(col => ({
          name: col.name,
          isAscending: col.sort === 'ASC',
        })),
        isNonclustered: pk.$nonclustered,
      };
    }
    this.schema.tables.push({
      name: statement.$name,
      columns: statement.$members
        .filter(m => m.$type === SQL_SYMBOLE.CREATE_TABLE_COLUMN)
        .map((c: TableColumnForAdd) => ({
          name: c.$name,
          type: this.sqlUtil.sqlifyType(c.$dbType),
          isNullable: c.$nullable ?? false,
          isIdentity: !!c.$identity,
          identityStartValue: c.$identity?.startValue,
          identityIncrement: c.$identity?.increment,
          isCalculate: !!c.$calculate,
          defaultValue: c.$default && this.sqlUtil.sqlifyExpression(c.$default),
          calculateExpression:
            c.$calculate && this.sqlUtil.sqlifyExpression(c.$calculate),
          isRowflag: false,
        })),
      indexes: [],
      primaryKey,
      foreignKeys: statement.$members
        .filter(p => p.$type === SQL_SYMBOLE.FOREIGN_KEY)
        .map((fk: ForeignKey) => {
          assertAstNonempty(fk.$name, 'Foreign key name not found.');
          assertAstNonempty(fk.$columns, 'Foreign key columns not found.');
          assertAstNonempty(
            fk.$referenceColumns,
            'Foreign key referenceColumns not found.'
          );
          assertAstNonempty(
            fk.$referenceTable,
            'Foreign key ReferenceTable not found.'
          );
          return {
            name: fk.$name!,
            columns: fk.$columns,
            referenceColumns: fk.$referenceColumns,
            referenceTable: fk.$referenceTable,
          };
        }),
      constraints: statement.$members
        .filter(
          m =>
            m.$type === SQL_SYMBOLE.UNIQUE_KEY ||
            m.$type === SQL_SYMBOLE.CHECK_CONSTRAINT
        )
        .map((m: UniqueKey | CheckConstraint) => {
          assertAstNonempty(m.$name, 'Unique key name not found.');
          if (m.$type === SQL_SYMBOLE.UNIQUE_KEY) {
            assertAstNonempty(m.$columns, 'Unique key name not found.');
            return {
              name: m.$name,
              kind: 'UNIQUE',
              columns: m.$columns.map(c => ({
                name: c.name,
                isAscending: c.sort === 'ASC',
              })),
            };
          } else {
            return {
              kind: 'CHECK',
              name: m.$name,
              sql: this.sqlUtil.sqlifyCondition(m.$sql),
            };
          }
        }),
    });
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
          };
          break;
        case STATEMENT_KIND.ALTER_DATABASE:
          this.schema!.collate = statement.$collate;
          break;
        case STATEMENT_KIND.DROP_DATABASE:
          this.schema = undefined;
        case STATEMENT_KIND.CREATE_TABLE:
      }
    }
  }
}
