// const token = localStorage.getItem("sampleAuthToken");
// if (!token) {
//   alert(`No token found! Call the police!`);
// }

/** HELPER FUNCTIONS */
const getRandomIndex = (max) => Math.ceil(Math.random() * max);
const rollDice = () => getRandomIndex(6);

/** Global Variables */
// const playerIcon = document.createElement("div");
// playerIcon.className = "player-icon";
let playerCurrentPosition;
let destinationArray;
let userId;

/** GAME SETUP */
const boardDiv = document.getElementById("boardInner");
const board = document.createElement("table");
board.id = "board";
boardDiv.append(board);
const invisibleGrid = document.createElement("table");
invisibleGrid.id = "invisibleGrid";
boardDiv.append(invisibleGrid);
const leftPanel = document.getElementById("leftPanel");
const rightPanel = document.getElementById("rightPanel");

const boardLength = 10;
const playerIcons = [
  "🐶",
  "🐻",
  "🐼",
  "🦁",
  "🐮",
  "🐷",
  "🐵",
  "🐥",
  "🐴",
  "🦄",
  "🐺",
  "🐙",
  "🐳",
  "⛄️",
];

/** Create array of numbers for each square on the board so that we can tag each square with the relevant id number */
let boardArray = [];
for (let i = 0; i < boardLength; i += 1) {
  let row = [];
  for (let j = 0; j < boardLength; j += 1) {
    if (i % 2 == 1) {
      row.push(i * boardLength + (boardLength - j));
    } else {
      row.push(j + i * boardLength + 1);
    }
  }
  boardArray.push(row);
}
boardArray.reverse();

// Create an array of positions for truths
const truths = [8, 20, 32, 36, 41, 68, 96];
// Create an array of positions for dares
const dares = [13, 23, 46, 59, 70, 83];
// Create an array of positions for +1 shot
const hellShots = [10, 16, 21, 44, 50, 66, 80, 87, 92];
// Create an array of positions for newRule
const newRule = [26, 48, 63];
// Create an array of positions for special rule
const special = [18, 53, 76];

