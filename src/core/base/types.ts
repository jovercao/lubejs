import { Parameter } from '../sql/expression/parameter';
import { Scalar } from '../sql/scalar';
import { RowObject } from '../sql/types';

/**
 * 查询结果对象
 * 为了照顾绝大多数调用，将首个行集类型参数作提前处理。
 */
export interface QueryResult<
  T extends RowObject = never,
  R extends Scalar = never,
  O extends [T, ...RowObject[]] = [T]
> {
  /**
   * 返回结果集
   */
  rows: T extends never ? never : T[];

  /**
   * 多数据集返回，目前仅支持mssql
   */
  rowsets?: T extends never
    ? never
    : O extends [infer O1, infer O2, infer O3, infer O4, infer O5]
    ? [O1[], O2[], O3[], O4[], O5[]]
    : O extends [infer O1, infer O2, infer O3, infer O4]
    ? [O1[], O2[], O3[], O4[]]
    : O extends [infer O1, infer O2, infer O3]
    ? [O1[], O2[], O3[]]
    : O extends [infer O1, infer O2]
    ? [O1[], O2[]]
    : [T[]];
  /**
   * 输出参数
   */
  output?: {
    [key: string]: Scalar;
  };
  /**
   * 受影响行数
   */
  rowsAffected: number;
  /**
   * 存储过程调用的返回值
   */
  returnValue?: R;
}



export interface Command {
  sql: string;
  params?: Parameter[];
}
