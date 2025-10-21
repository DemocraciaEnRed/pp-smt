const debug = require('debug')
const express = require('express')
const middlewares = require('lib/api-v2/middlewares')
const votesMiddlewares = require('./middlewares')
const apiV2 = require('lib/api-v2/db-api')
const dbApi = require('lib/db-api')
const { db } = require('democracyos-notifier')
const log = debug('democracyos:api-v2:votes')
var initPrivileges = require('lib/middlewares/user').initPrivileges
var canCreate = require('lib/middlewares/user').canCreate
var canManage = require('lib/middlewares/user').canManage

const app = module.exports = express.Router()

app.get('/votes/hasVoted/:dni',
  middlewares.users.restrict, // restringe
  function hasVoted(req, res, next) {
    apiV2.votes.hasVoted({
      dni: req.params.dni
    }).then((hasVoted) => {
      res.status(200).json({
        hasVoted
      })
    })
  })

app.get('/votes/topic/:id',
  middlewares.users.restrict, // restringe
  middlewares.topics.findById,
  function getVotesByTopic(req, res, next) {
    dbApi.vote.getVotesByTopicPopulate(req.topic.id).then((votes) => {
      res.status(200).json(votes)
    })
  })




app.post('/votes/create',
  middlewares.users.restrict, // restringe
  middlewares.forums.findFromBody,
  function checkPadronIfAlreadyVoted(req, res, next) {
    // console.log(req.user);
    req.canManage = req.user.staff || req.forum.hasRole(req.user, 'admin')

    const yearsDefault = req.forum.config.filterYear.split(',')
    let year = yearsDefault.slice(-1)

    if (req.canManage) {
      log('User can manage -- Can add votes for any dni. Checking...')
    } else {
      log('User can not manage, checking if dni in body is the same than the user\'s dni...')
    }
    if (req.canManage || req.user.dni === req.body.dni) {
      dbApi.padron.isInPadron(req.body.dni)
        .then(padron => {
          if (padron) {
            // user is in padron
            log('Checking padron if dni already voted')
            dbApi.vote.getVoteByUserDniInYear(req.body.dni, year[0]).then(vote => {
              if (vote.length) {
                log('User already voted -- sending error')
                // return forbidden
                res.status(403).json({
                  error: `User with dni ${req.body.dni} already voted`
                })
              } else {
                next()
              }
            })
          } else {
            log(`DNI: ${req.body.dni} not found in padron -- creating new entry in padron`)
            dbApi.padron.create({
              dni: req.body.dni
            }, function (err, newPadron) {
              if (err) {
                // return err
                log('Error creating entry for dni %s', req.body.dni)
                res.status(500).json({
                  error: err
                })
              }
              log('OK! New entry in padron with dni %s', newPadron.dni)
              next()
            })
          }
        })
    } else {
      log('User can not manage OR dni in body is not the same that the users dni -- sending error')
      res.status(403).json({ error: 'Forbidden' })
    }
  },
  middlewares.zonas.findFromBody,
  votesMiddlewares.findVoto1FromBody, // Agrega el voto1 al req
  // votesMiddlewares.findVoto2FromBody,// Agrega el voto2 al req
  function postVote(req, res, next) {
    // if req.voto1.zona is different from req.user.zona, return error
    // console.log('Voto1')
    // console.log(req.voto1)
    // console.log('Voto2')
    // console.log(req.voto2)
    // console.log('Zona')
    // console.log(req.zona)
    // if (!req.canManage && req.voto1.zona.toString() !== req.user.zona.toString()) {
    //   log('User is not in the same zona as the vote -- sending error')
    //   res.status(403).json({
    //     error: 'Cant vote projects from different zone'
    //   })
    //   return
    // }

    apiV2.votes.create({
      user: req.user,
      userPrivileges: req.body.userPrivileges,
      dni: req.body.dni,
      zona: req.zona,
      voto1: req.voto1,
      // voto2: req.voto2
    })
      .then((vote) => {
        log('Vote for dni %s created', vote.dni)
        return dbApi.padron.setVoted(vote.dni)
      })
      .then((padron) => {
        log('Voted set to true for dni %s', padron.dni)
        res.status(200).json({
          status: 200,
          results: {
            vote: 'fulfilled'
          }
        })
      })
      .catch((err) => {
        console.log(err)
        // reglas para que devolver errores propios, por ejemplo NOT_VOTED o ALREADY_VOTED
        if (err.code) {
          return next({ status: 400, code: err.code })
        }
        next(err)
      })
  })


