import { Binary, Decimal, Scalar, Uuid } from './scalar';
import { CompatibleExpression, Expression } from './expression/expression';
import { Field, FieldTypeOf } from './expression/field';

/**
 * 简化后的whereObject查询条件
 */
export type WhereObject<T extends RowObject = DefaultInputObject> = {
  [K in ColumnsOf<T>]?:
    | CompatibleExpression<FieldTypeOf<T, K>>
    | CompatibleExpression<FieldTypeOf<T, K>>[];
};

export type CompatiblifyTuple<T extends Scalar[]> = {
  [P in keyof T]: T[P] extends Scalar ? CompatibleExpression<T[P]> : never;
};

/**
 * 取值结果集首个返回值类型运算
 */
export type AsScalarType<T extends RowObject> = T[ColumnsOf<T>] extends Scalar
  ? T[ColumnsOf<T>]
  : never;

export type DefaultRowObject = {
  [P in string]: Scalar;
};

export type DefaultInputObject = Record<string, Scalar>;

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

export type DbValueType<T extends Scalar | undefined> = T extends undefined
  ? Exclude<T, undefined> | null
  : T;

/**
 * 将对象类型转换为数据行类型
 */
export type DataRowType<T extends object> = {
  [P in ColumnsOf<T>]: DbValueType<T[P]>;
};

// export type RowObjectFrom<T extends InputObject> = T extends InputObject<infer R> ? R : DefaultInputObject;

/**
 * 从 SELECT(...Identitfier) 中查询的属性及类型
 * 将选择项，列、或者字段转换成Model类型
 */
export type RowObjectFrom<T extends InputObject> = {
  [P in keyof T]: TypeOf<T[P]>;
};

// eslint-disable-next-line @typescript-eslint/ban-types
export type RowObject = object;

/**
 * 值列表，用于传递Select、Insert、Update、Parameters 的键值对
 */
export type InputObject<T extends RowObject = DefaultInputObject> = {
  [K in ColumnsOf<T>]?: CompatibleExpression<T[K]>;
};

/**
 * 提取类型中的数据库有效字段，即类型为ScalarType的字段列表
 * 用于在智能提示时排除非数据库字段
 */
export type ColumnsOf<T> = Exclude<
  {
    [P in keyof T]: NonNullable<T[P]> extends Scalar ? P : never;
  }[keyof T],
  number | symbol
>;

export type AssertType<T, X extends Scalar> = T extends X ? X : never;

/**
 * 展开类型，将字面量(literal)类型扩展到标题(scalar)类型
 * 例： ExpandType<1> // => number;
 */
export type ExpandScalar<T extends Scalar> =
  | AssertType<T, string>
  | AssertType<T, number>
  | AssertType<T, bigint>
  | AssertType<T, Decimal>
  | AssertType<T, Date>
  | AssertType<T, Uuid>
  | AssertType<T, Binary>
  | AssertType<T, boolean>
  | AssertType<T, null>;

/**
 * 可空类型，对应数据库可空字段
 */
export type Nullable<T extends Scalar> = T | null;
