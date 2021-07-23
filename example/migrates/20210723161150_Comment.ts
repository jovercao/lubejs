import { Migrate, SqlBuilder as SQL, DbType, MigrateBuilder } from 'lubejs';

export class Comment implements Migrate {

  async up(
    builder: MigrateBuilder,
    dialect: string | symbol
  ): Promise<void> {
    builder.setColumnComment('User', 'name', '用户名');
    builder.alterTable('User').alterColumn(column => column('password', DbType.string(DbType.MAX)).notNull());
    builder.setColumnComment('User', 'password', '密码');
    builder.alterTable('User').alterColumn(column => column('description', DbType.string(DbType.MAX)).notNull());
    builder.setColumnComment('User', 'description', '摘要说明');
    builder.setTableComment('User', '用户');
    // 敬告：因为需要重建表，在mssql中尚未实现该功能。;
    builder.dropIdentity('Order', 'id');
    builder.setColumnComment('Order', 'id', 'ID');
    builder.setColumnComment('Order', 'date', '订单日期');
    builder.setColumnComment('Order', 'orderNo', '订单号');
    builder.alterTable('Order').alterColumn(column => column('description', DbType.string(DbType.MAX)).notNull());
    builder.setColumnComment('Order', 'description', '摘要说明');
    builder.alterTable('Order').alterColumn(column => column('rowflag', DbType.string(DbType.MAX)).notNull());
    builder.dropAutoRowflag('Order', 'rowflag');
    builder.setColumnComment('Order', 'rowflag', '行标识');
    builder.setTableComment('Order', '订单');
    // 敬告：因为需要重建表，在mssql中尚未实现该功能。;
    builder.dropIdentity('OrderDetail', 'id');
    builder.setColumnComment('OrderDetail', 'id', 'ID');
    builder.setColumnComment('OrderDetail', 'product', '产品名称');
    builder.setColumnComment('OrderDetail', 'count', '数量');
    builder.setColumnComment('OrderDetail', 'price', '单价');
    builder.alterTable('OrderDetail').alterColumn(column => column('amount', DbType.decimal(18, 6)).notNull());
    builder.setColumnComment('OrderDetail', 'amount', '金额');
    builder.alterTable('OrderDetail').alterColumn(column => column('description', DbType.string(DbType.MAX)).notNull());
    builder.setColumnComment('OrderDetail', 'description', '摘要说明');
    builder.setColumnComment('OrderDetail', 'orderId', '订单Id');
    builder.setTableComment('OrderDetail', '订单明细');
    // 敬告：因为需要重建表，在mssql中尚未实现该功能。;
    builder.dropIdentity('Position', 'id');
    builder.setColumnComment('Position', 'id', '职位ID');
    builder.setColumnComment('Position', 'name', '职位名称');
    builder.alterTable('Position').alterColumn(column => column('description', DbType.string(DbType.MAX)).notNull());
    builder.setColumnComment('Position', 'description', '摘要说明');
    builder.setTableComment('Position', '职位');
    // 敬告：因为需要重建表，在mssql中尚未实现该功能。;
    builder.dropIdentity('Employee', 'id');
    builder.setColumnComment('Employee', 'id', '职员ID');
    builder.setColumnComment('Employee', 'name', '姓名');
    builder.alterTable('Employee').alterColumn(column => column('description', DbType.string(DbType.MAX)).notNull());
    builder.setColumnComment('Employee', 'description', '摘要说明');
    builder.setTableComment('Employee', '职员');
    builder.alterTable('EmployeePosition').add(builder => builder.column('employeeId', DbType.int32).notNull());
    builder.setColumnComment('EmployeePosition', 'employeeId', '职员ID');
    // 敬告：因为需要重建表，在mssql中尚未实现该功能。;
    builder.dropIdentity('EmployeePosition', 'id');
    builder.setColumnComment('EmployeePosition', 'id', 'ID');
    builder.setColumnComment('EmployeePosition', 'positionId', '职位ID');
    // 敬告：因为需要重建表，在mssql中尚未实现该功能。;
    builder.dropIdentity('Organization', 'id');
    builder.setColumnComment('Organization', 'id', '机构ID');
    builder.setColumnComment('Organization', 'name', '机构名称');
    builder.alterTable('Organization').alterColumn(column => column('description', DbType.string(DbType.MAX)).notNull());
    builder.setColumnComment('Organization', 'description', '摘要说明');
    builder.setColumnComment('Organization', 'parentId', '父级机构ID');
    builder.setTableComment('Organization', '机构')
  }

