const Discord = require('discord.js')
const discord = require('./discord')
const fse = require('fs-extra')
const path = require('path')
const jsonPath = path.resolve(__dirname, '..','configs','triggeredUsers.json')

module.exports = {
  /** @type {PersonTrigger[]} */
  list: [],
  addInList(user) {
    console.log(user)
  },
  removeInList(user) {
    console.log(user)
  },
  display() {
    const description = this.list.map(user => createUserEmbededDescription(user)).join('\n')
    const embbed = createEmbededReport(true, description, 'Users triggered')
    discord.send(embbed)
  },
  getUser(username) {
    return this.list.filter(user => user.username === username).pop()
  },
  insert(user) {
    user.channels.forEach(channel => {
      channel.name = getChannelName(channel.id)
    });
    this.list.push(user)
    this.save()
    const description = createUserEmbededDescription(user)
    const embbed = createEmbededReport(true, description, `${user.username} is inserted by api`)
    discord.send(embbed)
  },
  update(_user) {
    const user = this.getUser(_user.username)
    user.channels = _user.channels
    user.channels.forEach(channel => {
      channel.name = getChannelName(channel.id)
    });
    this.save()
    const description = createUserEmbededDescription(user)
    const embbed = createEmbededReport(true, description, `${user.username} is updated by api`)
    discord.send(embbed)
  },
  save() {
    return fse.writeJSON(jsonPath, this.list)
  }
}
if (!fse.existsSync(jsonPath)) {
  module.exports.save()
} else {
  module.exports.list = fse.readJsonSync(jsonPath)
}
function createUserEmbededDescription(user) {
  let description = `=> ${user.username}: \n`
  description += user.channels.map(channel => `====>${getChannelName(channel.id)} => ${channel.sound}`).join('\n')
  return description
}
function createEmbededReport(isGood = true, description, _author) {
  let author = isGood ? 'Success services' : 'Failed services'
  if (_author) author = _author
  const icon = isGood ? 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e0/Check_green_icon.svg/1200px-Check_green_icon.svg.png' : 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8f/Flat_cross_icon.svg/1024px-Flat_cross_icon.svg.png'
  const color = isGood ? '#6db546' : '#d45657'
  return new Discord.MessageEmbed()
    .setColor(color)
    .setAuthor(author, icon)
    .setDescription(description)
    .setTimestamp()
    .setFooter('', icon);
}

function getChannelName(channelId) {
  return discord.client.channels.cache.get(channelId).name
}

/**
 * @typedef {Object} PersonTrigger
 * @property {string} username
 * @property {Channel[]} channels
 */


/**
 * @typedef {Object} Channel
 * @property {string} id
 * @property {string} sound
 * @property {string} name
 */