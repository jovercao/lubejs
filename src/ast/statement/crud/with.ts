import { AST, SQL_SYMBOLE } from "../../ast";
import { Field } from "../../expression/field";
import { CompatiableObjectName } from "../../object/db-object";
import { WithSelect } from "../../rowset/with-select";
import { CompatibleTable } from '../../rowset/table'
import { Scalar } from "../../scalar";
import { SqlBuilder } from "../../../sql-builder";
import { ColumnsOf, RowObject } from "../../types";
import { SelectAction } from "./common/select-action";
import { Delete } from "./delete";
import { Insert } from "./insert";
import { Select } from "./select";
import { Update } from "./update";

export class With<A extends SelectAliasObject = any> extends AST {
  $type: SQL_SYMBOLE.WITH = SQL_SYMBOLE.WITH;

  $rowsets: WithSelect[];

  /**
   * With结构
   */
  constructor(items: WithSelect<any, string>[] | SelectAliasObject) {
    super();
    if (Array.isArray(items)) {
      this.$rowsets = items;
    } else {
      this.$rowsets = Object.entries(items).map(
        ([name, sel]) => WithSelect.create(name, sel)
      );
    }
  }

  /**
   * select查询
   */
  select: SelectAction = (...args: any[]): any => {
    const sql = SqlBuilder.select(...args);
    sql.$with = this;
    return sql;
  };

  /**
   * 插入至表,into的别名
   * @param table
   * @param fields
   */
  insert<T extends RowObject = any>(
    table: CompatiableObjectName | CompatibleTable<T, string>,
    fields?: ColumnsOf<T>[] | Field<Scalar, ColumnsOf<T>>[]
  ): Insert<T> {
    const sql = SqlBuilder.insert(table, fields);
    sql.$with = this;
    return sql;
  }

  /**
   * 更新一个表格
   * @param table
   */
  update<T extends RowObject = any>(
    table: CompatiableObjectName | CompatibleTable<T, string>
  ): Update<T> {
    const sql = SqlBuilder.update(table);
    sql.$with = this;
    return sql;
  }

  /**
   * 删除一个表格
   * @param table 表格
   */
  delete<T extends RowObject = any>(
    table: CompatiableObjectName | CompatibleTable<T, string>
  ): Delete<T> {
    const sql = SqlBuilder.delete(table);
    sql.$with = this;
    return sql;
  }
}


export type SelectAliasObject = {
  [alias: string]: Select;
};
