<template>
  <div id="setup">
    <h1>Match Setup</h1>
    <hr />
    <div style="display: inline-block;">
      <button class="button" @click="inning('rcg', 2)">
        Start RCG 2<sup>nd</sup> Inning
      </button>
      <button class="button" @click="inning('rcg', 1)">
        Start RCG 1<sup>st</sup> Inning
      </button>
      <button class="button" @click="inning('mcg', 2)">
        Start MCG 2<sup>nd</sup> Inning
      </button>
      <button class="button" @click="inning('mcg', 1)">
        Start MCG 1<sup>st</sup> Inning
      </button>
    </div>
    <hr />
    <table>
      <tr>
        <td>Select player 1</td>
        <td>
          <select v-model="player1">
            <option>Player 1</option>
            <option v-for="i in batting" :key="i" :value="i">{{ i }}</option>
          </select>
        </td>
      </tr>
      <tr>
        <td>Select player 2</td>
        <td>
          <select v-model="player2">
            <option>Player 2</option>
            <option v-for="i in batting" :key="i" :value="i">{{ i }}</option>
          </select>
        </td>
      </tr>
      <tr>
        <td>Select Bowler</td>
        <td>
          <select v-model="bowler">
            <option>Bowler</option>
            <option v-for="i in fielding" :key="i" :value="i">{{ i }}</option>
          </select>
        </td>
      </tr>
    </table>

    <button class="button" @click="startMatch()">Start Match</button>
  </div>
</template>

<style>
#setup {
  margin: auto;
  width: 80%;
  padding: 10px;
  float: right;
}
</style>
<script>
import db from "../db.js";
import firebase from "firebase";

export default {
  data: function() {
    return {
      batting: null,
      fielding: null,
      player1: null,
      player2: null,
      bowler: null
    };
  },
  methods: {
    inning: function(team, inning) {
      let displayName = "";

      if (team === "mcg" && inning === 1) {
        displayName = "MCG 1st Inning";
      } else if (team === "rcg" && inning === 1) {
        displayName = "RCG 1st Inning";
      } else if (team === "mcg" && inning === 2) {
        displayName = "MCG 2nd Inning";
      } else {
        displayName = "RCG 2nd Inning";
      }

      db.collection("main")
        .doc("live")
        .set(
          {
            team: team,
            inning: inning,
            thisOver: {},
            balls: 0,
            message: "",
            day: 1, // TO-DO implement function to handle day
            score: 0,
            wickets: 0
          }
          // {
          //   merge: true
          // }
        );

      db.collection("main")
        .doc("config")
        .set(
          {
            inningOrder: firebase.firestore.FieldValue.arrayUnion({
              team: team,
              inning: inning,
              displayName: displayName
            })
          },
          {
            merge: true
          }
        );

      db.collection("innings").add({
        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
        team: team,
        inning: inning,
        score: 0,
        wickets: 0,
        balls: 0,
        extra: {
          total: 0,
          b: 0,
          lb: 0,
          nb: 0,
          wd: 0
        }
      });

      localStorage.setItem("reload", "1");
    },

    startMatch: function() {
      db.collection("main")
        .doc("live")
        .update({
          "player1.name": this.player1,
          "player1.balls": 0,
          "player1.score": 0,
          "player2.name": this.player2,
          "player2.balls": 0,
          "player2.score": 0,
          "bowler.name": this.bowler,
          "bowler.score": 0,
          "bowler.balls": 0,
          "bowler.wickets": 0,
          balls: 0,
          wickets: 0,
          score: 0,
          currentPlayer: "player1",
          thisOver: {}
        });

      db.collection("main")
        .doc("live")
        .onSnapshot(snapshot => {
          let team = snapshot.data().team;
          let inning = snapshot.data().inning;

          db.collection("batting").add({
            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
            team: team,
            inning: inning,
            name: this.player1,
            balls: 0,
            score: 0,
            four: 0,
            six: 0,
            status: "not out"
          });

          db.collection("batting").add({
            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
            team: team,
            inning: inning,
            name: this.player2,
            balls: 0,
            score: 0,
            four: 0,
            six: 0,
            status: "not out"
          });

          db.collection("bowling").add({
            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
            team: team,
            inning: inning,
            name: this.bowler,
            balls: 0,
            score: 0,
            wickets: 0,
            maiden: 0
          });
        });
    }
  },
  mounted() {
    db.collection("main")
      .doc("live")
      .onSnapshot(snapshot => {
        let team = snapshot.data().team;

        db.collection("players").onSnapshot(querySnapshot => {
          let battingPlayers = [];
          let fieldingPlayers = [];
          querySnapshot.forEach(doc => {
            if (doc.data().team === team) {
              battingPlayers.push(doc.data().name);
            } else {
              fieldingPlayers.push(doc.data().name);
            }
          });
          (this.batting = battingPlayers), (this.fielding = fieldingPlayers);
        });
      });
  }
};
</script>
