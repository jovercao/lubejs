import { Scalar } from "../../core";
import { Entity } from "../entity";
import { OneToManyMetadata, ManyToOneMetadata } from "../metadata";
import { selectProperty } from "../util";
import { ContextBuilder } from "./context-builder";
import { EntityBuilder } from "./entity-builder";


export class OneToManyBuilder<S extends Entity, D extends Entity> {
  isDetail(): this {
    this.metadata.isDetail = true;
    return this;
  }

  constructor(
    private readonly contextBuilder: ContextBuilder,
    private readonly entityBuilder: EntityBuilder<S>,
    public readonly metadata: OneToManyMetadata
  ) {}
}

export class ManyToOneBuilder<S extends Entity, D extends Entity> {
  constructor(
    private readonly contextBuilder: ContextBuilder,
    private readonly entityBuilder: EntityBuilder<S>,
    public readonly metadata: ManyToOneMetadata
  ) {}

  hasConstraintName(name: string) {
    this.metadata.constraintName = name;
  }

  /**
   * 声明外键属性
   * @param selector
   * @returns
   */
  hasForeignKey<P extends Scalar>(selector: (p: Required<S>) => P): this {
    if (selector) {
      const property: string = selectProperty(selector);
      if (!property) throw new Error(`Please select a property.`);
      this.metadata.foreignProperty = property;
      // const foreingColumn = this.entityBuilder.metadata.getColumn(property);
      // if (!foreingColumn) {
      //   this.entityBuilder.column(property, );
      //   this.metadata.foreignColumn = this.entityBuilder.column(property);
      // }
    }
    return this;
  }

  isRequired(): this {
    this.metadata.isRequired = true;
    return this;
  }

  isCascade(): Omit<this, 'isCascade'> {
    this.metadata.isCascade = true;
    return this;
  }

  hasComment(comment: string): Omit<this, 'hasComment'> {
    this.metadata.comment = comment;
    return this;
  }
}
