import { ColumnMetadata } from "./column-metadata";

/**
 * 主键元数据
 */
 export interface KeyMetadata {
  /**
   * 主键属性
   */
  property: string;
  /**
   * 主键列
   */
  column: ColumnMetadata;
  /**
   * 主键是否为非聚焦键
   */
  isNonclustered: boolean;
  /**
   * 主键约束名称
   */
  constraintName: string;
  /**
   * 主键约束摘要
   */
  comment?: string;
}
