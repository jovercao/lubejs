import {
  MigrateBuilder,
  Name,
  Statement,
  SqlBuilder as SQL,
  CompatibleExpression,
  Scalar,
  Condition,
  SqlUtil,
  Lube,
  Expression,
  DbType,
  joinName,
  CreateDatabase,
  DropDatabase,
  AlterDatabase,
} from 'lubejs';
import { sp_rename } from './build-in';
import { MssqlProvider } from './provider';
import { formatSql } from './util';

const COMMENT_EXTEND_PROPERTY_NAME = 'MS_Description';

export class MssqlMigrateBuilder extends MigrateBuilder {
  renameDatabase(name: string, newName: string): Statement {
    return SQL.raw(`
    USE master;
    ALTER DATABASE ${this.sqlUtil.sqlifyName(name)} SET SINGLE_USER WITH ROLLBACK IMMEDIAT
    ALTER DATABASE ${this.sqlUtil.sqlifyName(name)} MODIFY NAME = ${this.sqlUtil.sqlifyName(newName)} ;
    ALTER DATABASE ${this.sqlUtil.sqlifyName(newName)}  SET MULTI_USER`)
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
  dropSequenceComment(name: Name<string>): Statement {
    return this.setSequenceComment(name, null);
  }
  dropProcedureComment(name: Name<string>): Statement {
    return this.setProcedureComment(name, null);
  }
  dropFunctionComment(name: Name<string>): Statement {
    return this.setFunctionComment(name, null);
  }
  dropTableComment(name: Name<string>): Statement {
    return this.setTableComment(name, null);
  }
  dropColumnComment(table: Name<string>, name: string): Statement {
    return this.setColumnComment(table, name, null);
  }
  dropIndexComment(table: Name<string>, name: string): Statement {
    return this.setIndexComment(table, name, null);
  }
  dropConstraintComment(table: Name<string>, name: string): Statement {
    return this.setConstraintComment(table, name, null);
  }
  setAutoRowflag(table: Name<string>, column: string): Statement {
    return SQL.block(
      SQL.note(
        '=========================注意：MSSQL 自带标记列，仅通过修改类型来达成========================'
      ),
      SQL.alterTable(table).dropColumn(column),
      SQL.alterTable(table).add(({ column: c }) => c(column, DbType.raw('ROWVERSION'))),
      // SQL.alterTable(table).alterColumn(c =>
      //   c(column, DbType.raw('ROWVERSION'))
      // )
    );
  }
  dropAutoRowflag(table: Name<string>, column: string): Statement {
    const tempColumn = '__' + column;
    return SQL.block(
      SQL.note(
        '=========================MSSQL 自带标记列，仅通过修改类型来达成========================'
      ),
      SQL.alterTable(table).add(({ column: c }) => c(tempColumn, DbType.binary(8)).notNull()),
      SQL.update(table).set({
        [column]: SQL.field(column)
      }),
      SQL.alterTable(table).drop(({ column: c }) => c(column)),
      this.renameColumn(table, tempColumn, column)
    );
  }

  // existsTable(name: Name<string>): Expression<Scalar> {
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
    table: Name<string>,
    column: string,
    defaultValue: CompatibleExpression<Scalar>
  ): Statement {
    return SQL.raw(`
DECLARE @ConstaintName varchar(128);
SELECT @ConstaintName = dc.name
FROM sys.default_constraints dc
JOIN sys.columns c ON dc.parent_column_id = c.column_id and dc.parent_object_id = c.object_id
WHERE c.object_id = object_id('${this.sqlUtil.sqlifyName(
      table
    )}') AND c.name = ${this.sqlUtil.sqlifyLiteral(column)};
IF (@ConstaintName IS NOT NULL)
BEGIN
 EXEC ('ALTER TABLE ${this.sqlUtil.sqlifyName(
   table
 )} DROP CONSTRAINT ' + @ConstaintName)
END

ALTER TABLE ${this.sqlUtil.sqlifyName(
      table
    )} ADD DEFAULT (${defaultValue}) FOR ${this.sqlUtil.quoted(column)}
`);
  }

