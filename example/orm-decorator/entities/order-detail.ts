import { DB } from '../index'
import {
  column,
  comment,
  context,
  DbType,
  Decimal,
  Entity,
  EntityKey,
  foreignKey,
  identity,
  key,
  manyToOne,
  nullable,
  table,
} from 'lubejs';
import { Order } from './order'

/**
 * OrderDetail
 */
 @table()
 @context(() => DB)
 @comment('OrderDetail')
 export class OrderDetail extends Entity implements EntityKey {
   @column()
   @comment('ID')
   @identity()
   @key()
   id?: bigint;

   @column()
   @comment('ProductName')
   product!: string;

   @comment('Quantity')
   @column()
   count!: number;

   @comment('Price')
   @column(DbType.decimal(18, 6))
   price!: Decimal;

   @comment('Amount')
   @column(DbType.decimal(18, 2))
   amount!: Decimal;

   @column()
   @comment('Description')
   @nullable()
   description?: string;

   @comment('OrderId')
   @column()
   orderId?: bigint;

   @foreignKey('orderId')
   @manyToOne(() => Order, p => p.details)
   order?: Order;
 }
