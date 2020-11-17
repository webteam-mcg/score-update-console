<template>
  <div id="sidebar">
    <router-link class="routerLink" to="/" v-if="user"> Home</router-link>
    <router-link class="routerLink" to="/player" v-if="user">
      Add Players</router-link
    >
    <router-link class="routerLink" to="/setup" v-if="user"> Setup</router-link>
    <router-link class="routerLink" to="/login" v-if="!user">
      Login</router-link
    >
    <li @click="$emit('logout')" class="routerLink" v-if="user">Logout</li>
  </div>
</template>
<style>
#sidebar {
  height: 100%;
  width: 15%;
  position: fixed;
  z-index: 1;
  top: 0;
  left: 0;
  background-color: #111;
  overflow-x: hidden;
  padding-top: 16px;
  float: left;
}

.routerLink {
  padding: 6px 8px 6px 16px;
  text-decoration: none;
  font-size: 20px;
  color: #818181;
  display: block;
}

.routerLink:hover {
  color: #f1f1f1;
}
</style>
<script>
export default {
  name: "navigation",
  props: ["user"]
};
</script>
