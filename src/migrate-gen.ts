import { KeyColumn, PrimaryKey } from './ast';
import { DbContextMetadata, TableEntityMetadata } from './metadata';
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

// const INDENT = '  ';

// function nestIndent(indent: string): string {
//   return indent + INDENT;
// }

// 架构创建顺序 Table(按依赖顺序) -> [Column, Constraint, Index] -> ForeignKey

// 架构删除顺序 ForeignKey -> [Column, Constraint, Index] -> Table(按依赖顺序);

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
  let sql = `builder.primaryKey(${key.name ? genName(key.name) : ''
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
  kind: 'CHECK' | 'UNIQUE' | 'PRIMARY_KEY',
  constraint: string
): string {
  return `scripter.alterTable(${genName(table)}).drop(builder => builder.${{
    CHECK: 'check', UNIQUE: 'uniqueKey', PRIMARY_KEY: 'primaryKey'
  }[kind]}(${genName(constraint)})))`;
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
    )}).add(({ check }) => check(${genName(constaint.name)}, scripter.raw(${constaint.sql
      })))`;
  }
  return `scripter.alterTable(${genName(
    table
  )}).add(({ uniqueKey }) => uniqueKey(${genName(
    constaint.name
  )}).on(${genKeyColumns(constaint.columns)}))`;
}

function genAddPrimaryKey(table: Name, key: PrimaryKeySchema): string {
  return `scripter.alterTable(${genName(
    table
  )}).add(({ primaryKey }) => primaryKey(${genName(
    key.name
  )}).on(${genKeyColumns(key.columns)}))`;
}

