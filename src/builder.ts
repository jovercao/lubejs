/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Condition,
  Parameter,
  Document,
  Identifier,
  Statement,
  Expression,
  CompatibleExpression,
  Raw,
  ScalarType,
  RowObject,
  Name,
  Proxied,
  TableFuncInvoke,
  CompatibleCondition,
  Rowset,
  ProxiedRowset,
  Execute,
} from "./ast";
import {
  isExpression,
  isScalar,
  makeProxiedRowset,
} from "./util";

/**
 * not 查询条件运算
 */
export const not = Condition.not;
export const $not = Condition.not;

/**
 * 使用and关联多个查询条件
 * @static
 * @param conditions 要关联的查询条件列表
 * @returns  condition
 * @memberof SQL
 */
export const and = Condition.and;
export const $and = Condition.and;

/**
 * 使用or关联多个查询条件
 * @static
 * @param conditions 要关联的查询条件列表
 * @returns  condition
 * @memberof SQL
 */
export const or = Condition.or;
export const $or = Condition.or;

/**
 * exists语句
 * @static
 * @param select
 * @returns
 * @memberof SQL
 */
export const exists = Condition.exists;
export const $exists = Condition.exists;

export const exec = Statement.execute;
export const $exec = Statement.execute;

export const execute = Statement.execute;
export const $execute = Statement.execute;

export const when = Statement.when;
export const $when = Statement.when;

export const func = Identifier.func;
export const $function = Identifier.func;

// /**
//  * 分组查询条件
//  */
// export const group = Condition.bracket;
// export const $group = Condition.bracket;

/**
 * input 参数
 */
export const input = Parameter.input;
export const $input = Parameter.input;

/**
 * output参数
 */
export const output = Parameter.output;
export const $output = Parameter.output;

/**
 * 创建一个SELECT语句
 */
export const select = Statement.select;
export const $select = Statement.select;

/**
 * 创建一个字段
 */
export const field = Identifier.field;
export const $field = Identifier.field;

/**
 * 创建一个原始的SQL片段
 * 可以插入到SQL的任意位置
 * @param sql 原始SQL
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function raw(sql: string): any {
  return new Raw(sql);
}

export const $raw = raw;

/**
 * 创建一个SQL文档，包含多条SQL语句、
 * @param statements SQL语句
 */
export function doc(statements: Statement[]): Document
export function doc(...statements: Statement[]): Document
export function doc(...statements: Statement[] | [Statement[]]): Document {
  const lines = Array.isArray(statements[0]) ? statements[0] : statements as Statement[];
  return new Document(lines);
}

export const $doc = doc;

/**
 * 创建一个INSERT语句
 */
export const insert = Statement.insert;
export const $insert = Statement.insert;

export const $case = Statement.case;
export const $with = Statement.with;

/**
 * 创建一个UPDATE语句
 */
export const update = Statement.update;
export const $update = Statement.update;

/**
 * 内建标识符，不会被 [] 包裹，buildIn的别名
 * @param name
 */
export const builtIn = Identifier.builtIn;
export const $builtIn = Identifier.builtIn;

/**
 * 创建一个DELETE语句
 */
export const del = Statement.delete;
export const $del = Statement.delete;

/**
 * 删除语句
 */
export const $delete = Statement.delete;

/**
 * 星号
 */
export const star = Identifier.star;
export const $star = Identifier.star;

/**
 * 等效于star
 */
export const _ = Identifier.star;
export const $ = Identifier.star;

/**
 * 创建表对象，该对象是可代理的，可以直接以 . 运算符获取下一节点Identifier
 * @param name
 */
export const table = Identifier.table;
export const $table = Identifier.table;


