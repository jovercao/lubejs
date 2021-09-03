import {
  CreateTableMember,
  CreateTableMemberBuilder,
  Statement,
  ColumnDeclareForAdd,
  ColumnDeclareForAlter,
  KeyColumn,
  CompatiableObjectName,
  DbType,
  SQL
} from '../core';

import { MigrateBuilder } from './migrate-builder';
import {
  CheckConstraintSchema,
  ColumnSchema,
  ConstraintSchema,
  DatabaseSchema,
  ForeignKeySchema,
  IndexSchema,
  PrimaryKeySchema,
  SequenceSchema,
  TableSchema,
  UniqueConstraintSchema,
} from '../orm';
import { sortByDependency } from './util';
import { compareSchema, ObjectDifference } from './compare';

export abstract class MigrateScripter<T extends string | Statement> {
  protected beforeCodes: T[] = [];
  protected afterCodes: T[] = [];
  protected middleCodes: T[] = [];
  protected seedDataCodes: Map<TableSchema, T> = new Map();

  clear() {
    this.afterCodes = [];
    this.beforeCodes = [];
    this.seedDataCodes.clear();
    this.middleCodes = [];
  }

  /**
   * 生成迁移代码
   */
  migrate(
    defaultSchema: string,
    source: DatabaseSchema | undefined,
    target: DatabaseSchema | undefined
  ): void {
    if (!target && source) {
      // 创建数据库,由于事务内不允许创建数据库注释起来
      // this.createDatabase(differences.source);
      // this.useDatabase(differences.source.name);
      source.tables.forEach(table => this.createTableAndMembers(table));
      source.sequences.forEach(sequence => this.createSequence(sequence));
    } else if (target && !source) {
      // 删除数据库
      // this.dropDatabase(differences.this.target.name);
      target.tables.forEach(table => this.dropTable(table));
      target.sequences.forEach(sequence => this.dropSequence(sequence));
    } else {
      const differences = compareSchema(defaultSchema, source, target);
      if (!differences) return;
      if (differences.changes?.tables) {
        differences.changes.tables.removeds.forEach(dropTable =>
          this.dropTableAndMembers(dropTable)
        );
        differences.changes.tables.addeds.forEach(addedTable =>
          this.createTableAndMembers(addedTable)
        );
        differences.changes.tables.changes.forEach(tableDifference =>
          this.alterTableAndMembers(tableDifference)
        );
      }

      if (differences.changes?.sequences) {
        for (const sequence of differences.changes.sequences.addeds || []) {
          this.createSequence(sequence);
        }
        for (const sequence of differences.changes.sequences.removeds || []) {
          this.dropSequence(sequence);
        }
      }
    }
  }

  getScripts() {
    const results = [
      ...this.beforeCodes,
      ...this.middleCodes,
      ...this.afterCodes,
    ];
    if (this.seedDataCodes.size > 0) {
      const tables = Array.from(this.seedDataCodes.keys());
      const sortedTables = sortByDependency(tables, t =>
        t.foreignKeys
          .map(
            fk =>
              tables.find(
                table =>
                  table.name === fk.referenceTable &&
                  table.schema === fk.referenceSchema
              )!
          )
          .filter(p => p)
      );
      results.push(...sortedTables.map(p => this.seedDataCodes.get(p)!));
    }
    return results;
  }

  abstract insertSeedData(table: TableSchema, data: any[]): void;

  abstract useDatabase(name: string): void;

  abstract createDatabase(database: DatabaseSchema): void;

  abstract alterDatabase(database: DatabaseSchema): void;

  abstract dropDatabase(name: string): void;

  abstract createIndex(table: CompatiableObjectName, index: IndexSchema): void;

  abstract dropIndex(table: CompatiableObjectName, name: string): void;

  abstract addForeignKey(
    table: CompatiableObjectName,
    fk: ForeignKeySchema
  ): void;

  abstract dropForeignKey(table: CompatiableObjectName, name: string): void;

  abstract commentColumn(
    table: CompatiableObjectName<string>,
    name: string,
    comment?: string
  ): void;

  abstract commentTable(table: CompatiableObjectName, comment?: string): void;

  abstract commentIndex(
    table: CompatiableObjectName,
    name: string,
    comment?: string
  ): void;

  abstract commentConstraint(
    table: CompatiableObjectName,
    name: string,
    comment?: string
  ): void;

