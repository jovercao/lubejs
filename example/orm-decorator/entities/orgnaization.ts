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
  manyToOne,
  nullable,
  oneToMany,
  table,
} from 'lubejs';
import { Employee } from './employee'

@table()
@comment('Organization')
@context(() => DB)
export class Organization extends Entity implements EntityKey {
  @column()
  @key()
  @comment('OrganizationID')
  @identity()
  id?: bigint;

  @comment('OrganizationName')
  @column()
  name!: string;

  @column()
  @comment('Description')
  @nullable()
  description?: string;

  @comment('ParentOrganizationID')
  @column()
  parentId?: bigint;

  @foreignKey('parentId')
  @manyToOne(() => Organization, p => p.children)
  parent?: Organization;

  @oneToMany(() => Organization, p => p.parent)
  children?: Organization[];

  @oneToMany(() => Employee, p => p.organization)
  employees?: Employee[];
}
