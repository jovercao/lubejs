import { SqlBuilder, DbType } from '../..';
import { DbProvider } from '../../lube';
import { DatabaseSchema } from '../../schema';

import { groupBy } from './util';

const { case: $case, convert, select, table, unionAll } = SqlBuilder;

const excludeTables: string[] = ['__Migrate'];

export async function load(provider: DbProvider): Promise<DatabaseSchema> {
  async function getAllForeignKeys() {
    const fk = table(['foreign_keys', 'sys']).as('fk');
    const fkc = table(['foreign_key_columns', 'sys']).as('fkc');
    const ft = table(['tables', 'sys']).as('ft');
    const fc = table(['columns', 'sys']).as('fc');
    const rt = table(['tables', 'sys']).as('rt');
    const rc = table(['columns', 'sys']).as('rc');
    const d = table(['extended_properties', 'sys']).as('d');
    const sql = select({
      id: fk.object_id,
      name: fk.name,
      ftableId: ft.object_id,
      ftableName: ft.name,
      fcolumnId: fc.column_id,
      fcolumnName: fc.name,
      rtableId: rt.object_id,
      rtableName: rt.name,
      rcolumnId: rc.column_id,
      rcolumnName: rc.name,
      desc: d.value,
    })
      .from(fk)
      .join(fkc, fkc.constraint_object_id.eq(fk.object_id))
      .join(ft, ft.object_id.eq(fk.parent_object_id))
      .join(rt, rt.object_id.eq(fk.referenced_object_id))
      .join(
        fc,
        fc.object_id
          .eq(fk.parent_object_id)
          .and(fc.column_id.eq(fkc.parent_column_id))
      )
      .join(
        rc,
        rc.object_id
          .eq(fk.referenced_object_id)
          .and(rc.column_id.eq(fkc.referenced_column_id))
      )
      .leftJoin(
        d,
        d.name
          .eq('MS_Description')
          .and(d.major_id.eq(fk.object_id))
          .and(d.minor_id.eq(0))
      );
    const sqlTxt = provider.compiler.compile(sql).sql;
    console.log(sqlTxt);
    const keys = (await provider.query(sqlTxt)).rows;
    const result = groupBy<any, any>(
      keys,
      ({ id, name, ftableId, ftableName, rtableId, rtableName, desc }) => ({
        id,
        name,
        ftableId,
        ftableName,
        rtableId,
        rtableName,
        desc,
      })
    ).map(({ header, list }) => {
      header.columns = list.map(
        ({ fcolumnId, fcolumnName, rcolumnId, rcolumnName }) => ({
          fcolumnId,
          fcolumnName,
          rcolumnId,
          rcolumnName,
        })
      );
      return header;
    });
    return result;
  }

  /**
   * 获取 表格及视图
   */
  async function getTables() {
    const t = table(['tables', 'sys']).as('t');
    const v = table(['views', 'sys']).as('v');
    const p = table(['extended_properties', 'sys']).as('p');
    const sql = unionAll(
      select({
        id: t.object_id,
        name: t.name,
        desc: p.value,
        isView: convert(0, DbType.boolean),
        isEditable: convert(1, DbType.boolean),
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
        .where(t.name.notIn(...excludeTables)),
      select({
        id: v.object_id,
        name: v.name,
        desc: p.value,
        isView: convert(1, DbType.boolean),
        isEditable: convert(0, DbType.boolean),
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
        .where(v.name.notIn(...excludeTables))
    );
    const sqlTxt = provider.compiler.compile(sql).sql;
    console.log(sqlTxt);
    const rows = (await provider.query(sqlTxt)).rows;
    // const rows = (await provider.query(provider.compiler.compile(sql).sql)).rows;
    return rows;
  }

  async function getColumns(tableId: number, tableName: string) {
    const c = table(['columns', 'sys']).as('c');
    const t = table(['types', 'sys']).as('t');
    const p = table(['extended_properties', 'sys']).as('p');
    const m = table('syscomments').as('m');

    const sql = select({
      id: c.column_id,
      name: c.name,
      dbType: t.name,
      isNullable: c.is_nullable,
      isIdentity: c.is_identity,
      isComputed: c.is_computed,
      isTimestamp: $case().when(t.name.eq('timestamp'), 1).else(0),
      length: c.max_length,
      precision: c.precision,
      scale: c.scale,
      defaultValue: m.text,
      desc: p.value,
    })
      .from(c)
      .join(t, c.user_type_id.eq(t.user_type_id))
      .leftJoin(
        p,
        p.class
          .eq(1)
          .and(p.name.eq('MS_Description'))
          .and(p.major_id.eq(c.object_id))
          .and(p.minor_id.eq(c.column_id))
      )
      .leftJoin(m, m.id.eq(c.default_object_id))
      .where(c.object_id.eq(tableId));
    const rows = (await provider.query(provider.compiler.compile(sql).sql))
      .rows;
    return rows;
  }

  async function getIndexes(tableId: number) {
    const i = table(['indexes', 'sys']).as('i');
    const ic = table(['index_columns', 'sys']).as('ic');
    // const ik = table('sysindexkeys').as('ik')
    const c = table('syscolumns').as('c');
    const sql = select({
      tableId: i.object_id,
      indexId: i.index_id,
      indexName: i.name,
      columnId: c.colid,
      columnName: c.name,
      isPrimaryKey: i.is_primary_key,
      isUnique: i.is_unique,
    })
      .from(i)
      .join(ic, i.object_id.eq(ic.object_id).and(i.index_id.eq(ic.index_id)))
      .join(c, c.id.eq(i.object_id).and(c.colid.eq(ic.column_id)))
      .where(i.object_id.eq(tableId));

    const { rows } = await provider.query(provider.compiler.compile(sql).sql);
    const result = groupBy<any, any>(
      rows,
      ({ indexId, indexName, isPrimaryKey, isUnique }) => ({
        indexId,
        indexName,
        isPrimaryKey,
        isUnique,
      })
    ).map(({ header, list }) => {
      header.columns = list.map(({ columnId, columnName }) => ({
        id: columnId,
        name: columnName,
      }));
      return header;
    });
    return result;
  }

  const tables: any[] = await getTables();
  const allForeignKeys = await getAllForeignKeys();
  for (const table of tables) {
    table.columns = await getColumns(table.id, table.name);
    table.indexes = await getIndexes(table.id);
    // table.foreignKeys = allForeignKeys.filter(p => ...)
    table.columns.forEach((column: any) => {
      column.isPrimaryKey = !!table.indexes.find((index: any) => {
        return (
          index.isPrimaryKey &&
          index.columns.find((indexColumn: any) => column.id === indexColumn.id)
        );
      });
    });
    // table.primaryKey = table.indexes.find(p => p.isPrimaryKey)
    table.foreignKeys = allForeignKeys.filter(key => key.ftableId === table.id);

    // table.referencedKeys = allForeignKeys.filter(p => p.rtableId === table.id)
  }
  return {
    name: 'data',
    views: [],
    procedures: [],
    functions: [],
    sequences: [],
    tables,
  };
}
