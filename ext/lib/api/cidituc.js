const express = require('express')
const passport = require('passport')
const CustomStrategy = require("passport-custom")
const User = require('lib/models').User
const jwt = require('lib/jwt')
const fetch = require('node-fetch')
const dbApi = require('lib/db-api')
const { log } = require('gulp-util')

const app = module.exports = express()


app.get('/login', (req, res) => {
  res.redirect('https://ciudaddigital.smt.gob.ar/#/login?next=presupuesto-participativo');
});

function assignProfile(user, profile, accessToken, fn) {
  try {

    user.set('profiles.custom', profile)
    user.set('emailValidated', true)
    user.set('extra.verified', true)

    if (profile.id_persona) {
      user.set('cidiTucId', profile.id_persona)
    }

    if (profile.nombre_persona) {
      user.set('firstName', profile.nombre_persona)
    }

    if (profile.apellido_persona) {
      user.set('lastName', profile.apellido_persona)
    }

    if (profile.email_persona) {
      user.set('email', profile.email_persona)
    }
    if (profile.documento_persona) {
      user.set('dni', profile.documento_persona)
    }


    user.save(fn)
    dbApi.padron.create({ dni: profile.documento_persona }, function (err, newPadron) {
      if (err) return next(err)
      log('OK! New entry in padron')
      dbApi.padron.updateUserId(profile.documento_persona, user.id).then(() => {
        log('OK! assign padron to user ' + user.id)
      })
    })

  } catch (err) {
    console.error(err)
    return fn(new Error('Error al guardar usuario de CidiTuc.'), user)
  }
}

passport.use(
  "custom-auth",
  new CustomStrategy(async (req, done) => {
    try {
      // Extraer el token desde la query
      const token = req.query.auth;
      if (!token) return done(null, false, { message: "Token requerido" });

      // Consultar la API externa para obtener los datos del usuario
      const response = await fetch("https://estadisticas.smt.gob.ar:5000/usuarios/authStatus", {
        headers: { Authorization: `${token}` },
      });


      let cidiTucUser = await response.json();
      cidiTucUser = cidiTucUser.usuarioSinContraseña
      if (response.status !== 200 || !cidiTucUser) {
        return done(null, false, { message: "Error al obtener el usuario de CidiTuc" });
      }
      var email = cidiTucUser.email_persona

      User.findByEmail(email, function (err, user) {
        if (err) return done(err)

        if (!user) {
          if (email) {
            User.findByEmail(email, function (err, userWithEmail) {
              if (err) return done(err)

              if (userWithEmail) {
                assignProfile(userWithEmail, cidiTucUser, token, done)
              } else {
                assignProfile(new User(), cidiTucUser, token, done)
              }
            })
          } else {
            assignProfile(new User(), cidiTucUser, token, done)
          }

          return
        }

        if (user.email !== email) {
          user.set('email', email)
          user.set('profiles.custom.email', email)
        }

        if (user.profiles.custom.deauthorized) {
          user.set('profiles.custom.deauthorized')
        }

        user.isModified() ? user.save(done) : done(null, user)


      })
    } catch (error) {
      return done(error, false);
    }
  })
);

// Serialización (opcional si usas sesiones)
passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((obj, done) => done(null, obj));



app.get(
  "/",
  passport.authenticate("custom-auth", { session: false, failureRedirect: '/' }),
  (req, res) => {
    const token = req.query.auth;
    if (!token) return done(null, false, { message: "Token requerido" });
    jwt.setUserOnCookie(token, res)
    res.redirect('/');
  }
);