  abstract commentForeignKey(
    table: CompatiableObjectName,
    name: string,
    comment?: string
  ): void;

  abstract setDefaultValue(
    table: CompatiableObjectName,
    column: string,
    defaultValue: string
  ): void;

  abstract dropDefaultValue(table: CompatiableObjectName, column: string): void;

  abstract setAutoRowflag(table: CompatiableObjectName, column: string): void;

  abstract dropAutoRowflag(table: CompatiableObjectName, column: string): void;

  abstract dropIdentity(table: CompatiableObjectName, column: string): void;

  abstract setIdentity(
    table: CompatiableObjectName,
    column: string,
    start: number,
    increment: number
  ): void;

  abstract createTable(table: TableSchema): void;

  createTableAndMembers(table: TableSchema): void {
    this.createTable(table);

    if (table.primaryKey?.comment) {
      this.commentConstraint(
        table,
        table.primaryKey.name,
        table.primaryKey.comment
      );
    }

    table.columns.forEach(column => {
      if (column.isRowflag) {
        this.setAutoRowflag(table, column.name);
      }
      if (column.comment) {
        this.commentColumn(table, column.name, column.comment);
      }
    });

    if (table.comment) {
      this.commentTable(table, table.comment);
    }

    table.indexes.forEach(index => {
      this.createIndex(table, index);
      if (index.comment) {
        this.commentIndex(table, index.name, index.comment);
      }
    });

    table.foreignKeys.forEach(fk => {
      this.addForeignKey(table, fk);
      if (fk.comment) {
        this.commentForeignKey(table, fk.name, fk.comment);
      }
    });

    table.constraints.forEach(constraint => {
      this.addConstraint(table, constraint);
      if (constraint.comment) {
        this.commentConstraint(table, constraint.name, constraint.comment);
      }
    });

    if (table.seedData?.length) {
      this.insertSeedData(table, table.seedData);
    }
  }

