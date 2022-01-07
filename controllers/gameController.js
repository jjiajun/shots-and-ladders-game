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

  async postMethod(req, res) {
    try {
      const { data } = req.body;
      const output = await this.model.create({
        gameState: data,
      });
      return res.status(200).json({
        success: `This is my POST function in my ${this.name} controller`,
        output,
      });
    } catch (err) {
      return res.status(400).json({ err });
    }
  }

  async putMethod(req, res) {
    try {
      const { gameState } = req.body;
      const update = await this.model.update(
        {
          gameState: gameState,
        },
        {
          where: {
            id: 2,
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
      const result = await this.model.findOne({
        where: {
          id: 2,
        },
      });
      res.status(200).send({ result });
    } catch (err) {
      console.log(err);
    }
  }
}

module.exports = GameController;
