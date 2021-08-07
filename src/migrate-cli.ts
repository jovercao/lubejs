import { existsSync, promises } from 'fs';
import { dirname, join, resolve } from 'path';
import { Statement, SqlBuilder as SQL, SqlBuilder } from './ast';
import { DbContext, DbContextConstructor } from './db-context';
import { DatabaseSchema, generateSchema, PrimaryKeySchema } from './schema';
import { AsyncClass, Constructor, DbType } from './types';
import { Command } from './execute';
import { isRaw, isStatement, outputCommand } from './util';
import { MigrateBuilder } from './migrate-builder';
import { mkdir, readFile } from 'fs/promises';
import 'colors';
import { ConnectOptions, createContext } from './lube';
import md5 from 'crypto-js/md5';
import {
  SnapshotMigrateBuilder,
  SnapshotMigrateTracker,
} from './migrate-snapshot';
import { StatementMigrateScripter } from './migrate-scripter';
import { ProgramMigrateScripter } from './migrate-programmer';
import { metadataStore } from './metadata';

const { readdir, stat, writeFile } = promises;
export interface Migrate {
  up(builder: MigrateBuilder, dialect: string | symbol): Promise<void> | void;
  down(builder: MigrateBuilder, dialect: string | symbol): Promise<void> | void;
}

export interface LubeConfig {
  default: string;
  configures: {
    [key: string]: ConnectOptions;
  };
  migrateDir: string;
}

interface MigrateInfo {
  id: string;
  name: string;
  timestamp: string;
  path: string;
  kind: 'typescript' | 'javascript';
  hash?: string;
  snapshotPath: string;
  index: number;
}

export const LUBE_MIGRATE_TABLE_NAME = '__LubeMigrate';
const MIGRATE_FILE_REGX = /^(\d{14})_(\w[\w_\d]*)\.(ts|js)$/i;
const NAME_REGX = /^[a-zA-Z_]\w*$/i;
function createMigrateBuilder(
  builder: MigrateBuilder,
  statements: Statement[]
): MigrateBuilder {
  return new Proxy(builder, {
    get(target, key: string) {
      const val = Reflect.get(target, key);
      if (typeof val === 'function') {
        return function (...args: any) {
          const ret = val.call(target, ...args);
          if (ret instanceof Promise) {
            return ret.then(ret => {
              if (isStatement(ret)) {
                statements.push(ret);
              }
              return ret;
            });
          } else if (isStatement(ret) || isRaw(ret)) {
            statements.push(ret as any);
          }
          return ret;
        };
      }
      return val;
    },
  });
}

function assertName(name: string): asserts name {
  if (!NAME_REGX.test(name)) {
    throw new Error(`Migrate class name '${name}' invalid.`);
  }
}

/**
 * 迁移命令行
 */
export class MigrateCli {
  constructor(
    private contextName?: string,
    public readonly migrateDir: string = './migrates'
  ) {
    // 设置为默认数据库
    return (async () => {
      await this.init();
      return this;
    })() as any;
  }

  public dbContext!: DbContext;

  private async init(): Promise<void> {
    let Ctr: DbContextConstructor;
    if (this.contextName) {
      Ctr = metadataStore.getContext(this.contextName).class;
    } else {
      Ctr = metadataStore.defaultContext.class;
      this.contextName = Ctr.name;
    }
    this.dbContext = await createContext(Ctr);
    this.dbContext.lube.changeDatabase(null);
  }

  private async runMigrate(
    Ctr: Constructor<Migrate>,
    action: 'up' | 'down',
    builder: MigrateBuilder
  ): Promise<Statement[]> {
    const instance = new Ctr();
    const statements: Statement[] = [];
    const scripter = createMigrateBuilder(builder, statements);
    if (action === 'up') {
      await instance.up(scripter, this.dbContext.lube.provider.dialect);
    } else {
      await instance.down(scripter, this.dbContext.lube.provider.dialect);
    }
    return statements;
  }

  async dispose(): Promise<void> {
    if (this.dbContext?.lube?.opened) {
      await this.dbContext.lube.close();
    }
  }

  // async connect() {
  //   await this.dbContext.lube.changeDatabase(undefined);
  //   try {
  //     await this.dbContext.lube.provider.open();
  //   } catch {
  //     // 如果目标连接字符串数据库不存在，则切换到默认数据库连接;
  //     this.dbContext.lube.provider.changeDatabase(undefined);
  //     await this.dbContext.lube.provider.open();
  //   }
  // }