/** Render board and rollDice button */
const renderBoard = () => {
  const makeBoard = (boardLength, board) => {
    // j is the x axis, i is the y axis
    for (let i = 0; i < boardLength; i += 1) {
      const row = board.insertRow(i);
      row.classList.add("row");

      for (let j = 0; j < boardLength; j += 1) {
        const square = row.insertCell();
        square.innerText = boardArray[i][j];
        if (truths.includes(boardArray[i][j])) {
          // square.style.background = "rgb(255, 255, 255, 0.4)";
          square.style.background = "rgb(69, 120, 230, 0.5)";
          const truthDiv = document.createElement("div");
          truthDiv.innerText = "Truth";
          truthDiv.classList.add("truth");
          // truthDiv.style.color = "black";
          square.appendChild(truthDiv);
        }
        if (dares.includes(boardArray[i][j])) {
          // console.log(boardArray[i][j]);

          square.style.background = "rgba(0, 0, 0, 0.5)";
          const dareDiv = document.createElement("div");
          dareDiv.innerText = "Dare";
          dareDiv.classList.add("dare");
          square.appendChild(dareDiv);
        }
        if (hellShots.includes(boardArray[i][j])) {
          square.style.background = "rgb(230, 14, 14, 0.5)";
          const hellShots = document.createElement("div");
          hellShots.innerText = "+1";
          hellShots.classList.add("hellShots");
          square.appendChild(hellShots);
        }
        if (newRule.includes(boardArray[i][j])) {
          square.style.background = "rgb(97, 0, 253, 0.35)";
          const newRule = document.createElement("div");
          newRule.innerText = "New Rule";
          newRule.classList.add("newRule");
          square.appendChild(newRule);
        }
        if (special.includes(boardArray[i][j])) {
          square.style.background = "rgb(253, 122, 0, 0.5)";
          const special = document.createElement("div");
          special.innerText = "⭐️";
          special.classList.add("special");
          square.appendChild(special);
        }
        if (boardArray[i][j] == 1) {
          square.style.background = "rgba(5, 162, 55, 0.6)";
          const start = document.createElement("div");
          start.innerText = "START";
          start.classList.add("start");
          square.innerText = "";
          square.appendChild(start);
        }
        if (boardArray[i][j] == 100) {
          square.style.background = "rgba(196, 13, 13, 0.5)";
          const winDiv = document.createElement("div");
          winDiv.innerText = "Hell Shot";
          winDiv.classList.add("win");
          square.innerText = "";
          square.appendChild(winDiv);
        }
        square.classList.add("square");
        square.id = boardArray[i][j];
      }
    }
  };

  const makeInvisibleGrid = (boardLength, board) => {
    // j is the x axis, i is the y axis
    for (let i = 0; i < boardLength; i += 1) {
      const row = board.insertRow(i);
      row.classList.add("playerRow");

      for (let j = 0; j < boardLength; j += 1) {
        const square = row.insertCell();
        square.classList.add("playerSquare");
        square.id = boardArray[i][j];
      }
    }
  };

  makeBoard(boardLength, board);
  makeInvisibleGrid(boardLength, invisibleGrid);
  console.log("boardLength", boardLength);
  console.log("board", board);

  //   for (let i = 0; i < boardLength; ++i) {
  //     const row = document.createElement("div");
  //     row.className = "row";
  //     row.style.flexDirection = i % 2 === 1 ? "" : "row-reverse";
  //     row.style.background = i % 2 === 1 ? "white" : "rgb(252, 227, 148)";
  //     for (var j = 0; j < boardLength; ++j) {
  //       var square = document.createElement("div");
  //       square.className = "square";
  //       square.id = boardArray[i][j];
  //       console.log("SQUARE ID", Number(square.id) % 4);

  //       square.innerText = boardArray[i][j];
  //       row.appendChild(square);
  //       // if (Number(square.id) % 8 == 7) {
  //       //   const truthOrDare = document.createElement("div");
  //       //   truthOrDare.innerText = "TRUTH OR DARE";
  //       //   truthOrDare.className = "truthOrDare";
  //       //   square.appendChild(truthOrDare);
  //       // }
  //       // if (Number(square.id) % 7 == 6) {
  //       //   const takeAShot = document.createElement("div");
  //       //   takeAShot.innerText = "Drink Up";
  //       //   takeAShot.className = "takeAShot";
  //       //   square.appendChild(takeAShot);
  //       // }
  //     }
  //     board.appendChild(row);
  //   }
};

/** Create upperDiv and lowerDiv */
const upperDiv = document.createElement("div");
upperDiv.className = "upperDiv";
rightPanel.append(upperDiv);

const lowerDiv = document.createElement("div");
lowerDiv.className = "lowerDiv";
rightPanel.append(lowerDiv);

/** Create button to roll dice */

const rollDiceButton = document.createElement("button");
rollDiceButton.innerText = "Roll Dice";
rollDiceButton.className = "button";
upperDiv.append(rollDiceButton);

/** Create display div to show dice value */
const diceValueDisplay = document.createElement("div");
diceValueDisplay.innerText = "";
diceValueDisplay.id = "diceResult";
upperDiv.append(diceValueDisplay);

/** Create restart button */
const restartButton = document.createElement("button");
restartButton.innerText = "Start Over";
restartButton.className = "button";
lowerDiv.append(restartButton);

/** Create logout button */
const logOutButton = document.createElement("button");

logOutButton.className = "button";
logOutButton.id = "logOut";
logOutButton.innerText = "Log Out";
lowerDiv.append(logOutButton);

/** Create login button */
const logInButton = document.createElement("button");

logInButton.className = "button";
logInButton.id = "logIn";
logInButton.innerText = "Log In";
lowerDiv.append(logInButton);

/** Create signup button */
const signUpButton = document.createElement("button");

signUpButton.className = "button";
signUpButton.id = "signUp";
signUpButton.innerText = "Sign Up";
lowerDiv.append(signUpButton);

