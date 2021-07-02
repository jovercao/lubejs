import { Migrate, SqlBuilder as SQL, DbType, MigrateBuilder } from 'lubejs';

export class New implements Migrate {

  async up(
    builder: MigrateBuilder,
    dialect: string | symbol
  ): Promise<void> {
    builder.createIndex('IX_Employee_organizationId').on('Employee', { 'organizationId': 'ASC' });
    builder.createIndex('UX_Employee_userId').on('Employee', { 'userId': 'ASC' }).unique();
    builder.commentColumn('Position', 'name', '职位名称');
    builder.commentColumn('Position', 'description', '摘要说明');
    builder.commentTable('Position', '主键');
    builder.createIndex('IX_EmployeePosition_employeeId').on('EmployeePosition', { 'employeeId': 'ASC' });
    builder.createIndex('IX_EmployeePosition_positionId').on('EmployeePosition', { 'positionId': 'ASC' });
    builder.createIndex('IX_Organization_parentId').on('Organization', { 'parentId': 'ASC' });
    builder.createIndex('IX_OrderDetail_orderId').on('OrderDetail', { 'orderId': 'ASC' })
  }

  async down(
    builder: MigrateBuilder,
    dialect: string | symbol
  ): Promise<void> {
    builder.dropIndex('Employee', 'IX_Employee_organizationId');
    builder.dropIndex('Employee', 'UX_Employee_userId');
    builder.commentColumn('Position', 'name', 'Ö°Î»Ãû³Æ');
    builder.commentColumn('Position', 'description', 'ÕªÒªËµÃ÷');
    builder.commentTable('Position', 'Ö÷¼ü');
    builder.dropIndex('EmployeePosition', 'IX_EmployeePosition_employeeId');
    builder.dropIndex('EmployeePosition', 'IX_EmployeePosition_positionId');
    builder.dropIndex('Organization', 'IX_Organization_parentId');
    builder.dropIndex('OrderDetail', 'IX_OrderDetail_orderId')
  }

}

export default New;
  