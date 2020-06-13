<template>
  <div id="scorePanel">
    <h1>Login</h1>
    <table width="50%">
      <tr>
    <td>Email</td>
    <td>
      <input type="email" v-model="email">
    </td>
      </tr><tr>
        <td>Password</td>
    <td>
      <input type="password" v-model="password">
    </td>
      </tr>
      <tr>
        <td></td>
        <td><button class="button" @click="login()">Login</button></td>
      </tr>
      <tr>
        <td colspan="2">{{error}}</td>
      </tr>
    </table>
  </div>
</template>

<style>

</style>

<script>

//import db from '../db.js';
import Firebase from 'firebase';
export default {

    data: function() {
    return {
      email: '',
      password: '',
      error: ''
    };
  },

  methods:{

    login: function(){
      const info = {
        email: this.email,
        password: this.password
      }

      Firebase.auth()
        .signInWithEmailAndPassword(info.email, info.password)
        .then(
          ()=>{
            this.$router.push('/')
          }, error =>{
            this.error = error.message;
          }
        )
    }
  },
}
</script>