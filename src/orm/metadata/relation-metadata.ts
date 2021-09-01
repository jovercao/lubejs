
// export type EntityMetadata =
//   | TableEntityMetadata
//   | ViewEntityMetadata
//   | QueryEntityMetadata;

import { EntityConstructor } from "../entity";
import { Scalar } from "../../core";
import { ColumnMetadata } from "./column-metadata";
import { EntityMetadata, TableEntityMetadata } from "./entity-metadata";
import { EntityType } from "../types";

/**
 * 关联关系
 */
 export type RelationMetadata =
 | OneToOneMetadata
 | OneToManyMetadata
 | ManyToManyMetadata
 | ManyToOneMetadata;

/**
* 上级关系属性
*/
export type SuperiorRelation = ForeignOneToOneMetadata | ManyToOneMetadata;

/**
* 下级关系属性
*/
export type SubordinateRelation =
 | PrimaryOneToOneMetadata
 | OneToManyMetadata
 | ManyToManyMetadata;

/**
* 多表一对多关系
*/
export interface MultiOneToManyRelation {
 typeProperty: string;
 typeColumn: ColumnMetadata;

 property: string;

 referenceRelations: {
   description: string;
   typeValue: Scalar;
   referenceClass: EntityConstructor;
   referenceEntity: EntityMetadata;
   referenceProperty: string;
   referenceRelation: MultiManyToOneRelation;
 }[];
}

/**
* 多表多对一关系
*/
export interface MultiManyToOneRelation {
 property: string;

 /**
  * 外键属性
  */
 foreignProperty: string;

 /**
  * 外键列
  */
 foreignColumn: ColumnMetadata;

 referenceClass: EntityConstructor;
 referenceEntity: EntityMetadata;

 referenceProperty: string;

 referenceRelation: MultiOneToManyRelation;
}

/**
* 一对一引用属性
*/
export interface PrimaryOneToOneMetadata {
 /**
  * 是否隐式生成的
  */
 isImplicit: boolean;
 /**
  * 类型声明
  */
 kind: 'ONE_TO_ONE';
 /**
  * 属性名称
  */
 property: string;

 /**
  * 关联对应的实体信息
  */
 referenceClass: EntityType;

 /**
  * 引用的实体数据
  */
 referenceEntity: TableEntityMetadata;

 /**
  * 表示当前实体在该关联关系中是否处于主键地位
  */
 isPrimary: true;

 /**
  * 引用实体指向当前表的属性
  */
 referenceProperty?: string;
 /**
  * 引用实体的关系
  */
 referenceRelation: ForeignOneToOneMetadata;
 /**
  * 仅当在主键实体属性中存在
  * 将该关系声明为明细属性，在主从表单据中非常有用；
  * 如果指定为true，
  * 将改变在Repository.save操作时开启了ChangeOption.withRelation选项的行为，
  * 默认情况下ChangeOption.withRelation，仅会新增或者修改现有的关联项，
  * 但不会删除未绑定在关联关系中的项，如果需要删除，需要用户主动调用remove来达到解除关联关系的目的
  * 而指定了isDetail后，系统将会删除数据库中已存在但在提交项中不存在的明细项
  * 并且，在Querable的任意查询中，只需指定withDetail，而无须调用includes，即可递归获取该属性
  */
 isDetail: boolean;

 /**
  * 摘要描述
  */
 comment?: string;
}

/**
* 一对一引用属性
* //TODO: OneToOne装饰器需要重载两种方式，主对从及从对主
*/
export interface ForeignOneToOneMetadata {
 /**
  * 是否隐式生成的
  */
 isImplicit: boolean;
 kind: 'ONE_TO_ONE';
 /**
  * 属性名称，如果是隐式的，则自动填充
  */
 property: string;
 /**
  * 表示当前实体在该关联关系中是否处于主键地位
  */
 isPrimary: false;
 /**
  * 关联对应的实体信息
  */
 referenceClass: EntityType;
 /**
  * 所引用的实体
  */
 referenceEntity: TableEntityMetadata;
 /**
  * 约束名称
  */
 constraintName: string;
 /**
  * 引用实体指向当前表的属性
  */
 referenceProperty: string;

 // TODO: 添加索引
 /**
  * 索引名称
  */
 indexName: string;

 /**
  * 对方的引用声明
  */
 referenceRelation: PrimaryOneToOneMetadata;
 /**
  * 外键属性
  */
 foreignProperty: string;
 /**
  * 外键列
  */
 foreignColumn: ColumnMetadata;
 // /**
 //  * 不可将父表声明为明细表
 //  */
 // isDetail?: boolean;
 /**
  * 摘要描述
  */
 comment?: string;
 /**
  * 是否可空
  */
 isRequired?: boolean;

 /**
  * 是否级联删除
  */
 isCascade?: boolean;
}

