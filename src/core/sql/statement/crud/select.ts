import assert from 'assert';
import { BaseScalar, Scalar, isBaseScalar } from '../../scalar';
import { SQL } from '../../sql';
import { AsScalarType, InputObject, RowObject } from '../../types';
import { Star } from '../../object/star';
import type { Condition } from '../../condition';
import {
  XExpression,
  Expression,
  ValuedSelect,
  Field,
  Literal,
} from '../../expression';
import {
  XWithSelect,
  WithSelect,
  XNamedSelect,
  NamedSelect,
} from '../../rowset';
import { Statement, STATEMENT_KIND } from '../statement';
import { COLUMN_NAME_PREEFIX } from './common/select-action';
import { Fromable } from './common/fromable';
import { SelectColumn } from './select-column';
import { Sort, SortObject, SORT_DIRECTION } from './sort';
import { Union } from './union';

/**
 * SELECT查询，传入的表达式会被自动命名为 '#column_' + i;
 */
export class Select<T extends RowObject = any> extends Fromable {
  $top?: number;
  $offset?: number;
  $limit?: number;
  $distinct?: boolean;
  $columns: (SelectColumn<Scalar, string> | Star<any>)[];
  $sorts?: Sort[];
  $groups?: Expression<any>[];
  $having?: Condition;
  $union?: Union<T>;

  readonly $kind: STATEMENT_KIND.SELECT = STATEMENT_KIND.SELECT;

  constructor(
    ...columns:
      | (
          | BaseScalar
          | Expression<Scalar>
          | SelectColumn<Scalar, string>
          | Star<any>
        )[]
      | [results: InputObject<T>]
  ) {
    super();
    assert(
      columns.length > 0,
      'Must select one or more columns by Select statement.'
    );
    if (
      columns.length === 1 &&
      !Star.isStar(columns[0]) &&
      !SelectColumn.isSelectColumn(columns[0]) &&
      !Expression.isExpression(columns[0]) &&
      !isBaseScalar(columns[0])
    ) {
      const results = columns[0];
      this.$columns = Object.entries(results as InputObject<T>).map(
        ([name, expr]: [string, unknown]) => {
          if (Literal.isLiteral(expr) && !expr.$dbType) {
            expr.fitType();
          }
          return new SelectColumn(
            name,
            // 选择项需要转换成目标类型，避免返回类型不对的问题
            Expression.isExpression(expr) ? expr : SQL.literal(expr as Scalar)
          );
        }
      );
      return;
    }
    let i = 0;
    // 实例化
    this.$columns = (
      columns as (XExpression<Scalar> | SelectColumn<Scalar, string>)[]
    ).map(item => {
      if (Field.isField(item)) {
        return item.as(item.$name);
      }
      if (Star.isStar(item) || SelectColumn.isSelectColumn(item)) {
        return item;
      }
      return new SelectColumn(
        COLUMN_NAME_PREEFIX + (++i).toString(),
        Expression.isExpression(item) ? item : SQL.literal(item)
      );
    });
  }

  /**
   * 去除重复的
   */
  distinct() {
    this.$distinct = true;
    return this;
  }

  /**
   * TOP
   * @param rows 行数
   */
  top(rows: number) {
    // assert(typeof this.$top === 'undefined', 'top is declared')
    this.$top = rows;
    return this;
  }

  /**
   * order by 排序
   * @param sorts 排序信息
   */
  orderBy(sorts: Sort[] | SortObject<T>): this;
  orderBy(...sorts: Sort[]): this;
  orderBy(...args: Sort[] | [Sort[] | SortObject<T>]): this {
    // assert(!this.$orders, 'order by clause is declared')
    assert(args.length > 0, 'must have one or more order basis');
    let ds: Sort[] | [SortObject<T>];
    // 如果传入的是对象类型
    if (Array.isArray(args[0])) {
      ds = args[0] as Sort[] | [SortObject<T>];
    } else {
      ds = args as Sort[] | [SortObject<T>];
    }
    if (ds.length === 1 && !Sort.isSort(ds[0])) {
      const obj = ds[0];
      this.$sorts = Object.entries(obj).map(
        ([expr, direction]) => new Sort(expr, direction as SORT_DIRECTION)
      );
      return this;
    }
    this.$sorts = (ds as Sort[]).map(item => {
      if (Sort.isSort(item)) return item;
      if (isBaseScalar(item) || Expression.isExpression(item)) {
        return new Sort(item);
      }
      throw new Error(`Not sortable object: ${item}.`);
    });
    return this;
  }

  /**
   * 分组查询
   * @param groups
   */
  groupBy(...groups: XExpression[]) {
    this.$groups = groups.map(expr =>
      Expression.isExpression(expr) ? expr : SQL.literal(expr)
    );
    return this;
  }

  /**
   * Having 子句
   * @param condition
   */
  having(condition: Condition) {
    assert(!this.$having, 'having is declared');
    assert(this.$groups, 'Syntax error, group by is not declared.');
    this.$having = condition;
    return this;
  }

  /**
   * 偏移数
   * @param rows
   */
  offset(rows: number) {
    this.$offset = rows;
    return this;
  }

  /**
   * 限定数
   * @param rows
   */
  limit(rows: number) {
    // assert(typeof rows === 'number', 'The argument rows must type of Number')
    this.$limit = rows;
    return this;
  }

  /**
   * 合并查询
   */
  union(select: Select<T>, all = false): this {
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    let sel: Select<any> = this;
    // 查找最末端的select，将union关联到最末端select语句中
    while (sel.$union) {
      sel = sel.$union.$select;
    }
    sel.$union = new Union(select, all);
    return this;
  }

  unionAll(select: Select<T>): this {
    return this.union(select, true);
  }

  /**
   * 将本次查询，转换为Table行集
   * @param alias
   */
  as<TAlias extends string>(alias: TAlias): XNamedSelect<T> {
    return NamedSelect.create(this, alias) as any;
  }

  asWith<N extends string>(name: N): XWithSelect<T> {
    return WithSelect.create(name, this) as XWithSelect<T>;
  }

  /**
   * 将本次查询结果转换为值
   */
  asValue<V extends Scalar = AsScalarType<T>>() {
    return new ValuedSelect<V>(this);
  }

  asColumn<N extends string>(name: N) {
    return this.asValue().as(name);
  }

  static isSelect(object: any): object is Select {
    return (
      Statement.isStatement(object) && object.$kind === STATEMENT_KIND.SELECT
    );
  }
}
