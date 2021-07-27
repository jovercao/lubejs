import {
  MigrateBuilder,
  Statement,
  SqlBuilder as SQL,
  CompatibleExpression,
  Scalar,
  Condition,
  SqlUtil,
  Lube,
  DbType,
  CreateDatabase,
  DropDatabase,
  AlterDatabase,
  CompatiableObjectName,
} from 'lubejs';
import { sp_rename } from './build-in';
import { MssqlProvider } from './provider';
import { formatSql } from './util';

const COMMENT_EXTEND_PROPERTY_NAME = 'MS_Description';

export class MssqlMigrateBuilder extends MigrateBuilder {
  renameSequence(name: CompatiableObjectName, newName: string): Statement {
    return sp_rename(this.sqlUtil.sqlifyObjectName(name), newName, 'OBJECT');
  }
  renameDatabase(name: string, newName: string): Statement {
    return SQL.raw(`
    USE master;
    ALTER DATABASE ${this.sqlUtil.sqlifyObjectName(
      name
    )} SET SINGLE_USER WITH ROLLBACK IMMEDIAT
    ALTER DATABASE ${this.sqlUtil.sqlifyObjectName(
      name
    )} MODIFY NAME = ${this.sqlUtil.sqlifyObjectName(newName)} ;
    ALTER DATABASE ${this.sqlUtil.sqlifyObjectName(newName)}  SET MULTI_USER`);
  }

  alterDatabase(name: string): AlterDatabase {
    return SQL.alterDatabase(name);
  }
  createDatabase(name: string): CreateDatabase {
    return SQL.createDatabase(name);
  }
  dropDatabase(name: string): DropDatabase {
    return SQL.dropDatabase(name);
  }
  dropSchemaComment(name: string): Statement {
    return this.setSchemaComment(name, null);
  }
  dropSequenceComment(name: CompatiableObjectName<string>): Statement {
    return this.setSequenceComment(name, null);
  }
  dropProcedureComment(name: CompatiableObjectName<string>): Statement {
    return this.setProcedureComment(name, null);
  }
  dropFunctionComment(name: CompatiableObjectName<string>): Statement {
    return this.setFunctionComment(name, null);
  }
  dropTableComment(name: CompatiableObjectName<string>): Statement {
    return this.setTableComment(name, null);
  }
  dropColumnComment(
    table: CompatiableObjectName<string>,
    name: string
  ): Statement {
    return this.setColumnComment(table, name, null);
  }
  dropIndexComment(
    table: CompatiableObjectName<string>,
    name: string
  ): Statement {
    return this.setIndexComment(table, name, null);
  }
  dropConstraintComment(
    table: CompatiableObjectName<string>,
    name: string
  ): Statement {
    return this.setConstraintComment(table, name, null);
  }
  setAutoRowflag(
    table: CompatiableObjectName<string>,
    column: string
  ): Statement {
    return SQL.block(
      SQL.note(
        '=========================注意：MSSQL 自带标记列，仅通过修改类型来达成========================'
      ),
      SQL.alterTable(table).dropColumn(column),
      SQL.alterTable(table).add(({ column: c }) =>
        c(column, DbType.raw('ROWVERSION'))
      )
      // SQL.alterTable(table).alterColumn(c =>
      //   c(column, DbType.raw('ROWVERSION'))
      // )
    );
  }
  dropAutoRowflag(
    table: CompatiableObjectName<string>,
    column: string
  ): Statement {
    const tempColumn = '__' + column;
    return SQL.block(
      SQL.note(
        '=========================MSSQL 自带标记列，仅通过修改类型来达成========================'
      ),
      SQL.alterTable(table).add(({ column: c }) =>
        c(tempColumn, DbType.binary(8)).notNull()
      ),
      SQL.update(table).set({
        [column]: SQL.field(column),
      }),
      SQL.alterTable(table).drop(({ column: c }) => c(column)),
      this.renameColumn(table, tempColumn, column)
    );
  }

  // existsTable(name: CompatiableObjectName<string>): Expression<Scalar> {
  //   return
  // }

  private readonly lube: Lube;
  private readonly sqlUtil: SqlUtil;
  constructor(private readonly provider: MssqlProvider) {
    super();

    this.lube = provider.lube;
    this.sqlUtil = provider.sqlUtil;
  }

