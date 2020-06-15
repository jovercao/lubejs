class Queryable {
  constructor(table, queryInfo) {
    this.table = table
    const { where, offset, limit } = queryInfo
  }
}
