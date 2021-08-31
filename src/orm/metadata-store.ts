import { DbContextConstructor } from "./db-context";
import { DbContextMetadata, EntityMetadata } from "./metadata";
import { EntityType } from "./types";

/**********************************装饰器声明*************************************/
export class MetadataStore {
  private entityMap: Map<EntityType, EntityMetadata> = new Map();
  private contextMap: Map<DbContextConstructor, DbContextMetadata> = new Map();
  private _defaultContext?: DbContextMetadata;

  /**
   * 默认DbContext元数据
   */
  get defaultContext(): DbContextMetadata {
    if (!this._defaultContext) {
      throw new Error(`No DbContext is registered.`);
    }
    return this._defaultContext;
  }
  /**
   * 可以通过实体构造函数/实体名称 获取已注册的元数据
   */
  getEntity(entityClass: EntityType): EntityMetadata {
    const entity = this.entityMap.get(entityClass);
    if (!entity) {
      throw new Error(`Entity ${entityClass.name} is not reigster.`);
    }
    return entity;
  }
  /**
   * 注册一个实体
   */
  registerEntity(metadata: EntityMetadata) {
    if (this.entityMap.has(metadata.class)) {
      throw new Error(`Entity ${metadata.class.name} is registered.`);
    }
    this.entityMap.set(metadata.class, metadata);
    return this;
  }
  /**
   * 获取上下文无数据
   */
  getContext(name: string): DbContextMetadata;
  getContext(contextClass: DbContextConstructor): DbContextMetadata;
  getContext(nameOrClass: DbContextConstructor | string): DbContextMetadata;
  getContext(contextClass: DbContextConstructor | string): DbContextMetadata {
    let metadata: DbContextMetadata | undefined;
    if (typeof contextClass === 'string') {
      metadata = Array.from(this.contextMap.values()).find(
        metadata => metadata.class.name === contextClass
      );
    } else {
      metadata = this.contextMap.get(contextClass);
    }
    if (!metadata) {
      throw new Error(
        `DbContext ${
          typeof contextClass === 'string' ? contextClass : contextClass.name
        } not register`
      );
    }
    return metadata;
  }

  /**
   * 注册上下文
   */
  registerContext(metadata: DbContextMetadata): this {
    if (this.contextMap.has(metadata.class)) {
      throw new Error(`DbContext ${metadata.class.name} is registered.`);
    }
    this.contextMap.set(metadata.class, metadata);
    for (const entity of metadata.entities) {
      this.registerEntity(entity);
    }
    if (!this._defaultContext) {
      this._defaultContext = metadata;
    }
    return this;
  }
}

/**
 * 公共元数据存储
 */
export const metadataStore = new MetadataStore();
