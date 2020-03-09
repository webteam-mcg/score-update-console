<template>
    <div id="sidebar">
        <router-link class="routerLink" to="/"> Home</router-link>
        <router-link class="routerLink" to="/player"> Add Players</router-link>
        <router-link class="routerLink" to="/"> MCG</router-link>
        <router-link class="routerLink" to="/"> RCG</router-link>
        <router-link class="routerLink" to="/"> Scorecard</router-link>
        <router-link class="routerLink" to="/setup"> Setup</router-link>
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

    .routerLink{
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