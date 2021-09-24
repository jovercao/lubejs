import { MigrateScripter } from './migrate-scripter';
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
} from '../orm/schema';
import { CompatiableObjectName, DbType, SqlUtil } from '../core';

// export class MigrateProgrammer {
//   constructor(private sqlUtil: SqlUtil, private builderName: string) {

//   }

//   private _codes: string[] = [];

//   coding(...statements: Statement[]) {
//     for (const statement of statements as AllStatement[]) {
//       switch (statement.$kind) {
//         case STATEMENT_KIND.CREATE_DATABASE:
//           this.createDatabase(statement);
//           break;
//         case STATEMENT_KIND.ALTER_DATABASE:
//           this.alterDatabase(statement);
//           break;
//         case STATEMENT_KIND.DROP_DATABASE:
//           this.dropDatabase(statement);
//           break;
//         case STATEMENT_KIND.CREATE_TABLE:
//           this.createTable(statement);
//           break;
//         case STATEMENT_KIND.ALTER_TABLE:
//           this.alterTable(statement);
//           break;
//         case STATEMENT_KIND.DROP_TABLE:
//           const index = this.database?.tables.findIndex(p =>
//             isSameObject(p.name, statement.$name)
//           );
//           if (index === undefined || index < 0) {
//             throw new Error(
//               `Table ${this.sqlUtil.sqlifyObjectName(statement.$name)} not found.`
//             );
//           }
//           this.database!.tables.splice(index, 1);
//           break;
//         case STATEMENT_KIND.CREATE_VIEW: {
//           this.assertViewNotExists(statement.$name);
//           assertAst(statement.$body, 'CreateView body not found.');
//           const objName = this.sqlUtil.parseObjectName(statement.$name);
//           this.database!.views.push({
//             name: objName.name,
//             schema: objName.schema ?? this.defaultSchema,
//             scripts: this.sqlUtil.sqlify(statement.$body).sql,
//           });
//           break;
//         }
//         case STATEMENT_KIND.ALTER_VIEW: {
//           const view = this.getView(statement.$name);
//           assertAst(statement.$body, 'AlterView body not found.');
//           view.scripts = this.sqlUtil.sqlify(statement.$body).sql;
//           break;
//         }
//         case STATEMENT_KIND.DROP_VIEW: {
//           const index = this.database?.views.findIndex(p =>
//             isSameObject(p.name, statement.$name)
//           );
//           if (index === undefined || index < 0) {
//             throw new Error(
//               `View ${this.sqlUtil.sqlifyObjectName(statement.$name)} not found.`
//             );
//           }
//           this.database!.views.splice(index, 1);
//           break;
//         }
//         case STATEMENT_KIND.CREATE_PROCEDURE: {
//           this.assertProcedureNotExists(statement.$name);
//           const objName = this.sqlUtil.parseObjectName(statement.$name);
//           this.database!.procedures.push({
//             name: objName.name,
//             schema: objName.schema ?? this.defaultSchema,
//             scripts: this.sqlUtil.sqlify(statement).sql,
//           });
//           break;
//         }
//         case STATEMENT_KIND.ALTER_PROCEDURE: {
//           const procedure = this.getProcedure(statement.$name);
//           procedure.scripts = this.sqlUtil.sqlify(statement).sql;
//           break;
//         }
//         case STATEMENT_KIND.DROP_PROCEDURE: {
//           const index = this.database?.procedures.findIndex(p =>
//             isSameObject(p.name, statement.$name)
//           );
//           if (index === undefined || index < 0) {
//             throw new Error(
//               `Procedure ${this.sqlUtil.sqlifyObjectName(statement.$name)} not found.`
//             );
//           }
//           this.database!.procedures.splice(index, 1);
//         }
//         case STATEMENT_KIND.CREATE_FUNCTION: {
//           this.assertFunctionNotExists(statement.$name);
//           const objName = this.sqlUtil.parseObjectName(statement.$name);
//           this.database!.functions.push({
//             name: objName.name,
//             schema: objName.schema ?? this.defaultSchema,
//             scripts: this.sqlUtil.sqlify(statement).sql,
//           });
//           break;
//         }
//         case STATEMENT_KIND.ALTER_FUNCTION: {
//           const fn = this.getFunction(statement.$name);
//           fn.scripts = this.sqlUtil.sqlify(statement).sql;
//           break;
//         }
//         case STATEMENT_KIND.DROP_FUNCTION: {
//           const index = this.database?.functions.findIndex(p =>
//             isSameObject(p.name, statement.$name)
//           );
//           if (index === undefined || index < 0) {
//             throw new Error(
//               `Function ${this.sqlUtil.sqlifyObjectName(statement.$name)} not found.`
//             );
//           }
//           this.database!.functions.splice(index, 1);
//           break;
//         }
//         case STATEMENT_KIND.CREATE_SEQUENCE: {
//           this.assertSequenceNotExists(statement.$name);
//           assertAst(statement.$dbType, 'CreateSequence dbtype not found.');
//           const objName = this.sqlUtil.parseObjectName(statement.$name);
//           this.database!.sequences.push({
//             name: objName.name,
//             schema: objName.schema ?? this.defaultSchema,
//             type: this.sqlUtil.sqlifyType(statement.$dbType),
//             startValue: statement.$startValue.$value,
//             increment: statement.$increment.$value,
//           });
//           break;
//         }
//         case STATEMENT_KIND.DROP_SEQUENCE: {
//           const index = this.database?.sequences.findIndex(p =>
//             isSameObject(p.name, statement.$name)
//           );
//           if (index === undefined || index < 0) {
//             throw new Error(
//               `Sequence ${this.sqlUtil.sqlifyObjectName(statement.$name)} not found.`
//             );
//           }
//           this.database!.sequences.splice(index, 1);
//           break;
//         }
//         case STATEMENT_KIND.CREATE_INDEX: {
//           assertAst(statement.$table, 'Create Index table declare not found.');
//           assertAst(statement.$name, 'Create Index name not declared.');
//           assertAst(
//             statement.$columns,
//             'Create Index columns declare not found.'
//           );
//           this.assertIndexNotExists(statement.$table, statement.$name);
//           const table = this.getTable(statement.$table);
//           table.indexes.push({
//             name: statement.$name,
//             columns: statement.$columns.map(c => ({
//               name: c.name,
//               isAscending: c.sort === 'ASC',
//             })),
//             isUnique: statement.$unique,
//             isClustered: statement.$clustered,
//           });
//           break;
//         }
//         case STATEMENT_KIND.DROP_INDEX: {
//           const table = this.getTable(statement.$table);
//           const index = table.indexes.findIndex(
//             i => i.name === statement.$name
//           );
//           if (index === undefined || index < 0) {
//             throw new Error(`Index ${statement.$name} not found.`);
//           }
//           table.indexes.splice(index, 1);
//           break;
//         }
//         case STATEMENT_KIND.STANDARD_STATEMENT:
//           switch (statement.$name) {
//             case 'renameDatabase': {
//               this.assertDatabaseExists(this.database);
//               if (this.database.name !== statement.$datas[0]) {
//                 continue;
//               }
//               this.database.name = statement.$datas[1];
//               break;
//             }
//             case 'renameTable': {
//               const table = this.getTable(statement.$datas[0]);
//               table.name = statement.$datas[1];
//               break;
//             }
//             case 'renameColumn': {
//               const [tableName, columnName] = statement.$datas;
//               const column = this.getColumn(tableName, columnName);
//               column.name = statement.$datas[2];
//               break;
//             }
//             case 'renameView': {
//               const view = this.findView(statement.$datas[0]);
//               if (!view) {
//                 throw new Error(
//                   `View ${this.sqlUtil.sqlifyObjectName(
//                     statement.$datas[0]
//                   )} is not found.`
//                 );
//               }
//               view.name = statement.$datas[1];
//               break;
//             }
//             case 'renameProcedure': {
//               const proc = this.database?.procedures.find(p =>
//                 isSameObject(p.name, statement.$datas[0])
//               );
//               if (!proc) {
//                 throw new Error(
//                   `Procedure ${this.sqlUtil.sqlifyObjectName(
//                     statement.$datas[0]
//                   )} is not found.`
//                 );
//               }
//               proc.name = statement.$datas[1];
//               break;
//             }
//             case 'renameFunction': {
//               const func = this.database?.functions.find(p =>
//                 isSameObject(p.name, statement.$datas[0])
//               );
//               if (!func) {
//                 throw new Error(
//                   `Function ${this.sqlUtil.sqlifyObjectName(
//                     statement.$datas[0]
//                   )} is not found.`
//                 );
//               }
//               func.name = statement.$datas[1];
//               break;
//             }
//             case 'renameSequence': {
//               const sequence = this.database?.sequences.find(p =>
//                 isSameObject(p.name, statement.$datas[0])
//               );
//               if (!sequence) {
//                 throw new Error(
//                   `Function ${this.sqlUtil.sqlifyObjectName(
//                     statement.$datas[0]
//                   )} is not found.`
//                 );
//               }
//               sequence.name = statement.$datas[1];
//               break;
//             }
//             case 'setAutoFlag': {
//               const [tableName, columnName] = statement.$datas;
//               const column = this.getColumn(tableName, columnName);
//               column.isRowflag = true;
//               break;
//             }
//             case 'dropAutoFlag': {
//               const [tableName, columnName] = statement.$datas;
//               const column = this.getColumn(tableName, columnName);
//               column.isRowflag = false;
//               break;
//             }
//             case 'setIdentity': {
//               const [tableName, columnName, start, incerment] =
//                 statement.$datas;
//               const column = this.getColumn(tableName, columnName);
//               column.isIdentity = true;
//               column.identityStartValue = start;
//               column.identityIncrement = incerment;
//               break;
//             }
//             case 'dropIdentity': {
//               const [tableName, columnName] = statement.$datas;
//               const column = this.getColumn(tableName, columnName);
//               column.identityIncrement = undefined;
//               column.identityStartValue = undefined;
//               column.isIdentity = false;
//               break;
//             }
//             case 'setDefaultValue': {
//               const [tableName, columnName, defaultValue] = statement.$datas;
//               const column = this.getColumn(tableName, columnName);
//               column.defaultValue = defaultValue;
//               break;
//             }
//             case 'dropDefaultValue': {
//               const [tableName, columnName] = statement.$datas;
//               const column = this.getColumn(tableName, columnName);
//               column.defaultValue = undefined;
//               break;
//             }
//             case 'setTableComment': {
//               const [tableName, comment] = statement.$datas;
//               const table = this.getTable(tableName);
//               table.comment = comment;
//               break;
//             }
//             case 'setViewComment': {
//               const [viewName, comment] = statement.$datas;
//               const view = this.getView(viewName);
//               view.comment = comment;
//               break;
//             }
//             case 'setColumnComment': {
//               const [tableName, columnName, comment] = statement.$datas;
//               const column = this.getColumn(tableName, columnName);
//               column.comment = comment;
//               break;
//             }
//             case 'setProcedureComment': {
//               const [procName, comment] = statement.$datas;
//               const proc = this.getProcedure(procName);
//               proc.comment = comment;
//               break;
//             }
//             case 'setFunctionComment': {
//               const [funcName, comment] = statement.$datas;
//               const func = this.getFunction(funcName);
//               func.comment = comment;
//               break;
//             }
//             case 'setSequenceComment': {
//               const [squName, comment] = statement.$datas;
//               const sequence = this.getSequence(squName);
//               sequence.comment = comment;
//               break;
//             }
//             case 'setIndexComment': {
//               const [tableName, indexName, comment] = statement.$datas;
//               const index = this.getIndex(tableName, indexName);
//               index.comment = comment;
//               break;
//             }
//             case 'setConstraintComment': {
//               const [tableName, constraintName, comment] = statement.$datas;
//               const constraint = this.getConstraint(tableName, constraintName);
//               constraint.comment = comment;
//               break;
//             }
//             case 'setSchemaComment': {
//               const [schemaName, comment] = statement.$datas;
//               const schema = this.getSchema(schemaName);
//               schema.comment = comment;
//               break;
//             }
//             case 'dropTableComment': {
//               const [tableName] = statement.$datas;
//               const table = this.getTable(tableName);
//               table.comment = undefined;
//               break;
//             }
//             case 'dropViewComment': {
//               const [viewName] = statement.$datas;
//               const view = this.getView(viewName);
//               view.comment = undefined;
//               break;
//             }
//             case 'dropProcedureComment': {
//               const [procName] = statement.$datas;
//               const proc = this.getProcedure(procName);
//               proc.comment = undefined;
//               break;
//             }
//             case 'dropFunctionComment': {
//               const [funcName] = statement.$datas;
//               const func = this.getFunction(funcName);
//               func.comment = undefined;
//               break;
//             }
//             case 'dropSequenceComment': {
//               const [squName] = statement.$datas;
//               const sequence = this.getSequence(squName);
//               sequence.comment = undefined;
//               break;
//             }
//             case 'dropIndexComment': {
//               const [tableName, indexName] = statement.$datas;
//               const index = this.getIndex(tableName, indexName);
//               index.comment = undefined;
//               break;
//             }
//             case 'dropConstraintComment': {
//               const [tableName, constraintName] = statement.$datas;
//               const constraint = this.getConstraint(tableName, constraintName);
//               constraint.comment = undefined;
//               break;
//             }
//             case 'dropSchemaComment': {
//               const [schemaName] = statement.$datas;
//               const schema = this.getSchema(schemaName);
//               schema.comment = undefined;
//               break;
//             }
//           }
//       }
//     }
//   }
//   createDatabase(statement: CreateDatabase): void {
//     let sql = `${this.builderName}.createDatabase(${this.objectName(statement.$name)})`;
//     if (statement.$collate) {
//       sql += `.collate(${statement.$collate})`;
//     }
//     this._codes.push(sql);
//   }