  /**
   * 获取数据库当前迁移版本
   * @returns
   */
  public async getDbMigrate(): Promise<MigrateInfo | undefined> {
    try {
      const migrate = await this.dbContext.trans(async instance => {
        await instance.executor.query(SQL.use(this.targetDatabase));
        const [item] = await instance.executor.select(LUBE_MIGRATE_TABLE_NAME, {
          offset: 0,
          limit: 1,
          sorts: t => [t.$('migrate_id').desc()],
        });
        if (!item) return;
        const id = item.migrate_id;
        return this.getMigrate(id);
      });
      return migrate;
    } catch (error) {
      // console.log(error);
      return;
    }
  }

  private async getLastMigrate(): Promise<MigrateInfo | undefined> {
    const items = await this._list();
    return items[items.length - 1];
  }

  /**
   * 创建数据库
   */
  async ensureDatabase(): Promise<void> {
    if (!await this.existsDatabase()) {
      await this.dbContext.lube.query(
        SqlBuilder.createDatabase(this.targetDatabase)
      );
    }
  }

  /**
   * 删除数据库
   */
  async dropDatabase(): Promise<void> {
    try {
      await this.dbContext.lube.query(
        SqlBuilder.dropDatabase(this.targetDatabase)
      );
    } catch (error) {
      const e = new Error(`DropDatabase error:` + error.toString());
      throw e;
    }
  }

  private async ensureSchema(): Promise<void> {}

  // private async ensureMigrateTable(): Promise<void> {
  //   if (!this.dbSchema.tables.find(t => t.name === LUBE_MIGRATE_TABLE_NAME)) {
  //     const sql = SQL.createTable(LUBE_MIGRATE_TABLE_NAME).as(builder => [
  //       builder.column('migrate_id', DbType.string(100)).primaryKey(),
  //     ]);
  //     await this.dbContext.executor.query(sql);
  //   }
  // }

  private getTimestamp(): string {
    const now = new Date();
    const timestamp =
      now.getFullYear().toString().padStart(4, '0') +
      (now.getMonth() + 1).toString().padStart(2, '0') +
      now.getDate().toString().padStart(2, '0') +
      now.getHours().toString().padStart(2, '0') +
      now.getMinutes().toString().padStart(2, '0') +
      now.getSeconds().toString().padStart(2, '0');
    return timestamp;
  }

  /**
   * 创建一个空的迁移文件
   * @param name
   */
  async create(name?: string): Promise<void> {
    const timestamp = this.getTimestamp();
    if (!name) {
      name = 'Migrate' + timestamp;
    }
    const exists = await this.findMigrate(name);
    if (exists) {
      throw new Error(`迁移文件${name}已经存在：${exists.path}`);
    }

    const id = `${timestamp}_${name}`;
    const codes = this.generateMigrateClass(name);
    if (!existsSync(this.migrateDir)) {
      await promises.mkdir(this.migrateDir);
    }
    const filePath = join(this.migrateDir, `${id}.ts`);
    await writeFile(filePath, codes);
    console.info(`迁移文件创建成功：${filePath}`);
  }

  /**
   * 将数据库架构与当前架构进行对比，并生成新的迁移文件
   * @param name
   */
  async add(name?: string, notResolverType = false): Promise<MigrateInfo> {
    const timestamp = this.getTimestamp();
    if (!name) {
      name = 'Migrate' + timestamp;
    }
    assertName(name);
    const exists = await this.findMigrate(name);
    if (exists) {
      throw new Error(`迁移文件${name}已经存在：${exists.path}`);
    }
    let lastMigrate = await this.getLastMigrate();
    let lastSchema: DatabaseSchema | undefined;
    if (lastMigrate) {
      lastSchema = (await import(lastMigrate.snapshotPath)).default;
    }
    // const dbSchema = await this.loadSchema();
    const entityScheam = generateSchema(this.dbContext);
    const code = await this.generateMigrate(
      name,
      entityScheam,
      lastSchema,
      notResolverType
    );

    const id = `${timestamp}_${name}`;
    const filePath = resolve(join(this.migrateDir, `${id}.ts`));
    await writeFile(filePath, code);
    console.log(
      `Generate migrate file successed, and output to file ${filePath}`.green
    );
    const snapshotPath = resolve(join(this.migrateDir, `${id}.snapshot.ts`));
    //     // 创建快照文件
    //     await writeFile(
    //       snapshotPath,
    //       `
    // import { DatabaseSchema } from 'lubejs';
    // export const schema: DatabaseSchema = ${JSON.stringify(entityScheam)};
    // export default schema;
    // `
    //     );
    const info: MigrateInfo = {
      id,
      name,
      timestamp,
      path: filePath,
      snapshotPath,
      kind: 'typescript',
      index: (await this._list()).length,
    };
    (await this._list()).push(info);
    await this.snapshotAll();
    return info;
  }

