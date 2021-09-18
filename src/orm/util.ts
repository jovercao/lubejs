import { Decimal, isStringType, Uuid } from '../core';
import { Entity } from './entity';
import { ColumnMetadata, EntityMetadata } from './metadata';
import { FetchRelations, ScalarType } from './types';

const PropertySelector: any = new Proxy(
  {},
  {
    get: (_, key: string): string => {
      if (typeof key !== 'string') {
        throw new Error(
          `Invalid property type ${typeof key}, entity property is allow string key only.`
        );
      }
      return key;
    },
  }
);

export function selectProperty(selector: (p: any) => any): any {
  const property = selector(PropertySelector);
  return property;
}

export function isScalarType(value: any): value is ScalarType {
  return (
    value === String ||
    value === Date ||
    value === Boolean ||
    value === Number ||
    value === Decimal ||
    value === BigInt ||
    value === ArrayBuffer ||
    value === Buffer ||
    value === SharedArrayBuffer ||
    value === Object ||
    value === Array ||
    value === Uuid
  );
}

export function lowerFirst(str: string): string {
  return str[0].toLowerCase() + str.substring(1);
}

/**
 * 转换为复数
 * @param word 单词
 * @returns
 */
export function complex(word: string): string {
  if (irregular[word.toLowerCase()]) {
    const style = getCaseStyle(word);
    const complexWord = irregular[word];
    switch (style) {
      case CaseStyle.lowerCase:
      case CaseStyle.lowerCamelCase:
        return complexWord;
      case CaseStyle.upperCase:
        return complexWord.toUpperCase();
      case CaseStyle.upperCamelCase:
        return upperFirst(complexWord);
    }
  }

  if (esSuffix.find(item => word.endsWith(item))) {
    return word + 'es';
  }
  if (word.endsWith('y') && !vowels.includes(word[word.length - 2])) {
    return word.substr(0, word.length - 1) + 'ies';
  }
  const ves = vesSuffix.find(item => word.endsWith(item));
  if (ves) {
    return word.substr(0, word.length - ves.length) + 'ves';
  }
  return word + 's';
}

export function upperFirst(str: string): string {
  return str[0].toUpperCase() + str.substring(1);
}

export function camelCase(str: string): string {
  const nodes = str.split(/-|_| /g);
  return nodes.map(node => lowerFirst(node)).join('');
}

/**
 * 书写风格
 */
export enum CaseStyle {
  upperCase = 1,
  lowerCase = 2,
  upperCamelCase = 3,
  lowerCamelCase = 4,
}

export function getCaseStyle(str: string): CaseStyle {
  throw new Error(`未实现`);
}

const esSuffix = ['s', 'o', 'x', 'th'];
const vesSuffix = ['f', 'fe'];
const irregular: Record<string, string> = {
  mouse: 'mice',
  man: 'men',
  tooth: 'teeth',
};

const vowels = ['a', 'e', 'i', 'o', 'u'];

/**
 * 判断一个函数是否为类声明
 * 注意，此方法在编译目标为ES5及以下版本中无效！
 */
// HACK： 此方法为hack方法，存在不确定性，并且已知在编译目标为ES5及以下版本中无效！
export function isClass(func: Function): boolean {
  return func.toString().startsWith('class ');
}

export function mergeFetchRelations(
  ...includes: (FetchRelations | undefined)[]
): FetchRelations | undefined {
  const merge = (
    dest: Record<string, any> | undefined,
    include: Record<string, any> | undefined
  ) => {
    if (!dest) return include;
    if (!include) return dest;
    Object.entries(include).forEach(([key, value]) => {
      if (!value) return;

      const exists = dest[key];
      if (!exists) {
        if (typeof value === 'boolean') {
          dest[key] = value;
        } else {
          dest[key] = merge({}, value);
        }
        return;
      }
      if (value === true) {
        // true不覆盖任何值
        return;
      }

      if (exists === true) {
        dest[key] = merge({}, value);
      } else {
        merge(exists, value);
      }
    });
    return dest;
  };
  let result: any = includes[0];
  for (let i = 1; i < includes.length; i++) {
    const include = includes[i];
    result = merge(result, include);
  }
  return result;
}

