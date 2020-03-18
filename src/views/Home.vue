<template>
    <div id="scorePanel">
        <div>
            <img src="@/assets/mcg.png" height="50px" width="auto" class="teamLogo">
            <p class="teamName">MCG</p>
            <h3 class="teamScore">100/0</h3>
        </div>
        <div style="clear: both;"></div>
        <div>
            <img src="@/assets/rcg.png" height="45px" width="auto" class="teamLogo" style="padding-right: 22px;">
            <p class="teamName">RCG</p>
            <h3 class="teamScore">0/0</h3>
        </div>
        <div style="clear: both;"></div>
        <div>
            <input type="text" placeholder="MCG won the toss and elected to bat first">
            <button class="button">Update</button>
        </div>
        <div style="clear: both;"></div>

        <div style="clear: both;padding-bottom: 25px;"></div>
        <hr>
        <div style="padding-bottom: 25px;"></div>


        <div style="padding-bottom: 25px;"></div>
        <!-- <hr>  -->
        <div style="padding-bottom: 25px;"></div>
        <table style="width: 100%;">
            <tr>
                <td colspan="2">{{ player1Name }}</td>
                <td><input type="radio" v-model="currentPlayer" value="player1"></td>
                <td colspan="2">{{ player2Name }}</td>
                <td><input type="radio" v-model="currentPlayer" value="player2"></td>
            </tr>
            <tr>
              <td colspan="7"><hr></td>
            </tr>
            <tr>
                <td><button class="score" @click="updateScore(0)">.</button></td>
                <td><button class="score" @click="updateScore(1)">1</button></td>
                <td><button class="score" @click="updateScore(2)">2</button></td>
                <td><button class="score" @click="updateScore(3)">3</button></td>
                <td><button class="score" @click="updateScore(4)">4</button></td>
                <td><button class="score" @click="updateScore(5)">5</button></td>
                <td><button class="score" @click="updateScore(6)">6</button></td>
            </tr>
            <tr>
                <td><button class="extra" @click="addExtra('wd')">WIDE</button></td>
                <td><button class="extra" @click="addExtra('nb')">NO BALL</button></td>
                <td></td>
                <td></td>
                <td></td>
                <td><router-link class="routerLink" to="/wicket"><button id="wicket">WICKET</button></router-link></td>
                <td><router-link class="routerLink" to="/over"><button class="score">END OVER</button></router-link></td>
            </tr>
        </table>
    </div>
</template>

<style>
  #scorePanel{
      margin: auto;
      width: 60%;
      padding: 10px;
      float: left;
      padding-left: 250px;
  }
  .scoreCard th {
    padding-top: 12px;
    padding-bottom: 12px;
    padding-left: 10px;
    text-align: left;
    background-color: #6c7a89;
    color: white;
  }
  .scoreCard{
      width: 100%;
  }

  .scoreCard td,  .scoreCard th {
    border: 1px solid #ddd;
    padding: 8px;
  }

    .button {
    background-color: #6c7a89; /* Green */
    border: none;
    color: white;
    padding: 15px 32px;
    text-align: center;
    text-decoration: none;
    display: inline-block;
    font-size: 16px;
    margin: 4px 2px;
    cursor: pointer;
    float: right;
  }

  input[type=text]{
    width: 80%;
    padding: 12px 20px;
    margin: 8px 0;
    display: inline-block;
    border: 1px solid #ccc;
    border-radius: 4px;
    box-sizing: border-box;
  }

    .score{
    display:block;
    height: 50px;
    width: 50px;
    border-radius: 50%;
    background-color: white;
    border: 1px solid black;
    cursor: pointer;
  }

  .extra{
    display:block;
    height: 50px;
    width: 50px;
    border-radius: 50%;
    background-color: #2e3131;
    color: white;
    border: none;
    cursor: pointer;
  }

  #wicket{
    display:block;
    height: 50px;
    width: 50px;
    border-radius: 50%;
    background-color: #f03434;
    color: white;
    border: none;
    cursor: pointer;
  }

  .teamLogo{
    float: left;
    padding-right: 15px;
}

  .teamName{
      float: left;
  }
  
  .teamScore{
      float: right;
  }

</style>

<script>
// @ is an alias to /src
import db from '../db.js';
import firebase from 'firebase';


export default {
  name: "Home",
  components: {

    },
  data: function() {
    return {
      player1Name:null,
      player2Name:null,
      currentPlayer:null,
      thisOver:null,
      isModalVisible: false,
    };
  },

  methods:{
    updateScore: function(score){

//Update main balls
      db.collection('main').doc('live').update(
        {
          balls:firebase.firestore.FieldValue.increment(1)
        }
      )

//Update main score
      db.collection('main').doc('live').update(
        {
          score:firebase.firestore.FieldValue.increment(score)
        }
      )

//Update current player details
    if (this.currentPlayer == "player1"){
            db.collection('main').doc('live').update(
              {
                'player1.score':firebase.firestore.FieldValue.increment(score),
                'player1.balls':firebase.firestore.FieldValue.increment(1)
              }
            )
      }else{
            db.collection('main').doc('live').update(
              {
                'player2.score':firebase.firestore.FieldValue.increment(score),
                'player2.balls':firebase.firestore.FieldValue.increment(1)
              }
            )
      }

//Update this over
      var uniqueBall = Date.now()+"."+score
      db.collection('main').doc('live').update(
        {
          thisOver:firebase.firestore.FieldValue.arrayUnion(uniqueBall)
        }
      )
      
    },
// Handle Wide and No ball
    addExtra: function(score){
      //Update main score
      db.collection('main').doc('live').update(
        {
          score:firebase.firestore.FieldValue.increment(1)
        }
      )

      //Update this over
      var uniqueBall = Date.now()+"."+score
      db.collection('main').doc('live').update(
        {
          thisOver:firebase.firestore.FieldValue.arrayUnion(uniqueBall)
        }
      )
    },

// End over by reseting thisOver
    endOver: function(){
      db.collection('main').doc('live').update(
        {
          thisOver:firebase.firestore.FieldValue.delete()
        }
      )
  },


  },
    mounted(){
    db.collection("main").doc("live")
    .onSnapshot(snapshot=>{

      //Display stricker and non-stricker name
      this.player1Name = snapshot.data().player1.name
      this.player2Name = snapshot.data().player2.name
      this.thisOver = snapshot.data().thisOver

    });
  }

  
};
</script>
