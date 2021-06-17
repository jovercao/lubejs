/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  assert,
  ensureExpression,
  ensureCondition,
  makeProxiedRowset,
  isScalar,
  ensureRowset,
  ensureFunction,
  ensureProcedure,
  pickName,
  pathName,
  isPlainObject,
  ensureVariant,
  clone,
  isSelect,
  isProxiedRowset,
  isExpression,
  isSortInfo,
  parseValueType,
  ensureTableVariant,
} from './util';

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
} from './constants';
import { DbType, TsTypeOf, DbTypeOf, RowObject, Name } from './types';
import { Scalar } from './types';
import { convert, identityValue } from './std';
import { ColumnSchema, TableSchema } from './schema';
// import { convert } from './std';

// /**
//  * 混入函数，必须放最前面，避免循环引用导致无法获取
//  * @param derivedCtor
//  * @param baseCtors
//  */
// function applyMixins(derivedCtor: any, baseCtors: any[]) {
//   baseCtors.forEach((baseCtor) => {
//     Object.entries(
//       Object.getOwnPropertyDescriptors(baseCtor.prototype)
//     ).forEach(([name, desc]) => {
//       // if (desc.get || desc.set) {

//       // }
//       // 复制属性
//       Object.defineProperty(derivedCtor.prototype, name, desc);
//       // derivedCtor.prototype[name] = baseCtor.prototype[name];
//     });
//   });
// }

/**
 * 取值结果集首个返回值类型运算
 */
export type AsScalarType<T extends RowObject> = T[FieldsOf<T>] extends Scalar
  ? T[FieldsOf<T>]
  : never;

export type DefaultRowObject = {
  [P in string]: Scalar;
};

// {
//   [field: string]: ScalarType;
// };

/**
 * 简化后的whereObject查询条件
 */
export type WhereObject<T extends RowObject = DefaultRowObject> = {
  [K in FieldsOf<T>]?:
    | CompatibleExpression<FieldTypeOf<T, K>>
    | CompatibleExpression<FieldTypeOf<T, K>>[];
};

/**
 * 值列表，用于传递Select、Insert、Update、Parameters 的键值对
 */
export type InputObject<T extends RowObject = DefaultRowObject> = {
  [K in FieldsOf<T>]?: CompatibleExpression<T[K]>;
};

/**
 * 获取表达式/或者对像所表示的类型
 */
export type TypeOf<T> = T extends Scalar
  ? T
  : T extends Expression<infer X>
  ? X
  : T extends RowObject
  ? T
  : never;

/**
 * 从 SELECT(...Identitfier) 中查询的属性及类型
 * 将选择项，列、或者字段转换成Model类型
 */
export type RowTypeFrom<T> = T extends undefined // eslint-disable-next-line @typescript-eslint/ban-types
  ? {}
  : T extends Field<infer V, infer N>
  ? {
      [K in N]: V;
    }
  : T extends SelectColumn<infer V, infer N>
  ? {
      [K in N]: V;
    }
  : T extends Star<infer M>
  ? {
      [P in FieldsOf<M>]: M[P];
    }
  : T extends InputObject
  ? {
      [K in keyof T]: TypeOf<T[K]>;
    }
  : T extends Record<string, RowObject>
  ? {
      [K in FieldsOf<T>]: TypeOf<T[K]>;
    } // eslint-disable-next-line @typescript-eslint/ban-types
  : {};

/**
 * select语句可以接收的列
 */
export type SelectCloumn =
  | Field<Scalar, string>
  | SelectColumn<Scalar, string>
  | Star<any>;

export type RowTypeByColumns<
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
> = RowTypeFrom<A> &
  RowTypeFrom<B> &
  RowTypeFrom<C> &
  RowTypeFrom<D> &
  RowTypeFrom<E> &
  RowTypeFrom<F> &
  RowTypeFrom<G> &
  RowTypeFrom<H> &
  RowTypeFrom<I> &
  RowTypeFrom<J> &
  RowTypeFrom<K> &
  RowTypeFrom<L> &
  RowTypeFrom<M> &
  RowTypeFrom<N> &
  RowTypeFrom<O> &
  RowTypeFrom<P> &
  RowTypeFrom<Q> &
  RowTypeFrom<R> &
  RowTypeFrom<S> &
  RowTypeFrom<T> &
  RowTypeFrom<U> &
  RowTypeFrom<V> &
  RowTypeFrom<W> &
  RowTypeFrom<X> &
  RowTypeFrom<Y> &
  RowTypeFrom<Z>;

/**
 * 可兼容的表达式
 */
export type CompatibleExpression<T extends Scalar = Scalar> = Expression<T> | T;

/**
 * 可兼容的查询条件
 */
export type CompatibleCondition<T extends RowObject = DefaultRowObject> =
  | Condition
  | WhereObject<T>;

export type CompatibleSortInfo<T extends RowObject = DefaultRowObject> =
  | SortInfo[]
  | SortObject<T>
  | [CompatibleExpression, SORT_DIRECTION][];

/**
 * 提取类型中的数据库有效字段，即类型为ScalarType的字段列表
 * 用于在智能提示时排除非数据库字段
 */
export type FieldsOf<T> = Exclude<
  {
    [P in keyof T]: T[P] extends Scalar ? P : never;
  }[keyof T],
  number | symbol
>;

export type FieldTypeOf<T, F extends keyof T> = T[F] extends Scalar
  ? T[F]
  : never;

/**
 * 代理后的Rowset类型
 */
export type Proxied<T> = T extends
  | Rowset<infer M>
  | NamedSelect<infer M>
  | Table<infer M>
  | TableFuncInvoke<infer M>
  | TableVariant<infer M>
  ? T &
      {
        // 排除AST自有属性
        [P in FieldsOf<M>]: Field<M[P], P>;
      }
  : never;

/**
 * 代理后的表
 */
export type ProxiedTable<T extends RowObject, N extends string = string> =
  Table<T, N> &
    {
      [P in FieldsOf<T>]: Field<T[P], P>;
    };

/**
 * 代理后的行集
 */
export type ProxiedRowset<T extends RowObject> = Rowset<T> &
  {
    [P in FieldsOf<T>]: Field<T[P], P>;
  };

export type ProxiedNamedSelect<T extends RowObject, N extends string = string> =
  NamedSelect<T, N> &
    {
      [P in FieldsOf<T>]: Field<T[P], P>;
    };

/**
 * AST 基类
 */
export abstract class AST {
  readonly $type: SQL_SYMBOLE;
  /**
   * 克隆自身
   */
  clone(): this {
    return clone(this);
  }
}

export type ModelClass<T extends RowObject = any> = new (...args: any) => T;

/**
 * 表达式基类，抽象类，
 * 所有表达式类均从该类型继承，
 * 可以直接使用 instanceof 来判断是否为expression
 */
export abstract class Expression<T extends Scalar = Scalar> extends AST {
  $type: SQL_SYMBOLE_EXPRESSION;
  /**
   * 字符串连接运算
   */
  concat(expr: CompatibleExpression<string>): Expression<string> {
    return Expression.concat(this as CompatibleExpression<string>, expr);
  }

  /**
   * 加法运算，返回数值，如果是字符串相加，请使用join函数连接
   */
  add(expr: CompatibleExpression<number>): Expression<number> {
    return Expression.add(this as CompatibleExpression<number>, expr);
  }

  /**
   * 减法运算
   */
  sub(expr: CompatibleExpression<number>): Expression<number> {
    return Expression.sub(this as CompatibleExpression<number>, expr);
  }

  /**
   * 乘法运算
   * @param expr 要与当前表达式相乘的表达式
   */
  mul(expr: CompatibleExpression<number>): Expression<number> {
    return Expression.mul(this as CompatibleExpression<number>, expr);
  }

  /**
   * 除法运算
   * @param expr 要与当前表达式相除的表达式
   * @returns 返回运算后的表达式
   */
  div(expr: CompatibleExpression<number>): Expression<number> {
    return Expression.div(this as CompatibleExpression<number>, expr);
  }

  /**
   * 算术运算 %
   * @param expr 要与当前表达式相除的表达式
   * @returns 返回运算后的表达式
   */
  mod(expr: CompatibleExpression<number>): Expression<number> {
    return Expression.mod(this as CompatibleExpression<number>, expr);
  }

  /**
   * 位运算 &
   * @param expr 要与当前表达式相除的表达式
   * @returns 返回运算后的表达式
   */
  and(expr: CompatibleExpression<number>): Expression<number> {
    return Expression.and(this as CompatibleExpression<number>, expr);
  }

  /**
   * 位运算 |
   * @param expr 要与当前表达式相除的表达式
   * @returns 返回运算后的表达式
   */
  or(expr: CompatibleExpression<number>): Expression<number> {
    return Expression.or(this as CompatibleExpression<number>, expr);
  }

  /**
   * 位运算 ~
   * @param expr 要与当前表达式相除的表达式
   * @returns 返回运算后的表达式
   */
  not(): Expression<number> {
    return Expression.not(this as CompatibleExpression<number>);
  }

