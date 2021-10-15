import assert from 'assert';
import { XTables, Table, TableVariant } from '../../rowset';
import { XExpression, Expression, Field } from '../../expression';
import { ColumnsOf, InputObject, RowObject } from '../../types';
import { Scalar, isBaseScalar, isList } from '../../scalar';
import { SQL } from '../../sql';
import { Statement, STATEMENT_KIND } from '../statement';
import { Select } from './select';
import type { With } from './with';
import { args } from 'commander';

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
    table: XTables<T>,
    fields?: Field<Scalar, ColumnsOf<T>>[] | ColumnsOf<T>[]
  ) {
    super();
    this.$identityInsert = false;
    this.$table =
      Table.isTable(table) || TableVariant.isTableVariant(table)
        ? (table as Table<T>)
        : Table.create(table);
    if (this.$table.$alias) {
      throw new Error('Insert statements do not allow aliases on table.');
    }
    if (fields) {
      this.fields(fields);
    }
  }

  /**
   * 指定插入字段，当使用数组值列表时，必须指定字段名
   */
  fields(
    ...fields:
      | Field<Scalar, ColumnsOf<T>>[]
      | ColumnsOf<T>[]
      | [Field<Scalar, ColumnsOf<T>>[] | ColumnsOf<T>[]]
  ) {
    if (Array.isArray(fields[0])) {
      fields = fields[0];
    }
    if (typeof fields[0] === 'string') {
      this.$fields = (fields as ColumnsOf<T>[]).map(field =>
        this.$table.$field(field)
      );
    } else {
      this.$fields = fields as Field<Scalar, ColumnsOf<T>>[];
    }
  }

  // 将值推入内部，最大1000条。
  private _values(
    items: InputObject<T>[],
    FIELDS_SEARCH_MAX_SIZE = 1000
  ): Expression[][] {
    if (!this.$fields) {
      const existsFields: { [key: string]: true } = {};
      for (let i = 0; i < Math.min(FIELDS_SEARCH_MAX_SIZE, items.length); i++) {
        const item = items[i];
        Object.keys(item).forEach(field => {
          if (!existsFields[field]) existsFields[field] = true;
        });
      }
      this.$fields = (Object.keys(existsFields) as ColumnsOf<T>[]).map(
        fieldName => {
          return this.$table.$field(fieldName);
        }
      );
    }
    const fields = this.$fields.map(field => field.$name);

    return items.map((item: any) => {
      return fields.map(fieldName => SQL.literal(item[fieldName]));
    });
  }

  // TIPS: 此处埋下一个巨坑，values重载无法保证百分百识别出：值列表或者值列表数组或者对象数组。
  // 如果传数组数据，需要先调用.fields();
  values(
    rows:
      | Select<T>
      | InputObject<T>
      | InputObject<T>[]
      | XExpression[]
      | XExpression[][]
  ): this;
  values(...rows: XExpression[][] | InputObject<T>[]): this;
  values(
    ...args:
      | XExpression[][]
      | InputObject<T>[]
      | [
          | Select<T>
          | InputObject<T>
          | InputObject<T>[]
          | XExpression[]
          | XExpression[][]
        ]
  ): this {
    assert(!this.$values, 'Values is exists.');
    assert(args.length > 0, 'rows must more than one elements.');

    // args: [Select<T>]
    if (args.length === 1 && Select.isSelect(args[0])) {
      this.$values = args[0];
      return this;
    }

    // args: [InputObject<T>]
    if (
      !Array.isArray(args[0]) &&
      !this.$fields &&
      args.length === 1 &&
      isInputObject(args[0])
    ) {
      this.$values = this._values(args as InputObject<T>[]);
      return this;
    }
    // args: InputObject<T>[]
    if (!this.$fields && isInputObjectArray(args)) {
      this.$values = this._values(args as InputObject<T>[]);
      return this;
    }
    // args: [InputObject<T>[]]
    if (
      Array.isArray(args[0]) &&
      !this.$fields &&
      isInputObjectArray(args[0])
    ) {
      this.$values = this._values(args[0] as InputObject<T>[]);
      return this;
    }

    assert(this.$fields, `Must call .fields() first, when use array values.`);

    // args: [Scalar[][]]
    if (
      Array.isArray(args[0]) &&
      args.length === 1 &&
      isRowDataArray(args[0], this.$fields.length)
    ) {
      this.$values = (args[0] as XExpression[][]).map(row => {
        assert(row.length === this.$fields?.length, `Values count must same with fields.`);
        return row.map(exp => (Expression.isExpression(exp) ? exp : SQL.literal(exp)))
      });
      return this;
    }

    // args: Scalar[][] | [Scalar[]]
    // if (isRowDataArray(args, this.$fields.length)) {
    this.$values = (args as XExpression[][] | [Scalar[]]).map(row => {
      assert(row.length === this.$fields?.length, `Values count must same with fields.`);
      return row.map(exp => (Expression.isExpression(exp) ? exp : SQL.literal(exp)))
    });
    return this;
    // }
  }
  static isInsert(object: any): object is Insert {
    return (
      Statement.isStatement(object) && object.$kind === STATEMENT_KIND.INSERT
    );
  }

  static isRowDataArray = isRowDataArray;
}

function isInputObject(object: any): object is InputObject {
  return (
    typeof object === 'object' &&
    !Array.isArray(object) &&
    !isBaseScalar(object)
  );
}

/**
 * 判断是否为InputObject数组
 */
function isInputObjectArray(
  datas: any[],
  MAX_SEARCH_SIZE = 100
): datas is InputObject[] {
  for (let i = 0; i < Math.min(MAX_SEARCH_SIZE, datas.length); i++) {
    if (!isInputObject(datas[i])) {
      return false;
    }
  }

  return true;
}

/**
 * 判断一个数组是否是一个值列表数组，即Scalar[][];
 */
function isRowDataArray(
  items: any,
  /**
   * 值数量
   */
  valueLength: number,
  MAX_SEARCH_SIZE = 10
): items is Scalar[][] {
  if (!Array.isArray(items)) return false;
  if (items.length === 0) return false;
  // 每一行的值数量与字段数量匹配，则表示是值列表数组
  for (let i = 0; i < Math.min(MAX_SEARCH_SIZE, items.length); i++) {
    if (!(Array.isArray(items[i]) && items[i].length === valueLength))
      return false;
  }
  return true;
}
