import { Migrate, SqlBuilder as SQL, DbType, MigrateBuilder } from 'lubejs';

export class Init implements Migrate {

  async up(
    builder: MigrateBuilder,
    dialect: string
  ): Promise<void> {
    builder.createDatabase("Test");
    builder.use("Test");
    builder.createTable({"name":"User","schema":"dbo"}).as(builder => [
      builder.column("id", SQL.raw('BIGINT')).notNull().identity(0, 1),
      builder.column("name", SQL.raw('VARCHAR(MAX)')).notNull(),
      builder.column("password", SQL.raw('VARCHAR(MAX)')).null(),
      builder.column("description", SQL.raw('VARCHAR(MAX)')).null(),
      builder.primaryKey("PK_User_id").on({ "id": 'ASC' })
    ]);
    builder.setTableComment({"name":"User","schema":"dbo"}, "用户");
    builder.setColumnComment({"name":"User","schema":"dbo"}, "id", "ID");
    builder.setColumnComment({"name":"User","schema":"dbo"}, "name", "用户名");
    builder.setColumnComment({"name":"User","schema":"dbo"}, "password", "密码");
    builder.setColumnComment({"name":"User","schema":"dbo"}, "description", "摘要说明");
    builder.createTable({"name":"Order","schema":"dbo"}).as(builder => [
      builder.column("id", SQL.raw('BIGINT')).notNull().identity(0, 1),
      builder.column("date", SQL.raw('DATETIME')).notNull(),
      builder.column("orderNo", SQL.raw('VARCHAR(MAX)')).notNull(),
      builder.column("description", SQL.raw('VARCHAR(MAX)')).null(),
      builder.column("rowflag", SQL.raw('BINARY(8)')).notNull(),
      builder.primaryKey("PK_Order_id").on({ "id": 'ASC' })
    ]);
    builder.setTableComment({"name":"Order","schema":"dbo"}, "订单");
    builder.setColumnComment({"name":"Order","schema":"dbo"}, "id", "ID");
    builder.setColumnComment({"name":"Order","schema":"dbo"}, "date", "订单日期");
    builder.setColumnComment({"name":"Order","schema":"dbo"}, "orderNo", "订单号");
    builder.setColumnComment({"name":"Order","schema":"dbo"}, "description", "摘要说明");
    builder.setAutoRowflag({"name":"Order","schema":"dbo"}, "rowflag");
    builder.setColumnComment({"name":"Order","schema":"dbo"}, "rowflag", "行标识");
    builder.createTable({"name":"OrderDetail","schema":"dbo"}).as(builder => [
      builder.column("id", SQL.raw('BIGINT')).notNull().identity(0, 1),
      builder.column("product", SQL.raw('VARCHAR(MAX)')).notNull(),
      builder.column("count", SQL.raw('INT')).notNull(),
      builder.column("price", SQL.raw('DECIMAL(18,6)')).notNull(),
      builder.column("amount", SQL.raw('DECIMAL(18,2)')).notNull(),
      builder.column("description", SQL.raw('VARCHAR(MAX)')).null(),
      builder.column("orderId", SQL.raw('BIGINT')).notNull(),
      builder.primaryKey("PK_OrderDetail_id").on({ "id": 'ASC' })
    ]);
    builder.setTableComment({"name":"OrderDetail","schema":"dbo"}, "订单明细");
    builder.setColumnComment({"name":"OrderDetail","schema":"dbo"}, "id", "ID");
    builder.setColumnComment({"name":"OrderDetail","schema":"dbo"}, "product", "产品名称");
    builder.setColumnComment({"name":"OrderDetail","schema":"dbo"}, "count", "数量");
    builder.setColumnComment({"name":"OrderDetail","schema":"dbo"}, "price", "单价");
    builder.setColumnComment({"name":"OrderDetail","schema":"dbo"}, "amount", "金额");
    builder.setColumnComment({"name":"OrderDetail","schema":"dbo"}, "description", "摘要说明");
    builder.setColumnComment({"name":"OrderDetail","schema":"dbo"}, "orderId", "订单Id");
    builder.createTable({"name":"Position","schema":"dbo"}).as(builder => [
      builder.column("id", SQL.raw('BIGINT')).notNull().identity(0, 1),
      builder.column("name", SQL.raw('VARCHAR(MAX)')).notNull(),
      builder.column("description", SQL.raw('VARCHAR(MAX)')).null(),
      builder.primaryKey("PK_Position_id").on({ "id": 'ASC' })
    ]);
    builder.setTableComment({"name":"Position","schema":"dbo"}, "职位");
    builder.setColumnComment({"name":"Position","schema":"dbo"}, "id", "职位ID");
    builder.setColumnComment({"name":"Position","schema":"dbo"}, "name", "职位名称");
    builder.setColumnComment({"name":"Position","schema":"dbo"}, "description", "摘要说明");
    builder.createTable({"name":"Employee","schema":"dbo"}).as(builder => [
      builder.column("id", SQL.raw('BIGINT')).notNull().identity(0, 1),
      builder.column("name", SQL.raw('VARCHAR(MAX)')).notNull(),
      builder.column("description", SQL.raw('VARCHAR(MAX)')).null(),
      builder.primaryKey("PK_Employee_id").on({ "id": 'ASC' })
    ]);
    builder.setTableComment({"name":"Employee","schema":"dbo"}, "职员");
    builder.setColumnComment({"name":"Employee","schema":"dbo"}, "id", "职员ID");
    builder.setColumnComment({"name":"Employee","schema":"dbo"}, "name", "姓名");
    builder.setColumnComment({"name":"Employee","schema":"dbo"}, "description", "摘要说明");
    builder.createTable({"name":"EmployeePosition","schema":"dbo"}).as(builder => [
      builder.column("id", SQL.raw('BIGINT')).notNull().identity(0, 1),
      builder.column("positionId", SQL.raw('INT')).notNull(),
      builder.column("employeeId", SQL.raw('INT')).notNull(),
      builder.primaryKey("PK_EmployeePosition_id").on({ "id": 'ASC' })
    ]);
    builder.setColumnComment({"name":"EmployeePosition","schema":"dbo"}, "id", "ID");
    builder.setColumnComment({"name":"EmployeePosition","schema":"dbo"}, "positionId", "职位ID");
    builder.setColumnComment({"name":"EmployeePosition","schema":"dbo"}, "employeeId", "职员ID");
    builder.createTable({"name":"Organization","schema":"dbo"}).as(builder => [
      builder.column("id", SQL.raw('BIGINT')).notNull().identity(0, 1),
      builder.column("name", SQL.raw('VARCHAR(MAX)')).notNull(),
      builder.column("description", SQL.raw('VARCHAR(MAX)')).null(),
      builder.column("parentId", SQL.raw('BIGINT')).notNull(),
      builder.primaryKey("PK_Organization_id").on({ "id": 'ASC' })
    ]);
    builder.setTableComment({"name":"Organization","schema":"dbo"}, "机构");
    builder.setColumnComment({"name":"Organization","schema":"dbo"}, "id", "机构ID");
    builder.setColumnComment({"name":"Organization","schema":"dbo"}, "name", "机构名称");
    builder.setColumnComment({"name":"Organization","schema":"dbo"}, "description", "摘要说明");
    builder.setColumnComment({"name":"Organization","schema":"dbo"}, "parentId", "父级机构ID");
  }

  async down(
    builder: MigrateBuilder,
    dialect: string
  ): Promise<void> {
    builder.dropDatabase("Test");
  }

}

export default Init;
  