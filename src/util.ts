import {
  Condition,
  Expressions,
  Expression,
  AST,
  JsConstant,
  ProxiedRowset,
  Func,
  Name,
  Table,
  Field,
  Document,
  Assignment,
  BinaryOperation,
  Bracket,
  BuiltIn,
  Case,
  Column,
  Constant,
  ConvertOperation,
  Declare,
  Delete,
  Execute,
  Identifier,
  Insert,
  Model,
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
  WithSelect,
  BinaryCompareCondition,
  BinaryLogicCondition,
  ExistsCondition,
  GroupCondition,
  UnaryCompareCondition,
  UnaryLogicCondition,
  $IsProxy
} from "./ast";
import { constant, func } from "./builder";
import {
  CONDITION_KIND,
  IDENTOFIER_KIND,
  OPERATION_KIND,
  SQL_SYMBOLE,
} from "./constants";


/**
 * 断言
 * @param except 预期结果
 * @param message 错误消息
 */
export function assert(except: any, message: string) {
  if (!except) {
    throw new Error(message);
  }
}

/**
 * 返回表达式
 */
export function ensureExpression<T extends JsConstant>(
  expr: Expressions<T>
): Expression<T> {
  if (!(expr instanceof AST)) {
    return constant(expr);
  }
  return expr;
}

/**
 * 确保字段类型
 */
export function ensureField<T extends JsConstant, N extends string>(
  name: Name<N> | Field<T, N>
): Field<T, N> {
  if (!(name instanceof AST)) {
    return new Field(name);
  }
  return name;
}

export function ensureVariant<T extends string, N extends string>(
  name: N | Variant<T, N>
): Variant<T, N> {
  if (typeof name === "string") {
    return new Variant(name);
  }
  return name;
}

/**
 * 确保表格类型
 */
