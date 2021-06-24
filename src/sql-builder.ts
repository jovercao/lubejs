import { Name, CreateTable, CreateTableMemberBuilder, Statement, Document, Scalar, CompatibleExpression, Expression, Condition, Literal, CompatibleCondition, Select, RowObject, ModelClass, ProxiedTable, DefaultRowObject, Procedure, Field, BuiltIn, Variant, Star, CompatibleTable, FieldsOf, Insert, Update, Delete, SelectAction, Block, Execute, ProxiedRowset, ScalarFuncInvoke, Assignable, Assignment, DeclareBuilder, VariantDeclare, TableVariantDeclare, Declare, When, Case, CompatibleNamedSelect, With, AlterTable, CreateView, AlterView, CreateIndex, CreateProcedure, AlterProcedure, CreateFunction, AlterFunction, DropTable, DropView, DropProcedure, DropFunction, DropIndex, AnnotationKind, Annotation, DbTypeOf, Parameter, DbType, TsTypeOf, ParenthesesCondition, ParenthesesExpression, UnaryOperation, UNARY_OPERATION_OPERATOR, BinaryOperation, BINARY_OPERATION_OPERATOR, LOGIC_OPERATOR, UnaryLogicCondition, ExistsCondition, BinaryCompareCondition, BINARY_COMPARE_OPERATOR, UnaryCompareCondition, UNARY_COMPARE_OPERATOR, Table, Func, Raw, TableFuncInvoke, PARAMETER_DIRECTION } from '.'
import { Standard } from './std'
import { isCondition, isExpression, isScalar, joinConditions, ensureCondition, isSelect, ensureExpression, makeProxiedRowset, isPlainObject } from './util'

export type CreateTableHandler = {
  <N extends string>(name: Name<N>): CreateTable<N>;
} & CreateTableMemberBuilder;

export interface SqlBuilder extends Standard {
  doc(statements: Statement[]): Document;
  doc(...statements: Statement[]): Document;
  /**
   * 括号表达式，将表达式括起来，如优先级
   */
  enclose<T extends Scalar>(value: CompatibleExpression<T>): Expression<T>;
  enclose(condition: Condition): Condition;

  /**
   * 算术运算 +
   * @param left 左值
   * @param right 右值
   * @returns 返回算术运算表达式
   */
  neg(expr: CompatibleExpression<number>): Expression<number>;

  /**
   * 字符串连接运算
   */
  concat(
    left: CompatibleExpression<string>,
    right: CompatibleExpression<string>
  ): Expression<string>;

  /**
   * 算术运算 +
   * @param left 左值
   * @param right 右值
   * @returns 返回算术运算表达式
   */
  add(
    left: CompatibleExpression<number>,
    right: CompatibleExpression<number>
  ): Expression<number>;

  /**
   * 算术运算 -
   * @param left 左值
   * @param right 右值
   * @returns 返回算术运算表达式
   */
  sub(
    left: CompatibleExpression<number>,
    right: CompatibleExpression<number>
  ): Expression<number>;

  /**
   * 算术运算 *
   * @param left 左值
   * @param right 右值
   * @returns 返回算术运算表达式
   */
  mul(
    left: CompatibleExpression<number>,
    right: CompatibleExpression<number>
  ): Expression<number>;

  /**
   * 算术运算 /
   * @param left 左值
   * @param right 右值
   * @returns 返回算术运算表达式
   */
  div(
    left: CompatibleExpression<number>,
    right: CompatibleExpression<number>
  ): Expression<number>;

  /**
   * 算术运算 %
   * @param left 左值
   * @param right 右值
   * @returns 返回算术运算表达式
   */
  mod(
    left: CompatibleExpression<number>,
    right: CompatibleExpression<number>
  ): Expression<number>;

  /**
   * 位算术运算 ^
   * @param left 左值
   * @param right 右值
   * @returns 返回算术运算表达式
   */
  xor(
    left: CompatibleExpression<number>,
    right: CompatibleExpression<number>
  ): Expression<number>;

  /**
   * 位算术运算 <<
   * @param left 左值
   * @param right 右值
   * @returns 返回算术运算表达式
   */
  shl(
    left: CompatibleExpression<number>,
    right: CompatibleExpression<number>
  ): Expression<number>;

