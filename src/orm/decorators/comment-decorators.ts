import { DbContextConstructor } from "../db-context";
import { EntityConstructor } from "../entity";
import 'reflect-metadata'

const COMMENT_KEY = Symbol('lubejs:comment');

export function getComment(target: Object, key?: string): string | undefined {
  if (key) {
    return Reflect.getMetadata(COMMENT_KEY, target, key);
  }
  return Reflect.getMetadata(COMMENT_KEY, target);
}


export function comment(
  msg: string
): (
  target: EntityConstructor | DbContextConstructor | Object,
  key?: string
) => void {
  return function (
    target: EntityConstructor | DbContextConstructor | Object,
    key?: string
  ): void {
    if (key) {
      Reflect.defineMetadata(COMMENT_KEY, msg, target, key);
    } else {
      Reflect.defineMetadata(COMMENT_KEY, msg, target);
    }
  };

  // return function (
  //   target: EntityConstructor | DbContextConstructor | Object,
  //   key?: string
  // ) {
  //   if (typeof target === 'function') {
  //     if (isExtendsOf(target, DbContext)) {
  //       setContextOptions(target as DbContextConstructor, {
  //         comment: msg,
  //       });
  //     } else {
  //       setEntityOptions(target as EntityConstructor, {
  //         comment: msg,
  //       });
  //     }
  //   } else {
  //     setColumnOptions(target.constructor as EntityConstructor, key!, {
  //       comment: msg,
  //     });
  //   }
  // };
}
