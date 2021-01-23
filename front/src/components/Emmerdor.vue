<template>
  <div class="emmerdor-container">
    <div class="trigger-manager">
      <fieldset v-for="user of triggered" :key="user.username">
        <legend>{{user.username}}</legend>
        <i class="fas fa-times" aria-hidden="true" @click="deleteUser(user)"></i>
        <div v-for="channel of user.channels" :key="channel.id" class="channel">
          <i class="fas fa-times" aria-hidden="true" @click="deleteChannel(user, channel)"></i>
          <div class="channel-name">{{channel.guildName}} > {{channel.name}}</div> =>
          <select @input="save()" v-model="channel.sound">
            <option :selected="!channel.sound"></option>
            <option v-for="sound of sounds" :key="sound" :selected="sound === channel.sound">{{sound}}</option>
          </select>
        </div>
        <div class="add-channel">
          <i class="fas fa-plus" aria-hidden="true"></i>
          <div class="channel-name">Ajouter un channel</div>
          <select @input="addChannel(user, $event.target.value)">
            <option></option>
            <option v-for="channel of channelsNotInUser(user)" :key="channel.id" :value="channel.id">{{channel.guildName}} >
              {{channel.name}}</option>
          </select>
        </div>
      </fieldset>
      <div class="text-center">
        <h3>Ajouter un utilisateur</h3>
        <select @input="addUser($event.target.value)">
          <option></option>
          <option v-for="user of usersNotConfigured()" :key="user.username" :value="user.username">{{user.username}}
          </option>
        </select>
      </div>
    </div>

    <div class="sound-container">
      <fieldset>
        <legend>Mes fichiers</legend>
        <ul v-if="sounds.length">
          <li v-for="sound of sounds" :key="sound" class="sound">
            <i class="fas fa-times" aria-hidden="true" @click="deleteSound(sound)"></i>
            {{sound}}
          </li>
        </ul>
        <div>
          <h3>Ajouter un son</h3>
          <input type='file' ref="upload" name='sound' accept="audio/*" @input='upload($event.target.files)'>
        </div>
      </fieldset>
    </div>
  </div>
</template>

<script>
import axios from '../services/axios'
export default {
  data() {
    return {
      users: [],
      channels: [],
      triggered: [],
      sounds: [],
      prisonVocalID: '',
      actualPrisonMusic: ''
    }
  },
  async mounted() {
    this.refresh()
  },
  methods: {
    async upload(files) {
      var formData = new FormData();
      formData.append("sound", files[0]);
      await axios.post('/sounds/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
      this.$refs.upload.value = "";
      this.refresh()
    },
    async refresh() {
      const { data: users } = await axios.get('/users')
      this.users = users
      const { data: channels } = await axios.get('/channels')
      this.channels = channels
      const { data: triggered } = await axios.get('/users/triggered')
      this.triggered = triggered
      const { data: sounds } = await axios.get('/sounds')
      this.sounds = sounds
      const { data: prisonVocalID } = await axios.get('/prisonVocalID')
      this.prisonVocalID = prisonVocalID
      const { data: actualPrisonMusic } = await axios.get('/actualPrisonMusic')
      this.actualPrisonMusic = actualPrisonMusic
    },
    async deleteSound(sound) {
      await axios.delete('/sounds/' + sound)
      this.refresh()
    },
    save() {
      axios.post('/users/triggered', this.triggered)
      this.refresh()
    },
    channelsNotInUser(user) {
      const userChannelIds = user.channels.map(a => a.id)
      return this.channels.filter(channel => !userChannelIds.includes(channel.id))
    },
    usersNotConfigured() {
      const usernames = this.triggered.map(a => a.username)
      return this.users.filter(user => !usernames.includes(user.username))
    },
    deleteUser(user) {
      const index = this.triggered.indexOf(user)
      this.triggered.splice(index, 1)
      this.save()
    },
    deleteChannel(user, channel) {
      const index = user.channels.indexOf(channel)
      user.channels.splice(index, 1)
      this.save()
    },
    changePrisonID(vocalID) {
      axios.post("/changePrisonVocalID", { id: vocalID })
      this.prisonVocalID = vocalID
    },
    changePrisonMusic(music) {
      axios.post("/changePrisonMusic", { music: music })
      this.prisonMusic = music
    },
    addChannel(user, channelId) {
      user.channels.push({ id: channelId })
      this.save()
    },
    addUser(userId) {
      this.triggered.push({ username: userId, channels: [] })
      this.save()
    },
  }
}
</script>

<style lang="scss" scoped>
.channel {
  margin: 10px 0;
  padding: 0.2% 1%;
  display: flex;
  align-items: center;
}
.channel-name {
  width: 150px;
}
.channel select {
  margin-left: 10px;
}

.add-channel {
  padding: 0.5% 1%;
  margin-top:30px;
  display: flex;
  align-items: center;
}
.add-channel select {
  margin-left: 28px;
}
.sound {
  display: flex;
  margin: 5px 0;
  align-items: center;
}

.emmerdor-container {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-around;
  max-width: 100vw;
  overflow: auto;
}
.trigger-manager {
  background-color: #414141;
  border-radius: 4px;
  padding: 5px;
  margin: 10px 10px;
  flex-grow: 1;
}
.sound-container {
  background-color: #414141;
  border-radius: 4px;
  padding: 5px;
  margin: 10px 0;
}
</style>