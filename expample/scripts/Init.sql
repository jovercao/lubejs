-- Migrate up script from "D:\workspace\jovercao\lubejs\exp\migrates\20210627222044_Init.ts"
GO
CREATE TABLE [Order] ([id] INT NOT NULL IDENTITY(0, 1),
  [orderNo] VARCHAR(MAX) NOT NULL,
  [date] DATETIME NOT NULL,
  [description] VARCHAR(MAX) NULL,
  CONSTRAINT [PK_Order_id]  PRIMARY KEY([id] ASC));
GO
CREATE TABLE [OrderDetail] ([id] INT NOT NULL IDENTITY(0, 1),
  [product] VARCHAR(MAX) NOT NULL,
  [count] INT NOT NULL,
  [price] DECIMAL(18, 6) NOT NULL,
  [amount] DECIMAL(18, 2) NOT NULL,
  [orderId] INT NOT NULL,
  CONSTRAINT [PK_OrderDetail_id]  PRIMARY KEY([id] ASC));
GO
CREATE TABLE [Position] ([id] INT NOT NULL IDENTITY(0, 1),
  [name] VARCHAR(MAX) NOT NULL,
  [description] VARCHAR(MAX) NULL,
  CONSTRAINT [PK_Position_id]  PRIMARY KEY([id] ASC));
GO
CREATE TABLE [Employee] ([id] INT NOT NULL IDENTITY(0, 1),
  [name] VARCHAR(100) NULL,
  CONSTRAINT [PK_Employee_id]  PRIMARY KEY([id] ASC));
GO
CREATE TABLE [EmployeePosition] ([id] INT NOT NULL IDENTITY(0, 1),
  [PositionId] INT NOT NULL,
  [EmployeeId] INT NOT NULL,
  CONSTRAINT [PK_EmployeePosition_id]  PRIMARY KEY([id] ASC));
GO
ALTER TABLE [OrderDetail] ADD CONSTRAINT [FK_OrderDetail_orderId_Order_id] FOREIGN KEY([orderId]) REFERENCES [Order]([id]);
GO
ALTER TABLE [EmployeePosition] ADD CONSTRAINT [FK_EmployeePosition_PositionId_Position_id] FOREIGN KEY([PositionId]) REFERENCES [Position]([id]);
GO
ALTER TABLE [EmployeePosition] ADD CONSTRAINT [FK_EmployeePosition_EmployeeId_Employee_id] FOREIGN KEY([EmployeeId]) REFERENCES [Employee]([id]);
GO
SET IDENTITY_INSERT [Position] ON
INSERT INTO [Position]([id], [name], [description]) VALUES(1, '总经理', '无'), (2, '总监', '无'), (3, '普通职员', '无')
SET IDENTITY_INSERT [Position] OFF
;
GO
CREATE TABLE [__LubeMigrate] ([migrate_id] VARCHAR(100) PRIMARY KEY);
GO
DELETE [__LubeMigrate];
GO
INSERT INTO [__LubeMigrate] VALUES('20210627222044_Init');