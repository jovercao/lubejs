import { Migrate, SqlBuilder as SQL, DbType, MigrateBuilder } from 'lubejs';

export class Migrate20210726174130 implements Migrate {

  async up(
    builder: MigrateBuilder,
    dialect: string
  ): Promise<void> {
    builder.createDatabase("Test");
    builder.use("Test");
    builder.createTable({"name":"User"}).as(builder => [
      builder.column("id", SQL.raw('BIGINT')).notNull().identity(0, 1).notNull(),
      builder.column("name", SQL.raw('VARCHAR(MAX)')).notNull().notNull(),
      builder.column("password", SQL.raw('VARCHAR(MAX)')).notNull().notNull(),
      builder.column("description", SQL.raw('VARCHAR(MAX)')).notNull().notNull(),
      builder.primaryKey("PK_User_id").on({ "id": 'ASC' })
    ]);
    builder.setTableComment({"name":"User"}, "用户");
    builder.setColumnComment({"name":"User"}, "name", "用户名");
    builder.setColumnComment({"name":"User"}, "password", "密码");
    builder.setColumnComment({"name":"User"}, "description", "摘要说明");
    builder.createTable({"name":"Order"}).as(builder => [
      builder.column("id", SQL.raw('BIGINT')).notNull().notNull(),
      builder.column("date", SQL.raw('DATETIME')).notNull().notNull(),
      builder.column("orderNo", SQL.raw('VARCHAR(MAX)')).notNull().notNull(),
      builder.column("description", SQL.raw('VARCHAR(MAX)')).notNull().notNull(),
      builder.column("rowflag", SQL.raw('NVARCHAR(MAX)')).notNull().notNull(),
      builder.primaryKey("PK_Order_id").on({ "id": 'ASC' })
    ]);
    builder.setTableComment({"name":"Order"}, "订单");
    builder.setColumnComment({"name":"Order"}, "id", "ID");
    builder.setColumnComment({"name":"Order"}, "date", "订单日期");
    builder.setColumnComment({"name":"Order"}, "orderNo", "订单号");
    builder.setColumnComment({"name":"Order"}, "description", "摘要说明");
    builder.setColumnComment({"name":"Order"}, "rowflag", "行标识");
    builder.createTable({"name":"OrderDetail"}).as(builder => [
      builder.column("id", SQL.raw('BIGINT')).notNull().notNull(),
      builder.column("product", SQL.raw('VARCHAR(MAX)')).notNull().notNull(),
      builder.column("count", SQL.raw('INT')).notNull().notNull(),
      builder.column("price", SQL.raw('DECIMAL(18,6)')).notNull().notNull(),
      builder.column("amount", SQL.raw('DECIMAL(18,6)')).notNull().notNull(),
      builder.column("description", SQL.raw('VARCHAR(MAX)')).notNull().notNull(),
      builder.column("orderId", SQL.raw('BIGINT')).notNull().notNull(),
      builder.primaryKey("PK_OrderDetail_id").on({ "id": 'ASC' })
    ]);
    builder.setTableComment({"name":"OrderDetail"}, "订单明细");
    builder.setColumnComment({"name":"OrderDetail"}, "id", "ID");
    builder.setColumnComment({"name":"OrderDetail"}, "product", "产品名称");
    builder.setColumnComment({"name":"OrderDetail"}, "count", "数量");
    builder.setColumnComment({"name":"OrderDetail"}, "price", "单价");
    builder.setColumnComment({"name":"OrderDetail"}, "amount", "金额");
    builder.setColumnComment({"name":"OrderDetail"}, "description", "摘要说明");
    builder.setColumnComment({"name":"OrderDetail"}, "orderId", "订单Id");
    builder.createTable({"name":"Position"}).as(builder => [
      builder.column("id", SQL.raw('BIGINT')).notNull().notNull(),
      builder.column("name", SQL.raw('VARCHAR(MAX)')).notNull().notNull(),
      builder.column("description", SQL.raw('VARCHAR(MAX)')).notNull().notNull(),
      builder.primaryKey("PK_Position_id").on({ "id": 'ASC' })
    ]);
    builder.setTableComment({"name":"Position"}, "职位");
    builder.setColumnComment({"name":"Position"}, "id", "职位ID");
    builder.setColumnComment({"name":"Position"}, "name", "职位名称");
    builder.setColumnComment({"name":"Position"}, "description", "摘要说明");
    builder.createTable({"name":"Employee"}).as(builder => [
      builder.column("id", SQL.raw('BIGINT')).notNull().notNull(),
      builder.column("name", SQL.raw('VARCHAR(MAX)')).notNull().notNull(),
      builder.column("description", SQL.raw('VARCHAR(MAX)')).notNull().notNull(),
      builder.primaryKey("PK_Employee_id").on({ "id": 'ASC' })
    ]);
    builder.setTableComment({"name":"Employee"}, "职员");
    builder.setColumnComment({"name":"Employee"}, "id", "职员ID");
    builder.setColumnComment({"name":"Employee"}, "name", "姓名");
    builder.setColumnComment({"name":"Employee"}, "description", "摘要说明");
    builder.createTable({"name":"EmployeePosition"}).as(builder => [
      builder.column("id", SQL.raw('BIGINT')).notNull().notNull(),
      builder.column("positionId", SQL.raw('INT')).notNull().notNull(),
      builder.column("employeeId", SQL.raw('INT')).notNull().notNull(),
      builder.primaryKey("PK_EmployeePosition_id").on({ "id": 'ASC' })
    ]);
    builder.setColumnComment({"name":"EmployeePosition"}, "id", "ID");
    builder.setColumnComment({"name":"EmployeePosition"}, "positionId", "职位ID");
    builder.setColumnComment({"name":"EmployeePosition"}, "employeeId", "职员ID");
    builder.createTable({"name":"Organization"}).as(builder => [
      builder.column("id", SQL.raw('BIGINT')).notNull().notNull(),
      builder.column("name", SQL.raw('VARCHAR(MAX)')).notNull().notNull(),
      builder.column("description", SQL.raw('VARCHAR(MAX)')).notNull().notNull(),
      builder.column("parentId", SQL.raw('BIGINT')).notNull().notNull(),
      builder.primaryKey("PK_Organization_id").on({ "id": 'ASC' })
    ]);
    builder.setTableComment({"name":"Organization"}, "机构");
    builder.setColumnComment({"name":"Organization"}, "id", "机构ID");
    builder.setColumnComment({"name":"Organization"}, "name", "机构名称");
    builder.setColumnComment({"name":"Organization"}, "description", "摘要说明");
    builder.setColumnComment({"name":"Organization"}, "parentId", "父级机构ID")
  }

  async down(
    builder: MigrateBuilder,
    dialect: string
  ): Promise<void> {
    builder.dropDatabase("Test")
  }

}

export default Migrate20210726174130;
  