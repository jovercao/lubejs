import {
  OneToOneMetadata,
  ManyToOneMetadata,
  OneToManyMetadata,
  ManyToManyMetadata,
} from '../metadata';
import { Scalar } from '../../core';
import { isScalarType, selectProperty } from '../util';
import { addEntitiyRelation } from './entity-decorators';
import { EntityConstructor, Entity } from '../entity';
import 'reflect-metadata'

const RELATION_KEY = Symbol('lubejs:relation');
const AMONG_KEY = Symbol('lubejs:among');

export interface RelationOptions {
  kind:
    | OneToOneMetadata['kind']
    | ManyToOneMetadata['kind']
    | OneToManyMetadata['kind']
    | ManyToManyMetadata['kind'];
  referenceEntityGetter: () => EntityConstructor;
  referenceProperty?: string;
  relationProperty?: string;
  foreignProperty?: string;
  isRequired?: boolean;
  isPrimary?: boolean;
  isDetail?: boolean;
}

export function oneToOne<T extends Entity>(
  referenceEntityGetter: () => EntityConstructor<T>,
  referenceProperty?: (p: Required<T>) => object
): PropertyDecorator {
  return function (target: Object, key: string): void {
    const type = Reflect.getMetadata('design:type', target, key);
    if (isScalarType(type)) {
      throw new Error(
        `One to one relation property ${key} type error, property must type of reference entity array.`
      );
    }
    setRelationOptions(target.constructor as EntityConstructor, key, {
      kind: 'ONE_TO_ONE',
      referenceProperty: referenceProperty
        ? selectProperty(referenceProperty)
        : undefined,
      referenceEntityGetter,
    });
    addEntitiyRelation(target.constructor as EntityConstructor, key);
  };
}

/**
 * 将一对一关系声明为主导关系
 */
export function principal(): PropertyDecorator {
  return function (target: Object, key: string) {
    // const relationOptions = getRelationOptions(target.constructor as EntityConstructor, key);
    // if (relationOptions?.kind && relationOptions.kind !== 'ONE_TO_MANY') {
    //   throw new Error(`Principal is used in one to one relation property.`);
    // }
    setRelationOptions(target.constructor as EntityConstructor, key, {
      isPrimary: true,
    });
  };
}

/**
 * 用于关系字段中，指定外键字段，注意，该装饰器仅可用在导航属性中。
 */
export function foreignKey<T extends Entity>(
  /**
   * 导航属性名称
   */
  foreignProperty: (p: Required<T>) => Scalar,
  required?: boolean
): PropertyDecorator;
export function foreignKey(
  /**
   * 导航属性名称
   */
  foreignProperty?: string,
  required?: boolean
): PropertyDecorator;
export function foreignKey<T extends Entity>(
  /**
   * 导航属性名称
   */
  foreignProperty?: string | ((p: Required<T>) => Scalar),
  required: boolean = false
): PropertyDecorator {
  return function (target: Object, key: string) {
    // const relationOptions = getRelationOptions(target.constructor as EntityConstructor, key);
    // if (relationOptions?.kind === 'MANY_TO_MANY' || relationOptions?.kind === 'ONE_TO_MANY') {
    //   throw Error(`No foreign key on relation ${relationOptions.kind}`)
    // }
    setRelationOptions(target.constructor as EntityConstructor, key, {
      foreignProperty:
        typeof foreignProperty === 'function'
          ? selectProperty(foreignProperty)
          : foreignProperty,
      isRequired: required,
      isPrimary: false
    });
  };
}

export function oneToMany<R extends Entity>(
  referenceEntityGetter: () => EntityConstructor<R>,
  referenceProperty: (p: Required<R>) => object
): PropertyDecorator {
  return function (target: Object, key: string) {
    const type = Reflect.getMetadata('design:type', target, key);
    if (type !== Array) {
      throw new Error(
        `One to many relation property ${key} type error, property must type of reference entity array.`
      );
    }

    setRelationOptions(target.constructor as EntityConstructor, key, {
      kind: 'ONE_TO_MANY',
      referenceEntityGetter,
      referenceProperty: referenceProperty
        ? selectProperty(referenceProperty)
        : undefined,
    });
    addEntitiyRelation(target.constructor as EntityConstructor, key);
  };
}

export function manyToOne<R extends Entity>(
  referenceEntityGetter: () => EntityConstructor<R>,
  referenceProperty?: (p: Required<R>) => object[]
): PropertyDecorator {
  return function (target: Object, key: string) {
    const type = Reflect.getMetadata('design:type', target, key);
    if (isScalarType(type)) {
      throw new Error(
        `Many to one relation property ${key} type error, property must type of reference entity.`
      );
    }
    setRelationOptions(target.constructor as EntityConstructor, key, {
      kind: 'MANY_TO_ONE',
      referenceEntityGetter,
      referenceProperty: referenceProperty
        ? selectProperty(referenceProperty)
        : undefined,
    });
    addEntitiyRelation(target.constructor as EntityConstructor, key);
  };
}