// /**
//  * 创建一个可调用的表值函数
//  * @param names
//  */
// export function makeTableFunc<T extends RowObject,
//   A1 extends CompatibleExpression
// >(
//   name: Name<string>,
//   builtIn?: boolean
// ): (
//     arg1: A1
//   ) => ProxiedRowset<T>
// export function makeTableFunc<T extends RowObject,
//   A1 extends CompatibleExpression,
//   A2 extends CompatibleExpression
// >(
//   name: Name<string>,
//   builtIn?: boolean
// ): (
//     arg1: A1,
//     arg2: A2
//   ) => ProxiedRowset<T>
// export function makeTableFunc<T extends RowObject,
//   A1 extends CompatibleExpression,
//   A2 extends CompatibleExpression,
//   A3 extends CompatibleExpression
// >(
//   name: Name<string>,
//   builtIn?: boolean
// ): (
//     arg1: A1,
//     arg2: A2,
//     arg3: A3
//   ) => ProxiedRowset<T>
// export function makeTableFunc<T extends RowObject,
//   A1 extends CompatibleExpression,
//   A2 extends CompatibleExpression,
//   A3 extends CompatibleExpression,
//   A4 extends CompatibleExpression
// >(
//   name: Name<string>,
//   builtIn?: boolean
// ): (
//     arg1: A1,
//     arg2: A2,
//     arg3: A3,
//     arg4: A4
//   ) => ProxiedRowset<T>
// export function makeTableFunc<T extends RowObject,
//   A1 extends CompatibleExpression,
//   A2 extends CompatibleExpression,
//   A3 extends CompatibleExpression,
//   A4 extends CompatibleExpression,
//   A5 extends CompatibleExpression
// >(
//   name: Name<string>,
//   builtIn?: boolean
// ): (
//     arg1: A1,
//     arg2: A2,
//     arg3: A3,
//     arg4: A4,
//     arg5: A5
//   ) => ProxiedRowset<T>
// export function makeTableFunc<T extends RowObject>(
//   name: Name<string>,
//   builtIn?: boolean
// ): (
//     ...args: CompatibleExpression[]
//   ) => ProxiedRowset<T>

// export function makeTableFunc<T extends RowObject>(
//   name: Name<string>,
//   builtIn = false
// ): (
//     ...args: CompatibleExpression[]
//   ) => ProxiedRowset<T> {
//   return function (
//     ...args: CompatibleExpression[]
//   ): ProxiedRowset<T> {
//     return Statement.invokeTableFunction<T>(Identifier.func(name, builtIn), args);
//   };
// }

// /**
// * 创建一个可调用的标量函数
// * @param names
// */
// export function sfunc<T extends ScalarType,
//   A1 extends CompatibleExpression,
//   A2 extends CompatibleExpression,
//   A3 extends CompatibleExpression,
//   A4 extends CompatibleExpression,
//   A5 extends CompatibleExpression
// >(
//   name: Name<string>,
//   builtIn?: boolean
// ): (
//     arg1: A1,
//     arg2: A2,
//     arg3: A3,
//     arg4: A4,
//     arg5: A5
//   ) => Expression<T>
// export function sfunc<T extends ScalarType,
//   A1 extends CompatibleExpression,
//   A2 extends CompatibleExpression,
//   A3 extends CompatibleExpression,
//   A4 extends CompatibleExpression,
//   A5 extends CompatibleExpression
// >(
//   name: Name<string>,
//   builtIn?: boolean
// ): (
//     arg1: A1,
//     arg2: A2,
//     arg3: A3,
//     arg4: A4,
//     arg5: A5
//   ) => Expression<T>
// export function sfunc<T extends ScalarType,
//   A1 extends CompatibleExpression,
//   A2 extends CompatibleExpression,
//   A3 extends CompatibleExpression,
//   A4 extends CompatibleExpression,
//   A5 extends CompatibleExpression
// >(
//   name: Name<string>,
//   builtIn?: boolean
// ): (
//     arg1: A1,
//     arg2: A2,
//     arg3: A3,
//     arg4: A4,
//     arg5: A5
//   ) => Expression<T>
// export function sfunc<T extends ScalarType,
//   A1 extends CompatibleExpression,
//   A2 extends CompatibleExpression,
//   A3 extends CompatibleExpression,
//   A4 extends CompatibleExpression,
//   A5 extends CompatibleExpression
// >(
//   name: Name<string>,
//   builtIn?: boolean
// ): (
//     arg1: A1,
//     arg2: A2,
//     arg3: A3,
//     arg4: A4,
//     arg5: A5
//   ) => Expression<T>
// export function sfunc<T extends ScalarType,
//   A1 extends CompatibleExpression,
//   A2 extends CompatibleExpression,
//   A3 extends CompatibleExpression,
//   A4 extends CompatibleExpression,
//   A5 extends CompatibleExpression
// >(
//   name: Name<string>,
//   builtIn?: boolean
// ): (
//     arg1: A1,
//     arg2: A2,
//     arg3: A3,
//     arg4: A4,
//     arg5: A5
//   ) => Expression<T>
// export function sfunc<T extends ScalarType>(
//   name: Name<string>,
//   builtIn = false
// ): (...args: CompatibleExpression<ScalarType>[]) => Expression<T> {
//   return function (...args: CompatibleExpression<ScalarType>[]): Expression<T> {
//     return Statement.invokeScalarFunction<T>(
//       Identifier.func(name, builtIn),
//       args
//     );
//   };
// }

