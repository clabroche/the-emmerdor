<template>
  <div class="sound-root">
    <transition name="open">
      <div class="sound-overlay" @click="isSoundOpen = false" v-if="isSoundOpen">
        <div class="sound-container"  @click.stop>
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
    </transition>
    <button class="display" @click="isSoundOpen = !isSoundOpen">
      <i class="fas fa-headphones"></i>
    </button>
  </div>
</template>

<script>
import axios from '../services/axios'
export default {
  data() {
    return {
      isSoundOpen: false,
      sounds: [],
    }
  },
  async mounted() {
    this.refresh()
  },
  methods: {
    async deleteSound(sound) {
      await axios.delete('/sounds/' + sound)
      this.refresh()
    },
    async refresh() {
      const { data: sounds } = await axios.get('/sounds')
      this.sounds = sounds
    },
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
  }
}
</script>

<style lang="scss" scoped>
.display {
  position: fixed;
  bottom: 15px;
  right: 15px;
  width: 70px;
  height: 70px;
  display: flex;
  justify-content: center;
  align-items: center;
  border: none;
  background-color: #6f7fb9;
  color: white;
  border-radius: 50%;
  box-shadow: 0px 0px 12px 0px black;
  border: 1px solid #454a5c;
  outline: none;
  z-index: 1;
  i {
    margin: 0;
    background-color: transparent;
    color: white;
    font-size: 1.8em;
  }
}
.sound-overlay {
  position: fixed;
  bottom: 0;
  right: 0;
  width: 100vw;
  height: 100vh;
  transform-origin: bottom right;
  background-color: rgba(0,0,0,0.8);
  z-index: 1;
  .sound-container {
    position: fixed;
    background: #c5c5c5;
    padding: 10px;
    border: 3px solid #6b6b6b;
    box-sizing: border-box;
    border-radius: 8px;
    bottom: 95px;
    right: 0;
  }
}
ul {
  margin: 0;
  max-height: 400px;
  overflow: auto;
  li {
    display: flex;
    align-items: center;
    border-bottom: 1px solid #a4a4a4;
    padding:  5px 0;
    &:last-of-type {
      border-bottom: none;

    }
  }
}
.open-enter-active, .open-leave-active {
  transition-property: transform border-top-left-radius opacity;
  transition-duration: 300ms;
}
.open-enter-from, .open-leave-to {
  transform: scale(0) translateZ(0);
  border-top-left-radius: 100%;
  opacity: 0;
}
</style>