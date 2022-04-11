<template>
  <div id="scorePanel">
    <h1>New Over</h1>
    <table width="50%">
      <tr>
        <td>Select new Bowler</td>
        <td>
          <select v-model="bowler">
            <option>Select Bowler</option>
            <option v-for="i in fielding" :key="i" :value="i">{{ i }}</option>
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
<style></style>
<script>
import db from "../db.js";
import firebase from "firebase";
export default {
  data: function() {
    return {
      fielding: null,
      bowler: null,
      inning: null,
      bowlerScore: null,
      bowlerBall: null,
      bowlerWickets: null,
      team: null,
      bowlersName: null,
      bowlingCardScore: null,
      bowlingCardBalls: null,
      bowlingCardWickets: null
    };
  },

  methods: {
    newBowler: function() {
      var updateOver = "";

      var nameArray = [];
      for (let [key, value] of Object.entries(this.bowlersName)) {
        nameArray.push(value);
        console.log(key);
      }

      var bowlersScore = [];
      for (let [key, value] of Object.entries(this.bowlingCardScore)) {
        bowlersScore.push(value);
        console.log(key);
      }

      var bowlersBalls = [];
      for (let [key, value] of Object.entries(this.bowlingCardBalls)) {
        bowlersBalls.push(value);
        console.log(key);
      }

      var bowlersWickets = [];
      for (let [key, value] of Object.entries(this.bowlingCardWickets)) {
        bowlersWickets.push(value);
        console.log(key);
      }

      console.log(bowlersScore, bowlersBalls, bowlersWickets);

      var index = nameArray.indexOf(this.bowler);

      if (index > -1) {
        db.collection("main")
          .doc("live")
          .update({
            "bowler.balls": bowlersBalls[index],
            "bowler.score": bowlersScore[index],
            "bowler.wickets": bowlersWickets[index],
            "bowler.name": this.bowler,
            thisOver: updateOver
          });
      } else {
        db.collection("main")
          .doc("live")
          .update({
            "bowler.balls": 0,
            "bowler.score": 0,
            "bowler.wickets": 0,
            "bowler.name": this.bowler,
            thisOver: updateOver
          });

        db.collection("bowling").add({
          timestamp: firebase.firestore.FieldValue.serverTimestamp(),
          team: this.team,
          inning: this.inning,
          name: this.bowler,
          balls: 0,
          score: 0,
          wickets: 0,
          maiden: 0
        });
      }
    }
  },
  mounted() {
    db.collection("main")
      .doc("live")
      .onSnapshot(snapshot => {
        this.team = snapshot.data().team;
        this.inning = snapshot.data().inning;

        db.collection("bowling")
          .where("inning", "==", this.inning)
          .where("team", "==", this.team)
          .get()
          .then(querrySnapshot => {
            var bowlers = [];
            var bowlersScore = [];
            var bowlersBalls = [];
            var bowlersWickets = [];
            querrySnapshot.forEach(doc => {
              bowlers.push(doc.data().name);
              bowlersScore.push(doc.data().score);
              bowlersBalls.push(doc.data().balls);
              bowlersWickets.push(doc.data().wickets);
            });
            this.bowlersName = bowlers;
            this.bowlingCardScore = bowlersScore;
            this.bowlingCardBalls = bowlersBalls;
            this.bowlingCardWickets = bowlersWickets;
          });

        db.collection("players").onSnapshot(querySnapshot => {
          var fieldingPlayers = [];
          querySnapshot.forEach(doc => {
            if (doc.data().team != this.team) {
              fieldingPlayers.push(doc.data().name);
            }
          });
          this.fielding = fieldingPlayers;
        });
      });
  }
};
</script>
