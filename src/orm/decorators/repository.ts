import { DbContext } from "../db-context";
import { Entity, EntityConstructor } from "../entity";

export function repository<T extends Entity>(
  typegetter: () => EntityConstructor<T>
): PropertyDecorator {
  return function (target: Object, key: string | symbol): any {
    return {
      enumerable: false,
      get(this: DbContext) {
        return this.getRepository(typegetter());
      },
    };
  };
}
