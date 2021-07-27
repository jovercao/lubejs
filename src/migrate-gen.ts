import { generateUpdatePrograme } from './migrate-scripter'
import {
  DatabaseSchema,
} from './schema';
import { SqlUtil } from './sql-util';
import { DbType } from './types';

// TODO: 可空约束名称处理
// TODO: 文本缩进美化处理

// const INDENT = '  ';

// function nestIndent(indent: string): string {
//   return indent + INDENT;
// }

// 架构创建顺序 Table(按依赖顺序) -> [Column, Constraint, Index] -> ForeignKey

// 架构删除顺序 ForeignKey -> [Column, Constraint, Index] -> Table(按依赖顺序);

/**
 * 生成迁移文件代码
 * @param name
 * @param source
 * @param target
 * @param metadata
 * @returns
 */
export function generateMigrate(
  name: string,
  source: DatabaseSchema,
  target: DatabaseSchema | undefined,
  sqlUtil: SqlUtil,
  resolverType?: (rawType: string) => DbType
): string {

  const upCodes = generateUpdatePrograme(source, target, sqlUtil);

  const downCodes = generateUpdatePrograme(target, source, sqlUtil);

  return generateMigrateClass(name, upCodes, downCodes);
  // 勿删，此代码另有用处
  // const findTargetForeignKey = (
  //   finder: (table: Name, fk: ForeignKeySchema) => boolean
  // ): { table: Name; foreignKey: ForeignKeySchema } => {
  //   let result: { table: Name; foreignKey: ForeignKeySchema };
  //   target.tables.find(({ name: table, foreignKeys }) =>
  //     foreignKeys.find(fk => {
  //       if (finder(table, fk)) {
  //         result = {
  //           table,
  //           foreignKey: fk,
  //         };
  //         return true;
  //       }
  //     })
  //   );
  //   return result;
  // };
}

export function generateMigrateClass(
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