  alterTableAndMembers(tableChanges: ObjectDifference<TableSchema>): void {
    const table = tableChanges.target!;
    // DROP PRIMARY KEY
    if (tableChanges.changes?.primaryKey) {
      if (tableChanges.changes.primaryKey.removed) {
        this.dropPrimaryKey(
          table,
          tableChanges.changes.primaryKey.removed.name
        );
      }

      if (tableChanges.changes?.primaryKey.changes) {
        const pk = tableChanges.changes?.primaryKey;
        if (pk.changes?.columns || pk.changes?.isNonclustered) {
          this.dropPrimaryKey(
            table,
            tableChanges.changes.primaryKey.target!.name
          );
        }
      }
    }

    // DROP CONSTRAINTS
    if (tableChanges.changes?.constraints) {
      for (const constraint of tableChanges.changes.constraints.removeds ||
        []) {
        this.dropConstraint(table, constraint);
      }

      for (const { source, target, changes } of tableChanges.changes.constraints
        .changes || []) {
        if (
          changes?.kind !== target?.kind ||
          (source?.kind === 'CHECK' &&
            (
              tableChanges.changes
                .constraints as ObjectDifference<CheckConstraintSchema>
            ).changes?.sql) ||
          (source?.kind === 'UNIQUE' &&
            (
              tableChanges.changes
                .constraints as ObjectDifference<UniqueConstraintSchema>
            ).changes?.columns)
        ) {
          this.dropConstraint(table, target!);
        }
      }
    }
    // DROP INDEXES
    if (tableChanges.changes?.indexes) {
      for (const index of tableChanges.changes.indexes.removeds || []) {
        this.dropIndex(table, index.name);
      }

      for (const { source, target, changes } of tableChanges.changes.indexes
        .changes || []) {
        if (changes?.columns || changes?.isClustered || changes?.isUnique) {
          this.dropIndex(table, target!.name);
        }
      }
    }

    // CHANGE COLUMNS
    if (tableChanges.changes?.columns) {
      for (const col of tableChanges.changes.columns.removeds || []) {
        // const fk = findTargetForeignKey(({ table, foreignKey }) => isNameEquals(tableName, name))
        this.dropColumn(table, col.name);
      }
      for (const column of tableChanges.changes.columns.addeds || []) {
        this.addColumn(table, column);
        if (column.comment) {
          this.commentColumn(table, column.name, column.comment);
        }
      }

      for (const { target, source, changes } of tableChanges.changes.columns
        .changes || []) {
        if (!changes) continue;
        // 如果类型或者是否可空变化
        if (
          source!.type.replace(/ /g, '').toUpperCase() !==
            target!.type.replace(/ /g, '').toUpperCase() ||
          changes.isNullable
        ) {
          this.alterColumn(table, source!);
        }

        if (changes.defaultValue) {
          if (!changes.defaultValue.source) {
            this.dropDefaultValue(table, target!.name);
          } else {
            this.setDefaultValue(
              table,
              source!.name,
              changes.defaultValue.source
            );
          }
        }

        if (changes.isRowflag) {
          if (source!.isRowflag) {
            this.setAutoRowflag(table, source!.name);
          } else {
            this.dropAutoRowflag(table, source!.name);
          }
        }

        if (
          changes.isIdentity ||
          changes.identityIncrement ||
          changes.identityIncrement
        ) {
          if (!source!.isIdentity) {
            this.annotation(
              '// 敬告：因为需要重建表，在mssql中尚未实现该功能。'
            );
            this.dropIdentity(table, target!.name);
          } else {
            this.annotation(
              '// 敬告：因为需要重建表，在mssql中尚未实现该功能。'
            );
            this.setIdentity(
              table,
              source!.name,
              source!.identityStartValue!,
              source!.identityIncrement!
            );
          }
        }

        if (changes.comment) {
          this.commentColumn(table, source!.name, source?.comment);
        }
      }
    }

    // ADD PRIMARY KEY AND CHANGE COMMENT
    if (tableChanges.changes?.primaryKey) {
      // 新增主键
      if (tableChanges.changes.primaryKey.added) {
        const pk = tableChanges.changes.primaryKey.added;
        this.addPrimaryKey(table, pk);
        if (pk.comment) {
          this.commentConstraint(table, pk.name, pk.comment);
        }
      }

      // 修改主健重新添加
      if (tableChanges.changes?.primaryKey?.changes) {
        const pk = tableChanges.changes?.primaryKey;
        if (pk.changes?.columns || pk.changes?.isNonclustered) {
          this.addPrimaryKey(table, pk.source!);
          if (pk.source?.comment) {
            this.commentConstraint(table, pk.source.name, pk.source.comment);
          }
        } else if (pk.changes?.comment) {
          this.commentConstraint(table, pk.source!.name, pk.source?.comment);
        }
      }
    }

    // FOREIGN KEY 因为有删除提前和添加置后，无须注意顺序
    if (tableChanges.changes?.foreignKeys) {
      for (const fk of tableChanges.changes?.foreignKeys?.addeds || []) {
        this.addForeignKey(table, fk);
        if (fk.comment) {
          this.commentConstraint(table, fk.name, fk.comment);
        }
      }

      for (const { name } of tableChanges.changes?.foreignKeys?.removeds ||
        []) {
        this.dropForeignKey(table, name);
      }

      for (const { source, target, changes } of tableChanges.changes
        ?.foreignKeys?.changes || []) {
        if (
          changes?.columns ||
          changes?.referenceTable ||
          changes?.referenceSchema ||
          changes?.referenceColumns
        ) {
          this.dropForeignKey(table, target!.name);
          this.addForeignKey(table, source!);
          if (source?.comment) {
            this.commentConstraint(table, source!.name, source!.comment);
          }
        } else if (changes?.comment) {
          this.commentConstraint(table, target!.name, source?.comment);
        }
      }
    }

    // ADD CONSTRAINT AND CHANGE COMMENT
    if (tableChanges.changes?.constraints) {
      for (const constraint of tableChanges.changes.constraints.addeds || []) {
        this.addConstraint(table, constraint);

        if (constraint.comment) {
          this.commentConstraint(table, constraint.name, constraint.comment);
        }
      }

      for (const { source, target, changes } of tableChanges.changes.constraints
        .changes || []) {
        if (
          changes?.kind !== target?.kind ||
          (source?.kind === 'CHECK' &&
            (
              tableChanges.changes
                .constraints as ObjectDifference<CheckConstraintSchema>
            ).changes?.sql) ||
          (source?.kind === 'UNIQUE' &&
            (
              tableChanges.changes
                .constraints as ObjectDifference<UniqueConstraintSchema>
            ).changes?.columns)
        ) {
          this.addConstraint(table, source!);
          if (source?.comment) {
            this.commentConstraint(table, target!.name, source.comment);
          }
        } else if (changes?.comment) {
          this.commentConstraint(table, target!.name, source?.comment);
        }
      }
    }

    // ADD INDEXES AND CHANGE COMMENT
    if (tableChanges.changes?.indexes) {
      for (const index of tableChanges.changes.indexes.addeds || []) {
        this.createIndex(table, index);
        if (index.comment) {
          this.commentIndex(table, index.name, index.comment);
        }
      }

      for (const { source, target, changes } of tableChanges.changes.indexes
        .changes || []) {
        if (changes?.columns || changes?.isClustered || changes?.isUnique) {
          this.createIndex(table, source!);
          if (source?.comment) {
            this.commentIndex(table, source.name, source.comment);
          }
        } else if (changes?.comment) {
          this.commentIndex(table, source!.name, source?.comment);
        }
      }
    }

    if (tableChanges.changes?.comment) {
      this.commentTable(table, tableChanges.source?.comment);
    }

    // WARN: 修改表名无法追踪。
    // // 如果修改了表名
    // if (tableChanges.changes.name) {
    //   codes.push(
    //     `migrate.renameTable(${JSON.stringify(
    //       tableChanges.changes.name.source
    //     )}, ${JSON.stringify(tableChanges.changes.name.target)})`
    //   );
    // }
  }

