const Discord = require('discord.js');
const client = new Discord.Client();
const prison = new Discord.Client();
const token = process.env.DISCORD_TOKEN
const prisonToken = process.env.PRISON_TOKEN
const channelId = process.env.CHANNEL_ID
const fse = require('fs-extra')
const axios = require('axios').default;
const path = require('path')
const prisonJSON = path.resolve(__dirname, '..','configs','prison.json')

/**
 * Describe all your command available for your bot
 * each command should have a key with what the user should type
 * and a value with a description field and cb field (reference to a function that will be triggered)
 */
const commands = {
  '/ISALIVE': { // Check if server is alive
    cb: areYouAlive,
    description: 'Check if i am alive'
  },
  '/LIST': { // Display an embedded message with all users configured for an audio trigger
    cb: () => require('./triggeredUsers').display(),
    description: 'List all persons'
  },
  '/HELP': { // Show command helper
    cb: help,
    description: 'Show this help'
  },
}



setTimeout(() => {
  if (!fse.existsSync(prisonJSON)) {
    fse.writeJSON(prisonJSON, {})
    module.exports.prisonChannel = fse.readJsonSync(prisonJSON)
  } else {
    module.exports.prisonChannel = fse.readJsonSync(prisonJSON)
  }
  if (this.prisonChannel && this.prisonChannel.id) this.joinPrison(prison.channels.cache.get(this.prisonChannel.id));
}, 1000);



/** 
 * @type {import('./discord').Client}
 */
module.exports.client = null
module.exports.prison = null
/** 
 * Wrapper function that resolve a promise only when discord connection is etablished and all event is ready to be listened
 * @return {Promise<import('./discord').Client>}
 */
module.exports.ready = function() {
  return new Promise((res) => {
    prison.on('ready', () => {
      console.log(`Prison Logged in as ${prison.user.tag}!`);

      // @ts-ignore
      module.exports.prison = prison
    });
    client.on('ready', () => {
      console.log(`Logged in as ${client.user.tag}!`);

      // @ts-ignore
      module.exports.client = client
      res(client)
    });
    client.on('message', message => { 
      if (message.author.bot || message.channel.id !== channelId) return // not execute command if the bot say it or if command is from a wrong channel (process.env.CHANNEL_ID) 
      const msg = message.content.toUpperCase().split(' ')[0]
      Object.keys(commands).forEach(command => {
        if (msg === command) {
          commands[command].cb(message.content.toLowerCase().replace(command.toLocaleLowerCase(), '').trim())
        }
      })
    });
    client.login(token);
    prison.login(prisonToken);
  })
}

/** 
 * Send a message in textual channel
 * @param {string | import('./discord').MessageEmbed} msg
 */
module.exports.send = function (msg) {
  console.log('Send to Discord')
  // @ts-ignore
  return client.channels.cache.get(channelId).send(msg)
}


/**
 * Send a message in textual channel from discord Web API
 * @param {string | import('./discord').MessageEmbed} msg
 */
module.exports.sendWithApi = function (msg) {
  axios.post(`https://discord.com/api/v6/channels/${channelId}/messages`, msg, {
    headers: {
      Authorization: `Bot ${token}`
    }
  })
}

/**
 * Just say something to discord to check if the bot can respond 
 */
function areYouAlive() {
  const possibilities = [
    "Yes I'm alive ! And you ?",
    "Maybe, I'm just a robot, I don't know...",
    "Yes, but i tell you each days !",
    "You boring me with your questions.",
  ]
  module.exports.send(possibilities[Math.floor(Math.random() * possibilities.length)]);
}

module.exports.joinPrison = function (channel){
  channel.join().then(connection => {
    launchPrisonAudio(connection);
  });
}

function launchPrisonAudio(connection){
  if (!fse.readJsonSync(prisonJSON).music) return
  const audio = path.resolve(__dirname, '..', 'sounds', fse.readJsonSync(prisonJSON).music)
  let dispatcher = connection.play(audio, {volume: 1});

  dispatcher.on('finish', () => {
    launchPrisonAudio(connection);
  });
}

/**
 * Show all command availble directly to discord text channel
 */
function help() {
  return module.exports.send(new Discord.MessageEmbed()
    .setColor('#faa329')
    .setAuthor("Help", "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f6/Lol_question_mark.png/604px-Lol_question_mark.png")
    .setDescription(Object.keys(commands).map(command => `- ${command.toLowerCase()}: ${commands[command].description}`).join('\n'))
    .setTimestamp()
  )
}