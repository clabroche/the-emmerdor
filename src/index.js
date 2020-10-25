#!/bin/env node
require('array-flat-polyfill');
requirements()
const path = require('path')
const discord = require('./discord')
const triggeredUsers = require('./triggeredUsers')
require('./server')
const sessions = {}
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
  discord.send(`Hello ! 
I'm starting in version ${require('../package.json').version}
${process.env.NODE_ENV === 'development' ? '(development version)': ''}
`)
})()

/**
 * 
 * @param {import('discord.js').Client} client 
 * @param {import('discord.js').VoiceState} voiceState 
 */
async function enterChannel(client, voiceState) {
  const userId = voiceState.id
  const user = client.users.cache.get(userId)
  // discord.send(`${user.username} enter`)
  const triggeredUser = triggeredUsers.getUser(user.username)
  if(sessions[userId]) return
  sessions[userId] = true
  if(triggeredUser) {
    const triggeredChannel = triggeredUser
      .channels
      .filter(channel => channel.id === voiceState.channelID)
      .pop()
    if (triggeredChannel && triggeredChannel.sound) {
      // discord.send(`${user.username} is in the trigger list => send audio`)
      const audio = path.resolve(__dirname, '..', 'sounds', triggeredChannel.sound)
      const connection = await voiceState.channel.join()
      setTimeout(async() => {
        const dispatcher = connection.play(audio)
        dispatcher.on("finish", () => {
          try {voiceState.channel.leave()} catch (err) {}
        });
      }, 1000);
    }else {
      // discord.send(`${user.username} is not in the channel list => not send audio`)
    }
  } else {
    // discord.send(`${user.username} is not in the trigger list => not send audio`)
  }
}

/**
 * 
 * @param {import('discord.js').Client} client 
 * @param {import('discord.js').VoiceState} voiceState 
 */
async function leaveChannel(client, voiceState) {
  const userId = voiceState.id
  // const user = client.users.cache.get(userId);
  if (sessions[userId]) delete sessions[userId]
  // discord.send(`${user.username} leave`)
}

function requirements() {
  const {DISCORD_TOKEN, CHANNEL_ID, PASSWORD} = process.env
  if(!DISCORD_TOKEN) {
    console.error('Please provide a DISCORD_TOKEN env')
    process.exit(1)
  }
  if (!CHANNEL_ID) {
    console.error('Please provide an CHANNEL_ID env')
    process.exit(1)
  }
  if (!PASSWORD) {
    console.error('Please provide an PASSWORD env')
    process.exit(1)
  }
}
