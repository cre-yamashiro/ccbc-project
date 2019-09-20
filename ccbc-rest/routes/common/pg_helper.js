/**
 * poatgreSQLに接続してSQLを実行する
 * @param sql 実行したいSQL
 * @param values SQLに指定するパラメータ
 * @param callback SQL実行後、処理するイベント
 */
exports.query = function(sql, values, callback) {
  console.log(sql, values)
  // const databaseURL = 'postgres://postgres:pgadmin@localhost:5432/postgres'
  // const databaseURL = 'postgres://vagrant:vagrant@192.168.0.62:5432/mvpsys'
  // const databaseURL = 'postgres://credb:credb@118.27.23.20:5432/crecoin'
  const databaseURL = 'postgres://credb:credb@118.27.23.20:5432/harvest'
  // const databaseURL = 'postgres://credb:credb@118.27.23.20:5432/harvest-demo'
  // const databaseURL = 'postgres://credb:credb@118.27.0.221:5432/harvest'
  // const databaseURL = 'postgres://credb:credb@118.27.0.221:5432/test'
  const pg = require('pg')
  const client = new pg.Client(databaseURL)
  client.connect(err => {
    if (err) {
      return callback(err)
    }
    try {
      client.query(sql, values, (err, res) => {
        if (err) {
          callback(err)
          return
        }
        client.end()
        callback(null, res.rows)
      })
    } catch (e) {
      callback(e)
    }
  })
}
