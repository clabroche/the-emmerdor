<template>
  <div>
    <input v-model="password" autofocus/>
  </div>
</template>

<script>
import auth from '../services/auth'
export default {
  data() {
    return {
      password: '',
    }
  },
  watch: {
    async password() {
      this.token = await auth.login(this.password) 
      if(this.token)  {
        this.$router.push({name: 'home'})
      }
    }
  },
}
</script>

<style>

</style>