  /**
   * 位算术运算 >>
   * @param left 左值
   * @param right 右值
   * @returns 返回算术运算表达式
   */
  shr(
    left: CompatibleExpression<number>,
    right: CompatibleExpression<number>
  ): Expression<number>;

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
  and(
    left: CompatibleExpression<number>,
    right: CompatibleExpression<number>
  ): Expression<number>;

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
  or(
    left: CompatibleExpression<number>,
    right: CompatibleExpression<number>
  ): Expression<number>;

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
  not(value: CompatibleExpression<number>): Expression<number>;

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
  table<T extends RowObject = any>(
    modelCtr: ModelClass<T>
  ): ProxiedTable<T, string>;
  table<T extends RowObject = DefaultRowObject, N extends string = string>(
    name: Name<N>
  ): ProxiedTable<T, N>;

  /**
   * 声明一个函数
   */
  func<N extends string>(name: Name<N>, builtIn?: boolean): Func<N>;

  /**
   * 创建一个可供调用的存储过程函数
   */
  proc<
    R extends Scalar = number,
    O extends RowObject[] = never,
    N extends string = string
  >(
    name: Name<N>,
    buildIn?: boolean
  ): Procedure<R, O, N>;

  /**
   * 创建一个字段
   */
  field<T extends Scalar, N extends string>(name: Name<N>): Field<T, N>;

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

  readonly select: SelectAction;

  raw(sql: string): any;

  block(statements: Statement[]): Block;

  /**
   * 执行一个存储过程
   * @param proc
   * @param params
   */
  //   execute<T extends Model> (
  //   proc: Name | Procedure<T, string>,
  //   params?: Expressions<JsConstant>[]
  // ): Execute<T>
  //   execute<T extends Model> (
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

  makeInvoke<T extends RowObject>(
    type: 'table',
    name: Name,
    builtIn?: boolean
  ): () => ProxiedRowset<T>;
  makeInvoke<T extends RowObject, A1 extends CompatibleExpression>(
    type: 'table',
    name: Name,
    builtIn?: boolean
  ): (arg1: A1) => ProxiedRowset<T>;
  makeInvoke<
    T extends RowObject,
    A1 extends CompatibleExpression,
    A2 extends CompatibleExpression
  >(
    type: 'table',
    name: Name,
    builtIn?: boolean
  ): (arg1: A1, arg2: A2) => ProxiedRowset<T>;
  makeInvoke<
    T extends RowObject,
    A1 extends CompatibleExpression,
    A2 extends CompatibleExpression,
    A3 extends CompatibleExpression
  >(
    type: 'table',
    name: Name,
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
    name: Name,
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
    name: Name,
    builtIn?: boolean
  ): (arg1: A1, arg2: A2, arg3: A3, arg4: A4, arg5: A5) => ProxiedRowset<T>;

  makeInvoke(
    type: 'table',
    name: Name,
    builtIn?: boolean
  ): (...args: CompatibleExpression[]) => ProxiedRowset<any>;

  makeInvoke<T extends Scalar>(
    type: 'scalar',
    name: Name,
    builtIn?: boolean
  ): () => Expression<T>;
  makeInvoke<T extends Scalar, A1 extends CompatibleExpression>(
    type: 'scalar',
    name: Name,
    builtIn?: boolean
  ): (arg1: A1) => Expression<T>;
  makeInvoke<
    T extends Scalar,
    A1 extends CompatibleExpression,
    A2 extends CompatibleExpression
  >(
    type: 'scalar',
    name: Name,
    builtIn?: boolean
  ): (arg1: A1, arg2: A2) => Expression<T>;
  makeInvoke<
    T extends Scalar,
    A1 extends CompatibleExpression,
    A2 extends CompatibleExpression,
    A3 extends CompatibleExpression
  >(
    type: 'scalar',
    name: Name,
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
    name: Name,
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
    name: Name,
    builtIn?: boolean
  ): (arg1: A1, arg2: A2, arg3: A3, arg4: A4, arg5: A5) => Expression<T>;

  makeInvoke(
    type: 'scalar',
    name: Name,
    builtIn?: boolean
  ): (...args: CompatibleExpression[]) => Expression<any>;

