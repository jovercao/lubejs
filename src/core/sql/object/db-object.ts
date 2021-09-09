import { SQL } from '../sql';

/**
 * 标识符，可以多级，如表名等
 */
export abstract class DBObject<N extends string = string> extends SQL {
  constructor(name: CompatiableObjectName<N>, builtIn = false) {
    super();
    this.$name = name;
    this.$builtin = builtIn;
  }

  /**
   * 标识符名称
   */
  readonly $name: CompatiableObjectName<N>;

  /**
   * 是否内建标识符，如果是，在编译时不会自动加上引号，如系统函数类的 count 等聚合函数
   */
  readonly $builtin: boolean;
}

/**
 * ObjectName
 */
export interface ObjectName<N extends string = string> {
  name: N;
  schema?: string;
  database?: string;
}

export type CompatiableObjectName<N extends string = string> =
  | ObjectName<N>
  | N;
