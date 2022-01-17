const express = require("express");
const app = express();
const path = require("path");
app.use(express.json());
app.set("view engine", "ejs");
app.use(express.static("public"));
app.set("views", path.join(__dirname, "views"));
require("dotenv").config();
const cookieParser = require("cookie-parser");
const axios = require("axios").default;

const { PORT } = process.env;

const db = require("./models/index.js");

const auth = require("./middlewares/auth")();

const userRouter = require("./routers/userRouter");
const gameRouter = require("./routers/gameRouter");

const UserController = require("./controllers/userController");
const GameController = require("./controllers/gameController");

const userController = new UserController("User", db.User, db);
const gameController = new GameController("Game", db.Game, db);

app.use(cookieParser());
app.use("/home", userRouter(userController));
app.use("/start", gameRouter(gameController, auth));

app.listen(PORT, () => console.log(`App is listening on port ${PORT}`));

// // TO CHANGE ALL SOCKETS CODE TO: MESSAGING FUNCTION
// const server = app.listen(PORT);
// const io = require("socket.io")(server);

// // const http = require('http');
// // const socketIO = require('socket.io');
// // let server = http.createServer(app);
// // let io = socketIO(server);​

// let masterGameStateObject = {};
// // let gameStateOnServer;

// io.on("connection", (socket) => {
//   console.log("a user connected");
//   // socket.emit("serverToClient", "hello, client!");
//   // socket.on("clientToServer", (data) => {
//   //   console.log(data);
//   // });
//   // socket.on("clientToClient", (data) => {
//   //   socket.broadcast.emit("serverToClient", data);
//   // });
//   // generates a unique socket.id for each connection
//   // server-side `routes` go here
//   // socket.emit('<STRING>', <DATA_OBJ>);
//   // socket.on('<STRING>', <FUNCTION>);

//   /** NO LONGER NEEDED BECAUSE CHANGED THE WAY GAME IS SETUP */
//   // socket.on("newPlayer", (userId, playerName) => {
//   //   // Step 2: identify socket.id of new player and generate new empty GameState
//   //   gameStateOnServer.players[socket.id] = {
//   //     userId: userId, // get from db
//   //     playerName: playerName, // get from db
//   //     playerPosition: 1,
//   //   };
//   //   console.log("gameStateOnServer", gameStateOnServer);
//   //   // Step 3: Send gamestate to client
//   //   socket.emit("initialGameState", gameStateOnServer);
//   // });

//   socket.on("updatedGameState", (data) => {
//     console.log(data);
//     const gameId = Object.values(data)[0];
//     const updatedGameState = Object.values(data)[1];
//     masterGameStateObject[gameId] = updatedGameState;
//   });
// });
// // Step 7: continuously emit gameStateOnServer so that all clients receive updated gameStates at any one time
// setInterval(async () => {
//   // const result = await axios.get("/start/gamestate");
//   // console.log(result);
//   io.sockets.emit("state", masterGameStateObject);
// }, 1000 / 2);
// // server.listen(PORT);