//   alterDatabase(statement: AlterDatabase): void {
//     this._codes.push(
//       `${this.builderName}.alterDatabase(${this.objectName(statement.$name)}).collate(${
//         statement.$collate
//       })`
//     );
//   }

//   dropDatabase(statement: DropDatabase): void {
//     this._codes.push(`${this.builderName}.dropDatabase(${this.objectName(statement.$name)})`);
//   }

//   private codingTableMember(member: AlterTableAddMember | CreateTableMember) {
//     if (isCreateTableColumn(member)) {
//       let sql = `${this.objectName(member.$name)} ${this.sqlifyType(
//         member.$dbType
//       )}`;
//       if (member.$nullable !== undefined) {
//         sql += member.$nullable ? ' NULL' : ' NOT NULL';
//       }
//       if (member.$identity) {
//         sql += ` IDENTITY(${member.$identity.startValue}, ${member.$identity.increment})`;
//       }
//       if (member.$primaryKey) {
//         sql += ' PRIMARY KEY';
//         if (member.$primaryKey.nonclustered) {
//           sql += ' NONCLUSTERED';
//         }
//       }
//       if (member.$calculate) {
//         sql += ` AS (${this.sqlifyExpression(member.$calculate)})`;
//       }
//       if (member.$default) {
//         sql += ` DEFAULT (${this.sqlifyExpression(member.$default)})`;
//       }
//       if (member.$check) {
//         sql += ` CHECK(${this.sqlifyCondition(member.$check)})`;
//       }
//       return sql;
//     }

