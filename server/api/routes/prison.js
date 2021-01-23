const app = require('express').Router()
const discord = require('../../lib/discord')
const prison = require('../../lib/prison')
const fse = require('fs-extra')
const path = require('path')
const prisonJSON = path.resolve(__dirname, '..', '..', 'configs', 'prison.json')

app.get('/prisonVocalID', (req, res) => {
  res.json(prison.prisonChannel.id)
})

app.get('/actualPrisonMusic', (req, res) => {
  res.json(prison.prisonChannel.music)
})

app.post('/changePrisonVocalID', async (req, res) => {
  let isNan = Number.isNaN(+req.body.id);
  if (!isNan) {
    let json = prison.prisonChannel
    if (!json) return res.status(400).send("error with json file")
    json.id = req.body.id
    await fse.writeJSON(prisonJSON, json)
    prison.prisonChannel = json
    prison.join(discord.prison.channels.cache.get(req.body.id))
    res.json(req.body.id)
  } else {
    return res.status(400).send("the value must to be digits")
  }
})

app.post('/changePrisonMusic', async (req, res) => {
  let json = prison.prisonChannel
  if (!json) return res.status(400).send("error with json file")
  json.music = req.body.music
  await fse.writeJSON(prisonJSON, json)
  prison.prisonChannel = json
  await new Promise(res => setTimeout(res, 500))
  prison.join(discord.prison.channels.cache.get(json.id))
  res.json(req.body.id)
})
module.exports = app
