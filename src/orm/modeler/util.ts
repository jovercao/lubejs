import Decimal from 'decimal.js-light';
import { DbType, Uuid } from '../../core';
import { Entity } from '../entity';
import {
  DbContextMetadata,
  EntityMetadata,
  ColumnMetadata,
  TableEntityMetadata,
  IndexMetadata,
  ManyToOneMetadata,
  OneToManyMetadata,
  KeyMetadata,
  ManyToManyMetadata,
  OneToOneMetadata,
  PrimaryOneToOneMetadata,
  ForeignOneToOneMetadata,
  RelationMetadata,
  ForeignRelationMetadata,
} from '../metadata';
import {
  isForeignOneToOne,
  isOneToMany,
  isManyToOne,
  isTableEntity,
  isManyToMany,
  isPrimaryOneToOne,
} from '../metadata/util';
import { DataType, isListType } from '../data-types';
import { lowerFirst, complex } from '../util';
import { ContextBuilder } from './context-builder';

/**
 * 修复列声明
 * @param ctx
 * @param entity
 * @param column
 */
export function fixColumn(column: ColumnMetadata) {
  if (!column.columnName) {
    column.columnName = column.property;
  }
  if (!column.dbType) {
    column.dbType = dataTypeToDbType(column.type);
  }
  if (column.isIdentity) {
    if (column.identityStartValue === undefined) {
      column.identityStartValue = 0;
    }
    if (column.identityIncrement === undefined) {
      column.identityIncrement = 1;
    }
  }
  if (column.isNullable === undefined) {
    column.isNullable = false;
  }
  if (column.isRowflag === undefined) {
    column.isRowflag = false;
  }
  if (column.isPrimaryKey === undefined) {
    column.isPrimaryKey = false;
  }
  if (column.isCalculate === undefined) {
    column.isCalculate = false;
  }
  if (column.isIdentity === undefined) {
    column.isIdentity = false;
  }
}

export function fixEntityIndexes(entity: TableEntityMetadata) {
  for (const index of entity.indexes) {
    fixIndex(entity, index);
  }
}

export function fixIndex(entity: TableEntityMetadata, index: IndexMetadata) {
  if (!index.name) {
    index.name = `IX_${entity.dbName}_${index.columns
      .map(col => col.column.columnName)
      .join('_')}`;
  }
  if (!index.properties) {
    throw new Error(`Index must specify properties.`);
  }
  if (Array.isArray(index.properties)) {
    index.columns = index.properties.map(property => {
      const column = entity.getColumn(property);
      if (!column) {
        throw new Error(`Column ${property} not found.`);
      }
      return {
        column,
        sort: 'ASC',
      };
    });
  } else {
    index.columns = Object.entries(index.properties).map(
      ([property, direction]) => {
        const column = entity.getColumn(property);
        if (!column) {
          throw new Error(`Column ${property} not found.`);
        }
        return {
          column,
          sort: direction,
        };
      }
    );
  }

  if (index.isUnique === undefined) {
    index.isUnique = false;
  }

  if (index.isClustered === undefined) {
    index.isClustered = false;
  }
}

export function fixRelationIndex(
  entity: TableEntityMetadata,
  relation: ForeignRelationMetadata
) {
  if (!relation.indexName) {
    relation.indexName = `${isForeignOneToOne(relation) ? 'UX' : 'IX'}_${
      entity.dbName
    }_${relation.foreignColumn.columnName}`;
  }
  // 为关系追加索引
  let index = entity.getIndex(relation.indexName);
  if (!index) {
    index = {
      name: relation.indexName,
    } as IndexMetadata;
    entity.addIndex(index);
  } else {
    let props: string[];
    if (Array.isArray(index.properties)) {
      props = index.properties;
    } else {
      props = Object.keys(index.properties);
    }

    if (!props || props.length !== 1 || props[0] !== relation.foreignProperty) {
      throw new Error(
        `Entity ${entity.className} index ${index.name} not satisfied for relation ${relation.property}`
      );
    }
  }

  if (!index.properties) {
    index.properties = [relation.foreignProperty];
  }
  if (index.isUnique === undefined) {
    index.isUnique = isForeignOneToOne(relation);
  }
  fixIndex(entity, index);
}

/**
 * 修复多对一声明
 * @param ctx
 * @param entity
 * @param relation
 */