export function makeFunc<
  T extends RowObject
>(
  type: 'table',
  name: Name<string>,
  builtIn?: boolean
): () => ProxiedRowset<T>
export function makeFunc<
  T extends RowObject,
  A1 extends CompatibleExpression
>(
  type: 'table',
  name: Name<string>,
  builtIn?: boolean
): (
    arg1: A1
  ) => ProxiedRowset<T>
export function makeFunc<
  T extends RowObject,
  A1 extends CompatibleExpression,
  A2 extends CompatibleExpression
>(
  type: 'table',
  name: Name<string>,
  builtIn?: boolean
): (
    arg1: A1,
    arg2: A2
  ) => ProxiedRowset<T>
export function makeFunc<
  T extends RowObject,
  A1 extends CompatibleExpression,
  A2 extends CompatibleExpression,
  A3 extends CompatibleExpression
>(
  type: 'table',
  name: Name<string>,
  builtIn?: boolean
): (
    arg1: A1,
    arg2: A2,
    arg3: A3
  ) => ProxiedRowset<T>
export function makeFunc<
  T extends RowObject,
  A1 extends CompatibleExpression,
  A2 extends CompatibleExpression,
  A3 extends CompatibleExpression,
  A4 extends CompatibleExpression
>(
  type: 'table',
  name: Name<string>,
  builtIn?: boolean
): (
    arg1: A1,
    arg2: A2,
    arg3: A3,
    arg4: A4
  ) => ProxiedRowset<T>
export function makeFunc<
  T extends RowObject,
  A1 extends CompatibleExpression,
  A2 extends CompatibleExpression,
  A3 extends CompatibleExpression,
  A4 extends CompatibleExpression,
  A5 extends CompatibleExpression
>(
  type: 'table',
  name: Name<string>,
  builtIn?: boolean
): (
    arg1: A1,
    arg2: A2,
    arg3: A3,
    arg4: A4,
    arg5: A5
  ) => ProxiedRowset<T>


export function makeFunc(
  type: 'table',
  name: Name<string>,
  builtIn?: boolean
): (
    ...args: CompatibleExpression[]
  ) => ProxiedRowset<any>

export function makeFunc<
  T extends ScalarType
>(
  type: 'scalar',
  name: Name<string>,
  builtIn?: boolean
): () => Expression<T>
export function makeFunc<
  T extends ScalarType,
  A1 extends CompatibleExpression
>(
  type: 'scalar',
  name: Name<string>,
  builtIn?: boolean
): (
    arg1: A1
  ) => Expression<T>
export function makeFunc<
  T extends ScalarType,
  A1 extends CompatibleExpression,
  A2 extends CompatibleExpression
>(
  type: 'scalar',
  name: Name<string>,
  builtIn?: boolean
): (
    arg1: A1,
    arg2: A2
  ) => Expression<T>
