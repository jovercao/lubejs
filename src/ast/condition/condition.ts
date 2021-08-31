import { DefaultInputObject, RowObject, WhereObject } from '../types';
import { AST, SQL_SYMBOLE } from '../ast';
import { SqlBuilder } from '../../sql-builder';
import { CompatibleRowset, Rowset } from '../rowset/rowset';
import { Field } from '../expression/field';
import { BinaryLogicCondition } from './binary-logic-condition';

/**
 * 查询条件
 */
export abstract class Condition extends AST {
  readonly $type: SQL_SYMBOLE.CONDITION = SQL_SYMBOLE.CONDITION;
  abstract readonly $kind: CONDITION_KIND;
  /**
   * and连接
   * @param condition 下一个查询条件
   * @returns 返回新的查询条件
   */
  and(condition: CompatibleCondition): Condition {
    return SqlBuilder.and(this, condition);

    // condition = ensureCondition(condition);
    // return new BinaryLogicCondition(LOGIC_OPERATOR.AND, this, SqlBuilder.group(condition));
  }

  /**
   * OR语句
   * @param condition
   * @returns 返回新的查询条件
   */
  or(condition: Condition): Condition {
    return SqlBuilder.or(this, condition);
  }

  static isCondition(object: any): object is Condition {
    return object?.$type === SQL_SYMBOLE.CONDITION;
  }

  /**
   * 使用逻辑表达式联接多个条件
   */
  static join(
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
        condition = SqlBuilder.group(condition);
      }
      if (!previous) return condition;
      return new BinaryLogicCondition(logic, previous, condition);
    }) as Condition;
    return SqlBuilder.group(cond);
  }

  static ensure<T extends RowObject>(
    condition: Condition | WhereObject<T>,
    rowset?: CompatibleRowset<T>
  ): Condition {
    if (Condition.isCondition(condition)) return condition;

    let makeField: (name: string) => Field;
    if (rowset) {
      if (typeof rowset === 'string' || Array.isArray(rowset)) {
        makeField = (key: string) => SqlBuilder.field(key, rowset);
      } else if (Rowset.isRowset(rowset)) {
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

    return compares.length >= 2 ? SqlBuilder.and(compares) : compares[0];
  }
}

/**
 * 逻辑运算符列表
 */
export enum LOGIC_OPERATOR {
  AND = 'AND',
  OR = 'OR',
  NOT = 'NOT',
}

/**
 * 比较运算符
 */
export type COMPARE_OPERATOR = UNARY_COMPARE_OPERATOR | BINARY_COMPARE_OPERATOR;
/**
 * 比较运算符列表
 */
export enum BINARY_COMPARE_OPERATOR {
  IN = 'IN',
  NOT_IN = 'NOT IN',
  EQ = '=',
  NEQ = '<>',
  GT = '>',
  GTE = '>=',
  LT = '<',
  LTE = '<=',
  LIKE = 'LIKE',
  NOT_LIKE = 'NOT LIKE',
}

export enum UNARY_COMPARE_OPERATOR {
  IS_NULL = 'IS NULL',
  IS_NOT_NULL = 'IS NOT NULL',
}

export enum CONDITION_KIND {
  GROUP = 'BRACKET_CONDITION',
  UNARY_COMPARE = 'UNARY_COMPARE',
  BINARY_COMPARE = 'BINARY_COMPARE',
  BINARY_LOGIC = 'BINARY_LOGIC',
  UNARY_LOGIC = 'UNARY_LOGIC',
  EXISTS = 'EXISTS',
  STANDARD = 'STANDARD',
}

/**
 * 可兼容的查询条件
 */
export type CompatibleCondition<T extends RowObject = DefaultInputObject> =
  | Condition
  | WhereObject<T>;
