import { RowObject } from "./ast";
import { Lube } from "./lube";
import { Constructor, DbContextMetadata } from "./metadata";
import { Queryable } from "./queryable";
import { Repository } from "./repository";
import { makeProxiedRowset } from "./util";

/**
 * 此类建议定义为全局共享对象（单例依赖注入），不建议为域注入
 */
export class DbContext {
  metadata: DbContextMetadata
  lube: Lube
  /**
 * 获取一个可查询对象
 */
  getRepository<T extends RowObject>(ctr: Constructor<T>): Repository<T> {
    return new Repository(this.lube, ctr)
  }

  /**
   * 获取一个仓储库对象
   */
  getQueryable<T extends RowObject>(ctr: Constructor<T>): Queryable<T> {
    return new Queryable<T>(this.lube, ctr)
  }
}