  dropDefaultValue(table: Name<string>, column: string): Statement {
    return SQL.raw(`
DECLARE @ConstaintName varchar(128);
SELECT @ConstaintName = dc.name
FROM sys.default_constraints dc
JOIN sys.columns c ON dc.parent_column_id = c.column_id AND dc.parent_object_id = c.object_id
WHERE c.object_id = object_id('${this.sqlUtil.sqlifyName(
      table
    )}') and c.name = ${this.sqlUtil.sqlifyLiteral(column)}
IF (@ConstaintName IS NOT NULL)
BEGIN
  EXEC ('ALTER TABLE ${this.sqlUtil.sqlifyName(
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
        `操作信息： setIdentity(table: ${this.sqlUtil.sqlifyName(
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
        `操作信息： dropIdentity(table: ${this.sqlUtil.sqlifyName(
          table
        )}, column: ${column})`
      ),
      SQL.raw(
        `RAISERROR ('警告: 由于mssql特性原因，dropIdentity操作需要重建表，暂不支持identity属性变更，请手动处理，带来不便敬请谅解。', 16, 1);`
      )
    );
  }

  setProcedureComment(name: Name, comment: string | null): Statement {
    let sql = formatSql`
-- MigrateBuilder.commentProcedure(${this.sqlUtil.sqlifyName(
      name
    )}, ${comment});
DECLARE @Schema VARCHAR(100), @Proc VARCHAR(100), @ObjectId INT

SELECT @ObjectId = o.object_id, @Schema = s.name, @Proc = o.name
FROM sys.objects o JOIN sys.schemas s ON o.schema_id = s.schema_id
WHERE o.object_id = object_id(${this.sqlUtil.sqlifyName(name)})

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

  setFunctionComment(name: Name, comment: string | null): Statement {
    let sql = formatSql`
-- MigrateBuilder.commentFunction(${this.sqlUtil.sqlifyName(name)}, ${comment});
DECLARE @Schema VARCHAR(100), @Func VARCHAR(100), @ObjectId INT

SELECT @ObjectId = o.object_id, @Schema = s.name, @Func = o.name
FROM sys.objects o JOIN sys.schemas s ON o.schema_id = s.schema_id
WHERE o.object_id = object_id(${this.sqlUtil.sqlifyName(name)})

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

  setSequenceComment(name: Name, comment: string | null): Statement {
    let sql = formatSql`
-- MigrateBuilder.commentSequence(${this.sqlUtil.sqlifyName(name)}, ${comment});
DECLARE @Schema VARCHAR(100), @Sequence VARCHAR(100), @ObjectId INT

SELECT @ObjectId = o.object_id, @Schema = s.name, @Sequence = o.name
FROM sys.objects o JOIN sys.schemas s ON o.schema_id = s.schema_id
WHERE o.object_id = object_id(${this.sqlUtil.sqlifyName(name)})

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

  setTableComment(name: Name, comment: string | null): Statement {
    let sql = formatSql`
-- MigrateBuilder.commentTable(${this.sqlUtil.sqlifyName(name)}, ${comment});
DECLARE @Schema VARCHAR(100), @Table VARCHAR(100), @ObjectId INT

SELECT @ObjectId = o.object_id, @Schema = s.name, @Table = o.name
FROM sys.objects o JOIN sys.schemas s ON o.schema_id = s.schema_id
WHERE o.object_id = object_id(${this.sqlUtil.sqlifyName(name)})

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

  setColumnComment(table: Name, name: string, comment: string | null): Statement {
    let sql = formatSql`
-- MigrateBuilder.commentColumn(${this.sqlUtil.sqlifyName(
      table
    )}, ${name}, ${comment});
DECLARE @Schema VARCHAR(100), @Table VARCHAR(100), @ObjectId INT, @Column VARCHAR(100)

SET @Column = ${name}

SELECT @ObjectId = o.object_id, @Schema = s.name, @Table = o.name
FROM sys.objects o JOIN sys.schemas s ON o.schema_id = s.schema_id
WHERE o.object_id = object_id(${this.sqlUtil.sqlifyName(table)})

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

  setIndexComment(table: Name, name: string, comment: string | null): Statement {
    let sql = formatSql`
-- MigrateBuilder.commentIndex(${this.sqlUtil.sqlifyName(
      table
    )}, ${name}, ${comment});
DECLARE @Schema VARCHAR(100), @Table VARCHAR(100), @ObjectId INT, @Index VARCHAR(100)

SET @Index = ${name}

SELECT @ObjectId = o.object_id, @Schema = s.name, @Table = o.name
FROM sys.objects o JOIN sys.schemas s ON o.schema_id = s.schema_id
WHERE o.object_id = object_id(${this.sqlUtil.sqlifyName(table)})

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
    table: Name<string>,
    name: string,
    comment: string | null
  ): Statement {
    let sql = formatSql`
-- MigrateBuilder.commentConstraint(${this.sqlUtil.sqlifyName(
      table
    )}, ${name}, ${comment});
DECLARE @Schema VARCHAR(100), @Table VARCHAR(100), @ObjectId INT, @Constraint VARCHAR(100)

SET @Constraint = ${name}

SELECT @ObjectId = o.object_id, @Schema = s.name, @Table = o.name
FROM sys.objects o JOIN sys.schemas s ON o.schema_id = s.schema_id
WHERE o.object_id = object_id(${this.sqlUtil.sqlifyName(table)})

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
-- MigrateBuilder.commentConstraint(${this.sqlUtil.sqlifyName(
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

  renameTable(name: Name, newName: string): Statement {
    return sp_rename(this.sqlUtil.sqlifyName(name), newName);
  }

  renameColumn(table: Name, name: string, newName: string): Statement {
    return sp_rename(this.sqlUtil.sqlifyName(joinName(table, name)), newName, 'COLUMN');
  }

  renameView(name: Name, newName: string): Statement {
    return sp_rename(this.sqlUtil.sqlifyName(name), newName);
  }

  renameIndex(table: Name, name: string, newName: string): Statement {
    return sp_rename(this.sqlUtil.sqlifyName(joinName(table, name)), newName, 'INDEX');
  }

  renameProcedure(name: Name, newName: string): Statement {
    return sp_rename(this.sqlUtil.sqlifyName(name), newName);
  }

  renameFunction(name: Name, newName: string): Statement {
    return sp_rename(this.sqlUtil.sqlifyName(name), newName);
  }
}
