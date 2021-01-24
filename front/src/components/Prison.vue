<template>
  <div class="prison-container">
    <div class="prison-section">
      <h3>Salon</h3>
      <select @input="changePrisonID($event.target.value)">
        <option></option>
        <option v-for="channel of channels" :key="channel.id" :value="channel.id"
          :selected="channel.id === prisonVocalID">{{channel.guildName}} #{{channel.name}}</option>
      </select>
    </div>
    <div class="arrow"></div>
    <div class="prison-section">
      <h3>Musique</h3>
      <select @input="changePrisonMusic($event.target.value)" v-model="actualPrisonMusic">
        <option :selected="!actualPrisonMusic"></option>
        <option v-for="sound of sounds" :key="sound" :selected="sound === actualPrisonMusic">{{sound}}</option>
      </select>
    </div>
  </div>
</template>

<script>
import axios from '../services/axios'
export default {
  data() {
    return {
      prisonVocalID: '',
      actualPrisonMusic: '',
      sounds: [],
      channels: [],
    }
  },
  async mounted() {
    this.refresh()
  },
  methods: {
    async refresh() {
      const { data: prisonVocalID } = await axios.get('/prisonVocalID')
      this.prisonVocalID = prisonVocalID
      const { data: actualPrisonMusic } = await axios.get('/actualPrisonMusic')
      this.actualPrisonMusic = actualPrisonMusic
      const { data: sounds } = await axios.get('/sounds')
      this.sounds = sounds
      const { data: channels } = await axios.get('/channels')
      this.channels = channels
    },
    changePrisonID(vocalID) {
      axios.post("/changePrisonVocalID", { id: vocalID })
      this.prisonVocalID = vocalID
    },
    changePrisonMusic(music) {
      axios.post("/changePrisonMusic", { music: music })
      this.prisonMusic = music
    },
  }
}
</script>
<style lang="scss" scoped>
.prison-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
}
.prison-section {
  display: flex;
  text-align: center;
  flex-direction: column;
  background-color: #414141;
  padding: 10px;
  max-width: 500px;
  width: 90vw;
  margin: 10px;
  border-radius: 10px;
  text-align: center;
  &:first-of-type {
    margin-top:  30px;
  }
}
.prison-section select {
  margin: auto;
  max-width: none;
}
.prison-section h3 {
  margin: 0;
  margin-bottom: 10px;
}

.arrow {
  height: 75px;
  position: relative;
  &::before {
    position: absolute;
    content: "";
    width: 5px;
    height: 50px;
    background-color: #fff;
  }
  &::after {
    position: absolute;
    content: "";
    display : inline-block;
    height : 0;
    width : 0;
    bottom: 0;
    left: 0;
    transform: translateX(calc(-50% + 3px)) translateY(-5px);
    border-top : 30px solid white;
    border-right : 10px solid transparent;
    border-left : 10px solid transparent;
  }
}
</style>