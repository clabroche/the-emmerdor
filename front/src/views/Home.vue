<template>
  <div id="tab-container">
    <div id="header">
      <div class="item" :class="{active: currentTab === 'emmerdor'}" @click="currentTab = 'emmerdor'">The emmerdor</div>
      <div class="separator">|</div>
      <div class="item" :class="{active: currentTab === 'prison'}" @click="currentTab = 'prison'">Prison</div>
    </div>
    <component :is="currentTab"/>
    <sound-manager/>
  </div>
</template>
<script>
import EmmerdorVue from '../components/Emmerdor.vue'
import PrisonVue from '../components/Prison.vue'
import SoundManagerVue from '../components/SoundManager.vue'
export default {
  components: {
    emmerdor: EmmerdorVue,
    prison: PrisonVue,
    soundManager: SoundManagerVue
  },
  data() {
    return {
      currentTab: 'emmerdor',
    }
  },
}
</script>
<style lang="scss" scoped>
#tab-container{
  display: flex;
  flex-direction: column;
  .separator {
    padding: 10px;
    margin: 0 10px;
  }
  #header {
    display: flex;
    justify-content: center;
    font-size: 1.1em;
    font-weight: bold;
    height: 50px;
    box-shadow: 0px 6px 7px -7px black;
    background-color: rgba(0,0,0,0.17);
    .item {
      width: 200px;
      padding: 10px;
      text-align: center;
      border-bottom: 4px solid transparent;
      box-sizing: border-box;
      cursor: pointer;
      border-top-left-radius: 10px;
      border-top-right-radius: 10px;
      &:hover {
        background-color: rgba(0,0,0,0.1);
        transition: 300ms;
      }
    }
    .active {
      border-bottom: 4px solid white;
      transition: 300ms
    }
  }
}
</style>
