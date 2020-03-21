<template>
  <div id="scorePanel">
    <h1>New Over</h1>
    <table width="50%">
      <tr>
    <td>Select new Bowler</td>
    <td>
          <select v-model="bowler">
              <option>Select Bowler</option>
              <option v-for="i in fielding" :key="i" :value="i">{{i}}</option>
          </select>
    </td>
      </tr>
      <tr>
        <td></td>
        <td><button class="button" @click="newBowler()">Update</button></td>
      </tr>
    </table>
  </div>
</template>
<style>

</style>
<script>

import db from '../db.js';
//import firebase from 'firebase';
export default {

    data: function() {
    return {
      fielding:null,
      bowler:null,
      inning:null,
      bowlerScore:null,
      bowlerBall:null,
      bowlerWickets:null,
      team:null,
      bowlingCard:null,
    };
  },

  methods:{
    newBowler: function(){

      var nameArray = [];
      for (let [key, value] of Object.entries(this.bowlingCard)){
        nameArray.push(value)
        console.log(key)
      }

      if (nameArray.indexOf(this.bowler)>-1){
        console.log("Wade hari")
      }else{
        //console.log(nameArray.find(this.bowler))
        console.log(nameArray)
      }
    }
  },
      mounted(){

      db.collection("main").doc("live")
        .onSnapshot(snapshot=>{

      this.team = snapshot.data().team
      this.inning = snapshot.data().inning

          db.collection('bowling').where('inning','==',this.inning).where('team','==',this.team).get().then(querrySnapshot =>{

              var bowlers = []
              querrySnapshot.forEach(doc=>{
                bowlers.push(doc.data().name)
              })
              this.bowlingCard = bowlers
          }
        )

      db.collection("players")
    .onSnapshot(querySnapshot=> {

        var fieldingPlayers = [];
        querySnapshot.forEach(doc=> {

          if(doc.data().team!=this.team){
            fieldingPlayers.push(doc.data().name);
          }
        });
        this.fielding = fieldingPlayers
    
    });
    });





  }
}
</script>
