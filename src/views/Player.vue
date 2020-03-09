<template>
    <div id="addPlayer">
        <h1>Add Player</h1>
        <hr>
        <input type="text" placeholder="Enter player name" id="playerName" v-model="playerName" @keyup.enter="addPlayer">
        <select v-model="team" id="selectTeam" @keyup.enter="addPlayer">
            <option>SELECT TEAM</option>
            <option value="mcg">MCG</option>
            <option value="rcg">RCG</option>
        </select>
        <input type="checkbox" value="C" v-model="c" @keyup.enter="addPlayer"><span> Captain</span>
        <input type="checkbox" value="W" v-model="w" @keyup.enter="addPlayer"><span> Wicket Keeper</span>
        <button class="button" @click="newPlayer">ADD</button>
    </div>
</template>

<style>
  #addPlayer{
    margin: auto;
    width: 84%;
    padding: 10px;
    float: right;
}

  #playerName{
      width: 50%;
      padding: 12px 20px;
      margin: 8px 0;
      display: inline-block;
      border: 1px solid #ccc;
      border-radius: 4px;
      box-sizing: border-box;
  }
</style>

<script>

import db from '../db.js';

export default {
  name: "players",
  data: function() {
    return {
      playerName: null,
      team: null,
      w: false,
      c: false,
    };
  },
  methods: {

    addPlayer: function(){
      db.collection('players').add(
        {
          name:this.playerName,
          team:this.team,
          w:this.w,
          c:this.c
          }
          );
      this.playerName = "";
    },

        newPlayer: function(){
      db.collection('main').doc('live').update(
        {
          player1:{name:"Kushan Shamika",score:1,balls:0}
          }
          );
      this.playerName = "";
    },


  }
};
</script>