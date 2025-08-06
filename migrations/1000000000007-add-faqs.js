const dbReady = require('lib/models').ready

const aboutUs = require('lib/models').aboutUs

const aboutUsData = [
  { 'order': 1, 'question': '+ ¿Quiénes pueden participar?', 'answer': '<p>Pueden participar del Presupuesto Participativo todos los vecinos y vecinas mayores de 16 años que residan, trabajen o estudien en San Miguel de Tucumán.</p>' },
  { 'order': 2, 'question': '+ ¿Cuál es el objetivo del Presupuesto Participativo?', 'answer': '<p className="p-padding">El objetivo es que la ciudadanía proponga, debata y elija proyectos que mejoren la ciudad. Se busca promover la participación activa y democrática en la asignación de parte del presupuesto municipal, fortaleciendo el vínculo entre comunidad y gobierno.</p>' },
  { 'order': 3, 'question': '+ ¿Cuál es el monto asignado al Presupuesto Participativo?', 'answer': '<p className="p-padding">El monto total destinado al programa en esta edición es de <strong>$100.000.000</strong> (cien millones de pesos) según el Decreto 981/24..</p>' },
  { 'order': 4, 'question': '+ ¿Hay un límite de presupuesto por proyecto?', 'answer': '<p className="p-padding">Sí.Cada proyecto podrá solicitar hasta <strong>$10.000.000</strong> como máximo.Las ideas que superen ese monto no serán admitidas.</p>' },
  { 'order': 5, 'question': '+ ¿Cómo participo?', 'answer': '<p className="p-padding"><ul><li> Primero debés registrarte en la plataforma.</li><li> Luego, podés presentar tu idea, elegir una temática y explicarla con claridad.</li><li> También podés apoyar otras ideas, comentarlas y participar del diálogo.</li><li> En la etapa de votación, cada persona podrá elegir un proyecto que quiera que se concreten.</li></ul><div><br></div></p>' },
  { 'order': 6, 'question': '+ ¿Cómo subo una idea?', 'answer': '<p className="p-padding"><ol><li>Ingresá a la sección “Proponé tu idea”.</li><li>Elegí una línea estratégica.</li><li>Poné un título claro.</li><li>Explicá tu idea respondiendo: ¿Qué? ¿Cómo? ¿Cuándo? ¿Dónde? ¿Por qué?</li></ol><div>\t\tAsegurate de leer el reglamento antes de enviarla.</div></p>' },
  { 'order': 7, 'question': '+ ¿Cuáles son los ejes temáticos para proponer ideas?', 'answer': '<div>Las ideas deben encuadrarse en una de estas líneas estratégicas:</div><ol><li>Ambiente y Sostenibilidad.</li><li>Deporte y Vida Saludable.</li><li>Espacio Público y Movilidad.</li><li>Inclusión y Género.</li><li>Educación y Cultura.</li><li>Tecnología e Innovación.</li></ol>' },
  { 'order': 8, 'question': '+ ¿Qué tipo de ideas se pueden presentar?', 'answer': '<div>¿Qué tipo de ideas se pueden presentar?</div><div>\t✅ Ideas realizables dentro del ejido municipal.</div><div>\t✅ Que beneficien a la comunidad en su conjunto.</div><div>\t✅ Viables técnicamente y dentro del presupuesto asignado.</div><div>\t✅ Alineadas con los ejes temáticos.</div>' },
  { 'order': 9, 'question': '+ ¿Qué ideas no están permitidas?', 'answer': '<div>❌ Contratación permanente de personal o servicios.</div><div>❌ Obras de infraestructura de gran escala, compra de terrenos o construcción de edificios.</div><div>❌ Proyectos con plazos de ejecución que superen el período de gestión vigente.</div>' },
  { 'order': 10, 'question': '+ ¿Puedo modificar mi idea una vez enviada?', 'answer': '<p className="p-padding">Sí. Podés editar tu idea todas las veces que quieras </strong>durante la etapa de propuestas</strong>.</p>' },
  { 'order': 11, 'question': '+ ¿Cuántas ideas puedo subir?', 'answer': '<p className="p-padding">Podés presentar <strong>todas las ideas que desees</strong>, siempre que cada una esté en un formulario distinto.</p>' },
  { 'order': 12, 'question': '+ ¿Cuándo inicia y cierra la instancia de propuestas?', 'answer': '<p className="p-padding">📅 La etapa de carga de ideas se extiende del 5 al 23 de agosto de 2024.</p>' },
  { 'order': 13, 'question': '+ ¿Qué pasará con mi idea?', 'answer': '<div>✔ Las ideas serán publicadas para recibir comentarios.</div><div>✔ Luego se evaluarán su factibilidad y ajuste al reglamento.</div><div>✔ Las que cumplan los requisitos pasarán a la etapa de votación como proyectos.</div>' },
  { 'order': 14, 'question': '+ ¿Debo participar en la formulación del proyecto si mi idea avanza?', 'answer': '<p className="p-padding">Sí. Serás convocado/a por el equipo técnico para colaborar en la elaboración final del proyecto. Es fundamental para mantener el espíritu participativo del programa.</p>' },
  { 'order': 15, 'question': '+ ¿Puedo sumarme si no participé antes?', 'answer': '<p className="p-padding">¡Sí! Aunque no hayas enviado ideas ni comentado, <strong>podés votar</strong> en la instancia correspondiente.</p>' },
  { 'order': 16, 'question': '+ ¿Cómo se eligen los proyectos ganadores?', 'answer': '<p className="p-padding">Mediante <strong>votación abierta</strong> de la ciudadanía. Se seleccionarán los proyectos más votados hasta agotar el presupuesto disponible.</p>' },
  { 'order': 16, 'question': '+ ¿Puedo votar más de una vez?', 'answer': '<p className="p-padding">No, cada persona podrá votar <strong>únicamente</strong> una sola vez.</p>' },



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
