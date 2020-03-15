<template>
      <div id="setup">
          <h1>Match Setup</h1>
          <hr>
        <div style="display: inline-block;">
            <button class="button" @click="inning('rcg',2)">Start RCG 2<sup>nd</sup> Inning</button>
            <button class="button" @click="inning('rcg',1)">Start RCG 1<sup>st</sup> Inning</button>
            <button class="button" @click="inning('mcg',2)">Start MCG 2<sup>nd</sup> Inning</button>
            <button class="button" @click="inning('mcg',1)">Start MCG 1<sup>st</sup> Inning</button>
        </div>
                  <hr>
        <table>
            <tr>
                <td>Select player 1</td>
                <td>
                    <select>
                        <option>Player 1</option>
                        <option v-for="i in batting" :key="i" :value="i">{{i}}</option>
                    </select>
                </td>
            </tr>
            <tr>
                <td>Select player 2</td>
                <td>
                    <select>
                        <option>Player 2</option>
                        <option v-for="i in batting" :key="i" :value="i">{{i}}</option>
                    </select>
                </td>
            </tr>
            <tr>
                <td>Select Bowler</td>
                <td>
                    <select>
                        <option>Bowler</option>
                        <option v-for="i in fielding" :key="i" :value="i">{{i}}</option>
                    </select>
                </td>
            </tr>
        </table>
    <button class="button">Start Match</button>
      </div>
</template>

<style>

  #setup{
    margin: auto;
    width: 80%;
    padding: 10px;
    float: right;
}
</style>
<script>

import db from '../db.js';
export default {
    data:function(){
        return{
            batting:null,
            fielding:null,
        }
    },
methods:{
    inning: function(team,inning){

        db.collection('main').doc('live').update(
            {
                team:team,
                inning:inning
            }
        )
        
    }
},
    mounted(){

      db.collection("main").doc("live")
        .onSnapshot(snapshot=>{

      var team = snapshot.data().team

      db.collection("players")
    .onSnapshot(querySnapshot=> {
        var battingPlayers = [];
        var fieldingPlayers = [];
        querySnapshot.forEach(doc=> {

          if(doc.data().team==team){
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