  /**
   * 创建一个可供JS调用的存储过程
   */
  makeExec<R extends Scalar = number, O extends RowObject[] = []>(
    name: Name,
    builtIn?: boolean
  ): () => Execute<R, O>;
  makeExec<
    A1 extends CompatibleExpression,
    R extends Scalar = number,
    O extends RowObject[] = []
  >(
    name: Name,
    builtIn?: boolean
  ): (arg1: A1) => Execute<R, O>;
  makeExec<
    A1 extends CompatibleExpression,
    A2 extends CompatibleExpression,
    R extends Scalar = number,
    O extends RowObject[] = []
  >(
    name: Name,
    builtIn?: boolean
  ): (arg1: A1, arg2: A2) => Execute<R, O>;
  makeExec<
    A1 extends CompatibleExpression,
    A2 extends CompatibleExpression,
    A3 extends CompatibleExpression,
    R extends Scalar = number,
    O extends RowObject[] = []
  >(
    name: Name,
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
    name: Name,
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
    name: Name,
    builtIn?: boolean
  ): (arg1: A1, arg2: A2, arg3: A3, arg4: A4, arg5: A5) => Execute<R, O>;

  makeExec(
    name: Name,
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
    value?: CompatibleExpression<T>
  ): When<T>;

  case<T extends Scalar>(expr?: CompatibleExpression): Case<T>;

  /**
   * With语句
   */
  with(...rowsets: CompatibleNamedSelect[]): With;
  with(rowsets: Record<string, Select>): With;

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

  /**
   * 创建表格
   * @param name
   * @param members
   * @returns
   */
  createTable: CreateTableHandler;

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
  doc(...statements: Statement[] | [Statement[]]): Document {
    const lines = Array.isArray(statements[0])
      ? statements[0]
      : (statements as Statement[]);
    return new Document(lines);
  },
  enclose(value: Condition | CompatibleExpression): any {
    if (isCondition(value)) {
      return new ParenthesesCondition(value);
    }
    return new ParenthesesExpression(value);
  },
  neg(expr: CompatibleExpression<number>): Expression<number> {
    return new UnaryOperation(UNARY_OPERATION_OPERATOR.NEG, expr);
  },

  /**
   * 字符串连接运算
   */
  concat(
    left: CompatibleExpression<string>,
    right: CompatibleExpression<string>
  ): Expression<string> {
    return new BinaryOperation(BINARY_OPERATION_OPERATOR.CONCAT, left, right);
  },

  /**
   * 算术运算 +
   * @param left 左值
   * @param right 右值
   * @returns 返回算术运算表达式
   */
  add(
    left: CompatibleExpression<number>,
    right: CompatibleExpression<number>
  ): Expression<number> {
    return new BinaryOperation(BINARY_OPERATION_OPERATOR.ADD, left, right);
  },

  /**
   * 算术运算 -
   * @param left 左值
   * @param right 右值
   * @returns 返回算术运算表达式
   */
  sub(
    left: CompatibleExpression<number>,
    right: CompatibleExpression<number>
  ): Expression<number> {
    return new BinaryOperation(BINARY_OPERATION_OPERATOR.SUB, left, right);
  },
  /**
   * 算术运算 *
   * @param left 左值
   * @param right 右值
   * @returns 返回算术运算表达式
   */
  mul(
    left: CompatibleExpression<number>,
    right: CompatibleExpression<number>
  ): Expression<number> {
    return new BinaryOperation(BINARY_OPERATION_OPERATOR.MUL, left, right);
  },
  /**
   * 算术运算 /
   * @param left 左值
   * @param right 右值
   * @returns 返回算术运算表达式
   */
  div(
    left: CompatibleExpression<number>,
    right: CompatibleExpression<number>
  ): Expression<number> {
    return new BinaryOperation(BINARY_OPERATION_OPERATOR.DIV, left, right);
  },
  /**
   * 算术运算 %
   * @param left 左值
   * @param right 右值
   * @returns 返回算术运算表达式
   */
  mod(
    left: CompatibleExpression<number>,
    right: CompatibleExpression<number>
  ): Expression<number> {
    return new BinaryOperation(BINARY_OPERATION_OPERATOR.MOD, left, right);
  },
  /*
   * 位算术运算 ^
   * @param left 左值
   * @param right 右值
   * @returns 返回算术运算表达式
   */
  xor(
    left: CompatibleExpression<number>,
    right: CompatibleExpression<number>
  ): Expression<number> {
    return new BinaryOperation(BINARY_OPERATION_OPERATOR.XOR, left, right);
  },
  /**
   * 位算术运算 <<
   * @param left 左值
   * @param right 右值
   * @returns 返回算术运算表达式
   */
  shl(
    left: CompatibleExpression<number>,
    right: CompatibleExpression<number>
  ): Expression<number> {
    return new BinaryOperation(BINARY_OPERATION_OPERATOR.SHL, left, right);
  },
  /**
   * 位算术运算 >>
   * @param left 左值
   * @param right 右值
   * @returns 返回算术运算表达式
   */
  shr(
    left: CompatibleExpression<number>,
    right: CompatibleExpression<number>
  ): Expression<number> {
    return new BinaryOperation(BINARY_OPERATION_OPERATOR.SHR, left, right);
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
      | [CompatibleExpression, CompatibleExpression]
  ): any {
    if (Array.isArray(args[0])) {
      args = args[0];
    }

    if (isExpression(args[0]) || isScalar(args[0])) {
      return new BinaryOperation(
        BINARY_OPERATION_OPERATOR.AND,
        args[0],
        args[1] as CompatibleExpression
      );
    }

    return joinConditions(LOGIC_OPERATOR.AND, args as CompatibleCondition[]);
  },

