import { Migrate, Statement, SqlBuilder } from '../../src';

export class D implements Migrate {

  up(
    scripter: SqlBuilder,
    dialect: string | symbol
  ): void {
    scripter.createTable('OrderDetail').as(builder => [
      builder.column('id', scripter.raw('INT')).notNull(),
      builder.column('product', scripter.raw('VARCHAR(MAX)')).notNull(),
      builder.column('count', scripter.raw('INT')).notNull(),
      builder.column('price', scripter.raw('NUMERIC(18, 6)')).notNull(),
      builder.column('amount', scripter.raw('NUMERIC(18, 2)')).notNull(),
      builder.column('orderId', scripter.raw('INT')).notNull(),
      builder.primaryKey('PK_OrderDetail_id').on({ 'id': 'ASC' }).withNoclustered()
    ]);
    scripter.createTable('Position').as(builder => [
      builder.column('id', scripter.raw('INT')).notNull(),
      builder.column('name', scripter.raw('VARCHAR(MAX)')).notNull(),
      builder.column('description', scripter.raw('VARCHAR(MAX)')).null(),
      builder.primaryKey('PK_Position_id').on({ 'id': 'ASC' }).withNoclustered()
    ]);
    scripter.createTable('Employee').as(builder => [
      builder.column('id', scripter.raw('INT')).notNull(),
      builder.column('name', scripter.raw('VARCHAR(100)')).null(),
      builder.primaryKey('PK_Employee_id').on({ 'id': 'ASC' }).withNoclustered()
    ]);
    scripter.createTable('EmployeePosition').as(builder => [
      builder.column('id', scripter.raw('INT')).notNull().identity(0, 1),
      builder.column('PositionId', scripter.raw('INT')).notNull(),
      builder.column('EmployeeId', scripter.raw('INT')).notNull(),
      builder.primaryKey('PK_EmployeePosition_id').on({ 'id': 'ASC' }).withNoclustered()
    ]);
    scripter.alterTable('Order').add(({ primaryKey }) => primaryKey('PK_Order_id').on({ 'id': 'ASC' }));
    scripter.alterTable('Order').alterColumn(column => column('id', scripter.raw('undefined')).notNull());
    scripter.alterTable('Order').alterColumn(column => column('orderNo', scripter.raw('undefined')).notNull());
    scripter.alterTable('Order').alterColumn(column => column('date', scripter.raw('undefined')).notNull());
    scripter.alterTable('Order').alterColumn(column => column('description', scripter.raw('undefined')).null());
    scripter.alterTable('OrderDetail').add(builder => builder.foreignKey('FK_OrderDetail_orderId_Order_[object Object]').on('orderId').reference('Order', ['id']));
    scripter.alterTable('EmployeePosition').add(builder => builder.foreignKey('FK_EmployeePosition_PositionId_Position_[object Object]').on('PositionId').reference('Position', ['id']));
    scripter.alterTable('EmployeePosition').add(builder => builder.foreignKey('FK_EmployeePosition_EmployeeId_Employee_[object Object]').on('EmployeeId').reference('Employee', ['id']));
    scripter.insert('Position').values([null, null, null])
  }

  down(
    scripter: SqlBuilder,
    dialect: string | symbol
  ): void {
    scripter.alterTable('OrderDetail').drop(({ foreignKey }) => foreignKey('FK_OrderDetail_orderId_Order_[object Object]'));
    scripter.alterTable('EmployeePosition').drop(({ foreignKey }) => foreignKey('FK_EmployeePosition_PositionId_Position_[object Object]'));
    scripter.alterTable('EmployeePosition').drop(({ foreignKey }) => foreignKey('FK_EmployeePosition_EmployeeId_Employee_[object Object]'));
    scripter.dropTable("OrderDetail");
    scripter.dropTable("Position");
    scripter.dropTable("Employee");
    scripter.dropTable("EmployeePosition");
    scripter.alterTable('Order').drop(builder => builder.primaryKey('PK_Order_id')));
    scripter.alterTable('Order').alterColumn(column => column('id', scripter.raw('INT')).notNull());
    scripter.alterTable('Order').alterColumn(column => column('orderNo', scripter.raw('VARCHAR(MAX)')).notNull());
    scripter.alterTable('Order').alterColumn(column => column('date', scripter.raw('DATETIMEOFFSET(7)')).notNull());
    scripter.alterTable('Order').alterColumn(column => column('description', scripter.raw('VARCHAR(MAX)')).null())
  }

}

export default D;
