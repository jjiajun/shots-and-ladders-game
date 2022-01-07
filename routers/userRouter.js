const express = require("express");
const router = express.Router();

module.exports = (controller) => {
  router.get("/login", controller.getLogIn.bind(controller));
  router.get("/signup", controller.getSignUp.bind(controller));
  router.post("/login", controller.logIn.bind(controller));
  router.post("/signup", controller.signUp.bind(controller));
  router.put("/", controller.putMethod.bind(controller));
  router.get("/", controller.welcome.bind(controller));
  router.get("/usersinfo", controller.getUsersInfo.bind(controller));
  router.get("/userid", controller.getUserId.bind(controller));
  router.get("/playername", controller.getPlayerName.bind(controller));
  return router;
};