  /**
   * 位运算 ^
   * @param expr 要与当前表达式相除的表达式
   * @returns 返回运算后的表达式
   */
  xor(expr: CompatibleExpression<number>): Expression<number> {
    return Expression.xor(this as CompatibleExpression<number>, expr);
  }

  /**
   * 位运算 <<
   * @param expr 要与当前表达式相除的表达式
   * @returns 返回运算后的表达式
   */
  shl(expr: CompatibleExpression<number>): Expression<number> {
    return Expression.shl(this as CompatibleExpression<number>, expr);
  }

  /**
   * 位运算 >>
   * @param expr 要与当前表达式相除的表达式
   * @returns 返回运算后的表达式
   */
  shr(expr: CompatibleExpression<number>): Expression<number> {
    return Expression.shr(this as CompatibleExpression<number>, expr);
  }

  /**
   * 比较是否相等 =
   * @param expr 要与当前表达式相比较的表达式
   * @returns 返回对比条件表达式
   */
  eq(expr: CompatibleExpression<T>): Condition {
    return Condition.eq(this, expr);
  }

  /**
   * 比较是否不等于 <>
   * @param expr 要与当前表达式相比较的表达式
   * @returns 返回对比条件表达式
   */
  neq(expr: CompatibleExpression<T>): Condition {
    return Condition.neq(this, expr);
  }

  /**
   * 比较是否小于 <
   * @param expr 要与当前表达式相比较的表达式
   * @returns 返回对比条件表达式
   */
  lt(expr: CompatibleExpression<T>): Condition {
    return Condition.lt(this, expr);
  }

  /**
   * 比较是否小于等于 <=
   * @param expr 要与当前表达式相比较的表达式
   * @returns 返回对比条件表达式
   */
  lte(expr: CompatibleExpression<T>): Condition {
    return Condition.lte(this, expr);
  }

  /**
   * 比较是否大于 >
   * @param expr 要与当前表达式相比较的表达式
   * @returns 返回对比条件表达式
   */
  gt(expr: CompatibleExpression<T>): Condition {
    return Condition.gt(this, expr);
  }

  /**
   * 比较是否小于等于 >=
   * @param expr 要与当前表达式相比较的表达式
   * @returns 返回对比条件表达式
   */
  gte(expr: CompatibleExpression<T>): Condition {
    return Condition.gte(this, expr);
  }

  /**
   * 比较是相像 LIKE
   * @param expr 要与当前表达式相比较的表达式
   * @returns 返回对比条件表达式
   */
  like(expr: CompatibleExpression<string>): Condition {
    return Condition.like(this as CompatibleExpression<string>, expr);
  }

  /**
   * 比较是否不想像 NOT LIKE
   * @param expr 要与当前表达式相比较的表达式
   * @returns 返回对比条件表达式
   */
  notLike(expr: CompatibleExpression<string>): Condition {
    return Condition.notLike(this as CompatibleExpression<string>, expr);
  }

  /**
   * 比较是否不包含于 IN
   * @param values 要与当前表达式相比较的表达式数组
   * @returns 返回对比条件表达式
   */
  in(select: Select<any>): Condition;
  in(values: CompatibleExpression<T>[]): Condition;
  in(...values: CompatibleExpression<T>[]): Condition;
  in(
    ...values:
      | CompatibleExpression<T>[]
      | [Select<any>]
      | [CompatibleExpression<T>[]]
  ): Condition {
    if (
      values.length === 1 &&
      (isSelect(values[0]) || Array.isArray(values[0]))
    ) {
      return Condition.in(this, values[0] as any);
    }
    return Condition.in(this, values as any);
  }

