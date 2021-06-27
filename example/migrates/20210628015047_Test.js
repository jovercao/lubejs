const {
  Migrate,
  Statement,
  SqlBuilder: SQL,
  DbType,
  MigrateBuilder,
} = require('lubejs');

exports.Test = class Test {
  async up(builder, dialect) {
    builder.sql(SQL.note('这是一个测试的up'))
  }

  async down(
    builder,
    dialect
  ) {
    builder.sql(SQL.comment('这是一个测试的down'))
  }
}

exports.default = exports.Test;
