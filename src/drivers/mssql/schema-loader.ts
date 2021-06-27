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
} from 'lubejs';
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

export async function load(provider: DbProvider): Promise<DatabaseSchema>;
export async function load(
  provider: DbProvider,
  type: 'TABLE',
  name: string
): Promise<TableSchema>;
export async function load(
  provider: DbProvider,
  type?: 'TABLE',
  name?: string
): Promise<DatabaseSchema | TableSchema> {
  async function getForeignKeys(tableId: number): Promise<ForeignKeySchema[]> {
    const fk = table(['foreign_keys', 'sys']).as('fk');
    const rt = table(['tables', 'sys']).as('rt');
    const d = table(['extended_properties', 'sys']).as('d');

    const sql = select({
      id: fk.object_id,
      name: fk.name,
      isCascade: convert(fk.delete_referential_action, DbType.boolean),
      referenceTable: rt.name,
      comment: d.value,
    })
      .from(fk)
      .join(rt, rt.object_id.eq(fk.referenced_object_id))
      .leftJoin(
        d,
        d.name
          .eq('MS_Description')
          .and(d.major_id.eq(fk.object_id))
          .and(d.minor_id.eq(0))
      )
      .where(fk.parent_object_id.eq(tableId));
    const foreignKeys: ForeignKeySchema[] = (await provider.lube.query(sql))
      .rows as any;

    for (const foreignKey of foreignKeys) {
      const foreignKeyId = Reflect.get(foreignKey, 'id');
      const fkc = table(['foreign_key_columns', 'sys']).as('fkc');
      const fc = table(['columns', 'sys']).as('fc');
      const rc = table(['columns', 'sys']).as('rc');

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
      const { rows } = await provider.lube.query(colSql);
      foreignKey.columns = rows.map(p => p.fcolumn);
      foreignKey.referenceColumns = rows.map(p => p.rcolumn);
    }
    return foreignKeys;
  }

  /**
   * 获取 表格及视图
   */
  async function getTables(atable?: string) {
    const t = table(['tables', 'sys']).as('t');
    const p = table(['extended_properties', 'sys']).as('p');
    const sql = select({
      id: t.object_id,
      name: t.name,
      comment: p.value,
    })
      .from(t)
      .leftJoin(
        p,
        p.major_id
          .eq(t.object_id)
          .and(p.minor_id.eq(0))
          .and(p.class.eq(1))
          .and(p.name.eq('MS_Description'))
      )
      .where(t.name.notIn(...excludeTables));
    if (atable) sql.andWhere(t.name.eq(atable));

    const tables: TableSchema[] = (await provider.lube.query(sql)).rows as any;

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

  async function getViews(): Promise<ViewSchema[]> {
    const v = table(['views', 'sys']).as('v');
    const p = table(['extended_properties', 'sys']).as('p');
    const sql = select({
      id: v.object_id,
      name: v.name,
      body: '',
      comment: p.value,
    })
      .from(v)
      .leftJoin(
        p,
        p.major_id
          .eq(v.object_id)
          .and(p.minor_id.eq(0))
          .and(p.class.eq(1))
          .and(p.name.eq('MS_Description'))
      )
      .where(v.name.notIn(...excludeTables));

    const views: ViewSchema[] = (await provider.lube.query(sql)).rows;

    for (const view of views) {
      const cmd = provider.sqlUtil.sqlify(
        execute('sp_helptext', [view.name])
      );
      // const code = (await provider.query(cmd.sql, cmd.params)).rows.join('\n');

      const rows = (
        await provider.lube.execute<number, [{ Text: string }]>('sp_helptext', [
          view.name,
        ])
      ).rows;
      const key = Object.keys(rows[0])[0];
      const code = rows.map(row => Reflect.get(row, key)).join('\n');
      const matched = new RegExp(
        `^create[ \n]*${view.name}[ \n]*as[ \n]*`,
        'i'
      ).exec(code);
      if (!matched) {
        throw new Error(`视图代码不正确`);
      }
      view.body = code.substring(matched[0].length);
    }
    return views;
  }

  async function getColumns(tableId: number): Promise<ColumnSchema[]> {
    const c = table(['columns', 'sys']).as('c');
    const t = table(['types', 'sys']).as('t');
    const p = table(['extended_properties', 'sys']).as('p');
    const m = table(['default_constraints', 'sys']).as('m');
    const ic = table(['identity_columns', 'sys']).as('ic');
    const cc = table(['computed_columns', 'sys']).as('cc');

    const sql = select({
      name: c.name,
      isNullable: c.is_nullable,
      isIdentity: c.is_identity,
      identityStartValue: ic.seed_value,
      identityIncrement: ic.increment_value,
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
    const { rows } = await provider.lube.query(sql);

    const columns: ColumnSchema[] = [];
    for (const row of rows) {
      const {
        name,
        isNullable,
        isIdentity,
        identityStartValue,
        identityIncrement,
        isCalculate,
        calculateExpression,
        defaultValue,
        comment,
        type_name,
        type_length,
        type_precision,
        type_scale,
      } = row;
      const column: ColumnSchema = {
        name,
        type: fullType(type_name, type_length, type_precision, type_scale),
        isNullable,
        isIdentity,
        identityStartValue,
        identityIncrement,
        isCalculate,
        calculateExpression,
        defaultValue,
        comment,
      };
      columns.push(column);
    }
    return columns;
  }

  async function getPrimaryKey(tableId: number): Promise<PrimaryKeySchema> {
    const k = table(['key_constraints', 'sys']).as('k');
    const i = table(['indexes', 'sys']).as('i');
    const p = table(['extended_properties', 'sys']).as('p');

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
    const { rows } = await provider.query(provider.sqlUtil.sqlify(sql).sql);
    const pk: PrimaryKeySchema = rows[0];

    if (pk) {
      const ic = table(['index_columns', 'sys']).as('ic');
      // const ik = table('sysindexkeys').as('ik')
      const c = table(['columns', 'sys']).as('c');

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

      const { rows: colRows } = await provider.query(
        provider.sqlUtil.sqlify(colSql).sql
      );
      pk.columns = colRows.map(p => ({ name: p.name, isAscending: !p.isDesc }));
    }
    return pk;
  }

  async function getUniqueConstraints(
    tableId: number
  ): Promise<UniqueConstraintSchema[]> {
    const i = table(['indexes', 'sys']).as('i');
    const p = table(['extended_properties', 'sys']).as('p');
    const k = table(['key_constraints', 'sys']).as('k');

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
    const { rows } = await provider.lube.query(sql);
    const uniques: UniqueConstraintSchema[] = rows.map(p => ({
      kind: 'UNIQUE',
      name: p.name,
      indexName: p.indexName,
      comment: p.comment,
      columns: null,
    }));
    const ic = table(['index_columns', 'sys']).as('ic');
    // const ik = table('sysindexkeys').as('ik')
    const c = table(['columns', 'sys']).as('c');

    const colSql = select({
      indexName: i.name,
      name: c.name,
      isDesc: ic.is_descending_key,
    })
      .from(ic)
      .join(c, and(ic.object_id.eq(c.object_id), ic.column_id.eq(c.column_id)))
      .join(i, and(ic.object_id.eq(i.object_id), ic.index_id.eq(i.index_id)))
      .where(and(i.is_unique.eq(false), i.object_id.eq(tableId)));

    const { rows: colRows } = await provider.lube.query(colSql);
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
    const c = table(['check_constraints', 'sys']).as('c');
    const p = table(['extended_properties', 'sys']).as('p');
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
    const { rows } = await provider.lube.query(sql);
    return rows;
  }

  async function getIndexes(tableId: number): Promise<IndexSchema[]> {
    const i = table(['indexes', 'sys']).as('i');
    const p = table(['extended_properties', 'sys']).as('p');

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
    const st = provider.sqlUtil.sqlify(sql);
    const { rows } = await provider.query(st.sql);
    const indexes: IndexSchema[] = rows;

    const ic = table(['index_columns', 'sys']).as('ic');
    // const ik = table('sysindexkeys').as('ik')
    const c = table(['columns', 'sys']).as('c');

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
    const sqlTxt = provider.sqlUtil.sqlify(colSql).sql;
    const { rows: colRows } = await provider.query(sqlTxt);
    for (const index of indexes) {
      index.columns = colRows
        .filter(p => p.indexName === index.name)
        .map(p => ({ name: p.name, isAscending: !p.isDesc }));
    }
    return indexes;
  }

  if (type === 'TABLE') {
    const [table] = await getTables(name);
    return table;
  }

  const tables = await getTables();
  const views = await getViews();

  return {
    name: 'data',
    tables,
    views,
    procedures: [],
    functions: [],
    sequences: [],
  };
}