export function fixManyToOne(
  ctx: DbContextMetadata,
  entity: TableEntityMetadata,
  relation: ManyToOneMetadata
) {
  if (relation.isRequired === undefined) {
    relation.isRequired = false;
  }
  if (relation.comment === undefined) {
    relation.comment = undefined;
  }

  if (relation.isCascade === undefined) {
    relation.isCascade = false;
  }

  fixReferenceEntity(ctx, entity, relation);
  fixForeignProperty(entity, relation);

  fixRelationIndex(entity, relation);

  if (!relation.referenceProperty) {
    relation.referenceProperty = genRelationProperty(entity.className, 'many');
  }

  if (!relation.referenceRelation) {
    let referenceRelation = relation.referenceEntity.getRelation(
      relation.referenceProperty
    );
    if (referenceRelation) {
      if (!isOneToMany(referenceRelation)) {
        throw new Error(
          `ManyToOneRelation ${entity.className}.${relation.property} must reference OneToManyRelation`
        );
      }
      relation.referenceRelation = referenceRelation;
    } else {
      referenceRelation = {
        isImplicit: true,
        kind: 'ONE_TO_MANY',
        property: relation.referenceProperty,
        referenceClass: entity.class,
        referenceEntity: entity,
        referenceProperty: relation.property,
        referenceRelation: relation,
        isDetail: false,
      };
      relation.referenceEntity.addRelation(referenceRelation);
      relation.referenceRelation = referenceRelation;
      fixOneToMany(ctx, relation.referenceEntity, referenceRelation);
    }
  }
}

/**
 * 修复一对多关系声明
 * @param ctx
 * @param entity
 * @param relation
 */
export function fixOneToMany(
  ctx: DbContextMetadata,
  entity: TableEntityMetadata,
  relation: OneToManyMetadata
) {
  fixReferenceEntity(ctx, entity, relation);
  // 如果未指定该属性，则查找该属性
  // 如果未查找到该属性，则定义该属性
  if (!relation.referenceProperty) {
    const referenceProperty = genRelationProperty(entity.className, 'one');
    relation.referenceProperty = referenceProperty;
  }

  if (!relation.referenceRelation) {
    let referenceRelation = relation.referenceEntity.getRelation(
      relation.referenceProperty
    ) as ManyToOneMetadata;
    if (!referenceRelation) {
      const foreignProperty = `${relation.referenceProperty}Id`;
      referenceRelation = {
        property: relation.referenceProperty,
        // dbName: relation.referenceProperty,
        constraintName: `FK_${
          relation.referenceEntity.dbName
        }_${foreignProperty}_TO_${entity.dbName}_${entity.key!.property}`,
        kind: 'MANY_TO_ONE',
        isImplicit: true,
        referenceClass: entity.class,
        referenceEntity: entity,
        foreignProperty,
        referenceProperty: relation.property,
        referenceRelation: relation,
        isRequired: false,
      } as ManyToOneMetadata;
      relation.referenceRelation = referenceRelation;
      // 创建隐式规则
      relation.referenceEntity.addRelation(referenceRelation);
      fixForeignProperty(relation.referenceEntity, referenceRelation);
    } else {
      if (!isManyToOne(referenceRelation)) {
        throw new Error(
          `OneToMany's referenct property must ManyToOne relation.`
        );
      }
      relation.referenceRelation = referenceRelation;
    }
  }
}

export function fixEntityKey(
  builder: ContextBuilder,
  entity: EntityMetadata
): void {
  if (!entity.key) {
    if (!builder.metadata.globalKey) {
      throw new Error(`Key must declare in Entity, or globalKey must special.`);
    }
    entity.key = {
      property: builder.metadata.globalKey.property,
    } as KeyMetadata;
  }
  if (!entity.key!.column) {
    let keyColumn = entity.getColumn(entity.key.property);
    if (!keyColumn) {
      if (!builder.metadata.globalKey?.column) {
        throw new Error(
          `Key must declare in Entity, or globalKey must special.`
        );
      }
      // 隐式主键
      keyColumn = {
        kind: 'COLUMN',
        isImplicit: true,
        property: entity.key.property,
        type: builder.metadata.globalKey.column.type,
        columnName: builder.metadata.globalKey.column.columnName,
        dbType: builder.metadata.globalKey.column.dbType,
        isIdentity: true,
        identityStartValue: 0,
        identityIncrement: 1,
        isNullable: false,
        isPrimaryKey: true,
        isCalculate: false,
        isRowflag: false,
        comment: 'Auto generic key column.',
      };
      entity.addColumn(keyColumn);
    }
    keyColumn.isPrimaryKey = true;
    entity.key.column = keyColumn;
  }
  if (!entity.key.constraintName) {
    entity.key.constraintName = `PK_${entity.dbName}_${entity.key.column.columnName}`;
  }
  if (entity.key.isNonclustered === undefined) {
    entity.key.isNonclustered = false;
  }
}