  async findMigrate(name: string): Promise<MigrateInfo | undefined> {
    const items = await this._list();
    const item = items.find(
      item => item.name === name || item.id === name || item.timestamp === name
    );
    return item;
  }

  async getMigrate(nameOrId: string): Promise<MigrateInfo> {
    const items = await this._list();
    const item = items.find(
      item =>
        item.name === nameOrId ||
        item.id === nameOrId ||
        item.timestamp === nameOrId
    );
    if (!item) {
      throw new Error(`找不到指定的迁移${nameOrId}文件，或迁移文件已被删除。`);
    }
    return item;
  }

  async getDbSchema(): Promise<DatabaseSchema | undefined> {
    return this.dbContext!.lube.provider.getSchema(this.targetDatabase);
  }

  getMetadataSchema(): DatabaseSchema {
    return generateSchema(this.dbContext);
  }

  get targetDatabase(): string {
    return (
      this.dbContext.lube.provider.options.database ||
      this.dbContext.metadata.database
    );
  }

  // async useTargetDatabase() {
  //   const dbContext = await this.getDbContext();
  //   const database =
  //     dbContext.lube.provider.options.database || dbContext.metadata.database;
  //   if (dbContext.lube.opened)
  //     await dbContext.lube.close();
  //   dbContext.lube.changeDatabase(database);
  // }

  // async useDefaultDatabase() {
  //   const dbContext = await this.getDbContext();
  //   const database =
  //     dbContext.lube.provider.options.database || dbContext.metadata.database;
  //   if (dbContext.lube.opened) {
  //     await dbContext.lube.close();
  //     dbContext.lube.changeDatabase(null);
  //     // WARN: 当心：此处可能有坑，当权限足够，但是默认数据为当前数据库的用户使用时，将会招抛出此异常
  //     if (await dbContext.lube.getCurrentDatabase() === database) {
  //       throw new Error(`Permission denied, you must provide a server administrator user to migrate.`);
  //     }
  //   }
  // }

  async existsDatabase(): Promise<boolean> {
    const currentDb = await this.dbContext.lube.getCurrentDatabase();
    try {
      await this.dbContext.lube.query(SQL.use(this.targetDatabase));
      await this.dbContext.lube.query(SQL.use(currentDb));
      return true;
    } catch {
      return false;
    }
  }

  /**
   * 更新到指定迁移
   * 无论是否比指定迁移更新
   * @param name
   */
  async update(name?: string): Promise<void> {
    const target = name
      ? await this.getMigrate(name)
      : await this.getLastMigrate();
    if (!target) {
      throw new Error(`无法更新数据库，因为继续更新将删除数据库。`);
    }
    // const exists = await this.existsDatabase();
    await this.ensureDatabase();
    const current = await this.getDbMigrate();
    const scripts = await this._script(current, target);
    const db = await this.dbContext.lube.provider.getCurrentDatabase();
    await this.dbContext.trans(async instance => {
      await instance.executor.query(SqlBuilder.use(this.targetDatabase));
      for (const cmd of scripts) {
        outputCommand(cmd);
        await instance.executor.query(cmd);
        console.info(`----------------------------------------------------`);
      }
      await instance.executor.query(SqlBuilder.use(db));
    });
    console.info(`------------执行成功，已更新到${target.id}.----------------`);
  }

