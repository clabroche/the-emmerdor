const fse = require('fs-extra')
const path = require('path')
const prisonJSON = path.resolve(__dirname, '..', 'configs', 'prison.json')
const discord = require('./discord')

function Prison() {
  if (!fse.existsSync(prisonJSON)) {
    fse.writeJSONSync(prisonJSON, {})
    this.prisonChannel = fse.readJsonSync(prisonJSON)
  } else {
    this.prisonChannel = fse.readJsonSync(prisonJSON)
  }
  setTimeout(() => {
    if (this.prisonChannel && this.prisonChannel.id) this.join(discord.prison.channels.cache.get(this.prisonChannel.id));
  }, 1000);
  this.loopAudio()
} 
Prison.prototype.join = async function(channel) {
  this.connection = await channel.join();
  return this.connection
}
Prison.prototype.loopAudio = async function() {
  const json = await fse.readJson(prisonJSON).catch(() => ({}))
  if (!json.music || !this.connection) return setTimeout(() => this.loopAudio(), 500)
  const audio = path.resolve(__dirname, '..', 'sounds', json.music)
  let dispatcher = this.connection.play(audio, { volume: 1 });
  dispatcher.on('finish', () => this.loopAudio());
}

module.exports = new Prison()