  setDefaultValue(
    table: CompatiableObjectName<string>,
    column: string,
    defaultValue: CompatibleExpression<Scalar>
  ): Statement {
    return SQL.raw(`
DECLARE @ConstaintName varchar(128);
SELECT @ConstaintName = dc.name
FROM sys.default_constraints dc
JOIN sys.columns c ON dc.parent_column_id = c.column_id and dc.parent_object_id = c.object_id
WHERE c.object_id = object_id('${this.sqlUtil.sqlifyObjectName(
      table
    )}') AND c.name = ${this.sqlUtil.sqlifyLiteral(column)};
IF (@ConstaintName IS NOT NULL)
BEGIN
 EXEC ('ALTER TABLE ${this.sqlUtil.sqlifyObjectName(
   table
 )} DROP CONSTRAINT ' + @ConstaintName)
END

ALTER TABLE ${this.sqlUtil.sqlifyObjectName(
      table
    )} ADD DEFAULT (${defaultValue}) FOR ${this.sqlUtil.quoted(column)}
`);
  }

  dropDefaultValue(
    table: CompatiableObjectName<string>,
    column: string
  ): Statement {
    return SQL.raw(`
DECLARE @ConstaintName varchar(128);
SELECT @ConstaintName = dc.name
FROM sys.default_constraints dc
JOIN sys.columns c ON dc.parent_column_id = c.column_id AND dc.parent_object_id = c.object_id
WHERE c.object_id = object_id('${this.sqlUtil.sqlifyObjectName(
      table
    )}') and c.name = ${this.sqlUtil.sqlifyLiteral(column)}
IF (@ConstaintName IS NOT NULL)
BEGIN
  EXEC ('ALTER TABLE ${this.sqlUtil.sqlifyObjectName(
    table
  )} DROP CONSTRAINT ' + @ConstaintName)
END
`);
  }

  // setColumnType(table: CompatiableObjectName<string>, name: string, type: DbType): Statement {
  //   throw new Error('Method not implemented.')
  // }