  async _script(
    start: MigrateInfo | undefined,
    end: MigrateInfo | undefined
  ): Promise<Command[]> {
    const startIndex = start?.index ?? -1;
    const endIndex = end?.index ?? -1;

    const migrates = await this._list();
    await this.snapshotAll();

    if (startIndex === endIndex) {
      console.log(`源和目标版本一致或未找到可供生成的的迁移文件。`.yellow);
      return [];
    }
    const isUpgrade = endIndex > startIndex;
    const isDemotion = endIndex < startIndex;

    const statements: Statement[] = [];
    if (isUpgrade) {
      for (let i = startIndex + 1; i <= endIndex; i++) {
        const info = migrates[i];
        statements.push(SQL.note(`===============Migrate up script from "${info.path}"====================`));

        // statements.push(SQL.note('Check last migration exists in database?'));
        // const t = SQL.table(LUBE_MIGRATE_TABLE_NAME);
        // if (i >= 1) {
        //   const lastInfo = migrates[i - 1];
        //   statements.push(
        //     SQL.if(
        //       SQL.not(
        //         SQL.exists(
        //           SQL.select(1)
        //             .from(t)
        //             .where(
        //               t.migrate_id.eq(lastInfo.id).and(t.hash.eq(lastInfo.hash!))
        //             )
        //         )
        //       )
        //     ).then(
        //       this.dbContext.lube.provider.migrateBuilder.throw(
        //         `Migration ${lastInfo.id} must upped before ${info.id}.`
        //       )
        //     )
        //   );
        // }
        // statements.push(SQL.note('Check last migration exists in database?'));
        // statements.push(
        //   SQL.if(
        //     SQL.exists(SQL.select(1).from(t).where(t.migrate_id.eq(info.id)))
        //   ).then(
        //     this.dbContext.lube.provider.migrateBuilder.throw(
        //       `Migration ${info.id} upped in database.`
        //     )
        //   )
        // );
        const Migrate = await importMigrate(info);
        const codes = await this.runMigrate(
          Migrate,
          'up',
          this.dbContext.lube.provider.migrateBuilder
        );
        statements.push(...codes);
        // 创建迁移记录表
        if (i === 0) {
          statements.push(
            SQL.createTable(LUBE_MIGRATE_TABLE_NAME).as(builder => [
              builder.column('migrate_id', DbType.string(100)).primaryKey(),
              builder.column('hash', DbType.string(32)).notNull(),
              builder.column('date', DbType.datetime).default(SqlBuilder.now()),
            ])
          );
        }
        statements.push(
          SQL.insert(LUBE_MIGRATE_TABLE_NAME).values({
            migrate_id: info.id,
            hash: info.hash,
          })
        );
      }
    }
    if (isDemotion) {
      for (let i = startIndex; i > endIndex; i--) {
        const info = migrates[i];
        const t = SqlBuilder.table(LUBE_MIGRATE_TABLE_NAME).as('t');
        statements.push(SQL.note(`Migrate down script from "${info.path}"`));

        statements.push(SQL.note('Check migrate file change'));
        statements.push(
          SQL.if(
            SQL.not(
              SQL.exists(
                SQL.select(1)
                  .from(t)
                  .where(t.migrate_id.eq(info.id).and(t.hash.eq(info.hash)))
              )
            )
          ).then(
            this.dbContext.lube.provider.migrateBuilder.throw(
              `No migrate in database or migrate file is changed after migration ${info.id} up. For data security, please handle this migration manually`
            )
          )
        );

        const Migrate = await importMigrate(info);
        const codes = await this.runMigrate(
          Migrate,
          'down',
          this.dbContext.lube.provider.migrateBuilder
        );
        statements.push(...codes);
        statements.push(
          SQL.delete(t).where(
            t.migrate_id.eq(info.id).and(t.hash.eq(info.hash))
          )
        );
        if (i === 0) {
          statements.push(SQL.dropTable(LUBE_MIGRATE_TABLE_NAME));
        }
      }
    }

    const scripts = statements.map(statement =>
      this.dbContext.lube.sqlUtil.sqlify(statement)
    );
    return scripts;
  }

  async script(options?: {
    start?: string;
    end?: string;
    outputPath?: string;
  }): Promise<string> {
    let end: MigrateInfo | undefined;
    if (!options?.end || options?.end === '*') {
      end = await this.getLastMigrate();
    } else if (options?.end === '@') {
      end = await this.getDbMigrate();
    } else if (options.end !== '?') {
      end = await this.getMigrate(options.end);
    }
    // const migrates = await this._list();
    let start: MigrateInfo | undefined;
    if (!options?.start || options?.start === '@') {
      start = await this.getDbMigrate();
    } else if (options?.start === '*') {
      start = await this.getLastMigrate();
    } else if (options.start !== '?') {
      start = await this.getMigrate(options.start);
    }
    const scripts = await this._script(start, end);
    const text = this.dbContext.lube.sqlUtil.joinBatchSql(
      ...scripts.map(cmd => cmd.sql)
    );
    if (options?.outputPath) {
      const filePath = resolve(options.outputPath);
      const dir = dirname(filePath);
      if (!existsSync(dir)) {
        await mkdir(dir);
      }

      await writeFile(options.outputPath, text, 'utf-8');
      console.log(
        `Generate scripts successed, and output to file ${filePath}`.green
      );
    } else {
      console.log(text);
    }
    return text;
  }

