import { Entity } from '../entity';
import {
  HasManyMetadata,
  ManyToOneMetadata,
  OneToManyMetadata,
  ManyToManyMetadata,
} from '../metadata';
import { selectProperty } from '../util';
import { ContextBuilder } from './context-builder';
import { EntityBuilder } from './entity-builder';
import { ManyToManyBuilder } from './many-to-many-builder';
import { OneToManyBuilder } from './one-to-many-builder';

export class HasManyBuilder<S extends Entity, D extends Entity> {
  constructor(
    private readonly contextBuilder: ContextBuilder,
    private readonly entityBuilder: EntityBuilder<S>,
    public readonly metadata: Partial<HasManyMetadata>
  ) {}

  private assertWith() {
    if (this.metadata.kind) {
      throw new Error(
        `HasManyMetadata is withed ${this.metadata.kind} relation.`
      );
    }
  }

  withOne(selector?: (p: Required<D>) => S): OneToManyBuilder<S, D> {
    this.assertWith();
    this.metadata.kind = 'ONE_TO_MANY';
    if (selector) {
      this.metadata.referenceProperty = selectProperty(selector);
      if (!this.metadata.referenceProperty) {
        throw new Error('Please select a property');
      }
      const referenceRelation = this.metadata.referenceEntity!.getRelation(
        this.metadata.referenceProperty
      ) as ManyToOneMetadata;
      if (referenceRelation) {
        this.metadata.referenceRelation = referenceRelation;
        referenceRelation.referenceRelation = this
          .metadata as OneToManyMetadata;
        referenceRelation.referenceProperty = this.metadata.property!;
      }
    }
    const manyToOne = new OneToManyBuilder<S, D>(
      this.contextBuilder,
      this.entityBuilder,
      this.metadata as OneToManyMetadata
    );
    return manyToOne;
  }

  withMany(selector?: (p: Required<D>) => S[]): ManyToManyBuilder<S, D> {
    this.assertWith();
    this.metadata.kind = 'MANY_TO_MANY';
    const metadata: Partial<ManyToManyMetadata> = this
      .metadata as ManyToManyMetadata;
    if (selector) {
      metadata.referenceProperty = selectProperty(selector);
      if (!metadata.referenceProperty) {
        throw new Error('Please select a property');
      }
      const referenceRelation = this.metadata.referenceEntity!.getRelation(
        this.metadata.referenceProperty!
      ) as ManyToManyMetadata | undefined;
      if (referenceRelation) {
        // 相互关联对向关系
        this.metadata.referenceRelation = referenceRelation;
        referenceRelation.referenceRelation = this
          .metadata as ManyToManyMetadata;
        referenceRelation.referenceProperty = this.metadata.property!;
      }
    }

    const builder = new ManyToManyBuilder<S, D>(
      this.contextBuilder,
      this.entityBuilder,
      this.metadata as ManyToManyMetadata
    );
    return builder;
  }
}
