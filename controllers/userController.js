const bcrypt = require("bcrypt");
const BaseController = require("./basecontroller");
const { PW_SALT_ROUND, JWT_SALT } = process.env;
const jwt = require("jsonwebtoken");

class UserController extends BaseController {
  constructor(name, model, db) {
    super(name, model, db);
  }

  chooseGame(req, res) {
    return res.status(200).render("choosegame");
  }

  getLogIn(req, res) {
    return res.status(200).render("login");
  }

  getSignUp(req, res) {
    return res.status(200).render("signup");
  }

  putMethod(req, res) {
    return res
      .status(200)
      .json({ success: `this is a PUT from my User Controller` });
  }

  async getUsersInfo(req, res) {
    try {
      const email = req.header("Email");
      console.log("email:", email);
      const result = await this.model.findOne({
        where: {
          email: email,
        },
      });
      const userId = result.dataValues.id;
      // const email = result.dataValues.email;
      res.cookie("userId", userId);
      res.status(200).send({ result });
    } catch (err) {
      console.log(err);
    }
  }

  getUserId(req, res) {
    try {
      const { userId } = req.cookies;
      console.log("server side user id", userId);
      res.send({ userId });
    } catch (err) {
      console.log(err);
    }
  }

  async getPlayerName(req, res) {
    try {
      const userId = req.header("UserID");
      const result = await this.model.findOne({
        where: {
          id: userId,
        },
      });
      const playerName = result.dataValues.name;
      res.status(200).send({ playerName });
    } catch (err) {
      console.log(err);
    }
  }

  async signUp(req, res) {
    console.log("sign up in progress");
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(500).json({ msg: "You are an idiot" });
    }
    const hash = await bcrypt.hash(password, Number(PW_SALT_ROUND));
    const newUser = await this.model.create({ name, email, password: hash });
    const payload = { id: newUser.id, email: newUser.email };
    const token = jwt.sign(payload, JWT_SALT, { expiresIn: "5mins" });
    console.log("sign up completed");
    return res.status(200).json({ newUser, token });
  }

  async logIn(req, res) {
    console.log("log in in progress");
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(500).json({ msg: "You are an idiot" });
    }
    const user = await this.model.findOne({ where: { email } });
    if (!user) {
      res.status(404).json({ err: "user not found" });
    }

    try {
      const compare = await bcrypt.compare(password, user.password);
      console.log(compare);

      if (compare) {
        const payload = { id: user.id, email: user.email };
        const token = jwt.sign(payload, JWT_SALT, { expiresIn: "5mins" });
        console.log("log in completed");
        return res.status(200).json({ success: true, token });
      }
    } catch (err) {
      console.log(err);
      // return res.status(401).json({ error: "wrong password" });
    }
  }
}

module.exports = UserController;
