import { DB } from '../index'
import {
  column,
  comment,
  context,
  Entity,
  EntityKey,
  identity,
  key,
  nullable,
  oneToOne,
  principal,
  table,
} from 'lubejs';
import { Employee } from './employee'

/**
 * User实体类
 */
 @comment('User')
 @table()
 @context(() => DB)
 export class User extends Entity implements EntityKey {
   @column()
   @key()
   @identity()
   @comment('ID')
   id?: bigint;

   @comment('UserName')
   @column()
   name!: string;

   @comment('Password')
   @nullable()
   @column()
   password!: string;

   @comment('Description')
   @nullable()
   @column()
   description?: string;

   @principal()
   @oneToOne(() => Employee, p => p.user)
   employee?: Employee;
 }