export function makeFunc<
  T extends ScalarType,
  A1 extends CompatibleExpression,
  A2 extends CompatibleExpression,
  A3 extends CompatibleExpression
>(
  type: 'scalar',
  name: Name<string>,
  builtIn?: boolean
): (
    arg1: A1,
    arg2: A2,
    arg3: A3
  ) => Expression<T>
export function makeFunc<
  T extends ScalarType,
  A1 extends CompatibleExpression,
  A2 extends CompatibleExpression,
  A3 extends CompatibleExpression,
  A4 extends CompatibleExpression
>(
  type: 'scalar',
  name: Name<string>,
  builtIn?: boolean
): (
    arg1: A1,
    arg2: A2,
    arg3: A3,
    arg4: A4
  ) => Expression<T>
export function makeFunc<
  T extends ScalarType,
  A1 extends CompatibleExpression,
  A2 extends CompatibleExpression,
  A3 extends CompatibleExpression,
  A4 extends CompatibleExpression,
  A5 extends CompatibleExpression
>(
  type: 'scalar',
  name: Name<string>,
  builtIn?: boolean
): (
    arg1: A1,
    arg2: A2,
    arg3: A3,
    arg4: A4,
    arg5: A5
  ) => Expression<T>


export function makeFunc(
  type: 'scalar',
  name: Name<string>,
  builtIn?: boolean
): (
    ...args: CompatibleExpression[]
  ) => Expression<any>

export function makeFunc(
  type: 'table' | 'scalar',
  name: Name<string>,
  builtIn = false
): (...args: CompatibleExpression[]) => Expression | ProxiedRowset<RowObject> {
  if (type === 'table') {
    return function (
      ...args: CompatibleExpression[]
    ): ProxiedRowset<RowObject> {
      return Statement.invokeTableFunction(Identifier.func(name, builtIn), args);
    }
  }
  if (type === 'scalar') {
    return function (...args: CompatibleExpression<ScalarType>[]): Expression {
      return Statement.invokeScalarFunction<ScalarType>(
        Identifier.func(name, builtIn),
        args
      );
    };
  }
  throw new Error('invalid arg value of `type`');
}


export const proc = Identifier.proc;
export const $proc = Identifier.proc;

export const procedure = Identifier.proc;
export const $procedure = Identifier.proc;

/**
 * 创建一个可供JS调用的存储过程
 */
export function makeProc<
  R extends ScalarType = number,
  O extends RowObject[] = [],
  >(
    name: Name<string>,
    builtIn?: boolean
  ): () => Execute<R, O>
export function makeProc<
  A1 extends CompatibleExpression,
  R extends ScalarType = number,
  O extends RowObject[] = [],
  >(
    name: Name<string>,
    builtIn?: boolean
  ): (
    arg1: A1
  ) => Execute<R, O>
export function makeProc<
  A1 extends CompatibleExpression,
  A2 extends CompatibleExpression,
  R extends ScalarType = number,
  O extends RowObject[] = [],
  >(
    name: Name<string>,
    builtIn?: boolean
  ): (
    arg1: A1,
    arg2: A2
  ) => Execute<R, O>
export function makeProc<
  A1 extends CompatibleExpression,
  A2 extends CompatibleExpression,
  A3 extends CompatibleExpression,
  R extends ScalarType = number,
  O extends RowObject[] = [],
  >(
    name: Name<string>,
    builtIn?: boolean
  ): (
    arg1: A1,
    arg2: A2,
    arg3: A3
  ) => Execute<R, O>
export function makeProc<
  A1 extends CompatibleExpression,
  A2 extends CompatibleExpression,
  A3 extends CompatibleExpression,
  A4 extends CompatibleExpression,
  R extends ScalarType = number,
  O extends RowObject[] = [],
  >(
    name: Name<string>,
    builtIn?: boolean
  ): (
    arg1: A1,
    arg2: A2,
    arg3: A3,
    arg4: A4
  ) => Execute<R, O>