  private _migrateList?: MigrateInfo[];

  /**
   * 列出当前所有迁移
   */
  private async _list(): Promise<MigrateInfo[]> {
    if (this._migrateList) return this._migrateList;
    const results: MigrateInfo[] = [];
    if (!existsSync(this.migrateDir)) {
      return [];
    }
    const items = await readdir(this.migrateDir);
    for (const item of items.sort()) {
      const path = join(this.migrateDir, item);
      const match = MIGRATE_FILE_REGX.exec(item);
      if (match && (await stat(path)).isFile()) {
        const fullPath = resolve(process.cwd(), path);
        const extname = match[3].toLowerCase();
        const snapshotPath = resolve(
          join(
            this.migrateDir,
            `${match[1]}_${match[2]}.${this.dbContext.lube.provider.dialect}.snapshot.${extname}`
          )
        );
        results.push({
          id: `${match[1]}_${match[2]}`,
          timestamp: match[1],
          name: match[2],
          path: fullPath,
          snapshotPath,
          kind: extname === 'js' ? 'javascript' : 'typescript',
          // hash: (await import(snapshotPath)).hash,
          index: 0,
        });
      }
    }
    this._migrateList = results.sort((a, b) =>
      a.timestamp.localeCompare(b.timestamp)
    );
    this._migrateList.forEach((item, index) => (item.index = index));
    return this._migrateList;
  }

  /**
   * 列出迁移文件
   */
  async list(): Promise<void> {
    const list = await this._list();
    console.table(list, ['kind', 'name', 'timestamp', 'path']);
  }

  async getDefaultSchema(): Promise<string> {
    await this.ensureDatabase();
    const defaultSchema = await this.dbContext.lube.provider.getDefaultSchema(
      this.targetDatabase
    );
    return defaultSchema;
  }

  /**
   * 生成迁移文件代码
   * @param name
   * @param source
   * @param target
   * @param metadata
   * @returns
   */
  private async generateMigrate(
    name: string,
    source: DatabaseSchema,
    target: DatabaseSchema | undefined,
    notResolverType: boolean
  ): Promise<string> {
    const scripter = new ProgramMigrateScripter(
      this.dbContext.lube.sqlUtil,
      notResolverType
    );
    const defaultSchema = await this.dbContext.lube.provider.getDefaultSchema();
    scripter.migrate(defaultSchema, source, target);
    const upCodes = scripter.getScripts();
    scripter.clear();
    scripter.migrate(defaultSchema, target, source);
    const downCodes = scripter.getScripts();
    return this.generateMigrateClass(name, upCodes, downCodes);
  }

  private generateMigrateClass(
    name: string,
    upcodes?: string[],
    downcodes?: string[]
  ): string {
    return `import { Migrate, SqlBuilder as SQL, DbType, MigrateBuilder } from 'lubejs';

export class ${name} implements Migrate {

  async up(
    builder: MigrateBuilder,
    dialect: string
  ): Promise<void> {
    ${(upcodes && upcodes.map(line => line + ';').join('\n    ')) || ''}
  }

  async down(
    builder: MigrateBuilder,
    dialect: string
  ): Promise<void> {
    ${(downcodes && downcodes.map(line => line + ';').join(';\n    ')) || ''}
  }

}

export default ${name};
  `;
  }

