const Prison = {
  template: `
  <div class="prison-container">
    <div class="prison-section">
      <h3>Changer la prison</h3>
      <select @input="changePrisonID($event.target.value)">
        <option></option>
        <option v-for="channel of channels" :key="channel.id" :value="channel.id"
          :selected="channel.id === prisonVocalID">{{channel.guildName}} > {{channel.name}}</option>
      </select>
    </div>
    <div class="prison-section">
      <h3>Changer la musique de la prison</h3>
      <select @input="changePrisonMusic($event.target.value)" v-model="actualPrisonMusic">
        <option :selected="!actualPrisonMusic"></option>
        <option v-for="sound of sounds" :key="sound" :selected="sound === actualPrisonMusic">{{sound}}</option>
      </select>
    </div>
  </div>
    `,
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