import Demo from './demo';
import logType from './logType'

export class Item {

  @logType
  public demo?: Demo;

  @logType
  public demos?: Demo[];

}
