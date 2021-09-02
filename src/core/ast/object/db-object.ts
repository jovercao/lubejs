import { RowObject } from '..';
import { AST } from '../ast';
import { ProxiedTable, Table } from '../rowset';
import { Func } from './func';
import { Procedure } from './procedure';

/**
 * 标识符，可以多级，如表名等
 */
export abstract class DBObject<N extends string = string> extends AST {
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

  static func(name: CompatiableObjectName<string>, builtIn: boolean = false): Func {
    return new Func(name, builtIn);
  }

  static proc(name: CompatiableObjectName<string>, builtIn: boolean = false): Procedure {
    return new Procedure(name, builtIn);
  }

  static table<T extends RowObject>(name: CompatiableObjectName, builtIn: boolean = false): ProxiedTable<T> {
    return new Table(name, builtIn) as ProxiedTable<T>;
  }
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
