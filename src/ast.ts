import {
  assert,
  ensureExpression,
  ensureCondition,
  makeProxiedRowset,
  isJsConstant,
  ensureRowset,
  ensureField,
  ensureFunction,
  ensureProcedure,
  pickName,
  pathName,
  isPlainObject,
  ensureVariant, clone, isSelect
} from "./util";

import {
  OPERATION_OPERATOR,
  PARAMETER_DIRECTION,
  SQL_SYMBOLE,
  BINARY_COMPARE_OPERATOR,
  SORT_DIRECTION,
  LOGIC_OPERATOR,
  INSERT_MAXIMUM_ROWS,
  IDENTOFIER_KIND,
  BINARY_OPERATION_OPERATOR,
  UNARY_OPERATION_OPERATOR,
  UNARY_COMPARE_OPERATOR,
  CONDITION_KIND,
  OPERATION_KIND,
  SQL_SYMBOLE_EXPRESSION,
} from "./constants";

/**
 * 混入函数，必须放最前面，避免循环引用导致无法获取
 * @param derivedCtor
 * @param baseCtors
 */
function applyMixins(derivedCtor: any, baseCtors: any[]) {
  baseCtors.forEach((baseCtor) => {
    Object.entries(
      Object.getOwnPropertyDescriptors(baseCtor.prototype)
    ).forEach(([name, desc]) => {
      // if (desc.get || desc.set) {

      // }
      // 复制属性
      Object.defineProperty(derivedCtor.prototype, name, desc);
      // derivedCtor.prototype[name] = baseCtor.prototype[name];
    });
  });
}

export const $IsProxy = Symbol('#IS_PROXY')

// **********************************类型声明******************************************

export type Binary = ArrayBuffer | SharedArrayBuffer;

/**
 * JS常量类型
 */
export type JsConstant =
  | string
  | Date
  | boolean
  | null
  | number
  | Binary
  | bigint;

export type ValueTypeOf<T extends Model> = T[FieldsOf<T>];

/**
 * 不明确类型的键值对象，用于 输入SQL语句的的对象，如WhereObject等
 */
export type InputObject<T extends Model = any> = {
  [P in FieldsOf<T>]: Expressions<T[P]>;
};

export type Model = {
  [field: string]: any;
};

/**
 * 简化后的whereObject查询条件
 */
export type WhereObject<T extends Model = any> = {
  [K in FieldsOf<T>]?: Expressions<T[K]> | Expressions<T[K]>[];
};

/**
 * 值列表，用于传递Select、Insert、Update 的键值对
 */
export type ValueObject<T extends Model = any> = {
  [K in FieldsOf<T>]?: Expressions<T[K]>;
};

/**
 * 行结果对象，查询的返回结果类型
 */
export type RowObject<T extends Model = any> = {
  [K in FieldsOf<T>]: ExpressionType<T[K]>;
};

export type ResultObject<T extends Model = any> = {
  [K in keyof T]: ExpressionType<T[K]>;
};

/**
 * 获取表达式对像所表示的类型
 */
export type ExpressionType<T> = T extends JsConstant
  ? T
  : T extends Expression<infer X>
  ? X
  : never;

/**
 * 从 SELECT(...Identitfier) 中查询的属性及类型
 */
export type PickFields<T> = T extends undefined
  ? {}
  : T extends Field<infer V, infer N>
  ? {
    [key in N]: V;
  }
  : T extends Column<infer V, infer N>
  ? {
    [key in N]: V;
  }
  : T extends Star<infer M>
  ? {
    [P in FieldsOf<M>]: M[P];
  }
  : {};

/**
 * select语句可以接收的列
 */
export type SelectCloumn =
  | Field<JsConstant, string>
  | Column<JsConstant, string>
  | Star<any>;

export type ResultObjectByColumns<
  A,
  B = unknown,
  C = unknown,
  D = unknown,
  E = unknown,
  F = unknown,
  G = unknown,
  H = unknown,
  I = unknown,
  J = unknown,
  K = unknown,
  L = unknown,
  M = unknown,
  N = unknown,
  O = unknown,
  P = unknown,
  Q = unknown,
  R = unknown,
  S = unknown,
  T = unknown,
  U = unknown,
  V = unknown,
  W = unknown,
  X = unknown,
  Y = unknown,
  Z = unknown
  > = PickFields<A> &
  PickFields<B> &
  PickFields<C> &
  PickFields<D> &
  PickFields<E> &
  PickFields<F> &
  PickFields<G> &
  PickFields<H> &
  PickFields<I> &
  PickFields<J> &
  PickFields<K> &
  PickFields<L> &
  PickFields<M> &
  PickFields<N> &
  PickFields<O> &
  PickFields<P> &
  PickFields<Q> &
  PickFields<R> &
  PickFields<S> &
  PickFields<T> &
  PickFields<U> &
  PickFields<V> &
  PickFields<W> &
  PickFields<X> &
  PickFields<Y> &
  PickFields<Z>;

/**
 * 未经确认的表达式
 */
export type Expressions<T extends JsConstant = JsConstant> = Expression<T> | T;

/**
 * 所有查询条件的兼容类型
 */
export type Conditions<T extends Model = any> = Condition | WhereObject<T>;

/**
 * 取数据库有效字段，类型为JsConstant的字段列表
 */
export type FieldsOf<T extends Model> = Exclude<
  {
    [P in keyof T]: T[P] extends JsConstant ? P : never;
  }[keyof T],
  number | symbol
>;

export type ProxiedRowset<T> = T extends Rowset<infer M>
  ? T &
  {
    // 排除AST自有属性
    [P in FieldsOf<M>]: Field<M[P], P>;
  }
  : never;

/**
 * AST 基类
 */
export abstract class AST {
  readonly $type: SQL_SYMBOLE;
  /**
   * 克隆自身
   */
  clone(): this {
    return clone(this)
  }
}

export type ModelConstructor<T extends Model = object> = new (
  ...args: any
) => T;
export type ModelTypeOfConstructor<T> = T extends new (
  ...args: any
) => infer TModel
  ? TModel
  : never;

/**
 * 表达式基类，抽象类，
 * 所有表达式类均从该类型继承，
 * 可以直接使用 instanceof 来判断是否为expression
 */
