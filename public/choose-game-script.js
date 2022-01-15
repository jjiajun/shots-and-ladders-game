$(document).ready(function () {
  let serverGameState = {
    players: {},
    playerTurn: "",
    winner: "",
  };

  // --> CREATE NEW GAME + SET GAMEID AS COOKIE
  $("#createNewGame").click(async (e) => {
    JsLoadingOverlay.show();
    e.preventDefault();
    try {
      const userIdData = await axios.get("/home/userid");
      userId = userIdData.data.userId;
      // get player name
      const config = {
        headers: { UserID: userId },
      };
      await axios.post("/start", { gameState: serverGameState }, config);
      window.location.replace("../start");
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
    try {
      const tableOfAvailableGames = document.createElement("table");
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
              cell.innerText = "Game ID";
            } else {
              cell.innerText = arrayOfGamesData[i - 1].id;
            }
          }
          if (j == 1) {
            if (i == 0) {
              cell.classList.add("header");
              cell.innerText = "Owner";
            } else {
              const userId = Object.keys(
                arrayOfGamesData[i - 1].gameState.players
              )[0];
              cell.innerText =
                arrayOfGamesData[i - 1].gameState.players[userId].playerName;
            }
          }
          if (j == 2) {
            cell.classList.add("go");
            if (i == 0) {
              cell.classList.add("header");
              cell.innerText = "";
            } else {
              cell.innerText = ">";
              cell.addEventListener("click", async () => {
                try {
                  const gameId = arrayOfGamesData[i - 1].id;
                  // const setCookie = (name, value, days) => {
                  //   var expires = "";
                  //   if (days) {
                  //     var date = new Date();
                  //     date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
                  //     expires = "; expires=" + date.toUTCString();
                  //   }
                  //   document.cookie =
                  //     "gameId" + "=" + gameId + expires + "; path=/";
                  // };
                  // setCookie();
                  document.cookie = "gameId" + "=" + gameId;
                  window.location.replace("../start");
                } catch (err) {
                  console.log(err);
                  alert(`Something went wrong when creating a new game`);
                }
              });
            }
          }
        }
      }

      document
        .getElementById("divOfAvailableGames")
        .append(tableOfAvailableGames);

      JsLoadingOverlay.hide();
    } catch (err) {
      console.log(err);
      alert(`Something went wrong when creating a new game`);
      JsLoadingOverlay.hide();
    }
  });
});
