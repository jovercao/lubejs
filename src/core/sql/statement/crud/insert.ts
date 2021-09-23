import assert from 'assert';
import { CompatibleTable } from '../../rowset/table';
import { CompatibleExpression, Expression } from '../../expression/expression';
import { Field } from '../../expression/field';
import { Table } from '../../rowset/table';
import { Scalar } from '../../scalar';
import { ColumnsOf, InputObject, RowObject } from '../../types';
import { Select } from './select';
import { Statement, STATEMENT_KIND } from '../statement';
import { isScalar } from '../../scalar/util';
import { With } from './with';
import { TableVariant } from '../../rowset';

/**
 * Insert 语句
 */
export class Insert<T extends RowObject = any> extends Statement {
  $table: Table<T>;
  $fields?: Field[];
  $values?: Expression<Scalar>[][] | Select<T>;
  $identityInsert: boolean = false;
  $with?: With;

  readonly $kind: STATEMENT_KIND.INSERT = STATEMENT_KIND.INSERT;

  /**
   * 在插入数据时开启标识列插入，即IdentityInsert On
   * @returns
   */
  withIdentity() {
    this.$identityInsert = true;
    return this;
  }

  /**
   * 构造函数
   */
  constructor(
    table: CompatibleTable<T>,
    fields?: Field<Scalar, ColumnsOf<T>>[] | ColumnsOf<T>[]
  ) {
    super();
    this.$identityInsert = false;
    this.$table = Table.isTable(table) || TableVariant.isTableVariant(table) ? table as Table<T> : Table.create(table);
    if (this.$table.$alias) {
      throw new Error('Insert statements do not allow aliases on table.');
    }
    if (fields) {
      if (typeof fields[0] === 'string') {
        this.$fields = (fields as ColumnsOf<T>[]).map(field =>
          this.$table.$field(field)
        );
      } else {
        this.$fields = fields as Field<Scalar, ColumnsOf<T>>[];
      }
    }
  }

  private _values(items: InputObject<T>[]): Expression[][] {
    if (!this.$fields) {
      const existsFields: { [key: string]: true } = {};
      items.forEach(item =>
        Object.keys(item).forEach(field => {
          if (!existsFields[field]) existsFields[field] = true;
        })
      );
      this.$fields = (Object.keys(existsFields) as ColumnsOf<T>[]).map(
        fieldName => {
          return this.$table.$field(fieldName);
        }
      );
    }
    const fields = this.$fields.map(field => field.$name);

    return items.map((item: any) => {
      return fields.map(fieldName => Expression.ensure(item[fieldName]));
    });
  }

  values(
    rows:
      | Select<T>
      | InputObject<T>
      | InputObject<T>[]
      | CompatibleExpression<Scalar>[]
      | CompatibleExpression<Scalar>[][]
  ): this;
  values(...rows: CompatibleExpression<Scalar>[][] | InputObject<T>[]): this;
  values(...args: any[]): this {
    assert(!this.$values, 'values is declared');
    assert(args.length > 0, 'rows must more than one elements.');
    const values:
      | Select<T>
      | InputObject<T>
      | InputObject<T>[]
      | CompatibleExpression<Scalar>[]
      | CompatibleExpression<Scalar>[][] = args.length > 1 ? args : args[0];

    // Select<T>
    if (Select.isSelect(values)) {
      this.$values = values;
      return this;
    }

    // InputObject<T>
    if (!Array.isArray(values)) {
      this.$values = this._values([values]);
      return this;
    }

    assert(values.length > 0, 'rows must more than one elements.');

    // CompatibleExpression[][]
    if (Array.isArray(values[0])) {
      this.$values = (values as CompatibleExpression[][]).map(row =>
        row.map(exp => Expression.ensure(exp))
      );
      return this;
    }

    // CompatibleExpression[]
    if (isScalar(values[0]) || Expression.isExpression(values[0])) {
      this.$values = [
        (values as CompatibleExpression[]).map(exp => Expression.ensure(exp)),
      ];
      return this;
    }

    // InputObject<T>[]
    this.$values = this._values(values as InputObject<T>[]);
    return this;

    // values(items: InputObject[])
    // 字段从值中提取
  }
  static isInsert(object: any): object is Insert {
    return Statement.isStatement(object) && object.$kind === STATEMENT_KIND.INSERT;
  }
}
