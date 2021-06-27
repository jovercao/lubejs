import {
  MigrateBuilder,
  Name,
  Statement,
  SqlBuilder as SQL,
  CompatibleExpression,
  Scalar,
  DbType,
  Condition,
} from '../..';
import { Compiler } from '../../compile';
import { DbProvider, Lube } from '../../lube';
import { ensureExpression } from '../../util';
import { sp_rename } from './build-in';
import { MssqlProvider } from './provider';
import { load } from './schema-loader';
import { formatSql } from './util';

const COMMENT_EXTEND_PROPERTY_NAME = 'MS_Description';

export class MssqlMigrateBuilder extends MigrateBuilder {
  private readonly lube: Lube;
  private readonly compiler: Compiler;
  constructor(private readonly provider: MssqlProvider) {
    super();

    this.lube = provider.lube;
    this.compiler = provider.compiler;
  }

  // private _getDefaultConstraint(
  //   table: Name<string>,
  //   column: string
  // ): string {
  //   return this.compiler.sql`select dc.name
  //   from sys.default_constraints dc
  //   join sys.columns c on dc.parent_column_id = c.column_id and dc.parent_object_id = c.object_id
  //   where c.object_id = object_id(${this.compiler.stringifyName(
  //     table
  //   )}) and c.name = ${column}`;
  // }

  setDefaultValue(
    table: Name<string>,
    column: string,
    defaultValue: CompatibleExpression<Scalar>
  ): Statement {
    return SQL.raw(`
DECLARE @ConstaintName varchar(128);
SELECT @ConstaintName = dc.name
FROM sys.default_constraints dc
JOIN sys.columns c ON dc.parent_column_id = c.column_id and dc.parent_object_id = c.object_id
WHERE c.object_id = object_id('${this.compiler.stringifyName(
      table
    )}') AND c.name = ${this.compiler.compileLiteral(column)};
IF (@ConstaintName IS NOT NULL)
BEGIN
 EXEC ('ALTER TABLE ${this.compiler.stringifyName(
      table
    )} DROP CONSTRAINT ' + @ConstaintName)
END

ALTER TABLE ${this.compiler.stringifyName(
      table
    )} ADD DEFAULT (${defaultValue}) FOR ${this.compiler.quoted(column)}
`);
  }

  dropDefaultValue(table: Name<string>, column: string): Statement {
    return SQL.raw(`
DECLARE @ConstaintName varchar(128);
SELECT @ConstaintName = dc.name
FROM sys.default_constraints dc
JOIN sys.columns c ON dc.parent_column_id = c.column_id AND dc.parent_object_id = c.object_id
WHERE c.object_id = object_id('${this.compiler.stringifyName(
      table
    )}') and c.name = ${this.compiler.compileLiteral(column)}
IF (@ConstaintName IS NOT NULL)
BEGIN
  EXEC ('ALTER TABLE ${this.compiler.stringifyName(
      table
    )} DROP CONSTRAINT ' + @ConstaintName)
END
`);
  }

  // setColumnType(table: Name<string>, name: string, type: DbType): Statement {
  //   throw new Error('Method not implemented.')
  // }

  // /**
  //  * 复制一个新列及列的数据，以及除Identity以外的所有属性。
  //  * @param table
  //  * @param name
  //  * @param newName
  //  */
  // public async copyNewColumn(
  //   table: Name,
  //   name: string,
  //   newName: string
  // ): Promise<Statement> {
  //   const result = SQL.block();
  //   const tableSchema = await load(
  //     this.provider,
  //     'TABLE',
  //     typeof table === 'string' ? table : table[0]
  //   );
  //   const columnSchema = tableSchema.columns.find(col => col.name === name);
  //   result.append(
  //     SQL.alterTable(table).add(builder =>
  //       builder.column(newName, SQL.raw(columnSchema.type)).null()
  //     )
  //   );
  //   const t = SQL.table(table);
  //   result.append(SQL.update(t).set(t[newName].assign(t[name])));
  //   if (!columnSchema.isNullable) {
  //     result.append(
  //       SQL.alterTable(table).alterColumn(column =>
  //         column(newName, SQL.raw(columnSchema.type)).notNull()
  //       )
  //     );
  //   }
  //   return result;
  // }

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

  setIdentity(
    table: Name<string>,
    column: string,
    startValue: number,
    increment: number
  ): Statement {
    return SQL.block(
      SQL.comments(
        '警告: 由于mssql特性原因，setIdentity操作需要重建表，暂不支持identity属性变更，请手动处理，带来不便敬请谅解。',
        `操作信息： setIdentity(table: ${this.compiler.stringifyName(
          table
        )}, column: ${column}, startValue: ${startValue}, increment: ${increment})`
      ),
      SQL.raw(
        `RAISERROR ('警告: 由于mssql特性原因，setIdentity操作需要重建表，暂不支持identity属性变更，请手动处理，带来不便敬请谅解。', 16, 1);`
      )
    );
  }

