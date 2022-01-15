const express = require("express");
const router = express.Router();

module.exports = (controller, auth) => {
  router.get("/", controller.getMethod.bind(controller));
  router.post("/", controller.postGameState.bind(controller));
  router.put("/", controller.putMethod.bind(controller));
  router.get("/gamestate", controller.getGameState.bind(controller));
  router.get("/allgamesdata", controller.getAllGamesData.bind(controller));
  return router;
};
