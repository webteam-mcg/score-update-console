<template>
  <div id="scorePanel">
    <h1>Wicket</h1>
    <table style="width: 100%;">

            <tr>
                <td>{{ player1Name }}</td>
                <td><input type="radio" v-model="currentPlayer" value="player1" ></td>
                <td>{{ player2Name }}</td>
                <td><input type="radio" v-model="currentPlayer" value="player2"></td>
            </tr>
            <tr>
                <td>Wicket type</td>
                <td>
                  <select v-model="type">
                    <option>Select Wicket Type</option>
                    <option value="b">Bowled</option> //b "Bowler Name"
                    <option value="c">Caught</option> //c "Player Name" b "Bowler Name"
                    <option value="run">Run Out</option> // run out("Player Name")
                    <option value="st">Stumping</option> //st "Player Name" b "Player Name"
                    <option value="lbw">LBW</option> // lbw b "Bowler Name"
                  </select>
                </td>
                <td>Taken by</td>
                <td>
                  <select v-model="taken">
                    <option>Select Player</option>
                    <option v-for="i in fielding" :key="i" :value="i">{{i}}</option>
                  </select>
                </td>
            </tr>
            <tr>
              <td colspan="2">Select new player</td>
              <td>
                <select v-model="newPlayer">
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
      currentPlayer:null,
      batting:null,
      fielding:null,
      team:null,
      newPlayer:null,
      player1Name:null,
      player2Name:null,
      inning:null,
      bowler:null,
      type:null,
      taken:null,
      thisOver:null
    };
  },
  methods:{
    addWicket: function(){

      var status = null;
      var stricker = null;
      var updateOver = this.thisOver+" W"

      if(this.type=="b"){
        status = "b "+this.bowler
      }else if(this.type=="c"){
        status = "c "+this.taken+" b "+this.bowler
      }else if(this.type=="run"){
        status = "run out("+this.taken+")"
      }else if(this.type=="st"){
        status = "st "+this.taken+" b "+this.bowler
      }else if(this.type=="lbw"){
        status = "lbw b "+this.bowler
      }


      if(this.currentPlayer == "player1"){
        stricker = this.player1Name
        db.collection('main').doc('live').update(
          {
            'player1.name': this.newPlayer,
            'player1.balls':0,
            'player1.score':0,
          }
        )
      }else{
        stricker = this.player2Name
        db.collection('main').doc('live').update(
          {
            'player2.name': this.newPlayer,
            'player2.balls':0,
            'player2.score':0
          }
        )
      }

      db.collection("batting").add({
                    timestamp:firebase.firestore.FieldValue.serverTimestamp(),
                    team:this.team,
                    inning:this.inning,
                    name:this.newPlayer,
                    balls:0,
                    score:0,
                    '4s':0,
                    '6s':0,
                    status:'not out'
                })
      
      //Update main wicket count
      db.collection('main').doc('live').update(
        {
          wickets:firebase.firestore.FieldValue.increment(1),
          'bowler.wickets':firestore.FieldValue.increment(1),
          balls:firestore.FieldValue.increment(1),
          'thisOver':updateOver
        }
      )

            db.collection('innings').where('inning','==',this.inning).where('team','==',this.team).get().then(querrySnapshot =>{

              querrySnapshot.forEach(doc=>{

                db.collection('innings').doc(doc.id).update(
                   {
                wickets:firebase.firestore.FieldValue.increment(1),
                balls:firebase.firestore.FieldValue.increment(1),
                    }
                )
              }
            )
          }
        )

        db.collection('bowling').where('inning','==',this.inning).where('name','==',this.bowler).get().then(querrySnapshot =>{

              querrySnapshot.forEach(doc=>{

                db.collection('bowling').doc(doc.id).update(
                   {
                wickets:firebase.firestore.FieldValue.increment(1),
                balls:firebase.firestore.FieldValue.increment(1),
                    }
                )
              }
            )
          }
        )

        db.collection('batting').where('inning','==',this.inning).where('name','==',stricker).get().then(querrySnapshot =>{

              querrySnapshot.forEach(doc=>{

                db.collection('batting').doc(doc.id).update(
                   {
                status:status,
                    }
                )
              }
            )
          }
        )

      //Redirect to Home page
      //window.location.href = '/'

    }
  },
    mounted(){

      db.collection("main").doc("live")
        .onSnapshot(snapshot=>{

      //Display stricker and non-stricker name
      this.player1Name = snapshot.data().player1.name
      this.player2Name = snapshot.data().player2.name
      this.team = snapshot.data().team
      this.inning = snapshot.data().inning
      this.bowler = snapshot.data().bowler
      this.thisOver = snapshot.data().thisOver

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
    
    });


    });



  }
}
</script>