  dropIdentity(table: Name<string>, column: string): Statement {
    // const sql = this.copyNewColumn(table, column)
    return SQL.block(
      SQL.comments(
        '警告: 由于mssql特性原因，dropIdentity操作需要重建表，暂不支持identity属性变更，请手动处理，带来不便敬请谅解。',
        `操作信息： dropIdentity(table: ${this.compiler.stringifyName(
          table
        )}, column: ${column})`
      ),
      SQL.raw(
        `RAISERROR ('警告: 由于mssql特性原因，dropIdentity操作需要重建表，暂不支持identity属性变更，请手动处理，带来不便敬请谅解。', 16, 1);`
      )
    );
  }

  commentProcedure(name: Name, comment: string): Statement {
    if (typeof name === 'string' || name.length <= 1)
      throw Error(`Must special the schema.`);
    const [table, schema] = name;
    let sql = formatSql`
IF EXISTS(SELECT p.[value]
FROM sysproperties p INNER JOIN
sysobjects o ON o.id = p.id INNER JOIN
syscolumns c ON p.id = c.id AND p.smallid = c.colid
WHERE (p.name = ${COMMENT_EXTEND_PROPERTY_NAME}))
  EXEC sp_dropextendedproperty ${COMMENT_EXTEND_PROPERTY_NAME}, 'SCHEMA', ${schema}, 'PROCEDURE', ${table};`;
    if (comment) {
      sql += formatSql`
EXEC sp_addextendedproperty ${COMMENT_EXTEND_PROPERTY_NAME}, ${comment}, 'SCHEMA', ${schema}, 'PROCEDURE', ${table}`;
    }
    return SQL.raw(sql);
  }

  commentFunction(name: Name, comment: string): Statement {
    if (typeof name === 'string' || name.length <= 1)
      throw Error(`Must special the schema.`);
    const [table, schema] = name;
    let sql = formatSql`
IF EXISTS(SELECT p.[value]
  FROM sysproperties p INNER JOIN
  sysobjects o ON o.id = p.id INNER JOIN
  syscolumns c ON p.id = c.id AND p.smallid = c.colid
  WHERE (p.name = ${COMMENT_EXTEND_PROPERTY_NAME}))
  EXEC sp_dropextendedproperty ${COMMENT_EXTEND_PROPERTY_NAME}, 'SCHEMA', ${schema}, 'FUNCTION', ${table};`;
    if (comment)
      sql += formatSql`
EXEC sp_addextendedproperty ${COMMENT_EXTEND_PROPERTY_NAME}, ${comment}, 'SCHEMA', ${schema}, 'FUNCTION', ${table}`;
    return SQL.raw(sql);
  }
  commentTable(name: Name, comment: string): Statement {
    if (typeof name === 'string' || name.length <= 1)
      throw Error(`Must special the schema.`);
    const [table, schema] = name;
    let sql = formatSql`
IF EXISTS(SELECT p.[value]
  FROM sysproperties p INNER JOIN
  sysobjects o ON o.id = p.id INNER JOIN
  syscolumns c ON p.id = c.id AND p.smallid = c.colid
  WHERE (p.name = ${COMMENT_EXTEND_PROPERTY_NAME}))
  EXEC sp_dropextendedproperty ${COMMENT_EXTEND_PROPERTY_NAME}, 'SCHEMA', ${schema}, 'TABLE', ${table};`;
    if (comment)
      sql += formatSql`
EXEC sp_addextendedproperty ${COMMENT_EXTEND_PROPERTY_NAME}, ${comment}, 'SCHEMA', ${schema}, 'TABLE', ${table}`;
    return SQL.raw(sql);
  }

  commentColumn(table: Name, name: string, comment: string): Statement {
    if (typeof table === 'string' || table.length <= 1)
      throw Error(`Must special the schema.`);
    const [tableName, schema] = table;
    let sql = formatSql`
IF EXISTS(SELECT p.[value]
  FROM sysproperties p INNER JOIN
  sysobjects o ON o.id = p.id INNER JOIN
  syscolumns c ON p.id = c.id AND p.smallid = c.colid
  WHERE (p.name = ${COMMENT_EXTEND_PROPERTY_NAME}))
  EXEC sp_dropextendedproperty ${COMMENT_EXTEND_PROPERTY_NAME}, 'SCHEMA', ${schema}, 'TABLE', ${tableName}, 'COLUMN', ${name};`;

    if (comment) {
      sql += formatSql`
EXEC sp_addextendedproperty ${COMMENT_EXTEND_PROPERTY_NAME}, ${comment}, 'SCHEMA', ${schema}, 'TABLE', ${tableName}, 'COLUMN', ${name}`;
    }
    return SQL.raw(sql);
  }

