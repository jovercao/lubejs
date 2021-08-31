import {
  CompatibleCondition,
  Condition,
  LOGIC_OPERATOR,
} from './ast/condition/condition';
import { BinaryCompareCondition } from './ast/condition/binary-compare-condition';
import { ExistsCondition } from './ast/condition/exists-condition';
import { GroupCondition } from './ast/condition/group-condition';
import { UnaryCompareCondition } from './ast/condition/unary-compare-condition';
import { UnaryLogicCondition } from './ast/condition/unary-logic-condition';
import { DbType, DbTypeOf, TsTypeOf } from './ast/db-type';
import { Document } from './ast/document';
import { CompatibleExpression, Expression } from './ast/expression/expression';
import { BinaryOperation } from './ast/expression/binary-operation';
import { Case } from './ast/expression/case';
import { Assignable } from './ast/expression/common/assignable';
import { Field } from './ast/expression/field';
import { GroupExpression } from './ast/expression/group-expression';
import { Parameter } from './ast/expression/parameter';
import { UnaryOperation } from './ast/expression/unary-operation';
import { Variant } from './ast/expression/variant';
import { BuiltIn } from './ast/object/built-in';
import { CompatiableObjectName } from './ast/object/db-object';
import { Func } from './ast/object/func';
import { Procedure } from './ast/object/procedure';
import { Raw } from './ast/raw';
import { CompatibleRowset, ProxiedRowset } from './ast/rowset/rowset';
import { CompatibleTable, ProxiedTable, Table } from './ast/rowset/table';
import { WithSelect } from './ast/rowset/with-select';
import { Interger, Numeric, Scalar } from './ast/scalar';
import { isScalar } from './ast/scalar/util';
import { Standard } from './ast/stanrard';
import { Statement } from './ast/statement/statement';
import { Annotation } from './ast/statement/other/annotation';
import { Block } from './ast/statement/control/block';
import { While } from './ast/statement/control/while';
import { SelectAction } from './ast/statement/crud/common/select-action';
import { Delete } from './ast/statement/crud/delete';
import { Insert } from './ast/statement/crud/insert';
import { Star } from './ast/statement/crud/star';
import { Update } from './ast/statement/crud/update';
import { Declare } from './ast/statement/declare';
import { DeclareBuilder } from './ast/statement/declare/declare-builder';
import { AlterFunction } from './ast/statement/migrate/alter-function';
import { AlterProcedure } from './ast/statement/migrate/alter-procedure';
import { AlterTable, CreateView } from './ast/statement/migrate/alter-table';
import { AlterView } from './ast/statement/migrate/alter-view';
import { CreateFunction } from './ast/statement/migrate/create-function';
import { CreateIndex } from './ast/statement/migrate/create-index';
import { CreateProcedure } from './ast/statement/migrate/create-procedure';
import {
  CreateTable,
  CreateTableHandler,
} from './ast/statement/migrate/create-table';
import { CreateTableMemberBuilder } from './ast/statement/migrate/create-table-member-builder';
import { DropFunction } from './ast/statement/migrate/drop-function';
import { DropIndex } from './ast/statement/migrate/drop-index';
import { DropProcedure } from './ast/statement/migrate/drop-procedure';
import { DropTable } from './ast/statement/migrate/drop-table';
import { DropView } from './ast/statement/migrate/drop-view';
import { Assignment } from './ast/statement/programmer/assignment';
import { Execute } from './ast/statement/programmer/execute';
import { ScalarFuncInvoke } from './ast/statement/programmer/scalar-func-invoke';
import { TableFuncInvoke } from './ast/statement/programmer/table-func-invoke';
import { TableVariantDeclare } from './ast/statement/declare/table-variant-declare';
import { VariantDeclare } from './ast/statement/declare/variant-declare';
import { When } from './ast/expression/when';
import { With } from './ast/statement/crud/with';
import { ColumnsOf, RowObject } from './ast/types';
import { isPlainObject } from './ast/util';
import { AlterDatabase } from './ast/statement/migrate/alter-database';
import { DropDatabase } from './ast/statement/migrate/drop-database';
import { CreateDatabase } from './ast/statement/migrate/create-database';
import { DropSequence } from './ast/statement/migrate/drop-sequence';
import { CreateSequence } from './ast/statement/migrate/create-sequence';
import { Use } from './ast/statement/migrate/use';
import { Break } from './ast/statement/control/break';
import { Continue } from './ast/statement/control/continue';
import { If } from './ast/statement/control/if';
import { Select } from './ast/statement/crud/select';
import { Literal } from './ast/expression/literal';

export interface SqlBuilder extends Standard {
  // throw(errorMsg: CompatibleExpression<string>): Statement
  alterDatabase(name: string): AlterDatabase;
  dropDatabase(name: string): DropDatabase;
  createDatabase(name: string): CreateDatabase;
  createSequence(name: CompatiableObjectName<string>): CreateSequence;
  dropSequence(name: CompatiableObjectName<string>): DropSequence;

  use(database: string): Use;

  type: typeof DbType;

  readonly break: Break;

  readonly continue: Continue;
  /**
   * 创建一个SQL文档
   * @param statements 文档代码
   */
  doc(statements: Statement[]): Document;
  doc(...statements: Statement[]): Document;

  /**
   * 括号条件运算，将条件括起来
   */
  group(condition: Condition): Condition;
  /**
   * 括号表达式，将表达式括起来，如优先级
   */
  group<T extends Scalar>(value: CompatibleExpression<T>): Expression<T>;

  /**
   * 算术运算 +
   * @param left 左值
   * @param right 右值
   * @returns 返回算术运算表达式
   */
  neg(expr: CompatibleExpression<number>): Expression<number>;

  /**
   * IF语句
   * @param condition
   */
  if(condition: Condition): If;