// To be modified - axios get player names, modify
restartButton.addEventListener("click", async () => {
  console.lo("SERVER GAME STATE", serverGameState);
  myUserIdArray = Object.keys(serverGameState.players);
  for (let i = 0; i < myUserIdArray.length; i++) {
    serverGameState[myUserIdArray[i]] = {
      playerPosition: 1,
    };
  }

  // const cleanGameState = {
  //   gameState: {
  //     playersNames: {
  //       player1: "Tristan",
  //       player2: "Playboy Foong",
  //     },
  //     playersPosition: {
  //       player1: "1",
  //       player2: "1",
  //     },
  //     playerShotCounter: {
  //       player1: "0",
  //       player2: "0",
  //     },
  //     winner: "",
  //   },
  // };

  // // Remove playerIcon from current position
  // destinationCell.removeChild(playerIcon);

  // // Get cell on board for player to go to
  // destinationCell = document.getElementById(1);

  // // Move player to destinationCell
  // destinationCell.appendChild(playerIcon);

  // AXIOS GET PLAYER NAMES AND MODIFY CLEAN GAME STATE TO INSERT THEIR NAMES
  await axios.put("/start", { gameState: serverGameState });
  // console.log("RESTART TEST", serverGameState);
  socket.emit("updatedGameState", updatedGameState);
});

let diceValue;
/** Add event listener to rollDice button */
rollDiceButton.addEventListener("click", async () => {
  const token = localStorage.getItem("sampleAuthToken");
  if (!token) {
    return alert(`Please log in to play the game`);
  }
  diceValue = rollDice();

  const diceResult = document.getElementById("diceResult");
  diceResult.innerHTML = diceValue;

  // get player's current position
  // const result = await axios.get("/start/gamestate");
  // console.log(result);
  // const id = result.data.result.id;
  // let latestGameState = result.data.result.gameState;
  // console.log("gameState", latestGameState);
  // playerCurrentPosition = latestGameState.playersPosition.player1;
  playerCurrentPosition = serverGameState.players[myUserId].playerPosition;

  // Tabulate new position of player (integer)
  const playerNewPosition = Number(playerCurrentPosition) + diceValue;

  console.log("current position", playerCurrentPosition);
  console.log("dice", diceValue);

  if (playerNewPosition <= boardLength ** 2) {
    playerCurrentPosition = playerNewPosition;
  } else if (playerNewPosition > boardLength ** 2) {
    playerCurrentPosition =
      boardLength ** 2 - (playerNewPosition - boardLength ** 2);
  }

  console.log("new position", playerCurrentPosition);
  // update latestGameState with new position
  // latestGameState.playersPosition.player1 = `${playerCurrentPosition}`;
  serverGameState.players[myUserId].playerPosition = playerCurrentPosition;

  const config = {
    headers: { UserID: userId },
  };
  await axios.put("/start", { gameState: serverGameState }, config);
  socket.emit("updatedGameState", serverGameState);

  // // Remove playerIcon from current position
  // destinationCell.removeChild(playerIcon);

  // // Get cell on board for player to go to
  // destinationCell = document.getElementById(playerCurrentPosition);

  // // Move player to destinationCell
  // destinationCell.appendChild(playerIcon);

  /** shots and ladders special */
  if (playerCurrentPosition == 18) {
    playerCurrentPosition = 6;
    console.log("CHANGED");
  }

  if (playerCurrentPosition == 27) {
    playerCurrentPosition = 16;
    console.log("CHANGED");
  }

  if (playerCurrentPosition == 35) {
    playerCurrentPosition = 25;
    console.log("CHANGED");
  }

  if (playerCurrentPosition == 4) {
    playerCurrentPosition = 10;
    console.log("CHANGED");
  }

  if (playerCurrentPosition == 14) {
    playerCurrentPosition = 24;
    console.log("CHANGED");
  }

  if (playerCurrentPosition == 17) {
    playerCurrentPosition = 19;
    console.log("CHANGED");
  }

  setTimeout(async () => {
    serverGameState.players[myUserId].playerPosition = playerCurrentPosition;
    await axios.put("/start", { gameState: serverGameState });
    socket.emit("updatedGameState", serverGameState);
  }, 3000);
});

renderBoard();

// const renderPlayersIcons = async () => {
//   const gameState = await axios.get("/start/gamestate");
//   console.log("gameState", gameState);
//   console.log(
//     "position keys",
//     Object.values(gameState.data.result.gameState.playersPosition)
//   );
//   const playersPositionsArray = Object.values(
//     gameState.data.result.gameState.playersPosition
//   );

//   // Get cell on board for player to go to
//   destinationCell = document.getElementById(1);
//   // Move player to destinationCell
//   destinationCell.appendChild(playerIcon);
// };

// renderPlayersIcons();

