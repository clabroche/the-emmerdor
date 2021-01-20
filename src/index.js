#!/bin/env node
// @ts-ignore
require('array-flat-polyfill');
require('./requirements')
require('./server')
const path = require('path')
const discord = require('./discord')
const triggeredUsers = require('./triggeredUsers')

const sessions = {}
;(async _ => {
  const bot = await discord.ready()
  bot.on('voiceStateUpdate', (oldMember, newMember) => { // event when an user enter, leave or make something on a voice channel
    if (newMember.id === bot.user.id) return // not trigger audio when bot enter on channel to play sound
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
 * Check if a user have conf associated to a sound and this channel
 * if ok: play sound
 * @param {import('./discord').Client} client
 * @param {import('./discord').VoiceState} voiceState
 */
async function enterChannel(client, voiceState) {
  const userId = voiceState.id
  const user = client.users.cache.get(userId)
  // discord.send(`${user.username} enter`)
  const triggeredUser = triggeredUsers.getUser(user.username)
  if(sessions[userId]) return // If user is already in a channel and has already trigger a sound, do not trigger a sound
  sessions[userId] = true // Flag user to have been triggered already a sound to prevent to re-trigger
  if(triggeredUser) { // if user have a conf 
    const triggeredChannel = triggeredUser
      .channels
      .filter(channel => channel.id === voiceState.channelID)
      .pop()
    if (triggeredChannel && triggeredChannel.sound) { // and if user is correctly configured for this channel
      // discord.send(`${user.username} is in the trigger list => send audio`)
      const audio = path.resolve(__dirname, '..', 'sounds', triggeredChannel.sound)
      const connection = await voiceState.channel.join() // create tunnel to channel voice to transit sound
      setTimeout(async() => { // Wait 1s for user to join and etablish the audio connection to channel
        const dispatcher = connection.play(audio)
        dispatcher.on("finish", () => {
          try {voiceState.channel.leave()} catch (err) {} // Bot should leave the channel to re-enter later
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
 * Flag user to re-trigger him when he re-enter later in a channel
 * @param {import('./discord').Client} client
 * @param {import('./discord').VoiceState} voiceState
 */
async function leaveChannel(client, voiceState) {
  const userId = voiceState.id
  // const user = client.users.cache.get(userId);
  if (sessions[userId]) delete sessions[userId]
  client.voice.connections.get(voiceState.guild.id).channel.leave()
  // discord.send(`${user.username} leave`)
}
