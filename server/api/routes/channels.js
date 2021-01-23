const app = require('express').Router()
const discord = require('../../lib/discord')

/**
 * Get all voice channels where the bot can be here
 */
app.get('/channels', (req, res) => {
  const channels = Array
    .from(discord.client.channels.cache.values())
    .filter(channel => channel.type === 'voice')
    .map(channel => {
      // @ts-ignore
      channel.guildName = channel.guild.name
      return channel
    })
  res.json(channels)
})
module.exports = app