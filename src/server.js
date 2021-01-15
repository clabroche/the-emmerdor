// This file is launch by the js bot index  file
const express = require('express')
const app = express()
const port = process.env.PORT || 2525
const triggeredUsers = require('./triggeredUsers')
const bodyParser =require('body-parser')
const path =require('path')
const fileUpload = require('express-fileupload');
const discord  = require('./discord')
const fse = require('fs-extra')
const soundPath = path.resolve(__dirname, '..', 'sounds')
const PromiseB = require('bluebird')

app.use(fileUpload({ createParentPath: true }))
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

/**
 * Remove a sound from filesystem and all triggered users
 * @express-param {string} sound
 */
app.delete('/sounds/:sound', async (req, res) => {
  await fse.unlink(path.resolve(soundPath, req.params.sound))
  triggeredUsers.list.forEach(user => user.channels.forEach(channel => {
    if(channel.sound===req.params.sound) {
      channel.sound = null
    }
  }));
  res.json(true)
})
/**
 * Upload a sound in filesystem
 * @express-files {file} sound
 */
app.post('/sounds/upload', async (req, res) => {
  try {
    if (!req.files) {
      res.send({
        status: false,
        message: 'No file uploaded'
      });
    } else {
      let sound = req.files.sound;
      if(!Array.isArray(sound)) {
        await sound.mv(path.resolve(soundPath, sound.name))
        //send response
        res.send({
          status: true,
          message: 'File is uploaded',
          data: {
            name: sound.name,
            mimetype: sound.mimetype,
            size: sound.size
          }
        });
      } else { // Multiple upload is not supported by front but server is ready to accept files
        await PromiseB.map(sound, s => s.mv(path.resolve(soundPath, s.name)))
        //send response
        res.send({
          status: true,
          message: 'File is uploaded',
          data: sound.map(s => ({
            name: s.name,
            mimetype: s.mimetype,
            size: s.size
          }))
        });
      }
    }
  } catch (err) {
    res.status(500).send(err.message);
  }
});

/**
 * Check if user has type the correct password to get access to front
 * (Very bad: we need to hash password with bcrypt, send a token to user and validate all others routes with this token to protect them)
 * @express-body {string} password
 */
app.post('/auth', (req, res) => {
  const password = process.env.PASSWORD
  if(password === req.body.password) {
    return res.json(true)
  }
  res.json(false)
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
app.post('/users/triggered', async(req, res) => {
  if(!Array.isArray(req.body)) return res.status(400).send('Body should be an array')
  triggeredUsers.list = req.body
  triggeredUsers.list.forEach(user => user.channels.forEach(channel => {
    channel.name = getChannelNameFromChannelId(channel.id)
    channel.guildName = getGuildNameFromChannelId(channel.id)
    if(!channel.sound) channel.sound = null
  }))
  await triggeredUsers.save()
  res.json(req.body)
})
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
/**
 * Get all users that bot can view (user should be in a channel to be discoverable from bot)
 */
app.get('/users', (req, res) => {
  res.json(Array.from(discord.client.users.cache.values()))
})
/**
 * Get all sounds on filesystem
 */
app.get('/sounds', async(req, res) => {
  const sounds = await fse.readdir(soundPath)
  res.json(sounds)
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
  if(user) await triggeredUsers.update(req.body)
  else await triggeredUsers.insert(req.body)

  res.json(triggeredUsers.getUser(req.params.username))
})

/** Serve static front directory */
app.use(express.static(path.resolve(__dirname, 'front')))

/** Redirect all 404 routes to index.html */
app.use((req, res) => {
  res.redirect('/index.html')
})

/** Launch server */
app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
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