function genCreateSequence(sequence: SequenceSchema): string {
  return `scripter.createSequence(${genName(sequence.name)}).as(scripter.raw(${sequence.type
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
  return `scripter.comment${type}(${genName(table)}${member ? `, ${genName(member)}` : ''
    }, ${genName(comment)})`;
}

function genSeedData(table: TableSchema, data: any[]): string {
  const fields = table.columns.map(col => col.name);
  const rows = data.map(item => {
    const row: Record<string, any> = {};
    fields.forEach(field => row[field] = item[field]);
  })
  return `scripter.insert(${genName(table.name)}).values(${JSON.stringify(rows)})`
}

export function generateMigrate(diff: SchemaDifference, metadata?: DbContextMetadata): string[] {
  const dropFkCodes: string[] = [];
  const addFkCodes: string[] = [];
  const otherCodes: string[] = [];
  const seedDataCodes: string[] = [];
  if (diff.changes?.tables) {
    for (const table of diff.changes.tables.addeds) {
      otherCodes.push(genCreateTable(table));
      if (metadata) {
        const entity = metadata.findTableEntityByName(typeof table.name === 'string' ? table.name : table.name[0]);
        // 如果有种子数据
        if (entity?.data?.length > 0) {
          seedDataCodes.push(genSeedData(table, entity.data))
        }
      }
      if (table.foreignKeys?.length > 0) {
        addFkCodes.push(...table.foreignKeys.map(fk => genAddForeignKey(table.name, fk)));
      }
      for (const index of table.indexes) {
        otherCodes.push(genCreateIndex(table.name, index));
      }

      if (table.comment) {
        otherCodes.push(genComment('Table', table.name, table.comment));
      }

      for (const column of table.columns) {
        if (column.comment) {
          otherCodes.push(
            genComment('Column', table.name, column.comment, column.name)
          );
        }
      }

      for (const cst of table.constraints || []) {
        if (cst.comment) {
          otherCodes.push(
            genComment('Constraint', table.name, cst.comment, cst.name)
          );
        }
      }

      for (const index of table.indexes || []) {
        if (index.comment) {
          otherCodes.push(
            genComment('Index', table.name, index.comment, index.name)
          );
        }
      }
    }

    // 删除表放在最后，以免造成依赖问题
    for (const { name, foreignKeys } of diff.changes.tables.removeds) {
      // 删表前删除外键
      dropFkCodes.push(...foreignKeys.map(fk => genDropForeignKey(name, fk.name)));
      otherCodes.push(genDropTable(name));
    }

    for (const tableChanges of diff.changes.tables.changes) {
      const tableName = tableChanges.source.name;
      // PRIMARY KEY
      if (tableChanges.changes?.primaryKey) {
        if (tableChanges.changes.primaryKey.added) {
          otherCodes.push(genAddPrimaryKey(tableName, tableChanges.changes.primaryKey.added));
        }

        if (tableChanges.changes.primaryKey.removed) {
          otherCodes.push(genDropConstraint(tableName, 'PRIMARY_KEY', tableChanges.changes.primaryKey.removed.name))
        }

        if (tableChanges.changes?.primaryKey.changes) {
          otherCodes.push(genDropConstraint(tableName, 'PRIMARY_KEY', tableChanges.changes.primaryKey.removed.name))
          otherCodes.push(genAddPrimaryKey(tableName, tableChanges.changes.primaryKey.added));
        }
      }

      // COLUMNS
      if (tableChanges.changes?.columns) {
        for (const column of tableChanges.changes.columns.addeds || []) {
          otherCodes.push(genAddColumn(tableName, column));
          if (column.comment) {
            otherCodes.push(
              genComment('Column', tableName, column.comment, column.name)
            );
          }
        }
        for (const col of tableChanges.changes.columns.removeds || []) {
          otherCodes.push(genDropColumn(tableName, col.name));
        }

        for (const { target, changes } of tableChanges.changes.columns
          .changes || []) {
          console.log('======添加列========', target);
          otherCodes.push(genAlterColumn(tableName, target));

          if (changes.comment) {
            otherCodes.push(
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
          addFkCodes.push(genAddForeignKey(tableName, fk));
          if (fk.comment) {
            otherCodes.push(
              genComment('Constraint', tableName, fk.comment, fk.name)
            );
          }
        }

        for (const { name } of tableChanges.changes?.foreignKeys?.removeds ||
          []) {
          dropFkCodes.push(genDropForeignKey(tableName, name));
        }

        for (const { source, target, changes } of tableChanges.changes
          ?.foreignKeys?.changes || []) {
          dropFkCodes.push(genDropForeignKey(tableName, source.name));
          addFkCodes.push(genAddForeignKey(tableName, target));
          if (changes.comment) {
            otherCodes.push(
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
          otherCodes.push(genAddConstraint(tableName, constraint));

          if (constraint.comment) {
            otherCodes.push(
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
          otherCodes.push(
            genDropConstraint(tableName, constraint.kind, constraint.name)
          );
        }

        for (const { source, target, changes } of tableChanges.changes
          .constraints.changes || []) {
          otherCodes.push(genDropConstraint(tableName, source.kind, source.name));
          otherCodes.push(genAddConstraint(tableName, target));
          if (changes.comment) {
            otherCodes.push(
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
          otherCodes.push(genAddIndex(tableName, index));
          if (index.comment) {
            otherCodes.push(
              genComment('Index', tableName, index.comment, index.name)
            );
          }
        }

        for (const index of tableChanges.changes.indexes.removeds || []) {
          otherCodes.push(genDropIndex(tableName, index.name));
        }

        for (const { source, target, changes } of tableChanges.changes.indexes
          .changes || []) {
          otherCodes.push(genDropIndex(tableName, source.name));
          otherCodes.push(genAddIndex(tableName, target));
          if (changes.comment) {
            otherCodes.push(
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
        otherCodes.push(
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
  }

  if (diff.changes?.sequences) {
    for (const sequence of diff.changes.sequences.addeds || []) {
      otherCodes.push(genCreateSequence(sequence));
    }
    for (const { name } of diff.changes.sequences.removeds || []) {
      otherCodes.push(genDropSequence(name));
    }
  }
  return [...dropFkCodes, ...otherCodes, ...addFkCodes, ...seedDataCodes];
}

export function genMigrate(
  name: string,
  source: DatabaseSchema,
  target: DatabaseSchema,
  metadata: DbContextMetadata
): string {
  const upDiff = compare(source, target);
  // 升级需要带上种子数据
  const upCodes = generateMigrate(upDiff, metadata);

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