  // /**
  //  * 复制一个新列及列的数据，以及除Identity以外的所有属性。
  //  * @param table
  //  * @param name
  //  * @param newName
  //  */
  // public async copyNewColumn(
  //   table: CompatiableObjectName,
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
    table: CompatiableObjectName<string>,
    sql: Condition,
    name?: string
  ): Statement {
    return SQL.alterTable(table).add(builder =>
      name ? builder.check(name, sql) : builder.check(sql)
    );
  }

  dropCheckConstaint(
    table: CompatiableObjectName<string>,
    name: string
  ): Statement {
    return SQL.alterTable(table).drop(builder => builder.check(name));
  }

  setIdentity(
    table: CompatiableObjectName<string>,
    column: string,
    startValue: number,
    increment: number
  ): Statement {
    return SQL.block(
      SQL.comments(
        '警告: 由于mssql特性原因，setIdentity操作需要重建表，暂不支持identity属性变更，请手动处理，带来不便敬请谅解。',
        `操作信息： setIdentity(table: ${this.sqlUtil.sqlifyObjectName(
          table
        )}, column: ${column}, startValue: ${startValue}, increment: ${increment})`
      ),
      SQL.raw(
        `RAISERROR ('警告: 由于mssql特性原因，setIdentity操作需要重建表，暂不支持identity属性变更，请手动处理，带来不便敬请谅解。', 16, 1);`
      )
    );
  }

  dropIdentity(
    table: CompatiableObjectName<string>,
    column: string
  ): Statement {
    // const sql = this.copyNewColumn(table, column)
    return SQL.block(
      SQL.comments(
        '警告: 由于mssql特性原因，dropIdentity操作需要重建表，暂不支持identity属性变更，请手动处理，带来不便敬请谅解。',
        `操作信息： dropIdentity(table: ${this.sqlUtil.sqlifyObjectName(
          table
        )}, column: ${column})`
      ),
      SQL.raw(
        `RAISERROR ('警告: 由于mssql特性原因，dropIdentity操作需要重建表，暂不支持identity属性变更，请手动处理，带来不便敬请谅解。', 16, 1);`
      )
    );
  }

  setProcedureComment(
    name: CompatiableObjectName,
    comment: string | null
  ): Statement {
    let sql = formatSql`
-- MigrateBuilder.setProcedureComment(${this.sqlUtil.sqlifyObjectName(
      name
    )}, ${comment});
DECLARE @Schema VARCHAR(100), @Proc VARCHAR(100), @ObjectId INT

SELECT @ObjectId = o.object_id, @Schema = s.name, @Proc = o.name
FROM sys.objects o JOIN sys.schemas s ON o.schema_id = s.schema_id
WHERE o.object_id = object_id(${this.sqlUtil.sqlifyObjectName(name)})

IF EXISTS(SELECT 1 FROM sys.extended_properties p WHERE p.major_id = @ObjectId AND p.minor_id = 0 AND p.class = 1)
BEGIN
  EXEC sys.sp_dropextendedproperty ${COMMENT_EXTEND_PROPERTY_NAME}, 'SCHEMA', @Schema, 'PROCEDURE', @Proc
END
`;

    if (comment) {
      sql += formatSql`
EXEC sys.sp_addextendedproperty ${COMMENT_EXTEND_PROPERTY_NAME}, ${comment}, 'SCHEMA', @Schema, 'PROCEDURE', @Proc`;
    }
    return SQL.raw(sql);
  }

  setFunctionComment(
    name: CompatiableObjectName,
    comment: string | null
  ): Statement {
    let sql = formatSql`
-- MigrateBuilder.setFunctionComment(${this.sqlUtil.sqlifyObjectName(
      name
    )}, ${comment});
DECLARE @Schema VARCHAR(100), @Func VARCHAR(100), @ObjectId INT

SELECT @ObjectId = o.object_id, @Schema = s.name, @Func = o.name
FROM sys.objects o JOIN sys.schemas s ON o.schema_id = s.schema_id
WHERE o.object_id = object_id(${this.sqlUtil.sqlifyObjectName(name)})

IF EXISTS(SELECT 1 FROM sys.extended_properties p WHERE p.major_id = @ObjectId AND p.minor_id = 0 AND p.class = 1)
BEGIN
  EXEC sys.sp_dropextendedproperty ${COMMENT_EXTEND_PROPERTY_NAME}, 'SCHEMA', @Schema, 'FUNCTION', @Func
END
`;

    if (comment) {
      sql += formatSql`
EXEC sys.sp_addextendedproperty ${COMMENT_EXTEND_PROPERTY_NAME}, ${comment}, 'SCHEMA', @Schema, 'FUNCTION', @Func`;
    }
    return SQL.raw(sql);
  }

  setSequenceComment(
    name: CompatiableObjectName,
    comment: string | null
  ): Statement {
    let sql = formatSql`
-- MigrateBuilder.setSequenceComment(${this.sqlUtil.sqlifyObjectName(
      name
    )}, ${comment});
DECLARE @Schema VARCHAR(100), @Sequence VARCHAR(100), @ObjectId INT

SELECT @ObjectId = o.object_id, @Schema = s.name, @Sequence = o.name
FROM sys.objects o JOIN sys.schemas s ON o.schema_id = s.schema_id
WHERE o.object_id = object_id(${this.sqlUtil.sqlifyObjectName(name)})

IF EXISTS(SELECT 1 FROM sys.extended_properties p WHERE p.major_id = @ObjectId AND p.minor_id = 0 AND p.class = 1)
BEGIN
  EXEC sys.sp_dropextendedproperty ${COMMENT_EXTEND_PROPERTY_NAME}, 'SCHEMA', @Schema, 'SEQUENCE', @Sequence
END
`;

    if (comment) {
      sql += formatSql`
EXEC sys.sp_addextendedproperty ${COMMENT_EXTEND_PROPERTY_NAME}, ${comment}, 'SCHEMA', @Schema, 'SEQUENCE', @Sequence`;
    }
    return SQL.raw(sql);
  }

  setTableComment(
    name: CompatiableObjectName,
    comment: string | null
  ): Statement {
    let sql = formatSql`
-- MigrateBuilder.setTableComment(${this.sqlUtil.sqlifyObjectName(
      name
    )}, ${comment});
DECLARE @Schema VARCHAR(100), @Table VARCHAR(100), @ObjectId INT

SELECT @ObjectId = o.object_id, @Schema = s.name, @Table = o.name
FROM sys.objects o JOIN sys.schemas s ON o.schema_id = s.schema_id
WHERE o.object_id = object_id(${this.sqlUtil.sqlifyObjectName(name)})

IF EXISTS(SELECT 1 FROM sys.extended_properties p WHERE p.major_id = @ObjectId AND p.minor_id = 0 AND p.class = 1)
BEGIN
  EXEC sys.sp_dropextendedproperty ${COMMENT_EXTEND_PROPERTY_NAME}, 'SCHEMA', @Schema, 'TABLE', @Table
END
`;

    if (comment) {
      sql += formatSql`
EXEC sys.sp_addextendedproperty ${COMMENT_EXTEND_PROPERTY_NAME}, ${comment}, 'SCHEMA', @Schema, 'TABLE', @Table`;
    }
    return SQL.raw(sql);
  }

  setViewComment(
    name: CompatiableObjectName,
    comment: string | null
  ): Statement {
    let sql = formatSql`
-- MigrateBuilder.setViewComment(${this.sqlUtil.sqlifyObjectName(
      name
    )}, ${comment});
DECLARE @Schema VARCHAR(100), @View VARCHAR(100), @ObjectId INT

SELECT @ObjectId = o.object_id, @Schema = s.name, @View = o.name
FROM sys.objects o JOIN sys.schemas s ON o.schema_id = s.schema_id
WHERE o.object_id = object_id(${this.sqlUtil.sqlifyObjectName(name)})

IF EXISTS(SELECT 1 FROM sys.extended_properties p WHERE p.major_id = @ObjectId AND p.minor_id = 0 AND p.class = 1)
BEGIN
  EXEC sys.sp_dropextendedproperty ${COMMENT_EXTEND_PROPERTY_NAME}, 'SCHEMA', @Schema, 'VIEW', @View
END
`;

    if (comment) {
      sql += formatSql`
EXEC sys.sp_addextendedproperty ${COMMENT_EXTEND_PROPERTY_NAME}, ${comment}, 'SCHEMA', @Schema, 'VIEW', @View`;
    }
    return SQL.raw(sql);
  }

  setColumnComment(
    table: CompatiableObjectName,
    name: string,
    comment: string | null
  ): Statement {
    let sql = formatSql`
-- MigrateBuilder.setColumnComment(${this.sqlUtil.sqlifyObjectName(
      table
    )}, ${name}, ${comment});
DECLARE @Schema VARCHAR(100), @Table VARCHAR(100), @ObjectId INT, @Column VARCHAR(100)

SET @Column = ${name}

SELECT @ObjectId = o.object_id, @Schema = s.name, @Table = o.name
FROM sys.objects o JOIN sys.schemas s ON o.schema_id = s.schema_id
WHERE o.object_id = object_id(${this.sqlUtil.sqlifyObjectName(table)})

IF EXISTS(SELECT 1
  FROM sys.extended_properties p INNER JOIN
  sys.columns c ON p.major_id = c.object_id AND p.minor_id = c.column_id
  WHERE c.object_id = @ObjectId AND c.name = @Column AND p.class = 1)
BEGIN
  EXEC sys.sp_dropextendedproperty ${COMMENT_EXTEND_PROPERTY_NAME}, 'SCHEMA', @Schema, 'TABLE', @Table, 'COLUMN', @Column
END
`;

    if (comment) {
      sql += formatSql`
EXEC sys.sp_addextendedproperty ${COMMENT_EXTEND_PROPERTY_NAME}, ${comment}, 'SCHEMA', @Schema, 'TABLE', @Table, 'COLUMN', @Column`;
    }
    return SQL.raw(sql);
  }

  setIndexComment(
    table: CompatiableObjectName,
    name: string,
    comment: string | null
  ): Statement {
    let sql = formatSql`
-- MigrateBuilder.setIndexComment(${this.sqlUtil.sqlifyObjectName(
      table
    )}, ${name}, ${comment});
DECLARE @Schema VARCHAR(100), @Table VARCHAR(100), @ObjectId INT, @Index VARCHAR(100)

SET @Index = ${name}

SELECT @ObjectId = o.object_id, @Schema = s.name, @Table = o.name
FROM sys.objects o JOIN sys.schemas s ON o.schema_id = s.schema_id
WHERE o.object_id = object_id(${this.sqlUtil.sqlifyObjectName(table)})

IF EXISTS(SELECT 1
  FROM sys.extended_properties p INNER JOIN
  sys.indexes i ON p.major_id = i.object_id AND p.minor_id = i.index_id
  WHERE c.object_id = @ObjectId AND i.name = @Index AND p.class = 1)
BEGIN
  EXEC sys.sp_dropextendedproperty ${COMMENT_EXTEND_PROPERTY_NAME}, 'SCHEMA', @Schema, 'TABLE', @Table, 'INDEX', @Index
END
`;

    if (comment) {
      sql += formatSql`
EXEC sys.sp_addextendedproperty ${COMMENT_EXTEND_PROPERTY_NAME}, ${comment}, 'SCHEMA', @Schema, 'TABLE', @Table, 'INDEX', ${name}`;
    }
    return SQL.raw(sql);
  }

  setConstraintComment(
    table: CompatiableObjectName<string>,
    name: string,
    comment: string | null
  ): Statement {
    let sql = formatSql`
-- MigrateBuilder.setConstraintComment(${this.sqlUtil.sqlifyObjectName(
      table
    )}, ${name}, ${comment});
DECLARE @Schema VARCHAR(100), @Table VARCHAR(100), @ObjectId INT, @Constraint VARCHAR(100)

SET @Constraint = ${name}

SELECT @ObjectId = o.object_id, @Schema = s.name, @Table = o.name
FROM sys.objects o JOIN sys.schemas s ON o.schema_id = s.schema_id
WHERE o.object_id = object_id(${this.sqlUtil.sqlifyObjectName(table)})

IF EXISTS(
  SELECT 1
  FROM sys.extended_properties p INNER JOIN
  sys.check_constraints c ON p.major_id = c.object_id AND p.minor_id = 0
  WHERE c.parent_object_id = @ObjectId AND c.name = @Constraint AND p.class = 1
  UNION ALL
  SELECT 1
  FROM sys.extended_properties p INNER JOIN
  sys.default_constraints c ON p.major_id = c.object_id AND p.minor_id = 0
  WHERE c.parent_object_id = @ObjectId AND c.name = @Constraint AND p.class = 1
  UNION ALL
  SELECT 1
  FROM sys.extended_properties p INNER JOIN
  sys.key_constraints c ON p.major_id = c.object_id AND p.minor_id = 0
  WHERE c.parent_object_id = @ObjectId AND c.name = @Constraint AND p.class = 1
  UNION ALL
  SELECT 1
  FROM sys.extended_properties p INNER JOIN
  sys.foreign_keys c ON p.major_id = c.object_id AND p.minor_id = 0
  WHERE c.parent_object_id = @ObjectId AND c.name = @Constraint AND p.class = 1
)
BEGIN
  EXEC sys.sp_dropextendedproperty ${COMMENT_EXTEND_PROPERTY_NAME}, 'SCHEMA', @Schema, 'TABLE', @Table, 'CONSTRAINT', @Constraint
END
`;

    if (comment) {
      sql += formatSql`
EXEC sys.sp_addextendedproperty ${COMMENT_EXTEND_PROPERTY_NAME}, ${comment}, 'SCHEMA', @Schema, 'TABLE', @Table, 'CONSTRAINT', @Constraint;
`;
    }
    return SQL.raw(sql);
  }

  setSchemaComment(name: string, comment: string | null): Statement {
    let sql = formatSql`
-- MigrateBuilder.setSchemaComment(${this.sqlUtil.sqlifyObjectName(
      name
    )}, ${comment});
IF EXISTS(
  SELECT 1 FROM sys.extended_properties p
  WHERE p.name = ${COMMENT_EXTEND_PROPERTY_NAME} AND p.major_id = SCHEMA_ID(${name}) AND p.class = 7 AND p.minor_id = 0
)
BEGIN
  EXEC sp_dropextendedproperty ${COMMENT_EXTEND_PROPERTY_NAME}, 'SCHEMA', ${name};
END
`;
    if (comment) {
      sql += formatSql`
EXEC sp_addextendedproperty ${COMMENT_EXTEND_PROPERTY_NAME}, ${comment}, 'SCHEMA', ${name};`;
    }
    return SQL.raw(sql);
  }

  renameTable(name: CompatiableObjectName, newName: string): Statement {
    return sp_rename(this.sqlUtil.sqlifyObjectName(name), newName);
  }

  renameColumn(
    table: CompatiableObjectName,
    name: string,
    newName: string
  ): Statement {
    return sp_rename(
      this.sqlUtil.sqlifyObjectName(table) + '.' + this.sqlUtil.quoted(name),
      newName,
      'COLUMN'
    );
  }

  renameView(name: CompatiableObjectName, newName: string): Statement {
    return sp_rename(this.sqlUtil.sqlifyObjectName(name), newName);
  }

  renameIndex(
    table: CompatiableObjectName,
    name: string,
    newName: string
  ): Statement {
    return sp_rename(
      this.sqlUtil.sqlifyObjectName(table) + '.' + this.sqlUtil.quoted(name),
      newName,
      'INDEX'
    );
  }

  renameProcedure(name: CompatiableObjectName, newName: string): Statement {
    return sp_rename(this.sqlUtil.sqlifyObjectName(name), newName);
  }

  renameFunction(name: CompatiableObjectName, newName: string): Statement {
    return sp_rename(this.sqlUtil.sqlifyObjectName(name), newName);
  }
}
