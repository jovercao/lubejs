import assert from 'assert';
import { CompatibleCondition, Condition } from '../../condition/condition';
import { CompatibleExpression, Expression } from '../../expression/expression';
import { ValuedSelect } from '../../expression/valied-select';
import { ProxiedWithSelect, WithSelect } from '../../rowset/with-select';
import { ProxiedNamedSelect, NamedSelect } from '../../rowset/named-select';
import { Scalar } from '../../scalar';
import { isScalar } from '../../scalar/util';
import { AsScalarType, InputObject, RowObject } from '../../types';
import { isPlainObject } from '../../util';
import { Statement, STATEMENT_KIND } from '../statement';
import { Fromable } from './common/fromable';
import { SelectColumn } from './select-column';
import { CompatibleSortInfo, Sort, SortObject, SORT_DIRECTION } from './sort';
import { Star } from './star';

import { Union } from './union';
import { Field } from '../../expression';
import { COLUMN_NAME_PREEFIX } from './common/select-action';

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

  constructor(results?: InputObject<T>);
  constructor(
    ...columns: (
      | CompatibleExpression<Scalar>
      | SelectColumn<Scalar, string>
      | Star<any>
    )[]
  );
  constructor(...columns: any) {
    super();
    assert(
      columns.length > 0,
      'Must select one or more columns by Select statement.'
    );
    if (columns.length === 1 && isPlainObject(columns[0])) {
      const results = columns[0];
      this.$columns = Object.entries(results as InputObject<T>).map(
        ([name, expr]: [string, unknown]) => {
          return new SelectColumn(
            name,
            Expression.ensure(expr as CompatibleExpression)
          );
        }
      );
      return;
    }
    let i = 0;
    // 实例化
    this.$columns = (
      columns as (CompatibleExpression<Scalar> | SelectColumn<Scalar, string>)[]
    ).map(item => {
      if (Field.isField(item)) {
        return item.as();
      }
      if (Star.isStar(item) || SelectColumn.isSelectColumn(item)) {
        return item;
      }
      return new SelectColumn(
        COLUMN_NAME_PREEFIX + (++i).toString(),
        Expression.ensure(item)
      );

      // if (
      //   Expression.isExpression(item) ||
      //   SelectColumn.isSelectColumn(item) ||
      //   Star.isStar(item)
      // )
      //   return item;
      // return Expression.ensure(item);
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
  orderBy(
    sorts:
      | SortObject<T>
      | (
          | Sort
          | CompatibleExpression<Scalar>
          | [CompatibleExpression, SORT_DIRECTION]
        )[]
  ): this;
  orderBy(
    ...sorts: (
      | Sort
      | CompatibleExpression<Scalar>
      | [CompatibleExpression, SORT_DIRECTION]
    )[]
  ): this;
  orderBy(sorts: CompatibleSortInfo): this;
  orderBy(...args: any[]): this {
    // assert(!this.$orders, 'order by clause is declared')
    assert(args.length > 0, 'must have one or more order basis');
    // 如果传入的是对象类型
    if (args.length === 1) {
      if (isPlainObject(args[0])) {
        const obj = args[0];
        this.$sorts = Object.entries(obj).map(
          ([expr, direction]) => new Sort(expr, direction as SORT_DIRECTION)
        );
        return this;
      }
      if (Array.isArray(args[0])) {
        args = args[0];
      }
    }
    const sorts = args as (
      | Sort
      | CompatibleExpression<Scalar>
      | [CompatibleExpression, SORT_DIRECTION]
    )[];
    this.$sorts = sorts.map(item =>
      Sort.isSortInfo(item)
        ? item
        : isScalar(item) || Expression.isExpression(item)
        ? new Sort(item as CompatibleExpression<Scalar>)
        : new Sort(item[0], item[1])
    );
    return this;
  }

  /**
   * 分组查询
   * @param groups
   */
  groupBy(...groups: CompatibleExpression<Scalar>[]) {
    this.$groups = groups.map(expr => Expression.ensure(expr));
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
  as<TAlias extends string>(alias: TAlias): ProxiedNamedSelect<T> {
    return NamedSelect.create(this, alias) as any;
  }

  asWith<N extends string>(name: N): ProxiedWithSelect<T, N> {
    return WithSelect.create(name, this) as ProxiedWithSelect<T, N>;
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