  abstract dropTable(table: TableSchema): void;

  dropTableAndMembers(table: TableSchema): void {
    table.foreignKeys.forEach(fk => this.dropForeignKey(table, fk.name));
    this.dropTable(table);
  }

  abstract annotation(note: string): void;

  abstract createSequence(sequence: SequenceSchema): void;

  abstract dropSequence(name: CompatiableObjectName): void;

  abstract addColumn(table: CompatiableObjectName, schema: ColumnSchema): void;

  abstract dropColumn(table: CompatiableObjectName, name: string): void;

  abstract alterColumn(
    table: CompatiableObjectName,
    column: ColumnSchema
  ): void;

  abstract addPrimaryKey(
    table: CompatiableObjectName,
    pk: PrimaryKeySchema
  ): void;
  abstract dropPrimaryKey(table: CompatiableObjectName, name: string): void;

  abstract addConstraint(
    table: CompatiableObjectName,
    constraint: ConstraintSchema
  ): void;

  abstract dropConstraint(
    table: CompatiableObjectName,
    constraint: ConstraintSchema
  ): void;
}

export class StatementMigrateScripter extends MigrateScripter<Statement> {
  constructor(private readonly builder: MigrateBuilder) {
    super();
  }

  annotation(note: string): void {
    this.middleCodes.push(SQL.annotation(note));
  }

  createTable(table: TableSchema): void {
    this.middleCodes.push(
      this.builder.createTable(table).as(g => [
        ...table.columns.map(schema =>
          this.tableColumnForAdd(g.column, schema)
        ),
        g.primaryKey(table.primaryKey!.name).on(
          table.primaryKey!.columns.map(
            c =>
              ({
                name: c.name,
                sort: c.isAscending ? 'ASC' : 'DESC',
              } as KeyColumn)
          )
        ),
      ])
    );
  }

  dropTable(table: TableSchema): void {
    this.middleCodes.push(this.builder.dropTable(table));
  }
  useDatabase(name: string): void {
    this.beforeCodes.push(this.builder.use(name));
  }
  createDatabase(database: DatabaseSchema): void {
    const sql = this.builder.createDatabase(database.name);
    if (database.collate) {
      sql.collate(database.collate);
    }
    this.beforeCodes.push(sql);
  }
  alterDatabase(database: DatabaseSchema): void {
    this.beforeCodes.push(
      this.builder.alterDatabase(database.name).collate(database.collate!)
    );
  }
  dropDatabase(name: string): void {
    this.beforeCodes.push(this.builder.dropDatabase(name));
  }

  insertSeedData(table: TableSchema, data: any[]): void {
    const fields = table.columns
      .filter(col => !col.isCalculate)
      .map(col => col.name);
    const rows = data.map(item => {
      const row: Record<string, any> = {};
      fields.forEach(field => (row[field] = item[field]));
      return row;
    });
    const identityColumn = table.columns.find(col => col.isIdentity);
    const sql = this.builder.insert(table).values(rows);
    if (identityColumn) {
      sql.withIdentity();
    }
    this.seedDataCodes.set(table, sql);
  }

