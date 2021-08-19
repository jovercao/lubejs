import 'ts-node/register';
import 'tsconfig-paths/register';
import Program from 'commander';
import { MigrateCli } from './migrate-cli';
import 'colors';
import { loadConfig } from './lube';

async function initCli(options?: {
  context?: string;
  migrateDir?: string;
  require?: string;
}): Promise<MigrateCli> {
  let { migrateDir } = options || {};
  const {context, require: importModule} = options || {};
  if (importModule) {
    const file = require.resolve(importModule);
    if (file.endsWith('.ts')) {
      await import(importModule);
    } else if (file.endsWith('.js')) {
      await require(importModule);
    } else {
      throw new Error(`Option --require is only support .ts and .js file.`)
    }
  }
  if (!migrateDir) {
    migrateDir = './migrates';
  }
  // 加载配置，以便导入ORM Metadata
  await loadConfig();
  const cli = new MigrateCli(context, migrateDir);
  // const db = await cli.getDbContext();
  // db.lube.on('command', outputCommand);
  return cli;
}

const migrate = Program.command('migrate')
  .option('-c, --context <context>', `配置文件.lubejs.ts或.lubejs.js中的contexts名称。`)
  .option(
    '-d, --dir <dir>',
    '迁移文件路径，不传递时默认为 {pwd}/migrate/{context}/。'
  )
  .option(
    '-r, --require <import>',
    '预加载一个源文件，可以是.ts或者.js，一般用于导入ORM实体注册信息'
  )
  .description('Migration comannders.');

// const migrateCreate = migrate
//   .command('create [name]')
//   .description('创建一个空白的迁移文件.')
//   // .option('-o, --output-dir <outputDir>', '输出目录.')
//   .action(async (name: string) => {
//     const cli = await createMigrateCli(migrate.opts());
//     try {
//       await cli.create(name);
//     } catch (error) {
//       errorHandler(error);
//     } finally {
//       await cli.dispose();
//     }
//   });

const migrateAdd = migrate
  .command('add [name]')
  .description('生成数据库迁移源代码.')
  // .option('-o, --output-dir <outputDir>', '输出目录.')
  .option('-n, --not-resolver-type', '生成的代码中不转换原始数据类型到DbType.')
  .option('-u, --update', '同时更新到数据库')
  .action(async name => {
    const opts = migrate.opts();
    const addOpts = migrateAdd.opts();
    const cli = await initCli(opts);
    try {
      const migrateInfo = await cli.add(name, addOpts.notResolverType);
      if (addOpts.update) {
        await cli.update(migrateInfo.id)
      }
    } catch (error) {
      errorHandler(error);
    } finally {
      await cli.dispose();
    }
  });

migrate
  .command('list')
  .description('列出所有迁移.')
  .action(async () => {
    const cli = await initCli(migrate.opts());
    try {
      await cli.list();
    } catch (error) {
      errorHandler(error);
    } finally {
      await cli.dispose();
    }
  });

const migrateScript = migrate
  .command('script')
  .description('生成数据库更新脚本，脚本更新方向为: <source> ==> <target>')
  .option('-o, --output-path <outputPath>', '输出路径.')
  .option(
    '-s, --source <source>',
    `源迁移版本名称：\n  ${'*'.yellow} ---- 表示使用最新版本\n  ${
      '@'.yellow
    } ---- 表未当前数据库版本\n   不传递时使用当前数据库版本\n  ${
      '?'.yellow
    } ---- 表未尚未初始化版本\n   不传递时使用当前数据库版本`
  )
  .option(
    '-t, --target <target>',
    `目标迁移版本名称：\n  ${'*'.yellow} ---- 表示使用最新版本\n  ${
      '@'.yellow
    } ---- 表未当前数据库版本\n  不传递时使用最新版本\n  ${
      '?'.yellow
    } ---- 表未尚未初始化版本\n   不传递时使用当前数据库版本`
  )
  .action(async () => {
    const opts = migrateScript.opts();
    const cli = await initCli(migrate.opts());
    try {
      await cli.script({
        start: opts.source,
        end: opts.target,
        outputPath: opts.outputPath,
      });
    } catch (error) {
      errorHandler(error);
    } finally {
      await cli.dispose();
    }
  });

const migrateUpdate = migrate
  .command('update <target>')
  .description('更新数据库到指定版本: <target>')
  .action(async targetName => {
    const opts = migrateUpdate.opts();
    if (opts.target === '*' || opts.target === '@') {
      throw new Error(
        `错误的目标版本，为了数据安全起见，请明确指定版本名称，且不支持使用*/@指定版本。`
      );
    }
    const cli = await initCli(migrate.opts());
    try {
      await cli.update(targetName);
    } catch (error) {
      errorHandler(error);
    } finally {
      await cli.dispose();
    }
  });

const migrateSync = migrate
  .command('sync')
  .option('-o, --output-path <outputPath>', '脚本输出路径，不指定此参数时则更新数据库')
  .description(`同步数据库架构及种子数据，本命令为方便开发测试而建立，不建议在生产环境中使用，
因为通过Sync更新的数据库后，将不能再使用迁移版本管理命令 'lubejs migrate update <migrate>'
进行更新，否则可能造成数据丢失！`)
  .action(async () => {
    const opts = migrateSync.opts();
    const cli = await initCli(migrate.opts());
    try {
      await cli.sync(opts?.outputPath);
    } catch (error) {
      errorHandler(error);
    } finally {
      await cli.dispose();
    }
  });

Program.parse(process.argv);
function errorHandler(error: any) {
  if (error instanceof Object) {
    console.error(error.message.red);
    console.error(error.stack);
  } else {
    console.error(error);
  }
}

