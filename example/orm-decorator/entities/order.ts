import { DB } from '../index'
import {
  autogen,
  Binary,
  column,
  comment,
  context,
  DbType,
  defaultValue,
  Entity,
  EntityKey,
  identity,
  index,
  key,
  nullable,
  oneToMany,
  ProxiedRowset,
  rowflag,
  SqlBuilder,
  table,
} from 'lubejs';
import { OrderDetail } from './order-detail'
/**
 * Order
 */
 @table()
 @context(() => DB)
 @comment('Order')
 export class Order extends Entity implements EntityKey {
   @column()
   @comment('ID')
   @key()
   @identity()
   id?: bigint;

   @comment('OrderDate')
   @defaultValue(() => SqlBuilder.now())
   @column()
   date!: Date;
   // 自动生成，因此可以为空

   @index()
   @comment('OrderNo')
   @autogen((item: ProxiedRowset<Order>) => 'abc')
   @column(DbType.string(20))
   orderNo?: string;

   @comment('Description')
   @nullable()
   description?: string;

   /**
    * 行版本号
    */
   @column()
   @comment('Rowflag')
   @rowflag()
   rowflag?: Binary;

   @oneToMany(() => OrderDetail, p => p.order)
   details?: OrderDetail[];
 }