//     if (isAlterTableColumn(member)) {
//     }
//     if (isPrimaryKey(member)) {
//       assertAst(member.$columns, 'Primary key columns not found.');
//       return (
//         (member.$name ? `CONSTRAINT ${this.quoted(member.$name)} ` : '') +
//         ` PRIMARY KEY(${member.$columns.map(
//           col => `${this.quoted(col.name)} ${col.sort}`
//         )})`
//       );
//     }

//     if (isUniqueKey(member)) {
//       assertAst(member.$columns, 'Unique key columns not found.');
//       return (
//         (member.$name ? `CONSTRAINT ${this.quoted(member.$name)} ` : '') +
//         `UNIQUE(${member.$columns.map(
//           col => `${this.quoted(col.name)} ${col.sort}`
//         )})`
//       );
//     }

//     if (isForeignKey(member)) {
//       assertAst(member.$columns, 'Foreign key columns not found.');
//       assertAst(
//         member.$referenceTable,
//         'Foreign key reference table not found.'
//       );
//       assertAst(
//         member.$referenceColumns,
//         'Foreign key reference columns not found.'
//       );
//       return (
//         (member.$name ? `CONSTRAINT ${this.quoted(member.$name)} ` : '') +
//         `FOREIGN KEY(${member.$columns.map(col =>
//           this.quoted(col)
//         )}) REFERENCES ${this.sqlifyObjectName(
//           member.$referenceTable
//         )}(${member.$referenceColumns.map(col => this.quoted(col)).join(', ')})`
//       );
//     }

