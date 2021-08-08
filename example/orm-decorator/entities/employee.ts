import { DB } from '../index'
import {
  column,
  comment,
  context,
  Entity,
  EntityKey,
  foreignKey,
  identity,
  key,
  manyToMany,
  manyToOne,
  nullable,
  oneToOne,
  table,
} from 'lubejs';
import { Organization } from './orgnaization'
import { Position } from './position'
import { User } from './user'

@table()
@comment('Employee')
@context(() => DB)
export class Employee extends Entity implements EntityKey {
  @column()
  @key()
  @comment('EmployeeID')
  @identity()
  id?: bigint;

  @comment('Name')
  @column()
  name!: string;

  @column()
  @comment('Description')
  @nullable()
  description?: string;

  @manyToOne(() => Organization, p => p.employees)
  organization?: Organization;

  @manyToMany(() => Position, p => p.employees)
  positions?: Position[];

  @column()
  @comment('UserID')
  userId?: bigint;

  @foreignKey('userId')
  @oneToOne(() => User, p => p.employee)
  user?: User;
}