  /**
   * 比较是否不包含于 NOT IN
   * @param values 要与当前表达式相比较的表达式
   * @returns 返回对比条件表达式
   */
  notIn(...values: CompatibleExpression<T>[]): Condition {
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
  as<N extends string>(name: N): SelectColumn<T, N> {
    return new SelectColumn<T, N>(name, this);
  }

  /**
   * 将本表达式括起来
   */
  enclose(): Expression<T> {
    return Expression.enclose(this);
  }

  /**
   * 将当前表达式转换为指定的类型
   */
  to<T extends DbType>(type: T): Expression<TsTypeOf<T>> {
    return convert(this, type);
  }

  static identityValue(table: string, column: string): Expression<number> {
    return identityValue(table, column);
  }

  /**
   * 括号表达式，将表达式括起来，如优先级
   */
  static enclose<T extends Scalar>(
    value: CompatibleExpression<T>
  ): Expression<T> {
    return new ParenthesesExpression(value);
  }

  /**
   * 算术运算 +
   * @param left 左值
   * @param right 右值
   * @returns 返回算术运算表达式
   */
  static neg(expr: CompatibleExpression<number>): Expression<number> {
    return new UnaryOperation(UNARY_OPERATION_OPERATOR.NEG, expr);
  }

  /**
   * 字符串连接运算
   */
  static concat(
    left: CompatibleExpression<string>,
    right: CompatibleExpression<string>
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
    left: CompatibleExpression<number>,
    right: CompatibleExpression<number>
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
    left: CompatibleExpression<number>,
    right: CompatibleExpression<number>
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
    left: CompatibleExpression<number>,
    right: CompatibleExpression<number>
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
    left: CompatibleExpression<number>,
    right: CompatibleExpression<number>
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
    left: CompatibleExpression<number>,
    right: CompatibleExpression<number>
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
    left: CompatibleExpression<number>,
    right: CompatibleExpression<number>
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
    left: CompatibleExpression<number>,
    right: CompatibleExpression<number>
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
    left: CompatibleExpression<number>,
    right: CompatibleExpression<number>
  ): Expression<number> {
    return new BinaryOperation(BINARY_OPERATION_OPERATOR.XOR, left, right);
  }

  /**
   * 位算术运算 ~
   * @param value 左值
   * @param right 右值
   * @returns 返回算术运算表达式
   */
  static not(value: CompatibleExpression<number>): Expression<number> {
    return new UnaryOperation(UNARY_OPERATION_OPERATOR.NOT, value);
  }

  /**
   * 位算术运算 <<
   * @param left 左值
   * @param right 右值
   * @returns 返回算术运算表达式
   */
  static shl(
    left: CompatibleExpression<number>,
    right: CompatibleExpression<number>
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
    left: CompatibleExpression<number>,
    right: CompatibleExpression<number>
  ): Expression<number> {
    return new BinaryOperation(BINARY_OPERATION_OPERATOR.SHR, left, right);
  }

  // static convert<T extends DbType>(
  //   expr: CompatibleExpression<Scalar>,
  //   toType: T
  // ): Expression<TsTypeOf<T>> {
  //   return convert(expr, toType);
  // }

  static literal<T extends Scalar>(value: T): Literal<T> {
    return new Literal(value);
  }
}

/**
 * 标准操作，用于存放标准操作未转换前的标准操作
 * 用于定义一套多数据库兼容的标准
 * 如，类型转换、获取日期 等操作
 */
export class StandardExpression<
  T extends Scalar = Scalar
> extends Expression<T> {
  constructor(kind: string, datas: any[]) {
    super();
    this.$kind = kind;
    this.$datas = datas;
  }

  readonly $type: SQL_SYMBOLE.STANDARD_EXPRESSION =
    SQL_SYMBOLE.STANDARD_EXPRESSION;

  readonly $kind: string;

  readonly $datas: any[];

  static create<T extends Scalar>(
    kind: string,
    datas: any[]
  ): StandardExpression<T> {
    return new StandardExpression(kind, datas);
  }
}

// /**
//  * 获取当前新增的标识列值
//  */
// export class IdentityValue extends Expression<number> {
//   constructor(public readonly $table: string, public readonly $column: string) {
//     super();
//   }
//   readonly $type = SQL_SYMBOLE.IDENTITY_VALUE;
// }

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
  and(condition: CompatibleCondition): Condition {
    condition = ensureCondition(condition);
    return new BinaryLogicCondition(LOGIC_OPERATOR.AND, this, condition);
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
   * 使用逻辑表达式联接多个条件
   */
  private static join(
    logic: LOGIC_OPERATOR.AND | LOGIC_OPERATOR.OR,
    conditions: CompatibleCondition[]
  ): Condition {
    if (conditions.length < 2) {
      throw new Error(`conditions must more than or equals 2 element.`);
    }
    return Condition.enclose(
      conditions.reduce((previous, current) => {
        let condition = ensureCondition(current);
        // 如果是二元逻辑条件运算，则将其用括号括起来，避免逻辑运算出现优先级的问题
        if (condition.$kind === CONDITION_KIND.BINARY_LOGIC) {
          condition = Condition.enclose(condition);
        }
        if (!previous) return condition;
        return new BinaryLogicCondition(logic, previous, condition);
      })
    );
  }

  /**
   * 将多个查询条件通过 AND 合并成一个大查询条件
   * @static
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

  static and(
    ...conditions: CompatibleCondition[] | [CompatibleCondition[]]
  ): Condition {
    if (Array.isArray(conditions[0])) {
      conditions = conditions[0];
    }
    return Condition.join(
      LOGIC_OPERATOR.AND,
      conditions as CompatibleCondition[]
    );
  }

  /**
   * 将多个查询条件通过 OR 合并成一个
   * @static
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

  static or(
    ...conditions: CompatibleCondition[] | [CompatibleCondition[]]
  ): Condition {
    if (Array.isArray(conditions[0])) {
      conditions = conditions[0] as CompatibleCondition[];
    }
    return Condition.join(
      LOGIC_OPERATOR.OR,
      conditions as CompatibleCondition[]
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

  /**
   * 比较运算 <
   * @param left 左值
   * @param right 右值
   * @returns 返回比较运算对比条件
   */
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
  ): Condition {
    return new BinaryCompareCondition(
      BINARY_COMPARE_OPERATOR.IN,
      left,
      isSelect(values) ? values.asValue() : values.map(v => ensureExpression(v))
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
      values.map(v => ensureExpression(v))
    );
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

  /**
   * 将查询条件用括号包括
   * @param condition 查询条件
   */
  static enclose(condition: CompatibleCondition<any>): Condition {
    return new ParenthesesCondition(condition);
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
    left: CompatibleCondition<any>,
    right: CompatibleCondition<any>
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
  constructor(operator: LOGIC_OPERATOR, next: CompatibleCondition<any>) {
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
  $left: Expression<Scalar>;
  $right: Expression<Scalar> | Expression<Scalar>[];
  $operator: BINARY_COMPARE_OPERATOR;
  $kind: CONDITION_KIND.BINARY_COMPARE = CONDITION_KIND.BINARY_COMPARE;

  /**
   * 构造函数
   */
  constructor(
    operator: BINARY_COMPARE_OPERATOR,
    left: CompatibleExpression<Scalar>,
    right: CompatibleExpression<Scalar> | CompatibleExpression<Scalar>[]
  ) {
    super();
    this.$operator = operator;
    this.$left = ensureExpression(left);
    if (Array.isArray(right)) {
      this.$right = right.map(expr => ensureExpression(expr));
    } else {
      this.$right = ensureExpression(right);
    }
  }
}

/**
 * 一元比较条件
 */
export class UnaryCompareCondition extends Condition {
  $expr: Expression<Scalar>;
  $operator: UNARY_COMPARE_OPERATOR;
  $kind: CONDITION_KIND.UNARY_COMPARE = CONDITION_KIND.UNARY_COMPARE;

  /**
   * 一元比较运算符
   * @param operator 运算符
   * @param expr 查询条件
   */
  constructor(
    operator: UNARY_COMPARE_OPERATOR,
    expr: CompatibleExpression<Scalar>
  ) {
    super();
    this.$operator = operator;
    assert(expr, 'next must not null');
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
  constructor(table: Name<string> | Rowset, on: Condition, left = false) {
    super();

    this.$table = ensureRowset(table);
    this.$on = on;
    this.$left = left;
  }
}

/**
 * SQL *，查询所有字段时使用
 */
// eslint-disable-next-line
export class Star<T extends object = any> extends AST {
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
  static table<T extends RowObject = any>(
    modelCtr: ModelClass<T>
  ): ProxiedTable<T, string>;
  static table<
    T extends RowObject = DefaultRowObject,
    N extends string = string
  >(name: Name<N>): ProxiedTable<T, N>;
  static table<T extends RowObject = DefaultRowObject>(
    nameOrModel: Name<string> | ModelClass<T>
  ): ProxiedTable<T, string> {
    if (typeof nameOrModel === 'function') {
      return makeProxiedRowset(new Table<T, string>(nameOrModel.name));
    }
    return makeProxiedRowset(new Table<T, string>(nameOrModel));
  }

  /**
   * 声明一个函数
   */
  static func<N extends string>(name: Name<N>, builtIn = false): Func<N> {
    return new Func(name, builtIn);
  }

  /**
   * 创建一个可供调用的存储过程函数
   */
  static proc<
    R extends Scalar = number,
    O extends RowObject[] = never,
    N extends string = string
  >(name: Name<N>, buildIn = false): Procedure<R, O, N> {
    return new Procedure<R, O, N>(name, buildIn);
  }

  /**
   * 创建一个字段
   */
  static field<T extends Scalar, N extends string>(name: Name<N>): Field<T, N> {
    return new Field(name);
  }

  static builtIn<T extends string>(name: T): BuiltIn<T> {
    return new BuiltIn(name);
  }

  static var<T extends Scalar, N extends string = string>(
    name: N
  ): Variant<T, N> {
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
  N extends string = string
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
    buildIn = false
    // type?: K
  ) {
    super(name, buildIn);
    // this.$ftype = type || (FUNCTION_TYPE.SCALAR as K)
  }

  invokeAsTable<T extends RowObject = DefaultRowObject>(
    ...args: (CompatibleExpression<Scalar> | BuiltIn<string> | Star)[]
  ): Rowset<T> {
    return new TableFuncInvoke(this, args);
  }

  invokeAsScalar<T extends Scalar>(
    ...args: (CompatibleExpression<Scalar> | BuiltIn<string> | Star)[]
  ): Expression<T> {
    return new ScalarFuncInvoke(this, args);
  }
}

export abstract class Assignable<T extends Scalar = any> extends Expression<T> {
  readonly $lvalue: true = true;
  /**
   * 赋值操作
   * @param left 左值
   * @param right 右值
   */
  assign(value: CompatibleExpression<T>): Assignment<T> {
    return new Assignment(this, value);
  }
}

export class Field<T extends Scalar = any, N extends string = string>
  extends Assignable<T>
  implements Identifier<N>
{
  constructor(name: Name<N>) {
    super();
    this.$name = name;
  }
  $builtin: false = false;

  readonly $name: Name<N>;
  readonly $type: SQL_SYMBOLE.IDENTIFIER = SQL_SYMBOLE.IDENTIFIER;
  readonly $kind: IDENTOFIER_KIND.FIELD = IDENTOFIER_KIND.FIELD;
}

// applyMixins(Field, [Identifier]);

/**
 * 数据库行集，混入类型
 */
// eslint-disable-next-line @typescript-eslint/ban-types
export abstract class Rowset<T extends RowObject = RowObject> extends AST {
  /**
   * 别名
   */
  $alias?: Alias<string> = null;

  /**
   * 为当前表添加别名
   */
  as(
    alias: string
  ):
    | ProxiedRowset<T>
    | ProxiedTable<T>
    | Rowset<T>
    | Table<T>
    | NamedSelect<T> {
    if (this.$alias) {
      throw new Error(`Rowset is exists alias: ${this.$alias.$name}`);
    }
    this.$alias = new Alias(alias);
    if (!isProxiedRowset(this)) {
      return makeProxiedRowset(this);
    }
    return this as ProxiedRowset<T>;
  }

  /**
   * 访问下一节点
   * @param name 节点名称
   */
  field<P extends FieldsOf<T>>(name: P): Field<T[P], P> {
    if (!this.$alias) {
      throw new Error('You must named rowset befor use field.');
    }
    return new Field<T[P], P>([name, this.$alias.$name]);
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
      throw new Error('You must named rowset befor use field.');
    }
    return new Star<T>(this.$alias.$name);
  }

  clone(): this {
    const copied = super.clone();
    if (isProxiedRowset(this)) {
      return makeProxiedRowset(copied) as this;
    }
    return copied;
  }
}

export type CompatibleTable<
  // eslint-disable-next-line
  T extends RowObject = {},
  N extends string = string
> = Name<string> | Table<T, N> | ProxiedTable<T>;

export type CompatibleNamedSelect<
  // eslint-disable-next-line
  T extends RowObject = {},
  N extends string = string
> = NamedSelect<T, N> | ProxiedNamedSelect<T, N>;

/**
 * 所有可兼容的行集参数
 */
export type CompatibleRowset<
  // eslint-disable-next-line
  T extends RowObject = {},
  N extends string = string
> =
  | CompatibleTable<T, N>
  | Rowset<T>
  | NamedSelect<T, N>
  | ProxiedRowset<T>
  | Proxied<NamedSelect<T, N>>
  | TableFuncInvoke<T>
  | Proxied<TableFuncInvoke<T>>
  | TableVariant<T, N>
  | Proxied<TableVariant<T, N>>;

export class Table<
    T extends RowObject = DefaultRowObject,
    N extends string = string
  >
  extends Rowset<T>
  implements Identifier<N>
{
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
    return new Field<T[P], P>([name, ...pathName(this.$name)] as Name<P>);
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

  as: <N extends string>(alias: N) => this;
}

// applyMixins(Table, [Identifier]);

/**
 * 标量变量引用，暂不支持表变量
 */
export class Variant<T extends Scalar = any, N extends string = string>
  extends Assignable<T>
  implements Identifier<N>
{
  $type: SQL_SYMBOLE.IDENTIFIER = SQL_SYMBOLE.IDENTIFIER;
  $kind: IDENTOFIER_KIND.VARIANT = IDENTOFIER_KIND.VARIANT;
  constructor(name: N) {
    super();
    this.$name = name;
  }
  $builtin: boolean;
  $name: N;
}

// applyMixins(Variant, [Identifier]);

// TODO 表变量支持

// TODO: 完成表变量功能
export class TableVariant<T extends RowObject = any, N extends string = string>
  extends Rowset<T>
  implements Identifier<N>
{
  $type: SQL_SYMBOLE.IDENTIFIER = SQL_SYMBOLE.IDENTIFIER;
  $builtin: boolean;
  $kind: IDENTOFIER_KIND.TABLE_VARIANT = IDENTOFIER_KIND.TABLE_VARIANT;
  $name: N;
  constructor(name: N) {
    super();
    this.$name = name;
  }
}

// applyMixins(TableVariant, [Identifier]);

/**
 * 列表达式
 */
export class SelectColumn<
  T extends Scalar = Scalar,
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
  <T extends RowObject = any>(a: Star<T>): Select<T>;
  <A extends SelectCloumn>(a: A): Select<RowTypeByColumns<A>>;
  <A extends CompatibleExpression>(a: A): Select<{ unnamed: TypeOf<A> }>;
  <T extends InputObject<T>>(results: T): Select<RowTypeFrom<T>>;
  <T extends RowObject>(results: InputObject<T>): Select<T>;
  <T extends Scalar>(expr: CompatibleExpression<T>): Select<{
    '*no name': T;
  }>;
  <A extends SelectCloumn, B extends SelectCloumn>(a: A, b: B): Select<
    RowTypeByColumns<A, B>
  >;
  <A extends SelectCloumn, B extends SelectCloumn, C extends SelectCloumn>(
    a: A,
    b?: B,
    d?: C
  ): Select<RowTypeByColumns<A, B, C>>;
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
  ): Select<RowTypeByColumns<A, B, C, D>>;
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
  ): Select<RowTypeByColumns<A, B, C, D, E>>;
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
  ): Select<RowTypeByColumns<A, B, C, D, E, F>>;
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
  ): Select<RowTypeByColumns<A, B, C, D, E, F, G>>;
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
  ): Select<RowTypeByColumns<A, B, C, D, E, F, G, H>>;
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
  ): Select<RowTypeByColumns<A, B, C, D, E, F, G, H, I>>;
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
  ): Select<RowTypeByColumns<A, B, C, D, E, F, G, H, I, J>>;
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
  ): Select<RowTypeByColumns<A, B, C, D, E, F, G, H, I, J, K>>;
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
  ): Select<RowTypeByColumns<A, B, C, D, E, F, G, H, I, J, K, L>>;
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
  ): Select<RowTypeByColumns<A, B, C, D, E, F, G, H, I, J, K, L, M>>;
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
  ): Select<RowTypeByColumns<A, B, C, D, E, F, G, H, I, J, K, L, M, N>>;
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
  ): Select<RowTypeByColumns<A, B, C, D, E, F, G, H, I, J, K, L, M, N, O>>;
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
  ): Select<RowTypeByColumns<A, B, C, D, E, F, G, H, I, J, K, L, M, N, O, P>>;
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
    RowTypeByColumns<A, B, C, D, E, F, G, H, I, J, K, L, M, N, O, P, Q>
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
    RowTypeByColumns<A, B, C, D, E, F, G, H, I, J, K, L, M, N, O, P, Q, R>
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
    RowTypeByColumns<A, B, C, D, E, F, G, H, I, J, K, L, M, N, O, P, Q, R, S>
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
    RowTypeByColumns<A, B, C, D, E, F, G, H, I, J, K, L, M, N, O, P, Q, R, S, T>
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
    RowTypeByColumns<
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
    RowTypeByColumns<
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
    RowTypeByColumns<
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
    RowTypeByColumns<
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
    RowTypeByColumns<
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
    RowTypeByColumns<
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
  (...exprs: CompatibleExpression[]): Select<any>;
  <T extends RowObject>(
    ...columns: (SelectColumn | CompatibleExpression | Star<any>)[]
  ): Select<T>;
};

