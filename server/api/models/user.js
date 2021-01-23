const bcrypt = require('bcrypt')
const uuid = require('uuid').v4
const fse = require('fs-extra')
const path = require('path')
const tokensPath = path.resolve(__dirname, '..', '..', 'configs', 'tokens.json')
module.exports = {
  tokens: loadTokens(),
  hashedPassword: process.env.PASSWORD,
  async login(password) {
    const logged = await bcrypt.compare(password, this.hashedPassword)
    if(logged) {
      const token = uuid()
      this.tokens.push(token)
      await saveTokens(this.tokens)
      return token
    }
    return null
  }
}
function loadTokens() {
  if(!fse.existsSync(tokensPath)) fse.writeJSONSync(tokensPath, [])
  return fse.readJSONSync(tokensPath)
}
async function saveTokens(tokens) {
  return fse.writeJSON(tokensPath, tokens)
}