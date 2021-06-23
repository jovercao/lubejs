import { MigrationBuilder, Migrate } from '../../src';

export class xxx implements Migrate {
  up(migrate: MigrationBuilder) {
    migrate.createTable({
      name: 'Order',
      columns: [
        { type: 'INT', name: 'id', isNullable: false },
        { type: 'VARCHAR(MAX)', name: 'orderNo', isNullable: false },
        {
          type: 'DATETIMEOFFSET(7)',
          name: 'date',
          isNullable: false,
          defaultValue: 'sysDateTimeOffset()',
        },
        { type: 'VARCHAR(MAX)', name: 'description', isNullable: true },
      ],
      foreignKeys: [],
      constraints: [],
    });
    migrate.createTable({
      name: 'OrderDetail',
      columns: [
        { type: 'INT', name: 'id', isNullable: false },
        { type: 'VARCHAR(MAX)', name: 'product', isNullable: false },
        { type: 'INT', name: 'count', isNullable: false },
        { type: 'NUMERIC(18, 6)', name: 'price', isNullable: false },
        { type: 'NUMERIC(18, 2)', name: 'amount', isNullable: false },
        { type: 'INT', name: 'orderId', isNullable: false },
      ],
      foreignKeys: [
        {
          name: 'OrderDetail_orderId_Order_[object Object]',
          referenceTable: 'Order',
          foreignColumns: ['orderId'],
          referenceColumns: ['id'],
        },
      ],
      constraints: [],
    });
    migrate.createTable({
      name: 'Position',
      columns: [
        { type: 'INT', name: 'id', isNullable: false },
        { type: 'VARCHAR(MAX)', name: 'name', isNullable: false },
        { type: 'VARCHAR(MAX)', name: 'description', isNullable: true },
      ],
      foreignKeys: [],
      constraints: [],
    });
    migrate.createTable({
      name: 'Employee',
      columns: [
        { type: 'INT', name: 'id', isNullable: false },
        { type: 'VARCHAR(100)', name: 'name', isNullable: true },
      ],
      foreignKeys: [],
      constraints: [],
    });
    migrate.createTable({
      name: 'EmployeePosition',
      columns: [
        {
          type: 'INT',
          name: 'id',
          isNullable: false,
          isIdentity: true,
          identityStartValue: 0,
          identityIncrement: 1,
        },
        {
          type: 'INT',
          name: 'PositionId',
          isNullable: false,
          isIdentity: false,
          isCalculate: false,
        },
        {
          type: 'INT',
          name: 'EmployeeId',
          isNullable: false,
          isIdentity: false,
          isCalculate: false,
        },
      ],
      foreignKeys: [
        {
          name: 'EmployeePosition_PositionId_Position_[object Object]',
          referenceTable: 'Position',
          foreignColumns: ['PositionId'],
          referenceColumns: ['id'],
        },
        {
          name: 'EmployeePosition_EmployeeId_Employee_[object Object]',
          referenceTable: 'Employee',
          foreignColumns: ['EmployeeId'],
          referenceColumns: ['id'],
        },
      ],
      constraints: [],
    });
  }

  down(migrate: MigrationBuilder) {
    migrate.dropTable('Order');
    migrate.dropTable('OrderDetail');
    migrate.dropTable('Position');
    migrate.dropTable('Employee');
    migrate.dropTable('EmployeePosition');
  }
}

export default xxx;
