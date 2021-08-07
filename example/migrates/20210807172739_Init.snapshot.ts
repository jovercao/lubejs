
import { DatabaseSchema } from "lubejs";
export const schema: DatabaseSchema = {
  "name": "Test",
  "tables": [
    {
      "name": "User",
      "schema": "dbo",
      "indexes": [],
      "columns": [
        {
          "name": "id",
          "type": "BIGINT",
          "isNullable": false,
          "isIdentity": true,
          "identityStartValue": 0,
          "identityIncrement": 1,
          "isCalculate": false,
          "isRowflag": false,
          "comment": "ID"
        },
        {
          "name": "name",
          "type": "VARCHAR(MAX)",
          "isNullable": false,
          "isIdentity": false,
          "isCalculate": false,
          "isRowflag": false,
          "comment": "EmployeeName"
        },
        {
          "name": "password",
          "type": "VARCHAR(MAX)",
          "isNullable": true,
          "isIdentity": false,
          "isCalculate": false,
          "isRowflag": false,
          "comment": "Password"
        },
        {
          "name": "description",
          "type": "VARCHAR(MAX)",
          "isNullable": true,
          "isIdentity": false,
          "isCalculate": false,
          "isRowflag": false,
          "comment": "Description"
        }
      ],
      "foreignKeys": [],
      "constraints": [],
      "primaryKey": {
        "name": "PK_User_id",
        "columns": [
          {
            "name": "id",
            "isAscending": true
          }
        ],
        "isNonclustered": false,
        "comment": "PrimaryKey"
      },
      "comment": "Employee"
    },
    {
      "name": "Employee",
      "schema": "dbo",
      "indexes": [
        {
          "name": "IX_Employee_organizationId",
          "columns": [
            {
              "name": "organizationId",
              "isAscending": true
            }
          ],
          "isUnique": false,
          "isClustered": false
        },
        {
          "name": "UX_Employee_userId",
          "columns": [
            {
              "name": "userId",
              "isAscending": true
            }
          ],
          "isUnique": true,
          "isClustered": false
        }
      ],
      "columns": [
        {
          "name": "id",
          "type": "BIGINT",
          "isNullable": false,
          "isIdentity": true,
          "identityStartValue": 0,
          "identityIncrement": 1,
          "isCalculate": false,
          "isRowflag": false
        },
        {
          "name": "name",
          "type": "VARCHAR(100)",
          "isNullable": true,
          "isIdentity": false,
          "isCalculate": false,
          "isRowflag": false
        },
        {
          "name": "description",
          "type": "VARCHAR(100)",
          "isNullable": true,
          "isIdentity": false,
          "isCalculate": false,
          "isRowflag": false
        },
        {
          "name": "organizationId",
          "type": "BIGINT",
          "isNullable": false,
          "isIdentity": false,
          "isCalculate": false,
          "isRowflag": false
        },
        {
          "name": "userId",
          "type": "BIGINT",
          "isNullable": false,
          "isIdentity": false,
          "isCalculate": false,
          "isRowflag": false
        }
      ],
      "foreignKeys": [
        {
          "name": "FK_Employee_organizationId_Organization_id",
          "columns": [
            "organizationId"
          ],
          "referenceColumns": [
            "id"
          ],
          "referenceTable": "Organization",
          "referenceSchema": "dbo",
          "isCascade": false
        },
        {
          "name": "FK_Employee_userId_User_id",
          "columns": [
            "userId"
          ],
          "referenceColumns": [
            "id"
          ],
          "referenceTable": "User",
          "referenceSchema": "dbo",
          "isCascade": false
        }
      ],
      "constraints": [],
      "primaryKey": {
        "name": "PK_Employee_id",
        "columns": [
          {
            "name": "id",
            "isAscending": true
          }
        ],
        "isNonclustered": false
      }
    },
    {
      "name": "Position",
      "schema": "dbo",
      "indexes": [],
      "columns": [
        {
          "name": "id",
          "type": "BIGINT",
          "isNullable": false,
          "isIdentity": true,
          "identityStartValue": 0,
          "identityIncrement": 1,
          "isCalculate": false,
          "isRowflag": false,
          "comment": "ID"
        },
        {
          "name": "name",
          "type": "VARCHAR(MAX)",
          "isNullable": false,
          "isIdentity": false,
          "isCalculate": false,
          "isRowflag": false,
          "comment": "PositionName"
        },
        {
          "name": "description",
          "type": "VARCHAR(MAX)",
          "isNullable": true,
          "isIdentity": false,
          "isCalculate": false,
          "isRowflag": false,
          "comment": "Description"
        }
      ],
      "foreignKeys": [],
      "constraints": [],
      "primaryKey": {
        "name": "PK_Position_id",
        "columns": [
          {
            "name": "id",
            "isAscending": true
          }
        ],
        "isNonclustered": false,
        "comment": "PrimaryKey"
      },
      "comment": "Position"
    },
    {
      "name": "EmployeePosition",
      "schema": "dbo",
      "indexes": [
        {
          "name": "IX_EmployeePosition_employeeId",
          "columns": [
            {
              "name": "employeeId",
              "isAscending": true
            }
          ],
          "isUnique": false,
          "isClustered": false
        },
        {
          "name": "IX_EmployeePosition_positionId",
          "columns": [
            {
              "name": "positionId",
              "isAscending": true
            }
          ],
          "isUnique": false,
          "isClustered": false
        }
      ],
      "columns": [
        {
          "name": "id",
          "type": "BIGINT",
          "isNullable": false,
          "isIdentity": true,
          "identityStartValue": 0,
          "identityIncrement": 1,
          "isCalculate": false,
          "isRowflag": false,
          "comment": "Auto generic key column."
        },
        {
          "name": "employeeId",
          "type": "BIGINT",
          "isNullable": true,
          "isIdentity": false,
          "isCalculate": false,
          "isRowflag": false
        },
        {
          "name": "positionId",
          "type": "BIGINT",
          "isNullable": true,
          "isIdentity": false,
          "isCalculate": false,
          "isRowflag": false
        }
      ],
      "foreignKeys": [
        {
          "name": "FK_EmployeePosition_employeeId_TO_Employee_id",
          "columns": [
            "employeeId"
          ],
          "referenceColumns": [
            "id"
          ],
          "referenceTable": "Employee",
          "referenceSchema": "dbo",
          "isCascade": false
        },
        {
          "name": "FK_EmployeePosition_positionId_TO_Position_id",
          "columns": [
            "positionId"
          ],
          "referenceColumns": [
            "id"
          ],
          "referenceTable": "Position",
          "referenceSchema": "dbo",
          "isCascade": false
        }
      ],
      "constraints": [],
      "primaryKey": {
        "name": "PK_EmployeePosition_id",
        "columns": [
          {
            "name": "id",
            "isAscending": true
          }
        ],
        "isNonclustered": false
      }
    },
    {
      "name": "Organization",
      "schema": "dbo",
      "indexes": [
        {
          "name": "IX_Organization_parentId",
          "columns": [
            {
              "name": "parentId",
              "isAscending": true
            }
          ],
          "isUnique": false,
          "isClustered": false
        }
      ],
      "columns": [
        {
          "name": "id",
          "type": "BIGINT",
          "isNullable": false,
          "isIdentity": true,
          "identityStartValue": 0,
          "identityIncrement": 1,
          "isCalculate": false,
          "isRowflag": false
        },
        {
          "name": "name",
          "type": "VARCHAR(MAX)",
          "isNullable": false,
          "isIdentity": false,
          "isCalculate": false,
          "isRowflag": false
        },
        {
          "name": "description",
          "type": "VARCHAR(MAX)",
          "isNullable": true,
          "isIdentity": false,
          "isCalculate": false,
          "isRowflag": false
        },
        {
          "name": "parentId",
          "type": "BIGINT",
          "isNullable": true,
          "isIdentity": false,
          "isCalculate": false,
          "isRowflag": false
        }
      ],
      "foreignKeys": [
        {
          "name": "FK_Organization_parentId_Organization_id",
          "columns": [
            "parentId"
          ],
          "referenceColumns": [
            "id"
          ],
          "referenceTable": "Organization",
          "referenceSchema": "dbo",
          "isCascade": false
        }
      ],
      "constraints": [],
      "primaryKey": {
        "name": "PK_Organization_id",
        "columns": [
          {
            "name": "id",
            "isAscending": true
          }
        ],
        "isNonclustered": false
      }
    },
    {
      "name": "Order",
      "schema": "dbo",
      "indexes": [],
      "columns": [
        {
          "name": "id",
          "type": "BIGINT",
          "isNullable": false,
          "isIdentity": true,
          "identityStartValue": 0,
          "identityIncrement": 1,
          "isCalculate": false,
          "isRowflag": false
        },
        {
          "name": "orderNo",
          "type": "VARCHAR(MAX)",
          "isNullable": false,
          "isIdentity": false,
          "isCalculate": false,
          "isRowflag": false
        },
        {
          "name": "date",
          "type": "DATETIME",
          "isNullable": false,
          "isIdentity": false,
          "isCalculate": false,
          "defaultValue": "sysDateTimeOffset()",
          "isRowflag": false
        },
        {
          "name": "description",
          "type": "VARCHAR(MAX)",
          "isNullable": true,
          "isIdentity": false,
          "isCalculate": false,
          "isRowflag": false
        },
        {
          "name": "rowflag",
          "type": "BINARY(8)",
          "isNullable": false,
          "isIdentity": false,
          "isCalculate": false,
          "isRowflag": true
        }
      ],
      "foreignKeys": [],
      "constraints": [],
      "primaryKey": {
        "name": "PK_Order_id",
        "columns": [
          {
            "name": "id",
            "isAscending": true
          }
        ],
        "isNonclustered": false
      }
    },
    {
      "name": "OrderDetail",
      "schema": "dbo",
      "indexes": [
        {
          "name": "IX_OrderDetail_orderId",
          "columns": [
            {
              "name": "orderId",
              "isAscending": true
            }
          ],
          "isUnique": false,
          "isClustered": false
        }
      ],
      "columns": [
        {
          "name": "id",
          "type": "BIGINT",
          "isNullable": false,
          "isIdentity": true,
          "identityStartValue": 0,
          "identityIncrement": 1,
          "isCalculate": false,
          "isRowflag": false
        },
        {
          "name": "product",
          "type": "VARCHAR(MAX)",
          "isNullable": false,
          "isIdentity": false,
          "isCalculate": false,
          "isRowflag": false
        },
        {
          "name": "count",
          "type": "INT",
          "isNullable": false,
          "isIdentity": false,
          "isCalculate": false,
          "isRowflag": false
        },
        {
          "name": "price",
          "type": "DECIMAL(18, 6)",
          "isNullable": false,
          "isIdentity": false,
          "isCalculate": false,
          "isRowflag": false
        },
        {
          "name": "amount",
          "type": "DECIMAL(18, 2)",
          "isNullable": false,
          "isIdentity": false,
          "isCalculate": false,
          "isRowflag": false
        },
        {
          "name": "orderId",
          "type": "BIGINT",
          "isNullable": false,
          "isIdentity": false,
          "isCalculate": false,
          "isRowflag": false
        },
        {
          "name": "description",
          "type": "VARCHAR(MAX)",
          "isNullable": true,
          "isIdentity": false,
          "isCalculate": false,
          "isRowflag": false
        }
      ],
      "foreignKeys": [
        {
          "name": "FK_OrderDetail_orderId_Order_id",
          "columns": [
            "orderId"
          ],
          "referenceColumns": [
            "id"
          ],
          "referenceTable": "Order",
          "referenceSchema": "dbo",
          "isCascade": false
        }
      ],
      "constraints": [],
      "primaryKey": {
        "name": "PK_OrderDetail_id",
        "columns": [
          {
            "name": "id",
            "isAscending": true
          }
        ],
        "isNonclustered": false
      }
    }
  ],
  "schemas": [],
  "views": [],
  "sequences": [],
  "procedures": [],
  "functions": []
};
export const dialect = 'mssql';
export const hash = "ce878a7d6a3000c1f085b2f7793260b8";
export default schema;
