/** HELPER FUNCTIONS */
const getRandomIndex = (max) => Math.ceil(Math.random() * max);
const rollDice = () => getRandomIndex(6);
const moveToSpecialPositions = (startArray, endArray) => {
  for (i = 0; i < startArray.length; i++) {
    if (playerCurrentPosition == startArray[i]) {
      playerCurrentPosition = endArray[i];
    }
  }
};

/** Global Variables */
let playerCurrentPosition;
let destinationArray;
let userId;

let updatedGameState;
let myUserId;
let playerName;

let playerTurn;
let allPlayersPositions;
let allPlayersUserId;
let allPlayersNames;
let indexInPlayerArray;
let winner;
let tableOfAvailableGames;

const playersDisplayedOnBoard = [];

let diceValue;
const playerIcons = [
  "🐶",
  "🦄",
  "🐼",
  "🦁",
  "🐮",
  "🐷",
  "🐵",
  "🐥",
  "🐴",
  "🐻",
  "🐺",
  "🐙",
  "🐳",
  "⛄️",
];

const player1 = document.createElement("div");
player1.id = "player1";
player1.className = "player-icon";
const player2 = document.createElement("div");
player2.id = "player2";
player2.className = "player-icon";
const player3 = document.createElement("div");
player3.id = "player3";
player3.className = "player-icon";
const player4 = document.createElement("div");
player4.id = "player4";
player4.className = "player-icon";
const player5 = document.createElement("div");
player5.id = "player5";
player5.className = "player-icon";
const player6 = document.createElement("div");
player6.id = "player6";
player6.className = "player-icon";

const playerArray = [player1, player2, player3, player4, player5, player6];
