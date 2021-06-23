import { dbTypeToSql } from './types';
import {
  DbType,
  Name,
  Select,
  ColumnInfo,
  MigrateScripter,
  TableInfo,
  Compiler,
  ColumnSchema,
  CheckConstraintSchema,
  ForeignKeySchema,
  TableSchema,
  IndexSchema,
} from '../..';
import { UniqueConstraintSchema } from '../../schema';
// import { quoted, this.compiler.stringifyName } from './util'

function columnDef(column: ColumnInfo, compiler: Compiler): string {
  if (column.isCalculate) {
    return `${compiler.quoted(column.name)} AS ${column.calculateExpression}`;
  }
  let columnDef = `${compiler.quoted(column.name)} ${
    typeof column.type === 'string'
      ? column.type
      : compiler.compileType(column.type)
  } ${column.isNullable ? 'NULL' : 'NOT NULL'}`;
  if (column.isIdentity) {
    columnDef += ` IDENTITY(${column.identityStartValue}, ${column.identityIncrement})`;
  }
  return columnDef;
}

function parserName(name: Name<string>): { schema: string; objname: string } {
  let schema: string;
  let objname: string;
  if (Array.isArray(name)) {
    objname = name[0];
    schema = name[1];
  } else {
    objname = name;
  }
  if (!schema) {
    schema = 'dbo';
  }
  return {
    schema,
    objname,
  };
}

export class MssqlMigrateScripter extends MigrateScripter {
  createSequence(
    name: Name<string>,
    type: string | DbType,
    startValue: number,
    increment: number
  ): string {
    return `CREATE SEQUENCE ${this.compiler.stringifyName(name)} AS ${
      typeof type === 'string' ? type : this.compiler.compileType(type)
    } START WITH ${startValue} INCREMENT BY ${increment}`;
  }
  alterTable(name: Name<string>, comment: string): string {
    const { schema, objname } = parserName(name);

    return `
IF (EXISTS(SELECT 1 from sys.schemas sch
  join sys.objects obj on sch.schema_id = obj.schema_id
  join sys.extended_properties prop on prop.major_id = obj.object_id
  where
    sch.name = '${schema}'
    and obj.name = '${objname}'
    and obj.[type] = 'u'
    and prop.name = 'MS_Description'
  ))
  EXEC sys.sp_dropextendedproperty
    @name=N'MS_Description',
    @value=N'${comment}' ,
    @level0type=N'SCHEMA',
    @level0name=N'${schema}',
    @level1type=N'TABLE',
    @level1name=N'${objname}';

EXEC sys.sp_addextendedproperty
  @name=N'MS_Description',
  @value=N'${comment}' ,
  @level0type=N'SCHEMA',
  @level0name=N'${schema}',
  @level1type=N'TABLE',
  @level1name=N'${objname}';`;
  }

  renameView(name: Name<string>, newName: string): string {
    return `EXEC sp_rename ${this.compiler.stringifyName(name)} ${newName}`;
  }

  restartSequence(name: Name<string>): string {
    return `ALTER SEQUENCE ${this.compiler.stringifyName(name)} RESTART WITH 0`;
  }

  annotation(message: string): string {
    return message
      .split(/(\n)|(\r\n)/g)
      .map(line => '-- ' + line)
      .join('\n');
  }

  createView(
    name: Name<string>,
    body: string | Select,
    comment?: string
  ): string {
    let sql = `CREATE VIEW ${this.compiler.stringifyName(name)} AS ${
      typeof body === 'string' ? body : this.compiler.compile(body)
    }`;

    if (comment !== undefined) {
      const { schema, objname } = parserName(name);
      sql += `
EXEC sys.sp_addextendedproperty
  @name=N'MS_Description',
  @value=N'${comment}' ,
  @level0type=N'SCHEMA',
  @level0name=N'${schema}',
  @level1type=N'VIEW',
  @level1name=N'${objname}'
`;
    }

    return sql;
  }

