import { XObjectName } from "../core";

export function sortByDependency<T>(
  source: T[],
  dependencies: (item: T) => T[],
  throwOnCycle = false
): T[] {
  const sorted: T[] = [];
  const visited = new Set<T>();
  function visit(item: T) {
    if (!visited.has(item)) {
      visited.add(item);
      for (const dep of dependencies(item)) visit(dep);
      sorted.push(item);
    } else {
      if (throwOnCycle && !sorted.includes(item))
        throw new Error('Cyclic dependency found');
    }
  }

  for (const item of source) visit(item);
  return sorted;
}


/**
 * 对比是否是同一个表
 * 如果任何一个名称 不存在架构，均认为它们是有相同的架构
 * @param name1 架构
 * @param name2
 * @returns
 */
 export function isSameObject(
  name1: XObjectName,
  name2: XObjectName
): boolean {
  let schema1: string | undefined;
  let table1: string;
  let schema2: string | undefined;
  let table2: string;

  if (typeof name1 === 'object') {
    schema1 = name1.schema;
    table1 = name1.name;
  } else {
    table1 = name1;
  }

  if (typeof name2 === 'object') {
    schema2 = name2.schema;
    table2 = name2.name;
  } else {
    table2 = name2;
  }

  return (
    (schema1 === schema2 || schema1 === undefined || schema2 === undefined) &&
    table1 === table2
  );
}



export function assertAst(
  value: any,
  message: string = 'AST syntax error.'
): asserts value {
  if (!value) {
    throw new Error('AST syntax error:' + message);
  }
}
