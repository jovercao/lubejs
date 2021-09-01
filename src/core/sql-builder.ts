import { Numeric } from 'decimal.js-light';
import {
  AlterDatabase,
  DropDatabase,
  CreateDatabase,
  CompatiableObjectName,
  CreateSequence,
  DropSequence,
  Use,
  DbType,
  Break,
  Continue,
  Statement,
  Document,
  Condition,
  Scalar,
  CompatibleExpression,
  Expression,
  If,
  Interger,
  Literal,
  CompatibleCondition,
  Select,
  RowObject,
  ProxiedTable,
  Func,
  Procedure,
  CompatibleRowset,
  Field,
  BuiltIn,
  Variant,
  Star,
  CompatibleTable,
  ColumnsOf,
  Insert,
  Update,
  Delete,
  While,
  Block,
  Execute,
  ProxiedRowset,
  ScalarFuncInvoke,
  Assignment,
  DeclareBuilder,
  VariantDeclare,
  TableVariantDeclare,
  Declare,
  When,
  Case,
  WithSelect,
  CreateTableHandler,
  AlterTable,
  CreateView,
  AlterView,
  CreateIndex,
  CreateProcedure,
  AlterProcedure,
  CreateFunction,
  AlterFunction,
  DropTable,
  DropView,
  DropProcedure,
  DropFunction,
  DropIndex,
  Annotation,
  DbTypeOf,
  Parameter,
  TsTypeOf,
  GroupCondition,
  GroupExpression,
  UnaryOperation,
  BinaryOperation,
  isScalar,
  LOGIC_OPERATOR,
  UnaryLogicCondition,
  ExistsCondition,
  BinaryCompareCondition,
  UnaryCompareCondition,
  Table,
  Raw,
  TableFuncInvoke,
  CreateTable,
  CreateTableMemberBuilder,
  Assignable,
  SelectAction,
  With,
} from './ast';
import { isPlainObject } from './ast/util';
import { Standard, STD } from './stanrard';

export class SqlBuilder extends Standard {
  get type(): typeof DbType {
    return DbType;
  }
  use(database: string): Use {
    return new Use(database);
  }
  if(condition: Condition): If {
    return new If(condition);
  }
  while(condition: Condition): While {
    return new While(condition);
  }

  readonly break: Break = new Break();

  continue: Continue = new Continue();

  createDatabase(name: string): CreateDatabase {
    return new CreateDatabase(name);
  }
  alterDatabase(name: string): AlterDatabase {
    return new AlterDatabase(name);
  }
  dropDatabase(name: string): DropDatabase {
    return new DropDatabase(name);
  }
  createSequence(name: CompatiableObjectName): CreateSequence {
    return new CreateSequence(name);
  }
  dropSequence(name: CompatiableObjectName): DropSequence {
    return new DropSequence(name);
  }

