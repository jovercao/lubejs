import { DbType, Name } from './types';
import { columns } from 'mssql';
import {
  SqlBuilder as SQL,
  CreateTableMember,
  CreateTableMemberBuilder,
  Statement,
  TableColumnForAdd,
  TableColumnForAlter,
  DropTable,
  KeyColumn,
} from './ast';
import { DbContextMetadata } from './metadata';
import { MigrateBuilder } from './migrate-builder';
import {
  ColumnSchema,
  compareSchema,
  ConstraintSchema,
  DatabaseSchema,
  ForeignKeySchema,
  IndexSchema,
  PrimaryKeySchema,
  SchemaDifference,
  SequenceSchema,
  TableSchema,
} from './schema';

export function generateUpdateStatements(
  builder: MigrateBuilder,
  source: DatabaseSchema,
  target: DatabaseSchema,
  metadata?: DbContextMetadata
  // resolverType?: (type: string) => DbType
): Statement[] {
  const dropFkCodes: Statement[] = [];
  const addFkCodes: Statement[] = [];
  const otherCodes: Statement[] = [];
  const seedDataCodes: Statement[] = [];
  const differences = compareSchema(source, target);

  // function type(type: string): DbType {
  //   if (!resolverType) return SQL.raw(type);
  //   return resolverType(type);
  // }

  function createIndex(table: Name, index: IndexSchema): void {
    otherCodes.push(
      builder.createIndex(index.name).on(
        table,
        index.columns.map(col => ({
          name: col.name,
          sort: col.isAscending ? 'ASC' : 'DESC',
        }) as KeyColumn)
      )
    );
  }

  function dropIndex(table: Name, name: string): void {
    otherCodes.push(builder.dropIndex(table, name));
  }

  function addForeignKey(table: Name, fk: ForeignKeySchema) {
    addFkCodes.push(
      builder
        .alterTable(table)
        .add(g =>
          g
            .foreignKey(fk.name)
            .on(fk.columns)
            .reference(fk.referenceTable, fk.referenceColumns)
        )
    );
  }

  function dropForeignKey(table: Name, name: string) {
    dropFkCodes.push(
      builder.alterTable(table).drop(({ foreignKey }) => foreignKey(name))
    );
  }

  function commentColumn(table: Name<string>, name: string, comment?: string) {
    otherCodes.push(builder.commentColumn(table, name, comment));
  }

  function commentTable(table: Name, comment?: string) {
    otherCodes.push(builder.commentTable(table, comment));
  }

  function commentIndex(table: Name, name: string, comment?: string) {
    otherCodes.push(builder.commentIndex(table, name, comment));
  }

  function commentConstraint(table: Name, name: string, comment?: string) {
    otherCodes.push(builder.commentConstraint(table, name, comment));
  }

  function commentForeignKey(table: Name, name: string, comment?: string) {
    addFkCodes.push(builder.commentConstraint(table, name, comment));
  }

  function setDefaultValue(table: Name, column: string, defaultValue: string) {
    otherCodes.push(
      builder.setDefaultValue(table, column, SQL.raw(defaultValue))
    );
  }

  function dropDefaultValue(table: Name, column: string) {
    otherCodes.push(builder.dropDefaultValue(table, column));
  }

  function dropIdentity(table: Name, column: string) {
    otherCodes.push(builder.dropIdentity(table, column));
  }

  function setIdentity(
    table: Name,
    column: string,
    start: number,
    increment: number
  ) {
    otherCodes.push(builder.setIdentity(table, column, start, increment));
  }

  function createTable(table: TableSchema): void {
    otherCodes.push(
      builder.createTable(table.name).as(g => [
        ...table.columns.map(schema => tableColumnForAdd(g.column, schema)),
        g.primaryKey(table.primaryKey.name).on(
          table.primaryKey.columns.map(c => ({
            name: c.name,
            sort: c.isAscending ? 'ASC' : 'DESC',
          }) as KeyColumn)
        ),
      ])
    );

    table.indexes.forEach(index => {
      createIndex(table.name, index);
    });

    table.foreignKeys.forEach(fk => {
      addForeignKey(table.name, fk);
    });

    table.constraints.forEach(constraint => {
      addConstraint(table.name, constraint);
    });

    if (table.comment) {
      commentTable(table.name, table.comment);
    }

    table.columns.forEach(column => {
      if (column.comment) {
        commentColumn(table.name, column.name, column.comment);
      }
    });

    table.indexes.forEach(index => {
      if (index.comment) {
        commentIndex(table.name, index.name, index.comment);
      }
    });

    table.foreignKeys.forEach(fk => {
      if (fk.comment) {
        commentForeignKey(table.name, fk.comment);
      }
    });
  }

  function dropTable(name: Name): void {
    otherCodes.push(builder.dropTable(name));
  }

  function createSequence(sequence: SequenceSchema): void {
    otherCodes.push(
      builder
        .createSequence(sequence.name)
        .as(SQL.raw(sequence.type))
        .startWith(sequence.startValue ?? 0)
        .incrementBy(sequence.increment ?? 1)
    );
  }

  function dropSequence(name: Name): void {
    otherCodes.push(builder.dropSequence(name));
  }

  function addColumn(table: Name, schema: ColumnSchema): void {
    otherCodes.push(
      builder
        .alterTable(table)
        .add(({ column }) => tableColumnForAdd(column, schema))
    );
  }

  function dropColumn(table: Name, name: string): void {
    otherCodes.push(
      builder.alterTable(table).drop(({ column }) => column(name))
    );
  }

  function alterColumn(table: Name, column: ColumnSchema): void {
    otherCodes.push(
      builder.alterTable(table).alterColumn(g => tableColumnForAlter(g, column))
    );
  }

  function addPrimaryKey(table: Name, pk: PrimaryKeySchema): void {
    otherCodes.push(
      builder.alterTable(table).add(({ primaryKey }) =>
        primaryKey(pk.name).on(
          pk.columns.map(col => ({
            name: col.name,
            sort: (col.isAscending ? 'ASC' : 'DESC'),
          }) as KeyColumn)
        )
      )
    );
  }

  function dropPrimaryKey(table: Name, name: string): void {
    otherCodes.push(
      builder.alterTable(table).drop(({ primaryKey }) => primaryKey(name))
    );
  }

  function addConstraint(table: Name, constraint: ConstraintSchema): void {
    otherCodes.push(
      builder.alterTable(table).add(g => {
        switch (constraint.kind) {
          case 'CHECK':
            return g.check(constraint.name, SQL.raw(constraint.sql));
          case 'UNIQUE':
            return g.uniqueKey(constraint.name).on(
              constraint.columns.map(col => ({
                name: col.name,
                sort: (col.isAscending ? 'ASC' : 'DESC'),
              }) as KeyColumn)
            );
        }
      })
    );
  }

  function dropConstraint(table: Name, constraint: ConstraintSchema): void {
    otherCodes.push(
      builder.alterTable(table).drop(g => {
        switch (constraint.kind) {
          case 'CHECK':
            return g.check(constraint.name);
          case 'UNIQUE':
            return g.uniqueKey(constraint.name);
        }
      })
    );
  }

  function tableColumnForAlter(
    g: (name: string, type: DbType) => TableColumnForAlter,
    schema: ColumnSchema
  ): TableColumnForAlter {
    const col: TableColumnForAlter = g(schema.name, DbType.raw(schema.type));
    if (schema.isNullable) {
      col.null();
    } else {
      col.notNull();
    }
    if (schema.isIdentity) {
      col.identity(schema.identityStartValue, schema.identityIncrement);
    }
    if (schema.isCalculate) {
      col.as(SQL.raw(schema.calculateExpression));
    }
    return col;
  }

  function tableColumnForAdd(
    column: CreateTableMemberBuilder['column'],
    schema: ColumnSchema
  ): CreateTableMember {
    const col: TableColumnForAdd = column(schema.name, DbType.raw(schema.type));
    if (schema.isNullable) {
      col.null();
    } else {
      col.notNull();
    }
    if (schema.isIdentity) {
      col.identity(schema.identityStartValue, schema.identityIncrement);
    }
    if (schema.isCalculate) {
      col.as(SQL.raw(schema.calculateExpression));
    }
    return col;
  }

  function updateSchema() {
    if (differences.changes?.tables) {
      for (const table of differences.changes.tables.removeds) {
        // 删表前删除外键以免造成依赖问题, 注释掉的原因是因为表的变化本身就会记录需要删除的外键，除非整表删除
        // const dropForeignKeys = allTargetForeignKeys.filter(fk => isNameEquals(fk.referenceTable, name));
        // dropFkCodes.push(
        //   ...dropForeignKeys.map(fk => genDropForeignKey(name, fk.name))
        // );

        // 删除表之前本表外键，以免多表删除时造成依赖问题
        table.foreignKeys.forEach(fk => {
          dropForeignKey(table.name, fk.name);
        });

        dropTable(table.name);
      }

      for (const table of differences.changes.tables.addeds) {
        createTable(table);
      }

      for (const tableChanges of differences.changes.tables.changes) {
        const tableName = tableChanges.target.name;
        // PRIMARY KEY
        if (tableChanges.changes?.primaryKey) {
          if (tableChanges.changes.primaryKey.added) {
            addPrimaryKey(tableName, tableChanges.changes.primaryKey.added);
          }

          if (tableChanges.changes.primaryKey.removed) {
            dropPrimaryKey(
              tableName,
              tableChanges.changes.primaryKey.removed.name
            );
          }

          if (tableChanges.changes?.primaryKey.changes) {
            if (!(tableChanges.changes?.primaryKey.changes.comment && Object.keys(tableChanges.changes?.primaryKey.changes).length === 1)) {
              dropPrimaryKey(
                tableName,
                tableChanges.changes.primaryKey.target.name
              );
              addPrimaryKey(tableName, tableChanges.changes.primaryKey.source);
            }

            if (tableChanges.changes?.primaryKey.changes.comment) {
              commentConstraint(tableName, tableChanges.changes?.primaryKey.source.name, tableChanges.changes?.primaryKey.changes.comment.source);
            }
          }
        }

        // COLUMNS
        if (tableChanges.changes?.columns) {
          for (const col of tableChanges.changes.columns.removeds || []) {
            // const fk = findTargetForeignKey(({ table, foreignKey }) => isNameEquals(tableName, name))
            dropColumn(tableName, col.name);
          }
          for (const column of tableChanges.changes.columns.addeds || []) {
            addColumn(tableName, column);
            if (column.comment) {
              commentColumn(tableName, column.name, column.comment);
            }
          }

          for (const { target, source, changes } of tableChanges.changes.columns
            .changes || []) {
            // 如果类型或者是否可空变化
            if (changes.type || changes.isNullable) {
              alterColumn(tableName, source);
            }

            if (changes.defaultValue) {
              if (!changes.defaultValue.source) {
                dropDefaultValue(tableName, target.name);
              } else {
                setDefaultValue(
                  tableName,
                  source.name,
                  changes.defaultValue.source
                );
              }
            }

            if (
              changes.isIdentity ||
              changes.identityIncrement ||
              changes.identityIncrement
            ) {
              console.debug(source, target);
              if (!source.isIdentity) {
                otherCodes.push(
                  SQL.note('// 敬告：因为需要重建表，在mssql中尚未实现该功能。')
                );
                dropIdentity(tableName, target.name);
              } else {
                otherCodes.push(
                  SQL.note('// 敬告：因为需要重建表，在mssql中尚未实现该功能。')
                );
                setIdentity(
                  tableName,
                  source.name,
                  source.identityStartValue,
                  source.identityIncrement
                );
              }
            }

            if (changes.comment) {
              commentColumn(tableName, source.name, changes.comment.source);
            }
          }
        }

        // FOREIGN KEY
        if (tableChanges.changes?.foreignKeys) {
          for (const fk of tableChanges.changes?.foreignKeys?.addeds || []) {
            addForeignKey(tableName, fk);
            if (fk.comment) {
              commentConstraint(tableName, fk.name, fk.comment);
            }
          }

          for (const { name } of tableChanges.changes?.foreignKeys?.removeds ||
            []) {
            dropForeignKey(tableName, name);
          }

          for (const { source, target, changes } of tableChanges.changes
            ?.foreignKeys?.changes || []) {
            dropForeignKey(tableName, target.name);
            addForeignKey(tableName, source);
            if (changes.comment) {
              commentConstraint(tableName, target.name, changes.comment.source);
            }
          }
        }

        // CONSTRAINT
        if (tableChanges.changes?.constraints) {
          for (const constraint of tableChanges.changes.constraints.addeds ||
            []) {
            addConstraint(tableName, constraint);

            if (constraint.comment) {
              commentConstraint(tableName, constraint.name, constraint.comment);
            }
          }

          for (const constraint of tableChanges.changes.constraints.removeds ||
            []) {
            dropConstraint(tableName, constraint);
          }

          for (const { source, target, changes } of tableChanges.changes
            .constraints.changes || []) {
            dropConstraint(tableName, target);
            addConstraint(tableName, source);
            if (changes.comment) {
              commentConstraint(tableName, target.name, changes.comment.source);
            }
          }
        }

        // INDEXES
        if (tableChanges.changes?.indexes) {
          for (const index of tableChanges.changes.indexes.addeds || []) {
            createIndex(tableName, index);
            if (index.comment) {
              commentIndex(tableName, index.name, index.comment);
            }
          }

          for (const index of tableChanges.changes.indexes.removeds || []) {
            dropIndex(tableName, index.name);
          }

          for (const { source, target, changes } of tableChanges.changes.indexes
            .changes || []) {
            dropIndex(tableName, target.name);
            createIndex(tableName, source);
            if (changes.comment) {
              commentIndex(tableName, source.name, changes.comment.source);
            }
          }
        }

        if (tableChanges.changes.comment) {
          commentTable(tableName, tableChanges.changes.comment.source)
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
    }

    if (differences.changes?.sequences) {
      for (const sequence of differences.changes.sequences.addeds || []) {
        createSequence(sequence);
      }
      for (const { name } of differences.changes.sequences.removeds || []) {
        dropSequence(name);
      }
    }
    return [...dropFkCodes, ...otherCodes, ...addFkCodes, ...seedDataCodes];
  }

  return updateSchema();
}
