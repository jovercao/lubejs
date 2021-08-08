import { DB } from '../index'
import {
  column,
  comment,
  context,
  Entity,
  EntityKey,
  identity,
  key,
  manyToMany,
  nullable,
  table,
} from 'lubejs';
import { Employee } from './employee'

@table()
@comment('Position')
@context(() => DB)
export class Position extends Entity implements EntityKey {
  @column()
  @comment('PositionID')
  @identity()
  @key()
  id?: bigint;

  @comment('PositionName')
  @column()
  name!: string;

  @column()
  @comment('Description')
  @nullable()
  description?: string;

  @manyToMany(() => Employee, p => p.positions)
  employees?: Employee[];
}