// console.log('I made it here 1')
// // post gameState information to start game
// const initialPostReq = async () => {
//   const req = await axios.post('/start', {
//     data: {
//       playersNames: {
//         player1: "Tristan",
//         player2: "Playboy Foong"
//       },
//       playersPosition: {
//         player1: "5",
//         player2: "8"
//       },
//       playerShotCounter: {
//         player1: "2",
//         player2: "4"
//       },
//       winner: "player1"
//     }
//   })
//   console.log('I made it here 2')

//   console.log(req)

// }
// initialPostReq();

// --> LOG OUT FUNCTION (DELETE TOKEN)
$("#logOut").click(() => {
  localStorage.removeItem("sampleAuthToken");
  window.location.replace("./home/login");
});

// // --> USE TOKEN FOR PUT REQUEST
$("#putButton").click(async () => {
  JsLoadingOverlay.show();
  const token = localStorage.getItem("sampleAuthToken");
  if (!token) {
    return alert(`No token found! Call the police!`);
  } else {
    const config = {
      headers: { Authorization: `Bearer ${token}` },
    };
    try {
      const result = await axios.put("/users", {}, config);
      alert(`${result.data.success}`);
      JsLoadingOverlay.hide();
    } catch (err) {
      alert(`got an error status of ${err.response.status}`);
      JsLoadingOverlay.hide();
    }
  }
});

// getEventListener for Log In
$("#logIn").click(async () => {
  try {
    window.location.replace("./home/login");
  } catch (err) {
    alert(`got an error status of ${err.response.status}`);
  }
});

// getEventListener for Sign Up
$("#signUp").click(async () => {
  try {
    window.location.replace("./home/signup");
  } catch (err) {
    alert(`got an error status of ${err.response.status}`);
  }
});

const socket = io(`http://localhost:3004`);

// socket.on("serverToClient", (data) => {
//   alert(data);
// });

// socket.emit("clientToServer", "Hello, Server");

// const HelloBtn = document.getElementById("helloButton");
// HelloBtn.addEventListener("click", () => {
//   socket.emit("clientToClient", "Hello, fellow Client");
// });

// SERIOUS SOCKETS CODING STARTS BELOW:

let serverGameState;
let myUserId;
let playerName;
// let temporarySocketID;

let playerTurn;
let allPlayersPositions;
let allPlayersUserId;
let allPlayersNames;
let winner;
let oldCell;

const player1 = document.createElement("div");
player1.id = "player1";
player1.innerText = playerIcons[0];
player1.className = "player-icon";
const player2 = document.createElement("div");
player2.id = "player2";
player1.innerText = playerIcons[1];
// player2.className = "player-icon";
const player3 = document.createElement("div");
player1.innerText = playerIcons[2];
player3.id = "player3";
// player3.className = "player-icon";
const player4 = document.createElement("div");
player1.innerText = playerIcons[3];
player4.id = "player4";
// player4.className = "player-icon";
const player5 = document.createElement("div");
player5.id = "player5";
// player5.className = "player-icon";
const player6 = document.createElement("div");
player6.id = "player6";
// player6.className = "player-icon";

const playerArray = [player1, player2, player3, player4, player5, player6];


/** START GAME WITHOUT SOCKETS */

