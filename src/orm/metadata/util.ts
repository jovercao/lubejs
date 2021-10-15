import { Entity, EntityConstructor } from '../entity';
import { XRowset, Table } from '../../core';
import { isClass } from '../util';
import {
  EntityMetadata,
  TableEntityMetadata,
  ViewEntityMetadata,
  QueryEntityMetadata,
} from './entity-metadata';
import {
  RelationMetadata,
  OneToOneMetadata,
  PrimaryOneToOneMetadata,
  ForeignOneToOneMetadata,
  OneToManyMetadata,
  ManyToOneMetadata,
  ManyToManyMetadata,
  ForeignRelationMetadata,
} from './relation-metadata';
import { metadataStore } from '../metadata-store';
import { EntityType } from '../data-types';
import { DefaultRowObject, XTable } from '../../core/sql';

const ENTITY_COLUMN_MAPS = new Map<EntityMetadata, Record<string, string>>();

export function aroundRowset<T extends Entity = any>(
  rowset: XRowset<T>,
  metadata: EntityMetadata
): XRowset<T> {
  if (!ENTITY_COLUMN_MAPS.has(metadata)) {
    const map: Record<string, string> = {};
    metadata.columns.forEach(col => {
      map[col.property] = col.columnName;
    });
    ENTITY_COLUMN_MAPS.set(metadata, map);
  }
  rowset.$around(ENTITY_COLUMN_MAPS.get(metadata)!);
  return rowset;
}

/**
 * 从实体创建行集对象
 * @param entity
 * @returns
 */
export function makeRowset<T extends Entity = any>(
  entity: EntityConstructor<T>
): XRowset<DefaultRowObject> {
  const metadata = metadataStore.getEntity(entity);
  if (!metadata) throw new Error(`No metadata found ${entity}`);
  let rowset: XRowset<T>;
  if (isQueryEntity(metadata)) {
    rowset = metadata.sql.as('_') as any;
  } else if (isTableEntity(metadata)) {
    rowset = Table.create(metadata.dbName);
    // SQL.table(metadata.tableName);
  } else {
    rowset = Table.create(metadata.dbName!);
  }
  return aroundRowset<T>(rowset, metadata);
}

/**
 * 是否一对一关系
 */
export function isOneToOne(
  relation: RelationMetadata
): relation is OneToOneMetadata {
  return relation.kind === 'ONE_TO_ONE';
}

/**
 * 是否主要一对一关系
 */
export function isPrimaryOneToOne(
  relation: RelationMetadata
): relation is PrimaryOneToOneMetadata {
  return isOneToOne(relation) && relation.isPrimary === true;
}

/**
 * 是否外键一对一关系
 */
export function isForeignOneToOne(
  relation: RelationMetadata
): relation is ForeignOneToOneMetadata {
  return isOneToOne(relation) && relation.isPrimary === false;
}

/**
 * 是否一对多关系
 */
export function isOneToMany(
  relation: RelationMetadata
): relation is OneToManyMetadata {
  return relation.kind === 'ONE_TO_MANY';
}

/**
 * 是否多对一关系
 */
export function isManyToOne(relation: any): relation is ManyToOneMetadata {
  return relation.kind === 'MANY_TO_ONE';
}

/**
 * 是否多对多关系
 */
export function isManyToMany(
  relation: RelationMetadata
): relation is ManyToManyMetadata {
  return relation.kind === 'MANY_TO_MANY';
}

/**
 * 表示此关系所在的实体，在数据库关系中是否处于外键地位
 * @param relation
 * @returns
 */
export function isForeignRelation(
  relation: RelationMetadata
): relation is ForeignRelationMetadata {
  return isManyToOne(relation) || isForeignOneToOne(relation);
}


/**
 * 是否实体类型
 */
export function isEntityType(type: any): type is EntityType {
  return typeof type === 'function' && isClass(type);
}

export function isEntityMetadata(value: any): value is EntityMetadata {
  return (
    value?.kind &&
    (value.kind === 'TABLE' || value.kind === 'VIEW' || value.kind === 'QUERY')
  );
}

export function isTableEntity(value: any): value is TableEntityMetadata {
  return value instanceof EntityMetadata && value.kind === 'TABLE';
}

export function isViewEntity(value: any): value is ViewEntityMetadata {
  return value instanceof EntityMetadata && value.kind === 'VIEW';
}

export function isQueryEntity(value: any): value is QueryEntityMetadata {
  return value instanceof EntityMetadata && value.kind === 'QUERY';
}
