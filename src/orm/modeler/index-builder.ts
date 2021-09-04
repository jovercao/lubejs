import { Scalar } from "../../core";
import { Entity } from "../entity";
import { IndexMetadata } from "../metadata";
import { selectProperty } from "../util";
import { ContextBuilder } from "./context-builder";
import { EntityBuilder } from "./entity-builder";


export class IndexBuilder<T extends Entity> {
  constructor(
    contextBuilder: ContextBuilder,
    entityBuilder: EntityBuilder<T>,
    public readonly metadata: IndexMetadata
  ) {}

  hasName(name: string): this {
    this.metadata.name = name;
    return this;
  }

  isUnique(unique: false): this;
  isUnique(unique: true, clustered: boolean): this;
  isUnique(unique?: boolean): this;
  isUnique(unique: boolean = true, clustered?: boolean): this {
    this.metadata.isUnique = unique;
    if (unique) {
      this.metadata.isClustered = clustered!;
    } else {
      this.metadata.isClustered = false;
    }
    return this;
  }

  // isClustered(clustered: boolean = true): this {
  //   this.metadata.isClustered = clustered;
  //   return this;
  // }

  hasComment(comment: string): this {
    this.metadata.comment = comment;
    return this;
  }

  // withProperties(selector: (p: Required<T>) => Scalar[]): this;
  // withProperties(selector: { [K in keyof T]?: 'ASC' | 'DESC' }): this;
  withProperties(
    selector:
      | { [K in keyof T]?: 'ASC' | 'DESC' }
      | ((p: Required<T>) => Scalar[])
  ): this {
    this.metadata.properties =
      typeof selector === 'function' ? selectProperty(selector) : selector;
    return this;
  }
}
