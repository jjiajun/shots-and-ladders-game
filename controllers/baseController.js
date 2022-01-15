class BaseController {
  constructor(name, model, db) {
    this.name = name
    this.model = model
    this.db = db
  }
}

module.exports = BaseController