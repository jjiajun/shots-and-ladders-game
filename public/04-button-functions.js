$("#leaveGame").click(async () => {
  if (Object.keys(updatedGameState.players).length > 1) {
    const playerNo = localStorage.getItem("playerNo");
    const playerIndex = playersDisplayedOnBoard.indexOf(playerNo);
    playersDisplayedOnBoard.splice(playerIndex, 1);
    delete updatedGameState.players[userId];
    const gameName = updatedGameState.gameTitle;
    await axios.put("/start", { gameState: updatedGameState });
    alert(
      `You left the game. Your player data has been erased from this game room.`
    );
  } else {
    const playerNo = localStorage.getItem("playerNo");
    const playerIndex = playersDisplayedOnBoard.indexOf(playerNo);
    playersDisplayedOnBoard.splice(playerIndex, 1);
    await axios.get("/start/delete");
    alert(
      "You left the game. There are no more players in the room. The room data has been deleted."
    );
  }
  window.location.replace("./home");
});

$("#goToLobby").click(async () => {
  alert(
    "You are leaving the game room temporarily. You may enter again and continue where you left off."
  );
  window.location.replace("./home");
});

$("#restartButton").click(async () => {
  userIdArray = Object.keys(updatedGameState.players);
  for (let i = 0; i < userIdArray.length; i++) {
    updatedGameState.players[userIdArray[i]] = {
      playerPosition: 1,
    };
  }
  updatedGameState.playerTurnIndex = 1;
  await axios.put("/start", { gameState: updatedGameState });
});

$("#rollDiceButton").click(async () => {
  const token = localStorage.getItem("sampleAuthToken");
  if (!token) {
    return alert(`Please log in to play the game`);
  }

  document.getElementById("rollDiceButton").disabled = true;
  updatedGameState.playerTurnIndex += 1;

  console.log("UPDATED GAMESTATE", updatedGameState.players);
  diceValue = rollDice();
  // diceValue = 1;

  const diceResult = document.getElementById("diceResult");
  diceResult.innerHTML = diceValue;

  /** Get player's current position */
  playerCurrentPosition = updatedGameState.players[userId].playerPosition;

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

  // update updatedGameState with new position
  updatedGameState.players[userId].playerPosition = playerCurrentPosition;

  config = {
    headers: { UserID: userId },
  };
  await axios.put("/start", { gameState: updatedGameState }, config);

  climbStart = [6, 27, 60, 71, 77];
  climbEnd = [14, 54, 79, 89, 97];

  fallStart = [25, 29, 38, 58, 64, 73, 94, 98];
  fallEnd = [4, 11, 24, 22, 56, 49, , 75, 82];

  console.log("Player position before ladder/snake", playerCurrentPosition);

  if (
    climbStart.includes(playerCurrentPosition) ||
    fallStart.includes(playerCurrentPosition)
  ) {
    console.log("special move is triggered");
    moveToSpecialPositions(climbStart, climbEnd);
    moveToSpecialPositions(fallStart, fallEnd);
  }

  console.log("Player position after ladder/snake", playerCurrentPosition);

  // Update player's position after 1000ms
  setTimeout(async () => {
    updatedGameState.players[userId].playerPosition = playerCurrentPosition;
    await axios.put("/start", { gameState: updatedGameState });
  }, 1000);
});

// --> LOG OUT FUNCTION (DELETE TOKEN)
$("#logOut").click(() => {
  localStorage.removeItem("sampleAuthToken");
  window.location.replace("./home/login");
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