  /**
   * 同步架构
   */
  async sync(outputPath?: string): Promise<void> {
    const metadataSchema = generateSchema(this.dbContext);

    const defaultSchema = await this.dbContext.lube.provider.getDefaultSchema();
    // 需要操作的数据库名称, 优先取连接字符串中的数据库名称，Metadata中的数据名称次之。
    let dbSchema: DatabaseSchema | undefined = await this.getDbSchema();
    // 如果数据库不存在，先创建数据库
    if (!dbSchema) {
      await this.dbContext.lube.query(SQL.createDatabase(this.targetDatabase));
    }

    const scripter = new StatementMigrateScripter(
      this.dbContext.lube.provider.migrateBuilder
    );
    scripter.migrate(defaultSchema, metadataSchema, dbSchema);
    const statements: Statement[] = scripter.getScripts();

    if (outputPath) {
      const commands = statements.map(p =>
        this.dbContext.lube.sqlUtil.sqlify(p)
      );
      const filePath = resolve(outputPath);
      const dir = dirname(filePath);
      if (!existsSync(dir)) {
        await mkdir(dir);
      }
      const text = commands
        .map(cmd => cmd.sql)
        .join('\n---------------------------------------------\n');
      await writeFile(outputPath, text, 'utf-8');
      console.log(
        `Generate scripts successed, and output to file ${filePath}`.green
      );
      return;
    }
    console.info(`*************************************************`);
    console.info(`开始开新数据库架构，请稍候......`);
    const db = await this.dbContext.lube.provider.getCurrentDatabase();
    await this.dbContext.trans(async instance => {
      // 使用目标数据库
      await instance.executor.query(SqlBuilder.use(this.targetDatabase));
      for (const statement of statements) {
        const cmd = this.dbContext.lube.sqlUtil.sqlify(statement);
        outputCommand(cmd);
        await instance.executor.query(cmd);
        console.info(`----------------------------------------------------`);
      }

      await instance.executor.query(SqlBuilder.use(db));
    });
    console.info(`更新数据库架构完成，数据库架构已经更新到与实体一致。`);
    console.info(
      `请注意，通过Sync更新的数据库，将不能再使用 'lubejs migrate update <migrate>' 命令更新，否则可能造成数据丢失！`
    );
  }

  /**
   * 生成快照
   */
  async snapshotAll() {
    let lastSchema: DatabaseSchema | undefined = undefined;
    const list = await this._list();
    let needRetrace = false;
    let currentHash: string = '';
    const defaultSchema = await this.dbContext.lube.provider.getDefaultSchema();
    for (const item of list) {
      if (!currentHash) {
        currentHash = await getFileHash(item.path);
      } else {
        currentHash = md5(
          currentHash + (await readFile(item.path)).toString('utf-8')
        ).toString();
      }
      // 填充哈希码
      item.hash = currentHash;
      if (!needRetrace) {
        if (!existsSync(item.snapshotPath)) {
          needRetrace = true;
        }
      }
      if (!needRetrace) {
        // 较准哈希码
        const { hash, default: snapshot } = await import(item.snapshotPath);
        if (!currentHash !== hash) {
          needRetrace = true;
        } else {
          lastSchema = snapshot;
          continue;
        }
      }

      if (needRetrace) {
        if (!lastSchema) {
          lastSchema = {
            name:
              this.dbContext.lube.provider.options.database ||
              this.dbContext.metadata.database,
            tables: [],
            schemas: [],
            views: [],
            sequences: [],
            procedures: [],
            functions: [],
            comment: this.dbContext.metadata.comment,
          };
        }
        const tracker = new SnapshotMigrateTracker(
          lastSchema,
          this.dbContext.lube.provider.sqlUtil,
          defaultSchema
        );
        const builder = new SnapshotMigrateBuilder();
        const migrate = (await import(item.path)).default;
        const statements = await this.runMigrate(migrate, 'up', builder);
        tracker.run(statements);
        lastSchema = tracker.database;
        // 生成快照文件
        await writeFile(
          item.snapshotPath,
          `
import { DatabaseSchema } from "lubejs";
export const schema: DatabaseSchema = ${JSON.stringify(
            lastSchema,
            undefined,
            2
          )};
export const dialect = '${this.dbContext.lube.provider.dialect}';
export const hash = "${currentHash}";
export default schema;
`
        );
      }
    }
  }
}

async function importMigrate(info: MigrateInfo): Promise<Constructor<Migrate>> {
  let imported: any;
  if (info.kind === 'typescript') {
    imported = await import(info.path);
  } else {
    imported = require(info.path);
  }
  const migrate = imported?.default || imported?.[info.name] || imported;
  if (!migrate) throw new Error(`Migrate file ${info.path} not found.`);
  return migrate;
}

async function getFileHash(path: string): Promise<string> {
  const data = await (await readFile(path)).toString('utf-8');
  return md5(data).toString();
}
