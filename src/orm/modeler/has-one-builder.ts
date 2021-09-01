import { Entity } from "../entity";
import { HasOneMetadata, OneToOneMetadata, OneToManyMetadata, ManyToOneMetadata } from "../metadata";
import { selectProperty } from "../util";
import { ContextBuilder } from "./context-builder";
import { EntityBuilder } from "./entity-builder";
import { ManyToOneBuilder } from "./one-to-many-builder";
import { OneToOneMapBuilder } from "./one-to-one-map-builder";

export class HasOneBuilder<S extends Entity, D extends Entity> {
  constructor(
    private contextBuilder: ContextBuilder,
    private entityBuilder: EntityBuilder<S>,
    public readonly metadata: Partial<HasOneMetadata>
  ) {}

  private assertWith() {
    if (this.metadata.kind) {
      throw new Error(
        `HasManyMetadata is withed ${this.metadata.kind} relation.`
      );
    }
  }

  withOne(selector?: (p: Required<D>) => S): OneToOneMapBuilder<S, D> {
    this.assertWith();
    this.metadata.kind = 'ONE_TO_ONE';
    if (this.metadata.referenceProperty) {
      const referenceRelation = this.metadata.referenceEntity!.getRelation(
        this.metadata.referenceProperty
      ) as OneToOneMetadata;
      if (referenceRelation) {
        // 相互关联对向关系
        this.metadata.referenceRelation = referenceRelation;
        referenceRelation.referenceRelation = this.metadata as OneToOneMetadata;
        referenceRelation.referenceProperty = this.metadata.property;
      }
    }
    if (selector) {
      this.metadata.referenceProperty = selectProperty(selector);
      if (!this.metadata.referenceProperty) {
        throw new Error('Please select a property');
      }
    }
    const oneToOne = new OneToOneMapBuilder<S, D>(
      this.contextBuilder,
      this.entityBuilder,
      this.metadata as OneToOneMetadata
    );
    return oneToOne;
  }

  withMany(selector?: (p: Required<D>) => S[]): ManyToOneBuilder<S, D> {
    this.assertWith();
    this.metadata.kind = 'MANY_TO_ONE';
    if (selector) {
      this.metadata.referenceProperty = selectProperty(selector);
      if (!this.metadata.referenceProperty) {
        throw new Error('Please select a property');
      }
      const referenceRelation = this.metadata.referenceEntity!.getRelation(
        this.metadata.referenceProperty
      ) as OneToManyMetadata;
      if (referenceRelation) {
        // 相互关联对向关系
        this.metadata.referenceRelation = referenceRelation;
        referenceRelation.referenceRelation = this
          .metadata as ManyToOneMetadata;
        referenceRelation.referenceProperty = this.metadata.property!;
      }
    }
    const oneToMay = new ManyToOneBuilder<S, D>(
      this.contextBuilder,
      this.entityBuilder,
      this.metadata as ManyToOneMetadata
    );
    return oneToMay;
  }
}
