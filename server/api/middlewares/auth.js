const user = require('../models/user')
module.exports = function(req,res, next) {
  if(!req.headers.token) {
    return res.status(401).send('Not authenticated')
  }
  user.tokens.includes(req.headers.token)
    ? next()
    : res.status(401).send('Not authenticated')
}