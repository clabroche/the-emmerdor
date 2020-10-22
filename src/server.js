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
app.use(fileUpload({
  createParentPath: true
}))
app.delete('/sounds/:sound', async (req, res) => {
  await fse.unlink(path.resolve(soundPath, req.params.sound))
  triggeredUsers.list.forEach(user => user.channels.forEach(channel => {
    if(channel.sound===req.params.sound) {
      channel.sound = null
    }
  }));
  res.json(true)
})
app.post('/sounds/upload', async (req, res) => {
  try {
    if (!req.files) {
      res.send({
        status: false,
        message: 'No file uploaded'
      });
    } else {
      let sound = req.files.sound;
      sound.mv(path.resolve(soundPath, sound.name))

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
    }
  } catch (err) {
    res.status(500).send(err.message);
  }
});

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.post('/auth', (req, res) => {
  const password = process.env.PASSWORD
  if(password === req.body.password) {
    return res.json(true)
  }
  res.json(false)
})
app.get('/users/triggered', (req, res) => {
  res.json(triggeredUsers.list)
})
app.get('/users/triggered/:username', (req, res) => {
  const user = triggeredUsers.list.filter(user => user.username === req.params.username).pop()
  if (user) {
    res.json(triggeredUsers.list)
  } else {
    res.status(404).send('User not found.')
  }
})
app.post('/users/triggered', async(req, res) => {
  if(!Array.isArray(req.body)) return res.status(400).send('Body should be an array')
  triggeredUsers.list = req.body
  triggeredUsers.list.forEach(user => user.channels.forEach(channel => {
    channel.name = getChannelName(channel.id)
    if(!channel.sound) channel.sound = null
  }))
  await triggeredUsers.save()
  res.json(req.body)
})
app.get('/channels', (req, res) => {
  res.json(Array.from(discord.client.channels.cache.values()).filter(a => a.type === 'voice'))
})
app.get('/users', (req, res) => {
  res.json(Array.from(discord.client.users.cache.values()))
})
app.get('/sounds', async(req, res) => {
  const sounds = await fse.readdir(soundPath)
  res.json(sounds)
})
app.post('/users/:username', (req, res) => {
  if (!req.body || !req.body.username) return res.status(400).send(('username is missing in body'))
  if (!req.body || !req.body.channels) return res.status(400).send(('channels is missing in body'))
  if (!req.body || req.body.channels && !Array.isArray(req.body.channels)) return res.status(400).send(('channels should be an array in body'))
  
  const user = triggeredUsers.getUser(req.params.username)
  if(user) triggeredUsers.update(req.body)
  else triggeredUsers.insert(req.body)

  res.json(triggeredUsers.getUser(req.params.username))
})
app.use(express.static(path.resolve(__dirname, 'front')))
app.use((req, res) => {
  res.redirect('/index.html')
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})

function getChannelName(channelId) {
  return discord.client.channels.cache.get(channelId).name
}