export abstract class Expression<
  T extends JsConstant = JsConstant
  > extends AST {
  $type: SQL_SYMBOLE_EXPRESSION;
  /**
   * 字符串连接运算
   */
  concat(expr: Expressions<string>): Expression<string> {
    return Expression.concat(this as Expressions<string>, expr);
  }

  /**
   * 加法运算，返回数值，如果是字符串相加，请使用join函数连接
   */
  add(expr: Expressions<number>): Expression<number> {
    return Expression.add(this as Expressions<number>, expr);
  }

  /**
   * 减法运算
   */
  sub(expr: Expressions<number>): Expression<number> {
    return Expression.sub(this as Expressions<number>, expr);
  }

  /**
   * 乘法运算
   * @param expr 要与当前表达式相乘的表达式
   */
  mul(expr: Expressions<number>): Expression<number> {
    return Expression.mul(this as Expressions<number>, expr);
  }

  /**
   * 除法运算
   * @param expr 要与当前表达式相除的表达式
   * @returns 返回运算后的表达式
   */
  div(expr: Expressions<number>): Expression<number> {
    return Expression.div(this as Expressions<number>, expr);
  }

  /**
   * 算术运算 %
   * @param expr 要与当前表达式相除的表达式
   * @returns 返回运算后的表达式
   */
  mod(expr: Expressions<number>): Expression<number> {
    return Expression.mod(this as Expressions<number>, expr);
  }

  /**
   * 位运算 &
   * @param expr 要与当前表达式相除的表达式
   * @returns 返回运算后的表达式
   */
  and(expr: Expressions<number>): Expression<number> {
    return Expression.and(this as Expressions<number>, expr);
  }

  /**
   * 位运算 |
   * @param expr 要与当前表达式相除的表达式
   * @returns 返回运算后的表达式
   */
  or(expr: Expressions<number>): Expression<number> {
    return Expression.or(this as Expressions<number>, expr);
  }

  /**
   * 位运算 ~
   * @param expr 要与当前表达式相除的表达式
   * @returns 返回运算后的表达式
   */
  not(): Expression<number> {
    return Expression.not(this as Expressions<number>);
  }

  /**
   * 位运算 ^
   * @param expr 要与当前表达式相除的表达式
   * @returns 返回运算后的表达式
   */
  xor(expr: Expressions<number>): Expression<number> {
    return Expression.xor(this as Expressions<number>, expr);
  }

  /**
   * 位运算 <<
   * @param expr 要与当前表达式相除的表达式
   * @returns 返回运算后的表达式
   */
  shl(expr: Expressions<number>): Expression<number> {
    return Expression.shl(this as Expressions<number>, expr);
  }

  /**
   * 位运算 >>
   * @param expr 要与当前表达式相除的表达式
   * @returns 返回运算后的表达式
   */
  shr(expr: Expressions<number>): Expression<number> {
    return Expression.shr(this as Expressions<number>, expr);
  }

  /**
   * 比较是否相等 =
   * @param expr 要与当前表达式相比较的表达式
   * @returns 返回对比条件表达式
   */
  eq(expr: Expressions<T>): Condition {
    return Condition.eq(this, expr);
  }

  /**
   * 比较是否不等于 <>
   * @param expr 要与当前表达式相比较的表达式
   * @returns 返回对比条件表达式
   */
  neq(expr: Expressions<T>): Condition {
    return Condition.neq(this, expr);
  }

  /**
   * 比较是否小于 <
   * @param expr 要与当前表达式相比较的表达式
   * @returns 返回对比条件表达式
   */
  lt(expr: Expressions<T>): Condition {
    return Condition.lt(this, expr);
  }

  /**
   * 比较是否小于等于 <=
   * @param expr 要与当前表达式相比较的表达式
   * @returns 返回对比条件表达式
   */
  lte(expr: Expressions<T>): Condition {
    return Condition.lte(this, expr);
  }

  /**
   * 比较是否大于 >
   * @param expr 要与当前表达式相比较的表达式
   * @returns 返回对比条件表达式
   */
  gt(expr: Expressions<T>): Condition {
    return Condition.gt(this, expr);
  }

  /**
   * 比较是否小于等于 >=
   * @param expr 要与当前表达式相比较的表达式
   * @returns 返回对比条件表达式
   */
  gte(expr: Expressions<T>): Condition {
    return Condition.gte(this, expr);
  }

  /**
   * 比较是相像 LIKE
   * @param expr 要与当前表达式相比较的表达式
   * @returns 返回对比条件表达式
   */
  like(expr: Expressions<string>): Condition {
    return Condition.like(this as Expressions<string>, expr);
  }

  /**
   * 比较是否不想像 NOT LIKE
   * @param expr 要与当前表达式相比较的表达式
   * @returns 返回对比条件表达式
   */
  notLike(expr: Expressions<string>): Condition {
    return Condition.notLike(this as Expressions<string>, expr);
  }

  /**
   * 比较是否不包含于 IN
   * @param values 要与当前表达式相比较的表达式数组
   * @returns 返回对比条件表达式
   */
  in(select: Select<any>): Condition
  in(values: Expressions<T>[]): Condition
  in(...values: Expressions<T>[]): Condition
  in(...values: Expressions<T>[] | [Select<any>] | [Expressions<T>[]]): Condition {
    if (values.length === 1 && (isSelect(values[0]) || Array.isArray(values[0]))) {
      return Condition.in(this, values[0] as any)
    }
    return Condition.in(this, values as any);
  }

  /**
   * 比较是否不包含于 NOT IN
   * @param values 要与当前表达式相比较的表达式
   * @returns 返回对比条件表达式
   */
  notIn(...values: Expressions<T>[]): Condition {
    return Condition.notIn(this, values);
  }

  /**
   * 比较是否为空 IS NULL
   * @returns 返回对比条件表达式
   */
  isNull(): Condition {
    return Condition.isNull(this);
  }

  /**
   * 比较是否为空 IS NOT NULL
   * @returns 返回对比条件表达式
   */
  isNotNull(): Condition {
    return Condition.isNotNull(this);
  }

  /**
   * isNotNull 的简称别名
   * @returns 返回对比条件表达式
   */
  notNull(): Condition {
    return this.isNotNull();
  }

  /**
   * 正序
   * @returns 返回对比条件表达式
   */
  asc(): SortInfo {
    return new SortInfo(this, SORT_DIRECTION.ASC);
  }

  /**
   * 倒序
   * @returns 返回对比条件表达式
   */
  desc(): SortInfo {
    return new SortInfo(this, SORT_DIRECTION.DESC);
  }

  /**
   * 将表达式转换为列，并指定列名
   */
  as<N extends string>(name: N): Column<T, N> {
    return new Column<T, N>(name, this);
  }

  /**
   * 将本表达式括起来
   */
  bracket(): Expression<T> {
    return Expression.bracket(this);
  }

  /**
   * 将当前表达式转换为指定的类型
   */
  to<T extends ScalarType>(type: T): Expression<TypeOfScalarType<T>> {
    return Expression.convert(this, type);
  }

  /**
   * 括号表达式，将表达式括起来，如优先级
   */
  static bracket<T extends JsConstant>(value: Expressions<T>): Expression<T> {
    return new Bracket(value);
  }

  /**
   * 算术运算 +
   * @param left 左值
   * @param right 右值
   * @returns 返回算术运算表达式
   */
  static neg(expr: Expressions<number>): Expression<number> {
    return new UnaryOperation(UNARY_OPERATION_OPERATOR.NEG, expr);
  }

  /**
   * 字符串连接运算
   */
  static concat(
    left: Expressions<string>,
    right: Expressions<string>
  ): Expression<string> {
    return new BinaryOperation(BINARY_OPERATION_OPERATOR.CONCAT, left, right);
  }

  /**
   * 算术运算 +
   * @param left 左值
   * @param right 右值
   * @returns 返回算术运算表达式
   */
  static add(
    left: Expressions<number>,
    right: Expressions<number>
  ): Expression<number> {
    return new BinaryOperation(BINARY_OPERATION_OPERATOR.ADD, left, right);
  }

  /**
   * 算术运算 -
   * @param left 左值
   * @param right 右值
   * @returns 返回算术运算表达式
   */
  static sub(
    left: Expressions<number>,
    right: Expressions<number>
  ): Expression<number> {
    return new BinaryOperation(BINARY_OPERATION_OPERATOR.SUB, left, right);
  }

  /**
   * 算术运算 *
   * @param left 左值
   * @param right 右值
   * @returns 返回算术运算表达式
   */
  static mul(
    left: Expressions<number>,
    right: Expressions<number>
  ): Expression<number> {
    return new BinaryOperation(BINARY_OPERATION_OPERATOR.MUL, left, right);
  }

  /**
   * 算术运算 /
   * @param left 左值
   * @param right 右值
   * @returns 返回算术运算表达式
   */
  static div(
    left: Expressions<number>,
    right: Expressions<number>
  ): Expression<number> {
    return new BinaryOperation(BINARY_OPERATION_OPERATOR.DIV, left, right);
  }

  /**
   * 算术运算 %
   * @param left 左值
   * @param right 右值
   * @returns 返回算术运算表达式
   */
  static mod(
    left: Expressions<number>,
    right: Expressions<number>
  ): Expression<number> {
    return new BinaryOperation(BINARY_OPERATION_OPERATOR.MOD, left, right);
  }

  /**
   * 位算术运算 &
   * @param left 左值
   * @param right 右值
   * @returns 返回算术运算表达式
   */
  static and(
    left: Expressions<number>,
    right: Expressions<number>
  ): Expression<number> {
    return new BinaryOperation(BINARY_OPERATION_OPERATOR.AND, left, right);
  }

  /**
   * 位算术运算 |
   * @param left 左值
   * @param right 右值
   * @returns 返回算术运算表达式
   */
  static or(
    left: Expressions<number>,
    right: Expressions<number>
  ): Expression<number> {
    return new BinaryOperation(BINARY_OPERATION_OPERATOR.OR, left, right);
  }

  /**
   * 位算术运算 ^
   * @param left 左值
   * @param right 右值
   * @returns 返回算术运算表达式
   */
  static xor(
    left: Expressions<number>,
    right: Expressions<number>
  ): Expression<number> {
    return new BinaryOperation(BINARY_OPERATION_OPERATOR.XOR, left, right);
  }

  /**
   * 位算术运算 ~
   * @param value 左值
   * @param right 右值
   * @returns 返回算术运算表达式
   */
  static not(value: Expressions<number>): Expression<number> {
    return new UnaryOperation(UNARY_OPERATION_OPERATOR.NOT, value);
  }

  /**
   * 位算术运算 <<
   * @param left 左值
   * @param right 右值
   * @returns 返回算术运算表达式
   */
  static shl(
    left: Expressions<number>,
    right: Expressions<number>
  ): Expression<number> {
    return new BinaryOperation(BINARY_OPERATION_OPERATOR.SHL, left, right);
  }

  /**
   * 位算术运算 >>
   * @param left 左值
   * @param right 右值
   * @returns 返回算术运算表达式
   */
  static shr(
    left: Expressions<number>,
    right: Expressions<number>
  ): Expression<number> {
    return new BinaryOperation(BINARY_OPERATION_OPERATOR.SHR, left, right);
  }

  static convert<T extends ScalarType>(
    expr: Expressions<JsConstant>,
    toType: T
  ): Expression<TypeOfScalarType<T>> {
    return new ConvertOperation(expr, toType) as any;
  }
}

/**
 * 查询条件
 */
export abstract class Condition extends AST {
  readonly $type: SQL_SYMBOLE.CONDITION = SQL_SYMBOLE.CONDITION;
  readonly $kind: CONDITION_KIND;
  /**
   * and连接
   * @param condition 下一个查询条件
   * @returns 返回新的查询条件
   */
  and(condition: Conditions): Condition {
    condition = ensureCondition(condition);
    return new BinaryLogicCondition(LOGIC_OPERATOR.AND, this, condition);
  }

  /**
   * and连接
   * @param condition 下一个查询条件
   * @returns 返回新的查询条件
   */
  andGroup(condition: Condition): Condition {
    condition = ensureCondition(condition);
    return new BinaryLogicCondition(
      LOGIC_OPERATOR.AND,
      this,
      Condition.group(condition)
    );
  }

  /**
   * OR语句
   * @param condition
   * @returns 返回新的查询条件
   */
  or(condition: Condition): Condition {
    condition = ensureCondition(condition);
    return new BinaryLogicCondition(LOGIC_OPERATOR.OR, this, condition);
  }

  /**
   * and连接
   * @param condition 下一个查询条件
   * @returns 返回新的查询条件
   */
  orGroup(condition: Condition): Condition {
    condition = ensureCondition(condition);
    return new BinaryLogicCondition(
      LOGIC_OPERATOR.OR,
      this,
      Condition.group(condition)
    );
  }

  /**
   * 将多个查询条件通过 AND 合并成一个大查询条件
   * @static
   * @param conditions 查询条件列表
   * @returns 返回逻辑表达式
   */
  static and(cond1: Conditions, cond2: Conditions, ...condn: Conditions[]): Condition {
    const conditions = [cond1, cond2, ...condn]
    return Condition.group(
      conditions.reduce((previous, current) => {
        let condition = ensureCondition(current);
        if (condition.$kind === 'BINARY_LOGIC') {
          condition = Condition.group(condition)
        }
        if (!previous) return condition;
        return new BinaryLogicCondition(LOGIC_OPERATOR.AND, previous, condition);
      })
    );
  }

  /**
   * 将多个查询条件通过 OR 合并成一个
   * @static
   * @param conditions 查询条件列表
   * @returns 返回逻辑表达式
   */
  static or(cond1: Conditions, cond2: Conditions, ...condn: Condition[]): Condition {
    const conditions = [cond1, cond2, ...condn]
    return Condition.group(
      conditions.reduce((previous, current, index) => {
        let condition = ensureCondition(current);
        if (condition.$kind === 'BINARY_LOGIC') {
          condition = Condition.group(condition)
        }
        if (!previous) return condition;
        return new BinaryLogicCondition(LOGIC_OPERATOR.OR, previous, condition);
      })
    );
  }

  /**
   * Not 逻辑运算
   * @param condition
   */
  static not(condition: Condition): Condition {
    condition = ensureCondition(condition);
    return new UnaryLogicCondition(LOGIC_OPERATOR.NOT, condition);
  }

  /**
   * 判断是否存在
   * @param select 查询语句
   */
  static exists(select: Select<any>): Condition {
    return new ExistsCondition(select);
  }

  /**
   * 比较运算 =
   * @param left 左值
   * @param right 右值
   * @returns 返回比较运算对比条件
   */
  static eq<T extends JsConstant>(
    left: Expressions<T>,
    right: Expressions<T>
  ): Condition {
    return new BinaryCompareCondition(BINARY_COMPARE_OPERATOR.EQ, left, right);
  }

  /**
   * 比较运算 <>
   * @param left 左值
   * @param right 右值
   * @returns 返回比较运算对比条件
   */
  static neq<T extends JsConstant>(
    left: Expressions<T>,
    right: Expressions<T>
  ): Condition {
    return new BinaryCompareCondition(BINARY_COMPARE_OPERATOR.NEQ, left, right);
  }

  /**
   * 比较运算 <
   * @param left 左值
   * @param right 右值
   * @returns 返回比较运算对比条件
   */
  static lt<T extends JsConstant>(
    left: Expressions<T>,
    right: Expressions<T>
  ): Condition {
    return new BinaryCompareCondition(BINARY_COMPARE_OPERATOR.LT, left, right);
  }

  /**
   * 比较运算 <=
   * @param left 左值
   * @param right 右值
   * @returns 返回比较运算对比条件
   */
  static lte<T extends JsConstant>(
    left: Expressions<T>,
    right: Expressions<T>
  ): Condition {
    return new BinaryCompareCondition(BINARY_COMPARE_OPERATOR.LTE, left, right);
  }

  /**
   * 比较运算 >
   * @param left 左值
   * @param right 右值
   * @returns 返回比较运算对比条件
   */
  static gt<T extends JsConstant>(
    left: Expressions<T>,
    right: Expressions<T>
  ): Condition {
    return new BinaryCompareCondition(BINARY_COMPARE_OPERATOR.GT, left, right);
  }

