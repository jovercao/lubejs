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
export const doc = function (...statements: Statement[]): Document {
  return new Document(...statements);
};
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

/**
 * 表值函数
 * @param names
 */
export function tableFn<T extends RowObject>(
  name: Name<string>,
  builtIn = false
): (
  ...args: CompatibleExpression<ScalarType>[]
) => Proxied<TableFuncInvoke<T>> {
  return function (
    ...args: CompatibleExpression<ScalarType>[]
  ): Proxied<TableFuncInvoke<T>> {
    return makeProxiedRowset(
      Statement.invokeTableFunction<T>(Identifier.func(name, builtIn), args)
    );
  };
}

export const $tableFn = tableFn;

/**
 * 表值函数
 * @param names
 */
export function scalarFunction<T extends ScalarType>(
  name: Name<string>,
  builtIn = false
): (...args: CompatibleExpression<ScalarType>[]) => Expression<T> {
  return function (...args: CompatibleExpression<ScalarType>[]): Expression<T> {
    return Statement.invokeScalarFunction<T>(
      Identifier.func(name, builtIn),
      args
    );
  };
}
export const $scalarFunction = scalarFunction;

export const scalarFunc = scalarFunction;
export const $scalarFunc = scalarFunction;

export const scalarFn = scalarFunction;
export const $scalarFn = scalarFunction;

export const proc = Identifier.proc;
export const $proc = Identifier.proc;

export const procedure = Identifier.proc;
export const $procedure = Identifier.proc;

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
  delete: $delete,
  /**
   * alias of del
   */
  del,
  /**
   * case expression
   */
  case: $case,
  with: $with,
  tableFn,
  scalarFn,
  scalarFunc,
  scalarFunction,
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
};

export default SQL;

/**
 * 类型转换运算
 */
export const convert = Expression.convert;