/**
 * 函数调用表达式
 */
export class ScalarFuncInvoke<
  TReturn extends Scalar = any
> extends Expression<TReturn> {
  $func: Func<string>;
  $args: (Expression<Scalar> | BuiltIn<string> | Star)[];
  readonly $type: SQL_SYMBOLE.SCALAR_FUNCTION_INVOKE =
    SQL_SYMBOLE.SCALAR_FUNCTION_INVOKE;

  // TODO: 是否需参数的类型判断，拦截ValuedSelect之类的表达式进入？
  constructor(
    func: Name<string> | Func<string>,
    args: (CompatibleExpression<Scalar> | BuiltIn<string> | Star)[]
  ) {
    super();
    this.$func = ensureFunction(func);
    this.$args = args.map(expr => {
      if (isScalar(expr)) return ensureExpression(expr);
      return expr;
    });
  }
}

export class TableFuncInvoke<
  TReturn extends RowObject = any
> extends Rowset<TReturn> {
  readonly $func: Func<string>;
  readonly $args: (Expression<Scalar> | Star | BuiltIn)[];
  readonly $type: SQL_SYMBOLE.TABLE_FUNCTION_INVOKE =
    SQL_SYMBOLE.TABLE_FUNCTION_INVOKE;

  constructor(
    func: Name<string> | Func<string>,
    args: (CompatibleExpression<Scalar> | BuiltIn<string> | Star)[]
  ) {
    super();
    this.$func = ensureFunction(func);
    this.$args = args.map(expr =>
      isScalar(expr) ? ensureExpression(expr) : expr
    );
  }
}

/**
 * SQL 语句
 */
export abstract class Statement extends AST {
  $type:
    | SQL_SYMBOLE.SELECT
    | SQL_SYMBOLE.UPDATE
    | SQL_SYMBOLE.INSERT
    | SQL_SYMBOLE.EXECUTE
    | SQL_SYMBOLE.DELETE
    | SQL_SYMBOLE.DECLARE
    | SQL_SYMBOLE.RAW
    | SQL_SYMBOLE.ASSIGNMENT;
  /**
   * 插入至表,into的别名
   * @param table
   * @param fields
   */
  static insert<T extends RowObject = any>(
    table: CompatibleTable<T, string>,
    fields?: FieldsOf<T>[] | Field<Scalar, FieldsOf<T>>[]
  ): Insert<T> {
    return new Insert(table, fields);
  }

  /**
   * 插入至表,into的别名
   * @param table
   * @param fields
   */
  static identityInsert<T extends RowObject = any>(
    table: CompatibleTable<T, string>,
    fields?: FieldsOf<T>[] | Field<Scalar, FieldsOf<T>>[]
  ): Insert<T> {
    return new Insert(table, fields).withIdentity();
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

  static select: SelectAction = (...args: any[]): any => {
    return new Select(...args);
  };

  static raw(sql: string): any {
    return new Raw(sql);
  }

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
  static execute<R extends Scalar = any, O extends RowObject[] = []>(
    proc: Name<string> | Procedure<R, O, string>,
    params?: CompatibleExpression<Scalar>[]
    // | Parameter<JsConstant, string>[] | InputObject
  ): Execute<R, O> {
    return new Execute(proc, params);
  }

  static invokeTableFunction<T extends RowObject = any>(
    func: Name<string> | Func<string>,
    args: CompatibleExpression<Scalar>[]
  ): ProxiedRowset<T> {
    return makeProxiedRowset(new TableFuncInvoke<T>(func, args));
  }

  static invokeScalarFunction<T extends Scalar = any>(
    func: Name<string> | Func<string>,
    args: CompatibleExpression<Scalar>[]
  ): ScalarFuncInvoke<T> {
    return new ScalarFuncInvoke<T>(func, args);
  }

  static makeFunc<T extends RowObject>(
    type: 'table',
    name: Name<string>,
    builtIn?: boolean
  ): () => ProxiedRowset<T>;
  static makeFunc<T extends RowObject, A1 extends CompatibleExpression>(
    type: 'table',
    name: Name<string>,
    builtIn?: boolean
  ): (arg1: A1) => ProxiedRowset<T>;
  static makeFunc<
    T extends RowObject,
    A1 extends CompatibleExpression,
    A2 extends CompatibleExpression
  >(
    type: 'table',
    name: Name<string>,
    builtIn?: boolean
  ): (arg1: A1, arg2: A2) => ProxiedRowset<T>;
  static makeFunc<
    T extends RowObject,
    A1 extends CompatibleExpression,
    A2 extends CompatibleExpression,
    A3 extends CompatibleExpression
  >(
    type: 'table',
    name: Name<string>,
    builtIn?: boolean
  ): (arg1: A1, arg2: A2, arg3: A3) => ProxiedRowset<T>;
  static makeFunc<
    T extends RowObject,
    A1 extends CompatibleExpression,
    A2 extends CompatibleExpression,
    A3 extends CompatibleExpression,
    A4 extends CompatibleExpression
  >(
    type: 'table',
    name: Name<string>,
    builtIn?: boolean
  ): (arg1: A1, arg2: A2, arg3: A3, arg4: A4) => ProxiedRowset<T>;
  static makeFunc<
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
  ): (arg1: A1, arg2: A2, arg3: A3, arg4: A4, arg5: A5) => ProxiedRowset<T>;

