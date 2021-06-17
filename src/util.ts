/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Condition,
  CompatibleExpression,
  Expression,
  AST,
  Proxied,
  Func,
  Table,
  Field,
  Document,
  Assignment,
  BinaryOperation,
  ParenthesesExpression,
  BuiltIn,
  Case,
  SelectColumn,
  Literal,
  Declare,
  Delete,
  Execute,
  Identifier,
  Insert,
  NamedSelect,
  Operation,
  Parameter,
  Procedure,
  Raw,
  Rowset,
  ScalarFuncInvoke,
  Select,
  Star,
  Statement,
  TableFuncInvoke,
  TableVariant,
  UnaryOperation,
  Update,
  ValuedSelect,
  Variant,
  WhereObject,
  BinaryCompareCondition,
  BinaryLogicCondition,
  ExistsCondition,
  ParenthesesCondition,
  UnaryCompareCondition,
  UnaryLogicCondition,
  With,
  CrudStatement,
  SortInfo,
  ProxiedRowset,
  ProxiedTable,
  CompatibleRowset,
  FieldsOf,
  ProxiedNamedSelect,
  StandardExpression,
  VariantDeclare,
  TableVariantDeclare,
} from "./ast";

import {
  CONDITION_KIND,
  IDENTOFIER_KIND,
  OPERATION_KIND,
  $IsProxy,
  SQL_SYMBOLE,
} from "./constants";

import {
  Binary,
  DbType,
  EntityType,
  ListType,
  Name,
  PathedName,
  RowObject,
  Scalar,
  ScalarType,
} from "./types";

/**
 * 断言
 * @param except 预期结果
 * @param message 错误消息
 */
export function assert(except: any, message: string): asserts except {
  if (!except) {
    throw new Error(message);
  }
}

/**
 * 返回表达式
 */
export function ensureExpression<T extends Scalar>(
  expr: CompatibleExpression<T>
): Expression<T> {
  if (!(expr instanceof AST)) {
    return Expression.literal(expr);
  }
  return expr;
}

/**
 * 确保字段类型
 */
export function ensureField<T extends Scalar, N extends string>(
  name: Name<N> | Field<T, N>
): Field<T, N> {
  if (!(name instanceof AST)) {
    return new Field(name);
  }
  return name;
}

export function ensureVariant<T extends Scalar, N extends string>(
  name: N | Variant<T, N>
): Variant<T, N> {
  if (typeof name === "string") {
    return new Variant(name);
  }
  return name;
}

export function ensureTableVariant<T extends RowObject, N extends string>(
  name: N | TableVariant<T, N>
): TableVariant<T, N> {
  if (typeof name === "string") {
    return new TableVariant(name);
  }
  return name;
}

/**
 * 确保表格类型
 */
export function ensureRowset<TModel extends RowObject>(
  name: Name<string> | Table<TModel>
): Table<TModel>;
export function ensureRowset<TModel extends RowObject>(
  name: Name<string> | Rowset<TModel>
): Rowset<TModel>;
export function ensureRowset<TModel extends RowObject>(
  name: Name<string> | Rowset<TModel> | Table<TModel>
): Rowset<TModel> | Table<TModel> {
  if (name instanceof AST) return name;
  return new Table(name);
}

export function ensureProxiedRowset<T extends RowObject>(
  name: Name<string> | Table<T>
): ProxiedTable<T>;
export function ensureProxiedRowset<T extends RowObject>(
  name: Name<string> | Rowset<T>
): ProxiedRowset<T>;
export function ensureProxiedRowset<T extends RowObject>(
  name: Name<string> | Rowset<T> | Table<T>
): ProxiedRowset<T> | ProxiedTable<T> {
  if (isRowset(name)) {
    if (isProxiedRowset(name)) {
      return name;
    }
    return makeProxiedRowset(name);
  }
  const table = ensureRowset<T>(name);
  return makeProxiedRowset(table);
}

/**
 * 确保函数类型
 */
export function ensureFunction<TName extends string>(
  name: Name<TName> | Func<TName>
): Func<TName> {
  if (name instanceof AST) return name;
  return new Func(name);
}

/**
 * 确保标题函数类型
 */
export function ensureProcedure<
  R extends Scalar,
  O extends RowObject[] = [],
  N extends string = string
>(name: Name<N> | Procedure<R, O, N>): Procedure<R, O, N> {
  if (name instanceof AST) return name;
  return new Procedure(name);
}

/**
 * 通过一个对象创建一个对查询条件
 * 亦可理解为：转换managodb的查询条件到 ast
 * @param condition 条件表达式
 */
