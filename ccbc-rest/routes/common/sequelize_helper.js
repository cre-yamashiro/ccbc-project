const Sequelize = require('sequelize')

exports.sequelize = new Sequelize(
  // 'postgres://postgres:pgadmin@localhost:5432/postgres',
  // 'postgres://vagrant:vagrant@192.168.0.62:5432/mvpsys',
  // 'postgres://credb:credb@118.27.23.20:5432/crecoin',
  'postgres://credb:credb@118.27.23.20:5432/harvest',
  // 'postgres://credb:credb@118.27.23.20:5432/harvest-demo',
  // 'postgres://credb:credb@118.27.0.221:5432/harvest',
  // 'postgres://credb:credb@118.27.0.221:5432/test',
  {
    dialect: 'postgres',
    operatorsAliases: false,
    timezone: '+09:00'
  }
)

exports.sequelize2 = new Sequelize(
  // 'postgres://postgres:pgadmin@localhost:5432/harvest-group',
  'postgres://credb:credb@118.27.23.20:5432/harvest-group',
  // 'postgres://credb:credb@118.27.0.221:5432/harvest-group',
  {
    dialect: 'postgres',
    operatorsAliases: false,
    timezone: '+09:00'
  }
)

exports.sequelize3 = function(db_name) {
  console.log('sequelize3')
  console.log('db_name:' + db_name)
  return new Sequelize(
    // 'postgres://postgres:pgadmin@localhost:5432/' + db_name,
    'postgres://credb:credb@118.27.23.20:5432/' + db_name,
    // 'postgres://credb:credb@118.27.0.221:5432/' + db_name,
    {
      dialect: 'postgres',
      operatorsAliases: false,
      timezone: '+09:00'
    }
  )
}
