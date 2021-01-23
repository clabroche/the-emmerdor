const app = require('express').Router()
const PromiseB = require('bluebird')
const fse = require('fs-extra')
const path = require('path')
const soundPath = path.resolve(__dirname, '..', '..', 'sounds')
const triggeredUsers = require('../../lib/triggeredUsers')

/**
 * Remove a sound from filesystem and all triggered users
 * @express-param {string} sound
 */
app.delete('/sounds/:sound', async (req, res) => {
  await fse.unlink(path.resolve(soundPath, req.params.sound))
  triggeredUsers.list.forEach(user => user.channels.forEach(channel => {
    if (channel.sound === req.params.sound) {
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
      if (!Array.isArray(sound)) {
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
 * Get all sounds on filesystem
 */
app.get('/sounds', async (req, res) => {
  const sounds = await fse.readdir(soundPath)
  res.json(sounds)
})
module.exports = app