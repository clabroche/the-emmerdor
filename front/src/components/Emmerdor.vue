<template>
  <div class="emmerdor-scroller">
    <div class="emmerdor-container">
      <div class="header">
        <h2>Gérer mes utilisateurs</h2>
        <div class="input-container">
          <i class="fas fa-search"></i>
          <input type="text" placeholder="Rechercher un utilisateur..." v-model="filter">
        </div>
      </div>
      <div class="trigger-manager">
        <transition-group name="users">
        <div v-for="user of triggeredFiltered" :key="user.username" class="user">
          <div class="user-infos">
            <div class="avatar">
              <img :src="user.avatarURL || 'https://www.online-tech-tips.com/wp-content/uploads/2019/09/discord.jpg'" :alt="user.username + ' avatar'">
            </div>
            {{user.username}}
            <div class="channel-delete" @click="deleteUser(user)">
              <i class="fas fa-times"></i>
            </div>
          </div>
          <div class="channels">
            <transition-group name="channels">
            <div v-for="channel of user.channels" :key="channel.id" class="channel">
              <div class="channel-infos">
                <div class="channel-name">
                  {{channel.guildName}}#{{channel.name}}
                </div>
                <div class="channel-delete" @click="deleteChannel(user, channel)">
                  <i class="fas fa-times"></i>
                </div>
              </div>
              <div class="selector-sound">
                <select @input="save()" v-model="channel.sound">
                  <option :value="null" disabled hidden>Aucun son ne sera joué pour cette utilisateur</option>
                  <option :selected="!channel.sound"></option>
                  <option v-for="sound of sounds" :key="sound" :selected="sound === channel.sound">{{sound}}</option>
                </select>
              </div>
            </div>
            </transition-group>
            <div class="add-channel" :key="'add-channel'">
              <i class="fas fa-plus" aria-hidden="true"></i>
              <select @input="addChannel(user, $event.target.value)">
                <option :value="null" disabled hidden selected>Ajouter un salon...</option>
                <option v-for="channel of channelsNotInUser(user)" :key="channel.id" :value="channel.id">
                  {{channel.guildName}}#{{channel.name}}
                </option>
              </select>
            </div>
          </div>
        </div>
        </transition-group>
        <div class="text-center">
          <h3>Ajouter un utilisateur</h3>
          <select @input="addUser($event.target.value)">
            <option></option>
            <option v-for="user of usersNotConfigured()" :key="user.username" :value="user.username">{{user.username}}
            </option>
          </select>
        </div>
      </div>
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
      actualPrisonMusic: '',
      filter: ''
    }
  },
  computed: {
    triggeredFiltered() {
      return this.triggered.filter(user => user.username.toUpperCase().includes(this.filter.toUpperCase()))
    }
  },
  async mounted() {
    this.refresh()
  },
  methods: {
    
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
.emmerdor-scroller {
  height: calc(100vh - 85px);
  overflow: auto;
}

.emmerdor-container {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  width: 90vw;
  max-width: 500px;
  margin: auto;
  .header {
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    margin-top: 30px;
    width: 100%;
    h2 {
      text-align: left;
      margin-bottom: 0;
      margin: 0;
    }
    .input-container {
      margin-bottom: 3px;
      display: flex;
      i {
        margin: 0;
        background-color: transparent;
        color: #696969;
      }
      input {
        background-color: transparent;
        border: none;
        color: white;
        outline: none;
      }
    }
  }
  .trigger-manager {
    border-radius: 4px;
    max-width: 360px;
    padding: 5px;
    margin: 10px 0;
    flex-grow: 1;
    width: 100%;
    .user {
      margin: 70px 0;
      box-sizing: border-box;
      transform-origin: left;
      &:first-of-type {
        margin: 0;
      }
      .user-infos {
        display: flex;
        align-items: center;
        .avatar {
          width: 40px;
          height: 40px;
          margin-right: 10px;
          img {
            width: 100%;
            height: 100%;
            border-radius: 50%;
            object-fit: cover;
          }
        }
      }
      .channel-delete {
        margin-left: 30px;
        border: 1px solid #b96f6f;
        width: 20px;
        height: 20px;
        border-radius: 50%;
        display: flex;
        justify-content: center;
        align-items: center;
        position: relative;
        transition: 300ms;
        cursor: pointer;
        &:hover {
          color: white;
          background-color: #b96f6f;
        }
        &::before {
          content: "";
          left: 0;
          transform: translateX(-100%);
          position: absolute;
          background: rgb(111,185,154);
          background: linear-gradient(90deg, rgba(111,185,154,1) 0%, rgba(185,111,111,1) 100%);
          width: 30px;
          height: 1px;
        }
        i {
          width: 100%;
          height: 100%;
          background-color: transparent;
          color: white;
          margin: 0;
          font-size: 0.8em;
        }
      }
      .channels{
        border-left: 1px solid #6f7fb9;
        margin-left: 18px;
        &>div:first-of-type {
          margin-top: 0;
        }
        .channel {
          padding-left: 40px;
          box-sizing: border-box;
          position: relative;
          display: flex;
          flex-direction: column;
          width: max-content;
          margin: 40px 0;
          max-height: 70px;
          transform-origin: left;

          &::before {
            content: "";
            top: 13px;
            width: 40px;
            height: 1px;
            background: rgb(19,37,89);
            background: linear-gradient(90deg, rgba(19,37,89,1) 0%, rgba(111,185,154,1) 100%);
            position: absolute;
            left: 0;
          }
          
          .channel-infos {
            display: flex;
            align-items: center;
            .channel-name {
              background-color: #6fb99a;
              padding: 0 4px;
              border-radius: 4px;
              width: max-content;
            }
            
          }
          .selector-sound {
            margin-left: 40px;
            margin-top: 10px;
            position: relative;
            &::before {
              content: "";
              position: absolute;
              height: 1px;
              top: 13px;
              width: 20px;
              left: -20px;
              background: rgb(146,173,135);
              background: linear-gradient(90deg, rgba(146,173,135,1) 0%, rgba(185,159,111,1) 100%);
            }
            &::after {
              content: "";
              position: absolute;
              height: 24px;
              top: -10px;
              width: 1px;
              left: -20px;
              background: rgb(111,185,154);
              background: linear-gradient(90deg, rgba(111,185,154,1) 0%, rgba(146,173,135,1) 100%);
            }
            select {
              border: 1px solid #b99f6f;
              padding: 5px;
              border-radius: 4px;
              box-sizing: border-box;
              width: 260px;
              max-width: none;
              outline: none;
              cursor: pointer;
            }
          }
        }
      }
    }
    .add-channel {
      margin-top: 30px;
      margin-left: 40px;
      display: flex;
      align-items: center;
      position: relative;
      border: 1px solid #6fb99a;
      border-radius: 4px;
      width: 200px;
      box-sizing: border-box;
      height: 30px;
      &::before {
        content: "";
        position: absolute;
        transform: translateX(-100%);
        left: 0;
        width: 40px;
        height: 1px;
        background: #132559;
        background: linear-gradient(90deg, #132559 0%, #6fb99a 100%);
      }
      i {
        background-color: transparent;
        color: white;
        z-index: 1;
      }
      select {
        border-radius: 4px;
        border: none;
        position: absolute;
        width: 100%;
        height: 100%;
        max-width: none;
        padding-left: 30px;
        outline: none;
      }
    }
    .sound {
      display: flex;
      margin: 5px 0;
      align-items: center;
    }
  }
}

.channels-enter-active, .channels-leave-active {
  transition: all 300ms;
}
.channels-enter-from, .channels-leave-to {
  transform: scaleX(0);
}
.users-enter-active, .users-leave-active {
  transition: all 300ms;
  max-height: 200px;

}
.users-enter-from, .users-leave-to {
  transform: scale(0);
  max-height: 0 !important;
  margin: 0 !important;
  padding: 0 !important;
}
</style>