export function ensureCondition<T extends RowObject>(
  condition: Condition | WhereObject<T>,
  rowset?: CompatibleRowset<T>
): Condition {
  if (isCondition(condition)) return condition;

  let makeField: (name: string) => Field;
  if (rowset) {
    if (
      typeof rowset === "string" ||
      Array.isArray(rowset)
    ) {
      makeField = (key: string) =>
        new Field([
          ...(Array.isArray(rowset)
            ? rowset
            : [rowset]),
          key,
        ] as Name<string>);
    } else if (isRowset(rowset)) {
      makeField = (key: string) => (rowset as any).field(key);
    }
  } else {
    makeField = (key: string) => new Field(key);
  }

  const compares = Object.entries(condition).map(([key, value]) => {
    const field: Field<any, string> = makeField(key);
    if (value === null || value === undefined) {
      return field.isNull();
    }
    if (Array.isArray(value)) {
      return field.in(value);
    }
    return field.eq(value);
  });

  return compares.length >= 2 ? Condition.and(compares) : compares[0];
}

function makeProxied<T extends RowObject>(
  table: Table<T> | Rowset<T> | NamedSelect<T>
): ProxiedTable<T> | ProxiedRowset<T> | ProxiedNamedSelect<T> {
  return new Proxy(table, {
    get(target: any, key: string | symbol | number): any {
      /**
       * 标记为Proxy
       */
      if (key === $IsProxy) {
        return true;
      }

      const v = target[key];

      if (v !== undefined) return v;

      if (
        typeof key !== "string" ||
        v !== undefined
      ) {
        return v;
      }

      // const value = Reflect.get(target, prop);
      // if (value !== undefined) return value;
      if (key.startsWith("$")) {
        key = key.substring(1);
      }
      return target.field(key);
    },
  });
}

/**
 * 将制作rowset的代理，用于通过属性访问字段
 */
export function makeProxiedRowset<T extends RowObject>(
  rowset: Table<T>
): ProxiedTable<T>;
export function makeProxiedRowset<T extends RowObject>(
  rowset: Rowset<T>
): ProxiedRowset<T>;
export function makeProxiedRowset<T extends RowObject>(
  rowsetOrMetadata: Table<T> | Rowset<T>
): ProxiedTable<T> | ProxiedRowset<T> | ProxiedNamedSelect<T> {
  return makeProxied(rowsetOrMetadata);
}

export function isScalar(value: any): value is Scalar {
  return (
    typeof value === "string" ||
    typeof value === "boolean" ||
    typeof value === "bigint" ||
    typeof value === "number" ||
    value === null ||
    value === undefined ||
    value instanceof Date ||
    isBinary(value)
  );
}

export function isDbType(value: any): value is DbType {
  if (!value) return false;
  return !!Reflect.get(DbType, value.name);
}

export function isSortInfo(value: any): value is SortInfo {
  return value.$type === SQL_SYMBOLE.SORT;
}

export function isBinary(value: any): value is Binary {
  return (
    value instanceof ArrayBuffer ||
    value instanceof Uint8Array ||
    value instanceof Uint16Array ||
    value instanceof Uint32Array ||
    value instanceof BigUint64Array ||
    value instanceof Int8Array ||
    value instanceof Int16Array ||
    value instanceof Int32Array ||
    value instanceof BigInt64Array ||
    value instanceof Float32Array ||
    value instanceof Float64Array ||
    value instanceof Uint8ClampedArray ||
    value instanceof SharedArrayBuffer
  );
}

export function isProxiedRowset<T extends RowObject>(
  rowset: Rowset<T>
): rowset is ProxiedRowset<T> {
  return Reflect.get(rowset, $IsProxy) === true;
}

// export type Constructor<T> = {
//   new (...args: any): T;
// };

// export type MixinedConstructor<A, B, C = unknown, D = unknown, E = unknown> = {
//   new (): A & B & C & D & E;
// };

