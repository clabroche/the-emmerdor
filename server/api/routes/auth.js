const app = require('express').Router()
const user = require('../models/user')
/**
 * Check if user has type the correct password to get access to front
 * @express-body {string} password
 */
app.post('/auth', async (req, res) => {
  return user.login(req.body.password)
    .then(token => {
      return token 
        ? res.json(token)
        : Promise.reject('Wrong password')
    })
    .catch(err => {
      console.error(err)
      res.status(401).send('Wrong password')
    })
})

/**
 * Check if a token is correct in header
 */
app.post('/auth/is-token-valid', async (req, res) => {
  res.json(user.tokens.includes(req.headers.token))
})
module.exports = app
