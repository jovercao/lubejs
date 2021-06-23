/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Condition,
  Parameter,
  Document,
  Identifier,
  Statement,
  Expression,
  CompatibleExpression,
  CompatibleCondition,
  CreateTable,
  AlterTable,
  CreateFunction,
  AlterFunction,
  AlterProcedure,
  AlterView,
  Annotation,
  AnnotationKind,
  Assignable,
  Assignment,
  Block,
  Case,
  CompatibleNamedSelect,
  CompatibleTable,
  CreateIndex,
  CreateProcedure,
  CreateView,
  Declare,
  Delete,
  DropFunction,
  DropIndex,
  DropProcedure,
  DropTable,
  DropView,
  Execute,
  Field,
  FieldsOf,
  Func,
  Insert,
  Procedure,
  ProxiedRowset,
  ScalarFuncInvoke,
  Select,
  SelectAction,
  TableVariantDeclare,
  Update,
  VariantDeclare,
  When,
  With,
  DeclareBuilder,
  // IdentityValue
} from './ast';
import { isExpression, isScalar } from './util';
import * as std from './std';
import { RowObject, Scalar, Name } from '.';

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
export const raw = Statement.raw;

export const $raw = raw;

/**
 * 创建一个SQL文档，包含多条SQL语句、
 * @param statements SQL语句
 */
export function doc(statements: Statement[]): Document;
export function doc(...statements: Statement[]): Document;
export function doc(...statements: Statement[] | [Statement[]]): Document {
  const lines = Array.isArray(statements[0])
    ? statements[0]
    : (statements as Statement[]);
  return new Document(lines);
}

export const $doc = doc;

/**
 * 创建一个INSERT语句
 */
export const insert = Statement.insert;
export const $insert = Statement.insert;

export const identityInsert = Statement.identityInsert;
export const $identityInsert = Statement.identityInsert;

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
//   name: Name,
//   builtIn?: boolean
// ): (
//     arg1: A1
//   ) => ProxiedRowset<T>
// export function makeTableFunc<T extends RowObject,
//   A1 extends CompatibleExpression,
//   A2 extends CompatibleExpression
// >(
//   name: Name,
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
//   name: Name,
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
//   name: Name,
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
//   name: Name,
//   builtIn?: boolean
// ): (
//     arg1: A1,
//     arg2: A2,
//     arg3: A3,
//     arg4: A4,
//     arg5: A5
//   ) => ProxiedRowset<T>
// export function makeTableFunc<T extends RowObject>(
//   name: Name,
//   builtIn?: boolean
// ): (
//     ...args: CompatibleExpression[]
//   ) => ProxiedRowset<T>

// export function makeTableFunc<T extends RowObject>(
//   name: Name,
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
//   name: Name,
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
//   name: Name,
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
//   name: Name,
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
//   name: Name,
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
//   name: Name,
//   builtIn?: boolean
// ): (
//     arg1: A1,
//     arg2: A2,
//     arg3: A3,
//     arg4: A4,
//     arg5: A5
//   ) => Expression<T>
// export function sfunc<T extends ScalarType>(
//   name: Name,
//   builtIn = false
// ): (...args: CompatibleExpression<ScalarType>[]) => Expression<T> {
//   return function (...args: CompatibleExpression<ScalarType>[]): Expression<T> {
//     return Statement.invokeScalarFunction<T>(
//       Identifier.func(name, builtIn),
//       args
//     );
//   };
// }

export const makeInvoke = Statement.makeInvoke;

export const proc = Identifier.proc;
export const $proc = Identifier.proc;

export const procedure = Identifier.proc;
export const $procedure = Identifier.proc;

export const makeExec = Statement.makeExec;

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
export const band = Expression.and;
export const bor = Expression.or;
export const bxor = Expression.xor;
export const shl = Expression.shl;
export const shr = Expression.shr;
export const bnot = Expression.not;
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

export const createTableMemberBuilder = CreateTable.memberBuilder;
export const alterTableAddBuilder = AlterTable.addBuilder;
export const alterTableDropBuilder = AlterTable.dropBuilder;

export interface SqlBuilder extends std.Standard {
  /**
   * 插入至表,into的别名
   * @param table
   * @param fields
   */
  insert<T extends RowObject = any>(
    table: CompatibleTable<T, string>,
    fields?: FieldsOf<T>[] | Field<Scalar, FieldsOf<T>>[]
  ): Insert<T>;

  /**
   * 插入至表,into的别名
   * @param table
   * @param fields
   */
  identityInsert<T extends RowObject = any>(
    table: CompatibleTable<T, string>,
    fields?: FieldsOf<T>[] | Field<Scalar, FieldsOf<T>>[]
  ): Insert<T>;