  commentIndex(table: Name, name: string, comment: string): Statement {
    if (typeof table === 'string' || table.length <= 1)
      throw Error(`Must special the schema.`);
    const [tableName, schema] = table;
    let sql = formatSql`
IF EXISTS(SELECT p.[value]
  FROM sysproperties p INNER JOIN
  sysobjects o ON o.id = p.id INNER JOIN
  syscolumns c ON p.id = c.id AND p.smallid = c.colid
  WHERE (p.name = ${COMMENT_EXTEND_PROPERTY_NAME}))
  EXEC sp_dropextendedproperty ${COMMENT_EXTEND_PROPERTY_NAME}, 'SCHEMA', ${schema}, 'TABLE', ${tableName}, 'INDEX', ${name};`;
    if (comment) {
      sql += formatSql`
EXEC sp_addextendedproperty ${COMMENT_EXTEND_PROPERTY_NAME}, ${comment}, 'SCHEMA', ${schema}, 'TABLE', ${tableName}, 'INDEX', ${name}`;
    }
    return SQL.raw(sql);
  }

  commentConstraint(table: Name, name: string, comment: string): Statement {
    if (typeof table === 'string' || table.length <= 1)
      throw Error(`Must special the schema.`);
    const [tableName, schema] = table;
    let sql = formatSql`
IF EXISTS(SELECT p.[value]
  FROM sysproperties p INNER JOIN
  sysobjects o ON o.id = p.id INNER JOIN
  syscolumns c ON p.id = c.id AND p.smallid = c.colid
  WHERE (p.name = ${COMMENT_EXTEND_PROPERTY_NAME}))
  EXEC sp_dropextendedproperty ${COMMENT_EXTEND_PROPERTY_NAME}, 'SCHEMA', ${schema}, 'TABLE', ${tableName}, 'CONSTRAINT', ${name};`;
    if (comment)
      sql += formatSql`
EXEC sp_addextendedproperty ${COMMENT_EXTEND_PROPERTY_NAME}, ${comment}, 'SCHEMA', ${schema}, 'TABLE', ${tableName}, 'CONSTRAINT', ${name}`;
    return SQL.raw(sql);
  }

  commentSchema(name: string, comment: string): Statement {
    let sql = formatSql`
IF EXISTS(SELECT p.[value]
  FROM sysproperties p INNER JOIN
  sysobjects o ON o.id = p.id INNER JOIN
  syscolumns c ON p.id = c.id AND p.smallid = c.colid
  WHERE (p.name = ${COMMENT_EXTEND_PROPERTY_NAME}))
  EXEC sp_dropextendedproperty ${COMMENT_EXTEND_PROPERTY_NAME}, 'SCHEMA', ${name};`;
    if (comment)
      sql += formatSql`
EXEC sp_addextendedproperty ${COMMENT_EXTEND_PROPERTY_NAME}, ${comment}, 'SCHEMA', ${name};`;
    return SQL.raw(sql);
  }

  commentSequence(name: Name, comment: string): Statement {
    if (typeof name === 'string' || name.length <= 1)
      throw Error(`Must special the schema.`);
    const [sequence, schema] = name;
    let sql = formatSql`
IF EXISTS(SELECT p.[value]
  FROM sysproperties p INNER JOIN
  sysobjects o ON o.id = p.id INNER JOIN
  syscolumns c ON p.id = c.id AND p.smallid = c.colid
  WHERE (p.name = ${COMMENT_EXTEND_PROPERTY_NAME}))
  EXEC sp_dropextendedproperty ${COMMENT_EXTEND_PROPERTY_NAME}, 'SCHEMA', ${schema}, 'SEQUENCE', ${sequence};`;
    if (comment)
      sql += formatSql`
EXEC sp_addextendedproperty ${COMMENT_EXTEND_PROPERTY_NAME}, ${comment}, 'SCHEMA', ${schema}, 'SEQUENCE', ${sequence}`;
    return SQL.raw(sql);
  }

  renameTable(name: Name, newName: string): Statement {
    return sp_rename(name, newName);
  }

  renameColumn(table: Name, name: string, newName: string): Statement {
    return sp_rename([name, ...table] as Name, newName, 'COLUMN');
  }

  renameView(name: Name, newName: string): Statement {
    return sp_rename(name, newName);
  }

  renameIndex(table: Name, name: string, newName: string): Statement {
    return sp_rename([name, ...table] as Name, newName, 'INDEX');
  }

  renameProcedure(name: Name, newName: string): Statement {
    return sp_rename(name, newName);
  }

  renameFunction(name: Name, newName: string): Statement {
    return sp_rename(name, newName);
  }
}
