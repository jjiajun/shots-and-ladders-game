class BaseController {
  constructor(name, model, db) {
    this.name = name
    this.model = model
    this.db = db
  }

  // async postMethod (req, res) {
  //   try {
  //     const { data } = req.body
  //     const output = await this.model.create({ ...thisdata })
  //     return res.status(200).json({success: `This is my POST function in my ${this.name} controller`, output})
  //   } 
  //   catch (err) {
  //     return res.status(400).json({err})
  //   }
  // }
}

module.exports = BaseController