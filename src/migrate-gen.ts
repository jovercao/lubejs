import { KeyColumn, PrimaryKey } from './ast';
import {
  CheckConstraintSchema,
  ColumnSchema,
  ConstraintSchema,
  DatabaseSchema,
  ForeignKeySchema,
  IndexSchema,
  KeyColumnSchema,
  PrimaryKeySchema,
  SequenceSchema,
  TableSchema,
  UniqueConstraintSchema,
} from './schema';
import { compare, SchemaDifference } from './schema-compare';
import { Name } from './types';

// TODO: 可空约束名称处理
// TODO: 文本缩进美化处理

const INDENT = '  ';

function nestIndent(indent: string): string {
  return indent + INDENT;
}

function genColumn(column: ColumnSchema, prefix: string = 'builder.'): string {
  let sql = `${prefix}column('${column.name}', scripter.raw('${column.type}'))`;
  if (column.isNullable) {
    sql += '.null()';
  } else {
    sql += '.notNull()';
  }
  if (column.isIdentity)
    sql += `.identity(${column.identityStartValue}, ${column.identityIncrement})`;
  return sql;
}

function genKeyColumns(columns: KeyColumnSchema[]): string {
  return (
    '{ ' +
    columns
      .map(
        ({ name, isAscending }) =>
          `${genName(name)}: '${isAscending ? 'ASC' : 'DESC'}'`
      )
      .join(', ') +
    ' }'
  );
}

function genPrimaryKey(key: PrimaryKeySchema): string {
  let sql = `builder.primaryKey(${
    key.name ? genName(key.name) : ''
  }).on({ ${key.columns.map(
    ({ name, isAscending }) =>
      `${genName(name)}: '${isAscending ? 'ASC' : 'DESC'}'`
  )} })`;
  if (key.isNonclustered) {
    sql += '.withNoclustered()';
  }
  return sql;
}

function genForeignKey(fk: ForeignKeySchema): string {
  let code = `builder.foreignKey(${genName(fk.name)}).on(${fk.columns
    .map(column => genName(column))
    .join(', ')}).reference(${genName(
    fk.referenceTable
  )}, [${fk.referenceColumns.map(column => genName(column)).join(', ')}])`;

  if (fk.isCascade) {
    code += 'deleteCascade()';
  }
  return code;
}

function genConstraint(cst: ConstraintSchema): string {
  if (cst.kind === 'CHECK') {
    return genCheckConstraint(cst);
  }
  return genUniqueConstraint(cst);
}

function genCheckConstraint(check: CheckConstraintSchema): string {
  return `builder.check('${check.name}', scripter.raw(${check.sql}))`;
}

function genUniqueConstraint(key: UniqueConstraintSchema): string {
  return `builder.uniqueKey('${key.name}').on(${genKeyColumns(key.columns)})`;
}

function genName(name: Name): string {
  if (!name) return '';

  if (typeof name === 'string') return `'${name}'`;
  return (
    '[' + name.map(node => `'${node.replace(/'/g, "\\'")}'`).join(', ') + ']'
  );
}

function genCreateTable(table: TableSchema): string {
  const members: string[] = table.columns.map(col => genColumn(col));
  if (table.primaryKey) {
    members.push(genPrimaryKey(table.primaryKey));
  }
  if (table.foreignKeys?.length > 0) {
    members.push(...table.foreignKeys.map(fk => genForeignKey(fk)));
  }
  if (table.constraints?.length > 0) {
    members.push(...table.constraints.map(cst => genConstraint(cst)));
  }
  let sql = `scripter.createTable(${genName(table.name)}).as(builder => [\n${members.join(`,\n`)}\n])`;
  return sql;
}

function genDropTable(name: Name): string {
  return `scripter.dropTable(${JSON.stringify(name)})`;
}

function genDropColumn(table: Name, column: string): string {
  return `scripter.alterTable(${genName(
    table
  )}).drop(builder => builder.column(${genName(column)}))`;
}

function genDropConstraint(
  table: Name,
  kind: 'CHECK' | 'UNIQUE',
  constraint: string
): string {
  return `scripter.alterTable(${genName(table)}).drop(builder => builder.${
    kind === 'CHECK' ? 'check' : 'uniqueKey'
  }($(gen)))`;
}

