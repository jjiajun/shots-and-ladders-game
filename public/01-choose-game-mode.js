// $(document).ready(function () {
let serverGameState = {
  players: {},
  playerTurnIndex: 1,
  winner: "",
  gameTitle: "",
  playerNos: [],
};

const chooseGameTitle = document.createElement("h2");
const gameTitleDiv = document.createElement("input");

const generateRoomNaming = () => {
  // Generate title

  chooseGameTitle.innerText = "Name of your room";
  chooseGameTitle.id = "choose-game-title";
  $("#divOfAvatars").append(chooseGameTitle);

  gameTitleDiv.id = "game-title-div";
  $("#divOfAvatars").append(gameTitleDiv);
};

const generateAvatarSelection = () => {
  // Generate title
  const selectAvatarTitle = document.createElement("h2");
  selectAvatarTitle.innerText = "Select your avatar";
  selectAvatarTitle.id = "select-avatar-title";
  $("#divOfAvatars").append(selectAvatarTitle);

  // Generate Div with selection of buttons for avatars
  const avatarSelectionDiv = document.createElement("div");
  avatarSelectionDiv.id = "avatar-selection-div";
  $("#divOfAvatars").append(avatarSelectionDiv);

  for (i = 0; i < playerIcons.length; i++) {
    const avatarButton = document.createElement("button");
    avatarButton.value = playerIcons[i];
    avatarButton.innerText = playerIcons[i];
    avatarButton.classList.add("avatar-button");
    avatarButton.addEventListener("click", () => {
      localStorage.setItem("avatarId", avatarButton.value);
      localStorage.setItem("gameTitle", gameTitleDiv.value);
      console.log("avatarId", avatarButton.value);
      window.location.replace("../start");
    });
    avatarSelectionDiv.append(avatarButton);
  }
};

// --> CREATE NEW GAME + SET GAMEID AS COOKIE
$("#createNewGame").click(async (e) => {
  JsLoadingOverlay.show();
  e.preventDefault();
  document.getElementById("joinGame").style.display = "none";
  try {
    const userIdData = await axios.get("/home/userid");
    userId = userIdData.data.userId;
    // get player name
    const config = {
      headers: { UserID: userId },
    };
    await axios.post("/start", { gameState: serverGameState }, config);
    if (tableOfAvailableGames) {
      tableOfAvailableGames.style.display = "none";
    }
    generateRoomNaming();
    generateAvatarSelection();
    JsLoadingOverlay.hide();
  } catch (err) {
    console.log(err);
    alert(`Something went wrong when creating a new game`);
    JsLoadingOverlay.hide();
  }
});

// JOIN A NEW GAME: Display gameids below in a div
$("#joinGame").click(async (e) => {
  JsLoadingOverlay.show();
  e.preventDefault();
  document.getElementById("createNewGame").style.display = "none";
  const userIdData = await axios.get("/home/userid");
  userId = userIdData.data.userId;

  try {
    tableOfAvailableGames = document.createElement("table");
    tableOfAvailableGames.id = "tableOfAvailableGames";

    const result = await axios.get("/start/allgamesdata");
    console.log(result);

    const arrayOfGamesData = result.data.result;
    for (let i = 0; i < arrayOfGamesData.length + 1; i++) {
      const row = tableOfAvailableGames.insertRow(i);
      row.classList.add("row");

      for (let j = 0; j < 3; j += 1) {
        const cell = row.insertCell();
        cell.classList.add("availableGamesCell");
        if (j == 0) {
          cell.classList.add("leftCol");
          if (i == 0) {
            cell.classList.add("header");
            cell.innerText = "Room Name";
          } else {
            cell.innerText = `${arrayOfGamesData[i - 1].gameState.gameTitle} (${
              arrayOfGamesData[i - 1].id
            })`;
          }
        }
        if (j == 1) {
          if (i == 0) {
            cell.classList.add("header");
            cell.innerText = "Owner";
          } else {
            console.log(arrayOfGamesData);
            const tempUserId = Object.keys(
              arrayOfGamesData[i - 1].gameState.players
            )[0];
            console.log("temp user id", tempUserId);
            cell.innerText =
              arrayOfGamesData[i - 1].gameState.players[tempUserId].playerName;
          }
        }
        if (j == 2) {
          cell.classList.add("go");
          if (i == 0) {
            cell.classList.add("header");
            cell.innerText = "";
          } else {
            cell.innerText = "Join Room";
            cell.classList.add("default-pointer");
            cell.addEventListener("click", async () => {
              try {
                const gameId = arrayOfGamesData[i - 1].id;
                document.cookie = "gameId" + "=" + gameId;

                const result = await axios.get("/start/gamestate");
                updatedGameState = result.data.result.gameState;

                if (!updatedGameState.players[userId]) {
                  tableOfAvailableGames.style.display = "none";
                  generateAvatarSelection();
                } else {
                  window.location.replace("../start");
                }
              } catch (err) {
                console.log(err);
                alert(`Something went wrong when creating a new game`);
              }
            });
          }
        }
      }
    }

    $("#divOfAvailableGames").append(tableOfAvailableGames);
    JsLoadingOverlay.hide();
  } catch (err) {
    console.log(err);
    alert(`Something went wrong when creating a new game`);
    JsLoadingOverlay.hide();
  }
});
// });