// /**
//  * 混入
//  */
// export function mixins<Base, A>(
//   baseCls: Constructor<Base>,
//   extend1: Constructor<A>
// ): MixinedConstructor<Base, A>;
// export function mixins<Base, A, B>(
//   baseCls: Constructor<Base>,
//   extend1: Constructor<A>,
//   extend2: Constructor<B>
// ): MixinedConstructor<Base, A, B>;
// export function mixins<Base, A, B, C>(
//   baseCls: Constructor<Base>,
//   extend1: Constructor<A>,
//   extend2: Constructor<B>,
//   extend3: Constructor<C>
// ): MixinedConstructor<Base, A, B, C>;
// export function mixins<Base, A, B, C, D>(
//   baseCls: Constructor<Base>,
//   extend1: Constructor<A>,
//   extend2: Constructor<B>,
//   extend3: Constructor<C>,
//   extend4: Constructor<D>
// ): MixinedConstructor<Base, A, B, C, D>;
// export function mixins(...classes: Constructor<any>[]): any {
//   const cls = class MixinedClass extends classes[0] {};
//   const proto: any = cls.prototype;
//   classes.forEach((fn) => {
//     Object.getOwnPropertyNames(fn.prototype).forEach((name) => {
//       /**
//        * 不改变构造函数
//        */
//       if (name !== "constructor") {
//         if (proto[name]) {
//           throw new Error(`在混入合并时，发现属性冲突！属性名：${name}`);
//         }
//         proto[name] = fn.prototype[name];
//       }
//     });
//   });
//   return cls;
// }

export function pickName(name: Name<string>): string {
  if (typeof name === "string") {
    return name;
  }
  return name[0];
}

export function pathName<T extends string>(name: Name<T>): PathedName<T> {
  if (typeof name === "string") {
    return [name];
  }
  return name;
}

export function isPlainObject(obj: any): boolean {
  return [Object.prototype, null].includes(Object.getPrototypeOf(obj));
}

function fix(num: number, digits: number): string {
  return num.toString().padStart(digits, "0");
}

export function dateToString(date: Date): string {
  return `${date.getFullYear()}-${fix(date.getMonth() + 1, 2)}-${fix(
    date.getDate(),
    2
  )}T${fix(date.getHours(), 2)}:${fix(date.getMinutes(), 2)}:${fix(
    date.getSeconds(),
    2
  )}.${fix(date.getMilliseconds(), 3)}${
    date.getTimezoneOffset() > 0 ? "-" : "+"
  }${fix(Math.abs(date.getTimezoneOffset() / 60), 2)}:00`;
}

export function isStandardExpression(value: any): value is StandardExpression {
  return value.$type === SQL_SYMBOLE.STANDARD_EXPRESSION;
}

export function isRaw(value: any): value is Raw {
  return value.$type === SQL_SYMBOLE.RAW;
}

export function isSelect(value: any): value is Select {
  return value.$type === SQL_SYMBOLE.SELECT;
}

export function isUpdate(value: any): value is Update {
  return value.$type === SQL_SYMBOLE.UPDATE;
}

export function isDelete(value: any): value is Delete {
  return value.$type === SQL_SYMBOLE.DELETE;
}

export function isInsert(value: any): value is Insert {
  return value.$type === SQL_SYMBOLE.INSERT;
}

export function isAssignment(value: any): value is Assignment {
  return value.$type === SQL_SYMBOLE.ASSIGNMENT;
}

export function isDeclare(value: any): value is Declare {
  return value.$type === SQL_SYMBOLE.DECLARE;
}

export function isExecute(value: any): value is Execute {
  return value.$type === SQL_SYMBOLE.EXECUTE;
}

export function isStatement(value: any): value is Statement {
  return (
    isSelect(value) ||
    isUpdate(value) ||
    isDelete(value) ||
    isInsert(value) ||
    isDeclare(value) ||
    isAssignment(value) ||
    isWith(value) ||
    isExecute(value)
  );
}

export function isCrudStatement(value: any): value is CrudStatement {
  return (
    isSelect(value) || isUpdate(value) || isDelete(value) || isInsert(value)
  );
}

export function isIdentifier(value: any): value is Identifier {
  return value?.$type === SQL_SYMBOLE.IDENTIFIER;
}

export function isTable(value: any): value is Table {
  return isIdentifier(value) && value.$kind === IDENTOFIER_KIND.TABLE;
}

export function isField(value: any): value is Field {
  return isIdentifier(value) && value.$kind === IDENTOFIER_KIND.FIELD;
}

export function isLiteral(value: any): value is Literal {
  return value?.$type === SQL_SYMBOLE.LITERAL;
}

export function isNamedSelect(value: any): value is NamedSelect {
  return value?.$type === SQL_SYMBOLE.NAMED_SELECT;
}

export function isWithSelect(value: any): value is NamedSelect {
  return isNamedSelect(value) && value.$inWith;
}

export function isWith(value: any): value is With {
  return value?.$type === SQL_SYMBOLE.WITH;
}

export function isTableFuncInvoke(value: any): value is TableFuncInvoke {
  return value?.$type === SQL_SYMBOLE.TABLE_FUNCTION_INVOKE;
}

