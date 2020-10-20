/**
 * lodash
 */
import * as _ from "lodash";

import {
  assert,
  ensureExpression,
  ensureCondition,
  makeProxiedTable,
  isJsConstant,
  applyMixins,
  ensureTable,
  ensureField,
  ensureScalarFunction,
  ensureTableFunction,
} from "./util";

import {
  CALCULATE_OPERATOR,
  PARAMETER_DIRECTION,
  SQL_SYMBOLE,
  BINARY_COMPARE_OPERATOR,
  SORT_DIRECTION,
  LOGIC_OPERATOR,
  INSERT_MAXIMUM_ROWS,
  IDENTOFIER_KIND,
  BINARY_CALCULATE_OPERATOR,
  UNARY_CALCULATE_OPERATOR,
  UNARY_COMPARE_OPERATOR,
  FUNCTION_TYPE,
} from "./constants";
import { identifier } from "./builder";

// **********************************类型声明******************************************

/**
 * JS常量类型
 */
export type JsConstant =
  | string
  | Date
  | boolean
  | null
  | number
  | Uint8Array
  | bigint;

/**
 * 不明确类型的键值对象，用于 输入SQL语句的的对象，如WhereObject等
 */
export type InputObject = {
  [K: string]: JsConstant | Expression<JsConstant>;
};

/**
 * 从数据库输出的对象
 */
export type OutputObject = {
  [K: string]: JsConstant;
};

/**
 * 简化后的whereObject查询条件
 */
export type WhereObject<T extends object> = keyof T extends never
  ? InputObject
  : {
      [K in FieldsOf<T>]?: Expressions<T[K]> | Expressions<T[K]>[];
    };

/**
 * 值列表，用于传递Select、Insert、Update 的键值对
 */
export type ValueObject<T extends object> = keyof T extends never
  ? InputObject
  : {
      [K in FieldsOf<T>]?: Expressions<T[K]>;
    };

/**
 * 行结果对象，查询的返回结果类型
 */
