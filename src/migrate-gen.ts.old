import { TableInfo } from './migrate-builder'
import { TableSchema } from './schema'
import { SchemaDifference } from './schema-compare';

export function generateMigrate(diff: SchemaDifference): string[] {
  const codes: string[] = [];
  const tableInfo = (table: TableSchema): TableInfo => {
    const pk = table.primaryKey;
    return {
      name: table.name,
      columns: table.columns,
      comment: table.comment,
      foreignKeys: table.foreignKeys,
      primaryKey: pk && pk.columns.map(col => col.name),
      constraints: table.constraints
    }
  }
  if (diff.changes?.tables) {
    for (const { name } of diff.changes.tables.removeds) {
      codes.push(`migrate.dropTable(${JSON.stringify(name)})`);
    }
    for (const table of diff.changes.tables.addeds) {
      codes.push(`migrate.createTable(${JSON.stringify(tableInfo(table))})`);
      for (const index of table.indexes) {
        codes.push(
          `migrate.createIndex(${JSON.stringify(table.name)}, ${JSON.stringify(
            index
          )})`
        );
      }
      // for (const constraint of table.constraints) {
      //   codes.push(
      //     `migrate.addCheckConstraint(${JSON.stringify(
      //       table.name
      //     )}, ${JSON.stringify(constraint)})`
      //   );
      // }
    }

    for (const tableChanges of diff.changes.tables.changes) {
      // COLUMNS
      if (tableChanges.changes?.columns) {
        for (const col of tableChanges.changes.columns.addeds || []) {
          codes.push(
            `migrate.addColumn(${JSON.stringify(
              tableChanges.source.name
            )}, ${JSON.stringify(col)})`
          );
        }
        for (const col of tableChanges.changes.columns.removeds || []) {
          codes.push(
            `migrate.dropColumn(${JSON.stringify(tableChanges.source.name)})`
          );
        }
        for (const colChanges of tableChanges.changes.columns.changes || []) {
          codes.push(
            `migrate.alterColumn(${JSON.stringify(
              tableChanges.source.name
            )}, ${JSON.stringify(colChanges.target)})`
          );
        }
      }

      // FOREIGN KEY
      if (tableChanges.changes?.foreignKeys) {
        for (const fk of tableChanges.changes?.foreignKeys?.addeds || []) {
          codes.push(
            `migrate.addForignKey(${JSON.stringify(
              tableChanges.source.name
            )}, ${JSON.stringify(fk)})`
          );
        }

        for (const { name } of tableChanges.changes?.foreignKeys?.removeds ||
          []) {
          codes.push(
            `migrate.dropForignKey(${JSON.stringify(
              tableChanges.source.name
            )}, ${JSON.stringify(name)})`
          );
        }
      }

      // CONSTRAINT
      if (tableChanges.changes?.constraints) {
        for (const constraint of tableChanges.changes.constraints.addeds) {
          codes.push(`migrate.add${constraint.kind === 'CHECK' ? 'Check' : 'Unique' }Constraint`)
        }

      }

      if (tableChanges.changes.comment) {
        codes.push(
          `migrate.alterTable(${JSON.stringify(tableChanges.source.name)}, ${
            tableChanges.changes.comment.target
          })`
        );
      }

      if (tableChanges.changes.name) {
        codes.push(
          `migrate.renameTable(${JSON.stringify(
            tableChanges.changes.name.source
          )}, ${JSON.stringify(tableChanges.changes.name.target)})`
        );
      }
    }
  }

  if (diff.changes?.sequences) {
    for (const sequence of diff.changes.sequences.addeds || []) {
      codes.push(
        `migrate.createSequence(${JSON.stringify(
          sequence.name
        )}, ${JSON.stringify(sequence.type)}, ${JSON.stringify(
          sequence.startValue
        )}, ${JSON.stringify(sequence.increment)})`
      );
    }
    for (const { name } of diff.changes.sequences.removeds || []) {
      codes.push(`migrate.dropSequence(${JSON.stringify(name)})`);
    }
  }
  return codes;
}