export function isScalarFuncInvoke(value: any): value is ScalarFuncInvoke {
  return value?.$type === SQL_SYMBOLE.SCALAR_FUNCTION_INVOKE;
}

export function isTableVariant(value: any): value is TableVariant {
  return isIdentifier(value) && value.$kind === IDENTOFIER_KIND.TABLE_VARIANT;
}

export function isVariantDeclare(value: any): value is VariantDeclare {
  return value?.$type === SQL_SYMBOLE.VARAINT_DECLARE;
}

export function isTableVariantDeclare(value: any): value is TableVariantDeclare {
  return value?.$type === SQL_SYMBOLE.TABLE_VARIANT_DECLARE;
}

export function isVariant(value: any): value is Variant {
  return isIdentifier(value) && value.$kind === IDENTOFIER_KIND.VARIANT;
}

export function isRowset(value: any): value is Rowset {
  return (
    isTable(value) ||
    isNamedSelect(value) ||
    isTableFuncInvoke(value) ||
    isTableVariant(value)
  );
}

export function isExpression(value: any): value is Expression {
  return (
    isField(value) ||
    isLiteral(value) ||
    isVariant(value) ||
    isOperation(value) ||
    isScalarFuncInvoke(value) ||
    isCase(value) ||
    isBracket(value) ||
    isValuedSelect(value) ||
    isParameter(value)
  );
}

export function isCase(value: any): value is Case {
  return value?.$type === SQL_SYMBOLE.CASE;
}

export function isBracket(value: any): value is ParenthesesExpression {
  return value?.$type === SQL_SYMBOLE.BRACKET_EXPRESSION;
}

export function isValuedSelect(value: any): value is ValuedSelect {
  return value?.$type === SQL_SYMBOLE.VALUED_SELECT;
}

export function isOperation(value: any): value is Operation {
  return value?.$type === SQL_SYMBOLE.OPERATION;
}

export function isUnaryOperation(value: Operation): value is UnaryOperation {
  return value?.$kind === OPERATION_KIND.UNARY;
}

export function isBinaryOperation(value: Operation): value is BinaryOperation {
  return value?.$kind === OPERATION_KIND.BINARY;
}

// export function isConvertOperation(
//   value: Operation
// ): value is ConvertOperation {
//   return value.$kind === OPERATION_KIND.CONVERT;
// }

export function isParameter(value: any): value is Parameter {
  return isIdentifier(value) && value.$kind === IDENTOFIER_KIND.PARAMETER;
}

export function isStar(value: any): value is Star {
  return value?.$type === SQL_SYMBOLE.STAR;
}

export function isBuiltIn(value: any): value is BuiltIn {
  return isIdentifier(value) && value.$kind === IDENTOFIER_KIND.BUILT_IN;
}

export function isColumn(value: any): value is SelectColumn {
  return isIdentifier(value) && value.$kind === IDENTOFIER_KIND.COLUMN;
}

export function isCondition(value: any): value is Condition {
  return value?.$type === SQL_SYMBOLE.CONDITION;
}

export function isUnaryCompareCondition(
  value: Condition
): value is UnaryCompareCondition {
  return value?.$kind === CONDITION_KIND.UNARY_COMPARE;
}

export function isBinaryCompareCondition(
  value: Condition
): value is BinaryCompareCondition {
  return value?.$kind === CONDITION_KIND.BINARY_COMPARE;
}

export function isUnaryLogicCondition(
  value: Condition
): value is UnaryLogicCondition {
  return value?.$kind === CONDITION_KIND.UNARY_COMPARE;
}

export function isBinaryLogicCondition(
  value: Condition
): value is BinaryLogicCondition {
  return value?.$kind === CONDITION_KIND.BINARY_LOGIC;
}

export function isGroupCondition(
  value: Condition
): value is ParenthesesCondition {
  return value?.$kind === CONDITION_KIND.BRACKET_CONDITION;
}

export function isExistsCondition(value: Condition): value is ExistsCondition {
  return value?.$kind === CONDITION_KIND.EXISTS;
}

export function isDocument(value: any): value is Document {
  return value?.$type === SQL_SYMBOLE.DOCUMENT;
}

export function invalidAST(type: string, value: any) {
  console.debug(`Invalid ${type} AST：`, value);
  throw new Error(`Invalid ${type} AST.`);
}

export function clone<T>(value: T): T {
  if (Array.isArray(value)) {
    return value.map((item) =>
      item instanceof AST ? item.clone() : clone(item)
    ) as any;
  }
  if (value && typeof value === "object") {
    const copied: any = {};
    Object.entries(value).forEach(([k, v]) => {
      copied[k] = v instanceof AST ? v.clone() : clone(v);
    });
    Object.setPrototypeOf(copied, Object.getPrototypeOf(value));
    return copied;
  }
  return value;
}