  static makeFunc(
    type: 'table',
    name: Name<string>,
    builtIn?: boolean
  ): (...args: CompatibleExpression[]) => ProxiedRowset<any>;

  static makeFunc<T extends Scalar>(
    type: 'scalar',
    name: Name<string>,
    builtIn?: boolean
  ): () => Expression<T>;
  static makeFunc<T extends Scalar, A1 extends CompatibleExpression>(
    type: 'scalar',
    name: Name<string>,
    builtIn?: boolean
  ): (arg1: A1) => Expression<T>;
  static makeFunc<
    T extends Scalar,
    A1 extends CompatibleExpression,
    A2 extends CompatibleExpression
  >(
    type: 'scalar',
    name: Name<string>,
    builtIn?: boolean
  ): (arg1: A1, arg2: A2) => Expression<T>;
  static makeFunc<
    T extends Scalar,
    A1 extends CompatibleExpression,
    A2 extends CompatibleExpression,
    A3 extends CompatibleExpression
  >(
    type: 'scalar',
    name: Name<string>,
    builtIn?: boolean
  ): (arg1: A1, arg2: A2, arg3: A3) => Expression<T>;
  static makeFunc<
    T extends Scalar,
    A1 extends CompatibleExpression,
    A2 extends CompatibleExpression,
    A3 extends CompatibleExpression,
    A4 extends CompatibleExpression
  >(
    type: 'scalar',
    name: Name<string>,
    builtIn?: boolean
  ): (arg1: A1, arg2: A2, arg3: A3, arg4: A4) => Expression<T>;
  static makeFunc<
    T extends Scalar,
    A1 extends CompatibleExpression,
    A2 extends CompatibleExpression,
    A3 extends CompatibleExpression,
    A4 extends CompatibleExpression,
    A5 extends CompatibleExpression
  >(
    type: 'scalar',
    name: Name<string>,
    builtIn?: boolean
  ): (arg1: A1, arg2: A2, arg3: A3, arg4: A4, arg5: A5) => Expression<T>;

  static makeFunc(
    type: 'scalar',
    name: Name<string>,
    builtIn?: boolean
  ): (...args: CompatibleExpression[]) => Expression<any>;

  static makeFunc(
    type: 'table' | 'scalar',
    name: Name<string>,
    builtIn = false
  ): (
    ...args: CompatibleExpression[]
  ) => Expression | ProxiedRowset<RowObject> {
    if (type === 'table') {
      return function (
        ...args: CompatibleExpression[]
      ): ProxiedRowset<RowObject> {
        return Statement.invokeTableFunction(
          Identifier.func(name, builtIn),
          args
        );
      };
    }
    if (type === 'scalar') {
      return function (...args: CompatibleExpression<Scalar>[]): Expression {
        return Statement.invokeScalarFunction<Scalar>(
          Identifier.func(name, builtIn),
          args
        );
      };
    }
    throw new Error('invalid arg value of `type`');
  }

  /**
   * 创建一个可供JS调用的存储过程
   */
  static makeProc<R extends Scalar = number, O extends RowObject[] = []>(
    name: Name<string>,
    builtIn?: boolean
  ): () => Execute<R, O>;
  static makeProc<
    A1 extends CompatibleExpression,
    R extends Scalar = number,
    O extends RowObject[] = []
  >(name: Name<string>, builtIn?: boolean): (arg1: A1) => Execute<R, O>;
  static makeProc<
    A1 extends CompatibleExpression,
    A2 extends CompatibleExpression,
    R extends Scalar = number,
    O extends RowObject[] = []
  >(
    name: Name<string>,
    builtIn?: boolean
  ): (arg1: A1, arg2: A2) => Execute<R, O>;
  static makeProc<
    A1 extends CompatibleExpression,
    A2 extends CompatibleExpression,
    A3 extends CompatibleExpression,
    R extends Scalar = number,
    O extends RowObject[] = []
  >(
    name: Name<string>,
    builtIn?: boolean
  ): (arg1: A1, arg2: A2, arg3: A3) => Execute<R, O>;
  static makeProc<
    A1 extends CompatibleExpression,
    A2 extends CompatibleExpression,
    A3 extends CompatibleExpression,
    A4 extends CompatibleExpression,
    R extends Scalar = number,
    O extends RowObject[] = []
  >(
    name: Name<string>,
    builtIn?: boolean
  ): (arg1: A1, arg2: A2, arg3: A3, arg4: A4) => Execute<R, O>;
  static makeProc<
    A1 extends CompatibleExpression,
    A2 extends CompatibleExpression,
    A3 extends CompatibleExpression,
    A4 extends CompatibleExpression,
    A5 extends CompatibleExpression,
    R extends Scalar = number,
    O extends RowObject[] = []
  >(
    name: Name<string>,
    builtIn?: boolean
  ): (arg1: A1, arg2: A2, arg3: A3, arg4: A4, arg5: A5) => Execute<R, O>;

  static makeProc(
    name: Name<string>,
    builtIn?: boolean
  ): (...args: CompatibleExpression[]) => Expression<any>;

  static makeProc(
    name: Name<string>,
    builtIn = false
  ): (...args: CompatibleExpression[]) => void {
    return function (
      ...args: CompatibleExpression<Scalar>[]
    ): Execute<any, any> {
      return Statement.execute(
        Identifier.proc<Scalar, any, string>(name, builtIn),
        args
      );
    };
  }

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
  static declare(...declares: VariantDeclare[]): Declare {
    return new Declare(...declares);
  }

  /**
   * WHEN 语句块
   * @param expr
   * @param value
   */
  static when<T extends Scalar>(
    expr: CompatibleExpression<Scalar>,
    value?: CompatibleExpression<T>
  ): When<T> {
    return new When(expr, value);
  }

  static case<T extends Scalar>(expr?: CompatibleExpression): Case<T> {
    return new Case<T>(expr);
  }

  /**
   * With语句
   */
  static with(...rowsets: CompatibleNamedSelect[]): With;
  static with(rowsets: Record<string, Select>): With;
  static with(...rowsets: any): With {
    if (rowsets.length === 1 && isPlainObject(rowsets)) {
      return new With(rowsets[0]);
    }
    return new With(rowsets);
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

  static invoke<T extends RowObject>(
    type: 'table',
    name: Name<string>,
    builtIn?: boolean
  ): () => ProxiedRowset<T>;
  static invoke<T extends RowObject, A1 extends CompatibleExpression>(
    type: 'table',
    name: Name<string>,
    builtIn?: boolean
  ): (arg1: A1) => ProxiedRowset<T>;
  static invoke<
    T extends RowObject,
    A1 extends CompatibleExpression,
    A2 extends CompatibleExpression
  >(
    type: 'table',
    name: Name<string>,
    builtIn?: boolean
  ): (arg1: A1, arg2: A2) => ProxiedRowset<T>;
  static invoke<
    T extends RowObject,
    A1 extends CompatibleExpression,
    A2 extends CompatibleExpression,
    A3 extends CompatibleExpression
  >(
    type: 'table',
    name: Name<string>,
    builtIn?: boolean
  ): (arg1: A1, arg2: A2, arg3: A3) => ProxiedRowset<T>;
  static invoke<
    T extends RowObject,
    A1 extends CompatibleExpression,
    A2 extends CompatibleExpression,
    A3 extends CompatibleExpression,
    A4 extends CompatibleExpression
  >(
    type: 'table',
    name: Name<string>,
    builtIn?: boolean
  ): (arg1: A1, arg2: A2, arg3: A3, arg4: A4) => ProxiedRowset<T>;
  static invoke<
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
  ): (arg1: A1, arg2: A2, arg3: A3, arg4: A4, arg5: A5) => ProxiedRowset<T>;

  static invoke(
    type: 'table',
    name: Name<string>,
    builtIn?: boolean
  ): (...args: CompatibleExpression[]) => ProxiedRowset<any>;

  static invoke<T extends Scalar>(
    type: 'scalar',
    name: Name<string>,
    builtIn?: boolean
  ): () => Expression<T>;
  static invoke<T extends Scalar, A1 extends CompatibleExpression>(
    type: 'scalar',
    name: Name<string>,
    builtIn?: boolean
  ): (arg1: A1) => Expression<T>;
  static invoke<
    T extends Scalar,
    A1 extends CompatibleExpression,
    A2 extends CompatibleExpression
  >(
    type: 'scalar',
    name: Name<string>,
    builtIn?: boolean
  ): (arg1: A1, arg2: A2) => Expression<T>;
  static invoke<
    T extends Scalar,
    A1 extends CompatibleExpression,
    A2 extends CompatibleExpression,
    A3 extends CompatibleExpression
  >(
    type: 'scalar',
    name: Name<string>,
    builtIn?: boolean
  ): (arg1: A1, arg2: A2, arg3: A3) => Expression<T>;
  static invoke<
    T extends Scalar,
    A1 extends CompatibleExpression,
    A2 extends CompatibleExpression,
    A3 extends CompatibleExpression,
    A4 extends CompatibleExpression
  >(
    type: 'scalar',
    name: Name<string>,
    builtIn?: boolean
  ): (arg1: A1, arg2: A2, arg3: A3, arg4: A4) => Expression<T>;
  static invoke<
    T extends Scalar,
    A1 extends CompatibleExpression,
    A2 extends CompatibleExpression,
    A3 extends CompatibleExpression,
    A4 extends CompatibleExpression,
    A5 extends CompatibleExpression
  >(
    type: 'scalar',
    name: Name<string>,
    builtIn?: boolean
  ): (arg1: A1, arg2: A2, arg3: A3, arg4: A4, arg5: A5) => Expression<T>;

