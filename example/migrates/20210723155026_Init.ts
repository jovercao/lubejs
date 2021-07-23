import { Migrate, SqlBuilder as SQL, DbType, MigrateBuilder } from 'lubejs';

export class Init implements Migrate {

  async up(
    builder: MigrateBuilder,
    dialect: string | symbol
  ): Promise<void> {
    builder.createTable('User').as(builder => [
      builder.column('id', DbType.int64).notNull().identity(0, 1),
      builder.column('name', DbType.string(DbType.MAX)).notNull(),
      builder.column('password', DbType.string(DbType.MAX)).null(),
      builder.column('description', DbType.string(DbType.MAX)).null(),
      builder.primaryKey('PK_User_id').on({ 'id': 'ASC' })
    ]);
    builder.createTable('Order').as(builder => [
      builder.column('id', DbType.int64).notNull().identity(0, 1),
      builder.column('date', DbType.datetime).notNull(),
      builder.column('orderNo', DbType.string(DbType.MAX)).notNull(),
      builder.column('description', DbType.string(DbType.MAX)).null(),
      builder.column('rowflag', DbType.binary(8)).notNull(),
      builder.primaryKey('PK_Order_id').on({ 'id': 'ASC' })
    ]);
    builder.setAutoRowflag('Order', 'rowflag');
    builder.createTable('OrderDetail').as(builder => [
      builder.column('id', DbType.int64).notNull().identity(0, 1),
      builder.column('product', DbType.string(DbType.MAX)).notNull(),
      builder.column('count', DbType.int32).notNull(),
      builder.column('price', DbType.decimal(18, 6)).notNull(),
      builder.column('amount', DbType.decimal(18, 2)).notNull(),
      builder.column('description', DbType.string(DbType.MAX)).null(),
      builder.column('orderId', DbType.int64).notNull(),
      builder.primaryKey('PK_OrderDetail_id').on({ 'id': 'ASC' })
    ]);
    builder.createTable('Position').as(builder => [
      builder.column('id', DbType.int64).notNull().identity(0, 1),
      builder.column('name', DbType.string(DbType.MAX)).notNull(),
      builder.column('description', DbType.string(DbType.MAX)).null(),
      builder.primaryKey('PK_Position_id').on({ 'id': 'ASC' })
    ]);
    builder.createTable('Employee').as(builder => [
      builder.column('id', DbType.int64).notNull().identity(0, 1),
      builder.column('name', DbType.string(DbType.MAX)).notNull(),
      builder.column('description', DbType.string(DbType.MAX)).null(),
      builder.primaryKey('PK_Employee_id').on({ 'id': 'ASC' })
    ]);
    builder.createTable('EmployeePosition').as(builder => [
      builder.column('id', DbType.int64).notNull().identity(0, 1),
      builder.column('positionId', DbType.int32).notNull(),
      builder.primaryKey('PK_EmployeePosition_id').on({ 'id': 'ASC' })
    ]);
    builder.createTable('Organization').as(builder => [
      builder.column('id', DbType.int64).notNull().identity(0, 1),
      builder.column('name', DbType.string(DbType.MAX)).notNull(),
      builder.column('description', DbType.string(DbType.MAX)).null(),
      builder.column('parentId', DbType.int64).notNull(),
      builder.primaryKey('PK_Organization_id').on({ 'id': 'ASC' })
    ])
  }

  async down(
    builder: MigrateBuilder,
    dialect: string | symbol
  ): Promise<void> {
    builder.dropTable("User");
    builder.dropTable("Order");
    builder.dropTable("OrderDetail");
    builder.dropTable("Position");
    builder.dropTable("Employee");
    builder.dropTable("EmployeePosition");
    builder.dropTable("Organization")
  }

}

export default Init;
  