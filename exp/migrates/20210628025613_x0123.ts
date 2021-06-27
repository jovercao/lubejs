import { Migrate, Statement, SqlBuilder as SQL, DbType, MigrateBuilder } from 'lubejs';

export class x0123 implements Migrate {

  async up(
    builder: MigrateBuilder,
    dialect: string | symbol
  ): Promise<void> {
    builder.alterTable('OrderDetail').drop(({ foreignKey }) => foreignKey('FK_OrderDetail_orderId_Order_id'));
    builder.alterTable('EmployeePosition').drop(({ foreignKey }) => foreignKey('FK_EmployeePosition_PositionId_Position_id'));
    builder.alterTable('EmployeePosition').drop(({ foreignKey }) => foreignKey('FK_EmployeePosition_EmployeeId_Employee_id'));
    builder.setDefaultValue('Order', 'date', "sysDateTimeOffset()");
    builder.alterTable('OrderDetail').add(builder => builder.foreignKey('FK_OrderDetail_orderId_Order_id').on('orderId').reference('Order', ['id']));
    builder.alterTable('EmployeePosition').add(builder => builder.foreignKey('FK_EmployeePosition_PositionId_Position_id').on('PositionId').reference('Position', ['id']));
    builder.alterTable('EmployeePosition').add(builder => builder.foreignKey('FK_EmployeePosition_EmployeeId_Employee_id').on('EmployeeId').reference('Employee', ['id']))
  }

  async down(
    builder: MigrateBuilder,
    dialect: string | symbol
  ): Promise<void> {
    builder.alterTable('OrderDetail').drop(({ foreignKey }) => foreignKey('FK_OrderDetail_orderId_Order_id'));
    builder.alterTable('EmployeePosition').drop(({ foreignKey }) => foreignKey('FK_EmployeePosition_PositionId_Position_id'));
    builder.alterTable('EmployeePosition').drop(({ foreignKey }) => foreignKey('FK_EmployeePosition_EmployeeId_Employee_id'));
    builder.dropDefaultValue('Order', 'date');
    builder.alterTable('OrderDetail').add(builder => builder.foreignKey('FK_OrderDetail_orderId_Order_id').on('orderId').reference('Order', ['id']));
    builder.alterTable('EmployeePosition').add(builder => builder.foreignKey('FK_EmployeePosition_PositionId_Position_id').on('PositionId').reference('Position', ['id']));
    builder.alterTable('EmployeePosition').add(builder => builder.foreignKey('FK_EmployeePosition_EmployeeId_Employee_id').on('EmployeeId').reference('Employee', ['id']))
  }

}

export default x0123;
  