function genCreateIndex(table: Name, index: IndexSchema): string {
  return `scripter.createIndex(${genName(index.name)}).on(${genName(
    table
  )}, ${genKeyColumns(index.columns)})`;
}

function genAddColumn(table: Name, column: ColumnSchema): string {
  return `scripter.alterTable(${genName(table)}).add(builder => ${genColumn(
    column
  )})`;
}

function genAlterColumn(table: Name, column: any): string {
  return `scripter.alterTable(${genName(
    table
  )}).alterColumn(column => ${genColumn(column, '')})`;
}

function genAddForeignKey(table: Name, fk: ForeignKeySchema): string {
  return `scripter.alterTable(${genName(table)}).add(builder => ${genForeignKey(
    fk
  )})`;
}

function genDropForeignKey(table: Name, name: string): string {
  return `scripter.alterTable(${genName(
    table
  )}).drop(({ foreignKey }) => foreignKey(${genName(name)}))`;
}

function genAddConstraint(table: Name, constaint: ConstraintSchema): string {
  if (constaint.kind === 'CHECK') {
    return `scripter.alterTable(${genName(
      table
    )}).add(({ check }) => check(${genName(constaint.name)}, scripter.raw(${
      constaint.sql
    })))`;
  }
  return `scripter.alterTable(${genName(
    table
  )}).add(({ uniqueKey }) => uniqueKey(${genName(
    constaint.name
  )}).on(${genKeyColumns(constaint.columns)}))`;
}

function genCreateSequence(sequence: SequenceSchema): string {
  return `scripter.createSequence(${genName(sequence.name)}).as(scripter.raw(${
    sequence.type
  })).startsWith(${sequence.startValue}).incrementBy(${sequence.increment})`;
}

function genDropSequence(name: Name): string {
  return `scripter.dropSequence(${genName(name)})`;
}

function genAddIndex(table: Name<string>, index: IndexSchema): string {
  let sql = `scripter.createIndex(${genName(index.name)}).on(${genName(
    table
  )}, ${genKeyColumns(index.columns)})`;
  if (index.isUnique) {
    sql += '.unique()';
  }

  if (index.isClustered) {
    sql += '.clustered()';
  }
  return sql;
}

function genDropIndex(table: Name<string>, name: string): string {
  return `scripter.dropIndex(${genName(table)}, ${genName(name)})`;
}

function genComment(
  type:
    | 'Table'
    | 'Column'
    | 'Constraint'
    | 'Procedure'
    | 'Index'
    | 'Function'
    | 'Schema',
  table: Name<string>,
  comment: string,
  member?: string
): string {
  return `scripter.comment${type}(${genName(table)}${
    member ? `, ${genName(member)}` : ''
  }, ${genName(comment)})`;
}