export type RowObject<T extends object> = keyof T extends never
  ? OutputObject
  : {
      [K in FieldsOf<T>]: ExpressionType<T[K]>;
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
  : T extends Field<infer TName, infer TValue>
  ? {
      [key in TName]: TValue;
    }
  : T extends Column<infer TName, infer TValue>
  ? {
      [key in TName]: TValue;
    }
  : T extends Star<infer TModel>
  ? {
      [P in FieldsOf<TModel>]: TModel[P];
    }
  : {};

export type SelectColumn =
  | Field<string, JsConstant>
  | Column<string, JsConstant>
  | Star<object>;

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
export type Expressions<T extends JsConstant> = Expression<T> | T;

/**
 * 所有查询条件的兼容类型
 */
export type Conditions<T extends object> = Condition | WhereObject<T>;

/**
 * 所有行集类型的兼容类型
 */
export type Rowsets<T extends object = object> = Rowset<T> | Bracket<Rowset<T>>;

/**
 * 取数据库有效字段，类型为JsConstant的字段列表
 */
export type FieldsOf<T extends object> = Exclude<
  {
    [P in keyof T]: T[P] extends JsConstant ? P : never;
  }[keyof T],
  number | symbol
>;

export type ProxiedTable<TName extends string, TModel extends object> = Table<
  TName,
  TModel
> &
  {
    [P in FieldsOf<TModel>]: Field<P, TModel[P]>;
  };

/**
 * AST 基类
 */
export abstract class AST {
  readonly $type: SQL_SYMBOLE;

  static bracket<T extends AST>(context: T): Bracket<T> {
    return new Bracket(context);
  }
}

export type ModelConstructor<T extends object = object> = new (
  ...args: any
) => T;
export type ModelType<T> = T extends new (...args: any) => infer TModel
  ? TModel
  : never;

/**
 * 表达式基类，抽象类
 */
export abstract class Expression<T extends JsConstant> extends AST {
  /**
   * 字符串连接运算
   */
  concat(expr: Expressions<string>): Expression<string> {
    return Operation.concat(this as Expressions<string>, expr);
  }

  /**
   * 加法运算，返回数值，如果是字符串相加，请使用join函数连接
   */
  add(expr: Expressions<number>): Expression<number> {
    return Operation.add(this as Expressions<number>, expr);
  }

  /**
   * 减法运算
   */
  sub(expr: Expressions<number>): Expression<number> {
    return Operation.sub(this as Expressions<number>, expr);
  }

  /**
   * 乘法运算
   * @param expr 要与当前表达式相乘的表达式
   */
  mul(expr: Expressions<number>): Expression<number> {
    return Operation.mul(this as Expressions<number>, expr);
  }

  /**
   * 除法运算
   * @param expr 要与当前表达式相除的表达式
   * @returns 返回运算后的表达式
   */
  div(expr: Expressions<number>): Expression<number> {
    return Operation.div(this as Expressions<number>, expr);
  }

  /**
   * 算术运算 %
   * @param expr 要与当前表达式相除的表达式
   * @returns 返回运算后的表达式
   */
  mod(expr: Expressions<number>): Expression<number> {
    return Operation.mod(this as Expressions<number>, expr);
  }

  /**
   * 位运算 &
   * @param expr 要与当前表达式相除的表达式
   * @returns 返回运算后的表达式
   */
  and(expr: Expressions<number>): Expression<number> {
    return Operation.and(this as Expressions<number>, expr);
  }

  /**
   * 位运算 |
   * @param expr 要与当前表达式相除的表达式
   * @returns 返回运算后的表达式
   */
  or(expr: Expressions<number>): Expression<number> {
    return Operation.or(this as Expressions<number>, expr);
  }

  /**
   * 位运算 ~
   * @param expr 要与当前表达式相除的表达式
   * @returns 返回运算后的表达式
   */
  not(): Expression<number> {
    return Operation.not(this as Expressions<number>);
  }

  /**
   * 位运算 ^
   * @param expr 要与当前表达式相除的表达式
   * @returns 返回运算后的表达式
   */
  xor(expr: Expressions<number>): Expression<number> {
    return Operation.xor(this as Expressions<number>, expr);
  }

  /**
   * 位运算 <<
   * @param expr 要与当前表达式相除的表达式
   * @returns 返回运算后的表达式
   */
  shl(expr: Expressions<number>): Expression<number> {
    return Operation.shl(this as Expressions<number>, expr);
  }

  /**
   * 位运算 >>
   * @param expr 要与当前表达式相除的表达式
   * @returns 返回运算后的表达式
   */
  shr(expr: Expressions<number>): Expression<number> {
    return Operation.shr(this as Expressions<number>, expr);
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
  in(...values: Expressions<T>[]): Condition {
    return Condition.in(this, values);
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
   * 为当前表达式添加别名
   */
  as<TName extends string>(alias: TName): Column<TName, T> {
    return new Column<TName, T>(alias, this);
  }
}

/**
 * 查询条件
 */
export abstract class Condition extends AST {
  /**
   * and连接
   * @param condition 下一个查询条件
   * @returns 返回新的查询条件
   */
  and(condition: Condition): Condition {
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
      Condition.quoted(condition)
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
      Condition.quoted(condition)
    );
  }

  /**
   * 将多个查询条件通过 AND 合并成一个大查询条件
   * @static
   * @param conditions 查询条件列表
   * @returns 返回逻辑表达式
   */
  static and(...conditions: Condition[]): Condition {
    assert(
      _.isArray(conditions) && conditions.length > 1,
      "Conditions must type of Array & have two or more elements."
    );
    return Condition.quoted(
      conditions.reduce((previous, current) => {
        current = ensureCondition(current);
        if (!previous) return current;
        return new BinaryLogicCondition(LOGIC_OPERATOR.AND, previous, current);
      })
    );
  }

  /**
   * 将多个查询条件通过 OR 合并成一个
   * @static
   * @param conditions 查询条件列表
   * @returns 返回逻辑表达式
   */
  static or(...conditions: Condition[]): Condition {
    assert(
      _.isArray(conditions) && conditions.length > 1,
      "Conditions must type of Array & have two or more elements."
    );
    return Condition.quoted(
      conditions.reduce((previous, current, index) => {
        current = ensureCondition(current);
        if (!previous) return current;
        return new BinaryLogicCondition(LOGIC_OPERATOR.OR, previous, current);
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
  static exists(select: Select<object>): Condition {
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
  static in<T extends JsConstant>(
    left: Expressions<T>,
    values: Expressions<T>[]
  ): Condition {
    return new BinaryCompareCondition(
      BINARY_COMPARE_OPERATOR.IN,
      left,
      values.map((v) => ensureExpression(v))
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
  static quoted(condition: Condition): Condition {
    return new QuotedCondition(condition);
  }
}

/**
 * 二元逻辑查询条件条件
 */
export class BinaryLogicCondition extends Condition {
  $operator: LOGIC_OPERATOR;
  $left: Condition;
  $right: Condition;
  $type: SQL_SYMBOLE.BINARY_LOGIC = SQL_SYMBOLE.BINARY_LOGIC;
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
  $type: SQL_SYMBOLE.UNARY_LOGIC = SQL_SYMBOLE.UNARY_LOGIC;
  $operator: LOGIC_OPERATOR;
  $condition: Condition;

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
  $type: SQL_SYMBOLE.BINARY_COMPARE = SQL_SYMBOLE.BINARY_COMPARE;

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
    if (_.isArray(right)) {
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
  $type: SQL_SYMBOLE.UNARY_COMPARE = SQL_SYMBOLE.UNARY_COMPARE;

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
  $select: Select<object>;
  $type: SQL_SYMBOLE.EXISTS = SQL_SYMBOLE.EXISTS;

  /**
   * EXISTS子句
   * @param expr 查询条件
   */
  constructor(expr: Select<object>) {
    super();
    this.$select = expr;
  }
}

/**
 * 联接查询
 */
export class Join<TName extends string, TModel extends object> extends AST {
  readonly $type: SQL_SYMBOLE.JOIN = SQL_SYMBOLE.JOIN;
  $left: boolean;
  $table: Table<TName, TModel>;
  $on: Condition;

  /**
   * 创建一个表关联
   * @param table
   * @param on 关联条件
   * @param left 是否左联接
   */
  constructor(
    table: Table<TName, TModel>,
    on: Condition,
    left: boolean = false
  ) {
    super();

    this.$table = table;
    this.$on = on;
    this.$left = left;
  }
}

/**
 * 标识符，可以多级，如表名等
 */
export abstract class Identifier<TName extends string = string> extends AST {
  constructor(name: Name<TName>) {
    super();
    this.$name = name;
  }
  readonly $type: SQL_SYMBOLE.IDENTIFIER = SQL_SYMBOLE.IDENTIFIER;
  /**
   * 标签符名称
   */
  $name: Name<TName>;

  /**
   * 标识符类别
   */
  readonly $kind: IDENTOFIER_KIND;
}

export abstract class Func<TName extends string> extends Identifier<TName> {
  $kind: IDENTOFIER_KIND.FUNCTION = IDENTOFIER_KIND.FUNCTION;
  $ftype: FUNCTION_TYPE;
}

export class ScalarFunction<
  TName extends string,
  TReturn extends JsConstant
> extends Func<TName> {
  $ftype: FUNCTION_TYPE.SCALAR = FUNCTION_TYPE.SCALAR;

  /**
   * 执行一个函数
   * @param args
   */
  $invoke(...args: Expressions<JsConstant>[]): Expression<TReturn> {
    return new ScalarFuncInvoke(this, args);
  }
}

export class TableFunction<
  TName extends string,
  TResult extends object
> extends Identifier<TName> {
  /**
   * 执行一个函数
   * @param args
   */
  $invoke(...args: Expressions<JsConstant>[]): Rowset<TResult> {
    return new TableFuncInvoke(this, args);
  }
}

export type Name<TName> =
  | TName
  | [TName]
  | [string, TName]
  | [string, string, TName]
  | [string, string, string, TName]
  | [string, string, string, string, TName];

export abstract class Assignable<T extends JsConstant> extends Expression<T> {
  leftValue: true = true;
  /**
   * 赋值操作
   * @param left 左值
   * @param right 右值
   */
  assign<TValue extends JsConstant>(
    value: Expressions<TValue>
  ): Assignment<T, TValue> {
    return new Assignment(this, value);
  }
}

export class Field<TName extends string, T extends JsConstant>
  extends Assignable<T>
  implements Identifier<TName> {
  constructor(name: Name<TName>) {
    super();
    this.$name = name;
  }

  readonly $name: Name<TName>;
  readonly $type: SQL_SYMBOLE.IDENTIFIER = SQL_SYMBOLE.IDENTIFIER;
  readonly $kind: IDENTOFIER_KIND.FIELD = IDENTOFIER_KIND.FIELD;
}

applyMixins(Field, [Assignable]);

/**
 * SQL *，查询所有字段时使用
 */
export class Star<TModel extends object = any> extends AST {
  readonly $type: SQL_SYMBOLE.STAR = SQL_SYMBOLE.STAR;

  constructor(parent?: Rowset<TModel>) {
    super();
    this.parent = parent;
  }

  parent?: Rowset<TModel>;
}

/**
 * 数据库行集，混入类型
 */
export abstract class Rowset<TModel extends object> extends AST {
  $alias?: string;
  /**
   * 为当前表添加别名
   */
  $as(alias: string): Rowset<any> {
    this.$alias = alias;
    return this;
  }

  /**
   * 访问下一节点
   * @param name 节点名称
   */
  $field<TProperty extends FieldsOf<TModel>>(
    name: TProperty
  ): Field<TProperty, any> {
    // @ts-ignore
    return new Field<TProperty, TModel[TProperty]>([...this.$name, name]);
  }

  /**
   * 获取所有字段
   */
  $star(): Star<any> {
    return new Star(this);
  }
}

export type Tables<TName extends string, TModel extends object> =
  | TName
  | Table<TName, TModel>;

export class Table<TName extends string, TModel extends object>
  extends Identifier<TName>
  implements Rowset<TModel> {
  constructor(name: Name<TName>) {
    super(name);
  }

  $kind: IDENTOFIER_KIND.TABLE = IDENTOFIER_KIND.TABLE;

  $alias: string;
  $as: (alias: string) => Rowset<TModel>;

  /**
   * 访问下一节点
   * @param name 节点名称
   */
  $field: <TProperty extends FieldsOf<TModel>>(
    name: TProperty
  ) => Field<TProperty, TModel[TProperty]>;

  /**
   * 获取所有字段
   */
  $star: () => Star<TModel>;
}

applyMixins(Table, [Rowset]);

/**
 * 标量变量，暂不支持表变量
 */
export class Variant<TName extends string, T extends JsConstant>
  extends Expression<T>
  implements Identifier<TName> {
  $type: SQL_SYMBOLE.IDENTIFIER = SQL_SYMBOLE.IDENTIFIER;
  $kind: IDENTOFIER_KIND.VARIANT;
  constructor(name: TName) {
    super();
    this.$name = name;
  }
  $name: TName;
}

applyMixins(Variant, [Identifier]);

// TODO 表变量支持

// export class TableVariant<TName extends string, T extends object> extends Rowset<T> {
//   $name: string

//   $schema: {

//   }

//   constructor(name: TName) {
//     super(SQL_SYMBOLE.TABLE_VARIANT)
//   }
// }

/**
 * 列表达式
 */
export class Column<
  TName extends string,
  T extends JsConstant
> extends Identifier<TName> {
  /**
   * 列名称
   */
  $name: TName;

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
  constructor(name: TName, expr: Expression<T>) {
    super(name);
    // assertType(expr, [DbObject, Field, Constant, Select], 'alias must type of DbObject|Field|Constant|Bracket<Select>')
    this.$expr = expr;
  }
}

/**
 * 函数调用表达式
 */
export class ScalarFuncInvoke<TReturn extends JsConstant> extends Expression<
  TReturn
> {
  $func: ScalarFunction<string, TReturn>;
  $args: Expression<JsConstant>[];
  readonly $type: SQL_SYMBOLE.SCALAR_FUNCTION_INVOKE =
    SQL_SYMBOLE.SCALAR_FUNCTION_INVOKE;
  constructor(
    func: string | ScalarFunction<string, TReturn>,
    args: Expressions<JsConstant>[]
  ) {
    super();
    this.$func = ensureScalarFunction(func);
    this.$args = args.map((expr) => ensureExpression(expr));
  }
}

export class TableFuncInvoke<TReturn extends object> extends Rowset<TReturn> {
  readonly $func: TableFunction<string, TReturn>;
  readonly $args: Expression<JsConstant>[];
  readonly $type: SQL_SYMBOLE.TABLE_FUNCTION_INVOKE =
    SQL_SYMBOLE.TABLE_FUNCTION_INVOKE;
  $alias?: string;

  constructor(
    func: string | TableFunction<string, TReturn>,
    args: Expressions<JsConstant>[]
  ) {
    super();
    this.$func = ensureTableFunction(func);
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
  static insert<TName extends string, T extends object>(
    table: Tables<TName, T>,
    fields?: FieldsOf<T>[] | Field<FieldsOf<T>, JsConstant>[]
  ): Insert<TName, T> {
    return new Insert(table, fields);
  }

  /**
   * 更新一个表格
   * @param table
   */
  static update<TName extends string, T extends object>(
    table: Tables<TName, T>
  ) {
    return new Update(table).from(table);
  }

  /**
   * 删除一个表格
   * @param table 表格
   */
  static delete<TName extends string, T extends object>(
    table: Tables<TName, T>
  ) {
    return new Delete(table);
  }

  /**
   * 选择列
   */
  static select<T extends object>(
    results: ValueObject<T>
  ): Select<RowObject<T>>;
  static select<A extends SelectColumn>(a: A): Select<ResultObjectByColumns<A>>;
  static select<A extends SelectColumn, B extends SelectColumn>(
    a: A,
    b: B
  ): Select<ResultObjectByColumns<A, B>>;
  static select<
    A extends SelectColumn,
    B extends SelectColumn,
    C extends SelectColumn
  >(a: A, b?: B, d?: C): Select<ResultObjectByColumns<A, B, C>>;
  static select<
    A extends SelectColumn,
    B extends SelectColumn,
    C extends SelectColumn,
    D extends SelectColumn
  >(a: A, b: B, c: C, d: D): Select<ResultObjectByColumns<A, B, C, D>>;
  static select<
    A extends SelectColumn,
    B extends SelectColumn,
    C extends SelectColumn,
    D extends SelectColumn,
    E extends SelectColumn
  >(a: A, b: B, c: C, d: D, e: E): Select<ResultObjectByColumns<A, B, C, D, E>>;
  static select<
    A extends SelectColumn,
    B extends SelectColumn,
    C extends SelectColumn,
    D extends SelectColumn,
    E extends SelectColumn,
    F extends SelectColumn
  >(
    a: A,
    b: B,
    c: C,
    d: D,
    e: E,
    f: F
  ): Select<ResultObjectByColumns<A, B, C, D, E, F>>;
  static select<
    A extends SelectColumn,
    B extends SelectColumn,
    C extends SelectColumn,
    D extends SelectColumn,
    E extends SelectColumn,
    F extends SelectColumn,
    G extends SelectColumn
  >(
    a: A,
    b: B,
    c: C,
    d: D,
    e: E,
    f: F,
    g: G
  ): Select<ResultObjectByColumns<A, B, C, D, E, F, G>>;
  static select<
    A extends SelectColumn,
    B extends SelectColumn,
    C extends SelectColumn,
    D extends SelectColumn,
    E extends SelectColumn,
    F extends SelectColumn,
    G extends SelectColumn,
    H extends SelectColumn
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
  static select<
    A extends SelectColumn,
    B extends SelectColumn,
    C extends SelectColumn,
    D extends SelectColumn,
    E extends SelectColumn,
    F extends SelectColumn,
    G extends SelectColumn,
    H extends SelectColumn,
    I extends SelectColumn
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
  static select<
    A extends SelectColumn,
    B extends SelectColumn,
    C extends SelectColumn,
    D extends SelectColumn,
    E extends SelectColumn,
    F extends SelectColumn,
    G extends SelectColumn,
    H extends SelectColumn,
    I extends SelectColumn,
    J extends SelectColumn
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
  static select<
    A extends SelectColumn,
    B extends SelectColumn,
    C extends SelectColumn,
    D extends SelectColumn,
    E extends SelectColumn,
    F extends SelectColumn,
    G extends SelectColumn,
    H extends SelectColumn,
    I extends SelectColumn,
    J extends SelectColumn,
    K extends SelectColumn
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
  static select<
    A extends SelectColumn,
    B extends SelectColumn,
    C extends SelectColumn,
    D extends SelectColumn,
    E extends SelectColumn,
    F extends SelectColumn,
    G extends SelectColumn,
    H extends SelectColumn,
    I extends SelectColumn,
    J extends SelectColumn,
    K extends SelectColumn,
    L extends SelectColumn
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
  static select<
    A extends SelectColumn,
    B extends SelectColumn,
    C extends SelectColumn,
    D extends SelectColumn,
    E extends SelectColumn,
    F extends SelectColumn,
    G extends SelectColumn,
    H extends SelectColumn,
    I extends SelectColumn,
    J extends SelectColumn,
    K extends SelectColumn,
    L extends SelectColumn,
    M extends SelectColumn
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
  static select<
    A extends SelectColumn,
    B extends SelectColumn,
    C extends SelectColumn,
    D extends SelectColumn,
    E extends SelectColumn,
    F extends SelectColumn,
    G extends SelectColumn,
    H extends SelectColumn,
    I extends SelectColumn,
    J extends SelectColumn,
    K extends SelectColumn,
    L extends SelectColumn,
    M extends SelectColumn,
    N extends SelectColumn
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
  static select<
    A extends SelectColumn,
    B extends SelectColumn,
    C extends SelectColumn,
    D extends SelectColumn,
    E extends SelectColumn,
    F extends SelectColumn,
    G extends SelectColumn,
    H extends SelectColumn,
    I extends SelectColumn,
    J extends SelectColumn,
    K extends SelectColumn,
    L extends SelectColumn,
    M extends SelectColumn,
    N extends SelectColumn,
    O extends SelectColumn
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
  ): Select<ResultObjectByColumns<A, B, C, D, E, F, G, H, I, J, K, L, M, N, O>>;
  static select<
    A extends SelectColumn,
    B extends SelectColumn,
    C extends SelectColumn,
    D extends SelectColumn,
    E extends SelectColumn,
    F extends SelectColumn,
    G extends SelectColumn,
    H extends SelectColumn,
    I extends SelectColumn,
    J extends SelectColumn,
    K extends SelectColumn,
    L extends SelectColumn,
    M extends SelectColumn,
    N extends SelectColumn,
    O extends SelectColumn,
    P extends SelectColumn
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
  static select<
    A extends SelectColumn,
    B extends SelectColumn,
    C extends SelectColumn,
    D extends SelectColumn,
    E extends SelectColumn,
    F extends SelectColumn,
    G extends SelectColumn,
    H extends SelectColumn,
    I extends SelectColumn,
    J extends SelectColumn,
    K extends SelectColumn,
    L extends SelectColumn,
    M extends SelectColumn,
    N extends SelectColumn,
    O extends SelectColumn,
    P extends SelectColumn,
    Q extends SelectColumn
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
  static select<
    A extends SelectColumn,
    B extends SelectColumn,
    C extends SelectColumn,
    D extends SelectColumn,
    E extends SelectColumn,
    F extends SelectColumn,
    G extends SelectColumn,
    H extends SelectColumn,
    I extends SelectColumn,
    J extends SelectColumn,
    K extends SelectColumn,
    L extends SelectColumn,
    M extends SelectColumn,
    N extends SelectColumn,
    O extends SelectColumn,
    P extends SelectColumn,
    Q extends SelectColumn,
    R extends SelectColumn
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
  static select<
    A extends SelectColumn,
    B extends SelectColumn,
    C extends SelectColumn,
    D extends SelectColumn,
    E extends SelectColumn,
    F extends SelectColumn,
    G extends SelectColumn,
    H extends SelectColumn,
    I extends SelectColumn,
    J extends SelectColumn,
    K extends SelectColumn,
    L extends SelectColumn,
    M extends SelectColumn,
    N extends SelectColumn,
    O extends SelectColumn,
    P extends SelectColumn,
    Q extends SelectColumn,
    R extends SelectColumn,
    S extends SelectColumn
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
  static select<
    A extends SelectColumn,
    B extends SelectColumn,
    C extends SelectColumn,
    D extends SelectColumn,
    E extends SelectColumn,
    F extends SelectColumn,
    G extends SelectColumn,
    H extends SelectColumn,
    I extends SelectColumn,
    J extends SelectColumn,
    K extends SelectColumn,
    L extends SelectColumn,
    M extends SelectColumn,
    N extends SelectColumn,
    O extends SelectColumn,
    P extends SelectColumn,
    Q extends SelectColumn,
    R extends SelectColumn,
    S extends SelectColumn,
    T extends SelectColumn
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
  static select<
    A extends SelectColumn,
    B extends SelectColumn,
    C extends SelectColumn,
    D extends SelectColumn,
    E extends SelectColumn,
    F extends SelectColumn,
    G extends SelectColumn,
    H extends SelectColumn,
    I extends SelectColumn,
    J extends SelectColumn,
    K extends SelectColumn,
    L extends SelectColumn,
    M extends SelectColumn,
    N extends SelectColumn,
    O extends SelectColumn,
    P extends SelectColumn,
    Q extends SelectColumn,
    R extends SelectColumn,
    S extends SelectColumn,
    T extends SelectColumn,
    U extends SelectColumn
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
  static select<
    A extends SelectColumn,
    B extends SelectColumn,
    C extends SelectColumn,
    D extends SelectColumn,
    E extends SelectColumn,
    F extends SelectColumn,
    G extends SelectColumn,
    H extends SelectColumn,
    I extends SelectColumn,
    J extends SelectColumn,
    K extends SelectColumn,
    L extends SelectColumn,
    M extends SelectColumn,
    N extends SelectColumn,
    O extends SelectColumn,
    P extends SelectColumn,
    Q extends SelectColumn,
    R extends SelectColumn,
    S extends SelectColumn,
    T extends SelectColumn,
    U extends SelectColumn,
    V extends SelectColumn
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
  static select<
    A extends SelectColumn,
    B extends SelectColumn,
    C extends SelectColumn,
    D extends SelectColumn,
    E extends SelectColumn,
    F extends SelectColumn,
    G extends SelectColumn,
    H extends SelectColumn,
    I extends SelectColumn,
    J extends SelectColumn,
    K extends SelectColumn,
    L extends SelectColumn,
    M extends SelectColumn,
    N extends SelectColumn,
    O extends SelectColumn,
    P extends SelectColumn,
    Q extends SelectColumn,
    R extends SelectColumn,
    S extends SelectColumn,
    T extends SelectColumn,
    U extends SelectColumn,
    V extends SelectColumn,
    W extends SelectColumn
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
  static select<
    A extends SelectColumn,
    B extends SelectColumn,
    C extends SelectColumn,
    D extends SelectColumn,
    E extends SelectColumn,
    F extends SelectColumn,
    G extends SelectColumn,
    H extends SelectColumn,
    I extends SelectColumn,
    J extends SelectColumn,
    K extends SelectColumn,
    L extends SelectColumn,
    M extends SelectColumn,
    N extends SelectColumn,
    O extends SelectColumn,
    P extends SelectColumn,
    Q extends SelectColumn,
    R extends SelectColumn,
    S extends SelectColumn,
    T extends SelectColumn,
    U extends SelectColumn,
    V extends SelectColumn,
    W extends SelectColumn,
    X extends SelectColumn
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
  static select<
    A extends SelectColumn,
    B extends SelectColumn,
    C extends SelectColumn,
    D extends SelectColumn,
    E extends SelectColumn,
    F extends SelectColumn,
    G extends SelectColumn,
    H extends SelectColumn,
    I extends SelectColumn,
    J extends SelectColumn,
    K extends SelectColumn,
    L extends SelectColumn,
    M extends SelectColumn,
    N extends SelectColumn,
    O extends SelectColumn,
    P extends SelectColumn,
    Q extends SelectColumn,
    R extends SelectColumn,
    S extends SelectColumn,
    T extends SelectColumn,
    U extends SelectColumn,
    V extends SelectColumn,
    W extends SelectColumn,
    X extends SelectColumn,
    Y extends SelectColumn
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
  static select<
    A extends SelectColumn,
    B extends SelectColumn,
    C extends SelectColumn,
    D extends SelectColumn,
    E extends SelectColumn,
    F extends SelectColumn,
    G extends SelectColumn,
    H extends SelectColumn,
    I extends SelectColumn,
    J extends SelectColumn,
    K extends SelectColumn,
    L extends SelectColumn,
    M extends SelectColumn,
    N extends SelectColumn,
    O extends SelectColumn,
    P extends SelectColumn,
    Q extends SelectColumn,
    R extends SelectColumn,
    S extends SelectColumn,
    T extends SelectColumn,
    U extends SelectColumn,
    V extends SelectColumn,
    W extends SelectColumn,
    X extends SelectColumn,
    Y extends SelectColumn,
    Z extends SelectColumn
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
  static select(...args: any[]) {
    return new Select(...args);
  }

  /**
   * 执行一个存储过程
   * @param proc
   * @param params
   */
  static execute(proc: Identifiers<void>, params?: Expressions[]): Execute;
  static execute(proc: Identifiers<void>, params?: Parameter[]): Execute;
  static execute(
    proc: Identifiers<void>,
    params?: Expressions[] | Parameter[]
  ): Execute {
    return new Execute(proc, params);
  }

  /**
   * 执行一个存储过程，execute的别名
   * @param proc 存储过程
   * @param params 参数
   */
  static exec(proc: Identifiers, params?: Expressions[]): Execute;
  static exec(proc: Identifiers, params?: Parameter[]): Execute;
  static exec(
    proc: Identifiers,
    params?: Expressions[] | Parameter[]
  ): Execute {
    return new Execute(proc, params);
  }

  /**
   * 赋值语句
   * @param left 左值
   * @param right 右值
   */
  static assign(left: Expression, right: Expressions) {
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
  static when(expr: Expressions, value?: Expressions) {
    return new When(expr, value);
  }

  static case(expr?: Expressions) {
    return new Case(expr);
  }

  static with(withs: WithItems) {
    return new With(withs);
  }
}

// TODO: 测试完成后删除注释
// type f = Field<string, JsConstant>
// type j = Field<'abc', string>

// type c = j extends f ? true : false

const colA = new Star(
  new Table<"abc", { a: number; b: string }>("abc") as Rowset<{ a: 1; b: 2 }>
);
const colB = new Star(
  new Table<"def", { c: number; d: string }>("def") as Rowset<{ x: 1; y: 2 }>
);
const colC = new Field<"sssss", string>("sssss");

const d = Statement.select(colA, colB, colC);

type X<T> = T extends Select<infer G> ? G : never;

type fdsds = X<typeof d>;

// d.as('abc').$field('a')

// type ff = <A extends SelectColumn, B extends SelectColumn, C extends SelectColumn>(a: A, b?: B, c?: C) => ResultObjectByColumns<A, B>
// const kd: ff = null

// const fffd = kd(colA, colB)

// type s = typeof fffd

// type d = FieldsOf<({ a: 1, b: 2} & { c: 'd' })>

// type x = ResultObjectByColumns<typeof colA, {}>

// type y = ResultObjectByColumns<Star<{ a: 1, b: 2 }>, Field<'abc', string>, typeof colB>

/**
 * When语句
 */
export class When<T> extends AST {
  expr: Expression | Condition;
  value: Expression<T>;

  constructor(expr: Expressions | Conditions, then: Expressions) {
    super(SQL_SYMBOLE.WHEN);
    if (expr instanceof Expression || expr instanceof Condition) {
      this.expr = expr;
    }
    if (isJsConstant(expr)) {
      this.expr = ensureExpression(expr as JsConstant);
    } else {
      this.expr = ensureCondition(expr as WhereObject);
    }
    this.value = ensureExpression(then);
  }
}

/**
 * CASE表达式
 */
export class Case<T = any> extends Expression<T> {
  get lvalue() {
    return false;
  }

  expr: Expression<any> | Condition;
  whens: When<any>[];
  defaults?: Expression<T>;

  /**
   *
   * @param expr
   */
  constructor(expr?: Expressions) {
    super(SQL_SYMBOLE.CASE);
    if (expr !== undefined) {
      this.expr = ensureExpression(expr);
    }
    /**
     * @type {When[]}
     */
    this.whens = [];
  }

  /**
   * ELSE语句
   * @param defaults
   */
  else<T>(defaults: Expressions<T>): Case<T> {
    const self: Case<T> = this as any;
    self.defaults = ensureExpression(defaults as Expressions<any>);
    return self;
  }

  /**
   * WHEN语句
   * @param expr
   * @param then
   */
  when<T>(expr: Expressions | Conditions, then: Expressions<T>): Case<T> {
    this.whens.push(new When(expr, then));
    return this as any;
  }
}

/**
 * 常量表达式
 */
export class Constant<T extends JsConstant> extends Expression<T> {
  $type: SQL_SYMBOLE.CONSTANT = SQL_SYMBOLE.CONSTANT;

  /**
   * 实际值
   */
  $value: T;

  constructor(value: T) {
    super();
    this.$value = value;
  }
}

// /**
//  * 值列表（不含括号）
//  */
// export class List extends AST {
//   $items: Expression<any>[]

//   constructor(symbol: SQL_SYMBOLE, ...values: Expressions[]) {
//     super(symbol)
//     this.$items = values.map(value => ensureConstant(value))
//   }

//   static values(...values: Expressions[]): List {
//     return new List(SQL_SYMBOLE.VALUE_LIST, ...values)
//   }

//   static columns(...exprs: Expressions[]): List {
//     return new List(SQL_SYMBOLE.COLUMN_LIST, ...exprs)
//   }

//   static invokeArgs(...exprs: Expressions[]): List {
//     return new List(SQL_SYMBOLE.INVOKE_ARGUMENT_LIST, ...exprs)
//   }

//   static execArgs(...exprs: Expressions[]): List {
//     return new List(SQL_SYMBOLE.EXECUTE_ARGUMENT_LIST, ...exprs)
//   }
// }

/**
 * 括号引用
 */
export class Bracket<
  T extends AST,
  TValue = ExpressionType<T>
> extends Expression<TValue> {
  get lvalue() {
    return false;
  }

  /**
   * 表达式
   */
  context: T;

  constructor(context: T) {
    super(SQL_SYMBOLE.BRACKET_EXPRESSION);
    this.context = context;
  }
}

// export class BracketExpression extends Bracket<Expressions | List | Select> implements IExpression {

//   /**
//    * 加法运算
//    */
//   add: (expr: UnsureExpressions) => Expression

//   /**
//    * 减法运算
//    */
//   sub: (expr: UnsureExpressions) => Expression

//   /**
//    * 乘法运算
//    * @param expr 要与当前表达式相乘的表达式
//    */
//   mul: (expr: UnsureExpressions) => Expression

//   /**
//    * 除法运算
//    * @param expr 要与当前表达式相除的表达式
//    * @returns 返回运算后的表达式
//    */
//   div: (expr: UnsureExpressions) => Expression

//   /**
//    * 算术运算 %
//    * @param expr 要与当前表达式相除的表达式
//    * @returns 返回运算后的表达式
//    */
//   mod: (expr: UnsureExpressions) => Expression

//   and: (expr: UnsureExpressions) => Expression

//   or: (expr: UnsureExpressions) => Expression

//   not: (expr: UnsureExpressions) => Expression
//   /**
//    * 位运算 ^
//    * @param expr 要与当前表达式相除的表达式
//    * @returns 返回运算后的表达式
//    */
//   xor: (expr: UnsureExpressions) => Expression

//   /**
//    * 位运算 <<
//    * @param expr 要与当前表达式相除的表达式
//    * @returns 返回运算后的表达式
//    */
//   shl: (expr: UnsureExpressions) => Expression

//   /**
//    * 位运算 >>
//    * @param expr 要与当前表达式相除的表达式
//    * @returns 返回运算后的表达式
//    */
//   shr: (expr: UnsureExpressions) => Expression

//   /**
//    * 比较是否相等 =
//    * @param expr 要与当前表达式相比较的表达式
//    * @returns 返回对比条件表达式
//    */
//   eq: (expr: UnsureExpressions) => Condition

//   /**
//    * 比较是否不等于 <>
//    * @param expr 要与当前表达式相比较的表达式
//    * @returns 返回对比条件表达式
//    */
//   neq: (expr: UnsureExpressions) => Condition

//   /**
//    * 比较是否小于 <
//    * @param expr 要与当前表达式相比较的表达式
//    * @returns 返回对比条件表达式
//    */
//   lt: (expr: UnsureExpressions) => Condition

//   /**
//    * 比较是否小于等于 <=
//    * @param expr 要与当前表达式相比较的表达式
//    * @returns 返回对比条件表达式
//    */
//   lte: (expr: UnsureExpressions) => Condition

//   /**
//    * 比较是否大于 >
//    * @param expr 要与当前表达式相比较的表达式
//    * @returns 返回对比条件表达式
//    */
//   gt: (expr: UnsureExpressions) => Condition

//   /**
//    * 比较是否小于等于 >=
//    * @param expr 要与当前表达式相比较的表达式
//    * @returns 返回对比条件表达式
//    */
//   gte: (expr: UnsureExpressions) => Condition

//   /**
//    * 比较是相像 LIKE
//    * @param expr 要与当前表达式相比较的表达式
//    * @returns 返回对比条件表达式
//    */
//   like: (expr: UnsureExpressions) => Condition

//   /**
//    * 比较是否不想像 NOT LIKE
//    * @param expr 要与当前表达式相比较的表达式
//    * @returns 返回对比条件表达式
//    */
//   notLike: (expr: UnsureExpressions) => Condition

//   /**
//    * 比较是否不包含于 IN
//    * @param values 要与当前表达式相比较的表达式数组
//    * @returns 返回对比条件表达式
//    */
//   in: (...values: UnsureExpressions[]) => Condition

//   /**
//    * 比较是否不包含于 NOT IN
//    * @param values 要与当前表达式相比较的表达式
//    * @returns 返回对比条件表达式
//    */
//   notIn: (...values: UnsureExpressions[]) => Condition

//   /**
//    * 比较是否为空 IS NULL
//    * @returns 返回对比条件表达式
//    */
//   isNull: () => Condition

//   /**
//    * 比较是否为空 IS NOT NULL
//    * @returns 返回对比条件表达式
//    */
//   isNotNull: () => Condition

//   /**
//    * isNotNull 的简称别名
//    * @returns 返回对比条件表达式
//    */
//   notNull: () => Condition

//   /**
//    * 正序
//    * @returns 返回对比条件表达式
//    */
//   asc: () => SortInfo

//   /**
//    * 倒序
//    * @returns 返回对比条件表达式
//    */
//   desc: () => SortInfo

//   /**
//    * 为当前表达式添加别名
//    */
//   as: (alias: string) => Alias

// }

export class QuotedCondition extends Condition {
  context: Condition;

  readonly $type: SQL_SYMBOLE.QUOTED_CONDITION = SQL_SYMBOLE.QUOTED_CONDITION;

  constructor(conditions: Conditions<any>) {
    super();
    this.context = ensureCondition(conditions);
  }

  /**
   * and连接
   * @param condition 下一个查询条件
   * @returns 返回新的查询条件
   */
  and: (condition: Conditions<any>) => Condition;

  /**
   * and连接，并在被连接的条件中加上括号 ()
   * @param condition 下一个查询条件
   * @returns 返回新的查询条件
   */
  andGroup: (condition: Conditions<any>) => Condition;

  /**
   * OR语句
   * @param condition
   * @returns 返回新的查询条件
   */
  or: (condition: Conditions<any>) => Condition;

  /**
   * or 连接，并在被连接的条件中加上括号 ()
   * @param condition
   * @returns 返回新的查询条件
   */
  orGroup: (condition: Conditions<any>) => Condition;

  /**
   * 返回括号表达式
   */
  quoted: () => Bracket<Condition>;
}

/**
 * 运算表达式基类
 */
export abstract class Operation<T extends JsConstant> extends Expression<T> {
  $operator: CALCULATE_OPERATOR;

  /**
   * 算术运算 +
   * @param left 左值
   * @param right 右值
   * @returns 返回算术运算表达式
   */
  static neg(expr: Expressions<number>): Expression<number> {
    return new UnaryOperation(UNARY_CALCULATE_OPERATOR.NEG, expr);
  }

  /**
   * 字符串连接运算
   */
  static concat(
    left: Expressions<string>,
    right: Expressions<string>
  ): Expression<string> {
    return new BinaryOperation(BINARY_CALCULATE_OPERATOR.CONCAT, left, right);
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
    return new BinaryOperation(BINARY_CALCULATE_OPERATOR.ADD, left, right);
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
    return new BinaryOperation(BINARY_CALCULATE_OPERATOR.SUB, left, right);
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
    return new BinaryOperation(BINARY_CALCULATE_OPERATOR.MUL, left, right);
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
    return new BinaryOperation(BINARY_CALCULATE_OPERATOR.DIV, left, right);
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
    return new BinaryOperation(BINARY_CALCULATE_OPERATOR.MOD, left, right);
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
    return new BinaryOperation(BINARY_CALCULATE_OPERATOR.AND, left, right);
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
    return new BinaryOperation(BINARY_CALCULATE_OPERATOR.OR, left, right);
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
    return new BinaryOperation(BINARY_CALCULATE_OPERATOR.XOR, left, right);
  }

  /**
   * 位算术运算 ~
   * @param value 左值
   * @param right 右值
   * @returns 返回算术运算表达式
   */
  static not(value: Expressions<number>): Expression<number> {
    return new UnaryOperation(UNARY_CALCULATE_OPERATOR.NOT, value);
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
    return new BinaryOperation(BINARY_CALCULATE_OPERATOR.SHL, left, right);
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
    return new BinaryOperation(BINARY_CALCULATE_OPERATOR.SHR, left, right);
  }
}

/**
 * 二元运算表达式
 */
export class BinaryOperation<T extends JsConstant> extends Operation<T> {
  $type: SQL_SYMBOLE.BINARY_CALCULATE = SQL_SYMBOLE.BINARY_CALCULATE;
  $left: Expression<T>;
  $right: Expression<T>;
  $operator: BINARY_CALCULATE_OPERATOR;

  /**
   * 名称
   * @param operator 运算符
   * @param left 左值
   * @param right 右值
   */
  constructor(
    operator: BINARY_CALCULATE_OPERATOR,
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
 * - 运算符
 */
export class UnaryOperation extends Expression<number> implements IUnary {
  readonly $operator: CALCULATE_OPERATOR.NEG;
  readonly $next: Expression<any>;
  readonly $type: SQL_SYMBOLE;

  get lvalue() {
    return false;
  }
  /**
   * 一元运算目前只支持负数运算符
   * @param expr
   */
  constructor(operator: CALCULATE_OPERATOR.NEG, expr: Expressions) {
    super(SQL_SYMBOLE.UNARY_CALCULATE);
    this.$operator = operator;
    this.$next = ensureExpression(expr);
  }
}

/**
 * 联接查询
 */
export class Union extends AST {
  select: SelectExpression;
  all: boolean;
  /**
   *
   * @param select SELECT语句
   * @param all 是否所有查询
   */
  constructor(select: SelectExpression, all: boolean = false) {
    super(SQL_SYMBOLE.UNION);
    this.select = select;
    this.all = all;
  }
}

// export interface SelectOptions {
//   from?: UnsureIdentifier[],
//   top?: number,
//   offset?: number,
//   limit?: number,
//   distinct?: boolean,
//   columns?: UnsureExpressions[],
//   joins?: Join[],
//   where?: Conditions,
//   orderBy?: (SortInfo | UnsureExpressions)[],
//   groupBy?: UnsureExpressions[]
// }

export type SortObject<T = any> = {
  [K in keyof Filter<T, JsConstant>]?: SORT_DIRECTION;
};

abstract class Fromable extends Statement {
  $froms?: Table<string, any>[];
  $joins?: Join<string, any>[];
  $where?: Condition;

  /**
   * with语句
   */
  $with: With;

  /**
   * 从表中查询，可以查询多表
   * @param tables
   */
  from(...tables: (Name<string> | Table<string, any>)[]): this {
    this.$froms = tables.map((table) => {
      if (typeof table === "string" || Array.isArray(table)) {
        return new Table(table);
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
  join<T extends object>(
    table: Identifier<T> | string,
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
  leftJoin<T extends object>(
    table: Identifier<T> | string,
    on: Condition
  ): this {
    return this.join(table, on, true);
  }

  /**
   * where查询条件
   * @param condition
   */
  where(condition: Conditions) {
    assert(!this.$where, "where is declared");
    if (_.isPlainObject(condition)) {
      condition = ensureCondition(condition);
    }
    // assert(condition instanceof Condition, 'Then argument condition must type of Condition')
    this.$where = condition as Condition;
    return this;
  }
}

export class SortInfo extends AST {
  expr: Expression;
  direction?: SORT_DIRECTION;
  constructor(expr: Expressions, direction?: SORT_DIRECTION) {
    super(SQL_SYMBOLE.SORT);
    this.expr = ensureExpression(expr);
    this.direction = direction;
  }
}

/**
 * SELECT查询
 */
export class Select<TModel extends object> extends Fromable {
  $tops?: number;
  $offsets?: number;
  $limits?: number;
  $distinct?: boolean;
  $columns: Column<string, JsConstant>[];
  $sorts?: SortInfo[];
  $groups?: Expression<any>[];
  $havings?: Condition;
  $unions?: Union;

  readonly $type: SQL_SYMBOLE.SELECT = SQL_SYMBOLE.SELECT;

  constructor(valueObject?: ValueObject<TModel>);
  constructor(
    ...columns: (
      | Field<FieldsOf<TModel>, JsConstant>
      | Column<string, JsConstant>
    )[]
  );
  constructor(
    singleColumn: Expressions<JsConstant> | Column<string, JsConstant>
  );
  constructor(...columns: any) {
    super();
    if (columns.length === 1 && _.isPlainObject(columns[0])) {
      const valueObject = columns[0];
      this.$columns = Object.entries(valueObject).map(([name, expr]) => {
        new Column(name, expr instanceof AST ? expr : new Constant(name));
      });
      return;
    }
    // 实例化
    this.$columns = List.columns(
      ...(columns as Expressions[]).map((expr) => ensureExpression(expr))
    );
    // if (options?.from) this.from(...options.from)
    // if (options?.joins) this.$joins = options.joins
    // if (options?.columns) this.columns(...options.columns)
    // if (options?.where) this.where(options.where)
    // if (options?.orderBy) this.orderBy(...options.orderBy)
    // if (options?.groupBy) this.groupBy(...options.groupBy)
    // if (options?.distinct === true) this.distinct()
    // if (options?.top !== undefined) this.top(options.top)
    // if (options?.offset !== undefined) this.offset(options.offset)
    // if (options?.limit !== undefined) this.offset(options.limit)
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
    assert(_.isUndefined(this.$tops), "top is declared");
    this.$tops = rows;
    return this;
  }

  /**
   * order by 排序
   * @param sorts 排序信息
   */
  orderBy(sorts: SortObject): this;
  orderBy(...sorts: (SortInfo | Expressions)[]): this;
  orderBy(...sorts: (SortObject | SortInfo | Expressions)[]): this {
    // assert(!this.$orders, 'order by clause is declared')
    assert(sorts.length > 0, "must have one or more order basis");
    // 如果传入的是对象类型
    if (sorts.length === 1 && _.isPlainObject(sorts[0])) {
      const obj = sorts[0];
      this.$sorts = Object.entries(obj).map(
        ([expr, direction]) => new SortInfo(expr, direction as SORT_DIRECTION)
      );
      return this;
    }
    sorts = sorts as (Expressions | SortInfo)[];
    this.$sorts = sorts.map((expr) =>
      expr instanceof SortInfo ? expr : new SortInfo(expr as Expressions)
    );
    return this;
  }

  /**
   * 分组查询
   * @param groups
   */
  groupBy(...groups: Expressions[]) {
    this.$groups = groups.map((expr) => ensureExpression(expr));
    return this;
  }

  /**
   * Having 子句
   * @param condition
   */
  having(condition: Conditions) {
    assert(!this.$havings, "having is declared");
    assert(this.$groups, "Syntax error, group by is not declared.");
    if (!(condition instanceof Condition)) {
      condition = ensureCondition(condition);
    }
    this.$havings = condition as Condition;
    return this;
  }

  /**
   * 偏移数
   * @param rows
   */
  offset(rows: number) {
    this.$offsets = rows;
    return this;
  }

  /**
   * 限定数
   * @param rows
   */
  limit(rows: number) {
    assert(_.isNumber(rows), "The argument rows must type of Number");
    this.$limits = rows;
    return this;
  }

  /**
   * 合并查询
   */
  union(select: SelectExpression, all = false) {
    this.$unions = new Union(select, all);
    return this;
  }

  unionAll(select: SelectExpression) {
    return this.union(select, true);
  }

  /**
   * 将本SELECT返回表达式
   * @returns 返回一个加()后的SELECT语句
   */
  quoted(): Expression<TModel> {
    return new Bracket(this);
  }

  /**
   * 将本次查询，转换为Table行集
   * @param alias
   */
  as(alias: string) {
    return makeProxiedTable(new Column(this.quoted(), alias));
  }
}

/**
 * Insert 语句
 */
export class Insert<
  TName extends string,
  TModel extends object = any
> extends Fromable {
  $table: Table<TName, TModel>;
  $fields?: Field<FieldsOf<TModel>, JsConstant>[];
  $values: Expression<JsConstant>[] | Select<TModel>;

  readonly $type: SQL_SYMBOLE.INSERT = SQL_SYMBOLE.INSERT;

  /**
   * 构造函数
   */
  constructor(
    table: Tables<TName, TModel>,
    fields?: FieldsOf<TModel>[] | Field<FieldsOf<TModel>, JsConstant>[]
  ) {
    super();
    this.$table = ensureTable(table);
    if (fields[0] instanceof AST) {
      this.$fields = (fields as FieldsOf<TModel>[]).map(
        (field) => new Field(field)
      );
    }
  }

  values(select: Select<TModel>): this;
  values(row: ValueObject<TModel>): this;
  values(row: Expressions<JsConstant>[]): this;
  values(rows: Expressions<JsConstant>[][]): this;
  values(rows: ValueObject<TModel>[]): this;
  values(...rows: Expressions<JsConstant>[][]): this;
  values(...rows: ValueObject<TModel>[]): this;
  values(...args: any[]): this {
    assert(!this.$values, "values is declared");
    assert(args.length > 0, "rows must more than one elements.");
    let items: ValueObject[], rows: Expressions[][];
    // 单个参数
    if (args.length === 1) {
      const values = args[0];
      // values(Select)
      if (values instanceof Select) {
        this.$values = args[0];
        return this;
      }
      // values(UnsureExpression[] | ValuesObject[] | UnsureExpression[])
      if (_.isArray(values)) {
        // values(UnsureExpression[][])
        if (_.isArray(values[0])) {
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
        else if (_.isObject(values[0])) {
          items = values;
        } else {
          throw new Error("invalid arguments！");
        }
      }
      // values(ValueObject)
      else if (_.isObject(values)) {
        items = args;
      } else {
        throw new Error("invalid arguments！");
      }
    } else {
      if (_.isArray(args[0])) {
        // values(...UsureExpression[][])
        rows = args;
      }
      // values(...ValueObject[])
      else if (_.isObject(args[0])) {
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
      this.$values = rows.map((row) => List.values(...row));
      return this;
    }

    // values(items: ValueObject[])
    if (!this.$fields) {
      const existsFields: { [key: string]: boolean } = {};
      items.forEach((item) =>
        Object.keys(item).forEach((field) => {
          if (!existsFields[field]) existsFields[field] = true;
        })
      );
      this._fields(...Object.keys(existsFields));
    }

    this.$values = items.map((item) => {
      const rowValues = this.$fields.map(
        (field) => (item as ValueObject)[field.$name]
      );
      return List.values(...rowValues);
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
export class Update<
  TName extends string,
  TModel extends object
> extends Fromable {
  $table: Table<TName, TModel>;
  sets: Assignment<JsConstant, JsConstant>[];

  readonly $type: SQL_SYMBOLE.UPDATE = SQL_SYMBOLE.UPDATE;

  constructor(table: Tables<TName, TModel> /*options?: UpdateOptions*/) {
    super();
    this.$table = ensureTable(table);
    // if (options?.table) this.from(options.table)
    // if (options?.sets) this.set(options.sets)
    // if (options?.where) this.where(options.where)
    // if (options?.joins) this.$joins = options.joins
  }

  /**
   * @param sets
   */
  set(sets: ValueObject<TModel>): this;
  set(...sets: Assignment<JsConstant, JsConstant>[]): this;
  set(
    ...sets: ValueObject<TModel>[] | Assignment<JsConstant, JsConstant>[]
  ): this {
    assert(!this.sets, "set statement is declared");
    assert(sets.length > 0, "sets must have more than 0 items");
    if (sets.length > 1 || sets[0] instanceof Assignment) {
      this.sets = sets as Assignment<JsConstant, JsConstant>[];
      return this;
    }

    const obj = sets[0];
    this.sets = Object.entries(obj).map(
      ([key, value]) =>
        new Assignment(this.$table.$field(key as any), ensureExpression(value))
    );
    return this;
  }

  // where(condition: WhereObject<T>): this
  // where(condition: Condition): this
  // where(condition: Conditions): this {
  //   return super.where(condition)
  // }
}

// export interface DeleteOptions {
//   table?: UnsureIdentifier
//   sets?: object | Assignment[]
//   joins?: Join[]
//   where?: Conditions
// }

export class Delete<
  TName extends string,
  TModel extends object
> extends Fromable {
  $table: Table<TName, TModel>;
  $type: SQL_SYMBOLE.DELETE = SQL_SYMBOLE.DELETE;

  constructor(table: Tables<TName, TModel>) {
    super();
    this.$table = ensureTable(table);
    // if (options?.table) this.from(options.table)
    // if (options?.joins) this.$joins = options.joins
    // if (options?.where) this.where(options.where)
  }

  where(condition: Condition): this;
  where(condition: WhereObject<TModel>): this;
  where(condition: Conditions<TModel>): this {
    return super.where(condition);
  }
}

export class Procedure extends Statement {
  $args: Parameter<string, JsConstant>[];
}

/**
 * 存储过程执行
 */
export class Execute extends Statement {
  proc: Identifier<void>;
  args: List;
  constructor(proc: Identifiers, args?: Expressions[]);
  constructor(proc: Identifiers, args?: Parameter[]);
  constructor(proc: Identifiers, args?: Expressions[] | Parameter[]);
  constructor(proc: Identifiers, args?: Expressions[] | Parameter[]) {
    super(SQL_SYMBOLE.EXECUTE);
    this.proc = ensureIdentifier(proc);
    this.args = List.invokeArgs(...(args || []));
  }
}

/**
 * 赋值语句
 */
export class Assignment<
  TLeft extends JsConstant,
  TRight extends JsConstant
> extends Statement {
  left: Expression<TLeft>;
  right: Expression<TRight>;

  constructor(left: Assignable<TLeft>, right: Expressions<TRight>) {
    super(SQL_SYMBOLE.ASSIGNMENT);
    this.left = left;
    this.right = ensureExpression(right);
  }
}

export class VariantDeclare extends AST {
  constructor(name: string, dataType: string) {
    super(SQL_SYMBOLE.VARAINT_DECLARE);
    this.name = name;
    this.dataType = dataType;
  }

  name: string;
  dataType: string;
}

/**
 * 声明语句，暂时只支持变量声明
 */
export class Declare extends Statement {
  declares: VariantDeclare[];

  constructor(...declares: VariantDeclare[]) {
    super(SQL_SYMBOLE.DECLARE);
    this.declares = declares;
  }
}

type DbType = string;

/**
 * 程序与数据库间传递值所使用的参数
 */
export class Parameter<
  TName extends string,
  T extends JsConstant
> extends Identifier<TName> {
  $name: Name<TName>;
  $direction: PARAMETER_DIRECTION;
  $dbType?: DbType;
  $kind: IDENTOFIER_KIND.PARAMETER = IDENTOFIER_KIND.PARAMETER;
  $value: T;

  constructor(
    name: Name<TName>,
    dbType: DbType,
    value: T,
    direction: PARAMETER_DIRECTION = PARAMETER_DIRECTION.INPUT
  ) {
    super(name);
    this.$value = value; // ensureConstant(value)
    this.$dbType = dbType;
    this.$direction = direction;
  }

  /**
   * input 参数
   */
  static input(name: string, value: JsConstant) {
    return new Parameter(name, null, value, PARAMETER_DIRECTION.INPUT);
  }

  /**
   * output参数
   */
  static output(name: string, type: DbType, value?: JsConstant) {
    return new Parameter(name, type, value, PARAMETER_DIRECTION.OUTPUT);
  }
}

/**
 * SQL 文档
 */
export class Document extends AST {
  statements: Statement[];
  constructor(...statements: Statement[]) {
    super(SQL_SYMBOLE.DOCUMENT);
    this.statements = statements;
  }
}

export class Raw<T = any>
  extends Expression<T>
  implements Statement, Document, Condition {
  sql: string;
  private _lvalue: boolean;
  constructor(sql: string) {
    super(SQL_SYMBOLE.RAW);
    this.sql = sql;
  }
  and: (condition: Condition) => Condition;
  or: (condition: Condition) => Condition;
  andGroup: (condition: Condition) => Condition;
  orGroup: (condition: Condition) => Condition;

  get statements(): Statement[] {
    return [this];
  }

  get lvalue(): boolean {
    if (this._lvalue === null || this._lvalue === undefined) {
      throw new Error("Unset lvalue!");
    }
    return this._lvalue;
  }

  set lvalue(value: boolean) {
    this._lvalue = value;
  }
}

Object.assign(Raw, ConditionPrototype);

export class WithItem<T, TName extends string> extends NamedObject<T, TName> {
  constructor(expr: Expression<T>, name: TName) {
    super(expr, name, SQL_SYMBOLE.WITH_ITEM);
  }
}

export class With extends AST {
  constructor(...items: WithItem<any, any>[]) {
    super(SQL_SYMBOLE.WITH);
    this.items = items;
  }

  items: WithItem<any, any>[];

  select<T extends object>(results: ValueObject<T>): Select<RowObject<T>>;
  select<T = any>(...columns: Expressions[]): Select<T>;
  select(...args: any) {
    const sql = Statement.select(...args);
    sql.$with = this;
    return sql;
  }

  /**
   * 插入至表,into的别名
   * @param table
   * @param fields
   */
  insert<T extends object>(table: Identifiers<T>, fields?: Identifiers[]) {
    const sql = Statement.insert(table, fields);
    sql.$with = this;
    return sql;
  }

  /**
   * 更新一个表格
   * @param table
   */
  update<T extends object>(table: Identifiers<T>) {
    const sql = Statement.update(table);
    sql.$with = this;
    return sql;
  }

  /**
   * 删除一个表格
   * @param table 表格
   */
  delete<T extends object>(table: Identifiers<T>) {
    const sql = Statement.delete(table);
    sql.$with = this;
  }
}
