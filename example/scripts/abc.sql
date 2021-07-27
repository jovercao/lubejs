ALTER TABLE [abc].[ff] DROP  CONSTRAINT [xxxff]
---------------------------------------------
DROP TABLE [abc].[ff]
---------------------------------------------

-- MigrateBuilder.setColumnComment('[User]', 'name', '用户名');
DECLARE @Schema VARCHAR(100), @Table VARCHAR(100), @ObjectId INT, @Column VARCHAR(100)

SET @Column = 'name'

SELECT @ObjectId = o.object_id, @Schema = s.name, @Table = o.name
FROM sys.objects o JOIN sys.schemas s ON o.schema_id = s.schema_id
WHERE o.object_id = object_id('[User]')

IF EXISTS(SELECT 1
  FROM sys.extended_properties p INNER JOIN
  sys.columns c ON p.major_id = c.object_id AND p.minor_id = c.column_id
  WHERE c.object_id = @ObjectId AND c.name = @Column AND p.class = 1)
BEGIN
  EXEC sys.sp_dropextendedproperty 'MS_Description', 'SCHEMA', @Schema, 'TABLE', @Table, 'COLUMN', @Column
END

EXEC sys.sp_addextendedproperty 'MS_Description', '用户名', 'SCHEMA', @Schema, 'TABLE', @Table, 'COLUMN', @Column
---------------------------------------------
ALTER TABLE [User] ALTER COLUMN [password] VARCHAR(MAX) NOT NULL
---------------------------------------------

-- MigrateBuilder.setColumnComment('[User]', 'password', '密码');
DECLARE @Schema VARCHAR(100), @Table VARCHAR(100), @ObjectId INT, @Column VARCHAR(100)

SET @Column = 'password'

SELECT @ObjectId = o.object_id, @Schema = s.name, @Table = o.name
FROM sys.objects o JOIN sys.schemas s ON o.schema_id = s.schema_id
WHERE o.object_id = object_id('[User]')

IF EXISTS(SELECT 1
  FROM sys.extended_properties p INNER JOIN
  sys.columns c ON p.major_id = c.object_id AND p.minor_id = c.column_id
  WHERE c.object_id = @ObjectId AND c.name = @Column AND p.class = 1)
BEGIN
  EXEC sys.sp_dropextendedproperty 'MS_Description', 'SCHEMA', @Schema, 'TABLE', @Table, 'COLUMN', @Column
END

EXEC sys.sp_addextendedproperty 'MS_Description', '密码', 'SCHEMA', @Schema, 'TABLE', @Table, 'COLUMN', @Column
---------------------------------------------
ALTER TABLE [User] ALTER COLUMN [description] VARCHAR(MAX) NOT NULL
---------------------------------------------

-- MigrateBuilder.setColumnComment('[User]', 'description', '摘要说明');
DECLARE @Schema VARCHAR(100), @Table VARCHAR(100), @ObjectId INT, @Column VARCHAR(100)

SET @Column = 'description'

SELECT @ObjectId = o.object_id, @Schema = s.name, @Table = o.name
FROM sys.objects o JOIN sys.schemas s ON o.schema_id = s.schema_id
WHERE o.object_id = object_id('[User]')

IF EXISTS(SELECT 1
  FROM sys.extended_properties p INNER JOIN
  sys.columns c ON p.major_id = c.object_id AND p.minor_id = c.column_id
  WHERE c.object_id = @ObjectId AND c.name = @Column AND p.class = 1)
BEGIN
  EXEC sys.sp_dropextendedproperty 'MS_Description', 'SCHEMA', @Schema, 'TABLE', @Table, 'COLUMN', @Column
END

EXEC sys.sp_addextendedproperty 'MS_Description', '摘要说明', 'SCHEMA', @Schema, 'TABLE', @Table, 'COLUMN', @Column
---------------------------------------------

-- MigrateBuilder.setTableComment('[User]', '用户');
DECLARE @Schema VARCHAR(100), @Table VARCHAR(100), @ObjectId INT

SELECT @ObjectId = o.object_id, @Schema = s.name, @Table = o.name
FROM sys.objects o JOIN sys.schemas s ON o.schema_id = s.schema_id
WHERE o.object_id = object_id('[User]')

IF EXISTS(SELECT 1 FROM sys.extended_properties p WHERE p.major_id = @ObjectId AND p.minor_id = 0 AND p.class = 1)
BEGIN
  EXEC sys.sp_dropextendedproperty 'MS_Description', 'SCHEMA', @Schema, 'TABLE', @Table
END

EXEC sys.sp_addextendedproperty 'MS_Description', '用户', 'SCHEMA', @Schema, 'TABLE', @Table
---------------------------------------------
-- // 敬告：因为需要重建表，在mssql中尚未实现该功能。
---------------------------------------------
BEGIN
  /**
 * 警告: 由于mssql特性原因，dropIdentity操作需要重建表，暂不支持identity属性变更，请手动处理，带来不便敬请谅解。
 * 操作信息： dropIdentity(table: [Order], column: id)
 */
  RAISERROR ('警告: 由于mssql特性原因，dropIdentity操作需要重建表，暂不支持identity属性变更，请手动处理，带来不便敬请谅解。', 16, 1);
END
---------------------------------------------