  /**
   * 比较运算 >=
   * @param left 左值
   * @param right 右值
   * @returns 返回比较运算对比条件
   */
  static gte<T extends JsConstant>(
    left: Expressions<T>,
    right: Expressions<T>
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
    left: Expressions<string>,
    right: Expressions<string>
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
    left: Expressions<string>,
    right: Expressions<string>
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
  static in<T extends JsConstant>(left: Expressions<T>, select: Select<any>): Condition
  static in<T extends JsConstant>(left: Expressions<T>, values: Expressions<T>[]): Condition
  static in<T extends JsConstant>(left: Expressions<T>, values: Expressions<T>[] | Select<any>): Condition {
    return new BinaryCompareCondition(
      BINARY_COMPARE_OPERATOR.IN,
      left,
      isSelect(values) ? values.asValue() : values.map((v) => ensureExpression(v))
    );
  }

  /**
   * 比较运算 NOT IN
   * @param left 左值
   * @param values 要比较的值列表
   * @returns 返回比较运算对比条件
   */
  static notIn<T extends JsConstant>(
    left: Expressions<T>,
    values: Expressions<T>[]
  ): Condition {
    return new BinaryCompareCondition(
      BINARY_COMPARE_OPERATOR.NOT_IN,
      left,
      values.map((v) => ensureExpression(v))
    );
  }

  /**
   * 比较运算 IS NULL
   * @returns 返回比较运算符
   * @param expr 表达式
   */
  static isNull(expr: Expressions<JsConstant>): Condition {
    return new UnaryCompareCondition(UNARY_COMPARE_OPERATOR.IS_NULL, expr);
  }

  /**
   * 比较运算 IS NOT NULL
   * @param expr 表达式
   * @returns 返回比较运算符
   */
  static isNotNull(expr: Expressions<JsConstant>): Condition {
    return new UnaryCompareCondition(UNARY_COMPARE_OPERATOR.IS_NOT_NULL, expr);
  }

  /**
   * 将查询条件用括号包括
   * @param condition 查询条件
   */
  static group(condition: Conditions<any>): Condition {
    return new GroupCondition(condition);
  }
}

/**
 * 二元逻辑查询条件条件
 */
export class BinaryLogicCondition extends Condition {
  $operator: LOGIC_OPERATOR;
  $left: Condition;
  $right: Condition;
  $type: SQL_SYMBOLE.CONDITION = SQL_SYMBOLE.CONDITION;
  $kind: CONDITION_KIND.BINARY_LOGIC = CONDITION_KIND.BINARY_LOGIC;
  /**
   * 创建二元逻辑查询条件实例
   */
  constructor(
    operator: LOGIC_OPERATOR,
    left: Conditions<any>,
    right: Conditions<any>
  ) {
    super();
    this.$operator = operator;
    /**
     * 左查询条件
     */
    this.$left = ensureCondition(left);
    /**
     * 右查询条件
     */
    this.$right = ensureCondition(right);
  }
}

export type LogicCondition = UnaryLogicCondition | BinaryLogicCondition;

/**
 * 一元逻辑查询条件
 */
export class UnaryLogicCondition extends Condition {
  $operator: LOGIC_OPERATOR;
  $condition: Condition;
  $kind: CONDITION_KIND.UNARY_LOGIC = CONDITION_KIND.UNARY_LOGIC;

  /**
   * 创建一元逻辑查询条件实例
   * @param operator
   * @param next
   */
  constructor(operator: LOGIC_OPERATOR, next: Conditions<any>) {
    super();
    this.$operator = operator;
    this.$condition = ensureCondition(next);
  }
}

export type ComparyCondition = BinaryCompareCondition | UnaryCompareCondition;

/**
 * 二元比较条件
 */
export class BinaryCompareCondition extends Condition {
  $left: Expression<JsConstant>;
  $right: Expression<JsConstant> | Expression<JsConstant>[];
  $operator: BINARY_COMPARE_OPERATOR;
  $kind: CONDITION_KIND.BINARY_COMPARE = CONDITION_KIND.BINARY_COMPARE;

  /**
   * 构造函数
   */
  constructor(
    operator: BINARY_COMPARE_OPERATOR,
    left: Expressions<JsConstant>,
    right: Expressions<JsConstant> | Expressions<JsConstant>[]
  ) {
    super();
    this.$operator = operator;
    this.$left = ensureExpression(left);
    if (Array.isArray(right)) {
      this.$right = right.map((expr) => ensureExpression(expr));
    } else {
      this.$right = ensureExpression(right);
    }
  }
}

/**
 * 一元比较条件
 */
export class UnaryCompareCondition extends Condition {
  $expr: Expression<JsConstant>;
  $operator: UNARY_COMPARE_OPERATOR;
  $kind: CONDITION_KIND.UNARY_COMPARE = CONDITION_KIND.UNARY_COMPARE;

  /**
   * 一元比较运算符
   * @param operator 运算符
   * @param expr 查询条件
   */
  constructor(operator: UNARY_COMPARE_OPERATOR, expr: Expressions<JsConstant>) {
    super();
    this.$operator = operator;
    assert(expr, "next must not null");
    this.$expr = ensureExpression(expr);
  }
}

/**
 * 一元比较条件
 */
export class ExistsCondition extends Condition {
  $statement: Select;
  $kind: CONDITION_KIND.EXISTS = CONDITION_KIND.EXISTS;

  /**
   * EXISTS子句
   * @param expr 查询条件
   */
  constructor(expr: Select) {
    super();
    this.$statement = expr;
  }
}

/**
 * 联接查询
 */
export class Join extends AST {
  readonly $type: SQL_SYMBOLE.JOIN = SQL_SYMBOLE.JOIN;
  $left: boolean;
  $table: Rowset;
  $on: Condition;

  /**
   * 创建一个表关联
   * @param table
   * @param on 关联条件
   * @param left 是否左联接
   */
  constructor(
    table: Name<string> | Rowset,
    on: Condition,
    left: boolean = false
  ) {
    super();

    this.$table = ensureRowset(table);
    this.$on = on;
    this.$left = left;
  }
}

/**
 * SQL *，查询所有字段时使用
 */
export class Star<T extends Model = any> extends AST {
  readonly $type: SQL_SYMBOLE.STAR = SQL_SYMBOLE.STAR;

  constructor(parent?: Name<string>) {
    super();
    this.$parent = parent;
  }

  $parent?: Name<string>;
}

/**
 * 标识符，可以多级，如表名等
 */
export abstract class Identifier<N extends string = string> extends AST {
  constructor(name: Name<N>, builtIn = false) {
    super();
    this.$name = name;
    this.$builtin = builtIn;
  }
  readonly $type: SQL_SYMBOLE.IDENTIFIER = SQL_SYMBOLE.IDENTIFIER;
  /**
   * 标识符名称
   */
  readonly $name: Name<N>;

  /**
   * 是否内建标识符，如果是，在编译时不会自动加上引号，如系统函数类的 count 等聚合函数
   */
  readonly $builtin: boolean;

  /**
   * 标识符类别
   */
  readonly $kind: IDENTOFIER_KIND;

  /**
   * 创建表对象，该对象是可代理的，可以直接以 . 运算符获取下一节点Identifier
   * @param name
   */
  static table<T extends Model = any>(
    modelClass: ModelConstructor<T>
  ): ProxiedRowset<Table<T, string>>;
  static table<T extends Model = any, N extends string = string>(
    name: Name<N>
  ): ProxiedRowset<Table<T, N>>;
  static table<T extends Model = any>(
    nameOrModel: Name<string> | ModelConstructor<T>
  ): ProxiedRowset<Table<T, string>> {
    if (typeof nameOrModel === "function") {
      return makeProxiedRowset<Table<T, string>>(new Table<T, string>(nameOrModel.name));
    }
    return makeProxiedRowset(new Table<T, string>(nameOrModel));
  }

  static func<N extends string>(name: Name<N>, builtIn = false): Func<N> {
    return new Func(name, builtIn);
  }

  /**
   * 创建一个可供调用的存储过程函数
   */
  static proc<T extends Object>(
    name: Name<string>
  ): (...args: Expressions<JsConstant>[]) => Execute<T> {
    return function (...args: Expressions<JsConstant>[]): Execute<T> {
      return new Procedure(name, false).execute(...args);
    };
  }

  /**
   * 创建一个字段
   */
  static field<T extends JsConstant, N extends string>(
    name: Name<N>
  ): Field<T, N> {
    return new Field(name);
  }

  static builtIn<T extends string>(name: T): BuiltIn<T> {
    return new BuiltIn(name);
  }

  static variant<T extends JsConstant, N extends string>(name: N) {
    return new Variant(name);
  }

  static get star(): Star<any> {
    return new Star<any>();
  }
}

/**
 * SQL系统内建关键字，如MSSQL DATEPART: DAY / M / MM 等
 */
export class BuiltIn<N extends string = string> extends Identifier<N> {
  $name: N;
  $kind: IDENTOFIER_KIND.BUILT_IN = IDENTOFIER_KIND.BUILT_IN;
  readonly $builtin: true;
  constructor(name: N) {
    super(name, true);
  }
}

export class Alias<N extends string> extends Identifier<N> {
  $name: N;
  $kind: IDENTOFIER_KIND.ALIAS;
  constructor(name: N) {
    super(name, false);
  }
}

export class Func<
  N extends string
  // K extends FUNCTION_TYPE = FUNCTION_TYPE.SCALAR
  > extends Identifier<N> {
  $kind: IDENTOFIER_KIND.FUNCTION = IDENTOFIER_KIND.FUNCTION;

  // /**
  //  * 函数类型
  //  */
  // $ftype: K

  /**
   * 如果未传函数类型，则使用标题函数作为默认类型
   */
  constructor(
    name: Name<N>,
    buildIn: boolean = false
    // type?: K
  ) {
    super(name, buildIn);
    // this.$ftype = type || (FUNCTION_TYPE.SCALAR as K)
  }

  callAsTable<T extends Model = any>(
    ...args: Expressions<JsConstant>[]
  ): Rowset<T> {
    return new TableFuncInvoke(this, args);
  }

  callAsCalar<T extends JsConstant>(
    ...args: Expressions<JsConstant>[]
  ): Expression<T> {
    return new ScalarFuncInvoke(this, args);
  }
}

export type PathedName<T extends string> =
  | [T]
  | [string, T]
  | [string, string, T]
  | [string, string, string, T]
  | [string, string, string, string, T];

export type Name<T extends string> = T | PathedName<T>;

export abstract class Assignable<T extends JsConstant = any> extends Expression<
  T
  > {
  readonly $lvalue: true = true;
  /**
   * 赋值操作
   * @param left 左值
   * @param right 右值
   */
  assign(value: Expressions<T>): Assignment<T> {
    return new Assignment(this, value);
  }
}

export class Field<T extends JsConstant = any, N extends string = string>
  extends Assignable<T>
  implements Identifier<N> {
  constructor(name: Name<N>) {
    super();
    this.$name = name;
  }
  $builtin: false = false;

  readonly $name: Name<N>;
  readonly $type: SQL_SYMBOLE.IDENTIFIER = SQL_SYMBOLE.IDENTIFIER;
  readonly $kind: IDENTOFIER_KIND.FIELD = IDENTOFIER_KIND.FIELD;
}

applyMixins(Field, [Identifier]);

/**
 * 数据库行集，混入类型
 */
export abstract class Rowset<T extends Model = unknown> extends AST {
  /**
   * 别名
   */
  $alias?: Alias<string>;

  /**
   * 为当前表添加别名
   */
  as(alias: string): this {
    this.$alias = new Alias(alias);
    return this;
  }

  /**
   * 访问下一节点
   * @param name 节点名称
   */
  field<P extends FieldsOf<T>>(name: P): Field<T[P], P> {
    if (!this.$alias) {
      throw new Error("You must named rowset befor use field.");
    }
    return new Field<T[P], P>([this.$alias.$name, name]);
  }

  /**
   * 获取star的缩写方式，等价于 field
   */
  get _(): Star<T> {
    return this.star;
  }

  /**
   * 访问字段的缩写方式，等价于 field
   */
  $<P extends FieldsOf<T>>(name: P): Field<T[P], P> {
    return this.field(name);
  }

  /**
   * 获取所有字段
   */
  get star(): Star<T> {
    if (!this.$alias) {
      throw new Error("You must named rowset befor use field.");
    }
    return new Star<T>(this.$alias.$name);
  }

