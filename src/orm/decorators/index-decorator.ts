import { EntityConstructor } from "../entity";
import { addEntitiyIndex, getEntityOptions, setEntityOptions } from "./entity";
import 'reflect-metadata'

const INDEX_KEY = Symbol('lubejs:index');

export type IndexOptions = {
  name: string;
  isUnique?: boolean;
  isClustered?: boolean;
  properties?: string[] | { [prop: string]: 'ASC' | 'DESC' };
};

export function getIndexOptions(
  target: EntityConstructor,
  key: string
): IndexOptions | undefined {
  return Reflect.getMetadata(INDEX_KEY, target, key);
}


function setIndexOptions(
  target: EntityConstructor,
  key: string,
  options: Partial<IndexOptions>
): void {
  let indexOptions = getIndexOptions(target, key);
  if (!indexOptions) {
    indexOptions = {} as IndexOptions;
    Reflect.defineMetadata(INDEX_KEY, indexOptions, target, key);
  }
  Object.assign(indexOptions, options);
}


export function index(name?: string): PropertyDecorator;
export function index(
  name: string,
  properties: string[] | { [prop: string]: 'ASC' | 'DESC' },
  isUnique?: boolean,
  isClustered?: boolean
): ClassDecorator;
export function index(
  name?: string,
  properties?: string[] | { [prop: string]: 'ASC' | 'DESC' },
  isUnique?: boolean,
  isClustered?: boolean
): PropertyDecorator | ClassDecorator {
  if (properties) {
    return function (target: Object): void {
      const entityOption = getEntityOptions(
        target.constructor as EntityConstructor
      );
      const indexOptions: IndexOptions = {
        name: name!,
        properties,
        isUnique,
        isClustered,
      };

      if (!entityOption) {
        setEntityOptions(target.constructor as EntityConstructor, {
          indexes: [],
        });
      } else {
        entityOption.indexes.push(indexOptions);
      }
    };
  }

  return function (target: Object, key: string): void {
    if (!name) {
      name = `IX_${target.constructor.name}_${key}`;
    }
    addEntitiyIndex(target.constructor as EntityConstructor, key);
    setIndexOptions(target.constructor as EntityConstructor, key, {
      name,
      properties: [key],
    });
  };
}


export function unique(isClustered: boolean = false): PropertyDecorator {
  return function (target: Object, key: string): void {
    setIndexOptions(target.constructor as EntityConstructor, key, {
      isUnique: true,
      isClustered,
    });
  };
}
