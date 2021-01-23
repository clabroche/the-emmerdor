<template>
  <div v-if="authenticated" class="root">
    <navbar/>
    <div id="tab-container">
      <div id="header">
        <div class="item" :class="{active: currentTab === 'emmerdor'}" @click="currentTab = 'emmerdor'">The emmerdor</div>
        <div class="separator">|</div>
        <div class="item" :class="{active: currentTab === 'prison'}" @click="currentTab = 'prison'">Prison</div>
      </div>
      <component :is="currentTab"/>
    </div>
  </div>
  <div v-else>
    <input v-model="password" autofocus/>
  </div>
</template>
<script>
import NavbarVue from './components/Navbar.vue'
import EmmerdorVue from './components/Emmerdor.vue'
import PrisonVue from './components/Prison.vue'
import axios from './services/axios'
export default {
  components: {
    navbar: NavbarVue,
    emmerdor: EmmerdorVue,
    prison: PrisonVue
  },
  watch: {
    async password() {
      const { data: authenticated } = await axios.post('/auth', { password: this.password })
      this.authenticated = authenticated
    }
  },
  data() {
    return {
      currentTab: 'emmerdor',
      authenticated: false,
      password: '',
    }
  }
}
</script>
<style lang="scss">
@import '~@fortawesome/fontawesome-free/css/all.min.css';

body {
  margin: none;
  background-color: #202020;
  color: white;
}
fieldset {
  position: relative;
  background-color: #303030;
  border: 0;
  margin-bottom: 20px;
  border-radius: 4px;
}
select {
  background-color: #303030;
  max-width: 150px;
  color: white;
}
fieldset legend {
  background-color: #2d2d2d;
  box-shadow: 0px 0px 5px 0px #303030;
  border-radius: 4px;
  padding: 0.5% 1%;
}
fieldset>i.fas {
  position: absolute;
  top: 0;
  right: -5px;
}
i.fas {
  background-color: white;
  color:black;
  border-radius: 50%;
  width: 20px;
  height: 20px;
  display: flex;
  justify-content: center;
  margin-right: 10px;
  align-items: center;
}
ul {
  list-style: none;
  padding: 10px;
}
body {
  margin: 0;
}
</style>
<style lang="scss" scoped>
.root {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

#tab-container{
  display: flex;
  flex-direction: column;
}
#tab-container #header {
  display: flex;
  justify-content: center;
  font-size: 1.1em;
  font-weight: bold;
}
#tab-container #header .item {
  width: 200px;
  padding: 10px;
  text-align: center;
  border-bottom: 4px solid transparent;
  box-sizing: border-box;
}
#tab-container #header .active {
  border-bottom: 4px solid white;
  transition: 300ms
}
#tab-container .separator {
  padding: 10px;
  margin: 0 10px;
}
</style>