  createIndex(table: CompatiableObjectName, index: IndexSchema): void {
    const sql = this.builder.createIndex(index.name).on(
      table,
      index.columns.map(
        col =>
          ({
            name: col.name,
            sort: col.isAscending ? 'ASC' : 'DESC',
          } as KeyColumn)
      )
    );
    if (index.isUnique) {
      sql.unique();
    }
    if (index.isClustered) {
      sql.clustered();
    }
    this.middleCodes.push(sql);
  }

  dropIndex(table: CompatiableObjectName, name: string): void {
    this.middleCodes.push(this.builder.dropIndex(table, name));
  }

  addForeignKey(table: CompatiableObjectName, fk: ForeignKeySchema) {
    const sql = this.builder.alterTable(table).add($ => {
      const v = $.foreignKey(fk.name)
        .on(fk.columns)
        .reference(
          { name: fk.referenceTable, schema: fk.referenceSchema },
          fk.referenceColumns
        );
      if (fk.isCascade) {
        v.deleteCascade();
      }
      return v;
    });

    this.afterCodes.push(sql);
  }

  dropForeignKey(table: CompatiableObjectName, name: string) {
    this.beforeCodes.push(this.builder.alterTable(table).dropForeignKey(name));
  }

  commentColumn(
    table: CompatiableObjectName<string>,
    name: string,
    comment?: string
  ) {
    if (comment) {
      this.middleCodes.push(
        this.builder.setColumnComment(table, name, comment)
      );
    } else {
      this.middleCodes.push(this.builder.dropColumnComment(table, name));
    }
  }

  commentTable(table: CompatiableObjectName, comment?: string) {
    if (comment) {
      this.middleCodes.push(this.builder.setTableComment(table, comment));
    } else {
      this.middleCodes.push(this.builder.dropTableComment(table));
    }
  }

  commentIndex(table: CompatiableObjectName, name: string, comment?: string) {
    if (comment) {
      this.middleCodes.push(this.builder.setIndexComment(table, name, comment));
    } else {
      this.middleCodes.push(this.builder.dropIndexComment(table, name));
    }
  }

  commentConstraint(
    table: CompatiableObjectName,
    name: string,
    comment?: string
  ) {
    if (comment) {
      this.middleCodes.push(
        this.builder.setConstraintComment(table, name, comment)
      );
    } else {
      this.middleCodes.push(this.builder.dropConstraintComment(table, name));
    }
  }

  commentForeignKey(
    table: CompatiableObjectName,
    name: string,
    comment?: string
  ) {
    if (comment) {
      this.middleCodes.push(
        this.builder.setConstraintComment(table, name, comment)
      );
    } else {
      this.middleCodes.push(this.builder.dropConstraintComment(table, name));
    }
  }

  setDefaultValue(
    table: CompatiableObjectName,
    column: string,
    defaultValue: string
  ) {
    this.middleCodes.push(
      this.builder.setDefaultValue(table, column, SQL.raw(defaultValue))
    );
  }

  dropDefaultValue(table: CompatiableObjectName, column: string) {
    this.middleCodes.push(this.builder.dropDefaultValue(table, column));
  }

  setAutoRowflag(table: CompatiableObjectName, column: string) {
    this.middleCodes.push(this.builder.setAutoRowflag(table, column));
  }

  dropAutoRowflag(table: CompatiableObjectName, column: string) {
    this.middleCodes.push(this.builder.dropAutoRowflag(table, column));
  }

  dropIdentity(table: CompatiableObjectName, column: string) {
    this.middleCodes.push(this.builder.dropIdentity(table, column));
  }

  setIdentity(
    table: CompatiableObjectName,
    column: string,
    start: number,
    increment: number
  ) {
    this.middleCodes.push(
      this.builder.setIdentity(table, column, start, increment)
    );
  }

  createSequence(sequence: SequenceSchema): void {
    this.middleCodes.push(
      this.builder
        .createSequence(sequence)
        .as(SQL.raw(sequence.type))
        .startWith(sequence.startValue ?? 0)
        .incrementBy(sequence.increment ?? 1)
    );
  }

  dropSequence(name: SequenceSchema): void {
    this.middleCodes.push(this.builder.dropSequence(name));
  }

  addColumn(table: CompatiableObjectName, schema: ColumnSchema): void {
    this.middleCodes.push(
      this.builder
        .alterTable(table)
        .add(({ column }) => this.tableColumnForAdd(column, schema))
    );
  }