  clone(): this {
    const copied = super.clone()
    if (Reflect.get(this, $IsProxy)) {
      return makeProxiedRowset(copied)
    }
    return copied
  }
}

export type Tables<T extends Model = any, N extends string = string> =
  | Name<string>
  | Table<T, N>;

export class Table<T extends Model = any, N extends string = string>
  extends Rowset<T>
  implements Identifier<N> {
  constructor(name: Name<N>) {
    super();
    this.$name = name;
  }
  $name: Name<N>;
  $builtin: false = false;
  $type: SQL_SYMBOLE.IDENTIFIER = SQL_SYMBOLE.IDENTIFIER;
  $kind: IDENTOFIER_KIND.TABLE = IDENTOFIER_KIND.TABLE;

  /**
   * 访问字段
   * @param name 节点名称
   */
  field<P extends FieldsOf<T>>(name: P): Field<T[P], P> {
    if (this.$alias) {
      return super.field(name);
    }
    return new Field<T[P], P>([...pathName(this.$name), name] as Name<P>);
  }

  /**
   * 获取所有字段
   */
  get star(): Star<T> {
    if (this.$alias) {
      return super.star;
    }
    return new Star(this.$name);
  }
}

applyMixins(Table, [Identifier]);

/**
 * 标量变量，暂不支持表变量
 */
export class Variant<T extends JsConstant = any, N extends string = string>
  extends Assignable<T>
  implements Identifier<N> {
  $type: SQL_SYMBOLE.IDENTIFIER = SQL_SYMBOLE.IDENTIFIER;
  $kind: IDENTOFIER_KIND.VARIANT = IDENTOFIER_KIND.VARIANT;
  constructor(name: N) {
    super();
    this.$name = name;
  }
  $builtin: boolean;
  $name: N;
}

applyMixins(Variant, [Identifier]);

// TODO 表变量支持

export class TableVariant<T extends Model = any, N extends string = string>
  extends Rowset<T>
  implements Identifier<N> {
  $type: SQL_SYMBOLE.IDENTIFIER = SQL_SYMBOLE.IDENTIFIER;
  $builtin: boolean;
  $kind: IDENTOFIER_KIND.TABLE_VARIANT = IDENTOFIER_KIND.TABLE_VARIANT;
  $name: N;
  constructor(name: N) {
    super();
    this.$name = name;
  }
}

applyMixins(TableVariant, [Identifier]);

/**
 * 列表达式
 */
export class Column<
  T extends JsConstant = JsConstant,
  N extends string = string
  > extends Identifier<N> {
  /**
   * 列名称
   */
  $name: N;

  /**
   * 表达式
   */
  readonly $expr: Expression<T>;
  $kind: IDENTOFIER_KIND.COLUMN = IDENTOFIER_KIND.COLUMN;

  /**
   * 别名构造函数
   * @param expr 表达式或表名
   * @param name 别名
   */
  constructor(name: N, expr: Expression<T>) {
    super(name, false);
    // assertType(expr, [DbObject, Field, Constant, Select], 'alias must type of DbObject|Field|Constant|Bracket<Select>')
    this.$expr = expr;
  }
}

/**
 * SELECT函数签名
 */
export type SelectAction = {
  /**
   * 选择列
   */
  <A extends SelectCloumn>(a: A): Select<ResultObjectByColumns<A>>;
  <T extends JsConstant>(expr: Expressions<T>): Select<{ "*no name": T }>;
  <T extends InputObject>(results: T): Select<ResultObject<T>>;
  <T extends Model>(results: InputObject<T>): Select<T>;
  <A extends SelectCloumn, B extends SelectCloumn>(a: A, b: B): Select<
    ResultObjectByColumns<A, B>
  >;
  <A extends SelectCloumn, B extends SelectCloumn, C extends SelectCloumn>(
    a: A,
    b?: B,
    d?: C
  ): Select<ResultObjectByColumns<A, B, C>>;
  <
    A extends SelectCloumn,
    B extends SelectCloumn,
    C extends SelectCloumn,
    D extends SelectCloumn
    >(
    a: A,
    b: B,
    c: C,
    d: D
  ): Select<ResultObjectByColumns<A, B, C, D>>;
  <
    A extends SelectCloumn,
    B extends SelectCloumn,
    C extends SelectCloumn,
    D extends SelectCloumn,
    E extends SelectCloumn
    >(
    a: A,
    b: B,
    c: C,
    d: D,
    e: E
  ): Select<ResultObjectByColumns<A, B, C, D, E>>;
  <
    A extends SelectCloumn,
    B extends SelectCloumn,
    C extends SelectCloumn,
    D extends SelectCloumn,
    E extends SelectCloumn,
    F extends SelectCloumn
    >(
    a: A,
    b: B,
    c: C,
    d: D,
    e: E,
    f: F
  ): Select<ResultObjectByColumns<A, B, C, D, E, F>>;
  <
    A extends SelectCloumn,
    B extends SelectCloumn,
    C extends SelectCloumn,
    D extends SelectCloumn,
    E extends SelectCloumn,
    F extends SelectCloumn,
    G extends SelectCloumn
    >(
    a: A,
    b: B,
    c: C,
    d: D,
    e: E,
    f: F,
    g: G
  ): Select<ResultObjectByColumns<A, B, C, D, E, F, G>>;
  <
    A extends SelectCloumn,
    B extends SelectCloumn,
    C extends SelectCloumn,
    D extends SelectCloumn,
    E extends SelectCloumn,
    F extends SelectCloumn,
    G extends SelectCloumn,
    H extends SelectCloumn
    >(
    a: A,
    b: B,
    c: C,
    d: D,
    e: E,
    f: F,
    g: G,
    h: H
  ): Select<ResultObjectByColumns<A, B, C, D, E, F, G, H>>;
  <
    A extends SelectCloumn,
    B extends SelectCloumn,
    C extends SelectCloumn,
    D extends SelectCloumn,
    E extends SelectCloumn,
    F extends SelectCloumn,
    G extends SelectCloumn,
    H extends SelectCloumn,
    I extends SelectCloumn
    >(
    a: A,
    b: B,
    c: C,
    d: D,
    e: E,
    f: F,
    g: G,
    h: H,
    i: I
  ): Select<ResultObjectByColumns<A, B, C, D, E, F, G, H, I>>;
  <
    A extends SelectCloumn,
    B extends SelectCloumn,
    C extends SelectCloumn,
    D extends SelectCloumn,
    E extends SelectCloumn,
    F extends SelectCloumn,
    G extends SelectCloumn,
    H extends SelectCloumn,
    I extends SelectCloumn,
    J extends SelectCloumn
    >(
    a: A,
    b: B,
    c: C,
    d: D,
    e: E,
    f: F,
    g: G,
    h: H,
    i: I,
    j: J
  ): Select<ResultObjectByColumns<A, B, C, D, E, F, G, H, I, J>>;
  <
    A extends SelectCloumn,
    B extends SelectCloumn,
    C extends SelectCloumn,
    D extends SelectCloumn,
    E extends SelectCloumn,
    F extends SelectCloumn,
    G extends SelectCloumn,
    H extends SelectCloumn,
    I extends SelectCloumn,
    J extends SelectCloumn,
    K extends SelectCloumn
    >(
    a: A,
    b: B,
    c: C,
    d: D,
    e: E,
    f: F,
    g: G,
    h: H,
    i: I,
    j: J,
    k: K
  ): Select<ResultObjectByColumns<A, B, C, D, E, F, G, H, I, J, K>>;
  <
    A extends SelectCloumn,
    B extends SelectCloumn,
    C extends SelectCloumn,
    D extends SelectCloumn,
    E extends SelectCloumn,
    F extends SelectCloumn,
    G extends SelectCloumn,
    H extends SelectCloumn,
    I extends SelectCloumn,
    J extends SelectCloumn,
    K extends SelectCloumn,
    L extends SelectCloumn
    >(
    a: A,
    b: B,
    c: C,
    d: D,
    e: E,
    f: F,
    g: G,
    h: H,
    i: I,
    j: J,
    k: K,
    l: L
  ): Select<ResultObjectByColumns<A, B, C, D, E, F, G, H, I, J, K, L>>;
  <
    A extends SelectCloumn,
    B extends SelectCloumn,
    C extends SelectCloumn,
    D extends SelectCloumn,
    E extends SelectCloumn,
    F extends SelectCloumn,
    G extends SelectCloumn,
    H extends SelectCloumn,
    I extends SelectCloumn,
    J extends SelectCloumn,
    K extends SelectCloumn,
    L extends SelectCloumn,
    M extends SelectCloumn
    >(
    a: A,
    b: B,
    c: C,
    d: D,
    e: E,
    f: F,
    g: G,
    h: H,
    i: I,
    j: J,
    k: K,
    l: L,
    m: M
  ): Select<ResultObjectByColumns<A, B, C, D, E, F, G, H, I, J, K, L, M>>;
  <
    A extends SelectCloumn,
    B extends SelectCloumn,
    C extends SelectCloumn,
    D extends SelectCloumn,
    E extends SelectCloumn,
    F extends SelectCloumn,
    G extends SelectCloumn,
    H extends SelectCloumn,
    I extends SelectCloumn,
    J extends SelectCloumn,
    K extends SelectCloumn,
    L extends SelectCloumn,
    M extends SelectCloumn,
    N extends SelectCloumn
    >(
    a: A,
    b: B,
    c: C,
    d: D,
    e: E,
    f: F,
    g: G,
    h: H,
    i: I,
    j: J,
    k: K,
    l: L,
    m: M,
    n: N
  ): Select<ResultObjectByColumns<A, B, C, D, E, F, G, H, I, J, K, L, M, N>>;
  <
    A extends SelectCloumn,
    B extends SelectCloumn,
    C extends SelectCloumn,
    D extends SelectCloumn,
    E extends SelectCloumn,
    F extends SelectCloumn,
    G extends SelectCloumn,
    H extends SelectCloumn,
    I extends SelectCloumn,
    J extends SelectCloumn,
    K extends SelectCloumn,
    L extends SelectCloumn,
    M extends SelectCloumn,
    N extends SelectCloumn,
    O extends SelectCloumn
    >(
    a: A,
    b: B,
    c: C,
    d: D,
    e: E,
    f: F,
    g: G,
    h: H,
    i: I,
    j: J,
    k: K,
    l: L,
    m: M,
    n: N,
    o: O
  ): Select<ResultObjectByColumns<A, B, C, D, E, F, G, H, I, J, K, L, M, N, O>>;
  <
    A extends SelectCloumn,
    B extends SelectCloumn,
    C extends SelectCloumn,
    D extends SelectCloumn,
    E extends SelectCloumn,
    F extends SelectCloumn,
    G extends SelectCloumn,
    H extends SelectCloumn,
    I extends SelectCloumn,
    J extends SelectCloumn,
    K extends SelectCloumn,
    L extends SelectCloumn,
    M extends SelectCloumn,
    N extends SelectCloumn,
    O extends SelectCloumn,
    P extends SelectCloumn
    >(
    a: A,
    b: B,
    c: C,
    d: D,
    e: E,
    f: F,
    g: G,
    h: H,
    i: I,
    j: J,
    k: K,
    l: L,
    m: M,
    n: N,
    o: O,
    p: P
  ): Select<
    ResultObjectByColumns<A, B, C, D, E, F, G, H, I, J, K, L, M, N, O, P>
  >;
  <
    A extends SelectCloumn,
    B extends SelectCloumn,
    C extends SelectCloumn,
    D extends SelectCloumn,
    E extends SelectCloumn,
    F extends SelectCloumn,
    G extends SelectCloumn,
    H extends SelectCloumn,
    I extends SelectCloumn,
    J extends SelectCloumn,
    K extends SelectCloumn,
    L extends SelectCloumn,
    M extends SelectCloumn,
    N extends SelectCloumn,
    O extends SelectCloumn,
    P extends SelectCloumn,
    Q extends SelectCloumn
    >(
    a: A,
    b: B,
    c: C,
    d: D,
    e: E,
    f: F,
    g: G,
    h: H,
    i: I,
    j: J,
    k: K,
    l: L,
    m: M,
    n: N,
    o: O,
    p: P,
    q: Q
  ): Select<
    ResultObjectByColumns<A, B, C, D, E, F, G, H, I, J, K, L, M, N, O, P, Q>
  >;
  <
    A extends SelectCloumn,
    B extends SelectCloumn,
    C extends SelectCloumn,
    D extends SelectCloumn,
    E extends SelectCloumn,
    F extends SelectCloumn,
    G extends SelectCloumn,
    H extends SelectCloumn,
    I extends SelectCloumn,
    J extends SelectCloumn,
    K extends SelectCloumn,
    L extends SelectCloumn,
    M extends SelectCloumn,
    N extends SelectCloumn,
    O extends SelectCloumn,
    P extends SelectCloumn,
    Q extends SelectCloumn,
    R extends SelectCloumn
    >(
    a: A,
    b: B,
    c: C,
    d: D,
    e: E,
    f: F,
    g: G,
    h: H,
    i: I,
    j: J,
    k: K,
    l: L,
    m: M,
    n: N,
    o: O,
    p: P,
    q: Q,
    r: R
  ): Select<
    ResultObjectByColumns<A, B, C, D, E, F, G, H, I, J, K, L, M, N, O, P, Q, R>
  >;
  <
    A extends SelectCloumn,
    B extends SelectCloumn,
    C extends SelectCloumn,
    D extends SelectCloumn,
    E extends SelectCloumn,
    F extends SelectCloumn,
    G extends SelectCloumn,
    H extends SelectCloumn,
    I extends SelectCloumn,
    J extends SelectCloumn,
    K extends SelectCloumn,
    L extends SelectCloumn,
    M extends SelectCloumn,
    N extends SelectCloumn,
    O extends SelectCloumn,
    P extends SelectCloumn,
    Q extends SelectCloumn,
    R extends SelectCloumn,
    S extends SelectCloumn
    >(
    a: A,
    b: B,
    c: C,
    d: D,
    e: E,
    f: F,
    g: G,
    h: H,
    i: I,
    j: J,
    k: K,
    l: L,
    m: M,
    n: N,
    o: O,
    p: P,
    q: Q,
    r: R,
    s: S
  ): Select<
    ResultObjectByColumns<
      A,
      B,
      C,
      D,
      E,
      F,
      G,
      H,
      I,
      J,
      K,
      L,
      M,
      N,
      O,
      P,
      Q,
      R,
      S
    >
  >;
  <
    A extends SelectCloumn,
    B extends SelectCloumn,
    C extends SelectCloumn,
    D extends SelectCloumn,
    E extends SelectCloumn,
    F extends SelectCloumn,
    G extends SelectCloumn,
    H extends SelectCloumn,
    I extends SelectCloumn,
    J extends SelectCloumn,
    K extends SelectCloumn,
    L extends SelectCloumn,
    M extends SelectCloumn,
    N extends SelectCloumn,
    O extends SelectCloumn,
    P extends SelectCloumn,
    Q extends SelectCloumn,
    R extends SelectCloumn,
    S extends SelectCloumn,
    T extends SelectCloumn
    >(
    a: A,
    b: B,
    c: C,
    d: D,
    e: E,
    f: F,
    g: G,
    h: H,
    i: I,
    j: J,
    k: K,
    l: L,
    m: M,
    n: N,
    o: O,
    p: P,
    q: Q,
    r: R,
    s: S,
    t: T
  ): Select<
    ResultObjectByColumns<
      A,
      B,
      C,
      D,
      E,
      F,
      G,
      H,
      I,
      J,
      K,
      L,
      M,
      N,
      O,
      P,
      Q,
      R,
      S,
      T
    >
  >;
  <
    A extends SelectCloumn,
    B extends SelectCloumn,
    C extends SelectCloumn,
    D extends SelectCloumn,
    E extends SelectCloumn,
    F extends SelectCloumn,
    G extends SelectCloumn,
    H extends SelectCloumn,
    I extends SelectCloumn,
    J extends SelectCloumn,
    K extends SelectCloumn,
    L extends SelectCloumn,
    M extends SelectCloumn,
    N extends SelectCloumn,
    O extends SelectCloumn,
    P extends SelectCloumn,
    Q extends SelectCloumn,
    R extends SelectCloumn,
    S extends SelectCloumn,
    T extends SelectCloumn,
    U extends SelectCloumn
    >(
    a: A,
    b: B,
    c: C,
    d: D,
    e: E,
    f: F,
    g: G,
    h: H,
    i: I,
    j: J,
    k: K,
    l: L,
    m: M,
    n: N,
    o: O,
    p: P,
    q: Q,
    r: R,
    s: S,
    t: T,
    u: U
  ): Select<
    ResultObjectByColumns<
      A,
      B,
      C,
      D,
      E,
      F,
      G,
      H,
      I,
      J,
      K,
      L,
      M,
      N,
      O,
      P,
      Q,
      R,
      S,
      T,
      U
    >
  >;
  <
    A extends SelectCloumn,
    B extends SelectCloumn,
    C extends SelectCloumn,
    D extends SelectCloumn,
    E extends SelectCloumn,
    F extends SelectCloumn,
    G extends SelectCloumn,
    H extends SelectCloumn,
    I extends SelectCloumn,
    J extends SelectCloumn,
    K extends SelectCloumn,
    L extends SelectCloumn,
    M extends SelectCloumn,
    N extends SelectCloumn,
    O extends SelectCloumn,
    P extends SelectCloumn,
    Q extends SelectCloumn,
    R extends SelectCloumn,
    S extends SelectCloumn,
    T extends SelectCloumn,
    U extends SelectCloumn,
    V extends SelectCloumn
    >(
    a: A,
    b: B,
    c: C,
    d: D,
    e: E,
    f: F,
    g: G,
    h: H,
    i: I,
    j: J,
    k: K,
    l: L,
    m: M,
    n: N,
    o: O,
    p: P,
    q: Q,
    r: R,
    s: S,
    t: T,
    u: U,
    v: V
  ): Select<
    ResultObjectByColumns<
      A,
      B,
      C,
      D,
      E,
      F,
      G,
      H,
      I,
      J,
      K,
      L,
      M,
      N,
      O,
      P,
      Q,
      R,
      S,
      T,
      U,
      V
    >
  >;
  <
    A extends SelectCloumn,
    B extends SelectCloumn,
    C extends SelectCloumn,
    D extends SelectCloumn,
    E extends SelectCloumn,
    F extends SelectCloumn,
    G extends SelectCloumn,
    H extends SelectCloumn,
    I extends SelectCloumn,
    J extends SelectCloumn,
    K extends SelectCloumn,
    L extends SelectCloumn,
    M extends SelectCloumn,
    N extends SelectCloumn,
    O extends SelectCloumn,
    P extends SelectCloumn,
    Q extends SelectCloumn,
    R extends SelectCloumn,
    S extends SelectCloumn,
    T extends SelectCloumn,
    U extends SelectCloumn,
    V extends SelectCloumn,
    W extends SelectCloumn
    >(
    a: A,
    b: B,
    c: C,
    d: D,
    e: E,
    f: F,
    g: G,
    h: H,
    i: I,
    j: J,
    k: K,
    l: L,
    m: M,
    n: N,
    o: O,
    p: P,
    q: Q,
    r: R,
    s: S,
    t: T,
    u: U,
    v: V,
    w: W
  ): Select<
    ResultObjectByColumns<
      A,
      B,
      C,
      D,
      E,
      F,
      G,
      H,
      I,
      J,
      K,
      L,
      M,
      N,
      O,
      P,
      Q,
      R,
      S,
      T,
      U,
      V,
      W
    >
  >;
  <
    A extends SelectCloumn,
    B extends SelectCloumn,
    C extends SelectCloumn,
    D extends SelectCloumn,
    E extends SelectCloumn,
    F extends SelectCloumn,
    G extends SelectCloumn,
    H extends SelectCloumn,
    I extends SelectCloumn,
    J extends SelectCloumn,
    K extends SelectCloumn,
    L extends SelectCloumn,
    M extends SelectCloumn,
    N extends SelectCloumn,
    O extends SelectCloumn,
    P extends SelectCloumn,
    Q extends SelectCloumn,
    R extends SelectCloumn,
    S extends SelectCloumn,
    T extends SelectCloumn,
    U extends SelectCloumn,
    V extends SelectCloumn,
    W extends SelectCloumn,
    X extends SelectCloumn
    >(
    a: A,
    b: B,
    c: C,
    d: D,
    e: E,
    f: F,
    g: G,
    h: H,
    i: I,
    j: J,
    k: K,
    l: L,
    m: M,
    n: N,
    o: O,
    p: P,
    q: Q,
    r: R,
    s: S,
    t: T,
    u: U,
    v: V,
    w: W,
    x: X
  ): Select<
    ResultObjectByColumns<
      A,
      B,
      C,
      D,
      E,
      F,
      G,
      H,
      I,
      J,
      K,
      L,
      M,
      N,
      O,
      P,
      Q,
      R,
      S,
      T,
      U,
      V,
      W,
      X
    >
  >;
  <
    A extends SelectCloumn,
    B extends SelectCloumn,
    C extends SelectCloumn,
    D extends SelectCloumn,
    E extends SelectCloumn,
    F extends SelectCloumn,
    G extends SelectCloumn,
    H extends SelectCloumn,
    I extends SelectCloumn,
    J extends SelectCloumn,
    K extends SelectCloumn,
    L extends SelectCloumn,
    M extends SelectCloumn,
    N extends SelectCloumn,
    O extends SelectCloumn,
    P extends SelectCloumn,
    Q extends SelectCloumn,
    R extends SelectCloumn,
    S extends SelectCloumn,
    T extends SelectCloumn,
    U extends SelectCloumn,
    V extends SelectCloumn,
    W extends SelectCloumn,
    X extends SelectCloumn,
    Y extends SelectCloumn
    >(
    a: A,
    b: B,
    c: C,
    d: D,
    e: E,
    f: F,
    g: G,
    h: H,
    i: I,
    j: J,
    k: K,
    l: L,
    m: M,
    n: N,
    o: O,
    p: P,
    q: Q,
    r: R,
    s: S,
    t: T,
    u: U,
    v: V,
    w: W,
    x: X,
    y: Y
  ): Select<
    ResultObjectByColumns<
      A,
      B,
      C,
      D,
      E,
      F,
      G,
      H,
      I,
      J,
      K,
      L,
      M,
      N,
      O,
      P,
      Q,
      R,
      S,
      T,
      U,
      V,
      W,
      X,
      Y
    >
  >;
  <
    A extends SelectCloumn,
    B extends SelectCloumn,
    C extends SelectCloumn,
    D extends SelectCloumn,
    E extends SelectCloumn,
    F extends SelectCloumn,
    G extends SelectCloumn,
    H extends SelectCloumn,
    I extends SelectCloumn,
    J extends SelectCloumn,
    K extends SelectCloumn,
    L extends SelectCloumn,
    M extends SelectCloumn,
    N extends SelectCloumn,
    O extends SelectCloumn,
    P extends SelectCloumn,
    Q extends SelectCloumn,
    R extends SelectCloumn,
    S extends SelectCloumn,
    T extends SelectCloumn,
    U extends SelectCloumn,
    V extends SelectCloumn,
    W extends SelectCloumn,
    X extends SelectCloumn,
    Y extends SelectCloumn,
    Z extends SelectCloumn
    >(
    a: A,
    b: B,
    c: C,
    d: D,
    e: E,
    f: F,
    g: G,
    h: H,
    i: I,
    j: J,
    k: K,
    l: L,
    m: M,
    n: N,
    o: O,
    p: P,
    q: Q,
    r: R,
    s: S,
    t: T,
    u: U,
    v: V,
    w: W,
    x: X,
    y: Y,
    z: Z
  ): Select<
    ResultObjectByColumns<
      A,
      B,
      C,
      D,
      E,
      F,
      G,
      H,
      I,
      J,
      K,
      L,
      M,
      N,
      O,
      P,
      Q,
      R,
      S,
      T,
      U,
      V,
      W,
      X,
      Y,
      Z
    >
  >;

  <
    A extends JsConstant,
    B extends JsConstant,
    C extends JsConstant,
    D extends JsConstant,
    E extends JsConstant,
    F extends JsConstant,
    G extends JsConstant,
    H extends JsConstant,
    I extends JsConstant,
    J extends JsConstant,
    K extends JsConstant,
    L extends JsConstant,
    M extends JsConstant,
    N extends JsConstant,
    O extends JsConstant,
    P extends JsConstant,
    Q extends JsConstant,
    R extends JsConstant,
    S extends JsConstant,
    T extends JsConstant,
    U extends JsConstant,
    V extends JsConstant,
    W extends JsConstant,
    X extends JsConstant,
    Y extends JsConstant,
    Z extends JsConstant
    >(
    a: Expressions<A>,
    b: Expressions<B>,
    c: Expressions<C>,
    d: Expressions<D>,
    e: Expressions<E>,
    f: Expressions<F>,
    g: Expressions<G>,
    h: Expressions<H>,
    i: Expressions<I>,
    j: Expressions<J>,
    k: Expressions<K>,
    l: Expressions<L>,
    m: Expressions<M>,
    n: Expressions<N>,
    o: Expressions<O>,
    p: Expressions<P>,
    q: Expressions<Q>,
    r: Expressions<R>,
    s: Expressions<S>,
    t: Expressions<T>,
    u: Expressions<U>,
    v: Expressions<V>,
    w: Expressions<W>,
    x: Expressions<X>,
    y: Expressions<Y>,
    z: Expressions<Z>
  ): Select<{
    "*": [
      A,
      B,
      C,
      D,
      E,
      F,
      G,
      H,
      I,
      J,
      K,
      L,
      M,
      N,
      O,
      P,
      Q,
      R,
      S,
      T,
      U,
      V,
      W,
      X,
      Y,
      Z
    ];
  }>;
  <T extends Model = any>(
    ...columns: (Column | Expressions | Star<any>)[]
  ): Select<T>;
};

/**
 * 函数调用表达式
 */
export class ScalarFuncInvoke<
  TReturn extends JsConstant = any
  > extends Expression<TReturn> {
  $func: Func<string>;
  $args: (Expression<JsConstant> | BuiltIn<string> | Star)[];
  readonly $type: SQL_SYMBOLE.SCALAR_FUNCTION_INVOKE =
    SQL_SYMBOLE.SCALAR_FUNCTION_INVOKE;

  // TODO: 是否需参数的类型判断，拦截ValuedSelect之类的表达式进入？
  constructor(
    func: Name<string> | Func<string>,
    args: (Expressions<JsConstant> | BuiltIn<string> | Star)[]
  ) {
    super();
    this.$func = ensureFunction(func);
    this.$args = args.map((expr) => {
      if (isJsConstant(expr)) return ensureExpression(expr);
      return expr;
    });
  }
}

export class TableFuncInvoke<TReturn extends Model = any> extends Rowset<
  TReturn
  > {
  readonly $func: Func<string>;
  readonly $args: Expression<JsConstant>[];
  readonly $type: SQL_SYMBOLE.TABLE_FUNCTION_INVOKE =
    SQL_SYMBOLE.TABLE_FUNCTION_INVOKE;

  constructor(
    func: Name<string> | Func<string>,
    args: Expressions<JsConstant>[]
  ) {
    super();
    this.$func = ensureFunction(func);
    this.$args = args.map((expr) => ensureExpression(expr));
  }
}

/**
 * SQL 语句
 */
export abstract class Statement extends AST {
  /**
   * 插入至表,into的别名
   * @param table
   * @param fields
   */
  static insert<T extends Model = any>(
    table: Tables<T, string>,
    fields?: FieldsOf<T>[] | Field<JsConstant, FieldsOf<T>>[]
  ): Insert<T> {
    return new Insert(table, fields);
  }

