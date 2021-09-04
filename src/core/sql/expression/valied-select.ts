import { SQL_SYMBOLE } from '../sql';
import { Scalar } from '../scalar';
import { Select } from '../statement/crud/select';
import { Expression } from './expression';

/**
 * 表达式化后的SELECT语句，通常用于 in 语句，或者当作值当行值使用
 */
export class ValuedSelect<T extends Scalar = Scalar> extends Expression<T> {
  $select: Select<any>;
  $type: SQL_SYMBOLE.VALUED_SELECT = SQL_SYMBOLE.VALUED_SELECT;
  static isValuedSelect(object: any): object is ValuedSelect {
    return object?.$type === SQL_SYMBOLE.VALUED_SELECT;
  }
  constructor(select: Select<any>) {
    super();
    this.$select = select;
  }
}