  or(
    ...args:
      | CompatibleCondition[]
      | [CompatibleCondition[]]
      | [CompatibleExpression, CompatibleExpression]
  ): any {
    if (Array.isArray(args[0])) {
      args = args[0] as CompatibleCondition[];
    }
    if (isExpression(args[0]) || isScalar(args[0])) {
      return new BinaryOperation(
        BINARY_OPERATION_OPERATOR.OR,
        args[0],
        args[1] as CompatibleExpression
      );
    }

    return joinConditions(LOGIC_OPERATOR.OR, args as CompatibleCondition[]);
  },

  /**
   * Not 逻辑运算
   * @param arg
   */
  not(arg: Condition | CompatibleExpression): any {
    if (isExpression(arg) || isScalar(arg)) {
      return new UnaryOperation(UNARY_OPERATION_OPERATOR.NOT, arg);
    }
    arg = ensureCondition(arg);
    return new UnaryLogicCondition(LOGIC_OPERATOR.NOT, arg);
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
    return new BinaryCompareCondition(BINARY_COMPARE_OPERATOR.EQ, left, right);
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
    return new BinaryCompareCondition(BINARY_COMPARE_OPERATOR.NEQ, left, right);
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
    return new BinaryCompareCondition(BINARY_COMPARE_OPERATOR.LT, left, right);
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
    return new BinaryCompareCondition(BINARY_COMPARE_OPERATOR.LTE, left, right);
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
    return new BinaryCompareCondition(BINARY_COMPARE_OPERATOR.GT, left, right);
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
    return new BinaryCompareCondition(BINARY_COMPARE_OPERATOR.GTE, left, right);
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
    return new BinaryCompareCondition(
      BINARY_COMPARE_OPERATOR.LIKE,
      left,
      right
    );
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
    return new BinaryCompareCondition(
      BINARY_COMPARE_OPERATOR.NOT_LIKE,
      left,
      right
    );
  },

  in<T extends Scalar>(
    left: CompatibleExpression<T>,
    values: CompatibleExpression<T>[] | Select<any>
  ): Condition {
    return new BinaryCompareCondition(
      BINARY_COMPARE_OPERATOR.IN,
      left,
      isSelect(values) ? values.asValue() : values.map(v => ensureExpression(v))
    );
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
    return new BinaryCompareCondition(
      BINARY_COMPARE_OPERATOR.NOT_IN,
      left,
      values.map(v => ensureExpression(v))
    );
  },
  /**
   * 比较运算 IS NULL
   * @returns 返回比较运算符
   * @param expr 表达式
   */
  isNull(expr: CompatibleExpression<Scalar>): Condition {
    return new UnaryCompareCondition(UNARY_COMPARE_OPERATOR.IS_NULL, expr);
  },
  /**
   * 比较运算 IS NOT NULL
   * @param expr 表达式
   * @returns 返回比较运算符
   */
  isNotNull(expr: CompatibleExpression<Scalar>): Condition {
    return new UnaryCompareCondition(UNARY_COMPARE_OPERATOR.IS_NOT_NULL, expr);
  },