//     if (isCheckConstraint(member)) {
//       return (
//         (member.$name ? `CONSTRAINT ${this.quoted(member.$name)} ` : '') +
//         `CHECK (${this.sqlifyCondition(member.$sql)})`
//       );
//     }
//   }

//   public sqlifyExpression(
//     expr: Expression<Scalar>,
//     params?: Set<Parameter<Scalar, string>>,
//     parent?: AST
//   ): string {
//     // 编译标准操作
//     if (isStandardExpression(expr)) {
//       return this.sqlifyExpression(
//         this.translationStandardOperation(expr),
//         params,
//         parent
//       );
//     }
//     if (isLiteral(expr)) {
//       return this.sqlifyLiteral(expr.$value);
//     }

//     if (isOperation(expr)) {
//       return this.sqlifyOperation(expr, params, parent);
//     }

//     if (isField(expr)) {
//       return this.sqlifyField(expr);
//     }

//     if (isGroupExpression(expr)) {
//       return this.sqlifyGroupExpression(expr, params);
//     }

//     if (isValuedSelect(expr)) {
//       return this.sqlifyValuedSelect(expr, params, parent);
//     }

//     if (isVariant(expr)) {
//       return this.sqlifyVariantName(expr.$name);
//     }

//     if (isParameter(expr)) {
//       return this.sqlifyParameter(expr, params!);
//     }

//     if (isScalarFuncInvoke(expr)) {
//       return this.sqlifyFuncInvoke(expr, params);
//     }

//     if (isCase(expr)) {
//       return this.sqlifyCase(expr, params, parent);
//     }
//     throw invalidAST('expression', expr);
//   }

//   createTable(statement: CreateTable) {
//     assertAst(
//       statement.$members,
//       'CreateTable statement name not found.'
//     );
//     let sql = `${this.builderName}.createTable(${this.objectName(statement.$name)})`
//     sql += statement.$members
//       .map(member => this.codingTableMember(member))
//       .join(',\n  ');
//     sql += ')';
//     return sql;
//   }

//   private objectName(objName: CompatiableObjectName): string {
//     if (typeof objName === 'string') {
//       return `"${objName}"`
//     }
//     const { name, schema } = objName;
//     return JSON.stringify({ name, schema })
//   }

//   private sqlifyType(type: DbType): string {
//     switch (type.name) {
//       case 'STRING':
//         return `VARCHAR(${type.length === DbType.MAX ? 'MAX' : type.length})`;
//       case 'INT8':
//         return 'TINYINT';
//       case 'INT16':
//         return 'SMALLINT';
//       case 'INT32':
//         return 'INT';
//       case 'INT64':
//         return 'BIGINT';
//       case 'BINARY':
//         return `VARBINARY(${type.length === 0 ? 'MAX' : type.length})`;
//       case 'BOOLEAN':
//         return 'BIT';
//       case 'DATE':
//         return 'DATE';
//       case 'DATETIME':
//         return 'DATETIME';
//       case 'FLOAT':
//         return 'REAL';
//       case 'DOUBLE':
//         return 'FLOAT(53)';
//       case 'DECIMAL':
//         return `DECIMAL(${type.precision}, ${type.digit})`;
//       case 'UUID':
//         return 'UNIQUEIDENTIFIER';
//       case 'OBJECT':
//       case 'ARRAY':
//         return 'NVARCHAR(MAX)';
//       case 'ROWFLAG':
//         return 'BINARY(8)';
//       case 'DATETIMEOFFSET':
//         return 'DATETIMEOFFSET(7)';
//       default:
//         throw new Error(`Unsupport data type ${type['name']}`);
//     }
//   }

