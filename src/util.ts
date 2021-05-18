/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Condition,
  CompatibleExpression,
  Expression,
  AST,
  Proxied,
  Func,
  Name,
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
  ConvertOperation,
  Declare,
  Delete,
  Execute,
  Identifier,
  Insert,
  RowObject,
  NamedSelect,
  Operation,
  Parameter,
  PathedName,
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
  FieldsOf
} from './ast'
import {
  CONDITION_KIND,
  IDENTOFIER_KIND,
  OPERATION_KIND,
  $IsProxy,
  SQL_SYMBOLE
} from './constants'
import { EntityMetadata } from './metadata'
import { Binary, DbType, Scalar, type } from './types'

/**
 * 断言
 * @param except 预期结果
 * @param message 错误消息
 */
export function assert (except: any, message: string): asserts except {
  if (!except) {
    throw new Error(message)
  }
}

/**
 * 返回表达式
 */
export function ensureExpression<T extends Scalar> (
  expr: CompatibleExpression<T>
): Expression<T> {
  if (!(expr instanceof AST)) {
    return Expression.literal(expr)
  }
  return expr
}

/**
 * 确保字段类型
 */
export function ensureField<T extends Scalar, N extends string> (
  name: Name<N> | Field<T, N>
): Field<T, N> {
  if (!(name instanceof AST)) {
    return new Field(name)
  }
  return name
}

export function ensureVariant<T extends string, N extends string> (
  name: N | Variant<T, N>
): Variant<T, N> {
  if (typeof name === 'string') {
    return new Variant(name)
  }
  return name
}

/**
 * 确保表格类型
 */
export function ensureRowset<TModel extends RowObject> (
  name: Name<string> | Table<TModel>
): Table<TModel>
export function ensureRowset<TModel extends RowObject> (
  name: Name<string> | Rowset<TModel>
): Rowset<TModel>
export function ensureRowset<TModel extends RowObject> (
  name: Name<string> | Rowset<TModel> | Table<TModel>
): Rowset<TModel> | Table<TModel> {
  if (name instanceof AST) return name
  return new Table(name)
}

export function ensureProxiedRowset<T extends RowObject> (
  name: Name<string> | Table<T>
): ProxiedTable<T>
export function ensureProxiedRowset<T extends RowObject> (
  name: Name<string> | Rowset<T>
): ProxiedRowset<T>
export function ensureProxiedRowset<T extends RowObject> (
  name: Name<string> | Rowset<T> | Table<T>
): ProxiedRowset<T> | ProxiedTable<T> {
  if (isRowset(name)) {
    if (isProxiedRowset(name)) {
      return name
    }
    return makeProxiedRowset(name)
  }
  const table = ensureRowset<T>(name)
  return makeProxiedRowset(table)
}

/**
 * 确保函数类型
 */
export function ensureFunction<TName extends string> (
  name: Name<TName> | Func<TName>
): Func<TName> {
  if (name instanceof AST) return name
  return new Func(name)
}

/**
 * 确保标题函数类型
 */
export function ensureProcedure<
  R extends Scalar,
  O extends RowObject[] = [],
  N extends string = string
> (name: Name<N> | Procedure<R, O, N>): Procedure<R, O, N> {
  if (name instanceof AST) return name
  return new Procedure(name)
}

/**
 * 通过一个对象创建一个对查询条件
 * 亦可理解为：转换managodb的查询条件到 ast
 * @param condition 条件表达式
 */
export function ensureCondition<T extends RowObject> (
  condition: Condition | WhereObject<T>,
  rowsetOrMetadata?: CompatibleRowset<T> | EntityMetadata
): Condition {
  if (isCondition(condition)) return condition

  let makeField: (name: string) => Field;
  if (rowsetOrMetadata) {
    if (typeof rowsetOrMetadata === 'string' || Array.isArray(rowsetOrMetadata)) {
      makeField = (key: string) => new Field([
        ...(Array.isArray(rowsetOrMetadata) ? rowsetOrMetadata : [rowsetOrMetadata]),
        key
      ] as Name<string>)
    } else if (isRowset(rowsetOrMetadata)) {
      makeField = (key: string) => rowsetOrMetadata.field(key as FieldsOf<T>)
    } else {
      const rowset = makeProxied(new Table<T>(rowsetOrMetadata.table.name), rowsetOrMetadata)
      makeField = (key: string) => rowset.field(key as FieldsOf<T>)
    }
  } else {
    makeField = (key: string) => new Field(key)
  }

  const compares = Object.entries(condition).map(([key, value]) => {
    const field: Field<any, string> = makeField(key)
    if (value === null || value === undefined) {
      return field.isNull()
    }
    if (Array.isArray(value)) {
      return field.in(value)
    }
    return field.eq(value)
  })

  return compares.length >= 2
    ? Condition.and(compares)
    : compares[0]
}
const RowsetFixedProps: string[] = [
  'field',
  'clone',
  '_',
  'as',
  '$alias',
  '$',
  'star',
  'as',
  '$builtin',
  '$type',
  '$kind',
  '$statement',
  '$select'
]

