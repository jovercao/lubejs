import { Migrate, Statement, SqlBuilder as SQL, DbType, MigrateBuilder } from '../../src';

export class Init implements Migrate {

  async up(
    builder: MigrateBuilder,
    dialect: string | symbol
  ): Promise<void> {
    builder.createTable('Order').as(builder => [
      builder.column('id', DbType.int32).notNull().identity(0, 1),
      builder.column('orderNo', DbType.string(DbType.MAX)).notNull(),
      builder.column('date', DbType.datetime).notNull().default("sysDateTimeOffset()"),
      builder.column('description', DbType.string(DbType.MAX)).null(),
      builder.primaryKey('PK_Order_id').on({ 'id': 'ASC' })
    ]);
    builder.createTable('OrderDetail').as(builder => [
      builder.column('id', DbType.int32).notNull().identity(0, 1),
      builder.column('product', DbType.string(DbType.MAX)).notNull(),
      builder.column('count', DbType.int32).notNull(),
      builder.column('price', DbType.numeric(18, 6)).notNull(),
      builder.column('amount', DbType.numeric(18, 2)).notNull(),
      builder.column('orderId', DbType.int32).notNull(),
      builder.primaryKey('PK_OrderDetail_id').on({ 'id': 'ASC' })
    ]);
    builder.createTable('Position').as(builder => [
      builder.column('id', DbType.int32).notNull().identity(0, 1),
      builder.column('name', DbType.string(DbType.MAX)).notNull(),
      builder.column('description', DbType.string(DbType.MAX)).null(),
      builder.primaryKey('PK_Position_id').on({ 'id': 'ASC' })
    ]);
    builder.createTable('Employee').as(builder => [
      builder.column('id', DbType.int32).notNull().identity(0, 1),
      builder.column('name', DbType.string(100)).null(),
      builder.primaryKey('PK_Employee_id').on({ 'id': 'ASC' })
    ]);
    builder.createTable('EmployeePosition').as(builder => [
      builder.column('id', DbType.int32).notNull().identity(0, 1),
      builder.column('PositionId', DbType.int32).notNull(),
      builder.column('EmployeeId', DbType.int32).notNull(),
      builder.primaryKey('PK_EmployeePosition_id').on({ 'id': 'ASC' })
    ]);
    builder.alterTable('OrderDetail').add(builder => builder.foreignKey('FK_OrderDetail_orderId_Order_id').on('orderId').reference('Order', ['id']));
    builder.alterTable('EmployeePosition').add(builder => builder.foreignKey('FK_EmployeePosition_PositionId_Position_id').on('PositionId').reference('Position', ['id']));
    builder.alterTable('EmployeePosition').add(builder => builder.foreignKey('FK_EmployeePosition_EmployeeId_Employee_id').on('EmployeeId').reference('Employee', ['id']));
    builder.insert('Position').values([{"id":1,"name":"总经理","description":"无"},{"id":2,"name":"总监","description":"无"},{"id":3,"name":"普通职员","description":"无"}]).withIdentity()
  }

  async down(
    builder: MigrateBuilder,
    dialect: string | symbol
  ): Promise<void> {
    builder.alterTable('OrderDetail').drop(({ foreignKey }) => foreignKey('FK_OrderDetail_orderId_Order_id'));
    builder.alterTable('EmployeePosition').drop(({ foreignKey }) => foreignKey('FK_EmployeePosition_PositionId_Position_id'));
    builder.alterTable('EmployeePosition').drop(({ foreignKey }) => foreignKey('FK_EmployeePosition_EmployeeId_Employee_id'));
    builder.dropTable("Order");
    builder.dropTable("OrderDetail");
    builder.dropTable("Position");
    builder.dropTable("Employee");
    builder.dropTable("EmployeePosition")
  }

}

export default Init;
  