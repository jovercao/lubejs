import { RowObject, ColumnsOf } from './types';
import { DbType, DbTypeOf, TsTypeOf } from './db-type';
import { Document } from './document';
import { CompatiableObjectName, Func, Procedure, BuiltIn } from './object';
import {
  Table,
  WithSelect,
  ProxiedTable,
  CompatibleRowset,
  ProxiedRowset,
  CompatibleTable,
} from './rowset';
import {
  GroupCondition,
  BinaryLogicCondition,
  LOGIC_OPERATOR,
  BinaryCompareCondition,
  BINARY_COMPARE_OPERATOR,
  ExistsCondition,
  CONDITION_KIND,
  Condition,
  CompatibleCondition,
  UnaryLogicCondition,
  UnaryCompareCondition,
  UNARY_COMPARE_OPERATOR,
} from './condition';
import { Standard } from '../standard';
import {
  Assignable,
  BinaryOperation,
  Case,
  CompatibleExpression,
  Expression,
  Field,
  GroupExpression,
  Literal,
  Parameter,
  StandardExpression,
  UnaryOperation,
  Variant,
  When,
} from './expression';
import {
  BINARY_OPERATION_OPERATOR,
  UNARY_OPERATION_OPERATOR,
} from './expression/common/operation';
import { Raw } from './raw';
import { Interger, isScalar, Numeric, Scalar } from './scalar';
import {
  AlterDatabase,
  AlterFunction,
  AlterProcedure,
  AlterTable,
  AlterView,
  Annotation,
  Assignment,
  Block,
  Break,
  Continue,
  CreateDatabase,
  CreateFunction,
  CreateIndex,
  CreateProcedure,
  CreateSequence,
  CreateTable,
  CreateView,
  Declare,
  DeclareBuilder,
  Delete,
  DropDatabase,
  DropFunction,
  DropIndex,
  DropProcedure,
  DropSequence,
  DropTable,
  DropView,
  Execute,
  If,
  Insert,
  Select,
  SelectAction,
  SelectAliasObject,
  Star,
  Statement,
  TableVariantDeclare,
  Update,
  Use,
  VariantDeclare,
  While,
  With,
} from './statement';
import { clone, isPlainObject } from './util';

/**
 * 所有AST类的基类
 */
export abstract class SQL {

  abstract readonly $type: SQL_SYMBOLE;
  /**
   * 克隆自身
   */
  clone(): this {
    return clone(this);
  }

  static get std(): Standard {
    return Standard.std;
  }

  static get type(): typeof DbType {
    return DbType;
  }

  static use(database: string): Use {
    return new Use(database);
  }

  static if(condition: Condition): If {
    return new If(condition);
  }

  static while(condition: Condition): While {
    return new While(condition);
  }

  static readonly break: Break = new Break();

  static continue: Continue = new Continue();

  /**
   * 创建一个SQL文档
   * @param statements 文档代码
   */
  static doc(statements: Statement[]): Document;
  static doc(...statements: Statement[]): Document;
  static doc(...statements: Statement[] | [Statement[]]): Document {
    const lines = Array.isArray(statements[0])
      ? statements[0]
      : (statements as Statement[]);
    return new Document(lines);
  }

  static group(condition: CompatibleCondition): Condition;
  static group<T extends Scalar>(expr: CompatibleExpression<T>): Expression<T>;
  static group(value: CompatibleCondition | CompatibleExpression): any {
    if (Condition.isCondition(value) || isPlainObject(value)) {
      return new GroupCondition(value as CompatibleCondition);
    }
    return new GroupExpression(value as CompatibleExpression);
  }

  /**
   * 负号运算符 -
   */
  static neg(expr: CompatibleExpression<number>): Expression<number> {
    return new UnaryOperation(UNARY_OPERATION_OPERATOR.NEG, expr);
  }

  /**
   * 字符串连接运算
   */
  static concat(
    ...strs: [
      CompatibleExpression<string>,
      CompatibleExpression<string>,
      ...CompatibleExpression<string>[]
    ]
  ): Expression<string> {
    let exp = strs[0];
    for (let i = 1; i < strs.length; i++) {
      exp = new BinaryOperation(BINARY_OPERATION_OPERATOR.CONCAT, exp, strs[i]);
    }
    return exp as Expression<string>;
  }

