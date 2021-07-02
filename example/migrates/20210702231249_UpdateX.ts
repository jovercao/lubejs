import { Migrate, SqlBuilder as SQL, DbType, MigrateBuilder } from 'lubejs';

export class UpdateX implements Migrate {

  async up(
    builder: MigrateBuilder,
    dialect: string | symbol
  ): Promise<void> {
    builder.alterTable('EmployeePosition').drop(({ foreignKey }) => foreignKey('FK_EmployeePosition_employeeId_Employee_id'));
    builder.alterTable('EmployeePosition').drop(({ foreignKey }) => foreignKey('FK_EmployeePosition_positionId_Position_id'));
    builder.alterTable('Employee').add(builder => builder.column('description', DbType.string(100)).null());
    builder.alterTable('Employee').alterColumn(column => column('organizationId', DbType.int32).notNull());
    builder.createIndex('IX_Employee_organizationId').on('Employee', { 'organizationId': 'ASC' });
    builder.createIndex('UX_Employee_userId').on('Employee', { 'userId': 'ASC' }).unique();
    builder.commentColumn('Position', 'name', '职位名称');
    builder.commentColumn('Position', 'description', '摘要说明');
    builder.commentTable('Position', '主键');
    builder.createIndex('IX_EmployeePosition_employeeId').on('EmployeePosition', { 'employeeId': 'ASC' });
    builder.createIndex('IX_EmployeePosition_positionId').on('EmployeePosition', { 'positionId': 'ASC' });
    builder.createIndex('IX_Organization_parentId').on('Organization', { 'parentId': 'ASC' });
    builder.setDefaultValue('Order', 'date', SQL.raw("sysdatetimeoffset()"));
    builder.dropDefaultValue('Order', 'description');
    builder.alterTable('OrderDetail').alterColumn(column => column('orderId', DbType.int32).notNull());
    builder.createIndex('IX_OrderDetail_orderId').on('OrderDetail', { 'orderId': 'ASC' });
    builder.alterTable('EmployeePosition').add(builder => builder.foreignKey('FK_EmployeePosition_employeeId_TO_Employee_id').on('employeeId').reference('Employee', ['id']));
    builder.alterTable('EmployeePosition').add(builder => builder.foreignKey('FK_EmployeePosition_positionId_TO_Position_id').on('positionId').reference('Position', ['id']))
  }

  async down(
    builder: MigrateBuilder,
    dialect: string | symbol
  ): Promise<void> {
    builder.alterTable('EmployeePosition').drop(({ foreignKey }) => foreignKey('FK_EmployeePosition_employeeId_TO_Employee_id'));
    builder.alterTable('EmployeePosition').drop(({ foreignKey }) => foreignKey('FK_EmployeePosition_positionId_TO_Position_id'));
    builder.alterTable('Employee').drop(builder => builder.column('description'));
    builder.alterTable('Employee').alterColumn(column => column('organizationId', DbType.int32).null());
    builder.dropIndex('Employee', 'IX_Employee_organizationId');
    builder.dropIndex('Employee', 'UX_Employee_userId');
    builder.commentColumn('Position', 'name', 'Ö°Î»Ãû³Æ');
    builder.commentColumn('Position', 'description', 'ÕªÒªËµÃ÷');
    builder.commentTable('Position', 'Ö÷¼ü');
    builder.dropIndex('EmployeePosition', 'IX_EmployeePosition_employeeId');
    builder.dropIndex('EmployeePosition', 'IX_EmployeePosition_positionId');
    builder.dropIndex('Organization', 'IX_Organization_parentId');
    builder.setDefaultValue('Order', 'date', "datepart(year,getdate())");
    builder.setDefaultValue('Order', 'description', "'ABCdEFG'");
    builder.alterTable('OrderDetail').alterColumn(column => column('orderId', DbType.int32).null());
    builder.dropIndex('OrderDetail', 'IX_OrderDetail_orderId');
    builder.alterTable('EmployeePosition').add(builder => builder.foreignKey('FK_EmployeePosition_employeeId_Employee_id').on('employeeId').reference('Employee', ['id']));
    builder.alterTable('EmployeePosition').add(builder => builder.foreignKey('FK_EmployeePosition_positionId_Position_id').on('positionId').reference('Position', ['id']))
  }

}

export default UpdateX;
