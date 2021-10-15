import { EntityConstructor, Entity } from '../entity';
import { XExpression, DbType, XRowset } from '../../core';
import { isScalarType } from '../util';
import { ColumnMetadata } from '../metadata';
import { ScalarDataType } from '../data-types';
import { addEntitiyColumn } from './entity-decorators';
import { DbContext } from '../db-context';
import 'reflect-metadata';
import { isDbType } from '../../core/sql';

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
  type: ScalarDataType;
  defaultValueGetter?: () => XExpression;
  calculateExpressionGetter?: () => XExpression;
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
export function column<T extends Entity>(type: ScalarDataType): PropertyDecorator;
export function column<T extends Entity>(dbType: DbType): PropertyDecorator;
export function column<T extends Entity>(
  type: ScalarDataType,
  dbType: DbType
): PropertyDecorator;
export function column<T extends Entity>(
  name: string,
  type?: ScalarDataType
): PropertyDecorator;
export function column<T extends Entity>(
  name: string,
  dbType?: DbType
): PropertyDecorator;
export function column<T extends Entity>(
  name: string,
  type: ScalarDataType,
  dbType: DbType
): PropertyDecorator;
export function column<T extends Entity>(
  nameOrTypeOrDbType?: string | DbType | ScalarDataType,
  typeOrDbType?: DbType | ScalarDataType,
  dbType?: DbType
): PropertyDecorator {
  return function (target: Object, key: string) {
    let name: string | undefined;
    let dbType: DbType | undefined;
    let type: ScalarDataType | undefined;
    // 无参数
    if (typeof nameOrTypeOrDbType === 'string') {
      name = nameOrTypeOrDbType;
      if (isDbType(typeOrDbType)) {
        dbType = typeOrDbType;
      } else {
        type = typeOrDbType;
      }
    } else if (isDbType(nameOrTypeOrDbType)) {
      dbType = nameOrTypeOrDbType;
    } else if (
      typeof nameOrTypeOrDbType === 'function' ||
      Array.isArray(nameOrTypeOrDbType)
    ) {
      type = nameOrTypeOrDbType;
      if (isDbType(typeOrDbType)) {
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

export function rowflag(yesOrNo: boolean = true): PropertyDecorator {
  return function (target: Object, key: string) {
    setColumnOptions(target.constructor as EntityConstructor, key, {
      dbType: DbType.rowflag,
      isRowflag: yesOrNo,
    });
  };
}

export function nullable(yesOrNo: boolean = true): PropertyDecorator {
  return function (target: Object, key: string) {
    setColumnOptions(target.constructor as EntityConstructor, key, {
      isNullable: yesOrNo,
    });
  };
}

export function calculate(
  exprGetter: () => XExpression
): PropertyDecorator {
  return function (target: Object, key: string) {
    setColumnOptions(target.constructor as EntityConstructor, key, {
      isCalculate: true,
      calculateExpressionGetter: exprGetter,
    });
  };
}

export function noCalculate(): PropertyDecorator {
  return function (target: Object, key: string) {
    setColumnOptions(target.constructor as EntityConstructor, key, {
      isCalculate: false,
      calculateExpressionGetter: undefined,
    });
  };
}

export function autogen<T extends Entity = any>(
  generator: (
    rowset: XRowset<T>,
    item: object,
    context: DbContext
  ) => XExpression
): PropertyDecorator {
  return function (target: Object, key: string) {
    setColumnOptions(target.constructor as EntityConstructor, key, {
      generator,
    });
  };
}

/**
 * 移除自动生成
 */
export function noAutogen<T extends Entity = any>(): PropertyDecorator {
  return function (target: Object, key: string) {
    setColumnOptions(target.constructor as EntityConstructor, key, {
      generator: undefined,
    });
  };
}

export function defaultValue(
  exprGetter: () => XExpression
): PropertyDecorator {
  return function (target: Object, key: string) {
    setColumnOptions(target.constructor as EntityConstructor, key, {
      defaultValueGetter: exprGetter,
    });
  };
}

export function noDefaultValue(): PropertyDecorator {
  return function (target: Object, key: string) {
    setColumnOptions(target.constructor as EntityConstructor, key, {
      defaultValueGetter: undefined,
    });
  };
}

/**
 * 单独标记属性类型
 * Uuid Decimal Date等对象类型必须使用type进行标记
 */
export function type(type: ScalarDataType): PropertyDecorator {
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
