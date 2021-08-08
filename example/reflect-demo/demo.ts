import { Decimal, Uuid } from 'lubejs/types'
import { Item } from './item'
import logType from './logType'

export class Demo{
  @logType // apply property decorator
  // @Reflect.metadata('design:type', String)
  public attr1!: string;

  @logType
  public attr2?: number;

  @logType
  public item?: Item;

  @logType
  public attr3: number | undefined;

  @logType
  public attr4: undefined | string;

  @logType
  public attr5?: Date;

  @logType
  public attr6?: Uuid;

  @logType
  public attr7?: Decimal;

  @logType
  public items?: Item[];

  @logType
  public items2?: Item[] | undefined;
}

export default Demo;
