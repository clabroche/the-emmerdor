#!/bin/env node
requirements()
const Discord = require('discord.js');
const discord = require('./discord')
const triggeredUsers = ['iryu54', 'loki666']
;(async _ => {
  const bot = await discord.ready()
  bot.on('voiceStateUpdate', (oldMember, newMember) => {
    if (newMember.id === bot.user.id) return
    if (newMember.channelID) {
      enterChannel(bot, newMember)
    } else {
      leaveChannel(bot, newMember)
    }
  })
//   discord.send(`Hello ! 
// I'm starting in version ${require('../package.json').version}
// `)
})()

/**
 * 
 * @param {import('discord.js').Client} client 
 * @param {import('discord.js').VoiceState} voiceState 
 */
async function enterChannel(client, voiceState) {
  const userId = voiceState.id
  const user = client.users.cache.get(userId)
  discord.send(`${user.username} enter`)
  if(triggeredUsers.includes(user.username)) {
    discord.send(`${user.username} is in the trigger list => send audio`)
    const connection = await voiceState.channel.join()
    const dispatcher = connection.play('./audiofile.mp3')
    dispatcher.on("finish", () => {
      voiceState.channel.leave()
    });
  }else {
    discord.send(`${user.username} is not in the trigger list => not send audio`)
  }
}

/**
 * 
 * @param {import('discord.js').Client} client 
 * @param {import('discord.js').VoiceState} voiceState 
 */
async function leaveChannel(client, voiceState) {
  const userId = voiceState.id
  const user = client.users.cache.get(userId);
  discord.send(`${user.username} leave`)
}

function requirements() {
  const {DISCORD_TOKEN, URLS, CHANNEL_ID} = process.env
  if(!DISCORD_TOKEN) {
    console.error('Please provide a DISCORD_TOKEN env')
    process.exit(1)
  }
  if (!URLS) {
    console.error('Please provide an URLS env. Example: URLS=http://some-site.com,https://another-site/somewhere')
    process.exit(1)
  }
  if (!CHANNEL_ID) {
    console.error('Please provide an CHANNEL_ID env')
    process.exit(1)
  }
}
