const dbReady = require('lib/models').ready

const aboutUs = require('lib/models').aboutUs

const aboutUsData = [
  { 'order': 1, 'question': '+ ¿Qué es el Presupuesto Participativo?', 'answer': '<p >Es un mecanismo de participación ciudadana que permite a los vecinos proponer y decidir directamente en qué se invertirá una parte del presupuesto municipal.</p>' },
  { 'order': 2, 'question': '+ ¿Qué tipo de proyectos se pueden desarrollar?', 'answer': '<p>Los proyectos pueden presentarse en tres grandes categorías:</p><ul><li><strong>Espacio socioambiental:</strong> plazas, espacios verdes y mejoras ambientales.</li><li><strong>Espacio deportivo y cultural:</strong> centros culturales, bibliotecas y espacios artísticos comunitarios.</li><li><strong>Espacio de innovación urbana:</strong> corredores seguros, espacios de encuentro, Salón de Usos Múltiples, entre otros.</li></ul>' },
  { 'order': 3, 'question': '+ ¿Cómo puedo participar?', 'answer': '<p>Podés hacerlo de dos maneras:</p><ul><li><strong>Acercando tu idea:</strong> presentar propuestas que luego podrán transformarse en proyectos.</li>  <li><strong>Eligiendo:</strong> participar en la votación de los proyectos que más te interesen.</li></ul>' },
  { 'order': 4, 'question': '+ ¿Cómo me empadrono para votar?', 'answer': '<p>Podés empadronarte de dos formas:</p><ul><li><strong>De manera virtual:</strong> haciéndote ciudadano digital (CIDITUC) a través de la página oficial de la Municipalidad.</li><li><strong>De manera presencial:</strong> en las asambleas participativas, donde te ayudaremos a inscribirte al CIDITUC.</li></ul>' },
  { 'order': 5, 'question': '+ ¿Cuándo se seleccionan o votan los proyectos?', 'answer': '<p >En <strong>octubre de 2025</strong> se realizará una elección pública de proyectos. El que resulte ganador será incorporado al presupuesto municipal del año siguiente.</p>' },
  { 'order': 6, 'question': '+ ¿Cuál es el calendario del proceso?', 'answer': '<p ><ul><li><strong>Mayo – Julio 2025:</strong> Lanzamiento del programa de Presupuesto Participativo.</li><li><strong>Junio – Septiembre 2025:</strong> Presentación de ideas y proyectos.</li><li><strong>Octubre 2025:</strong> Elección pública de los proyectos a implementar.</li><li><strong>2026:</strong> Ejecución de los proyectos ganadores con presupuesto asignado.</li></ul></p>' },
]

/**
 * Make any changes you need to make to the database here
 */
exports.up = function up(done) {
  dbReady()
    // Primero chequear si ya no hay cosas cargadas
    .then(() => {
      return new Promise((resolve, reject) => {
        aboutUs.collection.count({}, (err, count) => {
          if (err) reject(new Error(err))
          if (count) {
            console.log('Ya hay (%s) preguntas y respuestas cargadas', count)
            reject(new SaltearPromises())
          }
          resolve()
        })
      })
    })
    // Agregamos preguntas y respuestas
    .then(() => aboutUs.collection.insertMany(aboutUsData))
    // Devolvemos al Migrator (de lib/migrations)
    .then(() => {
      console.log(`-- Agregadas las preguntas y respuestas de la seccion "acerca de"`)
      done()
    })
    .catch((err) => {
      if (err instanceof SaltearPromises) {
        done()
      } else {
        console.log('-- Actualizacion de acerca de no funcionó! Error: ', err)
        done(err)
      }
    })
}

/**
 * Make any changes that UNDO the up function side effects here (if possible)
 */
exports.down = function down(done) {
  done()
}



