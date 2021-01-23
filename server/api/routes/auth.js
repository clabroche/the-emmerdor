const app = require('express').Router()
/**
 * Check if user has type the correct password to get access to front
 * (Very bad: we need to hash password with bcrypt, send a token to user and validate all others routes with this token to protect them)
 * @express-body {string} password
 */
app.post('/auth', (req, res) => {
  const password = process.env.PASSWORD
  if (password === req.body.password) {
    return res.json(true)
  }
  res.json(false)
})
module.exports = app