  table<T extends RowObject = DefaultRowObject>(
    nameOrModel: Name | ModelClass<T>
  ): ProxiedTable<T, string> {
    if (typeof nameOrModel === 'function') {
      return makeProxiedRowset(new Table<T, string>(nameOrModel.name));
    }
    return makeProxiedRowset(new Table<T, string>(nameOrModel));
  },
  /**
   * 声明一个函数
   */
  func<N extends string>(name: Name<N>, builtIn = false): Func<N> {
    return new Func(name, builtIn);
  },
  /**
   * 创建一个可供调用的存储过程函数
   */
  proc<
    R extends Scalar = number,
    O extends RowObject[] = never,
    N extends string = string
  >(name: Name<N>, buildIn = false): Procedure<R, O, N> {
    return new Procedure<R, O, N>(name, buildIn);
  },
  /**
   * 创建一个字段
   */
  field<T extends Scalar, N extends string>(name: Name<N>): Field<T, N> {
    return new Field(name);
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
    fields?: FieldsOf<T>[] | Field<Scalar, FieldsOf<T>>[]
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
    fields?: FieldsOf<T>[] | Field<Scalar, FieldsOf<T>>[]
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
  block(statements: Statement[]): Block {
    return new Block(statements);
  },

  execute<R extends Scalar = any, O extends RowObject[] = []>(
    proc: Name | Procedure<R, O, string>,
    params?: CompatibleExpression<Scalar>[]
    // | Parameter<JsConstant, string>[] | InputObject
  ): Execute<R, O> {
    return new Execute(proc, params);
  },
  invokeTableFunction<T extends RowObject = any>(
    func: Name | Func<string>,
    args: CompatibleExpression<Scalar>[]
  ): ProxiedRowset<T> {
    return makeProxiedRowset(new TableFuncInvoke<T>(func, args));
  },
  invokeScalarFunction<T extends Scalar = any>(
    func: Name | Func<string>,
    args: CompatibleExpression<Scalar>[]
  ): ScalarFuncInvoke<T> {
    return new ScalarFuncInvoke<T>(func, args);
  },

  makeInvoke(type: 'table' | 'scalar', name: Name, builtIn = false): any {
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

  makeExec(name: Name, builtIn = false): any {
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
    value?: CompatibleExpression<T>
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
  invoke(type: 'table' | 'scalar', name: Name, builtIn = false): any {
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
  createTable: Object.assign(
    (name: any) => new CreateTable(name),
    CreateTableMemberBuilder
  ),

  alterTable<N extends string>(name: Name<N>): AlterTable<N> {
    return new AlterTable(name);
  },
  createView<T extends RowObject = any, N extends string = string>(
    name: Name<N>
  ): CreateView<T, N> {
    return new CreateView(name);
  },
  alterView<T extends RowObject = any, N extends string = string>(
    name: Name<N>
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
  createScalarFunction(name: Name): CreateFunction {
    return new CreateFunction(name, 'SCALAR');
  },
  createTableFunction(name: Name): CreateFunction {
    return new CreateFunction(name, 'TABLE');
  },
  alterScalarFunction(name: Name): AlterFunction {
    return new AlterFunction(name, 'SCALAR');
  },
  alterTableFunction(name: Name): AlterFunction {
    return new AlterFunction(name, 'TABLE');
  },
  dropTable<N extends string>(name: Name<N>): DropTable<N> {
    return new DropTable(name);
  },
  dropView<N extends string>(name: Name<N>): DropView<N> {
    return new DropView(name);
  },
  dropProcedure<N extends string>(name: Name<N>): DropProcedure<N> {
    return new DropProcedure(name);
  },
  dropFunction<N extends string>(name: Name<N>): DropFunction<N> {
    return new DropFunction(name);
  },
  dropIndex<N extends string>(table: Name, name: N): DropIndex<N> {
    return new DropIndex(table, name);
  },
  annotation(text: string, kind: AnnotationKind = 'LINE'): Annotation {
    return new Annotation(kind, text);
  },
  /**
   * input 参数
   */
  input<T extends Scalar, N extends string>(
    name: N,
    value: T,
    type?: DbTypeOf<T>
  ): Parameter<T, N> {
    return new Parameter(name, type, value, PARAMETER_DIRECTION.INPUT);
  },
  /**
   * output参数
   */
  output<T extends DbType, N extends string>(
    name: N,
    type: T,
    value?: TsTypeOf<T>
  ): Parameter<TsTypeOf<T>, N> {
    return new Parameter(name, type, value, PARAMETER_DIRECTION.OUTPUT);
  },
};

export default SqlBuilder;
