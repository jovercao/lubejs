import { DefaultInputObject, RowObject, WhereObject } from '../types';
import { SQL, SQL_SYMBOLE } from '../sql';
import { CompatibleRowset, Rowset } from '../rowset/rowset';
import { Field } from '../expression/field';
import { BinaryLogicCondition } from './binary-logic-condition';
import { GroupCondition } from './group-condition';
import { UnaryLogicCondition } from './unary-logic-condition';
import { UnaryCompareCondition } from './unary-compare-condition';
import { CompatibleExpression, Expression } from '../expression';
import { Scalar } from '../scalar';
import { BinaryCompareCondition } from './binary-compare-condition';
import { Select } from '../statement';
import { ExistsCondition } from './exists-condition';

/**
 * 查询条件
 */
export abstract class Condition extends SQL {
  readonly $type: SQL_SYMBOLE.CONDITION = SQL_SYMBOLE.CONDITION;
  abstract readonly $kind: CONDITION_KIND;
  /**
   * and连接
   * @param condition 下一个查询条件
   * @returns 返回新的查询条件
   */
  and(condition: CompatibleCondition): Condition {
    return BinaryLogicCondition.and(this, condition);

    // condition = ensureCondition(condition);
    // return new BinaryLogicCondition(LOGIC_OPERATOR.AND, this, SqlBuilder.group(condition));
  }

  /**
   * OR语句
   * @param condition
   * @returns 返回新的查询条件
   */
  or(condition: Condition): Condition {
    return BinaryLogicCondition.or(this, condition);
  }

  static isCondition(object: any): object is Condition {
    return object?.$type === SQL_SYMBOLE.CONDITION;
  }

  static ensure<T extends RowObject>(
    condition: Condition | WhereObject<T>,
    rowset?: CompatibleRowset<T>
  ): Condition {
    if (Condition.isCondition(condition)) return condition;

    let makeField: (name: string) => Field;
    if (rowset) {
      if (typeof rowset === 'string' || Array.isArray(rowset)) {
        makeField = (key: string) => new Field(key, rowset);
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

    return compares.length >= 2 ? Condition.and(compares) : compares[0];
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
  GROUP = 'GROUP',
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
