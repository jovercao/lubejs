import {
  SqlBuilder,
  DbType,
  LUBE_MIGRATE_TABLE_NAME,
  DbProvider,
  CheckConstraintSchema,
  ColumnSchema,
  DatabaseSchema,
  ForeignKeySchema,
  IndexSchema,
  PrimaryKeySchema,
  TableSchema,
  UniqueConstraintSchema,
  ViewSchema,
  ProcedureSchema,
  FunctionSchema,
  SequenceSchema,
  SchemaSchema,
  ISOLATION_LEVEL,
  Executor
} from 'lubejs';
import { database_principal_id, isNull, schema_name } from './build-in';
import { fullType } from './types';

const {
  case: $case,
  concat,
  execute,
  convert,
  select,
  table,
  unionAll,
  and,
} = SqlBuilder;

const excludeTables: string[] = [LUBE_MIGRATE_TABLE_NAME];

export async function loadDatabaseSchema(
  provider: DbProvider,
  dbName?: string
): Promise<DatabaseSchema | undefined> {

  /**
   * 获取 表格及视图
   */
  async function getTables() {
    const t = table({ name: 'tables', schema: 'sys' }).as('t');
    const p = table({ name: 'extended_properties', schema: 'sys' }).as('p');
    const s = table({ name: 'schemas', schema: 'sys' });
    const sql = select({
      id: t.object_id,
      name: t.name,
      schema: s.name,
      comment: p.value,
    })
      .from(t)
      .join(s, s.schema_id.eq(t.schema_id))
      .leftJoin(
        p,
        p.major_id
          .eq(t.object_id)
          .and(p.minor_id.eq(0))
          .and(p.class.eq(1))
          .and(p.name.eq('MS_Description'))
      )
      .where(t.name.notIn(...excludeTables));

    const tables: TableSchema[] = (await runner.query(sql)).rows as any;

    for (const table of tables) {
      const tableId = Reflect.get(table, 'id');
      Reflect.deleteProperty(table, 'id');
      table.columns = await getColumns(tableId);
      table.primaryKey = await getPrimaryKey(tableId);
      table.indexes = await getIndexes(tableId);
      table.constraints = [
        ...(await getCheckConstraints(tableId)),
        ...(await getUniqueConstraints(tableId)),
      ];
      table.foreignKeys = await getForeignKeys(tableId);
    }
    return tables;
  }

  async function getSchemas(): Promise<SchemaSchema[]> {
    const p = table({ name: 'extended_properties', schema: 'sys' }).as('p');
    const s = table({ name: 'schemas', schema: 'sys' });
    const sql = select({
      name: s.name,
      comment: p.value,
    })
      .from(s)
      .leftJoin(
        p,
        p.major_id
          .eq(s.schema_id)
          .and(p.class.eq(3))
          .and(p.minor_id.eq(0))
          .and(p.name.eq('MS_Description'))
      )
      .where(s.principal_id.eq(database_principal_id(dbName!)));
    const result = (await runner.query(sql)).rows;
    const schemas: SchemaSchema[] = result;
    return schemas;
  }

  async function getViews(): Promise<ViewSchema[]> {
    const v = table({ name: 'views', schema: 'sys' }).as('v');
    const p = table({ name: 'extended_properties', schema: 'sys' }).as('p');
    const s = table({ name: 'schemas', schema: 'sys' });
    const sql = select({
      id: v.object_id,
      name: v.name,
      schema: s.name,
      scripts: '',
      comment: p.value,
    })
      .from(v)
      .join(s, s.schema_id.eq(v.schema_id))
      .leftJoin(
        p,
        p.major_id
          .eq(v.object_id)
          .and(p.minor_id.eq(0))
          .and(p.class.eq(1))
          .and(p.name.eq('MS_Description'))
      )
      .where(v.name.notIn(...excludeTables));
    const result = (await runner.query(sql)).rows;
    const views: ViewSchema[] = result;

    for (const view of views) {
      view.scripts = await getCode(view.name);
    }
    return views;
  }

  async function getProcedures(): Promise<ProcedureSchema[]> {
    const proc = table({ name: 'procedures', schema: 'sys' }).as('proc');
    const p = table({ name: 'extended_properties', schema: 'sys' }).as('p');
    const s = table({ name: 'schemas', schema: 'sys' });
    const sql = select({
      id: proc.object_id,
      name: proc.name,
      schema: s.name,
      scripts: '',
      comment: p.value,
    })
      .from(proc)
      .join(s, s.schema_id.eq(proc.schema_id))
      .leftJoin(
        p,
        p.major_id
          .eq(proc.object_id)
          .and(p.minor_id.eq(0))
          .and(p.class.eq(1))
          .and(p.name.eq('MS_Description'))
      )
      .where(proc.name.notIn(...excludeTables));
    const result = (await runner.query(sql)).rows;
    const procedures: ProcedureSchema[] = result;

    for (const procedure of procedures) {
      procedure.scripts = await getCode(procedure.name);
    }
    return procedures;
  }

  async function getCode(objname: string): Promise<string> {
    const rows = (
      await runner.execute<number, [{ Text: string }]>('sp_helptext', [
        objname,
      ])
    ).rows;
    const key = Object.keys(rows[0])[0];
    const code = rows.map(row => Reflect.get(row, key)).join('\n');
    return code;
  }

  async function getFunctions(): Promise<FunctionSchema[]> {
    const fn = table({ name: 'objects', schema: 'sys' }).as('fn');
    const p = table({ name: 'extended_properties', schema: 'sys' }).as('p');
    const s = table({ name: 'schemas', schema: 'sys' });
    const sql = select({
      id: fn.object_id,
      name: fn.name,
      schema: s.name,
      scripts: '',
      comment: p.value,
    })
      .from(fn)
      .join(s, s.schema_id.eq(fn.schema_id))
      .leftJoin(
        p,
        p.major_id
          .eq(fn.object_id)
          .and(p.minor_id.eq(0))
          .and(p.class.eq(1))
          .and(p.name.eq('MS_Description'))
      )
      .where(fn.type.eq('FN'));
    const result = (await runner.query(sql)).rows;
    const functions: FunctionSchema[] = result;

    for (const funciton of functions) {
      funciton.scripts = await getCode(funciton.name);
    }
    return functions;
  }

  async function getSequences(): Promise<SequenceSchema[]> {
    const seq = table({ name: 'sequences', schema: 'sys' }).as('fn');
    const p = table({ name: 'extended_properties', schema: 'sys' }).as('p');
    const s = table({ name: 'schemas', schema: 'sys' });
    const t = table({ name: 'types', schema: 'sys' }).as('t');
    const sql = select({
      id: seq.object_id,
      name: seq.name,
      type_name: t.name,
      type_precision: seq.precision,
      type_scale: seq.scale,
      startValue: seq.start_value,
      increment: seq.increment,
      schema: s.name,
      scripts: '',
      comment: p.value,
    })
      .from(seq)
      .join(t, seq.user_type_id.eq(t.user_type_id))
      .join(s, s.schema_id.eq(seq.schema_id))
      .leftJoin(
        p,
        p.major_id
          .eq(seq.object_id)
          .and(p.minor_id.eq(0))
          .and(p.class.eq(1))
          .and(p.name.eq('MS_Description'))
      )
      .where(seq.type.eq('FN'));
    const result = (await runner.query(sql)).rows;
    const functions: SequenceSchema[] = result.map(row => {
      const { type_name, type_precision, type_scale, ...datas } = row;
      return {
        ...datas,
        type: fullType(type_name, 0, type_precision, type_scale)
      }
    });
    return functions;
  }

  async function getColumns(tableId: number): Promise<ColumnSchema[]> {
    const c = table({ name: 'columns', schema: 'sys' }).as('c');
    const t = table({ name: 'types', schema: 'sys' }).as('t');
    const p = table({ name: 'extended_properties', schema: 'sys' }).as('p');
    const m = table({ name: 'default_constraints', schema: 'sys' }).as('m');
    const ic = table({ name: 'identity_columns', schema: 'sys' }).as('ic');
    const cc = table({ name: 'computed_columns', schema: 'sys' }).as('cc');

    const sql = select({
      name: c.name,
      isNullable: c.is_nullable,
      isIdentity: c.is_identity,
      identityStartValue: ic.seed_value.to(DbType.int32),
      identityIncrement: ic.increment_value.to(DbType.int32),
      isCalculate: c.is_computed,
      calculateExpression: cc.definition,
      // isTimestamp: convert($case().when(t.name.eq('timestamp'), 1).else(0), DbType.boolean),
      type_name: t.name,
      type_length: c.max_length,
      type_precision: c.precision,
      type_scale: c.scale,
      defaultValue: m.definition,
      comment: p.value,
    })
      .from(c)
      .leftJoin(
        ic,
        c.object_id.eq(ic.object_id).and(c.column_id.eq(ic.column_id))
      )
      .join(t, c.user_type_id.eq(t.user_type_id))
      .leftJoin(
        p,
        p.class
          .eq(1)
          .and(p.name.eq('MS_Description'))
          .and(p.major_id.eq(c.object_id))
          .and(p.minor_id.eq(c.column_id))
      )
      .leftJoin(m, m.object_id.eq(c.default_object_id))
      .leftJoin(
        cc,
        and(
          c.is_computed.eq(true),
          c.object_id.eq(cc.object_id),
          c.column_id.eq(cc.column_id)
        )
      )
      .where(c.object_id.eq(tableId));
    const { rows } = await runner.query(sql);

    const columns: ColumnSchema[] = [];
    for (const row of rows) {
      const {
        defaultValue,
        type_name,
        type_length,
        type_precision,
        type_scale,
        ...datas
      } = row;
      const isRowflag = ['ROWVERSION', 'TIMESTAMP'].includes((type_name as string).toUpperCase());
      const column: ColumnSchema = {
        // 统一行标记类型
        type: isRowflag ? provider.sqlUtil.sqlifyType(DbType.rowflag) : fullType(type_name, type_length, type_precision, type_scale),
        isRowflag,
        defaultValue: defaultValue
          ? defaultValue.substr(1, defaultValue.length - 2)
          : null,
        ...datas
      };
      columns.push(column);
    }
    return columns;
  }

  async function getPrimaryKey(tableId: number): Promise<PrimaryKeySchema> {
    const k = table({ name: 'key_constraints', schema: 'sys' }).as('k');
    const i = table({ name: 'indexes', schema: 'sys' }).as('i');
    const p = table({ name: 'extended_properties', schema: 'sys' }).as('p');

    const sql = select<PrimaryKeySchema>({
      name: k.name,
      isNonclustered: convert(
        $case(i.type).when(1, false).else(true),
        DbType.boolean
      ),
      comment: p.value,
    })
      .from(i)
      .join(k, and(i.object_id.eq(k.parent_object_id), k.type.eq('PK')))
      .leftJoin(
        p,
        and(p.class.eq(1), p.major_id.eq(k.object_id), p.minor_id.eq(0))
      )
      .where(and(i.object_id.eq(tableId), i.is_primary_key.eq(true)));
    const rows = (await runner.query(sql)).rows;
    const pk: PrimaryKeySchema = rows[0];

    if (pk) {
      const ic = table({ name: 'index_columns', schema: 'sys' }).as('ic');
      // const ik = table('sysindexkeys').as('ik')
      const c = table({ name: 'columns', schema: 'sys' }).as('c');

      const colSql = select({
        name: c.name,
        isDesc: ic.is_descending_key,
      })
        .from(ic)
        .join(
          c,
          and(ic.object_id.eq(c.object_id), ic.column_id.eq(c.column_id))
        )
        .join(i, and(ic.object_id.eq(i.object_id), ic.index_id.eq(i.index_id)))
        .where(and(i.object_id.eq(tableId), i.is_primary_key.eq(true)));

      const { rows: colRows } = await runner.query(colSql);
      pk.columns = colRows.map(p => ({ name: p.name, isAscending: !p.isDesc }));
    }
    return pk;
  }

  async function getForeignKeys(tableId: number): Promise<ForeignKeySchema[]> {
    const fk = table({ name: 'foreign_keys', schema: 'sys' }).as('fk');
    const rt = table({ name: 'tables', schema: 'sys' }).as('rt');
    const d = table({ name: 'extended_properties', schema: 'sys' }).as('d');
    const s = table({ name: 'schemas', schema: 'sys' }).as('s');

    const sql = select({
      id: fk.object_id,
      name: fk.name,
      isCascade: fk.delete_referential_action.to(DbType.boolean),
      referenceTable: rt.name,
      referenceSchema: s.name,
      comment: d.value,
    })
      .from(fk)
      .join(rt, rt.object_id.eq(fk.referenced_object_id))
      .leftJoin(s, rt.schema_id.eq(s.schema_id))
      .leftJoin(
        d,
        d.name
          .eq('MS_Description')
          .and(d.major_id.eq(fk.object_id))
          .and(d.minor_id.eq(0))
      )
      .where(fk.parent_object_id.eq(tableId));
    const foreignKeys: ForeignKeySchema[] = (await runner.query(sql))
      .rows as any;

    for (const foreignKey of foreignKeys) {
      const foreignKeyId = Reflect.get(foreignKey, 'id');
      Reflect.deleteProperty(foreignKey, 'id');
      const fkc = table({ name: 'foreign_key_columns', schema: 'sys' }).as('fkc');
      const fc = table({ name: 'columns', schema: 'sys' }).as('fc');
      const rc = table({ name: 'columns', schema: 'sys' }).as('rc');

      const colSql = select({
        fcolumn: fc.name,
        rcolumn: rc.name,
      })
        .from(fkc)
        .join(
          fc,
          fc.object_id
            .eq(fkc.parent_object_id)
            .and(fc.column_id.eq(fkc.parent_column_id))
        )
        .join(
          rc,
          rc.object_id
            .eq(fkc.referenced_object_id)
            .and(rc.column_id.eq(fkc.referenced_column_id))
        )
        .where(fkc.constraint_object_id.eq(foreignKeyId));
      const rows = (await runner.query(colSql)).rows!;
      foreignKey.columns = rows.map(p => p.fcolumn);
      foreignKey.referenceColumns = rows.map(p => p.rcolumn);
    }
    return foreignKeys;
  }

  async function getUniqueConstraints(
    tableId: number
  ): Promise<UniqueConstraintSchema[]> {
    const i = table({ name: 'indexes', schema: 'sys' }).as('i');
    const p = table({ name: 'extended_properties', schema: 'sys' }).as('p');
    const k = table({ name: 'key_constraints', schema: 'sys' }).as('k');

    const sql = select({
      name: k.name,
      indexName: i.name,
      comment: p.value,
    })
      .from(i)
      .join(
        k,
        and(
          i.object_id.eq(k.parent_object_id),
          k.unique_index_id.eq(i.index_id)
        )
      )
      .leftJoin(
        p,
        and(p.class.eq(1), p.major_id.eq(k.object_id), p.minor_id.eq(0))
      )
      .where(and(i.is_unique.eq(false), i.object_id.eq(tableId)));
    const { rows } = await runner.query(sql);
    const uniques: UniqueConstraintSchema[] = rows.map(p => ({
      kind: 'UNIQUE',
      name: p.name,
      indexName: p.indexName,
      comment: p.comment,
      columns: []
    }));
    const ic = table({ name: 'index_columns', schema: 'sys' }).as('ic');
    // const ik = table('sysindexkeys').as('ik')
    const c = table({ name: 'columns', schema: 'sys' }).as('c');

    const colSql = select({
      indexName: i.name,
      name: c.name,
      isDesc: ic.is_descending_key,
    })
      .from(ic)
      .join(c, and(ic.object_id.eq(c.object_id), ic.column_id.eq(c.column_id)))
      .join(i, and(ic.object_id.eq(i.object_id), ic.index_id.eq(i.index_id)))
      .where(and(i.is_unique.eq(false), i.object_id.eq(tableId)));

    const { rows: colRows } = await runner.query(colSql);
    for (const unique of uniques) {
      unique.columns = colRows
        .filter(p => p.indexName === Reflect.get(unique, 'indexName'))
        .map(p => ({ name: p.name, isAscending: !p.isDesc }));
      Reflect.deleteProperty(unique, 'indexName');
    }
    return uniques;
  }

  async function getCheckConstraints(
    tableId: number
  ): Promise<CheckConstraintSchema[]> {
    const c = table({ name: 'check_constraints', schema: 'sys' }).as('c');
    const p = table({ name: 'extended_properties', schema: 'sys' }).as('p');
    const sql = select<CheckConstraintSchema>({
      kind: 'CHECK',
      name: c.name,
      comment: p.value,
      sql: c.definition,
    })
      .from(c)
      .join(
        p,
        and(
          p.class_desc.eq('OBJECT_OR_COLUMN'),
          p.major_id.eq(c.object_id),
          p.minor_id.eq(0)
        )
      )
      .where(
        and(c.parent_object_id.eq(tableId), c.type_desc.eq('CHECK_CONSTRAINT'))
      );
    const { rows } = await runner.query(sql);
    return rows;
  }

  async function getIndexes(tableId: number): Promise<IndexSchema[]> {
    const i = table({ name: 'indexes', schema: 'sys' }).as('i');
    const p = table({ name: 'extended_properties', schema: 'sys' }).as('p');

    const sql = select<IndexSchema>({
      name: i.name,
      isUnique: i.is_unique,
      isClustered: convert(
        $case(i.type).when(1, true).else(false),
        DbType.boolean
      ),
      comment: p.value,
    })
      .from(i)
      .leftJoin(
        p,
        and(
          p.class_desc.eq('INDEX'),
          p.major_id.eq(i.object_id),
          p.minor_id.eq(i.index_id)
        )
      )
      .where(
        and(
          i.object_id.eq(tableId),
          i.is_primary_key.eq(false),
          i.is_unique_constraint.eq(false),
          i.type.in(1, 2)
        )
      );
    // const st = provider.sqlUtil.sqlify(sql);
    const { rows } = await runner.query(sql);
    const indexes: IndexSchema[] = rows.map(
      ({ name, isUnique, isClustered, comment }) => ({
        name,
        isUnique,
        isClustered,
        comment
      } as IndexSchema)
    );

    const ic = table({ name: 'index_columns', schema: 'sys' }).as('ic');
    // const ik = table('sysindexkeys').as('ik')
    const c = table({ name: 'columns', schema: 'sys' }).as('c');

    const colSql = select({
      indexName: i.name,
      name: c.name,
      isDesc: ic.is_descending_key,
    })
      .from(ic)
      .join(c, and(ic.object_id.eq(c.object_id), ic.column_id.eq(c.column_id)))
      .join(i, and(ic.object_id.eq(i.object_id), ic.index_id.eq(i.index_id)))
      .where(
        and(
          i.object_id.eq(tableId),
          i.is_primary_key.eq(false),
          i.is_unique_constraint.eq(false)
        )
      );
    const { rows: colRows } = await runner.query(colSql);
    for (const index of indexes) {
      index.columns = colRows
        .filter(p => p.indexName === index.name)
        .map(p => ({ name: p.name, isAscending: !p.isDesc }));
    }
    return indexes;
  }

  const connectionDbName = await provider.getCurrentDatabase();
  if (!dbName) {
    dbName = connectionDbName;
  }

  const d = table('sys.databases');
  const sql = select({
    name: d.name,
    collate: d.collation_name,
    comment: 'mssql not all comment to database.'
  }).from(d).where(d.name.eq(dbName))
  const { rows: [row] } = await provider.lube.query(sql);
  if (!row) {
    return;
  }

  let runner: Executor

  return await provider.lube.trans(async (executor) => {
    runner = executor;

    // 切换数据库
    if (dbName !== connectionDbName) {
      // 由于数据连接池的原因，极有可能产生一个巨坑，后续任务使用到该连接时，导致数据库与连接字符串不对的错误。
      // 因此在执行完成后，切换回原数据库
      await runner.query(SqlBuilder.use(dbName!));
    }
    const tables = await getTables();
    const views = await getViews();
    const procedures = await getProcedures();
    const functions = await getFunctions();
    const sequences = await getSequences();
    const schemas = await getSchemas();
    if (dbName !== connectionDbName) {
      await runner.query(SqlBuilder.use(connectionDbName));
    }
    return {
      ...row,
      tables,
      views,
      procedures,
      functions,
      sequences,
      schemas
    } as DatabaseSchema;
  });


}