export type HasOneMetadata = OneToOneMetadata | ManyToOneMetadata;

export type HasManyMetadata = OneToManyMetadata | ManyToManyMetadata;

export type OneToOneMetadata =
 | PrimaryOneToOneMetadata
 | ForeignOneToOneMetadata;

/**
* 一对多引用属性
*/
export interface OneToManyMetadata {
 /**
  * 是否隐式生成的
  */
 isImplicit: boolean;
 kind: 'ONE_TO_MANY';
 /**
  * 属性名称
  */
 property: string;

 /**
  * 引用的实体类型
  */
 referenceClass: EntityType;

 /**
  * 所引用的实体
  */
 referenceEntity: TableEntityMetadata;

 /**
  * 关联实体中该关系的属性
  */
 referenceProperty: string;

 /**
  * 所引用的对应关系
  */
 referenceRelation: ManyToOneMetadata;
 /**
  * 摘要描述
  */
 comment?: string;

 /**
  * 将该关系声明为明细属性，在主从表单据中非常有用；
  * 如果指定为true，
  * 将改变在Repository.save操作时开启了ChangeOption.withRelation选项的行为，
  * 默认情况下ChangeOption.withRelation，仅会新增或者修改现有的关联项，
  * 但不会删除未绑定在关联关系中的项，如果需要删除，需要用户主动调用remove来达到解除关联关系的目的
  * 而指定了isDetail后，系统将会删除数据库中已存在但在提交项中不存在的明细项
  * 并且，在Querable的任意查询中，只需指定withDetail，而无须调用includes，即可递归获取该属性
  */
 isDetail: boolean;
}
/**
* 一对多引用属性
*/
export interface ManyToOneMetadata {
 /**
  * 是否隐式生成的
  */
 isImplicit: boolean;
 kind: 'MANY_TO_ONE';
 /**
  * 属性名称
  */
 property: string;

 /**
  * 引用主键的属性名
  */
 foreignProperty: string;

 /**
  * 外键列
  */
 foreignColumn: ColumnMetadata;

 /**
  * 外键字段所建立的索引名称
  */
 indexName: string;

 /**
  * 关联实体
  */
 referenceClass: EntityType;

 /**
  * 引用的实体对象
  */
 referenceEntity: TableEntityMetadata;

 /**
  * 对方引用属性
  */
 referenceProperty: string;

 /**
  * 对方的引用声明
  */
 referenceRelation: OneToManyMetadata;

 /**
  * 约束名称
  */
 constraintName: string;

 /**
  * 是否可空
  */
 isRequired: boolean;

 /**
  * 摘要描述
  */
 comment?: string;
 /**
  * 是否级联删除
  */
 isCascade?: boolean;
}

/**
* 多对多引用属性,系统会自动创建中间关系表
* ManyToMany = OneToMany + ManyToOne + 中间Entity + ManyToOne + OneToMany.
*/
export interface ManyToManyMetadata {
 /**
  * 是否隐式生成的
  */
 isImplicit: boolean;
 /**
  * 属性名称
  */
 kind: 'MANY_TO_MANY';
 /**
  * 属性名称
  */
 property: string;

 /**
  * 当前关系所关联的实体
  */
 referenceClass: EntityType;

 /**
  * 引用的实体对象
  */
 referenceEntity: TableEntityMetadata;
 /**
  * 对向引用属性
  */
 referenceProperty: string;

 /**
  * 对方的引用声明
  */
 referenceRelation: ManyToManyMetadata;

 /**
  * 关系表实体类
  */
 relationClass: EntityType;
 /**
  * 关联关系中间表
  * 可以由用户声明，亦可以隐式生成
  */
 relationEntity: TableEntityMetadata;

 /**
  * 中间关联关系属性
  */
 relationProperty?: string;

 /**
  * 关联关系中间关系
  */
 relationRelation: OneToManyMetadata;

 /**
  * 关系约束名称，此名称为关联源名的关系名称
  */
 relationConstraintName?: string;

 /**
  * 摘要描述
  */
 comment?: string;
 /**
  * 将该关系声明为明细属性，在主从表单据中非常有用；
  * 如果指定为true，
  * 将改变在Repository.save操作时开启了ChangeOption.withRelation选项的行为，
  * 默认情况下ChangeOption.withRelation，仅会新增或者修改现有的关联项，
  * 但不会删除未绑定在关联关系中的项，如果需要删除，需要用户主动调用remove来达到解除关联关系的目的
  * 而指定了isDetail后，系统将会删除数据库中已存在但在提交项中不存在的明细项
  * 并且，在Querable的任意查询中，只需指定withDetail，而无须调用includes，即可递归获取该属性
  */
 isDetail: boolean;
 /**
  * 是否级联删除
  */
 isCascade?: boolean;
}


export type ForeignRelationMetadata = ForeignOneToOneMetadata | ManyToOneMetadata;
