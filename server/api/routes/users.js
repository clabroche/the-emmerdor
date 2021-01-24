const app = require('express').Router()
const triggeredUsers = require('../../lib/triggeredUsers')
const discord = require('../../lib/discord')


/**
 * Get all users that bot can view (user should be in a channel to be discoverable from bot)
 */
app.get('/users', (req, res) => {
  res.json(Array.from(discord.client.users.cache.values()))
})
/**
 * Get all triggered users 
 */
app.get('/users/triggered', (req, res) => {
  res.json(triggeredUsers.list)
})
/**
 * Get only one triggered user from username
 * @express-param {string} username
 */
app.get('/users/triggered/:username', (req, res) => {
  const user = triggeredUsers.list.filter(user => user.username === req.params.username).pop()
  if (user) {
    res.json(triggeredUsers.list)
  } else {
    res.status(404).send('User not found.')
  }
})

/**
 * ReSync triggered person list
 * @express-body {PersonTrigger[]}
 */
app.post('/users/triggered', async (req, res) => {
  if (!Array.isArray(req.body)) return res.status(400).send('Body should be an array')
  triggeredUsers.list = req.body
  await triggeredUsers.save()
  res.json(req.body)
})

/**
 * Insert or update a triggered user from his username
 * @express-param {string} username
 * @express-body {triggeredUser}
 */
app.post('/users/:username', async (req, res) => {
  if (!req.body || !req.body.username) return res.status(400).send(('username is missing in body'))
  if (!req.body || !req.body.channels) return res.status(400).send(('channels is missing in body'))
  if (!req.body || req.body.channels && !Array.isArray(req.body.channels)) return res.status(400).send(('channels should be an array in body'))

  const user = triggeredUsers.getUser(req.params.username)
  if (user) await triggeredUsers.update(req.body)
  else await triggeredUsers.insert(req.body)

  res.json(triggeredUsers.getUser(req.params.username))
})

/**
 * Get channel name from channelId
 * @param {string} channelId 
 */
function getChannelNameFromChannelId(channelId) {
  // @ts-ignore
  return discord.client.channels.cache.get(channelId).name
}
/**
 * Get channel name from channelId
 * @param {string} channelId
 */
function getGuildNameFromChannelId(channelId) {
  // @ts-ignore
  return discord.client.channels.cache.get(channelId).guild.name
}
module.exports = app