const dbReady = require('lib/models').ready

const Text = require('lib/models').Text

const textsData = [

  //home
  { "name": "home-title", "text": "Presupuesto Participativo de San Miguel de Tucumán" },
  { "name": "home-subtitle", "text": "REGISTRATE" },
  { "name": "home-subtitle-text", "text": "Del 10 al 15 de octubre empieza la votación del presupuesto participativo! Conocé los proyectos y votá!" },
  { "name": "home-video1-mp4", "text": "https://cldup.com/pQZlAEpzw0.mp4" },
  { "name": "home-video1-webm", "text": "https://cldup.com/b5-PScfd-V.webm" },
  { "name": "home-video2-mp4", "text": "https://cldup.com/w4RSGFJStA.mp4" },
  { "name": "home-video2-webm", "text": "https://cldup.com/0Cy2GaQ-cR.webm" },
  { "name": "home-icono1-imagen", "text": "ext/lib/site/home-multiforum/enterate.png" },
  { "name": "home-icono1-titulo", "text": "¿QUÉ ES?" },
  { "name": "home-icono1-texto", "text": "El Presupuesto Participativo es una herramienta de participación ciudadana que permite a vecinos y vecinas de San Miguel de Tucumán proponer, debatir y decidir de manera directa cómo se invierte una parte del presupuesto municipal." },
  { "name": "home-icono2-imagen", "text": "ext/lib/site/home-multiforum/participa.png" },
  { "name": "home-icono2-titulo", "text": "¿CÓMO PUEDO PARTICIPAR?" },
  { "name": "home-icono2-texto", "text": "Desde el 1ro al 7 de octubre podés proponer ideas vinculadas a espacio público, accesibilidad, ambiente, deporte, cultura, inclusión, tecnología y más. Las propuestas viables se convertirán en proyectos que serán votados por la comunidad. Los más elegidos serán ejecutados por el Municipio." },
  { "name": "home-icono3-imagen", "text": "ext/lib/site/home-multiforum/seguimos.png" },
  { "name": "home-icono3-titulo", "text": "¿CUÁLES SON LOS PRÓXIMOS PASOS?" },
  { "name": "home-icono3-texto", "text": "Luego del cierre de la etapa de ideas, las propuestas se evaluarán técnica y presupuestariamente. Las seleccionadas pasarán a la votación abierta. También podrás seguir el avance de los proyectos ganadores directamente desde la plataforma:" },

  { "name": "home-encuentro-title", "text": "NOVEDADES Y PRÓXIMOS ENCUENTROS" },
  { "name": "home-encuentro-subtitle", "text": "Agendate la reunión de tu barrio y presentá tus ideas." },

  //baner 1 
  { "name": "home-banner-image", "text": '/ext/lib/site/banner-invitacion/icon-votar.png' },
  { "name": "home-banner-title", "text": '¡Próximamente abrirá la etapa de subida de ideas' },
  { "name": "home-banner-text", "text": 'Te invitamos a registrarte para notificarte cuando la misma este disponible, que puedas compartir tus ideas con la comunidad. Tambien podes conocer el avance de los proyectos del 2025' },

  { "name": "home-banner-button1-text", "text": 'REGISTRATE' },
  { "name": "home-banner-button1-link", "text": "/propuestas" },
  { "name": "home-banner-button2-text", "text": 'PROYECTOS 2025' },
  { "name": "home-banner-button2-link", "text": '/votacion' },

  //ideas y proyectos
  { "name": "idea-title", "text": "Ideas y Proyectos" },
  {
    "name": "idea-subtitle", "text": 'Conocé los proyectos ganadores del Presupuesto Participativo 2025'
  },

  //archivo
  { "name": "archivo-title", "text": "Archivo de proyectos" },
  { "name": "archivo-subtitle", "text": "Aquí podes visualizar los proyectos de años anteriores" },

  //votacion
  { "name": "votacion-title", "text": 'VOTACIÓN DEL PRESUPUESTO PARTICIPATIVO 2025' },
  { "name": "votacion-subtitle", "text": "Gracias por participar de la votación del presupuesto participativo 2025" },
  { "name": "votacion-steps", "text": "<div style='text-align: center;'><span style='font-size: 24px;'>Pasos y reglas para la votación</span></div><div class='wrapper'><br></div><ul><li class='wrapper'>Tenés <b>1 votos disponibles</b>.</li><li class='wrapper'>Podés votar un proyecto del distrito donde vivís.</li></ul>" },

  //footer
  {
    "name": "footer-info", "text": '<strong>Municipalidad de San Miguel de Tucumán</strong><br>  9 de Julio 570<br>  SMT, Tucumán T4000IHL<br>  Argentina<br>  <a href="tel: +543814516500">+54 381 4516500</a> int. 6517'
  }

]

/**
 * Make any changes you need to make to the database here
 */
class SaltearPromises { }
exports.up = function up(done) {
  dbReady()
    // Primero chequear si ya no hay cosas cargadas
    .then(() => {
      return new Promise((resolve, reject) => {
        Text.collection.count({}, (err, count) => {
          if (err) reject(new Error(err))
          if (count) {
            console.log('Ya hay textos de portada cargados (%s), salteando migración', count)
            reject(new SaltearPromises())
          }
          resolve()
        })
      })
    })
    // Agregamos textos
    .then(() => Text.collection.insertMany(textsData))
    // Devolvemos al Migrator (de lib/migrations)
    .then(() => {
      console.log(`-- Agregados textos de portada`)
      done()
    })
    .catch((err) => {
      if (err instanceof SaltearPromises)
        done()
      else {
        console.log('-- Actualizacion de textos de portada no funcionó! Error: ', err)
        done(err)
      }
    })
}

/**
 * Make any changes that UNDO the up function side effects here (if possible)
 */
exports.down = function down(done) {
  done();
};
