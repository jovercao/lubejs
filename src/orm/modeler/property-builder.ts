import {
  Scalar,
  DbType,
  XRowset,
  XExpression,
  Expression,
  SQL,
} from '../../core';
import { DbContext } from '../db-context';
import { Entity } from '../entity';
import { ColumnMetadata } from '../metadata';
import { ContextBuilder } from './context-builder';
import { EntityBuilder } from './entity-builder';
import { dataTypeToDbType } from './util';

export class PropertyBuilder<T extends Entity, V extends Scalar = Scalar> {
  constructor(
    private readonly contextBuilder: ContextBuilder,
    private readonly entityBuilder: EntityBuilder<T>,
    public readonly metadata: Partial<ColumnMetadata<V>>
  ) {}

  /**
   * 声明为列
   */
  hasColumnName(columnName: string): Omit<this, 'hasName'> {
    this.metadata.columnName = columnName;
    return this;
  }

  /**
   * 数据类型
   */
  hasType(dbType: DbType): Omit<this, 'hasType'> {
    this.metadata.dbType = dbType;
    this.metadata.isRowflag = dbType.type === 'ROWFLAG';
    return this;
  }

  /**
   * 列自动填充值，通过表达式生成，如调用函数等
   * @param generator
   * @returns
   */
  isAutogen(
    generator: (
      rowset: XRowset<T>,
      item: T,
      context: DbContext
    ) => XExpression<V>
  ): this {
    this.metadata.generator = generator as any;
    return this;
  }

  isNotAutogen(): this {
    delete this.metadata.generator;
    return this;
  }

  /**
   * 是否可空
   */
  isNullable(yesOrNo: boolean = true): Omit<this, 'isNullable'> {
    this.metadata.isNullable = yesOrNo;
    return this;
  }

  isRequired(yesOrNo: boolean = true): this {
    this.metadata.isNullable = yesOrNo;
    return this;
  }

  /**
   * 行标记列，每次更新时自动变换值
   * 同时会修改列的类型为DbType.rowflag
   */
  isRowflag(yesOrNo: boolean = true): Omit<this, 'isRowflag'> {
    if (yesOrNo) {
      this.metadata.dbType = DbType.rowflag;
    } else {
      if (this.metadata.type) {
        this.metadata.dbType = dataTypeToDbType(this.metadata.type);
      } else {
        throw new Error(`Property ${this.metadata.property} has not type yet.`);
      }
    }
    this.metadata.isRowflag = yesOrNo;
    return this;
  }

  /**
   * 标识列
   */
  isIdentity(seed?: number, step?: number): this {
    this.metadata.isIdentity = true;
    this.metadata.identityStartValue = seed ?? 0;
    this.metadata.identityIncrement = step ?? 1;
    return this;
  }

  /**
   * 移除标识列
   */
  isNotIdentity(): this {
    this.metadata.isIdentity = false;
    delete this.metadata.identityStartValue;
    delete this.metadata.identityIncrement;
    return this;
  }

  /**
   * 默认值
   */
  hasDefaultValue(expr: XExpression<V>): this {
    this.metadata.defaultValue = Expression.ensureExpression(expr);
    return this;
  }

  /**
   * 移除默认值
   */
  hasNoDefaultValue(): this {
    delete this.metadata.defaultValue;
    return this;
  }

  /**
   * 摘要说明
   */
  hasComment(comment?: string): Omit<this, 'commentBy'> {
    this.metadata.comment = comment;
    return this;
  }

  /**
   * 将列声明为计算列
   */
  isCalculated(expr: XExpression<V>): this {
    this.metadata.isCalculate = true;
    this.metadata.calculateExpression = Expression.ensureExpression(expr);
    return this;
  }

  isNotCalculated(): this {
    this.metadata.isCalculate = false;
    delete this.metadata.calculateExpression;
    return this;
  }
}