  /**
   * 字符串连接运算
   */
  concat(
    ...strs: [
      CompatibleExpression<string>,
      CompatibleExpression<string>,
      ...CompatibleExpression<string>[]
    ]
  ): Expression<string>;

  /**
   * 算术运算 +
   * @param left 左值
   * @param right 右值
   * @returns 返回算术运算表达式
   */
  add<T extends Numeric>(
    left: CompatibleExpression<T>,
    right: CompatibleExpression<T>
  ): Expression<T>;

  /**
   * 算术运算 -
   * @param left 左值
   * @param right 右值
   * @returns 返回算术运算表达式
   */
  sub<T extends Numeric>(
    left: CompatibleExpression<T>,
    right: CompatibleExpression<T>
  ): Expression<T>;

  /**
   * 算术运算 *
   * @param left 左值
   * @param right 右值
   * @returns 返回算术运算表达式
   */
  mul<T extends Numeric>(
    left: CompatibleExpression<T>,
    right: CompatibleExpression<T>
  ): Expression<T>;

  /**
   * 算术运算 /
   * @param left 左值
   * @param right 右值
   * @returns 返回算术运算表达式
   */
  div<T extends Numeric>(
    left: CompatibleExpression<T>,
    right: CompatibleExpression<T>
  ): Expression<T>;

  /**
   * 算术运算 %
   * @param left 左值
   * @param right 右值
   * @returns 返回算术运算表达式
   */
  mod<T extends Numeric>(
    left: CompatibleExpression<T>,
    right: CompatibleExpression<T>
  ): Expression<T>;

  /**
   * 位算术运算 ^
   * @param left 左值
   * @param right 右值
   * @returns 返回算术运算表达式
   */
  xor<T extends Interger>(
    left: CompatibleExpression<T>,
    right: CompatibleExpression<T>
  ): Expression<T>;

  /**
   * 位算术运算 <<
   * @param left 左值
   * @param right 右值
   * @returns 返回算术运算表达式
   */
  shl<T extends Interger>(
    left: CompatibleExpression<T>,
    right: CompatibleExpression<T>
  ): Expression<T>;

  /**
   * 位算术运算 >>
   * @param left 左值
   * @param right 右值
   * @returns 返回算术运算表达式
   */
  shr<T extends Interger>(
    left: CompatibleExpression<T>,
    right: CompatibleExpression<T>
  ): Expression<T>;

  literal<T extends Scalar>(value: T): Literal<T>;

  /**
   * 将多个查询条件通过 AND 合并成一个大查询条件
   * @param conditions 查询条件列表
   * @returns 返回逻辑表达式
   */
  and(conditions: CompatibleCondition[]): Condition;
  and(
    ...conditions: [
      CompatibleCondition,
      CompatibleCondition,
      ...CompatibleCondition[]
    ]
  ): Condition;
  /**
   * 位算术运算 &
   * @param left 左值
   * @param right 右值
   * @returns 返回算术运算表达式
   */
  and<T extends Interger>(
    left: CompatibleExpression<T>,
    right: CompatibleExpression<T>
  ): Expression<T>;

  /**
   * 将多个查询条件通过 OR 合并成一个
   * @param conditions 查询条件列表
   * @returns 返回逻辑表达式
   */
  or(conditions: CompatibleCondition[]): Condition;
  or(
    ...conditions: [
      CompatibleCondition,
      CompatibleCondition,
      ...CompatibleCondition[]
    ]
  ): Condition;
  /**
   * 位算术运算 |
   * @param left 左值
   * @param right 右值
   * @returns 返回算术运算表达式
   */
  or<T extends Interger>(
    left: CompatibleExpression<T>,
    right: CompatibleExpression<T>
  ): Expression<T>;

  /**
   * Not 逻辑运算
   * @param condition
   */
  not(condition: Condition): Condition;
  /**
   * 位算术运算 ~
   * @param value 左值
   * @param right 右值
   * @returns 返回算术运算表达式
   */
  not<T extends Interger>(value: CompatibleExpression<T>): Expression<T>;

  /**
   * 判断是否存在
   * @param select 查询语句
   */
  exists(select: Select<any>): Condition;

  /**
   * 比较运算 =
   * @param left 左值
   * @param right 右值
   * @returns 返回比较运算对比条件
   */
  eq<T extends Scalar>(
    left: CompatibleExpression<T>,
    right: CompatibleExpression<T>
  ): Condition;

  /**
   * 比较运算 <>
   * @param left 左值
   * @param right 右值
   * @returns 返回比较运算对比条件
   */
  neq<T extends Scalar>(
    left: CompatibleExpression<T>,
    right: CompatibleExpression<T>
  ): Condition;

  /**
   * 比较运算 <
   * @param left 左值
   * @param right 右值
   * @returns 返回比较运算对比条件
   */
  lt<T extends Scalar>(
    left: CompatibleExpression<T>,
    right: CompatibleExpression<T>
  ): Condition;

  /**
   * 比较运算 <=
   * @param left 左值
   * @param right 右值
   * @returns 返回比较运算对比条件
   */
  lte<T extends Scalar>(
    left: CompatibleExpression<T>,
    right: CompatibleExpression<T>
  ): Condition;

  /**
   * 比较运算 >
   * @param left 左值
   * @param right 右值
   * @returns 返回比较运算对比条件
   */
  gt<T extends Scalar>(
    left: CompatibleExpression<T>,
    right: CompatibleExpression<T>
  ): Condition;

  /**
   * 比较运算 >=
   * @param left 左值
   * @param right 右值
   * @returns 返回比较运算对比条件
   */
  gte<T extends Scalar>(
    left: CompatibleExpression<T>,
    right: CompatibleExpression<T>
  ): Condition;