export function merge<D extends object, S extends object>(
  dest: D,
  src: S
): D & S {
  throw new Error(`尚未实现`);
}

/**
 * 当一个属性未定义时，为一个属性赋值
 * @param target
 * @param property
 * @param value
 * @returns
 */
export function assignIfUndefined<T extends object, P extends keyof T>(
  target: T,
  property: P,
  value: T[P]
): boolean {
  if (!Object.prototype.hasOwnProperty.call(target, property)) {
    target[property] = value;
    return true;
  }
  return false;
}

export function lowerFirst(str: string): string {
  return str[0].toLowerCase() + str.substring(1);
}

/**
 * 书写风格
 */
export enum CaseStyle {
  upperCase = 1,
  lowerCase = 2,
  upperCamelCase = 3,
  lowerCamelCase = 4,
}

export function getCaseStyle(str: string): CaseStyle {
  throw new Error(`未实现`);
}

const esSuffix = ["s", "o", "x", "th"];
const vesSuffix = ["f", "fe"];
const irregular: Record<string, string> = {
  mouse: "mice",
  man: "men",
  tooth: "teeth",
};

const vowels = ["a", "e", "i", "o", "u"];

/**
 * 转换为复数
 * @param word 单词
 * @returns
 */
export function complex(word: string): string {
  if (irregular[word.toLowerCase()]) {
    const style = getCaseStyle(word);
    const complexWord = irregular[word];
    switch (style) {
      case CaseStyle.lowerCase:
      case CaseStyle.lowerCamelCase:
        return complexWord;
      case CaseStyle.upperCase:
        return complexWord.toUpperCase();
      case CaseStyle.upperCamelCase:
        return upperFirst(complexWord);
    }
  }

  if (esSuffix.find((item) => word.endsWith(item))) {
    return word + "es";
  }
  if (word.endsWith("y") && !vowels.includes(word[word.length - 2])) {
    return word.substr(0, word.length - 1) + "ies";
  }
  const ves = vesSuffix.find((item) => word.endsWith(item));
  if (ves) {
    return word.substr(0, word.length - ves.length) + "ves";
  }
  return word + "s";
}

export function upperFirst(str: string): string {
  return str[0].toUpperCase() + str.substring(1);
}

export function camelCase(str: string): string {
  const nodes = str.split(/-|_| /g);
  return nodes.map((node) => lowerFirst(node)).join("");
}

/**
 * 为一个对象赋值
 * @param obj 目标对象
 * @param values 需要赋值的键值对
 */
export function assign<T>(obj: T, values: Partial<T>) {
  Object.assign(obj, values);
}

/**
 * 解释值的类型
 */
export function parseValueType(value: Scalar): DbType {
  if (value === null || value === undefined)
    throw new Error("Do not parse DbType from null or undefined");
  switch (value.constructor) {
    case String:
      return DbType.string(0);
    case Number:
      return DbType.int32;
    case Date:
      return DbType.datetime;
    case Boolean:
      return DbType.boolean;
    case Buffer:
    case ArrayBuffer:
    case SharedArrayBuffer:
      return DbType.binary(0);
    default:
      throw new Error("Invalid value.");
  }
}

/**
 * 是否列表类型
 */
export function isListType(type: any): type is ListType {
  return type?.kind === "LIST";
}

/**
 * 判断一个函数是否为类声明
 * 注意，此方法在编译目标为ES5及以下版本中无效！
 */
// HACK： 此方法为hack方法，存在不确定性，并且已知在编译目标为ES5及以下版本中无效！
export function isClass(func: Function): boolean {
  return func.toString().startsWith("class ");
}

/**
 * 是否标量类型
 */
export function isScalarType(type: any): type is ScalarType {
  return typeof type === "bigint";
}

export function deepthEqual(left: any, right: any): boolean {
  const type = typeof left;
  if (type !== 'function' && type !== 'object') {
    return left === right
  }

  if (!right) return false;
  let leftKeys = Object.getOwnPropertyNames(left);
  let rightKeys = Object.getOwnPropertyNames(right);
  if (leftKeys.length !== rightKeys.length) return false;
  for (const key of leftKeys) {
    if (!deepthEqual(left[key], right[key])) {
      return false;
    }
  }
  return true;
}

export function map<T>(list: T[], keyer: (item: T) => string): Record<string, T> {
  const map: Record<string, T> = {};
  list.forEach((item) => (map[keyer(item)] = item));
  return map;
}