-- MigrateBuilder.setColumnComment('[Order]', 'id', 'ID');
DECLARE @Schema VARCHAR(100), @Table VARCHAR(100), @ObjectId INT, @Column VARCHAR(100)

SET @Column = 'id'

SELECT @ObjectId = o.object_id, @Schema = s.name, @Table = o.name
FROM sys.objects o JOIN sys.schemas s ON o.schema_id = s.schema_id
WHERE o.object_id = object_id('[Order]')

IF EXISTS(SELECT 1
  FROM sys.extended_properties p INNER JOIN
  sys.columns c ON p.major_id = c.object_id AND p.minor_id = c.column_id
  WHERE c.object_id = @ObjectId AND c.name = @Column AND p.class = 1)
BEGIN
  EXEC sys.sp_dropextendedproperty 'MS_Description', 'SCHEMA', @Schema, 'TABLE', @Table, 'COLUMN', @Column
END

EXEC sys.sp_addextendedproperty 'MS_Description', 'ID', 'SCHEMA', @Schema, 'TABLE', @Table, 'COLUMN', @Column
---------------------------------------------

-- MigrateBuilder.setColumnComment('[Order]', 'date', '订单日期');
DECLARE @Schema VARCHAR(100), @Table VARCHAR(100), @ObjectId INT, @Column VARCHAR(100)

SET @Column = 'date'

SELECT @ObjectId = o.object_id, @Schema = s.name, @Table = o.name
FROM sys.objects o JOIN sys.schemas s ON o.schema_id = s.schema_id
WHERE o.object_id = object_id('[Order]')

IF EXISTS(SELECT 1
  FROM sys.extended_properties p INNER JOIN
  sys.columns c ON p.major_id = c.object_id AND p.minor_id = c.column_id
  WHERE c.object_id = @ObjectId AND c.name = @Column AND p.class = 1)
BEGIN
  EXEC sys.sp_dropextendedproperty 'MS_Description', 'SCHEMA', @Schema, 'TABLE', @Table, 'COLUMN', @Column
END

EXEC sys.sp_addextendedproperty 'MS_Description', '订单日期', 'SCHEMA', @Schema, 'TABLE', @Table, 'COLUMN', @Column
---------------------------------------------

-- MigrateBuilder.setColumnComment('[Order]', 'orderNo', '订单号');
DECLARE @Schema VARCHAR(100), @Table VARCHAR(100), @ObjectId INT, @Column VARCHAR(100)

SET @Column = 'orderNo'

SELECT @ObjectId = o.object_id, @Schema = s.name, @Table = o.name
FROM sys.objects o JOIN sys.schemas s ON o.schema_id = s.schema_id
WHERE o.object_id = object_id('[Order]')

IF EXISTS(SELECT 1
  FROM sys.extended_properties p INNER JOIN
  sys.columns c ON p.major_id = c.object_id AND p.minor_id = c.column_id
  WHERE c.object_id = @ObjectId AND c.name = @Column AND p.class = 1)
BEGIN
  EXEC sys.sp_dropextendedproperty 'MS_Description', 'SCHEMA', @Schema, 'TABLE', @Table, 'COLUMN', @Column
END

EXEC sys.sp_addextendedproperty 'MS_Description', '订单号', 'SCHEMA', @Schema, 'TABLE', @Table, 'COLUMN', @Column
---------------------------------------------
ALTER TABLE [Order] ALTER COLUMN [description] VARCHAR(MAX) NOT NULL
---------------------------------------------

-- MigrateBuilder.setColumnComment('[Order]', 'description', '摘要说明');
DECLARE @Schema VARCHAR(100), @Table VARCHAR(100), @ObjectId INT, @Column VARCHAR(100)

SET @Column = 'description'

SELECT @ObjectId = o.object_id, @Schema = s.name, @Table = o.name
FROM sys.objects o JOIN sys.schemas s ON o.schema_id = s.schema_id
WHERE o.object_id = object_id('[Order]')

IF EXISTS(SELECT 1
  FROM sys.extended_properties p INNER JOIN
  sys.columns c ON p.major_id = c.object_id AND p.minor_id = c.column_id
  WHERE c.object_id = @ObjectId AND c.name = @Column AND p.class = 1)
BEGIN
  EXEC sys.sp_dropextendedproperty 'MS_Description', 'SCHEMA', @Schema, 'TABLE', @Table, 'COLUMN', @Column
END

EXEC sys.sp_addextendedproperty 'MS_Description', '摘要说明', 'SCHEMA', @Schema, 'TABLE', @Table, 'COLUMN', @Column
---------------------------------------------
ALTER TABLE [Order] ALTER COLUMN [rowflag] NVARCHAR(MAX) NOT NULL
---------------------------------------------
BEGIN
  -- =========================MSSQL 自带标记列，仅通过修改类型来达成========================
  ALTER TABLE [Order] ADD [__rowflag] VARBINARY(8) NOT NULL
  UPDATE [Order] SET [Order].[rowflag] = .[rowflag]
  ALTER TABLE [Order] DROP  COLUMN [rowflag]
  EXECUTE @__RETURN_VALUE__ = sp_rename '[Order].[__rowflag]', 'rowflag', 'COLUMN'
END
---------------------------------------------