//   clear() {
//     this._codes = [];
//   }

//   getCodes(): string[] {
//     return this._codes;
//   }
// }

export class ProgramMigrateScripter extends MigrateScripter<string> {
  constructor(
    private sqlUtil: SqlUtil,
    private notResolverType: boolean = false
  ) {
    super();
  }

  annotation(note: string): void {
    this.middleCodes.push(`builder.annotation(${JSON.stringify(note)})`);
  }

  alterDatabase(database: DatabaseSchema): void {
    this.beforeCodes.push(
      `builder.alterDatabase(${JSON.stringify(database.name)}).collate(${
        database.collate
      })`
    );
  }
  commentColumn(
    table: CompatiableObjectName<string>,
    name: string,
    comment?: string
  ): void {
    this.comment('Column', table, name, comment);
  }
  commentTable(table: CompatiableObjectName<string>, comment?: string): void {
    this.comment('Table', table, comment);
  }
  commentIndex(
    table: CompatiableObjectName<string>,
    name: string,
    comment?: string
  ): void {
    this.comment('Index', table, name, comment);
  }
  commentConstraint(
    table: CompatiableObjectName<string>,
    name: string,
    comment?: string
  ): void {
    this.comment('Constraint', table, name, comment);
  }
  commentForeignKey(
    table: CompatiableObjectName<string>,
    name: string,
    comment?: string
  ): void {
    this.comment('Constraint', table, name, comment);
  }