export function fixEntity(
  builder: ContextBuilder,
  entity: EntityMetadata
): void {
  // if (!entity.kind) {
  //   entity.kind = 'TABLE';
  //   entity.tableName = entity.className;
  // }
  // 先将列完善
  for (const member of entity.columns) {
    fixColumn(member);
  }

  if (!isTableEntity(entity)) return;

  entity.identityColumn = entity.columns.find(c => c.isIdentity);
  entity.rowflagColumn = entity.columns.find(c => c.isRowflag);
  fixEntityKey(builder, entity);
}

/**
 * 完成多对多声明
 * @param ctx
 * @param entity
 * @param relation
 */
export function fixManyToMany(
  ctxBuilder: ContextBuilder,
  entity: TableEntityMetadata,
  relation: ManyToManyMetadata
) {
  // 不支持自引用多对多关系
  if (relation.referenceClass === entity.class) {
    throw new Error(`Not support self reference many to many relation.`);
  }
  const ctx = ctxBuilder.metadata;
  fixReferenceEntity(ctx, entity, relation);
  if (!relation.referenceProperty) {
    relation.referenceProperty = genRelationProperty(entity.className, 'many');
  }

  let referenceRelation = relation.referenceEntity.getRelation(
    relation.referenceProperty
  ) as ManyToManyMetadata;

  if (!relation.relationClass) {
    if (!referenceRelation?.relationClass) {
      const refClsName = relation.referenceClass.name;
      const thisClsName = entity.className;
      let className: string;
      if (refClsName < thisClsName) {
        className = refClsName + thisClsName;
      } else {
        className = thisClsName + refClsName;
      }

      let relationEntity = ctxBuilder.metadata.findEntityByName(className);
      if (!relationEntity) {
        const ctr = class extends Entity {};
        Reflect.set(ctr, 'name', className);
        relationEntity = ctxBuilder
          .entity<any>(ctr)
          .asTable(className).metadata;
      }
      if (!isTableEntity(relationEntity)) {
        throw new Error(
          `Entity ${relationEntity.className} is not a table entity.`
        );
      }
      relation.relationClass = relationEntity.class;
      relation.relationEntity = relationEntity;
      fixEntity(ctxBuilder, relation.relationEntity);
    } else {
      relation.relationClass = referenceRelation.relationClass;
      relation.relationEntity = referenceRelation.relationEntity;
    }
  }

  if (!relation.relationProperty) {
    relation.relationProperty = lowerFirst(
      complex(relation.relationClass.name)
    );
  }

  if (!relation.relationRelation) {
    let relationRelation = entity.getRelation(relation.relationProperty!);
    if (relationRelation) {
      if (!isOneToMany(relationRelation)) {
        throw new Error(`Relation ${entity.className}`);
      }
      relation.relationRelation = relationRelation;
    } else {
      relationRelation = {
        kind: 'ONE_TO_MANY',
        isImplicit: true,
        property: relation.relationProperty,
        isDetail: relation.isDetail,
        referenceClass: relation.relationClass,
        referenceEntity: relation.relationEntity,
      } as OneToManyMetadata;
      relation.relationRelation = relationRelation;
      entity.addRelation(relationRelation);
      fixOneToMany(ctx, entity, relationRelation);
    }
  }

  if (!referenceRelation) {
    referenceRelation = {
      property: relation.referenceProperty,
      kind: 'MANY_TO_MANY',
      isImplicit: true,
      referenceClass: entity.class,
      referenceEntity: entity,
      referenceProperty: relation.property,
      referenceRelation: relation,
      relationClass: relation.relationClass,
      relationEntity: relation.relationEntity,
    } as ManyToManyMetadata;
    relation.referenceEntity.addRelation(referenceRelation);
    relation.referenceRelation = referenceRelation;
    fixManyToMany(ctxBuilder, relation.referenceEntity, referenceRelation);
  } else {
    if (!isManyToMany(referenceRelation)) {
      throw new Error(
        `ManyToMany relation reference property must ManyToMany relation too.`
      );
    }
  }
}

