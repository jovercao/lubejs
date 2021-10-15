import { SQL, SQL_SYMBOLE } from '../../sql';
import type { Expression } from '../../expression';
import { Scalar } from '../../scalar';

/**
 * 列表达式
 */
export class SelectColumn<
  T extends Scalar = Scalar,
  N extends string = string
> extends SQL {
  readonly $type: SQL_SYMBOLE.SELECT_COLUMN = SQL_SYMBOLE.SELECT_COLUMN;

  /**
   * 列名称
   */
  $name!: N;

  /**
   * 表达式
   */
  readonly $expr: Expression<T>;

  /**
   * 别名构造函数
   * @param expr 表达式或表名
   * @param name 别名
   */
  constructor(name: N, expr: Expression<T>) {
    super();
    this.$name = name;
    // assertType(expr, [DbObject, Field, Constant, Select], 'alias must type of DbObject|Field|Constant|Bracket<Select>')
    this.$expr = expr;
  }

  static isSelectColumn(object: any): object is SelectColumn {
    return object.$type === SQL_SYMBOLE.SELECT_COLUMN;
  }
}