-- MigrateBuilder.setColumnComment('[Order]', 'rowflag', '行标识');
DECLARE @Schema VARCHAR(100), @Table VARCHAR(100), @ObjectId INT, @Column VARCHAR(100)

SET @Column = 'rowflag'

SELECT @ObjectId = o.object_id, @Schema = s.name, @Table = o.name
FROM sys.objects o JOIN sys.schemas s ON o.schema_id = s.schema_id
WHERE o.object_id = object_id('[Order]')

IF EXISTS(SELECT 1
  FROM sys.extended_properties p INNER JOIN
  sys.columns c ON p.major_id = c.object_id AND p.minor_id = c.column_id
  WHERE c.object_id = @ObjectId AND c.name = @Column AND p.class = 1)
BEGIN
  EXEC sys.sp_dropextendedproperty 'MS_Description', 'SCHEMA', @Schema, 'TABLE', @Table, 'COLUMN', @Column
END

EXEC sys.sp_addextendedproperty 'MS_Description', '行标识', 'SCHEMA', @Schema, 'TABLE', @Table, 'COLUMN', @Column
---------------------------------------------

-- MigrateBuilder.setTableComment('[Order]', '订单');
DECLARE @Schema VARCHAR(100), @Table VARCHAR(100), @ObjectId INT

SELECT @ObjectId = o.object_id, @Schema = s.name, @Table = o.name
FROM sys.objects o JOIN sys.schemas s ON o.schema_id = s.schema_id
WHERE o.object_id = object_id('[Order]')

IF EXISTS(SELECT 1 FROM sys.extended_properties p WHERE p.major_id = @ObjectId AND p.minor_id = 0 AND p.class = 1)
BEGIN
  EXEC sys.sp_dropextendedproperty 'MS_Description', 'SCHEMA', @Schema, 'TABLE', @Table
END

EXEC sys.sp_addextendedproperty 'MS_Description', '订单', 'SCHEMA', @Schema, 'TABLE', @Table
---------------------------------------------
-- // 敬告：因为需要重建表，在mssql中尚未实现该功能。
---------------------------------------------
BEGIN
  /**
 * 警告: 由于mssql特性原因，dropIdentity操作需要重建表，暂不支持identity属性变更，请手动处理，带来不便敬请谅解。
 * 操作信息： dropIdentity(table: [OrderDetail], column: id)
 */
  RAISERROR ('警告: 由于mssql特性原因，dropIdentity操作需要重建表，暂不支持identity属性变更，请手动处理，带来不便敬请谅解。', 16, 1);
END
---------------------------------------------

-- MigrateBuilder.setColumnComment('[OrderDetail]', 'id', 'ID');
DECLARE @Schema VARCHAR(100), @Table VARCHAR(100), @ObjectId INT, @Column VARCHAR(100)

SET @Column = 'id'

SELECT @ObjectId = o.object_id, @Schema = s.name, @Table = o.name
FROM sys.objects o JOIN sys.schemas s ON o.schema_id = s.schema_id
WHERE o.object_id = object_id('[OrderDetail]')

IF EXISTS(SELECT 1
  FROM sys.extended_properties p INNER JOIN
  sys.columns c ON p.major_id = c.object_id AND p.minor_id = c.column_id
  WHERE c.object_id = @ObjectId AND c.name = @Column AND p.class = 1)
BEGIN
  EXEC sys.sp_dropextendedproperty 'MS_Description', 'SCHEMA', @Schema, 'TABLE', @Table, 'COLUMN', @Column
END

EXEC sys.sp_addextendedproperty 'MS_Description', 'ID', 'SCHEMA', @Schema, 'TABLE', @Table, 'COLUMN', @Column
---------------------------------------------

-- MigrateBuilder.setColumnComment('[OrderDetail]', 'product', '产品名称');
DECLARE @Schema VARCHAR(100), @Table VARCHAR(100), @ObjectId INT, @Column VARCHAR(100)

SET @Column = 'product'

SELECT @ObjectId = o.object_id, @Schema = s.name, @Table = o.name
FROM sys.objects o JOIN sys.schemas s ON o.schema_id = s.schema_id
WHERE o.object_id = object_id('[OrderDetail]')

IF EXISTS(SELECT 1
  FROM sys.extended_properties p INNER JOIN
  sys.columns c ON p.major_id = c.object_id AND p.minor_id = c.column_id
  WHERE c.object_id = @ObjectId AND c.name = @Column AND p.class = 1)
BEGIN
  EXEC sys.sp_dropextendedproperty 'MS_Description', 'SCHEMA', @Schema, 'TABLE', @Table, 'COLUMN', @Column
END

EXEC sys.sp_addextendedproperty 'MS_Description', '产品名称', 'SCHEMA', @Schema, 'TABLE', @Table, 'COLUMN', @Column
---------------------------------------------

-- MigrateBuilder.setColumnComment('[OrderDetail]', 'count', '数量');
DECLARE @Schema VARCHAR(100), @Table VARCHAR(100), @ObjectId INT, @Column VARCHAR(100)

SET @Column = 'count'

SELECT @ObjectId = o.object_id, @Schema = s.name, @Table = o.name
FROM sys.objects o JOIN sys.schemas s ON o.schema_id = s.schema_id
WHERE o.object_id = object_id('[OrderDetail]')

