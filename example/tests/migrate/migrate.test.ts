import { readdir, rm } from 'fs/promises';
import { createContext } from 'lubejs/lube';
import { MigrateCli } from 'lubejs/migrate-cli';
import { compareSchema, DatabaseSchema, generateSchema } from 'lubejs/schema';
import assert from 'assert';
import { DbContext } from 'lubejs/db-context';
import { SqlBuilder } from 'lubejs/ast';
import { join } from 'path';

describe.only('Migrate add', function () {
  let cli: MigrateCli;
  let dbContext: DbContext;
  let database: string;
  let defaultSchema: string;
  this.timeout(0);
  before(async () => {
    cli = await new MigrateCli();
    const files = await readdir(cli.migrateDir);
    for (const file of files) {
      await rm(join(cli.migrateDir, file));
    }
    dbContext = cli.dbContext;
    database = cli.targetDatabase;
    try {
      defaultSchema = await cli.getDefaultSchema();
    } catch (error) {
      console.error(error);
    }
  });

  after(async () => {
    if (dbContext.lube.opened) {
      await dbContext.lube.close();
    }
    dbContext.lube.changeDatabase(null);
    await dbContext.lube.query(SqlBuilder.dropDatabase(database));
    await cli.dispose();
  });

  it('Add & Snapshot', async () => {
    const initMigrate = await cli.add('Init');
    await cli.snapshot();
    const initSchema: DatabaseSchema = (await import(initMigrate.snapshotPath))
      .default;
    const metadataSchema = await generateSchema(dbContext);
    // metadataSchema.tables.forEach(table => table.seedData = undefined);
    // if (initDiff) {
    //   const databaseChanged = Object.keys(initDiff.changes!);
    //   assert(databaseChanged.length === 1 && databaseChanged[0] === 'tables');
    //   assert(initDiff.changes!.tables!.addeds.length === 0);
    //   assert(initDiff.changes!.tables!.removeds.length === 0);
    //   const tableChanged = Object.keys(initDiff.changes!.tables!.changes[0].changes!);
    //   assert(tableChanged.length = 1 && tableChanged[0] === 'seedData');
    // }

    const initDiff = compareSchema(defaultSchema, initSchema, metadataSchema);
    assert(!initDiff);
    const addedMigrate = await cli.add();
    await cli.snapshot();
    const addSchema = (await import(addedMigrate.snapshotPath)).default;
    const addDiff = compareSchema(defaultSchema, initSchema, addSchema);
    assert(!addDiff);
  });

  it('Sync', async () => {
    await cli.sync();
    const dbSchema = await dbContext.lube.provider.getSchema();
    assert(dbSchema);
    const metadataSchema = await generateSchema(dbContext);
    // metadataSchema.tables.forEach(table => table.seedData = undefined);
    const difference = compareSchema(defaultSchema, metadataSchema, dbSchema);
    assert(!difference);
  });

  it('Update', async () => {
    await cli.dropDatabase();
    await cli.update('Init');
    const migrate = await cli.getCurrentMigrate();

    assert(migrate?.name === 'Init');
    const dbSchema = await dbContext.lube.provider.getSchema();
    assert(dbSchema);
    const metadataSchema = await generateSchema(dbContext);
    // metadataSchema.tables.forEach(table => table.seedData = undefined);
    const difference = compareSchema(defaultSchema, metadataSchema, dbSchema);
    assert(!difference);
  });

  it('Script', async () => {
    const scripts = await cli.script({
      start: '?',
      end: '*',
    });
  });
});