function makeProxied<T extends RowObject>(table: Table<T> | Rowset<T>, metadata?: EntityMetadata): ProxiedTable<T> | ProxiedRowset<T> {
  return new Proxy(table, {
    get (target: any, prop: string | symbol | number): any {
      /**
       * 标记为Proxy
       */
      if (prop === $IsProxy) {
        return true
      }
      const v = target[prop]
      if (
        typeof prop !== 'string' ||
        v !== undefined ||
        RowsetFixedProps.includes(prop)
      ) {
        return v
      }

      // const value = Reflect.get(target, prop);
      // if (value !== undefined) return value;
      if (prop.startsWith('$')) {
        prop = prop.substring(1)
      }
      if (metadata) {
        const column = metadata.getProperty(prop)?.column
        if (!column) {
          return target.field(column.name)
          // throw new Error(`Property ${prop} is not a column.`)
        }
      }
      return target.field(prop)
    }
  })
}

/**
 * 将制作rowset的代理，用于通过属性访问字段
 */
export function makeProxiedRowset<T extends RowObject> (
  rowset: Table<T>,
): ProxiedTable<T>
export function makeProxiedRowset<T extends RowObject> (
  rowset: Rowset<T>,
): ProxiedRowset<T>
export function makeProxiedRowset<T extends RowObject> (
  metadata?: EntityMetadata
): ProxiedTable<T>
export function makeProxiedRowset<T extends RowObject> (
  rowsetOrMetadata: Table<T> | Rowset<T> | EntityMetadata
): ProxiedTable<T> | ProxiedRowset<T> {
  if (rowsetOrMetadata instanceof EntityMetadata) {
    return makeProxied(new Table<T>(rowsetOrMetadata.table.name), rowsetOrMetadata)
  }
  return makeProxied(rowsetOrMetadata)
}

export function isScalar (value: any): value is Scalar {
  return (
    typeof value === 'string' ||
    typeof value === 'boolean' ||
    typeof value === 'bigint' ||
    typeof value === 'number' ||
    value === null ||
    value === undefined ||
    value instanceof Date ||
    isBinary(value)
  )
}

export function isDbType (value: any): value is DbType {
  if (!value) return false
  return !!Reflect.get(type, value.name)
}

export function isSortInfo (value: any): value is SortInfo {
  return value.$type === SQL_SYMBOLE.SORT
}

export function isBinary (value: any): value is Binary {
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
  )
}

export function isProxiedRowset<T extends RowObject> (
  rowset: Rowset<T>
): rowset is ProxiedRowset<T> {
  return Reflect.get(rowset, $IsProxy) === true
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

export function pickName (name: Name<string>): string {
  if (typeof name === 'string') {
    return name
  }
  return name[name.length - 1]
}

export function pathName<T extends string> (name: Name<T>): PathedName<T> {
  if (typeof name === 'string') {
    return [name]
  }
  return name
}

export function isPlainObject (obj: any): boolean {
  return [Object.prototype, null].includes(Object.getPrototypeOf(obj))
}

function fix (num: number, digits: number): string {
  return num.toString().padStart(digits, '0')
}

export function dateToString (date: Date): string {
  return `${date.getFullYear()}-${fix(date.getMonth() + 1, 2)}-${fix(
    date.getDate(),
    2
  )}T${fix(date.getHours(), 2)}:${fix(date.getMinutes(), 2)}:${fix(
    date.getSeconds(),
    2
  )}.${fix(date.getMilliseconds(), 3)}${
    date.getTimezoneOffset() > 0 ? '-' : '+'
  }${fix(Math.abs(date.getTimezoneOffset() / 60), 2)}:00`
}

export function isRaw (value: any): value is Raw {
  return value.$type === SQL_SYMBOLE.RAW
}

export function isSelect (value: any): value is Select {
  return value.$type === SQL_SYMBOLE.SELECT
}

export function isUpdate (value: any): value is Update {
  return value.$type === SQL_SYMBOLE.UPDATE
}

export function isDelete (value: any): value is Delete {
  return value.$type === SQL_SYMBOLE.DELETE
}

export function isInsert (value: any): value is Insert {
  return value.$type === SQL_SYMBOLE.INSERT
}

export function isAssignment (value: any): value is Assignment {
  return value.$type === SQL_SYMBOLE.ASSIGNMENT
}

export function isDeclare (value: any): value is Declare {
  return value.$type === SQL_SYMBOLE.DECLARE
}

export function isExecute (value: any): value is Execute {
  return value.$type === SQL_SYMBOLE.EXECUTE
}

export function isStatement (value: any): value is Statement {
  return (
    isSelect(value) ||
    isUpdate(value) ||
    isDelete(value) ||
    isInsert(value) ||
    isDeclare(value) ||
    isAssignment(value) ||
    isWith(value) ||
    isExecute(value)
  )
}

export function isCrudStatement (value: any): value is CrudStatement {
  return (
    isSelect(value) || isUpdate(value) || isDelete(value) || isInsert(value)
  )
}

export function isIdentifier (value: any): value is Identifier {
  return value.$type === SQL_SYMBOLE.IDENTIFIER
}

export function isTable (value: any): value is Table {
  return isIdentifier(value) && value.$kind === IDENTOFIER_KIND.TABLE
}

export function isField (value: any): value is Field {
  return isIdentifier(value) && value.$kind === IDENTOFIER_KIND.FIELD
}

export function isLiteral (value: any): value is Literal {
  return value.$type === SQL_SYMBOLE.LITERAL
}

export function isNamedSelect (value: any): value is NamedSelect {
  return value.$type === SQL_SYMBOLE.NAMED_SELECT
}

export function isWithSelect (value: any): value is NamedSelect {
  return isNamedSelect(value) && value.$inWith
}

export function isWith (value: any): value is With {
  return value && value.$type === SQL_SYMBOLE.WITH
}

export function isTableFuncInvoke (value: any): value is TableFuncInvoke {
  return value.$type === SQL_SYMBOLE.TABLE_FUNCTION_INVOKE
}

export function isScalarFuncInvoke (value: any): value is ScalarFuncInvoke {
  return value.$type === SQL_SYMBOLE.SCALAR_FUNCTION_INVOKE
}

export function isTableVariant (value: any): value is TableVariant {
  return isIdentifier(value) && value.$kind === IDENTOFIER_KIND.TABLE_VARIANT
}

export function isVariant (value: any): value is Variant {
  return isIdentifier(value) && value.$kind === IDENTOFIER_KIND.VARIANT
}

export function isRowset (value: any): value is Rowset {
  return (
    isTable(value) ||
    isNamedSelect(value) ||
    isTableFuncInvoke(value) ||
    isTableVariant(value)
  )
}

export function isExpression (value: any): value is Expression {
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
  )
}