app.post('/votes/create-empty-vote',
  middlewares.users.restrict, // restringe
  middlewares.forums.findFromBody,
  initPrivileges, canCreate, canManage,

  function checkPadronIfAlreadyVoted(req, res, next) {
    req.canManage = req.user.staff || req.forum.hasRole(req.user, 'admin', 'moderator')

    const yearsDefault = req.forum.config.filterYear.split(',')
    let year = yearsDefault.slice(-1)

    if (req.canManage) {
      log('User can manage -- Can add votes for any dni. Checking...')
    } else {
      log('User can not manage, checking if dni in body is the same than the user\'s dni...')
    }
    if (req.canManage || req.user.dni === req.body.dni) {
      dbApi.padron.isInPadron(req.body.dni)
        .then(padron => {
          if (padron) {
            // user is in padron
            log('Checking padron if dni already voted')
            dbApi.vote.getVoteByUserDniInYear(req.body.dni, year[0]).then(vote => {
              if (vote.length) {
                log('User already voted -- sending error')
                // return forbidden
                res.status(403).json({
                  error: `User with dni ${req.body.dni} already voted`
                })
              } else {
                next()
              }
            })
          } else {
            log(`DNI: ${req.body.dni} not found in padron -- creating new entry in padron`)
            dbApi.padron.create({
              dni: req.body.dni
            }, function (err, newPadron) {
              if (err) {
                // return err
                log('Error creating entry for dni %s', req.body.dni)
                res.status(500).json({
                  error: err
                })
              }
              log('OK! New entry in padron with dni %s', newPadron.dni)
              next()
            })
          }
        })
    } else {
      log('User can not manage OR dni in body is not the same that the users dni -- sending error')
      res.status(403).json({ error: 'Forbidden' })
    }
  },

  middlewares.zonas.findFromBody,
  function postVote(req, res, next) {
    apiV2.votes.create({
      user: req.user,
      userPrivileges: req.body.userPrivileges,
      dni: req.body.dni,
      urna: req.zona,
      voto1: req.voto1,
      // voto2: req.voto2
    })
      .then((vote) => {
        log('Vote for dni %s created', vote.dni)
        return dbApi.padron.setVoted(vote.dni)
      })
      .then((padron) => {
        log('Voted set to true for dni %s', padron.dni)
        res.status(200).json({
          status: 200,
          results: {
            vote: 'fulfilled'
          }
        })
      })
      .catch((err) => {
        console.log(err)
        // reglas para que devolver errores propios, por ejemplo NOT_VOTED o ALREADY_VOTED
        if (err.code) {
          return next({ status: 400, code: err.code })
        }
        next(err)
      })
  })



app.post('/votes/:id/addVotes',
  middlewares.users.restrict, // restringe
  middlewares.topics.findById,
  function postVotes(req, res, next) {
    const votes = []
    for (var i = 0; i < req.body.quantity; i++) {
      votes.push({
        user: req.user.id,
        userPrivileges: req.body.userPrivileges,
        dni: '',
        zona: req.topic.zona,
        voto1: req.topic.id,
        urna: req.body.ballotBox
      })
    }
    if (votes.length) {
      apiV2.votes.createMany(votes)
        .then((vote) => {
          res.status(200).json({
            status: 200,
            results: {
              vote: 'fulfilled'
            }
          })
        })
        .catch((err) => {
          console.log(err)
          // reglas para que devolver errores propios, por ejemplo NOT_VOTED o ALREADY_VOTED
          if (err.code) {
            return next({ status: 400, code: err.code })
          }
          next(err)
        })
    }
    //
  }

)