IF EXISTS(SELECT 1
  FROM sys.extended_properties p INNER JOIN
  sys.columns c ON p.major_id = c.object_id AND p.minor_id = c.column_id
  WHERE c.object_id = @ObjectId AND c.name = @Column AND p.class = 1)
BEGIN
  EXEC sys.sp_dropextendedproperty 'MS_Description', 'SCHEMA', @Schema, 'TABLE', @Table, 'COLUMN', @Column
END

EXEC sys.sp_addextendedproperty 'MS_Description', '数量', 'SCHEMA', @Schema, 'TABLE', @Table, 'COLUMN', @Column
---------------------------------------------

-- MigrateBuilder.setColumnComment('[OrderDetail]', 'price', '单价');
DECLARE @Schema VARCHAR(100), @Table VARCHAR(100), @ObjectId INT, @Column VARCHAR(100)

SET @Column = 'price'

SELECT @ObjectId = o.object_id, @Schema = s.name, @Table = o.name
FROM sys.objects o JOIN sys.schemas s ON o.schema_id = s.schema_id
WHERE o.object_id = object_id('[OrderDetail]')

IF EXISTS(SELECT 1
  FROM sys.extended_properties p INNER JOIN
  sys.columns c ON p.major_id = c.object_id AND p.minor_id = c.column_id
  WHERE c.object_id = @ObjectId AND c.name = @Column AND p.class = 1)
BEGIN
  EXEC sys.sp_dropextendedproperty 'MS_Description', 'SCHEMA', @Schema, 'TABLE', @Table, 'COLUMN', @Column
END

EXEC sys.sp_addextendedproperty 'MS_Description', '单价', 'SCHEMA', @Schema, 'TABLE', @Table, 'COLUMN', @Column
---------------------------------------------
ALTER TABLE [OrderDetail] ALTER COLUMN [amount] DECIMAL(18,6) NOT NULL
---------------------------------------------

-- MigrateBuilder.setColumnComment('[OrderDetail]', 'amount', '金额');
DECLARE @Schema VARCHAR(100), @Table VARCHAR(100), @ObjectId INT, @Column VARCHAR(100)

SET @Column = 'amount'

SELECT @ObjectId = o.object_id, @Schema = s.name, @Table = o.name
FROM sys.objects o JOIN sys.schemas s ON o.schema_id = s.schema_id
WHERE o.object_id = object_id('[OrderDetail]')

IF EXISTS(SELECT 1
  FROM sys.extended_properties p INNER JOIN
  sys.columns c ON p.major_id = c.object_id AND p.minor_id = c.column_id
  WHERE c.object_id = @ObjectId AND c.name = @Column AND p.class = 1)
BEGIN
  EXEC sys.sp_dropextendedproperty 'MS_Description', 'SCHEMA', @Schema, 'TABLE', @Table, 'COLUMN', @Column
END

EXEC sys.sp_addextendedproperty 'MS_Description', '金额', 'SCHEMA', @Schema, 'TABLE', @Table, 'COLUMN', @Column
---------------------------------------------
ALTER TABLE [OrderDetail] ALTER COLUMN [description] VARCHAR(MAX) NOT NULL
---------------------------------------------

-- MigrateBuilder.setColumnComment('[OrderDetail]', 'description', '摘要说明');
DECLARE @Schema VARCHAR(100), @Table VARCHAR(100), @ObjectId INT, @Column VARCHAR(100)

SET @Column = 'description'

SELECT @ObjectId = o.object_id, @Schema = s.name, @Table = o.name
FROM sys.objects o JOIN sys.schemas s ON o.schema_id = s.schema_id
WHERE o.object_id = object_id('[OrderDetail]')

IF EXISTS(SELECT 1
  FROM sys.extended_properties p INNER JOIN
  sys.columns c ON p.major_id = c.object_id AND p.minor_id = c.column_id
  WHERE c.object_id = @ObjectId AND c.name = @Column AND p.class = 1)
BEGIN
  EXEC sys.sp_dropextendedproperty 'MS_Description', 'SCHEMA', @Schema, 'TABLE', @Table, 'COLUMN', @Column
END

EXEC sys.sp_addextendedproperty 'MS_Description', '摘要说明', 'SCHEMA', @Schema, 'TABLE', @Table, 'COLUMN', @Column
---------------------------------------------

-- MigrateBuilder.setColumnComment('[OrderDetail]', 'orderId', '订单Id');
DECLARE @Schema VARCHAR(100), @Table VARCHAR(100), @ObjectId INT, @Column VARCHAR(100)

SET @Column = 'orderId'

SELECT @ObjectId = o.object_id, @Schema = s.name, @Table = o.name
FROM sys.objects o JOIN sys.schemas s ON o.schema_id = s.schema_id
WHERE o.object_id = object_id('[OrderDetail]')

IF EXISTS(SELECT 1
  FROM sys.extended_properties p INNER JOIN
  sys.columns c ON p.major_id = c.object_id AND p.minor_id = c.column_id
  WHERE c.object_id = @ObjectId AND c.name = @Column AND p.class = 1)
BEGIN
  EXEC sys.sp_dropextendedproperty 'MS_Description', 'SCHEMA', @Schema, 'TABLE', @Table, 'COLUMN', @Column
END