export function isCase (value: any): value is Case {
  return value.$type === SQL_SYMBOLE.CASE
}

export function isBracket (value: any): value is ParenthesesExpression {
  return value.$type === SQL_SYMBOLE.BRACKET_EXPRESSION
}

export function isValuedSelect (value: any): value is ValuedSelect {
  return value.$type === SQL_SYMBOLE.VALUED_SELECT
}

export function isOperation (value: any): value is Operation {
  return value.$type === SQL_SYMBOLE.OPERATION
}

export function isUnaryOperation (value: Operation): value is UnaryOperation {
  return value.$kind === OPERATION_KIND.UNARY
}

export function isBinaryOperation (value: Operation): value is BinaryOperation {
  return value.$kind === OPERATION_KIND.BINARY
}

export function isConvertOperation (
  value: Operation
): value is ConvertOperation {
  return value.$kind === OPERATION_KIND.CONVERT
}

export function isParameter (value: any): value is Parameter {
  return isIdentifier(value) && value.$kind === IDENTOFIER_KIND.PARAMETER
}

export function isStar (value: any): value is Star {
  return value.$type === SQL_SYMBOLE.STAR
}

export function isBuiltIn (value: any): value is BuiltIn {
  return isIdentifier(value) && value.$kind === IDENTOFIER_KIND.BUILT_IN
}

export function isColumn (value: any): value is SelectColumn {
  return isIdentifier(value) && value.$kind === IDENTOFIER_KIND.COLUMN
}

export function isCondition (value: any): value is Condition {
  return value.$type === SQL_SYMBOLE.CONDITION
}

export function isUnaryCompareCondition (
  value: Condition
): value is UnaryCompareCondition {
  return value.$kind === CONDITION_KIND.UNARY_COMPARE
}

export function isBinaryCompareCondition (
  value: Condition
): value is BinaryCompareCondition {
  return value.$kind === CONDITION_KIND.BINARY_COMPARE
}

export function isUnaryLogicCondition (
  value: Condition
): value is UnaryLogicCondition {
  return value.$kind === CONDITION_KIND.UNARY_COMPARE
}

export function isBinaryLogicCondition (
  value: Condition
): value is BinaryLogicCondition {
  return value.$kind === CONDITION_KIND.BINARY_LOGIC
}

export function isGroupCondition (
  value: Condition
): value is ParenthesesCondition {
  return value.$kind === CONDITION_KIND.BRACKET_CONDITION
}

export function isExistsCondition (value: Condition): value is ExistsCondition {
  return value.$kind === CONDITION_KIND.EXISTS
}

export function isDocument (value: any): value is Document {
  return value.$type === SQL_SYMBOLE.DOCUMENT
}

export function invalidAST (type: string, value: any) {
  console.debug(`Invalid ${type} AST：`, value)
  throw new Error(`Invalid ${type} AST.`)
}

export function clone<T> (value: T): T {
  if (Array.isArray(value)) {
    return value.map(item =>
      item instanceof AST ? item.clone() : clone(item)
    ) as any
  }
  if (value && typeof value === 'object') {
    const copied: any = {}
    Object.entries(value).forEach(([k, v]) => {
      copied[k] = v instanceof AST ? v.clone() : clone(v)
    })
    Object.setPrototypeOf(copied, Object.getPrototypeOf(value))
    return copied
  }
  return value
}

export function merge<D extends object, S extends object>(dest: D, src: S): D & S {
  throw new Error(`尚未实现`)
}
