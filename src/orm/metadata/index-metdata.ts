import { ColumnMetadata } from "./column-metadata";

export interface IndexMetadata {
  name: string;
  properties:
    | string[]
    | {
        [key: string]: 'ASC' | 'DESC';
      };
  columns: { column: ColumnMetadata; sort: 'ASC' | 'DESC' }[];

  /**
   * 是否唯一
   */
  isUnique: boolean;

  /**
   * 是否聚焦索引
   */
  isClustered: boolean;

  /**
   * 摘要说明
   */
  comment?: string;
}
