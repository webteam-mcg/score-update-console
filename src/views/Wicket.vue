<template>
  <div id="scorePanel">
    <h1>Wicket</h1>
    <table style="width: 100%;">

            <tr>
                <td>{{ player1Name }}</td>
                <td><input type="radio" v-model="currentPlayer" value="player1"></td>
                <td>{{ player2Name }}</td>
                <td><input type="radio" v-model="currentPlayer" value="player2"></td>
            </tr>
            <tr>
                <td>Wicket type</td>
                <td>
                  <select>
                    <option>Select Wicket Type</option>
                    <option>Bowled</option> //b "Bowler Name"
                    <option>Caught</option> //c "Player Name" b "Bowler Name"
                    <option>Run Out</option> // run out("Player Name")
                    <option>Stumping</option> //st "Player Name" b "Player Name"
                    <option>LBW</option> // lbw b "Bowler Name"
                  </select>
                </td>
                <td>Taken by</td>
                <td>
                  <select>
                    <option>Select Player</option>
                    <option v-for="i in fielding" :key="i" :value="i">{{i}}</option>
                  </select>
                </td>
            </tr>
            <tr>
              <td colspan="2">Select new player</td>
              <td>
                <select>
                  <option>Select Player</option>
                  <option v-for="i in batting" :key="i" :value="i">{{i}}</option>
                </select>
              </td>
            </tr>
            <tr>
              <td colspan="4"><button class="button" @click="addWicket()">Update</button></td>
            </tr>
    </table>
  </div>
</template>
<style>
tr>td {
  padding-bottom: 10px;
};
  #scorePanel{
      margin: auto;
      width: 60%;
      padding: 10px;
      float: left;
      padding-left: 250px;
  }
</style>
<script>

import db from '../db.js';
import { firestore } from 'firebase';
import firebase from 'firebase';

export default {
    name: "wicket",

    components: {

    },

    data: function() {
    return {
      player1Name:null,
      player2Name:null,
      currentPlayer:null,
      batting:null,
      fielding:null,
      team:null,
    };
  },
  methods:{
    addWicket: function(){
      
      //Update main wicket count
      db.collection('main').doc('live').update(
        {
          wickets:firebase.firestore.FieldValue.increment(1),
          'bowler.wickets':firestore.FieldValue.increment(1)
        }
      )

    }
  },
    mounted(){

      db.collection("main").doc("live")
        .onSnapshot(snapshot=>{

      //Display stricker and non-stricker name
      this.player1Name = snapshot.data().player1.name
      this.player2Name = snapshot.data().player2.name
      this.team = snapshot.data().team

      db.collection("players")
    .onSnapshot(querySnapshot=> {
        var battingPlayers = [];
        var fieldingPlayers = [];
        querySnapshot.forEach(doc=> {

          if(doc.data().team==this.team){
            battingPlayers.push(doc.data().name);
          }else{
            fieldingPlayers.push(doc.data().name);
          }
        });
        this.batting = battingPlayers,
        this.fielding = fieldingPlayers
        console.log(this.batting)
    
    });


    });



  }
}
</script>