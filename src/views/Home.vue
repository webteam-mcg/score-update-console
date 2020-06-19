<template>
    <div id="scorePanel">
        <div>
            <input type="text" placeholder="Display Special Message" v-model="message">
            <button class="button" @click="updateMessage()">Update</button>
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
                <td><input type="radio" v-model="currentPlayer" value="player1" @click="livePlayer('player1')"></td>
                <td colspan="2">{{ player2Name }}</td>
                <td><input type="radio" v-model="currentPlayer" value="player2" @click="livePlayer('player2')"></td>
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
                <td><button class="extra" @click="addExtra('b')">Bye</button></td>
                <td><button class="extra" @click="addExtra('lb')">Leg Bye</button></td>
                <td>
                  <select v-model="extra">
                    <option value="0">0</option>
                    <option value="1">1</option>
                    <option value="3">2</option>
                    <option value="3">3</option>
                    <option value="4">4</option>
                    <option value="5">5</option>
                    <option value="6">6</option>
                  </select>
                </td>
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
      padding-left: 350px;
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
      inning:null,
      bowler:null,
      team:null,
      extra:null,
      message:null,
    };
  },

  methods:{

    updateMessage: function(){
      db.collection('main').doc('live').update(
        {
          message:this.message
        }
      )
    },
    updateScore: function(score){

      var fourCount = 0;
      var sixCount = 0;
      var updateOver = this.thisOver+" "+score

      if (score == 4){
        fourCount = fourCount+1
      }else if(score == 6){
        sixCount = sixCount+1
      }


//Update main balls, main score, this over
      db.collection('main').doc('live').update(
        {
          balls:firebase.firestore.FieldValue.increment(1),
          score:firebase.firestore.FieldValue.increment(score),
          'bowler.score':firebase.firestore.FieldValue.increment(score),
          'bowler.balls':firebase.firestore.FieldValue.increment(1),
          thisOver:updateOver
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

            db.collection('batting').where('inning','==',this.inning).where('name','==',this.player1Name).get().then(querrySnapshot =>{

              querrySnapshot.forEach(doc=>{

                db.collection('batting').doc(doc.id).update(
                   {
                score:firebase.firestore.FieldValue.increment(score),
                balls:firebase.firestore.FieldValue.increment(1),
                '4s':firebase.firestore.FieldValue.increment(fourCount),
                '6s':firebase.firestore.FieldValue.increment(sixCount)
                    }
                )
              }
            )
          }
        )
            
      }else{
            db.collection('main').doc('live').update(
              {
                'player2.score':firebase.firestore.FieldValue.increment(score),
                'player2.balls':firebase.firestore.FieldValue.increment(1)
              }
            )

            db.collection('batting').where('inning','==',this.inning).where('name','==',this.player2Name).get().then(querrySnapshot =>{

              querrySnapshot.forEach(doc=>{

                db.collection('batting').doc(doc.id).update(
                   {
                score:firebase.firestore.FieldValue.increment(score),
                balls:firebase.firestore.FieldValue.increment(1),
                '4s':firebase.firestore.FieldValue.increment(fourCount),
                '6s':firebase.firestore.FieldValue.increment(sixCount)
                    }
                )
              }
            )
          }
        )
      }

          db.collection('bowling').where('inning','==',this.inning).where('name','==',this.bowler).get().then(querrySnapshot =>{

              querrySnapshot.forEach(doc=>{

                db.collection('bowling').doc(doc.id).update(
                   {
                score:firebase.firestore.FieldValue.increment(score),
                balls:firebase.firestore.FieldValue.increment(1),
                    }
                )
              }
            )
          }
        )

          db.collection('innings').where('inning','==',this.inning).where('team','==',this.team).get().then(querrySnapshot =>{

              querrySnapshot.forEach(doc=>{

                db.collection('innings').doc(doc.id).update(
                   {
                score:firebase.firestore.FieldValue.increment(score),
                balls:firebase.firestore.FieldValue.increment(1),
                    }
                )
              }
            )
          }
        )
      
    },
// Handle Wide and No ball
    addExtra: function(type){

      var updateOver = this.thisOver+" "+type

      var extraType = "extra."+type;
      var score = parseInt(this.extra);
      //Update main score
      db.collection('main').doc('live').update(
        {
          score:firebase.firestore.FieldValue.increment(1),
          thisOver:updateOver
        }
      )

      db.collection('innings').where('inning','==',this.inning).where('team','==',this.team).get().then(querrySnapshot =>{

              querrySnapshot.forEach(doc=>{

                db.collection('innings').doc(doc.id).update(
                   {
                score:firebase.firestore.FieldValue.increment(score),
                'extra.total':firebase.firestore.FieldValue.increment(score),
                [extraType]:firebase.firestore.FieldValue.increment(score),

                    }
                )
              }
            )
          }
        )

      if (type == "nb" && type == "wd"){

          db.collection('bowling').where('inning','==',this.inning).where('name','==',this.bowler).get().then(querrySnapshot =>{

              querrySnapshot.forEach(doc=>{

                db.collection('bowling').doc(doc.id).update(
                   {
                score:firebase.firestore.FieldValue.increment(score),
                    }
                )
              }
            )
          }
        )
        
      db.collection('main').doc('live').update(
        {
          'bowler.score':firebase.firestore.FieldValue.increment(score),
        }
      )
      }

    },

    //Update current player
    livePlayer: function(player){

      db.collection('main').doc('live').update(
        {
          'currentPlayer': player
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
      this.thisOver = snapshot.data().thisOver
      this.inning = snapshot.data().inning
      this.bowler = snapshot.data().bowler.name
      this.team = snapshot.data().team
      this.thisOver = snapshot.data().thisOver
    });
  }

  
};
</script>