export function manyToMany<R extends Entity>(
  referenceEntityGetter: () => EntityConstructor<R>,
  referenceProperty?: (p: Required<R>) => object[],
  relationProperty?: string
): PropertyDecorator {
  return function (target: Object, key: string) {
    const type = Reflect.getMetadata('design:type', target, key);
    if (type !== Array) {
      throw new Error(
        `Many to many relation property ${key.toString()} type error, property must type of reference entity array.`
      );
    }
    setRelationOptions(target.constructor as EntityConstructor, key, {
      kind: 'MANY_TO_MANY',
      referenceEntityGetter,
      referenceProperty: referenceProperty
        ? selectProperty(referenceProperty)
        : undefined,
      relationProperty,
    });
    addEntitiyRelation(target.constructor as EntityConstructor, key);
  };
}


/**
 * 将导航属性声明为明细项
 */
export function detail(yesOrNo: boolean = true): PropertyDecorator {
  return function (target: Object, key: string) {
    setRelationOptions(target.constructor as EntityConstructor, key, {
      isDetail: yesOrNo
    });
  }
}

/**
 * 中间表关系
 */
export interface AmongOptions {
  leftEntityGetter: () => EntityConstructor;
  rightEngityGetter: () => EntityConstructor;
  leftProperty?: string;
  rightProperty?: string;
}

/**
 * 定义多对多关系中间表，并可在其中指定其外键属性
 */
export function among<T extends Entity, L extends Entity, R extends Entity>(
  /**
   * 引用表1
   */
  leftGetter: () => EntityConstructor<L>,
  /**
   * 引用表2
   */
  rightGetter: () => EntityConstructor<R>,
  /**
   * 引用表1的导航属性
   */
  leftProperty?: (p: Required<T>) => L,
  /**
   * 引用表2的导航属性
   */
  rightProperty?: (p: Required<T>) => R
): (target: EntityConstructor<T>) => void;
export function among(
  /**
   * 引用表1
   */
  leftGetter: () => EntityConstructor,
  /**
   * 引用表2
   */
  rightGetter: () => EntityConstructor,
  /**
   * 引用表1的导航属性
   */
  leftProperty?: string, // (p: Required<T>) => L,
  /**
   * 引用表2的导航属性
   */
  rightProperty?: string //(p: Required<T>) => R
): (target: EntityConstructor) => void;
export function among<T extends Entity, L extends Entity, R extends Entity>(
  /**
   * 引用表1
   */
  leftGetter: () => EntityConstructor<L>,
  /**
   * 引用表2
   */
  rightGetter: () => EntityConstructor<R>,
  /**
   * 引用表1的导航属性
   */
  leftProperty?: string | ((p: Required<T>) => L),
  /**
   * 引用表2的导航属性
   */
  rightProperty?: string | ((p: Required<T>) => R)
): <T extends Entity>(target: EntityConstructor<T>) => void {
  return function <T extends Entity>(target: EntityConstructor<T>): void {
    const opt = getAmong(target);
    if (opt) {
      throw new Error(`Among is only allow decorate once.`);
    }
    Reflect.defineMetadata(
      AMONG_KEY,
      <AmongOptions>{
        leftEntityGetter: leftGetter,
        rightEngityGetter: rightGetter,
        leftProperty:
          typeof leftProperty === 'function'
            ? selectProperty(leftProperty)
            : leftProperty,
        // : leftProperty
        //   ? selectProperty(leftProperty)
        //   : undefined,
        rightProperty:
          typeof rightProperty === 'function'
            ? selectProperty(rightProperty)
            : rightProperty,
        // : rightProperty
        //   ? selectProperty(rightProperty)
        //   : undefined,
      },
      target
    );
  };
}

export function getAmong(target: EntityConstructor): AmongOptions {
  return Reflect.getMetadata(AMONG_KEY, target);
}

export function getRelationOptions(
  target: EntityConstructor,
  key: string
): RelationOptions | undefined {
  return Reflect.getMetadata(RELATION_KEY, target, key);
}

function setRelationOptions(
  target: EntityConstructor,
  key: string | symbol,
  options: Partial<RelationOptions>
): void {
  if (typeof key === 'symbol') {
    throw new Error(`Column is not allow use to symbol property.`);
  }
  let relationOptions = getRelationOptions(target, key);
  if (!relationOptions) {
    relationOptions = {} as RelationOptions;
    Reflect.defineMetadata(RELATION_KEY, relationOptions, target, key);
  }
  if (options.kind && relationOptions.kind) {
    throw Error(`Relation is only decorators once on property.`);
  }
  if (options.isPrimary && options.kind && options.kind !== 'ONE_TO_ONE') {
    throw Error(`principal is only use on one to one relation property.`);
  }
  Object.assign(relationOptions, options);
}
