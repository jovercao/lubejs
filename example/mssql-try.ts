import mssql from 'mssql';

(async function() {
  const pool = new mssql.ConnectionPool({
    server: 'jover.wicp.net',
    port: 2433,
    user: 'sa',
    password: '!crgd-2019'
  });

  pool.query('use Test;')
})();
