import Vue from "vue";
import VueRouter from "vue-router";
import Home from "../views/Home.vue";
import Player from "../views/Player.vue";
import Setup from "../views/Setup.vue"

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home
  },
  {
    path: "/player",
    name: "player",
    component: Player
  },
  {
    path: "/setup",
    name: "setup",
    component: Setup
  },
];

const router = new VueRouter({
  routes
});

export default router;
