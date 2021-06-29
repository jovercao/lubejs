import { Migrate, SqlBuilder as SQL, DbType, MigrateBuilder } from 'lubejs';

export class Init implements Migrate {

  async up(
    builder: MigrateBuilder,
    dialect: string | symbol
  ): Promise<void> {
    builder.createTable('User').as(builder => [
      builder.column('id', DbType.int32).notNull().identity(0, 1),
      builder.column('name', DbType.string(DbType.MAX)).notNull(),
      builder.column('password', DbType.string(DbType.MAX)).null(),
      builder.column('description', DbType.string(DbType.MAX)).null(),
      builder.primaryKey('PK_User_id').on({ 'id': 'ASC' })
    ]);
    builder.createTable('Employee').as(builder => [
      builder.column('id', DbType.int32).notNull().identity(0, 1),
      builder.column('name', DbType.string(100)).null(),
      builder.column('organizationId', DbType.int32).null(),
      builder.column('userId', DbType.int32).notNull(),
      builder.primaryKey('PK_Employee_id').on({ 'id': 'ASC' })
    ]);
    builder.createTable('Position').as(builder => [
      builder.column('id', DbType.int32).notNull().identity(0, 1),
      builder.column('name', DbType.string(DbType.MAX)).notNull(),
      builder.column('description', DbType.string(DbType.MAX)).null(),
      builder.primaryKey('PK_Position_id').on({ 'id': 'ASC' })
    ]);
    builder.createTable('EmployeePosition').as(builder => [
      builder.column('id', DbType.int64).notNull().identity(0, 1),
      builder.column('EmployeeId', DbType.int32).notNull(),
      builder.column('PositionId', DbType.int32).notNull(),
      builder.primaryKey('PK_EmployeePosition_id').on({ 'id': 'ASC' })
    ]);
    builder.commentColumn('EmployeePosition', 'id', 'Auto generic key column.');
    builder.createTable('Organization').as(builder => [
      builder.column('id', DbType.int32).notNull().identity(0, 1),
      builder.column('name', DbType.string(DbType.MAX)).notNull(),
      builder.column('description', DbType.string(DbType.MAX)).null(),
      builder.column('parentId', DbType.int32).null(),
      builder.primaryKey('PK_Organization_id').on({ 'id': 'ASC' })
    ]);
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
      builder.column('orderId', DbType.int32).null(),
      builder.primaryKey('PK_OrderDetail_id').on({ 'id': 'ASC' })
    ]);
    builder.alterTable('Employee').add(builder => builder.foreignKey('FK_Employee_organizationId_Organization_id').on('organizationId').reference('Organization', ['id']));
    builder.alterTable('Employee').add(builder => builder.foreignKey('FK_Employee_userId_User_id').on('userId').reference('User', ['id']));
    builder.alterTable('EmployeePosition').add(builder => builder.foreignKey('FK_EmployeePosition_EmployeeId_Employee_id').on('EmployeeId').reference('Employee', ['id']));
    builder.alterTable('EmployeePosition').add(builder => builder.foreignKey('FK_EmployeePosition_PositionId_Position_id').on('PositionId').reference('Position', ['id']));
    builder.alterTable('Organization').add(builder => builder.foreignKey('FK_Organization_parentId_Organization_id').on('parentId').reference('Organization', ['id']));
    builder.alterTable('OrderDetail').add(builder => builder.foreignKey('FK_OrderDetail_orderId_Order_id').on('orderId').reference('Order', ['id']));
    builder.insert('User').values([{"id":0,"name":"admin"}]).withIdentity();
    builder.insert('Employee').values([{"id":0,"name":"管理员职员","userId":0}]).withIdentity();
    builder.insert('Position').values([{"id":1,"name":"总经理","description":"无"},{"id":2,"name":"总监","description":"无"},{"id":3,"name":"普通职员","description":"无"}]).withIdentity();
    builder.insert('Organization').values([{"id":0,"name":"公司","description":"没啥"},{"id":1,"name":"信息部","parentId":0},{"id":2,"name":"行政部","parentId":0}]).withIdentity()
  }

  async down(
    builder: MigrateBuilder,
    dialect: string | symbol
  ): Promise<void> {
    builder.alterTable('Employee').drop(({ foreignKey }) => foreignKey('FK_Employee_organizationId_Organization_id'));
    builder.alterTable('Employee').drop(({ foreignKey }) => foreignKey('FK_Employee_userId_User_id'));
    builder.alterTable('EmployeePosition').drop(({ foreignKey }) => foreignKey('FK_EmployeePosition_EmployeeId_Employee_id'));
    builder.alterTable('EmployeePosition').drop(({ foreignKey }) => foreignKey('FK_EmployeePosition_PositionId_Position_id'));
    builder.alterTable('Organization').drop(({ foreignKey }) => foreignKey('FK_Organization_parentId_Organization_id'));
    builder.alterTable('OrderDetail').drop(({ foreignKey }) => foreignKey('FK_OrderDetail_orderId_Order_id'));
    builder.dropTable("User");
    builder.dropTable("Employee");
    builder.dropTable("Position");
    builder.dropTable("EmployeePosition");
    builder.dropTable("Organization");
    builder.dropTable("Order");
    builder.dropTable("OrderDetail")
  }

}

export default Init;
  