EXEC sys.sp_addextendedproperty 'MS_Description', '订单Id', 'SCHEMA', @Schema, 'TABLE', @Table, 'COLUMN', @Column
---------------------------------------------

-- MigrateBuilder.setTableComment('[OrderDetail]', '订单明细');
DECLARE @Schema VARCHAR(100), @Table VARCHAR(100), @ObjectId INT

SELECT @ObjectId = o.object_id, @Schema = s.name, @Table = o.name
FROM sys.objects o JOIN sys.schemas s ON o.schema_id = s.schema_id
WHERE o.object_id = object_id('[OrderDetail]')

IF EXISTS(SELECT 1 FROM sys.extended_properties p WHERE p.major_id = @ObjectId AND p.minor_id = 0 AND p.class = 1)
BEGIN
  EXEC sys.sp_dropextendedproperty 'MS_Description', 'SCHEMA', @Schema, 'TABLE', @Table
END

EXEC sys.sp_addextendedproperty 'MS_Description', '订单明细', 'SCHEMA', @Schema, 'TABLE', @Table
---------------------------------------------
-- // 敬告：因为需要重建表，在mssql中尚未实现该功能。
---------------------------------------------
BEGIN
  /**
 * 警告: 由于mssql特性原因，dropIdentity操作需要重建表，暂不支持identity属性变更，请手动处理，带来不便敬请谅解。
 * 操作信息： dropIdentity(table: [Position], column: id)
 */
  RAISERROR ('警告: 由于mssql特性原因，dropIdentity操作需要重建表，暂不支持identity属性变更，请手动处理，带来不便敬请谅解。', 16, 1);
END
---------------------------------------------

-- MigrateBuilder.setColumnComment('[Position]', 'id', '职位ID');
DECLARE @Schema VARCHAR(100), @Table VARCHAR(100), @ObjectId INT, @Column VARCHAR(100)

SET @Column = 'id'

SELECT @ObjectId = o.object_id, @Schema = s.name, @Table = o.name
FROM sys.objects o JOIN sys.schemas s ON o.schema_id = s.schema_id
WHERE o.object_id = object_id('[Position]')

IF EXISTS(SELECT 1
  FROM sys.extended_properties p INNER JOIN
  sys.columns c ON p.major_id = c.object_id AND p.minor_id = c.column_id
  WHERE c.object_id = @ObjectId AND c.name = @Column AND p.class = 1)
BEGIN
  EXEC sys.sp_dropextendedproperty 'MS_Description', 'SCHEMA', @Schema, 'TABLE', @Table, 'COLUMN', @Column
END

EXEC sys.sp_addextendedproperty 'MS_Description', '职位ID', 'SCHEMA', @Schema, 'TABLE', @Table, 'COLUMN', @Column
---------------------------------------------

-- MigrateBuilder.setColumnComment('[Position]', 'name', '职位名称');
DECLARE @Schema VARCHAR(100), @Table VARCHAR(100), @ObjectId INT, @Column VARCHAR(100)

SET @Column = 'name'

SELECT @ObjectId = o.object_id, @Schema = s.name, @Table = o.name
FROM sys.objects o JOIN sys.schemas s ON o.schema_id = s.schema_id
WHERE o.object_id = object_id('[Position]')

IF EXISTS(SELECT 1
  FROM sys.extended_properties p INNER JOIN
  sys.columns c ON p.major_id = c.object_id AND p.minor_id = c.column_id
  WHERE c.object_id = @ObjectId AND c.name = @Column AND p.class = 1)
BEGIN
  EXEC sys.sp_dropextendedproperty 'MS_Description', 'SCHEMA', @Schema, 'TABLE', @Table, 'COLUMN', @Column
END

EXEC sys.sp_addextendedproperty 'MS_Description', '职位名称', 'SCHEMA', @Schema, 'TABLE', @Table, 'COLUMN', @Column
---------------------------------------------
ALTER TABLE [Position] ALTER COLUMN [description] VARCHAR(MAX) NOT NULL
---------------------------------------------

-- MigrateBuilder.setColumnComment('[Position]', 'description', '摘要说明');
DECLARE @Schema VARCHAR(100), @Table VARCHAR(100), @ObjectId INT, @Column VARCHAR(100)

SET @Column = 'description'

SELECT @ObjectId = o.object_id, @Schema = s.name, @Table = o.name
FROM sys.objects o JOIN sys.schemas s ON o.schema_id = s.schema_id
WHERE o.object_id = object_id('[Position]')

IF EXISTS(SELECT 1
  FROM sys.extended_properties p INNER JOIN
  sys.columns c ON p.major_id = c.object_id AND p.minor_id = c.column_id
  WHERE c.object_id = @ObjectId AND c.name = @Column AND p.class = 1)
BEGIN
  EXEC sys.sp_dropextendedproperty 'MS_Description', 'SCHEMA', @Schema, 'TABLE', @Table, 'COLUMN', @Column
END

EXEC sys.sp_addextendedproperty 'MS_Description', '摘要说明', 'SCHEMA', @Schema, 'TABLE', @Table, 'COLUMN', @Column
---------------------------------------------

-- MigrateBuilder.setTableComment('[Position]', '职位');
DECLARE @Schema VARCHAR(100), @Table VARCHAR(100), @ObjectId INT