  /**
   * 更新一个表格
   * @param table
   */
  static update<T extends Model = any>(table: Tables<T, string>): Update<T> {
    return new Update(table);
  }

  /**
   * 删除一个表格
   * @param table 表格
   */
  static delete<T extends Model = any>(table: Tables<T, string>): Delete<T> {
    return new Delete(table);
  }

  static select: SelectAction = (...args: any[]): any => {
    return new Select(...args);
  };

  /**
   * 执行一个存储过程
   * @param proc
   * @param params
   */
  // static execute<T extends Model> (
  //   proc: Name<string> | Procedure<T, string>,
  //   params?: Expressions<JsConstant>[]
  // ): Execute<T>
  // static execute<T extends Model> (
  //   proc: Name<string> | Procedure<T, string>,
  //   params?: InputObject
  // ): Execute<T>
  static execute<T extends Model = any>(
    proc: Name<string> | Procedure<T, string>,
    params?: Expressions<JsConstant>[]
    // | Parameter<JsConstant, string>[] | InputObject
  ): Execute<T> {
    return new Execute(proc, params as any);
  }

  static invokeAsTable<T extends Model = any>(
    func: Name<string> | Func<string>,
    args: Expressions<JsConstant>[]
  ) {
    return new TableFuncInvoke<T>(func, args);
  }

