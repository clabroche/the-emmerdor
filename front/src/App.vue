<template>
  <div class="root">
    <navbar/>
    <router-view v-if="authWorkflowDone"/>
  </div>
  
</template>
<script>
import NavbarVue from './components/Navbar.vue'
import auth from './services/auth'
export default {
  components: {
    navbar: NavbarVue,
  },
  data() {
    return {
      authWorkflowDone: false
    }
  },
  async created() {
    if(!auth.token) this.$router.push({name: 'login'})
    else {
      const tokenValid = await auth.isTokenValid() 
      if(!tokenValid) {
        this.$router.push({name: 'login'})
      }
    }
    this.authWorkflowDone = true
  }
}
</script>
<style lang="scss">
@import '~@fortawesome/fontawesome-free/css/all.min.css';
@import './assets/fonts/Jost/Jost.css';

body {
  margin: none;
  background-color: #202020;
  color: white;
  font-family: JOST, sans-serif;
  background-image: url('https://www.transparenttextures.com/patterns/black-linen-2.png');
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
  height: 100vh;
}
</style>
