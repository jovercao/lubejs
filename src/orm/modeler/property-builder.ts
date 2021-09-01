import { Scalar, DbType, ProxiedRowset, CompatibleExpression, Expression } from "../../core";
import { DbInstance } from "../db-context";
import { Entity } from "../entity";
import { ColumnMetadata } from "../metadata";
import { ContextBuilder } from "./context-builder";
import { EntityBuilder } from "./entity-builder";

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
    return this;
  }

  /**
   * 列自动填充值，通过表达式生成，如调用函数等
   * @param generator
   * @returns
   */
  isAutogen(
    generator: (
      rowset: ProxiedRowset<T>,
      item: T,
      context: DbInstance
    ) => CompatibleExpression<V>
  ): Omit<this, 'isAutogen'> {
    this.metadata.generator = generator as any;
    return this;
  }

  /**
   * 是否可空
   */
  isNullable(): Omit<this, 'isNullable'> {
    this.metadata.isNullable = true;
    return this;
  }

  isRequired(): this {
    this.metadata.isNullable = false;
    return this;
  }

  /**
   * 行标记列，每次更新时自动变换值
   */
  isRowflag(): Omit<this, 'isRowflag'> {
    // if (this.metadata.dbType) {
    //   if (this.metadata.dbType.name !== 'ROWFLAG') {
    //     throw new Error('Rowflag column must type of ROWFLAG.');
    //   }
    // } else {
    this.metadata.dbType = DbType.rowflag;
    // }
    this.metadata.isRowflag = true;
    return this;
  }

  /**
   * 标识列
   */
  isIdentity(seed?: number, step?: number): Omit<this, 'isIdentity'> {
    this.metadata.isIdentity = true;
    this.metadata.identityStartValue = seed ?? 0;
    this.metadata.identityIncrement = step ?? 1;
    return this;
  }

  /**
   * 默认值
   */
  hasDefaultValue(
    expr: CompatibleExpression<V>
  ): Omit<this, 'hasDefaultValue' | 'asCalculated'> {
    this.metadata.defaultValue = Expression.ensure(expr);
    return this;
  }

  /**
   * 摘要说明
   */
  hasComment(comment: string): Omit<this, 'commentBy'> {
    this.metadata.comment = comment;
    return this;
  }

  /**
   * 将列声明为计算列
   */
  isCalculated(expr: CompatibleExpression<V>): this {
    this.metadata.isCalculate = true;
    this.metadata.calculateExpression = Expression.ensure(expr);
    return this;
  }
}
