import { Migrate, SqlBuilder as SQL, DbType, MigrateBuilder } from 'lubejs';

export class Test20210628 implements Migrate {

  async up(
    builder: MigrateBuilder,
    dialect: string | symbol
  ): Promise<void> {
    builder.alterTable('OrderDetail').drop(({ foreignKey }) => foreignKey('FK_OrderDetail_orderId_Order_id'));
    builder.alterTable('EmployeePosition').drop(({ foreignKey }) => foreignKey('FK_EmployeePosition_PositionId_Position_id'));
    builder.alterTable('EmployeePosition').drop(({ foreignKey }) => foreignKey('FK_EmployeePosition_EmployeeId_Employee_id'));
    builder.createTable('User').as(builder => [
      builder.column('id', DbType.int32).notNull().identity(0, 1),
      builder.column('name', DbType.string(DbType.MAX)).notNull(),
      builder.column('password', DbType.string(DbType.MAX)).null(),
      builder.column('description', DbType.string(DbType.MAX)).null(),
      builder.primaryKey('PK_User_id').on({ 'id': 'ASC' })
    ]);
    builder.createTable('Organization').as(builder => [
      builder.column('id', DbType.int32).notNull().identity(0, 1),
      builder.column('name', DbType.string(DbType.MAX)).notNull(),
      builder.column('description', DbType.string(DbType.MAX)).null(),
      builder.column('parentId', DbType.int32).notNull(),
      builder.primaryKey('PK_Organization_id').on({ 'id': 'ASC' })
    ]);
    builder.setDefaultValue('Order', 'date', "sysDateTimeOffset()");
    builder.alterTable('Employee').add(builder => builder.column('organizationId', DbType.int32).notNull());
    builder.alterTable('Employee').add(builder => builder.column('userId', DbType.int32).notNull());
    builder.alterTable('EmployeePosition').drop(builder => builder.column('PositionId'));
    builder.alterTable('EmployeePosition').alterColumn(column => column('id', DbType.int32).notNull());
    builder.commentColumn('EmployeePosition', 'Auto generic key column.', 'id');
    builder.alterTable('Organization').add(builder => builder.foreignKey('FK_Organization_parentId_Organization_id').on('parentId').reference('Organization', ['id']));
    builder.alterTable('OrderDetail').add(builder => builder.foreignKey('FK_OrderDetail_orderId_Order_id').on('orderId').reference('Order', ['id']));
    builder.alterTable('Employee').add(builder => builder.foreignKey('FK_Employee_organizationId_Organization_id').on('organizationId').reference('Organization', ['id']));
    builder.alterTable('Employee').add(builder => builder.foreignKey('FK_Employee_userId_User_id').on('userId').reference('User', ['id']));
    builder.alterTable('EmployeePosition').add(builder => builder.foreignKey('FK_EmployeePosition_EmployeeId_Employee_id').on('EmployeeId').reference('Employee', ['id']));
    builder.insert('User').values([{"id":0,"name":"admin"}]).withIdentity();
    builder.insert('Organization').values([{"id":0,"name":"公司","description":"没啥"},{"id":1,"name":"信息部","parentId":0},{"id":2,"name":"行政部","parentId":0}]).withIdentity()
  }

  async down(
    builder: MigrateBuilder,
    dialect: string | symbol
  ): Promise<void> {
    builder.alterTable('Organization').drop(({ foreignKey }) => foreignKey('FK_Organization_parentId_Organization_id'));
    builder.alterTable('Employee').drop(({ foreignKey }) => foreignKey('FK_Employee_organizationId_Organization_id'));
    builder.alterTable('Employee').drop(({ foreignKey }) => foreignKey('FK_Employee_userId_User_id'));
    builder.alterTable('EmployeePosition').drop(({ foreignKey }) => foreignKey('FK_EmployeePosition_EmployeeId_Employee_id'));
    builder.alterTable('OrderDetail').drop(({ foreignKey }) => foreignKey('FK_OrderDetail_orderId_Order_id'));
    builder.alterTable('EmployeePosition').drop(({ foreignKey }) => foreignKey('FK_EmployeePosition_EmployeeId_Employee_id'));
    builder.dropTable("User");
    builder.dropTable("Organization");
    builder.alterTable('Employee').drop(builder => builder.column('organizationId'));
    builder.alterTable('Employee').drop(builder => builder.column('userId'));
    builder.alterTable('EmployeePosition').add(builder => builder.column('PositionId', DbType.int32).notNull());
    builder.alterTable('EmployeePosition').alterColumn(column => column('id', DbType.int64).notNull());
    builder.commentColumn('EmployeePosition', 'id');
    builder.dropDefaultValue('Order', 'date');
    builder.alterTable('EmployeePosition').add(builder => builder.column('PositionId', DbType.int32).notNull());
    builder.alterTable('EmployeePosition').alterColumn(column => column('id', DbType.int64).notNull());
    builder.commentColumn('EmployeePosition', 'id');
    builder.alterTable('EmployeePosition').add(builder => builder.foreignKey('FK_EmployeePosition_PositionId_Position_id').on('PositionId').reference('Position', ['id']));
    builder.alterTable('EmployeePosition').add(builder => builder.foreignKey('FK_EmployeePosition_EmployeeId_Employee_id').on('EmployeeId').reference('Employee', ['id']));
    builder.alterTable('OrderDetail').add(builder => builder.foreignKey('FK_OrderDetail_orderId_Order_id').on('orderId').reference('Order', ['id']));
    builder.alterTable('EmployeePosition').add(builder => builder.foreignKey('FK_EmployeePosition_PositionId_Position_id').on('PositionId').reference('Position', ['id']));
    builder.alterTable('EmployeePosition').add(builder => builder.foreignKey('FK_EmployeePosition_EmployeeId_Employee_id').on('EmployeeId').reference('Employee', ['id']))
  }

}

export default Test20210628;
  