  /**
   * 算术运算 +
   * @param left 左值
   * @param right 右值
   * @returns 返回算术运算表达式
   */
  static add<T extends Numeric>(
    left: CompatibleExpression<T>,
    right: CompatibleExpression<T>
  ): Expression<T> {
    return new BinaryOperation(BINARY_OPERATION_OPERATOR.ADD, left, right);
  }

  /**
   * 算术运算 -
   * @param left 左值
   * @param right 右值
   * @returns 返回算术运算表达式
   */
  static sub<T extends Numeric>(
    left: CompatibleExpression<T>,
    right: CompatibleExpression<T>
  ): Expression<T> {
    return new BinaryOperation(BINARY_OPERATION_OPERATOR.SUB, left, right);
  }

  /**
   * 算术运算 *
   * @param left 左值
   * @param right 右值
   * @returns 返回算术运算表达式
   */
  static mul<T extends Numeric>(
    left: CompatibleExpression<T>,
    right: CompatibleExpression<T>
  ): Expression<T> {
    return new BinaryOperation(BINARY_OPERATION_OPERATOR.MUL, left, right);
  }

  /**
   * 算术运算 /
   * @param left 左值
   * @param right 右值
   * @returns 返回算术运算表达式
   */
  static div<T extends Numeric>(
    left: CompatibleExpression<T>,
    right: CompatibleExpression<T>
  ): Expression<T> {
    return new BinaryOperation(BINARY_OPERATION_OPERATOR.DIV, left, right);
  }

  /**
   * 算术运算 %
   * @param left 左值
   * @param right 右值
   * @returns 返回算术运算表达式
   */
  static mod<T extends Numeric>(
    left: CompatibleExpression<T>,
    right: CompatibleExpression<T>
  ): Expression<T> {
    return new BinaryOperation(BINARY_OPERATION_OPERATOR.MOD, left, right);
  }
  /*
   * 位算术运算 ^
   * @param left 左值
   * @param right 右值
   * @returns 返回算术运算表达式
   */
  static xor<T extends Interger>(
    left: CompatibleExpression<T>,
    right: CompatibleExpression<T>
  ): Expression<T> {
    return new BinaryOperation(BINARY_OPERATION_OPERATOR.XOR, left, right);
  }

  /**
   * 位算术运算 << 仅支持整型
   * @param left 左值
   * @param right 右值
   * @returns 返回算术运算表达式
   */
  static shl<T extends Interger>(
    left: CompatibleExpression<T>,
    right: CompatibleExpression<T>
  ): Expression<T> {
    return new BinaryOperation(BINARY_OPERATION_OPERATOR.SHL, left, right);
  }

  /**
   * 位算术运算 >>
   * @param left 左值
   * @param right 右值
   * @returns 返回算术运算表达式
   */
  static shr<T extends Interger>(
    left: CompatibleExpression<T>,
    right: CompatibleExpression<T>
  ): Expression<T> {
    return new BinaryOperation(BINARY_OPERATION_OPERATOR.SHR, left, right);
  }

  static literal<T extends Scalar>(value: T): Literal<T> {
    return new Literal(value);
  }

  static variant<T extends Scalar, N extends string = string>(
    name: N
  ): Variant<T, N> {
    return new Variant(name);
  }
  /**
   * 创建一个字段
   */
  static field<T extends Scalar, N extends string>(
    name: N,
    rowset?: CompatibleRowset
  ): Field<T, N> {
    return new Field(name, rowset);
  }