const startSocketGame = async () => {
  // get user ID
  const userIdData = await axios.get("/home/userid");
  userId = userIdData.data.userId;
  myUserId = userId;
  // get player name
  const config = {
    headers: { UserID: myUserId },
  };
  const playerNameData = await axios.get("home/playername", config);
  playerName = playerNameData.data.playerName;
  console.log("myUserId", myUserId);
  console.log("playerName", playerName);

  // retrieve gameState from db
  const result = await axios.get("/start/gameState");
  const updatedGameState = result.data.result.gameState;

  // If userId doesnt exist in updatedGameState, create a new key-value pair for the user
  if (!updatedGameState.players[myUserId]) {
    // New player details
    updatedGameState.players[myUserId] = {
      userId: userId, // get from db
      playerName: playerName, // get from db
      playerPosition: 1,
      online: true,
    };
  }

  allPlayersPositions = Object.values(updatedGameState.players).map(
    (e) => e.playerPosition
  );

  // render each player's position according to position in gameState (player1 is the first player in gameState etc)
  for (let i = 0; i < allPlayersPositions.length; i++) {
    const destinationCell = document.getElementById(allPlayersPositions[i]);
    destinationCell.appendChild(playerArray[i]);
  }

  // get gameId from cookie
  window.getCookie = function (name) {
    var match = document.cookie.match(new RegExp("(^| )" + name + "=([^;]+)"));
    if (match) return match[2];
  };

  const gameId = window.getCookie("gameId");

  // destinationCell.appendChild(player5);
  // destinationCell.appendChild(player6);
  console.log("TESTTTTTTT", {
    gameId: gameId,
    gameState: updatedGameState,
  });
  /** Update DB with player info */
  await axios.put("/start", { gameState: updatedGameState });
  socket.emit("updatedGameState", {
    gameId: gameId,
    gameState: updatedGameState,
  });

  // add player info into gameState

  // update gameState in db

  // // Step 0: get userId + name from users table using axios.get. Create global variable called myPlayerIndex and assign userId to it

  // // Step 1: send socket.id over to server to generate new gamestate;
  // socket.emit("newPlayer", myUserId, playerName);

  // // Step 4: receive gamestate and store it in global variable in client side
  // socket.on("initialGameState", async (gameState) => {
  //   console.log("received gameState from server");
  //   // store socket.id as global var called "temporarySocketID" for easy manipulation in future
  //   const getKeyByValue = (object, value) => {
  //     return Object.keys(object).find((key) => object[key].userId === value);
  //   };
  //   temporarySocketID = getKeyByValue(gameState.players, myUserId);
  //   console.log("temporarySocketId", temporarySocketID);
  //   serverGameState = gameState;
  //   // axios.post to create new game in db
  //   console.log(
  //     "creating game entry in db using this gameState:",
  //     serverGameState
  //   );
  //   // await axios.post("/start", { gameState: serverGameState }, config);
  // });

  socket.on("state", (masterGameStateObject) => {
    // console.log(gameState);
    // temporarySocketID = Object.keys(gameState.players)[0];
    // get gameId from cookie
    window.getCookie = function (name) {
      var match = document.cookie.match(
        new RegExp("(^| )" + name + "=([^;]+)")
      );
      if (match) return match[2];
    };

    const gameId = window.getCookie("gameId");

    serverGameState = masterGameStateObject[gameId];
    playerTurn = serverGameState.playerTurn;
    // Create an array of all players' positions in the order which they appear in the serverGameState
    allPlayersPositions = Object.values(serverGameState.players).map(
      (e) => e.playerPosition
    );
    allPlayersUserId = Object.values(serverGameState.players).map(
      (e) => e.userId
    );
    allPlayersNames = Object.values(serverGameState.players).map(
      (e) => e.playerName
    );
    winner = serverGameState.winner;

    console.log(serverGameState);
    console.log(allPlayersUserId.length);

    if (allPlayersUserId.length == 1) {
      player1.style.display = "inline";
    } else if (allPlayersUserId.length == 2) {
      player1.style.display = "inline";
      player2.style.display = "inline";
    } else if (allPlayersUserId.length == 3) {
      player1.style.display = "inline";
      player2.style.display = "inline";
      player3.style.display = "inline";
    } else if (allPlayersUserId.length == 4) {
      player1.style.display = "inline";
      player2.style.display = "inline";
      player3.style.display = "inline";
      player4.style.display = "inline";
    }

    // const destinCell = document.getElementById("1");
    // destinCell.removeChild(player1);

    // Loop through all the players in the player array -> remove each player from parent element and re-render them in its new position (if theres no change, we will still go ahead with the loop)
    for (let i = 0; i < allPlayersUserId.length; i++) {
      const currentPlayer = document.getElementById(`player${i + 1}`);
      currentPlayer.parentElement.removeChild(currentPlayer);

      const destinationCell = document.getElementById(
        `${allPlayersPositions[i]}`
      );
      // console.log(allPlayersNames);

      destinationCell.appendChild(currentPlayer);
      // console.log("serverGameState", serverGameState);
    }
  });
  // - get playerTurn
  // - get ALL playerPosition
  // - get winner
  // Render the new players positions, indicate winner if there is, if playerTurn = myPlayerIndex, enable rollDice button
  // After rolling dice, disable button
};

startSocketGame();

// Step 8: continuously read the gameState sent over (socket.on("state"))