  /**
   * 比较运算 LIKE
   * @param left 左值
   * @param right 右值
   * @returns 返回比较运算对比条件
   */
  like(
    left: CompatibleExpression<string>,
    right: CompatibleExpression<string>
  ): Condition;

  /**
   * 比较运算 NOT LIKE
   * @param left 左值
   * @param right 右值
   * @returns 返回比较运算对比条件
   */
  notLike(
    left: CompatibleExpression<string>,
    right: CompatibleExpression<string>
  ): Condition;

  /**
   * 比较运算 IN
   * @param left 左值
   * @param values 要比较的值列表
   * @returns 返回比较运算对比条件
   */
  in<T extends Scalar>(
    left: CompatibleExpression<T>,
    select: Select<any>
  ): Condition;
  in<T extends Scalar>(
    left: CompatibleExpression<T>,
    values: CompatibleExpression<T>[]
  ): Condition;
  in<T extends Scalar>(
    left: CompatibleExpression<T>,
    values: CompatibleExpression<T>[] | Select<any>
  ): Condition;

  /**
   * 比较运算 NOT IN
   * @param left 左值
   * @param values 要比较的值列表
   * @returns 返回比较运算对比条件
   */
  notIn<T extends Scalar>(
    left: CompatibleExpression<T>,
    values: CompatibleExpression<T>[]
  ): Condition;

  /**
   * 比较运算 IS NULL
   * @returns 返回比较运算符
   * @param expr 表达式
   */
  isNull(expr: CompatibleExpression<Scalar>): Condition;

  /**
   * 比较运算 IS NOT NULL
   * @param expr 表达式
   * @returns 返回比较运算符
   */
  isNotNull(expr: CompatibleExpression<Scalar>): Condition;

  /**
   * 创建表对象，该对象是可代理的，可以直接以 . 运算符获取下一节点Identifier
   * @param name
   */
  table<T extends RowObject = any, N extends string = string>(
    name: CompatiableObjectName<N>
  ): ProxiedTable<T, N>;

  /**
   * 声明一个函数
   */
  func<N extends string>(
    name: CompatiableObjectName<N>,
    builtIn?: boolean
  ): Func<N>;

  /**
   * 创建一个可供调用的存储过程函数
   */
  proc<
    R extends Scalar = number,
    O extends RowObject[] = never,
    N extends string = string
  >(
    name: CompatiableObjectName<N>,
    buildIn?: boolean
  ): Procedure<R, O, N>;

  /**
   * 创建一个字段
   */
  field<T extends Scalar, N extends string>(
    name: N,
    rowset?: CompatibleRowset
  ): Field<T, N>;

  builtIn<T extends string>(name: T): BuiltIn<T>;

  variant<T extends Scalar, N extends string = string>(name: N): Variant<T, N>;

  readonly star: Star<any>;

  /**
   * 插入至表,into的别名
   * @param table
   * @param fields
   */
  insert<T extends RowObject = any>(
    table: CompatibleTable<T, string>,
    fields?: ColumnsOf<T>[] | Field<Scalar, ColumnsOf<T>>[]
  ): Insert<T>;

