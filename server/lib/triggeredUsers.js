const Discord = require('discord.js')
const discord = require('./discord')
const fse = require('fs-extra')
const path = require('path')
const jsonPath = path.resolve(__dirname, '..','configs','triggeredUsers.json')

/** Load on startup config from file (later on DB) (setTimeout is bad but i code this for development rapidity) */
setTimeout(() => {
  if (!fse.existsSync(jsonPath)) {
    module.exports.save()
  } else {
    module.exports.list = fse.readJsonSync(jsonPath)
  }
}, 1000);

/**
 * All persons that have at least one trigger 
 */
module.exports = {
  /** @type {PersonTrigger[]} */
  list: [],
  /**
   * Send an embedded message to discord with all configured triggers
   */
  display() {
    const description = this.list.map(user => createUserEmbededDescription(user)).join('\n')
    const embbed = createEmbededReport(true, description, 'Users triggered')
    discord.send(embbed)
  },
  /**
   * Get a user if he has a trigger configured for him
   * @param {string} username 
   */
  getUser(username) {
    return this.list.filter(user => user.username === username).pop()
  },
  /**
   * Save a person that have been inserted from API
   * @param {PersonTrigger} user 
   */
  async insert(user) {
    user.channels.forEach(channel => {
      channel.name = getChannelNameFromChannelId(channel.id)
      channel.guildName = getGuildNameFromChannelId(channel.id)
    });
    this.list.push(user)
    await this.save()
    const description = createUserEmbededDescription(user)
    const embbed = createEmbededReport(true, description, `${user.username} is inserted by api`)
    discord.send(embbed)
  },
  /**
   * Update a person that have been inserted from API
   * @param {PersonTrigger} user
   */
  async update(_user) {
    const user = this.getUser(_user.username)
    user.channels = _user.channels
    user.channels.forEach(channel => {
      channel.name = getChannelNameFromChannelId(channel.id)
      channel.guildName = getGuildNameFromChannelId(channel.id)
    });
    await this.save()
    const description = createUserEmbededDescription(user)
    const embbed = createEmbededReport(true, description, `${user.username} is updated by api`)
    discord.send(embbed)
  },

  /**
   * Save config to file (should be later in a DB)
   * @param {PersonTrigger} user
   */
  save() {
    this.list.forEach(user => {
      user.avatarURL = getAvatar(user)
      user.channels.forEach(channel => {
        channel.name = getChannelNameFromChannelId(channel.id)
        channel.guildName = getGuildNameFromChannelId(channel.id)
        if (!channel.sound) channel.sound = null
      })
    })
    return fse.writeJSON(jsonPath, this.list)
  }
}

function getAvatar(user) {
  const discordUser = Array.from(discord.client.users.cache.values())
    .filter(_user => user.username === _user.username)
    .pop()

  if (discordUser) {
    return discordUser.avatarURL()
  }
  return null
}

/**
 * Create an embedded message for discord with user info
 * @param {PersonTrigger} user 
 */
function createUserEmbededDescription(user) {
  let description = `=> ${user.username}: \n`
  description += user.channels.map(channel => `====>${getGuildNameFromChannelId(channel.id)} > ${getChannelNameFromChannelId(channel.id)} => ${channel.sound}`).join('\n')
  return description
}
/**
 * 
 * @param {boolean} isGood display message with green or red stuff
 * @param {string} description 
 * @param {string} _title
 */
function createEmbededReport(isGood = true, description, _title) {
  let title = isGood ? 'Success services' : 'Failed services'
  if (_title) title = _title
  const icon = isGood ? 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e0/Check_green_icon.svg/1200px-Check_green_icon.svg.png' : 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8f/Flat_cross_icon.svg/1024px-Flat_cross_icon.svg.png'
  const color = isGood ? '#6db546' : '#d45657'
  return new Discord.MessageEmbed()
    .setColor(color)
    .setAuthor(title, icon)
    .setDescription(description)
    .setTimestamp()
    .setFooter('', icon);
}

/**
 * Get channel name from channelId
 * @param {string} channelId 
 */
function getChannelNameFromChannelId(channelId) {
  const channel = discord.client.channels.cache.get(channelId)
  // @ts-ignore
  return channel ? channel.name : null
}
/**
 * Get channel name from channelId
 * @param {string} channelId
 */
function getGuildNameFromChannelId(channelId) {
  const channel = discord.client.channels.cache.get(channelId)
  // @ts-ignore
  return channel ? channel.guild.name : null
}

/**
 * @typedef {Object} PersonTrigger
 * A person that have at least one trigger
 * @property {string} username
 * @property {string} avatarURL
 * @property {Channel[]} channels
 */


/**
 * @typedef {Object} Channel
 * A person that have at least one trigger
 * @property {string} id
 * @property {string} sound
 * @property {string} name
 * @property {string} guildName
 */