import { Name, Scalar } from '../..';
import { isBinary } from '../../util';

// export function quoted(name: string): string {
//   return `[${name.replace(/\]/g, "]]")}]`;
// }

// export function namify(name: Name<string>): string {
//   if (typeof name === "string") return quoted(name);
//   return name
//     .reverse()
//     .map((node) => quoted(node))
//     .join(".");
// }

/**
 * 分组
 * @author jover Cao
 * @date 2019/11/28
 * @param {Object} array 数组
 * @param {Object} fn 分组依据函数
 */
export function groupBy<TItem, THeader>(
  array: TItem[],
  fn: (item: TItem) => THeader
): { header: THeader; list: TItem[] }[] {
  const groups: Record<string, any> = {};
  array.forEach(function (o) {
    const header = JSON.stringify(fn(o));
    groups[header] = groups[header] || [];
    groups[header].push(o);
  });

  return Object.keys(groups).map(function (group) {
    const header = JSON.parse(group);
    const list = groups[group];
    return {
      header,
      list,
    };
  });
}

/**
 * 通过模板参数创建一个SQL命令
 */
export function formatSql(
  arr: TemplateStringsArray,
  ...paramValues: any[]
): string {
  let sql: string = arr[0];
  for (let i = 0; i < arr.length - 1; i++) {
    sql += sqlifyLiteral(paramValues[i]);
    sql += arr[i + 1];
  }
  return sql;
}

/**
 * 编译字面量
 */
export function sqlifyLiteral(literal: Scalar): string {
  const value = literal;
  // 为方便JS，允许undefined进入，留给TS语法检查
  if (value === null || value === undefined) {
    return 'NULL';
  }

  const type = typeof value;

  if (type === 'string') {
    return this.compileString(value as string);
  }

  if (type === 'number' || type === 'bigint') {
    return value.toString(10);
  }

  if (type === 'boolean') {
    return this.compileBoolean(value as boolean);
  }

  if (value instanceof Date) {
    return this.compileDate(value);
  }
  if (isBinary(value)) {
    return '0x' + Buffer.from(value).toString('hex');
  }
  console.debug('unsupport constant value type:', value);
  throw new Error('unsupport constant value type:' + type);
}