  /**
   * 插入至表,into的别名
   * @param table
   * @param fields
   */
  identityInsert<T extends RowObject = any>(
    table: CompatibleTable<T, string>,
    fields?: ColumnsOf<T>[] | Field<Scalar, ColumnsOf<T>>[]
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

  readonly select: SelectAction;

  raw(sql: string): any;

  while(condition: Condition): While;

  block(...statements: Statement[]): Block;
  block(statements: Statement[]): Block;

  /**
   * 执行一个存储过程
   * @param proc
   * @param params
   */
  //   execute<T extends Model> (
  //   proc: CompatiableObjectName | Procedure<T, string>,
  //   params?: Expressions<JsConstant>[]
  // ): Execute<T>
  //   execute<T extends Model> (
  //   proc: CompatiableObjectName | Procedure<T, string>,
  //   params?: InputObject
  // ): Execute<T>
  execute<R extends Scalar = any, O extends RowObject[] = []>(
    proc: CompatiableObjectName | Procedure<R, O, string>,
    params?: CompatibleExpression<Scalar>[]
    // | Parameter<JsConstant, string>[] | InputObject
  ): Execute<R, O>;

  invokeTableFunction<T extends RowObject = any>(
    func: CompatiableObjectName | Func<string>,
    args: CompatibleExpression<Scalar>[]
  ): ProxiedRowset<T>;

  invokeScalarFunction<T extends Scalar = any>(
    func: CompatiableObjectName | Func<string>,
    args: CompatibleExpression<Scalar>[]
  ): ScalarFuncInvoke<T>;

  makeInvoke<T extends RowObject>(
    type: 'table',
    name: CompatiableObjectName,
    builtIn?: boolean
  ): () => ProxiedRowset<T>;
  makeInvoke<T extends RowObject, A1 extends CompatibleExpression>(
    type: 'table',
    name: CompatiableObjectName,
    builtIn?: boolean
  ): (arg1: A1) => ProxiedRowset<T>;
  makeInvoke<
    T extends RowObject,
    A1 extends CompatibleExpression,
    A2 extends CompatibleExpression
  >(
    type: 'table',
    name: CompatiableObjectName,
    builtIn?: boolean
  ): (arg1: A1, arg2: A2) => ProxiedRowset<T>;
  makeInvoke<
    T extends RowObject,
    A1 extends CompatibleExpression,
    A2 extends CompatibleExpression,
    A3 extends CompatibleExpression
  >(
    type: 'table',
    name: CompatiableObjectName,
    builtIn?: boolean
  ): (arg1: A1, arg2: A2, arg3: A3) => ProxiedRowset<T>;
  makeInvoke<
    T extends RowObject,
    A1 extends CompatibleExpression,
    A2 extends CompatibleExpression,
    A3 extends CompatibleExpression,
    A4 extends CompatibleExpression
  >(
    type: 'table',
    name: CompatiableObjectName,
    builtIn?: boolean
  ): (arg1: A1, arg2: A2, arg3: A3, arg4: A4) => ProxiedRowset<T>;
  makeInvoke<
    T extends RowObject,
    A1 extends CompatibleExpression,
    A2 extends CompatibleExpression,
    A3 extends CompatibleExpression,
    A4 extends CompatibleExpression,
    A5 extends CompatibleExpression
  >(
    type: 'table',
    name: CompatiableObjectName,
    builtIn?: boolean
  ): (arg1: A1, arg2: A2, arg3: A3, arg4: A4, arg5: A5) => ProxiedRowset<T>;

  makeInvoke(
    type: 'table',
    name: CompatiableObjectName,
    builtIn?: boolean
  ): (...args: CompatibleExpression[]) => ProxiedRowset<any>;

  makeInvoke<T extends Scalar>(
    type: 'scalar',
    name: CompatiableObjectName,
    builtIn?: boolean
  ): () => Expression<T>;
  makeInvoke<T extends Scalar, A1 extends CompatibleExpression>(
    type: 'scalar',
    name: CompatiableObjectName,
    builtIn?: boolean
  ): (arg1: A1) => Expression<T>;
  makeInvoke<
    T extends Scalar,
    A1 extends CompatibleExpression,
    A2 extends CompatibleExpression
  >(
    type: 'scalar',
    name: CompatiableObjectName,
    builtIn?: boolean
  ): (arg1: A1, arg2: A2) => Expression<T>;
  makeInvoke<
    T extends Scalar,
    A1 extends CompatibleExpression,
    A2 extends CompatibleExpression,
    A3 extends CompatibleExpression
  >(
    type: 'scalar',
    name: CompatiableObjectName,
    builtIn?: boolean
  ): (arg1: A1, arg2: A2, arg3: A3) => Expression<T>;
  makeInvoke<
    T extends Scalar,
    A1 extends CompatibleExpression,
    A2 extends CompatibleExpression,
    A3 extends CompatibleExpression,
    A4 extends CompatibleExpression
  >(
    type: 'scalar',
    name: CompatiableObjectName,
    builtIn?: boolean
  ): (arg1: A1, arg2: A2, arg3: A3, arg4: A4) => Expression<T>;
  makeInvoke<
    T extends Scalar,
    A1 extends CompatibleExpression,
    A2 extends CompatibleExpression,
    A3 extends CompatibleExpression,
    A4 extends CompatibleExpression,
    A5 extends CompatibleExpression
  >(
    type: 'scalar',
    name: CompatiableObjectName,
    builtIn?: boolean
  ): (arg1: A1, arg2: A2, arg3: A3, arg4: A4, arg5: A5) => Expression<T>;

  makeInvoke(
    type: 'scalar',
    name: CompatiableObjectName,
    builtIn?: boolean
  ): (...args: CompatibleExpression[]) => Expression<any>;

  /**
   * 创建一个可供JS调用的存储过程
   */
  makeExec<R extends Scalar = number, O extends RowObject[] = []>(
    name: CompatiableObjectName,
    builtIn?: boolean
  ): () => Execute<R, O>;
  makeExec<
    A1 extends CompatibleExpression,
    R extends Scalar = number,
    O extends RowObject[] = []
  >(
    name: CompatiableObjectName,
    builtIn?: boolean
  ): (arg1: A1) => Execute<R, O>;
  makeExec<
    A1 extends CompatibleExpression,
    A2 extends CompatibleExpression,
    R extends Scalar = number,
    O extends RowObject[] = []
  >(
    name: CompatiableObjectName,
    builtIn?: boolean
  ): (arg1: A1, arg2: A2) => Execute<R, O>;
  makeExec<
    A1 extends CompatibleExpression,
    A2 extends CompatibleExpression,
    A3 extends CompatibleExpression,
    R extends Scalar = number,
    O extends RowObject[] = []
  >(
    name: CompatiableObjectName,
    builtIn?: boolean
  ): (arg1: A1, arg2: A2, arg3: A3) => Execute<R, O>;
  makeExec<
    A1 extends CompatibleExpression,
    A2 extends CompatibleExpression,
    A3 extends CompatibleExpression,
    A4 extends CompatibleExpression,
    R extends Scalar = number,
    O extends RowObject[] = []
  >(
    name: CompatiableObjectName,
    builtIn?: boolean
  ): (arg1: A1, arg2: A2, arg3: A3, arg4: A4) => Execute<R, O>;
  makeExec<
    A1 extends CompatibleExpression,
    A2 extends CompatibleExpression,
    A3 extends CompatibleExpression,
    A4 extends CompatibleExpression,
    A5 extends CompatibleExpression,
    R extends Scalar = number,
    O extends RowObject[] = []
  >(
    name: CompatiableObjectName,
    builtIn?: boolean
  ): (arg1: A1, arg2: A2, arg3: A3, arg4: A4, arg5: A5) => Execute<R, O>;

  makeExec(
    name: CompatiableObjectName,
    builtIn?: boolean
  ): (...args: CompatibleExpression[]) => Expression<any>;

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
    value: CompatibleExpression<T>
  ): When<T>;

  case<T extends Scalar>(expr?: CompatibleExpression): Case<T>;

  /**
   * With语句
   */
  with(...rowsets: WithSelect[]): With;
  with(rowsets: Record<string, Select>): With;

  union<T extends RowObject = any>(
    ...selects: [Select<T>, Select<T>, ...Select<T>[]]
  ): Select<T>;

  unionAll<T extends RowObject = any>(
    ...selects: [Select<T>, Select<T>, ...Select<T>[]]
  ): Select<T>;

