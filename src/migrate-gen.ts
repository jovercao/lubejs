import { POINT_CONVERSION_COMPRESSED } from 'constants';
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
  compareSchema,
} from './schema';
import { DbType, Name } from './types';
import { isNameEquals } from './util';
import { ObjectDifference } from './util/compare';

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
  target?: DatabaseSchema,
  resolverType?: (rawType: string) => DbType
): string {
  function genCodes(diff: SchemaDifference | null): string[] {
    function stringifyType(type: string): string {
      if (!resolverType) return `SQL.raw('${type}')`;
      const dbType = resolverType(type);
      switch (dbType.name) {
        case 'BINARY':
        case 'STRING':
          return `DbType.${dbType.name.toLowerCase()}(${
            dbType.length === DbType.MAX ? 'DbType.MAX' : dbType.length
          })`;
        case 'DECIMAL':
          return `DbType.decimal(${dbType.precision}, ${dbType.digit})`;
        default:
          return 'DbType.' + dbType.name.toLowerCase();
      }
    }

    function columnForAlter(
      column: ColumnSchema,
      prefix: string = 'builder.'
    ): string {
      let sql = `${prefix}column(${codify(column.name)}, ${stringifyType(
        column.type
      )})`;
      if (column.isNullable) {
        sql += '.null()';
      } else {
        sql += '.notNull()';
      }
      return sql;
    }

    function columnForAdd(
      column: ColumnSchema,
      prefix: string = 'builder.'
    ): string {
      let sql = columnForAlter(column, prefix);
      if (column.isIdentity)
        sql += `.identity(${column.identityStartValue}, ${column.identityIncrement})`;
      if (column.defaultValue) {
        sql += `.default(${JSON.stringify(column.defaultValue)})`;
      }
      if (!column.isNullable) {
        sql += '.notNull()';
      } else {
        sql += '.null()';
      }
      if (column.isCalculate) {
        sql += `.as(SQL.raw(${JSON.stringify(column.calculateExpression)}))`;
      }
      return sql;
    }

    function keyeyColumns(columns: KeyColumnSchema[]): string {
      return (
        '{ ' +
        columns
          .map(
            ({ name, isAscending }) =>
              `${codify(name)}: '${isAscending ? 'ASC' : 'DESC'}'`
          )
          .join(', ') +
        ' }'
      );
    }

    function primaryKey(key: PrimaryKeySchema): string {
      let sql = `builder.primaryKey(${
        key.name ? codify(key.name) : ''
      }).on({ ${key.columns.map(
        ({ name, isAscending }) =>
          `${codify(name)}: '${isAscending ? 'ASC' : 'DESC'}'`
      )} })`;
      if (key.isNonclustered) {
        sql += '.withNoclustered()';
      }
      return sql;
    }

    function foreignKey(fk: ForeignKeySchema): string {
      let code = `builder.foreignKey(${codify(fk.name)}).on(${fk.columns
        .map(column => codify(column))
        .join(', ')}).reference(${codify(
        fk.referenceTable
      )}, [${fk.referenceColumns.map(column => codify(column)).join(', ')}])`;

      if (fk.isCascade) {
        code += 'deleteCascade()';
      }
      return code;
    }

    function codify(name: Name | undefined): string {
      if (name === '') return "''";
      if (!name) return '';

      if (typeof name === 'string') return `'${name.replace(/''/g, "''")}'`;
      return (
        '[' +
        name.map(node => `'${node.replace(/'/g, "\\'")}'`).join(', ') +
        ']'
      );
    }

    function genConstraint(cst: ConstraintSchema): void {
      if (cst.kind === 'CHECK') {
        return genCheckConstraint(cst);
      }
      genUniqueConstraint(cst);
    }

    function genCheckConstraint(check: CheckConstraintSchema): void {
      otherCodes.push(`builder.check('${check.name}', SQL.raw(${check.sql}))`);
    }

    function genUniqueConstraint(key: UniqueConstraintSchema): void {
      otherCodes.push(
        `builder.uniqueKey('${key.name}').on(${keyeyColumns(key.columns)})`
      );
    }

    function genCreateTable(table: TableSchema): void {
      const members: string[] = table.columns.map(col => columnForAdd(col));
      if (table.primaryKey) {
        members.push(primaryKey(table.primaryKey));
      }
      if (table.constraints?.length > 0) {
        table.constraints.map(cst => genConstraint(cst));
      }
      let sql = `builder.createTable(${codify(
        table.name
      )}).as(builder => [\n      ${members.join(`,\n      `)}\n    ])`;
      otherCodes.push(sql);
      if (table.seedData?.length) {
        genSeedData(table, table.seedData);
      }
      if (table.foreignKeys?.length > 0) {
        table.foreignKeys.map(fk => genAddForeignKey(table.name, fk));
      }
      for (const index of table.indexes) {
        genCreateIndex(table.name, index);
      }

      if (table.comment) {
        genComment('Table', table.name, table.comment);
      }

      for (const column of table.columns) {
        if (column.isRowflag) {
          genSetAutoFlag(table.name, column.name);
        }
        if (column.comment) {
          genComment('Column', table.name, column.name, column.comment);
        }
      }

      for (const cst of table.constraints || []) {
        if (cst.comment) {
          genComment('Constraint', table.name, cst.name, cst.comment);
        }
      }

      for (const index of table.indexes || []) {
        if (index.comment) {
          genComment('Index', table.name, index.name, index.comment);
        }
      }
    }

    function genAlterTable(tableChanges: ObjectDifference<TableSchema>): void {
      const tableName = tableChanges.target!.name;
      // PRIMARY KEY
      if (tableChanges.changes?.primaryKey) {
        if (tableChanges.changes.primaryKey.added) {
          genAddPrimaryKey(tableName, tableChanges.changes.primaryKey.added);
        }

        if (tableChanges.changes.primaryKey.removed) {
          genDropConstraint(
            tableName,
            'PRIMARY_KEY',
            tableChanges.changes.primaryKey.removed.name
          );
        }

        if (tableChanges.changes?.primaryKey.changes) {
          if (
            !(
              tableChanges.changes?.primaryKey.changes.comment &&
              Object.keys(tableChanges.changes?.primaryKey.changes).length === 1
            )
          ) {
            genDropConstraint(
              tableName,
              'PRIMARY_KEY',
              tableChanges.changes.primaryKey.target!.name
            );
            genAddPrimaryKey(
              tableName,
              tableChanges.changes.primaryKey.source!
            );
          }

          if (tableChanges.changes?.primaryKey.changes.comment) {
            genComment(
              'Constraint',
              tableName,
              tableChanges.changes.primaryKey.source!.name,
              tableChanges.changes.primaryKey.source!.comment
            );
          }
        }
      }

      // COLUMNS
      if (tableChanges.changes?.columns) {
        for (const col of tableChanges.changes.columns.removeds || []) {
          // const fk = findTargetForeignKey(({ table, foreignKey }) => isNameEquals(tableName, name))
          genDropColumn(tableName, col.name);
        }
        for (const column of tableChanges.changes.columns.addeds || []) {
          genAddColumn(tableName, column);
          if (column.isRowflag) {
            genSetAutoFlag(tableName, column.name);
          }
          if (column.comment) {
            genComment('Column', tableName, column.name, column.comment);
          }
        }

        for (const { target, source, changes } of tableChanges.changes.columns
          .changes || []) {
          if (!changes) continue;
          // 如果类型或者是否可空变化
          if (changes.type || changes.isNullable) {
            genAlterColumn(tableName, source!);
          }
          if (changes.isRowflag) {
            if (source!.isRowflag) {
              genSetAutoFlag(tableName, source!.name);
            } else {
              genDropAutoFlag(tableName, source!.name);
            }
          }
          if (changes.defaultValue) {
            if (!changes.defaultValue.source) {
              genDropDefault(tableName, target!.name);
            } else {
              genSetDefault(
                tableName,
                source!.name,
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
            if (!source!.isIdentity) {
              otherCodes.push(
                '// 敬告：因为需要重建表，在mssql中尚未实现该功能。'
              );
              genDropIdentity(tableName, target!.name);
            } else {
              otherCodes.push(
                '// 敬告：因为需要重建表，在mssql中尚未实现该功能。'
              );

              genSetIdentity(
                tableName,
                source!.name,
                source!.identityStartValue!,
                source!.identityIncrement!
              );
            }
          }

          if (changes.comment) {
            genComment(
              'Column',
              tableName,
              source!.name,
              changes.comment.source
            );
          }
        }
      }

      // FOREIGN KEY
      if (tableChanges.changes?.foreignKeys) {
        for (const fk of tableChanges.changes?.foreignKeys?.addeds || []) {
          genAddForeignKey(tableName, fk);
          if (fk.comment) {
            genComment('Constraint', tableName, fk.name, fk.comment);
          }
        }

        for (const { name } of tableChanges.changes?.foreignKeys?.removeds ||
          []) {
          genDropForeignKey(tableName, name);
        }

        for (const { source, target, changes } of tableChanges.changes
          ?.foreignKeys?.changes || []) {
          genDropForeignKey(tableName, target!.name);
          genAddForeignKey(tableName, source!);
          if (changes?.comment) {
            genComment(
              'Constraint',
              tableName,
              target!.name,
              changes.comment.source
            );
          }
        }
      }

      // CONSTRAINT
      if (tableChanges.changes?.constraints) {
        for (const constraint of tableChanges.changes.constraints.addeds ||
          []) {
          genAddConstraint(tableName, constraint);

          if (constraint.comment) {
            genComment(
              'Constraint',
              tableName,
              constraint.name,
              constraint.comment
            );
          }
        }

        for (const constraint of tableChanges.changes.constraints.removeds ||
          []) {
          genDropConstraint(tableName, constraint.kind, constraint.name);
        }

        for (const { source, target, changes } of tableChanges.changes
          .constraints.changes || []) {
          genDropConstraint(tableName, target!.kind, target!.name);
          genAddConstraint(tableName, source!);
          if (changes?.comment) {
            genComment(
              'Constraint',
              tableName,
              target!.name,
              changes.comment.source
            );
          }
        }
      }

      // INDEXES
      if (tableChanges.changes?.indexes) {
        for (const index of tableChanges.changes.indexes.addeds || []) {
          genCreateIndex(tableName, index);
          if (index.comment) {
            genComment('Index', tableName, index.name, index.comment);
          }
        }

        for (const index of tableChanges.changes.indexes.removeds || []) {
          genDropIndex(tableName, index.name);
        }

        for (const { source, target, changes } of tableChanges.changes.indexes
          .changes || []) {
          genDropIndex(tableName, target!.name);
          genCreateIndex(tableName, source!);
          if (changes?.comment) {
            genComment(
              'Index',
              tableName,
              source!.name,
              changes.comment.source
            );
          }
        }
      }

      if (tableChanges.changes?.comment) {
        genComment('Table', tableName, tableChanges.changes.comment.source);
      }
    }

    function genDropTable(name: Name): void {
      otherCodes.push(`builder.dropTable(${JSON.stringify(name)})`);
    }

    function genDropColumn(table: Name, column: string): void {
      otherCodes.push(
        `builder.alterTable(${codify(
          table
        )}).drop(builder => builder.column(${codify(column)}))`
      );
    }

    function genSetAutoFlag(table: Name<string>, column: string): void {
      otherCodes.push(
        `builder.setAutoRowflag(${codify(table)}, ${codify(column)})`
      );
    }

    function genDropAutoFlag(table: Name<string>, column: string): void {
      otherCodes.push(
        `builder.dropAutoRowflag(${codify(table)}, ${codify(column)})`
      );
    }

    function genDropConstraint(
      table: Name,
      kind: 'CHECK' | 'UNIQUE' | 'PRIMARY_KEY',
      constraint: string
    ): void {
      otherCodes.push(
        `builder.alterTable(${codify(table)}).drop(builder => builder.${
          {
            CHECK: 'check',
            UNIQUE: 'uniqueKey',
            PRIMARY_KEY: 'primaryKey',
          }[kind]
        }(${codify(constraint)}))`
      );
    }

    // function genCreateIndex(table: Name, index: IndexSchema): string {
    //   return `builder.createIndex(${genName(index.name)}).on(${genName(
    //     table
    //   )}, ${genKeyColumns(index.columns)})`;
    // }

    function genAddColumn(table: Name, column: ColumnSchema): void {
      otherCodes.push(
        `builder.alterTable(${codify(table)}).add(builder => ${columnForAdd(
          column
        )})`
      );
    }

    function genAlterColumn(table: Name, column: ColumnSchema): void {
      otherCodes.push(
        `builder.alterTable(${codify(
          table
        )}).alterColumn(column => ${columnForAlter(column, '')})`
      );
    }

    function genSetDefault(
      table: Name,
      column: string,
      defaultValue: string
    ): void {
      otherCodes.push(
        `builder.setDefaultValue(${codify(table)}, ${codify(
          column
        )}, SQL.raw(${JSON.stringify(defaultValue)}))`
      );
    }

    function genDropDefault(table: Name, column: string): void {
      otherCodes.push(
        `builder.dropDefaultValue(${codify(table)}, ${codify(column)})`
      );
    }

    function genSetIdentity(
      table: Name,
      column: string,
      startValue: number,
      increment: number
    ): void {
      otherCodes.push(
        `builder.setIdentity(${codify(table)}, ${codify(
          column
        )}, ${startValue}, ${increment})`
      );
    }

    function genDropIdentity(table: Name, column: string): void {
      otherCodes.push(
        `builder.dropIdentity(${codify(table)}, ${codify(column)})`
      );
    }

    function genAddForeignKey(table: Name, fk: ForeignKeySchema): void {
      addFkCodes.push(
        `builder.alterTable(${codify(table)}).add(builder => ${foreignKey(fk)})`
      );
    }

    function genDropForeignKey(table: Name, name: string): void {
      dropFkCodes.push(
        `builder.alterTable(${codify(
          table
        )}).drop(({ foreignKey }) => foreignKey(${codify(name)}))`
      );
    }

    function genAddConstraint(table: Name, constaint: ConstraintSchema): void {
      if (constaint.kind === 'CHECK') {
        otherCodes.push(
          `builder.alterTable(${codify(
            table
          )}).add(({ check }) => check(${codify(constaint.name)}, SQL.raw(${
            constaint.sql
          }))`
        );
        return;
      }
      otherCodes.push(
        `builder.alterTable(${codify(
          table
        )}).add(({ uniqueKey }) => uniqueKey(${codify(
          constaint.name
        )}).on(${keyeyColumns(constaint.columns)}))`
      );
    }

    function genAddPrimaryKey(table: Name, key: PrimaryKeySchema): void {
      otherCodes.push(
        `builder.alterTable(${codify(
          table
        )}).add(({ primaryKey }) => primaryKey(${codify(
          key.name
        )}).on(${keyeyColumns(key.columns)}))`
      );
    }

    function genCreateSequence(sequence: SequenceSchema): void {
      otherCodes.push(
        `builder.createSequence(${codify(sequence.name)}).as(${stringifyType(
          sequence.type
        )}).startsWith(${sequence.startValue}).incrementBy(${
          sequence.increment
        })`
      );
    }

    function genDropSequence(name: Name): void {
      otherCodes.push(`builder.dropSequence(${codify(name)})`);
    }

    function genCreateIndex(table: Name<string>, index: IndexSchema): void {
      let sql = `builder.createIndex(${codify(index.name)}).on(${codify(
        table
      )}, ${keyeyColumns(index.columns)})`;
      if (index.isUnique) {
        sql += '.unique()';
      }

      if (index.isClustered) {
        sql += '.clustered()';
      }
      otherCodes.push(sql);
    }

    function genDropIndex(table: Name<string>, name: string): void {
      otherCodes.push(`builder.dropIndex(${codify(table)}, ${codify(name)})`);
    }

    function genComment(
      type: 'Table' | 'Procedure' | 'Function' | 'Schema',
      object: Name<string>,
      comment?: string
    ): void;
    function genComment(
      type: 'Column' | 'Constraint' | 'Index',
      table: Name<string>,
      member: string,
      comment?: string
    ): void;
    function genComment(
      type: string,
      object: Name<string>,
      memberOrComment?: string,
      _comment?: string
    ): void {
      let member: string | undefined;
      let comment: string | undefined;
      if (['Table', 'Procedure', 'Function', 'Schema'].includes(type)) {
        comment = memberOrComment;
      } else {
        member = memberOrComment;
        comment = _comment;
      }
      let code: string;
      if (comment) {
        code = `builder.set${type}Comment(${codify(object)}${
          member ? `, ${codify(member)}` : ''
        }, ${codify(comment)})`;
      } else {
        code = `builder.drop${type}Comment(${codify(object)}${
          member ? `, ${codify(member)}` : ''
        })`;
      }
      otherCodes.push(code);
    }

    function genSeedData(table: TableSchema, data: any[]): void {
      const fields = table.columns
        .filter(col => !col.isCalculate)
        .map(col => col.name);
      const rows = data.map(item => {
        const row: Record<string, any> = {};
        fields.forEach(field => (row[field] = item[field]));
        return row;
      });
      const identityColumn = table.columns.find(col => col.isIdentity);
      let sql = `builder.insert(${codify(table.name)}).values(${JSON.stringify(
        rows
      )})`;
      if (identityColumn) {
        sql += '.withIdentity()';
      }
      seedDataCodes.push(sql);
    }

    const dropFkCodes: string[] = [];
    const addFkCodes: string[] = [];
    const otherCodes: string[] = [];
    const seedDataCodes: string[] = [];

    if (!diff) {
      return [];
    }
    // 全新数据库
    if (!diff.target && diff.source) {
      // 创建数据库
      diff.source.tables.forEach(table => genCreateTable(table));
      diff.source.sequences.forEach(sequence => genCreateSequence(sequence));
    } else if (diff.target && !diff.source) {
      // 删除数据库
      otherCodes.push(`builder.createDatabase(${codify(diff.target.name)})`);
    } else if (diff.changes) {
      // 修改数据库
      if (diff.changes?.tables) {
        for (const table of diff.changes.tables.removeds) {
          // 删表前删除外键以免造成依赖问题, 注释掉的原因是因为表的变化本身就会记录需要删除的外键，除非整表删除
          // const dropForeignKeys = allTargetForeignKeys.filter(fk => isNameEquals(fk.referenceTable, name));
          // dropFkCodes.push(
          //   ...dropForeignKeys.map(fk => genDropForeignKey(name, fk.name))
          // );

          // 删除表之前本表外键，以免多表删除时造成依赖问题
          table.foreignKeys.forEach(fk => {
            genDropForeignKey(table.name, fk.name);
          });
          genDropTable(table.name);
        }

        for (const table of diff.changes.tables.addeds) {
          genCreateTable(table);
        }

        for (const tableChanges of diff.changes.tables.changes) {
          genAlterTable(tableChanges);

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
          genCreateSequence(sequence);
        }
        for (const { name } of diff.changes.sequences.removeds || []) {
          genDropSequence(name);
        }
      }
    }
    return [...dropFkCodes, ...otherCodes, ...addFkCodes, ...seedDataCodes];
  }
  const upDiff = compareSchema(source, target);
  const upCodes = upDiff ? genCodes(upDiff) : [];

  const downDiff = compareSchema(target, source);
  const downCodes = downDiff ? genCodes(downDiff) : [];

  // const allTargetForeignKeys: ForeignKeySchema[] = [].concat(...target.tables.map(table => table.foreignKeys));

  // 勿删，此代码另有用处
  // const findTargetForeignKey = (
  //   finder: (table: Name, fk: ForeignKeySchema) => boolean
  // ): { table: Name; foreignKey: ForeignKeySchema } => {
  //   let result: { table: Name; foreignKey: ForeignKeySchema };
  //   target.tables.find(({ name: table, foreignKeys }) =>
  //     foreignKeys.find(fk => {
  //       if (finder(table, fk)) {
  //         result = {
  //           table,
  //           foreignKey: fk,
  //         };
  //         return true;
  //       }
  //     })
  //   );
  //   return result;
  // };

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
