const express = require("express");
const router = express.Router();

module.exports = (controller, auth) => {
  router.get("/", controller.getMethod.bind(controller));
  router.post("/", controller.postMethod.bind(controller));
  router.put("/", controller.putMethod.bind(controller));
  router.get("/gamestate", controller.getGameState.bind(controller));
  return router;
};