  invoke<T extends RowObject>(
    type: 'table',
    name: CompatiableObjectName,
    builtIn?: boolean
  ): () => ProxiedRowset<T>;
  invoke<T extends RowObject, A1 extends CompatibleExpression>(
    type: 'table',
    name: CompatiableObjectName,
    builtIn?: boolean
  ): (arg1: A1) => ProxiedRowset<T>;
  invoke<
    T extends RowObject,
    A1 extends CompatibleExpression,
    A2 extends CompatibleExpression
  >(
    type: 'table',
    name: CompatiableObjectName,
    builtIn?: boolean
  ): (arg1: A1, arg2: A2) => ProxiedRowset<T>;
  invoke<
    T extends RowObject,
    A1 extends CompatibleExpression,
    A2 extends CompatibleExpression,
    A3 extends CompatibleExpression
  >(
    type: 'table',
    name: CompatiableObjectName,
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
    name: CompatiableObjectName,
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
    name: CompatiableObjectName,
    builtIn?: boolean
  ): (arg1: A1, arg2: A2, arg3: A3, arg4: A4, arg5: A5) => ProxiedRowset<T>;

  invoke(
    type: 'table',
    name: CompatiableObjectName,
    builtIn?: boolean
  ): (...args: CompatibleExpression[]) => ProxiedRowset<any>;

  invoke<T extends Scalar>(
    type: 'scalar',
    name: CompatiableObjectName,
    builtIn?: boolean
  ): () => Expression<T>;
  invoke<T extends Scalar, A1 extends CompatibleExpression>(
    type: 'scalar',
    name: CompatiableObjectName,
    builtIn?: boolean
  ): (arg1: A1) => Expression<T>;
  invoke<
    T extends Scalar,
    A1 extends CompatibleExpression,
    A2 extends CompatibleExpression
  >(
    type: 'scalar',
    name: CompatiableObjectName,
    builtIn?: boolean
  ): (arg1: A1, arg2: A2) => Expression<T>;
  invoke<
    T extends Scalar,
    A1 extends CompatibleExpression,
    A2 extends CompatibleExpression,
    A3 extends CompatibleExpression
  >(
    type: 'scalar',
    name: CompatiableObjectName,
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
    name: CompatiableObjectName,
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
    name: CompatiableObjectName,
    builtIn?: boolean
  ): (arg1: A1, arg2: A2, arg3: A3, arg4: A4, arg5: A5) => Expression<T>;

  invoke(
    type: 'scalar',
    name: CompatiableObjectName,
    builtIn?: boolean
  ): (...args: CompatibleExpression[]) => Expression<any>;

  /**
   * 创建表格
   * @param name
   * @param members
   * @returns
   */
  createTable: CreateTableHandler;

  alterTable<N extends string>(name: CompatiableObjectName<N>): AlterTable<N>;

  createView<T extends RowObject = any, N extends string = string>(
    name: CompatiableObjectName<N>
  ): CreateView<T, N>;

  alterView<T extends RowObject = any, N extends string = string>(
    name: CompatiableObjectName<N>
  ): AlterView<T, N>;

  createIndex(name: string): CreateIndex;

  createProcedure(name: CompatiableObjectName): CreateProcedure;

  alterProcedure(name: CompatiableObjectName): AlterProcedure;

  createFunction(name: CompatiableObjectName): CreateFunction;

  alterFunction(name: CompatiableObjectName): AlterFunction;

  dropTable<N extends string>(name: CompatiableObjectName<N>): DropTable<N>;

  dropView<N extends string>(name: CompatiableObjectName<N>): DropView<N>;

  dropProcedure<N extends string>(
    name: CompatiableObjectName<N>
  ): DropProcedure<N>;

  dropFunction<N extends string>(
    name: CompatiableObjectName<N>
  ): DropFunction<N>;

  dropIndex<N extends string>(
    table: CompatiableObjectName,
    name: N
  ): DropIndex<N>;

  annotation(...text: string[]): Annotation;
  note(text: string): Annotation;

  /**
   * input 参数
   */
  input<T extends Scalar, N extends string>(
    name: N,
    value: T,
    type?: DbTypeOf<T>
  ): Parameter<T, N>;

  /**
   * output参数
   */
  output<T extends DbType, N extends string>(
    name: N,
    type: T,
    value?: TsTypeOf<T>
  ): Parameter<TsTypeOf<T>, N>;
}