  static invokeAsScalar<T extends JsConstant = any>(
    func: Name<string> | Func<string>,
    args: Expressions<JsConstant>[]
  ) {
    return new ScalarFuncInvoke(func, args);
  }

  /**
   * 赋值语句
   * @param left 左值
   * @param right 右值
   */
  static assign<T extends JsConstant = any>(
    left: Assignable<T>,
    right: Expressions<T>
  ) {
    return new Assignment(left, right);
  }

  /**
   * 变量声明
   * @param declares 变量列表
   */
  static declare(...declares: VariantDeclare[]): Declare {
    return new Declare(...declares);
  }

  /**
   * WHEN 语句块
   * @param expr
   * @param value
   */
  static when(expr: Expressions<JsConstant>, value?: Expressions<JsConstant>) {
    return new When(expr, value);
  }

  static case(expr?: Expressions<JsConstant>) {
    return new Case(expr);
  }

  /**
   * With语句
   */
  static with(...selecteds: NamedSelect<any, string>[]): With
  static with(withs: Record<string, Select>): With
  static with(...withs: any) {
    if (withs.length === 1 && isPlainObject(withs)) {
      return new With(withs[0])
    }
    return new With(withs);
  }

  static union<T extends Model = any>(...selects: Select<T>[]): Select<T> {
    let selec = selects[0];
    selects.forEach((sel, index) => {
      if (index < selects.length - 1) sel.union(selects[index + 1]);
    });
    return selects[0];
  }

  static unionAll<T extends Model = any>(...selects: Select<T>[]): Select<T> {
    let selec = selects[0];
    selects.forEach((sel, index) => {
      if (index < selects.length - 1) sel.unionAll(selects[index + 1]);
    });
    return selects[0];
  }
}

/**
 * CRUD语句，允许 接WITH语句
 */
export abstract class CrudStatement extends Statement {
  $with: With;
}

/**
 * When语句
 */
export class When<T extends JsConstant = any> extends AST {
  $expr: Expression<JsConstant> | Condition;
  $value: Expression<T>;
  $type: SQL_SYMBOLE.WHEN = SQL_SYMBOLE.WHEN;

  constructor(expr: Expressions<JsConstant> | Condition, then: Expressions<T>) {
    super();
    if (expr instanceof Expression || expr instanceof Condition) {
      this.$expr = expr;
    }
    if (isJsConstant(expr)) {
      this.$expr = ensureExpression(expr as JsConstant);
    } else {
      this.$expr = expr;
    }
    this.$value = ensureExpression(then);
  }
}

/**
 * CASE表达式
 */
export class Case<T extends JsConstant = any> extends Expression<T> {
  $expr: Expression<any>;
  $whens: When<T>[];
  $default?: Expression<T>;
  $type: SQL_SYMBOLE.CASE = SQL_SYMBOLE.CASE;

  /**
   *
   * @param expr
   */
  constructor(expr?: Expressions<JsConstant>) {
    super();
    if (expr !== undefined) {
      this.$expr = ensureExpression(expr);
    }
    /**
     * @type {When[]}
     */
    this.$whens = [];
  }

  /**
   * ELSE语句
   * @param defaults
   */
  else(defaults: Expressions<T>): this {
    this.$default = ensureExpression(defaults as Expressions<any>);
    return this;
  }

  /**
   * WHEN语句
   * @param expr
   * @param then
   */
  when(expr: Expressions<JsConstant> | Condition, then: Expressions<T>): this {
    this.$whens.push(new When(expr, then));
    return this;
  }
}

/**
 * 常量表达式
 */
export class Constant<T extends JsConstant = JsConstant> extends Expression<T> {
  $type: SQL_SYMBOLE.CONSTANT = SQL_SYMBOLE.CONSTANT;

  /**
   * 实际值
   */
  $value: T;

  constructor(value: T) {
    super();
    this.$value = value;
  }

  static const<T extends JsConstant>(value: T): Constant<T> {
    return new Constant(value);
  }
}

export class GroupCondition extends Condition {
  context: Condition;

  readonly $kind: CONDITION_KIND.GROUP = CONDITION_KIND.GROUP;

  constructor(conditions: Conditions<any>) {
    super();
    this.context = ensureCondition(conditions);
  }
}

/**
 * 括号表达式
 */
export class Bracket<T extends JsConstant = JsConstant> extends Expression<T> {
  $type: SQL_SYMBOLE.BRACKET = SQL_SYMBOLE.BRACKET;
  $inner: Expression<T>;
  constructor(inner: Expressions<T>) {
    super();
    this.$inner = ensureExpression(inner);
  }
}

/**
 * 运算表达式基类
 */
export abstract class Operation<
  T extends JsConstant = JsConstant
  > extends Expression<T> {
  readonly $type: SQL_SYMBOLE.OPERATION = SQL_SYMBOLE.OPERATION;
  readonly $kind: OPERATION_KIND;
  $operator: OPERATION_OPERATOR;
}

/**
 * 二元运算表达式
 */
export class BinaryOperation<
  T extends JsConstant = JsConstant
  > extends Operation<T> {
  readonly $kind: OPERATION_KIND.BINARY = OPERATION_KIND.BINARY;
  $left: Expression<T>;
  $right: Expression<T>;
  $operator: BINARY_OPERATION_OPERATOR;

  /**
   * 名称
   * @param operator 运算符
   * @param left 左值
   * @param right 右值
   */
  constructor(
    operator: BINARY_OPERATION_OPERATOR,
    left: Expressions<T>,
    right: Expressions<T>
  ) {
    super();
    this.$operator = operator;
    this.$left = ensureExpression(left);
    this.$right = ensureExpression(right);
  }
}

/**
 * 一元运算符
 */
export class UnaryOperation<
  T extends JsConstant = JsConstant
  > extends Operation<T> {
  readonly $value: Expression<JsConstant>;
  readonly $kind: OPERATION_KIND.UNARY = OPERATION_KIND.UNARY;
  readonly $operator: UNARY_OPERATION_OPERATOR;

  /**
   * 一元运算
   * @param value
   */
  constructor(
    operator: UNARY_OPERATION_OPERATOR,
    value: Expressions<JsConstant>
  ) {
    super();
    this.$operator = operator;
    this.$value = ensureExpression(value);
  }
}

/**
 * 联接查询
 */
export class Union<T extends Model = any> extends AST {
  $select: Select<T>;
  $all: boolean;
  $type: SQL_SYMBOLE.UNION = SQL_SYMBOLE.UNION;