SELECT @ObjectId = o.object_id, @Schema = s.name, @Table = o.name
FROM sys.objects o JOIN sys.schemas s ON o.schema_id = s.schema_id
WHERE o.object_id = object_id('[Position]')

IF EXISTS(SELECT 1 FROM sys.extended_properties p WHERE p.major_id = @ObjectId AND p.minor_id = 0 AND p.class = 1)
BEGIN
  EXEC sys.sp_dropextendedproperty 'MS_Description', 'SCHEMA', @Schema, 'TABLE', @Table
END

EXEC sys.sp_addextendedproperty 'MS_Description', '职位', 'SCHEMA', @Schema, 'TABLE', @Table
---------------------------------------------
-- // 敬告：因为需要重建表，在mssql中尚未实现该功能。
---------------------------------------------
BEGIN
  /**
 * 警告: 由于mssql特性原因，dropIdentity操作需要重建表，暂不支持identity属性变更，请手动处理，带来不便敬请谅解。
 * 操作信息： dropIdentity(table: [Employee], column: id)
 */
  RAISERROR ('警告: 由于mssql特性原因，dropIdentity操作需要重建表，暂不支持identity属性变更，请手动处理，带来不便敬请谅解。', 16, 1);
END
---------------------------------------------

-- MigrateBuilder.setColumnComment('[Employee]', 'id', '职员ID');
DECLARE @Schema VARCHAR(100), @Table VARCHAR(100), @ObjectId INT, @Column VARCHAR(100)

SET @Column = 'id'

SELECT @ObjectId = o.object_id, @Schema = s.name, @Table = o.name
FROM sys.objects o JOIN sys.schemas s ON o.schema_id = s.schema_id
WHERE o.object_id = object_id('[Employee]')

IF EXISTS(SELECT 1
  FROM sys.extended_properties p INNER JOIN
  sys.columns c ON p.major_id = c.object_id AND p.minor_id = c.column_id
  WHERE c.object_id = @ObjectId AND c.name = @Column AND p.class = 1)
BEGIN
  EXEC sys.sp_dropextendedproperty 'MS_Description', 'SCHEMA', @Schema, 'TABLE', @Table, 'COLUMN', @Column
END

EXEC sys.sp_addextendedproperty 'MS_Description', '职员ID', 'SCHEMA', @Schema, 'TABLE', @Table, 'COLUMN', @Column
---------------------------------------------

-- MigrateBuilder.setColumnComment('[Employee]', 'name', '姓名');
DECLARE @Schema VARCHAR(100), @Table VARCHAR(100), @ObjectId INT, @Column VARCHAR(100)

SET @Column = 'name'

SELECT @ObjectId = o.object_id, @Schema = s.name, @Table = o.name
FROM sys.objects o JOIN sys.schemas s ON o.schema_id = s.schema_id
WHERE o.object_id = object_id('[Employee]')

IF EXISTS(SELECT 1
  FROM sys.extended_properties p INNER JOIN
  sys.columns c ON p.major_id = c.object_id AND p.minor_id = c.column_id
  WHERE c.object_id = @ObjectId AND c.name = @Column AND p.class = 1)
BEGIN
  EXEC sys.sp_dropextendedproperty 'MS_Description', 'SCHEMA', @Schema, 'TABLE', @Table, 'COLUMN', @Column
END

EXEC sys.sp_addextendedproperty 'MS_Description', '姓名', 'SCHEMA', @Schema, 'TABLE', @Table, 'COLUMN', @Column
---------------------------------------------
ALTER TABLE [Employee] ALTER COLUMN [description] VARCHAR(MAX) NOT NULL
---------------------------------------------

-- MigrateBuilder.setColumnComment('[Employee]', 'description', '摘要说明');
DECLARE @Schema VARCHAR(100), @Table VARCHAR(100), @ObjectId INT, @Column VARCHAR(100)

SET @Column = 'description'

SELECT @ObjectId = o.object_id, @Schema = s.name, @Table = o.name
FROM sys.objects o JOIN sys.schemas s ON o.schema_id = s.schema_id
WHERE o.object_id = object_id('[Employee]')

IF EXISTS(SELECT 1
  FROM sys.extended_properties p INNER JOIN
  sys.columns c ON p.major_id = c.object_id AND p.minor_id = c.column_id
  WHERE c.object_id = @ObjectId AND c.name = @Column AND p.class = 1)
BEGIN
  EXEC sys.sp_dropextendedproperty 'MS_Description', 'SCHEMA', @Schema, 'TABLE', @Table, 'COLUMN', @Column
END

EXEC sys.sp_addextendedproperty 'MS_Description', '摘要说明', 'SCHEMA', @Schema, 'TABLE', @Table, 'COLUMN', @Column
---------------------------------------------

-- MigrateBuilder.setTableComment('[Employee]', '职员');
DECLARE @Schema VARCHAR(100), @Table VARCHAR(100), @ObjectId INT

SELECT @ObjectId = o.object_id, @Schema = s.name, @Table = o.name
FROM sys.objects o JOIN sys.schemas s ON o.schema_id = s.schema_id
WHERE o.object_id = object_id('[Employee]')

