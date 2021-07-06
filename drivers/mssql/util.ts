import { Scalar, isBinary, Uuid, Decimal } from 'lubejs';

// export function quoted(name: string): string {
//   return `[${name.replace(/\]/g, "]]")}]`;
// }

// export function namify(name: Name): string {
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

// function fixNum(num: number, digits: number): string {
//   return num.toString().padStart(digits, '0');
// }

// export function dateToString(date: Date): string {
//   return `${date.getFullYear()}-${fixNum(date.getMonth() + 1, 2)}-${fixNum(
//     date.getDate(),
//     2
//   )}T${fixNum(date.getHours(), 2)}:${fixNum(date.getMinutes(), 2)}:${fixNum(
//     date.getSeconds(),
//     2
//   )}.${fixNum(date.getMilliseconds(), 3)}${
//     date.getTimezoneOffset() > 0 ? '-' : '+'
//   }${fixNum(Math.abs(date.getTimezoneOffset() / 60), 2)}:00`;
// }

/**
 * 编译字面量
 */
export function sqlifyLiteral(value: Scalar): string {
  // 为方便JS，允许undefined进入，留给TS语法检查
  if (value === null || value === undefined) {
    return 'NULL';
  }

  const type = typeof value;

  if (type === 'string') {
    return "'" + (value as string).replace(/'/g, "''") + "'";
  }

  if (type === 'number' || type === 'bigint') {
    return value.toString(10);
  }

  if (type === 'boolean') {
    return value ? '1' : '0';
  }

  if (value instanceof Date) {
    return `CONVERT(DATETIMEOFFSET(7), '${value.toISOString()}')`;
  }

  if (value instanceof Uuid) {
    return `CONVERT(UNIQUEIDENTIFIER, '${value.toString()}')`;
  }

  if (value instanceof Decimal) {
    return value.toString();
  }

  if (isBinary(value)) {
    return '0x' + Buffer.from(value).toString('hex');
  }
  throw new Error(`unsupport constant value type: ${type}, value: ${value}`);
}