  /**
   *
   * @param select SELECT语句
   * @param all 是否所有查询
   */
  constructor(select: Select<T>, all: boolean = false) {
    super();
    this.$select = select;
    this.$all = all;
  }
}

/**
 * 排序对象
 */
export type SortObject<T extends Model = any> = {
  [K in FieldsOf<T>]?: SORT_DIRECTION;
};

abstract class Fromable extends CrudStatement {
  $froms?: Rowset<any>[];
  $joins?: Join[];
  $where?: Condition;

  /**
   * 从表中查询，可以查询多表
   * @param tables
   */
  from(...tables: (Name<string> | Rowset<any> | Table<any, string>)[]): this {
    this.$froms = tables.map((table) => ensureRowset(table));
    this.$froms.forEach((table) => {
      if (!table.$alias) {
        if (!(table as any).$name) {
          throw new Error("行集必须指定别名才可以进行FROM查询");
        }
      }
    });
    return this;
  }

  /**
   * 表联接
   * @param table
   * @param on
   * @param left
   * @memberof Select
   */
  join<T extends Model = any>(
    table: Name<string> | Rowset<T>,
    on: Condition,
    left?: boolean
  ): this {
    assert(this.$froms, "join must after from clause");
    if (!this.$joins) {
      this.$joins = [];
    }
    this.$joins.push(new Join(table, on, left));
    return this;
  }

  /**
   * 左联接
   * @param table
   * @param on
   */
  leftJoin<T extends Model = any>(
    table: Name<string> | Rowset<T>,
    on: Condition
  ): this {
    return this.join(table, on, true);
  }

  /**
   * where查询条件
   * @param condition
   */
  where<T extends Model = any>(condition: Conditions<T>) {
    assert(!this.$where, "where is declared");
    if (isPlainObject(condition)) {
      condition = ensureCondition(condition);
    }
    this.$where = condition as Condition;
    return this;
  }
}

export class SortInfo extends AST {
  $type: SQL_SYMBOLE.SORT = SQL_SYMBOLE.SORT;
  $expr: Expression<JsConstant>;
  $direction?: SORT_DIRECTION;
  constructor(expr: Expressions<JsConstant>, direction?: SORT_DIRECTION) {
    super();
    this.$expr = ensureExpression(expr);
    this.$direction = direction;
  }
}

/**
 * SELECT查询
 */
export class Select<T extends Model = any> extends Fromable {
  $top?: number;
  $offset?: number;
  $limit?: number;
  $distinct?: boolean;
  $columns: (Expression<JsConstant> | Column<JsConstant, string> | Star<any>)[];
  $sorts?: SortInfo[];
  $groups?: Expression<any>[];
  $having?: Condition;
  $union?: Union<T>;

  readonly $type: SQL_SYMBOLE.SELECT = SQL_SYMBOLE.SELECT;

  constructor(valueObject?: ValueObject<T>);
  constructor(
    ...columns: (
      | Expressions<JsConstant>
      | Column<JsConstant, string>
      | Star<any>
    )[]
  );
  constructor(...columns: any) {
    super();
    assert(
      columns.length > 0,
      "Must select one or more columns by Select statement."
    );
    if (columns.length === 1 && isPlainObject(columns[0])) {
      const valueObject = columns[0];
      this.$columns = Object.entries(valueObject as ValueObject<T>).map(
        ([name, expr]: [string, Expressions]) => {
          return new Column(name, ensureExpression(expr));
        }
      );
      return;
    }
    // 实例化
    this.$columns = (columns as (
      | Expressions<JsConstant>
      | Column<JsConstant, string>
    )[]).map((item) => {
      if (item instanceof AST) return item;
      return ensureExpression(item);
    });
  }

  /**
   * 去除重复的
   */
  distinct() {
    this.$distinct = true;
    return this;
  }

  /**
   * TOP
   * @param rows 行数
   */
  top(rows: number) {
    // assert(typeof this.$top === 'undefined', 'top is declared')
    this.$top = rows;
    return this;
  }

  /**
   * order by 排序
   * @param sorts 排序信息
   */
  orderBy(sorts: SortObject<T>): this;
  orderBy(...sorts: (SortInfo | Expressions<JsConstant>)[]): this;
  orderBy(
    ...sorts: (SortObject<T> | SortInfo | Expressions<JsConstant>)[]
  ): this {
    // assert(!this.$orders, 'order by clause is declared')
    assert(sorts.length > 0, "must have one or more order basis");
    // 如果传入的是对象类型
    if (sorts.length === 1 && isPlainObject(sorts[0])) {
      const obj = sorts[0];
      this.$sorts = Object.entries(obj).map(
        ([expr, direction]) => new SortInfo(expr, direction as SORT_DIRECTION)
      );
      return this;
    }
    sorts = sorts as (Expressions<JsConstant> | SortInfo)[];
    this.$sorts = sorts.map((expr) =>
      expr instanceof SortInfo
        ? expr
        : new SortInfo(expr as Expressions<JsConstant>)
    );
    return this;
  }

  /**
   * 分组查询
   * @param groups
   */
  groupBy(...groups: Expressions<JsConstant>[]) {
    this.$groups = groups.map((expr) => ensureExpression(expr));
    return this;
  }

  /**
   * Having 子句
   * @param condition
   */
  having(condition: Conditions<T>) {
    assert(!this.$having, "having is declared");
    assert(this.$groups, "Syntax error, group by is not declared.");
    if (!(condition instanceof Condition)) {
      condition = ensureCondition(condition);
    }
    this.$having = condition as Condition;
    return this;
  }

  /**
   * 偏移数
   * @param rows
   */
  offset(rows: number) {
    this.$offset = rows;
    return this;
  }

  /**
   * 限定数
   * @param rows
   */
  limit(rows: number) {
    // assert(typeof rows === 'number', 'The argument rows must type of Number')
    this.$limit = rows;
    return this;
  }

  /**
   * 合并查询
   */
  union(select: Select<T>, all = false): this {
    let sel: Select<T> = this;
    while (sel.$union) {
      sel = sel.$union.$select;
    }
    // TODO: 需要优化性能
    sel.$union = new Union(select, all);
    return this;
  }

  unionAll(select: Select<T>): this {
    return this.union(select, true);
  }

  /**
   * 将本次查询，转换为Table行集
   * @param alias
   */
  as<TAlias extends string>(alias: TAlias): ProxiedRowset<NamedSelect<T>> {
    return makeProxiedRowset(new NamedSelect(this, alias)) as any;
  }

  /**
   * 将本次查询结果转换为值
   */
  asValue<V extends JsConstant = ValueTypeOf<T>>() {
    return new ValuedSelect<V>(this);
  }

  asColumn<N extends string>(name: N) {
    return this.asValue().as(name);
  }
}

/**
 * 表达式化后的SELECT语句，通常用于 in 语句，或者当作值当行值使用
 */
export class ValuedSelect<T extends JsConstant = JsConstant> extends Expression<
  T
  > {
  $select: Select<any>;
  $type: SQL_SYMBOLE.VALUED_SELECT = SQL_SYMBOLE.VALUED_SELECT;
  constructor(select: Select<any>) {
    super();
    this.$select = select;
  }
}

/**
 * Insert 语句
 */
export class Insert<T extends Model = any> extends CrudStatement {
  $table: Table<T, string>;
  $fields?: Field<JsConstant, FieldsOf<T>>[];
  $values: Expression<JsConstant>[][] | Select<T>;

  readonly $type: SQL_SYMBOLE.INSERT = SQL_SYMBOLE.INSERT;

  /**
   * 构造函数
   */
  constructor(
    table: Tables<T, string>,
    fields?: Field<JsConstant, FieldsOf<T>>[] | FieldsOf<T>[]
  ) {
    super();
    this.$table = ensureRowset(table) as Table<T, string>;
    if (this.$table.$alias) {
      throw new Error("Insert statements do not allow aliases on table.");
    }
    if (fields) {
      if (typeof fields[0] === "string") {
        this.$fields = (fields as FieldsOf<T>[]).map((field) =>
          this.$table.field(field)
        );
      } else {
        this.$fields = fields as Field<JsConstant, FieldsOf<T>>[];
      }
    }
  }

  values(select: Select<T>): this;
  values(row: ValueObject<T>): this;
  values(row: Expressions<JsConstant>[]): this;
  values(rows: Expressions<JsConstant>[][]): this;
  values(rows: ValueObject<T>[]): this;
  values(...rows: Expressions<JsConstant>[][]): this;
  values(...rows: ValueObject<T>[]): this;
  values(...args: any[]): this {
    assert(!this.$values, "values is declared");
    assert(args.length > 0, "rows must more than one elements.");
    let items: ValueObject<T>[], rows: Expressions<JsConstant>[][];
    // 单个参数
    if (args.length === 1) {
      const values = args[0];
      // values(Select)
      if (values instanceof Select) {
        this.$values = args[0];
        return this;
      }
      // values(UnsureExpression[] | ValuesObject[] | UnsureExpression[])
      if (Array.isArray(values)) {
        // values(UnsureExpression[][])
        if (Array.isArray(values[0])) {
          rows = args[0];
        }
        // values(UnsureExpression[])
        else if (
          isJsConstant(values[0]) ||
          values[0] === undefined ||
          values[0] instanceof Expression
        ) {
          rows = [values];
        }
        // values(ValueObject[])
        else if (typeof values[0] === "object") {
          items = values;
        } else {
          throw new Error("invalid arguments！");
        }
      }
      // values(ValueObject)
      else if (typeof values === "object") {
        items = args;
      } else {
        throw new Error("invalid arguments！");
      }
    } else {
      if (Array.isArray(args[0])) {
        // values(...UsureExpression[][])
        rows = args;
      }
      // values(...ValueObject[])
      else if (typeof args[0] === "object") {
        items = args;
      }
      // invalid
      else {
        throw new Error("invalid arguments！");
      }
    }

    if ((rows || items).length > INSERT_MAXIMUM_ROWS) {
      throw new Error("Insert statement values exceed the maximum rows.");
    }

    // values(rows: UnsureExpressions[][])
    if (rows) {
      this.$values = rows.map((row) =>
        row.map((expr) => ensureExpression(expr))
      );
      return this;
    }

    // values(items: ValueObject[])
    // 字段从值中提取
    if (!this.$fields) {
      const existsFields: { [key: string]: true } = {};
      items.forEach((item) =>
        Object.keys(item).forEach((field) => {
          if (!existsFields[field]) existsFields[field] = true;
        })
      );
      this.$fields = (Object.keys(existsFields) as FieldsOf<T>[]).map(
        (fieldName) => {
          return this.$table.field(fieldName);
        }
      );
    }
    const fields = this.$fields.map((field) => pickName(field.$name));

    this.$values = items.map((item: any) => {
      return fields.map((fieldName) => ensureExpression(item[fieldName]));
    });
    return this;
  }
}

// export interface UpdateOptions {
//   table?: UnsureIdentifier
//   sets?: object | Assignment[]
//   joins?: Join[]
//   where?: Conditions
// }

/**
 * Update 语句
 */
export class Update<TModel extends Model = any> extends Fromable {
  $table: Table<TModel, string>;
  $sets: Assignment<JsConstant>[];