export function ensureRowset<TModel extends Model>(
  name: Name<string> | Rowset<TModel>
): Rowset<TModel> {
  if (name instanceof AST) return name;
  return new Table(name);
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
export function ensureProcedure<T extends Model, N extends string>(
  name: Name<N> | Procedure<T, N>
): Procedure<T, N> {
  if (name instanceof AST) return name;
  return new Procedure(name);
}

/**
 * 通过一个对象创建一个对查询条件
 * 亦可理解为：转换managodb的查询条件到 ast
 * @param condition 条件表达式
 */
export function ensureCondition<T extends Model>(
  condition: Condition | WhereObject<T>
): Condition {
  if (condition instanceof Condition) return condition;
  const compares = Object.entries(condition).map(([key, value]) => {
    const field = new Field(key);
    if (value === null || value === undefined) {
      return Condition.isNull(field);
    }
    if (Array.isArray(value)) {
      return Condition.in(field, value);
    }
    return Condition.eq(field, value as any);
  });

  return compares.length >= 2 ? Condition.and(...compares) : compares[0];
}
const RowsetFixedProps: string[] = [
  "field",
  "clone",
  "_",
  "as",
  "$alias",
  "$",
  "star",
  "as",
  "$builtin",
  "$type",
  "$kind",
  "$statement",
  "$select"
];

/**
 * 将制作rowset的代理，用于通过属性访问字段
 */
export function makeProxiedRowset<T>(table: T): ProxiedRowset<T> {
  return new Proxy(table as any, {
    get(target: any, prop: string | symbol | number): any {
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
      if (prop.startsWith("$")) {
        prop = prop.substring(1);
      }
      return target.field(prop);
    },
  }) as any;
}

export function isJsConstant(value: any): value is JsConstant {
  return (
    typeof value === "string" ||
    typeof value === "boolean" ||
    typeof value === "bigint" ||
    typeof value === "number" ||
    value === null ||
    value === undefined ||
    value instanceof Date ||
    value instanceof Uint8Array
  );
}

export type Constructor<T> = {
  new (...args: any): T;
};

export type MixinedConstructor<A, B, C = unknown, D = unknown, E = unknown> = {
  new (): A & B & C & D & E;
};

/**
 * 混入
 */
export function mixins<Base, A>(
  baseCls: Constructor<Base>,
  extend1: Constructor<A>
): MixinedConstructor<Base, A>;
export function mixins<Base, A, B>(
  baseCls: Constructor<Base>,
  extend1: Constructor<A>,
  extend2: Constructor<B>
): MixinedConstructor<Base, A, B>;
export function mixins<Base, A, B, C>(
  baseCls: Constructor<Base>,
  extend1: Constructor<A>,
  extend2: Constructor<B>,
  extend3: Constructor<C>
): MixinedConstructor<Base, A, B, C>;
export function mixins<Base, A, B, C, D>(
  baseCls: Constructor<Base>,
  extend1: Constructor<A>,
  extend2: Constructor<B>,
  extend3: Constructor<C>,
  extend4: Constructor<D>
): MixinedConstructor<Base, A, B, C, D>;
export function mixins(...classes: Constructor<any>[]): any {
  const cls = class MixinedClass extends classes[0] {};
  const proto: any = cls.prototype;
  classes.forEach((fn) => {
    Object.getOwnPropertyNames(fn.prototype).forEach((name) => {
      /**
       * 不改变构造函数
       */
      if (name !== "constructor") {
        if (proto[name]) {
          throw new Error(`在混入合并时，发现属性冲突！属性名：${name}`);
        }
        proto[name] = fn.prototype[name];
      }
    });
  });
  return cls;
}

export function pickName(name: Name<string>): string {
  if (typeof name === "string") {
    return name;
  }
  return name[name.length - 1];
}

export function pathName<T extends string>(name: Name<T>): PathedName<T> {
  if (typeof name === "string") {
    return [name];
  }
  return name;
}

export function isPlainObject(obj: any) {
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

export function isRaw(ast: AST): ast is Raw {
  return ast.$type === SQL_SYMBOLE.RAW;
}

export function isSelect(ast: AST): ast is Select {
  return ast.$type === SQL_SYMBOLE.SELECT;
}

export function isUpdate(ast: AST): ast is Update {
  return ast.$type === SQL_SYMBOLE.UPDATE;
}

export function isDelete(ast: AST): ast is Delete {
  return ast.$type === SQL_SYMBOLE.DELETE;
}

export function isInsert(ast: AST): ast is Insert {
  return ast.$type === SQL_SYMBOLE.INSERT;
}

export function isAssignment(ast: AST): ast is Assignment {
  return ast.$type === SQL_SYMBOLE.ASSIGNMENT;
}

export function isDeclare(ast: AST): ast is Declare {
  return ast.$type === SQL_SYMBOLE.DECLARE;
}

export function isExecute(ast: AST): ast is Execute {
  return ast.$type === SQL_SYMBOLE.EXECUTE;
}

export function isStatement(ast: AST): ast is Statement {
  return (
    isSelect(ast) ||
    isUpdate(ast) ||
    isDelete(ast) ||
    isInsert(ast) ||
    isDeclare(ast) ||
    isAssignment(ast) ||
    isExecute(ast)
  );
}

export function isIdentifier(ast: AST): ast is Identifier {
  return ast.$type === SQL_SYMBOLE.IDENTIFIER;
}

export function isTable(ast: AST): ast is Table {
  return isIdentifier(ast) && ast.$kind === IDENTOFIER_KIND.TABLE;
}

export function isField(ast: AST): ast is Field {
  return isIdentifier(ast) && ast.$kind === IDENTOFIER_KIND.FIELD;
}

export function isConstant(ast: AST): ast is Constant {
  return ast.$type === SQL_SYMBOLE.CONSTANT;
}

export function isNamedSelect(ast: AST): ast is NamedSelect {
  return ast.$type === SQL_SYMBOLE.NAMED_SELECT;
}

export function isWithSelect(ast: AST): ast is WithSelect {
  return ast.$type === SQL_SYMBOLE.WITH_SELECT;
}

export function isTableFuncInvoke(ast: AST): ast is TableFuncInvoke {
  return ast.$type === SQL_SYMBOLE.TABLE_FUNCTION_INVOKE;
}

export function isScalarFuncInvoke(ast: AST): ast is ScalarFuncInvoke {
  return ast.$type === SQL_SYMBOLE.SCALAR_FUNCTION_INVOKE;
}

export function isTableVariant(ast: AST): ast is TableVariant {
  return isIdentifier(ast) && ast.$kind === IDENTOFIER_KIND.TABLE_VARIANT;
}

export function isVariant(ast: AST): ast is Variant {
  return isIdentifier(ast) && ast.$kind === IDENTOFIER_KIND.VARIANT;
}

export function isRowset(ast: AST): ast is Rowset {
  return (
    isTable(ast) ||
    isNamedSelect(ast) ||
    isWithSelect(ast) ||
    isTableFuncInvoke(ast) ||
    isTableVariant(ast)
  );
}

export function isExpression(ast: AST): ast is Expression {
  return (
    isField(ast) ||
    isConstant(ast) ||
    isVariant(ast) ||
    isOperation(ast) ||
    isScalarFuncInvoke(ast) ||
    isCase(ast) ||
    isBracket(ast) ||
    isValuedSelect(ast) ||
    isParameter(ast)
  );
}

export function isCase(ast: AST): ast is Case {
  return ast.$type === SQL_SYMBOLE.CASE;
}

export function isBracket(ast: AST): ast is Bracket {
  return ast.$type === SQL_SYMBOLE.BRACKET;
}

export function isValuedSelect(ast: AST): ast is ValuedSelect {
  return ast.$type === SQL_SYMBOLE.VALUED_SELECT;
}

export function isOperation(ast: AST): ast is Operation {
  return ast.$type === SQL_SYMBOLE.OPERATION;
}

export function isUnaryOperation(ast: Operation): ast is UnaryOperation {
  return ast.$kind === OPERATION_KIND.UNARY;
}

export function isBinaryOperation(ast: Operation): ast is BinaryOperation {
  return ast.$kind === OPERATION_KIND.BINARY;
}

export function isConvertOperation(ast: Operation): ast is ConvertOperation {
  return ast.$kind === OPERATION_KIND.CONVERT;
}

export function isParameter(ast: AST): ast is Parameter {
  return isIdentifier(ast) && ast.$kind === IDENTOFIER_KIND.PARAMETER;
}

export function isStar(ast: AST): ast is Star {
  return ast.$type === SQL_SYMBOLE.STAR;
}

export function isBuiltIn(ast: AST): ast is BuiltIn {
  return isIdentifier(ast) && ast.$kind === IDENTOFIER_KIND.BUILT_IN;
}

export function isColumn(ast: AST): ast is Column {
  return isIdentifier(ast) && ast.$kind === IDENTOFIER_KIND.COLUMN;
}

export function isCondition(ast: AST): ast is Condition {
  return ast.$type === SQL_SYMBOLE.CONDITION;
}

export function isUnaryCompareCondition(
  ast: Condition
): ast is UnaryCompareCondition {
  return ast.$kind === CONDITION_KIND.UNARY_COMPARE;
}

export function isBinaryCompareCondition(
  ast: Condition
): ast is BinaryCompareCondition {
  return ast.$kind === CONDITION_KIND.BINARY_COMPARE;
}

export function isUnaryLogicCondition(
  ast: Condition
): ast is UnaryLogicCondition {
  return ast.$kind === CONDITION_KIND.UNARY_COMPARE;
}

export function isBinaryLogicCondition(
  ast: Condition
): ast is BinaryLogicCondition {
  return ast.$kind === CONDITION_KIND.BINARY_LOGIC;
}

export function isGroupCondition(ast: Condition): ast is GroupCondition {
  return ast.$kind === CONDITION_KIND.GROUP;
}

export function isExistsCondition(ast: Condition): ast is ExistsCondition {
  return ast.$kind === CONDITION_KIND.EXISTS;
}

export function isDocument(ast: AST): ast is Document {
  return ast.$type === SQL_SYMBOLE.DOCUMENT;
}

export function invalidAST(type: string, ast: AST) {
  console.debug(`Invalid ${type} AST：`, ast);
  throw new Error(`Invalid ${type} AST.`);
}

export function clone(value: any) {
  if (value && typeof value === 'object') {
    const copied: any = {};
    Object.entries(value).forEach(([k, v]) => {
      copied[k] = v instanceof AST ? v.clone() : clone(v)
    })
    Object.setPrototypeOf(copied, Object.getPrototypeOf(value))
    return copied
  }
  return value
}
