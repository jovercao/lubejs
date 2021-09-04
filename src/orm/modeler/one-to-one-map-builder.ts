import { Entity } from "../entity";
import { OneToOneMetadata, ForeignOneToOneMetadata } from "../metadata";
import { selectProperty } from "../util";
import { ContextBuilder } from "./context-builder";
import { EntityBuilder } from "./entity-builder";
import { PrimaryOneToOneBuilder, ForeignOneToOneBuilder } from "./one-to-one-builder";

export class OneToOneMapBuilder<S extends Entity, D extends Entity> {
  constructor(
    private readonly contextBuilder: ContextBuilder,
    private readonly entityBuilder: EntityBuilder<S>,
    public readonly metadata: OneToOneMetadata
  ) {}

  /**
   * 声明当前实体在一对一关系中占主键地位
   */
  isPrimary(): PrimaryOneToOneBuilder<S, D> {
    this.assertPrimary();
    if (this.metadata.referenceProperty) {
      const referenceRelation = this.metadata.referenceEntity.getRelation(
        this.metadata.referenceProperty
      ) as OneToOneMetadata;
      if (referenceRelation) {
        if (referenceRelation.isPrimary === true) {
          throw new Error(
            `Entity ${
              this.entityBuilder.metadata!.class!.name
            } PrimaryOneToOne relation ${
              this.metadata.property
            }, reference relation must be ForeignOneToOne relation, use .hasForeignKey()`
          );
        } else {
          // 补齐
          referenceRelation.isPrimary = false;
        }
        this.metadata.referenceRelation = referenceRelation;
      }
    }
    this.metadata.isPrimary = true;
    return new PrimaryOneToOneBuilder<S, D>(
      this.contextBuilder,
      this.entityBuilder,
      this.metadata
    );
  }

  /**
   * 声明为一对一（从）关系，并指定外键属性
   * @param selector
   * @returns
   */
  hasForeignKey(selector?: (p: S) => D): ForeignOneToOneBuilder<S, D> {
    this.assertPrimary();
    this.metadata.isPrimary = false;
    if (selector) {
      const foreignProperty: string = selectProperty(selector);
      if (!foreignProperty) {
        throw new Error(`Pls select a property`);
      }
      (this.metadata as ForeignOneToOneMetadata).foreignProperty =
        foreignProperty;
    }
    return new ForeignOneToOneBuilder<S, D>(
      this.contextBuilder,
      this.entityBuilder,
      this.metadata
    );
  }

  private assertPrimary() {
    if (this.metadata.isPrimary !== undefined) {
      throw new Error(`Primary is ensured, pls do not repeat that.`);
    }
  }
}