  async down(
    builder: MigrateBuilder,
    dialect: string | symbol
  ): Promise<void> {
    builder.dropColumnComment('User', 'name');
    builder.alterTable('User').alterColumn(column => column('password', DbType.string(DbType.MAX)).null());
    builder.dropColumnComment('User', 'password');
    builder.alterTable('User').alterColumn(column => column('description', DbType.string(DbType.MAX)).null());
    builder.dropColumnComment('User', 'description');
    builder.dropTableComment('User');
    // 敬告：因为需要重建表，在mssql中尚未实现该功能。;
    builder.setIdentity('Order', 'id', 0, 1);
    builder.dropColumnComment('Order', 'id');
    builder.dropColumnComment('Order', 'date');
    builder.dropColumnComment('Order', 'orderNo');
    builder.alterTable('Order').alterColumn(column => column('description', DbType.string(DbType.MAX)).null());
    builder.dropColumnComment('Order', 'description');
    builder.alterTable('Order').alterColumn(column => column('rowflag', DbType.binary(8)).notNull());
    builder.setAutoRowflag('Order', 'rowflag');
    builder.dropColumnComment('Order', 'rowflag');
    builder.dropTableComment('Order');
    builder.dropColumnComment('OrderDetail', 'product');
    builder.dropColumnComment('OrderDetail', 'count');
    builder.dropColumnComment('OrderDetail', 'price');
    builder.alterTable('OrderDetail').alterColumn(column => column('amount', DbType.decimal(18, 2)).notNull());
    builder.dropColumnComment('OrderDetail', 'amount');
    builder.alterTable('OrderDetail').alterColumn(column => column('description', DbType.string(DbType.MAX)).null());
    builder.dropColumnComment('OrderDetail', 'description');
    builder.dropColumnComment('OrderDetail', 'orderId');
    // 敬告：因为需要重建表，在mssql中尚未实现该功能。;
    builder.setIdentity('OrderDetail', 'id', 0, 1);
    builder.dropColumnComment('OrderDetail', 'id');
    builder.dropTableComment('OrderDetail');
    // 敬告：因为需要重建表，在mssql中尚未实现该功能。;
    builder.setIdentity('Position', 'id', 0, 1);
    builder.dropColumnComment('Position', 'id');
    builder.dropColumnComment('Position', 'name');
    builder.alterTable('Position').alterColumn(column => column('description', DbType.string(DbType.MAX)).null());
    builder.dropColumnComment('Position', 'description');
    builder.dropTableComment('Position');
    // 敬告：因为需要重建表，在mssql中尚未实现该功能。;
    builder.setIdentity('Employee', 'id', 0, 1);
    builder.dropColumnComment('Employee', 'id');
    builder.dropColumnComment('Employee', 'name');
    builder.alterTable('Employee').alterColumn(column => column('description', DbType.string(DbType.MAX)).null());
    builder.dropColumnComment('Employee', 'description');
    builder.dropTableComment('Employee');
    builder.alterTable('EmployeePosition').drop(builder => builder.column('employeeId'));
    // 敬告：因为需要重建表，在mssql中尚未实现该功能。;
    builder.setIdentity('EmployeePosition', 'id', 0, 1);
    builder.dropColumnComment('EmployeePosition', 'id');
    builder.dropColumnComment('EmployeePosition', 'positionId');
    // 敬告：因为需要重建表，在mssql中尚未实现该功能。;
    builder.setIdentity('Organization', 'id', 0, 1);
    builder.dropColumnComment('Organization', 'id');
    builder.dropColumnComment('Organization', 'name');
    builder.alterTable('Organization').alterColumn(column => column('description', DbType.string(DbType.MAX)).null());
    builder.dropColumnComment('Organization', 'description');
    builder.dropColumnComment('Organization', 'parentId');
    builder.dropTableComment('Organization')
  }

}

export default Comment;
  