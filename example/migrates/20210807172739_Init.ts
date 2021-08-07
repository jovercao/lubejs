import { Migrate, SqlBuilder as SQL, DbType, MigrateBuilder } from 'lubejs';

export class Init implements Migrate {

  async up(
    builder: MigrateBuilder,
    dialect: string
  ): Promise<void> {
    builder.createTable("User").as(builder => [
      builder.column("id", DbType.int64).notNull().identity(0, 1),
      builder.column("name", DbType.string(DbType.MAX)).notNull(),
      builder.column("password", DbType.string(DbType.MAX)).null(),
      builder.column("description", DbType.string(DbType.MAX)).null(),
      builder.primaryKey("PK_User_id").on({ "id": 'ASC' })
    ]);
    builder.setConstraintComment("User", "PK_User_id", "PrimaryKey");
    builder.setColumnComment("User", "id", "ID");
    builder.setColumnComment("User", "name", "EmployeeName");
    builder.setColumnComment("User", "password", "Password");
    builder.setColumnComment("User", "description", "Description");
    builder.setTableComment("User", "Employee");
    builder.createTable("Employee").as(builder => [
      builder.column("id", DbType.int64).notNull().identity(0, 1),
      builder.column("name", DbType.string(100)).null(),
      builder.column("description", DbType.string(100)).null(),
      builder.column("organizationId", DbType.int64).notNull(),
      builder.column("userId", DbType.int64).notNull(),
      builder.primaryKey("PK_Employee_id").on({ "id": 'ASC' })
    ]);
    builder.createIndex("IX_Employee_organizationId").on("Employee", { "organizationId": 'ASC' });
    builder.createIndex("UX_Employee_userId").on("Employee", { "userId": 'ASC' }).unique();
    builder.createTable("Position").as(builder => [
      builder.column("id", DbType.int64).notNull().identity(0, 1),
      builder.column("name", DbType.string(DbType.MAX)).notNull(),
      builder.column("description", DbType.string(DbType.MAX)).null(),
      builder.primaryKey("PK_Position_id").on({ "id": 'ASC' })
    ]);
    builder.setConstraintComment("Position", "PK_Position_id", "PrimaryKey");
    builder.setColumnComment("Position", "id", "ID");
    builder.setColumnComment("Position", "name", "PositionName");
    builder.setColumnComment("Position", "description", "Description");
    builder.setTableComment("Position", "Position");
    builder.createTable("EmployeePosition").as(builder => [
      builder.column("id", DbType.int64).notNull().identity(0, 1),
      builder.column("employeeId", DbType.int64).null(),
      builder.column("positionId", DbType.int64).null(),
      builder.primaryKey("PK_EmployeePosition_id").on({ "id": 'ASC' })
    ]);
    builder.setColumnComment("EmployeePosition", "id", "Auto generic key column.");
    builder.createIndex("IX_EmployeePosition_employeeId").on("EmployeePosition", { "employeeId": 'ASC' });
    builder.createIndex("IX_EmployeePosition_positionId").on("EmployeePosition", { "positionId": 'ASC' });
    builder.createTable("Organization").as(builder => [
      builder.column("id", DbType.int64).notNull().identity(0, 1),
      builder.column("name", DbType.string(DbType.MAX)).notNull(),
      builder.column("description", DbType.string(DbType.MAX)).null(),
      builder.column("parentId", DbType.int64).null(),
      builder.primaryKey("PK_Organization_id").on({ "id": 'ASC' })
    ]);
    builder.createIndex("IX_Organization_parentId").on("Organization", { "parentId": 'ASC' });
    builder.createTable("Order").as(builder => [
      builder.column("id", DbType.int64).notNull().identity(0, 1),
      builder.column("orderNo", DbType.string(DbType.MAX)).notNull(),
      builder.column("date", DbType.datetime).notNull().default(SQL.raw("sysDateTimeOffset()")),
      builder.column("description", DbType.string(DbType.MAX)).null(),
      builder.column("rowflag", DbType.rowflag).notNull(),
      builder.primaryKey("PK_Order_id").on({ "id": 'ASC' })
    ]);
    builder.setAutoRowflag("Order", "rowflag");
    builder.createTable("OrderDetail").as(builder => [
      builder.column("id", DbType.int64).notNull().identity(0, 1),
      builder.column("product", DbType.string(DbType.MAX)).notNull(),
      builder.column("count", DbType.int32).notNull(),
      builder.column("price", DbType.decimal(18, 6)).notNull(),
      builder.column("amount", DbType.decimal(18, 2)).notNull(),
      builder.column("orderId", DbType.int64).notNull(),
      builder.column("description", DbType.string(DbType.MAX)).null(),
      builder.primaryKey("PK_OrderDetail_id").on({ "id": 'ASC' })
    ]);
    builder.createIndex("IX_OrderDetail_orderId").on("OrderDetail", { "orderId": 'ASC' });
    builder.alterTable("Employee").add(builder => builder.foreignKey("FK_Employee_organizationId_Organization_id").on("organizationId").reference("Organization", ["id"]));
    builder.alterTable("Employee").add(builder => builder.foreignKey("FK_Employee_userId_User_id").on("userId").reference("User", ["id"]));
    builder.alterTable("EmployeePosition").add(builder => builder.foreignKey("FK_EmployeePosition_employeeId_TO_Employee_id").on("employeeId").reference("Employee", ["id"]));
    builder.alterTable("EmployeePosition").add(builder => builder.foreignKey("FK_EmployeePosition_positionId_TO_Position_id").on("positionId").reference("Position", ["id"]));
    builder.alterTable("Organization").add(builder => builder.foreignKey("FK_Organization_parentId_Organization_id").on("parentId").reference("Organization", ["id"]));
    builder.alterTable("OrderDetail").add(builder => builder.foreignKey("FK_OrderDetail_orderId_Order_id").on("orderId").reference("Order", ["id"]));
    builder.insert("User").values([{"id":0,"name":"admin"}]).withIdentity();
    builder.insert("Organization").values([{"id":0,"name":"Company","description":"none"},{"id":1,"name":"IT","parentId":0},{"id":2,"name":"Administration","parentId":0}]).withIdentity();
    builder.insert("Employee").values([{"id":0,"name":"Administrator","organizationId":0,"userId":0}]).withIdentity();
    builder.insert("Position").values([{"id":1,"name":"general manager","description":"none"},{"id":2,"name":"chief inspector","description":"none"},{"id":3,"name":"clerk","description":"none"}]).withIdentity();
  }

  async down(
    builder: MigrateBuilder,
    dialect: string
  ): Promise<void> {
    builder.alterTable("Employee").drop(({ foreignKey }) => foreignKey("FK_Employee_organizationId_Organization_id"));;
    builder.alterTable("Employee").drop(({ foreignKey }) => foreignKey("FK_Employee_userId_User_id"));;
    builder.alterTable("EmployeePosition").drop(({ foreignKey }) => foreignKey("FK_EmployeePosition_employeeId_TO_Employee_id"));;
    builder.alterTable("EmployeePosition").drop(({ foreignKey }) => foreignKey("FK_EmployeePosition_positionId_TO_Position_id"));;
    builder.alterTable("Organization").drop(({ foreignKey }) => foreignKey("FK_Organization_parentId_Organization_id"));;
    builder.alterTable("OrderDetail").drop(({ foreignKey }) => foreignKey("FK_OrderDetail_orderId_Order_id"));;
    builder.dropTable("User");;
    builder.dropTable("Employee");;
    builder.dropTable("Position");;
    builder.dropTable("EmployeePosition");;
    builder.dropTable("Organization");;
    builder.dropTable("Order");;
    builder.dropTable("OrderDetail");
  }

}

export default Init;
  