  static invoke(
    type: 'scalar',
    name: Name<string>,
    builtIn?: boolean
  ): (...args: CompatibleExpression[]) => Expression<any>;

  static invoke(
    type: 'table' | 'scalar',
    name: Name<string>,
    builtIn = false
  ): (
    ...args: CompatibleExpression[]
  ) => Expression | ProxiedRowset<RowObject> {
    if (type === 'table') {
      return function (
        ...args: CompatibleExpression[]
      ): ProxiedRowset<RowObject> {
        return Statement.invokeTableFunction(
          Identifier.func(name, builtIn),
          args
        );
      };
    }
    if (type === 'scalar') {
      return function (...args: CompatibleExpression<Scalar>[]): Expression {
        return Statement.invokeScalarFunction<Scalar>(
          Identifier.func(name, builtIn),
          args
        );
      };
    }
    throw new Error('invalid arg value of `type`');
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
export class When<T extends Scalar = any> extends AST {
  $expr: Expression<Scalar> | Condition;
  $value: Expression<T>;
  $type: SQL_SYMBOLE.WHEN = SQL_SYMBOLE.WHEN;

  constructor(
    expr: CompatibleExpression<Scalar> | Condition,
    then: CompatibleExpression<T>
  ) {
    super();
    if (expr instanceof Expression || expr instanceof Condition) {
      this.$expr = expr;
    }
    if (isScalar(expr)) {
      this.$expr = ensureExpression(expr as Scalar);
    } else {
      this.$expr = expr;
    }
    this.$value = ensureExpression(then);
  }
}

/**
 * CASE表达式
 */
export class Case<T extends Scalar = any> extends Expression<T> {
  $expr: Expression<any>;
  $whens: When<T>[];
  $default?: Expression<T>;
  $type: SQL_SYMBOLE.CASE = SQL_SYMBOLE.CASE;

  /**
   *
   * @param expr
   */
  constructor(expr?: CompatibleExpression<Scalar>) {
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
  else(defaults: CompatibleExpression<T>): this {
    this.$default = ensureExpression(defaults as CompatibleExpression<any>);
    return this;
  }

  /**
   * WHEN语句
   * @param expr
   * @param then
   */
  when(
    expr: CompatibleExpression<Scalar> | Condition,
    then: CompatibleExpression<T>
  ): this {
    this.$whens.push(new When(expr, then));
    return this;
  }
}

/**
 * 字面量表达式
 */
export class Literal<T extends Scalar = Scalar> extends Expression<T> {
  $type: SQL_SYMBOLE.LITERAL = SQL_SYMBOLE.LITERAL;

  /**
   * 实际值
   */
  $value: T;

  constructor(value: T) {
    super();
    this.$value = value;
  }
}

export class ParenthesesCondition extends Condition {
  $inner: Condition;

  readonly $kind: CONDITION_KIND.BRACKET_CONDITION =
    CONDITION_KIND.BRACKET_CONDITION;

  constructor(conditions: CompatibleCondition<any>) {
    super();
    this.$inner = ensureCondition(conditions);
  }
}

/**
 * 括号表达式
 */
export class ParenthesesExpression<
  T extends Scalar = Scalar
> extends Expression<T> {
  $type: SQL_SYMBOLE.BRACKET_EXPRESSION = SQL_SYMBOLE.BRACKET_EXPRESSION;
  $inner: Expression<T>;
  constructor(inner: CompatibleExpression<T>) {
    super();
    this.$inner = ensureExpression(inner);
  }
}

/**
 * 运算表达式基类
 */
export abstract class Operation<
  T extends Scalar = Scalar
> extends Expression<T> {
  readonly $type: SQL_SYMBOLE.OPERATION = SQL_SYMBOLE.OPERATION;
  readonly $kind: OPERATION_KIND;
  $operator: OPERATION_OPERATOR;
}

/**
 * 二元运算表达式
 */
export class BinaryOperation<T extends Scalar = Scalar> extends Operation<T> {
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
    left: CompatibleExpression<T>,
    right: CompatibleExpression<T>
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
export class UnaryOperation<T extends Scalar = Scalar> extends Operation<T> {
  readonly $value: Expression<Scalar>;
  readonly $kind: OPERATION_KIND.UNARY = OPERATION_KIND.UNARY;
  readonly $operator: UNARY_OPERATION_OPERATOR;

  /**
   * 一元运算
   * @param value
   */
  constructor(
    operator: UNARY_OPERATION_OPERATOR,
    value: CompatibleExpression<Scalar>
  ) {
    super();
    this.$operator = operator;
    this.$value = ensureExpression(value);
  }
}

/**
 * 联接查询
 */
export class Union<T extends RowObject = any> extends AST {
  $select: Select<T>;
  $all: boolean;
  $type: SQL_SYMBOLE.UNION = SQL_SYMBOLE.UNION;
  $isRecurse: boolean;

  /**
   *
   * @param select SELECT语句
   * @param all 是否所有查询
   */
  constructor(select: Select<T>, all = false) {
    super();
    this.$select = select;
    this.$all = all;
  }
}

/**
 * 排序对象
 */
export type SortObject<T extends RowObject = any> = {
  [K in FieldsOf<T>]?: SORT_DIRECTION;
};

abstract class Fromable<T extends RowObject = any> extends CrudStatement {
  $froms?: Rowset<any>[];
  $joins?: Join[];
  $where?: Condition;

  /**
   * 从表中查询，可以查询多表
   * @param tables
   */
  from(...tables: (Name<string> | CompatibleRowset<any, string>)[]): this {
    this.$froms = tables.map(table => ensureRowset(table));
    this.$froms.forEach(table => {
      if (!table.$alias) {
        if (!(table as any).$name) {
          throw new Error('行集必须指定别名才可以进行FROM查询');
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
  join<T extends RowObject = any>(
    table: Name<string> | CompatibleRowset<T>,
    on: Condition,
    left?: boolean
  ): this {
    assert(this.$froms, 'join must after from clause');
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
  leftJoin<T extends RowObject = any>(
    table: Name<string> | CompatibleRowset<T>,
    on: Condition
  ): this {
    return this.join(table, on, true);
  }

  /**
   * where查询条件
   * @param condition
   */
  where(condition: CompatibleCondition<T>) {
    assert(!this.$where, 'where is declared');
    if (isPlainObject(condition)) {
      condition = ensureCondition(condition);
    }
    this.$where = condition as Condition;
    return this;
  }
}

export class SortInfo extends AST {
  $type: SQL_SYMBOLE.SORT = SQL_SYMBOLE.SORT;
  $expr: Expression<Scalar>;
  $direction?: SORT_DIRECTION;
  constructor(expr: CompatibleExpression<Scalar>, direction?: SORT_DIRECTION) {
    super();
    this.$expr = ensureExpression(expr);
    this.$direction = direction;
  }
}

/**
 * SELECT查询
 */
export class Select<T extends RowObject = any> extends Fromable {
  $top?: number;
  $offset?: number;
  $limit?: number;
  $distinct?: boolean;
  $columns: (Expression<Scalar> | SelectColumn<Scalar, string> | Star<any>)[];
  $sorts?: SortInfo[];
  $groups?: Expression<any>[];
  $having?: Condition;
  $union?: Union<T>;

  readonly $type: SQL_SYMBOLE.SELECT = SQL_SYMBOLE.SELECT;

  constructor(results?: InputObject<T>);
  constructor(
    ...columns: (
      | CompatibleExpression<Scalar>
      | SelectColumn<Scalar, string>
      | Star<any>
    )[]
  );
  constructor(...columns: any) {
    super();
    assert(
      columns.length > 0,
      'Must select one or more columns by Select statement.'
    );
    if (columns.length === 1 && isPlainObject(columns[0])) {
      const results = columns[0];
      this.$columns = Object.entries(results as InputObject<T>).map(
        ([name, expr]: [string, CompatibleExpression]) => {
          return new SelectColumn(name, ensureExpression(expr));
        }
      );
      return;
    }
    // 实例化
    this.$columns = (
      columns as (CompatibleExpression<Scalar> | SelectColumn<Scalar, string>)[]
    ).map(item => {
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
  orderBy(
    sorts:
      | SortObject<T>
      | (
          | SortInfo
          | CompatibleExpression<Scalar>
          | [CompatibleExpression, SORT_DIRECTION]
        )[]
  ): this;
  orderBy(
    ...sorts: (
      | SortInfo
      | CompatibleExpression<Scalar>
      | [CompatibleExpression, SORT_DIRECTION]
    )[]
  ): this;
  orderBy(sorts: CompatibleSortInfo): this;
  orderBy(...args: any[]): this {
    // assert(!this.$orders, 'order by clause is declared')
    assert(args.length > 0, 'must have one or more order basis');
    // 如果传入的是对象类型
    if (args.length === 1) {
      if (isPlainObject(args[0])) {
        const obj = args[0];
        this.$sorts = Object.entries(obj).map(
          ([expr, direction]) => new SortInfo(expr, direction as SORT_DIRECTION)
        );
        return this;
      }
      if (Array.isArray(args[0])) {
        args = args[0];
      }
    }
    const sorts = args as (
      | SortInfo
      | CompatibleExpression<Scalar>
      | [CompatibleExpression, SORT_DIRECTION]
    )[];
    this.$sorts = sorts.map(item =>
      isSortInfo(item)
        ? item
        : isScalar(item) || isExpression(item)
        ? new SortInfo(item as CompatibleExpression<Scalar>)
        : new SortInfo(item[0], item[1])
    );
    return this;
  }

  /**
   * 分组查询
   * @param groups
   */
  groupBy(...groups: CompatibleExpression<Scalar>[]) {
    this.$groups = groups.map(expr => ensureExpression(expr));
    return this;
  }

  /**
   * Having 子句
   * @param condition
   */
  having(condition: CompatibleCondition<T>) {
    assert(!this.$having, 'having is declared');
    assert(this.$groups, 'Syntax error, group by is not declared.');
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
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    let sel: Select<any> = this;
    // 查找最末端的select，将union关联到最末端select语句中
    while (sel.$union) {
      sel = sel.$union.$select;
    }
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
  as<TAlias extends string>(alias: TAlias): Proxied<NamedSelect<T>> {
    return makeProxiedRowset(new NamedSelect(this, alias)) as any;
  }

  /**
   * 将本次查询结果转换为值
   */
  asValue<V extends Scalar = AsScalarType<T>>() {
    return new ValuedSelect<V>(this);
  }

  asColumn<N extends string>(name: N) {
    return this.asValue().as(name);
  }
}

/**
 * 表达式化后的SELECT语句，通常用于 in 语句，或者当作值当行值使用
 */
export class ValuedSelect<T extends Scalar = Scalar> extends Expression<T> {
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
export class Insert<T extends RowObject = any> extends CrudStatement {
  $table: Table<T, string>;
  $fields?: Field[];
  $values: Expression<Scalar>[][] | Select<T>;
  $identityInsert: boolean = false;

  readonly $type: SQL_SYMBOLE.INSERT = SQL_SYMBOLE.INSERT;

  /**
   * 在插入数据时开启标识列插入，即IdentityInsert On
   * @returns
   */
  withIdentity() {
    this.$identityInsert = true;
    return this;
  }

  /**
   * 构造函数
   */
  constructor(
    table: CompatibleTable<T, string>,
    fields?: Field<Scalar, FieldsOf<T>>[] | FieldsOf<T>[]
  ) {
    super();
    this.$identityInsert = false;
    this.$table = ensureRowset(table) as Table<T, string>;
    if (this.$table.$alias) {
      throw new Error('Insert statements do not allow aliases on table.');
    }
    if (fields) {
      if (typeof fields[0] === 'string') {
        this.$fields = (fields as FieldsOf<T>[]).map(field =>
          this.$table.field(field)
        );
      } else {
        this.$fields = fields as Field<Scalar, FieldsOf<T>>[];
      }
    }
  }

  private _values(items: InputObject<T>[]): Expression[][] {
    if (!this.$fields) {
      const existsFields: { [key: string]: true } = {};
      items.forEach(item =>
        Object.keys(item).forEach(field => {
          if (!existsFields[field]) existsFields[field] = true;
        })
      );
      this.$fields = (Object.keys(existsFields) as FieldsOf<T>[]).map(
        fieldName => {
          return this.$table.field(fieldName);
        }
      );
    }
    const fields = this.$fields.map(field => pickName(field.$name));

    return items.map((item: any) => {
      return fields.map(fieldName => ensureExpression(item[fieldName]));
    });
  }

  values(
    rows:
      | Select<T>
      | InputObject<T>
      | InputObject<T>[]
      | CompatibleExpression<Scalar>[]
      | CompatibleExpression<Scalar>[][]
  ): this;
  values(...rows: CompatibleExpression<Scalar>[][] | InputObject<T>[]): this;
  values(...args: any[]): this {
    assert(!this.$values, 'values is declared');
    assert(args.length > 0, 'rows must more than one elements.');
    const values:
      | Select<T>
      | InputObject<T>
      | InputObject<T>[]
      | CompatibleExpression<Scalar>[]
      | CompatibleExpression<Scalar>[][] = args.length > 1 ? args : args[0];

    // Select<T>
    if (isSelect(values)) {
      this.$values = values;
      return this;
    }

    // InputObject<T>
    if (!Array.isArray(values)) {
      this.$values = this._values([values]);
      return this;
    }

    assert(values.length > 0, 'rows must more than one elements.');

    // CompatibleExpression[][]
    if (Array.isArray(values[0])) {
      this.$values = (values as CompatibleExpression[][]).map(row =>
        row.map(exp => ensureExpression(exp))
      );
      return this;
    }

    // CompatibleExpression[]
    if (isScalar(values[0]) || isExpression(values[0])) {
      this.$values = [
        (values as CompatibleExpression[]).map(exp => ensureExpression(exp)),
      ];
      return this;
    }

    // InputObject<T>[]
    this.$values = this._values(values as InputObject<T>[]);
    return this;

    // values(items: InputObject[])
    // 字段从值中提取
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
export class Update<T extends RowObject = any> extends Fromable<T> {
  $table: Table<T, string>;
  $sets: Assignment<Scalar>[];

  readonly $type: SQL_SYMBOLE.UPDATE = SQL_SYMBOLE.UPDATE;

  constructor(table: CompatibleTable<T, string>) {
    super();
    const tb = ensureRowset(table);
    if (tb.$alias) {
      this.from(tb);
    }
    this.$table = tb as Table<T>;
  }

  /**
   * @param sets
   */
  set(sets: InputObject<T> | Assignment<Scalar>[]): this;
  set(...sets: Assignment<Scalar>[]): this;
  set(
    ...sets: [InputObject<T> | Assignment<Scalar>[]] | Assignment<Scalar>[]
  ): this {
    assert(!this.$sets, 'set statement is declared');
    assert(sets.length > 0, 'sets must have more than 0 items');
    if (sets.length === 1) {
      if (Array.isArray(sets[0])) {
        this.$sets = sets[0] as Assignment<Scalar>[];
        return this;
      } else {
        const item = sets[0] as InputObject<T>;
        this.$sets = Object.entries(item).map(
          ([key, value]: [string, CompatibleExpression]) =>
            new Assignment(
              this.$table.field(key as any),
              ensureExpression(value)
            )
        );
        return this;
      }
    }
    this.$sets = sets as Assignment<Scalar>[];
  }
}

export class Delete<T extends RowObject = any> extends Fromable<T> {
  $table: Table<T, string>;
  $type: SQL_SYMBOLE.DELETE = SQL_SYMBOLE.DELETE;

  constructor(table?: CompatibleTable<T, string>) {
    super();
    if (table) {
      this.$table = ensureRowset(table) as Table<T, string>;
    }
    // if (options?.table) this.from(options.table)
    // if (options?.joins) this.$joins = options.joins
    // if (options?.where) this.where(options.where)
  }

  // /**
  //  * 从表中查询，可以查询多表
  //  * @param tables
  //  */
  // from(...tables: (Name<string> | Rowset<any> | Table<any, string>)[]): this {
  //   super.from(...tables);
  //   // 如果未指定要删除的表，则必须指定
  //   if (!this.$table) {
  //     this.$table = this.$froms[0] as Table<T, string>;
  //   }
  //   return this;
  // }
}

/**
 * @param N 存储过程名称
 * @param R 返回值
 * @param O 输出行集
 */
export class Procedure<
  R extends Scalar = number,
  O extends RowObject[] = [],
  N extends string = string,
  P1 extends Scalar = never,
  P2 extends Scalar = never,
  P3 extends Scalar = never,
  P4 extends Scalar = never,
  P5 extends Scalar = never,
  P6 extends Scalar = never,
  P7 extends Scalar = never,
  P8 extends Scalar = never,
  P9 extends Scalar = never,
  P10 extends Scalar = never,
  P11 extends Scalar = never,
  P12 extends Scalar = never
> extends Identifier<N> {
  $kind: IDENTOFIER_KIND.PROCEDURE = IDENTOFIER_KIND.PROCEDURE;

  execute(...params: [CompatibleExpression<P1>]): Execute<R>;
  execute(...params: Parameter<Scalar, string>[]): Execute<R>;
  execute(params: InputObject): Execute<R>;
  execute(
    ...params:
      | [InputObject]
      | Parameter<Scalar, string>[]
      | CompatibleExpression<Scalar>[]
  ): Execute<R, O> {
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
export class Execute<
  R extends Scalar = any,
  O extends RowObject[] = []
> extends Statement {
  readonly $proc: Procedure<R, O, string>;
  readonly $args: Expression<Scalar>[];
  // | NamedArgument<JsConstant, string>[];
  readonly $type: SQL_SYMBOLE.EXECUTE = SQL_SYMBOLE.EXECUTE;

  // constructor(proc: Name<string> | Procedure<T, string>, params?: InputObject);
  constructor(
    proc: Name<string> | Procedure<R, O, string>,
    params?: CompatibleExpression<Scalar>[] // | InputObject
  ) {
    super();
    this.$proc = ensureProcedure(proc);
    // if (!Array.isArray(params)) {
    //   this.$args = Object.entries(params).map(
    //     ([name, expr]) => new NamedArgument(name, expr)
    //   );
    // } else
    // if (params[0] instanceof Parameter) {
    //   this.$args = params as Parameter<ScalarType, string>[]
    // } else {
    this.$args = (params as CompatibleExpression<Scalar>[]).map(expr =>
      ensureExpression(expr)
    );
    // }
  }
}

/**
 * 赋值语句
 */
export class Assignment<T extends Scalar = Scalar> extends Statement {
  left: Assignable<T>;
  right: Expression<T>;
  $type: SQL_SYMBOLE.ASSIGNMENT = SQL_SYMBOLE.ASSIGNMENT;

  constructor(left: Assignable<T>, right: CompatibleExpression<T>) {
    super();
    this.left = left;
    this.right = ensureExpression(right);
  }
}

export class VariantDeclare extends AST {
  readonly $type: SQL_SYMBOLE.VARAINT_DECLARE = SQL_SYMBOLE.VARAINT_DECLARE;

  constructor(name: Variant | string, dataType: DbType) {
    super();
    this.$name = ensureVariant(name);
    this.$dataType = dataType;
  }

  $name: Variant;
  $dataType: DbType;
}

export class TableVariantDeclare<T extends RowObject = any> extends AST {
  readonly $type: SQL_SYMBOLE.TABLE_VARIANT_DECLARE =
    SQL_SYMBOLE.TABLE_VARIANT_DECLARE;

  constructor(name: TableVariant<T> | string, schema: TableSchema) {
    super();
    this.$name = ensureTableVariant(name);
    this.$schema = schema;
  }

  $name: TableVariant;
  $schema: Omit<TableSchema, 'name'>;
}

/**
 * 声明语句，暂时只支持变量声明
 */
export class Declare extends Statement {
  $declares: (VariantDeclare | TableVariantDeclare)[];
  readonly $type: SQL_SYMBOLE.DECLARE = SQL_SYMBOLE.DECLARE;
  constructor(...declares: (VariantDeclare | TableVariantDeclare)[]) {
    super();
    this.$declares = declares;
  }
}

/**
 * 程序与数据库间传递值所使用的参数
 */
export class Parameter<T extends Scalar = any, N extends string = string>
  extends Expression<T>
  implements Identifier<N>
{
  $name: N;
  $builtin = false;
  $type: SQL_SYMBOLE.IDENTIFIER = SQL_SYMBOLE.IDENTIFIER;
  $kind: IDENTOFIER_KIND.PARAMETER = IDENTOFIER_KIND.PARAMETER;
  get name() {
    return this.$name;
  }
  direction: PARAMETER_DIRECTION;
  type: DbType;
  value: T;

  // constructor (name: N, value?: T)
  // constructor (
  //   name: N,
  //   type: DbType,
  //   value?: T,
  //   direction?: PARAMETER_DIRECTION
  // )
  constructor(
    name: N,
    type?: DbType,
    value?: T,
    direction: PARAMETER_DIRECTION = PARAMETER_DIRECTION.INPUT
  ) {
    super();
    if (!type && (value === null || value === undefined)) {
      throw new Error('Parameter must assign one of `value` or `type`.');
    }

    this.type = type ? type : parseValueType(value);
    this.$name = name;
    this.value = value; // ensureConstant(value)
    this.direction = direction;
  }

  /**
   * input 参数
   */
  static input<T extends Scalar, N extends string>(
    name: N,
    value: T,
    type?: DbTypeOf<T>
  ): Parameter<T, N> {
    return new Parameter(name, type, value, PARAMETER_DIRECTION.INPUT);
  }

  /**
   * output参数
   */
  static output<T extends DbType, N extends string>(
    name: N,
    type: T,
    value?: TsTypeOf<T>
  ): Parameter<TsTypeOf<T>, N> {
    return new Parameter(name, type, value, PARAMETER_DIRECTION.OUTPUT);
  }
}

// applyMixins(Parameter, [Identifier]);

/**
 * SQL 文档
 */
export class Document extends AST {
  statements: Statement[];
  $type: SQL_SYMBOLE.DOCUMENT = SQL_SYMBOLE.DOCUMENT;

  constructor(statements: Statement[]) {
    super();
    this.statements = statements;
  }

  append(sql: Statement) {
    this.statements.push(sql);
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
  T extends RowObject = any,
  A extends string = string
> extends Rowset<T> {
  readonly $type = SQL_SYMBOLE.NAMED_SELECT;
  $inWith: boolean;
  $select: Select<T>;
  $alias: Alias<A>;

  constructor(statement: Select<T>, alias: A, inWith = false) {
    super();
    super.as(alias);
    this.$select = statement;
    this.$inWith = inWith;
  }

  /**
   * 将别名再进行别名化
   */
  as<N extends string>(alias: N): ProxiedTable<T> {
    // if (!this.$inWith) {
    //   throw new Error('Not allow operation `as` without WithItem');
    // }
    return makeProxiedRowset(new Table<T>(this.$alias.$name).as(alias));
  }
}

// /**
//  * 具名SELECT语句，可用于子查询，With语句等
//  */
// export class WithSelect<
//   T extends RowObject = any,
//   A extends string = string
//   > extends NamedSelect<T> {
//   readonly $type = SQL_SYMBOLE.WITH_SELECT;
//   $select: Select<T>;
//   $alias: Alias<A>;

//   constructor(statement: Select<T>, alias: A) {
//     super();
//     this.as(alias);
//     this.$select = statement;
//   }
// }

export type SelectAliasObject = {
  [alias: string]: Select;
};

export class With extends AST {
  $type: SQL_SYMBOLE.WITH = SQL_SYMBOLE.WITH;

  $rowsets: NamedSelect<any, string>[];

  /**
   * With结构
   */
  constructor(items: NamedSelect<any, string>[] | SelectAliasObject) {
    super();
    if (Array.isArray(items)) {
      this.$rowsets = items;
    } else {
      this.$rowsets = Object.entries(items).map(
        ([alias, sel]) => new NamedSelect(sel, alias)
      );
    }
    this.$rowsets.forEach(item => {
      item.$inWith = true;
    });
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
  insert<T extends RowObject = any>(
    table: Name<string> | CompatibleTable<T, string>,
    fields?: FieldsOf<T>[] | Field<Scalar, FieldsOf<T>>[]
  ): Insert<T> {
    const sql = Statement.insert(table, fields);
    sql.$with = this;
    return sql;
  }

  /**
   * 更新一个表格
   * @param table
   */
  update<T extends RowObject = any>(
    table: Name<string> | CompatibleTable<T, string>
  ): Update<T> {
    const sql = Statement.update(table);
    sql.$with = this;
    return sql;
  }

  /**
   * 删除一个表格
   * @param table 表格
   */
  delete<T extends RowObject = any>(
    table: Name<string> | CompatibleTable<T, string>
  ): Delete<T> {
    const sql = Statement.delete(table);
    sql.$with = this;
    return sql;
  }
}

// /**
//  * 类型转换运算符
//  */
// export class ConvertOperation<T extends Scalar = Scalar> extends Operation<T> {
//   $kind: OPERATION_KIND.CONVERT = OPERATION_KIND.CONVERT;
//   /**
//    * 转换到类型
//    */
//   $to: DbType;
//   $expr: Expression<Scalar>;
//   constructor(expr: CompatibleExpression<Scalar>, to: DbType) {
//     super();
//     this.$to = to;
//     this.$expr = ensureExpression(expr);
//   }
// }

// /**
//  * 标量类型名到类型的映射
//  */
// export type ScalarTypeNamesMap = {
//   string: string;
//   number: number;
//   float: number;
//   double: number;
//   integer: number;
//   long: number;
//   decimal: string;
//   date: Date;
//   datetime: Date;
//   boolean: boolean;
//   bigint: bigint;
//   binary: Binary;
// };

// /**
//  * 标量类型的字面量表达
//  */
// export type ScalarTypeNames = keyof ScalarTypeNamesMap;

// export type ScalarTypeByName<N extends ScalarTypeNames> = ScalarTypeNamesMap[N];
