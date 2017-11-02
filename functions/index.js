const functions = require("firebase-functions");
const express = require("express");
const { isAuthenticated, isVaildMove } = require("./verifier");
const { setGameState, createGame, joinGame } = require("./game");

// Create and Deploy Your First Cloud Functions
// https://firebase.google.com/docs/functions/write-firebase-functions
const app = express();

app.put("/setMove", (req, res) => {
  const params = req.body;
    isAuthenticated(params.token)
      .then(userId => isVaildMove(params.gameState, userId))
      .then(gameSate => setGameState(gameSate))
      .catch(err => res.send(err));
});

app.post("/createGame", (req, res) => {
  const params = req.body;
  isAuthenticated(params.token)
    .then(userId => createGame(params.gameName, userId))
    .then(gameId => res.send(gameId))
    .catch(err => res.send(err));
});

app.put("/joinGame", (req, res) => {
  const params = req.body;
  isAuthenticated(params.token)
  .then(userId => joinGame(params.gameId, userId))
  .then(gameId => res.send(gameId))
  .catch(err => res.send(err));
});
app.all("**", (req, res) => {
  res.sendStatus(404);
});

exports.api = functions.https.onRequest(app);