  /**
   * 创建一个SQL文档
   * @param statements 文档代码
   */
  doc(statements: Statement[]): Document;
  doc(...statements: Statement[]): Document;
  doc(...statements: Statement[] | [Statement[]]): Document {
    const lines = Array.isArray(statements[0])
      ? statements[0]
      : (statements as Statement[]);
    return new Document(lines);
  }
  group(value: Condition | CompatibleExpression): any {
    if (Condition.isCondition(value)) {
      return new GroupCondition(value);
    }
    return new GroupExpression(value);
  }
  neg(expr: CompatibleExpression<number>): Expression<number> {
    return UnaryOperation.neg(expr);
  }

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
  }

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
    return BinaryOperation.add(left as any, right);
  }

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
    return BinaryOperation.sub(left as any, right);
  }
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
    return BinaryOperation.mul(left as any, right);
  }
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
    return BinaryOperation.div(left as any, right);
  }

  /**
   * 算术运算 %
   * @param left 左值
   * @param right 右值
   * @returns 返回算术运算表达式
   */
  mod<T extends Numeric>(
    value: CompatibleExpression<T>,
    x: CompatibleExpression<T>
  ): Expression<T> {
    return BinaryOperation.mod(value as any, x);
  }
  /*
   * 位算术运算 ^
   * @param left 左值
   * @param right 右值
   * @returns 返回算术运算表达式
   */
  xor<T extends Interger>(
    left: CompatibleExpression<T>,
    right: CompatibleExpression<T>
  ): Expression<T> {
    return BinaryOperation.xor(left, right);
  }
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
  }
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
  }
  // static convert<T extends DbType>(
  //   expr: CompatibleExpression<Scalar>
  //   toType: T
  // ): Expression<TsTypeOf<T>> {
  //   return convert(expr, toType);
  // }

  literal<T extends Scalar>(value: T): Literal<T> {
    return new Literal(value);
  }

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

    return Condition.and(args as CompatibleCondition[]);
  }

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
  or(
    ...args:
      | CompatibleCondition[]
      | [CompatibleCondition[]]
      | [CompatibleExpression<Interger>, CompatibleExpression<Interger>]
  ): any {
    if (Array.isArray(args[0])) {
      args = args[0];
    }
    if (Expression.isExpression(args[0]) || isScalar(args[0])) {
      return BinaryOperation.or(
        args[0],
        args[1] as CompatibleExpression<Interger>
      );
    }

    return Condition.or(args as CompatibleCondition[]);
  }

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
  not(arg: Condition | CompatibleExpression<Interger>): any {
    if (Expression.isExpression(arg) || isScalar(arg)) {
      return UnaryOperation.not(arg);
    }
    return UnaryLogicCondition.not(arg);
  }

  /**
   * 判断是否存在
   * @param select 查询语句
   */
  exists(select: Select<any>): Condition {
    return new ExistsCondition(select);
  }
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
  }
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
  }
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
  }
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
  }
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
  }
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
  }
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
  }
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
  }

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
  in<T extends Scalar>(
    left: CompatibleExpression<T>,
    values: CompatibleExpression<T>[] | Select<any>
  ): Condition {
    return BinaryCompareCondition.in(left, values);
  }
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
  }
  /**
   * 比较运算 IS NULL
   * @returns 返回比较运算符
   * @param expr 表达式
   */
  isNull(expr: CompatibleExpression<Scalar>): Condition {
    return UnaryCompareCondition.isNull(expr);
  }
  /**
   * 比较运算 IS NOT NULL
   * @param expr 表达式
   * @returns 返回比较运算符
   */
  isNotNull(expr: CompatibleExpression<Scalar>): Condition {
    return UnaryCompareCondition.isNotNull(expr);
  }

  table<T>(nameOrModel: any): any {
    return Table.ensure(nameOrModel);
  }
  /**
   * 声明一个函数
   */
  func<N extends string>(
    name: CompatiableObjectName<N>,
    builtIn = false
  ): Func<N> {
    return new Func(name, builtIn);
  }
  /**
   * 创建一个可供调用的存储过程函数
   */
  proc<
    R extends Scalar = number,
    O extends RowObject[] = never,
    N extends string = string
  >(name: CompatiableObjectName<N>, buildIn = false): Procedure<R, O, N> {
    return new Procedure<R, O, N>(name, buildIn);
  }
  /**
   * 创建一个字段
   */
  field<T extends Scalar, N extends string>(
    name: N,
    rowset?: CompatibleRowset
  ): Field<T, N> {
    return new Field(name, rowset);
  }
  builtIn<T extends string>(name: T): BuiltIn<T> {
    return new BuiltIn(name);
  }
  variant<T extends Scalar, N extends string = string>(name: N): Variant<T, N> {
    return new Variant(name);
  }
  get star(): Star<any> {
    return new Star<any>();
  }

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
  }
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
  }
  /**
   * 更新一个表格
   * @param table
   */
  update<T extends RowObject = any>(
    table: CompatibleTable<T, string>
  ): Update<T> {
    return new Update(table);
  }
  /**
   * 删除一个表格
   * @param table 表格
   */
  delete<T extends RowObject = any>(
    table: CompatibleTable<T, string>
  ): Delete<T> {
    return new Delete(table);
  }

  readonly select: SelectAction = (...args: any[]): any => {
    return new Select(...args);
  };

  raw(sql: string): any {
    return new Raw(sql);
  }

  block(...statements: Statement[]): Block;
  block(statements: Statement[]): Block;
  block(...statements: Statement[] | [Statement[]]): Block {
    if (statements.length === 1 && Array.isArray(statements[0])) {
      statements = statements[0];
    }
    return new Block(statements as Statement[]);
  }

  execute<R extends Scalar = any, O extends RowObject[] = []>(
    proc: CompatiableObjectName | Procedure<R, O, string>,
    params?: CompatibleExpression<Scalar>[]
    // | Parameter<JsConstant, string>[] | InputObject
  ): Execute<R, O> {
    return new Execute(proc, params);
  }

  invokeTableFunction<T extends RowObject = any>(
    func: CompatiableObjectName | Func<string>,
    args: CompatibleExpression<Scalar>[]
  ): ProxiedRowset<T>;

  invokeTableFunction<T extends RowObject = any>(
    func: CompatiableObjectName | Func<string>,
    args: CompatibleExpression<Scalar>[]
  ): ProxiedRowset<T> {
    return new TableFuncInvoke(func, args) as any;
  }

  invokeScalarFunction<T extends Scalar = any>(
    func: CompatiableObjectName | Func<string>,
    args: CompatibleExpression<Scalar>[]
  ): ScalarFuncInvoke<T> {
    return new ScalarFuncInvoke(func, args);
  }

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
  makeInvoke(
    type: 'table' | 'scalar',
    name: CompatiableObjectName,
    builtIn = false
  ): any {
    if (type === 'table') {
      return function (
        ...args: CompatibleExpression[]
      ): ProxiedRowset<RowObject> {
        return SQL.invokeTableFunction(SQL.func(name, builtIn), args);
      };
    }
    if (type === 'scalar') {
      return function (...args: CompatibleExpression<Scalar>[]): Expression {
        return SQL.invokeScalarFunction<Scalar>(SQL.func(name, builtIn), args);
      };
    }
    throw new Error('invalid arg value of `type`');
  }

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
  makeExec(name: CompatiableObjectName, builtIn = false): any {
    return function (
      ...args: CompatibleExpression<Scalar>[]
    ): Execute<any, any> {
      return SQL.execute(SQL.proc<Scalar, any, string>(name, builtIn), args);
    };
  }
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
  }
  /**
   * 变量声明
   * @param declares 变量列表
   */
  declare(
    build: (builder: DeclareBuilder) => (VariantDeclare | TableVariantDeclare)[]
  ): Declare {
    return new Declare(build);
  }
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
  }

  case<T extends Scalar>(expr?: CompatibleExpression): Case<T> {
    return new Case<T>(expr);
  }
  /**
   * With语句
   */
  with(...rowsets: any): With {
    if (rowsets.length === 1 && isPlainObject(rowsets)) {
      return new With(rowsets[0]);
    }
    return new With(rowsets);
  }
  union<T extends RowObject = any>(...selects: Select<T>[]): Select<T> {
    selects.forEach((sel, index) => {
      if (index < selects.length - 1) sel.union(selects[index + 1]);
    });
    return selects[0];
  }
  unionAll<T extends RowObject = any>(...selects: Select<T>[]): Select<T> {
    selects.forEach((sel, index) => {
      if (index < selects.length - 1) sel.unionAll(selects[index + 1]);
    });
    return selects[0];
  }
  invoke(
    type: 'table' | 'scalar',
    name: CompatiableObjectName,
    builtIn = false
  ): any {
    if (type === 'table') {
      return function (
        ...args: CompatibleExpression[]
      ): ProxiedRowset<RowObject> {
        return SQL.invokeTableFunction(SQL.func(name, builtIn), args);
      };
    }
    if (type === 'scalar') {
      return function (...args: CompatibleExpression<Scalar>[]): Expression {
        return SQL.invokeScalarFunction<Scalar>(SQL.func(name, builtIn), args);
      };
    }
    throw new Error('invalid arg value of `type`');
  }

  readonly createTable: CreateTableHandler = Object.assign((name: any) => {
    const table = new CreateTable(name);
    return table;
  }, CreateTableMemberBuilder);

  alterTable<N extends string>(name: CompatiableObjectName<N>): AlterTable<N> {
    return new AlterTable(name);
  }

  createView<T extends RowObject = any, N extends string = string>(
    name: CompatiableObjectName<N>
  ): CreateView<T, N> {
    return new CreateView(name);
  }

  alterView<T extends RowObject = any, N extends string = string>(
    name: CompatiableObjectName<N>
  ): AlterView<T, N> {
    return new AlterView(name);
  }

  createIndex(name: string): CreateIndex {
    return new CreateIndex(name);
  }

  createProcedure(name: CompatiableObjectName): CreateProcedure {
    return new CreateProcedure(name);
  }

  alterProcedure(name: CompatiableObjectName): AlterProcedure {
    return new AlterProcedure(name);
  }

  createFunction(name: CompatiableObjectName): CreateFunction {
    return new CreateFunction(name);
  }

  alterFunction(name: CompatiableObjectName): AlterFunction {
    return new AlterFunction(name);
  }

  dropTable<N extends string>(name: CompatiableObjectName<N>): DropTable<N> {
    return new DropTable(name);
  }

  dropView<N extends string>(name: CompatiableObjectName<N>): DropView<N> {
    return new DropView(name);
  }

  dropProcedure<N extends string>(
    name: CompatiableObjectName<N>
  ): DropProcedure<N> {
    return new DropProcedure(name);
  }

  dropFunction<N extends string>(
    name: CompatiableObjectName<N>
  ): DropFunction<N> {
    return new DropFunction(name);
  }

  dropIndex<N extends string>(
    table: CompatiableObjectName,
    name: N
  ): DropIndex<N> {
    return new DropIndex(table, name);
  }

  annotation(...text: string[]): Annotation {
    return new Annotation('BLOCK', text.join('\n'));
  }

  note(text: string): Annotation {
    return new Annotation('LINE', text);
  }

  /**
   * input 参数
   */
  input<T extends Scalar, N extends string>(
    name: N,
    value: T,
    type?: DbTypeOf<T>
  ): Parameter<T, N> {
    return new Parameter(name, type, value, 'INPUT');
  }

  /**
   * output参数
   */
  output<T extends DbType, N extends string>(
    name: N,
    type: T,
    value?: TsTypeOf<T>
  ): Parameter<TsTypeOf<T>, N> {
    return new Parameter(name, type, value, 'OUTPUT');
  }

  static sql: SqlBuilder = new SqlBuilder();
}

export const SQL: SqlBuilder = SqlBuilder.sql;