  /**
   * 更新一个表格
   * @param table
   */
  update<T extends RowObject = any>(
    table: CompatibleTable<T, string>
  ): Update<T>;

  /**
   * 删除一个表格
   * @param table 表格
   */
  delete<T extends RowObject = any>(
    table: CompatibleTable<T, string>
  ): Delete<T>;

  select: SelectAction;

  raw(sql: string): any;

  block(statements: Statement[]): Block;

  /**
   * 执行一个存储过程
   * @param proc
   * @param params
   */
  // execute<T extends Model> (
  //   proc: Name | Procedure<T, string>,
  //   params?: Expressions<JsConstant>[]
  // ): Execute<T>
  // execute<T extends Model> (
  //   proc: Name | Procedure<T, string>,
  //   params?: InputObject
  // ): Execute<T>
  execute<R extends Scalar = any, O extends RowObject[] = []>(
    proc: Name | Procedure<R, O, string>,
    params?: CompatibleExpression<Scalar>[]
    // | Parameter<JsConstant, string>[] | InputObject
  ): Execute<R, O>;

  invokeTableFunction<T extends RowObject = any>(
    func: Name | Func<string>,
    args: CompatibleExpression<Scalar>[]
  ): ProxiedRowset<T>;

  invokeScalarFunction<T extends Scalar = any>(
    func: Name | Func<string>,
    args: CompatibleExpression<Scalar>[]
  ): ScalarFuncInvoke<T>;

  /**
   * 赋值语句
   * @param left 左值
   * @param right 右值
   */
  assign<T extends Scalar = any>(
    left: Assignable<T>,
    right: CompatibleExpression<T>
  ): Assignment<T>;

  /**
   * 变量声明
   * @param declares 变量列表
   */
  declare(
    build: (builder: DeclareBuilder) => (VariantDeclare | TableVariantDeclare)[]
  ): Declare;

  /**
   * WHEN 语句块
   * @param expr
   * @param value
   */
  when<T extends Scalar>(
    expr: CompatibleExpression<Scalar>,
    value?: CompatibleExpression<T>
  ): When<T>;

  case<T extends Scalar>(expr?: CompatibleExpression): Case<T>;

  /**
   * With语句
   */
  with(...rowsets: CompatibleNamedSelect[]): With;
  with(rowsets: Record<string, Select>): With;
  with(...rowsets: any): With;

  union<T extends RowObject = any>(...selects: Select<T>[]): Select<T>;

  unionAll<T extends RowObject = any>(...selects: Select<T>[]): Select<T>;

  invoke<T extends RowObject>(
    type: 'table',
    name: Name,
    builtIn?: boolean
  ): () => ProxiedRowset<T>;
  invoke<T extends RowObject, A1 extends CompatibleExpression>(
    type: 'table',
    name: Name,
    builtIn?: boolean
  ): (arg1: A1) => ProxiedRowset<T>;
  invoke<
    T extends RowObject,
    A1 extends CompatibleExpression,
    A2 extends CompatibleExpression
  >(
    type: 'table',
    name: Name,
    builtIn?: boolean
  ): (arg1: A1, arg2: A2) => ProxiedRowset<T>;
  invoke<
    T extends RowObject,
    A1 extends CompatibleExpression,
    A2 extends CompatibleExpression,
    A3 extends CompatibleExpression
  >(
    type: 'table',
    name: Name,
    builtIn?: boolean
  ): (arg1: A1, arg2: A2, arg3: A3) => ProxiedRowset<T>;
  invoke<
    T extends RowObject,
    A1 extends CompatibleExpression,
    A2 extends CompatibleExpression,
    A3 extends CompatibleExpression,
    A4 extends CompatibleExpression
  >(
    type: 'table',
    name: Name,
    builtIn?: boolean
  ): (arg1: A1, arg2: A2, arg3: A3, arg4: A4) => ProxiedRowset<T>;
  invoke<
    T extends RowObject,
    A1 extends CompatibleExpression,
    A2 extends CompatibleExpression,
    A3 extends CompatibleExpression,
    A4 extends CompatibleExpression,
    A5 extends CompatibleExpression
  >(
    type: 'table',
    name: Name,
    builtIn?: boolean
  ): (arg1: A1, arg2: A2, arg3: A3, arg4: A4, arg5: A5) => ProxiedRowset<T>;

  invoke(
    type: 'table',
    name: Name,
    builtIn?: boolean
  ): (...args: CompatibleExpression[]) => ProxiedRowset<any>;

