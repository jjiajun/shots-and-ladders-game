/** INITIALIZE GAMEPLAY FOR NEW USER */

const startGame = async () => {
  /** Get userId and playerId */
  const userIdData = await axios.get("/home/userid");
  userId = userIdData.data.userId;
  // get player name
  const config = {
    headers: { UserID: userId },
  };
  const playerNameData = await axios.get("home/playername", config);
  playerName = playerNameData.data.playerName;
  localStorage.setItem("playerName", playerName);
  console.log("userId", userId);
  console.log("playerName", playerName);

  // retrieve gameState from db
  const result = await axios.get("/start/gamestate");
  updatedGameState = result.data.result.gameState;

  // Get avatarId from local storage
  const avatarId = localStorage.getItem("avatarId");

  // Get avatarId from local storage
  const gameTitle = localStorage.getItem("gameTitle");

  if (!updatedGameState.gameTitle) {
    updatedGameState.gameTitle = gameTitle;
  }

  // If userId doesnt exist in updatedGameState, create a new key-value pair for the user
  if (!updatedGameState.players[userId]) {
    let playerNo;
    if (updatedGameState.playerNos.length == 0) {
      playerNo = 1;
      updatedGameState.playerNos.push(playerNo);
    } else {
      playerNo = updatedGameState.playerNos.at(-1) + 1;
      updatedGameState.playerNos.push(playerNo);
    }
    // New player details
    updatedGameState.players[userId] = {
      userId: userId, // get from db
      playerName: playerName, // get from db
      playerPosition: 1,
      avatar: avatarId,
    };

    localStorage.setItem("playerNo", playerNo);
  }

  /** UPDATE DB with updated gameState (added player's info) */
  await axios.put("/start", { gameState: updatedGameState });

  /** Get all players' positions */
  allPlayersPositions = Object.values(updatedGameState.players).map(
    (e) => e.playerPosition
  );

  allPlayersAvatar = Object.values(updatedGameState.players).map(
    (e) => e.avatar
  );

  allPlayersUserId = Object.values(updatedGameState.players).map(
    (e) => e.userId
  );

  allPlayersNos = updatedGameState.playerNos;

  //disable button if its not player's turn
  let turnIndex;
  if (updatedGameState.playerTurnIndex % allPlayersUserId.length == 0) {
    turnIndex = allPlayersUserId.length;
  } else {
    turnIndex = updatedGameState.playerTurnIndex % allPlayersUserId.length;
  }
  if (allPlayersUserId[turnIndex - 1] !== userId) {
    document.getElementById("rollDiceButton").disabled = true;
  }

  // render each player's position according to position in gameState (player1 is the first player in gameState etc)
  for (let i = 0; i < allPlayersPositions.length; i++) {
    const player = playerArray[allPlayersNos[i] - 1];
    player.innerText = allPlayersAvatar[i];
    player.setAttribute("title", playerName);

    const destinationCell = document.getElementById(allPlayersPositions[i]);
    destinationCell.appendChild(player);
    playersDisplayedOnBoard.push(allPlayersNos[i]); // integer only
  }
};

startGame();

/** CONSTANTLY RETRIEVE UPDATED GAMESTATE AND RE-RENDER PLAYERS' POSITIONS */
setInterval(async () => {
  // retrieve gameState from db
  const result = await axios.get("/start/gamestate");

  if (!result.data.result) {
    window.location.replace("./home");
  }
  updatedGameState = result.data.result.gameState;

  // Get current player's turn (UNUSED YET)
  playerTurn = updatedGameState.playerTurnIndex;

  // Create an array of all players' positions in the order which they appear in the updatedGameState
  allPlayersPositions = Object.values(updatedGameState.players).map(
    (e) => e.playerPosition
  );
  // Create an array of all players' userId in the order which they appear in the updatedGameState
  allPlayersUserId = Object.values(updatedGameState.players).map(
    (e) => e.userId
  );

  allPlayersAvatar = Object.values(updatedGameState.players).map(
    (e) => e.avatar
  );

  // Create an array of all players' names in the order which they appear in the updatedGameState
  allPlayersNames = Object.values(updatedGameState.players).map(
    (e) => e.playerName
  );

  allPlayersNos = updatedGameState.playerNos;

  // Get winner's name if available
  winner = updatedGameState.winner;

  if (winner) {
    if (winner == localStorage.getItem("playerName")) {
      alert(
        `You won the game. You may continue to spectate or leave the room.`
      );
    } else {
      alert(`${winner} won the game. ${winner} is going to bed now.`);
    }
    updatedGameState.winner = "";
    await axios.put("/start", { gameState: updatedGameState });
  }

  console.log(updatedGameState);
  // console.log(`There are ${allPlayersUserId.length} players currently `);

  /** Reveal player icon according to number of players in gameState */
  if (allPlayersUserId.length == 1) {
    player1.style.display = "inline";
    player2.style.display = "none";
    player3.style.display = "none";
    player4.style.display = "none";
  } else if (allPlayersUserId.length == 2) {
    player1.style.display = "inline";
    player2.style.display = "inline";
    player3.style.display = "none";
    player4.style.display = "none";
  } else if (allPlayersUserId.length == 3) {
    player1.style.display = "inline";
    player2.style.display = "inline";
    player3.style.display = "inline";
    player4.style.display = "none";
  } else if (allPlayersUserId.length == 4) {
    player1.style.display = "inline";
    player2.style.display = "inline";
    player3.style.display = "inline";
    player4.style.display = "inline";
  }

  // Loop through all the players in the player array -> remove each player from parent element and re-render them in its new position (if theres no change, we will still go ahead with the loop)
  for (let i = 0; i < allPlayersUserId.length; i++) {
    if (!playersDisplayedOnBoard.includes(allPlayersNos[i])) {
      const player = playerArray[allPlayersNos[i] - 1];
      player.innerText = allPlayersAvatar[i];
      player.setAttribute("title", playerName);

      const destinationCell = document.getElementById(allPlayersPositions[i]);
      destinationCell.appendChild(player);
      console.log(`appended player${allPlayersNos[i]}`);
      playersDisplayedOnBoard.push(allPlayersNos[i]); // for local client to check who is already displayed on the board
    } else {
      // refresh page with other player's new avatar in case it wasnt updated above
      const player = playerArray[allPlayersNos[i] - 1];
      player.innerText = allPlayersAvatar[i];
      player.setAttribute("title", playerName);
      const currentPlayer = playerArray[allPlayersNos[i] - 1];
      console.log(currentPlayer);
      currentPlayer.parentElement.removeChild(currentPlayer);
      const destinationCell = document.getElementById(
        `${allPlayersPositions[i]}`
      );
      destinationCell.appendChild(currentPlayer);

      console.log(`moved ${allPlayersNos[i]}`);
    }
  }

  let turnIndex;
  if (updatedGameState.playerTurnIndex % allPlayersUserId.length == 0) {
    turnIndex = allPlayersUserId.length;
  } else {
    turnIndex = updatedGameState.playerTurnIndex % allPlayersUserId.length;
  }
  if (allPlayersUserId[turnIndex - 1] == userId) {
    document.getElementById("rollDiceButton").disabled = false;
  }
}, 300);