  readonly $type: SQL_SYMBOLE.UPDATE = SQL_SYMBOLE.UPDATE;

  constructor(table: Tables<TModel, string>) {
    super();
    this.$table = ensureRowset(table) as Table<TModel, string>;
  }

  /**
   * @param sets
   */
  set(sets: ValueObject<TModel>): this;
  set(...sets: Assignment<JsConstant>[]): this;
  set(...sets: ValueObject<TModel>[] | Assignment<JsConstant>[]): this {
    assert(!this.$sets, "set statement is declared");
    assert(sets.length > 0, "sets must have more than 0 items");
    if (sets.length > 1 || sets[0] instanceof Assignment) {
      this.$sets = sets as Assignment<JsConstant>[];
      return this;
    }

    const obj = sets[0];
    this.$sets = Object.entries(obj).map(
      ([key, value]: [string, Expressions]) =>
        new Assignment(this.$table.field(key as any), ensureExpression(value))
    );
    return this;
  }
}

export class Delete<T extends Model = any> extends Fromable {
  $table: Table<T, string>;
  $type: SQL_SYMBOLE.DELETE = SQL_SYMBOLE.DELETE;

  constructor(table: Tables<T, string>) {
    super();
    this.$table = ensureRowset(table) as Table<T, string>;
    // if (options?.table) this.from(options.table)
    // if (options?.joins) this.$joins = options.joins
    // if (options?.where) this.where(options.where)
  }
}

export class Procedure<
  T extends Model = never,
  N extends string = string
  > extends Identifier<N> {
  $kind: IDENTOFIER_KIND.PROCEDURE = IDENTOFIER_KIND.PROCEDURE;

  execute(...params: Expressions<JsConstant>[]): Execute<T>;
  execute(...params: Parameter<JsConstant, string>[]): Execute<T>;
  execute(params: InputObject): Execute<T>;
  execute(
    ...params:
      | [InputObject]
      | Parameter<JsConstant, string>[]
      | Expressions<JsConstant>[]
  ): Execute<T> {
    return new Execute(this.$name, params as any);
  }
}

// /**
//  * 存储过程调用时使用的命名参数
//  */
// export class NamedArgument<
//   T extends JsConstant,
//   N extends string
//   > extends Identifier<N> {
//   $kind: IDENTOFIER_KIND.NAMED_ARGUMENT = IDENTOFIER_KIND.NAMED_ARGUMENT;
//   $name: N;
//   $value: Expression<T>;
//   constructor(name: N, value: Expressions<T>) {
//     super(name);
//     this.$value = ensureExpression(value);
//   }
// }

/**
 * 存储过程执行
 */
export class Execute<T extends Model = any> extends Statement {
  readonly $proc: Procedure<T, string>;
  readonly $args: Expression<JsConstant>[];
  // | NamedArgument<JsConstant, string>[];
  readonly $type: SQL_SYMBOLE.EXECUTE = SQL_SYMBOLE.EXECUTE;

  // constructor(proc: Name<string> | Procedure<T, string>, params?: InputObject);
  constructor(
    proc: Name<string> | Procedure<T, string>,
    params?: Expressions<JsConstant>[] // | InputObject
  ) {
    super();
    this.$proc = ensureProcedure(proc);
    // if (!Array.isArray(params)) {
    //   this.$args = Object.entries(params).map(
    //     ([name, expr]) => new NamedArgument(name, expr)
    //   );
    // } else
    if (params[0] instanceof Parameter) {
      this.$args = params as Parameter<JsConstant, string>[];
    } else {
      this.$args = (params as Expressions<JsConstant>[]).map((expr) =>
        ensureExpression(expr)
      );
    }
  }
}

/**
 * 赋值语句
 */
export class Assignment<T extends JsConstant = JsConstant> extends Statement {
  left: Assignable<T>;
  right: Expression<T>;
  $type: SQL_SYMBOLE.ASSIGNMENT = SQL_SYMBOLE.ASSIGNMENT;

  constructor(left: Assignable<T>, right: Expressions<T>) {
    super();
    this.left = left;
    this.right = ensureExpression(right);
  }
}

export class VariantDeclare extends AST {
  readonly $type: SQL_SYMBOLE.VARAINT_DECLARE = SQL_SYMBOLE.VARAINT_DECLARE;

  constructor(name: string | Variant, dataType: string) {
    super();
    this.$name = ensureVariant(name);
    this.$dataType = dataType;
  }

  $name: Variant;
  $dataType: string;
}

/**
 * 声明语句，暂时只支持变量声明
 */
export class Declare extends Statement {
  $declares: VariantDeclare[];
  readonly $type: SQL_SYMBOLE.DECLARE = SQL_SYMBOLE.DECLARE;
  constructor(...declares: VariantDeclare[]) {
    super();
    this.$declares = declares;
  }
}

/**
 * 程序与数据库间传递值所使用的参数
 */
export class Parameter<T extends JsConstant = any, N extends string = string>
  extends Expression<T>
  implements Identifier<N> {
  $name: N;
  $builtin: boolean = false;
  $type: SQL_SYMBOLE.IDENTIFIER = SQL_SYMBOLE.IDENTIFIER;
  $kind: IDENTOFIER_KIND.PARAMETER = IDENTOFIER_KIND.PARAMETER;
  get name() {
    return this.$name;
  }
  direction: PARAMETER_DIRECTION;
  type?: ScalarType;
  /**
   * 数据库原始类型，为了保证跨平台性，一般情况下不建议使用
   */
  dbType?: string;
  value: T;

  constructor(
    name: N,
    dbType: ScalarType,
    value: T,
    direction: PARAMETER_DIRECTION = PARAMETER_DIRECTION.INPUT
  ) {
    super();
    this.$name = name;
    this.value = value; // ensureConstant(value)
    this.type = dbType;
    this.direction = direction;
  }

  /**
   * input 参数
   */
  static input<T extends JsConstant, N extends string>(name: N, value: T) {
    return new Parameter(name, null, value, PARAMETER_DIRECTION.INPUT);
  }

  /**
   * output参数
   */
  static output<T extends ScalarType, N extends string>(
    name: N,
    type: T,
    value?: TypeOfScalarType<T>
  ): Parameter<TypeOfScalarType<T>, N> {
    return new Parameter(name, type, value, PARAMETER_DIRECTION.OUTPUT);
  }
}

applyMixins(Parameter, [Identifier]);

/**
 * SQL 文档
 */
export class Document extends AST {
  statements: Statement[];
  $type: SQL_SYMBOLE.DOCUMENT = SQL_SYMBOLE.DOCUMENT;

  constructor(...statements: Statement[]) {
    super();
    this.statements = statements;
  }
}

/**
 * 源始SQL，用于将SQL代码插入语句任何部位
 */
export class Raw extends AST {
  readonly $type: SQL_SYMBOLE.RAW = SQL_SYMBOLE.RAW;

  $sql: string;

  constructor(sql: string) {
    super();
    this.$sql = sql;
  }
}

/**
 * 具名SELECT语句，可用于子查询，With语句等
 */
export class NamedSelect<
  T extends Model = any,
  A extends string = string
  > extends Rowset<T> {
  readonly $type = SQL_SYMBOLE.NAMED_SELECT;
  $inWith: boolean = false
  $select: Select<T>;
  $alias: Alias<A>;

  constructor(statement: Select<T>, alias: A) {
    super();
    this.as(alias);
    this.$select = statement;
  }
}

// /**
//  * 具名SELECT语句，可用于子查询，With语句等
//  */
// export class WithSelect<
//   T extends Model = any,
//   A extends string = string
//   > extends Rowset<T> {
//   readonly $type = SQL_SYMBOLE.WITH_SELECT;
//   $select: Select<T>;
//   $alias: Alias<A>;

//   constructor(statement: Select<T>, alias: A) {
//     super();
//     this.as(alias);
//     this.$select = statement;
//   }
// }

export class With extends AST {
  $type: SQL_SYMBOLE.WITH = SQL_SYMBOLE.WITH;

  $items: NamedSelect<any, string>[];

  /**
   * With结构
   */
  constructor(items: Record<string, Select> | NamedSelect<any, string>[]) {
    super();
    if (Array.isArray(items)) {
      this.$items = items;
    } else {
      this.$items = Object.entries(items).map(
        ([alias, sel]) => new NamedSelect(sel, alias)
      );
    }
    this.$items.forEach(item => {
      item.$inWith = true
    })
  }

  /**
   * select查询
   */
  select: SelectAction = (...args: any[]) => {
    const sql = Statement.select.call(Statement, ...args);
    sql.$with = this;
    return sql;
  };

  /**
   * 插入至表,into的别名
   * @param table
   * @param fields
   */
  insert<T extends Model = any>(
    table: Name<string> | Tables<T, string>,
    fields?: FieldsOf<T>[] | Field<JsConstant, FieldsOf<T>>[]
  ): Insert<T> {
    const sql = Statement.insert(table, fields);
    sql.$with = this;
    return sql;
  }

  /**
   * 更新一个表格
   * @param table
   */
  update<T extends Model = any>(
    table: Name<string> | Tables<T, string>
  ): Update<T> {
    const sql = Statement.update(table);
    sql.$with = this;
    return sql;
  }

  /**
   * 删除一个表格
   * @param table 表格
   */
  delete<T extends Model = any>(
    table: Name<string> | Tables<T, string>
  ): Delete<T> {
    const sql = Statement.delete(table);
    sql.$with = this;
    return sql;
  }
}

/**
 * 类型转换运算符
 */
export class ConvertOperation<
  T extends JsConstant = JsConstant
  > extends Operation<T> {
  $kind: OPERATION_KIND.CONVERT = OPERATION_KIND.CONVERT;
  /**
   * 转换到类型
   */
  $to: ScalarType;
  $expr: Expression<JsConstant>;
  constructor(expr: Expressions<JsConstant>, to: ScalarType) {
    super();
    this.$to = to;
    this.$expr = ensureExpression(expr);
  }
}


/**
 * 标量类型的字面量表达
 */
export type ScalarType =
  | "string"
  | "number"
  | "date"
  | "boolean"
  | "bigint"
  | "binary";

export type TypeOfScalarType<T> = T extends "string"
  ? string
  : T extends "number"
  ? number
  : T extends "date"
  ? Date
  : T extends "boolean"
  ? boolean
  : T extends "bigint"
  ? bigint
  : T extends "binary"
  ? Binary
  : never;

// /**
//  * 标量类型的函数表达
//  */
// export type ScalarObjectType =
//   | typeof Number
//   | typeof String
//   | typeof ArrayBuffer
//   | typeof Boolean
//   | typeof Date
//   | typeof BigInt;

// /**
//  * 类型转换
//  */
// export type TypeOfScalarTypeObject<
//   T extends ScalarObjectType
//   > = T extends typeof Number
//   ? number
//   : T extends typeof String
//   ? string
//   : T extends typeof Boolean
//   ? boolean
//   : T extends typeof Date
//   ? Date
//   : T extends typeof BigInt
//   ? BigInt
//   : T extends typeof ArrayBuffer | SharedArrayBuffer
//   ? Binary
//   : never;
