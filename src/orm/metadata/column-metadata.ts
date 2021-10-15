import { DbContext } from "../db-context";
import { Scalar, DbType, XRowset, Expression, XExpression } from "../../core";
import { ScalarDataType } from "../data-types";

/**
 * 属性元数据
 */
 export interface ColumnMetadata<T extends Scalar = Scalar> {
  /**
   * 是否由ORM隐式生成
   */
  isImplicit: boolean;

  /**
   * 类型
   */
  kind: 'COLUMN';

  /**
   * 属性名称
   */
  property: string;

  /**
   * 类型
   */
  type: ScalarDataType;

  /**
   * 字段名
   */
  columnName: string;
  /**
   * 数据库类型
   */
  dbType: DbType;
  /**
   * 是否可空
   */
  isNullable: boolean;
  /**
   * 默认值，即自动生成值列
   */
  defaultValue?: Expression<T>;
  /**
   * 主键
   */
  isPrimaryKey: boolean;
  /**
   * 是否标识列
   */
  isIdentity: boolean;
  /**
   * 是否行标识列
   */
  isRowflag: boolean;
  /**
   * 标识列种子
   */
  identityStartValue?: number;
  /**
   * 标识列步长
   */
  identityIncrement?: number;
  /**
   * 是否计算列
   */
  isCalculate: boolean;
  /**
   * 计算表达式
   */
  calculateExpression?: Expression<T>;
  /**
   * 摘要说明
   */
  comment?: string;

  /**
   * 自动生成表达式（程序）
   */
  generator?: (
    rowset: XRowset<any>,
    item: any,
    context: DbContext
  ) => XExpression<T>;
}
