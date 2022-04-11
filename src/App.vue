<template>
  <div id="app">
    <Navigation :user="user" @logout="logout" />
    <router-view class="container" :user="user" />
  </div>
</template>

<script>
import Navigation from "@/components/Navigation.vue";
import Firebase from "firebase";
//import db from "./db.js";

export default {
  name: "app",
  data: function() {
    return {
      user: null
    };
  },
  methods: {
    logout: function() {
      Firebase.auth()
        .signOut()
        .then(() => {
          this.user = null;
          this.$router.push("login");
        });
    }
  },
  mounted() {
    Firebase.auth().onAuthStateChanged(user => {
      if (user) {
        this.user = user.email;
      }
    });
  },
  components: {
    Navigation
  }
};
</script>

<style lang="scss"></style>
