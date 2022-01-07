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

/** GAME SETUP */
const board = document.getElementById("boardInner");
const leftPanel = document.getElementById("leftPanel");
const rightPanel = document.getElementById("rightPanel");

const boardLength = 6;

/** Create array of numbers for each square on the board so that we can tag each square with the relevant id number */
let boardArray = [];
for (let i = 0; i < 6; i += 1) {
  let row = [];
  for (let j = 0; j < 6; j += 1) {
    row.push(j + i * 6 + 1);
  }
  boardArray.push(row);
}
boardArray.reverse();
console.log(boardArray);

/** Render board and rollDice button */
const renderBoard = () => {
  for (let i = 0; i < boardLength; ++i) {
    const row = document.createElement("div");
    row.className = "row";
    row.style.flexDirection = i % 2 === 1 ? "" : "row-reverse";
    row.style.background = i % 2 === 1 ? "white" : "rgb(252, 227, 148)";
    for (var j = 0; j < boardLength; ++j) {
      var square = document.createElement("div");
      square.className = "square";
      square.id = boardArray[i][j];
      console.log("SQUARE ID", Number(square.id) % 4);

      square.innerText = boardArray[i][j];
      row.appendChild(square);
      if (Number(square.id) % 8 == 7) {
        const truthOrDare = document.createElement("div");
        truthOrDare.innerText = "TRUTH OR DARE";
        truthOrDare.className = "truthOrDare";
        square.appendChild(truthOrDare);
      }
      if (Number(square.id) % 7 == 6) {
        const takeAShot = document.createElement("div");
        takeAShot.innerText = "Drink Up";
        takeAShot.className = "takeAShot";
        square.appendChild(takeAShot);
      }
    }
    board.appendChild(row);
    showSnake = () => {
      const img = document.createElement("img");
      img.src = "/snakemini.png";
      board.appendChild(img);
    };
  }

  /** Create button to roll dice */
  const rollDiceButton = document.createElement("button");
  rollDiceButton.innerText = "Roll Dice";
  rollDiceButton.className = "btn btn-primary btn-sm btn-block button";
  rightPanel.append(rollDiceButton);

  /** Create restart button */
  const restartButton = document.createElement("button");
  restartButton.innerText = "Start Over";
  restartButton.className = "btn btn-primary btn-sm btn-block button";
  rightPanel.append(restartButton);

  /** Create logout button */
  const logOutButton = document.createElement("button");

  logOutButton.className = "btn btn-primary btn-sm btn-block button";
  logOutButton.id = "logOut";
  logOutButton.innerText = "Log Out";
  rightPanel.append(logOutButton);

  /** Create login button */
  const logInButton = document.createElement("button");

  logInButton.className = "btn btn-primary btn-sm btn-block button";
  logInButton.id = "logIn";
  logInButton.innerText = "Log In";
  rightPanel.append(logInButton);

  /** Create signup button */
  const signUpButton = document.createElement("button");

  signUpButton.className = "btn btn-primary btn-sm btn-block button";
  signUpButton.id = "signUp";
  signUpButton.innerText = "Sign Up";
  rightPanel.append(signUpButton);

  // To be modified - axios get player names, modify
  restartButton.addEventListener("click", async () => {
    temporarySocketIDArray = Object.keys(serverGameState.players);
    for (let i = 0; i < temporarySocketIDArray.length; i++) {
      serverGameState.players[temporarySocketIDArray[i]] = {
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
    const result = await axios.get("/start/gamestate");
    const updatedGameState = result.data.result.gameState;
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

    // get player's current position
    // const result = await axios.get("/start/gamestate");
    // console.log(result);
    // const id = result.data.result.id;
    // let latestGameState = result.data.result.gameState;
    // console.log("gameState", latestGameState);
    // playerCurrentPosition = latestGameState.playersPosition.player1;
    playerCurrentPosition =
      serverGameState.players[temporarySocketID].playerPosition;

    // Tabulate new position of player (integer)
    const playerNewPosition = Number(playerCurrentPosition) + diceValue;

    console.log("current position", playerCurrentPosition);
    console.log("dice", diceValue);

    if (playerNewPosition <= 36) {
      playerCurrentPosition = playerNewPosition;
    } else if (playerNewPosition > 36) {
      playerCurrentPosition = 36 - (playerNewPosition - 36);
    }

    console.log("new position", playerCurrentPosition);
    // update latestGameState with new position
    // latestGameState.playersPosition.player1 = `${playerCurrentPosition}`;
    serverGameState.players[temporarySocketID].playerPosition =
      playerCurrentPosition;

    await axios.put("/start", { gameState: serverGameState });
    const result = await axios.get("/start/gamestate");
    const updatedGameState = result.data.result.gameState;
    socket.emit("updatedGameState", updatedGameState);

    // // Remove playerIcon from current position
    // destinationCell.removeChild(playerIcon);

    // // Get cell on board for player to go to
    // destinationCell = document.getElementById(playerCurrentPosition);

    // // Move player to destinationCell
    // destinationCell.appendChild(playerIcon);

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

    console.log(
      "TEST",
      serverGameState.players[temporarySocketID].playerPosition
    );
    setTimeout(async () => {
      serverGameState.players[temporarySocketID].playerPosition =
        playerCurrentPosition;
      await axios.put("/start", { gameState: serverGameState });
      const result2 = await axios.get("/start/gamestate");
      const updatedGameState2 = result2.data.result.gameState;
      console.log(
        "settimeout activated",
        playerCurrentPosition,
        updatedGameState2.players[temporarySocketID].playerPosition
      );
      socket.emit("updatedGameState", updatedGameState2);
    }, 3000);
  });
};

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
let temporarySocketID;

let playerTurn;
let allPlayersPositions;
let allPlayersUserId;
let allPlayersNames;
let winner;
let oldCell;

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
// const player5 = document.createElement("div");
// player5.id = "player5";
// player5.className = "player-icon";
// const player6 = document.createElement("div");
// player6.id = "player6";
// player6.className = "player-icon";
// document.getElementsByClassName("player-icon").style.display = "none";

const destinationCell = document.getElementById("1");
destinationCell.appendChild(player4);
destinationCell.appendChild(player1);
destinationCell.appendChild(player2);
destinationCell.appendChild(player3);

// destinationCell.appendChild(player5);
// destinationCell.appendChild(player6);

const startSocketGame = async () => {
  // get user ID
  const userIdData = await axios.get("/home/userid");
  const userId = userIdData.data.userId;
  myUserId = userId;
  // get player name
  const config = {
    headers: { UserID: userId },
  };
  const playerNameData = await axios.get("home/playername", config);
  playerName = playerNameData.data.playerName;
  console.log("myUserId", myUserId);
  console.log("playerName", playerName);

  // Step 0: get userId + name from users table using axios.get. Create global variable called myPlayerIndex and assign userId to it

  // Step 1: send socket.id over to server to generate new gamestate;
  socket.emit("newPlayer", myUserId, playerName);

  // Step 4: receive gamestate and store it in global variable in client side
  socket.on("initialGameState", (gameState) => {
    console.log("received gameState from server");
    // store socket.id as global var called "temporarySocketID" for easy manipulation in future
    const getKeyByValue = (object, value) => {
      return Object.keys(object).find((key) => object[key].userId === value);
    };
    temporarySocketID = getKeyByValue(gameState.players, myUserId);
    console.log("temporarySocketId", temporarySocketID);
    serverGameState = gameState;
    // axios.put to update db with modified gamestate
    console.log("serverGameState", serverGameState);
  });

  socket.on("state", (gameState) => {
    // console.log(gameState);
    // temporarySocketID = Object.keys(gameState.players)[0];
    serverGameState = gameState;
    playerTurn = gameState.playerTurn;
    allPlayersPositions = Object.values(gameState.players).map(
      (e) => e.playerPosition
    );
    allPlayersUserId = Object.values(gameState.players).map((e) => e.userId);
    allPlayersNames = Object.values(gameState.players).map((e) => e.playerName);
    winner = gameState.winner;

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
