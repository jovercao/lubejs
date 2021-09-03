import { SQL_SYMBOLE } from '../../sql';
import { Condition } from '../../condition/condition';
import { DbType, TsTypeOf } from '../../db-type';
import { CompatibleExpression, Expression } from '../../expression/expression';
import { ColumnDeclare } from './column-declare';
import { CreateTableMember } from './create-table';

export class ColumnDeclareForAdd<
  N extends string = string,
  T extends DbType = DbType
> extends ColumnDeclare<N, T> {
  static isColumnDeclareForAdd(object: any): object is ColumnDeclareForAdd {
    return object?.$type === SQL_SYMBOLE.CREATE_TABLE_COLUMN
  }
  $type: SQL_SYMBOLE.CREATE_TABLE_COLUMN = SQL_SYMBOLE.CREATE_TABLE_COLUMN;
  $default?: Expression<TsTypeOf<T>>;

  $primaryKey?: {
    nonclustered: boolean;
  };

  $calculate?: Expression<TsTypeOf<T>>;
  $identity?: {
    startValue: number;
    increment: number;
  };
  // 检查约束
  $check?: Condition;

  as(expr: Expression<TsTypeOf<T>>): this {
    this.$calculate = expr;
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

  default(value: CompatibleExpression): this {
    this.$default = Expression.ensure(value);
    return this;
  }
}
