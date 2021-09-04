import { Scalar } from '../../core';
import { Entity } from '../entity';

export type HasManyKeyOf<T extends Entity> = {
  [P in keyof T]: P extends string
    ? T[P] extends Entity[]
      ? P
      : never
    : never;
}[keyof T];

export type HasOneKeyOf<T extends Entity> = {
  [P in keyof T]: P extends string ? (T[P] extends Entity ? P : never) : never;
}[keyof T];

export type ColumnKeyOf<T extends Entity> = {
  [P in keyof T]: P extends string ? (T[P] extends Scalar ? P : never) : never;
}[keyof T];