  invoke<T extends Scalar>(
    type: 'scalar',
    name: Name,
    builtIn?: boolean
  ): () => Expression<T>;
  invoke<T extends Scalar, A1 extends CompatibleExpression>(
    type: 'scalar',
    name: Name,
    builtIn?: boolean
  ): (arg1: A1) => Expression<T>;
  invoke<
    T extends Scalar,
    A1 extends CompatibleExpression,
    A2 extends CompatibleExpression
  >(
    type: 'scalar',
    name: Name,
    builtIn?: boolean
  ): (arg1: A1, arg2: A2) => Expression<T>;
  invoke<
    T extends Scalar,
    A1 extends CompatibleExpression,
    A2 extends CompatibleExpression,
    A3 extends CompatibleExpression
  >(
    type: 'scalar',
    name: Name,
    builtIn?: boolean
  ): (arg1: A1, arg2: A2, arg3: A3) => Expression<T>;
  invoke<
    T extends Scalar,
    A1 extends CompatibleExpression,
    A2 extends CompatibleExpression,
    A3 extends CompatibleExpression,
    A4 extends CompatibleExpression
  >(
    type: 'scalar',
    name: Name,
    builtIn?: boolean
  ): (arg1: A1, arg2: A2, arg3: A3, arg4: A4) => Expression<T>;
  invoke<
    T extends Scalar,
    A1 extends CompatibleExpression,
    A2 extends CompatibleExpression,
    A3 extends CompatibleExpression,
    A4 extends CompatibleExpression,
    A5 extends CompatibleExpression
  >(
    type: 'scalar',
    name: Name,
    builtIn?: boolean
  ): (arg1: A1, arg2: A2, arg3: A3, arg4: A4, arg5: A5) => Expression<T>;

  invoke(
    type: 'scalar',
    name: Name,
    builtIn?: boolean
  ): (...args: CompatibleExpression[]) => Expression<any>;

  invoke(
    type: 'table' | 'scalar',
    name: Name,
    builtIn?: boolean
  ): (...args: CompatibleExpression[]) => Expression | ProxiedRowset<RowObject>;

  /**
   * 创建表格
   * @param name
   * @param members
   * @returns
   */
  createTable<N extends string>(name: Name<N>): CreateTable<N>;

  alterTable<N extends string>(name: Name<N>): AlterTable<N>;

  createView<T extends RowObject = any, N extends string = string>(
    name: Name<N>
  ): CreateView<T, N>;

  alterView<T extends RowObject = any, N extends string = string>(
    name: Name<N>
  ): AlterView<T, N>;

  createIndex(name: string): CreateIndex;

  createProcedure(name: string): CreateProcedure;

  alterProcedure(name: string): AlterProcedure;

  createScalarFunction(name: Name): CreateFunction;

  createTableFunction(name: Name): CreateFunction;

  alterScalarFunction(name: Name): AlterFunction;

  alterTableFunction(name: Name): AlterFunction;

  dropTable<N extends string>(name: Name<N>): DropTable<N>;

  dropView<N extends string>(name: Name<N>): DropView<N>;

  dropProcedure<N extends string>(name: Name<N>): DropProcedure<N>;

  dropFunction<N extends string>(name: Name<N>): DropFunction<N>;

  dropIndex<N extends string>(table: Name, name: N): DropIndex<N>;

  annotation(text: string, kind?: AnnotationKind): Annotation;
}

export const sqlBuilder: SqlBuilder = {
  insert: Statement.insert,
  identityInsert: Statement.identityInsert,
  update: Statement.update,
  delete: Statement.delete,
  select: Statement.select,
  raw: Statement.raw,
  block: Statement.block,
  execute: Statement.execute,
  invokeTableFunction: Statement.invokeTableFunction,
  invokeScalarFunction: Statement.invokeScalarFunction,
  assign: Statement.assign,
  declare: Statement.declare,
  when: Statement.when,
  case: Statement.case,
  with: Statement.with,
  union: Statement.union,
  unionAll: Statement.unionAll,
  invoke: Statement.invoke,
  createTable: Statement.createTable,
  alterTable: Statement.alterTable,
  createView: Statement.createView,
  alterView: Statement.alterView,
  createIndex: Statement.createIndex,
  createProcedure: Statement.createProcedure,
  alterProcedure: Statement.alterProcedure,
  createScalarFunction: Statement.createScalarFunction,
  createTableFunction: Statement.createTableFunction,
  alterScalarFunction: Statement.alterScalarFunction,
  alterTableFunction: Statement.alterTableFunction,
  dropTable: Statement.dropTable,
  dropView: Statement.dropView,
  dropProcedure: Statement.dropProcedure,
  dropFunction: Statement.dropFunction,
  dropIndex: Statement.dropIndex,
  annotation: Statement.annotation,
  ...std.std,
};

export * from './std';

export default sqlBuilder;