  dropColumn(table: CompatiableObjectName, name: string): void {
    this.middleCodes.push(this.builder.alterTable(table).dropColumn(name));
  }

  alterColumn(table: CompatiableObjectName, column: ColumnSchema): void {
    this.middleCodes.push(
      this.builder
        .alterTable(table)
        .alterColumn(g => this.tableColumnForAlter(g, column))
    );
  }

  addPrimaryKey(table: CompatiableObjectName, pk: PrimaryKeySchema): void {
    this.middleCodes.push(
      this.builder.alterTable(table).add(({ primaryKey }) =>
        primaryKey(pk.name).on(
          pk.columns.map(
            col =>
              ({
                name: col.name,
                sort: col.isAscending ? 'ASC' : 'DESC',
              } as KeyColumn)
          )
        )
      )
    );
  }

  dropPrimaryKey(table: CompatiableObjectName, name: string): void {
    this.middleCodes.push(this.builder.alterTable(table).dropPrimaryKey(name));
  }

  addConstraint(
    table: CompatiableObjectName,
    constraint: ConstraintSchema
  ): void {
    this.middleCodes.push(
      this.builder.alterTable(table).add(g => {
        switch (constraint.kind) {
          case 'CHECK':
            return g.check(constraint.name, SQL.raw(constraint.sql));
          case 'UNIQUE':
            return g.uniqueKey(constraint.name).on(
              constraint.columns.map(
                col =>
                  ({
                    name: col.name,
                    sort: col.isAscending ? 'ASC' : 'DESC',
                  } as KeyColumn)
              )
            );
        }
      })
    );
  }

  dropConstraint(
    table: CompatiableObjectName,
    constraint: ConstraintSchema
  ): void {
    switch (constraint.kind) {
      case 'CHECK':
        this.middleCodes.push(
          this.builder.alterTable(table).dropCheck(constraint.name)
        );
        break;
      case 'UNIQUE':
        this.middleCodes.push(
          this.builder.alterTable(table).dropUniqueKey(constraint.name)
        );
        break;
    }
  }

  private tableColumnForAlter(
    g: (name: string, type: DbType) => ColumnDeclareForAlter,
    schema: ColumnSchema
  ): ColumnDeclareForAlter {
    const col: ColumnDeclareForAlter = g(schema.name, DbType.raw(schema.type));
    if (schema.isNullable) {
      col.null();
    } else {
      col.notNull();
    }
    return col;
  }

  private tableColumnForAdd(
    column: CreateTableMemberBuilder['column'],
    schema: ColumnSchema
  ): CreateTableMember {
    const col: ColumnDeclareForAdd = column(
      schema.name,
      DbType.raw(schema.type)
    );
    if (schema.isNullable) {
      col.null();
    } else {
      col.notNull();
    }
    if (schema.isIdentity) {
      col.identity(schema.identityStartValue, schema.identityIncrement);
    }
    if (schema.isCalculate) {
      col.as(SQL.raw(schema.calculateExpression!));
    }
    if (schema.isIdentity) {
      col.identity(schema.identityStartValue, schema.identityIncrement);
    }
    if (schema.isCalculate) {
      col.as(SQL.raw(schema.calculateExpression!));
    }
    if (schema.defaultValue !== null && schema.defaultValue !== undefined) {
      col.default(SQL.raw(schema.defaultValue));
    }
    return col;
  }
}

// export function generateScripts(
//   source: DatabaseSchema | undefined,
//   target: DatabaseSchema | undefined,
//   scripter: MigrateScripter
//   // resolverType?: (type: string) => DbType
// ): void {}

// export function generateUpdateStatements(
//   builder: MigrateBuilder,
//   source: DatabaseSchema | undefined,
//   target: DatabaseSchema | undefined
//   // resolverType?: (type: string) => DbType
// ): Statement[] {
//   const scripter = new StatementMigrateScripter(builder, source, target);
//   generateScripts(source, target, scripter);
//   return scripter.getScripts();
// }

// export function generateUpdatePrograme(
//   source: DatabaseSchema | undefined,
//   target: DatabaseSchema | undefined,
//   sqlUtil: SqlUtil,
//   resolverType?: (type: string) => DbType
// ): string[] {
//   const scripter = new ProgramMigrateScripter(sqlUtil, resolverType);
//   generateScripts(source, target, scripter);
//   return scripter.getScripts();
// }