  private stringifyType(type: string): string {
    if (this.notResolverType) return `SQL.raw('${type}')`;
    const dbType = this.sqlUtil.parseRawType(type);
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

  private columnForAlter(
    column: ColumnSchema,
    prefix: string = 'builder.'
  ): string {
    let sql = `${prefix}column(${JSON.stringify(column.name)}, ${
      column.isRowflag ? 'DbType.rowflag' : this.stringifyType(column.type)
    })`;
    if (column.isNullable) {
      sql += '.null()';
    } else {
      sql += '.notNull()';
    }
    return sql;
  }

  private columnForAdd(
    column: ColumnSchema,
    prefix: string = 'builder.'
  ): string {
    let sql = this.columnForAlter(column, prefix);
    if (column.isIdentity)
      sql += `.identity(${column.identityStartValue}, ${column.identityIncrement})`;
    if (column.isCalculate) {
      sql += `.as(SQL.raw(${JSON.stringify(column.calculateExpression)}))`;
    }
    if (column.defaultValue) {
      sql += `.default(SQL.raw(${JSON.stringify(column.defaultValue)}))`;
    }
    return sql;
  }

  private keyColumns(columns: KeyColumnSchema[]): string {
    return (
      '{ ' +
      columns
        .map(
          ({ name, isAscending }) =>
            `${JSON.stringify(name)}: '${isAscending ? 'ASC' : 'DESC'}'`
        )
        .join(', ') +
      ' }'
    );
  }

  private primaryKey(key: PrimaryKeySchema): string {
    let sql = `builder.primaryKey(${
      key.name ? JSON.stringify(key.name) : ''
    }).on({ ${key.columns.map(
      ({ name, isAscending }) =>
        `${JSON.stringify(name)}: '${isAscending ? 'ASC' : 'DESC'}'`
    )} })`;
    if (key.isNonclustered) {
      sql += '.withNoclustered()';
    }
    return sql;
  }

  private foreignKey(fk: ForeignKeySchema): string {
    let code = `builder.foreignKey(${JSON.stringify(fk.name)}).on(${fk.columns
      .map(column => JSON.stringify(column))
      .join(', ')}).reference(${this.namify(
      fk.referenceTable
    )}, [${fk.referenceColumns
      .map(column => JSON.stringify(column))
      .join(', ')}])`;

    if (fk.isCascade) {
      code += 'deleteCascade()';
    }
    return code;
  }

  private constraint(cst: ConstraintSchema): void {
    if (cst.kind === 'CHECK') {
      return this.checkConstraint(cst);
    }
    this.uniqueConstraint(cst);
  }

  private checkConstraint(check: CheckConstraintSchema): void {
    this.middleCodes.push(
      `builder.check('${check.name}', SQL.raw(${check.sql}))`
    );
  }

  private uniqueConstraint(key: UniqueConstraintSchema): void {
    this.middleCodes.push(
      `builder.uniqueKey('${key.name}').on(${this.keyColumns(key.columns)})`
    );
  }

  createTable(table: TableSchema): void {
    const members: string[] = table.columns.map(col => this.columnForAdd(col));
    if (table.primaryKey) {
      members.push(this.primaryKey(table.primaryKey));
    }
    if (table.constraints?.length > 0) {
      table.constraints.map(cst => this.constraint(cst));
    }
    const sql = `builder.createTable(${this.namify(
      table
    )}).body(builder => [\n      ${members.join(`,\n      `)}\n    ])`;
    this.middleCodes.push(sql);
    // if (table.foreignKeys?.length > 0) {
    //   table.foreignKeys.map(fk => this.addForeignKey(table, fk));
    // }
    // for (const index of table.indexes) {
    //   this.createIndex(table, index);
    // }

    // if (table.comment) {
    //   this.comment('Table', table, table.comment);
    // }

    // for (const column of table.columns) {
    //   if (column.isRowflag) {
    //     this.setAutoFlag(table, column.name);
    //   }
    //   if (column.comment) {
    //     this.comment('Column', table, column.name, column.comment);
    //   }
    // }

    // for (const cst of table.constraints || []) {
    //   if (cst.comment) {
    //     this.comment('Constraint', table, cst.name, cst.comment);
    //   }
    // }

    // for (const index of table.indexes || []) {
    //   if (index.comment) {
    //     this.comment('Index', table, index.name, index.comment);
    //   }
    // }
    // if (table.seedData?.length) {
    //   this.insertSeedData(table, table.seedData);
    // }
  }

  // alterTableAndAll(tableChanges: ObjectDifference<TableSchema>): void {
  //   const target = tableChanges.target!;
  //   // PRIMARY KEY
  //   if (tableChanges.changes?.primaryKey) {
  //     if (tableChanges.changes.primaryKey.added) {
  //       this.addPrimaryKey(target, tableChanges.changes.primaryKey.added);
  //     }

  //     if (tableChanges.changes.primaryKey.removed) {
  //       this.dropPrimaryKey(
  //         target,
  //         tableChanges.changes.primaryKey.removed.name
  //       );
  //     }

  //     if (tableChanges.changes?.primaryKey.changes) {
  //       if (
  //         !(
  //           tableChanges.changes?.primaryKey.changes.comment &&
  //           Object.keys(tableChanges.changes?.primaryKey.changes).length === 1
  //         )
  //       ) {
  //         this.dropPrimaryKey(
  //           target,
  //           tableChanges.changes.primaryKey.target!.name
  //         );
  //         this.addPrimaryKey(target, tableChanges.changes.primaryKey.source!);
  //       }

  //       if (tableChanges.changes?.primaryKey.changes.comment) {
  //         this.comment(
  //           'Constraint',
  //           target,
  //           tableChanges.changes.primaryKey.source!.name,
  //           tableChanges.changes.primaryKey.source!.comment
  //         );
  //       }
  //     }
  //   }

  //   // COLUMNS
  //   if (tableChanges.changes?.columns) {
  //     for (const col of tableChanges.changes.columns.removeds || []) {
  //       // const fk = findTargetForeignKey(({ table, foreignKey }) => isNameEquals(tableName, name))
  //       this.dropColumn(target, col.name);
  //     }
  //     for (const column of tableChanges.changes.columns.addeds || []) {
  //       this.addColumn(target, column);
  //       if (column.isRowflag) {
  //         this.setAutoFlag(target, column.name);
  //       }
  //       if (column.comment) {
  //         this.comment('Column', target, column.name, column.comment);
  //       }
  //     }

  //     for (const { target, source, changes } of tableChanges.changes.columns
  //       .changes || []) {
  //       if (!changes) continue;
  //       // 如果类型或者是否可空变化
  //       if (changes.type || changes.isNullable) {
  //         this.alterColumn(target!, source!);
  //       }
  //       if (changes.isRowflag) {
  //         if (source!.isRowflag) {
  //           this.setAutoFlag(target!, source!.name);
  //         } else {
  //           this.dropAutoFlag(target!, source!.name);
  //         }
  //       }
  //       if (changes.defaultValue) {
  //         if (!changes.defaultValue.source) {
  //           this.dropDefaultValue(target!, target!.name);
  //         } else {
  //           this.setDefaultValue(
  //             target!,
  //             source!.name,
  //             changes.defaultValue.source
  //           );
  //         }
  //       }

  //       if (
  //         changes.isIdentity ||
  //         changes.identityIncrement ||
  //         changes.identityIncrement
  //       ) {
  //         if (!source!.isIdentity) {
  //           this.middleCodes.push(
  //             '// 敬告：因为需要重建表，在mssql中尚未实现该功能。'
  //           );
  //           this.dropIdentity(target!, target!.name);
  //         } else {
  //           this.middleCodes.push(
  //             '// 敬告：因为需要重建表，在mssql中尚未实现该功能。'
  //           );

  //           this.setIdentity(
  //             target!,
  //             source!.name,
  //             source!.identityStartValue!,
  //             source!.identityIncrement!
  //           );
  //         }
  //       }

  //       if (changes.comment) {
  //         this.comment('Column', target!, source!.name, changes.comment.source);
  //       }
  //     }
  //   }

  //   // FOREIGN KEY
  //   if (tableChanges.changes?.foreignKeys) {
  //     for (const fk of tableChanges.changes?.foreignKeys?.addeds || []) {
  //       this.addForeignKey(target, fk);
  //       if (fk.comment) {
  //         this.comment('Constraint', target, fk.name, fk.comment);
  //       }
  //     }

  //     for (const { name } of tableChanges.changes?.foreignKeys?.removeds ||
  //       []) {
  //       this.dropForeignKey(target, name);
  //     }

  //     for (const { source, target, changes } of tableChanges.changes
  //       ?.foreignKeys?.changes || []) {
  //       this.dropForeignKey(target!, target!.name);
  //       this.addForeignKey(target!, source!);
  //       if (changes?.comment) {
  //         this.comment(
  //           'Constraint',
  //           target!,
  //           target!.name,
  //           changes.comment.source
  //         );
  //       }
  //     }
  //   }

  //   // CONSTRAINT
  //   if (tableChanges.changes?.constraints) {
  //     for (const constraint of tableChanges.changes.constraints.addeds || []) {
  //       this.addConstraint(target, constraint);

  //       if (constraint.comment) {
  //         this.comment(
  //           'Constraint',
  //           target,
  //           constraint.name,
  //           constraint.comment
  //         );
  //       }
  //     }

  //     for (const constraint of tableChanges.changes.constraints.removeds ||
  //       []) {
  //       this.dropConstraint(target, constraint);
  //     }

  //     for (const { source, target, changes } of tableChanges.changes.constraints
  //       .changes || []) {
  //       this.dropConstraint(target!, target!);
  //       this.addConstraint(target!, source!);
  //       if (changes?.comment) {
  //         this.comment(
  //           'Constraint',
  //           target!,
  //           target!.name,
  //           changes.comment.source
  //         );
  //       }
  //     }
  //   }

  //   // INDEXES
  //   if (tableChanges.changes?.indexes) {
  //     for (const index of tableChanges.changes.indexes.addeds || []) {
  //       this.createIndex(target, index);
  //       if (index.comment) {
  //         this.comment('Index', target, index.name, index.comment);
  //       }
  //     }

  //     for (const index of tableChanges.changes.indexes.removeds || []) {
  //       this.dropIndex(target, index.name);
  //     }

  //     for (const { source, target, changes } of tableChanges.changes.indexes
  //       .changes || []) {
  //       this.dropIndex(target!, target!.name);
  //       this.createIndex(target!, source!);
  //       if (changes?.comment) {
  //         this.comment('Index', target!, source!.name, changes.comment.source);
  //       }
  //     }
  //   }

  //   if (tableChanges.changes?.comment) {
  //     this.comment('Table', target, tableChanges.changes.comment.source);
  //   }
  // }

  namify(objName: CompatiableObjectName): string {
    const nameobj = this.sqlUtil.parseObjectName(objName);
    if (!nameobj.schema) {
      return JSON.stringify(nameobj.name);
    }
    const { name, schema } = nameobj;
    return JSON.stringify({ name, schema });
  }

  dropPrimaryKey(table: CompatiableObjectName<string>, name: string) {
    this.middleCodes.push(
      `builder.alterTable(${this.namify(
        table
      )}).drop(builder => builder.primaryKey(${JSON.stringify(name)}))`
    );
  }

  dropTable(table: TableSchema): void {
    // 删除表之前本表外键，以免多表删除时造成依赖问题
    table.foreignKeys.forEach(fk => {
      this.dropForeignKey(table, fk.name);
    });
    this.middleCodes.push(`builder.dropTable(${this.namify(table)})`);
  }

  dropColumn(table: CompatiableObjectName, column: string): void {
    this.middleCodes.push(
      `builder.alterTable(${this.namify(
        table
      )}).drop(builder => builder.column(${JSON.stringify(column)}))`
    );
  }

  setAutoRowflag(table: CompatiableObjectName<string>, column: string): void {
    this.middleCodes.push(
      `builder.setAutoRowflag(${this.namify(table)}, ${JSON.stringify(column)})`
    );
  }

  dropAutoRowflag(table: CompatiableObjectName<string>, column: string): void {
    this.middleCodes.push(
      `builder.dropAutoRowflag(${this.namify(table)}, ${JSON.stringify(
        column
      )})`
    );
  }

  dropConstraint(
    table: CompatiableObjectName,
    constraint: ConstraintSchema
  ): void {
    this.middleCodes.push(
      `builder.alterTable(${this.namify(table)}).drop(builder => builder.${
        {
          CHECK: 'check',
          UNIQUE: 'uniqueKey',
          PRIMARY_KEY: 'primaryKey',
        }[constraint.kind]
      }(${JSON.stringify(constraint.name)}))`
    );
  }

  // function genCreateIndex(table: CompatiableObjectName, index: IndexSchema): string {
  //   return `builder.createIndex(${genName(index.name)}).on(${genName(
  //     table
  //   )}, ${genKeyColumns(index.columns)})`;
  // }

  addColumn(table: CompatiableObjectName, column: ColumnSchema): void {
    this.middleCodes.push(
      `builder.alterTable(${this.namify(
        table
      )}).add(builder => ${this.columnForAdd(column)})`
    );
  }

  alterColumn(table: CompatiableObjectName, column: ColumnSchema): void {
    this.middleCodes.push(
      `builder.alterTable(${this.namify(
        table
      )}).alterColumn(column => ${this.columnForAlter(column, '')})`
    );
  }

  setDefaultValue(
    table: CompatiableObjectName,
    column: string,
    defaultValue: string
  ): void {
    this.middleCodes.push(
      `builder.setDefaultValue(${this.namify(table)}, ${JSON.stringify(
        column
      )}, SQL.raw(${JSON.stringify(defaultValue)}))`
    );
  }

  dropDefaultValue(table: CompatiableObjectName, column: string): void {
    this.middleCodes.push(
      `builder.dropDefaultValue(${this.namify(table)}, ${JSON.stringify(
        column
      )})`
    );
  }

  setIdentity(
    table: CompatiableObjectName,
    column: string,
    startValue: number,
    increment: number
  ): void {
    this.middleCodes.push(
      `builder.setIdentity(${this.namify(table)}, ${JSON.stringify(
        column
      )}, ${startValue}, ${increment})`
    );
  }

  dropIdentity(table: CompatiableObjectName, column: string): void {
    this.middleCodes.push(
      `builder.dropIdentity(${this.namify(table)}, ${JSON.stringify(column)})`
    );
  }

  addForeignKey(table: CompatiableObjectName, fk: ForeignKeySchema): void {
    let sql = `builder.alterTable(${this.namify(
      table
    )}).add(builder => ${this.foreignKey(fk)})`;
    if (fk.isCascade) {
      sql += '.deleteCascade()';
    }
    this.afterCodes.push(sql);
  }

  dropForeignKey(table: CompatiableObjectName, name: string): void {
    this.beforeCodes.push(
      `builder.alterTable(${this.namify(
        table
      )}).drop(({ foreignKey }) => foreignKey(${JSON.stringify(name)}))`
    );
  }

  addConstraint(
    table: CompatiableObjectName,
    constaint: ConstraintSchema
  ): void {
    if (constaint.kind === 'CHECK') {
      this.middleCodes.push(
        `builder.alterTable(${this.namify(
          table
        )}).add(({ check }) => check(${JSON.stringify(
          constaint.name
        )}, SQL.raw(${constaint.sql}))`
      );
      return;
    }
    this.middleCodes.push(
      `builder.alterTable(${this.namify(
        table
      )}).add(({ uniqueKey }) => uniqueKey(${JSON.stringify(
        constaint.name
      )}).on(${this.keyColumns(constaint.columns)}))`
    );
  }

  addPrimaryKey(table: CompatiableObjectName, key: PrimaryKeySchema): void {
    this.middleCodes.push(
      `builder.alterTable(${this.namify(
        table
      )}).add(({ primaryKey }) => primaryKey(${JSON.stringify(
        key.name
      )}).on(${this.keyColumns(key.columns)}))`
    );
  }

  createSequence(sequence: SequenceSchema): void {
    this.middleCodes.push(
      `builder.createSequence(${JSON.stringify(
        sequence.name
      )}).as(${this.stringifyType(sequence.type)}).startsWith(${
        sequence.startValue
      }).incrementBy(${sequence.increment})`
    );
  }

  dropSequence(sequence: SequenceSchema): void {
    this.middleCodes.push(`builder.dropSequence(${this.namify(sequence)})`);
  }

  createIndex(table: CompatiableObjectName<string>, index: IndexSchema): void {
    let sql = `builder.createIndex(${JSON.stringify(
      index.name
    )}).on(${this.namify(table)}, ${this.keyColumns(index.columns)})`;
    if (index.isUnique) {
      sql += '.unique()';
    }

    if (index.isClustered) {
      sql += '.clustered()';
    }
    this.middleCodes.push(sql);
  }

  dropIndex(table: CompatiableObjectName<string>, name: string): void {
    this.middleCodes.push(
      `builder.dropIndex(${this.namify(table)}, ${JSON.stringify(name)})`
    );
  }

  comment(
    type: 'Table' | 'Procedure' | 'Function' | 'Schema',
    object: CompatiableObjectName<string>,
    comment?: string
  ): void;
  comment(
    type: 'Column' | 'Constraint' | 'Index',
    table: CompatiableObjectName<string>,
    member: string,
    comment?: string
  ): void;
  comment(
    type: string,
    object: CompatiableObjectName<string>,
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
      code = `builder.set${type}Comment(${this.namify(object)}${
        member ? `, ${JSON.stringify(member)}` : ''
      }, ${JSON.stringify(comment)})`;
    } else {
      code = `builder.drop${type}Comment(${this.namify(object)}${
        member ? `, ${JSON.stringify(member)}` : ''
      })`;
    }
    this.middleCodes.push(code);
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
    let sql = `builder.insert(${this.namify(table)}).values(${JSON.stringify(
      rows
    )})`;
    if (identityColumn) {
      sql += '.withIdentity()';
    }
    this.seedDataCodes.set(table, sql);
  }

  createDatabase(database: DatabaseSchema): void {
    let sql = `builder.createDatabase(${JSON.stringify(database.name)})`;
    if (database.collate) {
      sql += `.collate(${database.collate})`;
    }
    this.beforeCodes.push(sql);
  }

  useDatabase(name: string): void {
    this.beforeCodes.push(`builder.use(${JSON.stringify(name)})`);
  }

  dropDatabase(name: string): void {
    this.middleCodes.push(`builder.dropDatabase(${JSON.stringify(name)})`);
  }
}