  alterView(
    name: Name<string>,
    body?: string | Select,
    comment?: string
  ): string {
    let sql: string = '';
    if (body) {
      sql += `ALTER VIEW ${this.compiler.stringifyName(name)} AS ${
        typeof body === 'string' ? body : this.compiler.compile(body)
      }`;
    }

    if (comment !== undefined) {
      const { schema, objname } = parserName(name);
      sql += `
IF (EXISTS(
  SELECT 1 from sys.schemas sch
  join sys.objects obj on sch.schema_id = obj.schema_id
  join sys.extended_properties prop on prop.major_id = obj.object_id
  where
    sch.name = '${schema}'
    and obj.name = '${objname}'
    and obj.[type] = 'u'
    and prop.name = 'MS_Description'
  ))
  EXEC sys.sp_dropextendedproperty
    @name=N'MS_Description',
    @level0type=N'SCHEMA',
    @level0name=N'${schema}',
    @level1type=N'VIEW',
    @level1name=N'${objname}';

  EXEC sys.sp_addextendedproperty
    @name=N'MS_Description',
    @value=N'${comment}' ,
    @level0type=N'SCHEMA',
    @level0name=N'${schema}',
    @level1type=N'VIEW',
    @level1name=N'${objname}';`;
    }
    return sql;
  }

  dropView(name: Name<string>): string {
    return `DROP VIEW ${this.compiler.stringifyName(name)}`;
  }

  alterColumn(table: Name<string>, column: ColumnInfo): string {
    let sql = `ALTER TABLE ${this.compiler.stringifyName(
      table
    )} ALTER COLUMN ${columnDef(column, this.compiler)}`;

    if (column.comment !== undefined) {
      const { schema, objname } = parserName(table);
      sql += `
IF (EXISTS(
  SELECT 1 from sys.schemas sch
  join sys.objects obj on sch.schema_id = obj.schema_id
  join sys.columns col on col.object_id = obj.object_id
  join sys.extended_properties prop on prop.major_id = obj.object_id
  where
    sch.name = '${schema}'
    and obj.name = '${objname}'
    and col.name = '${column.name}'
    and obj.[type] = 'u'
    and prop.name = 'MS_Description'
))
  EXEC sys.sp_dropextendedproperty
    @name=N'MS_Description',
    @level0type=N'SCHEMA',
    @level0name=N'${schema}',
    @level1type=N'TABLE',
    @level1name=N'${objname}'
    @level2type=N'COLUMN'
    @level2name=N'${column.name}';

EXEC sys.sp_addextendedproperty
  @name=N'MS_Description',
  @value=N'${column.comment}' ,
  @level0type=N'SCHEMA',
  @level0name=N'${schema}',
  @level1type=N'TABLE',
  @level1name=N'${objname}'
  @level2type=N'COLUMN'
  @level2name=N'${column.name}';`;
      return sql;
    }
  }

  renameColumn(table: Name<string>, name: string, newName: string): string {
    return `EXEC sp_rename ${this.compiler.stringifyName(
      table
    )}.${this.compiler.quoted(name)} ${this.compiler.quoted(newName)}`;
  }

  renameIndex(table: Name<string>, name: string, newName: string): string {
    return `EXEC sp_rename ${this.compiler.quoted(name)} ${this.compiler.quoted(
      newName
    )}`;
  }

  renameTable(name: Name<string>, newName: string): string {
    return `EXEC sp_rename ${this.compiler.stringifyName(
      name
    )} ${this.compiler.quoted(newName)}`;
  }

  dropConstraint(table: Name<string>, name: string): string {
    return `ALTER ${this.compiler.stringifyName(
      table
    )} DROP CONSTRAINT ${this.compiler.quoted(name)}`;
  }

  dropForeignKey(table: Name<string>, name: string): string {
    return `ALTER ${this.compiler.stringifyName(
      table
    )} DROP CONSTRAINT ${this.compiler.quoted(name)}`;
  }

  dropColumn(table: Name<string>, name: string): string {
    return `ALTER TABLE ${this.compiler.stringifyName(
      table
    )} DROP COLUMN ${this.compiler.quoted(name)}`;
  }

  addCheckConstraint(
    table: Name<string>,
    checkConstraint: CheckConstraintSchema
  ): string {
    return `ALTER ${this.compiler.stringifyName(
      table
    )} ADD CONSTRAINT ${this.compiler.quoted(checkConstraint.name)} CHECK(${
      checkConstraint.sql
    })`;
  }