/**
 * 修复一对一关系声明
 * @param ctx
 * @param entity
 * @param relation
 */
export function fixOneToOne(
  ctx: DbContextMetadata,
  entity: TableEntityMetadata,
  relation: OneToOneMetadata
) {
  if (relation.isPrimary === true) {
    fixPrimaryOneToOne(ctx, entity, relation);
  } else {
    fixForeignOneToOne(ctx, entity, relation);
  }
}

export function fixPrimaryOneToOne(
  ctx: DbContextMetadata,
  entity: TableEntityMetadata,
  relation: PrimaryOneToOneMetadata
) {
  if (relation.comment === undefined) {
    relation.comment = undefined;
  }
  fixReferenceEntity(ctx, entity, relation);
  if (!relation.referenceProperty) {
    relation.referenceProperty = genRelationProperty(entity.className, 'one');
  }

  if (!relation.referenceRelation) {
    let referenceRelation = relation.referenceEntity.getRelation(
      relation.referenceProperty
    );

    if (referenceRelation) {
      if (!isForeignOneToOne(referenceRelation)) {
        throw new Error(
          `PrimaryOneToOne's referenct property must ForeignOneToOne relation.`
        );
      }
      relation.referenceRelation = referenceRelation as ForeignOneToOneMetadata;
    } else {
      referenceRelation = {
        isImplicit: true,
        kind: 'ONE_TO_ONE',
        isPrimary: false,
        property: relation.referenceProperty,
        referenceClass: entity.class,
        referenceEntity: entity,
        referenceProperty: relation.property,
        referenceRelation: relation,
      } as ForeignOneToOneMetadata;
      relation.referenceEntity.addRelation(referenceRelation);
      relation.referenceRelation = referenceRelation as ForeignOneToOneMetadata;
      fixForeignOneToOne(ctx, relation.referenceEntity, referenceRelation);
    }
  }
}

export function fixForeignOneToOne(
  ctx: DbContextMetadata,
  entity: TableEntityMetadata,
  relation: ForeignOneToOneMetadata
) {
  if (relation.comment === undefined) {
    relation.comment = undefined;
  }
  fixReferenceEntity(ctx, entity, relation);
  if (relation.isRequired === undefined) {
    relation.isRequired = false;
  }
  if (relation.isCascade === undefined) {
    relation.isCascade = false;
  }

  fixForeignProperty(entity, relation);

  fixRelationIndex(entity, relation);

  if (!relation.referenceProperty) {
    relation.referenceProperty = genRelationProperty(entity.className, 'one');
  }

  if (!relation.referenceRelation) {
    let referenceRelation: OneToOneMetadata =
      relation.referenceEntity.getRelation(
        relation.referenceProperty
      ) as OneToOneMetadata;
    if (!referenceRelation) {
      referenceRelation = {
        kind: 'ONE_TO_ONE',
        isImplicit: true,
        referenceClass: entity.class,
        referenceEntity: entity,
        isPrimary: true,
        referenceRelation: relation,
        property: relation.referenceProperty,
        isDetail: false,
      };
      relation.referenceEntity.addRelation(referenceRelation);
      relation.referenceRelation = referenceRelation;
      fixOneToOne(ctx, relation.referenceEntity, referenceRelation);
    } else {
      if (!isPrimaryOneToOne(referenceRelation)) {
        throw new Error(
          `ForeignOneToOne's referenct property must PrimaryOneToOne relation.`
        );
      }
      relation.referenceRelation = referenceRelation;
    }
  }
}

/**
 * 确保外键生效
 * @param entity
 * @param relation
 */