export function makeProc<
  A1 extends CompatibleExpression,
  A2 extends CompatibleExpression,
  A3 extends CompatibleExpression,
  A4 extends CompatibleExpression,
  A5 extends CompatibleExpression,
  R extends ScalarType = number,
  O extends RowObject[] = [],
  >(
    name: Name<string>,
    builtIn?: boolean
  ): (
    arg1: A1,
    arg2: A2,
    arg3: A3,
    arg4: A4,
    arg5: A5
  ) => Execute<R, O>


export function makeProc(
  name: Name<string>,
  builtIn?: boolean
): (
    ...args: CompatibleExpression[]
  ) => Expression<any>

export function makeProc(
  name: Name<string>,
  builtIn = false
): (...args: CompatibleExpression[]) => void {
  return function (...args: CompatibleExpression<ScalarType>[]): Execute<any, any> {
    return Statement.execute(
      Identifier.proc<ScalarType, any, string>(name, builtIn),
      args
    );
  };
}

export const literal = Expression.literal;
export const $literal = Expression.literal;

export const val = Expression.literal;
export const $val = Expression.literal;

export const value = Expression.literal;
export const $value = Expression.literal;

export const variant = Identifier.var;
export const $variant = Identifier.var;

export const union = Statement.union;
export const $union = Statement.union;

export const unionAll = Statement.unionAll;
export const $unionAll = Statement.unionAll;

export const add = Expression.add;
export const div = Expression.div;
export const mul = Expression.mul;
export const sub = Expression.sub;
export const bitAnd = Expression.and;
export const bitOr = Expression.or;
export const bitXor = Expression.xor;
export const shl = Expression.shl;
export const shr = Expression.shr;
export const bitNot = Expression.not;
export const neg = Expression.neg;
export const mod = Expression.mod;
/**
 * 字符串连接运算
 */
export const concat = Expression.concat;

export const $add = Expression.add;
export const $div = Expression.div;
export const $mul = Expression.mul;
export const $sub = Expression.sub;
export const $bitAnd = Expression.and;
export const $bitOr = Expression.or;
export const $bitXor = Expression.xor;
export const $shl = Expression.shl;
export const $shr = Expression.shr;
export const $bitNot = Expression.not;
export const $neg = Expression.neg;
export const $mod = Expression.mod;
export const $concat = Expression.concat;

/**
 * 为表达式或者查询条件添加括号
 */
export function enclose<T extends CompatibleExpression | CompatibleCondition>(
  exprOrCondition: T
): T extends CompatibleExpression<infer S> ? Expression<S> : Condition {
  if (isScalar(exprOrCondition) || isExpression(exprOrCondition)) {
    return Expression.enclose(exprOrCondition) as any;
  }
  return Condition.enclose(exprOrCondition as CompatibleCondition) as any;
}
export const $enclose = enclose;

/**
 * 类型转换运算
 */
export const convert = Expression.convert;

/**
 * 语句
 */
export const SQL = {
  /**
   * alias of `literal`
   */
  val,
  /**
   * alias of `literal`
   */
  value,
  /**
   * literal value.
   */
  literal,
  /**
   * select statement
   */
  select,
  /**
   * insert statement
   */
  insert,
  /**
   * update statement
   */
  update,
  /**
   * delete statement
   */
  delete: Statement.delete,
  /**
   * alias of del
   */
  del,
  /**
   * case expression
   */
  case: $case,
  with: $with,
  makeFunc,
  execute,
  exec,
  proc,
  procedure,
  when,
  exists,
  union,
  unionAll,
  builtIn,
  table,
  field,
  input,
  output,
  and,
  or,
  variant,
  var: variant,
  // group,
  raw,
  add,
  div,
  mul,
  sub,
  bitAnd,
  bitOr,
  bitXor,
  shl,
  shr,
  bitNot,
  neg,
  mod,
  concat,
  enclose,
  convert,
};

export default SQL;
