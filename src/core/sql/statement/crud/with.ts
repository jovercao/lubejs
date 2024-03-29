import { SQL, SQL_SYMBOLE } from '../../sql';
import { Field } from '../../expression';
import { XObjectName } from '../../object';
import { XWithSelect, WithSelect, XTables } from '../../rowset';
import { Scalar } from '../../scalar';
import { ColumnsOf, RowObject } from '../../types';
import { SelectAction } from './common/select-action';
import { Delete } from './delete';
import { Insert } from './insert';
import { Select } from './select';
import { Update } from './update';

export class With<A extends SelectAliasObject = any> extends SQL {
  readonly $type: SQL_SYMBOLE.WITH = SQL_SYMBOLE.WITH;

  $rowsets: WithSelect[];

  /**
   * With结构
   */
  constructor(
    ...items:
      | WithSelect[]
      | [WithSelect[]]
      | XWithSelect[]
      | [XWithSelect[]]
      | [SelectAliasObject]
  ) {
    super();
    if (
      items.length === 0 &&
      !Array.isArray(items[0]) &&
      !WithSelect.isWithSelect(items[0])
    ) {
      this.$rowsets = Object.entries(items[0]).map(([name, sel]) =>
        WithSelect.create(name, sel)
      );
    } else if (Array.isArray(items[0])) {
      this.$rowsets = items[0] as WithSelect[];
    } else {
      this.$rowsets = items as WithSelect[];
    }
  }

  /**
   * select查询
   */
  select: SelectAction = (...args: any[]): any => {
    const sql = new Select(...args);
    sql.$with = this;
    return sql;
  };

  /**
   * 插入至表,into的别名
   * @param table
   * @param fields
   */
  insert<T extends RowObject = any>(
    table: XObjectName | XTables<T>,
    fields?: ColumnsOf<T>[] | Field<Scalar, ColumnsOf<T>>[]
  ): Insert<T> {
    const sql = new Insert(table, fields);
    sql.$with = this;
    return sql;
  }

  /**
   * 更新一个表格
   * @param table
   */
  update<T extends RowObject = any>(
    table: XObjectName | XTables<T>
  ): Update<T> {
    const sql = new Update(table);
    sql.$with = this;
    return sql;
  }

  /**
   * 删除一个表格
   * @param table 表格
   */
  delete<T extends RowObject = any>(
    table: XObjectName | XTables<T>
  ): Delete<T> {
    const sql = new Delete(table);
    sql.$with = this;
    return sql;
  }
}

export type SelectAliasObject = {
  [alias: string]: Select;
};
