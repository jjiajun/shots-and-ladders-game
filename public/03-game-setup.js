// const token = localStorage.getItem("sampleAuthToken");
// if (!token) {
//   alert(`No token found! Call the police!`);
// }

/** Board UI setup */
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
          hellShots.innerText = "+1 SHOT";
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
          // start.innerText = "START";
          start.classList.add("start");
          square.innerText = "";
          square.appendChild(start);
        }
        if (boardArray[i][j] == 100) {
          // square.style.background = "rgba(196, 13, 13, 0.5)";
          square.style.background = "rgba(255, 202, 58)";
          const winDiv = document.createElement("div");
          winDiv.innerText = "🛌";
          winDiv.classList.add("win");
          square.innerText = "";
          square.appendChild(winDiv);
        }
        square.classList.add("square");
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
        square.classList.add("player-square");
        square.id = boardArray[i][j];
      }
    }
  };

  makeBoard(boardLength, board);
  makeInvisibleGrid(boardLength, invisibleGrid);

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
  rollDiceButton.id = "rollDiceButton";
  upperDiv.append(rollDiceButton);

  /** Create restart button */
  const restartButton = document.createElement("button");
  restartButton.innerText = "Start Over";
  restartButton.className = "button";
  restartButton.id = "restartButton";
  lowerDiv.append(restartButton);

  /** Create leaveGame button */
  const leaveGame = document.createElement("button");
  leaveGame.innerText = "Leave Game";
  leaveGame.className = "button";
  leaveGame.id = "leaveGame";
  lowerDiv.append(leaveGame);

  /** Create goToLobby button */
  const goToLobby = document.createElement("button");
  goToLobby.innerText = "Go To Lobby";
  goToLobby.className = "button";
  goToLobby.id = "goToLobby";
  lowerDiv.append(goToLobby);

  /** Create display div to show dice value */
  const diceValueDisplay = document.createElement("div");
  diceValueDisplay.innerText = "";
  diceValueDisplay.id = "diceResult";
  upperDiv.append(diceValueDisplay);

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
};

renderBoard();
