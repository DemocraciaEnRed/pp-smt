const dbReady = require('lib/models').ready
const models = require('lib/models')

const nombreMigrationParaLog = 'cargar zonas'
const Zona = models.Zona

const zonas = [
  {
    nombre: 'Distrito 1',
    numero: 1
  },
  {
    nombre: 'Distrito 2',
    numero: 2
  },
  {
    nombre: 'Distrito 3',
    numero: 3
  },
  {
    nombre: 'Distrito 4',
    numero: 4
  },
  {
    nombre: 'Distrito 5',
    numero: 5
  },
  {
    nombre: 'Distrito 6',
    numero: 6
  },
  {
    nombre: 'Distrito 7',
    numero: 7
  },
  {
    nombre: 'Distrito 8',
    numero: 8
  },
  {
    nombre: 'Distrito 9',
    numero: 9
  },
  {
    nombre: 'Distrito 10',
    numero: 10
  },
  {
    nombre: 'Distrito 11',
    numero: 11
  },
  {
    nombre: 'Distrito 12',
    numero: 12
  },
  {
    nombre: 'Distrito 13',
    numero: 13
  },
  {
    nombre: 'Distrito 14',
    numero: 14
  },
  {
    nombre: 'Distrito 15',
    numero: 15
  },
  {
    nombre: 'Distrito 16',
    numero: 16
  },
  {
    nombre: 'Distrito 17',
    numero: 17
  },
  {
    nombre: 'Distrito 18',
    numero: 18
  },
  {
    nombre: 'Distrito 19',
    numero: 19
  },
  {
    nombre: 'Distrito 20',
    numero: 20
  },
]

/**
 * Make any changes you need to make to the database here
 */
exports.up = function up(done) {
  // done() devuelve al Migrator de lib/migrations
  dbReady()

    // Primero chequear si ya no hay cosas cargadas
    .then(() => {
      return new Promise((resolve, reject) => {
        Zona.collection.count({}, (err, count) => {
          if (err) reject(new Error(err))
          if (count) {
            console.log('Ya hay zonas cargadas (%s), salteando migración', count)
            reject(new SaltearPromises())
          }
          resolve()
        })
      })
    })

    // Agregamos data
    .then(() => Zona.collection.insertMany(zonas))

    // Todo OK
    .then(() => {
      console.log(`-- Migración ${nombreMigrationParaLog} exitosa`)
      done()
    })
    // Error
    .catch((err) => {
      console.log(`-- Migración ${nombreMigrationParaLog} no funcionó! Error: ${err}`)
      done(err)
    })
}

/**
 * Make any changes that UNDO the up function side effects here (if possible)
 */
exports.down = function down(done) {
  done();
};
