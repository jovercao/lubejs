import { Migrate, Statement, SqlBuilder } from '../../src';

export class A implements Migrate {
  up(scripter: SqlBuilder, dialect: string | symbol): void {
    scripter.dropTable('Order');
    scripter.dropTable('OrderDetail');
    scripter.dropTable('Position');
    scripter.dropTable('Employee');
    scripter.dropTable('EmployeePosition');
  }

  down(scripter: SqlBuilder, dialect: string | symbol): void {
    scripter
      .createTable('Order')
      .as(builder => [
        builder.column('id', scripter.raw('INT')).notNull(),
        builder.column('orderNo', scripter.raw('VARCHAR(MAX)')).notNull(),
        builder.column('date', scripter.raw('DATETIMEOFFSET(7)')).notNull(),
        builder.column('description', scripter.raw('VARCHAR(MAX)')).null(),
        builder.primaryKey('PK_Order_id').on({ id: 'ASC' }).withNoclustered(),
      ]);
    scripter
      .createTable('OrderDetail')
      .as(builder => [
        builder.column('id', scripter.raw('INT')).notNull(),
        builder.column('product', scripter.raw('VARCHAR(MAX)')).notNull(),
        builder.column('count', scripter.raw('INT')).notNull(),
        builder.column('price', scripter.raw('NUMERIC(18, 6)')).notNull(),
        builder.column('amount', scripter.raw('NUMERIC(18, 2)')).notNull(),
        builder.column('orderId', scripter.raw('INT')).notNull(),
        builder
          .primaryKey('PK_OrderDetail_id')
          .on({ id: 'ASC' })
          .withNoclustered(),
        builder
          .foreignKey('OrderDetail_orderId_Order_[object Object]')
          .on('orderId')
          .reference('Order', ['id']),
      ]);
    scripter
      .createTable('Position')
      .as(builder => [
        builder.column('id', scripter.raw('INT')).notNull(),
        builder.column('name', scripter.raw('VARCHAR(MAX)')).notNull(),
        builder.column('description', scripter.raw('VARCHAR(MAX)')).null(),
        builder
          .primaryKey('PK_Position_id')
          .on({ id: 'ASC' })
          .withNoclustered(),
      ]);
    scripter
      .createTable('Employee')
      .as(builder => [
        builder.column('id', scripter.raw('INT')).notNull(),
        builder.column('name', scripter.raw('VARCHAR(100)')).null(),
        builder
          .primaryKey('PK_Employee_id')
          .on({ id: 'ASC' })
          .withNoclustered(),
      ]);
    scripter
      .createTable('EmployeePosition')
      .as(builder => [
        builder.column('id', scripter.raw('INT')).notNull().identity(0, 1),
        builder.column('PositionId', scripter.raw('INT')).notNull(),
        builder.column('EmployeeId', scripter.raw('INT')).notNull(),
        builder
          .primaryKey('PK_EmployeePosition_id')
          .on({ id: 'ASC' })
          .withNoclustered(),
        builder
          .foreignKey('EmployeePosition_PositionId_Position_[object Object]')
          .on('PositionId')
          .reference('Position', ['id']),
        builder
          .foreignKey('EmployeePosition_EmployeeId_Employee_[object Object]')
          .on('EmployeeId')
          .reference('Employee', ['id']),
      ]);
  }
}

export default A;