IF EXISTS(SELECT 1 FROM sys.extended_properties p WHERE p.major_id = @ObjectId AND p.minor_id = 0 AND p.class = 1)
BEGIN
  EXEC sys.sp_dropextendedproperty 'MS_Description', 'SCHEMA', @Schema, 'TABLE', @Table
END

EXEC sys.sp_addextendedproperty 'MS_Description', '职员', 'SCHEMA', @Schema, 'TABLE', @Table
---------------------------------------------
ALTER TABLE [EmployeePosition] ADD [employeeId] INT NOT NULL
---------------------------------------------

-- MigrateBuilder.setColumnComment('[EmployeePosition]', 'employeeId', '职员ID');
DECLARE @Schema VARCHAR(100), @Table VARCHAR(100), @ObjectId INT, @Column VARCHAR(100)

SET @Column = 'employeeId'

SELECT @ObjectId = o.object_id, @Schema = s.name, @Table = o.name
FROM sys.objects o JOIN sys.schemas s ON o.schema_id = s.schema_id
WHERE o.object_id = object_id('[EmployeePosition]')

IF EXISTS(SELECT 1
  FROM sys.extended_properties p INNER JOIN
  sys.columns c ON p.major_id = c.object_id AND p.minor_id = c.column_id
  WHERE c.object_id = @ObjectId AND c.name = @Column AND p.class = 1)
BEGIN
  EXEC sys.sp_dropextendedproperty 'MS_Description', 'SCHEMA', @Schema, 'TABLE', @Table, 'COLUMN', @Column
END

EXEC sys.sp_addextendedproperty 'MS_Description', '职员ID', 'SCHEMA', @Schema, 'TABLE', @Table, 'COLUMN', @Column
---------------------------------------------
-- // 敬告：因为需要重建表，在mssql中尚未实现该功能。
---------------------------------------------
BEGIN
  /**
 * 警告: 由于mssql特性原因，dropIdentity操作需要重建表，暂不支持identity属性变更，请手动处理，带来不便敬请谅解。
 * 操作信息： dropIdentity(table: [EmployeePosition], column: id)
 */
  RAISERROR ('警告: 由于mssql特性原因，dropIdentity操作需要重建表，暂不支持identity属性变更，请手动处理，带来不便敬请谅解。', 16, 1);
END
---------------------------------------------

-- MigrateBuilder.setColumnComment('[EmployeePosition]', 'id', 'ID');
DECLARE @Schema VARCHAR(100), @Table VARCHAR(100), @ObjectId INT, @Column VARCHAR(100)

SET @Column = 'id'

SELECT @ObjectId = o.object_id, @Schema = s.name, @Table = o.name
FROM sys.objects o JOIN sys.schemas s ON o.schema_id = s.schema_id
WHERE o.object_id = object_id('[EmployeePosition]')

IF EXISTS(SELECT 1
  FROM sys.extended_properties p INNER JOIN
  sys.columns c ON p.major_id = c.object_id AND p.minor_id = c.column_id
  WHERE c.object_id = @ObjectId AND c.name = @Column AND p.class = 1)
BEGIN
  EXEC sys.sp_dropextendedproperty 'MS_Description', 'SCHEMA', @Schema, 'TABLE', @Table, 'COLUMN', @Column
END

EXEC sys.sp_addextendedproperty 'MS_Description', 'ID', 'SCHEMA', @Schema, 'TABLE', @Table, 'COLUMN', @Column
---------------------------------------------

-- MigrateBuilder.setColumnComment('[EmployeePosition]', 'positionId', '职位ID');
DECLARE @Schema VARCHAR(100), @Table VARCHAR(100), @ObjectId INT, @Column VARCHAR(100)

SET @Column = 'positionId'

SELECT @ObjectId = o.object_id, @Schema = s.name, @Table = o.name
FROM sys.objects o JOIN sys.schemas s ON o.schema_id = s.schema_id
WHERE o.object_id = object_id('[EmployeePosition]')

IF EXISTS(SELECT 1
  FROM sys.extended_properties p INNER JOIN
  sys.columns c ON p.major_id = c.object_id AND p.minor_id = c.column_id
  WHERE c.object_id = @ObjectId AND c.name = @Column AND p.class = 1)
BEGIN
  EXEC sys.sp_dropextendedproperty 'MS_Description', 'SCHEMA', @Schema, 'TABLE', @Table, 'COLUMN', @Column
END

EXEC sys.sp_addextendedproperty 'MS_Description', '职位ID', 'SCHEMA', @Schema, 'TABLE', @Table, 'COLUMN', @Column
---------------------------------------------
-- // 敬告：因为需要重建表，在mssql中尚未实现该功能。
---------------------------------------------
BEGIN
  /**
 * 警告: 由于mssql特性原因，dropIdentity操作需要重建表，暂不支持identity属性变更，请手动处理，带来不便敬请谅解。
 * 操作信息： dropIdentity(table: [Organization], column: id)
 */
  RAISERROR ('警告: 由于mssql特性原因，dropIdentity操作需要重建表，暂不支持identity属性变更，请手动处理，带来不便敬请谅解。', 16, 1);
END
---------------------------------------------

-- MigrateBuilder.setColumnComment('[Organization]', 'id', '机构ID');
DECLARE @Schema VARCHAR(100), @Table VARCHAR(100), @ObjectId INT, @Column VARCHAR(100)

