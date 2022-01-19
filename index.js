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