  addUniqueConstraint(
    table: Name<string>,
    uniqueConstraint: UniqueConstraintSchema
  ): string {
    return `ALTER TABLE ${this.compiler.stringifyName(
      table
    )} ADD CONSTRAINT ${this.compiler.quoted(
      uniqueConstraint.name
    )} UNIQUE(${uniqueConstraint.columns
      .map(col => this.compiler.quoted(col))
      .join(', ')})`;
  }

  addForeignKey(table: Name<string>, foreignKey: ForeignKeySchema): string {
    return `ALTER ${this.compiler.stringifyName(table)} ADD CONSTRAINT ${
      foreignKey.name
    } FOREIGN KEY (${foreignKey.foreignColumns.join(
      ', '
    )}) REFERENCE ${this.compiler.stringifyName(
      foreignKey.referenceTable
    )}(${foreignKey.referenceColumns
      .map(col => this.compiler.quoted(col))
      .join(',')})`;
  }

  addColumn(table: Name<string>, column: ColumnSchema): string {
    let sql = `ALTER ${this.compiler.stringifyName(table)} ADD ${columnDef(
      column,
      this.compiler
    )}`;

    if (column.comment !== undefined) {
      const { schema, objname } = parserName(table);
      sql += `
EXEC sys.sp_addextendedproperty
  @name=N'MS_Description',
  @value=N'${column.comment}' ,
  @level0type=N'SCHEMA',
  @level0name=N'${schema}',
  @level1type=N'TABLE',
  @level1name=N'${objname}'
  @level2type=N'COLUMN'
  @level2name=N'${column.name}`;
    }

    return sql;
  }

  dropSequence(name: Name<string>): string {
    return `DROP SEQUENCE ${this.compiler.stringifyName(name)}`;
  }

  dropIndex(table: Name<string>, name: string): string {
    return `DROP INDEX ${this.compiler.stringifyName(
      table
    )}.${this.compiler.quoted(name)}`;
  }

  dropTable(name: Name<string>): string {
    return `DROP TABLE ${this.compiler.stringifyName(name)}`;
  }

  createTable(table: TableInfo): string {
    const pk = table.primaryKey
      ? `,
  primary key (${table.primaryKey
    .map(p => this.compiler.quoted(p))
    .join(', ')})`
      : '';
    const fk = table.foreignKeys?.length
      ? `,
  ${table.foreignKeys
    .map(
      fk =>
        `CONSTRAINT ${this.compiler.quoted(
          fk.name
        )} FOREIGN KEY (${fk.foreignColumns
          .map(c => this.compiler.quoted(c))
          .join(', ')}) REFERENCE ${this.compiler.stringifyName(
          fk.referenceTable
        )}(${fk.referenceColumns.map(c => this.compiler.quoted(c)).join(', ')}`
    )
    .join(',\n  ')}
    `
      : '';

    const con = table.constraints?.length
      ? `,
  ${table.constraints
    .map(
      ct =>
        `CONSTRAINT ${this.compiler.quoted(ct.name)} ${ct.kind}(${
          ct.kind === 'CHECK'
            ? ct.sql
            : ct.columns.map(c => this.compiler.quoted(c)).join(', ')
        })`
    )
    .join(',\n  ')}`
      : '';

    let sql = `CREATE TABLE ${this.compiler.stringifyName(table.name)}(
  ${table.columns
    .map(column => columnDef(column, this.compiler))
    .join(',\n  ')}${pk}${fk}${con}
)`;
    if (table.comment !== undefined) {
      const { schema, objname } = parserName(table.name);
      sql += `
EXEC sys.sp_addextendedproperty
  @name=N'MS_Description',
  @value=N'${table.comment}' ,
  @level0type=N'SCHEMA',
  @level0name=N'${schema}',
  @level1type=N'TABLE',
  @level1name=N'${objname}';`;
    }
    return sql;
  }

  createIndex(table: Name<string>, index: IndexSchema): string {
    return `CREATE INDEX ${this.compiler.quoted(
      index.name
    )} ON ${this.compiler.stringifyName(table)}(${index.columns.map(
      ({ name: columnName, isAscending }) =>
        `${this.compiler.quoted(columnName)} ${isAscending ? 'ASC' : 'DESC'}`
    )})`;
  }
}
