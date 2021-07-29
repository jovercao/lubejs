import { Migrate, SqlBuilder as SQL, DbType, MigrateBuilder } from 'lubejs';

export class Init implements Migrate {

  async up(
    builder: MigrateBuilder,
    dialect: string
  ): Promise<void> {
    builder.createTable({"name":"User","schema":"dbo"}).as(builder => [
      builder.column("id", DbType.int64).notNull().identity(0, 1),
      builder.column("name", DbType.string(DbType.MAX)).notNull(),
      builder.column("password", DbType.string(DbType.MAX)).null(),
      builder.column("description", DbType.string(DbType.MAX)).null(),
      builder.primaryKey("PK_User_id").on({ "id": 'ASC' })
    ]);
    builder.setConstraintComment({"name":"User","schema":"dbo"}, "PK_User_id", "主键");
    builder.setColumnComment({"name":"User","schema":"dbo"}, "id", "ID");
    builder.setColumnComment({"name":"User","schema":"dbo"}, "name", "职员姓名");
    builder.setColumnComment({"name":"User","schema":"dbo"}, "password", "密码");
    builder.setColumnComment({"name":"User","schema":"dbo"}, "description", "摘要说明");
    builder.setTableComment({"name":"User","schema":"dbo"}, "职员");
    builder.createTable({"name":"Employee","schema":"dbo"}).as(builder => [
      builder.column("id", DbType.int64).notNull().identity(0, 1),
      builder.column("name", DbType.string(100)).null(),
      builder.column("description", DbType.string(100)).null(),
      builder.column("organizationId", DbType.int64).notNull(),
      builder.column("userId", DbType.int64).notNull(),
      builder.primaryKey("PK_Employee_id").on({ "id": 'ASC' })
    ]);
    builder.createIndex("IX_Employee_organizationId").on({"name":"Employee","schema":"dbo"}, { "organizationId": 'ASC' });
    builder.createIndex("UX_Employee_userId").on({"name":"Employee","schema":"dbo"}, { "userId": 'ASC' }).unique();
    builder.createTable({"name":"Position","schema":"dbo"}).as(builder => [
      builder.column("id", DbType.int64).notNull().identity(0, 1),
      builder.column("name", DbType.string(DbType.MAX)).notNull(),
      builder.column("description", DbType.string(DbType.MAX)).null(),
      builder.primaryKey("PK_Position_id").on({ "id": 'ASC' })
    ]);
    builder.setConstraintComment({"name":"Position","schema":"dbo"}, "PK_Position_id", "主键");
    builder.setColumnComment({"name":"Position","schema":"dbo"}, "id", "ID");
    builder.setColumnComment({"name":"Position","schema":"dbo"}, "name", "职位名称");
    builder.setColumnComment({"name":"Position","schema":"dbo"}, "description", "摘要说明");
    builder.setTableComment({"name":"Position","schema":"dbo"}, "职员");
    builder.createTable({"name":"EmployeePosition","schema":"dbo"}).as(builder => [
      builder.column("id", DbType.int64).notNull().identity(0, 1),
      builder.column("employeeId", DbType.int64).null(),
      builder.column("positionId", DbType.int64).null(),
      builder.primaryKey("PK_EmployeePosition_id").on({ "id": 'ASC' })
    ]);
    builder.setColumnComment({"name":"EmployeePosition","schema":"dbo"}, "id", "Auto generic key column.");
    builder.createIndex("IX_EmployeePosition_employeeId").on({"name":"EmployeePosition","schema":"dbo"}, { "employeeId": 'ASC' });
    builder.createIndex("IX_EmployeePosition_positionId").on({"name":"EmployeePosition","schema":"dbo"}, { "positionId": 'ASC' });
    builder.createTable({"name":"Organization","schema":"dbo"}).as(builder => [
      builder.column("id", DbType.int64).notNull().identity(0, 1),
      builder.column("name", DbType.string(DbType.MAX)).notNull(),
      builder.column("description", DbType.string(DbType.MAX)).null(),
      builder.column("parentId", DbType.int64).null(),
      builder.primaryKey("PK_Organization_id").on({ "id": 'ASC' })
    ]);
    builder.createIndex("IX_Organization_parentId").on({"name":"Organization","schema":"dbo"}, { "parentId": 'ASC' });
    builder.createTable({"name":"Order","schema":"dbo"}).as(builder => [
      builder.column("id", DbType.int64).notNull().identity(0, 1),
      builder.column("orderNo", DbType.string(DbType.MAX)).notNull(),
      builder.column("date", DbType.datetime).notNull().default(SQL.raw("sysDateTimeOffset()")),
      builder.column("description", DbType.string(DbType.MAX)).null(),
      builder.column("rowflag", DbType.binary(8)).notNull(),
      builder.primaryKey("PK_Order_id").on({ "id": 'ASC' })
    ]);
    builder.setAutoRowflag({"name":"Order","schema":"dbo"}, "rowflag");
    builder.createTable({"name":"OrderDetail","schema":"dbo"}).as(builder => [
      builder.column("id", DbType.int64).notNull().identity(0, 1),
      builder.column("product", DbType.string(DbType.MAX)).notNull(),
      builder.column("count", DbType.int32).notNull(),
      builder.column("price", DbType.decimal(18, 6)).notNull(),
      builder.column("amount", DbType.decimal(18, 2)).notNull(),
      builder.column("orderId", DbType.int64).notNull(),
      builder.column("description", DbType.string(DbType.MAX)).null(),
      builder.primaryKey("PK_OrderDetail_id").on({ "id": 'ASC' })
    ]);
    builder.createIndex("IX_OrderDetail_orderId").on({"name":"OrderDetail","schema":"dbo"}, { "orderId": 'ASC' });
    builder.alterTable({"name":"Employee","schema":"dbo"}).add(builder => builder.foreignKey("FK_Employee_organizationId_Organization_id").on("organizationId").reference("Organization", ["id"]));
    builder.alterTable({"name":"Employee","schema":"dbo"}).add(builder => builder.foreignKey("FK_Employee_userId_User_id").on("userId").reference("User", ["id"]));
    builder.alterTable({"name":"EmployeePosition","schema":"dbo"}).add(builder => builder.foreignKey("FK_EmployeePosition_employeeId_TO_Employee_id").on("employeeId").reference("Employee", ["id"]));
    builder.alterTable({"name":"EmployeePosition","schema":"dbo"}).add(builder => builder.foreignKey("FK_EmployeePosition_positionId_TO_Position_id").on("positionId").reference("Position", ["id"]));
    builder.alterTable({"name":"Organization","schema":"dbo"}).add(builder => builder.foreignKey("FK_Organization_parentId_Organization_id").on("parentId").reference("Organization", ["id"]));
    builder.alterTable({"name":"OrderDetail","schema":"dbo"}).add(builder => builder.foreignKey("FK_OrderDetail_orderId_Order_id").on("orderId").reference("Order", ["id"]));
    builder.insert({"name":"User","schema":"dbo"}).values([{"id":0,"name":"admin"}]).withIdentity();
    builder.insert({"name":"Organization","schema":"dbo"}).values([{"id":0,"name":"公司","description":"没啥"},{"id":1,"name":"信息部","parentId":0},{"id":2,"name":"行政部","parentId":0}]).withIdentity();
    builder.insert({"name":"Employee","schema":"dbo"}).values([{"id":0,"name":"管理员职员","organizationId":0,"userId":0}]).withIdentity();
    builder.insert({"name":"Position","schema":"dbo"}).values([{"id":1,"name":"总经理","description":"无"},{"id":2,"name":"总监","description":"无"},{"id":3,"name":"普通职员","description":"无"}]).withIdentity();
  }