  /**
   * 将多个查询条件通过 AND 合并成一个大查询条件
   * @param conditions 查询条件列表
   * @returns 返回逻辑表达式
   */
  static and(conditions: CompatibleCondition[]): Condition;
  static and(
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
  static and<T extends Interger>(
    left: CompatibleExpression<T>,
    right: CompatibleExpression<T>
  ): Expression<T>;
  static and(
    ...args:
      | CompatibleCondition[]
      | [CompatibleCondition[]]
      | [CompatibleExpression<Interger>, CompatibleExpression<Interger>]
  ): any {
    if (Array.isArray(args[0])) {
      args = args[0];
    }

    if (Expression.isExpression(args[0]) || isScalar(args[0])) {
      return new BinaryOperation(
        BINARY_OPERATION_OPERATOR.AND,
        args[0],
        args[1] as CompatibleExpression<Interger>
      );
    }

    return BinaryLogicCondition.join(
      LOGIC_OPERATOR.AND,
      args as CompatibleCondition[]
    );
  }

  /**
   * 将多个查询条件通过 OR 合并成一个
   * @param conditions 查询条件列表
   * @returns 返回逻辑表达式
   */
  static or(conditions: CompatibleCondition[]): Condition;
  static or(
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
  static or<T extends Interger>(
    left: CompatibleExpression<T>,
    right: CompatibleExpression<T>
  ): Expression<T>;
  static or(
    ...args:
      | CompatibleCondition[]
      | [CompatibleCondition[]]
      | [CompatibleExpression<Interger>, CompatibleExpression<Interger>]
  ): any {
    if (Array.isArray(args[0])) {
      args = args[0];
    }
    if (Expression.isExpression(args[0]) || isScalar(args[0])) {
      return new BinaryOperation(
        BINARY_OPERATION_OPERATOR.OR,
        args[0],
        args[1] as CompatibleExpression<Interger>
      );
    }
    return BinaryLogicCondition.join(
      LOGIC_OPERATOR.OR,
      args as CompatibleCondition[]
    );
  }

  /**
   * Not 逻辑运算
   * @param condition
   */
  static not(condition: Condition): Condition;
  /**
   * 位算术运算 ~
   * @param value 左值
   * @param right 右值
   * @returns 返回算术运算表达式
   */
  static not<T extends Interger>(value: CompatibleExpression<T>): Expression<T>;
  static not(arg: Condition | CompatibleExpression<Interger>): any {
    if (Expression.isExpression(arg) || isScalar(arg)) {
      return new UnaryOperation(UNARY_OPERATION_OPERATOR.NOT, arg);
    }
    return new UnaryLogicCondition(LOGIC_OPERATOR.NOT, arg);
  }

  /**
   * 使用逻辑表达式联接多个条件
   */
  private static join(
    logic: LOGIC_OPERATOR.AND | LOGIC_OPERATOR.OR,
    conditions: CompatibleCondition[]
  ): Condition {
    if (conditions.length < 2) {
      throw new Error(`conditions must more than or equals 2 element.`);
    }
    const cond: Condition = conditions.reduce((previous, current) => {
      let condition = Condition.ensure(current);
      // 如果是二元逻辑条件运算，则将其用括号括起来，避免逻辑运算出现优先级的问题
      if (BinaryLogicCondition.isBinaryLogicCondition(condition)) {
        condition = SQL.group(condition);
      }
      if (!previous) return condition;
      return new BinaryLogicCondition(logic, previous, condition);
    }) as Condition;
    return SQL.group(cond);
  }

  /**
   * 比较运算 IS NULL
   * @returns 返回比较运算符
   * @param expr 表达式
   */
  static isNull(expr: CompatibleExpression<Scalar>): Condition {
    return new UnaryCompareCondition(UNARY_COMPARE_OPERATOR.IS_NULL, expr);
  }
  /**
   * 比较运算 IS NOT NULL
   * @param expr 表达式
   * @returns 返回比较运算符
   */
  static isNotNull(expr: CompatibleExpression<Scalar>): Condition {
    return new UnaryCompareCondition(UNARY_COMPARE_OPERATOR.IS_NOT_NULL, expr);
  }

  static eq<T extends Scalar>(
    left: CompatibleExpression<T>,
    right: CompatibleExpression<T>
  ): Condition {
    return new BinaryCompareCondition(BINARY_COMPARE_OPERATOR.EQ, left, right);
  }

  /**
   * 比较运算 <>
   * @param left 左值
   * @param right 右值
   * @returns 返回比较运算对比条件
   */
  static neq<T extends Scalar>(
    left: CompatibleExpression<T>,
    right: CompatibleExpression<T>
  ): Condition {
    return new BinaryCompareCondition(BINARY_COMPARE_OPERATOR.NEQ, left, right);
  }

  static isBinaryCompareCondition(
    object: any
  ): object is BinaryCompareCondition {
    return (
      Condition.isCondition(object) &&
      object.$kind === CONDITION_KIND.BINARY_COMPARE
    );
  }

  static lt<T extends Scalar>(
    left: CompatibleExpression<T>,
    right: CompatibleExpression<T>
  ): Condition {
    return new BinaryCompareCondition(BINARY_COMPARE_OPERATOR.LT, left, right);
  }
  /**
   * 比较运算 <=
   * @param left 左值
   * @param right 右值
   * @returns 返回比较运算对比条件
   */
  static lte<T extends Scalar>(
    left: CompatibleExpression<T>,
    right: CompatibleExpression<T>
  ): Condition {
    return new BinaryCompareCondition(BINARY_COMPARE_OPERATOR.LTE, left, right);
  }
  /**
   * 比较运算 >
   * @param left 左值
   * @param right 右值
   * @returns 返回比较运算对比条件
   */
  static gt<T extends Scalar>(
    left: CompatibleExpression<T>,
    right: CompatibleExpression<T>
  ): Condition {
    return new BinaryCompareCondition(BINARY_COMPARE_OPERATOR.GT, left, right);
  }
  /**
   * 比较运算 >=
   * @param left 左值
   * @param right 右值
   * @returns 返回比较运算对比条件
   */
  static gte<T extends Scalar>(
    left: CompatibleExpression<T>,
    right: CompatibleExpression<T>
  ): Condition {
    return new BinaryCompareCondition(BINARY_COMPARE_OPERATOR.GTE, left, right);
  }
  /**
   * 比较运算 LIKE
   * @param left 左值
   * @param right 右值
   * @returns 返回比较运算对比条件
   */
  static like(
    left: CompatibleExpression<string>,
    right: CompatibleExpression<string>
  ): Condition {
    return new BinaryCompareCondition(
      BINARY_COMPARE_OPERATOR.LIKE,
      left,
      right
    );
  }
  /**
   * 比较运算 NOT LIKE
   * @param left 左值
   * @param right 右值
   * @returns 返回比较运算对比条件
   */
  static notLike(
    left: CompatibleExpression<string>,
    right: CompatibleExpression<string>
  ): Condition {
    return new BinaryCompareCondition(
      BINARY_COMPARE_OPERATOR.NOT_LIKE,
      left,
      right
    );
  }
  /**
   * 比较运算 IN
   * @param left 左值
   * @param values 要比较的值列表
   * @returns 返回比较运算对比条件
   */
  static in<T extends Scalar>(
    left: CompatibleExpression<T>,
    select: Select<any>
  ): Condition;
  static in<T extends Scalar>(
    left: CompatibleExpression<T>,
    values: CompatibleExpression<T>[]
  ): Condition;
  static in<T extends Scalar>(
    left: CompatibleExpression<T>,
    values: CompatibleExpression<T>[] | Select<any>
  ): Condition;
  static in<T extends Scalar>(
    left: CompatibleExpression<T>,
    values: CompatibleExpression<T>[] | Select<any>
  ): Condition {
    return new BinaryCompareCondition(
      BINARY_COMPARE_OPERATOR.IN,
      left,
      Select.isSelect(values)
        ? values.asValue()
        : values.map(v => Expression.ensure(v))
    );
  }

  /**
   * 比较运算 NOT IN
   * @param left 左值
   * @param values 要比较的值列表
   * @returns 返回比较运算对比条件
   */
  static notIn<T extends Scalar>(
    left: CompatibleExpression<T>,
    values: CompatibleExpression<T>[]
  ): Condition {
    return new BinaryCompareCondition(
      BINARY_COMPARE_OPERATOR.NOT_IN,
      left,
      values.map(v => Expression.ensure(v))
    );
  }
  /**
   * 判断是否存在
   * @param select 查询语句
   */
  static exists(select: Select<any>): Condition {
    return new ExistsCondition(select);
  }

  static table<T extends RowObject = any>(
    name: CompatiableObjectName,
    builtIn = false
  ): ProxiedTable<T> {
    return new Table(name, builtIn) as ProxiedTable<T>;
  }

  /**
   * 声明一个函数
   */
  static func(name: CompatiableObjectName, builtIn = false): Func {
    return new Func(name, builtIn);
  }
  /**
   * 创建一个可供调用的存储过程函数
   */
  static proc<
    R extends Scalar = number,
    O extends RowObject[] = never,
    N extends string = string
  >(name: CompatiableObjectName<N>, builtIn = false): Procedure<R, O, N> {
    return new Procedure(name, builtIn);
  }

  static builtIn<N extends string>(name: N): BuiltIn<N> {
    throw new BuiltIn(name);
  }

  static get star(): Star<any> {
    return new Star<any>();
  }

  static invokeAsTable<T extends RowObject = any>(
    func: CompatiableObjectName | Func<string>,
    args: CompatibleExpression<Scalar>[]
  ): ProxiedRowset<T> {
    return Func.ensure(func).invokeAsTable<T>(...args);
  }

  static invokeAsScalar<T extends Scalar = any>(
    func: CompatiableObjectName | Func<string>,
    args: CompatibleExpression<Scalar>[]
  ): Expression<T> {
    return Func.ensure(func).invokeAsScalar<T>(...args);
  }

  static makeInvoke<T extends RowObject>(
    type: 'table',
    name: CompatiableObjectName,
    builtIn?: boolean
  ): () => ProxiedRowset<T>;
  static makeInvoke<T extends RowObject, A1 extends CompatibleExpression>(
    type: 'table',
    name: CompatiableObjectName,
    builtIn?: boolean
  ): (arg1: A1) => ProxiedRowset<T>;
  static makeInvoke<
    T extends RowObject,
    A1 extends CompatibleExpression,
    A2 extends CompatibleExpression
  >(
    type: 'table',
    name: CompatiableObjectName,
    builtIn?: boolean
  ): (arg1: A1, arg2: A2) => ProxiedRowset<T>;
  static makeInvoke<
    T extends RowObject,
    A1 extends CompatibleExpression,
    A2 extends CompatibleExpression,
    A3 extends CompatibleExpression
  >(
    type: 'table',
    name: CompatiableObjectName,
    builtIn?: boolean
  ): (arg1: A1, arg2: A2, arg3: A3) => ProxiedRowset<T>;
  static makeInvoke<
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
  static makeInvoke<
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

  static makeInvoke(
    type: 'table',
    name: CompatiableObjectName,
    builtIn?: boolean
  ): (...args: CompatibleExpression[]) => ProxiedRowset<any>;

  static makeInvoke<T extends Scalar>(
    type: 'scalar',
    name: CompatiableObjectName,
    builtIn?: boolean
  ): () => Expression<T>;
  static makeInvoke<T extends Scalar, A1 extends CompatibleExpression>(
    type: 'scalar',
    name: CompatiableObjectName,
    builtIn?: boolean
  ): (arg1: A1) => Expression<T>;
  static makeInvoke<
    T extends Scalar,
    A1 extends CompatibleExpression,
    A2 extends CompatibleExpression
  >(
    type: 'scalar',
    name: CompatiableObjectName,
    builtIn?: boolean
  ): (arg1: A1, arg2: A2) => Expression<T>;
  static makeInvoke<
    T extends Scalar,
    A1 extends CompatibleExpression,
    A2 extends CompatibleExpression,
    A3 extends CompatibleExpression
  >(
    type: 'scalar',
    name: CompatiableObjectName,
    builtIn?: boolean
  ): (arg1: A1, arg2: A2, arg3: A3) => Expression<T>;
  static makeInvoke<
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
  static makeInvoke<
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
  static makeInvoke(
    type: 'scalar',
    name: CompatiableObjectName,
    builtIn?: boolean
  ): (...args: CompatibleExpression[]) => Expression<any>;
  static makeInvoke(
    type: 'table' | 'scalar',
    name: CompatiableObjectName,
    builtIn = false
  ): any {
    if (type === 'table') {
      return function (
        ...args: CompatibleExpression[]
      ): ProxiedRowset<RowObject> {
        return SQL.invokeAsTable(SQL.func(name, builtIn), args);
      };
    }
    if (type === 'scalar') {
      return function (...args: CompatibleExpression<Scalar>[]): Expression {
        return SQL.invokeAsScalar<Scalar>(SQL.func(name, builtIn), args);
      };
    }
    throw new Error('invalid arg value of `type`');
  }

  /**
   * 创建一个可供JS调用的存储过程
   */
  static makeExec<R extends Scalar = number, O extends RowObject[] = []>(
    name: CompatiableObjectName,
    builtIn?: boolean
  ): () => Execute<R, O>;
  static makeExec<
    A1 extends CompatibleExpression,
    R extends Scalar = number,
    O extends RowObject[] = []
  >(
    name: CompatiableObjectName,
    builtIn?: boolean
  ): (arg1: A1) => Execute<R, O>;
  static makeExec<
    A1 extends CompatibleExpression,
    A2 extends CompatibleExpression,
    R extends Scalar = number,
    O extends RowObject[] = []
  >(
    name: CompatiableObjectName,
    builtIn?: boolean
  ): (arg1: A1, arg2: A2) => Execute<R, O>;
  static makeExec<
    A1 extends CompatibleExpression,
    A2 extends CompatibleExpression,
    A3 extends CompatibleExpression,
    R extends Scalar = number,
    O extends RowObject[] = []
  >(
    name: CompatiableObjectName,
    builtIn?: boolean
  ): (arg1: A1, arg2: A2, arg3: A3) => Execute<R, O>;
  static makeExec<
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
  static makeExec<
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

  static makeExec(
    name: CompatiableObjectName,
    builtIn?: boolean
  ): (...args: CompatibleExpression[]) => Expression<any>;
  static makeExec(name: CompatiableObjectName, builtIn = false): any {
    return function (
      ...args: CompatibleExpression<Scalar>[]
    ): Execute<any, any> {
      return SQL.execute(SQL.proc<Scalar, any, string>(name, builtIn), args);
    };
  }

  //********************** statement **************************//

  /**
   * 赋值语句
   * @param left 左值
   * @param right 右值
   */
  static assign<T extends Scalar = any>(
    left: Assignable<T>,
    right: CompatibleExpression<T>
  ): Assignment<T> {
    return new Assignment(left, right);
  }
  /**
   * 变量声明
   * @param declares 变量列表
   */
  static declare(
    build: (builder: DeclareBuilder) => (VariantDeclare | TableVariantDeclare)[]
  ): Declare {
    return new Declare(build);
  }
  /**
   * WHEN 语句块
   * @param expr
   * @param value
   */
  static when<T extends Scalar>(
    expr: CompatibleExpression<Scalar>,
    value: CompatibleExpression<T>
  ): When<T> {
    return new When(expr, value);
  }

  static case<T extends Scalar>(expr?: CompatibleExpression): Case<T> {
    return new Case<T>(expr);
  }
  /**
   * With语句
   */
  static with(
    ...rowsets: WithSelect[] | [WithSelect[]] | [SelectAliasObject]
  ): With {
    return new With(...rowsets);
  }

  static union<T extends RowObject = any>(...selects: Select<T>[]): Select<T> {
    selects.forEach((sel, index) => {
      if (index < selects.length - 1) sel.union(selects[index + 1]);
    });
    return selects[0];
  }
  static unionAll<T extends RowObject = any>(
    ...selects: Select<T>[]
  ): Select<T> {
    selects.forEach((sel, index) => {
      if (index < selects.length - 1) sel.unionAll(selects[index + 1]);
    });
    return selects[0];
  }

  static createTable<N extends string>(
    name: CompatiableObjectName<N>
  ): CreateTable<N> {
    return new CreateTable(name);
  }

  static alterTable<N extends string>(
    name: CompatiableObjectName<N>
  ): AlterTable<N> {
    return new AlterTable(name);
  }

  static createView<T extends RowObject = any, N extends string = string>(
    name: CompatiableObjectName<N>
  ): CreateView<T, N> {
    return new CreateView(name);
  }

  static alterView<T extends RowObject = any, N extends string = string>(
    name: CompatiableObjectName<N>
  ): AlterView<T, N> {
    return new AlterView(name);
  }

  static createIndex(name: string): CreateIndex {
    return new CreateIndex(name);
  }

  static createProcedure(name: CompatiableObjectName): CreateProcedure {
    return new CreateProcedure(name);
  }

  static alterProcedure(name: CompatiableObjectName): AlterProcedure {
    return new AlterProcedure(name);
  }

  static createFunction(name: CompatiableObjectName): CreateFunction {
    return new CreateFunction(name);
  }

  static alterFunction(name: CompatiableObjectName): AlterFunction {
    return new AlterFunction(name);
  }

  static dropTable<N extends string>(
    name: CompatiableObjectName<N>
  ): DropTable<N> {
    return new DropTable(name);
  }

  static dropView<N extends string>(
    name: CompatiableObjectName<N>
  ): DropView<N> {
    return new DropView(name);
  }

  static dropProcedure<N extends string>(
    name: CompatiableObjectName<N>
  ): DropProcedure<N> {
    return new DropProcedure(name);
  }

  static dropFunction<N extends string>(
    name: CompatiableObjectName<N>
  ): DropFunction<N> {
    return new DropFunction(name);
  }

  static dropIndex<N extends string>(
    table: CompatiableObjectName,
    name: N
  ): DropIndex<N> {
    return new DropIndex(table, name);
  }

  static annotation(...text: string[]): Annotation {
    return new Annotation('BLOCK', text.join('\n'));
  }

  static note(text: string): Annotation {
    return new Annotation('LINE', text);
  }

  /**
   * 插入至表,into的别名
   * @param table
   * @param fields
   */
  static insert<T extends RowObject = any>(
    table: CompatibleTable<T, string>,
    fields?: ColumnsOf<T>[] | Field<Scalar, ColumnsOf<T>>[]
  ): Insert<T> {
    return new Insert(table, fields);
  }
  /**
   * 更新一个表格
   * @param table
   */
  static update<T extends RowObject = any>(
    table: CompatibleTable<T, string>
  ): Update<T> {
    return new Update(table);
  }
  /**
   * 删除一个表格
   * @param table 表格
   */
  static delete<T extends RowObject = any>(
    table: CompatibleTable<T, string>
  ): Delete<T> {
    return new Delete(table);
  }

  static readonly select: SelectAction = (...args: any[]): any => {
    return new Select(...args);
  };

  static raw(sql: string): any {
    return new Raw(sql);
  }

  static block(...statements: Statement[]): Block;
  static block(statements: Statement[]): Block;
  static block(...statements: Statement[] | [Statement[]]): Block {
    if (statements.length === 1 && Array.isArray(statements[0])) {
      statements = statements[0];
    }
    return new Block(statements as Statement[]);
  }

  static execute<R extends Scalar = any, O extends RowObject[] = []>(
    proc: CompatiableObjectName | Procedure<R, O, string>,
    params?: CompatibleExpression<Scalar>[]
    // | Parameter<JsConstant, string>[] | InputObject
  ): Execute<R, O> {
    return new Execute(proc, params);
  }

  static createDatabase(name: string): CreateDatabase {
    return new CreateDatabase(name);
  }
  static alterDatabase(name: string): AlterDatabase {
    return new AlterDatabase(name);
  }
  static dropDatabase(name: string): DropDatabase {
    return new DropDatabase(name);
  }
  static createSequence(name: CompatiableObjectName): CreateSequence {
    return new CreateSequence(name);
  }
  static dropSequence(name: CompatiableObjectName): DropSequence {
    return new DropSequence(name);
  }

  //******************end statement*******************//
  /**
   * input 参数
   */
  static input<T extends Scalar, N extends string>(
    name: N,
    value: T,
    type?: DbTypeOf<T>
  ): Parameter<T, N> {
    return Parameter.input(name, value, type);
  }

  /**
   * output参数
   */
  static output<T extends DbType, N extends string>(
    name: N,
    type: T,
    value?: TsTypeOf<T>
  ): Parameter<TsTypeOf<T>, N> {
    return Parameter.output(name, type, value);
  }
}

export enum SQL_SYMBOLE {
  EXPRESSION = 'EXPRESSION',
  CREATE_TABLE_COLUMN = 'CREATE_TABLE_COLUMN',
  STAR = 'STAR',
  RAW = 'RAW',
  STATEMENT = 'STATEMENT',
  // ANY = '*',
  INVOKE_ARGUMENT_LIST = 'INVOKE_ARGUMENT_LIST',
  EXECUTE_ARGUMENT_LIST = 'EXECUTE_ARGUMENT_LIST',
  VARAINT_DECLARE = 'VARAINT_DECLARE',
  TABLE_VARIANT_DECLARE = 'TABLE_VARIANT_DECLARE',
  IDENTIFIER = 'IDENTIFIER',
  IDENTITY_VALUE = 'IDENTITY_VALUE',
  STANDARD_EXPRESSION = 'STANDARD_EXPRESSION',
  SCALAR_FUNCTION_INVOKE = 'SCALAR_FUNCTION_INVOKE',
  TABLE_FUNCTION_INVOKE = 'TABLE_FUNCTION_INVOKE',
  LITERAL = 'LITERAL',
  SORT = 'SORT',
  JOIN = 'JOIN',
  UNION = 'UNION',
  WHEN = 'WHEN',
  CASE = 'CASE',
  DOCUMENT = 'DOCUMENT',
  WITH = 'WITH',
  GROUP_EXPRESSION = 'GROUP_EXPRESSION',
  NAMED_SELECT = 'NAMED_SELECT',
  WITH_SELECT = 'WITH_SELECT',
  OPERATION = 'OPERATION',
  VALUED_SELECT = 'VALUED_SELECT',
  PRIMARY_KEY = 'CREATE_TABLE_PRIMARY_KEY',
  FOREIGN_KEY = 'FOREIGN_KEY',
  ALTER_TABLE_DROP_MEMBER = 'ALTER_TABLE_DROP_COLUMN',
  ALTER_TABLE_DROP_CONSTRAINT = 'ALTER_TABLE_DROP_CONSTRAINT',
  CHECK_CONSTRAINT = 'CHECK_CONSTRAINT',
  UNIQUE_KEY = 'UNIQUE_KEY',
  PROCEDURE_PARAMETER = 'PROCEDURE_PARAMETER',
  ALTER_TABLE_COLUMN = 'ALTER_TABLE_COLUMN',
  CONDITION = 'CONDITION',
  PARAMETER = 'PARAMETER',
  /**
   * 表
   */
  TABLE = 'TABLE',
  /**
   * 字段
   */
  FIELD = 'FIELD',
  /**
   * 函数
   */
  FUNCTION = 'FUNCITON',
  // /**
  //  * 标量函数
  //  */
  // SCALAR_FUNCTION ='SCALAR_FUNCTION',
  // /**
  //  * 表值函数
  //  */
  // TABLE_FUNCTION = 'TABLE_FUNCTION',
  /**
   * 存储过程
   */
  PROCEDURE = 'PROCEDURE',
  /**
   * 内建标识
   */
  BUILT_IN = 'BUILT_IN',
  /**
   * 别名
   */
  ALIAS = 'ALIAS',
  /**
   * 列
   */
  SELECT_COLUMN = 'SELECT_COLUMN',
  /**
   * 变量
   */
  VARIANT = 'VARIANT',
  /**
   * 表变量
   */
  TABLE_VARIANT = 'TABLE_VARIANT',
  /**
   * 对象
   */
  OBJECT = 'OBJECT',
  ROWSET = 'ROWSET',
}
