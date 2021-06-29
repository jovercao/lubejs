import { Migrate, SqlBuilder as SQL, DbType, MigrateBuilder } from 'lubejs';

export class AddComment implements Migrate {

  async up(
    builder: MigrateBuilder,
    dialect: string | symbol
  ): Promise<void> {
    builder.alterTable('EmployeePosition').drop(({ foreignKey }) => foreignKey('FK_EmployeePosition_EmployeeId_Employee_id'));
    builder.alterTable('EmployeePosition').drop(({ foreignKey }) => foreignKey('FK_EmployeePosition_PositionId_Position_id'));
    builder.alterTable('Employee').alterColumn(column => column('userId', DbType.int32).notNull());
    builder.commentColumn('Position', 'id', 'ID');
    builder.commentColumn('Position', 'name', '职位名称');
    builder.commentColumn('Position', 'description', '摘要说明');
    builder.commentTable('Position', '主键');
    builder.alterTable('EmployeePosition').add(builder => builder.column('employeeId', DbType.int32).null());
    builder.alterTable('EmployeePosition').add(builder => builder.column('positionId', DbType.int32).null());
    builder.alterTable('EmployeePosition').drop(builder => builder.column('EmployeeId'));
    builder.alterTable('EmployeePosition').drop(builder => builder.column('PositionId'));
    builder.setDefaultValue('Order', 'date', "sysDateTimeOffset()");
    builder.alterTable('EmployeePosition').add(builder => builder.foreignKey('FK_EmployeePosition_employeeId_Employee_id').on('employeeId').reference('Employee', ['id']));
    builder.alterTable('EmployeePosition').add(builder => builder.foreignKey('FK_EmployeePosition_positionId_Position_id').on('positionId').reference('Position', ['id']))
  }

  async down(
    builder: MigrateBuilder,
    dialect: string | symbol
  ): Promise<void> {
    builder.alterTable('EmployeePosition').drop(({ foreignKey }) => foreignKey('FK_EmployeePosition_employeeId_Employee_id'));
    builder.alterTable('EmployeePosition').drop(({ foreignKey }) => foreignKey('FK_EmployeePosition_positionId_Position_id'));
    builder.alterTable('Employee').alterColumn(column => column('userId', DbType.int32).null());
    builder.commentColumn('Position', 'id', );
    builder.commentColumn('Position', 'name', );
    builder.commentColumn('Position', 'description', );
    builder.commentTable('Position', );
    builder.alterTable('EmployeePosition').add(builder => builder.column('EmployeeId', DbType.int32).notNull());
    builder.alterTable('EmployeePosition').add(builder => builder.column('PositionId', DbType.int32).notNull());
    builder.alterTable('EmployeePosition').drop(builder => builder.column('employeeId'));
    builder.alterTable('EmployeePosition').drop(builder => builder.column('positionId'));
    builder.dropDefaultValue('Order', 'date');
    builder.alterTable('EmployeePosition').add(builder => builder.foreignKey('FK_EmployeePosition_EmployeeId_Employee_id').on('EmployeeId').reference('Employee', ['id']));
    builder.alterTable('EmployeePosition').add(builder => builder.foreignKey('FK_EmployeePosition_PositionId_Position_id').on('PositionId').reference('Position', ['id']))
  }

}

export default AddComment;
  