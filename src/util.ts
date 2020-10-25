import {
  Condition,
  Conditions,
  Expressions,
  Expression,
  AST,
  JsConstant,
  ProxiedRowset,
  Func,
  Name,
  Table,
  Field,
} from "./ast";
import { constant, func } from "./builder";
import { Model, PathedName, Procedure, Rowset, WhereObject } from "./lube";

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
  '$type',
  '$kind',
  '$alias',
  'as',
  'field',
  '$name',
  '$builtin',
  '_',
  '$',
  'star'
];

/**
 * 将制作rowset的代理，用于通过属性访问字段
 */
export function makeProxiedRowset<T>(table: T): ProxiedRowset<T> {
  return new Proxy(table as any, {
    get(target: Rowset<any>, prop: any): any {
      if (RowsetFixedProps.includes(prop)) {
        return Reflect.get(target, prop);
      }
      // const value = Reflect.get(target, prop);
      // if (value !== undefined) return value;

      if (typeof prop === "string") {
        // $开头，实为转义符，避免字段命名冲突，程序自动移除首个
        if (prop.startsWith("$")) {
          prop = prop.substring(1);
        }
        return target.field(prop);
      }
      return Reflect.get(target, prop);
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
