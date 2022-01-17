const db = require("../models");
const BaseController = require("./baseController");

class GameController extends BaseController {
  constructor(name, model, db) {
    super(name, model, db);
  }

  getMethod(req, res) {
    console.log("hi dom is helping me");
    return res.status(200).render("game");
  }

  async postGameState(req, res) {
    try {
      const { gameState } = req.body;
      const userId = req.header("UserID");
      const gamePostOutput = await this.model.create({
        gameState: gameState,
      });

      console.log("GAME ID", gamePostOutput.id);
      const currentGame = await this.model.findByPk(gamePostOutput.id);
      console.log("currentGame", currentGame);
      const output = await currentGame.setUsers(userId);
      console.log(output);
      res.cookie("gameId", gamePostOutput.id);
      return res.status(200).json({
        success: `Created a new game entry in games db via ${this.name} controller`,
      });
    } catch (err) {
      return res.status(400).json({ err });
    }
  }

  async putMethod(req, res) {
    try {
      const { gameState } = req.body;
      // console.log("Cookies:", req.cookies);
      const { gameId } = req.cookies;

      const update = await this.model.update(
        {
          gameState: gameState,
        },
        {
          where: {
            id: gameId,
          },
        }
      );
      res.status(200).send("PUT successful!");
    } catch (err) {
      return res.status(400).json({ err });
    }
  }

  async getGameState(req, res) {
    try {
      const { gameId } = req.cookies;
      const result = await this.model.findOne({
        where: {
          id: gameId,
        },
      });
      res.status(200).send({ result });
    } catch (err) {
      console.log(err);
    }
  }

  async getAllGamesData(req, res) {
    try {
      const result = await this.model.findAll();
      res.status(200).send({ result });
    } catch (err) {
      console.log(err);
    }
  }

  async deleteGameState(req, res) {
    try {
      console.log("delete function is called");
      const { gameId } = req.cookies;
      const gameRecord = await this.model.findOne({
        where: {
          id: gameId,
        },
      });
      
      res.status(200).send("delete completed");
    } catch (err) {
      console.log(err);
    }
  }
}

module.exports = GameController;