export const SqlBuilder: SqlBuilder = {
  ...Standard,
  type: DbType,
  use(database: string): Use {
    return new Use(database);
  },
  if(condition: Condition): If {
    return new If(condition);
  },
  while(condition: Condition): While {
    return new While(condition);
  },
  get break(): Break {
    return new Break();
  },
  get continue(): Continue {
    return new Continue();
  },
  createDatabase(name: string): CreateDatabase {
    return new CreateDatabase(name);
  },
  alterDatabase(name: string): AlterDatabase {
    return new AlterDatabase(name);
  },
  dropDatabase(name: string): DropDatabase {
    return new DropDatabase(name);
  },
  createSequence(name: CompatiableObjectName): CreateSequence {
    return new CreateSequence(name);
  },
  dropSequence(name: CompatiableObjectName): DropSequence {
    return new DropSequence(name);
  },
  doc(...statements: Statement[] | [Statement[]]): Document {
    const lines = Array.isArray(statements[0])
      ? statements[0]
      : (statements as Statement[]);
    return new Document(lines);
  },
  group(value: Condition | CompatibleExpression): any {
    if (Condition.isCondition(value)) {
      return new GroupCondition(value);
    }
    return new GroupExpression(value);
  },
  neg(expr: CompatibleExpression<number>): Expression<number> {
    return UnaryOperation.neg(expr);
  },

  /**
   * 字符串连接运算
   */
  concat(
    ...strs: [
      CompatibleExpression<string>,
      CompatibleExpression<string>,
      ...CompatibleExpression<string>[]
    ]
  ): Expression<string> {
    return BinaryOperation.concat(...strs);
  },

  /**
   * 算术运算 +
   * @param left 左值
   * @param right 右值
   * @returns 返回算术运算表达式
   */
  add<T extends Numeric>(
    left: CompatibleExpression<T>,
    right: CompatibleExpression<T>
  ): Expression<T> {
    return BinaryOperation.add(left, right);
  },

  /**
   * 算术运算 -
   * @param left 左值
   * @param right 右值
   * @returns 返回算术运算表达式
   */
  sub<T extends Numeric>(
    left: CompatibleExpression<T>,
    right: CompatibleExpression<T>
  ): Expression<T> {
    return BinaryOperation.sub(left, right);
  },
  /**
   * 算术运算 *
   * @param left 左值
   * @param right 右值
   * @returns 返回算术运算表达式
   */
  mul<T extends Numeric>(
    left: CompatibleExpression<T>,
    right: CompatibleExpression<T>
  ): Expression<T> {
    return BinaryOperation.mul(left, right);
  },
  /**
   * 算术运算 /
   * @param left 左值
   * @param right 右值
   * @returns 返回算术运算表达式
   */
  div<T extends Numeric>(
    left: CompatibleExpression<T>,
    right: CompatibleExpression<T>
  ): Expression<T> {
    return BinaryOperation.div(left, right);
  },

  /**
   * 算术运算 %
   * @param left 左值
   * @param right 右值
   * @returns 返回算术运算表达式
   */
  mod<T extends Numeric>(
    left: CompatibleExpression<T>,
    right: CompatibleExpression<T>
  ): Expression<T> {
    return BinaryOperation.mod(left, right);
  },
  /*
   * 位算术运算 ^
   * @param left 左值
   * @param right 右值
   * @returns 返回算术运算表达式
   */
  xor<T extends Numeric>(
    left: CompatibleExpression<T>,
    right: CompatibleExpression<T>
  ): Expression<T> {
    return BinaryOperation.xor(left, right);
  },
  /**
   * 位算术运算 << 仅支持整型
   * @param left 左值
   * @param right 右值
   * @returns 返回算术运算表达式
   */
  shl<T extends Interger>(
    left: CompatibleExpression<T>,
    right: CompatibleExpression<T>
  ): Expression<T> {
    return BinaryOperation.shl(left, right);
  },
  /**
   * 位算术运算 >>
   * @param left 左值
   * @param right 右值
   * @returns 返回算术运算表达式
   */
  shr<T extends Interger>(
    left: CompatibleExpression<T>,
    right: CompatibleExpression<T>
  ): Expression<T> {
    return BinaryOperation.shr(left, right);
  },
  // static convert<T extends DbType>(
  //   expr: CompatibleExpression<Scalar>,
  //   toType: T
  // ): Expression<TsTypeOf<T>> {
  //   return convert(expr, toType);
  // }

  literal<T extends Scalar>(value: T): Literal<T> {
    return new Literal(value);
  },

  and(
    ...args:
      | CompatibleCondition[]
      | [CompatibleCondition[]]
      | [CompatibleExpression<Interger>, CompatibleExpression<Interger>]
  ): any {
    if (Array.isArray(args[0])) {
      args = args[0];
    }

    if (Expression.isExpression(args[0]) || isScalar(args[0])) {
      return BinaryOperation.and(
        args[0],
        args[1] as CompatibleExpression<Interger>
      );
    }

    return Condition.join(LOGIC_OPERATOR.AND, args as CompatibleCondition[]);
  },

  or(
    ...args:
      | CompatibleCondition[]
      | [CompatibleCondition[]]
      | [CompatibleExpression<Interger>, CompatibleExpression<Interger>]
  ): any {
    if (Array.isArray(args[0])) {
      args = args[0] as CompatibleCondition[];
    }
    if (Expression.isExpression(args[0]) || isScalar(args[0])) {
      return BinaryOperation.or(
        args[0],
        args[1] as CompatibleExpression<Interger>
      );
    }

    return Condition.join(LOGIC_OPERATOR.OR, args as CompatibleCondition[]);
  },

  /**
   * Not 逻辑运算
   * @param arg
   */
  not(arg: Condition | CompatibleExpression<Interger>): any {
    if (Expression.isExpression(arg) || isScalar(arg)) {
      return UnaryOperation.not(arg);
    }
    return UnaryLogicCondition.not(arg);
  },

  /**
   * 判断是否存在
   * @param select 查询语句
   */
  exists(select: Select<any>): Condition {
    return new ExistsCondition(select);
  },
  /**
   * 比较运算 =
   * @param left 左值
   * @param right 右值
   * @returns 返回比较运算对比条件
   */
  eq<T extends Scalar>(
    left: CompatibleExpression<T>,
    right: CompatibleExpression<T>
  ): Condition {
    return BinaryCompareCondition.eq(left, right);
  },
  /**
   * 比较运算 <>
   * @param left 左值
   * @param right 右值
   * @returns 返回比较运算对比条件
   */
  neq<T extends Scalar>(
    left: CompatibleExpression<T>,
    right: CompatibleExpression<T>
  ): Condition {
    return BinaryCompareCondition.neq(left, right);
  },
  /**
   * 比较运算 <
   * @param left 左值
   * @param right 右值
   * @returns 返回比较运算对比条件
   */
  lt<T extends Scalar>(
    left: CompatibleExpression<T>,
    right: CompatibleExpression<T>
  ): Condition {
    return BinaryCompareCondition.lt(left, right);
  },
  /**
   * 比较运算 <=
   * @param left 左值
   * @param right 右值
   * @returns 返回比较运算对比条件
   */
  lte<T extends Scalar>(
    left: CompatibleExpression<T>,
    right: CompatibleExpression<T>
  ): Condition {
    return BinaryCompareCondition.lte(left, right);
  },
  /**
   * 比较运算 >
   * @param left 左值
   * @param right 右值
   * @returns 返回比较运算对比条件
   */
  gt<T extends Scalar>(
    left: CompatibleExpression<T>,
    right: CompatibleExpression<T>
  ): Condition {
    return BinaryCompareCondition.gt(left, right);
  },
  /**
   * 比较运算 >=
   * @param left 左值
   * @param right 右值
   * @returns 返回比较运算对比条件
   */
  gte<T extends Scalar>(
    left: CompatibleExpression<T>,
    right: CompatibleExpression<T>
  ): Condition {
    return BinaryCompareCondition.gte(left, right);
  },
  /**
   * 比较运算 LIKE
   * @param left 左值
   * @param right 右值
   * @returns 返回比较运算对比条件
   */
  like(
    left: CompatibleExpression<string>,
    right: CompatibleExpression<string>
  ): Condition {
    return BinaryCompareCondition.like(left, right);
  },
  /**
   * 比较运算 NOT LIKE
   * @param left 左值
   * @param right 右值
   * @returns 返回比较运算对比条件
   */
  notLike(
    left: CompatibleExpression<string>,
    right: CompatibleExpression<string>
  ): Condition {
    return BinaryCompareCondition.notLike(left, right);
  },

  in<T extends Scalar>(
    left: CompatibleExpression<T>,
    values: CompatibleExpression<T>[] | Select<any>
  ): Condition {
    return BinaryCompareCondition.in(left, values);
  },
  /**
   * 比较运算 NOT IN
   * @param left 左值
   * @param values 要比较的值列表
   * @returns 返回比较运算对比条件
   */
  notIn<T extends Scalar>(
    left: CompatibleExpression<T>,
    values: CompatibleExpression<T>[]
  ): Condition {
    return BinaryCompareCondition.notIn(left, values);
  },
  /**
   * 比较运算 IS NULL
   * @returns 返回比较运算符
   * @param expr 表达式
   */
  isNull(expr: CompatibleExpression<Scalar>): Condition {
    return UnaryCompareCondition.isNull(expr);
  },
  /**
   * 比较运算 IS NOT NULL
   * @param expr 表达式
   * @returns 返回比较运算符
   */
  isNotNull(expr: CompatibleExpression<Scalar>): Condition {
    return UnaryCompareCondition.isNotNull(expr);
  },

  table<T>(nameOrModel: any): any {
    return Table.ensure(nameOrModel);
  },
  /**
   * 声明一个函数
   */
  func<N extends string>(
    name: CompatiableObjectName<N>,
    builtIn = false
  ): Func<N> {
    return new Func(name, builtIn);
  },
  /**
   * 创建一个可供调用的存储过程函数
   */
  proc<
    R extends Scalar = number,
    O extends RowObject[] = never,
    N extends string = string
  >(name: CompatiableObjectName<N>, buildIn = false): Procedure<R, O, N> {
    return new Procedure<R, O, N>(name, buildIn);
  },
  /**
   * 创建一个字段
   */
  field<T extends Scalar, N extends string>(
    name: N,
    rowset?: CompatibleRowset
  ): Field<T, N> {
    return new Field(name, rowset);
  },
  builtIn<T extends string>(name: T): BuiltIn<T> {
    return new BuiltIn(name);
  },
  variant<T extends Scalar, N extends string = string>(name: N): Variant<T, N> {
    return new Variant(name);
  },
  star: new Star<any>(),

  /**
   * 插入至表,into的别名
   * @param table
   * @param fields
   */
  insert<T extends RowObject = any>(
    table: CompatibleTable<T, string>,
    fields?: ColumnsOf<T>[] | Field<Scalar, ColumnsOf<T>>[]
  ): Insert<T> {
    return new Insert(table, fields);
  },
  /**
   * 插入至表,into的别名
   * @param table
   * @param fields
   */
  identityInsert<T extends RowObject = any>(
    table: CompatibleTable<T, string>,
    fields?: ColumnsOf<T>[] | Field<Scalar, ColumnsOf<T>>[]
  ): Insert<T> {
    return new Insert(table, fields).withIdentity();
  },
  /**
   * 更新一个表格
   * @param table
   */
  update<T extends RowObject = any>(
    table: CompatibleTable<T, string>
  ): Update<T> {
    return new Update(table);
  },
  /**
   * 删除一个表格
   * @param table 表格
   */
  delete<T extends RowObject = any>(
    table: CompatibleTable<T, string>
  ): Delete<T> {
    return new Delete(table);
  },
  select(...args: any[]): any {
    return new Select(...args);
  },

  raw(sql: string): any {
    return new Raw(sql);
  },
  block(...statements: Statement[] | [Statement[]]): Block {
    if (statements.length === 1 && Array.isArray(statements[0])) {
      statements = statements[0];
    }
    return new Block(statements as Statement[]);
  },

  execute<R extends Scalar = any, O extends RowObject[] = []>(
    proc: CompatiableObjectName | Procedure<R, O, string>,
    params?: CompatibleExpression<Scalar>[]
    // | Parameter<JsConstant, string>[] | InputObject
  ): Execute<R, O> {
    return new Execute(proc, params);
  },

  invokeTableFunction<T extends RowObject = any>(
    func: CompatiableObjectName | Func<string>,
    args: CompatibleExpression<Scalar>[]
  ): ProxiedRowset<T> {
    return new TableFuncInvoke(func, args) as any;
  },

  invokeScalarFunction<T extends Scalar = any>(
    func: CompatiableObjectName | Func<string>,
    args: CompatibleExpression<Scalar>[]
  ): ScalarFuncInvoke<T> {
    return new ScalarFuncInvoke(func, args);
  },

  makeInvoke(
    type: 'table' | 'scalar',
    name: CompatiableObjectName,
    builtIn = false
  ): any {
    if (type === 'table') {
      return function (
        ...args: CompatibleExpression[]
      ): ProxiedRowset<RowObject> {
        return SqlBuilder.invokeTableFunction(
          SqlBuilder.func(name, builtIn),
          args
        );
      };
    }
    if (type === 'scalar') {
      return function (...args: CompatibleExpression<Scalar>[]): Expression {
        return SqlBuilder.invokeScalarFunction<Scalar>(
          SqlBuilder.func(name, builtIn),
          args
        );
      };
    }
    throw new Error('invalid arg value of `type`');
  },

  makeExec(name: CompatiableObjectName, builtIn = false): any {
    return function (
      ...args: CompatibleExpression<Scalar>[]
    ): Execute<any, any> {
      return SqlBuilder.execute(
        SqlBuilder.proc<Scalar, any, string>(name, builtIn),
        args
      );
    };
  },
  /**
   * 赋值语句
   * @param left 左值
   * @param right 右值
   */
  assign<T extends Scalar = any>(
    left: Assignable<T>,
    right: CompatibleExpression<T>
  ): Assignment<T> {
    return new Assignment(left, right);
  },
  /**
   * 变量声明
   * @param declares 变量列表
   */
  declare(
    build: (builder: DeclareBuilder) => (VariantDeclare | TableVariantDeclare)[]
  ): Declare {
    return new Declare(build);
  },
  /**
   * WHEN 语句块
   * @param expr
   * @param value
   */
  when<T extends Scalar>(
    expr: CompatibleExpression<Scalar>,
    value: CompatibleExpression<T>
  ): When<T> {
    return new When(expr, value);
  },

  case<T extends Scalar>(expr?: CompatibleExpression): Case<T> {
    return new Case<T>(expr);
  },
  /**
   * With语句
   */
  with(...rowsets: any): With {
    if (rowsets.length === 1 && isPlainObject(rowsets)) {
      return new With(rowsets[0]);
    }
    return new With(rowsets);
  },
  union<T extends RowObject = any>(...selects: Select<T>[]): Select<T> {
    selects.forEach((sel, index) => {
      if (index < selects.length - 1) sel.union(selects[index + 1]);
    });
    return selects[0];
  },
  unionAll<T extends RowObject = any>(...selects: Select<T>[]): Select<T> {
    selects.forEach((sel, index) => {
      if (index < selects.length - 1) sel.unionAll(selects[index + 1]);
    });
    return selects[0];
  },
  invoke(
    type: 'table' | 'scalar',
    name: CompatiableObjectName,
    builtIn = false
  ): any {
    if (type === 'table') {
      return function (
        ...args: CompatibleExpression[]
      ): ProxiedRowset<RowObject> {
        return SqlBuilder.invokeTableFunction(
          SqlBuilder.func(name, builtIn),
          args
        );
      };
    }
    if (type === 'scalar') {
      return function (...args: CompatibleExpression<Scalar>[]): Expression {
        return SqlBuilder.invokeScalarFunction<Scalar>(
          SqlBuilder.func(name, builtIn),
          args
        );
      };
    }
    throw new Error('invalid arg value of `type`');
  },
  createTable: Object.assign((name: any) => {
    const table = new CreateTable(name);
    return table;
  }, CreateTableMemberBuilder),

  alterTable<N extends string>(name: CompatiableObjectName<N>): AlterTable<N> {
    return new AlterTable(name);
  },
  createView<T extends RowObject = any, N extends string = string>(
    name: CompatiableObjectName<N>
  ): CreateView<T, N> {
    return new CreateView(name);
  },
  alterView<T extends RowObject = any, N extends string = string>(
    name: CompatiableObjectName<N>
  ): AlterView<T, N> {
    return new AlterView(name);
  },
  createIndex(name: string): CreateIndex {
    return new CreateIndex(name);
  },
  createProcedure(name: string): CreateProcedure {
    return new CreateProcedure(name);
  },
  alterProcedure(name: string): AlterProcedure {
    return new AlterProcedure(name);
  },
  createFunction(name: CompatiableObjectName): CreateFunction {
    return new CreateFunction(name);
  },
  alterFunction(name: CompatiableObjectName): AlterFunction {
    return new AlterFunction(name);
  },
  dropTable<N extends string>(name: CompatiableObjectName<N>): DropTable<N> {
    return new DropTable(name);
  },
  dropView<N extends string>(name: CompatiableObjectName<N>): DropView<N> {
    return new DropView(name);
  },
  dropProcedure<N extends string>(
    name: CompatiableObjectName<N>
  ): DropProcedure<N> {
    return new DropProcedure(name);
  },
  dropFunction<N extends string>(
    name: CompatiableObjectName<N>
  ): DropFunction<N> {
    return new DropFunction(name);
  },
  dropIndex<N extends string>(
    table: CompatiableObjectName,
    name: N
  ): DropIndex<N> {
    return new DropIndex(table, name);
  },
  annotation(...text: string[]): Annotation {
    return new Annotation('BLOCK', text.join('\n'));
  },
  note(text: string): Annotation {
    return new Annotation('LINE', text);
  },
  /**
   * input 参数
   */
  input<T extends Scalar, N extends string>(
    name: N,
    value: T,
    type?: DbTypeOf<T>
  ): Parameter<T, N> {
    return new Parameter(name, type, value, 'INPUT');
  },
  /**
   * output参数
   */
  output<T extends DbType, N extends string>(
    name: N,
    type: T,
    value?: TsTypeOf<T>
  ): Parameter<TsTypeOf<T>, N> {
    return new Parameter(name, type, value, 'OUTPUT');
  },
};
