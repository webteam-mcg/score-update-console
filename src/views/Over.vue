<template>
  <div id="scorePanel">
    <h1>New Over</h1>
    <table width="50%">
      <tr>
    <td>Select new Bowler</td>
    <td>
          <select>
              <option>Select Bowler</option>
              <option v-for="i in fielding" :key="i" :value="i">{{i}}</option>
          </select>
    </td>
      </tr>
      <tr>
        <td></td>
        <td><button class="button">Update</button></td>
      </tr>
    </table>
  </div>
</template>
<style>

</style>
<script>

import db from '../db.js';
import firebase from 'firebase';
export default {

    data: function() {
    return {
      fielding:null,
    };
  },

  methods:{
    newBowler: function(){
      db.collection('main').doc('live').update(
        {
          //Fetch data from bowling card
        }
      )
    }
  },
      mounted(){

      db.collection("main").doc("live")
        .onSnapshot(snapshot=>{

      this.team = snapshot.data().team

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

          db.collection('main').doc('live').update(
        {
          thisOver:firebase.firestore.FieldValue.delete()
        }
      )


    });



  }
}
</script>