export function fixForeignProperty(
  entity: TableEntityMetadata,
  relation: ManyToOneMetadata | ForeignOneToOneMetadata
): void {
  // 添加隐式外键列
  if (!relation.foreignProperty) {
    relation.foreignProperty = `${relation.property}Id`;
  }

  let column = entity.getColumn(relation.foreignProperty);
  if (!column) {
    column = {
      isImplicit: true,
      property: relation.foreignProperty,
      columnName: relation.foreignProperty,
      kind: 'COLUMN',
      type: relation.referenceEntity.key!.column.type,
      dbType: relation.referenceEntity.key!.column.dbType,
      isNullable: !relation.isRequired,
      isPrimaryKey: false,
      isCalculate: false,
      isIdentity: false,
      isRowflag: false,
    };
    entity.addColumn(column);
  } else {
    // if (relation.isRequired && column.isNullable === false) {
    //   console.warn(`Conflict Foreign column  isRequired is 'true`)
    //   // throw new Error(`Foreign column nullable must 'false' when relation isRequired is 'true'.`)
    // }
    // if (column.isNullable === undefined) {
    column.isNullable = !relation.isRequired;
    // }
    // 外键类型兼容检查
    if (
      column.type !== relation.referenceEntity.key!.column.type ||
      !isSameDbType(column.dbType, relation.referenceEntity.key!.column.dbType)
    ) {
      throw new Error(
        `Entity ${entity.className} colum ${column.property} type incompatible for foreign key.`
      );
    }
  }

  if (!relation.foreignColumn) {
    relation.foreignColumn = column;
  }

  if (!relation.constraintName) {
    relation.constraintName = `FK_${entity.dbName}_${
      relation.foreignColumn.columnName
    }_${relation.referenceEntity.dbName}_${
      relation.referenceEntity.key!.column.columnName
    }`;
  }
}

export function fixReferenceEntity(
  ctx: DbContextMetadata,
  entity: TableEntityMetadata,
  relation: RelationMetadata
) {
  if (!relation.referenceEntity) {
    const referenceEntity = ctx.getEntity(relation.referenceClass);
    if (!referenceEntity) {
      throw new Error(
        `Entity ${relation.referenceClass.name} is not defined with entity.`
      );
    }
    if (!isTableEntity(referenceEntity)) {
      throw new Error(
        `Entity ${entity.className} relation ${relation.property} reference entity ${referenceEntity.className} is not TableEntity.`
      );
    }
    relation.referenceEntity = referenceEntity;
  }
}

/**
 * 生成一个关系属性名称
 * @param entity
 * @param referenceType
 * @param type
 * @returns
 */
export function genRelationProperty(
  // entity: TableEntityMetadata,
  referenceType: string,
  type: 'one' | 'many'
): string {
  let property = lowerFirst(referenceType);
  if (type === 'many') {
    property = complex(property);
  }
  // while (entity.getMember(property)) {
  //   property = '_' + property;
  // }
  return property;
}

export function fixEntityRelations(
  builder: ContextBuilder,
  entity: TableEntityMetadata
) {
  for (const member of entity.relations) {
    switch (member.kind) {
      case 'MANY_TO_ONE':
        fixManyToOne(builder.metadata, entity, member);
        break;
      case 'ONE_TO_MANY':
        fixOneToMany(builder.metadata, entity, member);
        break;
      case 'MANY_TO_MANY':
        fixManyToMany(builder, entity, member);
        break;
      case 'ONE_TO_ONE':
        fixOneToOne(builder.metadata, entity, member);
        break;
    }
  }
}

/**
 * Js类型转换为默认数据库类型
 * @param dataType
 * @returns
 */
export function dataTypeToDbType(dataType: DataType): DbType {
  switch (dataType) {
    case String:
      return DbType.string(DbType.MAX);
    case Number:
      return DbType.int32;
    case Boolean:
      return DbType.boolean;
    case Date:
      return DbType.datetime;
    case Buffer:
    case ArrayBuffer:
    case SharedArrayBuffer:
      return DbType.binary(DbType.MAX);
    case BigInt:
      return DbType.int64;
    case Uuid:
      return DbType.uuid;
    case Decimal:
      return DbType.decimal(18, 6);
    case Object:
      return DbType.json();
    default:
      if (isListType(dataType)) {
        return DbType.list(dataType[0] as any);
      }
      return DbType.json();
  }
}

function isSameDbType(type1: DbType, type2: DbType): boolean {
  return deepthEqual(type1, type2);
}

function deepthEqual(left: any, right: any): boolean {
  const type = typeof left;
  if (type !== 'function' && type !== 'object') {
    return left === right;
  }

  if (!right) return false;
  const leftKeys = Object.getOwnPropertyNames(left);
  const rightKeys = Object.getOwnPropertyNames(right);
  if (leftKeys.length !== rightKeys.length) return false;
  for (const key of leftKeys) {
    if (!deepthEqual(left[key], right[key])) {
      return false;
    }
  }
  return true;
}