export function generateMigrate(diff: SchemaDifference): string[] {
  const codes: string[] = [];
  if (diff.changes?.tables) {
    for (const table of diff.changes.tables.addeds) {
      codes.push(genCreateTable(table));
      for (const index of table.indexes) {
        codes.push(genCreateIndex(table.name, index));
      }

      if (table.comment) {
        codes.push(genComment('Table', table.name, table.comment));
      }

      for (const column of table.columns) {
        if (column.comment) {
          codes.push(
            genComment('Column', table.name, column.comment, column.name)
          );
        }
      }

      for (const cst of table.constraints || []) {
        if (cst.comment) {
          codes.push(
            genComment('Constraint', table.name, cst.comment, cst.name)
          );
        }
      }

      for (const index of table.indexes || []) {
        if (index.comment) {
          codes.push(
            genComment('Index', table.name, index.comment, index.name)
          );
        }
      }
    }

    for (const tableChanges of diff.changes.tables.changes) {
      const tableName = tableChanges.source.name;
      // COLUMNS
      if (tableChanges.changes?.columns) {
        for (const column of tableChanges.changes.columns.addeds || []) {
          codes.push(genAddColumn(tableName, column));
          if (column.comment) {
            codes.push(
              genComment('Column', tableName, column.comment, column.name)
            );
          }
        }
        for (const col of tableChanges.changes.columns.removeds || []) {
          codes.push(genDropColumn(tableName, col.name));
        }

        for (const { target, changes } of tableChanges.changes.columns
          .changes || []) {
          codes.push(genAlterColumn(tableName, target));

          if (changes.comment) {
            codes.push(
              genComment(
                'Column',
                tableName,
                changes.comment.target,
                target.name
              )
            );
          }
        }
      }

      // FOREIGN KEY
      if (tableChanges.changes?.foreignKeys) {
        for (const fk of tableChanges.changes?.foreignKeys?.addeds || []) {
          codes.push(genAddForeignKey(tableName, fk));
          if (fk.comment) {
            codes.push(
              genComment('Constraint', tableName, fk.comment, fk.name)
            );
          }
        }

        for (const { name } of tableChanges.changes?.foreignKeys?.removeds ||
          []) {
          codes.push(genDropForeignKey(tableName, name));
        }

        for (const { source, target, changes } of tableChanges.changes
          ?.foreignKeys?.changes || []) {
          codes.push(genDropForeignKey(tableName, source.name));
          codes.push(genAddForeignKey(tableName, target));
          if (changes.comment) {
            codes.push(
              genComment(
                'Constraint',
                tableName,
                changes.comment.target,
                target.name
              )
            );
          }
        }
      }

      // CONSTRAINT
      if (tableChanges.changes?.constraints) {
        for (const constraint of tableChanges.changes.constraints.addeds ||
          []) {
          codes.push(genAddConstraint(tableName, constraint));

          if (constraint.comment) {
            codes.push(
              genComment(
                'Constraint',
                tableName,
                constraint.comment,
                constraint.name
              )
            );
          }
        }

        for (const constraint of tableChanges.changes.constraints.removeds ||
          []) {
          codes.push(
            genDropConstraint(tableName, constraint.kind, constraint.name)
          );
        }

        for (const { source, target, changes } of tableChanges.changes
          .constraints.changes || []) {
          codes.push(genDropConstraint(tableName, source.kind, source.name));
          codes.push(genAddConstraint(tableName, target));
          if (changes.comment) {
            codes.push(
              genComment(
                'Constraint',
                tableName,
                changes.comment.target,
                target.name
              )
            );
          }
        }
      }

      // INDEXES
      if (tableChanges.changes?.indexes) {
        for (const index of tableChanges.changes.indexes.addeds || []) {
          codes.push(genAddIndex(tableName, index));
          if (index.comment) {
            codes.push(
              genComment('Index', tableName, index.comment, index.name)
            );
          }
        }

        for (const index of tableChanges.changes.indexes.removeds || []) {
          codes.push(genDropIndex(tableName, index.name));
        }

        for (const { source, target, changes } of tableChanges.changes.indexes
          .changes || []) {
          codes.push(genDropIndex(tableName, source.name));
          codes.push(genAddIndex(tableName, target));
          if (changes.comment) {
            codes.push(
              genComment(
                'Index',
                tableName,
                changes.comment.target,
                target.name
              )
            );
          }
        }
      }

      if (tableChanges.changes.comment) {
        codes.push(
          genComment('Table', tableName, tableChanges.changes.comment.target)
        );
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

    // 删除表放在最后，以免造成依赖问题
    for (const { name } of diff.changes.tables.removeds) {
      codes.push(genDropTable(name));
    }
  }

  if (diff.changes?.sequences) {
    for (const sequence of diff.changes.sequences.addeds || []) {
      codes.push(genCreateSequence(sequence));
    }
    for (const { name } of diff.changes.sequences.removeds || []) {
      codes.push(genDropSequence(name));
    }
  }
  return codes;
}

export function genMigrate(
  name: string,
  source: DatabaseSchema,
  target: DatabaseSchema
): string {
  const upDiff = compare(source, target);
  const upCodes = generateMigrate(upDiff);

  const downDiff = compare(target, source);
  const downCodes = generateMigrate(downDiff);

  return genMigrateClass(name, upCodes, downCodes);
}

export function genMigrateClass(
  name: string,
  upcodes?: string[],
  downcodes?: string[]
): string {
  return `import { Migrate, Statement, SqlBuilder } from '../../src';

export class ${name} implements Migrate {

  up(
    scripter: SqlBuilder,
    dialect: string | symbol
  ): void {
    ${(upcodes && upcodes.join(';\n      ')) || ''}
  }

  down(
    scripter: SqlBuilder,
    dialect: string | symbol
  ): void {
    ${(downcodes && downcodes.join(';\n      ')) || ''}
  }

}

export default ${name};
  `;
}
