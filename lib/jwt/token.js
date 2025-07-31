var log = require('debug')('democracyos:jwt:token')
var moment = require('moment')
var jwt = require('jwt-simple')
var config = require('lib/config')
const fetch = require('node-fetch')

exports.encode = function encode(user) {
  var expires = moment().add(15, 'days').valueOf()

  var token = jwt.encode({
    iss: user.id,
    exp: expires
  }, config.jwtSecret)

  return {
    token: token,
    expires: expires
  }
}

async function getUserInfo(token) {
  const response = await fetch('https://estadisticas.smt.gob.ar:5000/usuarios/authStatus', {
    headers: {
      'Authorization': `${token}`
    }
  });

  const user = await response.json();
  return (user)

}

exports.decode = async function decode(encoded, cb) {
  try {
    log('Attempting to decode token...')

    const cidiTucUser = await getUserInfo(encoded)

    var User = require('lib/models').User

    User.findOne({
      email: cidiTucUser.usuarioSinContraseña.email_persona
    }, function (err, user) {
      if (err) log('Token has been decoded, but user fetching failed with the following error: %s', err)
      if (!cidiTucUser) {
        log('Token has been decoded, but user was not found')
        return cb(new Error('No user for token %s', encoded))
      }

      log('Token decoded successfully')

      return cb(err, user, cidiTucUser.usuarioSinContraseña)
    })
  } catch (err) {
    log('Cannot decode token: %s', err)
    return cb(err)
  }
}