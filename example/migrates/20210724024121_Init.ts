import { Migrate, SqlBuilder as SQL, DbType, MigrateBuilder } from 'lubejs';

export class Init implements Migrate {

  async up(
    builder: MigrateBuilder,
    dialect: string
  ): Promise<void> {
    builder.createDatabase('DB');
    builder.use('DB');
    builder.createTable('User').as(builder => [
      builder.column('id', SQL.raw('BIGINT')).notNull().identity(0, 1).notNull(),
      builder.column('name', SQL.raw('VARCHAR(MAX)')).notNull().notNull(),
      builder.column('password', SQL.raw('VARCHAR(MAX)')).notNull().notNull(),
      builder.column('description', SQL.raw('VARCHAR(MAX)')).notNull().notNull(),
      builder.primaryKey('PK_User_id').on({ 'id': 'ASC' })
    ]);
    builder.setTableComment('User', '用户');
    builder.setColumnComment('User', 'name', '用户名');
    builder.setColumnComment('User', 'password', '密码');
    builder.setColumnComment('User', 'description', '摘要说明');
    builder.createTable('Order').as(builder => [
      builder.column('id', SQL.raw('BIGINT')).notNull().notNull(),
      builder.column('date', SQL.raw('DATETIME')).notNull().notNull(),
      builder.column('orderNo', SQL.raw('VARCHAR(MAX)')).notNull().notNull(),
      builder.column('description', SQL.raw('VARCHAR(MAX)')).notNull().notNull(),
      builder.column('rowflag', SQL.raw('NVARCHAR(MAX)')).notNull().notNull(),
      builder.primaryKey('PK_Order_id').on({ 'id': 'ASC' })
    ]);
    builder.setTableComment('Order', '订单');
    builder.setColumnComment('Order', 'id', 'ID');
    builder.setColumnComment('Order', 'date', '订单日期');
    builder.setColumnComment('Order', 'orderNo', '订单号');
    builder.setColumnComment('Order', 'description', '摘要说明');
    builder.setColumnComment('Order', 'rowflag', '行标识');
    builder.createTable('OrderDetail').as(builder => [
      builder.column('id', SQL.raw('BIGINT')).notNull().notNull(),
      builder.column('product', SQL.raw('VARCHAR(MAX)')).notNull().notNull(),
      builder.column('count', SQL.raw('INT')).notNull().notNull(),
      builder.column('price', SQL.raw('DECIMAL(18,6)')).notNull().notNull(),
      builder.column('amount', SQL.raw('DECIMAL(18,6)')).notNull().notNull(),
      builder.column('description', SQL.raw('VARCHAR(MAX)')).notNull().notNull(),
      builder.column('orderId', SQL.raw('BIGINT')).notNull().notNull(),
      builder.primaryKey('PK_OrderDetail_id').on({ 'id': 'ASC' })
    ]);
    builder.setTableComment('OrderDetail', '订单明细');
    builder.setColumnComment('OrderDetail', 'id', 'ID');
    builder.setColumnComment('OrderDetail', 'product', '产品名称');
    builder.setColumnComment('OrderDetail', 'count', '数量');
    builder.setColumnComment('OrderDetail', 'price', '单价');
    builder.setColumnComment('OrderDetail', 'amount', '金额');
    builder.setColumnComment('OrderDetail', 'description', '摘要说明');
    builder.setColumnComment('OrderDetail', 'orderId', '订单Id');
    builder.createTable('Position').as(builder => [
      builder.column('id', SQL.raw('BIGINT')).notNull().notNull(),
      builder.column('name', SQL.raw('VARCHAR(MAX)')).notNull().notNull(),
      builder.column('description', SQL.raw('VARCHAR(MAX)')).notNull().notNull(),
      builder.primaryKey('PK_Position_id').on({ 'id': 'ASC' })
    ]);
    builder.setTableComment('Position', '职位');
    builder.setColumnComment('Position', 'id', '职位ID');
    builder.setColumnComment('Position', 'name', '职位名称');
    builder.setColumnComment('Position', 'description', '摘要说明');
    builder.createTable('Employee').as(builder => [
      builder.column('id', SQL.raw('BIGINT')).notNull().notNull(),
      builder.column('name', SQL.raw('VARCHAR(MAX)')).notNull().notNull(),
      builder.column('description', SQL.raw('VARCHAR(MAX)')).notNull().notNull(),
      builder.primaryKey('PK_Employee_id').on({ 'id': 'ASC' })
    ]);
    builder.setTableComment('Employee', '职员');
    builder.setColumnComment('Employee', 'id', '职员ID');
    builder.setColumnComment('Employee', 'name', '姓名');
    builder.setColumnComment('Employee', 'description', '摘要说明');
    builder.createTable('EmployeePosition').as(builder => [
      builder.column('id', SQL.raw('BIGINT')).notNull().notNull(),
      builder.column('positionId', SQL.raw('INT')).notNull().notNull(),
      builder.column('employeeId', SQL.raw('INT')).notNull().notNull(),
      builder.primaryKey('PK_EmployeePosition_id').on({ 'id': 'ASC' })
    ]);
    builder.setColumnComment('EmployeePosition', 'id', 'ID');
    builder.setColumnComment('EmployeePosition', 'positionId', '职位ID');
    builder.setColumnComment('EmployeePosition', 'employeeId', '职员ID');
    builder.createTable('Organization').as(builder => [
      builder.column('id', SQL.raw('BIGINT')).notNull().notNull(),
      builder.column('name', SQL.raw('VARCHAR(MAX)')).notNull().notNull(),
      builder.column('description', SQL.raw('VARCHAR(MAX)')).notNull().notNull(),
      builder.column('parentId', SQL.raw('BIGINT')).notNull().notNull(),
      builder.primaryKey('PK_Organization_id').on({ 'id': 'ASC' })
    ]);
    builder.setTableComment('Organization', '机构');
    builder.setColumnComment('Organization', 'id', '机构ID');
    builder.setColumnComment('Organization', 'name', '机构名称');
    builder.setColumnComment('Organization', 'description', '摘要说明');
    builder.setColumnComment('Organization', 'parentId', '父级机构ID');
  }

  async down(
    builder: MigrateBuilder,
    dialect: string
  ): Promise<void> {
    builder.dropDatabase('DB')
  }

}

export default Init;
