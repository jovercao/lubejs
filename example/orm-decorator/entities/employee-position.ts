import { DB } from '../index'
import {
  among,
  column,
  comment,
  context,
  Entity,
  EntityKey,
  foreignKey,
  identity,
  key,
  manyToOne,
  table,
} from 'lubejs';
import { Position } from './position'
import { Employee } from './employee'

@table()
@context(() => DB)
// @among(() => Position, () => Employee, 'position', 'employee')
@among<EmployeePosition, Position, Employee>(() => Position, () => Employee, p => p.position, p => p.employee)
export class EmployeePosition extends Entity implements EntityKey {
  @column()
  @comment('ID')
  @key()
  @identity()
  id?: bigint;

  @comment('PositionID')
  @column()
  positionId!: bigint;

  @foreignKey('positionId')
  @manyToOne(() => Position)
  position?: Position;

  @column()
  @comment('EmployeeID')
  employeeId!: bigint;

  @foreignKey('employeeId')
  @manyToOne(() => Employee)
  employee?: Employee;
}
