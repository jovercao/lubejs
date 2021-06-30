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
  SchemaDifference,
  compareSchema
} from './schema';
import { DbType, Name } from './types';
import { isNameEquals } from './util';

// TODO: 可空约束名称处理
// TODO: 文本缩进美化处理

// const INDENT = '  ';

// function nestIndent(indent: string): string {
//   return indent + INDENT;
// }

// 架构创建顺序 Table(按依赖顺序) -> [Column, Constraint, Index] -> ForeignKey

// 架构删除顺序 ForeignKey -> [Column, Constraint, Index] -> Table(按依赖顺序);

/**
 * 生成迁移文件代码
 * @param name
 * @param source
 * @param target
 * @param metadata
 * @returns
 */
export function generateMigrate(
  name: string,
  source: DatabaseSchema,
  target: DatabaseSchema,
  metadata: DbContextMetadata,
  resolverType?: (rawType: string) => DbType
): string {
  function genType(type: string): string {
    if (!resolverType) return `SQL.raw('${type}')`;
    const dbType = resolverType(type);
    switch (dbType.name) {
      case 'BINARY':
      case 'STRING':
        return `DbType.${dbType.name.toLowerCase()}(${
          dbType.length === DbType.MAX ? 'DbType.MAX' : dbType.length
        })`;
      case 'NUMERIC':
        return `DbType.numeric(${dbType.precision}, ${dbType.digit})`;
      default:
        return 'DbType.' + dbType.name.toLowerCase();
    }
  }

  function genColumnForAlter(
    column: ColumnSchema,
    prefix: string = 'builder.'
  ): string {
    let sql = `${prefix}column(${genName(column.name)}, ${genType(
      column.type
    )})`;
    if (column.isNullable) {
      sql += '.null()';
    } else {
      sql += '.notNull()';
    }
    return sql;
  }

  function genColumnForAdd(
    column: ColumnSchema,
    prefix: string = 'builder.'
  ): string {
    let sql = genColumnForAlter(column, prefix);
    if (column.isIdentity)
      sql += `.identity(${column.identityStartValue}, ${column.identityIncrement})`;
    if (column.defaultValue) {
      sql += `.default(${JSON.stringify(column.defaultValue)})`;
    }
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
    return `builder.check('${check.name}', SQL.raw(${check.sql}))`;
  }

  function genUniqueConstraint(key: UniqueConstraintSchema): string {
    return `builder.uniqueKey('${key.name}').on(${genKeyColumns(key.columns)})`;
  }

  function genName(name: Name): string {
    if (name === '') return "''";
    if (!name) return '';

    if (typeof name === 'string') return `'${name.replace(/''/g, "''")}'`;
    return (
      '[' + name.map(node => `'${node.replace(/'/g, "\\'")}'`).join(', ') + ']'
    );
  }

  function genCreateTable(table: TableSchema): string {
    const members: string[] = table.columns.map(col => genColumnForAdd(col));
    if (table.primaryKey) {
      members.push(genPrimaryKey(table.primaryKey));
    }
    if (table.constraints?.length > 0) {
      members.push(...table.constraints.map(cst => genConstraint(cst)));
    }
    let sql = `builder.createTable(${genName(
      table.name
    )}).as(builder => [\n      ${members.join(`,\n      `)}\n    ])`;
    return sql;
  }

  function genDropTable(name: Name): string {
    return `builder.dropTable(${JSON.stringify(name)})`;
  }

  function genDropColumn(table: Name, column: string): string {
    return `builder.alterTable(${genName(
      table
    )}).drop(builder => builder.column(${genName(column)}))`;
  }

  function genDropConstraint(
    table: Name,
    kind: 'CHECK' | 'UNIQUE' | 'PRIMARY_KEY',
    constraint: string
  ): string {
    return `builder.alterTable(${genName(table)}).drop(builder => builder.${
      {
        CHECK: 'check',
        UNIQUE: 'uniqueKey',
        PRIMARY_KEY: 'primaryKey',
      }[kind]
    }(${genName(constraint)}))`;
  }

  function genCreateIndex(table: Name, index: IndexSchema): string {
    return `builder.createIndex(${genName(index.name)}).on(${genName(
      table
    )}, ${genKeyColumns(index.columns)})`;
  }

  function genAddColumn(table: Name, column: ColumnSchema): string {
    return `builder.alterTable(${genName(table)}).add(builder => ${genColumnForAdd(
      column
    )})`;
  }

  function genAlterColumn(table: Name, column: ColumnSchema): string {
    return `builder.alterTable(${genName(
      table
    )}).alterColumn(column => ${genColumnForAlter(column, '')})`;
  }

  function genSetDefault(table: Name, column: string, defaultValue: string): string {
    return `builder.setDefaultValue(${genName(table)}, ${genName(column)}, ${JSON.stringify(defaultValue)})`;
  }

  function genDropDefault(table: Name, column: string): string {
    return `builder.dropDefaultValue(${genName(table)}, ${genName(column)})`;
  }


  function genSetIdentity(table: Name, column: string, startValue: number, increment: number): string {
    return `builder.setIdentity(${genName(table)}, ${genName(column)}, ${startValue}, ${increment})`;
  }

  function genDropIdentity(table: Name, column: string): string {
    return `builder.dropIdentity(${genName(table)}, ${genName(column)})`;
  }

  function genAddForeignKey(table: Name, fk: ForeignKeySchema): string {
    return `builder.alterTable(${genName(
      table
    )}).add(builder => ${genForeignKey(fk)})`;
  }

  function genDropForeignKey(table: Name, name: string): string {
    return `builder.alterTable(${genName(
      table
    )}).drop(({ foreignKey }) => foreignKey(${genName(name)}))`;
  }

  function genAddConstraint(table: Name, constaint: ConstraintSchema): string {
    if (constaint.kind === 'CHECK') {
      return `builder.alterTable(${genName(
        table
      )}).add(({ check }) => check(${genName(constaint.name)}, SQL.raw(${
        constaint.sql
      }))`;
    }
    return `builder.alterTable(${genName(
      table
    )}).add(({ uniqueKey }) => uniqueKey(${genName(
      constaint.name
    )}).on(${genKeyColumns(constaint.columns)}))`;
  }

  function genAddPrimaryKey(table: Name, key: PrimaryKeySchema): string {
    return `builder.alterTable(${genName(
      table
    )}).add(({ primaryKey }) => primaryKey(${genName(
      key.name
    )}).on(${genKeyColumns(key.columns)}))`;
  }

  function genCreateSequence(sequence: SequenceSchema): string {
    return `builder.createSequence(${genName(sequence.name)}).as(${genType(
      sequence.type
    )}).startsWith(${sequence.startValue}).incrementBy(${sequence.increment})`;
  }

  function genDropSequence(name: Name): string {
    return `builder.dropSequence(${genName(name)})`;
  }

  function genAddIndex(table: Name<string>, index: IndexSchema): string {
    let sql = `builder.createIndex(${genName(index.name)}).on(${genName(
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
    return `builder.dropIndex(${genName(table)}, ${genName(name)})`;
  }

  function genComment(
    type: 'Table' | 'Procedure' | 'Function' | 'Schema',
    object: Name<string>,
    comment: string
  ): string;
  function genComment(
    type: 'Column' | 'Constraint' | 'Index',
    table: Name<string>,
    member: string,
    comment: string
  ): string;
  function genComment(
    type:
      | 'Table'
      | 'Column'
      | 'Constraint'
      | 'Procedure'
      | 'Index'
      | 'Function'
      | 'Schema',
    object: string,
    ...args: string[]
  ): string {
    let member: string;
    let comment: string;
    if (['Table', 'Procedure', 'Function', 'Schema'].includes(type)) {
      comment = args[0];
    } else {
      member = args[0];
      comment = args[1];
    }
    const code = `builder.comment${type}(${genName(object)}${
      member ? `, ${genName(member)}` : ''
    }, ${genName(comment)})`;
    return code
  }

  function genSeedData(table: TableSchema, data: any[]): string {
    const fields = table.columns
      .filter(col => !col.isCalculate)
      .map(col => col.name);
    const rows = data.map(item => {
      const row: Record<string, any> = {};
      fields.forEach(field => (row[field] = item[field]));
      return row;
    });
    const identityColumn = table.columns.find(col => col.isIdentity);
    let sql = `builder.insert(${genName(table.name)}).values(${JSON.stringify(
      rows
    )})`;
    if (identityColumn) {
      sql += '.withIdentity()';
    }
    return sql;
  }

  function genCodes(
    diff: SchemaDifference,
    metadata?: DbContextMetadata
  ): string[] {
    const dropFkCodes: string[] = [];
    const addFkCodes: string[] = [];
    const otherCodes: string[] = [];
    const seedDataCodes: string[] = [];
    if (diff.changes?.tables) {
      // 删表前删除外键以免造成依赖问题
      for (const { name } of diff.changes.tables.removeds) {
        // 注释掉的原因是因为表的变化本身就会记录需要删除的外键
        // const dropForeignKeys = allTargetForeignKeys.filter(fk => isNameEquals(fk.referenceTable, name));
        // dropFkCodes.push(
        //   ...dropForeignKeys.map(fk => genDropForeignKey(name, fk.name))
        // );
        otherCodes.push(genDropTable(name));
      }

      for (const table of diff.changes.tables.addeds) {
        otherCodes.push(genCreateTable(table));
        if (metadata) {
          const entity = metadata.findTableEntityByName(
            typeof table.name === 'string' ? table.name : table.name[0]
          );
          // 如果有种子数据
          if (entity?.data?.length > 0) {
            seedDataCodes.push(genSeedData(table, entity.data));
          }
        }
        if (table.foreignKeys?.length > 0) {
          addFkCodes.push(
            ...table.foreignKeys.map(fk => genAddForeignKey(table.name, fk))
          );
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
              genComment('Column', table.name, column.name, column.comment)
            );
          }
        }

        for (const cst of table.constraints || []) {
          if (cst.comment) {
            otherCodes.push(
              genComment('Constraint', table.name, cst.name, cst.comment)
            );
          }
        }

        for (const index of table.indexes || []) {
          if (index.comment) {
            otherCodes.push(
              genComment('Index', table.name, index.name, index.comment)
            );
          }
        }
      }

      for (const tableChanges of diff.changes.tables.changes) {
        const tableName = tableChanges.target.name;
        // PRIMARY KEY
        if (tableChanges.changes?.primaryKey) {
          if (tableChanges.changes.primaryKey.added) {
            otherCodes.push(
              genAddPrimaryKey(tableName, tableChanges.changes.primaryKey.added)
            );
          }

          if (tableChanges.changes.primaryKey.removed) {
            otherCodes.push(
              genDropConstraint(
                tableName,
                'PRIMARY_KEY',
                tableChanges.changes.primaryKey.removed.name
              )
            );
          }

          if (tableChanges.changes?.primaryKey.changes) {
            otherCodes.push(
              genDropConstraint(
                tableName,
                'PRIMARY_KEY',
                tableChanges.changes.primaryKey.target.name
              )
            );
            otherCodes.push(
              genAddPrimaryKey(tableName, tableChanges.changes.primaryKey.source)
            );
          }
        }

        // COLUMNS
        if (tableChanges.changes?.columns) {
          for (const col of tableChanges.changes.columns.removeds || []) {
            // const fk = findTargetForeignKey(({ table, foreignKey }) => isNameEquals(tableName, name))
            otherCodes.push(genDropColumn(tableName, col.name));
          }
          for (const column of tableChanges.changes.columns.addeds || []) {
            otherCodes.push(genAddColumn(tableName, column));
            if (column.comment) {
              otherCodes.push(
                genComment('Column', tableName, column.name, column.comment)
              );
            }
          }

          for (const { target, source, changes } of tableChanges.changes.columns
            .changes || []) {

            // 如果类型或者是否可空变化
            if (changes.type || changes.isNullable) {
              otherCodes.push(genAlterColumn(tableName, source));
            }

            if (changes.defaultValue) {
              if (!changes.defaultValue.source) {
                otherCodes.push(genDropDefault(tableName, target.name))
              } else {
                otherCodes.push(genSetDefault(tableName, source.name, changes.defaultValue.source))
              }
            }

            if (changes.isIdentity || changes.identityIncrement || changes.identityIncrement) {
              console.debug(source, target);
              if (!source.isIdentity) {
                otherCodes.push('// 敬告：因为需要重建表，在mssql中尚未实现该功能。');
                otherCodes.push(genDropIdentity(tableName, target.name))
              } else {
                otherCodes.push('// 敬告：因为需要重建表，在mssql中尚未实现该功能。');
                otherCodes.push(genSetIdentity(tableName, source.name, source.identityStartValue, source.identityIncrement))
              }
            }

            if (changes.comment) {
              otherCodes.push(
                genComment(
                  'Column',
                  tableName,
                  source.name,
                  changes.comment.source
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
                genComment('Constraint', tableName, fk.name, fk.comment)
              );
            }
          }

          for (const { name } of tableChanges.changes?.foreignKeys?.removeds ||
            []) {
            dropFkCodes.push(genDropForeignKey(tableName, name));
          }

          for (const { source, target, changes } of tableChanges.changes
            ?.foreignKeys?.changes || []) {
            dropFkCodes.push(genDropForeignKey(tableName, target.name));
            addFkCodes.push(genAddForeignKey(tableName, source));
            if (changes.comment) {
              otherCodes.push(
                genComment(
                  'Constraint',
                  tableName,
                  target.name,
                  changes.comment.source
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
                  constraint.name,
                  constraint.comment
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
            otherCodes.push(
              genDropConstraint(tableName, target.kind, target.name)
            );
            otherCodes.push(genAddConstraint(tableName, source));
            if (changes.comment) {
              otherCodes.push(
                genComment(
                  'Constraint',
                  tableName,
                  target.name,
                  changes.comment.source
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
                genComment('Index', tableName, index.name, index.comment)
              );
            }
          }

          for (const index of tableChanges.changes.indexes.removeds || []) {
            otherCodes.push(genDropIndex(tableName, index.name));
          }

          for (const { source, target, changes } of tableChanges.changes.indexes
            .changes || []) {
            otherCodes.push(genDropIndex(tableName, target.name));
            otherCodes.push(genAddIndex(tableName, source));
            if (changes.comment) {
              otherCodes.push(
                genComment(
                  'Index',
                  tableName,
                  source.name,
                  changes.comment.source
                )
              );
            }
          }
        }

        if (tableChanges.changes.comment) {
          otherCodes.push(
            genComment('Table', tableName, tableChanges.changes.comment.source)
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
  const upDiff = compareSchema(source, target);
  // 升级需要带上种子数据
  const upCodes = genCodes(upDiff, metadata);

  const downDiff = compareSchema(target, source);
  const downCodes = genCodes(downDiff);

  // const allTargetForeignKeys: ForeignKeySchema[] = [].concat(...target.tables.map(table => table.foreignKeys));

  const findTargetForeignKey = (finder: (table: Name, fk: ForeignKeySchema) => boolean): { table: Name, foreignKey: ForeignKeySchema } =>{
    let result: { table: Name, foreignKey: ForeignKeySchema };
    target.tables.find(({ name: table, foreignKeys }) => foreignKeys.find(fk => {
      if (finder(table, fk)) {
        result = {
          table,
          foreignKey: fk
        };
        return true
      }
    }));
    return result;
  }

  return generateMigrateClass(name, upCodes, downCodes);
}

export function generateMigrateClass(
  name: string,
  upcodes?: string[],
  downcodes?: string[]
): string {
  return `import { Migrate, SqlBuilder as SQL, DbType, MigrateBuilder } from 'lubejs';

export class ${name} implements Migrate {

  async up(
    builder: MigrateBuilder,
    dialect: string | symbol
  ): Promise<void> {
    ${(upcodes && upcodes.join(';\n    ')) || ''}
  }

  async down(
    builder: MigrateBuilder,
    dialect: string | symbol
  ): Promise<void> {
    ${(downcodes && downcodes.join(';\n    ')) || ''}
  }

}

export default ${name};
  `;
}