  async down(
    builder: MigrateBuilder,
    dialect: string
  ): Promise<void> {
    builder.alterTable({"name":"Employee","schema":"dbo"}).drop(({ foreignKey }) => foreignKey("FK_Employee_organizationId_Organization_id"));;
    builder.alterTable({"name":"Employee","schema":"dbo"}).drop(({ foreignKey }) => foreignKey("FK_Employee_userId_User_id"));;
    builder.alterTable({"name":"EmployeePosition","schema":"dbo"}).drop(({ foreignKey }) => foreignKey("FK_EmployeePosition_employeeId_TO_Employee_id"));;
    builder.alterTable({"name":"EmployeePosition","schema":"dbo"}).drop(({ foreignKey }) => foreignKey("FK_EmployeePosition_positionId_TO_Position_id"));;
    builder.alterTable({"name":"Organization","schema":"dbo"}).drop(({ foreignKey }) => foreignKey("FK_Organization_parentId_Organization_id"));;
    builder.alterTable({"name":"OrderDetail","schema":"dbo"}).drop(({ foreignKey }) => foreignKey("FK_OrderDetail_orderId_Order_id"));;
    builder.dropTable({"name":"User","schema":"dbo"});;
    builder.dropTable({"name":"Employee","schema":"dbo"});;
    builder.dropTable({"name":"Position","schema":"dbo"});;
    builder.dropTable({"name":"EmployeePosition","schema":"dbo"});;
    builder.dropTable({"name":"Organization","schema":"dbo"});;
    builder.dropTable({"name":"Order","schema":"dbo"});;
    builder.dropTable({"name":"OrderDetail","schema":"dbo"});
  }

}

export default Init;
  