SET @Column = 'id'

SELECT @ObjectId = o.object_id, @Schema = s.name, @Table = o.name
FROM sys.objects o JOIN sys.schemas s ON o.schema_id = s.schema_id
WHERE o.object_id = object_id('[Organization]')

IF EXISTS(SELECT 1
  FROM sys.extended_properties p INNER JOIN
  sys.columns c ON p.major_id = c.object_id AND p.minor_id = c.column_id
  WHERE c.object_id = @ObjectId AND c.name = @Column AND p.class = 1)
BEGIN
  EXEC sys.sp_dropextendedproperty 'MS_Description', 'SCHEMA', @Schema, 'TABLE', @Table, 'COLUMN', @Column
END

EXEC sys.sp_addextendedproperty 'MS_Description', '机构ID', 'SCHEMA', @Schema, 'TABLE', @Table, 'COLUMN', @Column
---------------------------------------------

-- MigrateBuilder.setColumnComment('[Organization]', 'name', '机构名称');
DECLARE @Schema VARCHAR(100), @Table VARCHAR(100), @ObjectId INT, @Column VARCHAR(100)

SET @Column = 'name'

SELECT @ObjectId = o.object_id, @Schema = s.name, @Table = o.name
FROM sys.objects o JOIN sys.schemas s ON o.schema_id = s.schema_id
WHERE o.object_id = object_id('[Organization]')

IF EXISTS(SELECT 1
  FROM sys.extended_properties p INNER JOIN
  sys.columns c ON p.major_id = c.object_id AND p.minor_id = c.column_id
  WHERE c.object_id = @ObjectId AND c.name = @Column AND p.class = 1)
BEGIN
  EXEC sys.sp_dropextendedproperty 'MS_Description', 'SCHEMA', @Schema, 'TABLE', @Table, 'COLUMN', @Column
END

EXEC sys.sp_addextendedproperty 'MS_Description', '机构名称', 'SCHEMA', @Schema, 'TABLE', @Table, 'COLUMN', @Column
---------------------------------------------
ALTER TABLE [Organization] ALTER COLUMN [description] VARCHAR(MAX) NOT NULL
---------------------------------------------

-- MigrateBuilder.setColumnComment('[Organization]', 'description', '摘要说明');
DECLARE @Schema VARCHAR(100), @Table VARCHAR(100), @ObjectId INT, @Column VARCHAR(100)

SET @Column = 'description'

SELECT @ObjectId = o.object_id, @Schema = s.name, @Table = o.name
FROM sys.objects o JOIN sys.schemas s ON o.schema_id = s.schema_id
WHERE o.object_id = object_id('[Organization]')

IF EXISTS(SELECT 1
  FROM sys.extended_properties p INNER JOIN
  sys.columns c ON p.major_id = c.object_id AND p.minor_id = c.column_id
  WHERE c.object_id = @ObjectId AND c.name = @Column AND p.class = 1)
BEGIN
  EXEC sys.sp_dropextendedproperty 'MS_Description', 'SCHEMA', @Schema, 'TABLE', @Table, 'COLUMN', @Column
END

EXEC sys.sp_addextendedproperty 'MS_Description', '摘要说明', 'SCHEMA', @Schema, 'TABLE', @Table, 'COLUMN', @Column
---------------------------------------------

-- MigrateBuilder.setColumnComment('[Organization]', 'parentId', '父级机构ID');
DECLARE @Schema VARCHAR(100), @Table VARCHAR(100), @ObjectId INT, @Column VARCHAR(100)

SET @Column = 'parentId'

SELECT @ObjectId = o.object_id, @Schema = s.name, @Table = o.name
FROM sys.objects o JOIN sys.schemas s ON o.schema_id = s.schema_id
WHERE o.object_id = object_id('[Organization]')

IF EXISTS(SELECT 1
  FROM sys.extended_properties p INNER JOIN
  sys.columns c ON p.major_id = c.object_id AND p.minor_id = c.column_id
  WHERE c.object_id = @ObjectId AND c.name = @Column AND p.class = 1)
BEGIN
  EXEC sys.sp_dropextendedproperty 'MS_Description', 'SCHEMA', @Schema, 'TABLE', @Table, 'COLUMN', @Column
END

EXEC sys.sp_addextendedproperty 'MS_Description', '父级机构ID', 'SCHEMA', @Schema, 'TABLE', @Table, 'COLUMN', @Column
---------------------------------------------

-- MigrateBuilder.setTableComment('[Organization]', '机构');
DECLARE @Schema VARCHAR(100), @Table VARCHAR(100), @ObjectId INT

SELECT @ObjectId = o.object_id, @Schema = s.name, @Table = o.name
FROM sys.objects o JOIN sys.schemas s ON o.schema_id = s.schema_id
WHERE o.object_id = object_id('[Organization]')

IF EXISTS(SELECT 1 FROM sys.extended_properties p WHERE p.major_id = @ObjectId AND p.minor_id = 0 AND p.class = 1)
BEGIN
  EXEC sys.sp_dropextendedproperty 'MS_Description', 'SCHEMA', @Schema, 'TABLE', @Table
END

EXEC sys.sp_addextendedproperty 'MS_Description', '机构', 'SCHEMA', @Schema, 'TABLE', @Table