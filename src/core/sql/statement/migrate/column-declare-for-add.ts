import { SQL, SQL_SYMBOLE } from '../../sql';
import { Condition } from '../../condition';
import { DbType, ScalarFromDbType } from '../../db-type';
import { XExpression, Expression } from '../../expression';
import { ColumnDeclare } from './column-declare';

export class ColumnDeclareForAdd<
  N extends string = string,
  T extends DbType = DbType
> extends ColumnDeclare<N, T> {
  static isColumnDeclareForAdd(object: any): object is ColumnDeclareForAdd {
    return object?.$type === SQL_SYMBOLE.CREATE_TABLE_COLUMN;
  }
  readonly $type: SQL_SYMBOLE.CREATE_TABLE_COLUMN = SQL_SYMBOLE.CREATE_TABLE_COLUMN;
  $default?: Expression<ScalarFromDbType<T>>;

  $primaryKey?: {
    nonclustered: boolean;
  };

  $calculate?: Expression<ScalarFromDbType<T>>;
  $identity?: {
    startValue: number;
    increment: number;
  };
  // 检查约束
  $check?: Condition;

  as(value: Expression<ScalarFromDbType<T>>): this {
    this.$calculate = value;
    return this;
  }
  identity(startValue: number = 0, increment: number = 1): this {
    this.$identity = {
      startValue,
      increment,
    };
    return this;
  }

  check(sql: Condition): this {
    this.$check = sql;
    return this;
  }

  primaryKey(nonclustered: boolean = false): this {
    this.$primaryKey = {
      nonclustered,
    };
    return this;
  }

  default(value: XExpression): this {
    this.$default = Expression.isExpression(value) ? value : SQL.literal(value);
    return this;
  }
}
