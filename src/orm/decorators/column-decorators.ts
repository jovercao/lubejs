import { EntityConstructor, Entity } from "../entity";
import { CompatibleExpression, DbType, ProxiedRowset } from "../../core";
import { isScalarType } from "../util";
import { ColumnMetadata } from "../metadata";
import { ScalarType } from "../types";
import { addEntitiyColumn } from "./entity-decorators";
import { DbContext } from "../db-context";
import 'reflect-metadata'

const COLUMN_KEY = Symbol('lubejs:column');

export interface ColumnOptions
  extends Partial<
    Pick<
      ColumnMetadata,
      | 'columnName'
      // | 'comment'
      | 'generator'
      | 'isRowflag'
      | 'isCalculate'
      | 'isIdentity'
      | 'isNullable'
      | 'dbType'
      | 'identityIncrement'
      | 'identityStartValue'
    >
  > {
  type: ScalarType;
  defaultValueGetter?: () => CompatibleExpression;
  calculateExpressionGetter?: () => CompatibleExpression;
}

export function getColumnOptions(
  target: EntityConstructor,
  key: string
): ColumnOptions | undefined {
  return Reflect.getMetadata(COLUMN_KEY, target, key);
}

function setColumnOptions(
  target: EntityConstructor,
  key: string,
  options: Partial<ColumnOptions>
): void {
  let columnOptions = getColumnOptions(target, key);
  if (!columnOptions) {
    columnOptions = {} as ColumnOptions;
    Reflect.defineMetadata(COLUMN_KEY, columnOptions, target, key);
  }
  Object.assign(columnOptions, options);
}

export function column<T extends Entity>(name?: string): PropertyDecorator;
export function column<T extends Entity>(type: ScalarType): PropertyDecorator;
export function column<T extends Entity>(dbType: DbType): PropertyDecorator;
export function column<T extends Entity>(
  type: ScalarType,
  dbType: DbType
): PropertyDecorator;
export function column<T extends Entity>(
  name: string,
  type?: ScalarType
): PropertyDecorator;
export function column<T extends Entity>(
  name: string,
  dbType?: DbType
): PropertyDecorator;
export function column<T extends Entity>(
  name: string,
  type: ScalarType,
  dbType: DbType
): PropertyDecorator;
export function column<T extends Entity>(
  nameOrTypeOrDbType?: string | DbType | ScalarType,
  typeOrDbType?: DbType | ScalarType,
  dbType?: DbType
): PropertyDecorator {
  return function (target: Object, key: string) {
    let name: string | undefined;
    let dbType: DbType | undefined;
    let type: ScalarType | undefined;
    // 无参数
    if (typeof nameOrTypeOrDbType === 'string') {
      name = nameOrTypeOrDbType;
      if (typeof typeOrDbType === 'object') {
        dbType = typeOrDbType;
      } else {
        type = typeOrDbType;
      }
    } else if (typeof nameOrTypeOrDbType === 'object') {
      dbType = nameOrTypeOrDbType;
    } else if (typeof nameOrTypeOrDbType === 'function') {
      type = nameOrTypeOrDbType;
      if (typeof typeOrDbType === 'object') {
        dbType = typeOrDbType;
      }
    }
    if (!name) {
      name = key;
    }

    const designType = Reflect.getMetadata('design:type', target, key);
    if (!type) {
      type = designType;
    }
    if (!isScalarType(type)) {
      throw new Error(
        'Unsupport column type, you must declare property with ScalarType.'
      );
    }

    setColumnOptions(target.constructor as EntityConstructor, key, {
      type: type!,
      dbType,
      columnName: name,
    });
    addEntitiyColumn(target.constructor as EntityConstructor, key);
  };
}

export function rowflag(): PropertyDecorator {
  return function (target: Object, key: string) {
    setColumnOptions(target.constructor as EntityConstructor, key, {
      dbType: DbType.rowflag,
      isRowflag: true,
    });
  };
}

export function nullable(nullable: boolean = true): PropertyDecorator {
  return function (target: Object, key: string) {
    setColumnOptions(target.constructor as EntityConstructor, key, {
      isNullable: nullable,
    });
  };
}

export function calculate(
  exprGetter: () => CompatibleExpression
): PropertyDecorator {
  return function (target: Object, key: string) {
    setColumnOptions(target.constructor as EntityConstructor, key, {
      isCalculate: true,
      calculateExpressionGetter: exprGetter,
    });
  };
}

export function autogen<T extends Entity = any>(
  generator: (
    rowset: ProxiedRowset<T>,
    item: object,
    context: DbContext
  ) => CompatibleExpression
): PropertyDecorator {
  return function (target: Object, key: string) {
    setColumnOptions(target.constructor as EntityConstructor, key, {
      generator,
    });
  };
}

export function defaultValue(
  exprGetter: () => CompatibleExpression
): PropertyDecorator {
  return function (target: Object, key: string) {
    setColumnOptions(target.constructor as EntityConstructor, key, {
      defaultValueGetter: exprGetter,
    });
  };
}

/**
 * 单独标记属性类型
 * Uuid Decimal Date等对象类型必须使用type进行标记
 */
export function type(type: ScalarType): PropertyDecorator {
  return function (target: Object, key: string): void {
    setColumnOptions(target.constructor as EntityConstructor, key, {
      type,
    });
  };
}

export function identity(
  start?: number,
  incerment?: number
): PropertyDecorator {
  return function (target: object, key: string) {
    setColumnOptions(target.constructor as EntityConstructor, key, {
      isIdentity: true,
      identityStartValue: start,
      identityIncrement: incerment,
    });
  };
}
