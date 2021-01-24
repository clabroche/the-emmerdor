<template>
  <div class="login-root">
    <div class="login-container">
      <h1>The emmerdor</h1>
      <div class="description">
        Bienvenue dans l'interface d'administration de votre bot Emmerdor. <br>
      </div>
      <input v-model="password" autofocus placeholder="Mot de passe..."/>
    </div>
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

<style lang="scss" scoped>
.login-root {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  width: 100vw;
  position: fixed;
  top: 0;
  left: 0;
  background-color: #202020;
  background-image: url('https://www.transparenttextures.com/patterns/black-linen-2.png');
  .login-container {
    font-size: 1.2em;
    width: 400px;
    background-color: white;
    color: black;
    padding: 30px;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    border-radius: 4px;
    border: 3px solid #6f7fb9;
    h1 {
      margin: 0;
      text-align: center;
      color: #6f7fb9;
    }
    .description {
      color: #333;
      text-align: center;
      font-size: 0.8em;
    }
    input {
      margin-top: 30px;
    }
  }
}
</style>